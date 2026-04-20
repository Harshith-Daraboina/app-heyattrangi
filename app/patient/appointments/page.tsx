import { Suspense } from "react"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import AppointmentsList from "@/components/appointments/AppointmentsList"
import ScheduleSkeleton from "@/components/appointments/ScheduleSkeleton"

async function AppointmentsContent() {
  const user = await getCurrentUser()
  if (!user) return null

  const patient = await prisma.patient.findUnique({
    where: { userId: user.id },
  })

  if (!patient) {
    return (
      <div className="flex-1 min-w-0 h-full overflow-y-auto w-full">
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
  
  const now = new Date()

  // Fetch upcoming appointments
  const upcomingAppointments = await prisma.appointment.findMany({
    where: {
      patientId: patient.id,
      appointmentDate: { gt: now },
      status: { not: "CANCELLED" },
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
      appointmentDate: "asc",
    },
  })

  // Fetch past appointments
  const pastAppointments = await prisma.appointment.findMany({
    where: {
      patientId: patient.id,
      OR: [
        { appointmentDate: { lte: now } },
        { status: "COMPLETED" },
        { status: "CANCELLED" },
      ],
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

  return (
    <div className="flex-1 min-w-0 h-full overflow-y-auto w-full bg-[var(--color-bg)]">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-800 mb-2">
              Schedule
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

export default function AppointmentsPage() {
  return (
    <Suspense fallback={<ScheduleSkeleton />}>
      <AppointmentsContent />
    </Suspense>
  )
}
