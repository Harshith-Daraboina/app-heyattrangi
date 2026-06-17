import { NextResponse } from "next/server"
import { SignJWT } from "jose"
import { auth } from "@/auth.config"

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { roomName } = await req.json()

    if (!roomName) {
      return NextResponse.json({ error: "roomName is required" }, { status: 400 })
    }

    const secret = process.env.NEXTAUTH_SECRET
    if (!secret) {
      return NextResponse.json({ error: "Server misconfigured" }, { status: 500 })
    }

    const secretKey = new TextEncoder().encode(secret)

    // Sign a short-lived token (5 minutes) with the user's identity
    const token = await new SignJWT({
      userId: session.user.id,
      name: session.user.name ?? "Anonymous",
      email: session.user.email ?? "",
      role: session.user.role ?? "PATIENT",
      roomName,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("5m")
      .setIssuer("hey-attrangi-app")
      .setAudience("hey-attrangi-meet")
      .sign(secretKey)

    return NextResponse.json({ token })
  } catch (error) {
    console.error("Error generating meet token:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
