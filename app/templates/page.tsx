import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Template Previews',
  robots: { index: false },
}

const templates = [
  {
    href: '/templates/interview',
    title: 'Interview',
    article: 'Rae Morris on Beauty, Mistakes and the Happy Accident That Changed Her Life',
    description: 'Landscape hero, Guest Bio, 4 Sticky Scroll sections, Pull Quotes with ellipsis rule, Shop the Edit at foot. Commerce light.',
  },
  {
    href: '/templates/roundup',
    title: 'Product Roundup',
    article: 'The Best Face Masks for Your Skin (and Lifestyle)',
    description: 'Landscape hero, big serif numerals, Product Card per entry, Shop Grid after every 3rd, Shop the Edit at foot. Commerce heavy.',
  },
  {
    href: '/templates/review',
    title: 'Single Review',
    article: 'Dyson V16 Review',
    description: 'Landscape hero, Quick Answer high in body, inline Product Card, Shop the Edit at foot. Body max-width aligned to nav container.',
  },
  {
    href: '/templates/essay',
    title: 'Personal Essay',
    article: 'Fine but Frizzy Hair Routine',
    description: 'Editorial split hero, Pull Quotes as signature moments, Sticky Scroll Portrait. Commerce light or off.',
  },
]

export default function TemplatesIndex() {
  return (
    <div className="max-w-[720px] mx-auto px-6 py-16">
      <p className="font-sans text-[11px] tracking-[0.3em] uppercase text-wine mb-4">Template Previews</p>
      <h1 className="mb-3">The Story Shell</h1>
      <p className="font-serif text-lg text-charcoal-light leading-relaxed mb-12">
        Four practice pages, one for each priority template type. Built with real content from the repo
        using the 15-element component system and v15 design tokens.
      </p>

      <div className="space-y-8">
        {templates.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="block group border border-line hover:border-charcoal-light transition-colors p-6"
          >
            <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-wine mb-2">{t.title}</p>
            <h2 className="text-xl mb-1 group-hover:text-wine transition-colors">{t.article}</h2>
            <p className="font-sans text-sm text-charcoal-light leading-relaxed">{t.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
