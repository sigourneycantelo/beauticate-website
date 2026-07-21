'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const CATEGORY_LABELS: Record<string, string> = {
  'beauty-style': 'beauty',
  'wellness': 'wellness',
  'living': 'home and lifestyle',
  'destinations': 'travel',
  'interviews': 'the people we interview',
  'vodcast': 'the podcast',
}

interface Props {
  category: string
  articleTitle: string
  articleUrl: string
}

export default function ReaderQuestion({ category, articleTitle, articleUrl }: Props) {
  const [question, setQuestion] = useState('')
  const router = useRouter()

  const topic = CATEGORY_LABELS[category] || 'beauty, wellness or lifestyle'

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const text = question.trim()
    if (!text) return

    // Send to Asana in the background (fire and forget)
    fetch('/api/reader-question', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: text, articleTitle, articleUrl, category }),
    }).catch(() => {})

    // Navigate to Ask Sig with the question pre-filled
    router.push(`/ask-sig?q=${encodeURIComponent(text)}&from=${encodeURIComponent(category)}`)
  }

  function handleClickThrough() {
    router.push(`/ask-sig?from=${encodeURIComponent(category)}`)
  }

  return (
    <div className="max-w-[680px] mx-auto mt-12 mb-4">
      <div className="border-t border-b border-line py-10 text-center">
        <h3 className="font-serif text-2xl text-ink mb-2">
          What do you want to know about {topic}?
        </h3>
        <p className="text-sm font-sans text-muted mb-6">
          We use your questions to shape what we write about next.
        </p>

        <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto mb-4">
          <input
            type="text"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            placeholder="Type your question..."
            className="flex-1 border border-line rounded-lg px-4 py-2.5 text-sm font-sans text-ink placeholder:text-muted outline-none focus:border-wine transition-colors bg-transparent"
          />
          <button
            type="submit"
            disabled={!question.trim()}
            className="px-5 py-2.5 bg-ink text-white text-sm font-sans tracking-wide rounded-lg hover:bg-choc transition-colors disabled:opacity-40"
          >
            Ask Sig
          </button>
        </form>

        <button
          onClick={handleClickThrough}
          className="text-xs font-sans text-muted hover:text-ink transition-colors underline underline-offset-2"
        >
          Or browse popular questions about {topic}
        </button>
      </div>
    </div>
  )
}
