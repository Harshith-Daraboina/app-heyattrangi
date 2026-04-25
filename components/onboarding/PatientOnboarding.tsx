"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

type OnboardingData = {
  mood: string
  experience: string
  reasons: string[]
}

const STEPS_COUNT = 5 // Number of question steps (Step 0 to 4)

export default function PatientOnboarding() {
  const router = useRouter()
  const { data: session } = useSession()
  const [step, setStep] = useState(0)
  const [data, setData] = useState<OnboardingData>({
    mood: "",
    experience: "",
    reasons: [],
  })
  const [isLoading, setIsLoading] = useState(false)

  const userName = session?.user?.name?.split(" ")[0] || "there"

  const handleNext = () => setStep((s) => s + 1)
  const handleBack = () => setStep((s) => s - 1)
  const handleSkip = () => setStep(STEPS_COUNT) // Skip to final screen

  const handleFinish = async () => {
    setIsLoading(true)
    try {
      // In a real app, we'd save the specific onboarding data here
      // For now, let's trigger the existing onboarding API to mark as PATIENT
      // and redirect to dashboard
      const response = await fetch("/api/onboarding/patient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
           age: "18", // Default or gathered if needed
           gender: "Not specified",
           healthConcerns: data.reasons,
           emergencyContact: "Not specified",
           emergencyPhone: "0000000000",
        }),
      })

      if (response.ok) {
        router.push("/patient/dashboard")
      } else {
        alert("Something went wrong. Let's try again.")
      }
    } catch (error) {
      console.error("Onboarding error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleReason = (reason: string) => {
    setData((prev) => ({
      ...prev,
      reasons: prev.reasons.includes(reason)
        ? prev.reasons.filter((r) => r !== reason)
        : [...prev.reasons, reason],
    }))
  }

  return (
    <div className="relative min-h-[600px] w-full flex flex-col items-center">
      {/* Background shapes (Decorative) */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100/50 rounded-full blur-3xl -z-10 translate-x-20 -translate-y-20" />
      <div className="absolute top-40 right-20 w-40 h-40 bg-orange-100/50 rounded-full blur-2xl -z-10" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-50/50 rounded-full blur-3xl -z-10 -translate-x-20 translate-y-20" />

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: -10 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-2xl bg-[#FFF8F4] border border-[#E8E0D8]/60 rounded-[40px] shadow-2xl shadow-orange-900/5 p-12 lg:p-16 relative overflow-hidden flex flex-col items-center text-center min-h-[480px]"
        >
          {/* Progress Bar (Visible from Step 2 to 4) */}
          {step >= 2 && step < STEPS_COUNT && (
            <div className="absolute top-8 right-12 w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
               <motion.div 
                 className="h-full bg-emerald-600" 
                 initial={{ width: "20%" }}
                 animate={{ width: `${(step / STEPS_COUNT) * 100}%` }}
               />
            </div>
          )}

          {/* Screen Content */}
          <div className="flex-1 w-full flex flex-col items-center">
            {step === 0 && <WelcomeScreen userName={userName} />}
            {step === 1 && <PrivacyScreen />}
            {step === 2 && <MoodScreen selected={data.mood} onSelect={(m) => setData({ ...data, mood: m })} />}
            {step === 3 && <ExperienceScreen selected={data.experience} onSelect={(e) => setData({ ...data, experience: e })} />}
            {step === 4 && <ReasonScreen selected={data.reasons} onToggle={toggleReason} />}
            {step === 5 && <FinalScreen userName={userName} />}
          </div>

          {/* Navigation Controls */}
          <div className="mt-12 w-full flex flex-col items-center gap-6">
            <div className="flex items-center gap-4">
              {step === 0 ? (
                <button 
                  onClick={handleSkip}
                  className="px-8 py-3 rounded-2xl bg-[#E8E0D8]/40 hover:bg-[#E8E0D8]/60 text-[#666666] font-bold text-sm transition-colors"
                >
                  Skip
                </button>
              ) : step < STEPS_COUNT ? (
                <button 
                  onClick={handleBack}
                  className="px-8 py-3 rounded-2xl bg-[#E8E0D8]/40 hover:bg-[#E8E0D8]/60 text-[#666666] font-bold text-sm transition-colors"
                >
                  Back
                </button>
              ) : null}

              {step < STEPS_COUNT - 1 ? (
                <button 
                  onClick={handleNext}
                  className="px-10 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black text-sm shadow-xl shadow-orange-200 transition-all flex items-center gap-2"
                >
                  Continue →
                </button>
              ) : step === STEPS_COUNT - 1 ? (
                <button 
                  onClick={handleNext}
                  className="px-10 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black text-sm shadow-xl shadow-orange-200 transition-all flex items-center gap-2"
                >
                  Continue →
                </button>
              ) : (
                <button 
                  onClick={handleFinish}
                  disabled={isLoading}
                  className="px-10 py-4 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black text-base shadow-xl shadow-orange-200 transition-all flex items-center gap-2"
                >
                  {isLoading ? "Joining..." : "Welcome to Attrangi! →"}
                </button>
              )}
            </div>

            {/* Dots indicator */}
            {step < STEPS_COUNT && (
              <div className="flex gap-2">
                {[...Array(STEPS_COUNT)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-2 w-2 rounded-full transition-colors ${i === step ? "bg-orange-400" : "bg-[#E8E0D8]"}`} 
                  />
                ))}
              </div>
            )}
          </div>

          {/* Illustrations */}
          <div className="absolute bottom-0 left-0 w-full pointer-events-none p-0 overflow-hidden">
             {step === 0 && (
               <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex justify-start">
                 <Image src="/onboarding_images/6.png" alt="Welcome" width={240} height={160} className="object-contain" />
               </motion.div>
             )}
             {(step === 1 || step === 2) && (
               <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex justify-start">
                 <Image src="/onboarding_images/2.png" alt="Privacy" width={200} height={200} className="object-contain" />
               </motion.div>
             )}
             {step === 5 && (
               <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex justify-start">
                 <Image src="/onboarding_images/4.png" alt="Final" width={220} height={220} className="object-contain" />
               </motion.div>
             )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// --- Screens Components ---

function WelcomeScreen({ userName }: { userName: string }) {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-[32px] font-bold text-[#1A1A2E] mb-6">Welcome {userName},</h2>
      <div className="space-y-4 max-w-md mx-auto text-[#666666] leading-relaxed">
        <p>This is a safe and private space for you.</p>
        <p>I&apos;m here to listen and support you at your pace.</p>
        <p className="font-bold text-[#1A1A2E] mt-8">To understand you better, can I ask a few quick questions?</p>
      </div>
    </div>
  )
}

function PrivacyScreen() {
  return (
    <div className="flex flex-col items-center">
      <div className="space-y-6 max-w-md mx-auto text-[#666666] leading-relaxed">
        <p className="text-[#1A1A2E] font-medium">This is a safe and private space for you.</p>
        <div className="italic">
           <p>Your conversations are private</p>
           <p>You&apos;re in control of what you share</p>
        </div>
        <p className="text-[#1A1A2E] font-bold text-lg mt-10">You&apos;re not alone. We&apos;re here to support you.</p>
      </div>
    </div>
  )
}

function MoodScreen({ selected, onSelect }: { selected: string; onSelect: (m: string) => void }) {
  const moods = [
    { label: "Cry", icon: "😭" },
    { label: "Angry", icon: "😠" },
    { label: "Neutral", icon: "😐" },
    { label: "Sad", icon: "😔" },
    { label: "Smile", icon: "😊" },
  ]

  return (
    <div className="flex flex-col items-center w-full">
      <h2 className="text-2xl font-bold text-[#1A1A2E] mb-12">How are you feeling today?</h2>
      <div className="flex flex-wrap justify-center gap-4">
        {moods.map((m) => (
          <button
            key={m.label}
            onClick={() => onSelect(m.label)}
            className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center transition-all ${
              selected === m.label 
                ? "bg-orange-200 border-2 border-orange-400 scale-105" 
                : "bg-[#E8E0D8]/30 hover:bg-[#E8E0D8]/50 border-2 border-transparent"
            }`}
          >
            <span className="text-3xl mb-1">{m.icon}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#666666]">{m.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function ExperienceScreen({ selected, onSelect }: { selected: string; onSelect: (e: string) => void }) {
  const options = [
    { id: "new", title: "Just Getting Started", sub: "First time trying therapy" },
    { id: "some", title: "Some experience", sub: "Been to a few sessions before" },
    { id: "pro", title: "Veteran", sub: "Regular therapy participant" },
  ]

  return (
    <div className="flex flex-col items-center w-full">
      <h2 className="text-2xl font-bold text-[#1A1A2E] mb-12 max-w-sm">What is your experience level with therapy?</h2>
      <div className="flex flex-col sm:flex-row gap-4 w-full px-4">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            className={`flex-1 p-6 rounded-2xl text-left transition-all ${
              selected === opt.id 
                ? "bg-orange-200 border-2 border-orange-400 ring-4 ring-orange-400/10" 
                : "bg-[#E8E0D8]/30 hover:bg-[#E8E0D8]/50 border-2 border-transparent"
            }`}
          >
            <h4 className="font-bold text-[#1A1A2E] mb-1">{opt.title}</h4>
            <p className="text-xs text-[#666666]">{opt.sub}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

function ReasonScreen({ selected, onToggle }: { selected: string[]; onToggle: (r: string) => void }) {
  const reasons = [
    "Stress & anxiety",
    "Falling asleep",
    "Personal growth",
    "Work & productivity",
    "Movement & sport",
    "Physical health",
    "University & college",
  ]

  return (
    <div className="flex flex-col items-center w-full">
      <h2 className="text-2xl font-bold text-[#1A1A2E] mb-4">What brings you to Attrangi?</h2>
      <p className="text-sm text-[#666666] mb-10">Choose topics to focus on:</p>
      <div className="grid grid-cols-1 gap-3 w-full max-w-md px-4">
        {reasons.map((r) => (
          <button
            key={r}
            onClick={() => onToggle(r)}
            className={`w-full p-4 rounded-xl text-left font-bold transition-all ${
              selected.includes(r)
                ? "bg-orange-600 text-white shadow-lg -translate-y-0.5"
                : "bg-white border border-[#E8E0D8] text-[#1A1A2E] hover:border-orange-300"
            }`}
          >
            {r}
          </button>
        ))}
      </div>
    </div>
  )
}

function FinalScreen({ userName }: { userName: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full py-10">
      <h2 className="text-2xl italic font-medium text-[#1A1A2E] max-w-xs leading-relaxed text-center">
        Thanks for sharing {userName}. We&apos;re here with you.
      </h2>
    </div>
  )
}

