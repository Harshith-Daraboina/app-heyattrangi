import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser()
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        
        const { rewardId } = await req.json()
        if (!rewardId) return NextResponse.json({ error: "Missing rewardId" }, { status: 400 })

        const patient = await prisma.patient.findUnique({ where: { userId: user?.id || "" } })
        if (!patient) return NextResponse.json({ error: "Patient profile not found" }, { status: 404 })

        const reward = await prisma.reward.findUnique({ where: { id: rewardId } })
        if (!reward) return NextResponse.json({ error: "Reward not found" }, { status: 404 })

        const wallet = await prisma.careCreditWallet.findUnique({ where: { patientId: patient.id }})
        if (!wallet || wallet.totalCredits < reward.creditCost) {
            return NextResponse.json({ error: "Insufficient Care Credits" }, { status: 400 })
        }

        // Transaction: Update Wallet and Log Redemption
        const updatedWallet = await prisma.$transaction(async (tx) => {
            await tx.creditLog.create({
                data: {
                    patientId: patient.id,
                    actionType: `redeemed_${reward.type}`,
                    creditsAwarded: -reward.creditCost
                }
            })

            return tx.careCreditWallet.update({
                where: { patientId: patient.id },
                data: {
                    totalCredits: { decrement: reward.creditCost }
                }
            })
        })

        return NextResponse.json({
            success: true,
            total_credits: updatedWallet.totalCredits,
            message: `Successfully redeemed ${reward.name} 🌿`
        })

    } catch (error) {
        console.error("POST Redeem error", error)
        return NextResponse.json({ error: "Failed to redeem reward" }, { status: 500 })
    }
}
