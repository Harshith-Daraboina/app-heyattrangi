"use client"

import Link from "next/link"
import Image from "next/image"
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
        <div className="hidden xl:flex flex-col w-[360px] bg-white h-full px-8 py-10 relative border-l border-gray-100">
            <header className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-gray-900 tracking-tight">Calendar</h3>
                <div className="flex gap-2">
                    <button onClick={handlePrevMonth} className="w-8 h-8 rounded-xl border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-all">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" /></svg>
                    </button>
                    <button onClick={handleNextMonth} className="w-8 h-8 rounded-xl border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-all">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M9 18l6-6 6-6" className="rotate-180" /></svg>
                    </button>
                </div>
            </header>

            {/* Calendar Grid */}
            <div className="bg-gray-50/50 rounded-[32px] p-6 border border-gray-100 mb-10 shadow-sm">
                <div className="flex items-center justify-between mb-6 px-2">
                    <h4 className="font-black text-[15px] text-gray-900">{format(currentDate, "MMMM yyyy")}</h4>
                </div>

                <div className="grid grid-cols-7 gap-y-2 text-center">
                    {days.map((d, i) => (
                        <div key={`header-${i}`} className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{d}</div>
                    ))}

                    {emptyDays.map((_, i) => (
                        <div key={`empty-${i}`} className="w-9 h-9" />
                    ))}

                    {daysInMonth.map((date, i) => {
                        const isSelected = isSameDay(date, selectedDate)
                        const isToday = isSameDay(date, new Date())
                        const hasAppointment = upcomingAppointments && upcomingAppointments.some(apt => isSameDay(new Date(apt.appointmentDate), date))

                        return (
                            <div key={`day-${i}`} className="flex justify-center relative py-1">
                                <button
                                    onClick={() => setSelectedDate(date)}
                                    className={`w-9 h-9 flex items-center justify-center text-[13px] font-black rounded-xl relative z-10 transition-all
                                        ${isSelected
                                            ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30 scale-110'
                                            : isToday 
                                                ? 'bg-blue-50 text-blue-600 ring-1 ring-blue-100'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }
                                    `}
                                >
                                    {format(date, "d")}
                                </button>
                                {hasAppointment && !isSelected && (
                                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-400" />
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Upcoming Sessions List */}
            <div className="flex-1 flex flex-col min-h-0">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-black text-gray-900 tracking-tight">Today's Queue</h3>
                    <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">{displayAppointments.length} Total</span>
                </div>

                <div className="space-y-4 overflow-y-auto pr-2 pb-6 custom-scrollbar">
                    {displayAppointments.length > 0 ? (
                        displayAppointments.map((apt, i) => (
                            <div key={apt.id} className="group bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all cursor-pointer flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-lg shadow-inner group-hover:scale-110 transition-transform">
                                        {apt.patient?.user?.image ? (
                                            <div className="w-full h-full rounded-xl overflow-hidden relative">
                                                <Image src={apt.patient.user.image} alt="Patient" fill className="object-cover" />
                                            </div>
                                        ) : (
                                            <span>🧑</span>
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <h5 className="font-black text-sm text-gray-900 group-hover:text-blue-600 transition-colors">{apt.patient?.user?.name || "Patient"}</h5>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-[11px] font-bold text-gray-400 tracking-tight">
                                                {format(new Date(apt.appointmentDate), "hh:mm a")}
                                            </span>
                                            <div className="w-1 h-1 rounded-full bg-gray-300" />
                                            <span className="text-[11px] font-bold text-blue-500 uppercase tracking-wide">Video</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-all opacity-0 group-hover:opacity-100">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" /></svg>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-10 opacity-30 grayscale">
                            <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <p className="text-sm font-black uppercase tracking-widest">No active queue</p>
                        </div>
                    )}
                </div>

                {/* Bottom Stats Card */}
                <div className="mt-auto bg-gray-900 rounded-[28px] p-6 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl" />
                    <h4 className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mb-4">Daily Report</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-[22px] font-black tracking-tight">12</p>
                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Completed</p>
                        </div>
                        <div>
                            <p className="text-[22px] font-black tracking-tight">$850</p>
                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Earned</p>
                        </div>
                    </div>
                    <Link href="/doctor/appointments" className="mt-6 flex items-center justify-center gap-2 w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-xs font-black">
                        View Full Schedule
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" /></svg>
                    </Link>
                </div>
            </div>
        </div>
    )
}
