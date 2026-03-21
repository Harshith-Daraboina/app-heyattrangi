import { redirect } from "next/navigation"
import { auth } from "@/auth.config"
import { getCurrentUser } from "@/lib/auth"
import Link from "next/link"
import SignOutButton from "@/components/auth/SignOutButton"
import Sidebar from "@/components/patient/Sidebar"
import DashboardGreeting from "@/components/patient/DashboardGreeting"

const iconBase = "h-5 w-5 stroke-[1.6]"
const StarIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    className={`${iconBase} ${className ?? ""}`}
  >
    <path d="M12 3.5 14.6 9l6 .5-4.6 3.9 1.4 6-5.4-3.3L6.6 19l1.4-6L3.4 9.5l6-.5z" />
  </svg>
)

const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
)

const featuredTherapists = [
  {
    name: "Dr. Maya Rao",
    specialty: "Therapist • Anxiety, CBT",
    rating: "4.97 (55 reviews)",
    price: "₹1499 / session",
    accent: "from-orange-200 via-amber-200 to-orange-100",
  },
  {
    name: "Dr. Arjun Sen",
    specialty: "Therapist • Trauma, Mindfulness",
    rating: "4.95 (61 reviews)",
    price: "₹1299 / session",
    accent: "from-blue-200 via-sky-200 to-cyan-100",
  },
  {
    name: "Dr. Leena Shah",
    specialty: "Therapist • Couples, Family",
    rating: "4.93 (48 reviews)",
    price: "₹1399 / session",
    accent: "from-emerald-200 via-teal-200 to-green-100",
  },
]

const quickActions = [
  {
    title: "Find a therapist",
    description: "Browse experts and book a session",
    href: "/patient/therapists",
    accent: "from-teal-500 to-emerald-500",
  },
  {
    title: "Daily wellness",
    description: "Light tasks to keep you on track",
    href: "/patient/tasks",
    accent: "from-purple-500 to-pink-500",
  },
  {
    title: "Resource library",
    description: "Guides, tools, and exercises",
    href: "/patient/resources",
    accent: "from-blue-500 to-cyan-500",
  },
  {
    title: "My appointments",
    description: "Upcoming and past sessions",
    href: "/patient/appointments",
    accent: "from-indigo-500 to-purple-500",
  },
]

