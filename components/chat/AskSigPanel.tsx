'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import ChatMessage from './ChatMessage'
import { UI_DISCLAIMER } from '@/lib/chat/guardrails'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const GREETING = 'Ask me anything about beauty, wellness or style.'

export default function AskSigPanel({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  async function handleSend() {
    const text = input.trim()
    if (!text || streaming) return

    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: text }
    const assistantMsg: Message = { id: crypto.randomUUID(), role: 'assistant', content: '' }

    const updated = [...messages, userMsg]
    setMessages([...updated, assistantMsg])
    setInput('')
    setStreaming(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // What the reader was looking at when they asked. Logged so we can
          // see which pages prompt which questions.
          pageContext: typeof window !== 'undefined' ? window.location.pathname : undefined,
          messages: updated.map(m => ({ role: m.role, content: m.content })),
        }),
      })

      if (!res.ok || !res.body) throw new Error('Failed to connect')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let fullText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const payload = line.slice(6)
          if (payload === '[DONE]') break
          try {
            const { text: chunk } = JSON.parse(payload)
            if (chunk) {
              fullText += chunk
              setMessages(prev => {
                const copy = [...prev]
                copy[copy.length - 1] = { ...copy[copy.length - 1], content: fullText }
                return copy
              })
            }
          } catch {}
        }
      }
    } catch {
      setMessages(prev => {
        const copy = [...prev]
        copy[copy.length - 1] = {
          ...copy[copy.length - 1],
          content: "Sorry, I couldn't connect just now. Try again in a moment?",
        }
        return copy
      })
    } finally {
      setStreaming(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-[9999] w-full sm:w-[400px] h-[60dvh] sm:h-[min(600px,80vh)] flex flex-col bg-[#f7f6f4] rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden border border-line">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-line shrink-0">
        <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-wine shrink-0">
          <Image
            src="/images/sig-chat-avatar.png"
            alt="Sigourney Cantelo"
            width={40}
            height={40}
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-serif text-lg text-ink leading-tight">Ask Sig</p>
          <p className="text-xs font-sans text-muted tracking-wide">Beauty, wellness & style</p>
        </div>
        <button
          onClick={onClose}
          className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-greige/60 sm:bg-transparent hover:bg-greige transition-colors text-ink sm:text-muted"
          aria-label="Close chat"
        >
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="sm:w-4 sm:h-4">
            <path d="M4 4l8 8M12 4l-8 8" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <p className="font-serif text-xl text-ink mb-2">{GREETING}</p>
            <p className="text-sm font-sans text-muted">I draw on 25 years of beauty journalism and everything on Beauticate.</p>
          </div>
        )}
        {messages.map(msg => (
          <ChatMessage key={msg.id} role={msg.role} content={msg.content} />
        ))}
        {streaming && messages[messages.length - 1]?.content === '' && (
          <div className="flex gap-1 px-4 py-3">
            <span className="w-2 h-2 rounded-full bg-muted animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 rounded-full bg-muted animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 rounded-full bg-muted animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="shrink-0 px-4 py-3 bg-white border-t border-line">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a question…"
            rows={1}
            className="flex-1 resize-none bg-transparent font-sans text-sm text-ink placeholder:text-muted outline-none max-h-24 py-2"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || streaming}
            className="w-8 h-8 rounded-full bg-wine text-white flex items-center justify-center shrink-0 disabled:opacity-40 transition-opacity"
            aria-label="Send"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
              <path d="M1.5 12.5L12.5 7L1.5 1.5V5.5L8.5 7L1.5 8.5V12.5Z" />
            </svg>
          </button>
        </div>
        <p className="mt-2 text-[11px] leading-snug font-sans text-muted">
          {UI_DISCLAIMER}{' '}
          <a href="/terms" className="underline hover:text-ink transition-colors">Terms</a>
        </p>
      </div>
    </div>
  )
}
