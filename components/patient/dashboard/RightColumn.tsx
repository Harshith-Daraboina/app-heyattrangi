"use client"

import Link from "next/link"
import { useState } from "react"
import { startOfMonth, endOfMonth, eachDayOfInterval, format, addMonths, subMonths, isSameDay, getDay, startOfWeek, endOfWeek, addWeeks, subWeeks, addDays } from "date-fns"

import PragyaSidebarCard from "./PragyaSidebarCard"

const SearchIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
    </svg>
)

const BellIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
)

const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

export default function RightColumn({ upcomingAppointments }: { upcomingAppointments: any[] }) {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [view, setView] = useState<'Monthly' | 'Weekly'>('Weekly')

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
        <div className="hidden xl:flex flex-col w-[440px] bg-white h-full px-6 py-6 relative">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <button className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-800 hover:border-gray-200 transition-colors bg-white shadow-sm ring-4 ring-gray-50/50">
                        <SearchIcon className="w-4 h-4" />
                    </button>
                    <button className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-800 hover:border-gray-200 transition-colors bg-white shadow-sm relative ring-4 ring-gray-50/50">
                        <BellIcon className="w-4 h-4" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full border border-white" />
                    </button>
                </div>
            </div>

            {/* Upcoming Sessions Section */}
            <div className="mb-2">
                <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">Upcoming sessions</h3>
                {displayAppointments.length > 0 ? (
                    <div className="bg-[#f0f9f1] rounded-[24px] p-5 shadow-sm border border-[#e2ece3] flex items-center justify-between">
                        <div>
                            <span className="text-[13px] font-bold text-gray-700">Session in 5 mins</span>
                        </div>
                        <button className="bg-[#a3d1ac] hover:bg-[#92c59c] text-white font-bold py-2 px-6 rounded-full transition-colors">
                            Join now
                        </button>
                    </div>
                ) : (
                    <div className="bg-gray-50 rounded-[24px] p-5 border border-gray-100 text-center">
                        <span className="text-[13px] font-medium text-gray-400">No sessions today</span>
                    </div>
                )}
            </div>

            {/* Schedule Section */}
            <div className="mb-2">
                <h3 className="text-lg font-bold text-gray-900 text-center">Schedule</h3>
            </div>

            {/* Calendar Area */}
            <div className="bg-white rounded-[24px] p-4 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-gray-100/80 mb-2 relative z-10 w-full hover:shadow-[0_8px_40px_rgb(0,0,0,0.05)] transition-shadow duration-300">
                <div className="relative flex p-1 bg-gray-100/80 rounded-[10px] mb-2 border border-gray-200">
                    <div 
                        className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-[10px] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.12)] transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${view === 'Weekly' ? 'left-1' : 'left-[calc(50%+2px)]'}`} 
                    />
                    <button onClick={() => setView('Weekly')} className={`flex-1 text-[13px] font-bold py-2 rounded-[10px] relative z-10 transition-all duration-300 active:scale-95 ${view === 'Weekly' ? 'text-gray-800' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200/30'}`}>Weekly</button>
                    <button onClick={() => setView('Monthly')} className={`flex-1 text-[13px] font-bold py-2 rounded-[10px] relative z-10 transition-all duration-300 active:scale-95 ${view === 'Monthly' ? 'text-gray-800' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200/30'}`}>Monthly</button>
                </div>

                <div className="flex items-center justify-between mb-2 px-2">
                    <h4 className="font-extrabold text-[17px] text-gray-800 tracking-tight">{format(currentDate, view === 'Weekly' ? "MMM yyyy" : "MMMM yyyy")}</h4>
                    <div className="flex gap-2.5">
                        <button onClick={handlePrev} className="w-8 h-8 rounded-full border border-gray-100 bg-white shadow-sm flex items-center justify-center text-gray-500 hover:border-gray-300 hover:text-gray-800 hover:bg-gray-50 hover:scale-105 active:scale-95 transition-all duration-200">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <button onClick={handleNext} className="w-8 h-8 rounded-full border border-gray-100 bg-white shadow-sm flex items-center justify-center text-gray-500 hover:border-gray-300 hover:text-gray-800 hover:bg-gray-50 hover:scale-105 active:scale-95 transition-all duration-200">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-y-3 gap-x-3 text-center mb-1">
                    {days.map((d, i) => (
                        <div key={`header-${i}`} className="text-[13px] font-extrabold text-gray-400 mb-2">{d}</div>
                    ))}

                    {/* Show full month if 'Monthly' is selected, otherwise show 2 weeks */}
                    {view === 'Monthly' ? (
                        <>
                            {displayEmptyDays.map((_, i) => (
                                <div key={`empty-${i}`} className="flex justify-center" />
                            ))}
                            {displayedDays.map((date, i) => {
                                const isSelected = isSameDay(date, selectedDate)
                                const hasAppointment = upcomingAppointments && upcomingAppointments.some(apt => isSameDay(new Date(apt.appointmentDate), date))
                                const isToday = isSameDay(date, new Date())
                                
                                return (
                                    <div key={`day-${i}`} className="flex justify-center relative group">
                                        <button
                                            onClick={() => setSelectedDate(date)}
                                            className={`w-12 h-[42px] flex flex-col items-center justify-center text-[15px] font-bold rounded-[12px] relative z-10 transition-all duration-300
                                                ${isSelected ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/40' : isToday ? 'text-orange-500 bg-orange-50' : 'text-gray-600'}
                                            `}
                                        >
                                            <span>{format(date, "d")}</span>
                                            {hasAppointment && (
                                                <div className={`w-1.5 h-1.5 rounded-full mt-1 ${isSelected ? 'bg-white' : 'bg-orange-400'}`} />
                                            )}
                                        </button>
                                    </div>
                                )
                            })}
                        </>
                    ) : (
                        Array.from({ length: 14 }).map((_, i) => {
                            const date = addDays(startOfWeek(currentDate), i)
                            const isSelected = isSameDay(date, selectedDate)
                            const hasAppointment = upcomingAppointments && upcomingAppointments.some(apt => isSameDay(new Date(apt.appointmentDate), date))
                            const isToday = isSameDay(date, new Date())
                            
                            return (
                                <div key={`day-${i}`} className="flex justify-center relative group">
                                    <button
                                        onClick={() => setSelectedDate(date)}
                                        className={`w-12 h-[42px] flex flex-col items-center justify-center text-[15px] font-bold rounded-[12px] relative z-10 transition-all duration-300
                                            ${isSelected ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/40' : isToday ? 'text-orange-500 bg-orange-50' : 'text-gray-600'}
                                        `}
                                    >
                                        <span>{format(date, "d")}</span>
                                        {hasAppointment && (
                                            <div className={`w-1.5 h-1.5 rounded-full mt-1 ${isSelected ? 'bg-white' : 'bg-orange-400'}`} />
                                        )}
                                    </button>
                                </div>
                            )
                        })
                    )}
                </div>
                
            </div>

            <PragyaSidebarCard />

        </div>
    )
}
