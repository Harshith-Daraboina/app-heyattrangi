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
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50">
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/patient/dashboard" className="text-xl font-semibold text-gray-800">
                Attrangi
              </Link>
              <SignOutButton />
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Profile Not Found</h2>
            <p className="text-gray-600 mb-6">
              Please complete your patient profile to view appointments.
            </p>
            <Link
              href="/patient/profile"
              className="inline-block px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors"
            >
              Complete Profile
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
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
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
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-800 mb-2">
            My Appointments
          </h1>
          <p className="text-gray-600">
            Manage your upcoming and past therapy sessions
          </p>
        </div>

        <AppointmentsList 
          upcomingAppointments={upcomingAppointments}
          pastAppointments={pastAppointments}
        />
      </main>
    </div>
  )
}

