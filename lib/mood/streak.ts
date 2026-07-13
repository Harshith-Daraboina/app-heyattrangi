/** UTC date key YYYY-MM-DD */
function toUtcDayKey(d: Date): string {
  return d.toISOString().slice(0, 10)
}

function addUtcDays(key: string, delta: number): string {
  const [y, m, day] = key.split("-").map(Number)
  const dt = new Date(Date.UTC(y, m - 1, day + delta))
  return dt.toISOString().slice(0, 10)
}

/**
 * Consecutive days with at least one check-in, anchored from today or yesterday
 * (so logging “yesterday only” still shows an active streak before today’s log).
 */
export function computeMoodStreak(createdAts: Date[]): number {
  const keys = new Set(createdAts.map(toUtcDayKey))
  if (keys.size === 0) return 0

  const today = toUtcDayKey(new Date())
  const yesterday = addUtcDays(today, -1)

  let anchor = today
  if (!keys.has(today) && keys.has(yesterday)) {
    anchor = yesterday
  } else if (!keys.has(today) && !keys.has(yesterday)) {
    return 0
  }

  let streak = 0
  let cursor = anchor
  while (keys.has(cursor)) {
    streak += 1
    cursor = addUtcDays(cursor, -1)
  }
  return streak
}
