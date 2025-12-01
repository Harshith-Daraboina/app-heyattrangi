"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"

interface Doctor {
  id: string
  specialization: string | null
  experience: number | null
  consultationFee: number
  bio: string | null
  user: {
    name: string | null
    email: string | null
    image: string | null
  }
  availability: {
    isAvailable: boolean
  } | null
}

export default function TherapistList() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [specialization, setSpecialization] = useState("")
  const [search, setSearch] = useState("")

  const specializations = [
    "Psychiatrist",
    "Psychologist",
    "Counselor",
    "Clinical Psychologist",
    "Neuropsychologist",
    "Child Psychologist",
  ]

  useEffect(() => {
    fetchTherapists()
  }, [specialization, search])

  const fetchTherapists = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (specialization) params.append("specialization", specialization)
      if (search) params.append("search", search)

      const response = await fetch(`/api/doctors?${params.toString()}`)
      const data = await response.json()
      setDoctors(data.doctors || [])
    } catch (error) {
      console.error("Error fetching therapists:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <input
              type="text"
              placeholder="Search by specialization or keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specialization
            </label>
            <select
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="">All Specializations</option>
              {specializations.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Therapist List */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading therapists...</p>
        </div>
      ) : doctors.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-100">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No therapists found
          </h3>
          <p className="text-gray-600">
            {search || specialization
              ? "Try adjusting your search criteria"
              : "No therapists available at the moment. Please check back later."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-400 to-emerald-400 flex items-center justify-center text-2xl text-white">
                  {doctor.user.name?.charAt(0).toUpperCase() || "👤"}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {doctor.user.name || "Dr. Anonymous"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {doctor.specialization || "Therapist"}
                  </p>
                </div>
              </div>

              {doctor.experience && (
                <p className="text-sm text-gray-600 mb-2">
                  {doctor.experience} years of experience
                </p>
              )}

              {doctor.bio && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {doctor.bio}
                </p>
              )}

              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    ₹{doctor.consultationFee}
                  </p>
                  <p className="text-xs text-gray-600">per session</p>
                </div>
                {doctor.availability?.isAvailable === false && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    Not accepting
                  </span>
                )}
              </div>

              <Link
                href={`/patient/therapists/${doctor.id}`}
                className="block w-full text-center bg-gradient-to-r from-teal-500 to-emerald-500 text-white py-2 px-4 rounded-lg font-medium hover:from-teal-600 hover:to-emerald-600 transition-all"
              >
                View Profile & Book
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

