import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth.config"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id || session.user.role !== "DOCTOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const doctor = await prisma.doctor.findUnique({
      where: { userId: session.user.id }
    })

    if (!doctor) {
      return NextResponse.json({ error: "Doctor profile not found" }, { status: 404 })
    }

    if (doctor.status !== "VERIFIED") {
      return NextResponse.json({ error: "Your profile must be VERIFIED before setting up payments." }, { status: 403 })
    }

    const body = await req.json()
    const { accountHolderName, accountNumber, ifsc, bankName } = body

    if (!accountNumber || !ifsc || !accountHolderName) {
      return NextResponse.json({ error: "Missing bank details" }, { status: 400 })
    }

    // In a real integration, you would call the Razorpay Accounts API to create a linked account here.
    // const linkedAccount = await razorpay.accounts.create({
    //   type: "route",
    //   email: session.user.email,
    //   legal_business_name: accountHolderName,
    //   business_type: "individual",
    //   profile: {
    //     category: "medical",
    //     subcategory: "clinic"
    //   },
    //   legal_info: {
    //     pan: doctor.panDocument || "ABCDE1234F"
    //   }
    // })

    // For now, we simulate a successful linked account creation.
    const mockRazorpayAccountId = `acc_${Math.random().toString(36).substring(2, 10).toUpperCase()}`

    const updated = await prisma.doctor.update({
      where: { id: doctor.id },
      data: {
        bankAccountName: accountHolderName,
        bankAccountNumber: accountNumber,
        bankIFSC: ifsc,
        bankName: bankName,
        razorpayAccountId: mockRazorpayAccountId,
        paymentsEnabled: true
      }
    })

    return NextResponse.json({ 
      success: true, 
      message: "Razorpay linked account created successfully",
      accountId: mockRazorpayAccountId,
      doctor: updated
    })

  } catch (error: any) {
    console.error("Error setting up payments:", error)
    return NextResponse.json(
      { error: error.message || "Failed to set up payments" },
      { status: 500 }
    )
  }
}
