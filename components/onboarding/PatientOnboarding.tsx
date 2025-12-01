"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

export default function PatientOnboarding() {
  const router = useRouter()
  const { data: session } = useSession()
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    healthConcerns: [] as string[],
    emergencyContact: "",
    emergencyPhone: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const healthConcernOptions = [
    "Anxiety",
    "Depression",
    "ADHD",
    "Autism",
    "Bipolar Disorder",
    "PTSD",
    "OCD",
    "Eating Disorders",
    "Substance Abuse",
    "Other",
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/onboarding/patient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push("/patient/dashboard")
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

  const toggleConcern = (concern: string) => {
    setFormData((prev) => ({
      ...prev,
      healthConcerns: prev.healthConcerns.includes(concern)
        ? prev.healthConcerns.filter((c) => c !== concern)
        : [...prev.healthConcerns, concern],
    }))
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
      <h1 className="text-3xl font-semibold text-gray-800 mb-2">
        Welcome! Let's set up your profile
      </h1>
      <p className="text-gray-600 mb-8">
        This information helps us match you with the right care.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Age
          </label>
          <input
            type="number"
            min="1"
            max="120"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender
          </label>
          <select
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            required
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Non-binary">Non-binary</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Health Concerns (Select all that apply)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {healthConcernOptions.map((concern) => (
              <button
                key={concern}
                type="button"
                onClick={() => toggleConcern(concern)}
                className={`
                  px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all
                  ${
                    formData.healthConcerns.includes(concern)
                      ? "bg-teal-50 border-teal-500 text-teal-700"
                      : "bg-white border-gray-300 text-gray-700 hover:border-teal-300"
                  }
                `}
              >
                {concern}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Emergency Contact Name
          </label>
          <input
            type="text"
            value={formData.emergencyContact}
            onChange={(e) =>
              setFormData({ ...formData, emergencyContact: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Emergency Contact Phone
          </label>
          <input
            type="tel"
            value={formData.emergencyPhone}
            onChange={(e) =>
              setFormData({ ...formData, emergencyPhone: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            required
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

