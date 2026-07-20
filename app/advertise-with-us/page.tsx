import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import StoryTimeline from '@/components/about/StoryTimeline'
import AdvertiseForm from '@/components/advertise/AdvertiseForm'

export const metadata: Metadata = {
  title: 'Advertise with Beauticate | Brand Partnerships',
  description: 'Partner with Beauticate — Australia\'s most-trusted independent beauty publisher. 3.1 million monthly readers, 12 years of editorial authority. Sponsored content, podcast, events, trial teams and more.',
}

const STATS = [
  { value: '3.1M+', label: 'Monthly reach across all platforms' },
  { value: '12', label: 'Years of editorial authority' },
  { value: '159K', label: 'Podcast downloads since launch' },
  { value: '53K+', label: 'Instagram followers' },
  { value: '9,400', label: 'Newsletter subscribers' },
  { value: '2,082', label: 'Referring domains' },
]

const AUDIENCE_STATS = [
  { value: '85%', label: 'Women' },
  { value: '63%', label: 'Household income $100K+' },
  { value: '59%', label: 'Spend $100+/month on beauty' },
  { value: '40%', label: 'Core demo: 35–44 years' },
  { value: '62.4%', label: 'Australia-based' },
  { value: '55%', label: 'Love to research beauty online' },
]

const SOCIALS = [
  { platform: 'Instagram', handle: '@beauticate', stat: '53,581 followers', href: 'https://www.instagram.com/beauticate/' },
  { platform: 'YouTube', handle: 'Sigourney Cantelo', stat: '5,520 subscribers', href: 'https://www.youtube.com/sigourneycantelo' },
  { platform: 'TikTok', handle: '@sigourneycantelo', stat: '1,280 followers', href: 'https://www.tiktok.com/@sigourneycantelo' },
  { platform: 'Pinterest', handle: 'Beauticate', stat: '1.3M monthly views', href: 'https://www.pinterest.com/beauticate/' },
  { platform: 'Facebook', handle: 'Beauticate', stat: '8,600 followers', href: 'https://www.facebook.com/beauticate' },
  { platform: 'Threads', handle: '@sigourneycantelo', stat: '5,104 followers', href: 'https://www.threads.net/@sigourneycantelo' },
]

const POLISHED_CONTENT = [
  {
    brand: 'Armani Beauty',
    title: 'A Day in the Life of Our Editor',
    href: '/sigourneys-edit/edit/armani-beauty-follows-sigourney-for-a-day',
    type: 'Professional production',
    image: '/images/advertise/11.jpg',
    imageAlt: 'Sigourney Cantelo at the Armani Beauty x Beauticate event',
  },
  {
    brand: 'Chanel',
    title: "Sigourney on Chanel's New Skin Tint",
    href: '/sigourneys-edit/edit/sigourney-on-chanels-new-skin-tint',
    type: 'Sponsored editorial',
    image: '/images/advertise/10.jpg',
    imageAlt: 'Sigourney with Chanel N°1 de Chanel serum',
  },
  {
    brand: 'Weleda',
    title: 'Sigourney on How to Nourish Your Skin',
    href: '/beauty-style/skin-care/video-sigourney-on-how-to-nourish-your-skin',
    type: 'Video feature',
    image: '/images/advertise/5.jpg',
    imageAlt: 'Behind the scenes editorial product shoot',
  },
]

const TRIAL_TEAMS = [
  {
    brand: 'Systeme',
    title: 'Beauticate Readers Trial Systeme Bio+ Oil Serum',
    href: '/beauty-style/skin-care/systeme-bio-plus-oil-serum-review',
  },
  {
    brand: 'Qure',
    title: '4 Beauticate Readers Trial the Qure Micro-Infusion System',
    href: '/beauty-style/skin-care/qure-micro-infusion-system-review',
  },
]

const LISTICLES = [
  {
    title: 'The Best Eye Creams and Mascaras for Super Sensitive Eyes',
    href: '/beauty-style/skin-care/the-best-eye-creams-and-mascaras-for-super-sensitive-eyes',
  },
  {
    title: 'Best Korean Beauty Products to Try in 2025',
    href: '/beauty-style/skin-care/best-korean-beauty-products-2025',
  },
  {
    title: '9 New Makeup Buys That Will Set Your Heart Aflutter This Season',
    href: '/beauty-style/makeup/9-new-makeup-buys-that-will-set-your-heart-aflutter-this-season',
  },
]

const PODCAST_STATS = [
  { value: 'Top 3', label: 'Apple Podcasts (Arts) at launch' },
  { value: '159K', label: 'Downloads since launch' },
  { value: '696K+', label: 'Instagram impressions in first 30 days' },
  { value: '23K+', label: 'YouTube views on a single standout episode' },
]

