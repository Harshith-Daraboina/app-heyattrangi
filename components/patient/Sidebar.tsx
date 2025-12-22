"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import SignOutButton from "@/components/auth/SignOutButton"
import type { ReactNode } from "react"

type IconProps = { className?: string }

const iconBase = "h-5 w-5 stroke-[1.6]" // Slightly thinner strokes for elegance

const HomeIcon = ({ className }: IconProps) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        className={`${iconBase} ${className ?? ""}`}
    >
        <path d="M4 11.5 12 5l8 6.5V20a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-4H10v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" />
    </svg>
)

const UserIcon = ({ className }: IconProps) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        className={`${iconBase} ${className ?? ""}`}
    >
        <circle cx="12" cy="8" r="4" />
        <path d="M6 20c0-3.314 2.686-6 6-6s6 2.686 6 6" />
    </svg>
)

const CalendarIcon = ({ className }: IconProps) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        className={`${iconBase} ${className ?? ""}`}
    >
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M9 3v4M15 3v4M4 10h16" />
    </svg>
)

const ChecklistIcon = ({ className }: IconProps) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        className={`${iconBase} ${className ?? ""}`}
    >
        <path d="m5 12 2 2 3-3M5 6l2 2 3-3M11 6h8M11 12h8M11 18h8" />
    </svg>
)

const BookIcon = ({ className }: IconProps) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        className={`${iconBase} ${className ?? ""}`}
    >
        <path d="M5 4h10a3 3 0 0 1 3 3v13H7a3 3 0 0 0-3 3V7a3 3 0 0 1 3-3z" />
        <path d="M5 18h13" />
    </svg>
)

const RobotIcon = ({ className }: IconProps) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`${iconBase} ${className ?? ""}`}
    >
        <rect x="3" y="11" width="18" height="10" rx="2" />
        <circle cx="12" cy="5" r="2" />
        <path d="M12 7v4" />
        <line x1="8" y1="16" x2="8" y2="16" />
        <line x1="16" y1="16" x2="16" y2="16" />
    </svg>
)

const navItems: { label: string; href: string; icon: ReactNode }[] = [
    { label: "Dashboard", href: "/patient/dashboard", icon: <HomeIcon /> },
    { label: "Attrangi Bot", href: "/patient/ai-bot", icon: <RobotIcon /> },
    { label: "Therapists", href: "/patient/therapists", icon: <UserIcon /> },
    { label: "Appointments", href: "/patient/appointments", icon: <CalendarIcon /> },
    { label: "Tasks", href: "/patient/tasks", icon: <ChecklistIcon /> },
    { label: "Resources", href: "/patient/resources", icon: <BookIcon /> },
    { label: "Profile", href: "/patient/profile", icon: <UserIcon /> },
]

export default function Sidebar() {
    const pathname = usePathname()

    return (
        <aside className="hidden lg:flex flex-col gap-4 border-r border-slate-200 bg-white/90 backdrop-blur px-3 py-6 h-screen sticky top-0">
            <Link
                href="/"
                className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 text-white font-semibold shadow-md hover:shadow-lg transition-shadow"
            >
                A
            </Link>
            <div className="flex-1 space-y-2 mt-4">
                {navItems.map((item) => {
                    const isActive = pathname === item.href

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center gap-1 rounded-xl px-3 py-3 text-xs font-medium transition-all duration-200 group relative
                ${isActive
                                    ? "text-teal-600 bg-teal-50 shadow-sm"
                                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                                }`}
                        >
                            {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-teal-500 rounded-r-full" />
                            )}
                            <span className={`text-xl transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-110"}`}>
                                {item.icon}
                            </span>
                            <span>{item.label}</span>
                        </Link>
                    )
                })}
            </div>
            <div className="pt-4 border-t border-slate-200 text-center">
                <SignOutButton />
            </div>
        </aside>
    )
}
