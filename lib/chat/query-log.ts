// ─── Ask Sig query log (Vercel Blob) ──────────────────────────────────────────
//
// Every question was being dropped. The route called appendToSheet('Ask Sig
// Queries', ...) fire-and-forget, and appendToSheet returns false immediately
// unless GOOGLE_SHEET_ID is set, which it never was. /api/query-log was built
// for the same job and nothing ever called it. So there is no record of a
// single question since launch.
//
// This uses Vercel Blob because it is already wired up in production for gift
// state and the Instagram feed, so it needs no new account, key or spreadsheet.
// One small JSON doc per question, append-only (unique path each time, so no
// read-modify-write race). Read it back with scripts/ask-sig-report.mjs.
//
// Deliberately logged alongside the question:
//   articleCount 0  -> we had no content for it. That is the story-idea list.
//   strippedLinks>0 -> the model invented a URL we had to remove. That is the
//                      fabrication rate, which is otherwise invisible.

import { put } from '@vercel/blob'

export type QueryLogEntry = {
  ts: string
  question: string
  /** Did this touch a therapeutic good, so the strict guardrails applied? */
  restricted: boolean
  /** How much grounding we actually had. 0 articles is the interesting case. */
  articleCount: number
  productCount: number
  topArticle?: string
  /** Length of what Sig said back, as a rough "did we answer" signal. */
  responseChars: number
  /** Internal links removed because the target does not exist. */
  strippedLinks: number
  /** The page the reader was on, when the panel sends it. */
  pageContext?: string
}

const DIR = 'ask-sig-queries'

/**
 * Never throws and never blocks the reply. A logging failure must not cost a
 * reader their answer, which is also why the old call was fire-and-forget —
 * the mistake was that it silently did nothing, not that it was async.
 */
export async function logQuery(entry: QueryLogEntry): Promise<void> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return
  try {
    const day = entry.ts.slice(0, 10)
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    await put(`${DIR}/${day}/${id}.json`, JSON.stringify(entry), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
    })
  } catch {
    // swallow
  }
}
