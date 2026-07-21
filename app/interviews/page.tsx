import { getArticlesByCategory } from '@/lib/content'
import Link from 'next/link'
import type { Metadata } from 'next'
import EditorialSections from '@/components/shared/EditorialSections'

export const metadata: Metadata = {
  title: 'Interviews — Beauticate',
  description: 'In-depth conversations with the people shaping beauty, wellness and the way we live — from makeup artists and dermatologists to founders and cultural icons.',
}

export default async function InterviewsPage() {
  const all = getArticlesByCategory('interviews')
    .filter(a => a != null && a.frontmatter.published !== false && a.frontmatter.featured_image)
    .map(a => ({ frontmatter: a!.frontmatter }))

  if (!all.length) return null

  const MAX_EDITORIAL = 34
  const articles = all.slice(0, MAX_EDITORIAL)

  return (
    <>
      {/* Header */}
      <section className="max-w-4xl mx-auto px-6 pt-8 sm:pt-16 pb-4 sm:pb-6 text-center">
        <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-wine mb-3">Interviews</p>
        <h1 className="font-serif text-4xl md:text-5xl text-charcoal leading-tight mb-5">
          The people shaping beauty
        </h1>
        <p className="font-serif text-lg text-charcoal/60 max-w-xl mx-auto leading-relaxed mb-6">
          Makeup artists, dermatologists, founders, models, tastemakers — the experts and icons Sigourney has spent 25 years getting to know.
        </p>
        <Link
          href="/interviews/a-z"
          className="font-sans text-[11px] tracking-[0.2em] uppercase text-charcoal border-b border-charcoal/30 pb-0.5 hover:text-wine hover:border-wine transition-colors"
        >
          Browse A–Z index
        </Link>
      </section>

      <EditorialSections articles={articles} />
    </>
  )
}