export default function AdvertisePage() {
  return (
    <div className="bg-paper">

      {/* Hero */}
      <section className="relative bg-ink text-paper py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="font-sans text-[11px] tracking-[0.25em] uppercase text-paper/50 mb-5">Work with us</p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-paper leading-tight mb-6">
            Advertise with Beauticate
          </h1>
          <p className="font-serif text-lg md:text-xl text-paper/70 leading-relaxed max-w-2xl mx-auto mb-4">
            Twelve years of earned trust with Australia&apos;s most engaged beauty, wellness and
            lifestyle audience. 3.1 million monthly touchpoints across editorial, podcast, social and email.
          </p>
          <p className="font-serif text-base text-paper/50 italic">
            Proven content that blends credibility, creativity, and conversion.
          </p>
        </div>
      </section>

      {/* Stats band */}
      <section className="border-b border-camel/30 py-12 bg-parchment">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-center">
          {STATS.map(s => (
            <div key={s.label}>
              <div className="font-serif text-3xl text-ink mb-1">{s.value}</div>
              <div className="font-sans text-[10px] tracking-widest uppercase text-charcoal/40 leading-tight">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* What sets us apart */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h2 className="font-serif text-2xl md:text-3xl text-ink mb-3">What sets us apart</h2>
        <div className="w-10 h-[1.5px] bg-camel/40 mx-auto mb-8" />
        <div className="space-y-3 font-serif text-base md:text-lg text-charcoal/70 leading-relaxed max-w-2xl mx-auto">
          <p>Over a decade of Australian audience trust and editorial authority</p>
          <p>Aspirational yet authentic tone that resonates with modern, conscious consumers</p>
          <p>The perfect blend of content quality, credibility and conversion</p>
          <p>Brand collaborations that spark awareness and deliver lasting results</p>
          <p>Multi-platform storytelling that lives far beyond the post</p>
        </div>
      </section>

      {/* Inline CTA 1 */}
      <section className="bg-ink py-10 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <p className="font-serif text-base text-paper/70 mb-5">
            Interested? Leave your email and we&apos;ll be in touch.
          </p>
          <AdvertiseForm />
        </div>
      </section>

      {/* Audience insights */}
      <section className="bg-parchment py-16">
        <div className="max-w-5xl mx-auto px-6">
          <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-wine mb-3 text-center">Audience insights</p>
          <h2 className="font-serif text-2xl md:text-3xl text-ink mb-2 text-center">
            Beauty-lovers with influence &mdash; and buying power
          </h2>
          <p className="font-serif text-base text-charcoal/60 text-center mb-10 max-w-xl mx-auto">
            High-intent, discerning shoppers who act on what they trust.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-center">
            {AUDIENCE_STATS.map(s => (
              <div key={s.label}>
                <div className="font-serif text-3xl md:text-4xl text-ink mb-1">{s.value}</div>
                <div className="font-sans text-[10px] tracking-widest uppercase text-charcoal/40">{s.label}</div>
              </div>
            ))}
          </div>
          <p className="font-sans text-[9px] tracking-wide uppercase text-charcoal/30 text-center mt-8">Source: reader survey &amp; Mailchimp</p>
        </div>
      </section>

      {/* Founder / Sigourney */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="relative aspect-[3/4] bg-ink/5 overflow-hidden">
            <Image
              src="/images/advertise/7.jpg"
              alt="Sigourney Cantelo, Founder & Publisher of Beauticate"
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div>
            <h2 className="font-serif text-2xl md:text-3xl text-ink mb-1">Sigourney Cantelo</h2>
            <p className="font-serif text-base text-charcoal/50 italic mb-6">Founder &amp; Publisher</p>
            <p className="font-serif text-base text-charcoal/70 leading-relaxed mb-6">
              Curated by one of Australia&apos;s most trusted beauty and health experts.
            </p>
            <ul className="space-y-2 font-serif text-sm text-charcoal/70 leading-relaxed">
              <li>25 years in beauty and health media</li>
              <li>Former Beauty &amp; Health Director at Vogue Australia</li>
              <li>Editorial roles at Glamour, Body+Soul &amp; Qantas Magazine</li>
              <li>Six Jasmine Awards &middot; Six Star Beauty Awards</li>
              <li>Best Blogger at My Face My Body Awards</li>
            </ul>
            <Link href="/about" className="font-sans text-[11px] tracking-[0.16em] uppercase text-wine hover:text-charcoal transition-colors mt-6 inline-block">
              Read the full story &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Partnership formats */}
      <section className="bg-ink text-paper py-16">
        <div className="max-w-5xl mx-auto px-6">
          <p className="font-sans text-[11px] tracking-[0.25em] uppercase text-paper/40 mb-3 text-center">Partnership opportunities</p>
          <h2 className="font-serif text-2xl md:text-3xl text-paper mb-3 text-center">
            Where editorial excellence meets brand impact
          </h2>
          <p className="font-serif text-base text-paper/50 text-center mb-12 max-w-2xl mx-auto">
            From video podcast sponsorships to viral Reels and SEO-rich editorial features, Beauticate creates content that converts &mdash; beautifully.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Sponsored editorial',
                description: 'Long-form content written in Beauticate\'s editorial voice, published on the site and promoted across all channels. Full editorial treatment — no banner ads, no bolt-ons.',
              },
              {
                title: 'Product features',
                description: 'Dedicated product coverage within relevant editorial contexts — skincare, wellness, fragrance and more. Honest, expert-led, with genuine reader engagement.',
              },
              {
                title: 'Podcast sponsorship',
                description: 'Beautiful Inside by Beauticate — a chart-topping video podcast. Full-season sponsorship, host-read ads, show notes inclusion and 36 social mentions across six platforms.',
              },
              {
                title: 'Newsletter',
                description: 'Reach 9,400 engaged subscribers with a dedicated feature or "Currently Loving" placement. 23% open rate, 99% delivery.',
              },
              {
                title: 'Social & vodcast',
                description: 'Authentic integrations across Instagram (53K), TikTok, YouTube, Pinterest (1.3M views) and more. Reels, carousels, IG Live — not scripted testimonials.',
              },
              {
                title: 'Events',
                description: 'Sigourney to co-host or MC — concept-to-execution support with editorial coverage across all platforms. Custom invitations via solus EDM.',
              },
              {
                title: 'Trial teams',
                description: '4–8 hand-picked reviewers trial your product. Reviews professionally edited for credibility, published with before/after imagery and social amplification.',
              },
              {
                title: 'Listicle features',
                description: 'SEO-optimised "Best Of" roundups — a smart, low-barrier entry point into the Beauticate ecosystem with evergreen visibility and trusted editorial voice.',
              },
              {
                title: 'Professional production',
                description: 'Full-scale photo and video shoots — concept to delivery. Available with or without Sigourney as talent. Polished production that elevates brand storytelling.',
              },
            ].map(f => (
              <div key={f.title} className="border-l border-paper/20 pl-6">
                <h3 className="font-serif text-lg text-paper mb-2">{f.title}</h3>
                <p className="font-serif text-sm text-paper/50 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inline CTA 2 */}
      <section className="bg-ink py-10 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <p className="font-serif text-base text-paper/70 mb-5">
            Ready to partner? Drop your email and Sigourney will reach out.
          </p>
          <AdvertiseForm />
        </div>
      </section>

      {/* Beautiful Inside podcast */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div>
            <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-wine mb-3">Beautiful Inside by Beauticate</p>
            <h2 className="font-serif text-2xl md:text-3xl text-ink mb-4">
              A chart-topping video podcast
            </h2>
            <p className="font-serif text-base text-charcoal/70 leading-relaxed mb-6">
              Where self-care meets authentic, long-form storytelling. Filmed in the homes and spaces of inspiring people &mdash; raw, intimate interviews with elevated editorial polish.
            </p>
            <div className="grid grid-cols-2 gap-6 mb-8">
              {PODCAST_STATS.map(s => (
                <div key={s.label}>
                  <div className="font-serif text-2xl text-ink">{s.value}</div>
                  <div className="font-sans text-[10px] tracking-widest uppercase text-charcoal/40">{s.label}</div>
                </div>
              ))}
            </div>
            <p className="font-serif text-sm text-charcoal/60 leading-relaxed mb-6">
              Guests include Miranda Kerr, Celeste Barber, Pip Edwards, Trinny Woodall, Lindsay Price and Poppy King. Distributed across Apple Podcasts, Spotify, YouTube and seven social channels.
            </p>
            <Link
              href="/vodcast"
              className="font-sans text-[11px] tracking-[0.16em] uppercase text-wine hover:text-charcoal transition-colors"
            >
              Listen to the podcast &rarr;
            </Link>
          </div>
          <div className="space-y-4">
            <div className="relative aspect-[3/4] bg-ink/5 overflow-hidden">
              <Image
                src="/images/advertise/8.jpg"
                alt="Behind the scenes filming the Beautiful Inside podcast"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="relative aspect-[16/10] bg-ink/5 overflow-hidden">
              <Image
                src="/images/advertise/4.jpg"
                alt="Beautiful Inside podcast guests including Miranda Kerr, Pip Edwards and Trinny Woodall"
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Social reach */}
      <section className="bg-parchment py-16">
        <div className="max-w-5xl mx-auto px-6">
          <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-wine mb-3 text-center">Social reach</p>
          <h2 className="font-serif text-2xl md:text-3xl text-ink mb-2 text-center">
            Our community doesn&apos;t just scroll &mdash; they save, shop, and share
          </h2>
          <p className="font-serif text-base text-charcoal/60 text-center mb-10 max-w-xl mx-auto">
            From curated video to viral pins, our followers are active, loyal and ready to buy.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10">
            {SOCIALS.map(s => (
              <a
                key={s.platform}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block border border-camel/20 bg-paper p-6 text-center hover:border-wine/40 transition-colors"
              >
                <div className="font-sans text-[11px] tracking-[0.2em] uppercase text-charcoal/40 mb-2">{s.platform}</div>
                <div className="font-serif text-lg text-ink mb-1">{s.stat}</div>
                <div className="font-sans text-[10px] tracking-wide text-charcoal/40">{s.handle}</div>
              </a>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative aspect-[9/16] max-h-[420px] bg-ink/5 overflow-hidden mx-auto w-full max-w-[220px]">
              <Image
                src="/images/advertise/1.jpg"
                alt="Beauticate Instagram Reel featuring Miranda Kerr"
                fill
                className="object-cover object-top"
                sizes="220px"
              />
            </div>
            <div className="relative aspect-[9/16] max-h-[420px] bg-ink/5 overflow-hidden mx-auto w-full max-w-[220px]">
              <Image
                src="/images/advertise/2.jpg"
                alt="Sigourney interviewing Elsa Pataky for Instagram Reels"
                fill
                className="object-cover object-top"
                sizes="220px"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Polished content examples */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-wine mb-3 text-center">Polished content</p>
        <h2 className="font-serif text-2xl md:text-3xl text-ink mb-2 text-center">Premium production, beautifully executed</h2>
        <p className="font-serif text-base text-charcoal/60 text-center mb-10 max-w-xl mx-auto">
          Full-scale photo and video shoots &mdash; concept to delivery. Available with or without Sigourney as talent.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {POLISHED_CONTENT.map(c => (
            <Link
              key={c.href}
              href={c.href}
              className="group block border border-camel/20 hover:border-wine/40 transition-colors overflow-hidden"
            >
              <div className="relative aspect-[4/3] bg-ink/5">
                <Image
                  src={c.image}
                  alt={c.imageAlt}
                  fill
                  className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-6">
                <div className="font-sans text-[10px] tracking-[0.2em] uppercase text-charcoal/30 mb-3">{c.type}</div>
                <div className="font-sans text-[11px] tracking-widest uppercase text-charcoal/50 mb-1">{c.brand}</div>
                <h3 className="font-serif text-lg text-ink group-hover:text-wine transition-colors">{c.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Event hosting */}
      <section className="bg-parchment py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div>
              <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-wine mb-3">Event hosting</p>
              <h2 className="font-serif text-2xl md:text-3xl text-ink mb-4">Elevated events, seamless storytelling</h2>
              <p className="font-serif text-base text-charcoal/70 leading-relaxed mb-6">
                Sigourney to co-host or MC, bringing trusted authority. Concept-to-execution support: d&eacute;cor, invites, run sheet, and vibe.
              </p>
              <ul className="space-y-2 font-serif text-sm text-charcoal/70 leading-relaxed mb-6">
                <li>Custom invitation to Beauticate readers via solus EDM</li>
                <li>Instagram feed post, stories, and Facebook coverage</li>
                <li>Geo-targeted amplification to reach the right local audience</li>
                <li>Optional competition mechanic to drive hype and engagement</li>
                <li>Post-event editorial or video wrap-up</li>
              </ul>
              <p className="font-serif text-sm text-charcoal/50 mb-2">Previous event partners:</p>
              <div className="flex flex-wrap gap-x-6 gap-y-1 font-sans text-[11px] tracking-widest uppercase text-charcoal/40">
                <span>Av&egrave;ne</span>
                <span>Synternals</span>
                <span>SkinCeuticals</span>
                <span>KORA Organics</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="relative aspect-[16/10] bg-ink/5 overflow-hidden">
                <Image
                  src="/images/advertise/6.jpg"
                  alt="Sigourney MCing an event in partnership with Chemist Warehouse"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="relative aspect-[16/10] bg-ink/5 overflow-hidden">
                <Image
                  src="/images/advertise/9.jpg"
                  alt="Sigourney hosting the Av&egrave;ne skincare panel"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="relative aspect-[16/10] bg-ink/5 overflow-hidden">
                <Image
                  src="/images/advertise/3.jpg"
                  alt="Sigourney interviewing Miranda Kerr at the KORA Organics x David Jones launch"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trial teams */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div className="order-2 md:order-1">
            <div className="space-y-4">
              {TRIAL_TEAMS.map(t => (
                <Link
                  key={t.href}
                  href={t.href}
                  className="group block border border-camel/20 p-6 hover:border-wine/40 transition-colors"
                >
                  <div className="font-sans text-[10px] tracking-[0.2em] uppercase text-charcoal/30 mb-2">Trial team</div>
                  <div className="font-sans text-[11px] tracking-widest uppercase text-charcoal/50 mb-1">{t.brand}</div>
                  <h3 className="font-serif text-base text-ink group-hover:text-wine transition-colors">{t.title}</h3>
                </Link>
              ))}
            </div>
          </div>
          <div className="order-1 md:order-2">
            <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-wine mb-3">Trial teams</p>
            <h2 className="font-serif text-2xl md:text-3xl text-ink mb-4">Real reviews. Real results. Real influence.</h2>
            <p className="font-serif text-base text-charcoal/70 leading-relaxed mb-6">
              Our hand-picked team of beauty-obsessed testers delivers high-quality, high-trust product reviews that drive clicks, conversation, and conversions.
            </p>
            <ul className="space-y-2 font-serif text-sm text-charcoal/70 leading-relaxed">
              <li>4&ndash;8 targeted reviewers matched to your product</li>
              <li>Reviews professionally edited by Beauticate for credibility</li>
              <li>Blog feature with holding shot and reviewer imagery</li>
              <li>Instagram story + feed post + Facebook post</li>
              <li>EDM inclusion driving direct traffic</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Listicle features */}
      <section className="bg-parchment py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-wine mb-3">Entry-level features</p>
          <h2 className="font-serif text-2xl md:text-3xl text-ink mb-4">Listicle features</h2>
          <p className="font-serif text-base text-charcoal/70 leading-relaxed mb-8 max-w-2xl mx-auto">
            Our SEO-optimised &ldquo;Best Of&rdquo; roundups are a smart, search-friendly way for brands to appear in curated editorial features with ongoing visibility. Ideal for emerging brands or new product discovery &mdash; a premium, low-barrier entry point into the Beauticate ecosystem with lasting value.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {LISTICLES.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className="group block border border-camel/20 bg-paper p-6 hover:border-wine/40 transition-colors"
              >
                <h3 className="font-serif text-base text-ink group-hover:text-wine transition-colors leading-snug">{l.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Inline CTA 3 */}
      <section className="bg-ink py-10 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <p className="font-serif text-base text-paper/70 mb-5">
            Like what you see? Let&apos;s talk.
          </p>
          <AdvertiseForm />
        </div>
      </section>

      {/* Testimonial */}
      <section className="max-w-3xl mx-auto px-6 py-16 text-center">
        <blockquote className="font-serif text-lg md:text-xl text-ink leading-relaxed italic mb-6">
          &ldquo;Sigourney&apos;s credibility and audience trust made this one of our most successful digital partnerships to date. Our package with Beauticate translated into direct sales, contributing to over $50k revenue.&rdquo;
        </blockquote>
        <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-charcoal/40">
          Lucija Pejnovi&#263; &middot; Influencer &amp; Marketing, Qure Skincare
        </p>
      </section>

      {/* Our story timeline */}
      <StoryTimeline />

      {/* Editorial policy */}
      <section className="bg-parchment py-14">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-serif text-2xl text-ink mb-5">Our editorial policy</h2>
          <p className="font-serif text-base text-charcoal/70 leading-relaxed max-w-2xl">
            Advertising never dictates editorial content. Sponsored partnerships are always
            clearly labelled. Beauticate does not publish positive coverage in exchange for
            payment &mdash; commercial arrangements do not influence what we recommend, test or
            feature in our independent editorial.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ink py-16 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="font-serif text-2xl text-paper mb-4">Start the conversation</h2>
          <p className="font-serif text-sm text-paper/70 leading-relaxed mb-8">
            Tell us about your brand and what you&apos;re hoping to achieve. We&apos;ll be in touch within 2
            business days with partnership options tailored to you.
          </p>
          <AdvertiseForm />
          <p className="font-sans text-[10px] tracking-widest uppercase text-paper/30 mt-8">
            Cantelo Corporation Pty Ltd &middot; ABN 71 105 175 317
          </p>
        </div>
      </section>

    </div>
  )
}
