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

    // Handle FormData (for file uploads)
    const formData = await req.formData()
    
    // Debug: Log all form data keys
    console.log("Received form data keys:", Array.from(formData.keys()))
    
    // Parse JSON strings from FormData
    const parseArray = (value: string | null): string[] => {
      if (!value || value === "null" || value === "undefined") return []
      try {
        const parsed = JSON.parse(value)
        return Array.isArray(parsed) ? parsed : []
      } catch (e) {
        console.error("Error parsing array:", value, e)
        return []
      }
    }

    // Parse boolean values
    const parseBoolean = (value: string | null): boolean => {
      if (!value) return false
      return value === "true" || value === true || value === "1"
    }

    // Extract all form fields
    const fullName = formData.get("fullName") as string
    const gender = formData.get("gender") as string
    const dateOfBirth = formData.get("dateOfBirth") as string
    const mobileNumber = formData.get("mobileNumber") as string
    const currentAddress = formData.get("currentAddress") as string
    const city = formData.get("city") as string
    const state = formData.get("state") as string
    const country = formData.get("country") as string || "India"

    // Professional Verification
    const licenseNumber = formData.get("licenseNumber") as string
    const issuingCouncil = formData.get("issuingCouncil") as string
    const digiLockerId = formData.get("digiLockerId") as string
    const useDigiLocker = parseBoolean(formData.get("useDigiLocker") as string)
    const yearsOfExperience = formData.get("yearsOfExperience") as string
    const primarySpecialization = formData.get("primarySpecialization") as string
    const secondarySpecializations = parseArray(formData.get("secondarySpecializations") as string)
    const highestQualification = formData.get("highestQualification") as string
    const bio = formData.get("bio") as string

    // Practice Details
    const languagesSpoken = parseArray(formData.get("languagesSpoken") as string)
    const preferredAgeGroups = parseArray(formData.get("preferredAgeGroups") as string)
    const consultationTypes = parseArray(formData.get("consultationTypes") as string)
    const notAcceptingCases = parseArray(formData.get("notAcceptingCases") as string)

    // Availability
    const appointmentDuration = parseInt(formData.get("appointmentDuration") as string || "30")

    // Payment Details
    const consultationFee = parseFloat(formData.get("consultationFee") as string || "0")
    const payoutMode = formData.get("payoutMode") as string || "UPI"
    const paymentUPI = formData.get("paymentUPI") as string
    const bankAccountName = formData.get("bankAccountName") as string
    const bankAccountNumber = formData.get("bankAccountNumber") as string
    const bankIFSC = formData.get("bankIFSC") as string
    const bankName = formData.get("bankName") as string

    // Compliance
    const telemedicineConsent = parseBoolean(formData.get("telemedicineConsent") as string)
    const privacyAgreement = parseBoolean(formData.get("privacyAgreement") as string)
    const dataSharingPolicy = parseBoolean(formData.get("dataSharingPolicy") as string)
    const platformTerms = parseBoolean(formData.get("platformTerms") as string)
    const declarationSigned = parseBoolean(formData.get("declarationSigned") as string)
    const digitalSignature = formData.get("digitalSignature") as string

    // Handle file uploads to Cloudinary
    let profilePhotoUrl = null
    let licenseDocumentUrl = null
    const degreeCertificateUrls: string[] = []

    try {
      // Handle profile photo upload to Cloudinary
      const profilePhoto = formData.get("profilePhoto") as File | null
      if (profilePhoto && profilePhoto.size > 0) {
        try {
          const bytes = await profilePhoto.arrayBuffer()
          const buffer = Buffer.from(bytes)
          const uploadResult = await uploadFileToCloudinary(
            buffer,
            `attrangi/doctors/${session.user.id}/profile`,
            `${session.user.id}_profile_${Date.now()}`,
            'image'
          )
          profilePhotoUrl = uploadResult.url
          console.log("Profile photo uploaded to Cloudinary:", uploadResult.url)
        } catch (error) {
          console.error("Error uploading profile photo:", error)
        }
      }

      // Handle license document upload to Cloudinary
      const licenseDocument = formData.get("licenseDocument") as File | null
      if (licenseDocument && licenseDocument.size > 0) {
        try {
          const bytes = await licenseDocument.arrayBuffer()
          const buffer = Buffer.from(bytes)
          const uploadResult = await uploadFileToCloudinary(
            buffer,
            `attrangi/doctors/${session.user.id}/documents`,
            `${session.user.id}_license_${Date.now()}`,
            'raw' // PDF/document files
          )
          licenseDocumentUrl = uploadResult.url
          console.log("License document uploaded to Cloudinary:", uploadResult.url)
        } catch (error) {
          console.error("Error uploading license document:", error)
        }
      }

      // Handle degree certificates upload to Cloudinary
      let certIndex = 0
      while (formData.get(`degreeCertificate_${certIndex}`)) {
        const cert = formData.get(`degreeCertificate_${certIndex}`) as File
        if (cert && cert.size > 0) {
          try {
            const bytes = await cert.arrayBuffer()
            const buffer = Buffer.from(bytes)
            const uploadResult = await uploadFileToCloudinary(
              buffer,
              `attrangi/doctors/${session.user.id}/certificates`,
              `${session.user.id}_degree_${certIndex}_${Date.now()}`,
              'raw' // PDF/document files
            )
            degreeCertificateUrls.push(uploadResult.url)
            console.log("Degree certificate uploaded to Cloudinary:", uploadResult.url)
          } catch (error) {
            console.error("Error uploading degree certificate:", error)
          }
        }
        certIndex++
      }
    } catch (fileError) {
      console.error("File upload error:", fileError)
      // Continue even if file upload fails - we'll handle it gracefully
    }

    // Update user with personal information
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        role: "DOCTOR",
        name: fullName,
        image: profilePhotoUrl,
      },
    })

    // Create or update doctor profile with all fields
    // Use upsert to handle case where doctor profile might already exist
    const doctor = await prisma.doctor.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        
        // Personal Information
        fullName,
        profilePhoto: profilePhotoUrl,
        gender,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        mobileNumber,
        currentAddress,
        city,
        state,
        country,
        
        // Professional Verification
        licenseNumber,
        issuingCouncil,
        licenseDocument: licenseDocumentUrl,
        digiLockerId: useDigiLocker ? digiLockerId : null,
        digiLockerVerified: false, // Will be verified by admin
        yearsOfExperience: yearsOfExperience ? parseInt(yearsOfExperience) : null,
        primarySpecialization,
        secondarySpecializations,
        highestQualification,
        degreeCertificates: degreeCertificateUrls,
        bio,
        
        // Practice Details
        languagesSpoken,
        preferredAgeGroups,
        consultationTypes,
        notAcceptingCases,
        
        // Availability
        appointmentDuration,
        
        // Payment Details
        consultationFee,
        payoutMode,
        paymentUPI: payoutMode === "UPI" ? paymentUPI : null,
        bankAccountName: payoutMode === "BANK" ? bankAccountName : null,
        bankAccountNumber: payoutMode === "BANK" ? bankAccountNumber : null,
        bankIFSC: payoutMode === "BANK" ? bankIFSC : null,
        bankName: payoutMode === "BANK" ? bankName : null,
        
        // Compliance
        telemedicineConsent,
        privacyAgreement,
        dataSharingPolicy,
        platformTerms,
        declarationSigned,
        digitalSignature,
        
        // Backward compatibility fields
        specialization: primarySpecialization,
        experience: yearsOfExperience ? parseInt(yearsOfExperience) : null,
        licenseVerified: false,
        status: "PENDING", // Needs admin approval
      },
      update: {
        // Update all fields if doctor profile already exists
        fullName,
        profilePhoto: profilePhotoUrl,
        gender,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        mobileNumber,
        currentAddress,
        city,
        state,
        country,
        licenseNumber,
        issuingCouncil,
        licenseDocument: licenseDocumentUrl,
        digiLockerId: useDigiLocker ? digiLockerId : null,
        digiLockerVerified: false,
        yearsOfExperience: yearsOfExperience ? parseInt(yearsOfExperience) : null,
        primarySpecialization,
        secondarySpecializations,
        highestQualification,
        degreeCertificates: degreeCertificateUrls,
        bio,
        languagesSpoken,
        preferredAgeGroups,
        consultationTypes,
        notAcceptingCases,
        appointmentDuration,
        consultationFee,
        payoutMode,
        paymentUPI: payoutMode === "UPI" ? paymentUPI : null,
        bankAccountName: payoutMode === "BANK" ? bankAccountName : null,
        bankAccountNumber: payoutMode === "BANK" ? bankAccountNumber : null,
        bankIFSC: payoutMode === "BANK" ? bankIFSC : null,
        bankName: payoutMode === "BANK" ? bankName : null,
        telemedicineConsent,
        privacyAgreement,
        dataSharingPolicy,
        platformTerms,
        declarationSigned,
        digitalSignature,
        specialization: primarySpecialization,
        experience: yearsOfExperience ? parseInt(yearsOfExperience) : null,
        licenseVerified: false,
        status: "PENDING",
      },
    })

    // Verify the doctor was created/updated successfully
    const verifyDoctor = await prisma.doctor.findUnique({
      where: { userId: session.user.id },
    })

    if (!verifyDoctor) {
      console.error("Doctor profile not found after creation")
      return NextResponse.json(
        { error: "Failed to create doctor profile" },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      doctorId: doctor.id,
      message: "Onboarding completed successfully"
    })
  } catch (error: any) {
    console.error("Doctor onboarding error:", error)
    
    // Log more details for debugging
    if (error instanceof Error) {
      console.error("Error name:", error.name)
      console.error("Error message:", error.message)
      console.error("Error stack:", error.stack)
    }
    
    return NextResponse.json(
      { error: error.message || "Failed to complete onboarding" },
      { status: 500 }
    )
  }
}
