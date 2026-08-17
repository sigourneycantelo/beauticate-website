import Link from 'next/link'

export default function ReviewsTeaser() {
  return (
    <section
      className="full-bleed reveal text-center"
      style={{
        padding: 'clamp(28px,3.5vw,44px) clamp(20px,6vw,104px)',
        background: '#F5F1EC',
      }}
    >
      <span
        className="block font-sans text-[11px] tracking-[0.34em] uppercase font-medium"
        style={{ opacity: 0.55 }}
      >
        For Brands
      </span>
      <h2
        className="font-serif font-normal mt-3"
        style={{ fontSize: 'clamp(20px,2.4vw,28px)' }}
      >
        How we review, and how to submit yours
      </h2>
      <p
        className="font-serif italic mt-3 mx-auto"
        style={{ fontSize: 'clamp(14px,1.4vw,17px)', opacity: 0.7, maxWidth: '520px' }}
      >
        What we accept, how our editors and Trial Teams test, and where to send it.
      </p>

      <div className="mt-6">
        <Link
          href="/how-we-review"
          className="font-sans text-[11px] tracking-[0.18em] uppercase font-medium border-b pb-0.5"
          style={{ borderColor: '#1C1A17', opacity: 0.65 }}
        >
          Read how it works →
        </Link>
      </div>
    </section>
  )
}
