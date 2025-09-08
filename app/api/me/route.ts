import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await auth()
  const userId = session?.userId
  
  if (!userId) return new Response('Unauthorized', { status: 401 })

  const me = await db.user.findUnique({ where: { clerkId: userId } })
  
  if (!me) {
    return new Response('User not found', { status: 404 })
  }

  return NextResponse.json(me)
}
