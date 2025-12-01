import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const specialization = searchParams.get("specialization")
    const search = searchParams.get("search")

    const where: any = {
      status: "APPROVED",
    }

    if (specialization) {
      where.specialization = specialization
    }

    // Note: MongoDB text search is simplified - filtering by specialization only
    // For full-text search, consider implementing MongoDB text indexes or use a search service

    const doctors = await prisma.doctor.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
        availability: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ doctors })
  } catch (error) {
    console.error("Error fetching doctors:", error)
    return NextResponse.json(
      { error: "Failed to fetch doctors" },
      { status: 500 }
    )
  }
}

