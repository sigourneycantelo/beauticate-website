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
    <main className="text-[#5C4A3A]">
      {/* ─── Hero ─────────────────────────────────────────────── */}
      <section className="relative min-h-[85vh] flex items-end overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/content/sacred60/hero.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-[50%_20%]"
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
        <div className="relative w-full text-center pb-16 md:pb-24 px-6 text-white">
          <h1 className="font-serif font-normal tracking-[0.15em] uppercase" style={{ fontSize: 'clamp(36px,6vw,64px)' }}>
            Sacred
          </h1>
          <span
            className="block font-serif font-light leading-none -mt-4 md:-mt-8"
            style={{ fontSize: 'clamp(120px,22vw,260px)', opacity: 0.35 }}
            aria-hidden
          >
            60
          </span>
          <p className="font-serif italic text-lg md:text-2xl -mt-2 md:-mt-6" style={{ opacity: 0.9 }}>
            Self Care &amp; Wellness Guide
          </p>
          <p className="font-sans text-[10px] tracking-[0.35em] uppercase mt-4" style={{ opacity: 0.6 }}>
            Beauticate
          </p>
        </div>
      </section>

      {/* ─── Why I Made This ──────────────────────────────────── */}
      <section style={{ background: '#FAF7F2' }}>
        <div className="max-w-4xl mx-auto px-6 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16">
            <div>
              <h2 className="font-serif italic text-2xl md:text-3xl mb-8">
                Why I Made The Sacred Sixty
              </h2>
              <div className="font-serif text-[15px] leading-[1.8] space-y-5" style={{ opacity: 0.8 }}>
                <p>
                  What if beauty wasn't just about what you put on your face, but how you lived your day?
                </p>
                <p>
                  For years, I believed that if I worked harder, optimised better, or found the right product, everything would fall into place. It didn't.
                </p>
                <p>
                  What changed things wasn't a breakthrough or a single treatment.
                </p>
              </div>
            </div>
            <div>
              <div className="font-serif text-[15px] leading-[1.8] space-y-5 md:mt-16" style={{ opacity: 0.8 }}>
                <p>
                  It was a handful of small, repeatable rituals that helped steady my nervous system, restore my energy, and bring me back into my body, and my life.
                </p>
                <p>
                  The Sacred Sixty is a calm edit of what genuinely supports me, drawn from decades of reporting and lived experience. It isn't about doing more. It isn't about perfection. And it certainly isn't about trends. Take what resonates. Leave what doesn't. There's no right order, just gentle invitations to care for yourself.
                </p>
              </div>
              <p className="font-serif italic text-[15px] mt-8" style={{ opacity: 0.6 }}>
                — Sigourney
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Quote Divider ────────────────────────────────────── */}
      <section className="py-14 md:py-20 text-center border-y" style={{ background: '#FAF7F2', borderColor: 'rgba(92,74,58,0.1)' }}>
        <p className="font-serif italic text-lg md:text-xl px-6 max-w-2xl mx-auto" style={{ opacity: 0.7 }}>
          It wasn't a breakthrough. It was small, repeatable rituals.
        </p>
      </section>

      {/* ─── What You'll Find Inside ──────────────────────────── */}
      <section style={{ background: '#FAF7F2' }}>
        <div className="max-w-3xl mx-auto px-6 py-16 md:py-24 text-center">
          <h2 className="font-serif text-2xl md:text-3xl font-normal mb-10">What you'll find inside</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 text-left max-w-2xl mx-auto">
            {[
              { title: 'Mind & Mood', desc: 'Nervous-system rituals to reduce stress' },
              { title: 'Body & Balance', desc: 'Movement, touch and restoring balance' },
              { title: 'Skin & Glow', desc: 'Tools that support circulation and collagen' },
              { title: 'Energy & Sleep', desc: 'Winding down, recharging and resetting' },
              { title: 'Space & Soul', desc: 'Designing your space to support calm' },
              { title: 'Nourish & Nurture', desc: 'Fuelling your body with care and clarity' },
            ].map(cat => (
              <div key={cat.title} className="py-4">
                <h3 className="font-sans text-[11px] tracking-[0.25em] uppercase font-semibold mb-2" style={{ opacity: 0.5 }}>
                  {cat.title}
                </h3>
                <p className="font-serif text-sm leading-relaxed" style={{ opacity: 0.65 }}>
                  {cat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Form ─────────────────────────────────────────── */}
      <section style={{ background: '#fff' }}>
        <div className="max-w-xl mx-auto px-6 py-16 md:py-24 text-center">
          <p className="font-sans text-[10px] tracking-[0.35em] uppercase font-medium mb-4" style={{ opacity: 0.4 }}>
            Free guide
          </p>
          <h2 className="font-serif text-2xl md:text-3xl font-normal mb-3">Receive the Guide</h2>
          <p className="font-serif text-[15px] mb-8" style={{ opacity: 0.6 }}>
            Enter your email to access The Sacred 60 — the full resource, online.
          </p>
          <Sacred60Form />
          <p className="font-sans text-[11px] mt-6 max-w-sm mx-auto" style={{ opacity: 0.35 }}>
            You'll receive The Sacred 60 and occasional, thoughtfully curated emails from Beauticate — no spam, no
            noise, and you can unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* ─── Closing Quote ────────────────────────────────────── */}
      <section className="py-14 md:py-20 text-center" style={{ background: '#FAF7F2' }}>
        <p className="font-serif italic text-lg md:text-xl px-6 max-w-md mx-auto" style={{ opacity: 0.6 }}>
          Self-care doesn't need to be perfect.
          <br />
          It just needs to be considered.
        </p>
      </section>
    </main>
  )
}
