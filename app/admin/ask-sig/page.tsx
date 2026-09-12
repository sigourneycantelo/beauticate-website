import { readQueryLog, checkKey } from '@/lib/chat/query-log-read'

export const dynamic = 'force-dynamic'
export const metadata = { robots: { index: false, follow: false } }

export default async function AskSigQuestions({
  searchParams,
}: {
  searchParams: Promise<{ key?: string }>
}) {
  const { key } = await searchParams

  // Readers' own questions, which regularly include health details. Behind a
  // shared secret rather than an obscure URL. 404 rather than 401 so the page's
  // existence is not confirmed to anyone guessing.
  if (!checkKey(key ?? null)) {
    return (
      <div className="max-w-xl mx-auto px-6 py-24 font-sans text-sm text-muted">
        <p>Not found.</p>
      </div>
    )
  }

  const entries = await readQueryLog()

  if (entries.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 font-sans text-sm">
        <h1 className="font-serif text-2xl text-ink mb-4">Ask Sig questions</h1>
        <p className="text-muted mb-3">Nothing logged yet.</p>
        <p className="text-muted">
          Either nobody has asked anything since logging shipped, or{' '}
          <code className="text-ink">BLOB_READ_WRITE_TOKEN</code> is missing from the
          production environment, in which case every question is being dropped
          exactly as before.
        </p>
      </div>
    )
  }

  const noContent = entries.filter(e => e.articleCount === 0)
  const invented = entries.filter(e => e.strippedLinks > 0)
  const restricted = entries.filter(e => e.restricted)
  const pct = (n: number) => `${Math.round((n / entries.length) * 100)}%`

  const stats = [
    { label: 'questions', value: String(entries.length), hint: `since ${entries[entries.length - 1].ts.slice(0, 10)}` },
    { label: 'no article matched', value: String(noContent.length), hint: `${pct(noContent.length)} — content gaps` },
    { label: 'invented a link', value: String(invented.length), hint: `${pct(invented.length)} — caught and removed` },
    { label: 'restricted goods', value: String(restricted.length), hint: `${pct(restricted.length)} — stricter rules applied` },
  ]

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 font-sans">
      <div className="flex items-baseline justify-between mb-8 flex-wrap gap-3">
        <h1 className="font-serif text-3xl text-ink">Ask Sig questions</h1>
        <a
          href={`/api/admin/ask-sig-export?key=${encodeURIComponent(key ?? '')}`}
          className="text-sm underline text-ink hover:text-eucalypt transition-colors"
        >
          Download as CSV
        </a>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {stats.map(s => (
          <div key={s.label} className="border border-line rounded-lg p-4 bg-white">
            <p className="font-serif text-3xl text-ink leading-none">{s.value}</p>
            <p className="text-xs text-ink mt-2">{s.label}</p>
            <p className="text-xs text-muted mt-1">{s.hint}</p>
          </div>
        ))}
      </div>

      {noContent.length > 0 && (
        <section className="mb-10">
          <h2 className="font-serif text-xl text-ink mb-1">Asked, but we had nothing</h2>
          <p className="text-xs text-muted mb-4">
            Retrieval matched no article. This is a content list written by your readers.
          </p>
          <ul className="space-y-1">
            {noContent.slice(0, 30).map((e, i) => (
              <li key={i} className="text-sm text-ink border-b border-line/60 py-2">
                <span className="text-muted text-xs mr-3">{e.ts.slice(0, 10)}</span>
                {e.question}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2 className="font-serif text-xl text-ink mb-4">Everything</h2>
        <div className="overflow-x-auto border border-line rounded-lg bg-white">
          <table className="w-full text-sm">
            <thead className="bg-greige/40 text-left">
              <tr>
                {['When', 'Question', 'Articles', 'Answer', 'Asked from'].map(h => (
                  <th key={h} className="px-3 py-2 font-sans text-xs text-ink whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {entries.slice(0, 300).map((e, i) => (
                <tr key={i} className="border-t border-line/60 align-top">
                  <td className="px-3 py-2 text-xs text-muted whitespace-nowrap">
                    {e.ts.slice(0, 10)}<br />{e.ts.slice(11, 16)}
                  </td>
                  <td className="px-3 py-2 text-ink">
                    {e.question}
                    {e.strippedLinks > 0 && (
                      <span className="ml-2 text-xs text-wine">invented a link</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-xs whitespace-nowrap">
                    {e.articleCount === 0
                      ? <span className="text-wine">none</span>
                      : <span className="text-muted">{e.articleCount}</span>}
                  </td>
                  <td className="px-3 py-2 text-xs text-muted whitespace-nowrap">{e.responseChars} ch</td>
                  <td className="px-3 py-2 text-xs text-muted truncate max-w-[220px]">{e.pageContext ?? ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {entries.length > 300 && (
          <p className="text-xs text-muted mt-3">
            Showing the most recent 300 of {entries.length}. The CSV has everything.
          </p>
        )}
      </section>
    </div>
  )
}
