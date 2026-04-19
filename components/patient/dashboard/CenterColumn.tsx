"use client"

import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { useState } from "react"

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

export default function CenterColumn({ displayName, upcomingAppointments, dailyTasks = [] }: { displayName: string, upcomingAppointments: any[], dailyTasks?: any[] }) {
    const [activityFilter, setActivityFilter] = useState('Monthly')
    const [activityFilterOpen, setActivityFilterOpen] = useState(false)
    const chartData = [
        { month: "Jul", value: 30 },
        { month: "Aug", value: 45 },
        { month: "Sep", value: 65 },
        { month: "Oct", value: 35 },
        { month: "Nov", value: 60 },
        { month: "Dec", value: 85, active: true },
    ]

    const nextApt = upcomingAppointments && upcomingAppointments.length > 0 ? upcomingAppointments[0] : null
    
    // Add real date line tracker for timeline
    const currentHour = new Date().getHours() + new Date().getMinutes() / 60
    const timePercentage = Math.max(0, Math.min(100, ((currentHour - 9) / 12) * 100))

    return (
        <div className="flex-1 h-full overflow-y-auto w-full px-10 py-10 bg-[#fafdfc] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            {/* Header */}
            <header className="flex items-start justify-between w-full mb-10">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Hi, {displayName}.</h1>
                    <p className="text-gray-500 font-medium tracking-wide mt-1">Let's track your health daily!</p>
                </div>
                <div className="flex items-center gap-4">
                    <button className="w-12 h-12 rounded-full border-2 border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-800 hover:border-gray-200 transition-colors bg-white shadow-sm">
                        <SearchIcon className="w-5 h-5" />
                    </button>
                    <button className="w-12 h-12 rounded-full border-2 border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-800 hover:border-gray-200 transition-colors bg-white shadow-sm relative">
                        <BellIcon className="w-5 h-5" />
                        <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                    </button>
                </div>
            </header>

            {/* Upcoming Appointment */}
            <section className="mb-8 w-full max-w-[500px]">
                {nextApt ? (
                    <div className="bg-white p-5 md:p-6 shadow-[0_2px_16px_rgba(0,0,0,0.04)] border border-[#e2e8f0] relative overflow-hidden group rounded-[20px]">
                        
                        {/* Status Label */}
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-3.5 h-3.5 rounded-full bg-[#22c55e] flex items-center justify-center text-white shrink-0">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-[8px] h-[8px]">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </div>
                            <span className="text-[#16a34a] font-medium text-[13px]">Your appointment is confirmed</span>
                        </div>

                        {/* Top Flex for text and avatar */}
                        <div className="flex flex-row items-start justify-between gap-4 mb-5">
                            
                            {/* Left Side: Title & Location */}
                            <div className="flex-1 mt-1">
                                <h2 className="text-[20px] font-extrabold text-[#0f172a] mb-3 tracking-tight leading-tight">Appointment scheduled</h2>
                                
                                <div className="flex flex-col gap-1">
                                
                                    <div className="flex items-center gap-2 text-[#2563eb]">
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-[14px] h-[14px] shrink-0">
                                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                        </svg>
                                        <span className="font-medium text-[14px]">{nextApt.meetLink ? "Online Video Session" : "In-Person Therapy"}</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Right Side: Doctor Profile */}
                            <div className="flex flex-col items-center shrink-0 w-[90px]">
                                <div className="w-[56px] h-[56px] rounded-full overflow-hidden border border-gray-100 relative shadow-sm mb-2">
                                    <Image 
                                        src={nextApt.doctor?.user?.image || "/images/promo_doctor.png"} 
                                        alt={nextApt.doctor?.user?.name || "Doctor"}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <span className="text-[#64748b] font-medium text-[12px] text-center w-full leading-tight line-clamp-1">
                                    with <span className="text-[#334155]">{nextApt.doctor?.user?.name || "Doctor"}</span>
                                </span>
                            </div>
                        </div>

                        {/* Date & Time Block (Like the mockup) */}
                        <div className="bg-[#f8fafc] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4 mb-6 border border-slate-100">
                            <div className="w-10 h-10 rounded-[10px] bg-[#dbeafe] flex items-center justify-center shrink-0">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[#2563eb]">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                    <line x1="16" y1="2" x2="16" y2="6" />
                                    <line x1="8" y1="2" x2="8" y2="6" />
                                    <line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-[#94a3b8] tracking-widest uppercase mb-0.5">Date & Time</span>
                                <span className="text-[#0f172a] font-medium text-[14px]">
                                    {format(new Date(nextApt.appointmentDate), "EEEE, MMMM d, yyyy")} • {format(new Date(nextApt.appointmentDate), "h:mm a")}
                                </span>
                            </div>
                        </div>

                        {/* Buttons container */}
                        <div className="flex flex-wrap items-center gap-3">
                            {nextApt.meetLink ? (
                                <Link 
                                    href={nextApt.meetLink} 
                                    target="_blank" 
                                    className="px-5 py-2 border border-[#2563eb] text-[#2563eb] hover:bg-[#2563eb] hover:text-white rounded-[4px] font-medium text-[13px] transition-colors"
                                >
                                    Join Session
                                </Link>
                            ) : null}
                            <Link 
                                href="/patient/appointments" 
                                className="px-5 py-2 border border-[#2563eb] text-[#2563eb] hover:bg-blue-50 rounded-[4px] font-medium text-[13px] transition-colors"
                            >
                                Reschedule appointment
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="bg-gray-50 border border-gray-200 p-8 text-center shadow-sm w-full rounded-[24px]">
                        <p className="text-sm font-medium text-gray-500">No upcoming appointments found.</p>
                    </div>
                )}
            </section>

            {/* Header for activities - Constrained width so it doesn't span over right column */}
            <div className="flex items-center justify-between mb-4 w-full lg:w-[calc(100%-284px)] lg:pr-6 relative z-30">
                <h3 className="text-[17px] font-extrabold text-[#0f172a]">Patient activities</h3>
                <div className="relative">
                    <button 
                        onClick={() => setActivityFilterOpen(!activityFilterOpen)}
                        className="flex items-center gap-2 px-4 py-1.5 bg-white border border-gray-200 rounded-full cursor-pointer hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        <span className="text-[11px] font-bold text-[#0f172a]">{activityFilter}</span>
                        <span className={`text-gray-400 text-[10px] transition-transform ${activityFilterOpen ? 'rotate-180' : ''}`}>▼</span>
                    </button>
                    
                    {activityFilterOpen && (
                        <div className="absolute right-0 top-full mt-2 w-32 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                            {['Daily', 'Weekly', 'Monthly'].map((period) => (
                                <button 
                                    key={period}
                                    onClick={() => { setActivityFilter(period); setActivityFilterOpen(false); }}
                                    className={`w-full text-left px-4 py-2 text-[12px] font-bold transition-colors ${activityFilter === period ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                                >
                                    {period}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-10">
                {/* MAIN COLUMN (Spans 2 columns) */}
                <div className="col-span-1 lg:col-span-2 grid grid-rows-2 gap-6 h-full">
                    {/* Daily Activity Tracking */}
                    <div className="bg-white rounded-[32px] p-6 lg:p-8 shadow-[0_2px_16px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col relative h-full">
                        <div className="flex justify-between items-start mb-8">
                            <h3 className="font-extrabold text-[19px] text-gray-900">Daily activity tracking</h3>
                            <button className="w-10 h-10 rounded-full bg-blue-50/50 flex items-center justify-center text-blue-500 hover:bg-blue-100 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                            </button>
                        </div>

                        {/* Timeline */}
                        <div className="relative flex-1 mt-auto min-h-[100px]">
                            {/* Time markers */}
                            <div className="absolute bottom-0 w-full flex justify-between text-[11px] font-bold text-gray-400">
                                <span>9:00</span><span>11:00</span><span>13:00</span><span>15:00</span><span>17:00</span><span>19:00</span><span>21:00</span>
                            </div>
                            
                            {/* Grid lines */}
                            <div className="absolute bottom-6 left-0 right-0 h-[80px] flex justify-between">
                                {[...Array(7)].map((_, i) => (
                                    <div key={i} className="w-px h-full bg-gray-50 border-r border-dashed border-gray-200"></div>
                                ))}
                            </div>
                            
                            {/* Target the current active time block on timeline */}
                            <div className="absolute bottom-6 w-px h-[90px] bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)] z-20" style={{ left: `${timePercentage}%` }}></div> 

                            {/* Render tasks dynamically */}
                            {dailyTasks && dailyTasks.length > 0 ? dailyTasks.map((task, i) => {
                                // Default mapped time if no dueDate
                                const taskHour = task.dueDate ? new Date(task.dueDate).getHours() + new Date(task.dueDate).getMinutes() / 60 : 9 + (i * 2)
                                const percentage = Math.max(0, Math.min(100, ((taskHour - 9) / 12) * 100))
                                
                                // Alternative heights to avoid collision
                                const bottomSpace = (i % 3 === 0) ? '60px' : (i % 3 === 1) ? '35px' : '70px'
                                
                                const isCurrentNext = taskHour > currentHour

                                return (
                                    <div key={task.id} style={{ left: `${percentage}%`, bottom: bottomSpace, transform: 'translateX(-50%)' }} className={`absolute border items-center gap-2 px-3 py-1.5 shadow-sm rounded-full flex ${isCurrentNext ? 'bg-[#1a202c] border-[#1a202c] text-white shadow-lg z-10' : 'bg-white border-gray-100 text-gray-600 opacity-90 hover:opacity-100 group cursor-pointer hover:border-gray-300 transition-all z-0'}`}>
                                        {task.type === 'MEDITATION' && <span className="text-[12px]">🧘</span>}
                                        {task.type === 'JOURNAL' && <span className="text-[12px]">📓</span>}
                                        {task.type === 'ACTIVITY' && <span className="text-[12px]">🚶</span>}
                                        {task.type === 'AI_CHAT' && <span className="text-[12px]">🤖</span>}
                                        {task.type === 'MEDICATION' && <span className="text-[12px] bg-white rounded-full w-5 h-5 flex items-center justify-center shadow-sm">💊</span>}
                                        {!['MEDITATION', 'JOURNAL', 'ACTIVITY', 'AI_CHAT', 'MEDICATION'].includes(task.type) && <span className="text-[12px]">✨</span>}
                                        <span className={`text-[12px] whitespace-nowrap ${isCurrentNext ? 'font-extrabold' : 'font-bold'}`}>{task.title}</span>
                                    </div>
                                )
                            }) : (
                                <div className="absolute bottom-[50px] w-full flex justify-center text-sm font-medium text-gray-400">
                                    No daily tasks set.
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 h-full">
                        {/* Sleep Level */}
                        <div className="bg-white rounded-[32px] p-6 lg:p-7 shadow-[0_2px_16px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-cyan-400 text-white flex items-center justify-center shadow-sm shadow-cyan-400/30">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                                </div>
                                <h3 className="font-extrabold text-[17px] text-gray-900">Sleep level</h3>
                            </div>
                            
                            {/* Bar mini-chart */}
                            <div className="w-full h-16 flex items-end gap-1.5 px-1 py-2">
                                {[40, 60, 30, 80, 50, 40, 90, 100, 60, 80, 50, 70, 90, 40, 50].map((h, i) => (
                                    <div key={i} className={`flex-1 rounded-sm ${i === 7 ? 'bg-cyan-200' : 'bg-cyan-50'}`} style={{ height: `${h}%` }}></div>
                                ))}
                            </div>

                            <div className="flex items-end justify-between mt-2">
                                <div>
                                    <h4 className="font-black text-2xl text-gray-900 leading-none mb-1">8h</h4>
                                    <p className="text-[11px] font-medium text-gray-400 leading-tight w-24">Average sleep duration in March</p>
                                </div>
                                <button className="w-8 h-8 rounded-full bg-blue-50/50 flex items-center justify-center text-blue-500 hover:bg-blue-100">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 19L19 5M19 5v10M19 5H9" /></svg>
                                </button>
                            </div>
                        </div>

                        {/* Meditation */}
                        <div className="bg-white rounded-[32px] p-6 lg:p-7 shadow-[0_2px_16px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-orange-400 text-white flex items-center justify-center shadow-sm shadow-orange-400/30">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <h3 className="font-extrabold text-[17px] text-gray-900">Meditation</h3>
                            </div>
                            
                            {/* Dot Grid */}
                            <div className="grid grid-cols-7 gap-1.5 py-3">
                                {[...Array(21)].map((_, i) => (
                                    <div key={i} className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] ${i < 16 ? 'bg-[#ff8a65] text-white' : 'bg-gray-100 text-gray-300'}`}>
                                        {i < 16 ? '✓' : '✕'}
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-end justify-between mt-2">
                                <div>
                                    <h4 className="font-black text-2xl text-gray-900 leading-none mb-1">16</h4>
                                    <p className="text-[11px] font-medium text-gray-400 leading-tight w-24">Days meditated in March</p>
                                </div>
                                <button className="w-8 h-8 rounded-full bg-blue-50/50 flex items-center justify-center text-blue-500 hover:bg-blue-100">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 19L19 5M19 5v10M19 5H9" /></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* PLANS COLUMN */}
                <div className="col-span-1 lg:row-span-2 bg-white rounded-[32px] p-6 lg:p-7 shadow-[0_2px_16px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col h-full">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-extrabold text-[19px] text-gray-900">Plans</h3>
                        <button className="w-8 h-8 rounded-full bg-blue-50/50 flex items-center justify-center text-blue-500 hover:bg-blue-100">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                        </button>
                    </div>

                    <div className="flex flex-col gap-4 flex-1">
                        <div className="bg-[#e0f1f1] rounded-[24px] p-5 relative overflow-hidden group cursor-pointer h-[130px]">
                            <span className="inline-block px-2.5 py-1 bg-[#1aa5a5] text-white text-[10px] font-bold rounded-lg mb-2">Sleep</span>
                            <h4 className="font-bold text-[15px] text-gray-900 mb-1">Insomnia recovery</h4>
                            <p className="text-[11px] text-[#297a7a] font-medium leading-tight max-w-[80%]">Cognitive and behavioral techniques to manage insomnia.</p>
                            <button className="absolute bottom-4 right-4 w-10 h-10 bg-[#1aa5a5] rounded-full flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                            </button>
                        </div>

                        <div className="bg-[#fcebe4] rounded-[24px] p-5 relative overflow-hidden group cursor-pointer h-[130px]">
                            <span className="inline-block px-2.5 py-1 bg-[#f48c71] text-white text-[10px] font-bold rounded-lg mb-2">Meditation</span>
                            <h4 className="font-bold text-[15px] text-gray-900 mb-1">Anxiety relief</h4>
                            <p className="text-[11px] text-[#aa5d47] font-medium leading-tight max-w-[80%]">Meditations focused on calming the nervous system.</p>
                            <button className="absolute bottom-4 right-4 w-10 h-10 bg-[#f48c71] rounded-full flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                            </button>
                        </div>

                        <div className="bg-[#eee5ff] rounded-[24px] p-5 relative overflow-hidden group cursor-pointer flex-1 min-h-[80px]">
                            <span className="inline-block px-2.5 py-1 bg-[#8659d8] text-white text-[10px] font-bold rounded-lg mb-2">Studying</span>
                            <h4 className="font-bold text-[15px] text-gray-900 mb-1">Focus Flow</h4>
                            {/* Clipped content styled similarly */}
                        </div>
                    </div>
                </div>
            </div>

            {/* THERAPY TRACKER */}
            <div className="flex items-center justify-between mb-5 w-full mt-6">
                <h3 className="text-[18px] font-extrabold text-[#0f172a] tracking-tight">Therapy tracker</h3>
                <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full cursor-pointer hover:bg-gray-50 transition-colors shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
                    <span className="text-[12px] font-bold text-[#0f172a]">6 months</span>
                    <span className="text-gray-400 text-[10px]">▼</span>
                </div>
            </div>

            <div className="bg-white rounded-[36px] p-8 lg:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col justify-end min-h-[340px] relative w-full overflow-hidden">
                {/* Y-axis placeholder lines could go here */}

                {/* Graph Area */}
                <div className="w-full flex justify-between items-end gap-2 lg:gap-4 relative h-[200px] z-10 pt-4">
                    {/* Tooltip (Static for presentation) */}
                    <div className="absolute top-[-20px] left-[61%] translate-x-[-50%] bg-white px-3 py-1.5 rounded-[12px] shadow-lg border border-gray-100 flex items-center gap-1 z-30">
                        <span className="text-[11px] font-extrabold text-gray-800">50%</span>
                        <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 15l7-7 7 7" /></svg>
                    </div>

                    <div className="absolute top-[30px] left-[70%] bg-[#1b252f] px-3 py-2 rounded-full shadow-lg z-30 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                        <span className="text-[11px] font-bold text-white tracking-wide">Avg 3 sessions / week</span>
                    </div>

                    <svg className="absolute top-[5px] left-[61%] w-[100px] h-[75px] pointer-events-none z-20" overflow="visible">
                       <path d="M0,80 Q20,30 90,40" stroke="#1b252f" strokeWidth="1.5" fill="none" />
                       <circle cx="0" cy="80" r="3" fill="#1b252f" />
                    </svg>

                    {[
                        { label: "Oct", num: 7, height: "60%", color: "bg-[#fcebe4]", pattern: true },
                        { label: "Nov", num: 4, height: "35%", color: "bg-[#fcebe4]", pattern: true },
                        { label: "Dec", num: 8, height: "70%", color: "bg-[#e0f1f1]", pattern: true },
                        { label: "Jan", num: 12, height: "100%", color: "bg-[#eee5ff]", pattern: false, active: true },
                        { label: "Feb", num: 2, height: "20%", color: "bg-[#fcebe4]", pattern: true },
                        { label: "Mar", num: 12, height: "90%", color: "bg-[#e0f1f1]", pattern: true },
                    ].map((bar, i) => (
                        <div key={i} className="flex flex-col items-center flex-1 h-full relative group cursor-pointer">
                            {/* Patterned striped background for future potential */}
                            {bar.pattern && (
                                <div className="absolute bottom-0 w-full rounded-[20px] bg-gradient-to-t from-transparent to-gray-50/50 border border-gray-100 border-dashed opacity-50" style={{ height: '100%' }}></div>
                            )}

                            {/* Actual Bar */}
                            <div className={`w-full rounded-[24px] relative transition-transform duration-300 group-hover:scale-y-[1.02] origin-bottom ${bar.color} flex flex-col justify-end items-center pb-4 z-10`} style={{ height: bar.height }}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[12px] ${bar.active ? 'bg-[#1b252f] text-white' : 'bg-white text-gray-700 shadow-sm'}`}>
                                    {bar.num}
                                </div>
                            </div>

                            <span className={`text-[12px] font-bold mt-4 ${bar.active ? 'text-gray-900' : 'text-gray-400'}`}>{bar.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
