import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { db } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET
  if (!WEBHOOK_SECRET) {
    return new Response('Missing CLERK_WEBHOOK_SECRET', { status: 500 })
  }

  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('No svix headers', { status: 400 })
  }

  const payload = await req.json()
  const body = JSON.stringify(payload)

  let evt: WebhookEvent
  try {
    const wh = new Webhook(WEBHOOK_SECRET)
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Webhook verify failed', err)
    return new Response('Invalid signature', { status: 400 })
  }

  const eventType = evt.type

  try {
    if (eventType === 'user.created' || eventType === 'user.updated') {
      const { id, email_addresses, first_name, last_name } = evt.data as any
      const profile_image_url = (evt.data as any).profile_image_url as string | undefined
      const email = email_addresses?.[0]?.email_address as string | undefined

      await db.user.upsert({
        where: { clerkId: id },
        update: {
          email,
          firstName: first_name ?? null,
          lastName: last_name ?? null,
          profileImage: profile_image_url ?? null,
          lastSignInAt: new Date(),
        },
        create: {
          clerkId: id,
          email,
          firstName: first_name ?? null,
          lastName: last_name ?? null,
          profileImage: profile_image_url ?? null,
          role: 'USER',
          lastSignInAt: new Date(),
        },
      })
    }

    if (eventType === 'user.deleted') {
      const { id } = evt.data
      await db.user.updateMany({
        where: { clerkId: id },
        data: { deletedAt: new Date() },
      })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error(`Webhook ${eventType} error:`, error)
    return new Response('Server error', { status: 500 })
  }
}
