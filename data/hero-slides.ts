// Home page hero slides that are not articles: a shop collection, a landing
// page, anything with its own URL that deserves a hero moment.
//
// They share one rotation with the hero-flagged articles (`is_hero`) and use
// the same `order` scale as an article's `hero_order`: 1 is the front. The
// carousel holds four slides in total, so adding one here pushes the highest
// order out. Never leave two slides on the same order. Set `active: false` to
// retire a slide without deleting it.
//
// `image` is the landscape holding shot (~2:1), same as an article's hero_image.

export interface HeroSlideEntry {
  id: string
  order: number
  active: boolean
  href: string
  title: string
  eyebrow: string
  excerpt?: string
  image: string
  imageAlt: string
  /** CSS object-position, default 'center 25%'. */
  focus?: string
  /** Label under the headline, default 'Shop the collection'. */
  cta?: string
}

export const HERO_SLIDES: HeroSlideEntry[] = [
  {
    id: 'goodie-bag',
    order: 2,
    active: true,
    href: '/shop/collections/goodie-bag',
    title: 'Inside the Collective goodie bag',
    eyebrow: 'The Beauticate Shop',
    excerpt: 'Every product that went home from the Lua lunch, shoppable in one place.',
    image: '/content/shop/goodie-bag/hero.jpg',
    imageAlt: 'Collage of the Beauticate Collective lunch goodie bag: Kate holding a blush pink Estetika makeup bag, the table at Lua set with pink bags, and the products that went home in the tote',
    cta: 'Shop the goodie bag',
  },
]
