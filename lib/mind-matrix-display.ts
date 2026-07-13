/**
 * Presentation-only mapping from API `riskLevel` to Mind Matrix UI (0–100 score, band, copy).
 * Does not change server-side risk calculation in /api/ai/wellness-check.
 */
export type MindMatrixPresentation = {
  displayScore: number
  bandLabel: string
  contextMessage: string
}

function getBandAndMessageFromScore(score: number): {
  bandLabel: string
  contextMessage: string
} {
  if (score >= 85) {
    return {
      bandLabel: "Sharp",
      contextMessage:
        "Your mind is firing on all cylinders today.",
    }
  }
  if (score >= 70) {
    return {
      bandLabel: "Focused",
      contextMessage:
        "You are thinking clearly and processing well.",
    }
  }
  if (score >= 55) {
    return {
      bandLabel: "Steady",
      contextMessage: "A solid baseline — consistent and reliable.",
    }
  }
  if (score >= 40) {
    return {
      bandLabel: "Drifting",
      contextMessage:
        "Your focus may be scattered. Rest could help.",
    }
  }
  return {
    bandLabel: "Foggy",
    contextMessage:
      "Your mind seems tired today. That is okay.",
  }
}

/** Map API risk tier to a representative score inside the matching band. */
export function mindMatrixFromRiskLevel(riskLevel: string): MindMatrixPresentation {
  const tier = riskLevel.trim()
  let displayScore: number
  switch (tier) {
    case "Low":
      displayScore = 92
      break
    case "Mild":
      displayScore = 77
      break
    case "Moderate":
      displayScore = 62
      break
    case "High":
      displayScore = 28
      break
    default:
      displayScore = 55
      break
  }
  const { bandLabel, contextMessage } = getBandAndMessageFromScore(displayScore)
  return { displayScore, bandLabel, contextMessage }
}
