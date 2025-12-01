import crypto from "crypto"

const PLATFORM_FEE_PERCENTAGE = 20 // 20% platform fee

// Lazy initialization of Razorpay to avoid build-time errors
let razorpayInstance: any | null = null

async function getRazorpayInstance() {
  if (!razorpayInstance) {
    const keyId = process.env.RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET
    
    if (!keyId || !keySecret) {
      throw new Error("Razorpay credentials not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables.")
    }
    
    // Dynamic import to avoid build-time initialization
    const Razorpay = (await import("razorpay")).default
    razorpayInstance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    })
  }
  
  return razorpayInstance
}

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
  const razorpay = await getRazorpayInstance()
  
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
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  if (!keySecret) {
    console.error("RAZORPAY_KEY_SECRET not configured")
    return false
  }
  
  const generatedSignature = crypto
    .createHmac("sha256", keySecret)
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

