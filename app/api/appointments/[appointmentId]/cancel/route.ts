import { auth } from "@/auth.config"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ appointmentId: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { appointmentId } = await params

    const appointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: "CANCELLED" },
    })

    return NextResponse.json(appointment)
  } catch (error: any) {
    console.error("Error cancelling appointment:", error)
    return new NextResponse(error.message || "Failed to cancel appointment", { status: 500 })
  }
}
