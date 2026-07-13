import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth.config"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id || session.user.role !== "DOCTOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const doctor = await prisma.doctor.findUnique({
      where: { userId: session.user.id }
    })

    if (!doctor) {
      // Auto-create basic profile if it doesn't exist but user is DOCTOR
      const newDoctor = await prisma.doctor.create({
        data: {
          userId: session.user.id,
          emailAddress: session.user.email,
          fullName: session.user.name,
          status: "PENDING_PROFILE"
        }
      })
      return NextResponse.json({ success: true, doctor: newDoctor, created: true })
    }

    const body = await req.json()
    const { step, data } = body

    if (step === "PROFILE") {
      // Update professional details
      const updated = await prisma.doctor.update({
        where: { id: doctor.id },
        data: {
          fullName: data.fullName,
          gender: data.gender,
          mobileNumber: data.mobileNumber,
          currentAddress: data.currentAddress,
          city: data.city,
          state: data.state,
          highestQualification: data.highestQualification,
          primarySpecialization: data.primarySpecialization,
          yearsOfExperience: data.yearsOfExperience ? parseInt(data.yearsOfExperience) : null,
          bio: data.bio,
          consultationFee: data.consultationFee ? parseFloat(data.consultationFee) : 0,
          languagesSpoken: data.languagesSpoken || [],
          status: "PENDING_DOCUMENTS"
        }
      })
      return NextResponse.json({ success: true, doctor: updated })
    } 
    
    if (step === "DOCUMENTS") {
      // Update documents
      const updated = await prisma.doctor.update({
        where: { id: doctor.id },
        data: {
          licenseNumber: data.licenseNumber,
          licenseDocument: data.licenseDocument,
          degreeCertificates: data.degreeCertificates || [],
          aadhaarDocument: data.aadhaarDocument,
          panDocument: data.panDocument,
          status: "PENDING_REVIEW"
        }
      })
      return NextResponse.json({ success: true, doctor: updated })
    }

    return NextResponse.json({ error: "Invalid step" }, { status: 400 })
  } catch (error: any) {
    console.error("Error in therapist onboarding:", error)
    return NextResponse.json(
      { error: error.message || "Failed to update profile" },
      { status: 500 }
    )
  }
}
