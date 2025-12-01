"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface Appointment {
  id: string
  appointmentDate: Date
  status: string
  paymentStatus: string
  doctor: {
    id: string
    fullName: string | null
    consultationFee: number
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

export default function PaymentPanel({ appointment }: PaymentPanelProps) {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<string>("razorpay")

  const consultationFee = appointment.doctor.consultationFee
  const platformFee = consultationFee * 0.2 // 20% platform fee
  const totalAmount = consultationFee

  const handlePayment = async () => {
    setIsProcessing(true)
    try {
      // Demo payment processing - replace with Razorpay integration later
      const response = await fetch(`/api/appointments/${appointment.id}/payment/demo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentMethod,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        alert("Payment successful! Your appointment is confirmed.")
        router.push(`/patient/appointments/${appointment.id}`)
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

  const displayPhoto = appointment.doctor.user.image
  const doctorName = appointment.doctor.fullName || appointment.doctor.user.name || "Doctor"

  return (
    <div className="space-y-6">
      {/* Appointment Summary */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Appointment Details</h2>
        
        <div className="flex items-start gap-4 mb-6">
          {displayPhoto && (
            <img
              src={displayPhoto}
              alt={doctorName}
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
            />
          )}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800">{doctorName}</h3>
            <p className="text-sm text-gray-600">{appointment.doctor.user.email}</p>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Appointment Date:</span>
            <span className="font-medium text-gray-800">
              {new Date(appointment.appointmentDate).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Appointment Time:</span>
            <span className="font-medium text-gray-800">
              {new Date(appointment.appointmentDate).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Status:</span>
            <span className={`font-medium ${
              appointment.status === "PENDING" ? "text-orange-600" :
              appointment.status === "CONFIRMED" ? "text-green-600" :
              "text-gray-600"
            }`}>
              {appointment.status}
            </span>
          </div>
        </div>
      </div>

      {/* Payment Summary */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Summary</h2>
        
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-gray-600">
            <span>Consultation Fee</span>
            <span>₹{consultationFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>Platform Fee (20%)</span>
            <span>₹{platformFee.toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-semibold text-gray-800">
            <span>Total Amount</span>
            <span>₹{totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Method Selection (Demo) */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Payment Method
          </label>
          <div className="space-y-2">
            <label className="flex items-center p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="paymentMethod"
                value="razorpay"
                checked={paymentMethod === "razorpay"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-4 h-4 text-teal-600 focus:ring-teal-500"
              />
              <div className="ml-3 flex-1">
                <span className="text-sm font-medium text-gray-800">Razorpay (Demo)</span>
                <p className="text-xs text-gray-500">UPI, Cards, Net Banking, Wallets</p>
              </div>
            </label>
            <label className="flex items-center p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors opacity-50">
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                disabled
                className="w-4 h-4 text-teal-600 focus:ring-teal-500"
              />
              <div className="ml-3 flex-1">
                <span className="text-sm font-medium text-gray-800">Other Methods</span>
                <p className="text-xs text-gray-500">Coming soon</p>
              </div>
            </label>
          </div>
        </div>

        {/* Demo Payment Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="text-blue-600 text-xl">ℹ️</div>
            <div>
              <p className="text-sm font-medium text-blue-800 mb-1">Demo Payment Mode</p>
              <p className="text-xs text-blue-700">
                This is a demo payment. Razorpay integration will be added later. 
                Clicking "Pay Now" will simulate a successful payment.
              </p>
            </div>
          </div>
        </div>

        {/* Pay Button */}
        <button
          onClick={handlePayment}
          disabled={isProcessing || appointment.paymentStatus === "PAID"}
          className="w-full py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl font-semibold hover:from-teal-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing Payment...
            </>
          ) : appointment.paymentStatus === "PAID" ? (
            "Payment Completed"
          ) : (
            `Pay ₹${totalAmount.toFixed(2)}`
          )}
        </button>

        {/* Security Notice */}
        <p className="text-xs text-center text-gray-500 mt-4">
          🔒 Your payment is secure and encrypted. All transactions are processed securely.
        </p>
      </div>
    </div>
  )
}

