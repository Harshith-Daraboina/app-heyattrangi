import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth.config"
import { prisma } from "@/lib/prisma"
import { uploadFileToCloudinary } from "@/lib/cloudinary"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("photo") as File | null

    if (!file || !file.size) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Convert File to Buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Cloudinary
    const uploadResult = await uploadFileToCloudinary(
      buffer,
      `attrangi/doctors/${session.user.id}/profile`,
      `${session.user.id}_profile_${Date.now()}`,
      'image'
    )

    // Update doctor profile with new photo URL
    await prisma.doctor.update({
      where: { userId: session.user.id },
      data: {
        profilePhoto: uploadResult.url,
      },
    })

    // Also update user image
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        image: uploadResult.url,
      },
    })

    return NextResponse.json({ 
      success: true,
      url: uploadResult.url 
    })
  } catch (error: any) {
    console.error("Error uploading profile photo:", error)
    return NextResponse.json(
      { error: error.message || "Failed to upload profile photo" },
      { status: 500 }
    )
  }
}

