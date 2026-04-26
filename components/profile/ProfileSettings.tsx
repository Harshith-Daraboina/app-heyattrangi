"use client"

import { useState } from "react"
import { User, Patient } from "@prisma/client"
import PersonalInfoSection from "./PersonalInfoSection"
import BillingSection from "./BillingSection"
import CreditsSection from "./CreditsSection"
import SignOutButton from "@/components/auth/SignOutButton"

interface ProfileSettingsProps {

    user: User & {
        patient?: Patient | null
    }
}

type Section = "personal" | "security" | "notifications" | "billing" | "credits"

export default function ProfileSettings({ user }: ProfileSettingsProps) {
    const [activeSection, setActiveSection] = useState<Section>("personal")
    const [isSaving, setIsSaving] = useState(false)

    const sidebarItems = [
        {
            id: "personal",
            label: "Personal Info",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                </svg>
            )
        },
        {
            id: "security",
            label: "Emails & Password",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
            )
        },
        {
            id: "notifications",
            label: "Notifications",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
            )
        },
        {
            id: "billing",
            label: "Billing & Invoices",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <rect x="2" y="5" width="20" height="14" rx="2" ry="2" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
            )
        },
        {
            id: "credits",
            label: "Care Credits",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                </svg>
            )
        }
    ]

    return (
        <div className="flex h-full w-full bg-white overflow-hidden">
            {/* Inner Sidebar */}
            <div className="w-[280px] border-r border-gray-100 p-6 flex flex-col gap-6">
                <h2 className="text-xl font-bold text-gray-900 leading-tight">
                    User profile<br />management
                </h2>

                <nav className="flex flex-col gap-1 flex-1">
                    {sidebarItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveSection(item.id as Section)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                                activeSection === item.id
                                    ? "bg-gray-50 text-gray-900 shadow-sm"
                                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50/50"
                            }`}
                        >
                            <span className={`${activeSection === item.id ? "text-gray-900" : "text-gray-400"}`}>
                                {item.icon}
                            </span>
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="mt-auto pt-6 border-t border-gray-100">
                    <SignOutButton className="flex items-center gap-3 px-4 py-3 w-full rounded-xl transition-all duration-200 text-sm font-medium text-red-500 hover:bg-red-50" />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-4xl mx-auto p-10">
                    <header className="flex justify-between items-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">
                            {activeSection === "personal" && "Personal information"}
                            {activeSection === "security" && "Emails & Password"}
                            {activeSection === "notifications" && "Notifications"}
                            {activeSection === "billing" && "Billing & Invoices"}
                            {activeSection === "credits" && "Care Credits"}
                        </h1>



                        <div className="flex items-center gap-2 text-[13px] font-medium text-[#00a870]">
                            {isSaving ? (
                                <>
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Saving changes
                                </>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-[#00a870]" />
                                    All changes saved
                                </span>
                            )}
                        </div>
                    </header>

                    {activeSection === "personal" && (
                        <PersonalInfoSection user={user} onSavingChange={setIsSaving} />
                    )}

                    {activeSection === "billing" && (
                        <BillingSection />
                    )}

                    {activeSection === "credits" && (
                        <CreditsSection />
                    )}

                    {["security", "notifications"].includes(activeSection) && (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-gray-300">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">Section Under Development</h3>
                            <p className="text-gray-500 max-w-sm mt-1">
                                We're working hard to bring you more customization options. This section will be available soon.
                            </p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}
