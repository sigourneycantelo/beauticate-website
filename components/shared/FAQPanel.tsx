'use client'
import { useState } from 'react'
import type { FAQ } from '@/types/content'

interface Props { faqs: FAQ[]; title?: string }

export default function FAQPanel({ faqs, title = 'Frequently Asked Questions' }: Props) {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="my-10 border border-cream-200 p-6">
      <h2 className="text-xl mb-6">{title}</h2>
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div key={i} className="border-b border-cream-200 pb-3">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full text-left flex justify-between items-start gap-4 py-1"
            >
              <span className="text-sm font-medium">{faq.question}</span>
              <span className="text-gold mt-0.5 flex-none">{open === i ? '−' : '+'}</span>
            </button>
            {open === i && (
              <p className="text-sm text-charcoal-light mt-2 leading-relaxed">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
