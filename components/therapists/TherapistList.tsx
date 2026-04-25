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
          <div className="max-w-xl z-10">
            <h1 className="text-[42px] font-extrabold text-[#0f172a] leading-[1.1] tracking-tight mb-3">
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

      {/* 2. Search & Filter Bar */}
      <div className="mb-8 relative max-w-3xl">
        <div className="bg-white rounded-full p-1.5 flex items-center shadow-lg shadow-orange-100/30 border border-gray-100 ring-4 ring-orange-50/50">
           <div className="pl-6 flex items-center gap-3 flex-1">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
              <input 
                type="text" 
                placeholder="Where are you finding help?" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent border-none outline-none text-[16px] font-medium text-gray-700 placeholder-gray-400 w-full"
              />
           </div>
           <button className="p-3.5 hover:bg-gray-50 rounded-full transition-colors">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
           </button>
        </div>
      </div>

      {/* 3. Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-6 mb-10 scrollbar-hide">
         <button 
           onClick={() => setSpecialization("")}
           className={`px-4 py-2.5 rounded-full font-bold text-[12px] whitespace-nowrap transition-all shadow-sm ${specialization === "" ? "bg-orange-500 text-white shadow-orange-100" : "bg-white border border-gray-100 text-gray-600 hover:bg-gray-50"}`}
         >
            All Therapists (320)
         </button>
         {specializations.map((spec) => (
            <button 
              key={spec.name}
              onClick={() => setSpecialization(spec.name)}
              className={`px-4 py-2.5 rounded-full font-bold text-[12px] whitespace-nowrap transition-all flex items-center gap-2 border ${specialization === spec.name ? "bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-100" : "bg-white border-gray-100 text-gray-600 hover:bg-gray-50 shadow-sm"}`}
            >
               <span className="text-sm">{spec.icon}</span>
               {spec.name}
            </button>
         ))}
      </div>

      {/* 4. Therapist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
         {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-[320px] bg-gray-50 rounded-[32px] animate-pulse"></div>
            ))
         ) : doctors.map((doctor: Doctor) => (
            <div key={doctor.id} className="bg-white rounded-[32px] p-8 shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col group relative hover:shadow-xl transition-all duration-300">
               {/* Favorite Heart */}
               <button className="absolute top-8 right-8 text-gray-300 hover:text-red-400 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
               </button>

               <div className="flex items-start gap-5 mb-6">
                  <div className="relative w-[72px] h-[72px] shrink-0">
                     <Image 
                       src={doctor.profilePhoto || doctor.user.image || "/images/promo_doctor.png"} 
                       alt={doctor.user.name || ""} 
                       fill 
                       className="object-cover rounded-full shadow-md" 
                     />
                  </div>
                  <div>
                     <h3 className="text-[22px] font-black text-gray-900 tracking-tight leading-tight mb-1">{doctor.user.name}.</h3>
                     <p className="text-[14px] font-bold text-gray-400 mb-2">{doctor.primarySpecialization || "Therapist"}</p>
                     <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 24 24"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                        <span className="text-[13px] font-black text-gray-800">4.8</span>
                        <span className="text-[11px] font-bold text-gray-300">(124 reviews)</span>
                     </div>
                  </div>
                  <div className="ml-auto text-right">
                     <div className="text-[22px] font-black text-gray-900 tracking-tighter">Rs. {doctor.consultationFee || 2300}</div>
                     <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">per session</p>
                  </div>
               </div>

               <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2 text-[12px] font-bold text-gray-700">
                     <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                     Available this week
                  </div>
                  <div className="flex items-center gap-2 text-[12px] font-bold text-gray-700">
                     <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                     Online sessions
                  </div>
               </div>

               <div className="flex flex-wrap gap-2 mb-8">
                  {["Anxiety", "Depression", "Stress", "Sleep Issues"].map(tag => (
                     <span key={tag} className="px-4 py-1.5 bg-gray-50 rounded-full text-[11px] font-bold text-gray-500 border border-gray-100">{tag}</span>
                  ))}
               </div>

               <div className="mt-auto grid grid-cols-2 gap-4">
                  <button className="py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl font-black text-[13px] shadow-lg shadow-orange-100 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2">
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
                     Book Session
                  </button>
                  <Link href={`/patient/therapists/${doctor.id}`} className="py-4 bg-white border border-gray-100 text-gray-600 rounded-2xl font-black text-[13px] shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                     View Profile
                  </Link>
               </div>
            </div>
         ))}
      </div>

      {/* 5. Bottom Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-16 border-t border-gray-50">
         <div className="flex flex-col items-center text-center p-8 bg-gray-50/50 rounded-[32px] border border-white">
            <div className="w-16 h-16 bg-orange-100 rounded-[20px] flex items-center justify-center mb-6 shadow-sm shadow-orange-200">
               <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            </div>
            <h4 className="text-lg font-black text-gray-900 mb-2">Verified Professionals</h4>
            <p className="text-[13px] font-bold text-gray-400 leading-relaxed">All therapists are verified and experienced</p>
         </div>

         <div className="flex flex-col items-center text-center p-8 bg-gray-50/50 rounded-[32px] border border-white">
            <div className="w-16 h-16 bg-purple-100 rounded-[20px] flex items-center justify-center mb-6 shadow-sm shadow-purple-200">
               <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
            </div>
            <h4 className="text-lg font-black text-gray-900 mb-2">100% Confidential</h4>
            <p className="text-[13px] font-bold text-gray-400 leading-relaxed">Your privacy and trust are our top priority</p>
         </div>

         <div className="flex flex-col items-center text-center p-8 bg-gray-50/50 rounded-[32px] border border-white">
            <div className="w-16 h-16 bg-green-100 rounded-[20px] flex items-center justify-center mb-6 shadow-sm shadow-green-200">
               <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m11-18a4 4 0 11-8 0 4 4 0 018 0zM12 7l1 2h3l-2.5 2 1 3-2.5-2-2.5 2 1-3L6 9h3l1-2z"/></svg>
            </div>
            <h4 className="text-lg font-black text-gray-900 mb-2">300+ Experts</h4>
            <p className="text-[13px] font-bold text-gray-400 leading-relaxed">Wide range of specialists to support you</p>
         </div>
      </div>
    </div>
  )
}
