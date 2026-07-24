import Link from 'next/link'

export default function TrustPanel() {
  return (
    <section className="ptb-trust-section">
      <div className="ptb-trust">
        <Link href="/about">
          <span className="ptb-trust-line">25 Years of Trusted Journalism</span>
          <span className="ptb-trust-line">Expertly Curated Shop</span>
        </Link>
      </div>
    </section>
  )
}
