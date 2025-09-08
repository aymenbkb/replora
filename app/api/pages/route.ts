import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  const userId = session?.userId;
  
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const user = await db.user.findUnique({ 
    where: { clerkId: userId } 
  });

  if (!user) {
    return new Response("User not found", { status: 404 });
  }

  const pages = await db.page.findMany({ where: { userId: user.id } });
  return NextResponse.json({ pages });
}
