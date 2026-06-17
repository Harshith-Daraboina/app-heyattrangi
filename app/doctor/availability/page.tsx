import { auth } from "@/auth.config"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AvailabilityDashboardClient from "@/components/doctor/availability/AvailabilityDashboardClient"

export default async function DoctorAvailabilityPage() {
  const session = await auth()
  
  if (!session?.user || session.user.role !== "DOCTOR") {
    redirect("/auth/signin")
  }

  const doctor = await prisma.doctor.findUnique({
    where: { userId: session.user.id },
    include: {
      availability: true
    }
  })

  if (!doctor) {
    redirect("/doctor/profile")
  }

  return (
    <AvailabilityDashboardClient 
      initialAvailability={doctor.availability} 
      initialDoctorSettings={{
        appointmentDuration: doctor.appointmentDuration,
        slotBuffer: doctor.slotBuffer
      }}
    />
  )
}
