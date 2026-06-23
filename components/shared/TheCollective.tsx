import Image from 'next/image'
import Link from 'next/link'

const STATS = [
  { value: '12 years', label: 'of trusted beauty journalism' },
  { value: '3 million', label: 'monthly touchpoints' },
  { value: 'Expert-led', label: 'written by specialists, not algorithms' },
]

export default function TheCollective() {
  return (
    <section
      className="reveal text-center"
      style={{
        padding: 'clamp(48px,6vw,82px) clamp(20px,6vw,104px)',
        background: '#FBF9F4',
        borderTop: '1px solid rgba(28,26,23,.10)',
        borderBottom: '1px solid rgba(28,26,23,.10)',
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
        className="font-sans mt-2 mx-auto"
        style={{ fontSize: '13px', opacity: 0.66, maxWidth: '60ch', marginBottom: '14px' }}
      >
        Trusted by women for over a decade. Every story is written, tested and stood behind by a named expert, not an algorithm.
      </p>

      {/* Stats */}
      <div
        className="flex justify-center flex-wrap mx-auto pt-2 mb-8"
        style={{ gap: 'clamp(20px,4vw,54px)' }}
      >
        {STATS.map(s => (
          <div
            key={s.value}
            className="font-sans text-[10px] tracking-[0.16em] uppercase"
            style={{ opacity: 0.6 }}
          >
            <b
              className="block font-serif font-normal"
              style={{ fontSize: '24px', letterSpacing: 0, textTransform: 'none', opacity: 1, marginBottom: '3px', fontStyle: 'italic' }}
            >
              {s.value}
            </b>
            {s.label}
          </div>
        ))}
      </div>

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
