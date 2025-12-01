import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth.config"
import { prisma } from "@/lib/prisma"

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()
    const { name } = data

    // Update user
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name || null,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Admin profile update error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to update profile" },
      { status: 500 }
    )
  }
}


