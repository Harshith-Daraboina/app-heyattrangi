"use client"

import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function SignOutButton() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      // Call API to clear server-side session
      await fetch("/api/auth/clear-session", { method: "POST" })

      // Clear all cookies manually
      document.cookie.split(";").forEach((c) => {
        const cookieName = c.split("=")[0].trim()
        // Clear cookie for current path
        document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
        // Clear cookie for root path
        document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;domain=${window.location.hostname};`
      })

      // Sign out from NextAuth
      await signOut({ 
        callbackUrl: "/",
        redirect: false 
      })

      // Wait a moment for cookies to clear
      await new Promise(resolve => setTimeout(resolve, 100))

      // Force full page reload to clear all session data
      window.location.href = "/"
    } catch (error) {
      console.error("Sign out error:", error)
      // Force redirect even on error
      window.location.href = "/"
    }
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={isLoading}
      className="text-sm text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
    >
      {isLoading ? "Signing out..." : "Sign Out"}
    </button>
  )
}

