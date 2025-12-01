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
    const { doctorId, appointmentDate, reason } = data

    // Find patient profile from user ID
    const patient = await prisma.patient.findUnique({
      where: { userId: session.user.id },
    })

    if (!patient) {
      return NextResponse.json({ error: "Patient profile not found. Please complete your profile." }, { status: 404 })
    }

    // Verify doctor exists and is approved
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
      include: {
        availability: true,
      },
    })

    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 })
    }

    if (doctor.status !== "APPROVED") {
      return NextResponse.json({ error: "Doctor is not available for booking" }, { status: 400 })
    }

    if (!doctor.availability?.isAvailable) {
      return NextResponse.json({ error: "Doctor is not accepting appointments" }, { status: 400 })
    }

    // Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        patientId: patient.id,
        doctorId: doctorId,
        appointmentDate: new Date(appointmentDate),
        status: "PENDING",
        paymentStatus: "PENDING",
      },
    })

    return NextResponse.json({ 
      success: true,
      appointmentId: appointment.id,
      appointment 
    })
  } catch (error: any) {
    console.error("Error booking appointment:", error)
    return NextResponse.json(
      { error: error.message || "Failed to book appointment" },
      { status: 500 }
    )
  }
}
