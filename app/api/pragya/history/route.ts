import { NextResponse } from "next/server"
import { auth } from "@/auth.config"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Fetch the last 100 messages for the user, ordered by creation time
    const messages = await prisma.pragyaChatMessage.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "asc" },
      take: 100 // We can adjust this limit as needed
    })

    return NextResponse.json({ messages })
  } catch (error) {
    console.error("Failed to fetch chat history:", error)
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 })
  }
}