export default async function PatientDashboard() {
  const session = await auth()

  if (!session?.user) {
    redirect("/auth/signin")
  }

  const user = await getCurrentUser()

  if (!user || (user.role !== "PATIENT" && user.role !== "CAREGIVER")) {
    redirect("/auth/unauthorized")
  }

  const displayName = session.user.name || "You"
  const initial = displayName.charAt(0).toUpperCase()

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)]">
      <div className="grid min-h-screen lg:grid-cols-[82px_1fr]">
        <Sidebar />

        <div className="flex flex-col min-w-0">
          <header className="sticky top-0 z-10 border-b border-[var(--color-border)] bg-[var(--color-surface)]/95 backdrop-blur">
            <div className="max-w-[720px] mx-auto w-full flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="text-sm text-[var(--color-text-secondary)] shrink-0">
                  Dashboard
                </div>
                <div className="hidden sm:block h-4 w-px bg-[var(--color-border)] shrink-0" />
                <div className="relative min-w-0">
                  <input
                    type="search"
                    placeholder="Search therapists, sessions, resources"
                    className="w-full sm:w-64 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none focus:border-[var(--color-brand)] focus:ring-0"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="hidden sm:flex flex-col text-right leading-tight">
                  <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                    {displayName}
                  </span>
                  <span className="text-xs text-[var(--color-text-secondary)] truncate max-w-[220px]">
                    {session.user.email}
                  </span>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-brand)] text-white text-lg font-medium">
                  {initial}
                </div>
                <div className="sm:hidden">
                  <SignOutButton />
                </div>
              </div>
            </div>
          </header>

          <main className="px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-[720px] mx-auto w-full space-y-0">
              <DashboardGreeting name={displayName} />

              <Link
                href="/patient/ai-bot"
                className="flex items-center justify-between gap-4 w-full rounded-[var(--radius-lg)] p-6 text-white shadow-sm transition-opacity hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-dark)]"
                style={{ backgroundColor: "var(--color-brand)" }}
              >
                <div className="text-left min-w-0">
                  <p
                    className="font-semibold"
                    style={{ fontSize: "var(--text-xl)" }}
                  >
                    Talk to your companion
                  </p>
                  <p
                    className="mt-1"
                    style={{ fontSize: "var(--text-sm)", opacity: 0.85 }}
                  >
                    Your AI is ready to listen
                  </p>
                </div>
                <ChevronRightIcon className="h-6 w-6 shrink-0 opacity-90" />
              </Link>

              <div className="mt-4 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/patient/mood"
                  className="flex-1 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-shadow hover:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand)]"
                >
                  <p
                    className="font-medium text-[var(--color-text-primary)]"
                    style={{ fontSize: "var(--text-base)" }}
                  >
                    Log your mood
                  </p>
                  <p
                    className="mt-1 text-[var(--color-text-secondary)]"
                    style={{ fontSize: "var(--text-sm)" }}
                  >
                    Short check-in to track how you feel
                  </p>
                </Link>
                <Link
                  href="/patient/ai-bot/screening"
                  className="flex-1 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-shadow hover:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand)]"
                >
                  <p
                    className="font-medium text-[var(--color-text-primary)]"
                    style={{ fontSize: "var(--text-base)" }}
                  >
                    Take Mind Matrix
                  </p>
                  <p
                    className="mt-1 text-[var(--color-text-secondary)]"
                    style={{ fontSize: "var(--text-sm)" }}
                  >
                    Guided wellness screening
                  </p>
                </Link>
              </div>

              <details className="mt-10 group border border-[var(--color-border)] rounded-[var(--radius-lg)] bg-[var(--color-surface)] p-1">
                <summary className="cursor-pointer list-none px-4 py-3 font-medium text-[var(--color-text-primary)] rounded-[var(--radius-md)] hover:bg-[var(--color-surface-raised)] [&::-webkit-details-marker]:hidden flex items-center justify-between gap-2">
                  <span>Appointments, insights, and more</span>
                  <ChevronRightIcon className="h-5 w-5 shrink-0 text-[var(--color-text-secondary)] rotate-90 transition-transform group-open:-rotate-90" />
                </summary>
                <div className="px-4 pb-6 pt-2 space-y-8 border-t border-[var(--color-border)]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {[
                      {
                        label: "Upcoming sessions",
                        value: "0",
                        hint: "No bookings yet",
                        color: "text-teal-600",
                      },
                      {
                        label: "Tasks completed",
                        value: "0",
                        hint: "Stay consistent",
                        color: "text-emerald-600",
                      },
                      {
                        label: "Resources viewed",
                        value: "0",
                        hint: "Explore the library",
                        color: "text-blue-600",
                      },
                      {
                        label: "Mood check-ins",
                        value: "—",
                        hint: "Coming soon",
                        color: "text-purple-600",
                      },
                    ].map((card) => (
                      <div
                        key={card.label}
                        className="rounded-xl bg-[var(--color-surface-raised)] border border-[var(--color-border)] p-4 shadow-sm"
                      >
                        <p className="text-sm text-[var(--color-text-secondary)]">
                          {card.label}
                        </p>
                        <p className={`text-3xl font-bold mt-2 ${card.color}`}>
                          {card.value}
                        </p>
                        <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                          {card.hint}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    {quickActions.map((action) => (
                      <Link
                        key={action.href}
                        href={action.href}
                        className="relative overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div
                          className={`absolute inset-0 opacity-10 bg-gradient-to-br ${action.accent}`}
                          aria-hidden
                        />
                        <div className="relative">
                          <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                            {action.title}
                          </p>
                          <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                            {action.description}
                          </p>
                          <span className="mt-3 inline-flex text-xs font-semibold text-[var(--color-brand)]">
                            Go →
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>

                  <section className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
                          Recommended therapists
                        </h2>
                        <p className="text-sm text-[var(--color-text-secondary)]">
                          Curated for you based on your preferences
                        </p>
                      </div>
                      <Link
                        href="/patient/therapists"
                        className="text-sm font-semibold text-[var(--color-brand)] hover:opacity-90"
                      >
                        View all
                      </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {featuredTherapists.map((item) => (
                        <div
                          key={item.name}
                          className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className={`h-36 bg-gradient-to-br ${item.accent}`} />
                          <div className="p-4 space-y-2">
                            <div className="flex items-center gap-2 text-amber-600 text-sm font-semibold">
                              <StarIcon className="h-4 w-4 text-amber-500" />
                              <span className="text-[var(--color-text-primary)]">
                                {item.rating}
                              </span>
                            </div>
                            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                              {item.name}
                            </h3>
                            <p className="text-sm text-[var(--color-text-secondary)]">
                              {item.specialty}
                            </p>
                            <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                              {item.price}
                            </p>
                            <Link
                              href="/patient/therapists"
                              className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-[var(--color-brand)] px-4 py-2 text-sm font-semibold text-white hover:opacity-95 transition-opacity"
                            >
                              Book now
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                          Your next steps
                        </h3>
                        <Link
                          href="/patient/tasks"
                          className="text-sm font-semibold text-[var(--color-brand)] hover:opacity-90"
                        >
                          Open tasks
                        </Link>
                      </div>
                      <div className="space-y-2 text-sm text-[var(--color-text-secondary)]">
                        <p>• Complete a 5-minute grounding exercise</p>
                        <p>• Review progress notes from your last session</p>
                        <p>• Bookmark one new resource for the week</p>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm">
                      <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-3">
                        Quick links
                      </h3>
                      <div className="space-y-2 text-sm">
                        <Link
                          href="/patient/profile"
                          className="block rounded-lg px-3 py-2 hover:bg-[var(--color-surface-raised)] text-[var(--color-text-primary)]"
                        >
                          Update profile
                        </Link>
                        <Link
                          href="/patient/appointments"
                          className="block rounded-lg px-3 py-2 hover:bg-[var(--color-surface-raised)] text-[var(--color-text-primary)]"
                        >
                          See all appointments
                        </Link>
                        <Link
                          href="/patient/resources"
                          className="block rounded-lg px-3 py-2 hover:bg-[var(--color-surface-raised)] text-[var(--color-text-primary)]"
                        >
                          Explore resources
                        </Link>
                        <Link
                          href="/patient/tasks"
                          className="block rounded-lg px-3 py-2 hover:bg-[var(--color-surface-raised)] text-[var(--color-text-primary)]"
                        >
                          Manage daily tasks
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </details>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
