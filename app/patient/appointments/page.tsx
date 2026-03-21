import { redirect } from "next/navigation"
import { auth } from "@/auth.config"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import SignOutButton from "@/components/auth/SignOutButton"
import AppointmentsList from "@/components/appointments/AppointmentsList"

export default async function AppointmentsPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/auth/signin")
  }

  const user = await getCurrentUser()

  if (!user || (user.role !== "PATIENT" && user.role !== "CAREGIVER")) {
    redirect("/auth/unauthorized")
  }

  // Find patient profile
  const patient = await prisma.patient.findUnique({
    where: { userId: user.id },
  })

  if (!patient) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)]">
        <nav className="border-b border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <Link
                href="/patient/dashboard"
                className="text-xl font-semibold text-[var(--color-text-primary)]"
              >
                Attrangi
              </Link>
              <SignOutButton />
            </div>
          </div>
        </nav>
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center shadow-sm">
            <h2 className="mb-4 text-2xl font-semibold text-[var(--color-text-primary)]">
              Finish setting up your profile
            </h2>
            <p className="mb-6 text-[var(--color-text-secondary)]">
              Add a few details so we can show your appointments here when you book.
            </p>
            <Link
              href="/patient/profile"
              className="inline-block rounded-[var(--radius-md)] px-6 py-3 font-medium text-white transition-opacity hover:opacity-95"
              style={{ background: "var(--color-brand)" }}
            >
              Complete profile
            </Link>
          </div>
        </main>
      </div>
    )
  }

  // Fetch all appointments for this patient
  const appointments = await prisma.appointment.findMany({
    where: {
      patientId: patient.id,
    },
    include: {
      doctor: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
      payment: {
        select: {
          id: true,
          amount: true,
          status: true,
          createdAt: true,
        },
      },
    },
    orderBy: {
      appointmentDate: "desc",
    },
  })

  // Separate upcoming and past appointments
  const now = new Date()
  const upcomingAppointments = appointments.filter(
    (apt) => new Date(apt.appointmentDate) > now && apt.status !== "CANCELLED"
  )
  const pastAppointments = appointments.filter(
    (apt) => new Date(apt.appointmentDate) <= now || apt.status === "COMPLETED" || apt.status === "CANCELLED"
  )

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <nav className="border-b border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/patient/dashboard" className="text-xl font-semibold text-gray-800">
                Attrangi
              </Link>
              <div className="hidden md:flex gap-4">
                <Link
                  href="/patient/dashboard"
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Dashboard
                </Link>
                <Link
                  href="/patient/therapists"
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Find Therapist
                </Link>
                <Link
                  href="/patient/appointments"
                  className="text-sm font-medium text-teal-600"
                >
                  Appointments
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {session.user.name || session.user.email}
              </span>
              <SignOutButton />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-800 mb-2">
              My Appointments
            </h1>
            <p className="text-gray-600">
              Manage your upcoming and past therapy sessions
            </p>
          </div>
          <Link
            href="/patient/therapists"
            className="inline-flex shrink-0 items-center justify-center text-center font-medium text-white transition-opacity hover:opacity-95"
            style={{
              background: "var(--color-brand)",
              borderRadius: "var(--radius-md)",
              padding: "10px 20px",
              fontSize: "var(--text-sm)",
              fontWeight: 500,
            }}
          >
            Book a session
          </Link>
        </div>

        <AppointmentsList
          upcomingAppointments={upcomingAppointments}
          pastAppointments={pastAppointments}
        />
      </main>
    </div>
  )
}

