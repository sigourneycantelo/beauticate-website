#!/usr/bin/env node
/**
 * TGA / AHPRA content audit for the article archive.
 *
 * Flags passages where a RESTRICTED GOOD (supplement, ingestible, patch,
 * therapeutic device, therapeutic sunscreen) appears close to language that
 * the Therapeutic Goods Advertising Code restricts:
 *
 *   TESTIMONIAL   first-person claim of using it
 *   THIRD_PARTY   someone else's account of using it
 *   PRACTITIONER  a health professional's view about it
 *   CLAIM         treat / cure / prevent / heal style efficacy language
 *   SERIOUS       a serious disease named alongside it
 *
 * Rationale and sources: docs/ask-sig-compliance.md
 *
 * This is deliberately HIGH RECALL. It over-flags on purpose — a false
 * positive costs someone ten seconds, a false negative stays on the site and
 * (per the TGA) may count as a fresh contravention every day it is up. Every
 * hit needs a human read. Nothing here is a legal determination.
 *
 * Usage:
 *   node scripts/audit-testimonials.mjs                 # full archive
 *   node scripts/audit-testimonials.mjs --limit 50      # first 50 articles
 *   node scripts/audit-testimonials.mjs --since 2024    # date_published >= 2024
 */

import fs from 'fs'
import path from 'path'

const ROOT = path.join(process.cwd(), 'content')
const OUT_DIR = path.join(process.cwd(), 'docs', 'audit')

// How close a restricted-good mention has to be to a trigger phrase, in
// characters, before we treat them as related. Roughly a long sentence.
const WINDOW = 240

const RESTRICTED = new RegExp(
  [
    'collagen', 'supplement', 'vitamin\\s?[a-dk]?\\b', 'multivitamin', 'probiotic',
    'prebiotic', 'magnesium', 'zinc', 'omega[\\s-]?3', 'fish oil', 'ashwagandha',
    'adaptogen', 'lion\'?s mane', 'cordyceps', 'reishi', 'chaga', 'medicinal mushroom',
    'mushroom (?:coffee|powder|blend)', 'electrolyte', 'hydration sachet',
    'wellness patch', 'transdermal', 'led (?:mask|device|therapy)', 'red light therapy',
    'light therapy', 'infrared', 'spf\\s?\\d+', 'sunscreen', 'sunblock',
    'greens powder', 'protein powder', 'capsule', 'tincture', 'elixir', 'tonic',
    'gummies', 'lozenge', 'sachet',
  ].join('|'),
  'gi'
)

