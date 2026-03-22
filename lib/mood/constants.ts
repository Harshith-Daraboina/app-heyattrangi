export const MOOD_KEYS = ["VERY_BAD", "BAD", "NEUTRAL", "GOOD", "GREAT"] as const
export type MoodKey = (typeof MOOD_KEYS)[number]

export const MOOD_OPTIONS: { key: MoodKey; emoji: string; label: string; defaultScore: number }[] = [
  { key: "VERY_BAD", emoji: "😞", label: "Very bad", defaultScore: 2 },
  { key: "BAD", emoji: "😕", label: "Bad", defaultScore: 4 },
  { key: "NEUTRAL", emoji: "😐", label: "Neutral", defaultScore: 5 },
  { key: "GOOD", emoji: "🙂", label: "Good", defaultScore: 7 },
  { key: "GREAT", emoji: "😄", label: "Great", defaultScore: 9 },
]

export const PRESET_TAGS = [
  "Stress",
  "Anxiety",
  "Depression",
  "Overwhelm",
  "Sensory overload",
  "Masking",
  "Social fatigue",
  "Burnout",
  "Sleep",
  "Focus",
  "Loneliness",
  "Routine change",
] as const

export const COPING_SUGGESTIONS: Record<MoodKey, string[]> = {
  VERY_BAD: [
    "Try a slow breathing exercise: inhale 4 counts, hold 2, exhale 6.",
    "Reach out to someone you trust, even with a short message.",
    "Ground yourself: name 5 things you can see and 3 you can touch.",
  ],
  BAD: [
    "Take a 10-minute walk or stretch away from your screen.",
    "Have water or a small snack—sometimes mood follows the body.",
    "Write one sentence about what you need right now.",
  ],
  NEUTRAL: [
    "A tiny win counts: pick one small task and finish it.",
    "Step outside for fresh air if you can.",
    "Listen to one song you associate with calmer moments.",
  ],
  GOOD: [
    "Notice what helped today—you can revisit it tomorrow.",
    "Share a kind word with someone; it reinforces your own mood.",
    "Jot down one thing you’re glad about from today.",
  ],
  GREAT: [
    "Savor this moment; you earned it.",
    "Consider what conditions made today easier—repeat when you can.",
    "Your consistency with check-ins is building self-awareness.",
  ],
}
