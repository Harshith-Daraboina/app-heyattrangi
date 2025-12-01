import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth.config"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Handle params (Next.js 16 compatibility)
    const resolvedParams = await (params instanceof Promise ? params : Promise.resolve(params))
    const doctorId = resolvedParams.id

    const availability = await prisma.doctorAvailability.findUnique({
      where: { doctorId },
    })

    return NextResponse.json({ availability })
  } catch (error) {
    console.error("Error fetching availability:", error)
    return NextResponse.json(
      { error: "Failed to fetch availability" },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Handle params (Next.js 16 compatibility)
    const resolvedParams = await (params instanceof Promise ? params : Promise.resolve(params))
    const doctorId = resolvedParams.id

    const data = await req.json()

    // Verify doctor owns this profile
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
    })

    if (doctor?.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const availability = await prisma.doctorAvailability.upsert({
      where: { doctorId },
      update: {
        availableDays: data.availableDays || [],
        startTime: data.startTime,
        endTime: data.endTime,
        breaks: data.breaks,
        isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
      },
      create: {
        doctorId,
        availableDays: data.availableDays || [],
        startTime: data.startTime,
        endTime: data.endTime,
        breaks: data.breaks,
        isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
      },
    })

    return NextResponse.json({ availability })
  } catch (error) {
    console.error("Error updating availability:", error)
    return NextResponse.json(
      { error: "Failed to update availability" },
      { status: 500 }
    )
  }
}
