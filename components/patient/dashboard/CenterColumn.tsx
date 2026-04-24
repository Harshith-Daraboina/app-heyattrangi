"use client"

import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { useState } from "react"



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
            </header>

            {/* Upcoming Appointments */}
            <section className="mb-10 w-full">
                <div className="flex items-center justify-between mb-4 pr-10">
                    <h3 className="text-lg font-bold text-gray-900 tracking-tight">Upcoming sessions</h3>
                    <Link 
                        href="/patient/appointments" 
                        className="text-[13px] font-bold text-orange-500 hover:text-orange-600 transition-colors"
                    >
                        View more →
                    </Link>
                </div>
                
                <div className="flex flex-row gap-6 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                    {upcomingAppointments && upcomingAppointments.length > 0 ? (
                        upcomingAppointments.map((apt, index) => {
                            const aptTime = new Date(apt.appointmentDate).getTime();
                            const now = new Date().getTime();
                            const diffMinutes = (aptTime - now) / (1000 * 60);
                            const isJoinable = diffMinutes <= 15;

                            return (
                                <div key={apt.id || index} className="min-w-[650px] bg-white shadow-[0_2px_20px_rgba(0,0,0,0.03)] border border-[#f1f5f9] relative overflow-hidden group rounded-[24px] shrink-0 flex h-[320px]">
                                    {/* Left Content Area */}
                                    <div className="flex-1 p-6 flex flex-col relative z-10">
                                        {/* Status Label */}
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-4 h-4 rounded-full bg-[#22c55e] flex items-center justify-center text-white shrink-0">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="w-[10px] h-[10px]"><polyline points="20 6 9 17 4 12" /></svg>
                                            </div>
                                            <span className="text-[#16a34a] font-black text-[11px] tracking-wide uppercase">Your appointment is confirmed</span>
                                        </div>

                                        <h2 className="text-[26px] font-black text-[#0f172a] mb-2 tracking-tight leading-tight">Appointment scheduled</h2>
                                        
                                        <div className="flex items-center gap-1.5 text-[#2563eb] mb-6">
                                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-[16px] h-[16px] shrink-0"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></svg>
                                            <span className="font-extrabold text-[13px]">{apt.meetLink ? "Online Video Session" : "In-Person Therapy"}</span>
                                        </div>

                                        {/* Date & Time Block */}
                                        <div className="bg-[#f8fafd] rounded-2xl p-4 flex items-center gap-4 mb-6 border border-[#f1f5f9] max-w-[320px]">
                                            <div className="w-10 h-10 rounded-xl bg-[#e0e7ff] flex items-center justify-center shrink-0">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[#3b82f6]">
                                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                                    <line x1="16" y1="2" x2="16" y2="6" />
                                                    <line x1="8" y1="2" x2="8" y2="6" />
                                                    <line x1="3" y1="10" x2="21" y2="10" />
                                                </svg>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-[#94a3b8] tracking-widest uppercase mb-0.5">Date & Time</span>
                                                <span className="text-[#0f172a] font-extrabold text-[13px] leading-tight">
                                                    {format(new Date(apt.appointmentDate), "EEEE, MMMM d, yyyy")} <br/>
                                                    {new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'UTC' }).format(new Date(apt.appointmentDate))} (UTC)
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 mb-6">
                                            <div className="w-8 h-8 rounded-full bg-[#dbeafe] flex items-center justify-center">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 text-[#2563eb]"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                            </div>
                                            <span className="text-[13px] font-bold text-gray-500">with <span className="text-gray-900 font-black">{apt.doctor?.user?.name || "Doctor"}</span></span>
                                        </div>

                                        {/* Buttons container */}
                                        <div className="mt-auto">
                                            <div className="flex items-center gap-3">
                                                {isJoinable && apt.meetLink ? (
                                                    <Link
                                                        href={apt.meetLink}
                                                        target="_blank"
                                                        className="px-6 py-3 bg-[#2563eb] text-white rounded-xl font-black text-[13px] flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all"
                                                    >
                                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                                        Join Session
                                                    </Link>
                                                ) : (
                                                    <button
                                                        disabled
                                                        className="px-6 py-3 bg-gray-50 text-gray-400 border border-gray-100 rounded-xl font-black text-[13px] flex items-center gap-2 cursor-not-allowed"
                                                    >
                                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4 opacity-50"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                                        Join Session
                                                    </button>
                                                )}
                                                <Link
                                                    href={`/patient/appointments/${apt.id}`}
                                                    className="px-6 py-3 border-2 border-[#e0e7ff] text-[#2563eb] rounded-xl font-black text-[13px] flex items-center gap-2 hover:bg-blue-50 transition-all group/btn"
                                                >
                                                    View Details
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4 transition-transform group-hover/btn:translate-x-1"><polyline points="9 18 15 12 9 6"/></svg>
                                                </Link>
                                            </div>
                                            <p className="text-[10px] font-bold text-gray-400 mt-3 ml-1">Available 15 min before start</p>
                                        </div>
                                    </div>

                                    {/* Right Image Pillar */}
                                    <div className="w-[240px] relative hidden md:block shrink-0">
                                        <Image
                                            src={apt.doctor?.user?.image || "/images/promo_doctor.png"}
                                            alt={apt.doctor?.user?.name || "Doctor"}
                                            fill
                                            className="object-cover"
                                        />
                                        {/* Brand/Small Icon Overlay in top left if needed? Mockup shows a small badge */}
                                        <div className="absolute top-4 left-4 w-6 h-6 bg-black/80 rounded flex items-center justify-center backdrop-blur-sm z-20">
                                            <svg viewBox="0 0 24 24" fill="white" className="w-3.5 h-3.5">
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    ) : (
                        <div className="bg-white border border-gray-100 p-8 text-center shadow-sm w-full max-w-[500px] rounded-[32px] shrink-0">
                            <p className="text-sm font-bold text-gray-400">No upcoming sessions scheduled.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10 w-full">
                
                {/* Daily Progress Card */}
                <div className="bg-white rounded-[32px] p-8 shadow-[0_2px_24px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col relative min-h-[460px]">
                    <h3 className="font-extrabold text-[22px] text-gray-900 mb-8">Daily Progress</h3>
                    
                    <div className="flex-1 flex flex-col items-center justify-center relative">
                        {/* Circular Progress SVG */}
                        <div className="relative w-[280px] h-[280px]">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                {/* Background Ring */}
                                <circle 
                                    cx="50" cy="50" r="40" 
                                    fill="transparent" 
                                    stroke="#ecfdf5" 
                                    strokeWidth="12" 
                                />
                                {/* Progress Ring */}
                                <circle 
                                    cx="50" cy="50" r="40" 
                                    fill="transparent" 
                                    stroke="#a7cc9a" 
                                    strokeWidth="12" 
                                    strokeDasharray="251.2" 
                                    strokeDashoffset={251.2 * (1 - 0.65)}
                                    strokeLinecap="round"
                                />
                            </svg>
                            {/* Inner Circle with Gradient */}
                            <div className="absolute inset-[15%] rounded-full bg-gradient-to-br from-[#f8faf9] to-[#e8f5e9] flex flex-col items-center justify-center shadow-inner">
                                <span className="text-[54px] font-black text-[#425a4d] leading-none">65%</span>
                            </div>
                        </div>
                        
                        <p className="text-gray-500 font-bold text-[15px] mt-8 text-center max-w-[200px]">
                            Your health journey is progressing
                        </p>
                    </div>
                </div>

                {/* Right Column: Quote & Mood Tracker */}
                <div className="flex flex-col gap-8">
                    {/* Motivational Quote Card */}
                    <div className="bg-white rounded-[28px] p-8 shadow-[0_2px_16px_rgba(0,0,0,0.02)] border border-gray-100 min-h-[140px] flex items-center justify-center px-10">
                        <p className="text-gray-600 font-bold text-[16px] text-center leading-relaxed">
                            Your feelings are valid, and brighter days can begin with one small step.
                        </p>
                    </div>

                    {/* Mood Tracker Card */}
                    <div className="bg-white rounded-[32px] p-8 shadow-[0_2px_24px_rgba(0,0,0,0.03)] border border-gray-100 flex-col flex flex-1 min-h-[292px]">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-extrabold text-[20px] text-gray-900">Mood Tracker</h3>
                        </div>
                        
                        <div className="flex-1 flex flex-col pt-2">
                            <h4 className="text-[17px] font-extrabold text-gray-800 mb-2">
                                {format(new Date(), "EEEE, do MMMM, yyyy")}
                            </h4>
                            <p className="text-gray-400 font-bold text-[14px] leading-relaxed max-w-[90%]">
                                Monitor your mood, journal, answer some prompts, feel free to use the space.
                            </p>
                        </div>

                        <div className="mt-auto flex justify-end">
                            <button className="px-6 py-2.5 bg-[#e9f2ee] text-[#425a4d] font-black text-[13px] rounded-full hover:bg-[#dce9e3] transition-colors border border-[#d5e5db]">
                                Use prompts
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
