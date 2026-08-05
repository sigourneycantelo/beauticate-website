import type { Metadata } from 'next'
import Link from 'next/link'
import { pastCompetitions } from '../pastCompetitions'

export const metadata: Metadata = {
  title: 'Past Competitions | Beauticate',
  description:
    'An archive of competitions, prize draws and giveaways previously run by Beauticate, with the terms and conditions that applied.',
}

export default function CompetitionArchivePage() {
  return (
    <div className="max-w-content mx-auto px-6 py-14 md:py-20">

      <header className="mb-10 border-b border-camel/30 pb-8">
        <p className="label-editorial mb-2">Legal</p>
        <h1 className="font-serif text-3xl md:text-4xl text-ink">Past Competitions</h1>
        <p className="font-serif text-charcoal/70 mt-3 max-w-prose">
          A record of competitions we&apos;ve run. Each links to the terms and
          conditions that applied at the time. For the competition currently
          running, see our{' '}
          <Link href="/competitions/terms" className="text-ink hover:text-eucalypt transition-colors">
            current competition terms
          </Link>.
        </p>
      </header>

      {pastCompetitions.length === 0 ? (
        <p className="font-serif text-charcoal/60">
          No past competitions yet. When a competition ends, it will be recorded
          here.
        </p>
      ) : (
        <ul className="divide-y divide-camel/20">
          {pastCompetitions.map(c => (
            <li key={c.slug} className="py-5">
              <Link
                href={`/competitions/archive/${c.slug}`}
                className="group block"
              >
                <h2 className="font-serif text-xl text-ink group-hover:text-eucalypt transition-colors">
                  {c.name}
                </h2>
                <p className="font-sans text-[11px] tracking-[0.15em] uppercase text-charcoal/40 mt-1">
                  {c.period} · Drawn {c.drawn}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
