import { getArticlesByCategory } from '@/lib/content'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'A–Z of Interviews — Beauticate',
  description: 'Every person Sigourney Cantelo has interviewed — makeup artists, dermatologists, models, founders, actors and icons. Alphabetical index of 25 years of beauty conversations.',
}

const SUBCATEGORY_LABELS: Record<string, string> = {
  'actors-presenters': 'Actor & Presenter',
  'founders': 'Founder',
  'models': 'Model',
  'creatives': 'Creative',
  'tastemakers': 'Tastemaker',
}

function extractGuestName(title: string): string | null {
  // Pattern: "Name, Descriptor" — take everything before the first comma
  const commaIdx = title.indexOf(',')
  if (commaIdx === -1) return null
  const name = title.slice(0, commaIdx).trim()
  // Skip if the "name" part is clearly a descriptor (starts with The/How/A/An or is too long)
  if (/^(the |how |a |an |why |what |when |11 )/i.test(name)) return null
  if (name.split(' ').length > 4) return null
  return name
}

export default function InterviewsAZPage() {
  const all = (getArticlesByCategory('interviews')
    .filter(a => a != null && a.frontmatter.published !== false) as NonNullable<ReturnType<typeof getArticlesByCategory>[number]>[])
    .sort((a, b) => a.frontmatter.title.localeCompare(b.frontmatter.title))

  // Build index: only articles with extractable guest names
  const indexed: { name: string; role: string; href: string; subcategory: string }[] = []
  for (const a of all) {
    const name = extractGuestName(a.frontmatter.title)
    if (!name) continue
    const role = a.frontmatter.title.slice(a.frontmatter.title.indexOf(',') + 1).trim()
    indexed.push({
      name,
      role: role.length > 80 ? role.slice(0, 80) + '…' : role,
      href: `/interviews/${a.frontmatter.subcategory}/${a.frontmatter.slug}`,
      subcategory: a.frontmatter.subcategory ?? '',
    })
  }

  // Group by first letter
  const byLetter: Record<string, typeof indexed> = {}
  for (const item of indexed) {
    const letter = item.name[0].toUpperCase()
    if (!byLetter[letter]) byLetter[letter] = []
    byLetter[letter].push(item)
  }
  const letters = Object.keys(byLetter).sort()
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

  return (
    <div className="bg-white min-h-screen">

      {/* Header */}
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-10 text-center">
        <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-gold mb-3">Interviews</p>
        <h1 className="font-serif text-4xl md:text-5xl text-charcoal leading-tight mb-5">
          A–Z
        </h1>
        <p className="font-serif text-lg text-charcoal/60 max-w-xl mx-auto leading-relaxed mb-2">
          Every person Sigourney has interviewed — on the site and on the Beautiful Inside vodcast.
        </p>
        <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-charcoal/30">
          {indexed.length} interviews
        </p>
      </section>

      {/* A–Z jump nav */}
      <nav className="border-t border-b border-gray-100 py-4 sticky top-0 bg-white z-10">
        <div className="max-w-4xl mx-auto px-6 flex flex-wrap gap-x-3 gap-y-1 justify-center">
          {alphabet.map(l => (
            byLetter[l]
              ? <a key={l} href={`#letter-${l}`} className="font-sans text-[12px] tracking-widest text-charcoal hover:text-gold transition-colors font-medium">{l}</a>
              : <span key={l} className="font-sans text-[12px] tracking-widest text-charcoal/20">{l}</span>
          ))}
        </div>
      </nav>

      {/* Index */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-10">
          {letters.map(letter => (
            <div key={letter} id={`letter-${letter}`} className="scroll-mt-20">
              <div className="flex items-baseline gap-4 mb-4 border-b border-gray-100 pb-2">
                <span className="font-serif text-3xl text-gold">{letter}</span>
                <span className="font-sans text-[10px] tracking-widest uppercase text-charcoal/30">
                  {byLetter[letter].length} {byLetter[letter].length === 1 ? 'interview' : 'interviews'}
                </span>
              </div>
              <div className="grid md:grid-cols-2 gap-x-12 gap-y-3">
                {byLetter[letter].sort((a, b) => a.name.localeCompare(b.name)).map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex items-baseline gap-3 py-1.5 border-b border-gray-50 hover:border-gold/30 transition-colors"
                  >
                    <span className="font-serif text-base text-charcoal group-hover:text-gold transition-colors whitespace-nowrap">
                      {item.name}
                    </span>
                    <span className="font-sans text-[10px] tracking-wide text-charcoal/40 truncate">
                      {SUBCATEGORY_LABELS[item.subcategory] ?? item.subcategory.replace(/-/g, ' ')}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Back to interviews */}
      <div className="text-center pb-16">
        <Link
          href="/interviews"
          className="font-sans text-[11px] tracking-[0.2em] uppercase text-charcoal/40 hover:text-gold transition-colors border-b border-charcoal/20 pb-0.5"
        >
          ← All interviews
        </Link>
      </div>

    </div>
  )
}
