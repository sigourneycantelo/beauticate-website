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
  title: 'Template: Personal Essay — Fine Frizzy Hair',
  robots: { index: false },
}

export default function EssayTemplate() {
  const article = getArticleBySlug(['beauty-style', 'hair', 'ive-got-fine-but-frizzy-hair-and-this-is-exactly-what-i-use-to-look-after-it'])
  if (!article) notFound()

  const { frontmatter: f } = article
  const related = getRelatedArticles(f.slug, 'beauty-style', f.tags ?? [])

  return (
    <article className="pb-16 md:pb-0">

      {/* ──────────────────────────────────────────────────────────
          HERO: Editorial Split — portrait left, greige panel right
          ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:grid md:grid-cols-2 min-h-[520px] md:min-h-[640px]">
        <div className="relative aspect-[3/4] md:aspect-auto order-1">
          <Image
            src={f.featured_image}
            alt={f.featured_image_alt ?? f.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-top"
            priority
          />
        </div>

        <div
          className="order-2 flex flex-col justify-center items-center text-center px-[clamp(28px,6vw,80px)] py-12 md:py-16"
          style={{ background: '#F3EFE8' }}
        >
          <nav className="text-[11.5px] font-sans font-medium tracking-[0.12em] uppercase text-charcoal-light mb-6 flex gap-3 flex-wrap justify-center items-center">
            <Link href="/beauty-style" className="hover:text-charcoal transition-colors">beauty &amp; style</Link>
            <span>/</span>
            <Link href="/beauty-style/hair" className="hover:text-charcoal transition-colors">hair</Link>
          </nav>

          <h1
            className="font-serif text-charcoal leading-[1.12] mb-5 text-center"
            style={{ fontSize: 'clamp(24px, 3.2vw, 42px)', letterSpacing: '-0.02em' }}
          >
            {f.title}
          </h1>

          {f.excerpt && (
            <p className="font-serif text-[17px] leading-[1.65] text-charcoal-light mb-8 italic">
              {f.excerpt}
            </p>
          )}

          <AuthorByline
            name={f.author ?? 'Beauticate Editorial'}
            date={f.date_published}
            readingTime={f.reading_time}
          />
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────
          BODY — single column, ragged-right
          ────────────────────────────────────────────────────────── */}
      <div className="max-w-[720px] mx-auto px-[clamp(20px,3vw,34px)] py-10">

        {/* ── Opening paragraph ── */}
        <div className="prose prose-lg max-w-none">
          <p>The vast majority of weightless products I've tried seem to work best on that very fine, slippy hair that's dead straight, feels like silk, and airdries in 15 minutes flat (I envy you). My drier strands require something a little more substantial, but ever so slightly so: I want soft ends and no frizz, but with zero lankness.</p>
        </div>

        {/* ── Pull Quote 1 ── */}
        <blockquote className="my-20 md:my-28">
          <p
            className="font-serif italic text-chocolate leading-[1.15] tracking-[-0.01em]"
            style={{ fontSize: 'clamp(36px, 5vw, 62px)' }}
          >
            "I want soft ends and no frizz, but with zero lankness"
          </p>
        </blockquote>

        {/* ── Shampoo & Conditioner section ── */}
        <div className="prose prose-lg max-w-none">
          <p><a href="https://sephoraaustralia.pxf.io/MKgkBn" target="_blank" rel="noopener noreferrer">Aveda's Smooth Infusion</a> shampoo and conditioner achieves that sweet spot with every single wash — I can rely on this duo to deliver the closest thing to wash-and-wear hair my hair will ever get. I also highly rate <a href="https://sephoraaustralia.pxf.io/KBgPXe" target="_blank" rel="noopener noreferrer">Virtue Labs's Recovery line</a>: the entire brand is built around their patented form of keratin to help repair damaged strands, and I can attest that it leaves locks noticeably softer.</p>
        </div>

        {/* ── Product images — magazine rhythm ── */}
        <div className="my-10 grid grid-cols-2 gap-4">
          <div className="bg-parchment p-4">
            <div className="relative w-full aspect-[3/4] overflow-hidden bg-white">
              <Image
                src="/content/beauty-style/hair/ive-got-fine-but-frizzy-hair-and-this-is-exactly-what-i-use-to-look-after-it/Aveda-2.jpeg"
                alt="Aveda Smooth Infusion shampoo for fine frizzy hair"
                fill
                sizes="320px"
                className="object-contain p-3"
              />
            </div>
            <p className="font-sans text-[9px] tracking-[0.15em] uppercase mt-2 text-charcoal-light">Aveda Smooth Infusion Shampoo</p>
          </div>
          <div className="bg-parchment p-4">
            <div className="relative w-full aspect-[3/4] overflow-hidden bg-white">
              <Image
                src="/content/beauty-style/hair/ive-got-fine-but-frizzy-hair-and-this-is-exactly-what-i-use-to-look-after-it/Aveda-1.jpeg"
                alt="Aveda Smooth Infusion conditioner bottle on white background"
                fill
                sizes="320px"
                className="object-contain p-3"
              />
            </div>
            <p className="font-sans text-[9px] tracking-[0.15em] uppercase mt-2 text-charcoal-light">Aveda Smooth Infusion Conditioner</p>
          </div>
        </div>

        {/* ── Sticky Scroll Portrait + Deep conditioning section ── */}
        <div className="my-16 md:my-24 grid md:grid-cols-[1fr_1fr] gap-8 md:gap-14 items-start">
          <div className="md:sticky md:top-24">
            <div className="relative w-full aspect-[3/4] overflow-hidden bg-tile">
              <Image
                src="/content/beauty-style/hair/ive-got-fine-but-frizzy-hair-and-this-is-exactly-what-i-use-to-look-after-it/Elasticizer.png"
                alt="Philip Kingsley Elasticizer pre-shampoo treatment for fine hair"
                fill
                sizes="(max-width: 768px) 100vw, 360px"
                className="object-contain p-6 bg-white"
              />
            </div>
            <p className="font-sans text-[10px] tracking-[0.2em] uppercase leading-snug mt-2" style={{ color: '#9a9190' }}>
              Philip Kingsley Elasticizer — famously devised for Audrey Hepburn
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <p>In terms of deep conditioners, my love for pre-shampoo treatments runs deep: I always procrastinated using products that require you to hop in and out of the shower for awkward periods of time (what meaningful task can you achieve in five minutes between shampooing and rinsing?) and prefer the ease of a product that you can pop onto dry hair before getting on with your day.</p>
            <p>More particularly for fine hair, because the treatment comes before shampoo, you avoid the dreaded heaviness imparted by some deep conditioners when used as the final step in the shower. I apply <a href="https://sephoraaustralia.pxf.io/3kYREn" target="_blank" rel="noopener noreferrer">Philip Kingsley's Elasticizer</a> (which was famously devised to rehabilitate Audrey Hepburn's strands after too much styling) before bed, plait my hair, and wash out in the morning.</p>
          </div>
        </div>

        {/* ── Pull Quote 2 ── */}
        <blockquote className="my-20 md:my-28">
          <p
            className="font-serif italic text-chocolate leading-[1.15] tracking-[-0.01em]"
            style={{ fontSize: 'clamp(36px, 5vw, 62px)' }}
          >
            "A healthy scalp is the root of our hair health"
          </p>
        </blockquote>

        {/* ── Scalp health section ── */}
        <div className="prose prose-lg max-w-none">
          <p>Scalp health has been at the forefront of hair care for the past few years, and rightfully so: it's the root (pun somewhat intended) of our hair health, so needs to be tended to with as much attention as our lengths and ends.</p>
          <p>My scalp is prone to irritation, but I've seen a big difference since incorporating <a href="https://myer.sjv.io/bk5qVM" target="_blank" rel="noopener noreferrer">Moroccanoil's Dry Scalp Treatment</a> into my routine. Containing a blend of soothing oils plus salicylic acid to exfoliate dry skin, it's left my scalp feeling calmer and healthier than it has in recent history. If you're reluctant to put oil anywhere near your scalp, don't be: this rinses out like a dream and locks still feel clean and fluffy post-wash.</p>
          <p>I alternate the scalp oil with Aveda's Invati Advanced Intensive Hair and Scalp masque, which I let do its magic while my conditioner is in and I get on with the rest of my in-shower admin.</p>
        </div>

        {/* ── Product images ── */}
        <div className="my-10 grid grid-cols-2 gap-4">
          <div className="bg-parchment p-4">
            <div className="relative w-full aspect-[3/4] overflow-hidden bg-white">
              <Image
                src="/content/beauty-style/hair/ive-got-fine-but-frizzy-hair-and-this-is-exactly-what-i-use-to-look-after-it/Moroccanoil.jpeg"
                alt="Moroccanoil Dry Scalp Treatment oil serum for scalp health"
                fill
                sizes="320px"
                className="object-contain p-3"
              />
            </div>
            <p className="font-sans text-[9px] tracking-[0.15em] uppercase mt-2 text-charcoal-light">Moroccanoil Dry Scalp Treatment</p>
          </div>
          <div className="bg-parchment p-4">
            <div className="relative w-full aspect-[3/4] overflow-hidden bg-white">
              <Image
                src="/content/beauty-style/hair/ive-got-fine-but-frizzy-hair-and-this-is-exactly-what-i-use-to-look-after-it/Aveda-3.jpeg"
                alt="Aveda Invati Advanced Intensive Hair and Scalp masque"
                fill
                sizes="320px"
                className="object-contain p-3"
              />
            </div>
            <p className="font-sans text-[9px] tracking-[0.15em] uppercase mt-2 text-charcoal-light">Aveda Invati Advanced Masque</p>
          </div>
        </div>

        {/* ── Subscribe Band ── */}
        <SubscribeBand />

        {/* ── Styling section ── */}
        <div className="prose prose-lg max-w-none">
          <p>Finally, a shoutout to my hair styling coup de coeur. In my dreams, the above combination of products treat and tame my hair so it looks just how I like without heat styling, but unfortunately I'm not quite there — yet. So instead I've been reaching for the <a href="https://myer.sjv.io/PzBA6j" target="_blank" rel="noopener noreferrer">GHD Curve Soft Curl Tong</a> to add volume and help me feel more polished. I like that the barrel isn't too narrow, so I can create looser, more natural curls, and the clamp suits less coordinated users (like myself) achieve the desired look without burning oneself.</p>
        </div>

        <div className="my-10 max-w-[320px]">
          <div className="bg-parchment p-4">
            <div className="relative w-full aspect-[3/4] overflow-hidden bg-white">
              <Image
                src="/content/beauty-style/hair/ive-got-fine-but-frizzy-hair-and-this-is-exactly-what-i-use-to-look-after-it/GHD.jpeg"
                alt="GHD Curve Soft Curl Tong for adding volume to fine frizzy hair"
                fill
                sizes="320px"
                className="object-contain p-3"
              />
            </div>
            <p className="font-sans text-[9px] tracking-[0.15em] uppercase mt-2 text-charcoal-light">GHD Curve Soft Curl Tong</p>
          </div>
        </div>

        {/* ── Credits ── */}
        <p className="font-sans text-[10px] tracking-[0.2em] uppercase leading-snug mb-10" style={{ color: '#9a9190' }}>
          Story by Tess de Vivie de Régie · Holding shot of Freja Beha Erichsen via @clairethomsonjonville
        </p>

        {/* ── FAQ Accordion ── */}
        {f.faqs && f.faqs.length > 0 && (
          <div className="max-w-[680px]">
            <FAQPanel faqs={f.faqs} />
          </div>
        )}

        {/* ── Share Buttons ── */}
        <div className="max-w-[680px]">
          <ShareButtons
            url="/beauty-style/hair/ive-got-fine-but-frizzy-hair-and-this-is-exactly-what-i-use-to-look-after-it"
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
