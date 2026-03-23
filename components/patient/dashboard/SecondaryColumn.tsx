"use client"

import Link from "next/link"

const ClipboardHeartIcon = ({ className }: { className?: string }) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Z" />
        <path d="M11.9 16.5A4.5 4.5 0 0 0 16 12a4.5 4.5 0 0 0-3.5-4.4" />
        <path d="M12 16.5a4.5 4.5 0 0 1-4.1-4.5A4.5 4.5 0 0 1 11.4 7.6" />
        <path d="M12 12v4.5" />
        <path d="m14.5 14-2.5 2.5" />
        <path d="m9.5 14 2.5 2.5" />
    </svg>
)

export default function SecondaryColumn() {
    return (
        <div className="hidden lg:flex flex-col w-[280px] bg-[#eef6f5] border-r border-[#d8e7e6] h-full overflow-y-auto px-6 py-10 relative">
            <div className="text-center mb-8 relative z-10">
                <div className="mx-auto w-16 h-16 rounded-full bg-[#fcd4a6] mb-4 overflow-hidden border-2 border-white shadow-sm flex items-center justify-center">
                    {/* User Avatar Placeholder */}
                    <div className="w-12 h-12 bg-orange-400 rounded-full shrink-0" />
                </div>
                <h2 className="text-lg font-bold text-gray-800 tracking-tight">Check your condition</h2>
                <p className="text-sm text-gray-500 mt-2 font-medium">
                    Check your every situation and your activities
                </p>
                <Link
                    href="/patient/ai-bot/screening"
                    className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-[#98c99f] px-4 py-3 text-sm font-bold text-white shadow-md hover:bg-[#86b88d] transition-colors"
                >
                    Check It Now
                </Link>
            </div>

            <div className="mt-auto relative z-10 w-full flex-1">
                {/* Simplified Vector Illustration placeholder */}
                <div className="w-full aspect-[4/5] bg-gradient-to-b from-[#eef6f5] to-transparent rounded-2xl relative">
                    <div className="absolute top-4 left-4 right-4 h-24 bg-white/60 rounded-xl backdrop-blur-sm border border-white/50 p-3 shadow-sm">
                        <div className="flex gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-400" />
                            <div className="w-2 h-2 rounded-full bg-yellow-400" />
                            <div className="w-2 h-2 rounded-full bg-green-400" />
                        </div>
                        <div className="mt-3 flex gap-2 items-end h-8">
                            <div className="w-3 h-8 rounded-full bg-orange-300" />
                            <div className="w-3 h-6 rounded-full bg-orange-200" />
                            <div className="w-3 h-4 rounded-full bg-orange-100" />
                            <div className="flex-1" />
                            <div className="w-6 h-3 rounded-full bg-green-300" />
                        </div>
                    </div>

                    {/* Abstract doctor & patient drawing */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[180px] h-[220px]">
                        {/* Desk */}
                        <div className="absolute bottom-[20px] w-full h-[60px] bg-[#bfd9d6] rounded-t-sm" />
                        <div className="absolute bottom-[20px] w-full h-[8px] bg-[#9cbdb9]" />

                        {/* Doctor (Left) */}
                        <div className="absolute bottom-[40px] left-[15px] w-[50px] flex flex-col items-center">
                            <div className="w-10 h-10 bg-[#e7c7a7] rounded-full z-10" /> {/* Head */}
                            <div className="w-14 h-24 bg-white rounded-t-[20px] border border-gray-100 shadow-sm" /> {/* Coat */}
                        </div>

                        {/* Patient (Right) */}
                        <div className="absolute bottom-[40px] right-[15px] w-[50px] flex flex-col items-center">
                            <div className="w-10 h-10 bg-[#d4a373] rounded-full z-10" /> {/* Head */}
                            <div className="w-14 h-24 bg-orange-400 rounded-t-[20px]" /> {/* Shirt */}
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative Leaves */}
            <div className="absolute top-0 right-0 w-16 h-32 opacity-80 pointer-events-none overflow-hidden">
                <div className="w-8 h-8 rounded-br-full bg-green-600/20 absolute top-2 right-4" />
                <div className="w-6 h-6 rounded-br-full bg-green-600/30 absolute top-8 right-2" />
                <div className="w-10 h-10 rounded-br-full bg-green-600/10 absolute top-0 right-8" />
            </div>
        </div>
    )
}
