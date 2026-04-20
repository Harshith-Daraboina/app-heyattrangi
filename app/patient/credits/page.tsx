"use client"

import { useEffect, useState } from "react"
import Sidebar from "@/components/patient/Sidebar"
import { format } from "date-fns"

export default function CareCreditsPage() {
    const [stats, setStats] = useState({ earned_today: 0, total_credits: 0, current_streak: 1 })
    const [rewards, setRewards] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Fetch wallet stats and streak
        fetch("/api/patient/credits")
            .then(res => res.json())
            .then(data => setStats(data))
            .catch(err => console.error("Failed to load stats"))

        // Fetch rewards catalog
        fetch("/api/patient/rewards")
            .then(res => res.json())
            .then(data => {
                setRewards(Array.isArray(data) ? data : [])
                setLoading(false)
            })
            .catch(err => {
                console.error("Failed to load rewards")
                setLoading(false)
            })
    }, [])

    const handleRedeem = async (reward: any) => {
        if (stats.total_credits < reward.creditCost) {
            alert(`You need ${reward.creditCost - stats.total_credits} more credits to redeem this!`)
            return
        }

        try {
            const res = await fetch("/api/patient/credits/redeem", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rewardId: reward.id })
            })
            const data = await res.json()
            if (res.ok) {
                alert(data.message)
                setStats(prev => ({ ...prev, total_credits: data.total_credits }))
            } else {
                alert(data.error || "Failed to redeem")
            }
        } catch (error) {
            alert("Network error trying to redeem.")
        }
    }

    // A quick dev panel to simulate earning credits without changing the rest of the application
    const simulateEarn = async (action: string) => {
        try {
            const res = await fetch("/api/patient/credits/earn", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ actionType: action })
            })
            const data = await res.json()
            alert(data.message || data.error)
            if (res.ok) {
                setStats(prev => ({ ...prev, earned_today: data.earned_today, total_credits: data.total_credits }))
            }
        } catch (error) {
            alert("Error trying to earn credit")
        }
    }

    return (
        <div className="h-screen w-full flex bg-[#fafdfc] font-sans overflow-hidden relative">
            <Sidebar />
            
            <div className="flex-1 overflow-y-auto px-10 py-10">
                <header className="mb-10 w-full max-w-5xl mx-auto flex items-end justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Care Credits</h1>
                        <p className="text-gray-500 font-medium tracking-wide mt-1">Earn points by actively engaging in your therapy journey.</p>
                    </div>
                </header>

                <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    {/* Stats Dashboard */}
                    <div className="md:col-span-1 flex flex-col gap-6">
                        <div className="bg-gradient-to-br from-[#98c99f] to-[#60a574] rounded-[32px] p-8 text-white shadow-lg shadow-green-500/20 relative overflow-hidden">
                            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
                            <h3 className="font-extrabold text-white/80 uppercase tracking-widest text-xs mb-1">Total Balance</h3>
                            <div className="text-6xl font-black mb-6">
                                {loading ? "..." : stats.total_credits} <span className="text-3xl">🌿</span>
                            </div>

                            <div className="flex items-center justify-between border-t border-white/20 pt-4">
                                <div className="flex flex-col">
                                    <span className="text-white/80 text-xs font-bold uppercase tracking-wider">Earned Today</span>
                                    <span className="text-lg font-bold">{loading ? "-" : stats.earned_today} 🌿</span>
                                </div>
                                <div className="flex flex-col text-right">
                                    <span className="text-white/80 text-xs font-bold uppercase tracking-wider">Daily Streak</span>
                                    <span className="text-lg font-bold">{loading ? "-" : stats.current_streak} 🔥</span>
                                </div>
                            </div>
                        </div>

                        {/* Developer Simulation Block for Demo */}
                        <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm space-y-3">
                            <h4 className="font-bold text-gray-800 text-[13px] mb-4">Simulate Progress (Demo)</h4>
                            <button onClick={() => simulateEarn("daily_login_bonus")} className="w-full text-left px-4 py-2 bg-purple-50 hover:bg-purple-100 rounded-xl text-sm font-bold border border-purple-100 text-purple-700 transition-colors">
                                + Daily Login Reward
                            </button>
                            <button onClick={() => simulateEarn("mood_checkin")} className="w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-xl text-sm font-medium border border-gray-200 transition-colors">
                                + Log Mood (+1)
                            </button>
                            <button onClick={() => simulateEarn("therapy_session")} className="w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-xl text-sm font-medium border border-gray-200 transition-colors">
                                + Attend Therapy (+2)
                            </button>
                        </div>
                    </div>

                    {/* Rewards Catalog */}
                    <div className="md:col-span-2">
                        <h2 className="text-xl font-extrabold text-[#0f172a] mb-6">Redeem Rewards</h2>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {rewards.length > 0 ? rewards.map((reward) => {
                                const isAffordable = stats.total_credits >= reward.creditCost
                                return (
                                    <div key={reward.id} className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm flex flex-col items-start relative group">
                                        <div className={`p-3 rounded-2xl mb-4 ${reward.type === 'AI' ? 'bg-indigo-50 text-indigo-500' : reward.type === 'therapy' ? 'bg-rose-50 text-rose-500' : 'bg-orange-50 text-orange-500'}`}>
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
                                        </div>
                                        
                                        <h3 className="font-bold text-gray-900 text-[15px] mb-1">{reward.name}</h3>
                                        <div className="text-gray-500 text-[12px] font-medium uppercase tracking-widest mb-6">
                                            {reward.type === 'AI' ? 'Pragya Bot' : reward.type === 'therapy' ? 'Session Discount' : 'Content Pack'}
                                        </div>
                                        
                                        <div className="mt-auto w-full flex items-center justify-between">
                                            <span className="font-extrabold text-[15px] text-green-600 tracking-tight">{reward.creditCost} 🌿</span>
                                            
                                            <button 
                                                onClick={() => handleRedeem(reward)}
                                                className={`px-4 py-2 rounded-full font-bold text-[12px] transition-transform ${isAffordable ? 'bg-[#1a202c] hover:scale-105 text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                                            >
                                                Redeem
                                            </button>
                                        </div>
                                    </div>
                                )
                            }) : (
                                <p className="text-gray-400 font-medium text-sm col-span-2">No rewards available yet.</p>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
