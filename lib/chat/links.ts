import fs from 'fs'
import path from 'path'

/**
 * Server-side link validation for Ask Sig.
 *
 * The system prompt has said "NEVER fabricate or guess URLs" since day one, and
 * it still shipped a reader a 404: /beauty-style/skin-care/the-complete-guide-to-sunscreen,
 * a plausible-looking slug for an article that has never existed. The failure is
 * intermittent, which makes it the worst kind to fix by prompting, so this makes
 * it impossible instead. Any internal link that is not in the index is stripped
 * back to plain text before the reader sees it.
 */

let _valid: Set<string> | null = null

function normalise(href: string): string {
  let p = href.trim()
  p = p.replace(/^https?:\/\/(?:www\.)?beauticate\.com/i, '')
  p = p.split('#')[0].split('?')[0]
  if (p.length > 1) p = p.replace(/\/+$/, '')
  return p
}

/** Every path Ask Sig is allowed to link to. */
export function validPaths(): Set<string> {
  if (_valid) return _valid
  const out = new Set<string>()
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'data', 'chat-index.json'), 'utf-8')
    const idx = JSON.parse(raw)
    for (const a of idx.articles || []) if (a.url) out.add(normalise(a.url))
    for (const p of idx.products || []) if (p.handle) out.add(`/shop/products/${p.handle}`)
  } catch {
    // If the index cannot be read we cannot validate, and stripping every link
    // would be worse than leaving them. isValidPath falls open in that case.
  }
  // Stable landing pages that are not articles.
  for (const p of [
    '/', '/shop', '/shop/brands', '/shop/collections', '/about', '/contact',
    '/podcast', '/interviews', '/beauty-style', '/wellness', '/living',
    '/destinations', '/destinations/directory', '/search', '/subscribe',
    '/terms', '/privacy', '/sacred60', '/members', '/press',
  ]) out.add(p)
  _valid = out
  return out
}

export function isValidPath(href: string): boolean {
  const set = validPaths()
  if (set.size === 0) return true // index unreadable: do not strip everything
  const p = normalise(href)
  if (!p.startsWith('/')) return true // external links are handled by the prompt rules
  return set.has(p)
}

/**
 * Rewrites markdown links whose target does not exist into plain text, keeping
 * the sentence readable. `[The Complete Guide to Sunscreen](/bad/path)` becomes
 * `The Complete Guide to Sunscreen`.
 */
export function sanitiseInternalLinks(text: string): string {
  return sanitiseInternalLinksCounted(text).text
}

/** Same, but reports how many dead links were removed, for the query log. */
export function sanitiseInternalLinksCounted(text: string): { text: string; stripped: number } {
  let stripped = 0
  const out = text.replace(/\[([^\]\n]+)\]\(([^)\s]+)\)/g, (whole, label: string, href: string) => {
    if (isValidPath(href)) return whole
    stripped++
    return label
  })
  return { text: out, stripped }
}

/**
 * How much of `text` is safe to emit while streaming.
 *
 * A link cannot be validated until its closing paren has arrived, so anything
 * from the last unterminated `[` onwards is held back. Without this the opening
 * half of a bad link would already be on screen by the time we could judge it.
 */
export function safeFlushBoundary(text: string): number {
  const lastOpen = text.lastIndexOf('[')
  if (lastOpen === -1) return text.length
  const after = text.slice(lastOpen)
  // A completed link has both `](` and a closing `)`.
  const closed = /\]\([^)\s]*\)/.test(after)
  return closed ? text.length : lastOpen
}
