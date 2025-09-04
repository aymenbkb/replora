import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const { userId } = auth()
  if (!userId) return new Response('Unauthorized', { status: 401 })

  const me = await db.user.findUnique({ where: { clerkId: userId } })
  return NextResponse.json({ me })
}
