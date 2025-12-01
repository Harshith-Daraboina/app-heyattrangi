import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth.config"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    const searchParams = req.nextUrl.searchParams
    const category = searchParams.get("category")
    const premiumParam = searchParams.get("premium")

    const where: any = {
      status: "ACTIVE",
    }

    if (category) {
      where.category = category
    }

    // If user is not authenticated, only show free resources
    if (!session) {
      where.isPremium = false
    } else {
      // Check if user has access to premium resources
      if (premiumParam !== null) {
        where.isPremium = premiumParam === "true"
      }
    }

    const resources = await prisma.resource.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ resources })
  } catch (error) {
    console.error("Error fetching resources:", error)
    return NextResponse.json(
      { error: "Failed to fetch resources" },
      { status: 500 }
    )
  }
}

