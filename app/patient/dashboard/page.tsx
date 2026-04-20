import { redirect } from "next/navigation"
import { auth } from "@/auth.config"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Sidebar from "@/components/patient/Sidebar"
import CenterColumn from "@/components/patient/dashboard/CenterColumn"
import RightColumn from "@/components/patient/dashboard/RightColumn"
import BotPopup from "@/components/patient/dashboard/BotPopup"

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
  let dailyTasks: any[] = []

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

    dailyTasks = await prisma.dailyTask.findMany({
        where: { patientId: patient.id },
        orderBy: { dueDate: "asc" }
    })

    // Fallback presentation data if DB is empty for this user
    if (dailyTasks.length === 0) {
        const today = new Date()
        dailyTasks = [
            { id: "mock-1", title: "Morning Journaling", type: "JOURNAL", dueDate: new Date(today.setHours(9, 30, 0)) },
            { id: "mock-2", title: "Mindful Walk", type: "ACTIVITY", dueDate: new Date(today.setHours(12, 0, 0)) },
            { id: "mock-3", title: "Deep Breathing Focus", type: "MEDITATION", dueDate: new Date(today.setHours(15, 30, 0)) },
            { id: "mock-4", title: "Pragya AI Reflection", type: "AI_CHAT", dueDate: new Date(today.setHours(19, 0, 0)) },
        ]
    }
  }

  return (
    <div className="h-screen w-full bg-white font-sans overflow-hidden flex relative">
      <Sidebar />
      <CenterColumn displayName={displayName} upcomingAppointments={upcomingAppointments} dailyTasks={dailyTasks} />
      <RightColumn upcomingAppointments={upcomingAppointments} />
      <BotPopup />
    </div>
  )
}
