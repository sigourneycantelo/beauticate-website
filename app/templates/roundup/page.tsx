import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getArticleBySlug, getRelatedArticles } from '@/lib/content'
import { notFound } from 'next/navigation'
import AuthorByline from '@/components/article/AuthorByline'
import ShareButtons from '@/components/article/ShareButtons'
import FAQPanel from '@/components/shared/FAQPanel'
import SubscribeBand from '@/components/shared/SubscribeBand'
import ArticleGrid from '@/components/article/ArticleGrid'

export const metadata: Metadata = {
  title: 'Template: Product Roundup — Best Face Masks',
  robots: { index: false },
}

interface RoundupEntry {
  number: string
  title: string
  subtitle: string
  image: string
  imageAlt: string
  body: string
  url?: string
  price?: string
}

const entries: RoundupEntry[] = [
  {
    number: '01',
    title: 'Saturday Skin',
    subtitle: 'Quench Intense Hydration Mask',
    image: 'https://www.beauticate.com/wp-content/uploads/2017/06/skin.jpeg',
    imageAlt: 'Saturday Skin Quench Intense Hydration Mask',
    body: 'Works wonders when you\'ve got a half hour window to be ready and out the door. After twenty minutes of leaving this mask on, you\'re good to go. The perfect choice for a quick injection of hydration, keeping skin clear and plump so the makeup routine can be not much more than a quick slick of lippie, a lashing of mascara, and a brush of rouge or bronzer.',
  },
  {
    number: '02',
    title: 'Dior',
    subtitle: '1-Minute Dream Mask',
    image: 'https://www.beauticate.com/wp-content/uploads/2017/06/dior.jpeg',
    imageAlt: 'Dior 1-Minute Dream Mask',
    body: 'Pressed for time? Dior\'s 1-Minute Dream Mask, part of its Capture Totale collection, is a great cream mask for someone on-the-go. It takes literally one minute to work its magic. Applying as a light cream mask, it dries to a peel for ease of removal. We suggest using at night so you can allow your skin to revel and rest into the nourishment it just received.',
  },
  {
    number: '03',
    title: 'Patchology',
    subtitle: 'SmartMud No Mess Mud Masque',
    image: 'https://www.beauticate.com/wp-content/uploads/2017/06/mas.jpeg',
    imageAlt: 'Patchology SmartMud No Mess Mud Masque',
    url: 'http://www.mecca.com.au/patchology/detox-smartmud-no-mess-mud-masque/V-027237.html',
    body: 'For those of us who like a classic mud mask, Patchology offers a new twist on an old favourite. The sheet mask sticks to your face in two sections — top and bottom — and contains rare, mineral-rich volcanic ash sourced from Jeju Island in South Korea. This mask helps tighten pores, removes impurities, and renews your skin\'s clarity, all in ten minutes.',
  },
  {
    number: '04',
    title: 'Perricone MD',
    subtitle: 'Pre:Empt Refreshing Shower Mask',
    image: 'https://www.beauticate.com/wp-content/uploads/2017/06/md.jpeg',
    imageAlt: 'Perricone MD Pre:Empt Refreshing Shower Mask',
    url: 'http://www.mecca.com.au/perricone-md/preempt-series-refreshing-shower-mask/I-026267.html',
    body: 'Nothing beats that clean, fresh feeling after using a deep cleansing treatment. This mask is designed to be used while you\'re in the shower — cleanse your face, then apply the mask before you wash your hair or body. Its main task is to eliminate impurities in the skin, so there\'s no need to exfoliate any further. Rinse with warm shower water and follow with your normal skincare regime.',
  },
  {
    number: '05',
    title: 'Patchology',
    subtitle: 'Powerpatch Dark Spot Correcting Duo Kit',
    image: 'https://www.beauticate.com/wp-content/uploads/2017/06/duo.jpeg',
    imageAlt: 'Patchology Powerpatch Dark Spot Correcting Duo Kit',
    body: 'This kit comes with both overnight stick-on patches and a protective gel that work together to reduce signs of previous blemishes, age spots and sun damage. It\'s meant to be used over a twelve-week period, but you\'ll start to see signs of repair in only two weeks. If you\'re looking to even out your skin tone and reduce signs of damage, this is the one.',
  },
]

