import Link from 'next/link'

const LOGOS = [
  'VOGUE',
  'marie claire',
  'Daily Telegraph',
  'DailyMail.com',
  'Mumbrella',
  'BEAUTYDIRECTORY',
]

export default function AsSeenIn() {
  return (
    <section className="press-trust-band">
      <p className="ptb-heading">
        <Link href="/press">As Seen In</Link>
      </p>
      <div className="ptb-logos">
        {LOGOS.map(name => (
          <Link key={name} href="/press" className="ptb-logo">
            {name}
          </Link>
        ))}
      </div>
    </section>
  )
}
