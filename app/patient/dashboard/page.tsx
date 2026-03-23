import { redirect } from "next/navigation"
import { auth } from "@/auth.config"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Sidebar from "@/components/patient/Sidebar"
import SecondaryColumn from "@/components/patient/dashboard/SecondaryColumn"
import CenterColumn from "@/components/patient/dashboard/CenterColumn"
import RightColumn from "@/components/patient/dashboard/RightColumn"

export default async function PatientDashboard() {
  const session = await auth()

  if (!session?.user) {
    redirect("/auth/signin")
  }

  const user = await getCurrentUser()

  if (!user || (user.role !== "PATIENT" && user.role !== "CAREGIVER")) {
    redirect("/auth/unauthorized")
  }

  const displayName = session.user.name || "You"

  const patient = await prisma.patient.findUnique({ where: { userId: user.id } })

  let upcomingAppointments: any[] = []
  if (patient) {
    const appointments = await prisma.appointment.findMany({
      where: { patientId: patient.id },
      include: {
        doctor: {
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
    <div className="h-screen w-full bg-white font-sans overflow-hidden flex">
      <Sidebar />
      <SecondaryColumn />
      <CenterColumn displayName={displayName} upcomingAppointments={upcomingAppointments} />
      <RightColumn upcomingAppointments={upcomingAppointments} />
    </div>
  )
}
