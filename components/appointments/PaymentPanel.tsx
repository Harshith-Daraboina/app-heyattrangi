"use client"

import { Fragment, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Appointment {
  id: string
  appointmentDate: Date
  status: string
  paymentStatus: string
  doctor: {
    id: string
    fullName: string | null
    consultationFee: number
    appointmentDuration: number | null
    user: {
      name: string | null
      email: string | null
      image: string | null
    }
  }
  patient: {
    id: string
    user: {
      name: string | null
      email: string | null
    }
  } | null
  payment: {
    id: string
    amount: number
    platformFee: number
    doctorAmount: number
    status: string
  } | null
}

interface PaymentPanelProps {
  appointment: Appointment
}

const STEPS = ["Select time", "Review", "Confirm"] as const

export default function PaymentPanel({ appointment }: PaymentPanelProps) {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<string>("razorpay")

  const consultationFee = appointment.doctor.consultationFee
  const platformFee = consultationFee * 0.2 // 20% platform fee
  const totalAmount = consultationFee
  const durationMin = appointment.doctor.appointmentDuration ?? 30

  const handlePayment = async () => {
    setIsProcessing(true)
    try {
      const response = await fetch(`/api/appointments/${appointment.id}/payment/demo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentMethod }),
      })

      if (response.ok) {
        await response.json()
        setPaymentSuccess(true)
        router.refresh()
      } else {
        const error = await response.json()
        alert(error.error || "Payment failed. Please try again.")
      }
    } catch (error) {
      console.error("Error processing payment:", error)
      alert("Payment failed. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const doctorName = appointment.doctor.fullName || appointment.doctor.user.name || "Doctor"
  const apptDate = new Date(appointment.appointmentDate)
  const dateStr = apptDate.toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  })
  const timeStr = apptDate.toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit", hour12: true,
  })

  function stepClass(index: number): string {
    const base = "rounded-full border px-5 py-2 transition-all font-bold text-sm tracking-wide"
    if (paymentSuccess) return `${base} text-[var(--color-brand-dark)] border-[var(--color-brand)] bg-[var(--color-brand-light)]`
    if (index === 0) return `${base} text-gray-400 border-gray-200`
    if (index === 1) return isProcessing ? `${base} text-gray-400 border-gray-200` : `${base} text-[var(--color-brand)] border-[var(--color-brand)] shadow-sm`
    if (index === 2) return isProcessing ? `${base} text-[var(--color-brand)] border-[var(--color-brand)] shadow-sm` : `${base} text-gray-300 border-gray-200`
    return base
  }

  if (paymentSuccess) {
    return (
      <div className="card max-w-2xl mx-auto flex flex-col items-center justify-center p-12 text-center animate-in zoom-in-95 duration-500 shadow-2xl border border-gray-100">
        <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-green-50 text-green-500 border-4 border-green-100">
          <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="mb-4 text-3xl font-black text-gray-800">
          Session Booked Successfully!
        </h2>
        <p className="text-gray-500 mb-8 text-lg font-medium">Your appointment with {doctorName} has been confirmed.</p>
        <Link
          href="/patient/appointments"
          className="inline-block w-full max-w-md rounded-2xl px-8 py-4 text-center font-bold text-white shadow-xl hover:scale-105 active:scale-95 transition-all text-lg bg-gradient-to-r from-[var(--color-brand)] to-[var(--color-brand-dark)]"
        >
          View in Appointments
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-10 max-w-3xl mx-auto pb-20">
      <button
        type="button"
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-800 transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        Back to Therapist Profile
      </button>

      {/* Step indicator */}
      <div className="flex flex-wrap items-center justify-center gap-3 py-4" role="list">
        {STEPS.map((label, index) => (
          <Fragment key={label}>
            {index > 0 && <span className="text-gray-300 font-bold" aria-hidden>→</span>}
            <span className={stepClass(index)} role="listitem">
              {index + 1}. {label}
            </span>
          </Fragment>
        ))}
      </div>

      <div className="grid md:grid-cols-5 gap-8">
        <div className="md:col-span-3 space-y-8">
          <div className="card p-8 shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-xl font-bold border-b border-gray-100 pb-4 text-[var(--color-text-primary)]">
              Session Summary
            </h2>
            <div className="flex items-center gap-4 py-2">
               <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-2xl">
                 {doctorName.charAt(0).toUpperCase()}
               </div>
               <div>
                  <p className="text-sm text-gray-400 font-bold uppercase tracking-wider mb-1">Therapist</p>
                  <p className="text-lg font-black text-gray-800">{doctorName}</p>
               </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6 bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div>
                 <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Date</p>
                 <p className="font-bold text-gray-800">{dateStr}</p>
              </div>
              <div>
                 <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Time</p>
                 <p className="font-bold text-gray-800">{timeStr}</p>
              </div>
              <div>
                 <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Duration</p>
                 <p className="font-bold text-gray-800">{durationMin} min</p>
              </div>
               <div>
                 <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Price</p>
                 <p className="font-bold text-gray-800">₹{totalAmount.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="card p-8 shadow-sm border border-gray-100 space-y-6">
            <h3 className="text-xl font-bold border-b border-gray-100 pb-4 text-[var(--color-text-primary)]">
              Payment Method
            </h3>
            
            <div className="space-y-4">
              <label className={`flex cursor-pointer items-center rounded-2xl border-2 p-4 transition-all ${paymentMethod === "razorpay" ? "border-[var(--color-brand)] bg-[var(--color-brand-light)]" : "border-gray-200 hover:border-gray-300"}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="razorpay"
                  checked={paymentMethod === "razorpay"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="h-5 w-5 accent-[var(--color-brand)]"
                />
                <div className="ml-4 flex-1">
                  <span className={`block font-bold ${paymentMethod === "razorpay" ? "text-[var(--color-brand-dark)]" : "text-gray-800"}`}>
                    Razorpay (Demo)
                  </span>
                  <span className="block text-sm text-[var(--color-text-secondary)] font-medium mt-0.5">
                    UPI, Cards, Net Banking, Wallets
                  </span>
                </div>
              </label>
              
              <label className="flex cursor-not-allowed items-center rounded-2xl border-2 border-gray-200 p-4 opacity-50 bg-gray-50">
                <input type="radio" name="paymentMethod" value="cod" disabled className="h-5 w-5" />
                <div className="ml-4 flex-1">
                  <span className="block font-bold text-gray-800">Other methods</span>
                  <span className="block text-sm text-gray-500 font-medium mt-0.5">Coming soon</span>
                </div>
              </label>
            </div>

            <div className="rounded-2xl border-2 border-blue-100 bg-blue-50 p-5 mt-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 text-blue-500 w-6 h-6">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                </div>
                <div>
                  <p className="font-bold text-blue-900 mb-1">Demo payment mode</p>
                  <p className="text-sm font-medium text-blue-700/80 leading-relaxed">
                    Razorpay integration will be added later. Confirm and pay will simulate a successful payment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="card p-8 shadow-lg border border-gray-100 space-y-6 sticky top-8">
            <h3 className="text-xl font-bold text-[var(--color-text-primary)]">
              Order Details
            </h3>
            
            <div className="space-y-4 font-medium text-gray-600 border-b border-gray-100 pb-6">
              <div className="flex justify-between">
                <span>Consultation fee</span>
                <span className="font-bold text-gray-800">₹{consultationFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform fee</span>
                <span className="font-bold text-gray-800">₹{platformFee.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between text-2xl font-black text-gray-900 py-2">
              <span>Total</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>

            <button
              type="button"
              onClick={handlePayment}
              disabled={isProcessing || appointment.paymentStatus === "PAID"}
              className="w-full py-5 px-6 rounded-2xl font-black text-white text-lg shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-3 bg-gradient-to-r from-[var(--color-brand)] to-[var(--color-brand-dark)]"
            >
              {isProcessing ? (
                <>
                  <svg className="h-6 w-6 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                  Processing...
                </>
              ) : appointment.paymentStatus === "PAID" ? (
                "Payment Completed"
              ) : (
                `Pay ₹${totalAmount.toFixed(2)}`
              )}
            </button>
            <p className="text-center text-xs font-bold text-gray-400 mt-4 uppercase tracking-widest">
              Secure & Encrypted
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
