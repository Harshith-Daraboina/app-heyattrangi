"use client"

import { useState, useRef, useEffect, useMemo, type FormEvent } from "react"
import Image from "next/image"

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

interface ChatMode {
  id: string
  title: string
  description: string
}

const CHAT_MODES: ChatMode[] = [
  { id: "listen", title: "Just Listen", description: "I'll hear you out and validate your feelings." },
  { id: "reflect", title: "Reflect", description: "I'll help you see patterns and clarify thoughts." },
  { id: "think", title: "Help Me Think", description: "We'll brainstorm or untangle a problem." },
  { id: "direct", title: "Answer Directly", description: "No fluff, just straight answers." },
]

const EXPRESSION_KEYWORDS: Record<string, string[]> = {
  SAFETY: ["concerned", "helpline", "reach out", "trusted person", "please", "danger", "safe", "crisis", "emergency"],
  COMFORTING: ["comfort", "here for you", "not alone", "support", "hug", "care", "by your side", "always here"],
  EMPATHETIC: ["understand", "hear you", "feel", "must be", "sounds", "that's hard", "that must", "empathize"],
  REFLECTIVE: ["wonder", "reflect", "think about", "perhaps", "maybe", "could it be", "it seems", "ponder"],
  WARM: ["glad", "happy", "wonderful", "lovely", "beautiful", "warmth", "smile", "joy", "positive"],
  STRESSED: ["overwhelm", "stress", "anxious", "anxiety", "pressure", "too much", "exhaust", "burden"],
  TIRED: ["tired", "exhausted", "drained", "fatigue", "worn out", "sleep", "rest", "heavy"],
  STEADY: ["okay", "alright", "stable", "steady", "manage", "cope", "going through"],
  TALKING: ["tell me", "share", "want to talk", "what happened", "go on", "listening", "what's going on"],
  NEUTRAL: ["noted", "sure", "okay", "right", "yes", "no"],
}

function getBotExpression(text: string): string {
  const textLower = text.toLowerCase()
  for (const [expression, keywords] of Object.entries(EXPRESSION_KEYWORDS)) {
    if (keywords.some((kw) => textLower.includes(kw))) {
      return expression
    }
  }
  return "DEFAULT"
}

