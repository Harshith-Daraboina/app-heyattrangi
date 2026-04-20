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
  appointments?: { appointmentDate: Date }[]
}

interface TherapistBookingPanelProps {
  doctor: Doctor
}

export default function TherapistBookingPanel({ doctor }: TherapistBookingPanelProps) {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [availableSlots, setAvailableSlots] = useState<{ time: string; isBooked: boolean }[]>([])
  const [isBooking, setIsBooking] = useState(false)
  const [reason, setReason] = useState("")

  const displayPhoto = doctor.profilePhoto || doctor.user.image
  const specialization = doctor.primarySpecialization || doctor.specialization || "Therapist"

  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    // Using raw system clock for 'now' as it aligns with user's reported time
    setNow(new Date())
    
    const timer = setInterval(() => {
      setNow(new Date())
    }, 60000)
    
    return () => clearInterval(timer)
  }, [])

  // Helper to generate slots for a specific date
  const getSlotsForDate = (dateStr: string) => {
    const slots: { time: string; isBooked: boolean }[] = []
    if (!now) return slots

    const startTime = doctor.availability?.startTime || "09:00"
    const endTime = doctor.availability?.endTime || "17:00"
    const duration = doctor.appointmentDuration || 30

    const [startHour, startMin] = startTime.split(":").map(Number)
    const [endHour, endMin] = endTime.split(":").map(Number)

    const [y_sel, m_sel, d_sel] = dateStr.split("-").map(Number)
    const isToday = now.getUTCFullYear() === y_sel && 
                    now.getUTCMonth() === m_sel - 1 && 
                    now.getUTCDate() === d_sel

    const nowTime = now.getTime()
    const bufferTime = nowTime + (60 * 60 * 1000)

    // Generate slots in UTC
    for (let h = startHour; h <= endHour; h++) {
      for (let m = 0; m < 60; m += duration) {
        if (h === startHour && m < startMin) continue
        if (h === endHour && m >= endMin) break

        const slotTime = new Date(Date.UTC(y_sel, m_sel - 1, d_sel, h, m))
        const timeStr = slotTime.toLocaleTimeString("en-US", {
          hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "UTC"
        })
        
        // Buffer Check (for Today)
        const isPast = isToday && (slotTime.getTime() < bufferTime)

        // Appointment Check
        const isBooked = isPast || doctor.appointments?.some(appt => {
          const apptDate = new Date(appt.appointmentDate)
          return Math.abs(apptDate.getTime() - slotTime.getTime()) < 1000 // Compare within 1 second
        }) || false

        slots.push({ time: timeStr, isBooked })
      }
    }
    return slots
  }

  // Generate available dates (next 14 days)
  const availableDates = (() => {
    const dates: { date: string; dayName: string; dayNum: number; isFull: boolean }[] = []
    const today = new Date()
    
    const dayNameMap: { [key: number]: string } = {
      0: "SUNDAY", 1: "MONDAY", 2: "TUESDAY", 3: "WEDNESDAY", 
      4: "THURSDAY", 5: "FRIDAY", 6: "SATURDAY",
    }
    
    for (let i = 0; i <= 14; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      const dayOfWeek = date.getDay()
      const dayName = dayNameMap[dayOfWeek]
      
      if (doctor.availability?.availableDays?.includes(dayName)) {
        const dateStr = date.toISOString().split("T")[0]
        const daySlots = getSlotsForDate(dateStr)
        const isFull = daySlots.length > 0 && daySlots.every(s => s.isBooked)

        dates.push({
          date: dateStr,
          dayName: i === 0 ? "TODAY" : date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
          dayNum: date.getDate(),
          isFull
        })
      }
    }
    return dates
  })()

  useEffect(() => {
    if (!selectedDate || !doctor.availability) {
      setAvailableSlots([])
      return
    }

    setAvailableSlots(getSlotsForDate(selectedDate))
    setSelectedTime("") 
  }, [selectedDate, doctor.availability, doctor.appointmentDuration, doctor.appointments])

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) return
    const targetSlot = availableSlots.find(s => s.time === selectedTime)
    if (targetSlot?.isBooked) {
      alert("This slot is already booked. Please choose another one.")
      return
    }

    if (!reason.trim()) {
      alert("Please provide a reason for the appointment")
      return
    }
    setIsBooking(true)
    try {
      const dateStr = selectedDate.split("T")[0]
      const timeMatch = selectedTime.match(/(\d+):(\d+)\s*(AM|PM)/i)
      if (!timeMatch) return

      const [, hours, minutes, period] = timeMatch
      let hour24 = parseInt(hours)
      if (period.toUpperCase() === "PM" && hour24 !== 12) hour24 += 12
      else if (period.toUpperCase() === "AM" && hour24 === 12) hour24 = 0
      
      const [y, m, d] = dateStr.split("-").map(Number)
      const appointmentDateTime = new Date(Date.UTC(y, m - 1, d, hour24, parseInt(minutes)))
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

  return (
    <div className="bg-white min-h-screen pb-32 animate-in fade-in duration-500">
      {/* Header Profile Section */}
      <div className="flex items-center gap-6 mb-10">
        <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-100 flex-shrink-0">
          {displayPhoto ? (
            <img src={displayPhoto} alt={doctor.fullName || "Therapist"} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50 text-3xl font-bold text-gray-400">
              {(doctor.fullName || doctor.user.name || "T")[0]}
            </div>
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {doctor.fullName || doctor.user.name || "Therapist"}
          </h1>
          <p className="text-gray-400 font-medium mb-2 lowercase">{specialization}</p>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-yellow-400">★</span>
            <span className="text-sm font-bold text-gray-900">5.0</span>
          </div>
          <button className="text-xs font-bold text-orange-500 hover:underline">See reviews</button>
        </div>
      </div>

      {/* Information Section */}
      <section className="mb-10">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Information</h3>
        <div className="space-y-4">
          <InfoRow label="Specialization" value={specialization} />
          <InfoRow label="Location" value="Main Office, Online" />
          <InfoRow label="Years experiences" value={`${doctor.yearsOfExperience || "5"}+`} />
          <InfoRow label="Phone number" value="(217) 555-1234" />
          <InfoRow label="Reviews" value="104" />
        </div>
      </section>

      {/* Working Hours Section */}
      <section className="mb-10">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Working Hours</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 font-medium">Mon-Fri</span>
            <span className="text-gray-900 font-bold">{doctor.availability?.startTime || "08:00"}-{doctor.availability?.endTime || "19:00"}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 font-medium">Sat-Sun</span>
            <span className="text-gray-900 font-bold">09:00-13:00</span>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section className="mb-10">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Make an appointment</h3>
        
        <div className="mb-8">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-300 mb-4">Choose Day</p>
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {availableDates.map((item) => (
              <button
                key={item.date}
                onClick={() => setSelectedDate(item.date)}
                className={`flex-shrink-0 w-16 h-20 rounded-2xl border-2 flex flex-col items-center justify-center transition-all ${
                  selectedDate === item.date 
                  ? "border-orange-500 bg-orange-500 text-white shadow-lg shadow-orange-100" 
                  : item.isFull
                    ? "border-red-300 bg-white text-black opacity-40"
                    : "border-green-400 bg-white text-black hover:border-green-500"
                }`}
              >
                <span className={`text-[9px] font-black mb-1 ${selectedDate === item.date ? "text-white" : "opacity-40"}`}>{item.dayName}</span>
                <span className="text-lg font-black">{item.dayNum}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-end mb-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">Choose Time</p>
          {now && (
            <p className="text-[9px] font-bold text-red-500 uppercase tracking-tight animate-pulse">
              Current UTC: {now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "UTC" })}
            </p>
          )}
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {availableSlots.length > 0 ? (
              availableSlots.map((slot) => (
                <button
                  key={slot.time}
                  disabled={slot.isBooked}
                  onClick={() => setSelectedTime(slot.time)}
                  className={`py-3 rounded-full border-2 text-xs font-bold transition-all ${
                    selectedTime === slot.time 
                    ? "border-orange-500 bg-orange-500 text-white shadow-lg shadow-orange-100" 
                    : slot.isBooked
                      ? "border-red-200 bg-white text-black opacity-30 cursor-not-allowed"
                      : "border-green-400 bg-white text-black hover:border-green-500"
                  }`}
                >
                  {slot.time}
                </button>
              ))
            ) : (
              <p className="col-span-full text-xs text-gray-400 font-medium py-4 italic">Please select a date first</p>
            )}
          </div>

        <div className="mt-8 space-y-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-300 mb-2">Reason for appointment</p>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Ex: Anxiety, workplace stress, etc."
            className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-orange-500 focus:bg-white outline-none min-h-[100px] text-sm font-medium transition-all"
          />
        </div>
      </section>

      {/* Sticky Bottom Button */}
      <div className="sticky bottom-0 left-0 right-0 p-6 -mx-6 bg-white/80 backdrop-blur-xl border-t border-gray-100 flex justify-center z-50">
        <button
          onClick={handleBooking}
          disabled={isBooking || !selectedDate || !selectedTime || !reason.trim()}
          className="w-full max-w-xl py-5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-2xl font-bold text-lg shadow-xl shadow-orange-100 transition-all flex items-center justify-center gap-3"
        >
          {isBooking ? (
            <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            "Book an appointment"
          )}
        </button>
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-400 font-medium">{label}</span>
      <span className="text-gray-900 font-bold">{value}</span>
    </div>
  )
}

