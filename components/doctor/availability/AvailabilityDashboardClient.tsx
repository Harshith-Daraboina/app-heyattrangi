"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

const DAYS_OF_WEEK = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]

interface AvailabilityDashboardClientProps {
  initialAvailability: any
  initialDoctorSettings: {
    appointmentDuration: number | null
    slotBuffer: number | null
  }
}

export default function AvailabilityDashboardClient({ initialAvailability, initialDoctorSettings }: AvailabilityDashboardClientProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [isAvailable, setIsAvailable] = useState(initialAvailability?.isAvailable ?? true)
  const [startTime, setStartTime] = useState(initialAvailability?.startTime || "09:00")
  const [endTime, setEndTime] = useState(initialAvailability?.endTime || "17:00")
  const [availableDays, setAvailableDays] = useState<string[]>(
    initialAvailability?.availableDays || ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"]
  )

  const [appointmentDuration, setAppointmentDuration] = useState(initialDoctorSettings?.appointmentDuration || 45)
  const [slotBuffer, setSlotBuffer] = useState(initialDoctorSettings?.slotBuffer || 15)

  // Parse existing breaks
  const existingBreaks = Array.isArray(initialAvailability?.breaks) ? initialAvailability.breaks : []
  const initialBreak = existingBreaks.length > 0 ? existingBreaks[0] : null
  
  const [hasBreak, setHasBreak] = useState(!!initialBreak)
  const [breakStartTime, setBreakStartTime] = useState(initialBreak?.start || "13:00")
  const [breakEndTime, setBreakEndTime] = useState(initialBreak?.end || "14:00")

  const toggleDay = (day: string) => {
    setAvailableDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    )
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/doctor/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          availableDays,
          startTime,
          endTime,
          isAvailable,
          breaks: hasBreak ? [{ start: breakStartTime, end: breakEndTime }] : [],
          appointmentDuration,
          slotBuffer
        })
      })

      if (!res.ok) throw new Error("Failed to save availability")
      
      router.refresh()
      alert("Availability settings saved successfully!")
    } catch (error) {
      console.error(error)
      alert("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 p-8 bg-[#f8fafc] overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Manage Availability</h1>
            <p className="text-gray-500 mt-1">Set your working hours and days to receive patient appointments.</p>
          </div>
          <button 
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition shadow-sm disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {/* Global Toggle */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Accepting Appointments</h2>
            <p className="text-sm text-gray-500 mt-1">Turn this off if you are on leave or not accepting new bookings.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={isAvailable} onChange={(e) => setIsAvailable(e.target.checked)} />
            <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className={`transition-opacity duration-300 ${!isAvailable ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Working Days */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Working Days</h3>
              <div className="space-y-3">
                {DAYS_OF_WEEK.map((day) => {
                  const isSelected = availableDays.includes(day)
                  return (
                    <div 
                      key={day}
                      onClick={() => toggleDay(day)}
                      className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}
                    >
                      <span className={`font-semibold ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>
                        {day.charAt(0) + day.slice(1).toLowerCase()}
                      </span>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                        {isSelected && (
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Timings */}
            <div className="space-y-8">
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Standard Timings</h3>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                    <input 
                      type="time" 
                      value={startTime} 
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-medium" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                    <input 
                      type="time" 
                      value={endTime} 
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-medium" 
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-4 leading-relaxed">
                  These timings will be applied across all your selected working days. Appointments outside this window will not be bookable by patients.
                </p>
              </div>

              {/* Daily Break Section */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Daily Break (Time Not Wanting)</h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={hasBreak} onChange={(e) => setHasBreak(e.target.checked)} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className={`space-y-5 transition-opacity duration-300 ${!hasBreak ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Break Start Time</label>
                    <input 
                      type="time" 
                      value={breakStartTime} 
                      onChange={(e) => setBreakStartTime(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-medium" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Break End Time</label>
                    <input 
                      type="time" 
                      value={breakEndTime} 
                      onChange={(e) => setBreakEndTime(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-medium" 
                    />
                  </div>
                </div>
              </div>

              {/* Session Settings */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Session Settings</h3>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Session Duration (minutes)</label>
                    <select
                      value={appointmentDuration}
                      onChange={(e) => setAppointmentDuration(Number(e.target.value))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-medium"
                    >
                      <option value={15}>15 Minutes</option>
                      <option value={30}>30 Minutes</option>
                      <option value={45}>45 Minutes</option>
                      <option value={60}>60 Minutes</option>
                      <option value={90}>90 Minutes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Break Between Sessions (Buffer in mins)</label>
                    <select
                      value={slotBuffer}
                      onChange={(e) => setSlotBuffer(Number(e.target.value))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-medium"
                    >
                      <option value={0}>No break (Back-to-back)</option>
                      <option value={5}>5 Minutes</option>
                      <option value={10}>10 Minutes</option>
                      <option value={15}>15 Minutes</option>
                      <option value={30}>30 Minutes</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Informational Widget */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-6 border border-blue-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-blue-900">How scheduling works</h4>
                </div>
                <p className="text-sm text-blue-800/80 leading-relaxed">
                  Your appointment duration and buffer times (set in your Profile) will automatically divide these working hours into bookable slots. You can view your upcoming bookings in the Appointments tab.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
