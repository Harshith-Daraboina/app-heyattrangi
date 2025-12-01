import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Test basic connectivity to Google OAuth endpoints
    const endpoints = [
      "https://accounts.google.com/.well-known/openid-configuration",
      "https://oauth2.googleapis.com/token",
    ]

    const results: Record<string, any> = {}

    for (const endpoint of endpoints) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

        const response = await fetch(endpoint, {
          method: "GET",
          signal: controller.signal,
        } as RequestInit)

        clearTimeout(timeoutId)

        results[endpoint] = {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
          timestamp: new Date().toISOString(),
        }
      } catch (error: any) {
        results[endpoint] = {
          error: error.name,
          message: error.message,
          timestamp: new Date().toISOString(),
        }
      }
    }

    return NextResponse.json({
      success: true,
      networkTests: results,
      recommendations: results["https://oauth2.googleapis.com/token"]?.error
        ? [
            "❌ Cannot reach Google OAuth token endpoint",
            "Check firewall settings",
            "Try a different network (mobile hotspot)",
            "Check if VPN is blocking connections",
            "Verify DNS resolution: nslookup oauth2.googleapis.com",
          ]
        : ["✅ Network connectivity looks good"],
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    )
  }
}

