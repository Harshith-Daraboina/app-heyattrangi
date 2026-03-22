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
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)]">
      <div className="grid min-h-screen lg:grid-cols-[82px_1fr]">
        <Sidebar />

        <div className="flex min-h-screen min-w-0 flex-col">
          <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <TryPragyaChat sessionId={sessionId} />
          </main>
        </div>
      </div>
    </div>
  )
}
