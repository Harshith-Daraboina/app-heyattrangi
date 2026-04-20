import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        const rewards = await prisma.reward.findMany({
            orderBy: { creditCost: 'asc' }
        })
        
        // Ensure there are some default rewards for demonstration if DB is empty
        if (rewards.length === 0) {
            const fallbackRewards = [
                { id: "fallback-1", name: "Premium Wellness Background", creditCost: 150, type: "content" },
                { id: "fallback-2", name: "Unlimited AI Guidance (24h)", creditCost: 500, type: "AI" },
                { id: "fallback-3", name: "15% off Therapy Session", creditCost: 2500, type: "therapy" },
            ]
            return NextResponse.json(fallbackRewards)
        }

        return NextResponse.json(rewards)
    } catch(err) {
        return NextResponse.json({ error: "Failed to fetch rewards" }, { status: 500 })
    }
}
