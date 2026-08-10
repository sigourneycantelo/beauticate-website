import type { Metadata } from 'next'
import Sacred60Form from './Sacred60Form'

export const metadata: Metadata = {
  title: 'The Sacred 60 | A Self-Care & Wellness Guide by Sigourney Cantelo',
  description:
    'Sixty practical rituals, tools and everyday practices shaped by 25 years in beauty and health journalism. A calm edit of what actually helps.',
  openGraph: {
    title: 'The Sacred 60 | Beauticate',
    description:
      'A practical self-care and wellness guide for modern life. By Sigourney Cantelo, Founder of Beauticate.',
    url: 'https://www.beauticate.com/sacred60',
    type: 'website',
  },
}

export default function Sacred60Page() {
  return (
    <main className="bg-cream-50 text-charcoal">
      {/* ─── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: '#F5F0E8' }}>
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/content/sacred60/hero.jpg"
            alt=""
            className="w-full h-full object-cover"
            style={{ opacity: 0.16 }}
            aria-hidden
          />
        </div>
        <div className="relative max-w-5xl mx-auto px-6 py-20 md:py-28 flex flex-col md:flex-row items-center gap-12 md:gap-16">
          {/* Left: copy */}
          <div className="flex-1 text-center md:text-left">
            <p
              className="font-sans text-[10px] tracking-[0.35em] uppercase font-medium mb-6"
              style={{ opacity: 0.45 }}
            >
              By Sigourney Cantelo, Founder of Beauticate
            </p>

            <h1 className="font-serif font-normal leading-[0.9] mb-5" style={{ fontSize: 'clamp(52px,8vw,96px)' }}>
              <span className="block">The Sacred</span>
            </h1>
            <span
              className="block font-serif font-normal leading-none"
              style={{ fontSize: 'clamp(100px,18vw,200px)', opacity: 0.12 }}
              aria-hidden
            >
              60
            </span>

            <p className="font-serif italic text-lg md:text-xl mt-6 mb-2" style={{ opacity: 0.7 }}>
              A practical self-care and wellness guide for modern life
            </p>
            <p className="font-serif text-base" style={{ opacity: 0.6, maxWidth: '42ch' }}>
              Sixty rituals, tools and everyday practices shaped by 25 years in beauty and health journalism, and
              real-world healing.
            </p>
          </div>

          {/* Right: form */}
          <div
            className="w-full md:w-[380px] shrink-0 p-8 md:p-10 text-center"
            style={{ background: '#fff', border: '1px solid rgba(28,26,23,.08)' }}
          >
            <h2
              className="font-sans text-[11px] tracking-[0.3em] uppercase font-semibold mb-6"
              style={{ opacity: 0.6 }}
            >
              Send Me the Guide
            </h2>
            <Sacred60Form />
            <p className="font-sans text-[11px] mt-5" style={{ opacity: 0.35 }}>
              subscribe to get the guide*
            </p>
          </div>
        </div>
      </section>

      {/* ─── Why I Made This ──────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row gap-10 md:gap-16 items-start">
        <div className="flex-1">
          <h2
            className="font-serif text-2xl md:text-3xl font-normal mb-6"
            style={{ letterSpacing: '-.01em' }}
          >
            Why I made this...
          </h2>
          <div className="font-serif text-base leading-relaxed space-y-4" style={{ opacity: 0.75 }}>
            <p>
              After years of interviewing doctors, scientists, nutritionists and wellness experts, and doing my own
              healing work, I realised the biggest problem isn't knowing what to do.
            </p>
            <p>It's the overwhelm.</p>
            <p>
              The Sacred 60 is my calm edit of what actually helps. Not trends. Not "do more". Just practical
              rituals, tips and tools that support your nervous system, skin, energy, sleep and home, in real life.
            </p>
            <p className="italic">Sigourney x</p>
          </div>
        </div>

        {/* Guide preview image */}
        <div className="w-full md:w-[280px] shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/content/sacred60/guide-preview.gif"
            alt="The Sacred 60 guide preview"
            className="w-full"
            loading="lazy"
          />
        </div>
      </section>

      {/* ─── What You'll Find Inside ──────────────────────────── */}
      <section
        className="py-16 md:py-20"
        style={{ background: '#F5F0E8' }}
      >
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-serif text-2xl md:text-3xl font-normal mb-8">What you'll find inside</h2>
          <ul className="font-serif text-base leading-relaxed space-y-3 text-left max-w-md mx-auto" style={{ opacity: 0.75 }}>
            <li className="flex items-start gap-3">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-charcoal shrink-0" style={{ opacity: 0.4 }} />
              Nervous-system rituals to reduce stress
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-charcoal shrink-0" style={{ opacity: 0.4 }} />
              Sleep and energy support that fits real schedules
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-charcoal shrink-0" style={{ opacity: 0.4 }} />
              Skin and glow tools that work with your body
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-charcoal shrink-0" style={{ opacity: 0.4 }} />
              Simple movement, recovery and grounding practices
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-charcoal shrink-0" style={{ opacity: 0.4 }} />
              Home habits that make self-care easier to sustain
            </li>
          </ul>

          <p
            className="font-sans text-[11px] tracking-[0.2em] uppercase font-medium mt-10"
            style={{ opacity: 0.45 }}
          >
            No product overload. No hype language.
          </p>
        </div>
      </section>

      {/* ─── Second CTA ───────────────────────────────────────── */}
      <section className="max-w-xl mx-auto px-6 py-16 md:py-24 text-center">
        <h2 className="font-serif text-2xl md:text-3xl font-normal mb-4">Receive the Guide</h2>
        <p className="font-serif text-base mb-8" style={{ opacity: 0.6 }}>
          Enter your email to access The Sacred 60 and the full resource online.
        </p>
        <Sacred60Form />
        <p className="font-sans text-[11px] mt-6" style={{ opacity: 0.35, maxWidth: '36ch', margin: '16px auto 0' }}>
          You'll receive The Sacred 60 and occasional, thoughtfully curated emails from Beauticate — no spam, no
          noise, and you can unsubscribe anytime.
        </p>
      </section>

      {/* ─── Closing Quote ────────────────────────────────────── */}
      <section className="py-14 md:py-20 text-center" style={{ background: '#F5F0E8' }}>
        <p className="font-serif italic text-lg md:text-xl px-6" style={{ opacity: 0.6, maxWidth: '36ch', margin: '0 auto' }}>
          Self-care doesn't need to be perfect.
          <br />
          It just needs to be considered.
        </p>
      </section>
    </main>
  )
}