const TRIGGERS = [
  {
    kind: 'TESTIMONIAL',
    severity: 1,
    re: new RegExp(
      [
        "\\bI (?:take|took|drink|drank|swallow|swear by|rely on|reach for)\\b",
        "\\bI(?:'ve| have) been (?:taking|using|drinking|on)\\b",
        "\\bI(?:'ve| have) (?:taken|used|been using)\\b",
        "\\bI started (?:taking|using|on)\\b",
        "\\bI use\\b", "\\bI'm using\\b", "\\bI am using\\b",
        "\\bmy go[\\s-]?to\\b", "\\bI never travel without\\b",
        "\\bevery (?:morning|night|day) I\\b",
        // Added after a manual read found these in live articles that the
        // first pass scored clean. Personal use has more shapes than "I take".
        "\\bI (?:stir|add|added|rotate|pop|swear|trust|love|swapped?)\\b",
        "\\bI(?:'ve| have) (?:been )?(?:trialling|trialing|testing|added|loved)\\b",
        "\\bI(?:'m| am) (?:testing|trialling|trialing|loving)\\b",
        "\\bmy (?:current )?(?:favourite|favorite|hero|pick)\\b",
        "\\bI keep coming back to\\b", "\\bthe ones I trust\\b",
        "\\bI(?:'ve| have) used\\b", "\\bI rely on\\b",
        "\\bit changed my\\b", "\\bchanged my (?:skin|life|energy|gut|sleep)\\b",
        "\\bI noticed (?:a |the )?difference\\b",
        "\\bworked for me\\b", "\\bI felt (?:better|amazing|calmer|clearer)\\b",
        "\\bsince (?:taking|starting)\\b",
      ].join('|'),
      'gi'
    ),
  },
  {
    kind: 'THIRD_PARTY',
    severity: 2,
    re: new RegExp(
      [
        "\\b(?:she|he|they) (?:swears?|swore|raves?|raved) by\\b",
        "\\b(?:she|he|they) (?:takes?|took|uses?|used|drinks?)\\b",
        "\\breaders? (?:love|swear by|rave)\\b",
        "\\bcustomers? (?:love|swear by|report)\\b",
        "\\breview(?:s|ers)? (?:say|said|rave)\\b",
        "\\bmy (?:mum|mother|sister|husband|friend|daughter) (?:takes?|uses?|swears)\\b",
      ].join('|'),
      'gi'
    ),
  },
  {
    kind: 'PRACTITIONER',
    severity: 1,
    re: new RegExp(
      [
        "\\bDr\\.?\\s+[A-Z]", "\\bdermatologist\\b", "\\bnutritionist\\b",
        "\\bnaturopath\\b", "\\bdietitian\\b", "\\bdietician\\b",
        "\\bgeneral practitioner\\b", "\\bmy GP\\b", "\\bpharmacist\\b",
        "\\bendocrinologist\\b", "\\bgynaecologist\\b", "\\bimmunologist\\b",
        "\\bresearcher\\b", "\\bprofessor\\b", "\\bclinician\\b",
        "\\bmedical (?:doctor|expert|professional)\\b",
      ].join('|'),
      'gi'
    ),
  },
  {
    kind: 'CLAIM',
    severity: 1,
    re: new RegExp(
      [
        "\\b(?:treats?|treating|cures?|curing|heals?|healing|prevents?|preventing)\\b",
        "\\b(?:reverses?|reversing|eliminates?|eradicates?)\\b",
        "\\bclears? (?:up )?(?:your |the )?(?:skin|acne|breakouts?)\\b",
        "\\bboosts? (?:your )?immun(?:ity|e)\\b",
        "\\b(?:reduces?|reducing) inflammation\\b", "\\banti[\\s-]?inflammatory\\b",
        "\\bbalances? (?:your )?hormones?\\b",
        "\\bclinically proven\\b", "\\bscientifically proven\\b",
        "\\bstudies show\\b", "\\bresearch (?:shows|proves)\\b",
        "\\bfixes?\\b", "\\bgets? rid of\\b",
        // "kills acne-causing bacteria" shipped live and the first pass missed
        // it, which is why these are here.
        "\\bkills?\\b", "\\bfight(?:s|ing)? (?:a )?(?:breakout|acne|infection)\\b",
        "\\btargets? (?:breakouts?|acne|pigmentation)\\b",
        "\\bclinic[\\s-]?grade\\b", "\\bmedical[\\s-]?grade\\b",
        "\\bprofessional results\\b", "\\bdoes more for\\b",
        "\\bstimulates? collagen\\b", "\\bboosts? collagen\\b",
      ].join('|'),
      'gi'
    ),
  },
  {
    // Not itself a breach, but decisive: receiving valuable consideration makes
    // the person "engaged in marketing or supply", which turns any nearby
    // testimonial from questionable into prohibited.
    kind: 'CONSIDERATION',
    severity: 2,
    re: new RegExp(
      [
        '\\bcode [A-Z0-9]{4,}\\b', '\\buse (?:my |the )?code\\b',
        '\\bper cent off\\b', '\\b\\d+% off\\b', '\\bdiscount code\\b',
        '\\baffiliate\\b', '\\bgifted\\b', '\\bPR sample\\b', '\\bc\\/o\\b',
        '\\bsca_ref=', '\\bsjv\\.io\\b', '\\bpaid partnership\\b',
      ].join('|'),
      'gi'
    ),
  },
  {
    kind: 'SERIOUS',
    severity: 1,
    re: new RegExp(
      [
        '\\bcancer\\b', '\\bdiabet(?:es|ic)\\b', '\\bautoimmune\\b', '\\bthyroid\\b',
        '\\barthritis\\b', '\\bosteoporosis\\b', '\\bheart disease\\b',
        '\\bhypertension\\b', '\\bdepression\\b', '\\binfertility\\b',
        '\\bPCOS\\b', '\\bendometriosis\\b', '\\bpsoriasis\\b', '\\beczema\\b',
        '\\brosacea\\b', '\\balopecia\\b', '\\bdementia\\b', "\\bAlzheimer",
      ].join('|'),
      'gi'
    ),
  },
]

/**
 * Brands we actually sell. A use-claim about one of these is the highest-risk
 * kind of finding, because merchant-of-record status is precisely what makes
 * Beauticate a person "engaged in the supply" of the good.
 */
