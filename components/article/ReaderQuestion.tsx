'use client'

import { useState } from 'react'

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
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const topic = CATEGORY_LABELS[category] || 'beauty, wellness or lifestyle'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const text = question.trim()
    if (!text || status === 'sending') return

    setStatus('sending')
    try {
      const res = await fetch('/api/reader-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: text, articleTitle, articleUrl, category }),
      })
      if (!res.ok) throw new Error()
      setStatus('sent')
      setQuestion('')
    } catch {
      setStatus('error')
    }
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

        {status === 'sent' ? (
          <p className="text-sm font-sans text-eucalypt">
            Thanks for your question. We read every single one.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
            <input
              type="text"
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder="Type your question..."
              className="flex-1 border border-line rounded-lg px-4 py-2.5 text-sm font-sans text-ink placeholder:text-muted outline-none focus:border-wine transition-colors bg-transparent"
            />
            <button
              type="submit"
              disabled={!question.trim() || status === 'sending'}
              className="px-5 py-2.5 bg-ink text-white text-sm font-sans tracking-wide rounded-lg hover:bg-choc transition-colors disabled:opacity-40"
            >
              {status === 'sending' ? 'Sending...' : 'Submit'}
            </button>
          </form>
        )}
        {status === 'error' && (
          <p className="text-sm font-sans text-red-600 mt-3">
            Something went wrong. Please try again.
          </p>
        )}
      </div>
    </div>
  )
}
