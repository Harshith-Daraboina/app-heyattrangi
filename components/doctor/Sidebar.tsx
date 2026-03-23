"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import SignOutButton from "@/components/auth/SignOutButton"
import type { ReactNode } from "react"

type IconProps = { className?: string }

const iconBase = "h-5 w-5 stroke-[2] shrink-0"

const HomeIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={`${iconBase} ${className ?? ""}`}>
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
)

const CalendarIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={`${iconBase} ${className ?? ""}`}>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
)

const ClockIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={`${iconBase} ${className ?? ""}`}>
        <circle cx="12" cy="12" r="9"></circle>
        <polyline points="12 7 12 12 15 15"></polyline>
    </svg>
)

const FileIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={`${iconBase} ${className ?? ""}`}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
)

const UsersIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={`${iconBase} ${className ?? ""}`}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
)

const SettingsIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={`${iconBase} ${className ?? ""}`}>
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
        <circle cx="12" cy="12" r="3"></circle>
    </svg>
)

const HelpIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={`${iconBase} ${className ?? ""}`}>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
)

const navItems = [
    { label: "Dashboard", href: "/doctor/dashboard", icon: <HomeIcon /> },
    { label: "Schedule", href: "/doctor/appointments", icon: <CalendarIcon /> },
    { label: "Availability", href: "/doctor/availability", icon: <ClockIcon /> },
    { label: "Profile", href: "/doctor/profile", icon: <SettingsIcon /> },
]

export default function DoctorSidebar() {
    const pathname = usePathname()

    return (
        <aside className="flex flex-col items-center bg-[#18181b] w-[90px] h-full py-8 text-gray-400 relative shrink-0 z-40 overflow-y-auto">
            <Link
                href="/doctor/dashboard"
                className="mb-10 block"
            >
                <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center shadow-sm p-1.5 mx-auto">
                    <Image
                        src="/images/logo-main.png"
                        alt="Attrangi Logo"
                        width={40}
                        height={40}
                        className="w-full h-full object-contain"
                        priority
                    />
                </div>
            </Link>

            <nav className="flex-1 w-full space-y-6 flex flex-col items-center">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            title={item.label}
                            className={`relative flex flex-col items-center justify-center w-full h-[60px] transition-colors group
                                ${isActive ? "text-white" : "hover:text-gray-200"}
                            `}
                        >
                            {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-10 w-1 bg-orange-400 rounded-r-full" />
                            )}
                            <div className="relative">
                                <span className={`block transition-transform ${isActive ? '' : 'group-hover:scale-110'}`}>
                                    {item.icon}
                                </span>
                                {isActive && <span className="text-[9px] font-bold absolute -bottom-4 left-1/2 -translate-x-1/2 text-orange-400 whitespace-nowrap">{item.label}</span>}
                            </div>
                        </Link>
                    )
                })}
            </nav>

            <div className="mt-auto space-y-6 flex flex-col items-center w-full">
                <button className="text-gray-400 hover:text-white transition-colors" title="Help">
                    <HelpIcon className="w-5 h-5" />
                </button>
                <SignOutButton className="p-0 border-0 bg-transparent text-gray-400 hover:text-white hover:bg-transparent shadow-none" />
            </div>
        </aside>
    )
}
