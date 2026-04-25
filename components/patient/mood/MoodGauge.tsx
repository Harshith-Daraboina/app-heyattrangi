"use client"

import { motion } from "framer-motion"
import { MOOD_OPTIONS, type MoodKey } from "@/lib/mood/constants"

interface MoodGaugeProps {
  selectedMood: MoodKey | null
  onSelect: (key: MoodKey) => void
}

export default function MoodGauge({ selectedMood, onSelect }: MoodGaugeProps) {
  // Map moods to angles on a semi-circle
  // -90deg is far left (Very Bad), 90deg is far right (Great)
  const moodAngles: Record<MoodKey, number> = {
    VERY_BAD: -72,
    BAD: -36,
    NEUTRAL: 0,
    GOOD: 36,
    GREAT: 72,
  }

  const activeAngle = selectedMood ? moodAngles[selectedMood] : 0
  const selectedOption = MOOD_OPTIONS.find((m) => m.key === selectedMood)

  // Colors for segments
  const colors = {
    VERY_BAD: "#F87171", // Red
    BAD: "#FB923C",      // Orange
    NEUTRAL: "#FBBF24",  // Yellow
    GOOD: "#34D399",     // Green
    GREAT: "#818CF8",    // Indigo
  }

  return (
    <div className="relative flex flex-col items-center">
      {/* Gauge Container */}
      <div className="relative h-48 w-80 overflow-hidden sm:h-56 sm:w-96">
        {/* SVG Gauge Background */}
        <svg viewBox="0 0 200 120" className="absolute bottom-0 left-0 w-full">
          {/* Base Background Track (Optional, but gives a finished feel) */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="var(--color-border)"
            strokeWidth="35"
            strokeLinecap="butt"
            className="opacity-10"
          />
          
          {/* 
            Segments: 180deg total / 5 = 36deg per segment
            Center: (100, 100), Radius: 80
          */}
          
          {/* Very Bad: 180deg to 144deg */}
          <path
            d="M 20 100 A 80 80 0 0 1 35.3 53.0"
            fill="none"
            stroke={colors.VERY_BAD}
            strokeWidth="35"
            className="cursor-pointer transition-all hover:brightness-95"
            onClick={() => onSelect("VERY_BAD")}
          />
          {/* Bad: 144deg to 108deg */}
          <path
            d="M 35.3 53.0 A 80 80 0 0 1 75.3 23.9"
            fill="none"
            stroke={colors.BAD}
            strokeWidth="35"
            className="cursor-pointer transition-all hover:brightness-95"
            onClick={() => onSelect("BAD")}
          />
          {/* Neutral: 108deg to 72deg */}
          <path
            d="M 75.3 23.9 A 80 80 0 0 1 124.7 23.9"
            fill="none"
            stroke={colors.NEUTRAL}
            strokeWidth="35"
            className="cursor-pointer transition-all hover:brightness-95"
            onClick={() => onSelect("NEUTRAL")}
          />
          {/* Good: 72deg to 36deg */}
          <path
            d="M 124.7 23.9 A 80 80 0 0 1 164.7 53.0"
            fill="none"
            stroke={colors.GOOD}
            strokeWidth="35"
            className="cursor-pointer transition-all hover:brightness-95"
            onClick={() => onSelect("GOOD")}
          />
          {/* Great: 36deg to 0deg */}
          <path
            d="M 164.7 53.0 A 80 80 0 0 1 180 100"
            fill="none"
            stroke={colors.GREAT}
            strokeWidth="35"
            className="cursor-pointer transition-all hover:brightness-95"
            onClick={() => onSelect("GREAT")}
          />
        </svg>

        {/* Needle/Indicator - Pivoting from center (100, 100) */}
        <div className="absolute bottom-[20px] left-1/2 -translate-x-1/2">
          <motion.div
            className="relative h-24 w-8 origin-bottom"
            initial={false}
            animate={{ rotate: activeAngle }}
            transition={{ type: "spring", stiffness: 80, damping: 15 }}
          >
            {/* The Needle Line */}
            <div className="absolute top-0 left-1/2 h-20 w-1.5 -translate-x-1/2 rounded-full bg-[var(--color-text-primary)]" />
            {/* The Pivot Point */}
            <div className="absolute bottom-0 left-1/2 h-5 w-5 -translate-x-1/2 translate-y-1/2 rounded-full bg-[var(--color-text-primary)] border-4 border-[var(--color-bg)]" />
          </motion.div>
        </div>
      </div>

      {/* Central Emoji & Label */}
      <div className="mt-12 text-center">
        <motion.div
          key={selectedMood}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-7xl sm:text-8xl mb-4 drop-shadow-sm"
        >
          {selectedOption?.emoji ?? "😶"}
        </motion.div>
        <p className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
          {selectedOption ? `I Feel ${selectedOption.label}.` : "How are you feeling?"}
        </p>
      </div>

      {/* Quick Selection Chips */}
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        {MOOD_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            onClick={() => onSelect(opt.key)}
            className={`rounded-2xl px-6 py-2.5 text-sm font-bold transition-all ${
              selectedMood === opt.key
                ? "bg-[var(--color-brand)] text-white shadow-xl shadow-orange-200 scale-105"
                : "bg-white text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-[var(--color-brand)]"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
