import { NextResponse } from "next/server"
import { auth } from "@/auth.config"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const transactions = await prisma.transaction.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 10
    })

    const patient = await prisma.patient.findUnique({
      where: { userId: session.user.id },
      include: {
        creditWallet: true
      }
    })

    const walletBalance = patient?.creditWallet?.totalCredits || 0

    return NextResponse.json({
      success: true,
      transactions,
      walletBalance
    })

  } catch (error) {
    console.error("Failed to fetch transactions:", error)
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    )
  }
}
