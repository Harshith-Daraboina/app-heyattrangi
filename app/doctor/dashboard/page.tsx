import { redirect } from "next/navigation"
import { auth } from "@/auth.config"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import SecondaryColumn from "@/components/doctor/dashboard/SecondaryColumn"
import CenterColumn from "@/components/doctor/dashboard/CenterColumn"
import RightColumn from "@/components/doctor/dashboard/RightColumn"

export default async function DoctorDashboard() {
  const session = await auth()

  if (!session?.user) {
    redirect("/auth/signin")
  }

  const user = await getCurrentUser()

  if (!user || user.role !== "DOCTOR") {
    redirect("/auth/unauthorized")
  }

  const displayName = session.user.name || "Doctor"

  const doctor = await prisma.doctor.findUnique({ where: { userId: user.id } })

  let upcomingAppointments: any[] = []
  if (doctor) {
    const appointments = await prisma.appointment.findMany({
      where: { doctorId: doctor.id },
      include: {
        patient: {
          include: { user: { select: { name: true, image: true } } },
        },
      },
      orderBy: { appointmentDate: "asc" },
    })

    const now = new Date()
    upcomingAppointments = appointments.filter(
      (apt) => new Date(apt.appointmentDate) > now && apt.status !== "CANCELLED"
    )
  }

  return (
    <div className="flex flex-1 w-full relative h-full">
      <CenterColumn displayName={displayName} upcomingAppointments={upcomingAppointments} />
      <RightColumn upcomingAppointments={upcomingAppointments} />
    </div>
  )
}
