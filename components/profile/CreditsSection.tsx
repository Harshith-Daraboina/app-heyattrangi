"use client"

import { useEffect, useState } from "react"

export default function CreditsSection() {
    const [stats, setStats] = useState({ earned_today: 0, total_credits: 0, current_streak: 1 })
    const [rewards, setRewards] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch("/api/patient/credits")
            .then(res => res.json())
            .then(data => setStats(data))
            .catch(err => console.error("Failed to load stats"))

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

    const simulateEarn = async (action: string) => {
        try {
            const res = await fetch("/api/patient/credits/earn", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ actionType: action })
            })
            const data = await res.json()
            if (res.ok) {
                setStats(prev => ({ ...prev, earned_today: data.earned_today, total_credits: data.total_credits }))
            }
        } catch (error) {
            console.error("Error trying to earn credit")
        }
    }

    return (
        <div className="space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Stats Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-gradient-to-br from-[#98c99f] to-[#60a574] rounded-[32px] p-8 text-white shadow-lg shadow-green-500/10 relative overflow-hidden">
                        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
                        <h3 className="font-bold text-white/80 uppercase tracking-widest text-[10px] mb-1">Total Balance</h3>
                        <div className="text-5xl font-black mb-6">
                            {loading ? "..." : stats.total_credits} <span className="text-2xl">🌿</span>
                        </div>

                        <div className="flex items-center justify-between border-t border-white/20 pt-4">
                            <div className="flex flex-col">
                                <span className="text-white/80 text-[10px] font-bold uppercase tracking-wider">Earned Today</span>
                                <span className="text-lg font-bold">{loading ? "-" : stats.earned_today} 🌿</span>
                            </div>
                            <div className="flex flex-col text-right">
                                <span className="text-white/80 text-[10px] font-bold uppercase tracking-wider">Daily Streak</span>
                                <span className="text-lg font-bold">{loading ? "-" : stats.current_streak} 🔥</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm space-y-3">
                        <h4 className="font-bold text-gray-800 text-[13px] mb-4">Quick Actions</h4>
                        <button onClick={() => simulateEarn("mood_checkin")} className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl text-[13px] font-bold border border-gray-100 transition-colors">
                            + Log Mood Check-in
                        </button>
                        <button onClick={() => simulateEarn("therapy_session")} className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl text-[13px] font-bold border border-gray-100 transition-colors">
                            + Complete Session
                        </button>
                    </div>
                </div>

                {/* Rewards Grid */}
                <div className="lg:col-span-2">
                    <h2 className="text-lg font-bold text-gray-900 mb-6">Available Rewards</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {rewards.length > 0 ? rewards.map((reward) => {
                            const isAffordable = stats.total_credits >= reward.creditCost
                            return (
                                <div key={reward.id} className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm flex flex-col items-start relative group">
                                    <div className={`p-3 rounded-2xl mb-4 ${reward.type === 'AI' ? 'bg-indigo-50 text-indigo-500' : reward.type === 'therapy' ? 'bg-rose-50 text-rose-500' : 'bg-orange-50 text-orange-500'}`}>
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
                                    </div>
                                    
                                    <h3 className="font-bold text-gray-900 text-[14px] mb-1">{reward.name}</h3>
                                    <div className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-6">
                                        {reward.type === 'AI' ? 'Pragya Bot' : reward.type === 'therapy' ? 'Session Discount' : 'Content Pack'}
                                    </div>
                                    
                                    <div className="mt-auto w-full flex items-center justify-between pt-4 border-t border-gray-50">
                                        <span className="font-black text-[14px] text-green-600">{reward.creditCost} 🌿</span>
                                        <button 
                                            onClick={() => handleRedeem(reward)}
                                            className={`px-4 py-2 rounded-xl font-bold text-[11px] transition-all ${isAffordable ? 'bg-gray-900 text-white hover:bg-black hover:scale-105' : 'bg-gray-50 text-gray-400 cursor-not-allowed'}`}
                                        >
                                            Redeem
                                        </button>
                                    </div>
                                </div>
                            )
                        }) : (
                            <p className="text-gray-400 font-medium text-sm col-span-2 py-10 text-center">No rewards available yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
