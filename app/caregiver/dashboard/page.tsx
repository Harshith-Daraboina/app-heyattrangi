import type { ReactNode } from "react"
import { redirect } from "next/navigation"
import { auth } from "@/auth.config"
import { getCurrentUser } from "@/lib/auth"
import Link from "next/link"
import SignOutButton from "@/components/auth/SignOutButton"

type IconProps = { className?: string }
const iconBase = "h-5 w-5 stroke-[1.6]"
const HomeIcon = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    className={`${iconBase} ${className ?? ""}`}
  >
    <path d="M4 11.5 12 5l8 6.5V20a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-4H10v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" />
  </svg>
)
const CalendarIcon = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    className={`${iconBase} ${className ?? ""}`}
  >
    <rect x="4" y="5" width="16" height="15" rx="2" />
    <path d="M9 3v4M15 3v4M4 10h16" />
  </svg>
)
const UserIcon = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    className={`${iconBase} ${className ?? ""}`}
  >
    <circle cx="12" cy="8" r="4" />
    <path d="M6 20c0-3.314 2.686-6 6-6s6 2.686 6 6" />
  </svg>
)
const navItems: { label: string; href: string; icon: ReactNode }[] = [
  { label: "Home", href: "/caregiver/dashboard", icon: <HomeIcon /> },
  { label: "Schedule", href: "/patient/appointments", icon: <CalendarIcon /> },
  { label: "Browse", href: "/patient/therapists", icon: <UserIcon /> },
  { label: "Profile", href: "/patient/profile", icon: <UserIcon /> },
]

const quickActions = [
  {
    title: "Book a session",
    description: "Find a therapist for your dependent",
    href: "/patient/therapists",
    accent: "from-teal-500 to-emerald-500",
  },
  {
    title: "Mood tracker",
    description: "Support mood check-ins together",
    href: "/patient/mood",
    accent: "from-indigo-500 to-purple-500",
  },
  {
    title: "AI Chat",
    description: "AI companion for your dependent",
    href: "/patient/ai-bot",
    accent: "from-blue-500 to-cyan-500",
  },
  {
    title: "Update profile",
    description: "Contact info and preferences",
    href: "/patient/profile",
    accent: "from-orange-500 to-amber-500",
  },
]

const supportCards = [
  {
    title: "Next appointment",
    subtitle: "Schedule a session for your dependent",
    status: "No bookings yet",
    accent: "from-orange-200 via-amber-200 to-orange-100",
  },
  {
    title: "Wellness check-ins",
    subtitle: "Mood logging and companion support",
    status: "Open mood or AI Chat",
    accent: "from-blue-200 via-sky-200 to-cyan-100",
  },
  {
    title: "Mind Matrix",
    subtitle: "Guided screening when they’re ready",
    status: "Start from the patient home",
    accent: "from-emerald-200 via-teal-200 to-green-100",
  },
]

