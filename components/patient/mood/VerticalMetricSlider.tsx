"use client"

import { motion } from "framer-motion"

interface VerticalMetricSliderProps {
  label: string
  value: number
  onChange: (value: number) => void
  markers: { value: number; label: string; emoji: string; subtext?: string }[]
}

export default function VerticalMetricSlider({
  label,
  value,
  onChange,
  markers,
}: VerticalMetricSliderProps) {
  // Normalize value 1-10 to percentage 0-100 for visual position
  // 1 is at bottom (0%), 10 is at top (100%)
  const percentage = ((value - 1) / 9) * 100

  return (
    <div className="flex h-[400px] w-full flex-col items-center sm:h-[450px]">
      <h3 className="mb-8 text-center text-lg font-semibold text-[var(--color-text-primary)]">
        {label}
      </h3>
      
      <div className="flex h-full w-full max-w-[280px] items-center justify-between">
        {/* Left side: Labels */}
        <div className="flex h-full flex-col justify-between py-2 pr-4 text-right">
          {markers.map((marker) => (
            <div key={marker.label} className="flex flex-col">
              <span className="text-sm font-bold text-[var(--color-text-primary)]">
                {marker.label}
              </span>
              {marker.subtext && (
                <span className="text-[10px] text-[var(--color-text-muted)]">
                  {marker.subtext}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Center: Slider Track */}
        <div className="relative h-full w-4 flex-col items-center">
          <div className="absolute inset-y-0 left-1/2 w-2 -translate-x-1/2 rounded-full bg-[var(--color-border)] opacity-30" />
          
          {/* Active Track (Bottom up) */}
          <motion.div 
            className="absolute bottom-0 left-1/2 w-2 -translate-x-1/2 rounded-full bg-[var(--color-brand)]"
            initial={false}
            animate={{ height: `${percentage}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />

          {/* Hidden range input for accessibility and touch interaction */}
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value))}
            className="absolute inset-0 z-20 h-full w-full cursor-pointer opacity-0 [writing-mode:bt-lr] appearance-slider-vertical"
            style={{ WebkitAppearance: "slider-vertical" }}
          />

          {/* Visual Thumb */}
          <motion.div
            className="absolute left-1/2 z-10 -ml-4 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-xl border-2 border-[var(--color-brand)]"
            initial={false}
            animate={{ bottom: `${percentage}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="h-2 w-2 rounded-full bg-[var(--color-brand)]" />
          </motion.div>
        </div>

        {/* Right side: Emojis */}
        <div className="flex h-full flex-col justify-between py-1 pl-4">
          {markers.map((marker) => (
            <button
              key={marker.emoji}
              onClick={() => onChange(marker.value)}
              className={`flex h-10 w-10 items-center justify-center rounded-full text-2xl transition-all ${
                Math.abs(value - marker.value) <= 1
                  ? "bg-[var(--color-surface)] shadow-md scale-110"
                  : "grayscale opacity-40 hover:grayscale-0 hover:opacity-100"
              }`}
            >
              {marker.emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
