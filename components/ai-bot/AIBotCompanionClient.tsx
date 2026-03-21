"use client"

import { useState } from "react"
import CompanionChat, {
  type CompanionChatMessage,
} from "@/components/ai-bot/CompanionChat"

type Props = {
  userName: string
}

/**
 * Local-only messages for UI (no fetch / no AI). Outgoing bubbles appear when you send.
 */
export default function AIBotCompanionClient({ userName }: Props) {
  const [inputValue, setInputValue] = useState("")
  const [messages, setMessages] = useState<CompanionChatMessage[]>([])

  function handleSend() {
    const text = inputValue.trim()
    if (!text) return
    setMessages((prev) => [
      ...prev,
      {
        id:
          typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : `m-${Date.now()}`,
        role: "user",
        content: text,
      },
    ])
    setInputValue("")
  }

  return (
    <CompanionChat
      userName={userName}
      messages={messages}
      inputValue={inputValue}
      onInputChange={setInputValue}
      onSend={handleSend}
      isTyping={false}
    />
  )
}
