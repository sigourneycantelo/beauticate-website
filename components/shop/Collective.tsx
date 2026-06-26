import Link from 'next/link'

const NAMES = [
  'Sigourney Cantelo', 'Jocelyn Petroni', 'Monique McMahon', 'Kate Waterhouse',
  'Brooke Stevenson', 'Camilla Thompson', 'Rae Morris', 'Shentel Lee',
  'Michelle Bridges', 'Kristin Rawson', 'Dr Amy Chahal', 'Simone Aspinall',
  'Kerrie Gentle', 'Dr Leanne Girgis', 'Jacqueline Alwill',
]

// "Meet the Beauticate Collective" — the editors and experts behind every pick.
export default function Collective() {
  return (
    <section
      className="text-center"
      style={{ background: '#104760', color: '#FFFFFF', padding: 'clamp(52px,7vw,96px) clamp(20px,6vw,104px)' }}
    >
      <p className="font-sans" style={{ fontSize: '11px', letterSpacing: '0.34em', textTransform: 'uppercase', opacity: 0.7 }}>
        Meet the Beauticate Collective
      </p>
      <p className="font-serif mx-auto mt-4 max-w-[40ch]" style={{ fontSize: 'clamp(20px,2.4vw,30px)', lineHeight: 1.32 }}>
        The editors, experts, and trusted voices behind every recommendation.
      </p>

      <p className="font-serif italic mx-auto mt-8 max-w-[56ch]" style={{ fontSize: 'clamp(15px,1.5vw,18px)', lineHeight: 1.9, opacity: 0.85 }}>
        {NAMES.map((name, i) => (
          <span key={name}>
            {name}
            {i < NAMES.length - 1 && <span className="not-italic mx-2 opacity-50">·</span>}
          </span>
        ))}
      </p>

      <Link
        href="/about"
        className="inline-block mt-9 font-sans text-white"
        style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,.8)', paddingBottom: '2px' }}
      >
        Meet the Collective →
      </Link>
    </section>
  )
}
