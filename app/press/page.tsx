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

// Press coverage, in the order it appears in the Beauticate media kit.
const PRESS: PressItem[] = [
  { outlet: 'Vogue', title: 'How Not To Get A Suntan In Paris', href: 'https://www.vogue.com.au/beauty/skin/how-not-to-get-a-suntan-in-paris/news-story/a2a52a5c4d76cc2cc0129a0194539fef', logo: '/images/press/vogue.png' },
  { outlet: 'The Daily Telegraph', title: 'Sigourney Cantelo: ‘I had the perfect life but was really crumbling inside’', href: 'https://www.dailytelegraph.com.au/lifestyle/sydney-weekend/sigourney-cantelo-i-had-the-perfect-life-but-was-really-crumbling-inside/news-story/68a35c2fcd6d7b0d305550d34b33729c', logo: '/images/press/daily-telegraph.png' },
  { outlet: 'Daily Mail', title: 'Seasoned traveller: Vogue beauty editor reveals must-have holiday products', href: 'https://www.dailymail.co.uk/femail/article-7373261/How-pack-like-seasoned-traveller-Vogue-beauty-editor-reveals-products.html', logo: '/images/press/daily-mail.png' },
  { outlet: 'Daily Mail', title: 'Expert shares the exact skincare and makeup she uses to avoid getting Botox', href: 'https://www.dailymail.com/lifestyle/article-8598825/Expert-shares-exact-skincare-makeup-uses-AVOID-getting-Botox.html', logo: '/images/press/daily-mail.png' },
  { outlet: 'ParlourX', title: 'The X-Files Interviews — Sigourney Cantelo', href: 'https://www.parlourx.com/blogs/news/sigourney-cantelo-beauticate', logo: '/images/press/parlourx.png' },
  { outlet: 'Marie Claire', title: 'I Checked Myself Into Rehab For Anxiety — It Wasn’t What I Expected', href: 'https://www.marieclaire.com.au/life/health-wellness/rehab-for-anxiety/', logo: '/images/press/marie-claire.png' },
  { outlet: 'Beauty Directory', title: 'Sigourney Cantelo launches new podcast', href: 'https://www.beautydirectory.com.au/news/digital/sigourney-cantelo-launches-podcast-beautiful-inside-by-beauticate', logo: '/images/press/beauty-directory.png' },
  { outlet: 'North Shore Times', title: 'Where are the hottest beauty salons on Sydney’s North Shore?', href: 'https://www.news.com.au/lifestyle/beauty/where-are-mosmans-hottest-beauty-salons/news-story/ef0e3fe787c4fa7d2f1fa5441815d5b2', logo: '/images/press/north-shore-times.png' },
  { outlet: 'Ageless by Rescu', title: 'Sigourney Cantelo — Beauty & Empowerment', href: 'https://podcasts.apple.com/us/podcast/sigourney-cantelo-beauty-and-empowerment/id1579146202?i=1000552404701', logo: '/images/press/ageless-rescu.png' },
  { outlet: 'Ella Baché', title: 'Bold Women — Sigourney Cantelo', href: 'https://www.ellabache.com.au/blogs/bold-beyond-beauty/bold-women-sigourney-cantelo', logo: '/images/press/ella-bache.png' },
  { outlet: 'The Strategy', title: 'The Strategy — Sigourney Cantelo', href: 'https://thestrategy.ca/2021/07/08/sigourney-cantelo-the-strategy/', logo: '/images/press/the-strategy.png' },
  { outlet: 'Mumbrella', title: 'Vogue’s Sigourney Cantelo Departs To Run Own Site — Beauticate', href: 'https://mumbrella.com.au/vogues-sigourney-cantelo-departs-run-site-233667', logo: '/images/press/mumbrella.png' },
  { outlet: 'Vogue', title: 'Vogue Road Tests Mineral Makeup', href: 'https://www.vogue.com.au/beauty/makeup/vogue-roadtests-mineral-makeup/news-story/cd1698343c42b5622e072203b057918b', logo: '/images/press/vogue.png' },
]

export default function PressPage() {
  return (
    <div className="max-w-wide mx-auto px-[clamp(20px,6vw,104px)] py-[clamp(48px,7vw,96px)]">
      <header className="text-center mb-[clamp(40px,5vw,72px)]">
        <p className="font-sans" style={{ fontSize: '11px', letterSpacing: '0.34em', textTransform: 'uppercase', opacity: 0.5 }}>
          In the
        </p>
        <h1 className="font-serif italic font-normal mt-1" style={{ fontSize: 'clamp(40px,6vw,72px)', lineHeight: 1 }}>
          Media
        </h1>
        <p className="font-serif mx-auto mt-5 max-w-[52ch]" style={{ fontSize: 'clamp(15px,1.5vw,18px)', opacity: 0.7 }}>
          Beauticate and founder Sigourney Cantelo, featured across the titles that have shaped beauty,
          wellness and culture for over a decade.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[clamp(28px,4vw,64px)] gap-y-[clamp(28px,3vw,44px)]">
        {PRESS.map((p, i) => (
          <a
            key={i}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group block border-t border-cream-200 pt-5"
          >
            {p.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={p.logo}
                alt={p.outlet}
                className="h-7 w-auto object-contain object-left"
                style={{ maxWidth: '160px', opacity: 0.85 }}
              />
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
        ))}
      </div>
    </div>
  )
}
