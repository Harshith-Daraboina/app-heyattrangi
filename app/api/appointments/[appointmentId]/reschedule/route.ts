import { NextResponse } from "next/server"
import { auth } from "@/auth.config"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ appointmentId: string }> | { appointmentId: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const resolvedParams = await (params instanceof Promise ? params : Promise.resolve(params))
    const appointmentId = resolvedParams.appointmentId

    const body = await request.json()
    const { newDate } = body

    if (!newDate) {
      return NextResponse.json({ error: "New date is required" }, { status: 400 })
    }

    // Verify appointment ownership
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        patient: {
          select: { userId: true }
        }
      }
    })

    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 })
    }

    if (appointment.patient?.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Update appointment
    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        appointmentDate: new Date(newDate),
        status: "CONFIRMED", // Reset to confirmed if it was pending or something
      },
    })

    return NextResponse.json({ success: true, appointment: updatedAppointment })
  } catch (error) {
    console.error("Error rescheduling appointment:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
