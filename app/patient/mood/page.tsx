import Link from "next/link"
import { redirect } from "next/navigation"
import { auth } from "@/auth.config"
import { getCurrentUser } from "@/lib/auth"
import Sidebar from "@/components/patient/Sidebar"

export default async function MoodTrackerPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/auth/signin")
  }

  const user = await getCurrentUser()

  if (!user || (user.role !== "PATIENT" && user.role !== "CAREGIVER")) {
    redirect("/auth/unauthorized")
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)]">
      <div className="grid min-h-screen lg:grid-cols-[82px_1fr]">
        <Sidebar />

        <div className="flex min-h-screen min-w-0 flex-col">
          <header className="sticky top-0 z-10 border-b border-[var(--color-border)] bg-[var(--color-surface)]/95 backdrop-blur">
            <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
              <div>
                <h1
                  className="font-semibold text-[var(--color-text-primary)]"
                  style={{ fontSize: "var(--text-xl)" }}
                >
                  Mood tracker
                </h1>
                <p
                  className="mt-0.5 text-[var(--color-text-secondary)]"
                  style={{ fontSize: "var(--text-sm)" }}
                >
                  Quick check-ins for how you feel
                </p>
              </div>
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-[var(--color-brand)]"
                style={{ background: "var(--color-brand-light)" }}
                aria-hidden
              >
                M
              </div>
            </div>
          </header>

          <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-md text-center">
              <p
                className="font-semibold text-[var(--color-text-primary)]"
                style={{ fontSize: "var(--text-2xl)" }}
              >
                In progress
              </p>
              <p
                className="mt-3 text-[var(--color-text-secondary)]"
                style={{ fontSize: "var(--text-base)", lineHeight: "var(--leading-loose)" }}
              >
                We&apos;re building a gentle way to log your mood. Check back soon, or continue with your
                wellness screening when you&apos;re ready.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link
                  href="/patient/dashboard"
                  className="inline-flex items-center justify-center rounded-[var(--radius-md)] px-5 py-3 font-medium text-white transition-opacity hover:opacity-95"
                  style={{ background: "var(--color-brand)" }}
                >
                  Back to home
                </Link>
                <Link
                  href="/patient/ai-bot/screening"
                  className="inline-flex items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-accent)] px-5 py-3 font-medium text-[var(--color-accent)] transition-opacity hover:opacity-90"
                >
                  Wellness screening
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
