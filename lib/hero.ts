import { getHeroArticles } from '@/lib/content'
import { HERO_SLIDES } from '@/data/hero-slides'

export const MAX_HERO_SLIDES = 4

export interface HeroSlide {
  key: string
  order: number
  href: string
  title: string
  eyebrow: string
  excerpt?: string
  image: string
  imageAlt: string
  focus?: string
  cta: string
}

const CATEGORY_LABELS: Record<string, string> = {
  'beauty-style': 'Beauty & Style',
  'sigourneys-edit': "Sigourney's Edit",
  wellness: 'Wellness',
  living: 'Living',
  destinations: 'Destinations',
  interviews: 'Interviews',
  vodcast: 'Podcast',
}

// One rotation for the home hero: hero-flagged articles plus the non-article
// slides in data/hero-slides.ts, sorted by order and capped at four. Only the
// fields the carousel draws are passed on, so no MDX bodies reach the RSC payload.
export function getHeroSlides(): HeroSlide[] {
  const fromArticles: HeroSlide[] = getHeroArticles().flatMap(a => {
    if (!a) return []
    const f = a.frontmatter
    return [{
      key: `article:${f.slug}`,
      order: f.hero_order ?? 99,
      href: `/${f.category}${f.subcategory ? `/${f.subcategory}` : ''}/${f.slug}`,
      title: f.hero_title ?? f.title,
      eyebrow: f.hero_eyebrow ?? CATEGORY_LABELS[f.category] ?? f.category,
      excerpt: f.excerpt,
      image: f.hero_image ?? f.featured_image ?? '/images/hero-home.png',
      imageAlt: f.featured_image_alt ?? f.title,
      focus: f.hero_focus,
      cta: 'Read the story',
    }]
  })

  const fromData: HeroSlide[] = HERO_SLIDES.filter(s => s.active).map(s => ({
    key: `slide:${s.id}`,
    order: s.order,
    href: s.href,
    title: s.title,
    eyebrow: s.eyebrow,
    excerpt: s.excerpt,
    image: s.image,
    imageAlt: s.imageAlt,
    focus: s.focus,
    cta: s.cta ?? 'Shop the collection',
  }))

  const all = [...fromArticles, ...fromData].sort((a, b) => a.order - b.order)
  const orders = all.map(s => s.order)
  if (new Set(orders).size !== orders.length) {
    console.warn('[hero] two slides share a hero order:', all.map(s => `${s.key}=${s.order}`).join(', '))
  }
  return all.slice(0, MAX_HERO_SLIDES)
}
