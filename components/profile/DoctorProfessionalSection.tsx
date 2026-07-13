"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"

interface DoctorProfessionalSectionProps {
    doctor: any
    onSavingChange: (isSaving: boolean) => void
}

export default function DoctorProfessionalSection({ doctor, onSavingChange }: DoctorProfessionalSectionProps) {
    const router = useRouter()
    
    const [formData, setFormData] = useState({
        licenseNumber: doctor.licenseNumber || "",
        issuingCouncil: doctor.issuingCouncil || "",
        yearsOfExperience: doctor.yearsOfExperience?.toString() || "",
        primarySpecialization: doctor.primarySpecialization || "",
        highestQualification: doctor.highestQualification || "",
        consultationFee: doctor.consultationFee?.toString() || "",
        bio: doctor.bio || "",
    })

    const saveChanges = useCallback(async (data: typeof formData) => {
        onSavingChange(true)
        try {
            const response = await fetch("/api/profile/doctor", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    licenseNumber: data.licenseNumber || null,
                    issuingCouncil: data.issuingCouncil || null,
                    yearsOfExperience: data.yearsOfExperience ? parseInt(data.yearsOfExperience) : null,
                    primarySpecialization: data.primarySpecialization || null,
                    highestQualification: data.highestQualification || null,
                    consultationFee: data.consultationFee ? parseFloat(data.consultationFee) : null,
                    bio: data.bio || null,
                }),
            })

            if (response.ok) {
                router.refresh()
            }
        } catch (error) {
            console.error("Failed to save professional profile:", error)
        } finally {
            setTimeout(() => onSavingChange(false), 1000)
        }
    }, [onSavingChange, router])

    useEffect(() => {
        const timer = setTimeout(() => {
            const hasChanged = 
                formData.licenseNumber !== (doctor.licenseNumber || "") ||
                formData.issuingCouncil !== (doctor.issuingCouncil || "") ||
                formData.yearsOfExperience !== (doctor.yearsOfExperience?.toString() || "") ||
                formData.primarySpecialization !== (doctor.primarySpecialization || "") ||
                formData.highestQualification !== (doctor.highestQualification || "") ||
                formData.consultationFee !== (doctor.consultationFee?.toString() || "") ||
                formData.bio !== (doctor.bio || "")

            if (hasChanged) {
                saveChanges(formData)
            }
        }, 2000)

        return () => clearTimeout(timer)
    }, [formData, doctor, saveChanges])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    return (
        <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-900">License Number</label>
                    <input
                        type="text"
                        name="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-medium"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-900">Issuing Council</label>
                    <input
                        type="text"
                        name="issuingCouncil"
                        value={formData.issuingCouncil}
                        onChange={handleChange}
                        placeholder="e.g. MCI, State Medical Council"
                        className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-medium"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-900">Years of Experience</label>
                    <input
                        type="number"
                        name="yearsOfExperience"
                        value={formData.yearsOfExperience}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-medium"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-900">Primary Specialization</label>
                    <input
                        type="text"
                        name="primarySpecialization"
                        value={formData.primarySpecialization}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-medium"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-900">Highest Qualification</label>
                    <input
                        type="text"
                        name="highestQualification"
                        value={formData.highestQualification}
                        onChange={handleChange}
                        placeholder="e.g. MBBS, MD, PhD"
                        className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-medium"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-900">Consultation Fee (₹)</label>
                    <input
                        type="number"
                        name="consultationFee"
                        value={formData.consultationFee}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-medium"
                    />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold text-gray-900">Professional Bio</label>
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows={6}
                        placeholder="Tell patients about your approach and expertise..."
                        className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-medium resize-none"
                    />
                </div>
            </div>
        </div>
    )
}
