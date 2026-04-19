import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser()
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        
        const { actionType } = await req.json()
        if (!actionType) return NextResponse.json({ error: "Missing actionType" }, { status: 400 })

        const patient = await prisma.patient.findUnique({ where: { userId: user.id } })
        if (!patient) return NextResponse.json({ error: "Patient profile not found" }, { status: 404 })

        const todayStart = new Date()
        todayStart.setHours(0, 0, 0, 0)
        
        const logsToday = await prisma.creditLog.findMany({
            where: {
                patientId: patient.id,
                timestamp: { gte: todayStart },
                creditsAwarded: { gt: 0 }
            }
        })
        
        const earnedToday = logsToday.reduce((sum: number, log: any) => sum + log.creditsAwarded, 0)
        
        if (earnedToday >= 4) {
            const wallet = await prisma.careCreditWallet.findUnique({ where: { patientId: patient.id }})
            return NextResponse.json({
                earned_today: earnedToday,
                total_credits: wallet?.totalCredits || 0,
                message: "You have already reached the daily maximum of 4 Care Credits 🌿!"
            })
        }

        let creditsToAward = 1
        if (actionType === "therapy_session") creditsToAward = 2

        if (earnedToday + creditsToAward > 4) {
            creditsToAward = 4 - earnedToday // Cap precisely at 4
        }

        if (creditsToAward <= 0) {
           return NextResponse.json({ error: "Daily limit reached" }, { status: 400 })
        }

        // Transaction: Add Log and Update Wallet safely
        const newWallet = await prisma.$transaction(async (tx) => {
            await tx.creditLog.create({
                data: {
                    patientId: patient.id,
                    actionType,
                    creditsAwarded: creditsToAward
                }
            })

            return tx.careCreditWallet.upsert({
                where: { patientId: patient.id },
                update: {
                    totalCredits: { increment: creditsToAward }
                },
                create: {
                    patientId: patient.id,
                    totalCredits: creditsToAward
                }
            })
        })

        return NextResponse.json({
            earned_today: earnedToday + creditsToAward,
            total_credits: newWallet.totalCredits,
            message: `You earned ${creditsToAward} Care Credit${creditsToAward > 1 ? 's' : ''} today 🌿`
        })

    } catch (error) {
        console.error("POST Earn Credit error", error)
        return NextResponse.json({ error: "Failed to earn credit" }, { status: 500 })
    }
}
