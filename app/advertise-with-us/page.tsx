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
    image: '/content/sigourneys-edit/edit/armani-beauty-follows-sigourney-for-a-day/hero.jpg',
    imageAlt: 'Sigourney Cantelo wearing Armani Power Fabric foundation during editorial shoot',
  },
  {
    brand: 'Chanel',
    title: "Sigourney on Chanel's New Skin Tint",
    href: '/sigourneys-edit/edit/sigourney-on-chanels-new-skin-tint',
    type: 'Sponsored editorial',
    image: '/content/sigourneys-edit/edit/sigourney-on-chanels-new-skin-tint/hero.jpg',
    imageAlt: 'Chanel Les Beiges Eau De Teint bottle with kabuki brush on neutral background',
  },
  {
    brand: 'Weleda',
    title: 'Sigourney on How to Nourish Your Skin',
    href: '/beauty-style/skin-care/video-sigourney-on-how-to-nourish-your-skin',
    type: 'Video feature',
    image: '/content/beauty-style/skin-care/video-sigourney-on-how-to-nourish-your-skin/hero.jpg',
    imageAlt: 'Sigourney on how to nourish your skin with Weleda',
  },
]

const TRIAL_TEAMS = [
  {
    brand: 'Système',
    title: 'Beauticate Readers Trial Système Bio+ Oil Serum',
    href: '/beauty-style/skin-care/systeme-bio-plus-oil-serum-review',
    image: '/content/beauty-style/skin-care/systeme-bio-plus-oil-serum-review/hero.jpg',
    imageAlt: 'Système Bio+ Oil Serum before and after skin results',
  },
  {
    brand: 'Qure',
    title: '4 Beauticate Readers Trial the Qure Micro-Infusion System',
    href: '/beauty-style/skin-care/qure-micro-infusion-system-review',
    image: '/content/beauty-style/beauty-tips/qure-micro-infusion-system-review/hero.jpg',
    imageAlt: 'Before and after results using the Qure Micro-Infusion System',
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
          <p className="font-serif text-lg md:text-xl text-paper/70 leading-relaxed max-w-2xl mx-auto">
            Over a decade of Australian audience trust and editorial authority.
            Aspirational yet authentic content that sparks awareness and delivers lasting results.
          </p>
        </div>
      </section>

      {/* Stats band */}
      <section className="border-b border-camel/30 py-12 bg-parchment">
        <div className="max-w-3xl mx-auto px-6 grid grid-cols-3 gap-8 text-center">
          {STATS.map(s => (
            <div key={s.label}>
              <div className="font-serif text-3xl text-ink mb-1">{s.value}</div>
              <div className="font-sans text-[10px] tracking-widest uppercase text-charcoal/40 leading-tight">{s.label}</div>
            </div>
          ))}
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
            <ul className="space-y-3 font-serif text-sm text-charcoal/70 leading-relaxed">
              <li className="flex gap-2"><span className="text-wine/60 mt-0.5">&bull;</span><span>25 years in beauty and health media</span></li>
              <li className="flex gap-2"><span className="text-wine/60 mt-0.5">&bull;</span><span>Former Beauty &amp; Health Director, Vogue Australia</span></li>
              <li className="flex gap-2"><span className="text-wine/60 mt-0.5">&bull;</span><span>Six Jasmine Awards &middot; Six Star Beauty Awards</span></li>
            </ul>
            <Link href="/about" className="font-sans text-[11px] tracking-[0.16em] uppercase text-wine hover:text-charcoal transition-colors mt-6 inline-block">
              Read the full story &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Inline CTA — Let's partner */}
      <section className="bg-ink py-10 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <p className="font-serif text-base text-paper/70 mb-5">
            Let&apos;s partner. Drop your email and Sigourney will reach out.
          </p>
          <AdvertiseForm />
        </div>
      </section>

      {/* Partnership formats */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-wine mb-3 text-center">Partnership formats</p>
          <h2 className="font-serif text-2xl md:text-3xl text-ink mb-3 text-center">
            Ways to work together
          </h2>
          <p className="font-serif text-base text-charcoal/60 text-center mb-10 max-w-xl mx-auto">
            Content that converts &mdash; beautifully.
          </p>

          <div className="grid md:grid-cols-3 gap-x-10 gap-y-6">
            {[
              { title: 'Sponsored editorial', note: 'Long-form content in our voice' },
              { title: 'Product features', note: 'Expert-led product coverage' },
              { title: 'Podcast sponsorship', note: 'Chart-topping video podcast' },
              { title: 'Newsletter', note: 'Dedicated feature or placement' },
              { title: 'Social & vodcast', note: 'Reels, carousels, IG Live & more' },
              { title: 'Events', note: 'Co-host, MC & editorial coverage' },
              { title: 'Trial teams', note: 'Hand-picked reader reviews' },
              { title: 'Listicle features', note: 'SEO-rich "Best Of" roundups' },
              { title: 'Professional production', note: 'Photo & video, concept to delivery' },
            ].map(f => (
              <div key={f.title} className="flex gap-3 items-start">
                <span className="text-wine/50 mt-1 text-sm">&bull;</span>
                <div>
                  <h3 className="font-serif text-base text-ink">{f.title}</h3>
                  <p className="font-sans text-[11px] text-charcoal/40">{f.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial divider — hero */}
      <section className="relative w-full aspect-[21/9] md:aspect-[3/1]">
        <Image
          src="/images/advertise/advertise-hero.jpg"
          alt="Sigourney Cantelo writing at a café table"
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
        />
      </section>

      {/* Beautiful Inside podcast */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-wine mb-3">Beautiful Inside by Beauticate</p>
          <h2 className="font-serif text-2xl md:text-3xl text-ink mb-3">
            A chart-topping video podcast
          </h2>
          <p className="font-serif text-base text-charcoal/60 leading-relaxed max-w-2xl mx-auto">
            Raw, intimate interviews filmed in the homes and spaces of inspiring people &mdash; with elevated editorial polish.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-10">
          <div className="relative aspect-[16/10] bg-ink/5 overflow-hidden">
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center mb-10">
          {PODCAST_STATS.map(s => (
            <div key={s.label}>
              <div className="font-serif text-2xl text-ink mb-1">{s.value}</div>
              <div className="font-sans text-[10px] tracking-widest uppercase text-charcoal/40">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="font-serif text-sm text-charcoal/60 leading-relaxed mb-5 max-w-xl mx-auto">
            Guests include Miranda Kerr, Celeste Barber, Pip Edwards, Trinny Woodall, Lindsay Price and Poppy King.
          </p>
          <Link
            href="/vodcast"
            className="font-sans text-[11px] tracking-[0.16em] uppercase text-wine hover:text-charcoal transition-colors"
          >
            Listen to the podcast &rarr;
          </Link>
        </div>
      </section>

      {/* Social strip */}
      <section className="bg-parchment py-12">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-charcoal/40 mb-6">Follow Beauticate</p>
          <div className="flex items-center justify-center gap-8 flex-wrap">
            {SOCIALS.map(s => (
              <a
                key={s.platform}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-[11px] tracking-[0.16em] uppercase text-charcoal/50 hover:text-wine transition-colors"
              >
                {s.platform}
              </a>
            ))}
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
        <div className="mt-10 flex justify-center">
          <div className="relative h-10 w-72">
            <Image
              src="/images/advertise/polished-content-logos.jpg"
              alt="Brand partners: Armani Beauty, Chanel, Weleda"
              fill
              className="object-contain"
              sizes="288px"
            />
          </div>
        </div>
      </section>

      {/* Editorial divider — mood */}
      <section className="relative w-full aspect-[21/9] md:aspect-[3/1]">
        <Image
          src="/images/advertise/advertise-mood.jpg"
          alt="Sigourney Cantelo laughing candidly"
          fill
          className="object-cover object-top"
          sizes="100vw"
        />
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
              <p className="font-serif text-sm text-charcoal/50 mb-3">Previous event partners:</p>
              <div className="relative h-12 w-64">
                <Image
                  src="/images/advertise/sig-hosting-logos.jpg"
                  alt="Event partners: Avène, Synternals, SkinCeuticals"
                  fill
                  className="object-contain object-left"
                  sizes="256px"
                />
              </div>
            </div>
            <div className="relative aspect-[16/10] bg-ink/5 overflow-hidden">
              <Image
                src="/images/advertise/6.jpg"
                alt="Sigourney MCing an event in partnership with Chemist Warehouse"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-10">
            {[
              { href: 'https://www.instagram.com/p/C5iBNusSje2/', label: 'Avène event recap' },
              { href: 'https://www.instagram.com/p/C8bihICShBt/', label: 'SkinCeuticals event recap' },
              { href: 'https://www.instagram.com/p/C6IkQevyHsL/', label: 'Synternals event recap' },
            ].map(v => (
              <a
                key={v.href}
                href={v.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block border border-camel/20 bg-paper p-5 text-center hover:border-wine/40 transition-colors"
              >
                <div className="font-sans text-[18px] text-wine/60 group-hover:text-wine mb-2 transition-colors">&#9654;</div>
                <div className="font-sans text-[10px] tracking-[0.16em] uppercase text-charcoal/40 group-hover:text-charcoal/60 transition-colors">{v.label}</div>
              </a>
            ))}
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
                  className="group flex gap-4 border border-camel/20 hover:border-wine/40 transition-colors overflow-hidden"
                >
                  <div className="relative w-24 shrink-0 bg-ink/5">
                    <Image
                      src={t.image}
                      alt={t.imageAlt}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                  <div className="py-4 pr-4">
                    <div className="font-sans text-[10px] tracking-[0.2em] uppercase text-charcoal/30 mb-1">{t.brand}</div>
                    <h3 className="font-serif text-sm text-ink group-hover:text-wine transition-colors leading-snug">{t.title}</h3>
                  </div>
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
            <ul className="space-y-2 font-serif text-sm text-charcoal/70 leading-relaxed mb-6">
              <li>4&ndash;8 targeted reviewers matched to your product</li>
              <li>Reviews professionally edited by Beauticate for credibility</li>
              <li>Blog feature with holding shot and reviewer imagery</li>
              <li>Instagram story + feed post + Facebook post</li>
              <li>EDM inclusion driving direct traffic</li>
            </ul>
            <div className="relative h-16 w-full max-w-xs">
              <Image
                src="/images/advertise/trial-team-logos.jpg"
                alt="Trial team partners: Thalgo, La Mer"
                fill
                className="object-contain object-left"
                sizes="320px"
              />
            </div>
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

      {/* CTA with running image */}
      <section className="bg-ink">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2">
          <div className="relative aspect-[3/4] md:aspect-auto">
            <Image
              src="/images/advertise/advertise-running.jpg"
              alt="Sigourney Cantelo striding through the city"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="flex flex-col justify-center px-8 md:px-14 py-16">
            <h2 className="font-serif text-2xl md:text-3xl text-paper mb-3">Catch us while you can</h2>
            <p className="font-serif text-sm text-paper/60 leading-relaxed mb-8">
              We&apos;re always onto the next story. Drop your email and Sigourney will
              be in touch with partnership options tailored to your brand.
            </p>
            <AdvertiseForm />
            <p className="font-sans text-[10px] tracking-widest uppercase text-paper/30 mt-10">
              Cantelo Corporation Pty Ltd &middot; ABN 71 105 175 317
            </p>
          </div>
        </div>
      </section>

    </div>
  )
}
