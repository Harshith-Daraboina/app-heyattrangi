import { Suspense } from "react"
import { getCurrentUser } from "@/lib/auth"
import ProfileForm from "@/components/profile/PatientProfileForm"
import SignOutButton from "@/components/auth/SignOutButton"
import WellnessSummaryCard from "@/components/profile/WellnessSummaryCard"
import { prisma } from "@/lib/prisma"

async function ProfileContent() {
  const user = await getCurrentUser()

  if (!user) return null

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
    <div className="flex-1 min-w-0 h-full overflow-y-auto w-full bg-gradient-to-br from-teal-50 via-white to-blue-50">
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
      </main>
    </div>
  )
}

export default function PatientProfilePage() {
  return (
    <Suspense fallback={
      <div className="flex-1 h-full flex items-center justify-center bg-white/50 animate-pulse">
        <div className="text-gray-400 font-medium">Loading profile...</div>
      </div>
    }>
      <ProfileContent />
    </Suspense>
  )
}
