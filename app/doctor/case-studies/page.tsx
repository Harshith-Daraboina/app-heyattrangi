import { auth } from "@/auth.config"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import CaseStudiesList from "@/components/doctor/case-studies/CaseStudiesList"

export default async function CaseStudiesPage() {
  const session = await auth()
  
  if (!session?.user || session.user.role !== "DOCTOR") {
    redirect("/auth/signin")
  }

  const doctor = await prisma.doctor.findUnique({
    where: { userId: session.user.id }
  })

  if (!doctor) redirect("/doctor/profile")

  // Fetch all appointments for this doctor
  const appointments = await prisma.appointment.findMany({
    where: { doctorId: doctor.id },
    orderBy: { appointmentDate: "desc" }
  })

  // Deduplicate patient IDs and calculate stats
  const patientStats = new Map()
  appointments.forEach(app => {
    if (app.patientId) {
      if (!patientStats.has(app.patientId)) {
        patientStats.set(app.patientId, {
          patientId: app.patientId,
          totalAppointments: 1,
          lastAppointment: app.appointmentDate
        })
      } else {
        const existing = patientStats.get(app.patientId)
        existing.totalAppointments += 1
      }
    }
  })

  const uniquePatientIds = Array.from(patientStats.keys())

  // Fetch patients (without including user to avoid relation crashes on dirty data)
  const patients = await prisma.patient.findMany({
    where: { id: { in: uniquePatientIds } }
  })

  // Fetch users separately
  const userIds = patients.map(p => p.userId).filter(Boolean)
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } }
  })

  // Map everything together
  const uniquePatients = patients.map(patient => {
    const stats = patientStats.get(patient.id)
    const user = users.find(u => u.id === patient.userId)
    return {
      patient: { ...patient, user },
      totalAppointments: stats.totalAppointments,
      lastAppointment: stats.lastAppointment
    }
  })

  return <CaseStudiesList patients={uniquePatients} />
}
