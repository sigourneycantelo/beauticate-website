'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import ChatMessage from '@/components/chat/ChatMessage'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const CATEGORY_SUGGESTIONS: Record<string, string[]> = {
  'beauty-style': [
    'What serum should I use for dry skin?',
    'How do I stop my foundation oxidising?',
    'Best sunscreen that doesn\'t leave a white cast?',
    'What order should I apply my skincare?',
  ],
  'wellness': [
    'What supplements should I take daily?',
    'How can I improve my sleep naturally?',
    'Best morning routine for energy?',
    'What foods are good for gut health?',
  ],
  'destinations': [
    'Where should I stay in Bali?',
    'Best day spa in Sydney?',
    'Where to go for a wellness retreat?',
    'Best boutique hotels in Melbourne?',
  ],
  'living': [
    'How do I make my home smell amazing?',
    'Best candles worth the investment?',
    'Tips for a calming bedroom?',
    'What kitchen gadgets are actually worth it?',
  ],
  'interviews': [
    'Who has the best skincare routine?',
    'What do makeup artists actually use?',
    'Best advice from a dermatologist?',
    'What do beauty editors swear by?',
  ],
  'vodcast': [
    'Which episode should I listen to first?',
    'Best episodes about skincare?',
    'Any episodes on wellness and mental health?',
    'Which guest had the best beauty tips?',
  ],
}

const DEFAULT_SUGGESTIONS = [
  'What should I use on my skin at night?',
  'Best travel destination for a girls\' trip?',
  'What supplements do you take?',
  'Recommend a good candle',
]

export default function AskSigDemo() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [autoSent, setAutoSent] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const searchParams = useSearchParams()

  const initialQuestion = searchParams.get('q') || ''
  const fromCategory = searchParams.get('from') || ''
  const suggestions = CATEGORY_SUGGESTIONS[fromCategory] || DEFAULT_SUGGESTIONS

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

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || streaming) return

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
  }, [messages, streaming])

  // Auto-send the question from ?q= param
  useEffect(() => {
    if (initialQuestion && !autoSent && messages.length === 0) {
      setAutoSent(true)
      sendMessage(initialQuestion)
    }
  }, [initialQuestion, autoSent, messages.length, sendMessage])

  function handleSend() {
    sendMessage(input.trim())
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function handleSuggestion(text: string) {
    sendMessage(text)
  }

  return (
    <div className="fixed inset-0 z-[99999] bg-[#efece6] flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-[480px] flex flex-col h-[min(700px,85vh)] bg-[#f7f6f4] rounded-2xl shadow-2xl overflow-hidden border border-line">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 bg-white border-b border-line shrink-0">
          <div className="w-12 h-12 rounded-full overflow-hidden ring-[3px] ring-wine shrink-0">
            <Image
              src="/images/sig-chat-avatar.png"
              alt="Sigourney Cantelo"
              width={48}
              height={48}
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-serif text-xl text-ink leading-tight">Ask Sig</p>
            <p className="text-xs font-sans text-muted tracking-wide">Beauty, wellness & style</p>
          </div>
          <span className="text-xs font-sans text-muted/60 tracking-widest uppercase">Beauticate</span>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.length === 0 && (
            <div className="text-center py-8 px-4">
              <p className="font-serif text-2xl text-ink mb-3">Ask me anything about beauty, wellness or style.</p>
              <p className="text-sm font-sans text-muted leading-relaxed mb-8">I draw on 25 years of beauty journalism and everything on Beauticate.</p>

              <div className="space-y-2">
                {suggestions.map(s => (
                  <button
                    key={s}
                    onClick={() => handleSuggestion(s)}
                    className="block w-full text-left px-4 py-3 rounded-xl border border-line bg-white hover:border-wine/30 transition-colors text-sm font-sans text-ink"
                  >
                    {s}
                  </button>
                ))}
              </div>
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
              placeholder="Type a question..."
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
        </div>
      </div>

      {/* Footer */}
      <p className="mt-4 text-xs font-sans text-muted/50">
        Powered by <span className="font-serif tracking-wide">Beauticate</span>
      </p>
    </div>
  )
}
