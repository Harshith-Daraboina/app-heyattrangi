// Default Hugging Face Space: Heyattrangi-spaces/Bot-Heyattrangi-V4
const DEFAULT_BOT_BASE = "https://heyattrangi-spaces-bot-heyattrangi-v4.hf.space"

export function getPragyaUpstreamBase(): string {
  const raw =
    process.env.BOT_API_URL?.trim() ||
    process.env.PRAGYA_BOT_API_URL?.trim() ||
    DEFAULT_BOT_BASE
  return raw.replace(/\/$/, "")
}
