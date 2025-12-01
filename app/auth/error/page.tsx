"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

function ErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")
  
  const errorMessages: Record<string, string> = {
    Configuration: "Network timeout while connecting to Google. Please check your internet connection and try again. If the problem persists, there may be a firewall blocking the connection.",
    AccessDenied: "Access denied. You don't have permission to access this resource.",
    Verification: "The verification token has expired or has already been used.",
    OAuthAccountNotLinked: "This account is already linked to another user.",
    OAuthCallbackError: "There was an error during authentication. Please try again.",
    Default: "There was an error during authentication. Please try again.",
  }
  
  const errorMessage = error ? (errorMessages[error] || errorMessages.Default) : errorMessages.Default
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-blue-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 max-w-md w-full text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Authentication Error
        </h1>
        <p className="text-gray-600 mb-8">
          {errorMessage}
        </p>
        <Link
          href="/auth/signin"
          className="inline-block bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-6 py-3 rounded-lg font-medium hover:from-teal-600 hover:to-emerald-600 transition-all"
        >
          Try Again
        </Link>
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-blue-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 max-w-md w-full text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Authentication Error
        </h1>
        <p className="text-gray-600 mb-8">
          Loading error details...
        </p>
      </div>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ErrorContent />
    </Suspense>
  )
}

