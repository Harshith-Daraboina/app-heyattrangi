import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth.config"
import { prisma } from "@/lib/prisma"
import { createRazorpayOrder, calculatePlatformFee } from "@/lib/payments"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ appointmentId: string }> | { appointmentId: string } }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Handle params (Next.js 16 compatibility)
    const resolvedParams = await (params instanceof Promise ? params : Promise.resolve(params))
    const appointmentId = resolvedParams.appointmentId

    if (!appointmentId) {
      return NextResponse.json({ error: "Appointment ID is required" }, { status: 400 })
    }

    // Fetch appointment
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        doctor: true,
        patient: {
          include: {
            user: true,
          },
        },
      },
    })

    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 })
    }

    // Verify the appointment belongs to the current user
    if (!appointment.patient || appointment.patient.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Check if payment is already completed
    if (appointment.paymentStatus === "PAID") {
      return NextResponse.json({ error: "Payment already completed" }, { status: 400 })
    }

    const consultationFee = appointment.doctor.consultationFee
    const { platformFee, doctorAmount } = calculatePlatformFee(consultationFee)

    // Create Razorpay Order
    const order = await createRazorpayOrder({
      amount: consultationFee,
      appointmentId,
      doctorId: appointment.doctorId,
      patientId: appointment.patientId || "",
      razorpayAccountId: appointment.doctor.razorpayAccountId
    })

    // Upsert payment record to store the order ID
    await prisma.payment.upsert({
      where: { appointmentId },
      create: {
        appointmentId,
        amount: consultationFee,
        platformFee,
        doctorAmount,
        razorpayOrderId: order.id,
        status: "PENDING",
      },
      update: {
        razorpayOrderId: order.id,
        amount: consultationFee,
        platformFee,
        doctorAmount,
      },
    })

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    })
  } catch (error: any) {
    console.error("Error creating appointment payment order:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create payment order" },
      { status: 500 }
    )
  }
}
