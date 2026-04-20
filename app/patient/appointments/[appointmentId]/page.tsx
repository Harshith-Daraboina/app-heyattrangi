import { redirect } from "next/navigation"
import { auth } from "@/auth.config"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import SignOutButton from "@/components/auth/SignOutButton"
import AppointmentDetailsPanel from "@/components/appointments/AppointmentDetailsPanel"
import Sidebar from "@/components/patient/Sidebar"

export default async function AppointmentDetailPage({
  params,
}: {
  params: Promise<{ appointmentId: string }> | { appointmentId: string }
}) {
  const session = await auth()

  if (!session?.user) {
    redirect("/auth/signin")
  }

  const user = await getCurrentUser()

  if (!user || (user.role !== "PATIENT" && user.role !== "CAREGIVER")) {
    redirect("/auth/unauthorized")
  }

  // Handle params (Next.js 16 compatibility)
  let appointmentId: string
  try {
    const resolvedParams = await (params instanceof Promise ? params : Promise.resolve(params))
    appointmentId = resolvedParams.appointmentId
  } catch (error) {
    console.error("Error resolving params:", error)
    redirect("/patient/appointments")
  }

  if (!appointmentId) {
    redirect("/patient/appointments")
  }

  // Fetch appointment details with all related data
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
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
          availability: true,
          appointments: {
            where: {
              appointmentDate: {
                gte: new Date(new Date().setHours(0, 0, 0, 0)),
                lte: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
              },
              status: { not: "CANCELLED" }
            },
            select: {
              appointmentDate: true
            }
          }
        },
      },
      patient: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
      payment: true,
      timeSlot: true,
    },
  })

  if (!appointment) {
    return (
      <div className="flex h-screen w-full bg-[var(--color-bg)] text-[var(--color-text-primary)] overflow-hidden">
        <Sidebar />
        <div className="flex-1 min-w-0 h-full overflow-y-auto w-full bg-gradient-to-br from-teal-50/50 via-white to-blue-50/50">
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 text-center">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Appointment Not Found</h2>
              <p className="text-gray-600 mb-6">
                The appointment you're looking for doesn't exist.
              </p>
              <Link
                href="/patient/appointments"
                className="inline-block px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors"
              >
                View schedule
              </Link>
            </div>
          </main>
        </div>
      </div>
    )
  }

  // Verify the appointment belongs to the current user
  const patient = await prisma.patient.findUnique({
    where: { userId: user.id },
  })

  if (!patient || appointment.patientId !== patient.id) {
    redirect("/auth/unauthorized")
  }

  // Check if appointment is past or upcoming
  const now = new Date()
  const appointmentDate = new Date(appointment.appointmentDate)
  const isUpcoming = appointmentDate > now
  const isPast = appointmentDate <= now

  return (
    <div className="flex h-screen w-full bg-[var(--color-bg)] text-[var(--color-text-primary)] overflow-hidden">
      <Sidebar />
      <div className="flex-1 min-w-0 h-full overflow-y-auto w-full bg-gradient-to-br from-teal-50/50 via-white to-blue-50/50">
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <div className="mb-6">
            <Link
              href="/patient/appointments"
              className="text-sm text-gray-600 hover:text-gray-800 mb-4 inline-block"
            >
              ← Back to schedule
            </Link>
            <h1 className="text-3xl font-semibold text-gray-800 mb-2">
              Appointment Details
            </h1>
            <p className="text-gray-600">
              View your appointment information, session details, and payment history
            </p>
          </div>

          <AppointmentDetailsPanel
            appointment={appointment}
            isUpcoming={isUpcoming}
            isPast={isPast}
          />
        </main>
      </div>
    </div>
  )
}

