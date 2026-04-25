import { Suspense } from "react"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { computeMoodStreak } from "@/lib/mood/streak"
import MoodTrackerClient, { type MoodEntryRow } from "@/components/patient/mood/MoodTrackerClient"
import MoodSkeleton from "@/components/patient/mood/MoodSkeleton"

async function MoodTrackerContent() {
  const user = await getCurrentUser()

  let initialEntries: MoodEntryRow[] = []
  let initialStreak = 0
  let initialTotal = 0

  if (user?.patient) {
    const rows = await prisma.moodCheckIn.findMany({
      where: { patientId: user.patient.id },
      orderBy: { createdAt: "desc" },
      take: 60,
    })

    initialEntries = rows.map((e) => ({
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
    }))

    const forStreak = await prisma.moodCheckIn.findMany({
      where: { patientId: user.patient.id },
      select: { createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 400,
    })
    initialStreak = computeMoodStreak(forStreak.map((e) => e.createdAt))
    initialTotal = await prisma.moodCheckIn.count({
      where: { patientId: user.patient.id },
    })
  }

  return (
    <div className="flex-1 min-w-0 h-full flex flex-col relative w-full overflow-y-auto bg-[var(--color-bg)]">
      {/* Redesigned Mood Tracker - Header Removed */}
      <main className="relative min-h-0 flex-1 overflow-y-auto pt-10">
        <MoodTrackerClient
          canLog={!!user?.patient}
          initialEntries={initialEntries}
          initialStreak={initialStreak}
          initialTotal={initialTotal}
        />
      </main>
    </div>
  )
}

export default function MoodTrackerPage() {
  return (
    <Suspense fallback={<MoodSkeleton />}>
      <MoodTrackerContent />
    </Suspense>
  )
}
