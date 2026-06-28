#!/usr/bin/env node
/**
 * audit-wp-vs-vercel.mjs
 * ----------------------
 * Compares migrated MDX articles against their authoritative WordPress source
 * (the WP REST API, the same source the original migration used) and reports
 * inconsistencies WITHOUT changing anything. Read-only audit → review → fix.
 *
 * Detects four classes of inconsistency:
 *   1. IMAGES   — body images present on WP but missing from the MDX
 *   2. TEXT     — WP body has materially more text than the MDX (truncation)
 *   3. MARKDOWN — broken italic/bold delimiters, glued paragraphs, stray stars
 *   4. META     — title / author / date_published differ from the WP original
 *
 * Usage:
 *   node scripts/audit-wp-vs-vercel.mjs --category beauty-style --limit 12
 *   node scripts/audit-wp-vs-vercel.mjs --category interviews --limit 12 --slug some-slug
 *
 * Output (gitignored cache + committed reports):
 *   .cache/wp/<slug>.json          raw WP API responses (cached, resumable)
 *   qa/wp-audit/<category>.json     machine-readable findings
 *   qa/wp-audit/<category>.md       human-readable ranked report
 */

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync, statSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import https from 'https'
import matter from 'gray-matter'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const CONTENT_DIR = join(ROOT, 'content')
const CACHE_DIR = join(ROOT, '.cache', 'wp')
const REPORT_DIR = join(ROOT, 'qa', 'wp-audit')
const WP_BASE = 'https://www.beauticate.com/wp-json/wp/v2'

// ─── CLI args ──────────────────────────────────────────────────────────────
const args = process.argv.slice(2)
function arg(name, def) {
  const i = args.indexOf(`--${name}`)
  return i !== -1 && args[i + 1] ? args[i + 1] : def
}
const CATEGORY = arg('category')
const LIMIT = parseInt(arg('limit', '12'), 10)
const ONLY_SLUG = arg('slug')
const NO_CACHE = args.includes('--no-cache')
const VERCEL_BASE = arg('base', 'https://beauticate-website.vercel.app').replace(/\/+$/, '')

// The on-disk content path IS the Vercel route: /<category>/<subcategory>/<slug>/
function vercelUrlFor(slugParts) { return `${VERCEL_BASE}/${slugParts.join('/')}/` }

if (!CATEGORY) {
  console.error('Usage: node scripts/audit-wp-vs-vercel.mjs --category <name> [--limit 12] [--slug <slug>] [--no-cache]')
  process.exit(1)
}

// ─── Tunable thresholds ──────────────────────────────────────────────────────
// Text is flagged as truncated only when the MDX is missing BOTH a meaningful
// fraction AND an absolute number of words — avoids noise from minor edits.
const TEXT_PCT_THRESHOLD = 0.15   // MDX has <85% of WP word count
const TEXT_ABS_THRESHOLD = 80     // ...and is short by at least 80 words

// ─── Small HTTP helper (WP REST API) ─────────────────────────────────────────
function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (beauticate-audit)' } }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchJson(res.headers.location).then(resolve, reject)
      }
      let data = ''
      res.on('data', c => (data += c))
      res.on('end', () => {
        try { resolve(JSON.parse(data)) } catch (e) { reject(new Error(`Bad JSON from ${url}: ${e.message}`)) }
      })
    }).on('error', reject)
  })
}

// ─── Entity decoding (WP returns numeric/HTML entities) ──────────────────────
const ENTITIES = {
  '&#8217;': '’', '&#8216;': '‘', '&#8220;': '“', '&#8221;': '”',
  '&#8211;': '–', '&#8212;': '—', '&#8230;': '…', '&#038;': '&',
  '&amp;': '&', '&nbsp;': ' ', '&quot;': '"', '&#39;': "'", '&apos;': "'",
  '&lt;': '<', '&gt;': '>', '&hellip;': '…', '&rsquo;': '’', '&lsquo;': '‘',
  '&ldquo;': '“', '&rdquo;': '”', '&ndash;': '–', '&mdash;': '—',
}
function decode(str = '') {
  return str
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&[a-z0-9]+;/gi, m => ENTITIES[m] ?? m)
}

