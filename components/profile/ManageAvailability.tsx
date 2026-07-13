"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface Availability {
  availableDays: string[]
  startTime: string | null
  endTime: string | null
  isAvailable: boolean
  breaks?: any
  appointmentDuration?: number
  slotBuffer?: number
}

interface ManageAvailabilityProps {
  doctorId: string
  currentAvailability?: Availability | null
}

const DAYS_OF_WEEK = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
]

export default function ManageAvailability({
  doctorId,
  currentAvailability,
}: ManageAvailabilityProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  const initialDuration = currentAvailability?.appointmentDuration || 45
  const [durationMode, setDurationMode] = useState<"45" | "60" | "custom">(
    initialDuration === 45 ? "45" : initialDuration === 60 ? "60" : "custom"
  )

  const initialBuffer = currentAvailability?.slotBuffer ?? 15
  const [bufferMode, setBufferMode] = useState<"10" | "15" | "30" | "custom">(
    initialBuffer === 10 ? "10" : initialBuffer === 15 ? "15" : initialBuffer === 30 ? "30" : "custom"
  )

  const [availability, setAvailability] = useState<Availability>({
    availableDays: currentAvailability?.availableDays || [],
    startTime: currentAvailability?.startTime || "09:00",
    endTime: currentAvailability?.endTime || "17:00",
    isAvailable: currentAvailability?.isAvailable ?? true,
    breaks: currentAvailability?.breaks || [],
    appointmentDuration: initialDuration,
    slotBuffer: initialBuffer,
  })

  const toggleDay = (day: string) => {
    setAvailability((prev) => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter((d) => d !== day)
        : [...prev.availableDays, day],
    }))
  }

  const addBreak = () => {
    setAvailability((prev) => ({
      ...prev,
      breaks: [...(prev.breaks || []), { startTime: "13:00", endTime: "14:00" }],
    }))
  }

  const removeBreak = (index: number) => {
    setAvailability((prev) => ({
      ...prev,
      breaks: prev.breaks.filter((_: any, i: number) => i !== index),
    }))
  }

  const updateBreak = (index: number, field: "startTime" | "endTime", value: string) => {
    setAvailability((prev) => ({
      ...prev,
      breaks: prev.breaks.map((b: any, i: number) => 
        i === index ? { ...b, [field]: value } : b
      ),
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch("/api/doctor/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId,
          availableDays: availability.availableDays,
          startTime: availability.startTime,
          endTime: availability.endTime,
          isAvailable: availability.isAvailable,
          breaks: availability.breaks,
          appointmentDuration: availability.appointmentDuration,
          slotBuffer: availability.slotBuffer,
        }),
      })

      if (response.ok) {
        router.refresh()
        alert("Availability updated successfully!")
      } else {
        const error = await response.json()
        alert(error.error || "Failed to update availability")
      }
    } catch (error) {
      console.error("Error updating availability:", error)
      alert("Failed to update availability. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Manage Availability
          </h2>
          <p className="text-gray-600">Set your working days and hours</p>
        </div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={availability.isAvailable}
            onChange={(e) =>
              setAvailability({ ...availability, isAvailable: e.target.checked })
            }
            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">Available for appointments</span>
        </label>
      </div>

      <div className="space-y-6">
        {/* Available Days */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Available Days
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {DAYS_OF_WEEK.map((day) => (
              <button
                key={day}
                onClick={() => toggleDay(day)}
                className={`p-3 rounded-lg border-2 font-medium transition-all ${
                  availability.availableDays.includes(day)
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
              >
                {day.slice(0, 3)}
              </button>
            ))}
          </div>
          {availability.availableDays.length === 0 && (
            <p className="text-sm text-amber-600 mt-2">
              Please select at least one day
            </p>
          )}
        </div>

        {/* Appointment Slot Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Appointment Slot Duration
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setDurationMode("45")
                setAvailability(prev => ({ ...prev, appointmentDuration: 45 }))
              }}
              className={`px-5 py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${
                durationMode === "45"
                  ? "border-blue-500 bg-blue-50/50 text-blue-700"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
            >
              45 Minutes
            </button>
            <button
              onClick={() => {
                setDurationMode("60")
                setAvailability(prev => ({ ...prev, appointmentDuration: 60 }))
              }}
              className={`px-5 py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${
                durationMode === "60"
                  ? "border-blue-500 bg-blue-50/50 text-blue-700"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
            >
              1 Hour (60 Min)
            </button>
            <button
              onClick={() => {
                setDurationMode("custom")
              }}
              className={`px-5 py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${
                durationMode === "custom"
                  ? "border-blue-500 bg-blue-50/50 text-blue-700"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
            >
              Custom Duration
            </button>

            {durationMode === "custom" && (
              <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                <input
                  type="number"
                  min="5"
                  max="240"
                  value={availability.appointmentDuration || 45}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 45
                    setAvailability(prev => ({ ...prev, appointmentDuration: val }))
                  }}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-bold text-center text-sm outline-none"
                />
                <span className="text-sm font-bold text-gray-400">minutes</span>
              </div>
            )}
          </div>
        </div>

        {/* Break time between slots */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Break Time Between Slots (Buffer)
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setBufferMode("10")
                setAvailability(prev => ({ ...prev, slotBuffer: 10 }))
              }}
              className={`px-5 py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${
                bufferMode === "10"
                  ? "border-blue-500 bg-blue-50/50 text-blue-700"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
            >
              10 Minutes
            </button>
            <button
              onClick={() => {
                setBufferMode("15")
                setAvailability(prev => ({ ...prev, slotBuffer: 15 }))
              }}
              className={`px-5 py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${
                bufferMode === "15"
                  ? "border-blue-500 bg-blue-50/50 text-blue-700"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
            >
              15 Minutes
            </button>
            <button
              onClick={() => {
                setBufferMode("30")
                setAvailability(prev => ({ ...prev, slotBuffer: 30 }))
              }}
              className={`px-5 py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${
                bufferMode === "30"
                  ? "border-blue-500 bg-blue-50/50 text-blue-700"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
            >
              30 Minutes
            </button>
            <button
              onClick={() => {
                setBufferMode("custom")
              }}
              className={`px-5 py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${
                bufferMode === "custom"
                  ? "border-blue-500 bg-blue-50/50 text-blue-700"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
            >
              Custom Break
            </button>

            {bufferMode === "custom" && (
              <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={availability.slotBuffer ?? 15}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) ?? 15
                    setAvailability(prev => ({ ...prev, slotBuffer: val }))
                  }}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-bold text-center text-sm outline-none"
                />
                <span className="text-sm font-bold text-gray-400">minutes</span>
              </div>
            )}
          </div>
        </div>

        {/* Working Hours */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Time
            </label>
            <input
              type="time"
              value={availability.startTime || ""}
              onChange={(e) =>
                setAvailability({ ...availability, startTime: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Time
            </label>
            <input
              type="time"
              value={availability.endTime || ""}
              onChange={(e) =>
                setAvailability({ ...availability, endTime: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
            />
          </div>
        </div>

        {/* Breaks / Unavailable Times */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              Breaks / Unavailable Times
            </label>
            <button
              onClick={addBreak}
              className="text-[13px] font-bold text-blue-500 hover:text-blue-600 flex items-center gap-1.5"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Break
            </button>
          </div>
          
          <div className="space-y-3">
            {availability.breaks && availability.breaks.length > 0 ? (
              availability.breaks.map((brk: any, index: number) => (
                <div key={index} className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100 group transition-all">
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-1">Start</span>
                      <input
                        type="time"
                        value={brk.startTime}
                        onChange={(e) => updateBreak(index, "startTime", e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm font-medium"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-1">End</span>
                      <input
                        type="time"
                        value={brk.endTime}
                        onChange={(e) => updateBreak(index, "endTime", e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm font-medium"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => removeBreak(index)}
                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    title="Remove break"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-6 border-2 border-dashed border-gray-100 rounded-2xl">
                <p className="text-sm text-gray-400 font-medium">No breaks added yet</p>
              </div>
            )}
          </div>
        </div>
        </div>

        {/* Save Button */}
        <div className="pt-4">
          <button
            onClick={handleSave}
            disabled={isSaving || availability.availableDays.length === 0}
            className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
          >
            {isSaving ? "Saving..." : "Save Availability"}
          </button>
        </div>
      </div>
  )
}

