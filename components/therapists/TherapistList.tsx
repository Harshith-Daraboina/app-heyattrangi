"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"

interface Doctor {
  id: string
  specialization: string | null
  primarySpecialization: string | null
  secondarySpecializations: string[]
  experience: number | null
  yearsOfExperience: number | null
  consultationFee: number
  bio: string | null
  profilePhoto: string | null
  languagesSpoken: string[]
  consultationTypes: string[]
  preferredAgeGroups: string[]
  city: string | null
  user: {
    name: string | null
    email: string | null
    image: string | null
  }
  availability: {
    isAvailable: boolean
  } | null
}

const CARD_GRADIENTS = [
  "from-orange-200 via-amber-200 to-orange-100",
  "from-sky-200 via-blue-200 to-cyan-100",
  "from-emerald-200 via-teal-200 to-green-100",
  "from-violet-200 via-purple-200 to-fuchsia-100",
  "from-rose-200 via-pink-200 to-orange-100",
  "from-indigo-200 via-blue-200 to-slate-100",
]

function displayName(d: Doctor): string {
  return d.user.name?.trim() || "Dr. Professional"
}

function roleLabel(d: Doctor): string {
  const spec = d.primarySpecialization || d.specialization
  if (!spec) return "Therapist"
  if (/psychiat/i.test(spec)) return "Psychiatrist"
  if (/counsel/i.test(spec)) return "Counsellor"
  if (/psycholog/i.test(spec)) return "Psychologist"
  return spec.split(/[,\n]/)[0]?.trim() || "Therapist"
}

function focusAreas(d: Doctor): string {
  const sec = d.secondarySpecializations?.filter(Boolean) ?? []
  if (sec.length > 0) return sec.slice(0, 3).join(", ")
  const primary = d.primarySpecialization || d.specialization
  if (primary) {
    const parts = primary.split(",").map((s) => s.trim()).filter(Boolean)
    if (parts.length > 1) return parts.slice(1, 4).join(", ")
  }
  return "Mental health support"
}

function yearsExp(d: Doctor): number | null {
  const y = d.yearsOfExperience ?? d.experience
  return typeof y === "number" && y > 0 ? y : null
}

function photoSrc(d: Doctor): string | null {
  const p = d.profilePhoto?.trim()
  const u = d.user.image?.trim()
  return p || u || null
}

function bioExcerpt(bio: string | null, max = 220): string | null {
  if (!bio?.trim()) return null
  const t = bio.replace(/\s+/g, " ").trim()
  if (t.length <= max) return t
  return `${t.slice(0, max).trim()}…`
}

