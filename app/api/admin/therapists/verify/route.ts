import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth.config"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    
    // Ensure caller is an admin
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { doctorId, action, notes } = body // action: "APPROVE" or "REJECT"

    if (!doctorId || !action) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId }
    })

    if (!doctor) {
      return NextResponse.json({ error: "Therapist not found" }, { status: 404 })
    }

    if (doctor.status !== "PENDING_REVIEW") {
      return NextResponse.json({ error: "Therapist is not pending review" }, { status: 400 })
    }

    let updatedStatus = "PENDING_REVIEW"
    if (action === "APPROVE") {
      updatedStatus = "VERIFIED"
    } else if (action === "REJECT") {
      updatedStatus = "REJECTED"
    }

    const updated = await prisma.doctor.update({
      where: { id: doctorId },
      data: {
        status: updatedStatus as any, // Cast because we know it exists in enum
        licenseVerified: action === "APPROVE",
      }
    })

    // In a real system, you might send an email to the therapist here to notify them
    // of approval or rejection.

    return NextResponse.json({ 
      success: true, 
      message: `Therapist ${action === 'APPROVE' ? 'verified' : 'rejected'} successfully.`,
      doctor: updated
    })

  } catch (error: any) {
    console.error("Error verifying therapist:", error)
    return NextResponse.json(
      { error: error.message || "Failed to process verification" },
      { status: 500 }
    )
  }
}
