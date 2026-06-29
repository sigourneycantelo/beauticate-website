#!/usr/bin/env node
/**
 * cards-listicle.mjs <mdxPath> [--apply]
 * Listicle conversion: each product is a heading paragraph followed by a linked
 * product image `[![name](img)](url)`. Turn the image into a floated
 * <ProductInset> on the preceding heading paragraph (alternating sides) and drop
 * the standalone image line. Dry-run by default.
 */
import { readFileSync, writeFileSync } from 'fs'

const file = process.argv[2]
const APPLY = process.argv.includes('--apply')
if (!file) { console.error('usage: cards-listicle.mjs <mdxPath> [--apply]'); process.exit(1) }

const RETAILER = url => {
  const u = url.toLowerCase()
  if (/amazon\./.test(u)) return 'Amazon'
  if (/mecca\.com/.test(u)) return 'Mecca'
  if (/sephora\./.test(u)) return 'Sephora'
  if (/adorebeauty/.test(u)) return 'Adore Beauty'
  if (/net-a-porter/.test(u)) return 'Net-a-Porter'
  if (/cultbeauty/.test(u)) return 'Cult Beauty'
  return '' // shortener / skim link — retailer hidden
}
const esc = s => s.replace(/"/g, '&quot;')

const raw = readFileSync(file, 'utf8')
const fm = raw.match(/^---\n[\s\S]*?\n---\n/)
const front = fm ? fm[0] : ''
const body = fm ? raw.slice(front.length) : raw
const blocks = body.split(/\n\n+/)
const IMG = /^\[!\[([^\]]*)\]\(([^)]+)\)\]\(([^)]+)\)\s*$/

let side = 'left', count = 0
const out = []
for (let i = 0; i < blocks.length; i++) {
  const m = blocks[i].match(IMG)
  if (m && out.length) {
    const [, name, img, url] = m
    const retailer = RETAILER(url)
    const tag = `<ProductInset image="${esc(img)}" name="${esc(name.trim())}" url="${esc(url)}"${retailer ? ` retailer="${retailer}"` : ''} side="${side}" />`
    out[out.length - 1] = tag + '\n\n' + out[out.length - 1] // float beside the preceding heading
    side = side === 'left' ? 'right' : 'left'
    count++
    continue // drop the standalone image block
  }
  out.push(blocks[i])
}

const result = front + out.join('\n\n')
console.log(`${file}\n  converted ${count} product images to <ProductInset>`)
if (APPLY) { writeFileSync(file, result); console.log('  WROTE') }
else {
  // show first conversion context
  const idx = result.indexOf('<ProductInset')
  console.log('\n--- preview (first card in context) ---\n' + result.slice(idx, idx + 320))
}
