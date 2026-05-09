"use client"

import { User } from "@prisma/client"

interface BillingSectionProps {
    user: User
}

const planBillingMap: Record<string, { label: string; price: string; description: string }> = {
    ESSENTIAL: {
        label: "Essential",
        price: "₹49/mo",
        description: "Core self-care tools, AI interactions, and standard support.",
    },
    PREMIUM: {
        label: "Premium",
        price: "₹299/mo",
        description: "Enhanced access, more credits, and premium support.",
    },
    ORGANIZATION: {
        label: "Organization",
        price: "Billed by your institution",
        description: "College or corporate plan with organization-managed billing.",
    },
}

export default function BillingSection({ user }: BillingSectionProps) {
    const plan = user.plan || "ESSENTIAL"
    const billing = planBillingMap[plan] || planBillingMap.ESSENTIAL
    const isOrg = plan === "ORGANIZATION"

    return (
        <div className="space-y-10">
                <div className="bg-white rounded-[24px] p-8 shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)] border border-gray-50">
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Active Plan</h2>
                    <p className="text-sm text-gray-500 mb-2">Current subscription</p>
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h3 className="text-2xl font-black text-gray-900">{billing.label}</h3>
                            <p className="text-sm text-gray-500 mt-1">{billing.description}</p>
                        </div>
                        <span className="inline-flex items-center rounded-full bg-orange-100 text-orange-800 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]">
                            {billing.price}
                        </span>
                    </div>
                    <div className="mt-6 border-t border-gray-100 pt-5 text-sm text-gray-600 space-y-3">
                        <div className="flex justify-between">
                            <span>Billing cycle</span>
                            <span>{isOrg ? "Organization managed" : "Monthly"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Plan type</span>
                            <span>{billing.label}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Payment method</span>
                            <span>{isOrg ? "Institution billing" : "Visa •••• 4242"}</span>
                        </div>
                    </div>
                </div>

                {/* Compare Plans Section */}
                <div className="bg-white rounded-[24px] shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)] border border-gray-50 overflow-hidden">
                    <div className="p-8 border-b border-gray-50">
                        <h2 className="text-2xl font-black text-gray-900 mb-1">Compare plans</h2>
                        <p className="text-sm text-gray-500">Need more details before choosing? <a href="/pricing" className="font-bold text-gray-900 hover:underline">See feature breakdown &darr;</a></p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                        
                        {/* Essential Plan */}
                        <div className="p-6 xl:p-8 flex flex-col hover:bg-gray-50/50 transition-colors">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Essential</h3>
                            <div className="flex items-baseline mb-2">
                                <span className="text-5xl font-black tracking-tight text-gray-900">₹49</span>
                                <span className="text-sm text-gray-500 font-medium ml-1">/mo</span>
                            </div>
                            <p className="text-sm font-bold text-teal-600 mb-6">Affordable start</p>
                            <p className="text-sm text-gray-600 mb-8 min-h-[60px]">Core self-care tools, AI interactions, and standard support.</p>
                            
                            <div className="space-y-3 mb-8 text-xs">
                                <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                                    <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Chats</span>
                                    <span className="font-bold text-gray-900">Limited</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                                    <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Analytics</span>
                                    <span className="font-bold text-gray-900">Basic</span>
                                </div>
                                <div className="flex justify-between items-center pb-1">
                                    <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Support</span>
                                    <span className="font-bold text-gray-900">Standard</span>
                                </div>
                            </div>
                            
                            <button className="mt-auto w-full py-3 px-2 text-sm lg:text-base bg-[#001e2b] text-white font-bold rounded-lg hover:bg-gray-800 transition-colors">
                                Current Plan
                            </button>
                        </div>

                        {/* Premium Plan */}
                        <div className="p-6 xl:p-8 flex flex-col hover:bg-gray-50/50 transition-colors md:relative md:before:content-[''] md:before:absolute md:before:top-0 md:before:left-0 md:before:right-0 md:before:h-1 md:before:bg-blue-400 md:before:z-10">
                            <div className="absolute top-[-12px] left-1/2 -translate-x-1/2 bg-white border border-blue-200 text-blue-500 text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm z-20 whitespace-nowrap hidden md:block">
                                RECOMMENDED
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Premium</h3>
                            <div className="flex items-baseline mb-2">
                                <span className="text-5xl font-black tracking-tight text-gray-900">₹299</span>
                                <span className="text-sm text-gray-500 font-medium ml-1">/mo</span>
                            </div>
                            <p className="text-sm text-gray-500 mb-6 font-medium">Billed monthly</p>
                            <p className="text-sm text-gray-600 mb-8 min-h-[60px]">Enhanced access, more credits, and premium support.</p>
                            
                            <div className="space-y-3 mb-8 text-xs">
                                <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                                    <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Chats</span>
                                    <span className="font-bold text-gray-900">Unlimited</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                                    <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Analytics</span>
                                    <span className="font-bold text-gray-900">Advanced</span>
                                </div>
                                <div className="flex justify-between items-center pb-1">
                                    <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Support</span>
                                    <span className="font-bold text-gray-900">Priority</span>
                                </div>
                            </div>
                            
                            <button className="mt-auto w-full py-3 px-2 text-sm xl:text-base bg-[#00ed64] text-gray-900 font-bold rounded-lg hover:bg-[#00c753] transition-colors mb-4 whitespace-nowrap">
                                Upgrade to Premium
                            </button>
                            <div className="text-center">
                                <a href="/pricing" className="text-sm font-bold text-gray-900 hover:underline flex items-center justify-center gap-1">View Premium pricing <span className="text-lg leading-none">&rsaquo;</span></a>
                            </div>
                        </div>

                        {/* Organization Plan */}
                        <div className="p-6 xl:p-8 flex flex-col hover:bg-gray-50/50 transition-colors">
                            <h3 className="text-xl font-bold text-gray-900 mb-4 mt-2 md:mt-0">Organization</h3>
                            <div className="flex items-baseline mb-2 mt-3">
                                <span className="text-3xl font-black tracking-tight text-gray-900 leading-none">Custom</span>
                            </div>
                            <p className="text-sm font-bold text-teal-600 mb-6 mt-3">Billed by institution</p>
                            <p className="text-sm text-gray-600 mb-8 min-h-[60px]">College or corporate plan with organization-managed billing.</p>
                            
                            <div className="space-y-3 mb-8 text-xs">
                                <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                                    <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Users</span>
                                    <span className="font-bold text-gray-900">Managed</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                                    <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Admin</span>
                                    <span className="font-bold text-gray-900">Portal</span>
                                </div>
                                <div className="flex justify-between items-center pb-1">
                                    <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Billing</span>
                                    <span className="font-bold text-gray-900">Centralized</span>
                                </div>
                            </div>
                            
                            <button className="mt-auto w-full py-3 px-2 text-sm xl:text-base bg-[#001e2b] text-white font-bold rounded-lg hover:bg-gray-800 transition-colors mb-4 whitespace-nowrap">
                                Contact Sales
                            </button>
                            <div className="text-center">
                                <a href="/pricing" className="text-sm font-bold text-gray-900 hover:underline flex items-center justify-center gap-1">View Org pricing <span className="text-lg leading-none">&rsaquo;</span></a>
                            </div>
                        </div>

                    </div>
                </div>

            {/* Transaction History */}
            <div className="bg-white rounded-[24px] p-8 shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)] border border-gray-50">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-lg font-bold text-gray-900">Transaction History</h2>
                    <button className="text-xs font-bold text-orange-400 hover:text-orange-500 transition-colors">Download PDF</button>
                </div>

                <div className="space-y-4">
                    {[
                        { id: "TXN-8392", date: "24 Oct 2026", desc: "500 Credits Top-up", amount: "₹4,199.00", status: "Success" },
                        { id: "TXN-8341", date: "15 Oct 2026", desc: "Therapist Appointment Booking", amount: "₹9,999.00", status: "Success" },
                        { id: "TXN-8205", date: "01 Sep 2026", desc: "Monthly Subscription - Premium", amount: "₹2,499.00", status: "Success" },
                    ].map((txn, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-500">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-gray-900">{txn.desc}</h4>
                                    <p className="text-xs text-gray-500 font-medium">{txn.date} • {txn.id}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="block font-bold text-sm text-gray-900">{txn.amount}</span>
                                <span className="text-xs font-bold text-teal-600">{txn.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-6 text-center pt-2">
                    <button className="text-xs font-bold text-gray-500 hover:text-gray-800">Load More</button>
                </div>
            </div>


        </div>
    )
}
