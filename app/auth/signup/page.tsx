"use client"

import { signIn, useSession, signOut } from "next-auth/react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

type SignupRole = "PATIENT" | "DOCTOR"

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="currentColor"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="currentColor"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="currentColor"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

export default function SignUpPage() {
  const [selectedRole, setSelectedRole] = useState<SignupRole | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const timer = setTimeout(() => {
        checkAndRedirect()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [session, status])

  const checkAndRedirect = async () => {
    try {
      const response = await fetch("/api/auth/check-onboarding")
      const data = await response.json()
      if (data.completed) {
        const role = data.role
        switch (role) {
          case "PATIENT":
          case "CAREGIVER":
            router.push("/patient/dashboard")
            break
          case "DOCTOR":
            router.push("/doctor/dashboard")
            break
          case "ADMIN":
            router.push("/admin/dashboard")
            break
          default:
            break
        }
      }
    } catch (error) {
      console.error("Error checking onboarding:", error)
    }
  }

  const handleGoogleSignUp = async () => {
    if (!selectedRole) return
    setIsLoading(true)
    try {
      await signIn("google", {
        callbackUrl: `/auth/callback?signup=true&role=${selectedRole}`,
        redirect: true,
      })
    } catch (error) {
      console.error("Sign up error:", error)
      setIsLoading(false)
    }
  }

  const signedIn = status === "authenticated" && !!session?.user
  const googleDisabled = isLoading || !selectedRole || signedIn

  const cardBase =
    "cursor-pointer text-left rounded-[var(--radius-md)] p-4 transition-[border-width,background-color,border-color] border-solid"
  const cardUnselected =
    "border border-[var(--color-border)] bg-[var(--color-surface)]"
  const cardSelected =
    "border-2 border-[var(--color-brand)] bg-[var(--color-brand-light)]"

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col items-center px-4 py-12">
      <div
        className="w-full max-w-[440px] mx-auto p-10 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-raised)]"
      >
        <h1
          className="mb-6 text-center text-[var(--color-text-primary)]"
          style={{ fontSize: "var(--text-2xl)", fontWeight: 600 }}
        >
          Create your account
        </h1>

        {signedIn && session?.user ? (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-left">
            <div className="flex items-start gap-3">
              <div className="text-amber-600 text-xl">⚠️</div>
              <div className="flex-1 min-w-0">
                <h2 className="text-sm font-semibold text-amber-800 mb-1">
                  Already Signed In
                </h2>
                <p className="text-sm text-amber-700 mb-3">
                  You&apos;re signed in as{" "}
                  <strong>{session.user.email}</strong>. Sign out to create a
                  different account.
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={async () => {
                      await signOut({ redirect: false })
                      window.location.reload()
                    }}
                    className="text-sm bg-amber-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-amber-700 transition-colors"
                  >
                    Clear Account & Sign Out
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      const response = await fetch("/api/auth/check-onboarding")
                      const data = await response.json()
                      if (data.completed) {
                        const role = data.role
                        switch (role) {
                          case "PATIENT":
                          case "CAREGIVER":
                            router.push("/patient/dashboard")
                            break
                          case "DOCTOR":
                            router.push("/doctor/dashboard")
                            break
                          case "ADMIN":
                            router.push("/admin/dashboard")
                            break
                        }
                      }
                    }}
                    className="text-sm bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    Continue to Home
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={() =>
              setSelectedRole((r) => (r === "PATIENT" ? null : "PATIENT"))
            }
            className={`${cardBase} ${
              selectedRole === "PATIENT" ? cardSelected : cardUnselected
            }`}
          >
            <span className="text-[var(--color-text-primary)] font-medium">
              I am seeking support
            </span>
          </button>
          <button
            type="button"
            onClick={() =>
              setSelectedRole((r) => (r === "DOCTOR" ? null : "DOCTOR"))
            }
            className={`${cardBase} ${
              selectedRole === "DOCTOR" ? cardSelected : cardUnselected
            }`}
          >
            <span className="text-[var(--color-text-primary)] font-medium">
              I am a therapist
            </span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignUp}
          disabled={googleDisabled}
          className="w-full flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            border: "1px solid var(--color-border)",
            background: "white",
            color: "var(--color-text-primary)",
            borderRadius: "var(--radius-md)",
            padding: "12px 24px",
          }}
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 shrink-0"
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
              Signing in...
            </>
          ) : (
            <>
              <GoogleIcon className="w-5 h-5 shrink-0" />
              Continue with Google
            </>
          )}
        </button>

        <div className="mt-6 text-center">
          <Link
            href="/auth/signin"
            className="text-[var(--color-accent)] no-underline hover:opacity-90"
            style={{ fontSize: "var(--text-sm)" }}
          >
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
