import Link from 'next/link'
import Image from 'next/image'

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
              Welcome to Beauticate Shop. This isn&apos;t a marketplace. Every product here has been tested and chosen by me and the Beauticate editorial team. Nothing is here by accident.
            </p>
            <p>
              When you shop with us, you&apos;re backing independent journalism. A share of every sale comes back to Beauticate, and it helps fund the writing you come here for. So every order does two lovely things at once. It brings you something we love, and it supports the stories that led you to it.
            </p>
            <p>
              A few things worth knowing. Some pieces you can buy right here, shipped straight from the brand that makes them. Others link you through to the retailer to shop. Either way we may earn a small commission, and it never changes the price you pay. Because each order comes direct from the brand, an order from a few brands may arrive as a few separate parcels, and returns are looked after by the brand that sent your item, with us alongside to help. You can read exactly how it all works{' '}
              <Link href="/shop/how-it-works" className="text-ink hover:text-eucalypt transition-colors underline underline-offset-2 decoration-[0.5px]">here</Link>.
              And if you know a brand we would love,{' '}
              <Link href="/shop/suggest" className="text-ink hover:text-eucalypt transition-colors underline underline-offset-2 decoration-[0.5px]">tell me</Link>.
              I read every suggestion. Or if you&apos;re a brand, you can learn more about{' '}
              <Link href="/shop/partners" className="text-ink hover:text-eucalypt transition-colors underline underline-offset-2 decoration-[0.5px]">applying to be featured in the shop here</Link>.
            </p>
            <p>
              Thank you for shopping in a way that keeps good journalism alive. It means more than you know.
            </p>
            <p>Sigourney x</p>
          </div>
        </div>
      </div>
    </section>
  )
}
