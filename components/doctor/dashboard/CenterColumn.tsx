"use client"

import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { useState, useEffect } from "react"

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
    const [currentTime, setCurrentTime] = useState(new Date())

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000)
        return () => clearInterval(timer)
    }, [])

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
                        upcomingAppointments.map((apt, index) => {
                            const aptTime = new Date(apt.appointmentDate)
                            const endTime = new Date(aptTime.getTime() + 45 * 60000) // Assumes 45 min duration
                            const isHappeningNow = currentTime >= aptTime && currentTime <= endTime

                            return (
                                <div key={apt.id} className={`min-w-[420px] bg-white rounded-[28px] p-6 shadow-[0_2px_24px_rgba(0,0,0,0.03)] flex flex-col relative overflow-hidden group shrink-0 transition-all ${isHappeningNow ? 'border-2 border-blue-500 ring-4 ring-blue-500/20' : 'border border-[#f1f5f9]'}`}>
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
                                        
                                        {isHappeningNow ? (
                                            <div className="bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200 flex items-center gap-1.5 shadow-sm shadow-blue-500/20">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                                <span className="text-[10px] font-black text-blue-600 uppercase tracking-wider">Happening Now</span>
                                            </div>
                                        ) : (
                                            <div className="bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 flex items-center gap-1.5">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider">Confirmed</span>
                                            </div>
                                        )}
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
                                    {apt.meetingLink ? (
                                        <a href={apt.meetingLink} target="_blank" rel="noreferrer" className={`flex-1 text-white text-center py-3.5 rounded-2xl text-[13px] font-black transition-all shadow-md active:scale-95 ${isHappeningNow ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30' : 'bg-gray-900 hover:bg-black'}`}>
                                            Join Now
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
                        )
                    })
                    ) : (
                        <div className="w-full bg-white border border-gray-100 p-12 text-center rounded-[32px] shadow-sm">
                            <p className="text-gray-400 font-bold">No sessions scheduled for today.</p>
                        </div>
                    )}
                </div>
            </section>


        </div>
    )
}
