"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface PayoutsDashboardClientProps {
  isProfileVerified: boolean
  payoutStatus: string
  doctorName: string
  earningsData: {
    totalEarnings: number
    pending: number
    paid: number
    nextSettlement: string
  }
}

export default function PayoutsDashboardClient({
  isProfileVerified,
  payoutStatus,
  doctorName,
  earningsData
}: PayoutsDashboardClientProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    panNumber: "",
    dateOfBirth: "",
    address: "",
    bankAccountName: "",
    bankName: "",
    bankAccountNumber: "",
    bankIFSC: "",
    panDocument: "",
    cancelledChequeDocument: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSimulatedUpload = (field: string) => {
    setFormData({ ...formData, [field]: `https://fake-url.com/${field}.pdf` })
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/doctor/payouts/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (!res.ok) throw new Error("Failed to submit payout details")
      
      router.refresh()
    } catch (error) {
      console.error(error)
      alert("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 p-8 bg-[#f8fafc] overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">KYC & Payouts</h1>
          <p className="text-gray-500 mt-1">Manage your verification status, bank details, and settlements.</p>
        </div>

        {/* Admin KYC Status */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">1. Profile Verification (Admin KYC)</h2>
          <div className="flex items-center gap-3">
            {isProfileVerified ? (
              <>
                <span className="flex h-4 w-4 rounded-full bg-green-500"></span>
                <span className="font-semibold text-green-700">Verified</span>
              </>
            ) : (
              <>
                <span className="flex h-4 w-4 rounded-full bg-yellow-400"></span>
                <span className="font-semibold text-yellow-700">Pending Review by Admin</span>
              </>
            )}
          </div>
          {!isProfileVerified && (
            <p className="mt-3 text-sm text-gray-500">Your profile is currently under review. Once approved, you can proceed with the payout setup.</p>
          )}
        </div>

        {/* Payout KYC Status / Form */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">2. Bank & Payout Setup (Payout KYC)</h2>
          
          {!isProfileVerified ? (
            <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-100">
              <p className="text-gray-500">Please wait for your profile verification to complete before setting up payouts.</p>
            </div>
          ) : (
            <>
              {payoutStatus === "UNDER_REVIEW" && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                  <h3 className="text-md font-bold text-amber-900 mb-1">🟡 Verification Pending</h3>
                  <p className="text-amber-700 text-sm">We are verifying your bank and PAN details. This takes 1-2 business days.</p>
                </div>
              )}

              {payoutStatus === "REJECTED" && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6">
                  <h3 className="text-md font-bold text-red-900 mb-1">🔴 Action Required</h3>
                  <p className="text-red-700 text-sm">Your payout verification was rejected. Please update your details below.</p>
                </div>
              )}

              {(payoutStatus === "PENDING" || payoutStatus === "REJECTED") && (
                <div className="space-y-8 mt-4">
                  {/* Identity Section */}
                  <div>
                    <h3 className="text-md font-semibold text-gray-800 mb-4 border-b pb-2">Identity Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name (as per PAN)</label>
                        <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="John Doe" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
                        <input type="text" name="panNumber" value={formData.panNumber} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none uppercase" placeholder="ABCDE1234F" maxLength={10} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                        <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="123 Main St, City, State" />
                      </div>
                    </div>
                  </div>

                  {/* Bank Section */}
                  <div>
                    <h3 className="text-md font-semibold text-gray-800 mb-4 border-b pb-2">Bank Account Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name</label>
                        <input type="text" name="bankAccountName" value={formData.bankAccountName} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="John Doe" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                        <input type="text" name="bankName" value={formData.bankName} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="State Bank of India" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                        <input type="text" name="bankAccountNumber" value={formData.bankAccountNumber} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="1234567890" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
                        <input type="text" name="bankIFSC" value={formData.bankIFSC} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none uppercase" placeholder="SBIN0001234" maxLength={11} />
                      </div>
                    </div>
                  </div>

                  {/* Documents Section */}
                  <div>
                    <h3 className="text-md font-semibold text-gray-800 mb-4 border-b pb-2">Documents</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border-2 border-dashed border-gray-200 rounded-xl text-center">
                        <p className="text-sm font-medium text-gray-900 mb-2">PAN Card Document</p>
                        <button 
                          onClick={() => handleSimulatedUpload("panDocument")}
                          className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${formData.panDocument ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                          {formData.panDocument ? 'Uploaded Successfully' : 'Select File'}
                        </button>
                      </div>
                      <div className="p-4 border-2 border-dashed border-gray-200 rounded-xl text-center">
                        <p className="text-sm font-medium text-gray-900 mb-2">Cancelled Cheque</p>
                        <button 
                          onClick={() => handleSimulatedUpload("cancelledChequeDocument")}
                          className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${formData.cancelledChequeDocument ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                          {formData.cancelledChequeDocument ? 'Uploaded Successfully' : 'Select File'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={handleSubmit}
                      disabled={loading || !formData.panDocument || !formData.cancelledChequeDocument}
                      className="px-8 py-3 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                    >
                      {loading ? "Submitting..." : "Submit Payout Details"}
                    </button>
                  </div>
                </div>
              )}

              {payoutStatus === "VERIFIED" && (
                <div className="flex items-center gap-3">
                  <span className="flex h-4 w-4 rounded-full bg-green-500"></span>
                  <span className="font-semibold text-green-700">Verified & Active</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Earnings Dashboard (Only if Payouts Verified or Under Review) */}
        {(payoutStatus === "VERIFIED" || payoutStatus === "UNDER_REVIEW") && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Earnings & Settlements</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                <div className="text-sm font-medium text-gray-500 mb-1">Total Earnings</div>
                <div className="text-3xl font-extrabold text-gray-900">₹{earningsData.totalEarnings.toLocaleString()}</div>
              </div>
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                <div className="text-sm font-medium text-amber-600 mb-1">Pending Settlement</div>
                <div className="text-3xl font-extrabold text-gray-900">₹{earningsData.pending.toLocaleString()}</div>
              </div>
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                <div className="text-sm font-medium text-green-600 mb-1">Successfully Paid</div>
                <div className="text-3xl font-extrabold text-gray-900">₹{earningsData.paid.toLocaleString()}</div>
              </div>
            </div>
            
            {payoutStatus === "VERIFIED" && (
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm max-w-md">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Active Bank Details</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Bank</span>
                    <span className="font-semibold text-gray-900">HDFC Bank</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Account</span>
                    <span className="font-semibold text-gray-900">•••• 4589</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Next Settlement</span>
                    <span className="font-semibold text-gray-900">{earningsData.nextSettlement}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