export default function TryPragyaChat({ sessionId }: { sessionId: string }) {
  const [hasStarted, setHasStarted] = useState(false)
  const [selectedMode, setSelectedMode] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [botExpression, setBotExpression] = useState("NEUTRAL")
  const [summarizing, setSummarizing] = useState(false)
  const [summaryOpen, setSummaryOpen] = useState(false)
  const [summaryReport, setSummaryReport] = useState<string | null>(null)
  const [summaryError, setSummaryError] = useState<string | null>(null)
  const [summarizeHint, setSummarizeHint] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const hasUserMessages = useMemo(() => messages.some((m) => m.role === "user"), [messages])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleStartChat = () => {
    if (selectedMode) {
      setHasStarted(true)
      const modeDetails = CHAT_MODES.find((m) => m.id === selectedMode)
      const initialMsg = `Hi! I'm setting my mode to: ${modeDetails?.title}. How can I help you today?`
      setMessages([{ role: "assistant", content: initialMsg }])
      setBotExpression("NEUTRAL")
    }
  }

  const sendMessage = async (e?: FormEvent) => {
    e?.preventDefault()
    if (!inputMessage.trim() || isLoading) return

    const userMsg = inputMessage
    setInputMessage("")
    setMessages((prev) => [...prev, { role: "user", content: userMsg }])
    setIsLoading(true)

    try {
      const res = await fetch("/api/pragya/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, message: userMsg }),
      })

      if (!res.ok) throw new Error("Failed to send message")

      const data = (await res.json()) as { reply?: string }
      const reply = typeof data.reply === "string" ? data.reply : "Sorry, I didn't get a proper reply."
      setMessages((prev) => [...prev, { role: "assistant", content: reply }])
      setBotExpression(getBotExpression(reply))
    } catch (error) {
      console.error("Chat error:", error)
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I'm having trouble connecting right now." },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const resetChat = () => {
    setHasStarted(false)
    setSelectedMode(null)
    setMessages([])
    setBotExpression("NEUTRAL")
    setSummaryOpen(false)
    setSummaryReport(null)
    setSummaryError(null)
    setSummarizeHint(null)
  }

  const endAndSummarize = async () => {
    setSummarizeHint(null)
    if (!hasUserMessages) {
      setSummarizeHint("Send at least one message so we can summarize your chat.")
      return
    }
    setSummarizing(true)
    setSummaryError(null)
    try {
      const res = await fetch("/api/pragya/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId }),
      })
      const data = (await res.json().catch(() => ({}))) as { report?: string; error?: string }
      if (!res.ok) {
        setSummaryReport(null)
        setSummaryError(typeof data.error === "string" ? data.error : "Could not load summary.")
        setSummaryOpen(true)
        return
      }
      const report = typeof data.report === "string" ? data.report : "No summary returned."
      setSummaryReport(report)
      setSummaryOpen(true)
    } catch {
      setSummaryReport(null)
      setSummaryError("Network error. Try again in a moment.")
      setSummaryOpen(true)
    } finally {
      setSummarizing(false)
    }
  }

  const closeSummaryOnly = () => {
    setSummaryOpen(false)
  }

  const endSessionAfterSummary = () => {
    setSummaryOpen(false)
    setSummaryReport(null)
    setSummaryError(null)
    resetChat()
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-gray-50 font-sans text-gray-800">
      <div className="mx-auto flex min-h-0 w-full max-w-[1600px] flex-1 overflow-hidden">
        <div className="relative z-10 flex w-[360px] shrink-0 flex-col items-center border-r border-gray-200 bg-white/90 px-6 py-8 shadow-[4px_0_24px_rgba(0,0,0,0.02)] backdrop-blur-md md:w-[400px]">
          <h1 className="mb-8 text-xl font-bold tracking-wide text-gray-800">Hey Attrangi</h1>

          <div className="group relative mb-8 h-[320px] w-[320px] overflow-hidden rounded-[2.5rem] border border-orange-50/50 shadow-[0_20px_50px_rgba(249,107,19,0.15)]">
            <div className="absolute left-5 top-5 z-30 rounded-[12px] bg-orange-50/80 p-2.5 shadow-sm backdrop-blur-md">
              <svg className="h-5 w-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10.8 4.2a1 1 0 011.05.53l.9 1.8A1 1 0 0013.8 7h2.4a2 2 0 012 2v2.4a1 1 0 00.53.9l1.8.9a1 1 0 010 1.8l-1.8.9a1 1 0 00-.53.9v2.4a2 2 0 01-2 2h-2.4a1 1 0 00-.9.53l-.9 1.8a1 1 0 01-1.8 0l-.9-1.8a1 1 0 00-.9-.53H6a2 2 0 01-2-2v-2.4a1 1 0 00-.53-.9l-1.8-.9a1 1 0 010-1.8l1.8-.9A1 1 0 004 8.6V6a2 2 0 012-2h2.4a1 1 0 00.9-.53l.9-1.8A1 1 0 0110.8 4.2z" />
              </svg>
            </div>
            <div className="relative h-full w-full transform transition-transform duration-700 ease-out group-hover:scale-105">
              <Image
                src={`/bot_expressions/${botExpression}.jpg`}
                alt="Pragya Avatar"
                fill
                className="object-cover"
                sizes="320px"
                priority
                unoptimized
              />
            </div>
          </div>

          <div className="group mb-10 flex cursor-default items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-1.5 shadow-inner transition-all duration-300 hover:border-orange-200">
            <div className="h-1.5 w-1.5 rounded-full bg-gray-400 transition-colors group-hover:bg-orange-400" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500 transition-colors group-hover:text-gray-600">
              {botExpression} MODE
            </span>
          </div>

          <div className="mb-8 mt-auto w-full max-w-[280px] space-y-3">
            <button
              type="button"
              onClick={resetChat}
              className="flex w-full items-center justify-center gap-2 rounded-[16px] border border-gray-200 bg-white px-4 py-4 text-[15px] font-medium text-gray-600 shadow-sm transition-colors hover:bg-gray-50"
            >
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Reset Chat
            </button>
            <button
              type="button"
              onClick={endAndSummarize}
              disabled={summarizing}
              className="flex w-full items-center justify-center gap-2 rounded-[16px] border border-orange-500 bg-gradient-to-r from-orange-600 to-orange-500 px-4 py-4 text-[15px] font-medium text-white shadow-md transition-colors hover:from-orange-700 hover:to-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <svg className="h-5 w-5 shrink-0 text-orange-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
              {summarizing ? "Summarizing…" : "End & Summarize"}
            </button>
            {summarizeHint && (
              <p className="text-center text-[12px] font-medium text-orange-700">{summarizeHint}</p>
            )}
          </div>

          <div className="mt-auto max-w-[280px] space-y-1.5 px-4 pb-4 text-center">
            <p className="text-[12px] font-medium text-gray-500">I am an AI mental health companion.</p>
            <p className="text-[12px] font-medium text-gray-500">I can listen, reflect, and support you.</p>
            <p className="text-[12px] font-medium text-gray-500">I am not a replacement for professional help.</p>
          </div>
        </div>

        <div className="relative flex min-h-0 flex-1 justify-center overflow-y-auto bg-[#fafcfd]">
          <div className="absolute right-6 top-6 z-50 hidden lg:block">
            <button
              type="button"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-md transition-all hover:border-orange-300 hover:text-orange-500 hover:shadow-lg"
              aria-label="Menu"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {!hasStarted ? (
            <div className="flex h-full min-h-[560px] w-full max-w-xl animate-in fade-in slide-in-from-bottom-6 flex-col justify-center px-8 py-12 duration-700 ease-out">
              <h2 className="mb-8 ml-1 text-[28px] font-bold tracking-tight text-gray-800">
                How can I help you today?
              </h2>

              <div className="space-y-4">
                {CHAT_MODES.map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setSelectedMode(mode.id)}
                    className={`flex w-full cursor-pointer flex-col justify-center rounded-2xl border-2 px-6 py-5 text-left transition-all duration-300 ease-out ${
                      selectedMode === mode.id
                        ? "translate-x-2 border-orange-400 bg-orange-50 shadow-[0_8px_20px_rgba(249,107,19,0.15)] ring-1 ring-orange-400/20"
                        : "border-gray-100 bg-white hover:border-orange-200 hover:bg-orange-50/30 hover:shadow-sm"
                    }`}
                  >
                    <h3
                      className={`mb-1 text-[16px] font-bold ${
                        selectedMode === mode.id ? "text-orange-700" : "text-gray-800"
                      }`}
                    >
                      {mode.title}
                    </h3>
                    <p className="text-[14px] font-medium text-gray-500">{mode.description}</p>
                  </button>
                ))}
              </div>

              <div className="mt-10 flex w-full justify-end">
                <button
                  type="button"
                  onClick={handleStartChat}
                  disabled={!selectedMode}
                  className={`flex items-center gap-2 rounded-xl px-8 py-4 font-bold transition-all duration-300 ${
                    selectedMode
                      ? "bg-orange-500 text-white shadow-[0_8px_20px_rgba(249,107,19,0.3)] hover:-translate-y-1 hover:bg-orange-600"
                      : "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                  }`}
                >
                  Start Chatting
                  {selectedMode && (
                    <svg className="ml-1 h-5 w-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="my-auto flex h-[min(90vh,800px)] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white animate-in fade-in zoom-in-95 duration-500 md:border md:border-gray-100 md:shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
              <div className="scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent flex-1 space-y-6 overflow-y-auto bg-[#fafcfd] p-6 md:p-8">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex animate-in slide-in-from-bottom-2 duration-300 ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-3xl p-5 text-[15px] leading-relaxed shadow-sm sm:max-w-[75%] ${
                        msg.role === "user"
                          ? "rounded-tr-sm bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-[0_4px_14px_rgba(249,107,19,0.25)]"
                          : "rounded-tl-sm border border-gray-100 bg-white text-gray-800 shadow-[0_2px_10px_rgba(0,0,0,0.04)]"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex animate-in fade-in justify-start duration-300">
                    <div className="flex h-14 items-center space-x-2 rounded-3xl rounded-tl-sm border border-gray-100 bg-white p-5 shadow-sm">
                      <div className="h-2.5 w-2.5 animate-bounce rounded-full bg-orange-400/60" />
                      <div
                        className="h-2.5 w-2.5 animate-bounce rounded-full bg-orange-400/80"
                        style={{ animationDelay: "0.2s" }}
                      />
                      <div
                        className="h-2.5 w-2.5 animate-bounce rounded-full bg-orange-500"
                        style={{ animationDelay: "0.4s" }}
                      />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} className="h-4" />
              </div>

              <div className="z-10 border-t border-gray-100 bg-white p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.02)] md:p-6">
                <form onSubmit={sendMessage} className="relative mx-auto flex max-w-4xl items-center">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type your message here..."
                    className="w-full rounded-2xl border border-gray-100 bg-gray-50 py-4 pl-6 pr-16 text-[15px] text-gray-800 shadow-inner placeholder:text-gray-400 transition-all focus:border-orange-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-100"
                    disabled={isLoading}
                    autoFocus
                  />
                  <div className="absolute bottom-2 right-2 top-2 flex items-center">
                    <button
                      type="submit"
                      disabled={isLoading || !inputMessage.trim()}
                      className={`flex aspect-square h-full items-center justify-center rounded-[12px] p-2.5 transition-all duration-300 ${
                        isLoading || !inputMessage.trim()
                          ? "bg-transparent text-gray-400"
                          : "bg-orange-500 text-white shadow-md shadow-orange-500/30 hover:-translate-y-0.5 hover:bg-orange-600 hover:shadow-lg"
                      }`}
                    >
                      <svg className="h-5 w-5 translate-x-[-1px] translate-y-[1px]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                      </svg>
                    </button>
                  </div>
                </form>
                <p className="mt-4 hidden text-center text-[11px] font-medium text-gray-500 md:block">
                  Pragya may produce inaccurate information about people, places, or facts.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {summaryOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pragya-summary-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/40 transition-opacity duration-300"
            aria-label="Close summary"
            onClick={closeSummaryOnly}
          />
          <div className="relative z-10 flex max-h-[min(85vh,720px)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl duration-300 animate-in fade-in zoom-in-95">
            <div className="border-b border-gray-100 px-5 py-4 sm:px-6">
              <h2 id="pragya-summary-title" className="text-lg font-bold text-gray-800">
                Session summary
              </h2>
              <p className="mt-1 text-[13px] text-gray-500">
                For your reflection only — not a diagnosis or medical record.
              </p>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 sm:px-6">
              {summaryError ? (
                <p className="text-[15px] leading-relaxed text-red-600">{summaryError}</p>
              ) : (
                <pre className="whitespace-pre-wrap font-sans text-[14px] leading-relaxed text-gray-800">
                  {summaryReport}
                </pre>
              )}
            </div>
            <div className="flex flex-col gap-2 border-t border-gray-100 bg-gray-50/80 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
              <button
                type="button"
                onClick={closeSummaryOnly}
                className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-[15px] font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
              >
                Close
              </button>
              <button
                type="button"
                onClick={endSessionAfterSummary}
                className="rounded-xl bg-orange-500 px-4 py-3 text-[15px] font-medium text-white shadow-md transition-colors hover:bg-orange-600"
              >
                End session & reset chat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
