#!/usr/bin/env node
/**
 * Finds brands the shop shows as SOLD OUT while Shopify holds stock for them.
 *
 * The product page does not trust `variant.availableForSale` — it asks the cart
 * (see `getVariantAvailability` in lib/shopify.ts), because the cart is the only
 * thing that knows whether a line can actually be bought. So when the two
 * disagree, the reader gets a sold-out button on a product with hundreds of
 * units in the warehouse, and nothing anywhere errors.
 *
 * They disagree when the location holding the stock is not a shipping origin in
 * the product's delivery profile. Shopify will let you create a profile whose
 * only origin is "Shop location" — which stocks nothing, because every partner
 * brand fulfils from its own Modern Dropship location — and every product in
 * that profile becomes unbuyable the moment it is published. That is how the
 * whole NOHRD range, all of Christophe Robin and all of IBIZA HAIR went dark:
 * twenty-odd `$N Shipping` freight tiers, each created with one origin, plus
 * quecolour-com never added to the General profile. Weeks, unnoticed, because
 * the pages render perfectly.
 *
 * The fix is always in Shopify, never here: Settings → Shipping and delivery →
 * the profile → add the brand's fulfilment location to the rate. Then re-run.
 *
 * Sampling one variant per brand is deliberate. A delivery profile covers a
 * whole brand, so one probe answers for all of it — and Shopify rate limits
 * cartCreate per IP hard enough that a full catalogue sweep gets throttled out
 * partway through and then locks the bucket for ten minutes or more, so the
 * next attempt fails on its first probe. Keep runs small and occasional.
 * `--all` is there for when you need the exhaustive list and can wait it out;
 * a throttled run reports what it found before stopping and exits 2.
 *
 *   node scripts/audit-cart-availability.mjs          # one variant per brand
 *   node scripts/audit-cart-availability.mjs --all    # every in-stock variant
 *
 * Exit: 0 clean · 1 brands found · 2 cut short by throttling (partial result)
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

// Load .env.local since dotenv isn't available
const envPath = path.join(root, '.env.local')
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '')
  }
}

const STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
const TOKEN = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN
if (!STORE_DOMAIN || !TOKEN) {
  console.error('[cart-audit] needs NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_PRIVATE_TOKEN.')
  process.exit(1)
}
const API = `https://${STORE_DOMAIN}/api/2024-10/graphql.json`
const ALL = process.argv.includes('--all')

const sleep = ms => new Promise(r => setTimeout(r, ms))

/**
 * Shopify throttles cartCreate with an HTTP 200 and a THROTTLED error rather
 * than a 429, and sends no Retry-After, so the only option is to wait it out.
 * The bucket refills slowly — seconds of backoff, not milliseconds.
 */
async function sf(query, variables, attempt = 0) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Shopify-Storefront-Private-Token': TOKEN },
    body: JSON.stringify({ query, variables }),
  })
  const retryable = res.status === 429 || res.status >= 500
  if (!retryable && !res.ok) throw new Error(`Shopify ${res.status} ${res.statusText}`)
  const body = retryable ? null : await res.json()
  const throttled = retryable || (body?.errors ?? []).some(
    e => e.extensions?.code === 'THROTTLED' || /throttl/i.test(e.message ?? ''),
  )
  if (throttled) {
    if (attempt >= 8) throw new Error('Shopify kept throttling — wait a few minutes and re-run.')
    await sleep(5000 * (attempt + 1))
    return sf(query, variables, attempt + 1)
  }
  if (body.errors) throw new Error(body.errors[0]?.message ?? 'Shopify GraphQL error')
  return body.data
}

// Every product the storefront can see — i.e. everything published to the
// Beauticate Shop channel, which is exactly what the site renders.
async function publishedProducts() {
  const out = []
  let cursor = null
  for (let i = 0; i < 20; i++) {
    const { products } = await sf(`
      query All($cursor: String) {
        products(first: 250, after: $cursor) {
          pageInfo { hasNextPage endCursor }
          nodes {
            handle title vendor
            variants(first: 50) { nodes { id title availableForSale } }
          }
        }
      }
    `, { cursor })
    out.push(...products.nodes)
    if (!products.pageInfo.hasNextPage) break
    cursor = products.pageInfo.endCursor
  }
  return out
}

