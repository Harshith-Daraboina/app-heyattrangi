"use client"

import { useState } from "react"
import DoctorPersonalInfoSection from "./DoctorPersonalInfoSection"
import DoctorProfessionalSection from "./DoctorProfessionalSection"
import DoctorDocumentsSection from "./DoctorDocumentsSection"
import ManageAvailability from "./ManageAvailability"
import SignOutButton from "@/components/auth/SignOutButton"

interface DoctorProfileSettingsProps {
  user: any
  doctor: any
  session: any
}

type Section = "personal" | "professional" | "availability" | "documents" | "security" | "notifications"

export default function DoctorProfileSettings({ user, doctor, session }: DoctorProfileSettingsProps) {
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
      id: "professional",
      label: "Professional Details",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M12 2v20M2 12h20" />
          <path d="M12 12l8-8M12 12l-8-8M12 12l8 8M12 12l-8 8" />
        </svg>
      )
    },
    {
      id: "availability",
      label: "Manage Availability",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      )
    },
    {
      id: "documents",
      label: "Documents & Licenses",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      )
    },
    {
      id: "security",
      label: "Security",
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
    }
  ]

  return (
    <div className="flex h-full w-full bg-white overflow-hidden">

      {/* Inner Sidebar */}
      <div className="w-[280px] border-r border-gray-100 p-6 flex flex-col gap-6 bg-gray-50/30">
        <h2 className="text-xl font-bold text-gray-900 leading-tight">
          Doctor profile<br />management
        </h2>

        <nav className="flex flex-col gap-1 flex-1">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id as Section)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                activeSection === item.id
                  ? "bg-white text-gray-900 shadow-sm border border-gray-100"
                  : "text-gray-500 hover:text-gray-900 hover:bg-white/50"
              }`}
            >
              <span className={`${activeSection === item.id ? "text-blue-500" : "text-gray-400"}`}>
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="max-w-4xl mx-auto p-10">
          <header className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {activeSection === "personal" && "Personal information"}
                {activeSection === "professional" && "Professional details"}
                {activeSection === "availability" && "Manage Availability"}
                {activeSection === "documents" && "Documents & Licenses"}
                {activeSection === "security" && "Account Security"}
                {activeSection === "notifications" && "Notification Settings"}
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                {activeSection === "personal" && "Update your public profile and contact details"}
                {activeSection === "professional" && "Manage your professional experience and bio"}
                {activeSection === "availability" && "Set your working hours and appointment slots"}
                {activeSection === "documents" && "Manage your professional licenses and certifications"}
              </p>
            </div>

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

          <div className="space-y-8">
            {activeSection === "personal" && (
              <DoctorPersonalInfoSection 
                user={user} 
                doctor={doctor} 
                onSavingChange={setIsSaving} 
              />
            )}

            {activeSection === "professional" && (
              <DoctorProfessionalSection 
                doctor={doctor} 
                onSavingChange={setIsSaving} 
              />
            )}

            {activeSection === "availability" && (
              <ManageAvailability
                doctorId={doctor.id}
                currentAvailability={doctor.availability}
              />
            )}

            {activeSection === "documents" && (
              <DoctorDocumentsSection
                documents={{
                  profilePhoto: doctor.profilePhoto,
                  licenseDocument: doctor.licenseDocument,
                  degreeCertificates: doctor.degreeCertificates || [],
                }}
              />
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
                  This section is being updated to match the new professional interface.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
