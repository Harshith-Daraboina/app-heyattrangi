import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth.config"
import { createGenericRazorpayOrder } from "@/lib/payments"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { plan, amount } = await req.json()

    if (!plan || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const shortUserId = session.user.id.slice(-6)
    const receiptId = `sub_${shortUserId}_${Date.now()}`
    const notes = {
      userId: session.user.id,
      type: "SUBSCRIPTION",
      plan,
      amount: amount.toString()
    }

    const order = await createGenericRazorpayOrder(amount, receiptId, notes)

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    })
  } catch (error: any) {
    console.error("Razorpay subscription order creation error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create order" },
      { status: 500 }
    )
  }
}
