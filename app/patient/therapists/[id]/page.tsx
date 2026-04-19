import { redirect } from "next/navigation"
import { auth } from "@/auth.config"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import TherapistBookingPanel from "@/components/therapists/TherapistBookingPanel"
import Sidebar from "@/components/patient/Sidebar"

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
      <div className="flex h-screen w-full bg-[var(--color-bg)] text-[var(--color-text-primary)] overflow-hidden">
        <Sidebar />
        <div className="flex-1 min-w-0 h-full overflow-y-auto w-full">
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="card p-8 text-center">
              <h2 className="text-2xl font-semibold mb-4">Therapist Not Available</h2>
              <p className="text-[var(--color-text-secondary)] mb-6">
                This therapist is not available or has not been approved yet.
              </p>
              <Link
                href="/patient/therapists"
                className="inline-block px-6 py-3 bg-[var(--color-accent)] text-white rounded-lg font-medium hover:opacity-90 transition-all"
              >
                Browse Other Therapists
              </Link>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen w-full bg-[var(--color-bg)] text-[var(--color-text-primary)] overflow-hidden">
      <Sidebar />
      <div className="flex-1 min-w-0 h-full overflow-y-auto w-full">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Link
              href="/patient/therapists"
              className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] mb-4 inline-flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              Back to browse
            </Link>
          </div>

          <TherapistBookingPanel doctor={doctor} />
        </main>
      </div>
    </div>
  )
}

