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

function RoleIcon({ role, selected }: { role: SignupRole; selected: boolean }) {
  if (role === "PATIENT") {
    return (
      <div className={`w-12 h-12 rounded-full grid place-items-center transition-colors ${selected ? 'bg-[#ebd9fb] text-[#8a63d2]' : 'bg-gray-100 text-gray-400'}`}>
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    )
  }
  return (
    <div className={`w-12 h-12 rounded-full grid place-items-center transition-colors ${selected ? 'bg-[#d6e3cd] text-[#4a5d23]' : 'bg-gray-100 text-gray-400'}`}>
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    </div>
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
          case "CAREGIVER": router.push("/patient/dashboard"); break
          case "DOCTOR": router.push("/doctor/dashboard"); break
          case "ADMIN": router.push("/admin/dashboard"); break
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
  const actionsDisabled = isLoading || signedIn
  const googleDisabled = actionsDisabled || !selectedRole

  return (
    <div className="min-h-screen w-full flex bg-white font-sans">
      {/* Left Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#fff8e7] relative overflow-hidden flex-col justify-between p-12 xl:p-20">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#f4b860 2px, transparent 2px)", backgroundSize: "30px 30px" }}></div>

        <div className="relative z-10 w-14 h-14 rounded-2xl bg-gray-900 grid place-items-center shadow-xl">
          <span className="text-white text-3xl font-black">A</span>
        </div>

        <div className="relative z-10 my-auto">
          <h1 className="text-5xl xl:text-[64px] font-black text-gray-900 leading-[1.05] tracking-tight mb-6">
            Begin your<br />journey to<br />wellbeing.
          </h1>
          <p className="text-lg xl:text-xl font-medium text-gray-700 max-w-md leading-relaxed">
            Join Attrangi to access personalized care, secure therapy sessions, and a supportive community.
          </p>
        </div>

        {/* Abstract Illustration */}
        <div className="relative z-10 w-full h-48 mt-12 pl-10 flex items-end">
          {/* Abstract Sun/Moon shape */}
          <div className="w-32 h-32 bg-[#ffcfa3] rounded-full absolute bottom-16 -left-8 filter blur-lg opacity-60"></div>
          <div className="w-48 h-24 bg-[#6a805d] rounded-t-full relative z-20 border-b-4 border-[#4a5d23]"></div>
          <div className="w-16 h-40 bg-[#e5c6f5] rounded-t-full ml-4 relative z-10 border-l-4 border-[#cda2e3]"></div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 bg-white relative">
        <div className="w-full max-w-[460px]">
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Create your account</h2>
            <p className="text-gray-500 font-medium">Select your role to get started with Attrangi.</p>
          </div>

          {signedIn && session?.user ? (
            <div className="mb-8 w-full p-5 bg-[#fff8e7] border border-[#f4b860]/30 rounded-2xl text-left shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#f4b860]/20 flex items-center justify-center shrink-0">
                  <span className="text-[#d89332] text-xl">⚠️</span>
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <h3 className="text-sm font-bold text-gray-900 mb-1">
                    Already Signed In
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    You're signed in as <strong className="text-gray-900">{session.user.email}</strong>.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={async () => {
                        await signOut({ redirect: false })
                        window.location.reload()
                      }}
                      className="text-sm bg-gray-100 text-gray-700 px-5 py-2.5 rounded-xl font-bold hover:bg-gray-200 transition-colors shadow-sm text-center"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Role Selection Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setSelectedRole((r) => (r === "PATIENT" ? null : "PATIENT"))}
                  className={`relative overflow-hidden group text-left p-5 rounded-[24px] border-2 transition-all duration-300 ${selectedRole === "PATIENT"
                      ? 'border-[#8a63d2] bg-white shadow-[0_8px_30px_rgb(138,99,210,0.12)] -translate-y-1'
                      : 'border-gray-100 bg-gray-50 hover:bg-gray-100 hover:border-gray-200'
                    }`}
                >
                  <div className={`absolute top-0 left-0 w-1.5 h-full transition-colors ${selectedRole === "PATIENT" ? 'bg-[#8a63d2]' : 'bg-transparent'}`}></div>
                  <RoleIcon role="PATIENT" selected={selectedRole === "PATIENT"} />
                  <h3 className={`mt-4 font-bold text-lg mb-1 transition-colors ${selectedRole === "PATIENT" ? 'text-[#8a63d2]' : 'text-gray-900'}`}>I am seeking support</h3>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed">Find therapy, join check-ins, and track wellbeing.</p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole((r) => (r === "DOCTOR" ? null : "DOCTOR"))}
                  className={`relative overflow-hidden group text-left p-5 rounded-[24px] border-2 transition-all duration-300 ${selectedRole === "DOCTOR"
                      ? 'border-[#4a5d23] bg-white shadow-[0_8px_30px_rgb(74,93,35,0.12)] -translate-y-1'
                      : 'border-gray-100 bg-gray-50 hover:bg-gray-100 hover:border-gray-200'
                    }`}
                >
                  <div className={`absolute top-0 left-0 w-1.5 h-full transition-colors ${selectedRole === "DOCTOR" ? 'bg-[#4a5d23]' : 'bg-transparent'}`}></div>
                  <RoleIcon role="DOCTOR" selected={selectedRole === "DOCTOR"} />
                  <h3 className={`mt-4 font-bold text-lg mb-1 transition-colors ${selectedRole === "DOCTOR" ? 'text-[#4a5d23]' : 'text-gray-900'}`}>I am a therapist</h3>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed">Manage practice, connect with patients securely.</p>
                </button>
              </div>

              <div className="space-y-4">
                <button
                  type="button"
                  onClick={handleGoogleSignUp}
                  disabled={googleDisabled}
                  className={`w-full flex items-center justify-center gap-3 transition-all rounded-[20px] py-4 shadow-sm font-bold text-base border-2 ${!selectedRole
                      ? 'bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed'
                      : 'bg-white text-gray-900 border-gray-200 hover:border-gray-300 hover:shadow-md cursor-pointer group'
                    }`}
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <GoogleIcon className={`w-6 h-6 ${selectedRole ? 'group-hover:scale-110 transition-transform text-[#ea4335]' : 'text-gray-400'}`} />
                      <span>{selectedRole ? 'Continue with Google' : 'Select a role to continue'}</span>
                    </>
                  )}
                </button>

                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-gray-200"></div>
                  <span className="flex-shrink-0 mx-4 text-gray-400 text-sm font-semibold uppercase tracking-widest">or</span>
                  <div className="flex-grow border-t border-gray-200"></div>
                </div>

                <Link
                  href="/auth/signin"
                  className="w-full flex items-center justify-center gap-3 bg-gray-900 text-white hover:bg-gray-800 transition-all rounded-[20px] py-4 shadow-md hover:shadow-lg font-bold text-base"
                >
                  Sign in instead
                </Link>
              </div>
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
