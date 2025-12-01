import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth.config"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()
    const { doctorId, availableDays, startTime, endTime, isAvailable, breaks } = data

    // Verify the doctor belongs to the current user
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
    })

    if (!doctor || doctor.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Create or update availability
    const availability = await prisma.doctorAvailability.upsert({
      where: { doctorId },
      create: {
        doctorId,
        availableDays: availableDays || [],
        startTime: startTime || null,
        endTime: endTime || null,
        isAvailable: isAvailable ?? true,
        breaks: breaks || null,
      },
      update: {
        availableDays: availableDays || [],
        startTime: startTime || null,
        endTime: endTime || null,
        isAvailable: isAvailable ?? true,
        breaks: breaks || null,
      },
    })

    return NextResponse.json({ success: true, availability })
  } catch (error: any) {
    console.error("Error updating availability:", error)
    return NextResponse.json(
      { error: error.message || "Failed to update availability" },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const doctorId = searchParams.get("doctorId")

    if (!doctorId) {
      return NextResponse.json({ error: "Doctor ID required" }, { status: 400 })
    }

    // Verify the doctor belongs to the current user
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
    })

    if (!doctor || doctor.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const availability = await prisma.doctorAvailability.findUnique({
      where: { doctorId },
    })

    return NextResponse.json({ availability })
  } catch (error: any) {
    console.error("Error fetching availability:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch availability" },
      { status: 500 }
    )
  }
}

