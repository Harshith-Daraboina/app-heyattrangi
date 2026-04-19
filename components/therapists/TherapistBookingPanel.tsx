"use client"



import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface Doctor {
  id: string
  fullName: string | null
  profilePhoto: string | null
  primarySpecialization: string | null
  specialization: string | null
  secondarySpecializations?: string[]
  yearsOfExperience: number | null
  consultationFee: number
  bio: string | null
  languagesSpoken: string[]
  preferredAgeGroups: string[]
  consultationTypes: string[]
  appointmentDuration: number | null
  user: {
    id: string
    name: string | null
    email: string | null
    image: string | null
  }
  availability: {
    availableDays: string[]
    startTime: string | null
    endTime: string | null
    isAvailable: boolean
  } | null
}

interface TherapistBookingPanelProps {
  doctor: Doctor
}

export default function TherapistBookingPanel({ doctor }: TherapistBookingPanelProps) {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [isBooking, setIsBooking] = useState(false)
  const [reason, setReason] = useState("")

  const displayPhoto = doctor.profilePhoto || doctor.user.image
  const specialization = doctor.primarySpecialization || doctor.specialization || "Therapist"
  const allSpecialties = Array.from(new Set([
    specialization,
    ...(doctor.secondarySpecializations || [])
  ])).filter(Boolean)

  // Generate available dates (next 14 days)
  const generateAvailableDates = () => {
    const dates: string[] = []
    const today = new Date()
    
    const dayNameMap: { [key: number]: string } = {
      0: "SUNDAY", 1: "MONDAY", 2: "TUESDAY", 3: "WEDNESDAY", 
      4: "THURSDAY", 5: "FRIDAY", 6: "SATURDAY",
    }
    
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      const dayOfWeek = date.getDay()
      const dayName = dayNameMap[dayOfWeek]
      
      if (doctor.availability?.availableDays?.includes(dayName)) {
        dates.push(date.toISOString().split("T")[0])
      }
    }
    return dates
  }

  // ... (generateTimeSlots and handleBooking remain the same)
  // Re-including them to ensure complete file replacement success
  useEffect(() => {
    if (!selectedDate || !doctor.availability) {
      setAvailableSlots([])
      return
    }

    const generateTimeSlots = () => {
      const slots: string[] = []
      const startTime = doctor.availability?.startTime || "09:00"
      const endTime = doctor.availability?.endTime || "17:00"
      const duration = doctor.appointmentDuration || 30

      const [startHour, startMin] = startTime.split(":").map(Number)
      const [endHour, endMin] = endTime.split(":").map(Number)

      const start = new Date()
      start.setHours(startHour, startMin, 0, 0)
      const end = new Date()
      end.setHours(endHour, endMin, 0, 0)

      const current = new Date(start)
      while (current < end) {
        const timeStr = current.toLocaleTimeString("en-US", {
          hour: "2-digit", minute: "2-digit", hour12: true,
        })
        slots.push(timeStr)
        current.setMinutes(current.getMinutes() + duration)
      }
      return slots
    }

    setAvailableSlots(generateTimeSlots())
    setSelectedTime("") 
  }, [selectedDate, doctor.availability, doctor.appointmentDuration])

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) {
      alert("Please select a date and time")
      return
    }
    if (!reason.trim()) {
      alert("Please provide a reason")
      return
    }
    setIsBooking(true)
    try {
      const dateStr = selectedDate.split("T")[0]
      const timeMatch = selectedTime.match(/(\d+):(\d+)\s*(AM|PM)/i)
      if (!timeMatch) {
        alert("Invalid time format")
        setIsBooking(false)
        return
      }
      const [, hours, minutes, period] = timeMatch
      let hour24 = parseInt(hours)
      if (period.toUpperCase() === "PM" && hour24 !== 12) hour24 += 12
      else if (period.toUpperCase() === "AM" && hour24 === 12) hour24 = 0
      const appointmentDateTime = new Date(`${dateStr}T${hour24.toString().padStart(2, "0")}:${minutes}:00`)
      const response = await fetch("/api/appointments/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId: doctor.id,
          appointmentDate: appointmentDateTime.toISOString(),
          reason: reason,
        }),
      })
      if (response.ok) {
        const data = await response.json()
        router.push(`/patient/appointments/${data.appointmentId}/payment`)
      } else {
        const error = await response.json()
        alert(error.error || "Failed to book appointment")
      }
    } catch (error) {
      console.error("Error booking appointment:", error)
      alert("Failed to book appointment")
    } finally {
      setIsBooking(false)
    }
  }

  const availableDates = generateAvailableDates()

  return (
    <div className="max-w-6xl mx-auto space-y-16 animate-in fade-in duration-700 pb-20">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row gap-10 items-start pb-12 border-b border-gray-100">
        <div className="w-56 h-56 rounded-[40px] overflow-hidden shadow-2xl border-[6px] border-white flex-shrink-0 bg-gray-50 transform hover:scale-[1.02] transition-transform duration-500">
          {displayPhoto ? (
            <img src={displayPhoto} alt={doctor.fullName || "Therapist"} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--color-brand)] to-[var(--color-brand-dark)] text-8xl text-white font-black">
              {(doctor.fullName || doctor.user.name || "T")[0].toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex-1 space-y-6 pt-2">
          <div className="flex items-center gap-4">
            <h1 className="text-5xl font-black text-[var(--color-text-primary)] tracking-tight">
              {doctor.fullName || doctor.user.name || "Therapist"}
            </h1>
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-sm">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
            </div>
          </div>
          <p className="text-2xl text-[var(--color-text-secondary)] font-bold">{specialization}, LCSW-R</p>
          <div className="flex flex-col gap-4 text-[var(--color-text-secondary)]">
            <div className="flex items-center gap-4"><div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg></div><span className="text-lg font-bold text-gray-700">Individual Sessions ₹{doctor.consultationFee}</span></div>
            <div className="flex items-center gap-4"><div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg></div><span className="text-lg font-bold text-gray-700">{doctor.yearsOfExperience || "10"} Years Professional Experience</span></div>
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            <span className="px-5 py-2.5 bg-blue-50 text-blue-600 text-[11px] font-black rounded-xl border border-blue-100 uppercase tracking-[0.1em]">New Client Accepted</span>
            <span className="px-5 py-2.5 bg-green-50 text-green-600 text-[11px] font-black rounded-xl border border-green-100 uppercase tracking-[0.1em]">Online Therapy Available</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-16">
        <div className="flex-1 min-w-0 space-y-20">
          {/* About Section */}
          <section className="space-y-8">
            <div className="flex items-center gap-4">
               <div className="h-8 w-2 bg-[var(--color-brand)] rounded-full"></div>
               <h2 className="text-3xl font-black text-[var(--color-text-primary)]">About Me</h2>
            </div>
            <div className="text-gray-600 leading-relaxed space-y-6 text-xl font-medium opacity-90 lg:pr-10">
              {doctor.bio ? doctor.bio.split("\n\n").map((para, i) => <p key={i}>{para}</p>) : <p>Professional profile coming soon.</p>}
            </div>
          </section>

          {/* Specialties Section */}
          <section className="space-y-8">
             <div className="flex items-center gap-4">
                <div className="h-8 w-2 bg-[var(--color-brand)] rounded-full"></div>
                <h2 className="text-3xl font-black text-[var(--color-text-primary)]">Specialties & Expertise</h2>
             </div>
             <div className="flex flex-wrap gap-3">
                {allSpecialties.map((spec, i) => (
                  <span key={i} className="px-6 py-3 bg-white border-2 border-gray-100 rounded-2xl font-bold text-gray-700 hover:border-[var(--color-brand)] hover:text-[var(--color-brand-dark)] transition-all cursor-default shadow-sm">{spec}</span>
                ))}
                {doctor.languagesSpoken.map((lang, i) => (
                  <span key={`lang-${i}`} className="px-6 py-3 bg-[var(--color-surface-raised)] border-2 border-transparent rounded-2xl font-bold text-gray-500 italic">Fluent in {lang}</span>
                ))}
             </div>
          </section>

          {/* Booking Section */}
          <section id="booking-section" className="space-y-12 scroll-mt-32 pt-12 border-t border-gray-100">
             <div className="flex items-center gap-4">
                <div className="h-8 w-2 bg-[var(--color-brand)] rounded-full"></div>
                <h2 className="text-3xl font-black text-[var(--color-text-primary)]">Finances & Booking</h2>
             </div>
             
             <div className="grid md:grid-cols-2 gap-8">
              <div className="group p-8 bg-orange-50 rounded-[32px] border-2 border-orange-100 hover:bg-orange-100/30 transition-all">
                <p className="text-xs font-black text-orange-600 uppercase tracking-[0.2em] mb-3">Session Fee</p>
                <p className="text-5xl font-black text-orange-700 tracking-tight">₹{doctor.consultationFee}</p>
                <p className="text-sm font-bold text-orange-600/60 mt-2">Transparent pricing, no hidden costs</p>
              </div>
              <div className="group p-8 bg-blue-50 rounded-[32px] border-2 border-blue-100 hover:bg-blue-100/30 transition-all">
                <p className="text-xs font-black text-blue-600 uppercase tracking-[0.2em] mb-3">Session Duration</p>
                <p className="text-5xl font-black text-blue-700 tracking-tight">{doctor.appointmentDuration || 45} <span className="text-xl">mins</span></p>
                <p className="text-sm font-bold text-blue-600/60 mt-2">Focused therapeutic attention</p>
              </div>
             </div>

             <div className="space-y-10 pt-4">
              <div className="flex justify-between items-end">
                 <h3 className="text-2xl font-black text-gray-800">Select Date & Time</h3>
                 <p className="text-sm font-bold text-gray-400">Next 14 days available</p>
              </div>
              
              <div className="flex gap-5 overflow-x-auto pb-6 scrollbar-hide px-1">
                {availableDates.map((date) => {
                  const dateObj = new Date(date)
                  const isSelected = selectedDate === date
                  return (
                    <button
                      key={date}
                      onClick={() => setSelectedDate(date)}
                      className={`flex-shrink-0 w-28 p-6 rounded-[30px] border-2 transition-all duration-300 shadow-sm ${
                        isSelected ? "border-[var(--color-brand)] bg-[var(--color-brand-light)] text-[var(--color-brand-dark)] scale-110 z-10 shadow-lg shadow-orange-100" : "border-gray-50 bg-white hover:border-gray-200"
                      }`}
                    >
                      <div className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">{dateObj.toLocaleDateString("en-US", { weekday: "short" })}</div>
                      <div className="text-3xl font-black">{dateObj.getDate()}</div>
                      <div className="text-[10px] font-bold mt-1 opacity-40 uppercase">{dateObj.toLocaleDateString("en-US", { month: "short" })}</div>
                    </button>
                  )
                })}
              </div>

              {selectedDate && (
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 animate-in fade-in zoom-in-95 duration-500">
                  {availableSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`py-5 rounded-3xl border-2 font-black text-sm tracking-wide transition-all ${
                        selectedTime === time ? "border-[var(--color-brand)] bg-[var(--color-brand-light)] text-[var(--color-brand-dark)] shadow-sm" : "border-gray-50 bg-gray-50 hover:bg-gray-100 text-gray-500"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              )}

              <div className="space-y-4">
                <label className="text-lg font-black text-gray-700 ml-1">Additional Notes</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Tell us a bit about why you're seeking support today..."
                  className="w-full p-8 bg-gray-50 rounded-[40px] border-2 border-transparent focus:border-[var(--color-brand)] focus:bg-white outline-none min-h-[180px] text-lg font-medium transition-all shadow-inner"
                />
              </div>
             </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-[400px]">
          <div className="bg-white rounded-[48px] p-12 border border-gray-100 shadow-2xl shadow-gray-200/50 space-y-10 sticky top-12 border-b-[12px] border-b-gray-50">
            <h3 className="text-3xl font-black tracking-tight">Let's Connect</h3>
            <div className="space-y-8">
              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 bg-orange-50 rounded-[20px] flex items-center justify-center text-[var(--color-brand)] transition-all group-hover:scale-110 group-hover:bg-[var(--color-brand)] group-hover:text-white shadow-sm">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </div>
                <div>
                   <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Email Address</p>
                   <p className="text-lg font-bold text-gray-800 tracking-tight">{doctor.user.email}</p>
                </div>
              </div>
            </div>
            
            <div className="pt-4">
              <button 
                onClick={() => {
                  document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="w-full py-6 bg-[var(--color-brand)] text-white rounded-[28px] font-black text-xl shadow-xl shadow-orange-100 hover:shadow-2xl hover:shadow-orange-200 hover:scale-[1.03] active:scale-95 transition-all text-center tracking-tight"
              >
                Book Appointment
              </button>
              <p className="text-center text-xs font-bold text-gray-400 mt-6 uppercase tracking-[0.2em] opacity-60">Verified Professional Profile</p>
            </div>
          </div>
        </div>
      </div>

      {selectedDate && selectedTime && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-2xl animate-in slide-in-from-bottom-20 duration-500">
          <div className="p-2 bg-white/60 backdrop-blur-2xl rounded-[40px] shadow-2xl border border-white/50">
            <button
              onClick={handleBooking}
              disabled={isBooking || !reason.trim()}
              className="w-full p-7 bg-gradient-to-r from-[var(--color-brand)] via-[var(--color-brand-dark)] to-[var(--color-brand)] bg-[length:200%_auto] hover:bg-right text-white rounded-[32px] font-black text-2xl shadow-xl flex items-center justify-center gap-5 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 tracking-tight"
            >
              {isBooking ? (
                <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Confirm for ₹{doctor.consultationFee}</span>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

