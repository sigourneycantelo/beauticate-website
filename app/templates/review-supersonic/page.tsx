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
  title: 'Template: Single Review — Dyson Supersonic R',
  robots: { index: false },
}

export default function ReviewSupersonicTemplate() {
  const article = getArticleBySlug(['beauty-style', 'beauty-tips', 'dyson-supersonic-r-hair-dryer-review'])
  if (!article) notFound()

  const { frontmatter: f } = article
  const related = getRelatedArticles('dyson-supersonic-r-hair-dryer-review', 'beauty-style', f.tags ?? [])

  return (
    <article className="pb-16 md:pb-0">

      {/* ── HERO: Full-bleed landscape ── */}
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
          <Link href="/beauty-style/beauty-tips" className="hover:text-charcoal transition-colors">beauty tips</Link>
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

        {/* ── QUICK ANSWER ── */}
        <aside className="my-8 border-l-2 border-wine bg-parchment p-6 sm:p-7">
          <p className="font-sans text-[11px] tracking-[0.3em] uppercase text-terracotta mb-3">Quick answer</p>
          <p className="font-serif text-[15px] sm:text-base font-medium text-charcoal mb-3 italic">Is the Dyson Supersonic R worth $799?</p>
          <div className="text-[15px] sm:text-base text-charcoal leading-relaxed space-y-3">
            <p>The Dyson Supersonic R is 30% smaller and 20% lighter than the original Supersonic, with a redesigned Hyperdymium motor, RFID-enabled attachments that auto-adjust airflow, and reduced noise. Sigourney believes it is worth it for anyone who blowdries regularly and values hair health.</p>
          </div>
        </aside>

        {/* ── Body ── */}
        <div className="prose prose-lg max-w-none">
          <p>And now, after a month of twice-weekly use, I can safely say: this is not just a hair dryer. This is <a href="https://www.dyson.com.au/supersonic-r-hair-dryer-522248-01-vinca-blue-topaz" target="_blank" rel="noopener noreferrer">Dyson</a> engineering meets red carpet styling. And it's about to change how we blowdry, forever.</p>

          <p>Mind you, this is not the first time we have had a first peek at Dyson's innovative hair engineering at Beauticate. Back in 2016 when Dyson first revolutionised hair dryers, we <a href="/beauty-style/hair/dyson-supersonic-hair-dryer-review-is-it-worth-699">put their OG Supersonic hair dryer to the test</a> (it looks almost retro now!). We were impressed then, and now, nine years on, the Supersonic has had a glow up (and shrink down) of epic proportions.</p>
        </div>

        <div className="prose prose-lg max-w-none">
          <h2>What is the Dyson Supersonic R?</h2>
          <p>First seen backstage at fashion weeks from Stella McCartney to Issey Miyake, and in the hands of celebrity stylists for the likes of <em>Demi Moore, Emma Stone,</em> and <em>Selena Gomez</em>, the <a href="https://www.dyson.com.au/supersonic-r-hair-dryer-522248-01-vinca-blue-topaz" target="_blank" rel="noopener noreferrer">Supersonic R</a> was previously only available to professionals. Until now.</p>

          <p>Just launched for consumers, it's Dyson's most powerful, lightest, and most precise hair dryer to date — 30% smaller and 20% lighter than the original Supersonic. Its unique curved design makes it feel more like a styling wand than a tool, and it's powered by a Dyson Hyperdymium motor plus RFID-enabled attachments that adjust airflow and temperature automatically. Translation? You don't need to be a pro to get a pro-level finish.</p>
        </div>

        <div className="my-8">
          <div className="relative w-full aspect-[4/3] overflow-hidden bg-tile">
            <Image
              src="/content/beauty-style/beauty-tips/dyson-supersonic-r-hair-dryer-review/250430_Dyson505D-306.jpg"
              alt="Dyson Supersonic R hair dryer styled on set"
              fill
              sizes="720px"
              className="object-cover"
            />
          </div>
        </div>

        <div className="prose prose-lg max-w-none">
          <p>And yes, it retails for $799 — but more on that later.</p>

          <h2>My first try (and why I haven't touched my old dryer since)</h2>
          <p>The launch was held at the gorgeous new Eve Hotel in Sydney — cue Champagne, Dyson demos, and an all-out hair moment. I got to try the dryer under the guidance of Dyson stylists and took one home to test properly.</p>
        </div>

        {/* ── Pull Quote 1 ── */}
        <blockquote className="not-prose my-10 md:my-14">
          <p
            className="font-serif italic text-chocolate leading-[1.15] tracking-[-0.01em]"
            style={{ fontSize: 'clamp(36px, 5vw, 62px)' }}
          >
            The shine? Glassy. Not greasy, not static — just healthy, light-reflecting bounce.
          </p>
        </blockquote>

        <div className="prose prose-lg max-w-none">
          <p>The next morning, I set up in my bathroom, applied a pump of the <a href="https://www.dyson.com.au/newsroom/choosing-your-dyson-chitosan-pre-style-cream" target="_blank" rel="noopener noreferrer">Dyson Chitosan Pre-Style Cream</a> and began. The airflow? Feather-light but powerful. The weight? Noticeably less strain on my arms.</p>

          <p>Now, it's officially part of my weekly hair ritual. I've timed it: my blowdry is now four minutes faster than it was before. For a busy working mum, that's basically a gift from the hair gods.</p>
        </div>

        <div className="my-8">
          <div className="relative w-full aspect-[4/3] overflow-hidden bg-tile">
            <Image
              src="/content/beauty-style/beauty-tips/dyson-supersonic-r-hair-dryer-review/IMG_1430-1.jpg"
              alt="Sigourney Cantelo using the Dyson Supersonic R hair dryer"
              fill
              sizes="720px"
              className="object-cover"
            />
          </div>
        </div>

        <div className="prose prose-lg max-w-none">
          <h2>The secret to a perfect at-home blowdry</h2>
          <p>According to Dyson's National Styling Manager Gabrielle Roccuzzo, the biggest blowdry mistake we make at home is skipping the blast dry step.</p>

          <p>"When blowdrying their hair, most people don't take out enough moisture by blast drying first," Gabrielle tells Beauticate. "To ensure smoother results and more control, blast dry your hair first. Once you've removed the excess water, then start to blow dry with a brush. This will provide better results in the long run and protect your hair."</p>
        </div>

        {/* ── Pull Quote 2 ── */}
        <blockquote className="not-prose my-10 md:my-14">
          <p
            className="font-serif italic text-chocolate leading-[1.15] tracking-[-0.01em]"
            style={{ fontSize: 'clamp(36px, 5vw, 62px)' }}
          >
            It feels more like a styling wand than a tool.
          </p>
        </blockquote>

        <div className="prose prose-lg max-w-none">
          <p>The Supersonic R is perfect for this technique. I used the Powerful Air Attachment to blast dry, followed by the <a href="https://www.dyson.com.au/flyaway-971618-02" target="_blank" rel="noopener noreferrer">Flyaway Attachment</a> to smooth my strands and finish the look with that subtle 'I just left a salon in Paris' vibe.</p>

          <h2>The supermodel blowout is back — here's how to get it</h2>
          <p>Blame TikTok, the <em>Mob Wife</em> aesthetic, or the rising wave of '90s nostalgia, but the supermodel blowout is having a serious comeback. Think <em>Claudia Schiffer, Sabrina Carpenter,</em> or any It girl worth her Dyson demo.</p>
        </div>

        <div className="my-8">
          <div className="relative w-full aspect-[4/3] overflow-hidden bg-tile">
            <Image
              src="/content/beauty-style/beauty-tips/dyson-supersonic-r-hair-dryer-review/250430_Dyson505D-1006.jpg"
              alt="Supermodel blowout hairstyle created with the Dyson Supersonic R"
              fill
              sizes="720px"
              className="object-cover"
            />
          </div>
        </div>

        <div className="prose prose-lg max-w-none">
          <p>"The supermodel blowout is by far the biggest trend of the year, with an emphasis on bounce, volume and shine," says Gabrielle. "The Supersonic R helps to achieve this look by helping create bouncy curls with ease. Its lightweight design makes it easier to use and style, whilst effectively controlling temperature in order to protect your hair."</p>

          <p>Dyson has even launched a <a href="https://www.dyson.com.au/newsroom/introducing-the-new-dyson-supersonic-r-hair-dryer" target="_blank" rel="noopener noreferrer">"Styled with R" Menu</a> at select demo stores, where you can try their trend-forward looks — from halo curls to sleek straight styles — in person with an expert.</p>
        </div>

        {/* ── Subscribe Band ── */}
        <SubscribeBand />

        <div className="prose prose-lg max-w-none">
          <h2>The verdict: is it worth $799?</h2>
          <p>If you only blowdry once a week and love a low-maintenance routine — this may be a luxury splurge. But if you're someone who blowdries or styles most days, cares about hair health and shine, has heavy hard-to-dry hair, gets arm fatigue mid-styling, or wants red carpet hair without the red carpet stylist…</p>
        </div>

        {/* ── Pull Quote 3 ── */}
        <blockquote className="not-prose my-10 md:my-14">
          <p
            className="font-serif italic text-chocolate leading-[1.15] tracking-[-0.01em]"
            style={{ fontSize: 'clamp(36px, 5vw, 62px)' }}
          >
            The Dyson Supersonic R is not just a tool. It's an upgrade.
          </p>
        </blockquote>

        <div className="prose prose-lg max-w-none">
          <p>…then this is absolutely worth it.</p>
        </div>

        <div className="my-8">
          <div className="relative w-full aspect-[4/3] overflow-hidden bg-tile">
            <Image
              src="/content/beauty-style/beauty-tips/dyson-supersonic-r-hair-dryer-review/IMG_1426-1.jpg"
              alt="Dyson Supersonic R hair dryer in Ceramic Pink"
              fill
              sizes="720px"
              className="object-cover"
            />
          </div>
        </div>

        {/* ── Disclosure ── */}
        <aside className="my-8 border border-line p-5 bg-parchment">
          <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-charcoal-light mb-2">Disclosure</p>
          <p className="font-serif text-sm leading-relaxed text-charcoal-light">
            The Dyson Supersonic R was provided for editorial consideration. All opinions are Sigourney's own.
          </p>
        </aside>

        {/* ── Details ── */}
        <div className="prose prose-lg max-w-none">
          <p className="font-sans text-[10px] tracking-[0.2em] uppercase leading-snug" style={{ color: '#9a9190' }}>
            Story by Sigourney Cantelo · Imagery by The Fourth Creative
          </p>
        </div>

      </div>

      {/* ── Shop the Edit (wider container) ── */}
      <div className="max-w-[960px] mx-auto px-[clamp(20px,3vw,34px)]">
        <div className="mt-12 pt-10 border-t border-line">
          <h4 className="font-sans text-xs tracking-[0.34em] uppercase mb-8">Shop the Edit</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-[clamp(16px,2.2vw,28px)]">
            <a href="https://www.dyson.com.au/supersonic-r-hair-dryer-522248-01-vinca-blue-topaz" target="_blank" rel="noopener noreferrer sponsored" className="bg-parchment p-5 sm:p-6 group block">
              <div className="relative w-full aspect-square overflow-hidden bg-white mb-3">
                <Image
                  src="/content/beauty-style/beauty-tips/dyson-supersonic-r-hair-dryer-review/dysonsupersonicr.jpg"
                  alt="Dyson Supersonic R hair dryer"
                  fill
                  sizes="320px"
                  className="object-contain p-4 group-hover:scale-105 transition-transform"
                />
              </div>
              <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-wine mb-1">Dyson</p>
              <p className="font-serif text-sm leading-snug">Supersonic R Hair Dryer</p>
              <p className="mt-2 font-sans text-[10px] tracking-[0.15em] uppercase text-charcoal-light group-hover:text-charcoal transition-colors">shop via Dyson ↗</p>
            </a>
            <a href="https://www.dyson.com.au/flyaway-971618-02" target="_blank" rel="noopener noreferrer sponsored" className="bg-parchment p-5 sm:p-6 group block">
              <div className="relative w-full aspect-square overflow-hidden bg-white mb-3">
                <Image
                  src="/content/beauty-style/beauty-tips/dyson-supersonic-r-hair-dryer-review/skEeZdGT8mjAh2UcFA4ojF-1.jpg"
                  alt="Dyson Flyaway Attachment"
                  fill
                  sizes="320px"
                  className="object-contain p-4 group-hover:scale-105 transition-transform"
                />
              </div>
              <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-wine mb-1">Dyson</p>
              <p className="font-serif text-sm leading-snug">Flyaway Smoother Attachment</p>
              <p className="mt-2 font-sans text-[10px] tracking-[0.15em] uppercase text-charcoal-light group-hover:text-charcoal transition-colors">shop via Dyson ↗</p>
            </a>
            <a href="https://www.dyson.com.au/newsroom/choosing-your-dyson-chitosan-pre-style-cream" target="_blank" rel="noopener noreferrer sponsored" className="bg-parchment p-5 sm:p-6 group block">
              <div className="relative w-full aspect-square overflow-hidden bg-white mb-3">
                <Image
                  src="/content/beauty-style/beauty-tips/dyson-supersonic-r-hair-dryer-review/IMG_1415.jpg"
                  alt="Dyson Chitosan Pre-Style Cream"
                  fill
                  sizes="320px"
                  className="object-contain p-4 group-hover:scale-105 transition-transform"
                />
              </div>
              <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-wine mb-1">Dyson</p>
              <p className="font-serif text-sm leading-snug">Chitosan Pre-Style Cream</p>
              <p className="mt-2 font-sans text-[10px] tracking-[0.15em] uppercase text-charcoal-light group-hover:text-charcoal transition-colors">shop via Dyson ↗</p>
            </a>
          </div>
        </div>
      </div>

      {/* ── FAQ / Share ── */}
      <div className="max-w-[720px] mx-auto px-[clamp(20px,3vw,34px)]">
        {f.faqs && f.faqs.length > 0 && (
          <div className="max-w-[680px]">
            <FAQPanel faqs={f.faqs} />
          </div>
        )}

        <div className="max-w-[680px]">
          <ShareButtons
            url="/beauty-style/beauty-tips/dyson-supersonic-r-hair-dryer-review"
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
