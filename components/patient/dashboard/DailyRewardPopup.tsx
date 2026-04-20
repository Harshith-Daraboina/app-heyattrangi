"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function DailyRewardPopup() {
    const [isOpen, setIsOpen] = useState(false)
    const [isClaimed, setIsClaimed] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [streak, setStreak] = useState(1)
    const [balance, setBalance] = useState(0)
    const [showCelebration, setShowCelebration] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/patient/credits")
                const data = await res.json()
                if (res.ok) {
                    setStreak(data.current_streak)
                    setBalance(data.total_credits)
                    const today = new Date().toISOString().split('T')[0]
                    const hasSeen = localStorage.getItem(`daily_reward_modal_${today}`)
                    
                    if (!hasSeen) {
                        const timer = setTimeout(() => setIsOpen(true), 800)
                        return () => clearTimeout(timer)
                    }
                }
            } catch (error) {
                console.error("Failed to fetch streak", error)
            }
        }
        
        fetchData()
    }, [])

    const closeAndRemember = () => {
        setIsOpen(false)
        const today = new Date().toISOString().split('T')[0]
        localStorage.setItem(`daily_reward_modal_${today}`, "true")
    }

    const handleClaim = async () => {
        setIsLoading(true)
        try {
            const res = await fetch("/api/patient/credits/earn", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ actionType: "daily_login_bonus" })
            })
            const data = await res.json()
            
            if (res.ok) {
                setIsClaimed(true)
                setShowCelebration(true)
                setBalance(data.total_credits)
                const today = new Date().toISOString().split('T')[0]
                localStorage.setItem(`daily_reward_modal_${today}`, "true")
                
                setTimeout(() => {
                    setIsOpen(false)
                }, 4000)
            } else {
                alert(data.message || "Already claimed or error")
            }
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    if (!isOpen) return null

    const rewards = [10, 15, 20, 25, 30, 40, 75]
    const currentDay = ((Math.max(1, streak) - 1) % 7) + 1

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={closeAndRemember}
            />

            <motion.div 
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="relative w-full max-w-sm md:max-w-md bg-[#fffef4] rounded-[50px] p-8 shadow-2xl border-b-[12px] border-[#e8e4d8] overflow-hidden flex flex-col items-center"
            >
                {/* Top Status Bar */}
                <div className="w-full flex justify-between items-center mb-8 px-2">
                    <div className="flex items-center gap-2 bg-white/50 backdrop-blur-md px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                        <span className="text-xl">🌿</span>
                        <span className="font-black text-[#1a1c1e]">{balance}</span>
                    </div>
                    <button 
                        onClick={closeAndRemember}
                        className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-black transition-colors"
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                </div>

                {/* Day Label */}
                <span className="text-gray-400 font-black text-sm tracking-widest uppercase mb-1">
                    Day {currentDay}
                </span>

                {/* Streak Number */}
                <h2 className="text-7xl font-[900] text-[#1a1c1e] mb-6 tracking-tighter">
                    {streak}
                </h2>

                {/* Character Icon */}
                <div className="relative w-full aspect-square max-w-[180px] mb-8 flex items-center justify-center">
                    {/* Character: Smiling Coin with Hat */}
                    <motion.div 
                        animate={{ 
                            y: [0, -15, 0],
                            rotate: [-5, 5, -5]
                        }}
                        transition={{ 
                            duration: 2.5, 
                            repeat: Infinity, 
                            ease: "easeInOut" 
                        }}
                        className="relative z-10 w-full h-full flex items-center justify-center"
                    >
                         <div className="relative">
                            <span className="text-[120px] leading-none drop-shadow-xl select-none">🪙</span>
                            {/* Hat */}
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 rotate-[-20deg] text-5xl">🧢</div>
                            {/* Face */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 opacity-80">
                                <div className="flex gap-4">
                                    <div className="w-2 h-2 bg-black rounded-full" />
                                    <div className="w-2 h-2 bg-black rounded-full" />
                                </div>
                                <div className="w-5 h-2 bg-black rounded-full" style={{ borderRadius: '50% 50% 50% 50% / 0% 0% 100% 100%' }} />
                            </div>
                         </div>
                    </motion.div>
                    
                    {/* Float shadow */}
                    <div className="absolute bottom-4 w-24 h-4 bg-black/5 rounded-full blur-md" />
                </div>

                {/* Progress Bar UI */}
                <div className="w-full mb-12 px-2 relative">
                    {/* Background Line */}
                    <div className="h-4 bg-[#f0ede6] rounded-full w-full absolute top-1/2 -translate-y-1/2" />
                    
                    {/* Fill Line */}
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentDay - 1) / 6) * 100}%` }}
                        className="h-4 bg-yellow-400 rounded-full absolute top-1/2 -translate-y-1/2 z-10"
                    />

                    {/* Milestone Dots */}
                    <div className="relative flex justify-between items-center z-20">
                        {rewards.map((amount, idx) => {
                            const dayNum = idx + 1
                            const isReached = dayNum <= currentDay
                            const isCurrent = dayNum === currentDay
                            
                            return (
                                <div key={dayNum} className="relative flex flex-col items-center">
                                    <div className={`w-6 h-6 rounded-full border-4 transition-all duration-300 ${
                                        isCurrent 
                                        ? "bg-yellow-400 border-white scale-125" 
                                        : isReached 
                                        ? "bg-yellow-400 border-transparent" 
                                        : "bg-[#e8e4dc] border-transparent"
                                    }`} />
                                    
                                    <div className="absolute -bottom-10 flex flex-col items-center whitespace-nowrap">
                                        <span className={`text-[11px] font-black ${isReached ? 'text-black' : 'text-gray-300'}`}>
                                            {dayNum * 100} {/* Using step-like numbers for visual style */}
                                        </span>
                                        <span className={`text-[9px] font-bold ${isReached ? 'text-gray-500' : 'text-gray-300'} flex items-center gap-0.5`}>
                                            {amount} <span className="text-[12px]">🌿</span>
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Action Button */}
                <div className="w-full mt-4 flex flex-col gap-4">
                    <AnimatePresence mode="wait">
                        {!isClaimed ? (
                            <motion.button 
                                key="validate-btn"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleClaim}
                                disabled={isLoading}
                                className="w-full bg-[#1e1e1e] hover:bg-black text-white rounded-[28px] py-6 flex items-center justify-center gap-3 shadow-lg transition-all"
                            >
                                <span className="w-10 h-10 bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-full flex items-center justify-center text-xl shadow-sm">⭐</span>
                                <span className="text-xl font-black">Validate my rewards</span>
                            </motion.button>
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-green-100 text-green-700 rounded-[28px] py-6 flex items-center justify-center gap-3 font-black text-xl"
                            >
                                <span className="text-2xl">🏆</span>
                                Rewards Claimed!
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Mini Cards (Like at the bottom of the image) */}
                    <div className="flex gap-3 w-full overflow-hidden opacity-50 select-none pointer-events-none pb-2">
                        <div className="flex-1 bg-white rounded-3xl p-4 border border-gray-100 flex flex-col items-center">
                            <span className="text-3xl mb-2">🎁</span>
                            <div className="w-12 h-2 bg-gray-100 rounded-full" />
                        </div>
                        <div className="flex-1 bg-[#e8f5e9] rounded-3xl p-4 border border-green-100 flex flex-col items-center">
                            <span className="text-3xl mb-2">🌱</span>
                            <div className="w-12 h-2 bg-green-200 rounded-full" />
                        </div>
                    </div>
                </div>

                {/* Celebration Particles */}
                {showCelebration && (
                    <div className="absolute inset-0 pointer-events-none z-[100]">
                        {[...Array(40)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ x: "50%", y: "50%", scale: 0 }}
                                animate={{ 
                                    x: `${Math.random() * 100}%`, 
                                    y: `${Math.random() * 100}%`, 
                                    scale: Math.random() * 2 + 0.5,
                                    opacity: 0,
                                    rotate: Math.random() * 360
                                }}
                                transition={{ duration: 2, ease: "easeOut" }}
                                className="absolute w-4 h-4 text-2xl"
                            >
                                {['✨', '🌟', '🌿', '🪙'][Math.floor(Math.random() * 4)]}
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    )
}
