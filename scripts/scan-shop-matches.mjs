#!/usr/bin/env node
/**
 * scan-shop-matches.mjs — find products mentioned in articles that we actually
 * stock on beauticate.shop, so they can be converted from affiliate → own-shop.
 *
 * Reads the full Shopify catalogue (paginated) and scans every content/**.mdx for
 * product references (ShopItem name/url, markdown product links). For each, if the
 * brand matches a shop vendor it reports the best-matching shop product + handle.
 *
 * Output: a per-article worklist. Review before applying. Does not modify anything.
 */
import { readFileSync, readdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

// ── env (.env.local wins) ────────────────────────────────────────────────────
function env(key) {
  for (const f of ['.env.local', '.env']) {
    const p = join(ROOT, f); if (!existsSync(p)) continue
    for (const line of readFileSync(p, 'utf8').split('\n')) {
      const m = line.match(new RegExp(`^${key}=(.*)$`))
      if (m) return m[1].trim().replace(/^["']|["']$/g, '')
    }
  }
}
const DOMAIN = env('NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN')
const TOKEN = env('SHOPIFY_STOREFRONT_PRIVATE_TOKEN')

// ── fetch full catalogue (paginated) ─────────────────────────────────────────
async function catalogue() {
  const out = []; let after = null
  for (let page = 0; page < 20; page++) {
    const q = `{ products(first: 250${after ? `, after: "${after}"` : ''}) { pageInfo { hasNextPage endCursor } nodes { vendor title handle productType } } }`
    const res = await fetch(`https://${DOMAIN}/api/2024-10/graphql.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Shopify-Storefront-Private-Token': TOKEN },
      body: JSON.stringify({ query: q }),
    })
    const j = await res.json()
    const conn = j?.data?.products; if (!conn) { console.error('Shopify error', JSON.stringify(j).slice(0, 300)); break }
    out.push(...conn.nodes)
    if (!conn.pageInfo.hasNextPage) break
    after = conn.pageInfo.endCursor
  }
  return out
}

const norm = s => (s || '').toLowerCase().replace(/&amp;/g, '&').replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim()
const tokens = s => new Set(norm(s).split(' ').filter(w => w.length > 2))

// ── walk MDX files ───────────────────────────────────────────────────────────
function mdxFiles(dir, acc = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name)
    if (e.isDirectory()) mdxFiles(p, acc)
    else if (e.name.endsWith('.mdx')) acc.push(p)
  }
  return acc
}

const main = async () => {
  const cat = await catalogue()
  console.log(`Shopify catalogue: ${cat.length} products\n`)
  // vendor -> products; only vendors with a usable (>=4 char) name
  // Vendors that create noise rather than product conversions (house brand,
  // discount codes, generic words). Skip them.
  const SKIP = new Set(['beauticate'])
  const byVendor = new Map()
  for (const p of cat) {
    const v = norm(p.vendor); if (v.length < 4 || SKIP.has(v)) continue
    if (!byVendor.has(v)) byVendor.set(v, [])
    byVendor.get(v).push(p)
  }
  const vendors = [...byVendor.keys()]

  const files = mdxFiles(join(ROOT, 'content'))
  let totalHits = 0
  const report = []

  for (const f of files) {
    const src = readFileSync(f, 'utf8')
    // candidate product references: ShopItem name + markdown link text (with external href)
    const cands = []
    for (const m of src.matchAll(/<ShopItem\b[^>]*?name="([^"]+)"[^>]*?(?:url="([^"]+)"|handle="([^"]+)")?[^>]*>/g)) {
      if (m[3]) continue // already own-shop (handle)
      cands.push({ text: m[1], url: m[2] || '', kind: 'card' })
    }
    for (const m of src.matchAll(/\[([^\]]{3,80})\]\((https?:\/\/[^)]+)\)/g)) {
      cands.push({ text: m[1].replace(/\*\*/g, '').trim(), url: m[2], kind: 'link' })
    }

    const hits = []
    const seen = new Set()
    for (const c of cands) {
      if (/\/shop\/products\//.test(c.url)) continue
      const nt = norm(c.text)
      const vendor = vendors.find(v => nt.includes(v))
      if (!vendor) continue
      // best product match within vendor by token overlap (excluding the brand
      // tokens themselves, so the match reflects the *product*, not the brand)
      const vt = tokens(vendor)
      const ct = new Set([...tokens(c.text)].filter(t => !vt.has(t)))
      let best = null, bestScore = 0
      for (const p of byVendor.get(vendor)) {
        const pt = new Set([...tokens(p.title)].filter(t => !vt.has(t)))
        let s = 0; for (const t of ct) if (pt.has(t)) s++
        if (s > bestScore) { bestScore = s; best = p }
      }
      // confident only when most of the product words line up
      const ratio = ct.size ? bestScore / ct.size : 0
      const confident = bestScore >= 2 && ratio >= 0.5
      const key = vendor + '|' + nt
      if (seen.has(key)) continue; seen.add(key)
      hits.push({ text: c.text, kind: c.kind, vendorMatch: vendor, suggest: best, confident })
    }
    if (hits.length) {
      report.push({ file: f.replace(ROOT + '/', ''), hits })
      totalHits += hits.length
    }
  }

  report.sort((a, b) => b.hits.length - a.hits.length)
  const confidentCount = report.reduce((n, r) => n + r.hits.filter(h => h.confident).length, 0)

  const lines = []
  lines.push(`# Shop-match worklist`)
  lines.push(`Catalogue: ${cat.length} products. ${report.length} articles mention a brand we stock (${totalHits} references; ${confidentCount} with a confident exact-product match).`)
  lines.push(`\nMATCH = likely the exact product (swap to \`handle="..."\`). VERIFY = we stock the brand but confirm the exact product first.\n`)
  for (const r of report) {
    lines.push(`\n## ${r.file}`)
    for (const h of r.hits) {
      if (h.confident && h.suggest) {
        lines.push(`- **MATCH** "${h.text}" → ${h.suggest.title}  \`handle="${h.suggest.handle}"\``)
      } else {
        const hint = h.suggest ? ` (closest: ${h.suggest.title} \`${h.suggest.handle}\`)` : ''
        lines.push(`- VERIFY "${h.text}" — we stock **${h.vendorMatch}**${hint}`)
      }
    }
  }
  const outPath = join(ROOT, 'qa', 'shop-match-report.md')
  const { writeFileSync, mkdirSync } = await import('fs')
  mkdirSync(join(ROOT, 'qa'), { recursive: true })
  writeFileSync(outPath, lines.join('\n'))
  console.log(`Catalogue: ${cat.length} products`)
  console.log(`${report.length} articles mention a stocked brand; ${confidentCount} confident exact-product matches.`)
  console.log(`Report written: qa/shop-match-report.md`)
}
main()
