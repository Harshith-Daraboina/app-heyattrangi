import { NextRequest, NextResponse } from "next/server"
import { signOut } from "@/auth.config"

export async function POST(req: NextRequest) {
  try {
    // Clear all session cookies
    const response = NextResponse.json({ success: true })
    
    // Clear NextAuth cookies
    response.cookies.delete("next-auth.session-token")
    response.cookies.delete("__Secure-next-auth.session-token")
    response.cookies.delete("authjs.session-token")
    response.cookies.delete("__Secure-authjs.session-token")
    
    return response
  } catch (error) {
    console.error("Error clearing session:", error)
    return NextResponse.json({ error: "Failed to clear session" }, { status: 500 })
  }
}

