"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface Appointment {
  id: string
  status: string
  meetingLink?: string | null
  formattedDate: string
  formattedTime: string
  isToday: boolean
  formattedAlertDate: string
  formattedBookingDate: string
  doctor: {
    id: string
    fullName: string | null
    primarySpecialization: string | null
    specialization: string | null
    consultationFee: number
    user: {
      name: string | null
      image: string | null
    }
  }
  patient: {
    name: string | null
    email: string | null
  }
  payment: {
    id: string
    amount: number
    status: string
    formattedPaymentDate: string
  } | null
}

const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

const ClockIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const VideoIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
)

const DollarIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const ShieldIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-9.618 3.033A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
)

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
)

export default function DetailView({ appointment }: { appointment: Appointment }) {
  const [activeTab, setActiveTab] = useState("Session")
  const router = useRouter()
  const doctorName = appointment.doctor.fullName || appointment.doctor.user.name || "Therapist"

  const handleJoin = () => {
    if (!appointment.meetingLink) {
      alert("Meeting link will be shared 10 minutes before the session starts.")
      return
    }
    
    // If it's an old Jitsi link, alert the user to wait for the updated link from the doctor
    if (appointment.meetingLink.includes("jit.si")) {
      alert("The meeting link is being updated to our new secure platform. Please refresh the page in a moment.")
      return
    }

    window.open(`${appointment.meetingLink}?user=${encodeURIComponent(appointment.patient.name || "Patient")}&audio=true&video=true`, "_blank")
  }

  const handleReschedule = () => {
    router.push(`/patient/therapists/${appointment.doctor.id}`)
  }

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this session?")) return
    try {
      const res = await fetch(`/api/appointments/${appointment.id}/cancel`, { method: "PATCH" })
      if (res.ok) window.location.reload()
      else alert("Failed to cancel.")
    } catch (e) {
      alert("An error occurred.")
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* Left Column: Main Content */}
      <div className="lg:col-span-2 space-y-8">

        {/* Therapist Header Card */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100/80">
          <div className="flex flex-col sm:flex-row items-center gap-8 mb-10">
            <div className="relative group shrink-0">
              <div className="w-24 h-24 rounded-full overflow-hidden border-[3px] border-white ring-1 ring-gray-100 shadow-md">
                {appointment.doctor.user.image ? (
                  <Image src={appointment.doctor.user.image} alt={doctorName} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-50 flex items-center justify-center text-3xl font-bold text-gray-200">
                    {doctorName[0]}
                  </div>
                )}
              </div>
              <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-[3px] border-white rounded-full shadow-sm" />
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                <div>
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-1">{doctorName}</h2>
                  <div className="flex items-center gap-3 justify-center sm:justify-start">
                    <p className="text-gray-400 font-bold text-[15px]">Therapist</p>
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm font-black text-gray-700">4.9</span>
                      <span className="text-xs font-bold text-gray-400">(126 reviews)</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-xl text-[11px] font-black uppercase tracking-widest border border-emerald-100">{appointment.status}</span>
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-xl text-[11px] font-black uppercase tracking-widest border border-blue-100">UPCOMING</span>
                </div>
              </div>
            </div>
          </div>

          {/* Info Strips Design */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <CalendarIcon />, label: "DATE", value: appointment.formattedDate },
              { icon: <ClockIcon />, label: "TIME", value: appointment.formattedTime },
              { icon: <ClockIcon />, label: "DURATION", value: "60 min" },
              { icon: <DollarIcon />, label: "FEE", value: `₹${appointment.doctor.consultationFee}` },
            ].map((item, idx) => (
              <div key={idx} className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100/60 flex items-center gap-4 transition-all hover:bg-white hover:shadow-md hover:border-blue-100 hover:-translate-y-0.5 group">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  {item.icon}
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-0.5">{item.label}</p>
                  <p className="text-[13px] font-black text-gray-700 truncate">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabbed Content */}
        <div className="bg-white rounded-[32px] shadow-sm border border-gray-100/80 overflow-hidden">
          <div className="flex border-b border-gray-100 px-8">
            {[
              { name: "Session", icon: <CalendarIcon /> },
              { name: "Appointment Details", icon: <ClockIcon /> },
              { name: "Payment History", icon: <DollarIcon /> }
            ].map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`py-6 px-6 flex items-center gap-2.5 font-bold text-sm transition-all relative ${activeTab === tab.name ? "text-orange-500" : "text-gray-400 hover:text-gray-600"
                  }`}
              >
                <span className={activeTab === tab.name ? "text-orange-500" : "text-gray-300"}>{tab.icon}</span>
                {tab.name}
                {activeTab === tab.name && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500 rounded-t-full" />
                )}
              </button>
            ))}
          </div>

          <div className="p-10">
            {activeTab === "Session" && (
              <div className="space-y-8">
                <h3 className="text-xl font-black text-gray-900 tracking-tight">Session Details</h3>

                {/* Notification Alert Box */}
                <div className="bg-blue-50/70 border border-blue-100 rounded-[24px] p-6 flex items-center gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-blue-500 shrink-0">
                    <CalendarIcon />
                  </div>
                  <div>
                    <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-1">SESSION STARTS AT</p>
                    <p className="text-[15px] font-black text-blue-600">{appointment.formattedAlertDate}</p>
                  </div>
                </div>

                {/* Safety/Info Box */}
                <div className="bg-orange-50/50 border border-orange-100/50 rounded-[24px] p-6 flex items-center gap-6 font-bold text-gray-500 text-sm italic">
                  <div className="w-12 h-12 rounded-2xl bg-white/80 shadow-sm flex items-center justify-center text-orange-400 shrink-0">
                    <ShieldIcon />
                  </div>
                  Meeting link will be available before the session starts.
                </div>

                {/* Main Action Buttons */}
                <div className="space-y-6 pt-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button onClick={handleJoin} className="flex-[2] py-5 bg-[#10B981] hover:bg-[#0EA271] text-white font-black rounded-2xl transition-all shadow-xl shadow-emerald-100/80 text-lg flex items-center justify-center gap-3 active:scale-[0.98]">
                      <VideoIcon />
                      Join Session
                    </button>
                    <button onClick={handleReschedule} className="flex-1 py-5 bg-white hover:bg-orange-50 text-orange-500 border-2 border-orange-200 font-black rounded-2xl transition-all text-lg flex items-center justify-center gap-3 active:scale-[0.98]">
                      <CalendarIcon />
                      Reschedule
                    </button>
                  </div>
                  <div className="flex justify-center">
                    <button onClick={handleCancel} className="inline-flex items-center gap-2 text-gray-400 hover:text-red-500 font-bold text-sm transition-colors py-2 group">
                      <span className="group-hover:scale-110 transition-transform"><TrashIcon /></span>
                      Cancel Appointment
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Appointment Details" && (
              <div className="space-y-10">
                <h3 className="text-xl font-black text-gray-900 tracking-tight">Booking Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  {[
                    { label: "Patient Name", value: appointment.patient.name, icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
                    { label: "Patient Email", value: appointment.patient.email, icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> },
                    { label: "Date & Time", value: `${appointment.formattedDate} at ${appointment.formattedTime}`, icon: <CalendarIcon /> },
                    { label: "Booking ID", value: appointment.id, mono: true, icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M7 7h.01M7 11h.01M7 15h.01M11 7h.01M11 11h.01M11 15h.01M15 7h.01M15 11h.01M15 15h.01M19 7h.01M19 11h.01M19 15h.01M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z" /></svg> },
                  ].map((item) => (
                    <div key={item.label} className="group">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-gray-300 transition-colors group-hover:text-blue-400">{item.icon}</span>
                        <p className="text-[11px] font-black text-gray-300 uppercase tracking-widest">{item.label}</p>
                      </div>
                      <p className={`text-[15px] font-bold text-gray-700 pl-6 ${item.mono ? "font-mono text-sm tracking-tighter text-blue-500" : ""}`}>{item.value || "N/A"}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "Payment History" && (
              <div className="space-y-8">
                <h3 className="text-xl font-black text-gray-900 tracking-tight">Transaction Summary</h3>
                {appointment.payment ? (
                  <div className="bg-gray-50/50 rounded-[28px] p-10 border border-gray-100 flex flex-col md:flex-row gap-12">
                    <div className="flex-1">
                      <div className="mb-4 flex items-center gap-2">
                        <span className="text-blue-500 scale-125"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></span>
                        <p className="text-[12px] font-black text-gray-400 uppercase tracking-widest">TRANSACTION REFERENCE</p>
                      </div>
                      <p className="font-mono text-[14px] font-bold text-gray-500 bg-white p-5 rounded-2xl border border-gray-100 break-all shadow-sm ring-4 ring-blue-50/50">
                        {appointment.payment.id}
                      </p>
                    </div>
                    <div className="w-full md:w-64 space-y-6 flex flex-col justify-center">
                      {[
                        { label: "Amount Paid", value: `₹${appointment.payment.amount}`, isLarge: true },
                        { label: "Status", value: appointment.payment.status, badge: true },
                        { label: "Date", value: appointment.payment.formattedPaymentDate }
                      ].map(stat => (
                        <div key={stat.label} className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-400 italic underline underline-offset-4 decoration-gray-100">{stat.label}</span>
                          {stat.badge ? (
                            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-100">{stat.value}</span>
                          ) : (
                            <span className={stat.isLarge ? "text-xl font-black text-gray-900" : "text-sm font-bold text-gray-600"}>{stat.value}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="py-20 text-center bg-gray-50/50 rounded-[32px] border border-dashed border-gray-200">
                    <p className="text-gray-400 font-bold italic">Digital transaction record not found.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Sidebar "At a Glance" */}
      <div className="space-y-6 lg:sticky lg:top-10">
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100/80">
          <h4 className="text-lg font-black text-gray-900 mb-8 border-b border-gray-50 pb-4">At a Glance</h4>

          <div className="space-y-8">
            {[
              { label: "Therapist", value: doctorName, icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
              { label: "Session Type", value: "Video Session", icon: <VideoIcon /> },
              { label: "Duration", value: "60 minutes", icon: <ClockIcon /> },
              { label: "Platform", value: "Secure Video Call", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> },
              { label: "Time Zone", value: "Asia/Kolkata (IST)", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path d="M12 8v4l3 3" /></svg> },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center shrink-0 border border-gray-100 group-hover:bg-blue-50 group-hover:text-blue-500 group-hover:border-blue-100 transition-all">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1 italic group-hover:text-blue-300 transition-colors">{item.label}</p>
                  <p className="text-[14px] font-black text-gray-700 tracking-tight">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-emerald-50/50 border border-emerald-100/50 rounded-[24px] p-5 flex items-center gap-4 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-emerald-200 group-hover:scale-110 transition-transform">
              <ShieldIcon />
            </div>
            <p className="text-[12px] font-bold text-emerald-800 leading-snug">
              Your session is safe and secured with end-to-end encryption.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
