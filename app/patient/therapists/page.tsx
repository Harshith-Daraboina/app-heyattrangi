import { redirect } from "next/navigation"
import { auth } from "@/auth.config"
import { getCurrentUser } from "@/lib/auth"
import Link from "next/link"
import SignOutButton from "@/components/auth/SignOutButton"
import TherapistList from "@/components/therapists/TherapistList"
import Sidebar from "@/components/patient/Sidebar"

export default async function TherapistsPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/auth/signin")
  }

  const user = await getCurrentUser()

  if (!user || (user.role !== "PATIENT" && user.role !== "CAREGIVER")) {
    redirect("/auth/unauthorized")
  }

  return (
    <div className="flex h-screen w-full bg-[var(--color-bg)] text-[var(--color-text-primary)] overflow-hidden">
      <Sidebar />
      <div className="flex-1 min-w-0 h-full overflow-y-auto w-full">
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <TherapistList />
        </main>
      </div>
    </div>
  )
}

