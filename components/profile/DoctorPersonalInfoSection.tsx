"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface DoctorPersonalInfoSectionProps {
    user: any
    doctor: any
    onSavingChange: (isSaving: boolean) => void
}

export default function DoctorPersonalInfoSection({ user, doctor, onSavingChange }: DoctorPersonalInfoSectionProps) {
    const router = useRouter()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    
    const [formData, setFormData] = useState({
        fullName: doctor.fullName || user.name || "",
        email: user.email || "",
        gender: doctor.gender || "",
        dateOfBirth: doctor.dateOfBirth
            ? new Date(doctor.dateOfBirth).toISOString().split("T")[0]
            : "",
        mobileNumber: doctor.mobileNumber || "",
        currentAddress: doctor.currentAddress || "",
        city: doctor.city || "",
        state: doctor.state || "",
        country: doctor.country || "India",
    })

    const saveChanges = useCallback(async (data: typeof formData) => {
        onSavingChange(true)
        try {
            const response = await fetch("/api/profile/doctor", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fullName: data.fullName,
                    gender: data.gender || null,
                    dateOfBirth: data.dateOfBirth || null,
                    mobileNumber: data.mobileNumber || null,
                    currentAddress: data.currentAddress || null,
                    city: data.city || null,
                    state: data.state || null,
                    country: data.country || "India",
                }),
            })

            if (response.ok) {
                router.refresh()
            }
        } catch (error) {
            console.error("Failed to save doctor profile:", error)
        } finally {
            // Keep the "Saving" state for at least 1 second for visual feedback
            setTimeout(() => onSavingChange(false), 1000)
        }
    }, [onSavingChange, router])

    // Debounce effect for auto-saving
    useEffect(() => {
        const timer = setTimeout(() => {
            const hasChanged = 
                formData.fullName !== (doctor.fullName || user.name || "") ||
                formData.gender !== (doctor.gender || "") ||
                formData.dateOfBirth !== (doctor.dateOfBirth ? new Date(doctor.dateOfBirth).toISOString().split("T")[0] : "") ||
                formData.mobileNumber !== (doctor.mobileNumber || "") ||
                formData.currentAddress !== (doctor.currentAddress || "") ||
                formData.city !== (doctor.city || "") ||
                formData.state !== (doctor.state || "") ||
                formData.country !== (doctor.country || "India")

            if (hasChanged) {
                saveChanges(formData)
            }
        }, 2000)

        return () => clearTimeout(timer)
    }, [formData, doctor, user.name, saveChanges])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => setPreviewUrl(reader.result as string)
            reader.readAsDataURL(file)
            uploadProfilePhoto(file)
        }
    }

    const uploadProfilePhoto = async (file: File) => {
        setIsUploading(true)
        onSavingChange(true)
        try {
            const formData = new FormData()
            formData.append("photo", file)

            const response = await fetch("/api/profile/doctor/upload-photo", {
                method: "POST",
                body: formData,
            })

            if (response.ok) {
                router.refresh()
                setPreviewUrl(null)
            }
        } catch (error) {
            console.error("Error uploading profile photo:", error)
        } finally {
            setIsUploading(false)
            onSavingChange(false)
        }
    }
    const handleRemoveCustomPhoto = async () => {
        onSavingChange(true)
        try {
            const response = await fetch("/api/profile/doctor", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fullName: formData.fullName,
                    profilePhoto: null
                }),
            })

            if (response.ok) {
                router.refresh()
                setPreviewUrl(null)
            }
        } catch (error) {
            console.error("Failed to reset photo:", error)
        } finally {
            setTimeout(() => onSavingChange(false), 1000)
        }
    }

    const displayPhoto = previewUrl || doctor.profilePhoto || user.image

    return (
        <div className="space-y-12">
            {/* Profile Picture Section */}
            <div className="flex flex-col gap-4">
                <div className="relative w-32 h-32">
                    <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100 relative group">
                        {displayPhoto ? (
                            <Image
                                src={displayPhoto}
                                alt="Profile"
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400 font-bold text-3xl">
                                {(doctor.fullName || user.name || user.email || "U")[0].toUpperCase()}
                            </div>
                        )}
                        {isUploading && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                            </div>
                        )}
                    </div>
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-black text-white p-2.5 rounded-xl shadow-xl hover:bg-gray-900 transition-all active:scale-90"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                            <circle cx="12" cy="13" r="4" />
                        </svg>
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                </div>

                <div className="flex gap-2">
                    <button 
                        onClick={() => fileInputRef.current?.click()} 
                        className="text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg transition-colors border border-gray-200"
                    >
                        Upload to Cloudinary
                    </button>
                    {(doctor.profilePhoto || user.image) && (
                        <button 
                            onClick={handleRemoveCustomPhoto} 
                            className="text-xs font-bold bg-white hover:bg-red-50 text-red-500 px-3 py-1.5 rounded-lg transition-colors border border-gray-200"
                        >
                            Reset to Default Google Image
                        </button>
                    )}
                </div>
            </div>

            {/* Form Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-900">Full Name</label>
                    <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Dr. Name"
                        className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-medium"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-900">Email Address</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        readOnly
                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-gray-500 cursor-not-allowed outline-none font-medium"
                    />
                    <p className="text-[10px] text-gray-400 pl-2 italic">Email is managed via your account provider</p>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-900">Date of Birth</label>
                    <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-medium"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-900">Gender</label>
                    <div className="relative">
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-2xl appearance-none outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                            <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-900">Mobile Number</label>
                    <input
                        type="tel"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        placeholder="+91 XXXXX XXXXX"
                        className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-medium"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-900">City</label>
                    <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-medium"
                    />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold text-gray-900">Current Address</label>
                    <textarea
                        name="currentAddress"
                        value={formData.currentAddress}
                        onChange={handleChange}
                        rows={2}
                        className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-medium resize-none"
                    />
                </div>
            </div>
        </div>
    )
}
