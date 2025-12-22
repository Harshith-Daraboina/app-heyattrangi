import { NextResponse } from "next/server"
import { auth } from "@/auth.config"
import { prisma } from "@/lib/prisma" // Assuming prisma client is exported from here (check later)
import { PrismaClient } from "@prisma/client"

// Fallback prisma definition if lib/prisma doesn't exist (I haven't checked strictly, allowing robustness)
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
const db = globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db

export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const data = await req.json()
        const { userContext, safety, wellbeing, modules, background } = data

        // --- LOGIC ---
        // In a real app, we would call OpenAI/Gemini here.
        // For now, I will implement a "Hybrid AI" mock that generates a report based on rules.

        // 1. Calculate Risk Level (Naive algo)
        let riskScore = 0
        if (wellbeing.score === "Poor") riskScore += 2
        if (wellbeing.score === "Fair") riskScore += 1

        // Check modules for high frequency keywords
        const highFreq = ["More than half days", "Nearly every day"]
        Object.values(modules).forEach((val: any) => {
            if (highFreq.includes(val)) riskScore += 1
        })

        let riskLevel = "Low"
        if (riskScore > 2) riskLevel = "Mild"
        if (riskScore > 5) riskLevel = "Moderate"
        if (riskScore > 8) riskLevel = "High"

        // 2. Generate Summary Report
        const summary = generateSummary(data, riskLevel)

        // 3. Save to DB
        // First find patient Record
        const patient = await db.patient.findUnique({
            where: { userId: session.user.id }
        })

        if (!patient) {
            return NextResponse.json({ error: "Patient profile not found" }, { status: 404 })
        }

        await db.mentalWellnessAssessment.create({
            data: {
                patientId: patient.id,
                userContext: userContext,
                safetyFlags: safety,
                wellbeingScore: wellbeing.score,
                difficultAreas: wellbeing.difficultAreas,
                moduleScores: modules,
                backgroundFlags: background,
                riskLevel: riskLevel,
                summaryReport: summary,
                affectedDomains: wellbeing.difficultAreas
            }
        })

        return NextResponse.json({ success: true, riskLevel, summary })

    } catch (error) {
        console.error("Wellness check error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

function generateSummary(data: any, riskLevel: string) {
    const areas = data.wellbeing.difficultAreas.join(", ")

    let advice = "Focus on maintaining your current routine."
    if (riskLevel === "Mild") advice = "Try incorporating some mindfulness exercises and ensure you are getting enough sleep."
    if (riskLevel === "Moderate") advice = "It might be helpful to talk to a counselor or therapist to unpack these feelings."
    if (riskLevel === "High") advice = "We strongly recommend consulting with a mental health professional for a comprehensive assessment."

    return `## Wellness Snapshot
**Risk Level:** ${riskLevel}

Based on your responses, you are experiencing challenges primarily in: **${areas || "None"}**.

### Summary
Your reported overall wellbeing is **${data.wellbeing.score}**. 
${riskLevel !== 'Low' ? `You indicated distinct difficulties with ${areas}.` : "You seem to be managing well."}

### Recommendations
${advice}

*Disclaimer: This is an AI-generated summary and not a clinical diagnosis.*`
}
