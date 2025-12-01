import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth.config"
import { prisma } from "@/lib/prisma"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Handle params (Next.js 16 might pass it as a Promise)
    const resolvedParams = await (params instanceof Promise ? params : Promise.resolve(params))
    const doctorId = resolvedParams.id

    if (!doctorId) {
      return NextResponse.json({ error: "Doctor ID is required" }, { status: 400 })
    }

    const data = await req.json()
    const { status, licenseVerified, notes } = data

    // Verify doctor exists first
    const existingDoctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
    })

    if (!existingDoctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 })
    }

    // Update doctor status
    const doctor = await prisma.doctor.update({
      where: { id: doctorId },
      data: {
        status: status,
        licenseVerified: licenseVerified ?? false,
      },
    })

    // TODO: Store verification notes/history in a separate table if needed

    return NextResponse.json({ 
      success: true,
      doctor 
    })
  } catch (error: any) {
    console.error("Error verifying doctor:", error)
    return NextResponse.json(
      { error: error.message || "Failed to verify doctor" },
      { status: 500 }
    )
  }
}