// ─── HTML helpers for WP content.rendered ────────────────────────────────────
// Strip leftover WPBakery/WordPress shortcodes (e.g. [vc_row], [vc_column_text],
// [vc_single_image image="..." link="..."], [/caption]). On old migrated posts
// these survive in content.rendered and otherwise inflate the WP word count,
// causing false TEXT-truncation findings.
function stripShortcodes(s) { return s.replace(/\[\/?[a-z][^\]]*\]/gi, ' ') }
function stripTags(html) {
  return decode(
    html
      .replace(/<(script|style)[\s\S]*?<\/\1>/gi, '')
      .replace(/<[^>]+>/g, ' ')
  ).replace(/\s+/g, ' ').trim()
}
function wordCount(text) {
  const t = text.trim()
  return t ? t.split(/\s+/).length : 0
}
function basename(url = '') {
  return url.split('?')[0].split('#')[0].split('/').pop() || ''
}
// Normalise an image filename for fuzzy matching: drop WP size suffix + ext, lowercase
function imgKey(url) {
  return basename(url).toLowerCase().replace(/-\d+x\d+(?=\.[a-z]+$)/, '').replace(/\.[a-z]+$/, '')
}

function extractWpImages(html) {
  const out = []
  for (const m of html.matchAll(/<img\b[^>]*>/gi)) {
    const tag = m[0]
    const src = (tag.match(/\bsrc=["']([^"']+)["']/i) || [])[1]
    if (!src) continue
    if (/^data:/i.test(src)) continue
    if (/gravatar|spacer|blank\.gif|1x1|pixel/i.test(src)) continue
    const alt = decode((tag.match(/\balt=["']([^"']*)["']/i) || [])[1] || '')
    out.push({ src, alt })
  }
  return out
}
function extractWpCaptions(html) {
  const caps = []
  for (const m of html.matchAll(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/gi)) caps.push(stripTags(m[1]))
  for (const m of html.matchAll(/\[caption[^\]]*\]([\s\S]*?)\[\/caption\]/gi)) {
    const t = stripTags(m[1].replace(/<img[^>]*>/gi, ''))
    if (t) caps.push(t)
  }
  return caps.filter(Boolean)
}

