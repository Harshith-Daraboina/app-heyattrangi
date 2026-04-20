"use client"

import { useCallback, useEffect, useState, useMemo } from "react"
import useSWR from "swr"
import { useDebounce } from "@/lib/hooks/useDebounce"
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

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function TherapistList() {
  const [specialization, setSpecialization] = useState("")
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 500)

  const specializations = [
    "Psychiatrist",
    "Psychologist",
    "Counselor",
    "Clinical Psychologist",
    "Neuropsychologist",
    "Child Psychologist",
  ]

  const { data, error, isLoading } = useSWR(
    `/api/doctors?${new URLSearchParams({
      ...(specialization && { specialization }),
      ...(debouncedSearch && { search: debouncedSearch }),
    }).toString()}`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 10000,
    }
  )

  const doctors = data?.doctors || []

  return (
    <div className="max-w-[1000px] mx-auto pb-10">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between px-2">
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

      <div className="mb-4 rounded-[20px] bg-[#fdfaf2] border border-[#f3eede] p-4 flex items-center gap-3">
        <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="w-6 h-6 text-gray-500 shrink-0 ml-1">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="text"
          placeholder="Where are you finding help?"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent border-none outline-none flex-1 text-[16px] text-gray-800 placeholder-gray-500 font-medium"
        />
        <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="w-5 h-5 text-gray-500 shrink-0 cursor-pointer mr-2">
          <path d="M4 21v-7m0-4V3m8 18v-9m0-4V3m8 18v-5m0-4V3M1 14h6m2-6h6m2 8h6" />
        </svg>
      </div>

      <div className="flex gap-2.5 overflow-x-auto pb-4 mb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-1">
         <button onClick={() => setSpecialization("")} className={`px-5 py-2.5 rounded-full font-bold text-[13px] whitespace-nowrap transition-colors border ${specialization === "" ? "bg-[#0a0a0a] text-white border-[#0a0a0a]" : "bg-[#fcfbf9] border-gray-200 text-gray-700 hover:bg-gray-50"}`}>All Therapists (320)</button>
         {specializations.map(spec => (
            <button key={spec} onClick={() => setSpecialization(spec)} className={`px-5 py-2.5 rounded-full font-bold text-[13px] whitespace-nowrap transition-colors border ${specialization === spec ? "bg-[#0a0a0a] text-white border-[#0a0a0a]" : "bg-[#fcfbf9] border-gray-200 text-gray-700 hover:bg-gray-50"}`}>{spec}</button>
         ))}
      </div>

      {isLoading ? (
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {doctors.map((doctor: Doctor, index: number) => {
             const name = displayName(doctor)
             const role = roleLabel(doctor)
             const available = doctor.availability?.isAvailable !== false
             const src = photoSrc(doctor)
             
             const ratingNumber = "4.8"
             const fee = doctor.consultationFee || 150

             return (
              <div
                key={doctor.id}
                className="flex flex-col bg-white rounded-[24px] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-gray-100 transition-transform hover:-translate-y-1"
              >
                  <div className="flex-1 w-full flex flex-col">
                      <div className="flex justify-between items-start mb-5">
                          <div className="flex items-center gap-3">
                             <div className="w-[50px] h-[50px] shrink-0 rounded-full overflow-hidden border border-gray-100 relative bg-gray-50">
                                 <Image src={src || "/images/promo_doctor.png"} alt={name} fill className="object-cover" />
                             </div>
                             <div>
                                 <h3 className="font-medium text-gray-900 leading-tight tracking-tight text-xl">{name}</h3>
                                 <p className="text-gray-500 text-[14px] font-medium">{role}</p>
                             </div>
                          </div>
                          
                          <div className="text-right">
                              <div className="font-medium text-gray-900 text-xl">Rs. {fee}</div>
                              <div className="text-[12px] font-semibold text-gray-500 mt-1 whitespace-nowrap">per session</div>
                          </div>
                      </div>

                      <div className="flex items-center gap-3 mb-4">
                          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-gray-200 text-gray-700 text-[12px] font-bold">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[15px] h-[15px]">
                                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                  <line x1="16" y1="2" x2="16" y2="6" />
                                  <line x1="8" y1="2" x2="8" y2="6" />
                                  <line x1="3" y1="10" x2="21" y2="10" />
                              </svg>
                              {available ? "This week" : "Coming soon"}
                          </div>
                          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-gray-200 text-gray-700 text-[12px] font-bold">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[15px] h-[15px]">
                                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                              </svg>
                              {ratingNumber}
                          </div>
                      </div>

                      <p className="text-gray-800 text-[13px] leading-relaxed font-medium mb-5 opacity-80 min-h-[60px]">
                          {doctor.bio ? bioExcerpt(doctor.bio, 120) : "Passionate mental health professional offering personalized counseling and support. Dedicated to fostering a safe space for growth."}
                      </p>

                      <div className="mt-auto">
                          <Link href={`/patient/therapists/${doctor.id}`} className="w-full inline-block text-center py-3 rounded-xl bg-[var(--color-brand)] text-white text-[13px] font-bold transition-all hover:scale-[1.02] hover:opacity-95 shadow-md shadow-orange-100/50 hover:shadow-lg">
                              View Profile
                          </Link>
                      </div>
                  </div>
              </div>
             )
          })}
        </div>
      )}
    </div>
  )
}
