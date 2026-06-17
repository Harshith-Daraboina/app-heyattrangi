import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth.config"
import { createGenericRazorpayOrder } from "@/lib/payments"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { amount, credits, packName } = await req.json()

    if (!amount || !credits || !packName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const shortUserId = session.user.id.slice(-6)
    const receiptId = `tu_${shortUserId}_${Date.now()}`
    const notes = {
      userId: session.user.id,
      type: "CREDIT_TOPUP",
      credits: credits.toString(),
      packName
    }

    const order = await createGenericRazorpayOrder(amount, receiptId, notes)

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    })
  } catch (error: any) {
    console.error("Razorpay order creation error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create order" },
      { status: 500 }
    )
  }
}
