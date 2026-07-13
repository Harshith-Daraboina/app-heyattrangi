import { NextResponse } from "next/server"
import { auth } from "@/auth.config"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "DOCTOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const doctor = await prisma.doctor.findUnique({
      where: { userId: session.user.id }
    })

    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 })
    }

    const data = await req.json()
    const { availableDays, startTime, endTime, isAvailable, breaks, appointmentDuration, slotBuffer } = data

    const availability = await prisma.doctorAvailability.upsert({
      where: { doctorId: doctor.id },
      create: {
        doctorId: doctor.id,
        availableDays: availableDays || [],
        startTime: startTime || "09:00",
        endTime: endTime || "17:00",
        isAvailable: isAvailable ?? true,
        breaks: breaks || []
      },
      update: {
        availableDays,
        startTime,
        endTime,
        isAvailable,
        breaks
      }
    })

    // Update appointment duration and slot buffer on the Doctor model
    await prisma.doctor.update({
      where: { id: doctor.id },
      data: {
        appointmentDuration: parseInt(appointmentDuration) || 45,
        slotBuffer: parseInt(slotBuffer) || 15
      }
    })

    return NextResponse.json({ success: true, availability })
  } catch (error) {
    console.error("Error updating availability:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
