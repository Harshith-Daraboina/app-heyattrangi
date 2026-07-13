"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

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

type Step = "APPOINTMENT" | "PAYMENT" | "FINISH"

export default function PaymentPanel({ appointment }: PaymentPanelProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<Step>("APPOINTMENT")
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<string>("mastercard")

  const consultationFee = appointment.doctor.consultationFee
  const durationMin = appointment.doctor.appointmentDuration ?? 30
  const doctorName = appointment.doctor.fullName || appointment.doctor.user.name || "Doctor"
  
  const apptDate = new Date(appointment.appointmentDate)
  const dateStr = apptDate.toLocaleDateString("en-US", {
    day: "2-digit", month: "short", year: "numeric"
  })
  const timeStr = apptDate.toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit", hour12: true,
  })

  const handlePayment = async () => {
    setIsProcessing(true)
    // Simulate payment processing
    setTimeout(async () => {
      try {
        const response = await fetch(`/api/appointments/${appointment.id}/payment/demo`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentMethod }),
        })

        if (response.ok) {
          setCurrentStep("FINISH")
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
    }, 1500)
  }

  const steps = [
    { id: "APPOINTMENT", label: "Booking" },
    { id: "PAYMENT", label: "Payment" },
    { id: "FINISH", label: "Finish" },
  ]

  const getStepIndex = (step: Step) => steps.findIndex(s => s.id === step)

  return (
    <div className="max-w-md mx-auto min-h-[80vh] flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 px-4">
        <button onClick={() => router.back()} className="text-gray-400">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <h1 className="text-lg font-bold text-gray-900">
          {currentStep === "APPOINTMENT" && "Booking Appointment"}
          {currentStep === "PAYMENT" && "Payment"}
          {currentStep === "FINISH" && "Finish"}
        </h1>
        <button className="text-gray-400">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        </button>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between px-8 mb-12 relative">
        <div className="absolute top-1/2 left-8 right-8 h-[2px] bg-gray-100 -z-10" />
        <div 
          className="absolute top-1/2 left-8 right-8 h-[2px] bg-orange-500 transition-all duration-500 -z-10" 
          style={{ width: `${(getStepIndex(currentStep) / (steps.length - 1)) * 100}%` }}
        />
        {steps.map((step, idx) => {
          const isActive = step.id === currentStep
          const isCompleted = getStepIndex(currentStep) > idx
          
          return (
            <div key={step.id} className="flex flex-col items-center gap-2">
              <div 
                className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-300
                  ${isActive ? "border-orange-500 bg-white" : isCompleted ? "border-orange-500 bg-orange-500" : "border-gray-200 bg-white"}
                `}
              >
                {isCompleted ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                ) : (
                  <div className={`w-2 h-2 rounded-full ${isActive ? "bg-orange-500" : "bg-transparent"}`} />
                )}
              </div>
              <span className={`text-[10px] font-bold ${isActive || isCompleted ? "text-gray-900" : "text-gray-300"}`}>
                {step.label}
              </span>
            </div>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        {currentStep === "APPOINTMENT" && (
          <motion.div
            key="appointment"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 px-4"
          >
            <div className="relative bg-white rounded-3xl shadow-2xl shadow-gray-200/50 overflow-hidden border border-gray-50">
              {/* Ticket Top Part */}
              <div className="p-8 border-b-2 border-dashed border-gray-100 relative">
                {/* Perforated holes */}
                <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-white rounded-full border border-gray-50" />
                <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-white rounded-full border border-gray-50" />
                
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-black text-gray-900 mb-1">{doctorName}</h2>
                  <p className="text-gray-400 font-medium text-sm">Therapist</p>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center text-gray-900 font-bold">
                    <span className="text-sm">Therapy Session</span>
                    <span className="bg-gray-50 px-3 py-1 rounded-full text-[10px] text-gray-400 uppercase tracking-widest">S_Session</span>
                  </div>

                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Time</p>
                      <p className="text-lg font-black text-gray-900">{timeStr}</p>
                      <p className="text-[10px] text-gray-400 font-bold">{dateStr}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Duration</p>
                      <p className="text-sm font-black text-gray-900">{durationMin} min</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Price</p>
                      <p className="text-lg font-black text-gray-900">₹{consultationFee}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ticket Bottom Part */}
              <div className="p-8 bg-gray-50/30">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Patient Details</p>
                <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center font-black text-xs">
                      {appointment.patient?.user.name?.charAt(0) || "U"}
                    </div>
                    <span className="text-sm font-bold text-gray-900">{appointment.patient?.user.name || "User"}</span>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e5e7eb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </div>
              </div>
            </div>

            <button
              onClick={() => setCurrentStep("PAYMENT")}
              className="w-full mt-12 py-5 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-orange-100 transition-all active:scale-95"
            >
              Proceed to payment
            </button>
          </motion.div>
        )}

        {currentStep === "PAYMENT" && (
          <motion.div
            key="payment"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 px-4"
          >
            {/* Warning Alert */}
            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 mb-8 flex gap-4">
              <div className="w-6 h-6 rounded-full border-2 border-orange-500 flex items-center justify-center text-orange-500 flex-shrink-0">
                <span className="text-[10px] font-black">!</span>
              </div>
              <p className="text-xs font-bold text-orange-700/80 leading-relaxed">
                Please complete payment within 15 minutes, or else your appointment request will be cancelled.
              </p>
            </div>

            {/* Payment Methods Grid */}
            <div className="grid grid-cols-2 gap-4">
              <PaymentMethodCard 
                id="mastercard" 
                selected={paymentMethod === "mastercard"}
                onClick={() => setPaymentMethod("mastercard")}
                logo="/images/payment/mastercard.png"
                label="Mastercard"
              />
              <PaymentMethodCard 
                id="visa" 
                selected={paymentMethod === "visa"}
                onClick={() => setPaymentMethod("visa")}
                logo="/images/payment/visa.png"
                label="Visa"
              />
              <PaymentMethodCard 
                id="payoneer" 
                selected={paymentMethod === "payoneer"}
                onClick={() => setPaymentMethod("payoneer")}
                logo="/images/payment/payoneer.png"
                label="Payoneer"
              />
              <PaymentMethodCard 
                id="applepay" 
                selected={paymentMethod === "applepay"}
                onClick={() => setPaymentMethod("applepay")}
                logo="/images/payment/apple-pay.png"
                label="Apple Pay"
              />
              <PaymentMethodCard 
                id="paypal" 
                selected={paymentMethod === "paypal"}
                onClick={() => setPaymentMethod("paypal")}
                logo="/images/payment/paypal.png"
                label="PayPal"
                className="col-span-1"
              />
            </div>

            <div className="mt-12 text-center text-[10px] font-bold text-gray-400 px-8 leading-relaxed mb-12">
              By clicking <span className="text-gray-900">MAKE PAYMENT</span>, you are agreeing to the Attrangi terms and conditions of care & privacy policy.
            </div>

            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full py-5 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-orange-100 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center"
            >
              {isProcessing ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                "Make payment"
              )}
            </button>
          </motion.div>
        )}

        {currentStep === "FINISH" && (
          <motion.div
            key="finish"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center px-4 -mt-12"
          >
            <div className="relative mb-12">
              {/* Confetti-like shapes (simplified) */}
              <div className="absolute -top-4 -left-4 w-4 h-4 bg-orange-400 rounded-sm rotate-12" />
              <div className="absolute -top-8 right-0 w-3 h-3 bg-red-400 rounded-full" />
              <div className="absolute bottom-0 -right-8 w-4 h-4 bg-green-400 rounded-sm -rotate-12" />
              
              <div className="w-32 h-32 rounded-full bg-green-500 flex items-center justify-center shadow-xl shadow-green-100">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
            </div>

            <h2 className="text-3xl font-black text-gray-900 mb-4">Congratulations!</h2>
            <p className="text-center text-gray-400 font-medium mb-12 px-8">
              Thank you for choosing Attrangi. Your appointment with {doctorName} is successfully booked.
            </p>

            <button
              onClick={() => router.push("/patient/appointments")}
              className="w-full py-5 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-orange-100 transition-all active:scale-95"
            >
              View Appointment
            </button>
            <button
              onClick={() => router.push("/patient/dashboard")}
              className="w-full mt-4 py-5 bg-white border border-gray-100 text-gray-400 rounded-2xl font-bold text-lg shadow-sm hover:bg-gray-50 transition-all active:scale-95"
            >
              Back to home
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function PaymentMethodCard({ id, selected, onClick, logo, label, className = "" }: any) {
  return (
    <button
      onClick={onClick}
      className={`relative h-28 flex flex-col items-center justify-center bg-white rounded-2xl border-2 transition-all p-4 ${
        selected ? "border-orange-500 shadow-md shadow-orange-50" : "border-gray-50 hover:border-gray-200"
      } ${className}`}
    >
      <div className="h-10 w-full flex items-center justify-center mb-2">
        {/* We use labels or simple shapes if images aren't available, but I'll use text for now to be safe */}
        <span className="font-black text-gray-900 text-sm tracking-tight">{label}</span>
      </div>
      {selected && (
        <div className="absolute top-2 left-2 w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center">
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
      )}
    </button>
  )
}
