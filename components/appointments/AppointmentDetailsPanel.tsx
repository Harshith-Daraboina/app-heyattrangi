"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Appointment {
  id: string
  appointmentDate: Date
  status: string
  paymentStatus: string
  meetingLink: string | null
  chatChannelId: string | null
  createdAt: Date
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
  patient: {
    id: string
    user: {
      name: string | null
      email: string | null
    }
  } | null
  payment: {
    id: string
    amount: number
    platformFee: number
    doctorAmount: number
    status: string
    paymentMethod: string | null
    razorpayPaymentId: string | null
    createdAt: Date
  } | null
  timeSlot: {
    id: string
    startTime: Date
    endTime: Date
  } | null
}

interface AppointmentDetailsPanelProps {
  appointment: Appointment
  isUpcoming: boolean
  isPast: boolean
}

export default function AppointmentDetailsPanel({
  appointment,
  isUpcoming,
  isPast,
}: AppointmentDetailsPanelProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"details" | "session" | "payment">("details")

  const doctorName = appointment.doctor.fullName || appointment.doctor.user.name || "Doctor"
  const specialization = appointment.doctor.primarySpecialization || appointment.doctor.specialization || "Therapist"
  const displayPhoto = appointment.doctor.user.image

  const appointmentDate = new Date(appointment.appointmentDate)
  const isToday = appointmentDate.toDateString() === new Date().toDateString()

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
      case "REFUNDED":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Appointment Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-start gap-6 mb-6">
          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-teal-200 bg-gradient-to-br from-teal-400 to-emerald-400 flex items-center justify-center flex-shrink-0">
            {displayPhoto ? (
              <img
                src={displayPhoto}
                alt={doctorName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-3xl text-white font-semibold">
                {doctorName[0].toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">{doctorName}</h2>
                <p className="text-gray-600">{specialization}</p>
              </div>
              <div className="flex gap-2">
                <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                  {appointment.status}
                </span>
                {isUpcoming && (
                  <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    Upcoming
                  </span>
                )}
                {isPast && (
                  <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                    Past
                  </span>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm">
              <div>
                <span className="text-gray-500">Date:</span>
                <p className="font-medium text-gray-800">
                  {appointmentDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  {isToday && <span className="ml-2 text-blue-600">(Today)</span>}
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
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab("details")}
              className={`flex-1 px-6 py-4 text-sm font-medium text-center border-b-2 transition-colors ${
                activeTab === "details"
                  ? "border-teal-500 text-teal-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Appointment Details
            </button>
            <button
              onClick={() => setActiveTab("session")}
              className={`flex-1 px-6 py-4 text-sm font-medium text-center border-b-2 transition-colors ${
                activeTab === "session"
                  ? "border-teal-500 text-teal-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {isUpcoming ? "Session" : "Session History"}
            </button>
            <button
              onClick={() => setActiveTab("payment")}
              className={`flex-1 px-6 py-4 text-sm font-medium text-center border-b-2 transition-colors ${
                activeTab === "payment"
                  ? "border-teal-500 text-teal-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Payment History
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Details Tab */}
          {activeTab === "details" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Appointment Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Appointment ID</label>
                    <p className="text-gray-800 font-mono text-sm">{appointment.id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Booked On</label>
                    <p className="text-gray-800">
                      {new Date(appointment.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusColor(appointment.paymentStatus)}`}>
                      {appointment.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>

              {appointment.paymentStatus === "PENDING" && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-sm text-amber-800 mb-3">
                    Payment is pending. Please complete payment to confirm your appointment.
                  </p>
                  <Link
                    href={`/patient/appointments/${appointment.id}/payment`}
                    className="inline-block px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors"
                  >
                    Complete Payment
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Session Tab */}
          {activeTab === "session" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {isUpcoming ? "Session Details" : "Session History"}
              </h3>
              
              {isUpcoming ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800 mb-2">
                      Your session will begin on{" "}
                      <span className="font-semibold">
                        {appointmentDate.toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                        })}{" "}
                        at{" "}
                        {appointmentDate.toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </span>
                    </p>
                  </div>

                  {appointment.meetingLink ? (
                    <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Meeting Link</p>
                      <a
                        href={appointment.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-600 hover:text-teal-700 text-sm break-all"
                      >
                        {appointment.meetingLink}
                      </a>
                    </div>
                  ) : (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-600">
                        Meeting link will be available before the session starts.
                      </p>
                    </div>
                  )}

                  {appointment.status === "CONFIRMED" && (
                    <div className="flex gap-3">
                      <button className="flex-1 px-4 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg font-medium hover:from-teal-600 hover:to-emerald-600 transition-all">
                        Join Session
                      </button>
                      <button className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all">
                        Cancel Appointment
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {appointment.status === "COMPLETED" ? (
                    <>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-sm font-medium text-green-800 mb-1">
                          ✓ Session Completed
                        </p>
                        <p className="text-sm text-green-700">
                          Your session was completed on{" "}
                          {appointmentDate.toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      
                      {appointment.meetingLink && (
                        <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">Session Recording</p>
                          <p className="text-sm text-gray-600">
                            Recording and transcript will be available soon.
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-600">
                        No session history available for this appointment.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Payment Tab */}
          {activeTab === "payment" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment History</h3>
              
              {appointment.payment ? (
                <div className="space-y-4">
                  <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800">Payment Details</h4>
                        <p className="text-sm text-gray-500">
                          {new Date(appointment.payment.createdAt).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getPaymentStatusColor(appointment.payment.status)}`}>
                        {appointment.payment.status}
                      </span>
                    </div>

                    <div className="space-y-3 border-t border-gray-200 pt-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Consultation Fee</span>
                        <span className="font-medium text-gray-800">₹{appointment.payment.amount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Platform Fee</span>
                        <span className="font-medium text-gray-800">₹{appointment.payment.platformFee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Doctor Receives</span>
                        <span className="font-medium text-gray-800">₹{appointment.payment.doctorAmount.toFixed(2)}</span>
                      </div>
                      <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-semibold">
                        <span className="text-gray-800">Total Paid</span>
                        <span className="text-gray-800">₹{appointment.payment.amount.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Payment Method:</span>
                          <p className="font-medium text-gray-800">
                            {appointment.payment.paymentMethod || "Not specified"}
                          </p>
                        </div>
                        {appointment.payment.razorpayPaymentId && (
                          <div>
                            <span className="text-gray-600">Transaction ID:</span>
                            <p className="font-medium text-gray-800 font-mono text-xs">
                              {appointment.payment.razorpayPaymentId}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
                  <p className="text-sm text-amber-800 mb-3">
                    No payment record found. Please complete payment to confirm your appointment.
                  </p>
                  {appointment.paymentStatus === "PENDING" && (
                    <Link
                      href={`/patient/appointments/${appointment.id}/payment`}
                      className="inline-block px-6 py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors"
                    >
                      Make Payment
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

