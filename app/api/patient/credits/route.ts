import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
    try {
        const user = await getCurrentUser()
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        
        const patient = await prisma.patient.findUnique({ where: { userId: user.id } })
        if (!patient) return NextResponse.json({ error: "Patient profile not found" }, { status: 404 })

        const wallet = await prisma.careCreditWallet.upsert({
            where: { patientId: patient.id },
            update: {},
            create: { patientId: patient.id, totalCredits: 0 }
        })

        const todayStart = new Date()
        todayStart.setHours(0, 0, 0, 0)
        
        const logsToday = await prisma.creditLog.findMany({
            where: {
                patientId: patient.id,
                timestamp: { gte: todayStart },
                creditsAwarded: { gt: 0 } // exclude redemptions from daily earn cap
            }
        })
        
        const earnedToday = logsToday.reduce((sum: number, log: any) => sum + log.creditsAwarded, 0)

        // Streak Tracker Logic
        const lastLogin = patient.lastLoginDate
        let currentStreak = patient.currentStreak
        let streakUpdated = false

        if (!lastLogin) {
            currentStreak = 1
            streakUpdated = true
        } else {
            const msInDay = 1000 * 60 * 60 * 24
            const daysSinceLogin = Math.floor((todayStart.getTime() - new Date(lastLogin).setHours(0,0,0,0)) / msInDay)
            if (daysSinceLogin === 1) {
                currentStreak += 1
                streakUpdated = true
            } else if (daysSinceLogin > 1) {
                currentStreak = 1
                streakUpdated = true
            }
        }

        if (streakUpdated) {
            await prisma.patient.update({
                where: { id: patient.id },
                data: { currentStreak, lastLoginDate: new Date() }
            })
        }

        return NextResponse.json({
            earned_today: earnedToday,
            total_credits: wallet.totalCredits,
            current_streak: currentStreak,
            message: "Credits fetched successfully"
        })
    } catch (error) {
        console.error("GET Credits error", error)
        return NextResponse.json({ error: "Failed to fetch credits" }, { status: 500 })
    }
}
