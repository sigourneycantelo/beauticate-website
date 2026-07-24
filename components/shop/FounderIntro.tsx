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
            src="/content/sigourneys-edit/beauticate-shop-launch/welcome-to-new-beauticate-hero.jpg"
            alt="Sigourney Cantelo testing beauty products at her desk"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div>
          <p className="font-sans" style={{ fontSize: '11px', letterSpacing: '0.28em', textTransform: 'uppercase', opacity: 0.55 }}>
            Sigourney Cantelo, Founder &amp; Publisher
          </p>
          <div className="font-serif mt-4 space-y-3" style={{ fontSize: 'clamp(16px,1.5vw,19px)', lineHeight: 1.6 }}>
            <p>
              This isn't a marketplace. Every product here has been tested and chosen by me and the Beauticate Collective — the editors and experts behind our stories. Nothing is here by accident.
            </p>
            <p>
              When you shop with us, you're supporting the editorial that has always been free and ungated. Every order helps us keep bringing you honest recommendations without paywalls or sponsored content.
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
