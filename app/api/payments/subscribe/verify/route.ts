import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth.config"
import { prisma } from "@/lib/prisma"
import { verifyRazorpaySignature } from "@/lib/payments"
import { PlanType } from "@prisma/client"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan, amount } = data

    // Verify signature
    const isValid = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    )

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      )
    }

    // Update user plan and record the transaction in a database transaction
    await prisma.$transaction(async (tx) => {
      // 1. Update user plan
      await tx.user.update({
        where: { id: session.user.id },
        data: {
          plan: plan as PlanType,
        },
      })

      // 2. Record the transaction
      await tx.transaction.create({
        data: {
          userId: session.user.id,
          type: "SUBSCRIPTION",
          amount: parseFloat(amount),
          status: "SUCCESS",
          description: `Subscription Upgrade to ${plan}`,
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
        }
      })
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Subscription payment verification error:", error)
    return NextResponse.json(
      { error: "Failed to verify subscription payment" },
      { status: 500 }
    )
  }
}
