"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"

// --- TYPES ---
interface JournalEntry {
  id: string
  date: string
  mood: string
  text: string
}

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState<string>("discover") // discover | wellness | distress | illness | stories | selfhelp | brainfood
  const [searchQuery, setSearchQuery] = useState<string>("")

  // --- Interactive States ---
  // Breathing exercise
  const [breathState, setBreathState] = useState<"Inhale" | "Hold" | "Exhale">("Inhale")
  const [breathProgress, setBreathProgress] = useState<number>(0)
  const [isBreathingActive, setIsBreathingActive] = useState<boolean>(false)

  // Grounding technique (5-4-3-2-1)
  const [groundingStep, setGroundingStep] = useState<number>(5)

  // Mood Journal
  const [journalText, setJournalText] = useState<string>("")
  const [selectedMood, setSelectedMood] = useState<string>("Calm 🍃")
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([
    { id: "1", date: "July 9, 2026", mood: "Peaceful 🧘‍♀️", text: "Had a great walk outside. Feeling grounded and clear-headed today." },
    { id: "2", date: "July 8, 2026", mood: "Anxious ⚡", text: "A bit overwhelmed with work today, but took a few deep breaths to reset." }
  ])

  // Self Assessment Quiz
  const [quizScore, setQuizScore] = useState<number | null>(null)
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({})

  // Sudoku State (Brain Busters)
  const [sudokuGrid, setSudokuGrid] = useState<number[][]>([
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
  ])
  const [sudokuInitial] = useState<boolean[][]>([
    [true, true, false, false, true, false, false, false, false],
    [true, false, false, true, true, true, false, false, false],
    [false, true, true, false, false, false, false, true, false],
    [true, false, false, false, true, false, false, false, true],
    [true, false, false, true, false, true, false, false, true],
    [true, false, false, false, true, false, false, false, true],
    [false, true, false, false, false, false, true, true, false],
    [false, false, false, true, true, true, false, false, true],
    [false, false, false, false, true, false, false, true, true]
  ])

  // --- Breath cycle logic ---
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isBreathingActive) {
      timer = setInterval(() => {
        setBreathProgress((prev) => {
          if (prev >= 100) {
            setBreathState((currentState) => {
              if (currentState === "Inhale") return "Hold"
              if (currentState === "Hold") return "Exhale"
              return "Inhale"
            })
            return 0
          }
          return prev + 2.5 // Speed up for smooth visual
        })
      }, 100)
    } else {
      setBreathProgress(0)
      setBreathState("Inhale")
    }
    return () => clearInterval(timer)
  }, [isBreathingActive])

  // --- Handlers ---
  const handleSudokuChange = (row: number, col: number, val: string) => {
    if (sudokuInitial[row][col]) return
    const num = parseInt(val) || 0
    if (num >= 0 && num <= 9) {
      const newGrid = [...sudokuGrid]
      newGrid[row][col] = num
      setSudokuGrid(newGrid)
    }
  }

  const handleJournalSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!journalText.trim()) return
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      mood: selectedMood,
      text: journalText
    }
    setJournalEntries([newEntry, ...journalEntries])
    setJournalText("")
  }

  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    let score = 0
    Object.values(quizAnswers).forEach((val) => {
      score += val
    })
    setQuizScore(score)
  }

  // --- RENDER SECTIONS ---
  return (
    <div className="flex-1 h-full overflow-y-auto w-full bg-[#fafdfc] text-gray-800 flex flex-col">
      {/* Banner / Header */}
      <div className="bg-gradient-to-r from-teal-50 to-orange-50 px-6 py-8 border-b border-teal-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <button
            onClick={() => setActiveTab("discover")}
            className="text-xs font-bold text-teal-600 hover:text-teal-700 transition-colors uppercase tracking-[0.2em] flex items-center gap-1.5 mb-2"
          >
            {activeTab !== "discover" ? "← Back to Library" : "Patient Resources"}
          </button>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            {activeTab === "discover" && "Discover & Learn"}
            {activeTab === "wellness" && "Mental Wellness"}
            {activeTab === "distress" && "Distress Signals"}
            {activeTab === "illness" && "Understanding Mental Illness"}
            {activeTab === "stories" && "Our Success Stories"}
            {activeTab === "selfhelp" && "Self Help Resource Capsule"}
            {activeTab === "brainfood" && "Brain Food Room"}
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Explore calming activities, tips, assessments, and learning modules.
          </p>
        </div>

        {activeTab === "discover" && (
          <div className="relative w-full md:w-80 shrink-0">
            <input
              type="text"
              placeholder="Search resource library..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-teal-100 rounded-full px-5 py-2.5 pl-11 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
            <svg
              className="absolute left-4 top-3.5 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        )}
      </div>

      <div className="p-6 md:p-8 flex-1 w-full max-w-6xl mx-auto">
        {/* --- DISCOVER HOME PAGE --- */}
        {activeTab === "discover" && (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Discover Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Category Card: Mental Wellness */}
              <button
                onClick={() => setActiveTab("wellness")}
                className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100/80 hover:shadow-md hover:border-teal-200 transition-all flex flex-col text-left group"
              >
                <div className="w-16 h-16 rounded-2xl bg-teal-50 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                  <span className="text-2xl">🧘‍♀️</span>
                </div>
                <h3 className="font-extrabold text-lg text-gray-900 mb-2">Mental Wellness</h3>
                <p className="text-gray-400 font-medium text-sm leading-relaxed mb-4">
                  Guided breathing, relaxation, mindfulness scripts, and calm activities.
                </p>
                <span className="mt-auto text-teal-600 font-bold text-xs uppercase tracking-widest flex items-center gap-1">
                  Explore Module <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </button>

              {/* Category Card: Distress Signals */}
              <button
                onClick={() => setActiveTab("distress")}
                className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100/80 hover:shadow-md hover:border-rose-200 transition-all flex flex-col text-left group"
              >
                <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                  <span className="text-2xl">⚠️</span>
                </div>
                <h3 className="font-extrabold text-lg text-gray-900 mb-2">Distress Signals</h3>
                <p className="text-gray-400 font-medium text-sm leading-relaxed mb-4">
                  Immediate emergency support, quick grounding tools, and anxiety mitigation.
                </p>
                <span className="mt-auto text-rose-600 font-bold text-xs uppercase tracking-widest flex items-center gap-1">
                  Explore Module <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </button>

              {/* Category Card: Understanding Mental Illness */}
              <button
                onClick={() => setActiveTab("illness")}
                className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100/80 hover:shadow-md hover:border-amber-200 transition-all flex flex-col text-left group"
              >
                <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                  <span className="text-2xl">🧠</span>
                </div>
                <h3 className="font-extrabold text-lg text-gray-900 mb-2">Understanding Illness</h3>
                <p className="text-gray-400 font-medium text-sm leading-relaxed mb-4">
                  Educational guides, articles on specific conditions, and special population tips.
                </p>
                <span className="mt-auto text-amber-600 font-bold text-xs uppercase tracking-widest flex items-center gap-1">
                  Explore Module <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </button>

              {/* Category Card: Our Success Stories */}
              <button
                onClick={() => setActiveTab("stories")}
                className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100/80 hover:shadow-md hover:border-blue-200 transition-all flex flex-col text-left group"
              >
                <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                  <span className="text-2xl">⭐</span>
                </div>
                <h3 className="font-extrabold text-lg text-gray-900 mb-2">Success Stories</h3>
                <p className="text-gray-400 font-medium text-sm leading-relaxed mb-4">
                  Real stories from patients, testimonials, and journeys toward healing.
                </p>
                <span className="mt-auto text-blue-600 font-bold text-xs uppercase tracking-widest flex items-center gap-1">
                  Explore Module <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </button>

              {/* Category Card: Self Help */}
              <button
                onClick={() => setActiveTab("selfhelp")}
                className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100/80 hover:shadow-md hover:border-emerald-200 transition-all flex flex-col text-left group"
              >
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                  <span className="text-2xl">🌱</span>
                </div>
                <h3 className="font-extrabold text-lg text-gray-900 mb-2">Self Help</h3>
                <p className="text-gray-400 font-medium text-sm leading-relaxed mb-4">
                  Self-assessments, checklists, guides, and download resources.
                </p>
                <span className="mt-auto text-emerald-600 font-bold text-xs uppercase tracking-widest flex items-center gap-1">
                  Explore Module <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </button>

              {/* Category Card: Brain food */}
              <button
                onClick={() => setActiveTab("brainfood")}
                className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100/80 hover:shadow-md hover:border-purple-200 transition-all flex flex-col text-left group"
              >
                <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                  <span className="text-2xl">🎨</span>
                </div>
                <h3 className="font-extrabold text-lg text-gray-900 mb-2">Brain Food Room</h3>
                <p className="text-gray-400 font-medium text-sm leading-relaxed mb-4">
                  Interactive Sudoku puzzles, zen meditations, journaling diary, and coloring canvas.
                </p>
                <span className="mt-auto text-purple-600 font-bold text-xs uppercase tracking-widest flex items-center gap-1">
                  Explore Module <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </button>
            </div>

            {/* Quick Banner */}
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-[32px] p-8 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg shadow-orange-500/10">
              <div className="z-10 text-center md:text-left">
                <h3 className="text-2xl font-black mb-2">Need to speak with someone right away?</h3>
                <p className="text-orange-100 font-medium max-w-xl">
                  Pragya AI is available 24/7. Or connect immediately with our verified counselors.
                </p>
              </div>
              <Link
                href="/patient/ai-bot"
                className="z-10 shrink-0 bg-white text-orange-600 px-8 py-3.5 rounded-full font-black text-sm hover:bg-orange-50 transition-colors shadow-md shadow-black/5"
              >
                Try Pragya Chat
              </Link>
              <div className="absolute right-[-5%] top-[-20%] w-[250px] h-[250px] rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
            </div>
          </div>
        )}

        {/* --- 1. MENTAL WELLNESS MODULE --- */}
        {activeTab === "wellness" && (
          <div className="space-y-8 animate-in slide-in-from-bottom-5 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Interactive Breathing Tool */}
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col items-center justify-center min-h-[350px]">
                <h3 className="font-extrabold text-xl mb-2 text-center text-gray-900">Guided Breath Calmer</h3>
                <p className="text-gray-400 font-medium text-sm text-center mb-8 max-w-sm">
                  Inhale through the nose, hold, then slowly exhale through the mouth.
                </p>

                {/* Breathing Ball */}
                <div className="relative w-48 h-48 flex items-center justify-center mb-8">
                  <div
                    className={`absolute rounded-full bg-teal-400/20 border-2 border-teal-400 transition-all duration-[4000ms] flex flex-col items-center justify-center shadow-inner ${
                      isBreathingActive && breathState === "Inhale"
                        ? "w-44 h-44 bg-teal-400/40"
                        : isBreathingActive && breathState === "Hold"
                        ? "w-44 h-44 bg-emerald-400/40 border-emerald-400"
                        : "w-28 h-28"
                    }`}
                  >
                    <span className="text-sm font-black text-teal-900 uppercase tracking-widest animate-pulse">
                      {isBreathingActive ? breathState : "Idle"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsBreathingActive(!isBreathingActive)}
                  className={`px-8 py-3 rounded-full font-black text-sm transition-all shadow-md ${
                    isBreathingActive
                      ? "bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20"
                      : "bg-teal-500 hover:bg-teal-600 text-white shadow-teal-500/20"
                  }`}
                >
                  {isBreathingActive ? "Stop Breathing Exercise" : "Start Exercise"}
                </button>
              </div>

              {/* Learning / Articles */}
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
                <h3 className="font-extrabold text-xl text-gray-900">Recommended Audio Guide</h3>
                
                <div className="space-y-4">
                  {[
                    { title: "Calming Storm & Ocean Waves", duration: "12 mins", desc: "Perfect for easing pre-sleep anxiety." },
                    { title: "Deep Muscle Relaxation (PMR)", duration: "18 mins", desc: "Release physical body tension step-by-step." },
                    { title: "Morning Mindfulness Routine", duration: "5 mins", desc: "Start your day with focused clarity." }
                  ].map((audio, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-teal-50/50 border border-teal-50 flex items-center justify-between gap-4">
                      <div>
                        <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">{audio.duration}</span>
                        <h4 className="font-bold text-gray-900 mt-0.5">{audio.title}</h4>
                        <p className="text-xs text-gray-400 font-medium mt-1">{audio.desc}</p>
                      </div>
                      <button className="w-10 h-10 rounded-full bg-teal-500 hover:bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-500/10">
                        ▶
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- 2. DISTRESS SIGNALS MODULE --- */}
        {activeTab === "distress" && (
          <div className="space-y-8 animate-in slide-in-from-bottom-5 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Interactive 5-4-3-2-1 Grounding Tool */}
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm min-h-[350px] flex flex-col">
                <h3 className="font-extrabold text-xl mb-2 text-gray-900">5-4-3-2-1 Grounding Assistant</h3>
                <p className="text-gray-400 font-medium text-sm mb-6">
                  Click through each step and focus your attention on your immediate surroundings.
                </p>

                <div className="flex-1 flex flex-col justify-center items-center py-6 text-center">
                  {groundingStep === 5 && (
                    <div className="animate-in zoom-in duration-300">
                      <span className="text-5xl mb-4 block">👀</span>
                      <h4 className="text-lg font-black text-rose-600 mb-1">5 things you can SEE</h4>
                      <p className="text-gray-500 font-medium max-w-xs">Look around and name 5 distinct things you see in your room.</p>
                    </div>
                  )}
                  {groundingStep === 4 && (
                    <div className="animate-in zoom-in duration-300">
                      <span className="text-5xl mb-4 block">🖐️</span>
                      <h4 className="text-lg font-black text-rose-600 mb-1">4 things you can TOUCH</h4>
                      <p className="text-gray-500 font-medium max-w-xs">A chair, clothing, the desk, or cool air on your skin.</p>
                    </div>
                  )}
                  {groundingStep === 3 && (
                    <div className="animate-in zoom-in duration-300">
                      <span className="text-5xl mb-4 block">👂</span>
                      <h4 className="text-lg font-black text-rose-600 mb-1">3 things you can HEAR</h4>
                      <p className="text-gray-500 font-medium max-w-xs">Traffic outside, birds, ambient music, or your own breath.</p>
                    </div>
                  )}
                  {groundingStep === 2 && (
                    <div className="animate-in zoom-in duration-300">
                      <span className="text-5xl mb-4 block">👃</span>
                      <h4 className="text-lg font-black text-rose-600 mb-1">2 things you can SMELL</h4>
                      <p className="text-gray-500 font-medium max-w-xs">Coffee, soap, fresh rain, or a clean room.</p>
                    </div>
                  )}
                  {groundingStep === 1 && (
                    <div className="animate-in zoom-in duration-300">
                      <span className="text-5xl mb-4 block">👅</span>
                      <h4 className="text-lg font-black text-rose-600 mb-1">1 thing you can TASTE</h4>
                      <p className="text-gray-500 font-medium max-w-xs">Toothpaste, water, or the lingering taste of food.</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center mt-6">
                  <button
                    disabled={groundingStep === 5}
                    onClick={() => setGroundingStep((prev) => prev + 1)}
                    className="px-4 py-2 border border-gray-100 rounded-xl font-bold text-xs text-gray-500 disabled:opacity-30"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => {
                      if (groundingStep === 1) {
                        setGroundingStep(5)
                      } else {
                        setGroundingStep((prev) => prev - 1)
                      }
                    }}
                    className="px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-black text-xs uppercase tracking-wider"
                  >
                    {groundingStep === 1 ? "Start Over" : "Next Sense"}
                  </button>
                </div>
              </div>

              {/* Call hotlines */}
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
                <h3 className="font-extrabold text-xl text-gray-900">Verified Support Helplines</h3>
                <p className="text-gray-400 font-medium text-sm">
                  If you are in immediate distress or crisis, reach out to these support lines immediately.
                </p>

                <div className="space-y-4">
                  {[
                    { name: "Tele MANAS National Hotline", number: "14416", desc: "Available 24/7 across India." },
                    { name: "KIRAN Mental Health Support", number: "1800-599-0019", desc: "Government counseling service." },
                    { name: "Vandrevala Foundation", number: "9999 666 555", desc: "Crisis and suicide helpline support." }
                  ].map((line, idx) => (
                    <div key={idx} className="p-5 rounded-2xl bg-rose-50/50 border border-rose-100/50 flex items-center justify-between">
                      <div>
                        <h4 className="font-extrabold text-gray-900 text-base">{line.name}</h4>
                        <span className="text-lg font-black text-rose-600 mt-1 block">{line.number}</span>
                        <p className="text-xs text-gray-400 font-medium mt-1">{line.desc}</p>
                      </div>
                      <a
                        href={`tel:${line.number.replace(/\s+/g, "")}`}
                        className="px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full font-black text-xs tracking-wider"
                      >
                        CALL NOW
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- 3. UNDERSTANDING MENTAL ILLNESS MODULE --- */}
        {activeTab === "illness" && (
          <div className="space-y-8 animate-in slide-in-from-bottom-5 duration-500">
            {/* Special Population Selection */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <h3 className="font-extrabold text-xl mb-6 text-gray-900">Tips for Special Populations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-[#f0f9ff] border border-blue-100 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center shrink-0">
                    <span className="text-white text-xl">🧒</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Children & Adolescents</h4>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      Understand developmental mood shifts, support emotional literacy, and build clear structure at home.
                    </p>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[#fef2f2] border border-red-100 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center shrink-0">
                    <span className="text-white text-xl">👵</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Elders & Seniors</h4>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      Address geriatric loneliness, retirement anxiety, memory support, and routine check-ins.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Articles List */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <h3 className="font-extrabold text-xl mb-6 text-gray-900">Key Articles</h3>
              <div className="divide-y divide-gray-100">
                {[
                  { title: "Gender And Mental Health", desc: "Understanding the different patterns of mental health struggles across genders." },
                  { title: "How To Support Someone Who Is Struggling With Mental Health", desc: "Key conversational dos and don'ts when listening to close friends." }
                ].map((article, i) => (
                  <div key={i} className="py-4 first:pt-0 last:pb-0 flex justify-between items-center gap-4">
                    <div>
                      <h4 className="font-bold text-gray-900 hover:text-amber-600 transition-colors cursor-pointer">{article.title}</h4>
                      <p className="text-xs text-gray-400 mt-1">{article.desc}</p>
                    </div>
                    <span className="text-xs text-gray-300 font-bold hover:text-amber-500 cursor-pointer">Bookmark</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Symptom Cards Grid */}
            <div className="space-y-4">
              <h3 className="font-extrabold text-xl text-gray-900">Recognizing Symptom Clusters</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[
                  { label: "Behavioral Problems", icon: "🎭", desc: "Extreme shifts in action, withdrawal." },
                  { label: "Physical Symptoms", icon: "💓", desc: "Tight chest, fatigue, rapid pulse." },
                  { label: "Social Problems", icon: "🙅‍♀️", desc: "Difficulty interacting, conflict." },
                  { label: "Substance Use", icon: "🍷", desc: "Dependence, risky escape routes." },
                  { label: "Reality Loss", icon: "🌀", desc: "Delusions, severe dissociation." },
                  { label: "Memory Problems", icon: "🗒️", desc: "Brain fog, high forgetfulness." }
                ].map((symptom, i) => (
                  <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center">
                    <span className="text-3xl mb-3 block">{symptom.icon}</span>
                    <h4 className="font-bold text-gray-900 text-sm mb-1">{symptom.label}</h4>
                    <p className="text-xs text-gray-400 font-medium">{symptom.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- 4. SUCCESS STORIES --- */}
        {activeTab === "stories" && (
          <div className="space-y-8 animate-in slide-in-from-bottom-5 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { name: "Rahul S.", age: "28", text: "Working with therapy and daily meditation completely changed my perspective on work stress.", mood: "Recovered 🌟" },
                { name: "Priya M.", age: "34", text: "Finding the right grounding tools helped me manage panic attacks. I'm finally back in control.", mood: "Resilient 🌱" },
                { name: "Anil K.", age: "42", text: "Connecting with professional guidance saved my relationship and gave me hope during burnout.", mood: "Balanced ⚖️" }
              ].map((story, idx) => (
                <div key={idx} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
                  <p className="text-gray-600 font-medium italic leading-relaxed mb-6">
                    "{story.text}"
                  </p>
                  <div className="flex items-center justify-between border-t border-gray-50 pt-4">
                    <div>
                      <h4 className="font-black text-gray-900">{story.name}</h4>
                      <span className="text-xs text-gray-400 font-semibold">Age {story.age}</span>
                    </div>
                    <span className="px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wide">
                      {story.mood}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- 5. SELF HELP MODULE --- */}
        {activeTab === "selfhelp" && (
          <div className="space-y-8 animate-in slide-in-from-bottom-5 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Interactive Self-Assessment Quiz */}
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                <h3 className="font-extrabold text-xl mb-2 text-gray-900">Self Assessment Capsule</h3>
                <p className="text-gray-400 font-medium text-sm mb-6">
                  Answer the following questions to receive immediate wellness tips.
                </p>

                {quizScore === null ? (
                  <form onSubmit={handleQuizSubmit} className="space-y-6">
                    {[
                      { id: 1, text: "How often have you felt down, depressed, or hopeless lately?" },
                      { id: 2, text: "How often have you had trouble relaxing or felt on edge?" },
                      { id: 3, text: "Are you finding it difficult to focus on work or daily tasks?" }
                    ].map((q) => (
                      <div key={q.id} className="space-y-3">
                        <p className="font-bold text-gray-800 text-sm">{q.id}. {q.text}</p>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { label: "Not at all", val: 0 },
                            { label: "Several days", val: 1 },
                            { label: "Nearly daily", val: 2 }
                          ].map((opt, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setQuizAnswers({ ...quizAnswers, [q.id]: opt.val })}
                              className={`py-2 px-3 text-xs font-bold rounded-xl border text-center transition-all ${
                                quizAnswers[q.id] === opt.val
                                  ? "bg-emerald-500 text-white border-emerald-500"
                                  : "bg-white text-gray-500 border-gray-100 hover:bg-gray-50"
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                    <button
                      type="submit"
                      disabled={Object.keys(quizAnswers).length < 3}
                      className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-30 disabled:hover:bg-emerald-500 text-white font-black text-sm rounded-xl uppercase tracking-wider shadow-md shadow-emerald-500/10"
                    >
                      Show Score & Tips
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-6 animate-in zoom-in duration-300">
                    <span className="text-5xl mb-4 block">📈</span>
                    <h4 className="text-lg font-black text-gray-900 mb-1">Your Capsule Score: {quizScore} / 6</h4>
                    <p className="text-gray-500 font-medium max-w-sm mx-auto mt-2 leading-relaxed text-sm">
                      {quizScore <= 2 && "Feeling stable! Continue your current daily mindfulness habits and stay connected."}
                      {quizScore > 2 && quizScore <= 4 && "Moderate stress detected. We recommend trying out the Grounding Tool in 'Distress Signals' or speaking to Pragya AI."}
                      {quizScore > 4 && "High tension detected. Consider scheduling a session with one of our licensed counselors."}
                    </p>
                    <button
                      onClick={() => {
                        setQuizScore(null)
                        setQuizAnswers({})
                      }}
                      className="mt-6 px-6 py-2.5 border border-emerald-100 text-emerald-600 hover:bg-emerald-50 font-bold text-xs rounded-xl"
                    >
                      Retake Test
                    </button>
                  </div>
                )}
              </div>

              {/* Downloads list */}
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
                <h3 className="font-extrabold text-xl text-gray-900">Self Help Guides (PDF)</h3>
                
                <div className="space-y-4">
                  {[
                    { title: "Cognitive Distortions Worksheet", size: "1.2 MB" },
                    { title: "Daily Anxiety Tracker Log", size: "640 KB" },
                    { title: "Sleep Hygiene Guidelines Guide", size: "820 KB" }
                  ].map((doc, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-50/50 flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">{doc.title}</h4>
                        <span className="text-[10px] text-gray-400 font-bold mt-1 block">{doc.size}</span>
                      </div>
                      <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/10">
                        <span>📥</span> Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- 6. BRAIN FOOD ROOM --- */}
        {activeTab === "brainfood" && (
          <div className="space-y-8 animate-in slide-in-from-bottom-5 duration-500">
            {/* Sudoku & Mood Diary Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Brain Busters: Sudoku */}
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col items-center">
                <h3 className="font-extrabold text-xl mb-1 text-gray-900">Brain Busters: Sudoku</h3>
                <p className="text-gray-400 font-medium text-xs mb-6 text-center max-w-sm">
                  Focus your mind on numbers to distract from stressful or anxious cycles.
                </p>

                {/* Grid */}
                <div className="grid grid-cols-9 gap-1 border-2 border-gray-800 p-1 bg-gray-800 rounded-lg shadow-md">
                  {sudokuGrid.map((row, rIdx) =>
                    row.map((val, cIdx) => (
                      <input
                        key={`${rIdx}-${cIdx}`}
                        type="text"
                        maxLength={1}
                        value={val === 0 ? "" : val}
                        onChange={(e) => handleSudokuChange(rIdx, cIdx, e.target.value)}
                        className={`w-8 h-8 md:w-9 md:h-9 text-center font-bold text-sm border-0 focus:ring-2 focus:ring-purple-400 rounded transition-all ${
                          sudokuInitial[rIdx][cIdx]
                            ? "bg-gray-100 text-gray-800 font-extrabold cursor-not-allowed"
                            : "bg-white text-purple-700 font-medium"
                        }`}
                      />
                    ))
                  )}
                </div>
              </div>

              {/* My Thought Diary */}
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col">
                <h3 className="font-extrabold text-xl mb-1 text-gray-900">My Thought Diary</h3>
                <p className="text-gray-400 font-medium text-xs mb-6">
                  Log your daily mood and thoughts. Your entries are stored locally.
                </p>

                {/* Entry Form */}
                <form onSubmit={handleJournalSave} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Current Mood
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {["Calm 🍃", "Happy 😊", "Tired 🥱", "Anxious ⚡", "Sad 😢"].map((mood) => (
                        <button
                          key={mood}
                          type="button"
                          onClick={() => setSelectedMood(mood)}
                          className={`py-1.5 px-3 rounded-full text-xs font-bold border transition-all ${
                            selectedMood === mood
                              ? "bg-purple-500 text-white border-purple-500"
                              : "bg-white text-gray-500 border-gray-100 hover:bg-gray-50"
                          }`}
                        >
                          {mood}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Thoughts & Feelings
                    </label>
                    <textarea
                      rows={3}
                      value={journalText}
                      onChange={(e) => setJournalText(e.target.value)}
                      placeholder="Write whatever is on your mind..."
                      className="w-full bg-white border border-gray-100 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent placeholder:text-gray-300"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white font-black text-sm rounded-xl uppercase tracking-wider shadow-md shadow-purple-500/10"
                  >
                    Save Diary Entry
                  </button>
                </form>

                {/* Entry History */}
                <div className="mt-8 flex-1">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Diary History</h4>
                  <div className="space-y-3 max-h-40 overflow-y-auto pr-2 scrollbar-thin">
                    {journalEntries.map((entry) => (
                      <div key={entry.id} className="p-3 bg-gray-50/50 border border-gray-50 rounded-xl">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[11px] font-bold text-gray-400">{entry.date}</span>
                          <span className="text-xs font-bold bg-white px-2 py-0.5 rounded-full shadow-sm">{entry.mood}</span>
                        </div>
                        <p className="text-xs text-gray-600 font-medium leading-relaxed">{entry.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
