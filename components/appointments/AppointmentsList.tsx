"use client"

import type { CSSProperties } from "react"
import { useState } from "react"
import Link from "next/link"

interface Appointment {
  id: string
  appointmentDate: Date
  status: string
  paymentStatus: string
  doctor: {
    id: string
    fullName: string | null
    primarySpecialization: string | null
    specialization: string | null
    consultationFee: number
    user: {
      name: string | null
      email: string | null
      image: string | null
    }
  }
  payment: {
    id: string
    amount: number
    status: string
    createdAt: Date
  } | null
}

interface AppointmentsListProps {
  upcomingAppointments: Appointment[]
  pastAppointments: Appointment[]
}

type BadgeKind = "upcoming" | "completed" | "cancelled"

function getBadgeKind(status: string): BadgeKind {
  if (status === "CANCELLED") return "cancelled"
  if (status === "COMPLETED" || status === "NO_SHOW") return "completed"
  return "upcoming"
}

function StatusBadge({ kind }: { kind: BadgeKind }) {
  const label =
    kind === "upcoming" ? "Upcoming" : kind === "completed" ? "Completed" : "Cancelled"

  const style: CSSProperties =
    kind === "upcoming"
      ? {
          background: "var(--color-accent-light)",
          color: "var(--color-accent)",
        }
      : kind === "completed"
        ? {
            background: "#F0F0F0",
            color: "var(--color-text-secondary)",
          }
        : {
            background: "var(--color-surface-raised)",
            color: "var(--color-text-secondary)",
            border: "1px solid var(--color-border)",
          }

  return (
    <span
      className="inline-block shrink-0 font-medium"
      style={{
        ...style,
        borderRadius: 999,
        padding: "4px 10px",
        fontSize: "var(--text-xs)",
      }}
    >
      {label}
    </span>
  )
}

