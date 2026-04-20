export default function BillingPage() {
    return (
        <div className="flex-1 min-w-0 h-full overflow-y-auto w-full p-8 xl:p-12 bg-[#fafdfc]">
            <div className="max-w-4xl mx-auto">
                <div className="mb-10">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Billing & Credits</h1>
                    <p className="text-gray-500 font-medium tracking-wide">Manage your account credits, subscriptions, and payment history.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Balance Card */}
                    <div className="bg-white rounded-[24px] p-8 shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)] border border-gray-50/50 flex flex-col justify-between">
                        <div>
                            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Available Credits</h2>
                            <div className="flex items-end gap-2 mb-2">
                                <span className="text-5xl font-black text-orange-400">1,250</span>
                                <span className="text-gray-500 font-medium mb-1">Credits</span>
                            </div>
                            <p className="text-xs text-gray-400 font-medium">Used for AI bot interactions and premium features.</p>
                        </div>
                        <button className="mt-8 bg-[#98c99f] text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-sm hover:opacity-90 transition-opacity w-full">
                            Purchase More Credits
                        </button>
                    </div>

                    {/* Payment Method Card */}
                    <div className="bg-white rounded-[24px] p-8 shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)] border border-gray-50/50 flex flex-col justify-between">
                        <div>
                            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Payment Method</h2>
                            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <div className="w-12 h-8 bg-blue-900 rounded-md flex items-center justify-center text-white font-bold text-xs italic tracking-tighter">VISA</div>
                                <div>
                                    <p className="font-bold text-sm text-gray-800">•••• •••• •••• 4242</p>
                                    <p className="text-xs text-gray-500 font-medium">Expires 12/28</p>
                                </div>
                            </div>
                        </div>
                        <button className="mt-8 bg-white border-2 border-gray-100 text-gray-600 px-6 py-3 rounded-2xl text-sm font-bold shadow-sm hover:bg-gray-50 hover:text-gray-800 transition-colors w-full">
                            Update Payment Method
                        </button>
                    </div>
                </div>

                {/* Transaction History */}
                <div className="bg-white rounded-[24px] p-8 shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)] border border-gray-50/50">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-lg font-bold text-gray-900">Transaction History</h2>
                        <button className="text-xs font-bold text-orange-400 hover:text-orange-500 transition-colors">Download PDF</button>
                    </div>

                    <div className="space-y-4">
                        {[
                            { id: "TXN-8392", date: "24 Oct 2026", desc: "500 Credits Top-up", amount: "$50.00", status: "Success" },
                            { id: "TXN-8341", date: "15 Oct 2026", desc: "Therapist Appointment Booking", amount: "$120.00", status: "Success" },
                            { id: "TXN-8205", date: "01 Sep 2026", desc: "Monthly Subscription - Basic", amount: "$29.99", status: "Success" },
                        ].map((txn, i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
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
        </div>
    )
}
