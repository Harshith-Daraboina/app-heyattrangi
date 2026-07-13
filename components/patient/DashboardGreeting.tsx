"use client"

import { useEffect, useState } from "react"

function getGreetingLabel(): "Good morning" | "Good afternoon" | "Good evening" {
  const h = new Date().getHours()
  if (h < 12) return "Good morning"
  if (h < 17) return "Good afternoon"
  return "Good evening"
}

export default function DashboardGreeting({ name }: { name: string }) {
  const [greeting, setGreeting] = useState<"Good morning" | "Good afternoon" | "Good evening">(
    "Good morning"
  )

  useEffect(() => {
    setGreeting(getGreetingLabel())
  }, [])

  return (
    <div className="pt-8 mb-8">
      <h1
        className="text-[var(--color-text-primary)]"
        style={{ fontSize: "var(--text-2xl)", fontWeight: 600 }}
      >
        {greeting}, {name}
      </h1>
      <p
        className="mt-1 text-[var(--color-text-secondary)]"
        style={{ fontSize: "var(--text-base)" }}
      >
        How are you feeling today?
      </p>
    </div>
  )
}
