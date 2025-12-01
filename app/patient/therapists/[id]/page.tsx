import { redirect } from "next/navigation"
import { auth } from "@/auth.config"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import SignOutButton from "@/components/auth/SignOutButton"
import TherapistBookingPanel from "@/components/therapists/TherapistBookingPanel"

export default async function TherapistDetailPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string }
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
  let doctorId: string
  try {
    const resolvedParams = await (params instanceof Promise ? params : Promise.resolve(params))
    doctorId = resolvedParams.id
  } catch (error) {
    console.error("Error resolving params:", error)
    redirect("/patient/therapists")
  }

  if (!doctorId) {
    redirect("/patient/therapists")
  }

  // Fetch doctor details
  const doctor = await prisma.doctor.findUnique({
    where: { id: doctorId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      availability: true,
    },
  })

  if (!doctor || doctor.status !== "APPROVED") {
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
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Therapist Not Available</h2>
            <p className="text-gray-600 mb-6">
              This therapist is not available or has not been approved yet.
            </p>
            <Link
              href="/patient/therapists"
              className="inline-block px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors"
            >
              Browse Other Therapists
            </Link>
          </div>
        </main>
      </div>
    )
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
                  className="text-sm font-medium text-teal-600"
                >
                  Find Therapist
                </Link>
                <Link
                  href="/patient/appointments"
                  className="text-sm text-gray-600 hover:text-gray-800"
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

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            href="/patient/therapists"
            className="text-sm text-gray-600 hover:text-gray-800 mb-4 inline-block"
          >
            ← Back to Therapists
          </Link>
        </div>

        <TherapistBookingPanel doctor={doctor} />
      </main>
    </div>
  )
}

