import { redirect } from "next/navigation"
import { auth } from "@/auth.config"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import SignOutButton from "@/components/auth/SignOutButton"
import PaymentPanel from "@/components/appointments/PaymentPanel"

export default async function AppointmentPaymentPage({
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

  // Fetch appointment details with related data
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
    },
  })

  if (!appointment) {
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
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Appointment Not Found</h2>
            <p className="text-gray-600 mb-6">
              The appointment you're looking for doesn't exist.
            </p>
            <Link
              href="/patient/appointments"
              className="inline-block px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors"
            >
              View My Appointments
            </Link>
          </div>
        </main>
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

  // Check if payment is already completed
  if (appointment.paymentStatus === "PAID" && appointment.payment) {
    redirect(`/patient/appointments/${appointmentId}`)
  }

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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            href="/patient/appointments"
            className="text-sm text-gray-600 hover:text-gray-800 mb-4 inline-block"
          >
            ← Back to Appointments
          </Link>
          <h1 className="text-3xl font-semibold text-gray-800 mb-2">
            Complete Payment
          </h1>
          <p className="text-gray-600">
            Secure payment for your appointment
          </p>
        </div>

        <PaymentPanel appointment={appointment} />
      </main>
    </div>
  )
}

