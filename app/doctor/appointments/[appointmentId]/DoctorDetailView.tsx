"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface Appointment {
  id: string
  status: string
  meetingLink?: string | null
  doctorNotes?: string | null
  formattedDate: string
  formattedTime: string
  isToday: boolean
  formattedAlertDate: string
  formattedBookingDate: string
  doctor: {
    id: string
    fullName: string | null
    user: {
      name: string | null
      image: string | null
    }
  }
  patient: {
    id: string
    name: string | null
    email: string | null
    image: string | null
    age: number | null
    gender: string | null
    healthConcerns: string[]
    emergencyPhone: string | null
  }
  payment: {
    id: string
    amount: number
    status: string
    formattedPaymentDate: string
  } | null
}

const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

const ClockIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const VideoIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
)

const ChatIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
)

const EmailIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
)

const PhoneIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
)

const NoteIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
)

export default function DoctorDetailView({ appointment }: { appointment: Appointment }) {
  const [activeTab, setActiveTab] = useState("Case Notes")
  const [notes, setNotes] = useState(appointment.doctorNotes || "")
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle")
  const router = useRouter()

  const handleSaveNotes = async () => {
    setIsSaving(true)
    setSaveStatus("idle")
    try {
      const res = await fetch(`/api/appointments/${appointment.id}/notes`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      })
      if (res.ok) {
        setSaveStatus("success")
        setTimeout(() => setSaveStatus("idle"), 3000)
      } else {
        setSaveStatus("error")
      }
    } catch (e) {
      setSaveStatus("error")
    } finally {
      setIsSaving(false)
    }
  }

  const handleJoin = () => {
    if (!appointment.meetingLink) {
       alert("Meeting link is not generated yet.")
       return
    }
    window.open(`${appointment.meetingLink}?user=${encodeURIComponent(appointment.doctor.fullName || "Doctor")}&audio=true&video=true`, "_blank")
  }

  const handleEmail = () => {
    window.location.href = `mailto:${appointment.patient.email}`
  }

  const handleCall = () => {
    if (appointment.patient.emergencyPhone) {
      window.location.href = `tel:${appointment.patient.emergencyPhone}`
    } else {
      alert("No phone number available for this patient.")
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* Left Column: Case Notes & Details */}
      <div className="lg:col-span-2 space-y-8">
        
        {/* Patient Profile Card */}
        <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -mr-32 -mt-32 transition-colors group-hover:bg-blue-100/50" />
          
          <div className="relative flex flex-col md:flex-row items-center gap-10">
            <div className="relative">
               <div className="w-32 h-32 rounded-[32px] overflow-hidden border-4 border-white shadow-xl bg-gray-50 ring-1 ring-gray-100">
                 {appointment.patient.image ? (
                   <Image src={appointment.patient.image} alt={appointment.patient.name || "Patient"} fill className="object-cover" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-4xl font-black text-gray-200">
                     {appointment.patient.name?.[0]}
                   </div>
                 )}
               </div>
               <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 border-4 border-white rounded-2xl shadow-lg flex items-center justify-center text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293l-4 4a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L9 10.586l3.293-3.293a1 1 0 011.414 1.414z"/></svg>
               </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-2 uppercase">{appointment.patient.name}</h2>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm font-bold text-gray-400">
                <span className="flex items-center gap-2 bg-gray-50 px-4 py-1.5 rounded-xl border border-gray-100">
                   {appointment.patient.gender || "Gender N/A"} • {appointment.patient.age || "??"} yrs
                </span>
                <span className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-xl border border-blue-100">
                   ID: {appointment.patient.id.slice(-6).toUpperCase()}
                </span>
              </div>
              
              <div className="mt-6 flex flex-wrap items-center justify-center md:justify-start gap-2">
                 {appointment.patient.healthConcerns.map((concern, idx) => (
                    <span key={idx} className="px-3 py-1 bg-gray-900 text-white text-[10px] font-black rounded-lg uppercase tracking-widest">
                       {concern}
                    </span>
                 ))}
                 {appointment.patient.healthConcerns.length === 0 && (
                    <span className="text-xs italic text-gray-300 font-bold">No specific health concerns listed.</span>
                 )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Content Area */}
        <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-50 px-8 bg-gray-50/30">
            {[
              { name: "Case Notes", icon: <NoteIcon /> },
              { name: "Session Info", icon: <CalendarIcon /> },
              { name: "History", icon: <ClockIcon /> }
            ].map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`py-8 px-8 flex items-center gap-3 font-black text-xs uppercase tracking-[0.2em] transition-all relative ${
                  activeTab === tab.name ? "text-blue-600" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab.icon}
                {tab.name}
                {activeTab === tab.name && (
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-blue-600 rounded-t-full shadow-[0_-4px_12px_rgba(37,99,235,0.3)]" />
                )}
              </button>
            ))}
          </div>

          <div className="p-10">
            {activeTab === "Case Notes" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-2">
                   <div>
                      <h3 className="text-xl font-black text-gray-900 tracking-tight">Therapy Case Notes</h3>
                      <p className="text-xs font-bold text-gray-400 italic">Only you can see these notes.</p>
                   </div>
                   <div className="flex items-center gap-3">
                      {saveStatus === "success" && <span className="text-emerald-500 font-black text-xs uppercase tracking-widest animate-pulse">Saved Successfully!</span>}
                      {saveStatus === "error" && <span className="text-red-500 font-black text-xs uppercase tracking-widest">Failed to save</span>}
                      <button 
                        onClick={handleSaveNotes}
                        disabled={isSaving}
                        className="px-8 py-3 bg-gray-900 hover:bg-black text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl disabled:opacity-50"
                      >
                        {isSaving ? "Saving..." : "Save Notes"}
                      </button>
                   </div>
                </div>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Start writing patient observations, goals, and follow-ups here..."
                  className="w-full min-h-[400px] p-8 bg-gray-50 border-2 border-gray-100 rounded-[32px] text-gray-700 font-bold leading-relaxed focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-50 transition-all outline-none resize-none shadow-inner"
                />
              </div>
            )}

            {activeTab === "Session Info" && (
              <div className="space-y-10">
                 <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase tracking-widest">Appointment Details</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                    {[
                      { label: "Scheduled Date", value: appointment.formattedDate, icon: <CalendarIcon /> },
                      { label: "Session Time", value: appointment.formattedTime, icon: <ClockIcon /> },
                      { label: "Payment Status", value: appointment.payment?.status || "PENDING", badge: true, color: appointment.payment?.status === "PAID" ? "emerald" : "amber" },
                      { label: "Appointment ID", value: appointment.id, mono: true, icon: <NoteIcon /> },
                    ].map((item) => (
                      <div key={item.label} className="group">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-blue-500">{item.icon}</span>
                          <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{item.label}</p>
                        </div>
                        {item.badge ? (
                           <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border ${
                             item.color === "emerald" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
                           }`}>
                             {item.value}
                           </span>
                        ) : (
                          <p className={`text-[15px] font-black text-gray-700 ${item.mono ? "font-mono text-sm text-blue-500" : ""}`}>{item.value}</p>
                        )}
                      </div>
                    ))}
                 </div>
              </div>
            )}

            {activeTab === "History" && (
              <div className="py-20 text-center bg-gray-50/50 rounded-[40px] border-2 border-dashed border-gray-100">
                 <div className="w-16 h-16 bg-white rounded-3xl shadow-sm mx-auto flex items-center justify-center text-2xl mb-4 text-gray-300">
                   📜
                 </div>
                 <p className="text-gray-400 font-bold italic">Previous session history will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Quick Actions & Sidebar */}
      <div className="space-y-6 lg:sticky lg:top-10">
        
        {/* Main Actions */}
        <div className="bg-gray-900 rounded-[40px] p-8 shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl" />
           <h4 className="text-xs font-black text-white/40 uppercase tracking-[0.2em] mb-8">Session Controls</h4>
           
           <div className="space-y-4">
              <button 
                onClick={handleJoin}
                className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-3xl transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 active:scale-[0.98]"
              >
                <VideoIcon />
                Join Video Session
              </button>
              
              <div className="grid grid-cols-2 gap-4">
                 <button 
                   onClick={handleEmail}
                   className="py-4 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl transition-all border border-white/10 flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
                 >
                    <EmailIcon />
                    Email
                 </button>
                 <button 
                   onClick={handleCall}
                   className="py-4 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl transition-all border border-white/10 flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
                 >
                    <PhoneIcon />
                    Call
                 </button>
              </div>

              <button 
                className="w-full py-4 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-black rounded-2xl transition-all border border-emerald-500/20 flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
              >
                 <ChatIcon />
                 Open Chat
              </button>
           </div>

           <div className="mt-8 pt-8 border-t border-white/5">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-lg">💡</div>
                 <p className="text-[10px] font-bold text-white/30 leading-relaxed">
                   Remember to save your case notes before ending the session.
                 </p>
              </div>
           </div>
        </div>

        {/* Support Card */}
        <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm">
           <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Need Assistance?</h4>
           <p className="text-sm font-bold text-gray-700 leading-relaxed mb-6">
             If you encounter any technical issues during the session, please contact our therapist support line.
           </p>
           <button className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline">
              Contact Support →
           </button>
        </div>

      </div>
    </div>
  )
}
