import { Suspense } from "react"
import { auth } from "@/auth.config"
import TryPragyaChat from "@/components/ai-bot/TryPragyaChat"
import AIBotSkeleton from "@/components/ai-bot/AIBotSkeleton"

async function AIBotContent() {
  const session = await auth()
  
  if (!session?.user) return null

  const sessionId = `patient_${session.user.id}`

  return (
    <div className="flex-1 min-w-0 h-full flex flex-col relative w-full overflow-hidden bg-[var(--color-bg)]">
      <TryPragyaChat sessionId={sessionId} />
    </div>
  )
}

export default function AIBotPage() {
  return (
    <Suspense fallback={<AIBotSkeleton />}>
      <AIBotContent />
    </Suspense>
  )
}
