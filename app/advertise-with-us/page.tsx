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
    brand: 'Chanel',
    title: "Sigourney on Chanel's New Skin Tint",
    href: '/sigourneys-edit/edit/sigourney-on-chanels-new-skin-tint',
    type: 'Sponsored editorial',
    image: '/content/sigourneys-edit/edit/sigourney-on-chanels-new-skin-tint/hero.jpg',
    imageAlt: 'Chanel Les Beiges Eau De Teint bottle with kabuki brush on neutral background',
    logo: '/images/advertise/chanel-logo.png',
  },
  {
    brand: 'Armani Beauty',
    title: 'A Day in the Life of Our Editor',
    href: '/sigourneys-edit/edit/armani-beauty-follows-sigourney-for-a-day',
    type: 'Professional production',
    image: '/content/sigourneys-edit/edit/armani-beauty-follows-sigourney-for-a-day/hero.jpg',
    imageAlt: 'Sigourney Cantelo wearing Armani Power Fabric foundation during editorial shoot',
    logo: '/images/advertise/armani-logo.png',
  },
  {
    brand: 'Weleda',
    title: 'Sigourney on How to Nourish Your Skin',
    href: '/beauty-style/skin-care/video-sigourney-on-how-to-nourish-your-skin',
    type: 'Video feature',
    image: '/content/beauty-style/skin-care/video-sigourney-on-how-to-nourish-your-skin/hero.jpg',
    imageAlt: 'Sigourney on how to nourish your skin with Weleda',
    logo: '/images/advertise/weleda-logo.png',
  },
]

