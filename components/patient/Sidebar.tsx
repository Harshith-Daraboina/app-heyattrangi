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

const MoodIcon = ({ className }: IconProps) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`${iconBase} ${className ?? ""}`}
    >
        <circle cx="12" cy="12" r="9" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
        <circle cx="9" cy="10" r="0.75" fill="currentColor" stroke="none" />
        <circle cx="15" cy="10" r="0.75" fill="currentColor" stroke="none" />
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
    { label: "Home", href: "/patient/dashboard", icon: <HomeIcon /> },
    { label: "AI Chat", href: "/patient/ai-bot", icon: <RobotIcon /> },
    { label: "Browse", href: "/patient/therapists", icon: <UserIcon /> },
    { label: "Schedule", href: "/patient/appointments", icon: <CalendarIcon /> },
    { label: "Mood", href: "/patient/mood", icon: <MoodIcon /> },
    { label: "Profile", href: "/patient/profile", icon: <UserIcon /> },
]

export default function Sidebar() {
    const pathname = usePathname()

    return (
        <aside className="hidden lg:flex flex-col gap-4 border-r border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-6 h-screen sticky top-0">
            <Link
                href="/"
                className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-brand)] text-white font-semibold shadow-md hover:opacity-95 transition-opacity"
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
                            className={`flex flex-col items-center gap-1 rounded-xl px-3 py-3 text-xs transition-all duration-200 group relative
                ${isActive
                                    ? "text-[var(--color-brand)] font-medium"
                                    : "text-[var(--color-text-secondary)] font-normal hover:bg-[var(--color-surface-raised)]"
                                }`}
                        >
                            {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-[var(--color-brand)] rounded-r-full" />
                            )}
                            <span className={`text-xl transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-110"}`}>
                                {item.icon}
                            </span>
                            <span>{item.label}</span>
                        </Link>
                    )
                })}
            </div>
            <div className="pt-4 border-t border-[var(--color-border)] text-center">
                <SignOutButton />
            </div>
        </aside>
    )
}
