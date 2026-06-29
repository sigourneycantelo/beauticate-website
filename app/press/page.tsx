import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'In the Media',
  description: 'Beauticate and founder Sigourney Cantelo, featured across Vogue, Marie Claire, The Daily Telegraph, Daily Mail and more.',
}

interface PressItem {
  outlet: string
  title: string
  href: string
  /** Optional logo at /images/press/<file>. Falls back to the styled outlet name. */
  logo?: string
}

// Earned media — publications, in order of prominence.
const PUBLICATIONS: PressItem[] = [
  { outlet: 'Vogue', title: 'Sigourney Cantelo wins the Jasmine Award for Journalistic Excellence', href: 'https://www.vogue.com.au/beauty/news/beauty-pageant/news-story/6faf67bde5e339f4f4342b4af1f88552', logo: '/images/press/vogue.png' },
  { outlet: 'Vogue', title: 'What’s in a beauty director’s makeup bag?', href: 'https://www.vogue.com.au/blogs/editors-blogs/whats-in-a-beauty-directors-makeup-bag/news-story/115f3b9c81dbf933150b5ec8c93c9f9e', logo: '/images/press/vogue.png' },
  { outlet: 'Vogue', title: 'RAFW beauty essentials', href: 'https://www.vogue.com.au/blogs/editors-blogs/rafw-beauty-essentials/news-story/960911cb7b1a92871c3c4dee5cdf67b5', logo: '/images/press/vogue.png' },
  { outlet: 'Marie Claire', title: 'I Checked Myself Into Rehab For Anxiety — It Wasn’t What I Expected', href: 'https://www.marieclaire.com.au/life/health-wellness/rehab-for-anxiety/', logo: '/images/press/marie-claire.png' },
  { outlet: 'The Daily Telegraph', title: 'Sigourney Cantelo: ‘I had the perfect life but was really crumbling inside’', href: 'https://www.dailytelegraph.com.au/lifestyle/sydney-weekend/sigourney-cantelo-i-had-the-perfect-life-but-was-really-crumbling-inside/news-story/68a35c2fcd6d7b0d305550d34b33729c', logo: '/images/press/daily-telegraph.png' },
  { outlet: 'The Daily Telegraph', title: '‘My body whispers before it screams’: high-profile women warn on burnout crisis', href: 'https://www.dailytelegraph.com.au/lifestyle/sydney-weekend/my-body-whispers-before-it-screams-highprofile-women-warn-on-burnout-crisis/news-story/f5f8f1a78678ba3027079460424b00d2', logo: '/images/press/daily-telegraph.png' },
  { outlet: 'Daily Mail', title: 'Seasoned traveller: Vogue beauty editor reveals must-have holiday products', href: 'https://www.dailymail.co.uk/femail/article-7373261/How-pack-like-seasoned-traveller-Vogue-beauty-editor-reveals-products.html', logo: '/images/press/daily-mail.png' },
  { outlet: 'Daily Mail', title: 'Expert shares the exact skincare and makeup she uses to avoid getting Botox', href: 'https://www.dailymail.com/lifestyle/article-8598825/Expert-shares-exact-skincare-makeup-uses-AVOID-getting-Botox.html', logo: '/images/press/daily-mail.png' },
  { outlet: 'Daily Mail', title: 'Home and Away’s Kate Ritchie on diet and beauty', href: 'https://www.dailymail.com/lifestyle/article-3586012/Home-Away-star-Kate-Ritchie-speaks-diet-beauty-Beauticate-interview.html', logo: '/images/press/daily-mail.png' },
  { outlet: 'Mamamia', title: 'A former Vogue editor’s pregnancy style tips', href: 'https://www.mamamia.com.au/beauty-pregnancy-tips/' },
  { outlet: 'Mamamia', title: '‘I checked myself into a rehab centre for three weeks’', href: 'https://www.mamamia.com.au/treatment-facility/' },
  { outlet: 'Mumbrella', title: 'Vogue’s Sigourney Cantelo Departs To Run Own Site — Beauticate', href: 'https://mumbrella.com.au/vogues-sigourney-cantelo-departs-run-site-233667', logo: '/images/press/mumbrella.png' },
  { outlet: 'Beauty Directory', title: 'Sigourney Cantelo launches new podcast', href: 'https://www.beautydirectory.com.au/news/digital/sigourney-cantelo-launches-podcast-beautiful-inside-by-beauticate', logo: '/images/press/beauty-directory.png' },
  { outlet: 'Beauty Directory', title: 'Gamble pays off for Sigourney Cantelo', href: 'https://www.beautydirectory.com.au/news/digital/gamble-pays-off-for-sigourney-cantelo', logo: '/images/press/beauty-directory.png' },
  { outlet: 'Beauty Directory', title: 'Sigourney Cantelo farewells Vogue', href: 'https://www.beautydirectory.com.au/news/magazines/sigourney-cantelo-farewells-vogue', logo: '/images/press/beauty-directory.png' },
  { outlet: 'Collective Hub', title: 'In conversation with Sigourney Cantelo', href: 'https://collectivehub.com/2015/01/sigourney-cantelo/' },
  { outlet: 'HerCanberra', title: 'Sigourney Cantelo shares her beauty secrets', href: 'https://hercanberra.com.au/style/sigourney-cantelo-shares-her-beauty-secrets/' },
  { outlet: 'North Shore Times', title: 'Where are the hottest beauty salons on Sydney’s North Shore?', href: 'https://www.news.com.au/lifestyle/beauty/where-are-mosmans-hottest-beauty-salons/news-story/ef0e3fe787c4fa7d2f1fa5441815d5b2', logo: '/images/press/north-shore-times.png' },
  { outlet: 'The Family Travel Hub', title: 'Ibiza with Sigourney Cantelo', href: 'https://www.thefamilytravelhub.com/ibiza-with-sigourney-cantelo-founder-amp-editor-of-beauticate/' },
  { outlet: 'The Strategy', title: 'The Strategy — Sigourney Cantelo', href: 'https://thestrategy.ca/2021/07/08/sigourney-cantelo-the-strategy/', logo: '/images/press/the-strategy.png' },
  { outlet: 'Ageless Radiance Club', title: 'Sigourney Cantelo on 3 incredible spas to add to your go-to list', href: 'https://agelessradianceclub.com/sigourney-cantelo-on-3-incredible-spas-to-add-to-your-go-to-list/' },
  { outlet: 'Esprit', title: 'Founder profile', href: '/press-clippings/esprit-profile.pdf' },
  { outlet: 'Madison', title: 'Wedding beauty', href: '/press-clippings/madison-wedding.pdf' },
  { outlet: 'Fitness First', title: 'Beauty', href: '/press-clippings/fitness-first.pdf' },
  { outlet: 'Porter', title: 'Beauty: Sun Secrets', href: '/press-clippings/porter.pdf' },
]

