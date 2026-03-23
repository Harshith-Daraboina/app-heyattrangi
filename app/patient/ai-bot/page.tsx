import Sidebar from "@/components/patient/Sidebar"
import TryPragyaChat from "@/components/ai-bot/TryPragyaChat"
import { auth } from "@/auth.config"
import { redirect } from "next/navigation"

export default async function AIBotPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/auth/signin")
  }

  const sessionId = `patient_${session.user.id}`

  return (
    <div className="flex h-screen w-full bg-[var(--color-bg)] text-[var(--color-text-primary)] overflow-hidden">
      <Sidebar />
      <div className="flex-1 min-w-0 h-full flex flex-col relative w-full overflow-hidden">
        <TryPragyaChat sessionId={sessionId} />
      </div>
    </div>
  )
}
