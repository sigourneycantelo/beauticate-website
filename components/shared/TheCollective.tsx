import Image from 'next/image'
import Link from 'next/link'

export default function TheCollective() {
  return (
    <section
      className="reveal text-center"
      style={{
        padding: 'clamp(48px,6vw,82px) clamp(20px,6vw,104px)',
        background: '#FFFFFF',
      }}
    >
      <span
        className="block font-sans text-[11px] tracking-[0.34em] uppercase font-medium"
        style={{ opacity: 0.55 }}
      >
        The Collective
      </span>
      <h2
        className="font-serif font-normal mt-3"
        style={{ fontSize: 'clamp(24px,3vw,36px)' }}
      >
        The voices behind every recommendation
      </h2>
      <p
        className="font-serif italic mt-3 mx-auto mb-8"
        style={{ fontSize: 'clamp(15px,1.6vw,19px)', opacity: 0.7, whiteSpace: 'nowrap' }}
      >
        Our advice comes from editors, experts, facialists, doctors, designers and stylists, not influencers or algorithms
      </p>

      {/* Contact-sheet image */}
      <div
        className="mx-auto overflow-hidden rounded-[2px]"
        style={{ maxWidth: '1120px', margin: '6px auto 30px', border: '1px solid rgba(28,26,23,.10)' }}
      >
        <Image
          src="/images/collective-contact-sheet.jpg"
          alt="The Beauticate Collective"
          width={1200}
          height={630}
          className="w-full h-auto"
        />
      </div>

      <div className="mt-8">
        <Link
          href="/about-beauticate"
          className="font-sans text-[11px] tracking-[0.18em] uppercase font-medium border-b pb-0.5"
          style={{ borderColor: '#1C1A17', opacity: 0.65 }}
        >
          Meet the Collective →
        </Link>
      </div>
    </section>
  )
}
