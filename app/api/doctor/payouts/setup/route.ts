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
      return NextResponse.json({ error: "Doctor profile not found" }, { status: 404 })
    }

    const data = await req.json()
    const { 
      fullName, panNumber, dateOfBirth, address,
      bankAccountName, bankName, bankAccountNumber, bankIFSC,
      panDocument, cancelledChequeDocument
    } = data

    // Here we simulate Razorpay API calls to create a linked account
    // since we want to abstract it from the user.
    // In production, this would use Razorpay's `/v2/accounts` API.
    
    const updatedDoctor = await prisma.doctor.update({
      where: { id: doctor.id },
      data: {
        fullName: fullName || doctor.fullName,
        panNumber,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : doctor.dateOfBirth,
        currentAddress: address || doctor.currentAddress,
        bankAccountName,
        bankName,
        bankAccountNumber,
        bankIFSC,
        panDocument,
        cancelledChequeDocument,
        payoutStatus: "UNDER_REVIEW", // Set to UNDER_REVIEW while Razorpay verifies
      }
    })

    return NextResponse.json({ 
      success: true, 
      message: "Payout details submitted successfully. Verification pending.",
      doctor: updatedDoctor 
    })
  } catch (error) {
    console.error("Error setting up payouts:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
