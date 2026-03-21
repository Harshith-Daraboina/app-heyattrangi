"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import {
  animate,
  useMotionValue,
  useMotionValueEvent,
} from "framer-motion"
import { mindMatrixFromRiskLevel } from "@/lib/mind-matrix-display"

type Props = {
  riskLevel: string
}

export default function MindMatrixResult({ riskLevel }: Props) {
  const { displayScore, bandLabel, contextMessage } =
    mindMatrixFromRiskLevel(riskLevel)

  const count = useMotionValue(0)
  const [display, setDisplay] = useState(0)

  useMotionValueEvent(count, "change", (v) => {
    setDisplay(Math.round(v))
  })

  useEffect(() => {
    count.set(0)
    setDisplay(0)
    const controls = animate(count, displayScore, {
      duration: 1.5,
      ease: "easeOut",
    })
    return () => {
      controls.stop()
    }
  }, [count, displayScore, riskLevel])

  return (
    <div
      className="flex w-full flex-col items-center justify-center px-4 pt-16 pb-12"
      style={{
        minHeight: "min(100dvh, 900px)",
        background: "var(--color-bg)",
      }}
    >
      <div className="flex w-full max-w-lg flex-col items-center text-center">
        <div className="flex flex-wrap items-end justify-center gap-1">
          <span
            className="tabular-nums leading-none text-[var(--color-brand)]"
            style={{ fontSize: 72, fontWeight: 700 }}
          >
            {display}
          </span>
          <span
            className="pb-2 text-[var(--color-text-secondary)]"
            style={{ fontSize: "var(--text-xl)" }}
          >
            /100
          </span>
        </div>

        <p
          className="mt-4 text-[var(--color-text-primary)]"
          style={{ fontSize: "var(--text-2xl)", fontWeight: 600 }}
        >
          {bandLabel}
        </p>

        <p
          className="mx-auto mt-4 max-w-[400px] text-center text-[var(--color-text-secondary)]"
          style={{
            fontSize: "var(--text-base)",
            lineHeight: "var(--leading-loose)",
          }}
        >
          {contextMessage}
        </p>

        <div className="mt-10 flex w-full max-w-[300px] flex-col gap-3">
          <Link
            href="/patient/ai-bot"
            className="block w-full text-center font-medium text-white transition-opacity hover:opacity-95"
            style={{
              background: "var(--color-brand)",
              borderRadius: "var(--radius-md)",
              padding: "12px 28px",
              fontWeight: 500,
            }}
          >
            Talk to your companion
          </Link>
          <Link
            href="/patient/dashboard"
            className="block w-full text-center font-medium transition-opacity hover:opacity-90"
            style={{
              background: "transparent",
              color: "var(--color-accent)",
              border: "1px solid var(--color-accent)",
              borderRadius: "var(--radius-md)",
              padding: "12px 28px",
              fontWeight: 500,
            }}
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