export default function AppointmentsList({
  upcomingAppointments,
  pastAppointments,
}: AppointmentsListProps) {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  const totalCount = upcomingAppointments.length + pastAppointments.length

  const filterAppointments = (appointments: Appointment[]) => {
    if (filterStatus === "all") return appointments
    return appointments.filter((apt) => apt.status === filterStatus)
  }

  const filteredUpcoming = filterAppointments(upcomingAppointments)
  const filteredPast = filterAppointments(pastAppointments)

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => {
    const appointmentDate = new Date(appointment.appointmentDate)
    const doctorName =
      appointment.doctor.fullName || appointment.doctor.user.name || "Therapist"
    const dateStr = appointmentDate.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    const timeStr = appointmentDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    const badgeKind = getBadgeKind(appointment.status)

    return (
      <Link
        href={`/patient/appointments/${appointment.id}`}
        className="mb-3 block border border-[var(--color-border)] bg-[var(--color-surface)] transition-shadow last:mb-0 hover:shadow-sm"
        style={{
          borderRadius: "var(--radius-md)",
          padding: "16px 20px",
        }}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            <p
              className="font-semibold text-[var(--color-text-primary)]"
              style={{ fontSize: "var(--text-base)" }}
            >
              {doctorName}
            </p>
            <p
              className="mt-1 text-[var(--color-text-secondary)]"
              style={{ fontSize: "var(--text-sm)" }}
            >
              {dateStr} · {timeStr}
            </p>
          </div>
          <StatusBadge kind={badgeKind} />
        </div>
      </Link>
    )
  }

  if (totalCount === 0) {
    return (
      <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-16 text-center">
        <p
          className="font-medium text-[var(--color-text-primary)]"
          style={{ fontSize: "var(--text-lg)" }}
        >
          No sessions booked yet
        </p>
        <p
          className="mx-auto mt-2 max-w-md text-[var(--color-text-secondary)]"
          style={{ fontSize: "var(--text-base)" }}
        >
          Browse therapists to book your first session
        </p>
        <Link
          href="/patient/therapists"
          className="mt-8 inline-block font-medium text-[var(--color-brand)] underline underline-offset-4 transition-opacity hover:opacity-90"
          style={{ fontSize: "var(--text-sm)" }}
        >
          Browse therapists
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <p
            className="mb-1 text-[var(--color-text-secondary)]"
            style={{ fontSize: "var(--text-sm)" }}
          >
            Total sessions
          </p>
          <p
            className="font-bold text-[var(--color-text-primary)]"
            style={{ fontSize: "var(--text-3xl)" }}
          >
            {totalCount}
          </p>
        </div>
        <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <p
            className="mb-1 text-[var(--color-text-secondary)]"
            style={{ fontSize: "var(--text-sm)" }}
          >
            Upcoming
          </p>
          <p
            className="font-bold text-[var(--color-accent)]"
            style={{ fontSize: "var(--text-3xl)" }}
          >
            {upcomingAppointments.length}
          </p>
        </div>
        <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <p
            className="mb-1 text-[var(--color-text-secondary)]"
            style={{ fontSize: "var(--text-sm)" }}
          >
            Past
          </p>
          <p
            className="font-bold text-[var(--color-text-secondary)]"
            style={{ fontSize: "var(--text-3xl)" }}
          >
            {pastAppointments.length}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="border-b border-[var(--color-border)]">
          <nav className="-mb-px flex">
            <button
              type="button"
              onClick={() => setActiveTab("upcoming")}
              className={`flex-1 px-6 py-4 text-center text-sm font-medium transition-colors ${
                activeTab === "upcoming"
                  ? "border-b-2 border-[var(--color-brand)] text-[var(--color-brand)]"
                  : "border-b-2 border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              }`}
            >
              Upcoming ({upcomingAppointments.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("past")}
              className={`flex-1 px-6 py-4 text-center text-sm font-medium transition-colors ${
                activeTab === "past"
                  ? "border-b-2 border-[var(--color-brand)] text-[var(--color-brand)]"
                  : "border-b-2 border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              }`}
            >
              Past ({pastAppointments.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <label
              className="mb-2 block font-medium text-[var(--color-text-primary)]"
              style={{ fontSize: "var(--text-sm)" }}
            >
              Filter by Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full max-w-xs rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2 text-[var(--color-text-primary)] focus:border-[var(--color-brand)] focus:outline-none sm:w-auto"
              style={{ fontSize: "var(--text-sm)" }}
            >
              <option value="all">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          {activeTab === "upcoming" && (
            <div>
              {filteredUpcoming.length === 0 ? (
                <div className="py-12 text-center">
                  <p
                    className="font-medium text-[var(--color-text-primary)]"
                    style={{ fontSize: "var(--text-base)" }}
                  >
                    {upcomingAppointments.length === 0
                      ? "No upcoming appointments"
                      : "Try a different filter to see more sessions"}
                  </p>
                  {upcomingAppointments.length === 0 && (
                    <Link
                      href="/patient/therapists"
                      className="mt-4 inline-block font-medium text-[var(--color-brand)] underline underline-offset-4"
                      style={{ fontSize: "var(--text-sm)" }}
                    >
                      Browse therapists
                    </Link>
                  )}
                </div>
              ) : (
                <div>
                  <h2
                    className="mb-4 font-semibold text-[var(--color-text-primary)]"
                    style={{ fontSize: "var(--text-base)" }}
                  >
                    Upcoming ({filteredUpcoming.length})
                  </h2>
                  {filteredUpcoming.map((appointment) => (
                    <AppointmentCard key={appointment.id} appointment={appointment} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "past" && (
            <div>
              {filteredPast.length === 0 ? (
                <div className="py-12 text-center">
                  <p
                    className="font-medium text-[var(--color-text-primary)]"
                    style={{ fontSize: "var(--text-base)" }}
                  >
                    {pastAppointments.length === 0
                      ? "No past appointments yet"
                      : "Try a different filter to see more sessions"}
                  </p>
                </div>
              ) : (
                <div>
                  <h2
                    className="mb-4 font-semibold text-[var(--color-text-primary)]"
                    style={{ fontSize: "var(--text-base)" }}
                  >
                    Past ({filteredPast.length})
                  </h2>
                  {filteredPast.map((appointment) => (
                    <AppointmentCard key={appointment.id} appointment={appointment} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
