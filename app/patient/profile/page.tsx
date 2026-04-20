import { redirect } from "next/navigation"
import { auth } from "@/auth.config"
import { getCurrentUser } from "@/lib/auth"
import ProfileForm from "@/components/profile/PatientProfileForm"
import Link from "next/link"
import SignOutButton from "@/components/auth/SignOutButton"
import Sidebar from "@/components/patient/Sidebar"
import WellnessSummaryCard from "@/components/profile/WellnessSummaryCard"
import { prisma } from "@/lib/prisma"

export default async function PatientProfilePage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/auth/signin")
  }

  const user = await getCurrentUser()

  if (!user || (user.role !== "PATIENT" && user.role !== "CAREGIVER")) {
    redirect("/auth/unauthorized")
  }


  const patientData = await prisma.patient.findUnique({
    where: { userId: user.id },
    include: {
      assessments: {
        orderBy: { createdAt: 'desc' },
        take: 1
      }
    }
  })

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-teal-50 via-white to-blue-50 overflow-hidden text-[var(--color-text-primary)]">
      <Sidebar />
      <div className="flex-1 min-w-0 h-full overflow-y-auto w-full">
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6 flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-semibold text-gray-800 mb-2">
                Profile Settings
              </h1>
              <p className="text-gray-600">
                Update your personal information and preferences
              </p>
            </div>
            <SignOutButton />
          </div>

          {patientData?.assessments[0] && (
            <WellnessSummaryCard assessment={patientData.assessments[0]} />
          )}

          {user && (
            <ProfileForm
              user={{
                id: user.id,
                name: user.name,
                email: user.email,
                image: user.image,
                role: user.role,
                patient: user.patient || undefined,
              }}
              role={user.role}
            />
          )}
        </main>
      </div>
    </div>
  )
}


