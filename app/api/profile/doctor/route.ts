import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth.config"
import { prisma } from "@/lib/prisma"

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()
    const {
      fullName,
      gender,
      dateOfBirth,
      mobileNumber,
      currentAddress,
      city,
      state,
      country,
      bio,
      consultationFee,
      profilePhoto,
    } = data

    // Update user
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: fullName || null,
      },
    })

    // Update doctor profile
    const updateData: any = {}
    
    if (fullName !== undefined) updateData.fullName = fullName || null
    if (gender !== undefined) updateData.gender = gender || null
    if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : null
    if (mobileNumber !== undefined) updateData.mobileNumber = mobileNumber || null
    if (currentAddress !== undefined) updateData.currentAddress = currentAddress || null
    if (city !== undefined) updateData.city = city || null
    if (state !== undefined) updateData.state = state || null
    if (country !== undefined) updateData.country = country || "India"
    if (bio !== undefined) updateData.bio = bio || null
    if (consultationFee !== undefined) updateData.consultationFee = consultationFee || null
    if (profilePhoto !== undefined) updateData.profilePhoto = profilePhoto || null

    await prisma.doctor.update({
      where: { userId: session.user.id },
      data: updateData,
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Doctor profile update error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to update profile" },
      { status: 500 }
    )
  }
}


