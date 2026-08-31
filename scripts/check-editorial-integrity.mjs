#!/usr/bin/env node
/**
 * Editorial integrity check — runs on every `npm run build`.
 *
 * These are the failures that do not announce themselves. Nothing errors, no
 * page 404s, no test goes red: an article just quietly carries the wrong
 * byline, or sits at a URL that redirects away, or ships a 20MB thumbnail. They
 * surfaced only because the RSS feed put every article's metadata side by side
 * in one document where a human could read it.
 *
 * A check is only useful if its normal state is silent, so anything genuinely
 * ambiguous is acknowledged in ACKNOWLEDGED below rather than warned about
 * forever. Zero output means zero problems.
 */
import fs from 'node:fs'
import path from 'node:path'

const CONTENT = 'content'
const PUBLIC = 'public'

/** Bylines that are the publication itself rather than a person. */
const HOUSE = new Set(['Beauticate', 'Beauticate Editorial'])

/** A featured_image heavier than this is a problem for readers, not just feeds. */
const MAX_FEATURED_BYTES = 2_000_000

/**
 * Known and deliberately left alone. Each needs a reason, so that removing an
 * entry is a decision someone makes rather than a line they delete.
 */
const ACKNOWLEDGED = new Map([
  ['beauty-style/hair/why-i-have-pink-hair-and-totally-care',
   'WordPress-era piece; excerpt frames Rikki Hodge-Smith in third person. Whose byline it should carry is an editorial call nobody has made.'],
  ['beauty-style/skin-care/reader-review-after-sun-care',
   'Reader review. The named reader is the subject, not necessarily the author.'],
  ['beauty-style/makeup/the-best-strobing-products-reader-review-1',
   'Reader review, same pattern as above.'],
  ['beauty-style/nails/how-to-give-yourself-a-vinylux-manicure',
   'Jocelyn Petroni is named as the expert consulted; the excerpt is an SEO keyword list.'],
  ['beauty-style/beauty-tips/how-to-get-around-shipping-restrictions-and-more-online-shopping-hacks',
   'Excerpt frames Sigourney as the subject of a Shopbox partnership. She does not recall writing it, so the house byline is the honest answer until someone knows otherwise.'],
])

/**
 * Real people who wrote one or two pieces and are not on the masthead. They
 * carry their own byline, which is correct, but they get no author page and no
 * bio — so they sit outside lib/authors.ts on purpose, and the feed reports
 * them as guest posts, which is also correct.
 *
 * Confirmed one-offs by Sig, 31 Aug 2026. A name here is a decision, not an
 * oversight; a name that is NOT here and not in the registry is worth asking
 * about, which is the whole point of the warning.
 */
const ONE_OFF_CONTRIBUTORS = new Set([
  "Abigail O'Neill",
  'Carla Caruso',
  'Angie Vida',
])

const registry = new Set(
  [...fs.readFileSync('lib/authors.ts', 'utf8').matchAll(/^\s*name: '([^']+)'/gm)].map(m => m[1])
)
const contributors = [...registry].filter(n => !HOUSE.has(n) && n.includes(' '))

// Every path that permanently redirects somewhere else.
const redirectSources = new Set(
  [...fs.readFileSync('next.config.ts', 'utf8')
      .matchAll(/source:\s*'(\/[^']+)'\s*,\s*destination:\s*'[^']+'\s*,\s*permanent:\s*true/g)]
    .map(m => m[1])
)
try {
  for (const r of JSON.parse(fs.readFileSync('vercel.json', 'utf8')).redirects ?? []) {
    if (r.permanent) redirectSources.add(r.source)
  }
} catch { /* vercel.json is optional here */ }

function frontmatter(raw) {
  const m = /^---\n([\s\S]*?)\n---/.exec(raw)
  if (!m) return {}
  const out = {}
  // Deliberately not a YAML parser: this only needs scalar and folded strings,
  // and pulling in a dependency for a build guard is a poor trade.
  for (const line of m[1].split('\n')) {
    const kv = /^([A-Za-z_][\w]*):\s*(.*)$/.exec(line)
    if (kv) out[kv[1]] = kv[2].trim().replace(/^['"]|['"]$/g, '')
  }
  const folded = /^(featured_image|excerpt):\s*>-\n((?:[ \t]+.*\n)+)/gm
  for (const f of m[1].matchAll(folded)) {
    out[f[1]] = f[2].split('\n').map(l => l.trim()).filter(Boolean).join(' ')
  }
  return out
}

const fatal = []
const warn = []

;(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    const sub = path.join(dir, entry.name)
    const mdx = path.join(sub, `${entry.name}.mdx`)
    if (!fs.existsSync(mdx)) { walk(sub); continue }

    const rel = path.relative(CONTENT, sub).split(path.sep).join('/')
    const f = frontmatter(fs.readFileSync(mdx, 'utf8'))
    if (f.published === 'false') continue

    // 1. A published article with no byline. Unambiguous, so it fails the build.
    if (!f.author) {
      fatal.push(`${rel} — published with no author. Every article carries a byline.`)
    } else {
      // 2. A byline that resolves to nobody: no bio, no author page, and the
      //    feed reports it as a guest post by default.
      if (!registry.has(f.author) && !HOUSE.has(f.author) && !ONE_OFF_CONTRIBUTORS.has(f.author)) {
        warn.push(`${rel} — byline "${f.author}" is not in lib/authors.ts.`)
      }
      // 3. The house byline on a piece whose own standfirst names a contributor.
      //    This is how Colette Harvey's first-person cancer piece came to be
      //    credited to "Beauticate Editorial".
      if (HOUSE.has(f.author) && f.excerpt && !ACKNOWLEDGED.has(rel)) {
        const named = contributors.filter(n => f.excerpt.includes(n))
        if (named.length) {
          warn.push(`${rel} — bylined "${f.author}" but the excerpt names ${named.join(', ')}. Whose piece is it?`)
        }
      }
    }

    // 4. A published article whose own URL permanently redirects away is
    //    unreachable on the site, yet the feed and sitemap still advertise it.
    //    That is what leaving the original behind after a re-file looks like.
    if (redirectSources.has(`/${rel}`)) {
      warn.push(`${rel} — published, but /${rel} permanently redirects elsewhere. Delete it, or drop the redirect.`)
    }

    // 5. A thumbnail nobody should be asked to download.
    if (f.featured_image?.startsWith('/')) {
      const file = path.join(PUBLIC, f.featured_image)
      let size = 0
      try { size = fs.statSync(file).size } catch { /* missing images are the feed's warning, not this one's */ }
      if (size > MAX_FEATURED_BYTES) {
        warn.push(`${rel} — featured_image is ${(size / 1e6).toFixed(1)}MB. It is the card image on every archive page.`)
      }
    }
  }
})(CONTENT)

for (const w of warn) console.warn(`[editorial] ${w}`)
for (const e of fatal) console.error(`[editorial] ERROR ${e}`)

if (fatal.length) {
  console.error(`\n[editorial] ${fatal.length} error(s). Fix the byline, or set published: false.`)
  process.exit(1)
}
console.log(`[editorial] ${warn.length} warning(s), 0 errors.`)
