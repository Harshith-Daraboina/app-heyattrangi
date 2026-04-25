import { Suspense } from "react"
import Link from "next/link"
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

        {/* Account & Billing Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link 
            href="/patient/billing"
            className="group flex items-center justify-between p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <rect x="2" y="5" width="20" height="14" rx="2" ry="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Billing & Invoices</h3>
                <p className="text-sm text-gray-500">Manage your payments and history</p>
              </div>
            </div>
            <span className="text-gray-400 group-hover:text-blue-600 transition-colors">→</span>
          </Link>

          <Link 
            href="/patient/credits"
            className="group flex items-center justify-between p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                  <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Care Credits</h3>
                <p className="text-sm text-gray-500">View and redeem your rewards</p>
              </div>
            </div>
            <span className="text-gray-400 group-hover:text-emerald-600 transition-colors">→</span>
          </Link>
        </div>
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
