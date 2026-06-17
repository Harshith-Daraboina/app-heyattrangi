import { auth } from "@/auth.config"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import PayoutsDashboardClient from "@/components/doctor/payouts/PayoutsDashboardClient"

export default async function PayoutsPage() {
  const session = await auth()
  
  if (!session?.user || session.user.role !== "DOCTOR") {
    redirect("/auth/signin")
  }

  const doctor = await prisma.doctor.findUnique({
    where: { userId: session.user.id }
  })

  if (!doctor) {
    redirect("/doctor/profile") // or some error page
  }

  // Determine state
  const isVerified = doctor.status === "VERIFIED"
  const payoutStatus = doctor.payoutStatus || "PENDING"

  // We could also fetch total earnings from appointments here 
  // and pass it to the client component. For now, we mock some earning data.
  // In a real app, query `prisma.payment` where doctorId = doctor.id
  const earningsData = {
    totalEarnings: 58400,
    pending: 8400,
    paid: 50000,
    nextSettlement: "Tomorrow"
  }

  return (
    <PayoutsDashboardClient 
      isProfileVerified={isVerified}
      payoutStatus={payoutStatus}
      earningsData={earningsData}
      doctorName={doctor.fullName || session.user.name || "Doctor"}
    />
  )
}
