"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { format, isWithinInterval, subDays } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"
import {
  COPING_SUGGESTIONS,
  MOOD_OPTIONS,
  PRESET_TAGS,
  type MoodKey,
} from "@/lib/mood/constants"

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

function moodEmoji(mood: string): string {
  return MOOD_OPTIONS.find((m) => m.key === mood)?.emoji ?? "😐"
}

function isPresetTag(tag: string): boolean {
  return (PRESET_TAGS as readonly string[]).includes(tag)
}

function partitionTags(tagsList: string[]): { preset: string[]; custom: string[] } {
  const preset: string[] = []
  const custom: string[] = []
  for (const t of tagsList) {
    if (isPresetTag(t)) preset.push(t)
    else custom.push(t)
  }
  return { preset, custom }
}

function noteSentimentHint(note: string): string | null {
  if (!note.trim()) return null
  if (/(hopeless|hurt myself|kill myself|end my life|can't go on)/i.test(note)) {
    return "If you might be in danger, contact local emergency services or a crisis helpline right away. You deserve support."
  }
  if (/\b(overwhelm|overwhelmed|anxious|panic)\b/i.test(note)) {
    return "When stress feels sharp, try slowing your breath or stepping away for five minutes."
  }
  if (/\b(lonely|alone|isolated)\b/i.test(note)) {
    return "Feeling alone is heavy. One small connection—a message or voice note—can help."
  }
  return null
}

function randomCoping(mood: MoodKey): string {
  const list = COPING_SUGGESTIONS[mood]
  return list[Math.floor(Math.random() * list.length)] ?? list[0]
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

  const [mood, setMood] = useState<MoodKey | null>(null)
  const [moodScore, setMoodScore] = useState(5)
  const [tags, setTags] = useState<string[]>([])
  const [customTagInput, setCustomTagInput] = useState("")
  const [note, setNote] = useState("")
  const noteRef = useRef<HTMLTextAreaElement>(null)

  const [energyLevel, setEnergyLevel] = useState(5)
  const [stressLevel, setStressLevel] = useState(5)
  const [sleepQuality, setSleepQuality] = useState(5)

  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  const [toast, setToast] = useState<{
    type: "success" | "error"
    title: string
    body?: string
    coping?: string
  } | null>(null)

  const adjustNoteHeight = useCallback(() => {
    const el = noteRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${Math.min(220, Math.max(96, el.scrollHeight))}px`
  }, [])

  useEffect(() => {
    adjustNoteHeight()
  }, [note, adjustNoteHeight])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 5200)
    return () => clearTimeout(t)
  }, [toast])

  const selectMood = (key: MoodKey) => {
    setMood(key)
    const def = MOOD_OPTIONS.find((m) => m.key === key)?.defaultScore ?? 5
    setMoodScore(def)
    setValidationError(null)
  }

  const toggleTag = (tag: string) => {
    setTags((prev) => {
      if (prev.includes(tag)) return prev.filter((x) => x !== tag)
      if (prev.length >= 20) return prev
      return [...prev, tag]
    })
  }

  const addCustomTag = () => {
    const s = customTagInput.trim().slice(0, 40)
    if (!s) return
    setTags((prev) => {
      if (prev.includes(s) || prev.length >= 20) return prev
      return [...prev, s]
    })
    setCustomTagInput("")
  }

  const last7DaysEntries = useMemo(() => {
    const end = new Date()
    const start = subDays(end, 6)
    start.setHours(0, 0, 0, 0)
    return entries.filter((e) =>
      isWithinInterval(new Date(e.created_at), { start, end }),
    )
  }, [entries])

  const daySummaries = useMemo(() => {
    const byDay = new Map<string, MoodEntryRow>()
    for (const e of entries) {
      const day = format(new Date(e.created_at), "yyyy-MM-dd")
      const existing = byDay.get(day)
      if (!existing || new Date(e.created_at) > new Date(existing.created_at)) {
        byDay.set(day, e)
      }
    }
    const days: { label: string; key: string; entry: MoodEntryRow | null }[] = []
    for (let i = 6; i >= 0; i--) {
      const d = subDays(new Date(), i)
      const key = format(d, "yyyy-MM-dd")
      days.push({
        key,
        label: format(d, "EEE"),
        entry: byDay.get(key) ?? null,
      })
    }
    return days
  }, [entries])

  const badges = useMemo(() => {
    const list: { icon: string; label: string }[] = []
    if (totalCheckIns >= 1) list.push({ icon: "✨", label: "First step" })
    if (streak >= 3) list.push({ icon: "🔥", label: `${streak}-day streak` })
    if (streak >= 7) list.push({ icon: "🌿", label: "Week of care" })
    if (totalCheckIns >= 30) list.push({ icon: "⭐", label: "30 check-ins" })
    return list
  }, [streak, totalCheckIns])

  const save = async () => {
    if (!mood) {
      setValidationError("Choose how you’re feeling today.")
      return
    }
    setValidationError(null)
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
          craving_intensity: undefined,
          craving_trigger: [],
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setToast({
          type: "error",
          title: "Couldn’t save",
          body: typeof data.error === "string" ? data.error : "Try again in a moment.",
        })
        return
      }

      const entry = data.entry as MoodEntryRow
      const newStreak = typeof data.streak === "number" ? data.streak : streak
      const newTotal =
        typeof data.total_check_ins === "number" ? data.total_check_ins : totalCheckIns + 1

      setEntries((prev) => [entry, ...prev])
      setStreak(newStreak)
      setTotalCheckIns(newTotal)

      const coping = randomCoping(mood)
      const sentiment = noteSentimentHint(note)
      setToast({
        type: "success",
        title: "Saved your mood",
        body: sentiment ?? undefined,
        coping,
      })

      setNote("")
      setTags([])
      setMood(null)
      setMoodScore(5)
      setEnergyLevel(5)
      setStressLevel(5)
      setSleepQuality(5)
    } catch {
      setToast({ type: "error", title: "Network error", body: "Check your connection and try again." })
    } finally {
      setSubmitting(false)
    }
  }

  if (!canLog) {
    return (
      <div className="mx-auto w-full max-w-lg px-4 py-12 sm:px-6">
        <div
          className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center shadow-[0_4px_24px_rgba(0,0,0,0.06)]"
          style={{ transitionDuration: "300ms" }}
        >
          <p className="text-[var(--text-lg)] font-semibold text-[var(--color-text-primary)]">
            Mood check-ins use your care profile
          </p>
          <p
            className="mt-3 text-[var(--color-text-secondary)]"
            style={{ fontSize: "var(--text-base)", lineHeight: "var(--leading-loose)" }}
          >
            This tracker is set up for people with a patient profile. If you’re a caregiver, you can
            return to your dashboard or complete onboarding as a patient when appropriate.
          </p>
          <Link
            href="/patient/dashboard"
            className="mt-8 inline-flex items-center justify-center rounded-[var(--radius-md)] px-5 py-3 font-medium text-white transition-opacity hover:opacity-95"
            style={{ background: "var(--color-brand)" }}
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="relative pb-32 lg:pb-28">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed left-4 right-4 top-20 z-[60] mx-auto max-w-md rounded-[var(--radius-lg)] border px-4 py-3 shadow-lg sm:left-auto sm:right-8"
            style={{
              background:
                toast.type === "success" ? "var(--color-surface)" : "var(--color-surface)",
              borderColor: toast.type === "success" ? "var(--color-accent)" : "var(--color-error)",
            }}
            role="status"
          >
            <p className="font-semibold text-[var(--color-text-primary)]">{toast.title}</p>
            {toast.body && (
              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{toast.body}</p>
            )}
            {toast.coping && (
              <p className="mt-2 border-t border-[var(--color-border)] pt-2 text-sm text-[var(--color-accent)]">
                <span className="font-medium">Try this: </span>
                {toast.coping}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mx-auto w-full max-w-xl px-4 py-6 sm:px-6 lg:max-w-2xl lg:py-8">
        {(badges.length > 0 || streak > 0) && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            {streak > 0 && (
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium"
                style={{
                  background: "var(--color-brand-light)",
                  color: "var(--color-brand-dark)",
                }}
              >
                <span aria-hidden>🔥</span>
                {streak}-day streak
              </span>
            )}
            {badges
              .filter((b) => !b.label.includes("streak"))
              .map((b) => (
                <span
                  key={b.label}
                  className="inline-flex items-center gap-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-1 text-xs font-medium text-[var(--color-text-secondary)]"
                >
                  <span aria-hidden>{b.icon}</span>
                  {b.label}
                </span>
              ))}
          </div>
        )}

        <section
          className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.05)] sm:p-6"
          style={{ transitionDuration: "300ms" }}
        >
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)] sm:text-xl">
            How do you feel right now?
          </h2>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            Tap the face that fits best. You can adjust intensity below.
          </p>

          <div className="mt-5 grid grid-cols-5 gap-2 sm:gap-3">
            {MOOD_OPTIONS.map((opt) => {
              const selected = mood === opt.key
              return (
                <motion.button
                  key={opt.key}
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  onClick={() => selectMood(opt.key)}
                  className="flex flex-col items-center gap-1 rounded-[var(--radius-lg)] border-2 px-1 py-3 text-center sm:py-4"
                  style={{
                    borderColor: selected ? "var(--color-brand)" : "var(--color-border)",
                    background: selected ? "var(--color-brand-light)" : "var(--color-surface-raised)",
                    boxShadow: selected ? "0 6px 20px rgba(232,114,42,0.15)" : undefined,
                  }}
                >
                  <span className="text-2xl sm:text-3xl" aria-hidden>
                    {opt.emoji}
                  </span>
                  <span className="text-[10px] font-medium leading-tight text-[var(--color-text-secondary)] sm:text-xs">
                    {opt.label}
                  </span>
                </motion.button>
              )
            })}
          </div>

          {validationError && (
            <p className="mt-3 text-sm font-medium text-[var(--color-error)]" role="alert">
              {validationError}
            </p>
          )}

          <div className="mt-6">
            <SliderRow
              label="Mood intensity"
              hint="1 = low · 10 = strong"
              value={moodScore}
              onChange={setMoodScore}
            />
          </div>
        </section>

        <section
          className="mt-5 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.05)] sm:p-6"
          style={{ transitionDuration: "300ms" }}
        >
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">What’s going on?</h2>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            Pick any that apply. Add your own short tag if you like.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {PRESET_TAGS.map((tag) => {
              const on = tags.includes(tag)
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className="rounded-full border px-3 py-1.5 text-sm font-medium transition-all duration-300"
                  style={{
                    borderColor: on ? "var(--color-accent)" : "var(--color-border)",
                    background: on ? "var(--color-accent-light)" : "var(--color-surface-raised)",
                    color: "var(--color-text-primary)",
                  }}
                >
                  {tag}
                </button>
              )
            })}
          </div>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              value={customTagInput}
              onChange={(e) => setCustomTagInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomTag())}
              placeholder="Custom tag"
              maxLength={40}
              className="auth-form-control min-w-0 flex-1 rounded-[var(--radius-md)]"
            />
            <button
              type="button"
              onClick={addCustomTag}
              className="rounded-[var(--radius-md)] border border-[var(--color-accent)] px-4 py-2.5 text-sm font-medium text-[var(--color-accent)] transition-opacity hover:opacity-90"
            >
              Add tag
            </button>
          </div>

          {tags.some((t) => !isPresetTag(t)) && (
            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
                Custom tags
              </p>
              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                Tap a tag to remove it from this check-in.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {tags
                  .filter((t) => !isPresetTag(t))
                  .map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      aria-label={`Remove custom tag ${tag}`}
                      className="inline-flex items-center gap-1.5 rounded-full border-2 px-3 py-1.5 text-sm font-medium transition-all duration-300"
                      style={{
                        borderColor: "var(--color-brand)",
                        background: "var(--color-brand-light)",
                        color: "var(--color-brand-dark)",
                      }}
                    >
                      <span>{tag}</span>
                      <span className="text-base leading-none opacity-70" aria-hidden>
                        ×
                      </span>
                    </button>
                  ))}
              </div>
            </div>
          )}
        </section>

        <section
          className="mt-5 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.05)] sm:p-6"
          style={{ transitionDuration: "300ms" }}
        >
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Notes</h2>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">Optional — your space to reflect.</p>
          <textarea
            ref={noteRef}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What made you feel this way?"
            rows={3}
            maxLength={2000}
            className="auth-form-control mt-3 min-h-[96px] w-full resize-none rounded-[var(--radius-md)] leading-relaxed"
          />
        </section>

        <section
          className="mt-5 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.05)] sm:p-6"
          style={{ transitionDuration: "300ms" }}
        >
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">More detail</h2>
          <div className="mt-5 space-y-5">
            <SliderRow label="Energy" hint="Low → high" value={energyLevel} onChange={setEnergyLevel} />
            <SliderRow label="Stress" hint="Low → high" value={stressLevel} onChange={setStressLevel} />
            <SliderRow
              label="Sleep quality"
              hint="1 rough · 10 rested"
              value={sleepQuality}
              onChange={setSleepQuality}
            />
          </div>
        </section>

        <section
          className="mt-8 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.05)] sm:p-6"
          style={{ transitionDuration: "300ms" }}
        >
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Last 7 days</h2>
            <span className="text-xs text-[var(--color-text-muted)]">{last7DaysEntries.length} logs</span>
          </div>
          <div className="mt-4 flex justify-between gap-1">
            {daySummaries.map((d) => (
              <div key={d.key} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-[10px] font-medium uppercase text-[var(--color-text-muted)]">
                  {d.label}
                </span>
                <div
                  className="flex h-12 w-full max-w-[44px] items-center justify-center rounded-[var(--radius-md)] border text-lg sm:h-14 sm:max-w-[52px]"
                  style={{
                    borderColor: "var(--color-border)",
                    background: d.entry ? "var(--color-brand-light)" : "var(--color-surface-raised)",
                  }}
                >
                  {d.entry ? moodEmoji(d.entry.mood) : "·"}
                </div>
              </div>
            ))}
          </div>

          <ul className="mt-6 space-y-3">
            {entries.slice(0, 14).map((e) => {
              const open = expandedId === e.id
              return (
                <li
                  key={e.id}
                  className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] transition-shadow duration-300 hover:shadow-md"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedId(open ? null : e.id)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left"
                  >
                    <span className="text-2xl">{moodEmoji(e.mood)}</span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-[var(--color-text-primary)]">
                        {format(new Date(e.created_at), "MMM d · h:mm a")}
                      </p>
                      <p className="text-sm text-[var(--color-text-secondary)]">
                        Score {e.mood_score}/10
                        {(() => {
                          const { custom } = partitionTags(e.tags)
                          if (custom.length === 0) return null
                          return (
                            <span className="mt-0.5 block text-[var(--color-text-primary)]">
                              Custom: {custom.join(", ")}
                            </span>
                          )
                        })()}
                      </p>
                    </div>
                    <span className="text-[var(--color-text-muted)]">{open ? "▲" : "▼"}</span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="border-t border-[var(--color-border)]"
                      >
                        <div className="space-y-2 px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                          <p>
                            <span className="font-medium text-[var(--color-text-primary)]">Energy </span>
                            {e.energy_level}/10 ·{" "}
                            <span className="font-medium text-[var(--color-text-primary)]">Stress </span>
                            {e.stress_level}/10 ·{" "}
                            <span className="font-medium text-[var(--color-text-primary)]">Sleep </span>
                            {e.sleep_quality}/10
                          </p>
                          {e.tags.length > 0 && (
                            <div className="space-y-1.5">
                              {(() => {
                                const { preset, custom } = partitionTags(e.tags)
                                return (
                                  <>
                                    {preset.length > 0 && (
                                      <p>
                                        <span className="font-medium text-[var(--color-text-primary)]">
                                          Tags:{" "}
                                        </span>
                                        {preset.join(", ")}
                                      </p>
                                    )}
                                    {custom.length > 0 && (
                                      <div>
                                        <p className="font-medium text-[var(--color-text-primary)]">
                                          Custom tags
                                        </p>
                                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                                          {custom.map((t) => (
                                            <span
                                              key={t}
                                              className="rounded-full border border-[var(--color-brand)] bg-[var(--color-brand-light)] px-2.5 py-0.5 text-xs font-medium text-[var(--color-brand-dark)]"
                                            >
                                              {t}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </>
                                )
                              })()}
                            </div>
                          )}
                          {e.note && (
                            <p>
                              <span className="font-medium text-[var(--color-text-primary)]">Note: </span>
                              {e.note}
                            </p>
                          )}
                          {e.craving && (
                            <p>
                              <span className="font-medium text-[var(--color-text-primary)]">Craving </span>
                              intensity {e.craving_intensity ?? "—"}
                              {e.craving_trigger.length > 0
                                ? ` · ${e.craving_trigger.join(", ")}`
                                : ""}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              )
            })}
          </ul>
          {entries.length === 0 && (
            <p className="mt-4 text-center text-sm text-[var(--color-text-secondary)]">
              Your check-ins will show up here. One tap a day is enough to start.
            </p>
          )}
        </section>

        <p
          className="mt-8 text-center text-xs text-[var(--color-text-muted)]"
          style={{ lineHeight: "var(--leading-loose)" }}
        >
          This tracker supports self-awareness and relapse prevention. It does not replace professional
          care. If you&apos;re in crisis, contact local emergency services or a helpline.
        </p>
      </div>

      <div
        className="sticky bottom-0 z-50 border-t border-[var(--color-border)] bg-[var(--color-surface)]/95 px-4 py-3 backdrop-blur-md"
        style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
      >
        <div className="mx-auto flex max-w-xl justify-center sm:px-6 lg:max-w-2xl">
          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.3 }}
            disabled={submitting}
            onClick={save}
            className="w-full rounded-[var(--radius-lg)] px-6 py-3.5 text-base font-semibold text-white shadow-[0_8px_24px_rgba(232,114,42,0.35)] transition-opacity duration-300 disabled:cursor-not-allowed disabled:opacity-60"
            style={{ background: "var(--color-brand)" }}
          >
            {submitting ? "Saving…" : "Save mood"}
          </motion.button>
        </div>
      </div>
    </div>
  )
}

function SliderRow({
  label,
  hint,
  value,
  onChange,
}: {
  label: string
  hint: string
  value: number
  onChange: (n: number) => void
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-medium text-[var(--color-text-primary)]">{label}</span>
        <span className="text-sm tabular-nums text-[var(--color-accent)]">{value}</span>
      </div>
      <p className="text-xs text-[var(--color-text-muted)]">{hint}</p>
      <input
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-full bg-[var(--color-border)] accent-[var(--color-brand)]"
        style={{ accentColor: "var(--color-brand)" }}
      />
    </div>
  )
}
