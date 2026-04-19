"use client"

import { useState, useEffect } from "react"

export default function DailyRewardPopup() {
    const [isOpen, setIsOpen] = useState(false)
    const [isClaimed, setIsClaimed] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        // Only show once per day
        const today = new Date().toISOString().split('T')[0]
        const hasSeen = localStorage.getItem(`daily_reward_modal_${today}`)
        
        if (!hasSeen) {
            // slight delay so it pops up cleanly after dashboard hydration
            const timer = setTimeout(() => setIsOpen(true), 1200)
            return () => clearTimeout(timer)
        }
    }, [])

    const closeAndRemember = () => {
        setIsOpen(false)
        const today = new Date().toISOString().split('T')[0]
        localStorage.setItem(`daily_reward_modal_${today}`, "true")
    }

    const handleClaim = async () => {
        setIsLoading(true)
        try {
            await fetch("/api/patient/credits/earn", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ actionType: "daily_login_bonus" })
            })
            
            setIsClaimed(true)
            const today = new Date().toISOString().split('T')[0]
            localStorage.setItem(`daily_reward_modal_${today}`, "true")
            
            // Auto close after celebrating
            setTimeout(() => {
                setIsOpen(false)
            }, 2500)
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-[#3a1b5c]/40 backdrop-blur-md animate-in fade-in duration-500"
                onClick={closeAndRemember}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg bg-[#2d1b4e] rounded-[32px] p-6 shadow-2xl border border-white/10 animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 overflow-hidden flex flex-col items-center">
                
                <button 
                    onClick={closeAndRemember}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                >
                    ✕
                </button>

                <div className="text-center mb-8 mt-2 w-full">
                    <h2 className="text-2xl font-extrabold text-white mb-2 tracking-tight">Daily Rewards</h2>
                    <p className="text-white/60 text-sm font-medium">Try your luck and win daily care credits to maximize your wellness journey!</p>
                </div>

                <div className="flex justify-center items-end gap-3 md:gap-4 w-full h-[220px] mb-8 relative">
                    
                    {/* Left Card */}
                    <div className="w-[110px] md:w-[130px] h-[160px] rounded-3xl bg-gradient-to-b from-[#4ca1af] to-[#2c3e50] p-4 flex flex-col items-center justify-end shadow-2xl relative translate-y-3 opacity-90 transition-transform">
                        <div className="absolute -top-10 text-6xl drop-shadow-xl saturate-150">🎁</div>
                        <h4 className="text-white font-bold text-[11px] md:text-xs text-center leading-tight mb-3">Care Credits<br/>unlocked</h4>
                        <button disabled className="w-full py-2 rounded-xl bg-white/20 text-white text-[10px] font-bold">Claimed</button>
                    </div>

                    {/* Center Premium Card */}
                    <div className={`w-[130px] md:w-[150px] h-[200px] rounded-[32px] bg-gradient-to-b from-[#8e2de2] to-[#4a00e0] p-4 flex flex-col items-center justify-end shadow-[0_20px_50px_rgba(142,45,226,0.3)] relative z-10 transition-transform duration-500 ${isClaimed ? 'scale-105 shadow-[0_0_80px_rgba(142,45,226,0.6)]' : 'hover:-translate-y-2'}`}>
                        <div className="absolute -top-12 text-[80px] drop-shadow-2xl z-20">✨</div>
                        <div className="absolute top-8 w-full flex justify-between px-2 opacity-50">
                            <span className="text-xs">🌿</span>
                            <span className="text-xs">🌿</span>
                        </div>
                        <h4 className="text-white font-extrabold text-sm text-center leading-tight mb-4">Care Credits<br/>unlocked</h4>
                        <button 
                            onClick={handleClaim}
                            disabled={isClaimed || isLoading}
                            className={`w-full py-3 rounded-2xl font-extrabold text-[12px] md:text-sm tracking-wide transition-all shadow-xl ${isClaimed ? 'bg-[#10b981] text-white' : 'bg-white text-[#4a00e0] hover:scale-105 active:scale-95'}`}
                        >
                            {isLoading ? '...' : isClaimed ? 'Claimed! ✓' : 'Claim Reward'}
                        </button>
                    </div>

                    {/* Right Card */}
                    <div className="w-[110px] md:w-[130px] h-[160px] rounded-3xl bg-gradient-to-b from-[#dd5e89] to-[#f7bb97] p-4 flex flex-col items-center justify-end shadow-2xl relative translate-y-3 opacity-90 transition-transform">
                        <div className="absolute -top-10 text-6xl drop-shadow-xl saturate-150">🎁</div>
                        <h4 className="text-white font-bold text-[11px] md:text-xs text-center leading-tight mb-3">Check Back<br/>Tomorrow</h4>
                        <button disabled className="w-full py-2 rounded-xl bg-white/20 text-white text-[10px] font-bold">Locked</button>
                    </div>
                </div>

            </div>
        </div>
    )
}
