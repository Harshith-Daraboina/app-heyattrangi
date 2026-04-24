"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  eachDayOfInterval
} from "date-fns"

interface Doctor {
  id: string
  fullName: string | null
  profilePhoto: string | null
  primarySpecialization: string | null
  specialization: string | null
  yearsOfExperience: number | null
  consultationFee: number
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
  appointments?: { appointmentDate: Date }[]
}

interface TherapistBookingPanelProps {
  doctor: Doctor
}

export default function TherapistBookingPanel({ doctor }: TherapistBookingPanelProps) {
  const router = useRouter()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [isBooking, setIsBooking] = useState(false)
  const [reason, setReason] = useState("")

  const displayPhoto = doctor.profilePhoto || doctor.user.image
  const specialization = doctor.primarySpecialization || doctor.specialization || "Therapist"

  // Helper to generate slots for a specific date
  const getSlotsForDate = (date: Date) => {
    const slots: { time: string; status: 'available' | 'booked' | 'unavailable' }[] = []
    
    const startTime = doctor.availability?.startTime || "09:00"
    const endTime = doctor.availability?.endTime || "17:00"
    const duration = doctor.appointmentDuration || 60

    const [startHour, startMin] = startTime.split(":").map(Number)
    const [endHour, endMin] = endTime.split(":").map(Number)

    const dayName = format(date, "EEEE").toUpperCase()
    if (!doctor.availability?.availableDays?.includes(dayName)) return []

    const now = new Date()
    const bufferTime = now.getTime() + (60 * 60 * 1000)

    for (let h = startHour; h <= endHour; h++) {
      for (let m = 0; m < 60; m += duration) {
        if (h === startHour && m < startMin) continue
        if (h === endHour && m >= endMin) break

        const slotTime = new Date(date)
        slotTime.setHours(h, m, 0, 0)
        
        const timeStr = format(slotTime, "h:mm a")
        
        const isPast = slotTime.getTime() < bufferTime
        const isAlreadyBooked = doctor.appointments?.some(appt => {
          return Math.abs(new Date(appt.appointmentDate).getTime() - slotTime.getTime()) < 1000
        }) || false

        slots.push({ 
          time: timeStr, 
          status: isAlreadyBooked ? 'booked' : isPast ? 'unavailable' : 'available' 
        })
      }
    }
    return slots
  }

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !reason.trim()) return
    setIsBooking(true)
    try {
      const timeMatch = selectedTime.match(/(\d+):(\d+)\s*(AM|PM)/i)
      if (!timeMatch) return

      let [, hours, minutes, period] = timeMatch
      let hour24 = parseInt(hours)
      if (period.toUpperCase() === "PM" && hour24 !== 12) hour24 += 12
      else if (period.toUpperCase() === "AM" && hour24 === 12) hour24 = 0
      
      const appointmentDateTime = new Date(selectedDate)
      appointmentDateTime.setHours(hour24, parseInt(minutes), 0, 0)

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
    } finally {
      setIsBooking(false)
    }
  }

  // Monthly Calendar Logic
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate })

  // Weekly View Logic (based on selected date)
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 })
  const weekViewDays = Array.from({ length: 6 }).map((_, i) => addDays(weekStart, i + 2)) // Wed - Mon (matching mockup feel)

  return (
    <div className="bg-white rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden flex flex-col p-8 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-gray-50">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-50 relative shrink-0">
            {displayPhoto ? (
              <Image src={displayPhoto} alt={doctor.fullName || "Therapist"} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-50 text-2xl font-bold text-gray-300">
                {(doctor.fullName || "T")[0]}
              </div>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 leading-tight">
                {doctor.fullName || doctor.user.name || "Therapist"}
            </h1>
            <h2 className="text-xl font-bold text-gray-800 mt-0.5">
                {specialization}: 1-on-1 Session
            </h2>
          </div>
        </div>
        
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2.5 text-gray-500 font-bold text-sm">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
            <span>60 min appointments</span>
            <span className="bg-gray-100 px-3 py-1 rounded-md text-gray-700 text-[12px] ml-2">{specialization}</span>
          </div>
          <div className="flex items-center gap-2.5 text-gray-500 font-bold text-sm">
            <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" />
            </svg>
            <span>Hey Attrangi Meet video conference info added after booking</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Info & Month Calendar */}
        <div className="lg:col-span-4 border-r border-gray-50 pr-8">
            <div className="mb-10 pb-8 border-b border-gray-50">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Therapist Info</h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 font-bold">Experience</span>
                        <span className="text-gray-900 font-black">{doctor.yearsOfExperience || "5"}+ Years</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 font-bold">Location</span>
                        <span className="text-gray-900 font-black">Main Office, Online</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 font-bold">Fee</span>
                        <span className="text-gray-900 font-black">₹{doctor.consultationFee}</span>
                    </div>
                </div>

                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mt-8 mb-6">Working Hours</h3>
                <div className="space-y-3">
                    <div className="flex justify-between items-center text-[12px]">
                        <span className="text-gray-500 font-bold">Mon - Fri</span>
                        <span className="text-gray-900 font-black">{doctor.availability?.startTime || "09:00"} - {doctor.availability?.endTime || "17:00"}</span>
                    </div>
                    <div className="flex justify-between items-center text-[12px]">
                        <span className="text-gray-500 font-bold">Sat - Sun</span>
                        <span className="text-gray-900 font-black">09:00 - 13:00</span>
                    </div>
                </div>
            </div>

            <h3 className="text-lg font-black text-gray-800 mb-6">Select an appointment time</h3>
            
            <div className="flex items-center justify-between mb-6">
                <span className="font-extrabold text-[15px] text-gray-800">{format(currentMonth, "MMMM yyyy")}</span>
                <div className="flex gap-2">
                    <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-1 text-gray-400 hover:text-gray-800 transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-1 text-gray-400 hover:text-gray-800 transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-y-2 mb-4">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                    <div key={d} className="text-[10px] font-black text-gray-300 text-center">{d}</div>
                ))}
                {calendarDays.map((date, i) => (
                    <button
                        key={i}
                        onClick={() => setSelectedDate(date)}
                        disabled={!isSameMonth(date, monthStart)}
                        className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold transition-all mx-auto
                            ${!isSameMonth(date, monthStart) ? 'text-gray-200 cursor-default' : 
                              isSameDay(date, selectedDate) ? 'bg-orange-600 text-white shadow-lg shadow-orange-100' : 
                              'text-gray-600 hover:bg-orange-50'}
                            ${isSameDay(date, new Date()) && !isSameDay(date, selectedDate) ? 'text-orange-600 outline outline-1 outline-orange-100' : ''}
                        `}
                    >
                        {format(date, "d")}
                    </button>
                ))}
            </div>

            <div className="mt-8">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Reason for appointment</p>
                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Briefly describe your needs..."
                    className="w-full p-4 bg-gray-50 rounded-xl border-2 border-transparent focus:border-orange-500 focus:bg-white outline-none min-h-[120px] text-sm font-medium transition-all"
                />
            </div>
        </div>

        {/* Right Column: Weekly Slots */}
        <div className="lg:col-span-8">
            <div className="flex justify-between items-center mb-8">
                <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Available Slots (UTC)</span>
                <span className="text-gray-400 text-xs font-bold">(GMT+00:00) Coordinated Universal Time</span>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {weekViewDays.map((dayDate, i) => {
                    const slots = getSlotsForDate(dayDate)
                    const isSelectedDay = isSameDay(dayDate, selectedDate)
                    
                    return (
                        <div key={i} className="flex flex-col items-center min-w-[120px] shrink-0">
                            <div className={`text-center mb-6 py-2 px-4 rounded-xl transition-all ${isSelectedDay ? 'bg-orange-50' : ''}`}>
                                <p className="text-[11px] font-black text-gray-400 uppercase tracking-tighter mb-1">{format(dayDate, "EEE")}</p>
                                <p className="text-xl font-black text-gray-900">{format(dayDate, "d")}</p>
                            </div>
                            
                            <div className="flex flex-col gap-3 w-full">
                                {slots.length > 0 ? (
                                    slots.map((slot, si) => (
                                        <button
                                            key={si}
                                            disabled={slot.status !== 'available'}
                                            onClick={() => {
                                                setSelectedDate(dayDate)
                                                setSelectedTime(slot.time)
                                            }}
                                            className={`py-3 px-4 rounded-xl border-2 text-[13px] font-extrabold transition-all text-center
                                                ${selectedTime === slot.time && isSelectedDay
                                                    ? "bg-orange-600 border-orange-600 text-white shadow-md"
                                                    : slot.status === 'booked'
                                                        ? "border-red-100 bg-red-50 text-red-500 cursor-not-allowed opacity-70"
                                                        : slot.status === 'unavailable'
                                                            ? "border-gray-50 bg-gray-50 text-gray-300 cursor-not-allowed"
                                                            : "border-blue-100 text-blue-600 hover:border-orange-600 hover:bg-orange-600 hover:text-white"
                                                }
                                            `}
                                        >
                                            {slot.time}
                                        </button>
                                    ))
                                ) : (
                                    <div className="h-0.5 w-6 bg-gray-100 rounded-full mx-auto mt-4" />
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="mt-12 flex justify-end">
                <button
                    onClick={handleBooking}
                    disabled={isBooking || !selectedDate || !selectedTime || !reason.trim()}
                    className="px-10 py-5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-2xl font-black text-lg shadow-xl shadow-orange-100 transition-all flex items-center justify-center gap-4 min-w-[300px]"
                >
                    {isBooking ? (
                        <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                        "Confirm Appointment"
                    )}
                </button>
            </div>
        </div>

      </div>

    </div>
  )
}

