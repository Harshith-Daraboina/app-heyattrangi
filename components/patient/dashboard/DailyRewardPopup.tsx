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
                
                // Keep the celebration and close after a short delay
                setTimeout(() => {
                    setIsOpen(false)
                }, 3000)
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

    // Determine day of the 7-day cycle (from 1 to 7)
    const currentDay = ((Math.max(1, streak) - 1) % 7) + 1

    // Generate day initials dynamically to center around the user's login date
    const getWeeklyTrackerDays = () => {
        const dayInitials = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
        const today = new Date()
        const baseDate = new Date()
        // Align baseDate to the start of the current 7-day streak cycle
        baseDate.setDate(today.getDate() - (currentDay - 1))
        
        const days = []
        for (let i = 0; i < 7; i++) {
            const d = new Date(baseDate)
            d.setDate(baseDate.getDate() + i)
            days.push({
                initial: dayInitials[d.getDay()],
                isReached: i < currentDay,
                isToday: i === currentDay - 1
            })
        }
        return days
    }

    const trackerDays = getWeeklyTrackerDays()

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
                onClick={closeAndRemember}
            />

            <motion.div 
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="relative w-full max-w-[360px] md:max-w-[380px] bg-gradient-to-b from-[#f36b3f] to-[#e85324] rounded-[40px] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20 overflow-hidden flex flex-col items-center text-white"
            >
                {/* Radiant Sunburst Ray Background */}
                <div 
                    className="absolute inset-0 select-none pointer-events-none opacity-[0.06] mix-blend-overlay"
                    style={{
                        background: `conic-gradient(from 0deg at 50% 30%, 
                            rgba(255,255,255,1) 0deg 15deg, transparent 15deg 30deg, 
                            rgba(255,255,255,1) 30deg 45deg, transparent 45deg 60deg, 
                            rgba(255,255,255,1) 60deg 75deg, transparent 75deg 90deg, 
                            rgba(255,255,255,1) 90deg 105deg, transparent 105deg 120deg, 
                            rgba(255,255,255,1) 120deg 135deg, transparent 135deg 150deg, 
                            rgba(255,255,255,1) 150deg 165deg, transparent 165deg 180deg, 
                            rgba(255,255,255,1) 180deg 195deg, transparent 195deg 210deg, 
                            rgba(255,255,255,1) 210deg 225deg, transparent 225deg 240deg, 
                            rgba(255,255,255,1) 240deg 255deg, transparent 255deg 270deg, 
                            rgba(255,255,255,1) 270deg 285deg, transparent 285deg 300deg, 
                            rgba(255,255,255,1) 300deg 315deg, transparent 315deg 330deg, 
                            rgba(255,255,255,1) 330deg 345deg, transparent 345deg 360deg)`
                    }}
                />

                {/* Top Actions */}
                <div className="w-full flex justify-end items-center absolute top-4 right-4 z-20">
                    <button 
                        onClick={closeAndRemember}
                        className="w-10 h-10 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>

                {/* Streak Badge & Counter Row */}
                <div className="flex items-center gap-4 mt-4 mb-6 z-10 w-full justify-center">
                    {/* Gold Ribbon Badge */}
                    <div className="relative w-16 h-16 flex items-center justify-center filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.15)] animate-pulse">
                        <svg className="absolute inset-0 w-full h-full text-[#ffd13b]" viewBox="0 0 100 100" fill="currentColor">
                            <path d="M50 0 L54 10 L64 6 L64 16 L74 15 L70 25 L79 27 L72 35 L79 40 L70 45 L75 55 L65 56 L67 66 L57 64 L55 74 L45 70 L40 79 L32 72 L25 79 L21 70 L11 72 L11 62 L3 60 L7 50 L0 44 L7 37 L3 27 L11 25 L11 15 L21 16 L25 7 L32 14 L40 5 L45 15 Z" />
                        </svg>
                        <div className="absolute w-[76%] h-[76%] bg-[#ffe663] rounded-full flex items-center justify-center shadow-inner">
                            <svg className="w-8 h-8 text-[#ea580c]" fill="none" stroke="currentColor" strokeWidth="4" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>

                    {/* Streak Info Text */}
                    <div className="flex flex-col text-left">
                        <span className="text-7xl font-black text-white leading-none tracking-tight">
                            {streak}
                        </span>
                        <span className="text-lg font-bold text-white/90 leading-tight">
                            day streak!
                        </span>
                    </div>
                </div>

                {/* Character Icon: Cute Grey Chick (Juno) */}
                <div className="relative w-full aspect-square max-w-[160px] mb-6 flex items-center justify-center z-10">
                    <motion.div 
                        animate={isClaimed ? { 
                            y: [0, -18, 0, -18, 0],
                            rotate: [0, 4, -4, 4, 0],
                            scaleY: [1, 0.9, 1.05, 0.9, 1],
                        } : { 
                            y: [0, -6, 0],
                            rotate: [0, 1.5, -1.5, 0]
                        }}
                        transition={isClaimed ? {
                            duration: 0.8,
                            repeat: Infinity,
                            ease: "easeInOut"
                        } : { 
                            duration: 3, 
                            repeat: Infinity, 
                            ease: "easeInOut" 
                        }}
                        className="relative z-10 w-full h-full flex items-center justify-center"
                    >
                        <svg viewBox="0 0 120 120" className="w-40 h-40 filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.15)]">
                            {/* Left Foot */}
                            <motion.path 
                                animate={isClaimed ? {
                                    rotate: [0, -10, 10, -10, 0]
                                } : {}}
                                transition={{ duration: 0.4, repeat: Infinity }}
                                style={{ transformOrigin: "44px 95px" }}
                                d="M 44 95 C 44 95 40 106 40 106 C 40 106 46 106 50 102 C 54 106 60 106 60 106 C 60 106 56 95 56 95 Z" 
                                fill="#718096" 
                            />
                            {/* Right Foot */}
                            <motion.path 
                                animate={isClaimed ? {
                                    rotate: [0, 10, -10, 10, 0]
                                } : {}}
                                transition={{ duration: 0.4, repeat: Infinity }}
                                style={{ transformOrigin: "76px 95px" }}
                                d="M 64 95 C 64 95 60 106 60 106 C 60 106 66 106 70 102 C 74 106 80 106 80 106 C 80 106 76 95 76 95 Z" 
                                fill="#718096" 
                            />
                            
                            {/* Left Wing */}
                            <motion.path 
                                animate={isClaimed ? {
                                    rotate: [0, -40, 20, -40, 0]
                                } : {
                                    rotate: [0, -10, 6, -10, 0]
                                }}
                                transition={{
                                    duration: isClaimed ? 0.3 : 2.5,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                style={{ transformOrigin: "32px 64px" }}
                                d="M 32 68 C 18 68 6 56 6 48 C 6 40 16 42 28 54 C 28 54 30 60 32 68 Z" 
                                fill="#8ca0b3" 
                            />
                            {/* Right Wing */}
                            <motion.path 
                                animate={isClaimed ? {
                                    rotate: [0, 40, -20, 40, 0]
                                } : {
                                    rotate: [0, 10, -6, 10, 0]
                                }}
                                transition={{
                                    duration: isClaimed ? 0.3 : 2.5,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                style={{ transformOrigin: "88px 64px" }}
                                d="M 88 68 C 102 68 114 56 114 48 C 114 40 104 42 92 54 C 92 54 90 60 88 68 Z" 
                                fill="#8ca0b3" 
                            />

                            {/* Body */}
                            <ellipse cx="60" cy="72" rx="30" ry="24" fill="#a0aec0" />
                            
                            {/* Head */}
                            <circle cx="60" cy="44" r="24" fill="#a0aec0" />
                            
                            {/* Face Details */}
                            {/* Left Eye */}
                            <motion.ellipse 
                                cx="53" 
                                cy="42" 
                                rx="2.5" 
                                ry="2.5" 
                                fill="#1a202c" 
                                animate={{ 
                                    scaleY: [1, 1, 0.1, 1, 1, 1, 0.1, 1] 
                                }}
                                transition={{ 
                                    duration: 4, 
                                    repeat: Infinity, 
                                    times: [0, 0.45, 0.5, 0.55, 0.85, 0.9, 0.95, 1],
                                    ease: "easeInOut" 
                                }}
                                style={{ transformOrigin: "53px 42px" }}
                            />
                            {/* Right Eye */}
                            <motion.ellipse 
                                cx="67" 
                                cy="42" 
                                rx="2.5" 
                                ry="2.5" 
                                fill="#1a202c" 
                                animate={{ 
                                    scaleY: [1, 1, 0.1, 1, 1, 1, 0.1, 1] 
                                }}
                                transition={{ 
                                    duration: 4, 
                                    repeat: Infinity, 
                                    times: [0, 0.45, 0.5, 0.55, 0.85, 0.9, 0.95, 1],
                                    ease: "easeInOut" 
                                }}
                                style={{ transformOrigin: "67px 42px" }}
                            />
                            
                            {/* Beak */}
                            <motion.path 
                                animate={isClaimed ? {
                                    scale: [1, 1.2, 1]
                                } : {}}
                                transition={{ duration: 0.4, repeat: Infinity }}
                                style={{ transformOrigin: "60px 46px" }}
                                d="M 57 44 L 63 44 L 60 48 Z" 
                                fill="#ecc94b" 
                            />
                        </svg>
                    </motion.div>
                    
                    {/* Shadow underneath Juno */}
                    <div className="absolute bottom-1 w-24 h-3 bg-black/10 rounded-full blur-sm" />
                </div>

                {/* Weekly Streak Tracker Container */}
                <div className="w-full bg-black/15 border border-white/5 rounded-[24px] p-4 mb-6 z-10 backdrop-blur-sm">
                    <div className="grid grid-cols-7 gap-1 text-center">
                        {trackerDays.map((day, idx) => (
                            <div key={idx} className="flex flex-col items-center">
                                {/* Weekday letter label */}
                                <span className={`text-[11px] font-black tracking-wider mb-2 ${day.isReached ? 'text-white' : 'text-white/40'}`}>
                                    {day.initial}
                                </span>
                                
                                {/* Day Circle indicator */}
                                <div className="h-8 flex items-center justify-center">
                                    {day.isReached ? (
                                        <div className="relative w-8 h-8 flex items-center justify-center filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]">
                                            <svg className="absolute inset-0 w-full h-full text-[#ffd13b]" viewBox="0 0 100 100" fill="currentColor">
                                                <path d="M50 0 L54 10 L64 6 L64 16 L74 15 L70 25 L79 27 L72 35 L79 40 L70 45 L75 55 L65 56 L67 66 L57 64 L55 74 L45 70 L40 79 L32 72 L25 79 L21 70 L11 72 L11 62 L3 60 L7 50 L0 44 L7 37 L3 27 L11 25 L11 15 L21 16 L25 7 L32 14 L40 5 L45 15 Z" />
                                            </svg>
                                            <div className="absolute w-[76%] h-[76%] bg-[#ffe663] rounded-full flex items-center justify-center shadow-inner">
                                                <svg className="w-4 h-4 text-[#ea580c]" fill="none" stroke="currentColor" strokeWidth="4" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-black/20 border border-white/5" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Encourage Text Message */}
                <p className="text-white font-medium text-sm leading-relaxed text-center mb-6 px-3 z-10">
                    Great job! Open the app every day to maintain your self-care streak with Juno!
                </p>

                {/* Primary Pill Button */}
                <div className="w-full z-10">
                    <button 
                        onClick={isClaimed ? closeAndRemember : handleClaim}
                        disabled={isLoading}
                        className="w-full bg-white hover:bg-white/95 active:scale-95 text-[#ea580c] font-black text-lg py-4 rounded-[24px] shadow-[0_8px_20px_rgba(0,0,0,0.15)] transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <svg className="animate-spin h-5 w-5 text-[#ea580c]" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                        ) : isClaimed ? (
                            "Let's go!"
                        ) : (
                            "Claim Daily Reward"
                        )}
                    </button>
                </div>

                {/* Celebration Particles */}
                {showCelebration && (
                    <div className="absolute inset-0 pointer-events-none z-[100]">
                        {[...Array(30)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ x: "50%", y: "50%", scale: 0 }}
                                animate={{ 
                                    x: `${Math.random() * 100}%`, 
                                    y: `${Math.random() * 100}%`, 
                                    scale: Math.random() * 1.5 + 0.5,
                                    opacity: 0,
                                    rotate: Math.random() * 360
                                }}
                                transition={{ duration: 2.5, ease: "easeOut" }}
                                className="absolute w-4 h-4 text-xl"
                            >
                                {['✨', '🌟', '🧡', '🍊'][Math.floor(Math.random() * 4)]}
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    )
}
