import { redirect } from "next/navigation"
import { auth } from "@/auth.config"
import { getCurrentUser } from "@/lib/auth"
import DoctorProfileForm from "@/components/profile/DoctorProfileForm"
import DoctorDocumentsSection from "@/components/profile/DoctorDocumentsSection"
import ManageAvailability from "@/components/profile/ManageAvailability"
import ProfilePictureSection from "@/components/profile/ProfilePictureSection"
import Link from "next/link"
import SignOutButton from "@/components/auth/SignOutButton"
import { prisma } from "@/lib/prisma"
import Sidebar from "@/components/doctor/Sidebar"

export default async function DoctorProfilePage() {
  let session
  try {
    session = await auth()
  } catch (error) {
    console.error("Auth error in doctor profile:", error)
    redirect("/auth/signin?error=SessionError")
  }

  if (!session?.user) {
    redirect("/auth/signin")
  }

  let user
  try {
    user = await getCurrentUser()
  } catch (error) {
    console.error("Error fetching user in doctor profile:", error)
    redirect("/auth/signin?error=UserError")
  }

  if (!user || user.role !== "DOCTOR") {
    redirect("/auth/unauthorized")
  }

  // Fetch doctor details with availability
  const doctor = await prisma.doctor.findUnique({
    where: { userId: user.id },
    include: {
      availability: true,
    },
  })

  if (!doctor) {
    redirect("/auth/unauthorized")
  }

  // Combine user and doctor data for the form
  const userWithDoctor = {
    ...user,
    doctor: {
      ...doctor,
      fullName: doctor.fullName,
      gender: doctor.gender,
      dateOfBirth: doctor.dateOfBirth,
      mobileNumber: doctor.mobileNumber,
      currentAddress: doctor.currentAddress,
      city: doctor.city,
      state: doctor.state,
      country: doctor.country,
      bio: doctor.bio,
      specialization: doctor.specialization,
      primarySpecialization: doctor.primarySpecialization,
      yearsOfExperience: doctor.yearsOfExperience,
      consultationFee: doctor.consultationFee,
      languagesSpoken: doctor.languagesSpoken || [],
      preferredAgeGroups: doctor.preferredAgeGroups || [],
      consultationTypes: doctor.consultationTypes || [],
    },
  }

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] text-slate-800 overflow-hidden">
      <Sidebar />
      <div className="flex-1 min-w-0 h-full overflow-y-auto w-full relative">
        <main className="max-w-4xl mx-auto px-4 sm:px-8 py-8 md:py-12 w-full">
          <div className="mb-6">
            <h1 className="text-3xl font-semibold text-gray-800 mb-2">
              Profile Settings
            </h1>
            <p className="text-gray-600">
              Update your personal information and professional details
            </p>
          </div>

          <div className="space-y-6">
            {/* Profile Picture Section */}
            <ProfilePictureSection
              user={user}
              doctor={doctor}
              session={session}
            />

            {user && <DoctorProfileForm user={userWithDoctor} />}

            {/* Documents Section */}
            <DoctorDocumentsSection
              documents={{
                profilePhoto: doctor.profilePhoto,
                licenseDocument: doctor.licenseDocument,
                degreeCertificates: doctor.degreeCertificates || [],
              }}
            />

            {/* Manage Availability Section */}
            <ManageAvailability
              doctorId={doctor.id}
              currentAvailability={doctor.availability}
            />
          </div>
        </main>
      </div>
    </div>
  )
}