const TRIAL_TEAMS = [
  {
    brand: 'Système',
    title: 'Beauticate Readers Trial Système Bio+ Oil Serum',
    href: '/beauty-style/skin-care/systeme-bio-plus-oil-serum-review',
    image: '/content/beauty-style/skin-care/systeme-bio-plus-oil-serum-review/hero.jpg',
    imageAlt: 'Système Bio+ Oil Serum before and after skin results',
    logo: '/images/advertise/thalgo-logo.png',
  },
  {
    brand: 'Qure',
    title: '4 Beauticate Readers Trial the Qure Micro-Infusion System',
    href: '/beauty-style/skin-care/qure-micro-infusion-system-review',
    image: '/content/beauty-style/beauty-tips/qure-micro-infusion-system-review/hero.jpg',
    imageAlt: 'Before and after results using the Qure Micro-Infusion System',
    logo: '/images/advertise/qure-logo.png',
  },
  {
    brand: 'La Mer',
    title: 'La Mer the Concentrate Reviews: Is It Worth It?',
    href: '/beauty-style/skin-care/la-mer-the-concentrate-reviews',
    image: '/content/beauty-style/skin-care/la-mer-the-concentrate-reviews/hero.jpg',
    imageAlt: 'La Mer The Concentrate in deep green glass bottle displayed with skincare products',
    logo: '/images/advertise/la-mer-logo.png',
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

      {/* Heading on beige */}
      <section className="bg-parchment py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="font-sans text-[11px] tracking-[0.25em] uppercase text-charcoal/40 mb-5">Work with us</p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-ink leading-tight mb-6">
            Advertise with Beauticate
          </h1>
          <p className="font-serif text-lg md:text-xl text-charcoal/60 leading-relaxed max-w-2xl mx-auto">
            Over a decade of Australian audience trust and editorial authority.
            Aspirational yet authentic content that sparks awareness and delivers lasting results.
          </p>
        </div>
      </section>

      {/* Stats band */}
      <section className="border-b border-camel/30 py-12 bg-paper">
        <div className="max-w-3xl mx-auto px-6 grid grid-cols-3 gap-8 text-center">
          {STATS.map(s => (
            <div key={s.label}>
              <div className="font-serif text-3xl text-ink mb-1">{s.value}</div>
              <div className="font-sans text-[10px] tracking-widest uppercase text-charcoal/40 leading-tight">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Partnership formats */}
      <section className="bg-parchment py-14">
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

      {/* Founder / Sigourney — on white to break up beige sections */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="font-serif text-2xl md:text-3xl text-ink mb-1">Sigourney Cantelo</h2>
            <p className="font-serif text-base text-charcoal/50 italic mb-6">Founder &amp; Publisher</p>
            <blockquote className="my-8 py-8 border-t border-b border-wine/20">
              <p className="font-serif italic text-ink/80" style={{ fontSize: 'clamp(22px, 3vw, 30px)', lineHeight: 1.4 }}>
                &ldquo;I love working with brands to create show-stopping content that enthrals and entertains our reader &mdash; content that doesn&rsquo;t feel sponsored.&rdquo;
              </p>
            </blockquote>
            <ul className="space-y-3 font-serif text-sm text-charcoal/70 leading-relaxed">
              <li className="flex gap-2"><span className="text-wine/60 mt-0.5">&bull;</span><span>Journalist with over 25 years in beauty and health media</span></li>
              <li className="flex gap-2"><span className="text-wine/60 mt-0.5">&bull;</span><span>Former Beauty &amp; Health Director, Vogue Australia</span></li>
              <li className="flex gap-2"><span className="text-wine/60 mt-0.5">&bull;</span><span>Podcaster, content creator and e-commerce founder</span></li>
              <li className="flex gap-2"><span className="text-wine/60 mt-0.5">&bull;</span><span>Six Jasmine Awards &middot; Six Star Beauty Awards</span></li>
            </ul>
            <Link href="/about" className="font-sans text-[11px] tracking-[0.16em] uppercase text-wine hover:text-charcoal transition-colors mt-6 inline-block">
              Read the full story &rarr;
            </Link>
          </div>
          <div className="relative aspect-[4/5] bg-ink/5 overflow-hidden">
            <Image
              src="/images/advertise/advertise-hero-new.jpg"
              alt="Sigourney Cantelo, Founder & Publisher of Beauticate"
              fill
              className="object-cover object-[center_20%] scale-x-[-1]"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* As seen in */}
      <section className="border-t border-b border-camel/20 py-10">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="font-sans text-[11px] tracking-[0.34em] uppercase text-charcoal/40 mb-7">As seen in</p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
            {[
              { src: '/images/press/vogue.png', alt: 'Vogue' },
              { src: '/images/press/marie-claire.png', alt: 'marie claire' },
              { src: '/images/press/daily-telegraph.png', alt: 'The Daily Telegraph' },
              { src: '/images/press/daily-mail.png', alt: 'Daily Mail' },
              { src: '/images/press/mumbrella.png', alt: 'Mumbrella' },
              { src: '/images/press/beauty-directory.png', alt: 'Beauty Directory' },
            ].map(logo => (
              <div key={logo.src} className="relative h-7 w-[120px] grayscale opacity-45">
                <Image src={logo.src} alt={logo.alt} fill className="object-contain" sizes="120px" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Audience insights — on beige after white Sigourney section */}
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

      {/* Inline CTA — Let's partner */}
      <section className="bg-ink py-10 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <p className="font-serif text-base text-paper/70 mb-5">
            Let&apos;s partner. Drop your email and we&apos;ll reach out.
          </p>
          <AdvertiseForm />
        </div>
      </section>

      {/* Beautiful Inside podcast — full image, text below */}
      <section className="bg-paper">
        <div className="relative w-full aspect-[2/1]">
          <Image
            src="/images/advertise/8.jpg"
            alt="Behind the scenes filming the Beautiful Inside podcast"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="max-w-3xl mx-auto px-6 py-14 text-center">
          <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-wine mb-3">Beautiful Inside by Beauticate</p>
          <h2 className="font-serif text-2xl md:text-3xl text-ink mb-4">
            A chart-topping video podcast
          </h2>
          <p className="font-serif text-base text-charcoal/70 leading-relaxed max-w-2xl mx-auto mb-6">
            Raw, intimate interviews filmed in the homes and spaces of inspiring people &mdash; with elevated editorial polish. Guests include Miranda Kerr, Celeste Barber, Pip Edwards, Trinny Woodall, Lindsay Price and Poppy King.
          </p>
          <Link
            href="/vodcast"
            className="font-sans text-[11px] tracking-[0.16em] uppercase text-wine hover:text-charcoal transition-colors"
          >
            Check out our podcast &rarr;
          </Link>
        </div>
      </section>

      {/* Social strip */}
      <section className="bg-parchment py-12">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-charcoal/40 mb-6">Find us everywhere</p>
          <div className="flex items-center justify-center gap-6">
            {SOCIALS.map(s => (
              <a
                key={s.platform}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.platform}
                className="text-charcoal/40 hover:text-wine transition-colors w-9 h-9"
              >
                {s.platform === 'Instagram' && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" /></svg>}
                {s.platform === 'YouTube' && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4}><rect x="2.5" y="6" width="19" height="12" rx="3.5" /><path d="M10.5 9.2v5.6l4.5-2.8z" fill="currentColor" stroke="none" /></svg>}
                {s.platform === 'TikTok' && <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 3c.3 2 1.6 3.4 3.5 3.6v2.4c-1.3.1-2.5-.3-3.5-1v6.3c0 3.2-2.4 5.4-5.3 5.4-2.7 0-4.9-2-4.9-4.7 0-2.9 2.4-4.8 5.2-4.5v2.5c-.4-.1-.8-.2-1.2-.1-1.2.2-2 1.1-1.9 2.3.1 1.1 1 1.9 2.1 1.9 1.3 0 2.2-1 2.2-2.5V3h3.3z" /></svg>}
                {s.platform === 'Pinterest' && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4}><circle cx="12" cy="12" r="9.2" /><path d="M12 7.4c-2.2 0-3.6 1.5-3.6 3.3 0 .9.4 1.9 1.2 2.2.1 0 .2 0 .2-.1l.2-.7c0-.1 0-.2-.1-.3-.3-.4-.5-.9-.5-1.4 0-1.5 1.1-2.6 2.8-2.6 1.5 0 2.4.9 2.4 2.2 0 1.6-.7 3-1.8 3-.6 0-1-.5-.9-1.1.2-.7.5-1.5.5-2 0-.5-.2-.9-.8-.9-.6 0-1.1.6-1.1 1.5 0 .5.2.9.2.9l-.8 3.2c-.2.9-.1 2 0 2.4l.1.1c.5-.7 1-1.6 1.2-2.3l.4-1.5c.3.5 1 .9 1.7.9 2.2 0 3.7-2 3.7-4.6 0-2-1.7-3.8-4.4-3.8z" fill="currentColor" stroke="none" /></svg>}
                {s.platform === 'Facebook' && <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.5-4.5-10-10-10S2 6.5 2 12c0 5 3.7 9.1 8.4 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7C18.3 21.1 22 17 22 12z" /></svg>}
                {s.platform === 'Threads' && <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.3 11.3c-.1 0-.2-.1-.3-.1-.2-1.5-1-2.6-2.7-2.7-1 0-1.9.4-2.5 1.2l1.1.8c.4-.5.9-.7 1.4-.7.5 0 1 .2 1.2.6.2.3.2.7.2 1.1-.5-.1-1.1-.1-1.7 0-1.6.2-2.7 1.1-2.6 2.5 0 .7.4 1.3.9 1.7.5.3 1.1.5 1.8.5 1.1-.1 1.8-.5 2.3-1.3.4.5.5 1.3.5 2.2 0 2.3-1.4 3.4-3.5 3.4-2.3 0-3.8-1.3-3.8-4.4 0-2.9 1.3-4.8 3.8-4.8.7 0 1.3.1 1.8.4l.7-1.3c-.7-.4-1.5-.5-2.5-.5-3.4 0-5.2 2.5-5.2 6.2 0 3.9 1.9 5.8 5.2 5.8 3 0 4.9-1.6 4.9-4.8 0-1.8-.2-3.1-1.1-3.8zm-2.2 2.9c-.1.8-.7 1.4-1.7 1.4-.5 0-1.1-.2-1.1-.9 0-.8.7-1.1 1.5-1.2.4 0 .9 0 1.3.1v.6z" /></svg>}
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
                <div className="relative h-5 w-16 mb-2">
                  <Image src={c.logo} alt={c.brand} fill className="object-contain object-left" sizes="64px" />
                </div>
                <h3 className="font-serif text-lg text-ink group-hover:text-wine transition-colors">{c.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Editorial divider — mood */}
      <section>
        <Image
          src="/images/advertise/advertise-mood.jpg"
          alt="Sigourney Cantelo laughing candidly"
          width={3600}
          height={2400}
          className="block w-full h-auto"
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
              <div className="flex items-center gap-4">
                {[
                  { src: '/images/advertise/avene-logo.png', alt: 'Avène' },
                  { src: '/images/advertise/synternals-logo.png', alt: 'Synternals' },
                  { src: '/images/advertise/skinceuticals-logo.png', alt: 'SkinCeuticals' },
                ].map(l => (
                  <div key={l.src} className="relative h-8 w-20">
                    <Image src={l.src} alt={l.alt} fill className="object-contain" sizes="80px" />
                  </div>
                ))}
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

          <p className="font-serif text-sm text-charcoal/50 mt-10 mb-4">Watch Sig&rsquo;s recap on Instagram</p>
          <div className="flex gap-4">
            {[
              { href: 'https://www.instagram.com/p/C5iBNusSje2/', logo: '/images/advertise/avene-logo.png', alt: 'Avène' },
              { href: 'https://www.instagram.com/p/C8bihICShBt/', logo: '/images/advertise/skinceuticals-logo.png', alt: 'SkinCeuticals' },
              { href: 'https://www.instagram.com/p/C6IkQevyHsL/', logo: '/images/advertise/synternals-logo.png', alt: 'Synternals' },
            ].map(v => (
              <a
                key={v.href}
                href={v.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 border border-camel/20 bg-paper px-4 py-3 hover:border-wine/40 transition-colors"
              >
                <span className="shrink-0 w-8 h-8 rounded-full border border-wine/30 flex items-center justify-center group-hover:border-wine group-hover:bg-wine/5 transition-colors">
                  <svg viewBox="0 0 16 16" className="w-3 h-3 text-wine/60 group-hover:text-wine transition-colors" fill="currentColor"><path d="M5 3l8 5-8 5V3z" /></svg>
                </span>
                <div className="relative h-4 w-16">
                  <Image src={v.logo} alt={v.alt} fill className="object-contain object-left" sizes="64px" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Trial teams */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div className="order-1 md:order-1">
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
            <p className="font-serif text-sm text-charcoal/50 mb-3">Previous trial team partners:</p>
            <div className="flex items-center gap-4">
              {[
                { src: '/images/advertise/thalgo-logo.png', alt: 'Thalgo' },
                { src: '/images/advertise/qure-logo.png', alt: 'Qure' },
                { src: '/images/advertise/la-mer-logo.png', alt: 'La Mer' },
              ].map(l => (
                <div key={l.src} className="relative h-8 w-20">
                  <Image src={l.src} alt={l.alt} fill className="object-contain" sizes="80px" />
                </div>
              ))}
            </div>
          </div>
          <div className="order-2 md:order-2">
            <div className="space-y-5">
              {TRIAL_TEAMS.map(t => (
                <Link
                  key={t.href}
                  href={t.href}
                  className="group block border border-camel/20 hover:border-wine/40 transition-colors overflow-hidden"
                >
                  <div className="relative aspect-[16/9] bg-ink/5">
                    <Image
                      src={t.image}
                      alt={t.imageAlt}
                      fill
                      className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 45vw"
                    />
                  </div>
                  <div className="p-4">
                    <div className="font-sans text-[10px] tracking-[0.2em] uppercase text-charcoal/30 mb-1">{t.brand}</div>
                    <h3 className="font-serif text-base text-ink group-hover:text-wine transition-colors leading-snug">{t.title}</h3>
                  </div>
                </Link>
              ))}
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
          &ldquo;Sigourney&apos;s credibility and audience trust made this one of our most successful digital partnerships to date. Our package with Beauticate translated into direct sales, contributing to over $75k revenue.&rdquo;
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
              We&apos;re always onto the next story. Drop your email and we&apos;ll
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
