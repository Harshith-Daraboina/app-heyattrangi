import { redirect } from "next/navigation"
import { auth } from "@/auth.config"
import { getCurrentUser } from "@/lib/auth"
import Sidebar from "@/components/patient/Sidebar"
import LoadingBar from "@/components/ui/LoadingBar"

export default async function PatientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect("/auth/signin")
  }

  const user = await getCurrentUser()

  if (!user || (user.role !== "PATIENT" && user.role !== "CAREGIVER")) {
    redirect("/auth/unauthorized")
  }

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden relative">
      <LoadingBar />
      <Sidebar />
      <div className="flex-1 min-w-0 h-full flex flex-col relative overflow-hidden">
        {children}
      </div>
    </div>
  )
}
