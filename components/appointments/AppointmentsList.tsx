"use client"

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

export default function AppointmentsList({
  upcomingAppointments,
  pastAppointments,
}: AppointmentsListProps) {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800"
      case "PENDING":
        return "bg-orange-100 text-orange-800"
      case "COMPLETED":
        return "bg-blue-100 text-blue-800"
      case "CANCELLED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-800"
      case "PENDING":
        return "bg-orange-100 text-orange-800"
      case "FAILED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filterAppointments = (appointments: Appointment[]) => {
    if (filterStatus === "all") return appointments
    return appointments.filter((apt) => apt.status === filterStatus)
  }

  const filteredUpcoming = filterAppointments(upcomingAppointments)
  const filteredPast = filterAppointments(pastAppointments)

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => {
    const appointmentDate = new Date(appointment.appointmentDate)
    const isToday = appointmentDate.toDateString() === new Date().toDateString()
    const doctorName = appointment.doctor.fullName || appointment.doctor.user.name || "Doctor"
    const specialization = appointment.doctor.primarySpecialization || appointment.doctor.specialization || "Therapist"
    const displayPhoto = appointment.doctor.user.image

    return (
      <Link
        href={`/patient/appointments/${appointment.id}`}
        className="block bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100 p-6 mb-4"
      >
        <div className="flex items-start gap-4">
          {/* Doctor Photo */}
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-teal-200 bg-gradient-to-br from-teal-400 to-emerald-400 flex items-center justify-center flex-shrink-0">
            {displayPhoto ? (
              <img
                src={displayPhoto}
                alt={doctorName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl text-white font-semibold">
                {doctorName[0].toUpperCase()}
              </span>
            )}
          </div>

          {/* Appointment Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{doctorName}</h3>
                <p className="text-sm text-gray-600">{specialization}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                  {appointment.status}
                </span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(appointment.paymentStatus)}`}>
                  {appointment.paymentStatus}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Date:</span>
                <p className="font-medium text-gray-800">
                  {appointmentDate.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                  {isToday && <span className="ml-1 text-blue-600">(Today)</span>}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Time:</span>
                <p className="font-medium text-gray-800">
                  {appointmentDate.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Fee:</span>
                <p className="font-medium text-gray-800">₹{appointment.doctor.consultationFee}</p>
              </div>
            </div>
          </div>

          {/* Action Arrow */}
          <div className="flex-shrink-0 text-gray-400">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Total Appointments</p>
          <p className="text-3xl font-bold text-gray-800">
            {upcomingAppointments.length + pastAppointments.length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Upcoming</p>
          <p className="text-3xl font-bold text-blue-600">{upcomingAppointments.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Past</p>
          <p className="text-3xl font-bold text-gray-600">{pastAppointments.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`flex-1 px-6 py-4 text-sm font-medium text-center border-b-2 transition-colors ${
                activeTab === "upcoming"
                  ? "border-teal-500 text-teal-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Upcoming ({upcomingAppointments.length})
            </button>
            <button
              onClick={() => setActiveTab("past")}
              className={`flex-1 px-6 py-4 text-sm font-medium text-center border-b-2 transition-colors ${
                activeTab === "past"
                  ? "border-teal-500 text-teal-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Past ({pastAppointments.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Filter */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          {/* Upcoming Appointments */}
          {activeTab === "upcoming" && (
            <div>
              {filteredUpcoming.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📅</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    No upcoming appointments
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {upcomingAppointments.length === 0
                      ? "You don't have any upcoming appointments. Book a session with a therapist to get started."
                      : "No appointments match your filter criteria."}
                  </p>
                  {upcomingAppointments.length === 0 && (
                    <Link
                      href="/patient/therapists"
                      className="inline-block px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg font-medium hover:from-teal-600 hover:to-emerald-600 transition-all"
                    >
                      Find a Therapist
                    </Link>
                  )}
                </div>
              ) : (
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Upcoming Appointments ({filteredUpcoming.length})
                  </h2>
                  {filteredUpcoming.map((appointment) => (
                    <AppointmentCard key={appointment.id} appointment={appointment} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Past Appointments */}
          {activeTab === "past" && (
            <div>
              {filteredPast.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📋</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    No past appointments
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {pastAppointments.length === 0
                      ? "You haven't had any appointments yet. Book your first session to get started."
                      : "No appointments match your filter criteria."}
                  </p>
                  {pastAppointments.length === 0 && (
                    <Link
                      href="/patient/therapists"
                      className="inline-block px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg font-medium hover:from-teal-600 hover:to-emerald-600 transition-all"
                    >
                      Find a Therapist
                    </Link>
                  )}
                </div>
              ) : (
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Past Appointments ({filteredPast.length})
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

