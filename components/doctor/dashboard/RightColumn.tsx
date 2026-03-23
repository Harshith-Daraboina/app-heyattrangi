"use client"

import Link from "next/link"
import { useState } from "react"
import { startOfMonth, endOfMonth, eachDayOfInterval, format, addMonths, subMonths, isSameDay, getDay } from "date-fns"

const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

export default function RightColumn({ upcomingAppointments }: { upcomingAppointments: any[] }) {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState(new Date())

    const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1))
    const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1))

    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

    const startDayOfWeek = getDay(monthStart)
    const emptyDays = Array.from({ length: startDayOfWeek }, (_, i) => i)

    const displayAppointments = upcomingAppointments && upcomingAppointments.length > 0 ? upcomingAppointments.slice(0, 3) : []

    return (
        <div className="hidden xl:flex flex-col w-[340px] bg-white h-full px-8 py-10 relative">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-bold text-gray-900">Scheduled Sessions</h3>
            </div>

            {/* Calendar Area */}
            <div className="bg-white rounded-[24px] p-6 shadow-[0_2px_20px_-5px_rgba(0,0,0,0.03)] border border-gray-100 mb-6">
                <div className="flex gap-2 p-1 bg-gray-50 rounded-xl mb-6">
                    <button className="flex-1 bg-white text-gray-800 text-xs font-bold py-2 rounded-lg shadow-sm">Monthly</button>
                    <button className="flex-1 text-gray-500 hover:text-gray-800 text-xs font-bold py-2 rounded-lg transition-colors">Daily</button>
                </div>

                <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-sm text-gray-800">{format(currentDate, "MMMM yyyy")}</h4>
                    <div className="flex gap-2">
                        <button onClick={handlePrevMonth} className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-gray-400 text-xs transition-colors hover:text-gray-800">‹</button>
                        <button onClick={handleNextMonth} className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-gray-400 text-xs transition-colors hover:text-gray-800">›</button>
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-y-3 gap-x-1 text-center mb-2">
                    {days.map((d, i) => (
                        <div key={`header-${i}`} className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{d}</div>
                    ))}

                    {emptyDays.map((_, i) => (
                        <div key={`empty-${i}`} className="flex justify-center" />
                    ))}

                    {daysInMonth.map((date, i) => {
                        const isSelected = isSameDay(date, selectedDate)
                        const hasAppointment = upcomingAppointments && upcomingAppointments.some(apt => isSameDay(new Date(apt.appointmentDate), date))

                        return (
                            <div key={`day-${i}`} className="flex justify-center relative">
                                <button
                                    onClick={() => setSelectedDate(date)}
                                    className={`w-7 h-7 flex items-center justify-center text-xs font-bold rounded-full relative z-10 transition-colors
                        ${isSelected
                                            ? 'bg-teal-500 text-white shadow-md shadow-teal-500/30'
                                            : 'text-gray-600 hover:bg-gray-100 cursor-pointer'}
                      `}
                                >
                                    {format(date, "d")}
                                </button>
                                {hasAppointment && !isSelected && (
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-teal-500/80" />
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Upcoming Item list */}
            <div className="space-y-4 flex-1 overflow-y-auto pr-2 pb-16">
                {displayAppointments.length > 0 ? (
                    displayAppointments.map((apt, i) => {
                        const bgClass = i % 2 === 0 ? "bg-[#f4f9f9] border-[#e2eff0] hover:bg-[#ebf5f5]" : "bg-[#fffcf4] border-[#feedd6] hover:bg-[#fff9e8]"
                        const iconBg = i % 2 === 0 ? "bg-teal-100" : "bg-orange-100"

                        return (
                            <div key={apt.id} className={`p-4 rounded-2xl border flex items-center justify-between group cursor-pointer transition-colors ${bgClass}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full ${iconBg} flex items-center justify-center overflow-hidden shrink-0 border-2 border-white shadow-sm`}>
                                        <span className="text-xl relative -bottom-1">🧑</span>
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-sm text-gray-900">{apt.patient?.user?.name || "Patient"}</h5>
                                        <p className="text-xs text-gray-500 font-medium">{format(new Date(apt.appointmentDate), "hh:mm a")} - {format(new Date(apt.appointmentDate), "dd MMM")}</p>
                                    </div>
                                </div>
                                <Link href={`/doctor/appointments`} className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-400 group-hover:text-gray-800 transition-colors text-xs border border-gray-100">›</Link>
                            </div>
                        )
                    })
                ) : (
                    <div className="text-center py-6">
                        <p className="text-sm text-gray-500 font-medium">No schedule found.</p>
                    </div>
                )}
            </div>

            <div className="absolute bottom-6 left-0 right-0 text-center bg-gradient-to-t from-white via-white to-transparent pt-8 pb-4">
                <Link href="/doctor/appointments" className="text-xs font-bold text-gray-700 hover:text-black hover:underline underline-offset-4 decoration-2 decoration-teal-500 inline-flex items-center gap-2">
                    Open Full Calendar <span className="text-lg leading-none">→</span>
                </Link>
            </div>

            <div className="absolute -bottom-12 -right-12 w-48 h-48 pointer-events-none opacity-40 mix-blend-multiply">
                <div className="absolute w-20 h-32 bg-[#a3ddd7] rounded-full rotate-45 right-10 bottom-10 blur-xl"></div>
                <div className="absolute w-16 h-16 bg-[#e9ccae] rounded-full right-20 bottom-24 blur-xl"></div>
            </div>
        </div>
    )
}
