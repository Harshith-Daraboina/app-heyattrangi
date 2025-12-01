"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"

interface ProfilePictureSectionProps {
  user: {
    id: string
    name: string | null
    email: string | null
    image: string | null // Google profile picture
  }
  doctor: {
    id: string
    profilePhoto: string | null // Uploaded profile photo
  }
  session: {
    user: {
      image: string | null
    }
  } | null
}

export default function ProfilePictureSection({
  user,
  doctor,
  session,
}: ProfilePictureSectionProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // Priority: uploaded profile photo > Google picture from session > user.image > default
  const currentPhoto = doctor.profilePhoto || session?.user?.image || user.image || null
  const isGooglePhoto = !doctor.profilePhoto && (!!session?.user?.image || !!user.image)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Show preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)

      // Upload to Cloudinary
      uploadProfilePhoto(file)
    }
  }

  const uploadProfilePhoto = async (file: File) => {
    setIsUploading(true)
    try {
      // Upload to server endpoint
      const formData = new FormData()
      formData.append("photo", file)

      const response = await fetch("/api/profile/doctor/upload-photo", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        router.refresh()
        alert("Profile photo updated successfully!")
        setPreviewUrl(null)
      } else {
        const error = await response.json()
        throw new Error(error.error || "Failed to update profile photo")
      }
    } catch (error: any) {
      console.error("Error uploading profile photo:", error)
      alert(error.message || "Failed to upload profile photo. Please try again.")
      setPreviewUrl(null)
    } finally {
      setIsUploading(false)
    }
  }

  const displayPhoto = previewUrl || currentPhoto

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
      <div className="flex items-center gap-6">
        {/* Profile Picture */}
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-200 bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center">
            {displayPhoto ? (
              <img
                src={displayPhoto}
                alt={user.name || "Profile"}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-4xl text-white font-semibold">
                {(user.name || user.email || "U")[0].toUpperCase()}
              </span>
            )}
          </div>
          {isUploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          )}
        </div>

        {/* Profile Info */}
        <div className="flex-1">
          <h2 className="text-2xl font-semibold text-gray-800 mb-1">
            {user.name || "Doctor"}
          </h2>
          <p className="text-gray-600 mb-4">{user.email}</p>
          
          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isUploading ? "Uploading..." : doctor.profilePhoto ? "Change Photo" : "Upload Photo"}
            </button>
            {doctor.profilePhoto && (
              <button
                onClick={async () => {
                  if (confirm("Remove profile photo? It will use your Google profile picture instead.")) {
                    const response = await fetch("/api/profile/doctor", {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        profilePhoto: null,
                      }),
                    })
                    if (response.ok) {
                      router.refresh()
                    }
                  }
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all"
              >
                Remove
              </button>
            )}
          </div>
          {!doctor.profilePhoto && session?.user?.image && (
            <p className="text-sm text-gray-500 mt-2">
              Currently using your Google profile picture
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