// Podcast guest appearances.
const PODCASTS: PressItem[] = [
  { outlet: 'Ageless by Rescu', title: 'Sigourney Cantelo — Beauty & Empowerment', href: 'https://podcasts.apple.com/us/podcast/sigourney-cantelo-beauty-and-empowerment/id1579146202?i=1000552404701', logo: '/images/press/ageless-rescu.png' },
  { outlet: 'Podcast', title: 'How Luxury Travel Changes After Kids: Sigourney Cantelo on Burnout, Beauty & Family Holidays', href: 'https://open.spotify.com/episode/6XC1LMIVxUF3rS8gSTNpu6' },
  { outlet: 'Tea Talk', title: 'Sigourney Cantelo on Australian beauty and wellness', href: 'https://open.spotify.com/episode/3mbx0h2trMuxzywE0pTOdl' },
  { outlet: 'Podcast', title: 'Sigourney Cantelo — Founder & Editor, Beauticate', href: 'https://open.spotify.com/episode/1oyxhOavyCSZd5p35JQvfA' },
  { outlet: 'Fearlessly Failing with Lola Berry', title: 'Hot Seat: Sigourney Cantelo', href: 'https://podcasts.apple.com/au/podcast/663-hot-seat-sigourney-cantelo/id1478245620?i=1000688984238' },
  { outlet: 'Fearlessly Failing with Lola Berry', title: 'Motherhood & Mental Health with Sigourney Cantelo', href: 'https://podcasts.apple.com/au/podcast/662-fearlessly-failing-motherhood-mental-health-with/id1478245620?i=1000688257084' },
]

