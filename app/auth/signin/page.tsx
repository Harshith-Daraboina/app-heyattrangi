"use client"

import { signIn, useSession, signOut } from "next-auth/react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { UserRole } from "@prisma/client"
import Link from "next/link"

export default function SignInPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [mode, setMode] = useState<"signin" | "signup">("signin")
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    // If user is already signed in and has completed onboarding, redirect after a delay
    // This gives them time to see the clear account warning if they want to switch
    if (status === "authenticated" && session?.user) {
      const timer = setTimeout(() => {
        checkAndRedirect()
      }, 2000) // 2 second delay to show warning

      return () => clearTimeout(timer)
    }
  }, [session, status])

  const checkAndRedirect = async () => {
    try {
      const response = await fetch("/api/auth/check-onboarding")
      const data = await response.json()
      
      if (data.completed) {
        // User has completed onboarding, redirect to dashboard
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
            // If no role or onboarding not complete, stay on page
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
      const result = await signIn("google", {
        callbackUrl: "/auth/callback",
        redirect: true,
      })
    } catch (error) {
      console.error("Sign in error:", error)
      setIsLoading(false)
    }
  }

  const handleSignUp = async () => {
    if (!selectedRole) {
      alert("Please select a user type")
      return
    }

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

  const roles = [
    {
      value: "PATIENT" as UserRole,
      title: "Patient",
      description: "Access therapy, resources, and track your wellness journey",
      icon: "🧘",
      color: "from-teal-50 to-emerald-50",
      borderColor: "border-teal-200",
    },
    {
      value: "CAREGIVER" as UserRole,
      title: "Caregiver",
      description: "Support your loved one's mental health journey",
      icon: "🤝",
      color: "from-purple-50 to-pink-50",
      borderColor: "border-purple-200",
    },
    {
      value: "DOCTOR" as UserRole,
      title: "Doctor/Therapist",
      description: "Provide care and manage your practice",
      icon: "👩‍⚕️",
      color: "from-blue-50 to-cyan-50",
      borderColor: "border-blue-200",
    },
    {
      value: "ADMIN" as UserRole,
      title: "Admin",
      description: "Manage platform operations",
      icon: "⚙️",
      color: "from-gray-50 to-slate-50",
      borderColor: "border-gray-200",
    },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-semibold text-gray-800 mb-2">
            Welcome to Attrangi
          </h1>
          <p className="text-lg text-gray-600">
            Sign in to your account or create a new one
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          {/* Mode Toggle */}
          <div className="flex gap-2 mb-8 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => {
                setMode("signin")
                setSelectedRole(null)
              }}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                mode === "signin"
                  ? "bg-white text-gray-800 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMode("signup")
                setSelectedRole(null)
              }}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                mode === "signup"
                  ? "bg-white text-gray-800 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Sign Up
            </button>
          </div>

          {mode === "signin" ? (
            // Direct Sign In (for existing users)
            <div>
              {status === "authenticated" && session?.user ? (
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="text-amber-600 text-xl">⚠️</div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-amber-800 mb-1">
                        Already Signed In
                      </h3>
                      <p className="text-sm text-amber-700 mb-3">
                        You're currently signed in as <strong>{session.user.email}</strong>. 
                        To sign in with a different account, please clear your current session first.
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={async () => {
                            await signOut({ redirect: false })
                            window.location.reload()
                          }}
                          className="text-sm bg-amber-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-amber-700 transition-colors"
                        >
                          Clear Account & Sign Out
                        </button>
                        <button
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
                          Continue to Dashboard
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600 mb-6 text-center">
                  Already have an account? Sign in with Google to continue.
                </p>
              )}
              <button
                onClick={handleDirectSignIn}
                disabled={isLoading || (status === "authenticated" && !!session?.user)}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white py-3 px-6 rounded-xl font-medium hover:from-teal-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
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
                    Sign in with Google
                  </>
                )}
              </button>
            </div>
          ) : (
            // Sign Up (for new users - select role first)
            <div>
              {status === "authenticated" && session?.user ? (
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="text-amber-600 text-xl">⚠️</div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-amber-800 mb-1">
                        Already Signed In
                      </h3>
                      <p className="text-sm text-amber-700 mb-3">
                        You're currently signed in as <strong>{session.user.email}</strong>. 
                        To create a new account, please clear your current session first.
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={async () => {
                            await signOut({ redirect: false })
                            window.location.reload()
                          }}
                          className="text-sm bg-amber-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-amber-700 transition-colors"
                        >
                          Clear Account & Sign Out
                        </button>
                        <button
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
                          Continue to Dashboard
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600 mb-6 text-center">
                  New to Attrangi? Select your role and create an account.
                </p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {roles.map((role) => (
                  <button
                    key={role.value}
                    onClick={() => setSelectedRole(role.value)}
                    className={`
                      p-4 rounded-xl border-2 transition-all text-left
                      ${
                        selectedRole === role.value
                          ? `${role.borderColor} border-2 bg-gradient-to-br ${role.color} shadow-md scale-105`
                          : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                      }
                    `}
                  >
                    <div className="text-2xl mb-2">{role.icon}</div>
                    <h3 className="text-base font-semibold text-gray-800 mb-1">
                      {role.title}
                    </h3>
                    <p className="text-xs text-gray-600">{role.description}</p>
                  </button>
                ))}
              </div>

              <button
                onClick={handleSignUp}
                disabled={!selectedRole || isLoading || (status === "authenticated" && !!session?.user)}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white py-3 px-6 rounded-xl font-medium hover:from-teal-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating account...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
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
                    Sign up with Google
                  </>
                )}
              </button>
            </div>
          )}

          <p className="mt-6 text-center text-sm text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}
