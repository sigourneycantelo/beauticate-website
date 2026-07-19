'use client'
import { useState } from 'react'

interface FAQItem { q: string; a: string }

export default function PartnerAccordion({ items }: { items: FAQItem[] }) {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <dl className="divide-y divide-camel/30">
      {items.map((item, i) => (
        <div key={i} className="py-8">
          <dt>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full text-left flex justify-between items-start gap-6"
            >
              <span className="font-serif text-wine" style={{ fontSize: 'clamp(18px,2vw,22px)' }}>
                {item.q}
              </span>
              <span
                className="text-wine/50 flex-none mt-1 transition-transform duration-200"
                style={{ transform: open === i ? 'rotate(45deg)' : 'none' }}
              >
                +
              </span>
            </button>
          </dt>
          {open === i && (
            <dd
              className="font-serif text-charcoal-light mt-4 leading-relaxed"
              style={{ fontSize: 'clamp(15px,1.4vw,17px)' }}
            >
              {item.a}
            </dd>
          )}
        </div>
      ))}
    </dl>
  )
}
