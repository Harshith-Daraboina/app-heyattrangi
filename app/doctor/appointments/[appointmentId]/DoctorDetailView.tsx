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
  const [activeTab, setActiveTab] = useState("Case Study")
  const [notes, setNotes] = useState(appointment.doctorNotes || "")
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle")
  const router = useRouter()

  const [primarySymptoms, setPrimarySymptoms] = useState("Mild to moderate sleep disturbances, persistent racing thoughts during evening hours, and mild social exhaustion.")
  const [medicalHistory, setMedicalHistory] = useState("No significant physical trauma or chronic illnesses. High workplace stress. Daily caffeine intake: 2-3 cups.")
  const [assessmentResults, setAssessmentResults] = useState("Mind Matrix Assessment: 8.5/10. Shows high cognitive focus, minimal processing lag, with mild occupational stress markers.")
  const [isSavingStudy, setIsSavingStudy] = useState(false)
  const [saveStudyStatus, setSaveStudyStatus] = useState<"idle" | "success" | "error">("idle")

  const handleSaveStudy = () => {
    setIsSavingStudy(true)
    setSaveStudyStatus("idle")
    setTimeout(() => {
      setIsSavingStudy(false)
      setSaveStudyStatus("success")
      setTimeout(() => setSaveStudyStatus("idle"), 3000)
    }, 1000)
  }

  const [suggestions, setSuggestions] = useState("• Box Breathing (4-4-4-4 technique) for 5 minutes twice daily.\n• Reduce screen time 1 hour before sleeping; continue logging daily mood.\n• Assigned reading: Workplace Stress Management Guide.")
  const [isSavingSuggestions, setIsSavingSuggestions] = useState(false)
  const [saveSugStatus, setSaveSugStatus] = useState<"idle" | "success" | "error">("idle")

  const handleSaveSuggestions = () => {
    setIsSavingSuggestions(true)
    setSaveSugStatus("idle")
    setTimeout(() => {
      setIsSavingSuggestions(false)
      setSaveSugStatus("success")
      setTimeout(() => setSaveSugStatus("idle"), 3000)
    }, 1000)
  }

  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatInput, setChatInput] = useState("")
  const [chatMessages, setChatMessages] = useState([
    { sender: "system", text: "Secure clinical chat channel initialized." },
    { sender: "patient", text: "Hi Doctor! I had a quick question regarding the daily suggestions you assigned. Should I do the box breathing exercise before or after work?" }
  ])

  const handleSendMessage = () => {
    if (!chatInput.trim()) return
    const newMsg = { sender: "doctor", text: chatInput }
    setChatMessages(prev => [...prev, newMsg])
    const doctorMsg = chatInput
    setChatInput("")

    setTimeout(() => {
      let replyText = "Understood Doctor, thank you so much for the quick response! I will try that today."
      if (doctorMsg.toLowerCase().includes("before")) {
        replyText = "Got it! Doing it before work to calm my thoughts makes perfect sense. I will start that today."
      } else if (doctorMsg.toLowerCase().includes("after")) {
        replyText = "Thank you Doctor! Doing it after work to wind down sounds perfect. I will practice it tonight."
      }
      setChatMessages(prev => [...prev, { sender: "patient", text: replyText }])
    }, 1200)
  }

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
      appointment.meetingLink = `https://meet-heyattrangi.vercel.app/${appointment.id}`
    }
    if (!appointment.meetingLink) {
       alert("Meeting link is not generated yet.")
       return
    }

    let link = appointment.meetingLink
    if (link.includes("meet-heyattrangi.vercel.app")) {
      const baseUrl = link.split('?')[0].replace(/\/lobby$/, '').replace(/\/$/, '')
      link = `${baseUrl}/lobby?user=${encodeURIComponent(appointment.doctor.fullName || "Doctor")}&audio=true&video=true`
    } else {
      link = `${link}?user=${encodeURIComponent(appointment.doctor.fullName || "Doctor")}&audio=true&video=true`
    }

    window.open(link, "_blank")
  }

  const handleEmail = () => {
    const email = appointment.patient.email || "patient@heyattrangi.app"
    window.location.href = `mailto:${email}?subject=HeyAttrangi Therapy Session Follow-up`
  }

  const handleCall = () => {
    const phone = appointment.patient.emergencyPhone || "+919876543210"
    window.location.href = `tel:${phone}`
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
          <div className="flex border-b border-gray-50 px-8 bg-gray-50/30 overflow-x-auto">
            {[
              { name: "Case Study", icon: <NoteIcon /> },
              { name: "Therapy Notes", icon: <NoteIcon /> },
              { name: "Attendance & History", icon: <CalendarIcon /> },
              { name: "Suggestions", icon: <ClockIcon /> }
            ].map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`py-8 px-6 flex items-center gap-3 font-black text-xs uppercase tracking-[0.15em] transition-all relative shrink-0 ${
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
            {activeTab === "Case Study" && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-black text-gray-900 tracking-tight">CLINICAL INTAKE STUDY</h3>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Comprehensive patient assessment and clinical background</p>
                  </div>
                  <div className="flex items-center gap-3">
                     {saveStudyStatus === "success" && <span className="text-emerald-500 font-black text-xs uppercase tracking-widest animate-pulse">Study Saved!</span>}
                     <button 
                       onClick={handleSaveStudy}
                       disabled={isSavingStudy}
                       className="px-6 py-2.5 bg-gray-900 hover:bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-sm disabled:opacity-50"
                     >
                       {isSavingStudy ? "Saving..." : "Save Study"}
                     </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-6 rounded-3xl bg-gray-50 border border-gray-100 flex flex-col">
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">Primary Symptoms</p>
                    <textarea
                      value={primarySymptoms}
                      onChange={(e) => setPrimarySymptoms(e.target.value)}
                      rows={4}
                      className="w-full bg-white border border-gray-100 rounded-2xl p-4 text-xs font-bold text-gray-700 focus:border-blue-200 outline-none resize-none leading-relaxed shadow-inner"
                    />
                  </div>
                  <div className="p-6 rounded-3xl bg-gray-50 border border-gray-100 flex flex-col">
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">Medical History</p>
                    <textarea
                      value={medicalHistory}
                      onChange={(e) => setMedicalHistory(e.target.value)}
                      rows={4}
                      className="w-full bg-white border border-gray-100 rounded-2xl p-4 text-xs font-bold text-gray-700 focus:border-blue-200 outline-none resize-none leading-relaxed shadow-inner"
                    />
                  </div>
                  <div className="p-6 rounded-3xl bg-gray-50 border border-gray-100 col-span-full flex flex-col">
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">Diagnostic Assessment Results</p>
                    <div className="flex gap-4 items-start">
                      <div className="text-3xl mt-1">🧠</div>
                      <textarea
                        value={assessmentResults}
                        onChange={(e) => setAssessmentResults(e.target.value)}
                        rows={3}
                        className="w-full bg-white border border-gray-100 rounded-2xl p-4 text-xs font-bold text-gray-700 focus:border-blue-200 outline-none resize-none leading-relaxed shadow-inner"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Therapy Notes" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Active Note Editing */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                     <div>
                        <h3 className="text-lg font-black text-gray-900 tracking-tight">Active Session Notes</h3>
                        <p className="text-[10px] font-bold text-gray-400">Observations for this session</p>
                     </div>
                     <div className="flex items-center gap-2">
                        {saveStatus === "success" && <span className="text-emerald-500 font-black text-[10px] uppercase tracking-widest animate-pulse">Saved!</span>}
                        <button 
                          onClick={handleSaveNotes}
                          disabled={isSaving}
                          className="px-5 py-2 bg-gray-900 hover:bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-sm"
                        >
                          {isSaving ? "Saving..." : "Save"}
                        </button>
                     </div>
                  </div>
                  <textarea 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Write observations..."
                    className="w-full min-h-[300px] p-6 bg-gray-50 border-2 border-gray-100 rounded-[2rem] text-gray-700 font-bold text-sm leading-relaxed focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-50 transition-all outline-none resize-none"
                  />
                </div>

                {/* History of Past Session Notes */}
                <div className="space-y-6">
                  <h3 className="text-lg font-black text-gray-900 tracking-tight">Previous Session Notes</h3>
                  <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2">
                    {[
                      { date: "May 3rd, 2026", note: "Patient showed significant improvement in stress management. Practicing box breathing regularly." },
                      { date: "April 27th, 2026", note: "Initial onboarding session. Reported high anxiety due to work pressures. Recommended starting a daily mood journal." }
                    ].map((hist, idx) => (
                      <div key={idx} className="p-5 bg-orange-50/30 rounded-2xl border border-orange-100/30">
                        <p className="text-[10px] font-black text-[var(--color-brand)] mb-1 uppercase tracking-wider">{hist.date}</p>
                        <p className="text-xs text-gray-600 font-medium leading-relaxed italic">"{hist.note}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Attendance & History" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-black text-gray-900 tracking-tight mb-1">Session Attendance & Booking Log</h3>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Overview of onboarding timeline and session compliance</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 text-center">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Onboarded Since</p>
                    <p className="text-lg font-black text-gray-800">April 27th, 2026</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 text-center">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Bookings</p>
                    <p className="text-lg font-black text-gray-800">5 Sessions</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 text-center">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Attendance Rate</p>
                    <p className="text-lg font-black text-emerald-600">100% Present</p>
                  </div>
                </div>

                <div className="border border-gray-100 rounded-3xl overflow-hidden mt-6">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 font-black text-gray-400 uppercase tracking-wider border-b border-gray-100">
                      <tr>
                        <th className="px-6 py-4">Session Date & Time</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Billing Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-bold text-gray-600">
                      {[
                        { date: "Saturday, May 9th, 2026 - 11:45 PM", status: "Completed", bill: "Paid" },
                        { date: "Sunday, May 3rd, 2026 - 11:45 PM", status: "Completed", bill: "Paid" },
                        { date: "Thursday, April 30th, 2026 - 1:45 PM", status: "Completed", bill: "Paid" },
                        { date: "Monday, April 27th, 2026 - 4:00 PM", status: "Completed", bill: "Paid" }
                      ].map((log, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/50">
                          <td className="px-6 py-4 font-black text-gray-800">{log.date}</td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] uppercase tracking-wider">{log.status}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] uppercase tracking-wider">{log.bill}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "Suggestions" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-2">
                   <div>
                      <h3 className="text-xl font-black text-gray-900 tracking-tight">Therapist Recommendations</h3>
                      <p className="text-xs font-bold text-gray-400 italic">These suggestions will be shared with the patient.</p>
                   </div>
                   <div className="flex items-center gap-3">
                      {saveSugStatus === "success" && <span className="text-emerald-500 font-black text-xs uppercase tracking-widest animate-pulse">Suggestions Saved!</span>}
                      <button 
                        onClick={handleSaveSuggestions}
                        disabled={isSavingSuggestions}
                        className="px-8 py-3 bg-[var(--color-brand)] hover:opacity-90 text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all shadow-md shadow-orange-100 disabled:opacity-50"
                      >
                        {isSavingSuggestions ? "Saving..." : "Save Plan"}
                      </button>
                   </div>
                </div>
                <textarea 
                  value={suggestions}
                  onChange={(e) => setSuggestions(e.target.value)}
                  placeholder="Recommend exercises, daily habits, assigned reading..."
                  className="w-full min-h-[300px] p-8 bg-orange-50/10 border-2 border-orange-100/20 rounded-[32px] text-gray-700 font-bold leading-relaxed focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-50 transition-all outline-none resize-none shadow-inner"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Quick Actions & Sidebar */}
      <div className="space-y-6 lg:sticky lg:top-10">
        
        {/* Main Actions */}
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 relative overflow-hidden">
           <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Session Controls</h4>
           
           <div className="space-y-3">
              <button 
                onClick={handleJoin}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black rounded-2xl transition-all shadow-md shadow-blue-100 flex items-center justify-center gap-2 active:scale-[0.98] uppercase tracking-wider"
              >
                <VideoIcon />
                Join Video Session
              </button>
              
              <div className="grid grid-cols-2 gap-3">
                 <button 
                   onClick={handleEmail}
                   className="py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 font-black rounded-xl transition-all border border-gray-100 flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-wider"
                 >
                    <EmailIcon />
                    Email
                 </button>
                 <button 
                   onClick={handleCall}
                   className="py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 font-black rounded-xl transition-all border border-gray-100 flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-wider"
                 >
                    <PhoneIcon />
                    Call
                 </button>
              </div>

              <button 
                onClick={() => setIsChatOpen(true)}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-wider"
              >
                 <ChatIcon />
                 Open Chat
              </button>
           </div>

           <div className="mt-6 pt-5 border-t border-gray-100">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-sm shrink-0">💡</div>
                 <p className="text-[10px] font-bold text-gray-400 leading-relaxed">
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

      {isChatOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl border border-gray-100 flex flex-col h-[520px] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-lg shrink-0">👤</div>
                <div>
                  <h4 className="text-sm font-black text-gray-800">{appointment.patient.name}</h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider">Active Now</span>
                  </div> 
                </div>
              </div>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-all text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/30">
              {chatMessages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex ${
                    msg.sender === "system" 
                      ? "justify-center" 
                      : msg.sender === "doctor" 
                      ? "justify-end" 
                      : "justify-start"
                  }`}
                >
                  {msg.sender === "system" ? (
                    <span className="px-3 py-1 bg-gray-100 text-[10px] font-bold text-gray-400 rounded-lg uppercase tracking-wider">
                      {msg.text}
                    </span>
                  ) : (
                    <div 
                      className={`max-w-[80%] p-4 rounded-2xl text-xs font-bold leading-relaxed ${
                        msg.sender === "doctor"
                          ? "bg-blue-600 text-white rounded-tr-none"
                          : "bg-white text-gray-700 border border-gray-100 rounded-tl-none shadow-sm"
                      }`}
                    >
                      {msg.text}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-4 border-t border-gray-100 bg-white flex gap-3">
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendMessage()
                }}
                placeholder="Type your message here..."
                className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 text-xs font-bold text-gray-700 focus:bg-white focus:border-blue-200 outline-none transition-all"
              />
              <button 
                onClick={handleSendMessage}
                className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black rounded-xl transition-all uppercase tracking-wider"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
