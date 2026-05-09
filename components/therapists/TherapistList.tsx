"use client"

import { useState } from "react"
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

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function TherapistList() {
  const [specialization, setSpecialization] = useState("")
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 500)

  const specializations = [
    { name: "Psychiatrist", icon: "🩺" },
    { name: "Psychologist", icon: "🧠" },
    { name: "Counselor", icon: "🤝" },
    { name: "Clinical Psychologist", icon: "🛡️" },
    { name: "Neuropsychologist", icon: "🧬" },
    { name: "Child Psychologist", icon: "🧸" },
  ]

  const { data, isLoading } = useSWR(
    `/api/doctors?${new URLSearchParams({
      ...(specialization && { specialization }),
      ...(debouncedSearch && { search: debouncedSearch }),
    }).toString()}`,
    fetcher
  )

  const doctors = data?.doctors || []

  return (
    <div className="max-w-[1200px] mx-auto pb-20 px-4 sm:px-6">
      
      {/* 1. Header Section */}
      <div className="pt-8 mb-12">
        {/* Hero Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative px-2">
          <div className="max-w-2xl z-10">
            <h1 className="text-[36px] font-extrabold text-[#0f172a] leading-[1.1] tracking-tight mb-3">
               Find the right therapist for you
            </h1>
            <p className="text-[15px] font-medium text-gray-400">
               Curated for you — verified professionals on Attrangi
            </p>
          </div>

          {/* Illustration Container */}
          <div className="relative hidden lg:block w-[320px] h-[180px] shrink-0">
             <Image 
               src="/images/header.png" 
               alt="Hero Illustration" 
               width={320} 
               height={180} 
               className="object-contain object-right"
               priority
             />
          </div>
        </div>
      </div>


      {/* 4. Therapist Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {isLoading ? (
             Array.from({ length: 6 }).map((_, i) => (
               <div key={i} className="h-[340px] bg-gray-50 rounded-[24px] animate-pulse"></div>
             ))
          ) : doctors.map((doctor: Doctor) => (
              <div key={doctor.id} className="bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col group relative transition-all duration-300 w-full hover:shadow-md min-h-[350px]">
                 <div className="flex items-start justify-between mb-4 gap-4">
                    <div className="flex items-start gap-4">
                       <div className="relative w-20 h-20 shrink-0 bg-gray-100 rounded-[20px] overflow-hidden border border-gray-100 flex items-center justify-center">
                          {doctor.profilePhoto || doctor.user.image ? (
                             <Image 
                               src={doctor.profilePhoto || doctor.user.image || "/images/promo_doctor.png"} 
                               alt={doctor.user.name || "Therapist"} 
                               fill 
                               className="object-cover" 
                             />
                          ) : (
                             <span className="text-2xl">🧑</span>
                          )}
                       </div>
                       <div className="flex flex-col pt-0.5">
                          <h3 className="text-[20px] font-black text-gray-900 leading-tight mb-0.5">{doctor.user.name}</h3>
                          <p className="text-[13px] font-bold text-gray-400 mb-2">{doctor.primarySpecialization || "Psychiatrist"}</p>
                          <div className="flex flex-col gap-0.5 text-[12px] font-bold text-gray-400/80">
                             <span>{doctor.yearsOfExperience || doctor.experience || 6}+ years of experience</span>
                             <span>Available this week</span>
                          </div>
                       </div>
                    </div>
                    <div className="text-[12px] font-black text-orange-600 bg-orange-50/60 px-2.5 py-1 rounded-full shrink-0">
                       45 mins session
                    </div>
                 </div>

                 <div className="flex flex-wrap gap-1.5 mb-5">
                    {["Anxiety", "Depression", "Stress", "Sleep Issues"].map(tag => (
                       <span key={tag} className="px-3 py-1 bg-gray-50/70 border border-gray-100/60 rounded-full text-[11px] font-bold text-gray-500">
                          {tag}
                       </span>
                    ))}
                 </div>

                 <div className="mt-auto">
                    <Link href={`/patient/therapists/${doctor.id}`} className="py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-black text-[13px] shadow-sm hover:scale-[1.01] transition-all flex items-center justify-center select-none w-full">
                       View Profile
                    </Link>
                 </div>
              </div>
          ))}
       </div>

    </div>
  )
}