// ─── MDX body parsing ────────────────────────────────────────────────────────
// Body images only (markdown ![]() + any JSX component image/src attribute:
// <img>, <Portrait>, <ShopItem>, <ShopWindow>, carousels…). Excludes frontmatter
// — WP's content.rendered does not include the featured image either, so we
// compare body-to-body.
function extractMdxBodyImages(body) {
  const srcs = []
  for (const m of body.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)) srcs.push(m[1])
  for (const m of body.matchAll(/\b(?:src|image|images?)=["']([^"']+\.(?:jpg|jpeg|png|webp|gif|avif|svg))["']/gi)) srcs.push(m[1])
  return srcs.map(s => s.trim()).filter(Boolean)
}
// Image filenames referenced anywhere in frontmatter (hero/featured/product_links).
// Used only as an extra safety net when listing candidate-missing images.
function frontmatterImageKeys(frontmatter = {}) {
  const keys = new Set()
  for (const m of JSON.stringify(frontmatter).matchAll(/([A-Za-z0-9._-]+\.(?:jpg|jpeg|png|webp|gif|avif))/gi)) keys.add(imgKey(m[1]))
  return keys
}
function mdxPlainWordCount(body) {
  const text = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')        // images
    .replace(/<[^>]+>/g, ' ')                      // JSX/HTML tags
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')       // links → text
    .replace(/[*_#>`~]/g, ' ')                     // md punctuation
    .replace(/\s+/g, ' ')
    .trim()
  return wordCount(text)
}

// Markdown delimiter health — patterns from CLAUDE.md cleanup mandate
function findMarkdownBugs(body) {
  const bugs = []
  const lines = body.split('\n')
  lines.forEach((line, i) => {
    const n = i + 1
    // SPACE-CLOSE-BOLD: "**label: **text" — space/NBSP before closing **
    if (/\*\*[^*\n]*[  ]\*\*/.test(line)) bugs.push({ type: 'space-close-bold', line: n })
    // GLUE: sentence end glued to next via a bare * with no surrounding space, e.g. "have.*I had"
    if (/[a-z0-9.!?"’”]\*[A-Z‘“]/.test(line)) bugs.push({ type: 'glue', line: n })
    // STRAY STARS: a line that is only asterisks
    if (/^\s*\*{2,}\s*$/.test(line)) bugs.push({ type: 'stray-stars', line: n })
    // MISMATCHED: odd number of standalone ** runs on a non-empty line (rough heuristic)
    const boldRuns = (line.match(/\*\*/g) || []).length
    if (boldRuns % 2 === 1 && line.trim().length > 2) bugs.push({ type: 'mismatched-bold', line: n })
  })
  return bugs
}

// ─── MDX discovery (mirrors lib/content.ts walk) ─────────────────────────────
function collectArticles(categoryDir, parts) {
  const out = []
  if (!existsSync(categoryDir)) return out
  for (const entry of readdirSync(categoryDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    const mdxPath = join(categoryDir, entry.name, `${entry.name}.mdx`)
    if (existsSync(mdxPath)) {
      out.push({ path: mdxPath, slugParts: [...parts, entry.name], slug: entry.name })
    } else {
      out.push(...collectArticles(join(categoryDir, entry.name), [...parts, entry.name]))
    }
  }
  return out
}

// ─── WP fetch with disk cache ────────────────────────────────────────────────
let USERS = null
async function loadUsers() {
  if (USERS) return USERS
  const cachePath = join(CACHE_DIR, '_users.json')
  if (!NO_CACHE && existsSync(cachePath)) {
    USERS = JSON.parse(readFileSync(cachePath, 'utf8'))
    return USERS
  }
  try {
    const list = await fetchJson(`${WP_BASE}/users?per_page=100&_fields=id,name`)
    USERS = Object.fromEntries((Array.isArray(list) ? list : []).map(u => [u.id, u.name]))
  } catch { USERS = {} }
  writeFileSync(cachePath, JSON.stringify(USERS, null, 2))
  return USERS
}
async function fetchWpPost(slug) {
  const cachePath = join(CACHE_DIR, `${slug}.json`)
  if (!NO_CACHE && existsSync(cachePath)) return JSON.parse(readFileSync(cachePath, 'utf8'))
  const url = `${WP_BASE}/posts?slug=${encodeURIComponent(slug)}&_fields=id,slug,title,date,modified,excerpt,author,content,link`
  const arr = await fetchJson(url)
  const post = Array.isArray(arr) ? arr[0] : null
  writeFileSync(cachePath, JSON.stringify(post ?? null, null, 2))
  return post
}

function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') }
// WP anchors that wrap an image: <a href="X"> … <img src="Y"> … </a> → {href, src}.
// Used to detect embeds the migration "flattened" into plain text links.
function extractWpLinkedImages(html) {
  const out = []
  for (const m of html.matchAll(/<a\b[^>]*\bhref=["']([^"']+)["'][^>]*>\s*(?:<picture\b[^>]*>\s*)?(?:<source\b[^>]*>\s*)*<img\b[^>]*\bsrc=["']([^"']+)["']/gi)) out.push({ href: m[1], src: m[2] })
  return out
}

// ─── Audit one article ───────────────────────────────────────────────────────
async function auditArticle(item, users) {
  const raw = readFileSync(item.path, 'utf8')
  const { data: fm, content: body } = matter(raw)

  const wp = await fetchWpPost(item.slug)
  const rel = item.path.replace(ROOT + '/', '')

  if (!wp) {
    return { slug: item.slug, path: rel, vercelUrl: vercelUrlFor(item.slugParts), datePublished: fm.date_published || '', wpFound: false, findings: [] }
  }

  const wpHtml = wp.content?.rendered || ''
  const wpImages = extractWpImages(wpHtml)
  const wpCaptions = extractWpCaptions(wpHtml)
  const wpWords = wordCount(stripShortcodes(stripTags(wpHtml)))
  const wpTitle = decode(wp.title?.rendered || '')
  const wpDate = (wp.date || '').slice(0, 10)
  const wpAuthor = users[wp.author] || ''

  const mdxBodyImages = extractMdxBodyImages(body)
  const mdxKeys = new Set([...mdxBodyImages.map(imgKey), ...frontmatterImageKeys(fm)])
  const mdxWords = mdxPlainWordCount(body)
  const bugs = findMarkdownBugs(body)

  const findings = []

  // 1. IMAGES — compare body-image COUNTS, not filenames. The migration renamed
  // images to clean local names (e.g. Kerrie-Simone.jpg → simone-aspinall.jpg),
  // so filename matching gives false positives. Flag only a genuine deficit:
  // when WP has more body images (deduped) than the MDX references.
  const wpDeduped = []
  const seenWp = new Set()
  for (const img of wpImages) {
    const k = imgKey(img.src)
    if (seenWp.has(k)) continue
    seenWp.add(k)
    wpDeduped.push(img)
  }
  const imgDeficit = wpDeduped.length - mdxBodyImages.length
  if (imgDeficit > 0) {
    // List WP images with no filename match as the likely-missing candidates.
    const candidates = wpDeduped.filter(img => !mdxKeys.has(imgKey(img.src)))
    findings.push({
      type: 'IMAGES', severity: 'high',
      summary: `WP has ${imgDeficit} more body image(s) than MDX (WP ${wpDeduped.length} vs MDX ${mdxBodyImages.length}) — likely missing`,
      detail: (candidates.length ? candidates : wpDeduped).map(i => ({ src: i.src, alt: i.alt })),
    })
  }

  // 1b. FLATTENED — WP wrapped an image in a link (<a href><img></a>); the
  // migration kept only the link as plain text (e.g. [@handle](instagram)) and
  // dropped the image. Detect: WP image-link href that appears in the MDX as a
  // plain [text](href) link but NOT as an image link [![..](..)](href).
  // Flag a link as flattened only when the SPECIFIC image WP wrapped is actually
  // absent from the MDX. Otherwise it's a normal inline prose link that WP merely
  // happened to wrap an image in, and the image is present elsewhere — a false
  // positive (e.g. shop links in a roundup whose images survived migration).
  const flattened = []
  const seenFlat = new Set()
  for (const { href, src } of extractWpLinkedImages(wpHtml)) {
    if (mdxKeys.has(imgKey(src))) continue                                // image present → not dropped
    if (seenFlat.has(href)) continue
    const h = escapeRe(href)
    const hasImageLink = new RegExp(`\\)\\]\\(${h}\\)`).test(body)        // [![alt](src)](href)
    const hasPlainLink = new RegExp(`\\[[^\\]]*\\]\\(${h}\\)`).test(body) // [text](href)
    if (!hasImageLink && hasPlainLink) { seenFlat.add(href); flattened.push(href) }
  }
  if (flattened.length) {
    findings.push({
      type: 'FLATTENED', severity: 'high',
      summary: `${flattened.length} image embed(s) flattened to a plain text link (image dropped in migration)`,
      detail: flattened.map(href => ({ href })),
    })
  }

  // 2. TEXT — material truncation
  const deficit = wpWords - mdxWords
  if (wpWords > 0 && deficit >= TEXT_ABS_THRESHOLD && deficit / wpWords >= TEXT_PCT_THRESHOLD) {
    findings.push({
      type: 'TEXT', severity: 'high',
      summary: `MDX shorter than WP by ${deficit} words (WP ${wpWords} vs MDX ${mdxWords}, ${Math.round(100 * deficit / wpWords)}% missing)`,
    })
  }

  // 3. MARKDOWN — delimiter bugs
  if (bugs.length) {
    const byType = {}
    for (const b of bugs) byType[b.type] = (byType[b.type] || 0) + 1
    findings.push({
      type: 'MARKDOWN', severity: 'medium',
      summary: Object.entries(byType).map(([t, c]) => `${t}×${c}`).join(', '),
      detail: bugs.slice(0, 25),
    })
  }

  // 4. META — title / author / date
  const meta = []
  if (wpTitle && fm.title && norm(wpTitle) !== norm(fm.title)) meta.push({ field: 'title', wp: wpTitle, mdx: fm.title })
  if (wpAuthor && fm.author && norm(wpAuthor) !== norm(fm.author)) meta.push({ field: 'author', wp: wpAuthor, mdx: fm.author })
  if (wpDate && fm.date_published && wpDate !== String(fm.date_published).slice(0, 10)) meta.push({ field: 'date_published', wp: wpDate, mdx: String(fm.date_published).slice(0, 10) })
  if (meta.length) {
    findings.push({ type: 'META', severity: 'medium', summary: meta.map(m => m.field).join(', '), detail: meta })
  }

  return {
    slug: item.slug, path: rel, vercelUrl: vercelUrlFor(item.slugParts), link: wp.link, wpFound: true,
    datePublished: fm.date_published || wpDate,
    stats: { wpWords, mdxWords, wpImages: wpDeduped.length, mdxImages: mdxBodyImages.length, wpCaptions: wpCaptions.length },
    findings,
  }
}
// Normalise for comparison: decode entities, fold typographic dashes/quotes to
// ASCII so en-dash↔hyphen and curly↔straight quotes don't flag as mismatches.
function norm(s) {
  return decode(String(s))
    .replace(/[‒–—―]/g, '-')   // –—‒― → -
    .replace(/[‘’ʼ′`]/g, "'")  // ‘’ʼ′` → '
    .replace(/[“”″]/g, '"')         // “”″ → "
    .replace(/…/g, '...')                      // … → ...
    .replace(/\s+/g, ' ').trim().toLowerCase()
}

// ─── Report rendering ────────────────────────────────────────────────────────
function severityRank(r) {
  if (r.findings.some(f => f.severity === 'high')) return 0
  if (r.findings.some(f => f.severity === 'medium')) return 1
  return 2
}
function renderMarkdown(category, results) {
  const flagged = results.filter(r => r.findings.length)
  const clean = results.filter(r => r.wpFound && !r.findings.length)
  const notFound = results.filter(r => !r.wpFound)
  const lines = []
  lines.push(`# WP ↔ Vercel audit — \`${category}\` (latest ${results.length})`)
  lines.push('')
  lines.push(`- ⚠️  ${flagged.length} article(s) with inconsistencies`)
  lines.push(`- ✅ ${clean.length} clean`)
  lines.push(`- ❓ ${notFound.length} not found on WP (likely written post-migration)`)
  lines.push('')
  for (const r of flagged) {
    lines.push(`## ${r.slug}`)
    lines.push(`- 🔗 **[Open on Vercel ↗](${r.vercelUrl})**`)
    if (r.link) lines.push(`- 📰 [Compare on WordPress ↗](${r.link})`)
    lines.push(`- 📄 MDX: \`${r.path}\``)
    if (r.stats) lines.push(`- words WP/MDX: ${r.stats.wpWords}/${r.stats.mdxWords} · images WP/MDX: ${r.stats.wpImages}/${r.stats.mdxImages}`)
    lines.push('')
    for (const f of r.findings) {
      lines.push(`- **${f.type}** (${f.severity}): ${f.summary}`)
      if (f.type === 'IMAGES') for (const d of f.detail) lines.push(`    - ${d.src}${d.alt ? `  _(alt: ${d.alt})_` : ''}`)
      if (f.type === 'FLATTENED') for (const d of f.detail) lines.push(`    - linked to: ${d.href}`)
      if (f.type === 'META') for (const d of f.detail) lines.push(`    - ${d.field}: WP \`${d.wp}\` ≠ MDX \`${d.mdx}\``)
    }
    lines.push('')
  }
  if (clean.length) { lines.push('## ✅ Clean'); for (const r of clean) lines.push(`- [${r.slug} ↗](${r.vercelUrl})`); lines.push('') }
  if (notFound.length) { lines.push('## ❓ Not found on WP'); for (const r of notFound) lines.push(`- [${r.slug} ↗](${r.vercelUrl})`); lines.push('') }
  return lines.join('\n')
}

// ─── Main ────────────────────────────────────────────────────────────────────
async function main() {
  mkdirSync(CACHE_DIR, { recursive: true })
  mkdirSync(REPORT_DIR, { recursive: true })

  let articles = collectArticles(join(CONTENT_DIR, CATEGORY), [CATEGORY])
  if (ONLY_SLUG) articles = articles.filter(a => a.slug === ONLY_SLUG)

  // Sort newest-first by date_published, then take the latest N
  articles = articles
    .map(a => {
      const { data } = matter(readFileSync(a.path, 'utf8'))
      return { ...a, date: String(data.date_published || '') }
    })
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
    .slice(0, ONLY_SLUG ? undefined : LIMIT)

  console.log(`Auditing ${articles.length} article(s) in "${CATEGORY}"…\n`)

  const users = await loadUsers()
  const results = []
  for (const a of articles) {
    process.stdout.write(`  ${a.slug} … `)
    try {
      const r = await auditArticle(a, users)
      results.push(r)
      const n = r.findings.length
      console.log(r.wpFound ? (n ? `⚠️  ${n} issue(s)` : '✅ clean') : '❓ not on WP')
    } catch (e) {
      console.log(`ERROR: ${e.message}`)
      results.push({ slug: a.slug, path: a.path.replace(ROOT + '/', ''), vercelUrl: vercelUrlFor(a.slugParts), wpFound: false, error: e.message, findings: [] })
    }
  }

  results.sort((x, y) => severityRank(x) - severityRank(y))

  const jsonPath = join(REPORT_DIR, `${CATEGORY}.json`)
  const mdPath = join(REPORT_DIR, `${CATEGORY}.md`)
  writeFileSync(jsonPath, JSON.stringify({ category: CATEGORY, generated: new Date().toISOString(), results }, null, 2))
  writeFileSync(mdPath, renderMarkdown(CATEGORY, results))

  const flagged = results.filter(r => r.findings.length).length
  console.log(`\n${flagged} flagged / ${results.length} audited`)
  console.log(`Report: ${mdPath.replace(ROOT + '/', '')}`)
  console.log(`JSON:   ${jsonPath.replace(ROOT + '/', '')}`)
}

main().catch(e => { console.error(e); process.exit(1) })
