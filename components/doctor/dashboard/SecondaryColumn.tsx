"use client"

import Link from "next/link"

export default function SecondaryColumn() {
    return (
        <div className="hidden lg:flex flex-col w-[280px] bg-[#eef6f5] border-r border-[#d8e7e6] h-full overflow-y-auto px-6 py-10 relative">
            <div className="text-center mb-8 relative z-10">
                <div className="mx-auto w-16 h-16 rounded-full bg-[#c9e4e1] mb-4 overflow-hidden border-2 border-white shadow-sm flex items-center justify-center">
                    <div className="w-12 h-12 bg-teal-500 rounded-full shrink-0 flex items-center justify-center text-white">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    </div>
                </div>
                <h2 className="text-lg font-bold text-gray-800 tracking-tight">Practice Overview</h2>
                <p className="text-sm text-gray-500 mt-2 font-medium">
                    Manage docs, view pending verifications, and set your schedule.
                </p>
                <Link
                    href="/doctor/profile"
                    className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-[#52938e] px-4 py-3 text-sm font-bold text-white shadow-md hover:bg-[#437a76] transition-colors"
                >
                    Update Profile
                </Link>
            </div>

            <div className="mt-auto relative z-10 w-full flex-1">
                {/* Simplified Vector Illustration placeholder */}
                <div className="w-full aspect-[4/5] bg-gradient-to-b from-[#eef6f5] to-transparent rounded-2xl relative mt-4">
                    {/* Abstract Clipboard & Stethoscope */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-40 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col p-4">
                        <div className="w-1/2 h-2 bg-gray-200 rounded-full mb-3 mx-auto"></div>
                        <div className="w-full h-2 bg-gray-100 rounded-full mb-2"></div>
                        <div className="w-3/4 h-2 bg-gray-100 rounded-full mb-2"></div>
                        <div className="w-5/6 h-2 bg-gray-100 rounded-full mb-2"></div>

                        <div className="mt-auto w-full h-12 bg-teal-50 rounded-lg flex items-center justify-center">
                            <div className="w-4 h-4 rounded-full border-2 border-teal-400"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative Leaves */}
            <div className="absolute top-0 right-0 w-16 h-32 opacity-80 pointer-events-none overflow-hidden">
                <div className="w-8 h-8 rounded-br-full bg-teal-600/20 absolute top-2 right-4" />
                <div className="w-6 h-6 rounded-br-full bg-teal-600/30 absolute top-8 right-2" />
                <div className="w-10 h-10 rounded-br-full bg-teal-600/10 absolute top-0 right-8" />
            </div>
        </div>
    )
}
