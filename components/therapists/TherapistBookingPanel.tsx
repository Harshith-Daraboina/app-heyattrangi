"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface Doctor {
  id: string
  fullName: string | null
  profilePhoto: string | null
  primarySpecialization: string | null
  specialization: string | null
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

  // Generate available dates (next 14 days)
  const generateAvailableDates = () => {
    const dates: string[] = []
    const today = new Date()
    
    // Map of day names to uppercase format (matching the format stored in database)
    const dayNameMap: { [key: number]: string } = {
      0: "SUNDAY",
      1: "MONDAY",
      2: "TUESDAY",
      3: "WEDNESDAY",
      4: "THURSDAY",
      5: "FRIDAY",
      6: "SATURDAY",
    }
    
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      
      // Get day of week (0 = Sunday, 1 = Monday, etc.) and convert to uppercase day name
      const dayOfWeek = date.getDay()
      const dayName = dayNameMap[dayOfWeek]
      
      // Check if doctor is available on this day
      if (doctor.availability?.availableDays?.includes(dayName)) {
        dates.push(date.toISOString().split("T")[0])
      }
    }
    return dates
  }

  // Generate time slots for selected date
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
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
        slots.push(timeStr)
        
        current.setMinutes(current.getMinutes() + duration)
      }

      return slots
    }

    setAvailableSlots(generateTimeSlots())
    setSelectedTime("") // Reset selected time when date changes
  }, [selectedDate, doctor.availability, doctor.appointmentDuration])

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) {
      alert("Please select a date and time for your appointment")
      return
    }

    if (!reason.trim()) {
      alert("Please provide a reason for the appointment")
      return
    }

    setIsBooking(true)
    try {
      // Combine date and time
      const dateStr = selectedDate.includes("T") ? selectedDate.split("T")[0] : selectedDate
      const timeMatch = selectedTime.match(/(\d+):(\d+)\s*(AM|PM)/i)
      
      if (!timeMatch) {
        alert("Invalid time format. Please select a valid time.")
        setIsBooking(false)
        return
      }

      const [, hours, minutes, period] = timeMatch
      let hour24 = parseInt(hours)
      
      if (period.toUpperCase() === "PM" && hour24 !== 12) {
        hour24 += 12
      } else if (period.toUpperCase() === "AM" && hour24 === 12) {
        hour24 = 0
      }

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
        alert("Appointment booked successfully! Redirecting to payment...")
        router.push(`/patient/appointments/${data.appointmentId}/payment`)
      } else {
        const error = await response.json()
        alert(error.error || "Failed to book appointment. Please try again.")
      }
    } catch (error) {
      console.error("Error booking appointment:", error)
      alert("Failed to book appointment. Please try again.")
    } finally {
      setIsBooking(false)
    }
  }

  const availableDates = generateAvailableDates()

  return (
    <div className="space-y-6">
      {/* Therapist Info Card */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-start gap-6 mb-6">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-teal-200 bg-gradient-to-br from-teal-400 to-emerald-400 flex items-center justify-center flex-shrink-0">
            {displayPhoto ? (
              <img
                src={displayPhoto}
                alt={doctor.fullName || "Therapist"}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-4xl text-white font-semibold">
                {(doctor.fullName || doctor.user.name || "T")[0].toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-semibold text-gray-800 mb-2">
              {doctor.fullName || doctor.user.name || "Therapist"}
            </h1>
            <p className="text-gray-600 mb-4">{specialization}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
              {doctor.yearsOfExperience && (
                <div>
                  <span className="text-gray-500">Experience:</span>
                  <p className="font-medium text-gray-800">{doctor.yearsOfExperience} years</p>
                </div>
              )}
              <div>
                <span className="text-gray-500">Fee:</span>
                <p className="font-medium text-gray-800">₹{doctor.consultationFee}</p>
              </div>
              {doctor.appointmentDuration && (
                <div>
                  <span className="text-gray-500">Duration:</span>
                  <p className="font-medium text-gray-800">{doctor.appointmentDuration} min</p>
                </div>
              )}
              {doctor.languagesSpoken && doctor.languagesSpoken.length > 0 && (
                <div>
                  <span className="text-gray-500">Languages:</span>
                  <p className="font-medium text-gray-800">{doctor.languagesSpoken.join(", ")}</p>
                </div>
              )}
            </div>

            {doctor.bio && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">About</h3>
                <p className="text-gray-600 text-sm whitespace-pre-wrap">{doctor.bio}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Form */}
      {!doctor.availability?.isAvailable ? (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 text-center">
          <p className="text-yellow-800 font-medium">
            This therapist is currently not accepting new appointments.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Book an Appointment</h2>

          <div className="space-y-6">
            {/* Select Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Date *
              </label>
              {availableDates.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  No available dates. Please check back later.
                </p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
                  {availableDates.map((date) => {
                    const dateObj = new Date(date)
                    const dayName = dateObj.toLocaleDateString("en-US", { weekday: "short" })
                    const dayNum = dateObj.getDate()
                    const isSelected = selectedDate === date

                    return (
                      <button
                        key={date}
                        onClick={() => setSelectedDate(date)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          isSelected
                            ? "border-teal-500 bg-teal-50 text-teal-700"
                            : "border-gray-200 hover:border-teal-300 text-gray-700"
                        }`}
                      >
                        <div className="text-xs font-medium">{dayName}</div>
                        <div className="text-lg font-semibold">{dayNum}</div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Select Time */}
            {selectedDate && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Time *
                </label>
                {availableSlots.length === 0 ? (
                  <p className="text-gray-500 text-sm">No available slots for this date.</p>
                ) : (
                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                    {availableSlots.map((time) => {
                      const isSelected = selectedTime === time
                      return (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`px-4 py-2 rounded-lg border-2 transition-all ${
                            isSelected
                              ? "border-teal-500 bg-teal-50 text-teal-700 font-medium"
                              : "border-gray-200 hover:border-teal-300 text-gray-700"
                          }`}
                        >
                          {time}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Reason for Appointment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Appointment *
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Briefly describe the reason for your appointment..."
              />
            </div>

            {/* Booking Summary */}
            {selectedDate && selectedTime && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Appointment Summary</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Date:</span>{" "}
                    {new Date(selectedDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p>
                    <span className="font-medium">Time:</span> {selectedTime}
                  </p>
                  <p>
                    <span className="font-medium">Duration:</span> {doctor.appointmentDuration || 30} minutes
                  </p>
                  <p className="pt-2 border-t border-gray-300">
                    <span className="font-medium">Total Fee:</span>{" "}
                    <span className="text-lg font-bold text-gray-800">₹{doctor.consultationFee}</span>
                  </p>
                </div>
              </div>
            )}

            {/* Book Button */}
            <button
              onClick={handleBooking}
              disabled={!selectedDate || !selectedTime || !reason.trim() || isBooking}
              className="w-full py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl font-semibold hover:from-teal-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
            >
              {isBooking ? "Booking..." : `Book Appointment - ₹${doctor.consultationFee}`}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

