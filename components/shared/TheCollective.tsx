import Link from 'next/link'

export default function TheCollective() {
  return (
    <section
      className="reveal text-center"
      style={{
        padding: 'clamp(28px,3.5vw,48px) clamp(20px,6vw,104px)',
        background: '#FFFFFF',
      }}
    >
      <p
        className="font-serif italic mx-auto"
        style={{ fontSize: 'clamp(16px,1.8vw,21px)', opacity: 0.65, maxWidth: '60ch' }}
      >
        The experts, facialists, dermatologists, designers and stylists, who test everything before it earns a place here.
      </p>

      <div className="mt-5">
        <Link
          href="/about-beauticate"
          className="font-sans text-[11px] tracking-[0.18em] uppercase font-medium border-b pb-0.5"
          style={{ borderColor: '#1C1A17', opacity: 0.65 }}
        >
          Meet the Collective &rarr;
        </Link>
      </div>
    </section>
  )
}
