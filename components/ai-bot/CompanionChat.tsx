"use client"

import type { FormEvent } from "react"
import { motion } from "framer-motion"

export type CompanionChatMessage = {
  id: string
  role: "user" | "assistant"
  content: string
}

export type CompanionChatProps = {
  userName: string
  messages: CompanionChatMessage[]
  inputValue: string
  onInputChange: (value: string) => void
  onSend: () => void
  isTyping?: boolean
  inputDisabled?: boolean
}

const aiBubbleClass =
  "max-w-[75%] self-start border border-[var(--color-border)] bg-[var(--color-surface-raised)] rounded-tl-none rounded-tr-[var(--radius-lg)] rounded-br-[var(--radius-lg)] rounded-bl-[var(--radius-lg)] px-[18px] py-[14px] text-[var(--color-text-primary)]"

const userBubbleClass =
  "max-w-[75%] self-end bg-[var(--color-brand)] text-white rounded-tl-[var(--radius-lg)] rounded-tr-none rounded-br-[var(--radius-lg)] rounded-bl-[var(--radius-lg)] px-[18px] py-[14px]"

function SendArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

function TypingDots() {
  return (
    <div
      className="flex items-center gap-1.5"
      aria-live="polite"
      aria-label="Companion is typing"
    >
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="inline-block h-2 w-2 rounded-full bg-[var(--color-text-muted)]"
          animate={{ y: [0, -6, 0] }}
          transition={{
            duration: 0.45,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.15,
          }}
        />
      ))}
    </div>
  )
}

export default function CompanionChat({
  userName,
  messages,
  inputValue,
  onInputChange,
  onSend,
  isTyping = false,
  inputDisabled = false,
}: CompanionChatProps) {
  const showEmpty = messages.length === 0 && !isTyping

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    onSend()
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[var(--color-bg)]">
      <div className="mx-auto flex min-h-0 w-full max-w-[680px] flex-1 flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 pt-2 sm:px-6">
          {showEmpty && (
            <div className="flex min-h-[40vh] flex-col items-center justify-center px-2 text-center">
              <p
                className="text-[var(--color-text-secondary)]"
                style={{ fontSize: "var(--text-lg)" }}
              >
                Hi {userName}. I am here whenever you want to talk.
              </p>
            </div>
          )}

          {(messages.length > 0 || isTyping) && (
            <div className="flex flex-col gap-3 py-2">
              {messages.map((m) =>
                m.role === "assistant" ? (
                  <div
                    key={m.id}
                    className={aiBubbleClass}
                    style={{
                      fontSize: "var(--text-base)",
                      lineHeight: "var(--leading-loose)",
                    }}
                  >
                    {m.content}
                  </div>
                ) : (
                  <div
                    key={m.id}
                    className={userBubbleClass}
                    style={{
                      fontSize: "var(--text-base)",
                      lineHeight: "var(--leading-loose)",
                    }}
                  >
                    {m.content}
                  </div>
                )
              )}
              {isTyping && (
                <div
                  className={`${aiBubbleClass} flex items-center`}
                  style={{ maxWidth: "75%" }}
                >
                  <TypingDots />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="sticky bottom-0 z-10 border-t border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-4">
          <form
            onSubmit={handleSubmit}
            className="mx-auto flex max-w-[680px] items-end gap-3"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
              disabled={inputDisabled}
              placeholder="Message…"
              className="min-h-[48px] min-w-0 flex-1 border border-[var(--color-border)] bg-[var(--color-bg)] px-5 py-3 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-brand)] focus:outline-none disabled:opacity-60"
              style={{
                borderRadius: "var(--radius-xl)",
                fontSize: "var(--text-base)",
              }}
              aria-label="Message input"
            />
            <button
              type="submit"
              disabled={inputDisabled || !inputValue.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand)] text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Send message"
            >
              <SendArrowIcon className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
