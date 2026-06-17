import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth.config"
import { prisma } from "@/lib/prisma"
import { verifyRazorpaySignature } from "@/lib/payments"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, credits, packName } = data

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

    // Wrap the next steps in a transaction
    await prisma.$transaction(async (tx) => {
      // 1. Record the transaction
      await tx.transaction.create({
        data: {
          userId: session.user.id,
          type: "CREDIT_TOPUP",
          amount: parseFloat(amount),
          status: "SUCCESS",
          description: `${packName} Top-up (${credits} Credits)`,
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
        }
      })

      // 2. Fetch or create patient to get patientId
      let patient = await tx.patient.findUnique({
        where: { userId: session.user.id }
      })

      if (!patient) {
        patient = await tx.patient.create({
          data: {
            userId: session.user.id,
          }
        })
      }

      // 3. Update or create CareCreditWallet
      const wallet = await tx.careCreditWallet.findUnique({
        where: { patientId: patient.id }
      })

      if (wallet) {
        await tx.careCreditWallet.update({
          where: { id: wallet.id },
          data: { totalCredits: wallet.totalCredits + parseInt(credits) }
        })
      } else {
        await tx.careCreditWallet.create({
          data: {
            patientId: patient.id,
            totalCredits: parseInt(credits)
          }
        })
      }

      // 4. Log the credit
      await tx.creditLog.create({
        data: {
          patientId: patient.id,
          actionType: `topup_${packName.toLowerCase()}`,
          creditsAwarded: parseInt(credits),
        }
      })
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 }
    )
  }
}
