import Link from 'next/link'
import Image from 'next/image'

// Founder introduction — portrait left, letter right. Mirrors the
// image_with_text section on beauticate.shop's home.
export default function FounderIntro() {
  return (
    <section className="max-w-wide mx-auto px-[clamp(20px,6vw,104px)] py-[clamp(48px,7vw,90px)]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[clamp(28px,5vw,72px)] items-center">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[2px] bg-cream-100">
          <Image
            src="/images/sigourney-cantelo.jpg"
            alt="Sigourney Cantelo, founder and publisher of Beauticate"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div>
          <p className="font-sans" style={{ fontSize: '11px', letterSpacing: '0.28em', textTransform: 'uppercase', opacity: 0.55 }}>
            Sigourney Cantelo, Founder &amp; Publisher
          </p>
          <div className="font-serif mt-4 space-y-4" style={{ fontSize: 'clamp(16px,1.5vw,19px)', lineHeight: 1.6 }}>
            <p>
              I'm Sigourney. I've spent more than 25 years in media, first as an editor at titles
              including Vogue and Glamour, and for the last twelve as the founder of Beauticate.
            </p>
            <p>
              Beauticate Shop is a new kind of shop. Editorial first, commerce second. Every product
              here has been considered, tested, and chosen by me and our editors, the Beauticate
              Collective, and our guest curators. Nothing is here by accident.
            </p>
            <p>
              I want to help women live more beautifully, every day. To do the work so you don't have
              to. When you shop with us, you're supporting independent editorial. Every order helps us
              keep bringing you the stories and recommendations you trust.
            </p>
          </div>
          <Link
            href="/about"
            className="inline-block mt-6 font-sans text-ink"
            style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', borderBottom: '1px solid currentColor', paddingBottom: '2px' }}
          >
            Read more about how Beauticate Shop works
          </Link>
        </div>
      </div>
    </section>
  )
}