function shopVendors() {
  try {
    const idx = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', 'chat-index.json'), 'utf-8'))
    return [...new Set((idx.products || []).map(p => p.vendor).filter(v => v && v.length > 3))]
  } catch {
    return []
  }
}
const VENDORS = shopVendors()
const VENDOR_RE = VENDORS.length
  ? new RegExp(VENDORS.map(v => v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'i')
  : null

/**
 * "Vitamin C", "tonic" and similar are ambiguous: ingested they are listed
 * medicines, applied to the face they are ordinary cosmetics and out of scope
 * entirely. If the surrounding text reads topical, drop the hit.
 */
/**
 * Referring someone to a professional is the compliant behaviour, not a breach.
 * Without this, the remediation ("that is one for your GP or dermatologist")
 * flags itself and people learn to ignore the PRACTITIONER category.
 */
const REFERRAL = /(?:one for|speak (?:with|to)|talk to|see|check with|ask|consult|conversation with)\s+(?:your|a|an)\s+(?:own\s+)?(?:GP|doctor|derm|pharmacist|professional|specialist|practitioner)/i

function isReferralContext(body, at) {
  return REFERRAL.test(body.slice(Math.max(0, at - 60), at + 60))
}

const AMBIGUOUS = /vitamin|tonic|elixir|collagen/i
const TOPICAL = /serum|cream|moisturis|cleanser|toner|lotion|balm|oil\b|apply|applied|topical|face mask|sheet mask|spf|smooth(?:ed)? (?:on|over)|rub/i

function isTopicalContext(body, at, term) {
  if (!AMBIGUOUS.test(term)) return false
  return TOPICAL.test(body.slice(Math.max(0, at - 80), at + 80))
}

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(p, out)
    else if (entry.name.endsWith('.mdx')) out.push(p)
  }
  return out
}

function parse(file) {
  const raw = fs.readFileSync(file, 'utf-8')
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?/)
  const front = m ? m[1] : ''
  const body = m ? raw.slice(m[0].length) : raw
  const get = k => (front.match(new RegExp(`^${k}:\\s*["']?(.+?)["']?\\s*$`, 'm')) || [])[1] || ''
  return { front, body, offset: m ? m[0].length : 0, raw, title: get('title'), date: get('date_published'), author: get('author') }
}

function lineOf(raw, index) {
  return raw.slice(0, index).split('\n').length
}

function snippet(body, index, len) {
  const start = Math.max(0, index - 90)
  const end = Math.min(body.length, index + len + 90)
  return (start > 0 ? '…' : '') + body.slice(start, end).replace(/\s+/g, ' ').trim() + (end < body.length ? '…' : '')
}

const args = process.argv.slice(2)
const limit = Number((args.find(a => a.startsWith('--limit')) || '').split(/[= ]/)[1] || 0)
  || (args.includes('--limit') ? Number(args[args.indexOf('--limit') + 1]) : 0)
const since = (args.includes('--since') ? args[args.indexOf('--since') + 1] : '')

let files = walk(ROOT)
const findings = []
let scanned = 0

for (const file of files) {
  const doc = parse(file)
  if (since && doc.date && doc.date < since) continue
  if (limit && scanned >= limit) break
  scanned++

  // Frontmatter is scanned too. It carries excerpt, meta_description, image alt
  // text and the FAQ pairs that become schema.org markup in search results, and
  // a testimonial there reaches more people than one buried in the body. The
  // first version of this script stripped frontmatter and missed a live FAQ
  // answering "does red light therapy actually work" with felt benefits.
  const zones = [
    { name: 'frontmatter', text: doc.front, base: 4 },
    { name: 'body', text: doc.body, base: doc.offset },
  ]

  for (const zone of zones) {
    if (!zone.text) continue
    const goods = [...zone.text.matchAll(RESTRICTED)].map(m => ({ term: m[0], at: m.index }))
    if (goods.length === 0) continue

    for (const trig of TRIGGERS) {
      for (const t of zone.text.matchAll(trig.re)) {
        if (trig.kind === 'PRACTITIONER' && isReferralContext(zone.text, t.index)) continue
        const near = goods.find(
          g => Math.abs(g.at - t.index) <= WINDOW && !isTopicalContext(zone.text, g.at, g.term)
        )
        if (!near) continue

        const around = zone.text.slice(Math.max(0, t.index - WINDOW), t.index + WINDOW)
        const vendorHit = VENDOR_RE ? (around.match(VENDOR_RE) || [])[0] : undefined

        findings.push({
          kind: trig.kind,
          zone: zone.name,
          confidence: vendorHit ? 'HIGH' : 'REVIEW',
          vendor: vendorHit || '',
          // Frontmatter reaches search results, so weight it above body copy.
          severity: (vendorHit ? trig.severity : trig.severity + 10) - (zone.name === 'frontmatter' ? 0.5 : 0),
          file: path.relative(process.cwd(), file),
          line: lineOf(doc.raw, zone.base + t.index),
          title: doc.title,
          date: doc.date,
          author: doc.author,
          good: near.term,
          matched: t[0],
          snippet: snippet(zone.text, t.index, t[0].length),
        })
      }
    }
  }
}

