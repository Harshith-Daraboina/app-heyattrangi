"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminOnboarding() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    phoneNumber: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/onboarding/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push("/admin/dashboard")
      } else {
        alert("Error completing onboarding. Please try again.")
      }
    } catch (error) {
      console.error("Onboarding error:", error)
      alert("Error completing onboarding. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
      <h1 className="text-3xl font-semibold text-gray-800 mb-2">
        Admin Setup
      </h1>
      <p className="text-gray-600 mb-8">
        Complete your admin profile.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number (for OTP verification)
          </label>
          <input
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) =>
              setFormData({ ...formData, phoneNumber: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            placeholder="+91 1234567890"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white py-3 px-6 rounded-xl font-medium hover:from-teal-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
        >
          {isLoading ? "Completing setup..." : "Complete Setup"}
        </button>
      </form>
    </div>
  )
}

