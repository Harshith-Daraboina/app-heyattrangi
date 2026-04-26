"use client"

import { useState, type ReactNode } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import SignOutButton from "@/components/auth/SignOutButton"

// --- Icons ---
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

const ClockIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${iconBase} ${className ?? ""}`}>
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
)

const SettingsIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${iconBase} ${className ?? ""}`}>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
)

const SidebarToggleIcon = ({ className, isCollapsed }: IconProps & { isCollapsed: boolean }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        className={`${iconBase} transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""} ${className ?? ""}`}>
        <polyline points="15 18 9 12 15 6" />
    </svg>
)

interface SidebarItem {
    label: string
    href: string
    icon: ReactNode
}

const navItems: SidebarItem[] = [
    { label: "Dashboard", href: "/doctor/dashboard", icon: <GridIcon /> },
    { label: "Appointments", href: "/doctor/appointments", icon: <CalendarIcon /> },
    { label: "Availability", href: "/doctor/availability", icon: <ClockIcon /> },
    { label: "Profile", href: "/doctor/profile", icon: <SettingsIcon /> },
]

export default function DoctorSidebar() {
    const pathname = usePathname()
    const [isCollapsed, setIsCollapsed] = useState(false)

    return (
        <div className={`relative h-full transition-all duration-300 ${isCollapsed ? "w-[90px]" : "w-[260px]"} shrink-0 bg-[#131316] border-r border-[#27272a] z-40`}>
            
            {/* Toggle Button */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute top-1/2 -translate-y-1/2 -right-3.5 text-zinc-400 hover:text-white transition-colors z-50 bg-[#18181b] p-1.5 rounded-full border border-[#3f3f46] shadow-lg flex items-center justify-center cursor-pointer"
                aria-label="Toggle Sidebar"
            >
                <SidebarToggleIcon className="w-4 h-4" isCollapsed={isCollapsed} />
            </button>

            <aside className={`flex flex-col h-full py-6 overflow-y-auto overflow-x-hidden ${isCollapsed ? "px-3 md:px-0" : "pl-3 pr-5"}`}>
                
                {/* Logo */}
                <Link href="/doctor/dashboard" className={`flex items-center transition-all ${isCollapsed ? "justify-center mt-6 mb-10" : "pl-0 mb-8 gap-3"}`}>
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
                        <div className="flex flex-col -gap-1">
                            <div className="flex items-center gap-0 tracking-tighter">
                                <span className="text-2xl font-extrabold text-white">hey</span>
                                <span className="text-2xl font-extrabold text-blue-500">attrangi</span>
                            </div>
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] leading-none">DOCTOR PORTAL</span>
                        </div>
                    )}

                </Link>

                {/* Main Nav */}
                <nav className="flex flex-col gap-1.5 flex-1">
                    {!isCollapsed && <h3 className="text-[11px] font-bold text-zinc-500 mb-3 px-4 uppercase tracking-widest">Main Menu</h3>}
                    {navItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                title={isCollapsed ? item.label : undefined}
                                className={`flex items-center gap-3 rounded-2xl transition-all duration-300 font-bold
                                    ${isCollapsed ? "p-3 justify-center" : "px-4 py-3.5"}
                                    ${isActive
                                        ? "bg-[#27272a] text-white shadow-sm ring-1 ring-white/5"
                                        : "text-zinc-400 hover:text-zinc-100 hover:bg-white/5"
                                    }
                                `}
                            >
                                <div className={`${isActive ? "text-blue-400" : "text-zinc-400"}`}>
                                    {item.icon}
                                </div>
                                {!isCollapsed && <span className="text-[13px] whitespace-nowrap">{item.label}</span>}
                            </Link>
                        )
                    })}
                </nav>

                {/* Atmosphere Video (Professional Version) */}
                {!isCollapsed && (
                    <div className="mt-8 mb-6 mx-2 rounded-2xl overflow-hidden aspect-video relative border border-white/5 group">
                        <video
                            src="/videos/mood.mp4"
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#131316] via-transparent to-transparent" />
                        <div className="absolute bottom-3 left-3">
                            <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">Clinical Environment</p>
                        </div>
                    </div>
                )}

                {/* Sign Out */}
                <div className={`mt-auto pt-6 border-t border-white/5 ${isCollapsed ? "flex justify-center" : ""}`}>
                    <SignOutButton className={`flex items-center gap-3 w-full rounded-xl transition-all duration-200 text-sm font-medium text-red-400 hover:bg-red-500/10 ${isCollapsed ? "justify-center p-3" : "px-4 py-3"}`}>
                        {!isCollapsed && <span>Sign Out</span>}
                        {isCollapsed && (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                        )}
                    </SignOutButton>
                </div>
            </aside>
        </div>
    )
}