export default function RoundupTemplate() {
  const article = getArticleBySlug(['beauty-style', 'skin-care', 'the-best-face-masks-for-your-skin-and-lifestyle'])
  if (!article) notFound()

  const { frontmatter: f } = article
  const related = getRelatedArticles(f.slug, 'beauty-style', f.tags ?? [])

  return (
    <article className="pb-16 md:pb-0">

      {/* ──────────────────────────────────────────────────────────
          HERO: Full-bleed landscape
          ────────────────────────────────────────────────────────── */}
      <div className="hidden md:block max-w-[1200px] mx-auto">
        <div className="relative w-full aspect-[16/9]">
          <Image
            src={f.featured_image}
            alt={f.featured_image_alt ?? f.title}
            fill
            sizes="1200px"
            className="object-cover"
            priority
          />
        </div>
      </div>
      <div className="md:hidden relative w-full aspect-[3/4]">
        <Image
          src={f.featured_image}
          alt={f.featured_image_alt ?? f.title}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      </div>

      {/* ── Title block ── */}
      <div className="max-w-[720px] mx-auto px-[clamp(20px,3vw,34px)] py-10">
        <nav className="text-[11.5px] font-sans font-medium tracking-[0.12em] uppercase text-charcoal-light mb-6 flex gap-3 flex-wrap items-center">
          <Link href="/beauty-style" className="hover:text-charcoal transition-colors">beauty &amp; style</Link>
          <span>/</span>
          <Link href="/beauty-style/skin-care" className="hover:text-charcoal transition-colors">skin care</Link>
        </nav>

        <h1 className="mb-4">{f.title}</h1>
        {f.excerpt && (
          <p className="font-serif text-[18px] leading-[1.65] text-charcoal-light mb-6">{f.excerpt}</p>
        )}

        <AuthorByline
          name={f.author ?? 'Beauticate Editorial'}
          date={f.date_published}
          readingTime={f.reading_time}
        />

        {/* ── Intro ── */}
        <div className="prose prose-lg max-w-none mb-12">
          <p>Restoring and repairing your skin in winter takes a little more TLC than your daily cleanse, tone, moisturise routine. Face masks, much like hair masks, should ideally be used once a week to replenish after a long week exposed to the elements. We went pore-deep into some new face masks that we've fallen for, and narrowed down which works best for different needs.</p>
        </div>

        {/* ──────────────────────────────────────────────────────────
            NUMBERED ENTRIES — big serif numerals + Product Card
            ────────────────────────────────────────────────────────── */}
        {entries.map((entry, i) => (
          <div key={entry.number}>
            <div className="mb-12">
              {/* Numeral + title */}
              <div className="flex items-baseline gap-5 mb-6">
                <span
                  className="font-serif text-chocolate leading-none"
                  style={{ fontSize: 'clamp(48px, 7vw, 80px)', letterSpacing: '-0.03em' }}
                >
                  {entry.number}
                </span>
                <div>
                  <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-wine mb-1">{entry.title}</p>
                  <h2 className="text-xl md:text-2xl leading-tight">{entry.subtitle}</h2>
                </div>
              </div>

              {/* Product Card float + body text */}
              <div className="clearfix">
                <span className={`not-prose ${i % 2 === 0 ? 'float-left mr-7 clear-left' : 'float-right ml-7 clear-right'} mb-5 w-[42%] max-w-[260px] block`}>
                  <div className="bg-parchment p-4">
                    <div className="relative w-full aspect-square overflow-hidden bg-white mb-3">
                      <Image
                        src={entry.image}
                        alt={entry.imageAlt}
                        fill
                        sizes="260px"
                        className="object-contain p-3"
                      />
                    </div>
                    <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-wine mb-1">{entry.title}</p>
                    <p className="font-serif text-sm leading-snug">{entry.subtitle}</p>
                    {entry.url && (
                      <a
                        href={entry.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2 font-sans text-[10px] tracking-[0.2em] uppercase text-charcoal-light hover:text-charcoal transition-colors"
                      >
                        shop ↗
                      </a>
                    )}
                  </div>
                </span>

                <div className="prose prose-lg max-w-none">
                  <p>{entry.body}</p>
                </div>
              </div>
            </div>

            {/* Shop Grid after every 3rd entry */}
            {(i + 1) % 3 === 0 && i < entries.length - 1 && (
              <div className="my-12 py-8 border-y border-line">
                <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-charcoal-light mb-5">Shop the masks</p>
                <div className="grid grid-cols-3 gap-[clamp(12px,1.6vw,22px)]">
                  {entries.slice(Math.max(0, i - 2), i + 1).map((e) => (
                    <div key={e.number} className="bg-parchment p-3">
                      <div className="relative w-full aspect-square overflow-hidden bg-white mb-2">
                        <Image src={e.image} alt={e.imageAlt} fill sizes="200px" className="object-contain p-2" />
                      </div>
                      <p className="font-sans text-[9px] tracking-[0.15em] uppercase truncate">{e.title}</p>
                      <p className="font-serif text-xs leading-snug truncate">{e.subtitle}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* ── Subscribe Band ── */}
        <SubscribeBand />

        {/* ── Shop the Edit (foot) ── */}
        <div className="mt-12 pt-10 border-t border-line">
          <h4 className="font-sans text-xs tracking-[0.34em] uppercase mb-6">Shop the Edit</h4>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-[clamp(12px,1.6vw,22px)]">
            {entries.map((e) => (
              <div key={e.number} className="bg-parchment p-3">
                <div className="relative w-full aspect-square overflow-hidden bg-white mb-2">
                  <Image src={e.image} alt={e.imageAlt} fill sizes="200px" className="object-contain p-2" />
                </div>
                <p className="font-sans text-[9px] tracking-[0.15em] uppercase truncate">{e.title}</p>
                <p className="font-serif text-xs leading-snug truncate">{e.subtitle}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── FAQ Accordion ── */}
        {f.faqs && f.faqs.length > 0 && (
          <div className="max-w-[680px]">
            <FAQPanel faqs={f.faqs} />
          </div>
        )}

        {/* ── Share Buttons ── */}
        <div className="max-w-[680px]">
          <ShareButtons
            url="/beauty-style/skin-care/the-best-face-masks-for-your-skin-and-lifestyle"
            title={f.title}
            image={f.featured_image}
          />
        </div>
      </div>

      {/* ── Related Posts ── */}
      {related.length > 0 && (
        <div className="border-t border-line">
          <div className="max-w-wide mx-auto px-[clamp(20px,3vw,34px)] py-10">
            <h2 className="mb-8">You might also like</h2>
            <ArticleGrid articles={related as any} />
          </div>
        </div>
      )}
    </article>
  )
}
