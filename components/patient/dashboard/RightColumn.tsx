"use client"

import Link from "next/link"
import { useState } from "react"
import { startOfMonth, endOfMonth, eachDayOfInterval, format, addMonths, subMonths, isSameDay, getDay, startOfWeek, endOfWeek, addWeeks, subWeeks } from "date-fns"

const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

export default function RightColumn({ upcomingAppointments }: { upcomingAppointments: any[] }) {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [view, setView] = useState<'Monthly' | 'Weekly'>('Monthly')

    const handlePrev = () => {
        if (view === 'Weekly') setCurrentDate(subWeeks(currentDate, 1))
        else setCurrentDate(subMonths(currentDate, 1))
    }
    const handleNext = () => {
        if (view === 'Weekly') setCurrentDate(addWeeks(currentDate, 1))
        else setCurrentDate(addMonths(currentDate, 1))
    }

    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

    const weekStart = startOfWeek(currentDate)
    const weekEnd = endOfWeek(currentDate)
    const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd })

    // padding for start of month
    const startDayOfWeek = getDay(monthStart)
    const emptyDays = Array.from({ length: startDayOfWeek }, (_, i) => i)

    const displayedDays = view === 'Weekly' ? daysInWeek : daysInMonth
    const displayEmptyDays = view === 'Weekly' ? [] : emptyDays

    // Only show appointments for the selected date, or all if none matches precisely, or just stick to upcoming chronological
    const displayAppointments = upcomingAppointments && upcomingAppointments.length > 0 ? upcomingAppointments.slice(0, 3) : []

    return (
        <div className="hidden xl:flex flex-col w-[440px] bg-white h-full px-10 py-10 relative">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-gray-900">List of appointments</h3>
            </div>

            {/* Calendar Area */}
            <div className="bg-white rounded-[32px] p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/80 mb-6 relative z-10 w-full hover:shadow-[0_8px_40px_rgb(0,0,0,0.06)] transition-shadow duration-300">
                <div className="relative flex p-1 bg-gray-100/80 rounded-[12px] mb-6 border border-gray-200">
                    <div 
                        className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-[10px] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.12)] transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${view === 'Monthly' ? 'left-1' : 'left-[calc(50%+2px)]'}`} 
                    />
                    <button onClick={() => setView('Monthly')} className={`flex-1 text-[13px] font-bold py-2 rounded-[10px] relative z-10 transition-all duration-300 active:scale-95 ${view === 'Monthly' ? 'text-gray-800' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200/30'}`}>Monthly</button>
                    <button onClick={() => setView('Weekly')} className={`flex-1 text-[13px] font-bold py-2 rounded-[10px] relative z-10 transition-all duration-300 active:scale-95 ${view === 'Weekly' ? 'text-gray-800' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200/30'}`}>Weekly</button>
                </div>

                <div className="flex items-center justify-between mb-6 px-2">
                    <h4 className="font-extrabold text-[19px] text-gray-800 tracking-tight">{format(currentDate, view === 'Weekly' ? "MMM yyyy" : "MMMM yyyy")}</h4>
                    <div className="flex gap-2.5">
                        <button onClick={handlePrev} className="w-8 h-8 rounded-full border border-gray-100 bg-white shadow-sm flex items-center justify-center text-gray-500 hover:border-gray-300 hover:text-gray-800 hover:bg-gray-50 hover:scale-105 active:scale-95 transition-all duration-200">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <button onClick={handleNext} className="w-8 h-8 rounded-full border border-gray-100 bg-white shadow-sm flex items-center justify-center text-gray-500 hover:border-gray-300 hover:text-gray-800 hover:bg-gray-50 hover:scale-105 active:scale-95 transition-all duration-200">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-y-1.5 gap-x-3 text-center mb-1">
                    {days.map((d, i) => (
                        <div key={`header-${i}`} className="text-[13px] font-extrabold text-gray-400 mb-2">{d}</div>
                    ))}

                    {displayEmptyDays.map((_, i) => (
                        <div key={`empty-${i}`} className="flex justify-center" />
                    ))}

                    {displayedDays.map((date, i) => {
                        const isSelected = isSameDay(date, selectedDate)
                        const hasAppointment = upcomingAppointments && upcomingAppointments.some(apt => isSameDay(new Date(apt.appointmentDate), date))
                        const isToday = isSameDay(date, new Date())
                        
                        // Setup dynamic hover classes based on state
                        let hoverClasses = 'hover:bg-gray-50 hover:text-gray-900 active:scale-95 cursor-pointer'
                        if (isSelected) hoverClasses = 'active:scale-100 hover:scale-[1.05] cursor-pointer'
                        else if (hasAppointment) hoverClasses = 'hover:bg-orange-50 hover:text-orange-600 hover:scale-105 hover:-translate-y-0.5 active:scale-95 hover:shadow-sm cursor-pointer'
                        else if (isToday) hoverClasses = 'hover:bg-orange-100 hover:text-orange-600 active:scale-95 cursor-pointer'

                        return (
                            <div key={`day-${i}`} className="flex justify-center relative group">
                                <button
                                    onClick={() => setSelectedDate(date)}
                                    className={`w-12 h-[42px] flex flex-col items-center justify-center text-[15px] font-bold rounded-[12px] relative z-10 transition-all duration-300
                        ${isSelected
                                            ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/40 transform scale-[1.05]'
                                            : isToday
                                              ? 'text-orange-500 bg-orange-50 border border-orange-100'
                                              : 'text-gray-600'}
                        ${hoverClasses}
                      `}
                                >
                                    <span>{format(date, "d")}</span>
                                    {/* Appointment dot */}
                                    {hasAppointment ? (
                                        <div className={`w-1.5 h-1.5 rounded-full mt-1 transition-transform duration-300 group-hover:scale-125 ${isSelected ? 'bg-white opacity-90' : 'bg-orange-400'}`} />
                                    ) : (
                                        <div className="w-1.5 h-1.5 mt-1 opacity-0 inline-block" />
                                    )}
                                </button>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Upcoming Item list */}
            {/* <div className="space-y-4 flex-1 overflow-y-auto pr-2 pb-16">
                {displayAppointments.length > 0 ? (
                    displayAppointments.map((apt, i) => {
                        const isTherapy = apt.doctor.specialty?.toLowerCase().includes('therap')
                        // Alternate card styles simply for aesthetics matching the mockup
                        const bgClass = i % 2 === 0 ? "bg-[#f9fcf8] border-[#e8f2e6] hover:bg-[#f0f8ee]" : "bg-[#fff9f4] border-[#feece2] hover:bg-[#fff2e8]"
                        const iconBg = i % 2 === 0 ? "bg-green-100" : "bg-orange-100"
                        const iconStr = isTherapy ? "💆‍♂️" : "👨‍⚕️"

                        return (
                            <div key={apt.id} className={`p-4 rounded-2xl border flex items-center justify-between group cursor-pointer transition-colors ${bgClass}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full ${iconBg} flex items-center justify-center overflow-hidden shrink-0 border-2 border-white shadow-sm`}>
                                        <span className="text-xl relative -bottom-1">{iconStr}</span>
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-sm text-gray-900">{apt.doctor.user.name}</h5>
                                        <p className="text-xs text-gray-500 font-medium">{format(new Date(apt.appointmentDate), "hh:mm a")} - {format(new Date(apt.appointmentDate), "dd MMM")}</p>
                                    </div>
                                </div>
                                <Link href={`/patient/appointments`} className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-400 group-hover:text-gray-800 transition-colors text-xs border border-gray-100">›</Link>
                            </div>
                        )
                    })
                ) : (
                    <div className="text-center py-6">
                        <p className="text-sm text-gray-500 font-medium">No schedule found.</p>
                    </div>
                )}
            </div> */}

            <div className="absolute bottom-6 left-0 right-0 text-center bg-gradient-to-t from-white via-white to-transparent pt-8 pb-4">
                <Link href="/patient/appointments" className="text-xs font-bold text-gray-700 hover:text-black hover:underline underline-offset-4 decoration-2 decoration-orange-400 inline-flex items-center gap-2">
                    See More Schedule <span className="text-lg leading-none">→</span>
                </Link>
            </div>

            {/* Scattered Pills decoration for bottom right like the mockup */}
            <div className="absolute -bottom-12 -right-12 w-48 h-48 pointer-events-none opacity-40 mix-blend-multiply">
                <div className="absolute w-20 h-32 bg-[#98c99f] rounded-full rotate-45 right-10 bottom-10 blur-xl"></div>
                <div className="absolute w-16 h-16 bg-orange-300 rounded-full right-20 bottom-24 blur-xl"></div>
            </div>
        </div>
    )
}