/**
 * One variant per cart, deliberately. A cartCreate carrying a line Shopify
 * rejects outright returns a null cart for the whole mutation, so batching
 * would turn one bad variant into a page of false alarms.
 */
async function cartAccepts(variantId) {
  const data = await sf(`
    mutation Probe($lines: [CartLineInput!]!) {
      cartCreate(input: { buyerIdentity: { countryCode: AU }, lines: $lines }) {
        cart { lines(first: 1) { nodes { quantity } } }
        userErrors { message }
        warnings { code }
      }
    }
  `, { lines: [{ merchandiseId: variantId, quantity: 1 }] })
  const c = data?.cartCreate
  if (!c?.cart) return { ok: false, why: c?.userErrors?.[0]?.message ?? 'cart could not be created' }
  if ((c.cart.lines.nodes[0]?.quantity ?? 0) >= 1) return { ok: true }
  return { ok: false, why: c.warnings?.map(w => w.code).join(', ') || 'line dropped to quantity 0' }
}

const products = await publishedProducts()
const inStock = products.flatMap(p =>
  p.variants.nodes
    .filter(v => v.availableForSale)
    .map(v => ({ id: v.id, variantTitle: v.title, handle: p.handle, title: p.title, vendor: p.vendor })),
)

// One probe per brand unless --all: the delivery profile that causes this is
// set per brand, so the first in-stock variant answers for the whole vendor.
const targets = ALL ? inStock : [...new Map(inStock.map(t => [t.vendor, t])).values()]
targets.sort((a, b) => a.vendor.localeCompare(b.vendor))

console.log(`[cart-audit] ${products.length} published products, ${inStock.length} in-stock variants.`)
console.log(`[cart-audit] probing ${targets.length} ${ALL ? 'variants' : 'brands'}…\n`)

const broken = []
let probed = 0
let cutShort = null
for (const t of targets) {
  // Paced to stay inside the cart bucket; the backoff in sf() covers the rest.
  await sleep(1500)
  let r
  try {
    r = await cartAccepts(t.id)
  } catch (err) {
    // A long lockout must not throw away the brands already probed — those
    // findings are the whole point of the run.
    cutShort = { at: t.vendor, message: err.message }
    break
  }
  probed++
  if (!r.ok) {
    broken.push({ ...t, why: r.why })
    const variant = t.variantTitle === 'Default Title' ? '' : ` · ${t.variantTitle}`
    console.log(`  ✗ ${t.vendor} — ${t.title}${variant}  [${r.why}]`)
    console.log(`    /shop/products/${t.handle}`)
  }
}

if (cutShort) {
  console.log(`\n[cart-audit] stopped at ${cutShort.at} after ${probed}/${targets.length}: ${cutShort.message}`)
  console.log('[cart-audit] findings below are real but incomplete.')
}

if (!broken.length) {
  const scope = cutShort ? `the first ${probed}` : `every`
  console.log(`[cart-audit] ${scope} ${ALL ? 'in-stock variant' : 'brand'} can be added to a cart.${cutShort ? '' : ' ✓'}`)
  process.exit(cutShort ? 2 : 0)
}

const byVendor = new Map()
for (const b of broken) byVendor.set(b.vendor, (byVendor.get(b.vendor) ?? 0) + 1)
console.log(`\n[cart-audit] ${broken.length} in-stock ${broken.length === 1 ? 'product renders' : 'products render'} as sold out:`)
for (const [vendor, n] of [...byVendor].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${String(n).padStart(4)}  ${vendor}`)
}
console.log('\nEvery product from these brands is affected, not only the one probed.')
console.log('Fix in Shopify: Settings → Shipping and delivery → the brand\'s profile →')
console.log('add the brand\'s fulfilment location as an origin with a rate. Then re-run.')
process.exit(cutShort ? 2 : 1)
