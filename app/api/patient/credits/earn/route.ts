import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser()
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        
        const { actionType } = await req.json()
        if (!actionType) return NextResponse.json({ error: "Missing actionType" }, { status: 400 })

        const patient = await prisma.patient.findUnique({ where: { userId: user?.id || "" } })
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
        
        let creditsToAward = 1
        let isBonus = false

        if (actionType === "daily_login_bonus") {
            const cycleDay = ((patient.currentStreak - 1) % 7) + 1
            const rewards = [10, 15, 20, 25, 30, 40, 75]
            creditsToAward = rewards[cycleDay - 1] || 10
            if (cycleDay === 7) isBonus = true
        } else if (actionType === "therapy_session") {
            creditsToAward = 2
        }

        // Daily cap logic - don't cap the login bonus, but cap other activities
        if (actionType !== "daily_login_bonus") {
            if (earnedToday >= 4) {
                const wallet = await prisma.careCreditWallet.findUnique({ where: { patientId: patient.id }})
                return NextResponse.json({
                    earned_today: earnedToday,
                    total_credits: wallet?.totalCredits || 0,
                    message: "You have already reached the daily maximum of 4 Care Credits 🌿!"
                })
            }
            if (earnedToday + creditsToAward > 4) {
                creditsToAward = 4 - earnedToday
            }
        }

        if (creditsToAward <= 0) {
           return NextResponse.json({ error: "Daily limit reached" }, { status: 400 })
        }

        // Transaction: Add Log and Update Wallet safely
        const newWallet = await prisma.$transaction(async (tx) => {
            // Main reward
            await tx.creditLog.create({
                data: {
                    patientId: patient.id,
                    actionType,
                    creditsAwarded: creditsToAward
                }
            })

            // Day 7 Bonus Reward
            if (isBonus) {
                await tx.creditLog.create({
                    data: {
                        patientId: patient.id,
                        actionType: "bonus_reward_day_7",
                        creditsAwarded: 100
                    }
                })
            }

            const totalToAdd = isBonus ? creditsToAward + 100 : creditsToAward

            return tx.careCreditWallet.upsert({
                where: { patientId: patient.id },
                update: {
                    totalCredits: { increment: totalToAdd }
                },
                create: {
                    patientId: patient.id,
                    totalCredits: totalToAdd
                }
            })
        })

        const displayEarned = isBonus ? creditsToAward + 100 : creditsToAward

        return NextResponse.json({
            earned_today: earnedToday + displayEarned,
            total_credits: newWallet.totalCredits,
            message: `You earned ${displayEarned} Care Credits today 🌿${isBonus ? ' (Including Day 7 Bonus!)' : ''}`
        })

    } catch (error) {
        console.error("POST Earn Credit error", error)
        return NextResponse.json({ error: "Failed to earn credit" }, { status: 500 })
    }
}
