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

const cardHover =
  "transition-[border-color,box-shadow] hover:border-[var(--color-brand)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)]"

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

  const filterClass =
    "w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-[var(--color-text-primary)] focus:border-[var(--color-brand)] focus:outline-none"

  return (
    <div>
      <div
        className="mb-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label
              className="mb-2 block font-medium text-[var(--color-text-primary)]"
              style={{ fontSize: "var(--text-sm)" }}
            >
              Search
            </label>
            <input
              type="text"
              placeholder="Search by specialization or keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={filterClass}
              style={{ fontSize: "var(--text-sm)" }}
            />
          </div>
          <div>
            <label
              className="mb-2 block font-medium text-[var(--color-text-primary)]"
              style={{ fontSize: "var(--text-sm)" }}
            >
              Specialization
            </label>
            <select
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className={filterClass}
              style={{ fontSize: "var(--text-sm)" }}
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

      {loading ? (
        <div className="py-12 text-center">
          <p className="text-[var(--color-text-secondary)]" style={{ fontSize: "var(--text-sm)" }}>
            Loading therapists...
          </p>
        </div>
      ) : doctors.length === 0 ? (
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-12 text-center">
          <h3
            className="mb-2 font-semibold text-[var(--color-text-primary)]"
            style={{ fontSize: "var(--text-lg)" }}
          >
            {search || specialization ? "Let's try another search" : "More therapists are on the way"}
          </h3>
          <p className="text-[var(--color-text-secondary)]" style={{ fontSize: "var(--text-sm)" }}>
            {search || specialization
              ? "Adjust your keywords or filters to see more professionals."
              : "Check back soon — we're growing our network. You can also try again later."}
          </p>
        </div>
      ) : (
        <ul className="flex list-none flex-col gap-4 p-0">
          {doctors.map((doctor) => {
            const name = doctor.user.name || "Dr. Anonymous"
            const specialty = doctor.specialization || "Therapist"
            const initial = name.charAt(0).toUpperCase()
            const available = doctor.availability?.isAvailable !== false

            return (
              <li
                key={doctor.id}
                className={`border border-[var(--color-border)] bg-[var(--color-surface)] ${cardHover}`}
                style={{
                  borderRadius: "var(--radius-lg)",
                  padding: "20px",
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-[var(--color-brand-light)]">
                    {doctor.user.image ? (
                      <Image
                        src={doctor.user.image}
                        alt={name}
                        width={48}
                        height={48}
                        className="h-full w-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <span
                        className="flex h-full w-full items-center justify-center font-semibold text-[var(--color-brand)]"
                        style={{ fontSize: "var(--text-lg)" }}
                        aria-hidden
                      >
                        {initial}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1 text-left">
                    <p
                      className="truncate font-semibold text-[var(--color-text-primary)]"
                      style={{ fontSize: "var(--text-base)" }}
                    >
                      {name}
                    </p>
                    <p
                      className="truncate text-[var(--color-text-secondary)]"
                      style={{ fontSize: "var(--text-sm)" }}
                    >
                      {specialty}
                    </p>
                  </div>

                  {available ? (
                    <Link
                      href={`/patient/therapists/${doctor.id}`}
                      className="inline-flex shrink-0 items-center justify-center font-medium text-white transition-opacity hover:opacity-95"
                      style={{
                        background: "var(--color-brand)",
                        borderRadius: "var(--radius-sm)",
                        padding: "8px 18px",
                        fontSize: "var(--text-sm)",
                        fontWeight: 500,
                      }}
                    >
                      Book
                    </Link>
                  ) : (
                    <span
                      className="shrink-0 rounded-full border border-[var(--color-border)] px-3 py-1 text-[var(--color-text-muted)]"
                      style={{ fontSize: "var(--text-xs)" }}
                    >
                      Unavailable
                    </span>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
