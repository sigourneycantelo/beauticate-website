import Link from 'next/link'
import Image from 'next/image'

// Meet the Beauticate Collective — heading, subtitle and the contact-sheet
// composite of all fifteen editors and experts. Mirrors beauticate.shop.
export default function Collective() {
  return (
    <section className="bg-white border-t border-cream-200 px-[clamp(20px,6vw,104px)] py-[clamp(48px,7vw,90px)]">
      <div className="text-center mb-9 max-w-2xl mx-auto">
        <p className="font-sans text-[11px] tracking-[0.34em] uppercase font-semibold text-eucalypt">
          The Beauticate Collective
        </p>
        <h2 className="font-serif font-normal mt-3" style={{ fontSize: 'clamp(28px,3.4vw,44px)', lineHeight: 1.12 }}>
          Meet your <em className="italic">personal shoppers</em>
        </h2>
        <p className="font-serif mt-3 mx-auto" style={{ fontSize: 'clamp(15px,1.5vw,18px)', lineHeight: 1.4, opacity: 0.7, maxWidth: '46ch' }}>
          The editors, experts and trusted voices behind every recommendation.
        </p>
      </div>

      <Image
        src="/images/beauticate-collective.jpg"
        alt="The Beauticate Collective — fifteen editors, experts and trusted voices"
        width={1200}
        height={630}
        sizes="(max-width: 1280px) 100vw, 1200px"
        className="w-full h-auto rounded-[2px]"
      />

      <div className="text-center mt-9">
        <Link
          href="/about"
          className="inline-block font-sans text-[10.5px] tracking-[0.2em] uppercase border border-ink px-7 py-3 rounded-[1px] hover:bg-ink hover:text-white transition-colors duration-300"
        >
          Meet the Collective
        </Link>
      </div>
    </section>
  )
}
