"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"

// --- Custom Icons matching the Mockup ---
type IconProps = { className?: string }
const iconBase = "h-5 w-5 shrink-0"

const GridIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${iconBase} ${className ?? ""}`}>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
    </svg>
)

const CalendarIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${iconBase} ${className ?? ""}`}>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
)

const ListIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${iconBase} ${className ?? ""}`}>
        <rect x="3" y="4" width="18" height="14" rx="2" />
        <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
)

const ChartIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${iconBase} ${className ?? ""}`}>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M17 9v6" />
        <path d="M12 11v4" />
        <path d="M7 13v2" />
    </svg>
)

const ChatIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${iconBase} ${className ?? ""}`}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <path d="M8 10h.01" />
        <path d="M12 10h.01" />
        <path d="M16 10h.01" />
    </svg>
)

const SettingsIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${iconBase} ${className ?? ""}`}>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
)

const UsersIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${iconBase} ${className ?? ""}`}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
)

const CreditCardIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${iconBase} ${className ?? ""}`}>
        <rect x="2" y="5" width="20" height="14" rx="2" ry="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
)

const LeafIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${iconBase} ${className ?? ""}`}>
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
)

const SidebarToggleIcon = ({ className, isCollapsed }: IconProps & { isCollapsed: boolean }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        className={`${iconBase} transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""} ${className ?? ""}`}>
        <polyline points="15 18 9 12 15 6" />
    </svg>
)

const generalItems = [
    { label: "Dashboard", href: "/patient/dashboard", icon: <GridIcon /> },
    { label: "Therapists", href: "/patient/therapists", icon: <UsersIcon /> },
    { label: "Schedule", href: "/patient/appointments", icon: <CalendarIcon /> },
    { label: "Mood Tracking", href: "/patient/mood", icon: <ChartIcon /> },
]

const toolItems = [
    {
        label: "Pragya AI",
        href: "/patient/ai-bot",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-orange-500">
                <path d="M12 2L15 8L21 11L15 14L12 20L9 14L3 11L9 8L12 2Z" fill="currentColor" fillOpacity="0.2" />
                <path d="m5 3 3 2L5 7 2 5z" fill="currentColor" />
                <path d="m19 17 3 2-3 2-2-2z" fill="currentColor" />
            </svg>
        )
    },
    // { label: "Messages", href: "/patient/messages", badge: 1, icon: <ChatIcon /> },
    { label: "Profile", href: "/patient/profile", icon: <SettingsIcon /> },
]

export default function Sidebar() {
    const pathname = usePathname()
    const [isCollapsed, setIsCollapsed] = useState(false)

    return (
        <div className={`relative h-full transition-all duration-300 ${isCollapsed ? "w-[90px]" : "w-[260px]"} shrink-0 bg-[#131316] border-r border-[#27272a] z-40`}>

            {/* Toggle Button centered on the vertical border */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute top-1/2 -translate-y-1/2 -right-3.5 text-zinc-400 hover:text-white transition-colors z-50 bg-[#18181b] p-1.5 rounded-full border border-[#3f3f46] shadow-lg flex items-center justify-center cursor-pointer"
                aria-label="Toggle Sidebar"
                title="Toggle Sidebar"
            >
                <SidebarToggleIcon className="w-4 h-4" isCollapsed={isCollapsed} />
            </button>

            <aside className={`flex flex-col h-full py-6 overflow-y-auto overflow-x-hidden shadow-inner ${isCollapsed ? "px-3 md:px-0" : "pl-3 pr-5"}`}>

                {/* Header / Logo */}
                <Link href="/patient/dashboard" className={`flex items-center transition-all ${isCollapsed ? "justify-center mt-6 mb-10" : "pl-0 mb-6 gap-3"}`}>
                    <div className="shrink-0">
                        <Image
                            src="/images/logo.png"
                            alt="Logo"
                            width={isCollapsed ? 36 : 40}
                            height={isCollapsed ? 36 : 40}
                            className="object-contain"
                        />
                    </div>
                    {!isCollapsed && (
                        <div className="flex items-center gap-0.5 tracking-tighter">
                            <span className="text-2xl font-black text-white">hey</span>
                            <span className="text-2xl font-black text-[var(--color-brand)]">attrangi</span>
                        </div>
                    )}
                </Link>

                {/* General Section */}
                <div className={`mb-8 ${isCollapsed ? "px-2" : "pl-2"}`}>
                    {!isCollapsed && <h3 className="text-[11px] font-bold text-zinc-500 mb-3 px-2 uppercase tracking-wide">General</h3>}
                    <nav className="flex flex-col gap-1.5">
                        {generalItems.map((item) => {
                            const isActive = pathname === item.href || (item.href !== '/patient/dashboard' && pathname.startsWith(item.href.split('?')[0]) && item.label !== "Calendar")

                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    title={isCollapsed ? item.label : undefined}
                                    className={`flex items-center justify-between rounded-2xl transition-all duration-300 font-bold
                                        ${isCollapsed ? "p-3 justify-center" : "px-4 py-3"}
                                        ${isActive
                                            ? "bg-[#27272a] text-white shadow-sm ring-1 ring-white/5"
                                            : "text-zinc-400 hover:text-zinc-100 hover:bg-white/5"
                                        }
                                    `}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`${isActive ? "text-white" : "text-zinc-400"}`}>
                                            {item.icon}
                                        </div>
                                        {!isCollapsed && <span className="text-sm whitespace-nowrap">{item.label}</span>}
                                    </div>
                                </Link>
                            )
                        })}
                    </nav>
                </div>

                {/* Tools Section */}
                <div className={`mb-8 w-full flex-1 ${isCollapsed ? "px-2" : "pl-2"}`}>
                    {!isCollapsed && <h3 className="text-[11px] font-bold text-zinc-500 mb-3 px-2 uppercase tracking-wide">Tools</h3>}
                    <nav className="flex flex-col gap-1.5">
                        {toolItems.map((item) => {
                            const isActive = pathname === item.href

                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    title={isCollapsed ? item.label : undefined}
                                    className={`flex items-center justify-between rounded-2xl transition-all duration-300 font-bold relative
                                        ${isCollapsed ? "p-3 justify-center" : "px-4 py-3"}
                                        ${isActive
                                            ? "bg-[#27272a] text-white shadow-sm ring-1 ring-white/5"
                                            : "text-zinc-400 hover:text-zinc-100 hover:bg-white/5"
                                        }
                                    `}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`${isActive ? "text-white" : "text-zinc-400"}`}>
                                            {item.icon}
                                        </div>
                                        {!isCollapsed && <span className="text-sm whitespace-nowrap">{item.label}</span>}
                                    </div>
                                    {item.badge && (
                                        <div className={`bg-[#0066ff] text-white text-[10px] flex items-center justify-center rounded-full shadow-sm ${isCollapsed ? "absolute top-1 right-2 w-4 h-4" : "w-5 h-5 ml-auto"}`}>
                                            {item.badge}
                                        </div>
                                    )}
                                </Link>
                            )
                        })}
                    </nav>
                </div>

                {/* Mood Atmosphere Video */}
                {!isCollapsed && (
                    <div className="mt-8 mb-6 mx-4 rounded-2xl overflow-hidden aspect-video relative border border-white/10 group">
                        <video
                            src="/videos/mood.mp4"
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#131316] via-transparent to-transparent" />
                        <div className="absolute bottom-3 left-3">
                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Atmosphere</p>
                        </div>
                    </div>
                )}

                {/* Bottom CTA */}
                {/* {!isCollapsed && (
                    <div className="mb-6 mx-4">
                        <button className="w-full bg-white hover:bg-zinc-200 text-black rounded-[14px] py-3.5 shadow-lg flex items-center justify-center gap-2.5 transition-all">
                            <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center shrink-0">
                                <span className="text-white text-base leading-none font-medium mb-[1px]">+</span>
                            </div>
                            <span className="text-[14px] font-bold tracking-wide">Book Appointment</span>
                        </button>
                    </div>
                )} */}

                {/* Collapsed State CTA */}
                {isCollapsed && (
                    <div className="mt-auto mb-6 mx-auto w-full flex justify-center px-2">
                        <button
                            className="w-12 h-12 bg-white hover:bg-zinc-200 text-black rounded-full shadow-lg flex items-center justify-center transition-all"
                            title="Book Appointment"
                        >
                            <span className="text-black text-2xl leading-none font-medium mb-1">+</span>
                        </button>
                    </div>
                )}
            </aside>
        </div>
    )
}
