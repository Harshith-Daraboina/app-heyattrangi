import { Suspense } from "react"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import DoctorAppointmentsList from "@/components/appointments/DoctorAppointmentsList"
import ScheduleSkeleton from "@/components/appointments/ScheduleSkeleton"

async function AppointmentsContent() {
  const user = await getCurrentUser()
  if (!user) return null

  const doctor = await prisma.doctor.findUnique({
    where: { userId: user.id },
  })

  if (!doctor) return null

  const now = new Date()

  // Helper: build a userMap from a list of appointments that already have patient.userId
  async function resolveUsers(apts: { patient: { userId: string } | null }[]) {
    const ids = apts.map((a) => a.patient?.userId).filter(Boolean) as string[]
    const users = await prisma.user.findMany({
      where: { id: { in: ids } },
      select: { id: true, name: true, email: true, image: true },
    })
    return Object.fromEntries(users.map((u) => [u.id, u]))
  }

  // Merge user into patient and drop orphaned records (no matching user in DB)
  function mergeUsers<T extends { patient: { userId: string } | null }>(
    apts: T[],
    userMap: Record<string, { id: string; name: string | null; email: string | null; image: string | null }>
  ) {
    return apts
      .filter((a) => a.patient?.userId && userMap[a.patient.userId])
      .map((a) => ({
        ...a,
        patient: { ...a.patient!, user: userMap[a.patient!.userId] },
      }))
  }

  // --- Upcoming appointments ---
  const upcomingRaw = await prisma.appointment.findMany({
    where: {
      doctorId: doctor.id,
      appointmentDate: { gt: now },
      status: { not: "CANCELLED" },
    },
    include: {
      patient: true,
      payment: {
        select: { id: true, amount: true, status: true, createdAt: true },
      },
    },
    orderBy: { appointmentDate: "asc" },
  })
  const upcomingUserMap = await resolveUsers(upcomingRaw)
  const upcomingAppointments = mergeUsers(upcomingRaw, upcomingUserMap)

  // --- Past appointments ---
  const pastRaw = await prisma.appointment.findMany({
    where: {
      doctorId: doctor.id,
      OR: [
        { appointmentDate: { lte: now } },
        { status: "COMPLETED" },
        { status: "CANCELLED" },
      ],
    },
    include: {
      patient: true,
      payment: {
        select: { id: true, amount: true, status: true, createdAt: true },
      },
    },
    orderBy: { appointmentDate: "desc" },
  })
  const pastUserMap = await resolveUsers(pastRaw)
  const pastAppointments = mergeUsers(pastRaw, pastUserMap)

  return (
    <div className="flex-1 min-w-0 h-full overflow-y-auto w-full relative">
      <main className="mx-auto max-w-[1440px] px-8 pt-12 pb-20">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Patient Schedule</h1>
            <p className="text-gray-400 font-bold text-lg">Manage your consultations and patient history</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 font-black text-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              {upcomingAppointments.length} Upcoming Today
            </div>
          </div>
        </div>

        <DoctorAppointmentsList
          upcomingAppointments={upcomingAppointments}
          pastAppointments={pastAppointments}
          doctorName={user.name || doctor.fullName || "Doctor"}
        />
      </main>
    </div>
  )
}

export default function DoctorAppointmentsPage() {
  return (
    <Suspense fallback={<ScheduleSkeleton />}>
      <AppointmentsContent />
    </Suspense>
  )
}
