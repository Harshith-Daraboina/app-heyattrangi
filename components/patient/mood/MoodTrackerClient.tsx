"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  COPING_SUGGESTIONS,
  MOOD_OPTIONS,
  PRESET_TAGS,
  type MoodKey,
} from "@/lib/mood/constants"

// Sub-components
import MoodGauge from "./MoodGauge"
import MoodHistory from "./MoodHistory"

export type MoodEntryRow = {
  id: string
  mood: string
  mood_score: number
  tags: string[]
  note: string | null
  energy_level: number
  stress_level: number
  sleep_quality: number
  craving: boolean
  craving_intensity: number | null
  craving_trigger: string[]
  created_at: string
}

type Props = {
  canLog: boolean
  initialEntries: MoodEntryRow[]
  initialStreak: number
  initialTotal: number
}

export default function MoodTrackerClient({
  canLog,
  initialEntries,
  initialStreak,
  initialTotal,
}: Props) {
  const [entries, setEntries] = useState<MoodEntryRow[]>(initialEntries)
  const [streak, setStreak] = useState(initialStreak)
  const [totalCheckIns, setTotalCheckIns] = useState(initialTotal)

  // Navigation View
  const [view, setView] = useState<"track" | "history">("track")

  // Form State
  const [mood, setMood] = useState<MoodKey | null>(null)
  const [moodScore, setMoodScore] = useState(5)
  const [tags, setTags] = useState<string[]>([])
  const [customTagInput, setCustomTagInput] = useState("")
  const [note, setNote] = useState("")
  const [energyLevel, setEnergyLevel] = useState(5)
  const [stressLevel, setStressLevel] = useState(5)
  const [sleepQuality, setSleepQuality] = useState(5)

  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState<{ type: "success" | "error"; title: string; body?: string } | null>(null)

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 5000)
    return () => clearTimeout(t)
  }, [toast])

  const save = async () => {
    if (!mood) {
      setToast({ type: "error", title: "Wait!", body: "Please select your mood first." })
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch("/api/patient/mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mood,
          mood_score: moodScore,
          tags,
          note: note.trim() || undefined,
          energy_level: energyLevel,
          stress_level: stressLevel,
          sleep_quality: sleepQuality,
          craving: false,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to save")

      setEntries((prev) => [data.entry, ...prev])
      setStreak(data.streak)
      setTotalCheckIns(data.total_check_ins)
      setToast({ type: "success", title: "Mood Logged!", body: "Great job checking in with yourself." })

      // Clear form
      setMood(null)
      setNote("")
      setTags([])
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error: any) {
      setToast({ type: "error", title: "Error", body: error.message })
    } finally {
      setSubmitting(false)
    }
  }

  if (!canLog) {
    return (
      <div className="mx-auto w-full max-w-lg px-4 py-12 text-center">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Access Restricted</h2>
        <p className="mt-2 text-[var(--color-text-secondary)]">Please complete your patient profile to use the Mood Tracker.</p>
        <Link href="/patient/dashboard" className="mt-6 inline-block rounded-lg bg-[var(--color-brand)] px-6 py-2 text-white">
          Back to Dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] pb-32 pt-6">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 left-1/2 z-50 w-full max-w-sm -translate-x-1/2 rounded-2xl border p-4 shadow-xl backdrop-blur-md ${toast.type === "success" ? "border-green-200 bg-white/90" : "border-red-200 bg-white/90"
              }`}
          >
            <p className="font-bold text-[var(--color-text-primary)]">{toast.title}</p>
            {toast.body && <p className="text-sm text-[var(--color-text-secondary)]">{toast.body}</p>}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mx-auto max-w-5xl px-4">
        {/* Navigation Tabs */}
        <div className="mb-10 flex items-center justify-between">
          <div className="flex gap-2 bg-white/50 p-1.5 rounded-full border border-white/40">
            <button
              onClick={() => setView("track")}
              className={`rounded-full px-8 py-2 text-sm font-bold transition-all ${view === "track" ? "bg-[var(--color-brand)] text-white shadow-lg" : "text-[var(--color-text-secondary)] hover:bg-white"
                }`}
            >
              Log Mood
            </button>
            <button
              onClick={() => setView("history")}
              className={`rounded-full px-8 py-2 text-sm font-bold transition-all ${view === "history" ? "bg-[var(--color-brand)] text-white shadow-lg" : "text-[var(--color-text-secondary)] hover:bg-white"
                }`}
            >
              History
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Daily Streak</span>
              <span className="text-sm font-bold text-[var(--color-brand)]">{streak} Days 🔥</span>
            </div>
          </div>
        </div>

        {view === "history" ? (
          <MoodHistory entries={entries} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6 items-start">

            <section className="col-span-full md:col-span-4 rounded-[2.5rem] bg-white p-10 border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow">
              <MoodGauge
                selectedMood={mood}
                onSelect={(m) => {
                  setMood(m)
                  const def = MOOD_OPTIONS.find((o) => o.key === m)?.defaultScore || 5
                  setMoodScore(def)
                }}
              />
              <div className="mt-12 pt-8 border-t border-dashed border-[var(--color-border)]">
                <h3 className="mb-4 text-center font-bold text-xs uppercase tracking-widest text-[var(--color-text-muted)]">Mood Intensity</h3>
                <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <button
                      key={num}
                      onClick={() => setMoodScore(num)}
                      className={`h-10 flex items-center justify-center rounded-xl border font-bold text-sm transition-all ${moodScore === num
                        ? "bg-[var(--color-brand)] text-white border-[var(--color-brand)] shadow-md"
                        : "bg-[var(--color-surface-raised)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-[var(--color-brand)]"
                        }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* 3. Quote / Streak Box - Small (Col Span 2) */}
            <div className="col-span-full md:col-span-2 flex flex-col gap-6 h-full">
              <div className="flex-1 rounded-[2.5rem] bg-[var(--color-brand-light)]/30 p-8 flex flex-col items-center justify-center text-center border border-orange-100 border-dashed">
                <span className="text-4xl mb-4">✨</span>
                <p className="text-sm font-medium text-[var(--color-brand-dark)]">"You don't have to be positive all the time. It's okay to feel however you feel."</p>
              </div>
            </div>

            {/* 4. Metrics Grid - Medium (Col Span 3) */}
            <section className="col-span-full md:col-span-3 rounded-[2.5rem] bg-white p-8 border border-[var(--color-border)] shadow-sm flex flex-col gap-6">
              <h3 className="text-lg font-bold">Vital Metrics</h3>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs font-bold uppercase tracking-wide text-[var(--color-text-secondary)]">Energy</p>
                    <span className="text-xs font-bold text-[var(--color-brand)]">{energyLevel}/10</span>
                  </div>
                  <input
                    type="range" min="1" max="10" value={energyLevel}
                    onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
                    className="w-full accent-[var(--color-brand)] h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs font-bold uppercase tracking-wide text-[var(--color-text-secondary)]">Stress</p>
                    <span className="text-xs font-bold text-red-500">{stressLevel}/10</span>
                  </div>
                  <input
                    type="range" min="1" max="10" value={stressLevel}
                    onChange={(e) => setStressLevel(parseInt(e.target.value))}
                    className="w-full accent-red-400 h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs font-bold uppercase tracking-wide text-[var(--color-text-secondary)]">Sleep</p>
                    <span className="text-xs font-bold text-blue-500">{sleepQuality}/10</span>
                  </div>
                  <input
                    type="range" min="1" max="10" value={sleepQuality}
                    onChange={(e) => setSleepQuality(parseInt(e.target.value))}
                    className="w-full accent-blue-400 h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </section>

            {/* 5. Tags Selection - Medium (Col Span 3) */}
            <section className="col-span-full md:col-span-3 rounded-[2.5rem] bg-white p-8 border border-[var(--color-border)] shadow-sm flex flex-col h-full">
              <h3 className="mb-4 text-lg font-bold">What's happening?</h3>
              <div className="flex flex-wrap gap-2 mb-auto">
                {PRESET_TAGS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])}
                    className={`rounded-full border px-4 py-2 text-xs font-bold transition-all ${tags.includes(tag)
                        ? "border-[var(--color-brand)] bg-orange-50 text-[var(--color-brand)]"
                        : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-orange-200"
                      }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <div className="mt-6 flex gap-2">
                <input
                  type="text"
                  placeholder="Custom..."
                  value={customTagInput}
                  onChange={(e) => setCustomTagInput(e.target.value)}
                  className="auth-form-control rounded-2xl h-10 text-sm"
                />
                <button
                  onClick={() => {
                    if (customTagInput.trim()) {
                      setTags([...tags, customTagInput.trim()])
                      setCustomTagInput("")
                    }
                  }}
                  className="rounded-2xl border border-[var(--color-brand)] px-4 font-bold text-xs text-[var(--color-brand)]"
                >
                  Add
                </button>
              </div>
            </section>

            {/* 6. Expression Analysis (Notes) - Full Width */}
            <section className="col-span-full rounded-[2.5rem] bg-white p-8 border border-[var(--color-border)] shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">Expression Analysis</h3>
                <button className="flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-xs font-bold text-[var(--color-brand)]">
                  <span>🎤</span> Voice Input
                </button>
              </div>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="I'm feeling..."
                className="auth-form-control min-h-[150px] rounded-[2rem] p-8 text-lg border-dashed border-2"
              />
            </section>

            {/* 7. Save Button Area */}
            <div className="col-span-full pt-4 pb-10">
              <button
                onClick={save}
                disabled={submitting}
                className="w-full rounded-[2rem] bg-[var(--color-text-primary)] py-5 text-xl font-bold text-white shadow-2xl hover:scale-[1.01] transition-transform disabled:opacity-50"
              >
                {submitting ? "Saving Check-in..." : "Save Log →"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
