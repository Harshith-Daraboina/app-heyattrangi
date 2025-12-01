import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth.config"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    
    // Allow any authenticated user to fix their own profile, or admin for all
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("🔍 Finding users with DOCTOR role but no doctor profile...")

    // Find all users with DOCTOR role
    const doctorUsers = await prisma.user.findMany({
      where: {
        role: "DOCTOR",
      },
      include: {
        doctor: true,
      },
    })

    console.log(`Found ${doctorUsers.length} users with DOCTOR role`)

    // Find users without doctor profiles
    const usersWithoutProfile = doctorUsers.filter((user) => !user.doctor)

    if (usersWithoutProfile.length === 0) {
      return NextResponse.json({
        success: true,
        message: "All DOCTOR users have profiles!",
        created: 0,
      })
    }

    console.log(`📝 Creating doctor profiles for ${usersWithoutProfile.length} user(s)...`)

    const created = []
    for (const user of usersWithoutProfile) {
      try {
        const doctor = await prisma.doctor.create({
          data: {
            userId: user.id,
            fullName: user.name || "Doctor",
            status: "PENDING",
            consultationFee: 0,
          },
        })

        created.push({
          userId: user.id,
          email: user.email,
          doctorId: doctor.id,
        })

        console.log(`✅ Created doctor profile for user: ${user.email}`)
      } catch (error: any) {
        console.error(`❌ Error creating doctor profile for ${user.email}:`, error.message)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Created ${created.length} doctor profile(s)`,
      created,
      total: usersWithoutProfile.length,
    })
  } catch (error: any) {
    console.error("Error fixing doctor profiles:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fix doctor profiles" },
      { status: 500 }
    )
  }
}