function DetailChips({ label, items }: { label: string; items: string[] }) {
  const list = items.filter(Boolean).slice(0, 8)
  if (list.length === 0) return null
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
        {label}
      </p>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {list.map((x) => (
          <span
            key={x}
            className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-2.5 py-0.5 text-xs text-[var(--color-text-secondary)]"
          >
            {x}
          </span>
        ))}
      </div>
    </div>
  )
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

  const fetchTherapists = useCallback(async () => {
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
  }, [specialization, search])

  useEffect(() => {
    void fetchTherapists()
  }, [fetchTherapists])

  const filterClass =
    "w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-[var(--color-text-primary)] focus:border-[var(--color-brand)] focus:outline-none"

  return (
    <div>
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1
            className="font-semibold text-[var(--color-text-primary)]"
            style={{ fontSize: "var(--text-2xl)" }}
          >
            Our therapists
          </h1>
          <p
            className="mt-1 text-[var(--color-text-secondary)]"
            style={{ fontSize: "var(--text-sm)" }}
          >
            Curated for you — verified professionals on Attrangi
          </p>
        </div>
        <Link
          href="/patient/dashboard"
          className="text-sm font-semibold text-[var(--color-brand)] transition-opacity hover:opacity-90"
        >
          View dashboard
        </Link>
      </div>

      <div
        className="mb-8 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
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
              placeholder="Name, focus area, or keywords…"
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
              <option value="">All specializations</option>
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
        <div className="py-16 text-center">
          <p className="text-[var(--color-text-secondary)]" style={{ fontSize: "var(--text-sm)" }}>
            Loading therapists…
          </p>
        </div>
      ) : doctors.length === 0 ? (
        <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-14 text-center shadow-sm">
          <h3
            className="mb-2 font-semibold text-[var(--color-text-primary)]"
            style={{ fontSize: "var(--text-lg)" }}
          >
            {search || specialization ? "Let’s try another search" : "More therapists are on the way"}
          </h3>
          <p className="text-[var(--color-text-secondary)]" style={{ fontSize: "var(--text-sm)" }}>
            {search || specialization
              ? "Adjust your keywords or filters to see more professionals."
              : "Check back soon — we’re growing our network."}
          </p>
        </div>
      ) : (
        <ul className="flex list-none flex-col gap-6 p-0">
          {doctors.map((doctor, index) => {
            const name = displayName(doctor)
            const role = roleLabel(doctor)
            const areas = focusAreas(doctor)
            const exp = yearsExp(doctor)
            const available = doctor.availability?.isAvailable !== false
            const src = photoSrc(doctor)
            const gradient = CARD_GRADIENTS[index % CARD_GRADIENTS.length]
            const fee = Math.round(doctor.consultationFee || 0)
            const excerpt = bioExcerpt(doctor.bio)
            const langs = doctor.languagesSpoken ?? []
            const modes = doctor.consultationTypes ?? []
            const ages = doctor.preferredAgeGroups ?? []
            const city = doctor.city?.trim()

            return (
              <li
                key={doctor.id}
                className="flex flex-col gap-5 overflow-hidden rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-[box-shadow] duration-300 hover:shadow-[0_10px_28px_rgba(0,0,0,0.08)] sm:p-6 md:flex-row md:items-stretch md:gap-8"
              >
                <div className="relative mx-auto flex h-[min(52vw,280px)] w-full max-w-[320px] shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] md:mx-0 md:h-[min(72vh,360px)] md:w-64 md:max-w-none lg:w-72">
                  {src ? (
                    <Image
                      src={src}
                      alt={name}
                      fill
                      className="object-contain p-3"
                      sizes="(max-width: 768px) 90vw, 288px"
                      unoptimized
                    />
                  ) : (
                    <div
                      className={`flex h-full min-h-[200px] w-full items-center justify-center bg-gradient-to-br ${gradient}`}
                      aria-hidden
                    >
                      <span className="text-5xl font-bold text-white/85 drop-shadow-sm">
                        {name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="mb-2 flex flex-wrap items-center gap-1.5 text-[13px] text-[var(--color-text-secondary)]">
                    <span className="text-amber-500" aria-hidden>
                      ★
                    </span>
                    <span>
                      {exp !== null ? (
                        <>
                          Verified · {exp} {exp === 1 ? "yr" : "yrs"} experience
                        </>
                      ) : (
                        <>Verified on Attrangi</>
                      )}
                    </span>
                    {city ? (
                      <>
                        <span className="text-[var(--color-text-muted)]" aria-hidden>
                          ·
                        </span>
                        <span>{city}</span>
                      </>
                    ) : null}
                  </div>

                  <h2 className="text-xl font-bold leading-tight text-[var(--color-text-primary)]">
                    {name}
                  </h2>
                  <p className="mt-1 text-sm font-medium leading-snug text-[var(--color-text-secondary)]">
                    {role} · {areas}
                  </p>

                  <div className="mt-4 space-y-3">
                    <DetailChips label="Languages" items={langs} />
                    <DetailChips label="Session types" items={modes} />
                    <DetailChips label="Age groups" items={ages} />
                  </div>

                  {excerpt ? (
                    <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                      {excerpt}
                    </p>
                  ) : null}

                  <div className="mt-6 flex flex-col gap-4 border-t border-[var(--color-border)] pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-lg font-bold text-[var(--color-text-primary)]">
                      ₹{fee.toLocaleString("en-IN")} / session
                    </p>
                    <div className="shrink-0 sm:min-w-[160px]">
                      {available ? (
                        <Link
                          href={`/patient/therapists/${doctor.id}`}
                          className="flex w-full items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-brand)] px-8 py-3 text-center text-sm font-semibold text-white shadow-[0_6px_20px_rgba(232,114,42,0.35)] transition-all duration-300 hover:bg-[var(--color-brand-dark)] hover:opacity-[0.98] sm:w-auto"
                        >
                          Book now
                        </Link>
                      ) : (
                        <span className="flex w-full items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] py-3 text-sm font-medium text-[var(--color-text-muted)]">
                          Currently unavailable
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
