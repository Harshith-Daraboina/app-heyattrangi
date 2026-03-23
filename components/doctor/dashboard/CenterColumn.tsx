"use client"

import Link from "next/link"
import { format } from "date-fns"

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

    const nextApt = upcomingAppointments && upcomingAppointments.length > 0 ? upcomingAppointments[0] : null

    return (
        <div className="flex-1 h-full overflow-y-auto w-full px-10 py-10 bg-[#fafdfc]">
            {/* Header */}
            <header className="flex items-start justify-between w-full mb-10">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Hi, Dr. {displayName}.</h1>
                    <p className="text-gray-500 font-medium tracking-wide mt-1">Ready for today's sessions?</p>
                </div>
                <div className="flex items-center gap-4">
                    <button className="w-12 h-12 rounded-full border-2 border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-800 hover:border-gray-200 transition-colors bg-white shadow-sm">
                        <SearchIcon className="w-5 h-5" />
                    </button>
                    <button className="w-12 h-12 rounded-full border-2 border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-800 hover:border-gray-200 transition-colors bg-white shadow-sm relative">
                        <BellIcon className="w-5 h-5" />
                        <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-white" />
                    </button>
                </div>
            </header>

            {/* Upcoming Appointment */}
            <section className="mb-10">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Next Patient Session</h3>
                {nextApt ? (
                    <div className="bg-white rounded-[24px] p-6 shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)] border border-gray-50/50 flex flex-col md:flex-row items-center gap-6">
                        <div className="w-[140px] h-[100px] bg-gradient-to-br from-[#80d0c7] to-[#13547a] rounded-xl shrink-0 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute w-[80%] h-[70%] bg-white/20 bottom-0 rounded-t-lg backdrop-blur-sm border border-white/30" />
                            <div className="absolute w-[40%] h-[90%] bg-white/30 bottom-0 left-3 rounded-t-md backdrop-blur-sm border border-white/40" />
                        </div>
                        <div className="flex-1 w-full">
                            <div className="flex justify-between items-start w-full">
                                <div>
                                    <h4 className="font-bold text-gray-900">{nextApt.meetLink ? "Virtual Session" : "In-Person Session"}</h4>
                                    <p className="text-xs text-gray-500 font-medium">Therapy appointment</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-orange-100 overflow-hidden ring-2 ring-white shadow-sm flex items-center justify-center">
                                        <span className="text-lg">🧑</span>
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-sm text-gray-900">{nextApt.patient?.user?.name || "Patient"}</h5>
                                        <p className="text-xs text-gray-500 font-medium">Follow-up details</p>
                                    </div>
                                    {nextApt.meetLink ? (
                                        <a href={nextApt.meetLink} target="_blank" rel="noreferrer" className="ml-4 bg-[#52938e] text-white px-5 py-2.5 rounded-2xl text-xs font-bold shadow-sm hover:opacity-90">
                                            Start Call
                                        </a>
                                    ) : null}
                                </div>
                            </div>
                            <div className="flex items-center gap-4 mt-6">
                                <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                                    <span className="text-teal-500">📅</span>
                                    <span className="text-xs font-bold text-gray-700">{format(new Date(nextApt.appointmentDate), "dd MMM yyyy")}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-xl border border-amber-100/50">
                                    <span className="text-orange-400">🕒</span>
                                    <span className="text-xs font-bold text-gray-700">{format(new Date(nextApt.appointmentDate), "hh:mm a")}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-gray-50 border border-gray-200 rounded-[24px] p-8 text-center">
                        <p className="text-sm font-medium text-gray-500">No upcoming appointments found.</p>
                    </div>
                )}
            </section>

            {/* Practice Activities & Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-6">
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900">Practice activity</h3>
                        <select className="bg-white border text-sm font-bold border-gray-200 text-gray-700 rounded-xl px-4 py-2 shadow-sm focus:outline-none">
                            <option>Monthly</option>
                            <option>Weekly</option>
                        </select>
                    </div>

                    <div className="bg-white p-6 rounded-[24px] shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)] border border-gray-50/50">
                        <p className="text-xs text-gray-400 font-medium mb-8">Today, {format(new Date(), "d MMMM yyyy")}</p>
                        <div className="h-[180px] w-full flex items-end justify-between px-4 pb-2">
                            {chartData.map((d, i) => (
                                <div key={i} className="flex flex-col items-center gap-3 w-10">
                                    <div
                                        className={`w-full rounded-t-full transition-all duration-500 ${d.active ? 'bg-[#52938e]' : 'bg-[#e2edec]'}`}
                                        style={{ height: `${d.value}%` }}
                                    />
                                    <span className={`text-xs font-bold ${d.active ? 'text-gray-900' : 'text-gray-400'}`}>{d.month}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Link href="/doctor/profile" className="mt-6 bg-white p-5 rounded-[24px] shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)] border border-gray-50/50 flex items-center justify-between group cursor-pointer hover:border-[#52938e] transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-orange-50 text-orange-500 shrink-0 rounded-2xl flex items-center justify-center text-xl shadow-sm border border-orange-100">
                                ⭐
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">Pending Reviews</h4>
                                <p className="text-xs text-gray-500 font-medium">Verify documents & panel</p>
                            </div>
                        </div>
                        <span className="text-gray-400 font-bold group-hover:text-gray-800 transition-colors mr-2">›</span>
                    </Link>
                </div>

                <div>
                    {/* Session Goals */}
                    <div className="h-full bg-gradient-to-br from-[#f2f8f7] to-[#e4efed] p-8 rounded-[30px] border border-[#d3e5e3] flex flex-col items-center text-center">
                        <h3 className="text-lg font-bold text-gray-900">Weekly Target</h3>
                        <p className="text-xs text-teal-800/70 font-medium mt-2 max-w-[120px]">Keep up the great consultation work</p>

                        <div className="mt-8 relative w-36 h-36 flex items-center justify-center">
                            {/* CSS Custom circular progress */}
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="40" className="stroke-white/80 fill-none" strokeWidth="12" />
                                <circle cx="50" cy="50" r="40" className="stroke-[#52938e] fill-none drop-shadow-md" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="50.24" strokeLinecap="round" />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center flex-col">
                                <span className="text-3xl font-extrabold text-[#1a4a46]">80%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
