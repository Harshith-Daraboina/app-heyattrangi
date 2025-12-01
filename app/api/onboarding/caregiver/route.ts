import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth.config"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()
    const { relationship, patientId } = data

    // Update user role
    await prisma.user.update({
      where: { id: session.user.id },
      data: { role: "CAREGIVER" },
    })

    // Create caregiver profile
    await prisma.caregiver.create({
      data: {
        userId: session.user.id,
        relationship,
        patientId: patientId || null,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Caregiver onboarding error:", error)
    return NextResponse.json(
      { error: "Failed to complete onboarding" },
      { status: 500 }
    )
  }
}

