"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import { UserRole } from "@prisma/client"
import PatientOnboarding from "@/components/onboarding/PatientOnboarding"
import CaregiverOnboarding from "@/components/onboarding/CaregiverOnboarding"
import DoctorOnboarding from "@/components/onboarding/DoctorOnboarding"
import AdminOnboarding from "@/components/onboarding/AdminOnboarding"

function OnboardingContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const role = searchParams.get("role") as UserRole | null

  if (!role) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Invalid role. Please sign in again.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {role === "PATIENT" && <PatientOnboarding />}
        {role === "CAREGIVER" && <CaregiverOnboarding />}
        {role === "DOCTOR" && <DoctorOnboarding />}
        {role === "ADMIN" && <AdminOnboarding />}
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-blue-50">
      <p className="text-gray-600">Loading onboarding form...</p>
    </div>
  )
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <OnboardingContent />
    </Suspense>
  )
}

