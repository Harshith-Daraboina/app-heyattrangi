"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

export default function DoctorOnboarding() {
  const router = useRouter()
  const { data: session } = useSession()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [mobileOTP, setMobileOTP] = useState("")
  const [otpSent, setOtpSent] = useState(false)

  // Set email from session (stored separately, not in formData)
  // Email is already available from session.user.email
  
  const [formData, setFormData] = useState({
    // Section 1: Personal Information
    fullName: "",
    profilePhoto: null as File | null,
    gender: "",
    dateOfBirth: "",
    mobileNumber: "",
    currentAddress: "",
    city: "",
    state: "",
    country: "India",
    
    // Section 2: Professional Verification
    licenseNumber: "",
    issuingCouncil: "",
    licenseDocument: null as File | null,
    digiLockerId: "",
    useDigiLocker: false,
    yearsOfExperience: "",
    primarySpecialization: "",
    secondarySpecializations: [] as string[],
    highestQualification: "",
    degreeCertificates: [] as File[],
    bio: "",
    
    // Section 3: Practice Details
    languagesSpoken: [] as string[],
    preferredAgeGroups: [] as string[],
    consultationTypes: [] as string[],
    notAcceptingCases: [] as string[],
    
    // Section 4: Availability & Scheduling
    appointmentDuration: "30",
    
    // Section 5: Payment Details
    consultationFee: "",
    payoutMode: "UPI",
    paymentUPI: "",
    bankAccountName: "",
    bankAccountNumber: "",
    bankIFSC: "",
    bankName: "",
    
    // Section 6: Compliance & Legal
    telemedicineConsent: false,
    privacyAgreement: false,
    dataSharingPolicy: false,
    platformTerms: false,
    declarationSigned: false,
    digitalSignature: "",
  })

  const specializations = [
    "Psychiatrist",
    "Clinical Psychologist",
    "Counsellor",
    "Therapist",
    "Behavioral Therapist",
  ]

  const secondarySpecializations = [
    "Anxiety disorders",
    "Depression",
    "Autism",
    "Couples therapy",
    "Trauma therapy",
    "Addiction",
  ]

  const qualifications = [
    "MBBS",
    "MD Psychiatry",
    "MPhil Clinical Psychology",
    "PhD Psychology",
    "M.A. Psychology",
  ]

  const languages = ["English", "Hindi", "Bengali", "Tamil", "Telugu", "Marathi", "Gujarati", "Kannada", "Malayalam", "Other"]

  const ageGroups = ["Kids", "Teens", "Adults", "Seniors"]

  const consultationTypesOptions = ["Video", "Chat", "Voice", "In-person"]

  const notAcceptingCasesOptions = [
    "Emergency / crisis cases",
    "Prescription for controlled substances",
    "Severe psychiatric emergencies",
  ]

  const handleSendOTP = async () => {
    if (!formData.mobileNumber || formData.mobileNumber.length !== 10) {
      alert("Please enter a valid 10-digit mobile number")
      return
    }
    
    try {
      // TODO: Implement OTP sending API
      // const response = await fetch("/api/auth/send-otp", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ mobile: formData.mobileNumber }),
      // })
      setOtpSent(true)
      alert("OTP sent to your mobile number")
    } catch (error) {
      console.error("Error sending OTP:", error)
      alert("Failed to send OTP. Please try again.")
    }
  }

  const handleVerifyOTP = async () => {
    if (!mobileOTP || mobileOTP.length !== 6) {
      alert("Please enter a valid 6-digit OTP")
      return
    }
    
    try {
      // TODO: Implement OTP verification API
      // const response = await fetch("/api/auth/verify-otp", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ mobile: formData.mobileNumber, otp: mobileOTP }),
      // })
      alert("Mobile number verified successfully!")
      setOtpSent(false)
    } catch (error) {
      console.error("Error verifying OTP:", error)
      alert("Invalid OTP. Please try again.")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate all compliance checkboxes
    if (!formData.telemedicineConsent || !formData.privacyAgreement || 
        !formData.dataSharingPolicy || !formData.platformTerms || 
        !formData.declarationSigned) {
      alert("Please accept all compliance agreements to continue")
      return
    }

    if (!formData.digitalSignature) {
      alert("Please enter your full name as digital signature")
      return
    }

    setIsLoading(true)

    try {
      // Create FormData for file uploads
      const submitData = new FormData()
      
      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "profilePhoto" || key === "licenseDocument" || key === "degreeCertificates") {
          // Files will be handled separately
          return
        }
        if (Array.isArray(value)) {
          submitData.append(key, JSON.stringify(value))
        } else if (typeof value === "boolean") {
          submitData.append(key, value ? "true" : "false")
        } else if (value !== null && value !== undefined) {
          submitData.append(key, String(value))
        }
      })

      // Append files
      if (formData.profilePhoto) {
        submitData.append("profilePhoto", formData.profilePhoto)
      }
      if (formData.licenseDocument) {
        submitData.append("licenseDocument", formData.licenseDocument)
      }
      formData.degreeCertificates.forEach((file, index) => {
        submitData.append(`degreeCertificate_${index}`, file)
      })

      const response = await fetch("/api/onboarding/doctor", {
        method: "POST",
        body: submitData,
      })

      if (response.ok) {
        // Force a page reload to refresh the session
        window.location.href = "/doctor/dashboard"
      } else {
        const error = await response.json()
        alert(error.error || "Error completing onboarding. Please try again.")
      }
    } catch (error) {
      console.error("Onboarding error:", error)
      alert("Error completing onboarding. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleArrayItem = (field: keyof typeof formData, value: string) => {
    const current = formData[field] as string[]
    if (current.includes(value)) {
      updateFormData(field, current.filter(item => item !== value))
    } else {
      updateFormData(field, [...current, value])
    }
  }

  // Section 1: Personal Information
  if (step === 1) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-semibold text-gray-800">
              Personal Information
            </h1>
            <span className="text-sm text-gray-500">Step 1 of 6</span>
          </div>
          <p className="text-gray-600">
            These confirm the doctor's identity.
          </p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name (as per license) *
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => updateFormData("fullName", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Photo *
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => updateFormData("profilePhoto", e.target.files?.[0] || null)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender *
              </label>
              <select
                value={formData.gender}
                onChange={(e) => updateFormData("gender", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth *
              </label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => updateFormData("dateOfBirth", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number (OTP verification) *
              </label>
              <div className="flex gap-2">
                <input
                  type="tel"
                  maxLength={10}
                  value={formData.mobileNumber}
                  onChange={(e) => updateFormData("mobileNumber", e.target.value.replace(/\D/g, ""))}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="10 digit number"
                  required
                  disabled={otpSent}
                />
                {!otpSent ? (
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                  >
                    Send OTP
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Change
                  </button>
                )}
              </div>
              {otpSent && (
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={mobileOTP}
                    onChange={(e) => setMobileOTP(e.target.value.replace(/\D/g, ""))}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    placeholder="Enter OTP"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOTP}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Verify
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={session?.user?.email || ""}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
              />
              <p className="text-xs text-gray-500 mt-1">From Google login</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Address *
            </label>
            <textarea
              value={formData.currentAddress}
              onChange={(e) => updateFormData("currentAddress", e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => updateFormData("city", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State *
              </label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => updateFormData("state", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country *
              </label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => updateFormData("country", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-teal-500 to-emerald-500 text-white py-3 px-6 rounded-xl font-medium hover:from-teal-600 hover:to-emerald-600 transition-all shadow-md hover:shadow-lg"
            >
              Continue to Professional Verification →
            </button>
          </div>
        </form>
      </div>
    )
  }

  // Section 2: Professional Verification
  if (step === 2) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-semibold text-gray-800">
              Professional Verification
            </h1>
            <span className="text-sm text-gray-500">Step 2 of 6</span>
          </div>
          <p className="text-gray-600">Most important section - verify your credentials</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); setStep(3); }} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medical License Number / Registration Number *
              </label>
              <input
                type="text"
                value={formData.licenseNumber}
                onChange={(e) => updateFormData("licenseNumber", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Issuing Council *
              </label>
              <input
                type="text"
                value={formData.issuingCouncil}
                onChange={(e) => updateFormData("issuingCouncil", e.target.value)}
                placeholder="MCI/NMC, State Medical Council"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Medical License Document (PDF/JPEG) *
              </label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => updateFormData("licenseDocument", e.target.files?.[0] || null)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Years of Experience *
              </label>
              <input
                type="number"
                min="0"
                value={formData.yearsOfExperience}
                onChange={(e) => updateFormData("yearsOfExperience", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.useDigiLocker}
              onChange={(e) => updateFormData("useDigiLocker", e.target.checked)}
              className="w-4 h-4 text-teal-600"
            />
            <label className="text-sm text-gray-700">Use DigiLocker for verification (Optional)</label>
          </div>

          {formData.useDigiLocker && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                DigiLocker ID
              </label>
              <input
                type="text"
                value={formData.digiLockerId}
                onChange={(e) => updateFormData("digiLockerId", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                placeholder="Enter your DigiLocker ID"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Specialization *
            </label>
            <select
              value={formData.primarySpecialization}
              onChange={(e) => updateFormData("primarySpecialization", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              required
            >
              <option value="">Select</option>
              {specializations.map((spec) => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Secondary Specializations (Optional)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {secondarySpecializations.map((spec) => (
                <label key={spec} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.secondarySpecializations.includes(spec)}
                    onChange={() => toggleArrayItem("secondarySpecializations", spec)}
                    className="w-4 h-4 text-teal-600"
                  />
                  <span className="text-sm text-gray-700">{spec}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Highest Qualification *
            </label>
            <select
              value={formData.highestQualification}
              onChange={(e) => updateFormData("highestQualification", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              required
            >
              <option value="">Select</option>
              {qualifications.map((qual) => (
                <option key={qual} value={qual}>{qual}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Degree Certificates (Multiple files allowed)
            </label>
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => {
                const files = Array.from(e.target.files || [])
                updateFormData("degreeCertificates", [...formData.degreeCertificates, ...files])
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            />
            {formData.degreeCertificates.length > 0 && (
              <div className="mt-2 text-sm text-gray-600">
                {formData.degreeCertificates.length} file(s) selected
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Professional Bio (150-500 words) *
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => updateFormData("bio", e.target.value)}
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              placeholder="Tell patients about yourself, your approach, and expertise..."
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.bio.length} characters (150-500 words recommended)
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-all"
            >
              ← Back
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-teal-500 to-emerald-500 text-white py-3 px-6 rounded-xl font-medium hover:from-teal-600 hover:to-emerald-600 transition-all shadow-md"
            >
              Continue to Practice Details →
            </button>
          </div>
        </form>
      </div>
    )
  }

  // Section 3: Practice Details
  if (step === 3) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-semibold text-gray-800">Practice Details</h1>
            <span className="text-sm text-gray-500">Step 3 of 6</span>
          </div>
          <p className="text-gray-600">Help match the right doctor with the right patient</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); setStep(4); }} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Languages Spoken *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {languages.map((lang) => (
                <label key={lang} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.languagesSpoken.includes(lang)}
                    onChange={() => toggleArrayItem("languagesSpoken", lang)}
                    className="w-4 h-4 text-teal-600"
                  />
                  <span className="text-sm text-gray-700">{lang}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Patient Age Groups *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {ageGroups.map((age) => (
                <label key={age} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.preferredAgeGroups.includes(age)}
                    onChange={() => toggleArrayItem("preferredAgeGroups", age)}
                    className="w-4 h-4 text-teal-600"
                  />
                  <span className="text-sm text-gray-700">{age}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Consultation Types *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {consultationTypesOptions.map((type) => (
                <label key={type} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.consultationTypes.includes(type)}
                    onChange={() => toggleArrayItem("consultationTypes", type)}
                    className="w-4 h-4 text-teal-600"
                  />
                  <span className="text-sm text-gray-700">{type}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              NOT Accepting Cases For (very important)
            </label>
            <div className="space-y-2">
              {notAcceptingCasesOptions.map((caseType) => (
                <label key={caseType} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.notAcceptingCases.includes(caseType)}
                    onChange={() => toggleArrayItem("notAcceptingCases", caseType)}
                    className="w-4 h-4 text-teal-600"
                  />
                  <span className="text-sm text-gray-700">{caseType}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-all"
            >
              ← Back
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-teal-500 to-emerald-500 text-white py-3 px-6 rounded-xl font-medium hover:from-teal-600 hover:to-emerald-600 transition-all shadow-md"
            >
              Continue to Availability →
            </button>
          </div>
        </form>
      </div>
    )
  }

  // Section 4: Availability & Scheduling (Simplified for now)
  if (step === 4) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-semibold text-gray-800">Availability & Scheduling</h1>
            <span className="text-sm text-gray-500">Step 4 of 6</span>
          </div>
          <p className="text-gray-600">Set when patients can book appointments</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); setStep(5); }} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Appointment Duration *
            </label>
            <select
              value={formData.appointmentDuration}
              onChange={(e) => updateFormData("appointmentDuration", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              required
            >
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">60 minutes</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              You can set detailed availability after completing onboarding
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-all"
            >
              ← Back
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-teal-500 to-emerald-500 text-white py-3 px-6 rounded-xl font-medium hover:from-teal-600 hover:to-emerald-600 transition-all shadow-md"
            >
              Continue to Payment Details →
            </button>
          </div>
        </form>
      </div>
    )
  }

  // Section 5: Payment Details
  if (step === 5) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-semibold text-gray-800">Payment Details</h1>
            <span className="text-sm text-gray-500">Step 5 of 6</span>
          </div>
          <p className="text-gray-600">Razorpay Route requires correct payout details</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); setStep(6); }} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Consultation Fee per Session (in ₹) *
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.consultationFee}
              onChange={(e) => updateFormData("consultationFee", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payout Mode *
            </label>
            <select
              value={formData.payoutMode}
              onChange={(e) => updateFormData("payoutMode", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              required
            >
              <option value="UPI">UPI ID (Recommended for instant payouts)</option>
              <option value="BANK">Bank Transfer</option>
            </select>
          </div>

          {formData.payoutMode === "UPI" ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                UPI ID *
              </label>
              <input
                type="text"
                value={formData.paymentUPI}
                onChange={(e) => updateFormData("paymentUPI", e.target.value)}
                placeholder="yourname@upi"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Holder Name *
                  </label>
                  <input
                    type="text"
                    value={formData.bankAccountName}
                    onChange={(e) => updateFormData("bankAccountName", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    required={formData.payoutMode === "BANK"}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Number *
                  </label>
                  <input
                    type="text"
                    value={formData.bankAccountNumber}
                    onChange={(e) => updateFormData("bankAccountNumber", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    required={formData.payoutMode === "BANK"}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    IFSC Code *
                  </label>
                  <input
                    type="text"
                    value={formData.bankIFSC}
                    onChange={(e) => updateFormData("bankIFSC", e.target.value.toUpperCase())}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    required={formData.payoutMode === "BANK"}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bank Name *
                  </label>
                  <input
                    type="text"
                    value={formData.bankName}
                    onChange={(e) => updateFormData("bankName", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    required={formData.payoutMode === "BANK"}
                  />
                </div>
              </div>
            </>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => setStep(4)}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-all"
            >
              ← Back
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-teal-500 to-emerald-500 text-white py-3 px-6 rounded-xl font-medium hover:from-teal-600 hover:to-emerald-600 transition-all shadow-md"
            >
              Continue to Compliance →
            </button>
          </div>
        </form>
      </div>
    )
  }

  // Section 6: Compliance & Legal
  if (step === 6) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-semibold text-gray-800">Compliance & Legal</h1>
            <span className="text-sm text-gray-500">Step 6 of 6</span>
          </div>
          <p className="text-gray-600">For telemedicine regulations</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={formData.telemedicineConsent}
                onChange={(e) => updateFormData("telemedicineConsent", e.target.checked)}
                className="mt-1 w-4 h-4 text-teal-600"
                required
              />
              <span className="text-sm text-gray-700">
                <strong>Telemedicine Consent Acknowledgement</strong> - I understand and agree to comply with telemedicine regulations and guidelines.
              </span>
            </label>

            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={formData.privacyAgreement}
                onChange={(e) => updateFormData("privacyAgreement", e.target.checked)}
                className="mt-1 w-4 h-4 text-teal-600"
                required
              />
              <span className="text-sm text-gray-700">
                <strong>Privacy Agreement</strong> - I have read and agree to the Privacy Policy.
              </span>
            </label>

            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={formData.dataSharingPolicy}
                onChange={(e) => updateFormData("dataSharingPolicy", e.target.checked)}
                className="mt-1 w-4 h-4 text-teal-600"
                required
              />
              <span className="text-sm text-gray-700">
                <strong>Data Sharing Policy</strong> - I agree to the data sharing policy as outlined.
              </span>
            </label>

            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={formData.platformTerms}
                onChange={(e) => updateFormData("platformTerms", e.target.checked)}
                className="mt-1 w-4 h-4 text-teal-600"
                required
              />
              <span className="text-sm text-gray-700">
                <strong>Platform Terms & Conditions</strong> - I agree to the platform's terms and conditions.
              </span>
            </label>

            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={formData.declarationSigned}
                onChange={(e) => updateFormData("declarationSigned", e.target.checked)}
                className="mt-1 w-4 h-4 text-teal-600"
                required
              />
              <span className="text-sm text-gray-700">
                <strong>Declaration</strong> - Information Provided is True and Accurate.
              </span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Digital Signature (Type your full name) *
            </label>
            <input
              type="text"
              value={formData.digitalSignature}
              onChange={(e) => updateFormData("digitalSignature", e.target.value)}
              placeholder="Type your full name as digital signature"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              By typing your name, you are providing your digital signature
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => setStep(5)}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-all"
            >
              ← Back
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-teal-500 to-emerald-500 text-white py-3 px-6 rounded-xl font-medium hover:from-teal-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
            >
              {isLoading ? "Completing Setup..." : "Complete Setup ✓"}
            </button>
          </div>
        </form>
      </div>
    )
  }

  return null
}