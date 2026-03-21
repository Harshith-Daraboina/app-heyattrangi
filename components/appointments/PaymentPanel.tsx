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
  const durationMin =
    appointment.doctor.appointmentDuration ?? 30

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

  const doctorName =
    appointment.doctor.fullName || appointment.doctor.user.name || "Doctor"

  const apptDate = new Date(appointment.appointmentDate)
  const dateStr = apptDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  const timeStr = apptDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })

  function stepClass(index: number): string {
    const base =
      "rounded-full border px-3 py-1.5"
    if (paymentSuccess) {
      return `${base} text-[var(--color-brand)] border-[var(--color-brand)] bg-[var(--color-brand-light)]`
    }
    if (index === 0) {
      return `${base} text-[var(--color-text-secondary)] border-[var(--color-border)]`
    }
    if (index === 1) {
      if (isProcessing) {
        return `${base} text-[var(--color-text-secondary)] border-[var(--color-border)]`
      }
      return `${base} text-[var(--color-brand)] border-[var(--color-brand)] font-medium`
    }
    if (index === 2) {
      if (isProcessing) {
        return `${base} text-[var(--color-brand)] border-[var(--color-brand)] font-medium`
      }
      return `${base} text-[var(--color-border)] border-[var(--color-border)]`
    }
    return base
  }

  if (paymentSuccess) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
        <div
          className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border-2"
          style={{
            borderColor: "var(--color-success)",
            color: "var(--color-success)",
          }}
        >
          <svg
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2
          className="mb-8 text-[var(--color-text-primary)]"
          style={{ fontSize: "var(--text-2xl)", fontWeight: 600 }}
        >
          Session booked!
        </h2>
        <Link
          href="/patient/appointments"
          className="inline-block w-full max-w-[300px] rounded-[var(--radius-md)] px-6 py-3 text-center font-medium text-white transition-opacity hover:opacity-95"
          style={{ background: "var(--color-brand)" }}
        >
          View in appointments
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => router.back()}
        className="border-0 bg-transparent p-0 text-left cursor-pointer"
        style={{
          fontSize: "var(--text-sm)",
          color: "var(--color-text-secondary)",
        }}
      >
        Go back
      </button>

      {/* Step indicator */}
      <div
        className="flex flex-wrap items-center justify-center gap-2 sm:gap-3"
        role="list"
        aria-label="Booking steps"
      >
        {STEPS.map((label, index) => (
          <Fragment key={label}>
            {index > 0 && (
              <span
                className="text-[var(--color-border)]"
                style={{ fontSize: "var(--text-sm)" }}
                aria-hidden
              >
                →
              </span>
            )}
            <span
              className={stepClass(index)}
              style={{ fontSize: "var(--text-sm)" }}
              role="listitem"
            >
              {label}
            </span>
          </Fragment>
        ))}
      </div>

      {/* Session summary */}
      <div
        className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-5"
      >
        <h2
          className="mb-4 text-[var(--color-text-primary)]"
          style={{ fontSize: "var(--text-base)", fontWeight: 600 }}
        >
          Session summary
        </h2>
        <dl className="space-y-3 text-[var(--color-text-secondary)]" style={{ fontSize: "var(--text-base)" }}>
          <div className="flex justify-between gap-4">
            <dt>Therapist</dt>
            <dd className="text-right font-medium text-[var(--color-text-primary)]">
              {doctorName}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>Date</dt>
            <dd className="text-right font-medium text-[var(--color-text-primary)]">
              {dateStr}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>Time</dt>
            <dd className="text-right font-medium text-[var(--color-text-primary)]">
              {timeStr}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>Duration</dt>
            <dd className="text-right font-medium text-[var(--color-text-primary)]">
              {durationMin} min
            </dd>
          </div>
          <div className="flex justify-between gap-4 border-t border-[var(--color-border)] pt-3">
            <dt>Price</dt>
            <dd className="text-right font-semibold text-[var(--color-text-primary)]">
              ₹{totalAmount.toFixed(2)}
            </dd>
          </div>
        </dl>
      </div>

      {/* Payment method + breakdown */}
      <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        <h3
          className="mb-3 text-[var(--color-text-primary)]"
          style={{ fontSize: "var(--text-base)", fontWeight: 600 }}
        >
          Payment
        </h3>
        <div className="mb-6 space-y-3 text-sm">
          <div className="flex justify-between text-[var(--color-text-secondary)]">
            <span>Consultation fee</span>
            <span>₹{consultationFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-[var(--color-text-muted)]">
            <span>Platform fee (20%)</span>
            <span>₹{platformFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t border-[var(--color-border)] pt-3 font-semibold text-[var(--color-text-primary)]">
            <span>Total</span>
            <span>₹{totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <div className="mb-6">
          <label className="mb-3 block font-medium text-[var(--color-text-primary)]" style={{ fontSize: "var(--text-sm)" }}>
            Payment method
          </label>
          <div className="space-y-2">
            <label className="flex cursor-pointer items-center rounded-lg border-2 border-[var(--color-border)] p-3 transition-colors hover:bg-[var(--color-surface-raised)]">
              <input
                type="radio"
                name="paymentMethod"
                value="razorpay"
                checked={paymentMethod === "razorpay"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="h-4 w-4 accent-[var(--color-brand)]"
              />
              <div className="ml-3 flex-1">
                <span className="text-sm font-medium text-[var(--color-text-primary)]">
                  Razorpay (Demo)
                </span>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  UPI, Cards, Net Banking, Wallets
                </p>
              </div>
            </label>
            <label className="flex cursor-not-allowed items-center rounded-lg border-2 border-[var(--color-border)] p-3 opacity-50">
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                disabled
                className="h-4 w-4"
              />
              <div className="ml-3 flex-1">
                <span className="text-sm font-medium text-[var(--color-text-primary)]">
                  Other methods
                </span>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  Coming soon
                </p>
              </div>
            </label>
          </div>
        </div>

        <div className="mb-6 rounded-lg border border-[var(--color-border)] bg-[var(--color-accent-light)] p-4">
          <div className="flex items-start gap-3">
            <div className="text-[var(--color-accent)] text-xl" aria-hidden>
              ℹ️
            </div>
            <div>
              <p className="mb-1 text-sm font-medium text-[var(--color-text-primary)]">
                Demo payment mode
              </p>
              <p className="text-xs text-[var(--color-text-secondary)]">
                This is a demo payment. Razorpay integration will be added later.
                Confirm and pay will simulate a successful payment.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handlePayment}
          disabled={isProcessing || appointment.paymentStatus === "PAID"}
          className="w-full text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            background: "var(--color-brand)",
            padding: "14px",
            borderRadius: "var(--radius-md)",
            fontSize: "var(--text-base)",
            fontWeight: 600,
          }}
        >
          {isProcessing ? (
            <span className="inline-flex items-center justify-center gap-2">
              <svg
                className="h-5 w-5 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Processing…
            </span>
          ) : appointment.paymentStatus === "PAID" ? (
            "Payment completed"
          ) : (
            "Confirm and pay"
          )}
        </button>

        <p className="mt-4 text-center text-xs text-[var(--color-text-muted)]">
          Your payment is secure and encrypted.
        </p>
      </div>
    </div>
  )
}
