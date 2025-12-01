import Razorpay from "razorpay"
import crypto from "crypto"

const PLATFORM_FEE_PERCENTAGE = 20 // 20% platform fee

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export interface PaymentDetails {
  amount: number
  doctorId: string
  appointmentId: string
  patientId: string
}

export function calculatePlatformFee(amount: number): {
  platformFee: number
  doctorAmount: number
} {
  const platformFee = (amount * PLATFORM_FEE_PERCENTAGE) / 100
  const doctorAmount = amount - platformFee
  
  return {
    platformFee: Math.round(platformFee * 100) / 100, // Round to 2 decimal places
    doctorAmount: Math.round(doctorAmount * 100) / 100,
  }
}

export async function createRazorpayOrder(details: PaymentDetails) {
  const { amount, appointmentId } = details
  
  const order = await razorpay.orders.create({
    amount: Math.round(amount * 100), // Razorpay expects amount in paise
    currency: "INR",
    receipt: `appt_${appointmentId}`,
    notes: {
      appointmentId,
      doctorId: details.doctorId,
      patientId: details.patientId,
    },
  })

  return order
}

export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(`${orderId}|${paymentId}`)
    .digest("hex")

  return generatedSignature === signature
}

// Razorpay Routes API for automatic settlement to doctor
export async function createRazorpayRoute(doctorUPI: string, amount: number) {
  // Note: This requires Razorpay Routes feature
  // You'll need to set up routes in Razorpay dashboard first
  // For now, we'll handle settlement manually or via Razorpay Payouts API
  
  // This is a placeholder - implement based on your Razorpay plan
  return {
    routeId: null,
    note: "Settlement can be done via Razorpay Payouts API or manually",
  }
}

