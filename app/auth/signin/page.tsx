"use client"

import { signIn, useSession, signOut } from "next-auth/react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

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

export default function SignInPage() {
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

  const handleDirectSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn("google", {
        callbackUrl: "/auth/callback",
        redirect: true,
      })
    } catch (error) {
      console.error("Sign in error:", error)
      setIsLoading(false)
    }
  }

  const signedIn = status === "authenticated" && !!session?.user
  const actionsDisabled = isLoading || signedIn

  return (
    <div className="min-h-screen w-full flex bg-white font-sans">
      {/* Left Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#ece8fc] relative overflow-hidden flex-col justify-between p-12 xl:p-20">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#8a63d2 2px, transparent 2px)", backgroundSize: "30px 30px" }}></div>

        <div className="relative z-10 w-14 h-14 rounded-2xl bg-gray-900 grid place-items-center shadow-xl">
          <span className="text-white text-3xl font-black">A</span>
        </div>

        <div className="relative z-10 my-auto">
          <h1 className="text-5xl xl:text-[64px] font-black text-gray-900 leading-[1.05] tracking-tight mb-6">
            Your mind<br />deserves a<br />companion.
          </h1>
          <p className="text-lg xl:text-xl font-medium text-gray-700 max-w-md leading-relaxed">
            Hey Attrangi supports your mental wellbeing — with AI, with therapists, and with you at the centre.
          </p>
        </div>

        {/* Abstract Illustration */}
        <div className="relative z-10 w-full h-48 mt-12 pl-10 flex items-end">
          <div className="w-48 h-12 bg-[#ffccb3] rounded-t-full relative z-20 border-b-4 border-[#ffb38a]"></div>
          <div className="w-16 h-32 bg-[#a3b8f7] rounded-t-full -ml-8 relative z-10 border-r-4 border-[#85a1f2]"></div>
          <div className="w-24 h-40 bg-[#d1a080] rounded-t-full -ml-4 relative shadow-lg"></div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 bg-white relative">
        <div className="w-full max-w-[420px]">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Welcome back</h2>
            <p className="text-gray-500 font-medium">Log in to continue your mental wellness journey.</p>
          </div>

          {signedIn && session?.user ? (
            <div className="mb-8 w-full p-5 bg-[#fff8e7] border border-[#f4b860]/30 rounded-2xl text-left shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#f4b860]/20 flex items-center justify-center shrink-0">
                  <span className="text-[#d89332] text-xl">👋</span>
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <h3 className="text-sm font-bold text-gray-900 mb-1">
                    Already Signed In
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    You're currently signed in as <strong className="text-gray-900">{session.user.email}</strong>.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={async () => {
                        const response = await fetch("/api/auth/check-onboarding")
                        const data = await response.json()
                        if (data.completed) {
                          const role = data.role
                          switch (role) {
                            case "PATIENT":
                            case "CAREGIVER": router.push("/patient/dashboard"); break
                            case "DOCTOR": router.push("/doctor/dashboard"); break
                            case "ADMIN": router.push("/admin/dashboard"); break
                          }
                        }
                      }}
                      className="text-sm bg-gray-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-md w-full sm:w-auto text-center"
                    >
                      Continue to App
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        await signOut({ redirect: false })
                        window.location.reload()
                      }}
                      className="text-sm bg-gray-100 text-gray-700 px-5 py-2.5 rounded-xl font-bold hover:bg-gray-200 transition-colors w-full sm:w-auto text-center"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <button
                type="button"
                onClick={handleDirectSignIn}
                disabled={actionsDisabled}
                className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 border-2 border-gray-200 hover:border-gray-300 transition-all rounded-[20px] py-4 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <GoogleIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-base">Continue with Google</span>
                  </>
                )}
              </button>

              <div className="relative flex items-center py-4">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink-0 mx-4 text-gray-400 text-sm font-semibold uppercase tracking-widest">New here?</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              <Link
                href="/auth/signup"
                className="w-full flex items-center justify-center gap-3 bg-gray-900 text-white hover:bg-gray-800 transition-all rounded-[20px] py-4 shadow-lg hover:shadow-xl font-bold text-base"
              >
                Create an account
              </Link>
            </div>
          )}

          <p className="mt-12 text-center text-[13px] font-medium text-gray-400 max-w-sm mx-auto">
            By continuing, you agree to our <Link href="#" className="text-gray-700 underline underline-offset-2">Terms of Service</Link> and <Link href="#" className="text-gray-700 underline underline-offset-2">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
