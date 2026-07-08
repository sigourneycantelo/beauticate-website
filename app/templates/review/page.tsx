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
  title: 'Template: Single Review — Dyson V16',
  robots: { index: false },
}

export default function ReviewTemplate() {
  const article = getArticleBySlug(['living', 'lifestyle', 'dyson-v16-review'])
  if (!article) notFound()

  const { frontmatter: f } = article
  const related = getRelatedArticles('dyson-v16-review', 'living', f.tags ?? [])

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
          <Link href="/living" className="hover:text-charcoal transition-colors">living</Link>
          <span>/</span>
          <Link href="/living/lifestyle" className="hover:text-charcoal transition-colors">lifestyle</Link>
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

        {/* ──────────────────────────────────────────────────────────
            QUICK ANSWER — high in the body for AEO / featured snippets
            ────────────────────────────────────────────────────────── */}
        <aside className="my-8 border-l-2 border-wine bg-parchment p-6 sm:p-7">
          <p className="font-sans text-[11px] tracking-[0.3em] uppercase text-terracotta mb-3">Quick answer</p>
          <p className="font-serif text-[15px] sm:text-base font-medium text-charcoal mb-3 italic">Is the Dyson V16 Piston Animal Submarine worth it?</p>
          <div className="text-[15px] sm:text-base text-charcoal leading-relaxed space-y-3">
            <p>The Dyson V16 Piston Animal Submarine is a cordless vacuum with laser dust detection, an LCD particle counter, anti-tangle brush bars, and a wet-cleaning head. It delivers up to 70 minutes of fade-free run time and auto-adjusts suction based on floor type. Sigourney believes it is worth the price.</p>
          </div>
        </aside>

        {/* ── Body ── */}
        <div className="prose prose-lg max-w-none">
          <p>I have always loved my Dyson. Like really loved it, in the way that you defend a brand to friends who suggest you try something else.</p>

          <p>This Dyson V16 review began when I was invited to the Dyson V16 launch and finally got to see what the newer technology could actually do. My old model was ancient — loyal but tired — so I jumped at the chance to take one home and give it a proper, honest go. And honestly? It broke me. In the best possible way.</p>

          <p>If this Dyson V16 review proves anything, it is that I never thought I'd enjoy vacuuming. Let alone want to actually clean the damn thing.</p>
        </div>

        {/* ── Body continues ── */}
        <div className="prose prose-lg max-w-none">
          <p>Yet suddenly, here I am, one Thursday night, lovingly taking it apart and detailing it with an old toothbrush, and, strangely, not minding one little bit. This is not who I used to be.</p>
        </div>

        {/* ── Pull Quote 1 ── */}
        <blockquote className="not-prose my-10 md:my-14">
          <p
            className="font-serif italic text-chocolate leading-[1.15] tracking-[-0.01em]"
            style={{ fontSize: 'clamp(36px, 5vw, 62px)' }}
          >
            Vacuum maintenance was always my <em>hard no</em>. The worst job in the house. The scissors. The hair. The gag reflex.
          </p>
        </blockquote>

        <div className="prose prose-lg max-w-none">
          <p>The sense that I was wasting my one precious life dealing with something that should have worked better in the first place.</p>

          <p>But this machine changed the dynamic. That is really the heart of this Dyson V16 review: this machine removed the friction from a job I had always hated.</p>
        </div>

        {/* ── Body continues ── */}
        <div className="prose prose-lg max-w-none">
          <div className="my-8">
            <div className="relative w-full aspect-[4/3] overflow-hidden bg-tile">
              <Image
                src="https://www.beauticate.com/wp-content/uploads/2026/03/IMG_8828-scaled.jpeg"
                alt="Dyson V16 cordless vacuum on white floorboards"
                fill
                sizes="720px"
                className="object-cover"
              />
            </div>
            <p className="not-prose font-sans text-[10px] tracking-[0.2em] uppercase leading-snug mt-2" style={{ color: '#9a9190' }}>
              The Dyson V16 on white floorboards — the laser reveals dust invisible to the naked eye
            </p>
          </div>

          <h3>The vacuum that talks back</h3>
          <p>What makes this Dyson different isn't just power (although yes, it has a lot of that). It's the feedback.</p>
        </div>

        {/* ── Pull Quote 2 ── */}
        <blockquote className="not-prose my-10 md:my-14">
          <p
            className="font-serif italic text-chocolate leading-[1.15] tracking-[-0.01em]"
            style={{ fontSize: 'clamp(36px, 5vw, 62px)' }}
          >
            The laser alone deserves its own love letter.
          </p>
        </blockquote>

        <div className="prose prose-lg max-w-none">
          <p>A precisely angled green beam reveals dust you cannot see with the naked eye: cat hair, crumbs, fine grit — all suddenly illuminated like evidence. Once you've seen it, you must clean it.</p>
          <p>Then there's the LCD screen. As you vacuum, it shows exactly what you're picking up, measured in microns, updating in real time. When you hit a filthy patch, the screen goes red and the vacuum works harder. As the floor gets cleaner, it moves through orange to green.</p>
          <p>A literal traffic-light system for cleanliness. At my recent birthday party, I just maybe, might have demonstrated this feature to several bemused friends after several rosés.</p>

          <h3>Why I stopped hating vacuum maintenance</h3>
          <p>Let's talk about hair. Long hair. Pet hair. The kind that used to require scissors, swearing and a mild existential crisis.</p>
          <p>The V16's anti-tangle technology uses two rotating conical brush bars that guide hair (up to 25 inches) straight into the bin. No wrapping. No cutting. No punishment for having a shedding cat or a family with heads attached.</p>
          <p>Add to that the CleanCompaktor bin, which compresses dust as you go and holds up to 30 days' worth before needing to be emptied. When you do empty it, it's wipe-clean. No dusty clouds. No tangled surprises. No rage.</p>

          <div className="my-8">
            <div className="relative w-full aspect-[4/3] overflow-hidden bg-tile">
              <Image
                src="https://www.beauticate.com/wp-content/uploads/2026/03/IMG_8848-scaled.jpeg"
                alt="Woman hugging Dyson vacuum at home"
                fill
                sizes="720px"
                className="object-cover"
              />
            </div>
          </div>

          <h3>Power where it counts</h3>
          <p>Under the hood, this thing is serious. Dyson's 900W Hyperdymium motor delivers 315 Air Watts of fade-free suction, while intelligent sensors take up to 15,000 dust readings per second to automatically adjust power.</p>
        </div>

        {/* ── Pull Quote 3 ── */}
        <blockquote className="not-prose my-10 md:my-14">
          <p
            className="font-serif italic text-chocolate leading-[1.15] tracking-[-0.01em]"
            style={{ fontSize: 'clamp(36px, 5vw, 62px)' }}
          >
            You can hear it when you move from hard floors to rugs...Oooh, <em>so satisfying</em>.
          </p>
        </blockquote>

        <div className="prose prose-lg max-w-none">
          <p>There's a subtle shift into hyper-vacuum mode as it pulls deeper into carpet fibres. It's not aggressive. It's responsive. Like it knows what it's doing. What became clear during this Dyson V16 review was that the appeal is not just suction, but how intelligently the machine responds.</p>
          <p>And because the battery delivers up to 70 minutes of run time, you can actually clean the house in one go, not half a job followed by disappointment. In its docking station, it's always grab-and-go: not buried in a cupboard under a pile of regret.</p>
        </div>

        {/* ── Subscribe Band ── */}
        <SubscribeBand />

        {/* ── Body continues ── */}
        <div className="prose prose-lg max-w-none">
          <h2>The Submarine difference: wet + dry, done properly</h2>

          <div className="my-8">
            <div className="relative w-full aspect-[16/9] overflow-hidden bg-tile">
              <Image
                src="https://www.beauticate.com/wp-content/uploads/2026/03/Web-692B-PDP-Gallery-Piston-Animal-Submarine-Module04-Large.jpg"
                alt="Dyson V16 cordless vacuum tools and attachments arranged on white background"
                fill
                sizes="720px"
                className="object-cover"
              />
            </div>
          </div>

          <p>I live in a family home with horrendously white painted floorboards (the bane of my existence) so this is where the V16 Submarine really earns its keep. The 2.0 wet roller head washes hard floors while removing grime and spills, without the need for a separate mop. There's even an extra hydration mode for tougher, stuck-on mess.</p>
          <p>It vacuums. It washes. It converts to handheld. No extra buckets. No second appliance. No "I'll mop later" lies.</p>

          <h3>Final thoughts</h3>
          <p>I didn't fall in love with this vacuum because it's powerful, though it is.</p>
        </div>

        {/* ── Pull Quote 4 ── */}
        <blockquote className="not-prose my-10 md:my-14">
          <p
            className="font-serif italic text-chocolate leading-[1.15] tracking-[-0.01em]"
            style={{ fontSize: 'clamp(36px, 5vw, 62px)' }}
          >
            I fell for it because it respects my time, removes friction, and tells me when the job is actually done.
          </p>
        </blockquote>

        <div className="prose prose-lg max-w-none">
          <p>For time-poor women, pet owners, busy households, and anyone who appreciates good design doing exactly what it promises, the <a href="https://myer.sjv.io/X4rdXX" target="_blank" rel="noopener noreferrer">Dyson V16 Piston Animal Submarine</a> isn't just a vacuum. If there is one takeaway from this Dyson V16 review, it is that convenience matters just as much as power.</p>
        </div>

        {/* ── Disclosure ── */}
        <aside className="my-8 border border-line p-5 bg-parchment">
          <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-charcoal-light mb-2">Disclosure</p>
          <p className="font-serif text-sm leading-relaxed text-charcoal-light">
            This Dyson was gifted for editorial consideration. But here's the thing: I bought my last two Dyson vacuums myself and used them to death.
          </p>
        </aside>

      </div>

      {/* ── Shop the Edit (wider container) ── */}
      <div className="max-w-[960px] mx-auto px-[clamp(20px,3vw,34px)]">
        <div className="mt-12 pt-10 border-t border-line">
          <h4 className="font-sans text-xs tracking-[0.34em] uppercase mb-8">Shop the Edit</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-[clamp(16px,2.2vw,28px)]">
            <a href="https://myer.sjv.io/X4rdXX" target="_blank" rel="noopener noreferrer sponsored" className="bg-parchment p-5 sm:p-6 group block">
              <div className="relative w-full aspect-square overflow-hidden bg-white mb-3">
                <Image
                  src="/content/living/lifestyle/dyson-v16-review/dyson-v16-piston-product.webp"
                  alt="Dyson V16 Piston Animal cordless vacuum"
                  fill
                  sizes="320px"
                  className="object-contain p-4 group-hover:scale-105 transition-transform"
                />
              </div>
              <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-wine mb-1">Dyson</p>
              <p className="font-serif text-sm leading-snug">V16 Piston Animal</p>
              <p className="mt-2 font-sans text-[10px] tracking-[0.15em] uppercase text-charcoal-light group-hover:text-charcoal transition-colors">shop via Myer ↗</p>
            </a>
            <a href="https://myer.sjv.io/WO94GA" target="_blank" rel="noopener noreferrer sponsored" className="bg-parchment p-5 sm:p-6 group block">
              <div className="relative w-full aspect-square overflow-hidden bg-white mb-3">
                <Image
                  src="/content/living/lifestyle/dyson-v16-review/dyson-submarine-mop-product.webp"
                  alt="Dyson V16 Piston Animal Submarine wet and dry vacuum"
                  fill
                  sizes="320px"
                  className="object-contain p-4 group-hover:scale-105 transition-transform"
                />
              </div>
              <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-wine mb-1">Dyson</p>
              <p className="font-serif text-sm leading-snug">V16 Submarine Wet & Dry</p>
              <p className="mt-2 font-sans text-[10px] tracking-[0.15em] uppercase text-charcoal-light group-hover:text-charcoal transition-colors">shop via Myer ↗</p>
            </a>
            <a href="https://cablemelbourne.pxf.io/dyDL7j" target="_blank" rel="noopener noreferrer sponsored" className="bg-parchment p-5 sm:p-6 group block">
              <div className="relative w-full aspect-square overflow-hidden bg-white mb-3">
                <Image
                  src="/content/living/lifestyle/dyson-v16-review/cable-melbourne-nova-pant.jpg"
                  alt="Cable Melbourne Nova Pant in Lattice Print"
                  fill
                  sizes="320px"
                  className="object-contain p-4 group-hover:scale-105 transition-transform"
                />
              </div>
              <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-wine mb-1">Cable Melbourne</p>
              <p className="font-serif text-sm leading-snug">Nova Pant — Lattice Print</p>
              <p className="mt-2 font-sans text-[10px] tracking-[0.15em] uppercase text-charcoal-light group-hover:text-charcoal transition-colors">shop via Cable ↗</p>
            </a>
          </div>
        </div>
      </div>

      {/* ── FAQ / Share (back to body width) ── */}
      <div className="max-w-[720px] mx-auto px-[clamp(20px,3vw,34px)]">

        {/* ── FAQ Accordion ── */}
        {f.faqs && f.faqs.length > 0 && (
          <div className="max-w-[680px]">
            <FAQPanel faqs={f.faqs} />
          </div>
        )}

        {/* ── Share Buttons ── */}
        <div className="max-w-[680px]">
          <ShareButtons
            url="/living/lifestyle/dyson-v16-review"
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
