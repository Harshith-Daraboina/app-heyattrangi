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

export default function CenterColumn({ displayName, upcomingAppointments }: { displayName: string, upcomingAppointments: any[] }) {
    const chartData = [
        { month: "Jul", value: 30 },
        { month: "Aug", value: 45 },
        { month: "Sep", value: 65 },
        { month: "Oct", value: 35 },
        { month: "Nov", value: 60 },
        { month: "Dec", value: 85, active: true },
    ]

    return (
        <div className="flex-1 h-full overflow-y-auto w-full px-6 md:px-8 xl:px-10 py-8 md:py-10 bg-[#fafdfc] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            {/* Header */}
            <header className="flex items-start justify-between w-full mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Hi, Dr. {displayName}.</h1>
                    <p className="text-gray-500 font-bold tracking-wide mt-1">Ready for today's professional journey!</p>
                </div>
                <div className="flex items-center gap-4">
                    <button className="w-12 h-12 rounded-2xl border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-800 hover:bg-gray-50 transition-all bg-white shadow-sm">
                        <SearchIcon className="w-5 h-5" />
                    </button>
                    <button className="w-12 h-12 rounded-2xl border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-800 hover:bg-gray-50 transition-all bg-white shadow-sm relative">
                        <BellIcon className="w-5 h-5" />
                        <span className="absolute top-3 right-3 w-2 h-2 bg-blue-500 rounded-full border-2 border-white" />
                    </button>
                </div>
            </header>

            {/* Upcoming Appointments Horizontal Scroll */}
            <section className="mb-10 w-full">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-black text-gray-900 tracking-tight">Next patient sessions</h3>
                    <Link href="/doctor/appointments" className="text-[13px] font-bold text-blue-500 hover:text-blue-600 transition-colors">
                        View schedule →
                    </Link>
                </div>

                <div className="flex flex-row gap-6 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                    {upcomingAppointments && upcomingAppointments.length > 0 ? (
                        upcomingAppointments.map((apt, index) => (
                            <div key={apt.id} className="min-w-[420px] bg-white rounded-[28px] p-6 shadow-[0_2px_24px_rgba(0,0,0,0.03)] border border-[#f1f5f9] flex flex-col relative overflow-hidden group shrink-0">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-14 h-14 bg-blue-50 rounded-2xl border-2 border-white shadow-sm flex items-center justify-center text-2xl overflow-hidden relative">
                                            {apt.patient?.user?.image ? (
                                                <Image src={apt.patient.user.image} alt="Patient" fill className="object-cover" />
                                            ) : (
                                                <span>🧑</span>
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-black text-gray-900 text-lg leading-tight">{apt.patient?.user?.name || "Patient"}</h4>
                                            <p className="text-xs text-blue-500 font-bold uppercase tracking-wider mt-0.5">Therapy Session</p>
                                        </div>
                                    </div>
                                    <div className="bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider">Confirmed</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    <div className="bg-[#f8fafd] rounded-2xl p-4 border border-[#f1f5f9] flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                                        </div>
                                        <span className="text-[13px] font-bold text-gray-700">{format(new Date(apt.appointmentDate), "dd MMM, yyyy")}</span>
                                    </div>
                                    <div className="bg-[#fff9f0] rounded-2xl p-4 border border-[#fff1e0] flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-orange-500">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                        </div>
                                        <span className="text-[13px] font-bold text-gray-700">{format(new Date(apt.appointmentDate), "hh:mm a")}</span>
                                    </div>
                                </div>

                                <div className="mt-auto flex items-center gap-3">
                                    {apt.meetLink ? (
                                        <a href={apt.meetLink} target="_blank" rel="noreferrer" className="flex-1 bg-gray-900 text-white text-center py-3.5 rounded-2xl text-[13px] font-black hover:bg-black transition-all shadow-md active:scale-95">
                                            Start Session
                                        </a>
                                    ) : (
                                        <button disabled className="flex-1 bg-gray-50 text-gray-300 border border-gray-100 py-3.5 rounded-2xl text-[13px] font-black cursor-not-allowed">
                                            In-Person
                                        </button>
                                    )}
                                    <Link href={`/doctor/appointments`} className="w-12 h-12 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 hover:text-blue-500 hover:border-blue-100 transition-all shadow-sm">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="w-full bg-white border border-gray-100 p-12 text-center rounded-[32px] shadow-sm">
                            <p className="text-gray-400 font-bold">No sessions scheduled for today.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Practice Stats Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8">
                {/* Practice Activity */}
                <div className="bg-white rounded-[32px] p-8 shadow-[0_2px_24px_rgba(0,0,0,0.03)] border border-gray-100">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-black text-gray-900">Practice Activity</h3>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Patient growth & consultations</p>
                        </div>
                        <select className="bg-gray-50 border-0 text-xs font-black text-gray-600 rounded-xl px-4 py-2.5 focus:ring-0 cursor-pointer">
                            <option>Last 6 Months</option>
                            <option>Last Year</option>
                        </select>
                    </div>

                    <div className="h-[220px] w-full flex items-end justify-between px-4 pb-2 mt-4">
                        {chartData.map((d, i) => (
                            <div key={i} className="flex flex-col items-center gap-4 w-12 group">
                                <div className="relative w-full flex flex-col items-center">
                                    <div
                                        className={`w-full rounded-t-2xl transition-all duration-700 ease-out ${d.active ? 'bg-blue-500 shadow-[0_4px_12px_rgba(59,130,246,0.3)]' : 'bg-blue-50 group-hover:bg-blue-100'}`}
                                        style={{ height: `${d.value * 2}px` }}
                                    />
                                    {d.active && (
                                        <div className="absolute -top-10 bg-gray-900 text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-xl animate-bounce">
                                            {d.value}%
                                        </div>
                                    )}
                                </div>
                                <span className={`text-[11px] font-black ${d.active ? 'text-gray-900' : 'text-gray-400'}`}>{d.month}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Performance Metrics */}
                <div className="flex flex-col gap-6">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[32px] p-8 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden flex-1">
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                        <h3 className="font-bold text-white/80 uppercase tracking-[0.2em] text-[10px] mb-2">Weekly Performance</h3>
                        <div className="flex items-end gap-2 mb-8">
                            <span className="text-6xl font-black">84</span>
                            <span className="text-xl font-bold text-white/70 mb-2">%</span>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-xs font-bold">
                                <span className="text-white/70">Consultations</span>
                                <span>24 / 30</span>
                            </div>
                            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                                <div className="h-full bg-white rounded-full w-[80%]" />
                            </div>
                            <p className="text-[11px] text-white/60 font-medium">You're on track to exceed your goal!</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm flex items-center justify-between group hover:border-blue-200 transition-all cursor-pointer">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">
                                ⭐
                            </div>
                            <div>
                                <h4 className="font-black text-gray-900 text-sm">Top Rated</h4>
                                <p className="text-xs text-gray-400 font-bold">4.9/5 from 120 patients</p>
                            </div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-all">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" /></svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
