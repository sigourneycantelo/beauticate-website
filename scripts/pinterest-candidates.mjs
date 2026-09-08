#!/usr/bin/env node
/**
 * Ranks the published archive by how well it would pin, so nobody has to go
 * looking through 1,736 articles by hand.
 *
 * This does NOT know what is already on Pinterest — nothing in this repo does.
 * It produces the left-hand side of a diff. Export the destination URLs of the
 * existing pins from Pinterest, drop them in a file, pass it as --pinned, and
 * what comes back is the archive minus what is already pinned, best first.
 *
 *   node scripts/pinterest-candidates.mjs                     # ranked worklist
 *   node scripts/pinterest-candidates.mjs --pinned pinned.txt # minus what is done
 *   node scripts/pinterest-candidates.mjs --limit 100 --csv   # for a spreadsheet
 *
 * It does not try to rank beauty. Nothing in the files knows which photograph is
 * the good one, and a score pretending otherwise would just be image count in a
 * dinner jacket. What it can do is narrow 1,736 articles to the ones that are
 * worth a human's eye: evergreen section, not pegged to a year or an awards
 * night, and carrying portrait images there are actually enough of to build
 * pins from. Judging which of those are beautiful is the part you keep.
 *
 * Use --section to work through one board's worth at a time, which is how
 * pinning actually happens.
 */
import fs from 'node:fs'
import path from 'node:path'

const CONTENT = 'content'
const SITE = 'https://www.beauticate.com'
const args = process.argv.slice(2)
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`)
  return i === -1 ? fallback : args[i + 1]
}
const LIMIT = Number(flag('limit', 60))
const AS_CSV = args.includes('--csv')
const SECTION = flag('section')

/** Titles pegged to a moment that has passed. Pinterest search never asks for these. */
const DATED = /\b(19|20)\d{2}\b|oscars?|met gala|golden globes|logies|baftas|grammys|emmys|cannes|fashion week|black friday|this week|last night|just landed|new in|announcement/i

/** Evergreen sections have a search tail. News and profiles do not. */
const EVERGREEN = new Map([
  ['beauty-tips', 3], ['hair', 3], ['skin-care', 3], ['makeup', 3], ['nails', 2],
  ['health', 3], ['fitness', 2], ['biohacking', 2], ['mind', 2],
  ['travel', 3], ['lifestyle', 2], ['interiors', 3], ['food', 2],
  ['edit', 2], ['fragrance', 2],
])
const COLD = new Set(['news', 'uncategorized'])

const dims = (() => {
  try { return JSON.parse(fs.readFileSync('data/image-dimensions.json', 'utf8')) }
  catch { return {} }
})()

const pinnedUrls = (() => {
  const file = flag('pinned')
  if (!file) return null
  const raw = fs.readFileSync(file, 'utf8')
  // Accept a plain URL list or anything with URLs in it; normalise trailing slash.
  return new Set([...raw.matchAll(/https?:\/\/[^\s",']+/g)]
    .map(m => m[0].replace(/\/$/, '').split('?')[0]))
})()

function frontmatter(raw) {
  const m = /^---\n([\s\S]*?)\n---/.exec(raw)
  if (!m) return {}
  const out = {}
  for (const line of m[1].split('\n')) {
    const kv = /^([A-Za-z_][\w]*):\s*(.*)$/.exec(line)
    if (!kv) continue
    const value = kv[2].trim()
    // A single-quoted YAML scalar escapes an apostrophe by doubling it.
    out[kv[1]] = value.startsWith("'") && value.endsWith("'")
      ? value.slice(1, -1).replace(/''/g, "'")
      : value.replace(/^["]|["]$/g, '')
  }
  return out
}

const IMG_MD = /!\[[^\]]*\]\((\/content\/[^)]+)\)/g
const IMG_TAG = /<img[^>]+src="(\/content\/[^"]+)"/g

const rows = []
;(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    const sub = path.join(dir, entry.name)
    const mdx = path.join(sub, `${entry.name}.mdx`)
    if (!fs.existsSync(mdx)) { walk(sub); continue }

    const rel = path.relative(CONTENT, sub).split(path.sep).join('/')
    const raw = fs.readFileSync(mdx, 'utf8')
    const f = frontmatter(raw)
    if (f.published === 'false') continue

    const parts = rel.split('/')
    if (COLD.has(parts[0])) continue
    const weight = EVERGREEN.get(parts[1]) ?? EVERGREEN.get(parts[0]) ?? 1

    const body = raw.slice(raw.indexOf('\n---', 3) + 4)
    const srcs = new Set([
      ...[...body.matchAll(IMG_MD)].map(m => m[1]),
      ...[...body.matchAll(IMG_TAG)].map(m => m[1]),
    ])
    let portrait = 0
    for (const s of srcs) {
      const d = dims[s]
      if (d && d[1] > d[0] * 1.05) portrait++
    }
    if (!portrait) continue           // nothing pin-shaped to work with

    const title = (f.title || parts.at(-1)).replace(/"/g, "'")
    // A piece pegged to a year or an awards night is not evergreen however
    // many pretty images it has, and Pinterest search will never ask for it.
    if (DATED.test(title)) continue

    const url = `${SITE}/${rel}`
    if (pinnedUrls?.has(url.replace(/\/$/, ''))) continue

    // Diminishing returns on image count: a 53-image gallery is not five times
    // the pin opportunity of a 10-image piece, because either way you would
    // build three to five pins from it. Cap it so depth does not beat fit.
    const section = parts.slice(0, 2).join('/')
    if (SECTION && !section.startsWith(SECTION)) continue
    rows.push({
      url,
      title,
      section,
      date: (f.date_published || '').slice(0, 10),
      portrait,
      images: srcs.size,
      tier: weight,
    })
  }
})(CONTENT)

// Best-fit sections first, then the pieces with the most to work with.
rows.sort((a, b) => b.tier - a.tier || b.portrait - a.portrait || a.date.localeCompare(b.date))
const top = rows.slice(0, LIMIT)

if (AS_CSV) {
  console.log('section,portrait_images,total_images,date,title,url')
  for (const r of top) console.log(`${r.section},${r.portrait},${r.images},${r.date},"${r.title}",${r.url}`)
} else {
  const scope = pinnedUrls ? ` (${pinnedUrls.size} already pinned, excluded)` : ''
  console.log(`${rows.length} pinnable articles${scope}. Top ${top.length}:\n`)
  let section = null
  for (const r of top) {
    if (r.section !== section) { section = r.section; console.log(`\n  ${section}`) }
    console.log(`    ${r.portrait.toString().padStart(2)} portrait  ${r.date}  ${r.title.slice(0, 56)}`)
    console.log(`                          ${r.url}`)
  }
  console.log(`\n  --section <path> for one board at a time, --csv for a spreadsheet.`)
  console.log(`  --pinned <file> with pin destination URLs exported from Pinterest hides what is done.`)
}
