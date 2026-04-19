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
      dedupingInterval: 10000, // Cache for 10 seconds
    }
  )

  const doctors = data?.doctors || []

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
        <ul className="flex list-none flex-col gap-6 p-0">
          {doctors.map((doctor: Doctor, index: number) => {
            const name = displayName(doctor)
            const role = roleLabel(doctor)
            const available = doctor.availability?.isAvailable !== false
            const src = photoSrc(doctor)
            const city = doctor.city?.trim()
            
            // Mock rating logic (usually this comes from DB)
            const ratingNumber = "4.5"
            const reviewCount = "1,258"

            // Helper to generate the exact horizontal mockup
            function getMockSchedule(baseAvailable: boolean) {
              const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
              const dates = [];
              for (let i = 1; i <= 6; i++) {
                 const d = new Date();
                 d.setDate(d.getDate() + i);
                 const dateStr = `${months[d.getMonth()]} ${d.getDate()}`;
                 
                 let isAvailable = baseAvailable;
                 if (i === 3 || i === 6) isAvailable = false; // toggle for variety
                 
                 dates.push({
                    id: i,
                    date: dateStr,
                    isAvailable: isAvailable,
                    isHovered: i === 2 // to exactly mimic the mockup's hovered mid state
                 });
              }
              return dates;
            }
            
            const schedule = getMockSchedule(available);

            return (
              <li
                key={doctor.id}
                className="relative flex flex-col bg-white rounded-[24px] border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-5 md:p-6 transition-transform hover:-translate-y-1 overflow-hidden group"
              >
                <div className="flex gap-5">
                    {/* Avatar */}
                    <div className="w-[72px] h-[72px] shrink-0 rounded-full overflow-hidden border border-gray-100 relative bg-gray-50 mt-1">
                        <Image 
                            src={src || "/images/promo_doctor.png"} 
                            alt={name} 
                            fill 
                            className="object-cover" 
                        />
                    </div>

                    {/* Info */}
                    <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start">
                           <Link href={`/patient/therapists/${doctor.id}`} className="text-[20px] font-bold text-[#1f2937] leading-tight mb-1 cursor-pointer hover:text-blue-600 transition-colors">
                               {name}
                           </Link>
                           <Link href={`/patient/therapists/${doctor.id}`} className="text-gray-400 hover:text-gray-900 transition-colors p-1">
                               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                                   <polyline points="9 18 15 12 9 6" />
                               </svg>
                           </Link>
                        </div>
                        
                        <div className="flex items-center gap-3 text-[14px] text-gray-500 font-medium mb-3">
                            <div className="flex items-center gap-1.5">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] text-gray-400">
                                    <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
                                    <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
                                    <circle cx="20" cy="10" r="2" />
                                </svg>
                                <span>{role}</span>
                            </div>
                            <span className="text-gray-300">•</span>
                            <div className="flex items-center gap-1.5">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] text-gray-400">
                                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                    <circle cx="12" cy="10" r="3" />
                                </svg>
                                <span>{city || 'Remote'}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mb-3.5">
                            <div className="flex gap-[2px] text-[#fbbf24]">
                                {[1,2,3,4,5].map(i => (
                                    <svg key={i} viewBox="0 0 24 24" fill="currentColor" stroke="transparent" className={`w-5 h-5 ${i === 5 ? 'opacity-50' : ''}`}>
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                    </svg>
                                ))}
                            </div>
                            <span className="font-bold text-[#1f2937] text-[15px] ml-1">{ratingNumber}</span>
                            <span className="text-gray-500 text-[14px]">({reviewCount})</span>
                        </div>

                        <div className={`flex items-center gap-2 font-medium text-[14px] ${available ? 'text-[#16a34a]' : 'text-gray-400'}`}>
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                            </svg>
                            <span>{available ? "Available" : "Unavailable"} {doctor.consultationTypes.includes('Video') ? "Remotely" : ""}</span>
                        </div>
                    </div>
                </div>

                {/* Calendar / Schedule Scroll row */}
                <div className="mt-7 flex gap-3 overflow-x-auto pb-2 -mx-2 px-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {schedule.map(slot => (
                        <div 
                            key={slot.id} 
                            className={`shrink-0 flex flex-col justify-center px-4 py-2.5 rounded-[16px] border min-w-[110px] cursor-pointer transition-colors
                                ${slot.isHovered ? 'bg-[#dcfce7] border-[#22c55e] text-[#15803d]' 
                                : slot.isAvailable ? 'bg-[#f0fdf4] border-[#bbf7d0] text-[#16a34a] hover:bg-[#dcfce7] hover:border-[#22c55e]' 
                                : 'bg-[#f8fafc] border-transparent text-gray-400'}
                            `}
                        >
                            <span className="font-medium text-[14px] leading-tight mb-0.5">{slot.date}</span>
                            <span className="text-[14px] leading-tight">{slot.isAvailable ? 'Available' : 'Unavailable'}</span>
                        </div>
                    ))}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