// Brand features and collaborations.
const FEATURES: PressItem[] = [
  { outlet: 'Ella Baché', title: 'Bold Women — Sigourney Cantelo', href: 'https://www.ellabache.com.au/blogs/bold-beyond-beauty/bold-women-sigourney-cantelo', logo: '/images/press/ella-bache.png' },
  { outlet: 'ParlourX', title: 'The X-Files Interviews — Sigourney Cantelo', href: 'https://www.parlourx.com/blogs/news/sigourney-cantelo-beauticate', logo: '/images/press/parlourx.png' },
  { outlet: 'ParlourX', title: 'Interview: Sigourney Cantelo', href: 'https://www.parlourx.com/blogs/news/sigourney-cantelo', logo: '/images/press/parlourx.png' },
  { outlet: 'Nude by Nature', title: 'Influencer Profile: Sigourney Cantelo', href: 'https://nudebynature.com/blogs/beauty-blog/influencer-profile-sigourney-cantelo-beauticate' },
  { outlet: 'Palm Beach Collection', title: 'At Home With Sigourney Cantelo, Founder of Beauticate', href: 'https://palmbeachcollection.com.au/blogs/blog/at-home-with-sigourney-cantelo-founder-of-beauticate' },
  { outlet: 'Basil Bangs', title: 'Finding Her Shade: The Sigourney Cantelo Edit', href: 'https://basilbangs.ca/blogs/journal/sigourney-cantelo' },
  { outlet: 'Spa Sessions', title: 'Sigourney Cantelo in the press', href: 'https://spasessions.com/press/tag/Sigourney+Cantelo' },
]

function PressCard({ p }: { p: PressItem }) {
  return (
    <a href={p.href} target="_blank" rel="noopener noreferrer" className="group block border-t border-cream-200 pt-5">
      {p.logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={p.logo} alt={p.outlet} className="h-7 w-auto object-contain object-left" style={{ maxWidth: '160px', opacity: 0.85 }} />
      ) : (
        <p className="font-sans" style={{ fontSize: '10.5px', letterSpacing: '0.26em', textTransform: 'uppercase', opacity: 0.55 }}>
          {p.outlet}
        </p>
      )}
      <h2
        className="font-serif font-normal mt-2 group-hover:underline group-hover:[text-decoration-thickness:0.5px] group-hover:[text-underline-offset:3px]"
        style={{ fontSize: 'clamp(18px,1.8vw,22px)', lineHeight: 1.25 }}
      >
        {p.title}
      </h2>
      <span className="inline-block mt-3 font-sans text-[9.5px] tracking-[0.2em] uppercase opacity-45 group-hover:opacity-80 transition-opacity">
        Read &rarr;
      </span>
    </a>
  )
}

function PressGrid({ items }: { items: PressItem[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[clamp(28px,4vw,64px)] gap-y-[clamp(28px,3vw,44px)]">
      {items.map((p, i) => <PressCard key={i} p={p} />)}
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-center mt-[clamp(48px,6vw,88px)] mb-[clamp(28px,4vw,48px)]">
      <p className="font-sans" style={{ fontSize: '11px', letterSpacing: '0.34em', textTransform: 'uppercase', opacity: 0.5 }}>
        {children}
      </p>
    </div>
  )
}

export default function PressPage() {
  return (
    <>
      <section className="relative overflow-hidden" style={{ width: '100vw', marginLeft: 'calc(50% - 50vw)', height: 'clamp(420px,60vh,680px)' }}>
        <Image src="/images/sigourney-press-hero.jpg" alt="Sigourney Cantelo" fill priority sizes="100vw" className="object-cover" style={{ objectPosition: '50% 58%' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(45,34,28,.34), rgba(45,34,28,.10) 45%, rgba(45,34,28,.48))' }} />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <p className="font-sans text-white/85" style={{ fontSize: '11px', letterSpacing: '0.34em', textTransform: 'uppercase' }}>In the</p>
          <h1 className="font-serif italic font-normal text-white mt-1" style={{ fontSize: 'clamp(40px,6vw,72px)', lineHeight: 1 }}>Media</h1>
        </div>
      </section>

    <div className="max-w-wide mx-auto px-[clamp(20px,6vw,104px)] pt-[clamp(36px,5vw,64px)] pb-[clamp(48px,7vw,96px)]">
      <p className="font-serif text-center mx-auto mb-[clamp(36px,5vw,64px)] max-w-[52ch]" style={{ fontSize: 'clamp(15px,1.5vw,18px)', opacity: 0.7 }}>
        Beauticate and founder Sigourney Cantelo, featured across the titles that have shaped beauty,
        wellness and culture for over a decade.
      </p>

      <PressGrid items={PUBLICATIONS} />

      <SectionLabel>Podcasts</SectionLabel>
      <PressGrid items={PODCASTS} />

      <SectionLabel>Features &amp; Collaborations</SectionLabel>
      <PressGrid items={FEATURES} />
    </div>
    </>
  )
}
