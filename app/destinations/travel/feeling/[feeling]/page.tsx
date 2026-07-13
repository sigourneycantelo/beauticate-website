import { getArticlesByFeeling } from '@/lib/content'
import ArticleGrid from '@/components/article/ArticleGrid'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

const FEELINGS: Record<string, { title: string; description: string }> = {
  'girls-trip': {
    title: 'Girls Trip',
    description: 'The best weekends away with your closest — spa stays, wine regions and city escapes.',
  },
  romantic: {
    title: 'Romantic Escapes',
    description: 'Escapes made for two — intimate stays, coastal retreats and sunset dinners.',
  },
  'switch-off': {
    title: 'Switch Off',
    description: 'Retreats, wellness escapes and do-nothing destinations to completely unwind.',
  },
  family: {
    title: 'Family Adventure',
    description: 'The best family-friendly destinations, from Bali to Byron and beyond.',
  },
  city: {
    title: 'Explore a City',
    description: 'City and region guides for the beauty-obsessed traveller.',
  },
  reset: {
    title: 'Reset & Heal',
    description: 'Wellness, longevity and heal-focused stays to restore and recharge.',
  },
}

interface Props {
  params: Promise<{ feeling: string }>
}

export async function generateStaticParams() {
  return Object.keys(FEELINGS).map(feeling => ({ feeling }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { feeling } = await params
  const info = FEELINGS[feeling]
  if (!info) return {}
  return {
    title: `${info.title} — Travel — Beauticate`,
    description: info.description,
  }
}

export default async function FeelingPage({ params }: Props) {
  const { feeling } = await params
  const info = FEELINGS[feeling]
  if (!info) notFound()

  const articles = getArticlesByFeeling(feeling)

  return (
    <div className="max-w-wide mx-auto px-4 py-12">
      <header className="mb-10 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-stone mb-3 font-sans">
          Travel by Feeling
        </p>
        <h1 className="font-serif text-4xl md:text-5xl text-ink mb-4">{info.title}</h1>
        <p className="text-stone font-sans text-base max-w-xl mx-auto">{info.description}</p>
      </header>
      {articles.length > 0 ? (
        <ArticleGrid articles={articles as any} />
      ) : (
        <p className="text-center text-stone">Coming soon.</p>
      )}
    </div>
  )
}