// One finding per file+kind is enough to send someone to the article; keep the
// first, count the rest, so the report stays readable.
const grouped = new Map()
for (const f of findings) {
  const key = `${f.file}::${f.zone}::${f.kind}::${f.matched.toLowerCase()}`
  if (!grouped.has(key)) grouped.set(key, { ...f, repeats: 0 })
  else grouped.get(key).repeats++
}
const rows = [...grouped.values()].sort(
  (a, b) => a.severity - b.severity || a.kind.localeCompare(b.kind) || b.repeats - a.repeats
)

fs.mkdirSync(OUT_DIR, { recursive: true })

const csv = ['confidence,zone,kind,file,line,date,author,shop_vendor,restricted_term,matched,repeats,title']
  .concat(rows.map(r => [r.confidence, r.zone, r.kind, r.file, r.line, r.date, r.author, r.vendor, r.good, r.matched, r.repeats, r.title]
    .map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')))
  .join('\n')
fs.writeFileSync(path.join(OUT_DIR, 'testimonial-audit.csv'), csv)

const byKind = {}
for (const r of rows) byKind[r.kind] = (byKind[r.kind] || 0) + 1
const high = rows.filter(r => r.confidence === 'HIGH')
const highAffected = new Set(high.map(r => r.file)).size
const affected = new Set(rows.map(r => r.file)).size

const md = [
  '# TGA / AHPRA content audit',
  '',
  '> Generated by `scripts/audit-testimonials.mjs`. High recall by design — every',
  '> row needs a human read, and nothing here is a legal determination. Rules and',
  '> sources: [`docs/ask-sig-compliance.md`](../ask-sig-compliance.md).',
  '',
  `- Articles scanned: **${scanned}**`,
  `- Articles with at least one flag: **${affected}**`,
  `- Total flags (deduped per file+kind): **${rows.length}**`,
  `- **HIGH confidence (a brand we stock is named in the same passage): ${high.length} flags across ${highAffected} articles** — fix these first.`,
  '',
  '| Kind | Count | What it means |',
  '| --- | --- | --- |',
  `| TESTIMONIAL | ${byKind.TESTIMONIAL || 0} | First-person use of a restricted good. Prohibited outright for Beauticate. |`,
  `| PRACTITIONER | ${byKind.PRACTITIONER || 0} | A health professional's view near a restricted good. Prohibited source. |`,
  `| CLAIM | ${byKind.CLAIM || 0} | Treat / cure / prevent / proven language near a restricted good. |`,
  `| SERIOUS | ${byKind.SERIOUS || 0} | A serious condition named near a restricted good. |`,
  `| THIRD_PARTY | ${byKind.THIRD_PARTY || 0} | Someone else's use account. Beauticate owns any testimonial it publishes. |`,
  `| CONSIDERATION | ${byKind.CONSIDERATION || 0} | Discount code, affiliate link or gifting near a restricted good. Not a breach alone, but it makes any nearby testimonial prohibited. |`,
  '',
  '## Findings',
  '',
]
for (const r of rows) {
  md.push(`### [${r.confidence}] ${r.kind} (${r.zone}) — ${r.title || path.basename(r.file)}`)
  md.push(`\`${r.file}:${r.line}\`${r.date ? ` · ${r.date}` : ''}${r.author ? ` · ${r.author}` : ''}${r.repeats ? ` · +${r.repeats} more in file` : ''}`)
  md.push('')
  md.push(`Restricted term: **${r.good}** · matched: **${r.matched}**${r.vendor ? ` · shop brand: **${r.vendor}**` : ''}`)
  md.push('')
  md.push(`> ${r.snippet}`)
  md.push('')
}
fs.writeFileSync(path.join(OUT_DIR, 'testimonial-audit.md'), md.join('\n'))

console.log(`Scanned ${scanned} articles`)
console.log(`Flagged ${rows.length} passages across ${affected} articles`)
console.log(`  HIGH confidence (names a brand we stock): ${high.length} across ${highAffected} articles`)
for (const [k, v] of Object.entries(byKind).sort((a, b) => b[1] - a[1])) console.log(`  ${k}: ${v}`)
console.log(`\n→ docs/audit/testimonial-audit.md`)
console.log(`→ docs/audit/testimonial-audit.csv`)