export default async function CaregiverDashboard() {
  const session = await auth()

  if (!session?.user) {
    redirect("/auth/signin")
  }

  const user = await getCurrentUser()

  if (!user || user.role !== "CAREGIVER") {
    redirect("/auth/unauthorized")
  }

  const displayName = session.user.name || "Caregiver"
  const initial = displayName.charAt(0).toUpperCase()

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900">
      <div className="grid min-h-screen lg:grid-cols-[82px_1fr]">
        {/* Side rail */}
        <aside className="hidden lg:flex flex-col gap-4 border-r border-slate-200 bg-white/90 backdrop-blur px-3 py-6">
          <Link
            href="/caregiver/dashboard"
            className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 text-white font-semibold"
          >
            C
          </Link>
          <div className="flex-1 space-y-2">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-1 rounded-xl px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-teal-600 transition-colors"
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
          <div className="pt-4 border-t border-slate-200 text-center">
            <SignOutButton />
          </div>
        </aside>

        {/* Main column */}
        <div className="flex flex-col">
          <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
            <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 gap-4">
              <div className="flex items-center gap-3">
                <div className="text-sm text-slate-500">Caregiver dashboard</div>
                <div className="hidden sm:block h-4 w-px bg-slate-200" />
                <div className="relative">
                  <input
                    type="search"
                    placeholder="Search therapists and sessions"
                    className="w-64 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm outline-none focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col text-right leading-tight">
                  <span className="text-sm font-semibold text-slate-800">{displayName}</span>
                  <span className="text-xs text-slate-500 truncate max-w-[220px]">
                    {session.user.email}
                  </span>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 text-white text-lg">
                  {initial}
                </div>
                <div className="sm:hidden">
                  <SignOutButton />
                </div>
              </div>
            </div>
          </header>

          <main className="px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Hero */}
            <div className="rounded-2xl bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 text-white p-6 sm:p-8 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-wide text-white/80">Welcome</p>
                  <h1 className="text-3xl sm:text-4xl font-semibold mt-1">{displayName}</h1>
                  <p className="text-white/80 mt-2">
                    Support your loved one with clear steps and quick shortcuts.
                  </p>
                </div>
                <Link
                  href="/patient/appointments"
                  className="inline-flex items-center justify-center rounded-full bg-white text-teal-700 px-4 py-2 text-sm font-semibold shadow-sm hover:bg-slate-50 transition-colors"
                >
                  View care schedule
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {[
                { label: "Upcoming sessions", value: "0", hint: "Book the next one", color: "text-teal-600" },
                { label: "Mood check-ins", value: "—", hint: "Patient mood page", color: "text-emerald-600" },
                { label: "Companion use", value: "—", hint: "AI Chat", color: "text-blue-600" },
                { label: "Notes added", value: "—", hint: "Coming soon", color: "text-purple-600" },
              ].map(card => (
                <div
                  key={card.label}
                  className="rounded-xl bg-white border border-slate-200 p-4 shadow-sm"
                >
                  <p className="text-sm text-slate-500">{card.label}</p>
                  <p className={`text-3xl font-bold mt-2 ${card.color}`}>{card.value}</p>
                  <p className="text-xs text-slate-500 mt-1">{card.hint}</p>
                </div>
              ))}
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {quickActions.map(action => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div
                    className={`absolute inset-0 opacity-10 bg-gradient-to-br ${action.accent}`}
                    aria-hidden
                  />
                  <div className="relative">
                    <p className="text-sm font-semibold text-slate-900">{action.title}</p>
                    <p className="text-xs text-slate-600 mt-1">{action.description}</p>
                    <span className="mt-3 inline-flex text-xs font-semibold text-teal-700">
                      Go →
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Support cards */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Care at a glance</h2>
                  <p className="text-sm text-slate-600">
                    Sessions, wellness tools, and care coordination
                  </p>
                </div>
                <Link
                  href="/patient/profile"
                  className="text-sm font-semibold text-teal-600 hover:text-teal-700"
                >
                  Update details
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {supportCards.map(card => (
                  <div
                    key={card.title}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className={`h-32 bg-gradient-to-br ${card.accent}`} />
                    <div className="p-4 space-y-1">
                      <h3 className="text-lg font-semibold text-slate-900">{card.title}</h3>
                      <p className="text-sm text-slate-600">{card.subtitle}</p>
                      <p className="text-sm font-semibold text-slate-900">{card.status}</p>
                      <Link
                        href="/patient/appointments"
                        className="text-sm font-semibold text-teal-600 hover:text-teal-700"
                      >
                        Manage →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Care reminders & links */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-slate-900">Care reminders</h3>
                  <Link
                    href="/patient/mood"
                    className="text-sm font-semibold text-teal-600 hover:text-teal-700"
                  >
                    Open mood
                  </Link>
                </div>
                <div className="space-y-2 text-sm text-slate-600">
                  <p>• Note any mood or behavior changes</p>
                  <p>• Encourage a mood check-in or chat with AI Chat if it helps</p>
                  <p>• Plan the next session time</p>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Quick links</h3>
                <div className="space-y-2 text-sm">
                  <Link href="/patient/profile" className="block rounded-lg px-3 py-2 hover:bg-slate-100">
                    Update dependent info
                  </Link>
                  <Link href="/patient/appointments" className="block rounded-lg px-3 py-2 hover:bg-slate-100">
                    View schedule
                  </Link>
                  <Link href="/patient/therapists" className="block rounded-lg px-3 py-2 hover:bg-slate-100">
                    Browse therapists
                  </Link>
                  <Link href="/patient/ai-bot" className="block rounded-lg px-3 py-2 hover:bg-slate-100">
                    Open AI Chat
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

