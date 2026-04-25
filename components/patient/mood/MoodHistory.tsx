"use client"

import { useMemo } from "react"
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns"
import { motion } from "framer-motion"
import type { MoodEntryRow } from "./MoodTrackerClient"

interface MoodHistoryProps {
  entries: MoodEntryRow[]
}

export default function MoodHistory({ entries }: MoodHistoryProps) {
  // 1. Line Graph Data (Last 7 days)
  const last7Days = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const date = subDays(new Date(), 6 - i)
      const dayEntries = entries.filter((e) => isSameDay(new Date(e.created_at), date))
      const avgScore = dayEntries.length > 0 
        ? dayEntries.reduce((acc, curr) => acc + curr.mood_score, 0) / dayEntries.length 
        : null
      return {
        date,
        label: format(date, "EEE"),
        score: avgScore
      }
    })
  }, [entries])

  // 2. Calendar Data (Current Month)
  const calendarDays = useMemo(() => {
    const start = startOfMonth(new Date())
    const end = endOfMonth(new Date())
    return eachDayOfInterval({ start, end })
  }, [])

  // Line Graph SVG Path calculation
  const chartHeight = 100
  const chartWidth = 300
  const points = last7Days
    .map((d, i) => {
      if (d.score === null) return null
      const x = (i / (last7Days.length - 1)) * chartWidth
      const y = chartHeight - ((d.score - 1) / 9) * chartHeight
      return `${x},${y}`
    })
    .filter(Boolean)
    .join(" ")

  return (
    <div className="space-y-8 pb-10">
      {/* 1. Trend Card */}
      <section className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Your Progress</h3>
        <p className="mb-6 text-sm text-[var(--color-text-secondary)]">Mood trends over the last week</p>
        
        <div className="relative h-40 w-full">
          {/* Simple SVG Chart */}
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="h-full w-full overflow-visible" preserveAspectRatio="none">
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((line) => (
              <line key={line} x1="0" y1={line} x2={chartWidth} y2={line} stroke="var(--color-border)" strokeWidth="0.5" strokeDasharray="4 4" />
            ))}
            
            {/* The Line */}
            {points && (
              <polyline
                fill="none"
                stroke="var(--color-brand)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
              />
            )}
            
            {/* Points */}
            {last7Days.map((d, i) => {
              if (d.score === null) return null
              const x = (i / (last7Days.length - 1)) * chartWidth
              const y = chartHeight - ((d.score - 1) / 9) * chartHeight
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r="4"
                  fill="white"
                  stroke="var(--color-brand)"
                  strokeWidth="2"
                />
              )
            })}
          </svg>
          
          {/* X-Axis Labels */}
          <div className="mt-4 flex justify-between">
            {last7Days.map((d) => (
              <span key={d.label} className="text-[10px] font-medium uppercase text-[var(--color-text-muted)]">
                {d.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Calendar Card */}
      <section className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">{format(new Date(), "MMMM yyyy")}</h3>
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
            <span key={day} className="text-center text-[10px] font-bold text-[var(--color-text-muted)]">
              {day}
            </span>
          ))}
          {calendarDays.map((date) => {
            const dayEntries = entries.filter((e) => isSameDay(new Date(e.created_at), date))
            const hasEntry = dayEntries.length > 0
            const avgScore = hasEntry 
              ? dayEntries.reduce((acc, curr) => acc + curr.mood_score, 0) / dayEntries.length 
              : null
            
            return (
              <div
                key={date.toISOString()}
                className="group relative flex aspect-square items-center justify-center rounded-lg text-xs"
                style={{
                  backgroundColor: avgScore 
                    ? `rgba(232, 114, 42, ${Math.min(1, (avgScore / 10) + 0.1)})` 
                    : "var(--color-surface-raised)",
                  color: avgScore ? "white" : "var(--color-text-secondary)",
                }}
              >
                {format(date, "d")}
                {hasEntry && (
                  <div className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-white opacity-50" />
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* 3. Recent Logs */}
      <section>
        <h3 className="mb-4 text-lg font-semibold text-[var(--color-text-primary)]">Recent Entries</h3>
        <div className="space-y-4">
          {entries.slice(0, 10).map((e) => (
            <motion.div
              key={e.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">
                  {e.mood === "VERY_BAD" ? "😞" : e.mood === "BAD" ? "😕" : e.mood === "NEUTRAL" ? "😐" : e.mood === "GOOD" ? "🙂" : "😄"}
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-[var(--color-text-primary)]">
                      {format(new Date(e.created_at), "EEEE, MMM d")}
                    </p>
                    <span className="text-xs text-[var(--color-text-muted)]">
                      {format(new Date(e.created_at), "h:mm a")}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {e.tags.map((t) => (
                      <span key={t} className="rounded-full bg-[var(--color-surface-raised)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-text-secondary)] border border-[var(--color-border)]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              {e.note && (
                <p className="mt-3 text-sm italic text-[var(--color-text-secondary)] border-l-2 border-[var(--color-brand)] pl-3">
                  "{e.note}"
                </p>
              )}
            </motion.div>
          ))}
          {entries.length === 0 && (
            <div className="py-10 text-center">
              <p className="text-[var(--color-text-secondary)]">No entries yet. Start your journey today!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
