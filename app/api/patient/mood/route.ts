import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth.config"
import { prisma } from "@/lib/prisma"
import { MOOD_KEYS, type MoodKey } from "@/lib/mood/constants"
import { computeMoodStreak } from "@/lib/mood/streak"

const MAX_NOTE = 2000
const MAX_TAGS = 20
const MAX_TAG_LEN = 40
const CRAVING_TRIGGERS = new Set(["Stress", "Social", "Boredom", "Habit"])

function isMoodKey(s: string): s is MoodKey {
  return (MOOD_KEYS as readonly string[]).includes(s)
}

function parseBody(raw: Record<string, unknown>) {
  const mood = typeof raw.mood === "string" ? raw.mood : ""
  const moodScore =
    typeof raw.mood_score === "number"
      ? raw.mood_score
      : typeof raw.moodScore === "number"
        ? raw.moodScore
        : NaN
  const tags = Array.isArray(raw.tags) ? raw.tags : []
  const note = typeof raw.note === "string" ? raw.note : ""
  const energy =
    typeof raw.energy_level === "number"
      ? raw.energy_level
      : typeof raw.energyLevel === "number"
        ? raw.energyLevel
        : NaN
  const stress =
    typeof raw.stress_level === "number"
      ? raw.stress_level
      : typeof raw.stressLevel === "number"
        ? raw.stressLevel
        : NaN
  const sleep =
    typeof raw.sleep_quality === "number"
      ? raw.sleep_quality
      : typeof raw.sleepQuality === "number"
        ? raw.sleepQuality
        : NaN
  const craving = typeof raw.craving === "boolean" ? raw.craving : false
  const cravingIntensity =
    typeof raw.craving_intensity === "number"
      ? raw.craving_intensity
      : typeof raw.cravingIntensity === "number"
        ? raw.cravingIntensity
        : undefined
  const cravingTriggerRaw = raw.craving_trigger ?? raw.cravingTriggers
  const cravingTriggers = Array.isArray(cravingTriggerRaw) ? cravingTriggerRaw : []

  return {
    mood,
    moodScore,
    tags,
    note,
    energy,
    stress,
    sleep,
    craving,
    cravingIntensity,
    cravingTriggers,
  }
}

function clampInt(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Math.round(n)))
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { patient: true },
    })

    if (!user?.patient) {
      return NextResponse.json({ error: "Patient profile required" }, { status: 400 })
    }

    const limitParam = req.nextUrl.searchParams.get("limit")
    const limit = Math.min(90, Math.max(1, Number(limitParam) || 60))

    const entries = await prisma.moodCheckIn.findMany({
      where: { patientId: user.patient.id },
      orderBy: { createdAt: "desc" },
      take: limit,
    })

    const forStreak = await prisma.moodCheckIn.findMany({
      where: { patientId: user.patient.id },
      select: { createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 400,
    })

    const streak = computeMoodStreak(forStreak.map((e) => e.createdAt))
    const totalCheckIns = await prisma.moodCheckIn.count({
      where: { patientId: user.patient.id },
    })

    return NextResponse.json({
      entries: entries.map((e) => ({
        id: e.id,
        mood: e.mood,
        mood_score: e.moodScore,
        tags: e.tags,
        note: e.note,
        energy_level: e.energyLevel,
        stress_level: e.stressLevel,
        sleep_quality: e.sleepQuality,
        craving: e.craving,
        craving_intensity: e.cravingIntensity,
        craving_trigger: e.cravingTriggers,
        created_at: e.createdAt.toISOString(),
      })),
      streak,
      total_check_ins: totalCheckIns,
    })
  } catch (error) {
    console.error("GET /api/patient/mood:", error)
    return NextResponse.json({ error: "Failed to load mood entries" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { patient: true },
    })

    if (!user?.patient) {
      return NextResponse.json({ error: "Patient profile required" }, { status: 400 })
    }

    let body: Record<string, unknown>
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
    }

    const p = parseBody(body)

    if (!isMoodKey(p.mood)) {
      return NextResponse.json({ error: "Invalid mood" }, { status: 400 })
    }

    if (!Number.isFinite(p.moodScore) || p.moodScore < 1 || p.moodScore > 10) {
      return NextResponse.json({ error: "mood_score must be 1–10" }, { status: 400 })
    }

    for (const [key, val] of [
      ["energy_level", p.energy],
      ["stress_level", p.stress],
      ["sleep_quality", p.sleep],
    ] as const) {
      if (!Number.isFinite(val) || val < 1 || val > 10) {
        return NextResponse.json({ error: `${key} must be 1–10` }, { status: 400 })
      }
    }

    const tagStrings: string[] = []
    for (const t of p.tags) {
      if (typeof t !== "string") continue
      const s = t.trim()
      if (!s || s.length > MAX_TAG_LEN) continue
      if (tagStrings.length >= MAX_TAGS) break
      if (!tagStrings.includes(s)) tagStrings.push(s)
    }

    const noteOut: string | null = p.note.trim() ? p.note.trim().slice(0, MAX_NOTE) : null

    let cravingIntensity: number | null = null
    const cravingTriggers: string[] = []

    if (p.craving) {
      if (
        p.cravingIntensity === undefined ||
        !Number.isFinite(p.cravingIntensity) ||
        p.cravingIntensity < 1 ||
        p.cravingIntensity > 10
      ) {
        return NextResponse.json(
          { error: "craving_intensity (1–10) required when craving is true" },
          { status: 400 },
        )
      }
      cravingIntensity = clampInt(p.cravingIntensity, 1, 10)
      for (const tr of p.cravingTriggers) {
        if (typeof tr !== "string") continue
        const x = tr.trim()
        if (CRAVING_TRIGGERS.has(x) && !cravingTriggers.includes(x)) {
          cravingTriggers.push(x)
        }
      }
    }

    const row = await prisma.moodCheckIn.create({
      data: {
        patientId: user.patient.id,
        mood: p.mood,
        moodScore: clampInt(p.moodScore, 1, 10),
        tags: tagStrings,
        note: noteOut,
        energyLevel: clampInt(p.energy, 1, 10),
        stressLevel: clampInt(p.stress, 1, 10),
        sleepQuality: clampInt(p.sleep, 1, 10),
        craving: p.craving,
        cravingIntensity,
        cravingTriggers,
      },
    })

    const allDates = (
      await prisma.moodCheckIn.findMany({
        where: { patientId: user.patient.id },
        select: { createdAt: true },
        orderBy: { createdAt: "desc" },
        take: 400,
      })
    ).map((e) => e.createdAt)

    const streak = computeMoodStreak(allDates)
    const totalCheckIns = await prisma.moodCheckIn.count({
      where: { patientId: user.patient.id },
    })

    return NextResponse.json({
      entry: {
        id: row.id,
        mood: row.mood,
        mood_score: row.moodScore,
        tags: row.tags,
        note: row.note,
        energy_level: row.energyLevel,
        stress_level: row.stressLevel,
        sleep_quality: row.sleepQuality,
        craving: row.craving,
        craving_intensity: row.cravingIntensity,
        craving_trigger: row.cravingTriggers,
        created_at: row.createdAt.toISOString(),
      },
      streak,
      total_check_ins: totalCheckIns,
    })
  } catch (error) {
    console.error("POST /api/patient/mood:", error)
    return NextResponse.json({ error: "Failed to save mood entry" }, { status: 500 })
  }
}
