"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

interface PatientRecord {
  patient: any
  totalAppointments: number
  lastAppointment: Date
}

export default function CaseStudiesList({ patients }: { patients: PatientRecord[] }) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPatients = patients.filter(({ patient }) => {
    const name = patient.user?.name?.toLowerCase() || "unknown patient"
    const concerns = patient.healthConcerns?.join(" ").toLowerCase() || ""
    const query = searchQuery.toLowerCase()
    return name.includes(query) || concerns.includes(query)
  })

  if (patients.length === 0) {
    return (
      <div className="flex-1 p-8 bg-[#f8fafc] flex flex-col items-center justify-center min-h-[calc(100vh-2rem)]">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Patients Yet</h2>
          <p className="text-gray-500">When you attend to appointments, your patients will automatically appear here as case studies.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 p-8 bg-[#f8fafc] overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Case Studies</h1>
            <p className="text-gray-500 mt-1">Review profiles and histories of the patients you have attended to.</p>
          </div>
          
          <div className="relative w-full md:w-80 shrink-0">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              type="text" 
              placeholder="Search patients or concerns..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
            />
          </div>
        </div>

        {filteredPatients.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-gray-100 text-center shadow-sm">
            <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No patients found</h3>
            <p className="text-gray-500">We couldn't find any patients matching "{searchQuery}"</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPatients.map(({ patient, totalAppointments, lastAppointment }) => (
            <div key={patient.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gray-100 rounded-2xl overflow-hidden relative border border-gray-200">
                    {patient.user?.image ? (
                      <Image src={patient.user.image} alt={patient.user.name || "Patient"} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-600 font-bold text-lg">
                        {patient.user?.name ? patient.user.name.charAt(0).toUpperCase() : "P"}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-blue-600 transition-colors">
                      {patient.user?.name || "Unknown Patient"}
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {patient.age ? `${patient.age} yrs` : "Age Unknown"} • {patient.gender || "Gender Unspecified"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 mb-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Sessions</p>
                  <p className="text-xl font-bold text-gray-900">{totalAppointments}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Last Seen</p>
                  <p className="text-sm font-bold text-gray-900 mt-1">
                    {new Date(lastAppointment).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
              </div>

              {patient.healthConcerns && patient.healthConcerns.length > 0 && (
                <div className="mb-5">
                  <div className="flex flex-wrap gap-2">
                    {patient.healthConcerns.slice(0, 3).map((concern: string, i: number) => (
                      <span key={i} className="px-2.5 py-1 bg-amber-50 text-amber-700 text-[10px] font-bold rounded-lg uppercase tracking-wider">
                        {concern}
                      </span>
                    ))}
                    {patient.healthConcerns.length > 3 && (
                      <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-lg">
                        +{patient.healthConcerns.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              <button className="w-full py-2.5 bg-white border-2 border-gray-100 text-gray-700 hover:text-blue-600 hover:border-blue-100 hover:bg-blue-50 rounded-xl text-sm font-bold transition-all">
                View Case Details &rarr;
              </button>
            </div>
          ))}
        </div>
        )}
      </div>
    </div>
  )
}
