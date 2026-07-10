"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

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
  const [selectedMood, setSelectedMood] = useState<string>("Calm")
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([
    { id: "1", date: "July 9, 2026", mood: "Peaceful", text: "Had a great walk outside. Feeling grounded and clear-headed today." },
    { id: "2", date: "July 8, 2026", mood: "Anxious", text: "A bit overwhelmed with work today, but took a few deep breaths to reset." }
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
          return prev + 2.5
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

  return (
    <div className="flex-1 h-full overflow-y-auto w-full bg-[#f8fafc] text-slate-800 flex flex-col font-sans">
      
      {/* Banner / Header */}
      <div className="bg-white px-8 py-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          {activeTab !== "discover" && (
            <button
              onClick={() => setActiveTab("discover")}
              className="text-[11px] font-black text-teal-600 hover:text-teal-700 transition-colors uppercase tracking-widest flex items-center gap-1 mb-2"
            >
              Back to Library
            </button>
          )}
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            {activeTab === "discover" && "Discover & Learn"}
            {activeTab === "wellness" && "Mental Wellness"}
            {activeTab === "distress" && "Distress Signals"}
            {activeTab === "illness" && "Understanding Mental Illness"}
            {activeTab === "stories" && "Success Stories"}
            {activeTab === "selfhelp" && "Self Help Capsule"}
            {activeTab === "brainfood" && "Brain Food Room"}
          </h1>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-1">
            {activeTab === "discover" && "Curated mental health activities and modules"}
            {activeTab === "wellness" && "Mindfulness, meditation, and guides"}
            {activeTab === "distress" && "Grounding resources and emergency hotlines"}
            {activeTab === "illness" && "Symptom recognition and population support"}
            {activeTab === "stories" && "Real journeys of resilience and recovery"}
            {activeTab === "selfhelp" && "Diagnostic self-assessments and worksheets"}
            {activeTab === "brainfood" && "Cognitive focus exercises and journaling"}
          </p>
        </div>

        {activeTab === "discover" && (
          <div className="relative w-full md:w-80 shrink-0">
            <input
              type="text"
              placeholder="Search library..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200/80 rounded-full px-5 py-2.5 pl-11 text-xs font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
            <svg
              className="absolute left-4 top-3.5 w-4 h-4 text-slate-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
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
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Discover Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Category Card: Mental Wellness */}
              <button
                onClick={() => setActiveTab("wellness")}
                className="relative overflow-hidden rounded-[32px] p-8 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all flex flex-col text-left group min-h-[240px] bg-gradient-to-br from-[#4facfe] to-[#00f2fe] text-white"
              >
                <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" viewBox="0 0 400 200" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 120C120 100 200 180 400 130V200H0V120Z" fill="white" />
                  <path d="M0 150C150 130 250 190 400 160V200H0V150Z" fill="white" opacity="0.5" />
                </svg>
                <span className="z-10 inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold mb-6 self-start">
                  5 mins
                </span>
                <h3 className="z-10 font-bold text-2xl mb-1 tracking-tight">Mental Wellness</h3>
                <p className="z-10 text-white/90 font-medium text-sm leading-relaxed max-w-[240px]">
                  Guided breathing, relaxation scripts, and calming guides.
                </p>
                <div className="z-10 mt-auto self-end flex items-center justify-center border border-white/50 bg-white/10 hover:bg-white/25 text-white font-bold text-xs px-5 py-2 rounded-full backdrop-blur-sm transition-all gap-1.5">
                  Start <span className="text-[10px] font-black">&gt;</span>
                </div>
              </button>

              {/* Category Card: Distress Signals */}
              <button
                onClick={() => setActiveTab("distress")}
                className="relative overflow-hidden rounded-[32px] p-8 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all flex flex-col text-left group min-h-[240px] bg-gradient-to-br from-[#ff5858] to-[#f09819] text-white"
              >
                <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" viewBox="0 0 400 200" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 100 Q 50 150 100 100 T 200 100 T 300 100 T 400 100 V200 H0 Z" fill="white" />
                  <path d="M0 130 Q 70 170 140 130 T 280 130 T 400 130 V200 H0 Z" fill="white" opacity="0.4" />
                </svg>
                <span className="z-10 inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold mb-6 self-start">
                  Immediate
                </span>
                <h3 className="z-10 font-bold text-2xl mb-1 tracking-tight">Distress Signals</h3>
                <p className="z-10 text-white/90 font-medium text-sm leading-relaxed max-w-[240px]">
                  Urgent help contacts and active grounding techniques.
                </p>
                <div className="z-10 mt-auto self-end flex items-center justify-center border border-white/50 bg-white/10 hover:bg-white/25 text-white font-bold text-xs px-5 py-2 rounded-full backdrop-blur-sm transition-all gap-1.5">
                  Start <span className="text-[10px] font-black">&gt;</span>
                </div>
              </button>

              {/* Category Card: Understanding Mental Illness */}
              <button
                onClick={() => setActiveTab("illness")}
                className="relative overflow-hidden rounded-[32px] p-8 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all flex flex-col text-left group min-h-[240px] bg-gradient-to-br from-[#30cfd0] to-[#330867] text-white"
              >
                <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" viewBox="0 0 400 200" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="340" cy="180" r="100" fill="white" />
                  <circle cx="280" cy="140" r="60" fill="white" opacity="0.4" />
                  <circle cx="380" cy="80" r="80" fill="white" opacity="0.3" />
                </svg>
                <span className="z-10 inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold mb-6 self-start">
                  Resource Capsule
                </span>
                <h3 className="z-10 font-bold text-2xl mb-1 tracking-tight">Understanding Illness</h3>
                <p className="z-10 text-white/90 font-medium text-sm leading-relaxed max-w-[240px]">
                  Condition reference files and special population checklists.
                </p>
                <div className="z-10 mt-auto self-end flex items-center justify-center border border-white/50 bg-white/10 hover:bg-white/25 text-white font-bold text-xs px-5 py-2 rounded-full backdrop-blur-sm transition-all gap-1.5">
                  Start <span className="text-[10px] font-black">&gt;</span>
                </div>
              </button>

              {/* Category Card: Our Success Stories */}
              <button
                onClick={() => setActiveTab("stories")}
                className="relative overflow-hidden rounded-[32px] p-8 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all flex flex-col text-left group min-h-[240px] bg-gradient-to-br from-[#7f53ac] to-[#647dec] text-white"
              >
                <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" viewBox="0 0 400 200" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 180 L 150 100 L 300 140 L 400 60 V200 H0 Z" fill="white" />
                  <path d="M0 190 L 120 130 L 250 160 L 400 100 V200 H0 Z" fill="white" opacity="0.4" />
                </svg>
                <span className="z-10 inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold mb-6 self-start">
                  Community
                </span>
                <h3 className="z-10 font-bold text-2xl mb-1 tracking-tight">Success Stories</h3>
                <p className="z-10 text-white/90 font-medium text-sm leading-relaxed max-w-[240px]">
                  Real narratives from people who reclaimed their peace of mind.
                </p>
                <div className="z-10 mt-auto self-end flex items-center justify-center border border-white/50 bg-white/10 hover:bg-white/25 text-white font-bold text-xs px-5 py-2 rounded-full backdrop-blur-sm transition-all gap-1.5">
                  Start <span className="text-[10px] font-black">&gt;</span>
                </div>
              </button>

              {/* Category Card: Self Help */}
              <button
                onClick={() => setActiveTab("selfhelp")}
                className="relative overflow-hidden rounded-[32px] p-8 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all flex flex-col text-left group min-h-[240px] bg-gradient-to-br from-[#11998e] to-[#38ef7d] text-white"
              >
                <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" viewBox="0 0 400 200" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M300 200 C300 130 350 100 400 100 V200 H300 Z" fill="white" />
                  <path d="M220 200 C220 150 280 120 350 120 V200 H220 Z" fill="white" opacity="0.4" />
                </svg>
                <span className="z-10 inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold mb-6 self-start">
                  Tools
                </span>
                <h3 className="z-10 font-bold text-2xl mb-1 tracking-tight">Self Help</h3>
                <p className="z-10 text-white/90 font-medium text-sm leading-relaxed max-w-[240px]">
                  Interactive self-diagnostics, files, and printable tracking logs.
                </p>
                <div className="z-10 mt-auto self-end flex items-center justify-center border border-white/50 bg-white/10 hover:bg-white/25 text-white font-bold text-xs px-5 py-2 rounded-full backdrop-blur-sm transition-all gap-1.5">
                  Start <span className="text-[10px] font-black">&gt;</span>
                </div>
              </button>

              {/* Category Card: Brain Food Room */}
              <button
                onClick={() => setActiveTab("brainfood")}
                className="relative overflow-hidden rounded-[32px] p-8 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all flex flex-col text-left group min-h-[240px] bg-gradient-to-br from-[#f857a6] to-[#ff5858] text-white"
              >
                <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" viewBox="0 0 400 200" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 280 200 L 330 110 L 400 160 V 200 Z" fill="white" opacity="0.3" />
                  <path d="M 200 200 L 290 80 L 360 140 L 400 120 V 200 Z" fill="white" opacity="0.4" />
                </svg>
                <span className="z-10 inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold mb-6 self-start">
                  10 mins
                </span>
                <h3 className="z-10 font-bold text-2xl mb-1 tracking-tight">Brain Food Room</h3>
                <p className="z-10 text-white/90 font-medium text-sm leading-relaxed max-w-[240px]">
                  Focus training games, ambient sound, and a thought diary log.
                </p>
                <div className="z-10 mt-auto self-end flex items-center justify-center border border-white/50 bg-white/10 hover:bg-white/25 text-white font-bold text-xs px-5 py-2 rounded-full backdrop-blur-sm transition-all gap-1.5">
                  Start <span className="text-[10px] font-black">&gt;</span>
                </div>
              </button>

            </div>
          </div>
        )}

        {/* --- 1. MENTAL WELLNESS MODULE --- */}
        {activeTab === "wellness" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Interactive Breathing Tool */}
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col items-center justify-center min-h-[350px]">
                <h3 className="font-extrabold text-xl mb-1 text-center text-slate-900">Guided Breath Calmer</h3>
                <span className="text-[10px] font-black text-teal-600 uppercase tracking-widest mb-6">Breathing Exercise</span>

                {/* Breathing Ball */}
                <div className="relative w-48 h-48 flex items-center justify-center mb-8">
                  <div
                    className={`absolute rounded-full bg-teal-500/10 border-2 border-teal-500/30 transition-all duration-[4000ms] flex flex-col items-center justify-center ${
                      isBreathingActive && breathState === "Inhale"
                        ? "w-44 h-44 bg-teal-500/20"
                        : isBreathingActive && breathState === "Hold"
                        ? "w-44 h-44 bg-emerald-500/20 border-emerald-500/30"
                        : "w-28 h-28"
                    }`}
                  >
                    <span className="text-xs font-black text-teal-900 uppercase tracking-widest">
                      {isBreathingActive ? breathState : "Ready"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsBreathingActive(!isBreathingActive)}
                  className={`px-8 py-3.5 rounded-full font-black text-xs uppercase tracking-wider transition-all shadow-md ${
                    isBreathingActive
                      ? "bg-slate-800 hover:bg-slate-900 text-white"
                      : "bg-teal-500 hover:bg-teal-600 text-white"
                  }`}
                >
                  {isBreathingActive ? "Stop Exercise" : "Start Exercise"}
                </button>
              </div>

              {/* Recommended Audios */}
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6">
                <h3 className="font-extrabold text-xl text-slate-900">Recommended Audio Sessions</h3>
                
                <div className="space-y-4">
                  {[
                    { title: "Calming Storm & Ocean Waves", duration: "12 mins", category: "Ambient" },
                    { title: "Deep Muscle Relaxation (PMR)", duration: "18 mins", category: "Guided" },
                    { title: "Morning Mindfulness Routine", duration: "5 mins", category: "Quick Reset" }
                  ].map((audio, i) => (
                    <div key={i} className="p-5 rounded-2xl bg-slate-50 border border-slate-100/50 flex items-center justify-between gap-4">
                      <div>
                        <span className="text-[9px] font-black text-teal-600 uppercase tracking-wider">{audio.duration} • {audio.category}</span>
                        <h4 className="font-bold text-slate-900 mt-1 text-sm">{audio.title}</h4>
                      </div>
                      <button className="w-10 h-10 rounded-full bg-teal-500 hover:bg-teal-600 text-white flex items-center justify-center shadow-sm">
                        <svg className="w-4 h-4 fill-white ml-0.5" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
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
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Grounding Assistant */}
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm min-h-[350px] flex flex-col">
                <h3 className="font-extrabold text-xl mb-1 text-slate-900">5-4-3-2-1 Grounding Assistant</h3>
                <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-6">Grounding Technique</span>

                <div className="flex-1 flex flex-col justify-center items-center py-6 text-center">
                  {groundingStep === 5 && (
                    <div className="animate-in fade-in duration-300">
                      <span className="text-xs font-black text-orange-600 uppercase tracking-wider block mb-2">Step 1 of 5</span>
                      <h4 className="text-xl font-extrabold text-slate-900 mb-2">Identify 5 things you can see</h4>
                      <p className="text-slate-400 text-xs font-medium max-w-xs mx-auto leading-relaxed">Focus on small, stationary objects in your line of sight.</p>
                    </div>
                  )}
                  {groundingStep === 4 && (
                    <div className="animate-in fade-in duration-300">
                      <span className="text-xs font-black text-orange-600 uppercase tracking-wider block mb-2">Step 2 of 5</span>
                      <h4 className="text-xl font-extrabold text-slate-900 mb-2">Identify 4 things you can touch</h4>
                      <p className="text-slate-400 text-xs font-medium max-w-xs mx-auto leading-relaxed">Notice the texture of fabric, wood surfaces, or your breathing muscles.</p>
                    </div>
                  )}
                  {groundingStep === 3 && (
                    <div className="animate-in fade-in duration-300">
                      <span className="text-xs font-black text-orange-600 uppercase tracking-wider block mb-2">Step 3 of 5</span>
                      <h4 className="text-xl font-extrabold text-slate-900 mb-2">Identify 3 things you can hear</h4>
                      <p className="text-slate-400 text-xs font-medium max-w-xs mx-auto leading-relaxed">Listen for distant traffic, ambient hums, or the rustle of leaves.</p>
                    </div>
                  )}
                  {groundingStep === 2 && (
                    <div className="animate-in fade-in duration-300">
                      <span className="text-xs font-black text-orange-600 uppercase tracking-wider block mb-2">Step 4 of 5</span>
                      <h4 className="text-xl font-extrabold text-slate-900 mb-2">Identify 2 things you can smell</h4>
                      <p className="text-slate-400 text-xs font-medium max-w-xs mx-auto leading-relaxed">Sniff the air, hand soap, clothing, or a book.</p>
                    </div>
                  )}
                  {groundingStep === 1 && (
                    <div className="animate-in fade-in duration-300">
                      <span className="text-xs font-black text-orange-600 uppercase tracking-wider block mb-2">Step 5 of 5</span>
                      <h4 className="text-xl font-extrabold text-slate-900 mb-2">Identify 1 thing you can taste</h4>
                      <p className="text-slate-400 text-xs font-medium max-w-xs mx-auto leading-relaxed">Notice the natural taste in your mouth, or take a sip of cool water.</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-50">
                  <button
                    disabled={groundingStep === 5}
                    onClick={() => setGroundingStep((prev) => prev + 1)}
                    className="px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl font-bold text-xs text-slate-500 disabled:opacity-30 transition-all"
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
                    className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-black text-xs uppercase tracking-wider transition-all"
                  >
                    {groundingStep === 1 ? "Start Over" : "Next Step"}
                  </button>
                </div>
              </div>

              {/* Support Hotlines */}
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6">
                <h3 className="font-extrabold text-xl text-slate-900">Verified Support Lines</h3>
                
                <div className="space-y-4">
                  {[
                    { name: "Tele MANAS Helpline", number: "14416", desc: "Available 24/7. National crisis response support." },
                    { name: "KIRAN Support", number: "1800-599-0019", desc: "Government mental health service." },
                    { name: "Vandrevala Foundation", number: "9999 666 555", desc: "Crisis and trauma counseling helpline." }
                  ].map((line, idx) => (
                    <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <div>
                        <h4 className="font-black text-slate-800 text-sm">{line.name}</h4>
                        <span className="text-base font-black text-orange-600 mt-0.5 block">{line.number}</span>
                        <p className="text-[10px] text-slate-400 font-semibold mt-1">{line.desc}</p>
                      </div>
                      <a
                        href={`tel:${line.number.replace(/\s+/g, "")}`}
                        className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-full font-black text-xs tracking-wider"
                      >
                        CALL
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
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Special Populations */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
              <h3 className="font-extrabold text-xl mb-6 text-slate-900">Tips for Special Populations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-black text-teal-600 uppercase tracking-wider block mb-1">Adolescents</span>
                  <h4 className="font-bold text-slate-900 text-base mb-1">Children & Teenagers</h4>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed">
                    Identify developmental mood shifts, foster verbal emotional outlets, and support structured home patterns.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-wider block mb-1">Geriatric</span>
                  <h4 className="font-bold text-slate-900 text-base mb-1">Elders & Seniors</h4>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed">
                    Address retirement isolation, early-stage cognitive memory shifts, and routine physical checks.
                  </p>
                </div>

              </div>
            </div>

            {/* Reference Articles */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
              <h3 className="font-extrabold text-xl mb-6 text-slate-900">Condition Reference Articles</h3>
              <div className="divide-y divide-slate-100">
                {[
                  { title: "Gender Patterns in Mental Health", desc: "Understanding the unique socio-cultural and diagnostic trends in mental health." },
                  { title: "Active Listening and Peer Support", desc: "How to effectively listen and support someone struggling with their mental health." }
                ].map((article, i) => (
                  <div key={i} className="py-4 first:pt-0 last:pb-0 flex justify-between items-center gap-4">
                    <div>
                      <h4 className="font-bold text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer text-sm">{article.title}</h4>
                      <p className="text-xs text-slate-400 font-medium mt-1">{article.desc}</p>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 hover:text-slate-600 cursor-pointer uppercase tracking-wider">Read File</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Symptom Clusters */}
            <div className="space-y-4">
              <h3 className="font-extrabold text-xl text-slate-900">Recognizing Symptom Clusters</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[
                  { label: "Behavioral Problems", desc: "Noticeable shifts in sleep pattern, dietary logs, and routine participation." },
                  { label: "Physical Symptoms", desc: "Chest compression feelings, continuous muscle tension, heart rate spikes." },
                  { label: "Social Withdrawal", desc: "Hesitation to return texts, avoidance of team sessions or family calls." },
                  { label: "Substance Dependence", desc: "Relying on escape behaviors or dependencies to manage daily stress." },
                  { label: "Cognitive Dissociation", desc: "Feeling detached from environments or losing touch with immediate tasks." },
                  { label: "Executive Dysfunction", desc: "Continuous memory blocks, daily plan delays, high overwhelm." }
                ].map((symptom, i) => (
                  <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                    <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest block mb-2">Category {i + 1}</span>
                    <h4 className="font-bold text-slate-900 text-sm mb-2">{symptom.label}</h4>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">{symptom.desc}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* --- 4. SUCCESS STORIES --- */}
        {activeTab === "stories" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { name: "Rahul S.", age: "28", text: "Daily mindfulness work completely resolved my workplace anxiety cycles.", tag: "Recovered" },
                { name: "Priya M.", age: "34", text: "Revisiting visual grounding steps helped me manage panic triggers. I feel in control again.", tag: "Resilient" },
                { name: "Anil K.", age: "42", text: "Finding clinical counseling options early gave me strong coping tools for burnout.", tag: "Balanced" }
              ].map((story, idx) => (
                <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
                  <p className="text-slate-500 font-medium italic leading-relaxed mb-6 text-sm">
                    "{story.text}"
                  </p>
                  <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                    <div>
                      <h4 className="font-bold text-slate-950 text-sm">{story.name}</h4>
                      <span className="text-[10px] text-slate-400 font-semibold">Age {story.age}</span>
                    </div>
                    <span className="px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-black uppercase tracking-wider">
                      {story.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- 5. SELF HELP MODULE --- */}
        {activeTab === "selfhelp" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Assessment Quiz */}
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                <h3 className="font-extrabold text-xl mb-1 text-slate-900">Self Assessment</h3>
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block mb-6">Wellness Assessment</span>

                {quizScore === null ? (
                  <form onSubmit={handleQuizSubmit} className="space-y-6">
                    {[
                      { id: 1, text: "How often have you felt down, fatigued, or hopeless lately?" },
                      { id: 2, text: "How often have you felt on edge or had difficulty relaxing?" },
                      { id: 3, text: "Are you struggling to complete everyday focus tasks?" }
                    ].map((q) => (
                      <div key={q.id} className="space-y-3">
                        <p className="font-bold text-slate-800 text-xs">{q.id}. {q.text}</p>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { label: "Not at all", val: 0 },
                            { label: "Occasionally", val: 1 },
                            { label: "Regularly", val: 2 }
                          ].map((opt, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setQuizAnswers({ ...quizAnswers, [q.id]: opt.val })}
                              className={`py-2 px-3 text-[10px] font-black rounded-xl border text-center transition-all ${
                                quizAnswers[q.id] === opt.val
                                  ? "bg-emerald-500 text-white border-emerald-500 shadow-sm"
                                  : "bg-white text-slate-500 border-slate-100 hover:bg-slate-50"
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
                      className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-30 text-white font-black text-xs rounded-xl uppercase tracking-wider transition-all"
                    >
                      Calculate Report
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-6 animate-in zoom-in duration-300">
                    <span className="text-xs font-black text-emerald-600 uppercase tracking-widest block mb-2">Results</span>
                    <h4 className="text-lg font-extrabold text-slate-900 mb-2">Wellness Index: {quizScore} / 6</h4>
                    <p className="text-slate-400 text-xs font-medium max-w-sm mx-auto leading-relaxed">
                      {quizScore <= 2 && "Minimal stress patterns. Keep up your active routine check-ins."}
                      {quizScore > 2 && quizScore <= 4 && "Moderate tension. Grounding exercises and deep breathing tools are recommended."}
                      {quizScore > 4 && "High tension patterns. We advise reviewing schedule options with your counselor."}
                    </p>
                    <button
                      onClick={() => {
                        setQuizScore(null)
                        setQuizAnswers({})
                      }}
                      className="mt-6 px-6 py-2.5 border border-emerald-200 text-emerald-600 hover:bg-emerald-50 font-bold text-xs rounded-xl transition-all"
                    >
                      Reset Quiz
                    </button>
                  </div>
                )}
              </div>

              {/* PDF Downloads */}
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6">
                <h3 className="font-extrabold text-xl text-slate-900">Worksheet Files</h3>
                
                <div className="space-y-4">
                  {[
                    { title: "Cognitive Distortions Guide", size: "1.2 MB" },
                    { title: "Daily Anxiety Tracker Log", size: "640 KB" },
                    { title: "Sleep Hygiene Check-list", size: "820 KB" }
                  ].map((doc, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs">{doc.title}</h4>
                        <span className="text-[9px] text-slate-400 font-bold mt-0.5 block">{doc.size}</span>
                      </div>
                      <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-sm transition-all">
                        Download
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
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Sudoku */}
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col items-center">
                <h3 className="font-extrabold text-xl mb-1 text-slate-900">Brain Busters: Sudoku</h3>
                <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-6">Cognitive Focus</span>

                {/* Grid */}
                <div className="grid grid-cols-9 gap-1 border-2 border-slate-800 p-1 bg-slate-800 rounded-lg shadow-md">
                  {sudokuGrid.map((row, rIdx) =>
                    row.map((val, cIdx) => (
                      <input
                        key={`${rIdx}-${cIdx}`}
                        type="text"
                        maxLength={1}
                        value={val === 0 ? "" : val}
                        onChange={(e) => handleSudokuChange(rIdx, cIdx, e.target.value)}
                        className={`w-8 h-8 md:w-9 md:h-9 text-center font-bold text-sm border-0 focus:ring-2 focus:ring-rose-400 rounded transition-all ${
                          sudokuInitial[rIdx][cIdx]
                            ? "bg-slate-100 text-slate-800 font-extrabold cursor-not-allowed"
                            : "bg-white text-rose-600 font-medium"
                        }`}
                      />
                    ))
                  )}
                </div>
              </div>

              {/* Thought Diary */}
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col">
                <h3 className="font-extrabold text-xl mb-1 text-slate-900">Thought Diary</h3>
                <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-6">Local Journal Log</span>

                <form onSubmit={handleJournalSave} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">
                      Current Mood State
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {["Calm", "Happy", "Tired", "Anxious", "Sad"].map((mood) => (
                        <button
                          key={mood}
                          type="button"
                          onClick={() => setSelectedMood(mood)}
                          className={`py-1.5 px-3.5 rounded-full text-[10px] font-black border transition-all ${
                            selectedMood === mood
                              ? "bg-rose-500 text-white border-rose-500"
                              : "bg-white text-slate-500 border-slate-100 hover:bg-slate-50"
                          }`}
                        >
                          {mood}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">
                      Observations & Reflections
                    </label>
                    <textarea
                      rows={3}
                      value={journalText}
                      onChange={(e) => setJournalText(e.target.value)}
                      placeholder="Write whatever is on your mind..."
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent placeholder:text-slate-300"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-black text-xs rounded-xl uppercase tracking-wider transition-all"
                  >
                    Save Entry
                  </button>
                </form>

                {/* Diary History */}
                <div className="mt-8 flex-1">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-3">Diary History</h4>
                  <div className="space-y-3 max-h-40 overflow-y-auto pr-2 scrollbar-thin">
                    {journalEntries.map((entry) => (
                      <div key={entry.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] font-bold text-slate-400">{entry.date}</span>
                          <span className="text-[10px] font-black bg-white px-2 py-0.5 rounded-full border border-slate-100">{entry.mood}</span>
                        </div>
                        <p className="text-xs text-slate-600 font-medium leading-relaxed">{entry.text}</p>
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
