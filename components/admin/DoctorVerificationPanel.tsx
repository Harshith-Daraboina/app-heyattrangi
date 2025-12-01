"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface Doctor {
  id: string
  fullName: string | null
  profilePhoto: string | null
  gender: string | null
  dateOfBirth: Date | null
  mobileNumber: string | null
  emailAddress: string | null
  currentAddress: string | null
  city: string | null
  state: string | null
  country: string | null
  licenseNumber: string | null
  issuingCouncil: string | null
  licenseDocument: string | null
  digiLockerId: string | null
  digiLockerVerified: boolean
  yearsOfExperience: number | null
  primarySpecialization: string | null
  secondarySpecializations: string[]
  highestQualification: string | null
  degreeCertificates: string[]
  bio: string | null
  consultationFee: number | null
  licenseVerified: boolean
  status: "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED"
  createdAt: Date
  user: {
    id: string
    name: string | null
    email: string | null
    image: string | null
    createdAt: Date
  }
}

interface DoctorVerificationPanelProps {
  doctor: Doctor
}

export default function DoctorVerificationPanel({ doctor }: DoctorVerificationPanelProps) {
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState(false)
  const [verificationNotes, setVerificationNotes] = useState("")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  // Debug: Log doctor data
  console.log("DoctorVerificationPanel - doctor data:", doctor)

  if (!doctor) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 text-center">
        <p className="text-red-600">Error: Doctor data not available</p>
      </div>
    )
  }

  const handleVerify = async (verified: boolean, action: "APPROVED" | "REJECTED") => {
    if (!confirm(`Are you sure you want to ${action === "APPROVED" ? "approve" : "reject"} this doctor?`)) {
      return
    }

    setIsUpdating(true)
    try {
      const response = await fetch(`/api/admin/doctors/${doctor.id}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: action,
          licenseVerified: verified,
          notes: verificationNotes,
        }),
      })

      if (response.ok) {
        router.refresh()
        alert(`Doctor ${action === "APPROVED" ? "approved" : "rejected"} successfully!`)
      } else {
        const error = await response.json()
        alert(error.error || "Failed to update doctor status")
      }
    } catch (error) {
      console.error("Error updating doctor status:", error)
      alert("Failed to update doctor status. Please try again.")
    } finally {
      setIsUpdating(false)
    }
  }

  const displayPhoto = doctor.profilePhoto || doctor.user.image

  return (
    <div className="space-y-6">
      {/* Doctor Info Card */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-start gap-6 mb-6">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-200 bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center">
            {displayPhoto ? (
              <img
                src={displayPhoto}
                alt={doctor.fullName || "Doctor"}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-3xl text-white font-semibold">
                {(doctor.fullName || doctor.user.name || "D")[0].toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">
                  {doctor.fullName || doctor.user.name || "Unknown Doctor"}
                </h2>
                <p className="text-gray-600">{doctor.user.email}</p>
              </div>
              <span
                className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                  doctor.status === "APPROVED"
                    ? "bg-green-100 text-green-800"
                    : doctor.status === "PENDING"
                    ? "bg-orange-100 text-orange-800"
                    : doctor.status === "REJECTED"
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {doctor.status}
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
              <div>
                <span className="text-gray-500">Specialization:</span>
                <p className="font-medium text-gray-800">
                  {doctor.primarySpecialization || "N/A"}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Experience:</span>
                <p className="font-medium text-gray-800">
                  {doctor.yearsOfExperience ? `${doctor.yearsOfExperience} years` : "N/A"}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Consultation Fee:</span>
                <p className="font-medium text-gray-800">
                  {doctor.consultationFee ? `₹${doctor.consultationFee}` : "N/A"}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Registered:</span>
                <p className="font-medium text-gray-800">
                  {new Date(doctor.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Documents Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">
          Documents & Verification
        </h3>

        <div className="space-y-6">
          {/* Profile Photo */}
          {displayPhoto && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Photo
              </label>
              <img
                src={displayPhoto}
                alt="Profile"
                className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200 cursor-pointer hover:border-blue-500 transition-colors"
                onClick={() => setSelectedImage(displayPhoto)}
              />
            </div>
          )}

          {/* License Document */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              License Document
            </label>
            {doctor.licenseDocument ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">📄</div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">License Document</p>
                    <p className="text-sm text-gray-500">
                      License Number: {doctor.licenseNumber || "Not provided"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Issuing Council: {doctor.issuingCouncil || "Not provided"}
                    </p>
                  </div>
                  <a
                    href={doctor.licenseDocument}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    View Document
                  </a>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No license document uploaded</p>
            )}
          </div>

          {/* Degree Certificates */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Degree Certificates ({doctor.degreeCertificates?.length || 0})
            </label>
            {doctor.degreeCertificates && doctor.degreeCertificates.length > 0 ? (
              <div className="space-y-3">
                {doctor.degreeCertificates.map((cert, index) => (
                  <div
                    key={index}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">🎓</div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">
                          Certificate #{index + 1}
                        </p>
                        <p className="text-sm text-gray-500">Degree certificate</p>
                      </div>
                      <a
                        href={cert}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        View Document
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No degree certificates uploaded</p>
            )}
          </div>
        </div>
      </div>

      {/* Verification Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Verification Actions
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Verification Notes (Optional)
            </label>
            <textarea
              value={verificationNotes}
              onChange={(e) => setVerificationNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add notes about the verification decision..."
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={() => handleVerify(true, "APPROVED")}
              disabled={isUpdating || doctor.status === "APPROVED"}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
            >
              {isUpdating ? "Processing..." : "✓ Approve Doctor"}
            </button>
            <button
              onClick={() => handleVerify(false, "REJECTED")}
              disabled={isUpdating || doctor.status === "REJECTED"}
              className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
            >
              {isUpdating ? "Processing..." : "✗ Reject Doctor"}
            </button>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={selectedImage}
              alt="Preview"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-white text-gray-800 rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

