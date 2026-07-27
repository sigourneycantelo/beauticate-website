// Builds the Pagefind search index directly from the MDX source files + the live
// Shopify catalogue, using Pagefind's Node indexing API (https://pagefind.app/docs/node-api/).
//
// Why not the Pagefind CLI? The CLI crawls rendered *HTML*. This site is an
// SSR/ISR Next.js app on Vercel — `next build` emits JS bundles, not static
// HTML, so the CLI found nothing to index and search returned no results.
// Indexing the content directly sidesteps that entirely.
//
// Three record types are indexed, each tagged with a `type` filter so the search
// UI can group / narrow results (Pagefind renders the filter panel automatically):
//   • Article — one per published MDX file            → /category/subcategory/slug
//   • Product — one per Shopify product (first 250)    → /shop/products/<handle>
//   • Brand   — one per Shopify brand collection       → /shop/brands/<handle>
// Products & brands come from the same canonical helpers the site uses (lib/shopify),
// so the index stays aligned with what the shop actually shows.
//
// Output: public/pagefind/  (consumed client-side by components/shared/SearchResults.tsx)
// Run via tsx as part of `npm run build` BEFORE `next build`, so the index is
// present in public/ when Next collects static assets. Run standalone with
// `npm run build:search`. Shopify creds are read from .env.local when present;
// if they're missing the build falls open to an articles-only index.

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import matter from 'gray-matter'
import * as pagefind from 'pagefind'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const contentDir = path.join(root, 'content')
const outDir = path.join(root, 'public', 'pagefind')

// Load .env.local so the Shopify helpers see credentials when this script is run
// standalone (outside `next build`, which injects env vars itself). Must happen
// before lib/shopify is imported, since it reads the creds at module load — hence
// the dynamic import of the shop helpers further down.
const envPath = path.join(root, '.env.local')
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '')
  }
}

type Meta = Record<string, string>
type Filters = Record<string, string[]>
interface Record_ { url: string; content: string; meta: Meta; filters: Filters }

// Strip MDX/Markdown down to plain, searchable text.
function toPlainText(body: string): string {
  return body
    .replace(/```[\s\S]*?```/g, ' ')          // fenced code blocks
    .replace(/`[^`]*`/g, ' ')                  // inline code
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')     // images ![alt](src)
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')   // links [text](url) -> text
    .replace(/<\/?[A-Za-z][^>]*>/g, ' ')       // JSX/HTML tags <Portrait ...>
    .replace(/^#{1,6}\s+/gm, '')               // heading markers
    .replace(/^>\s?/gm, '')                    // blockquotes
    .replace(/[*_~`>#]/g, ' ')                 // stray markdown symbols
    .replace(/\s+/g, ' ')                      // collapse whitespace
    .trim()
}

function isPublished(v: unknown): boolean {
  return v === true || v === 'true'
}

// ─── Articles ────────────────────────────────────────────────────────────────

function walkArticles(dir: string, results: Record_[]): void {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walkArticles(full, results)
    } else if (entry.name.endsWith('.mdx')) {
      const raw = fs.readFileSync(full, 'utf8')
      let parsed
      try {
        parsed = matter(raw)
      } catch {
        continue // malformed frontmatter — skip rather than fail the build
      }
      const fm = (parsed.data ?? {}) as Record<string, unknown>
      if (!isPublished(fm.published) || !fm.title || !fm.slug) continue

      const urlPath = '/' + [fm.category, fm.subcategory, fm.slug].filter(Boolean).join('/')
      const bodyText = toPlainText(parsed.content ?? '')

      // Prepend title/excerpt/author so they're matchable in the body content,
      // since Pagefind searches `content`, not `meta`.
      const searchable = [fm.title, fm.excerpt, fm.author, bodyText]
        .filter(Boolean)
        .join('. ')

      const meta: Meta = { title: String(fm.title) }
      if (fm.featured_image) meta.image = String(fm.featured_image)
      if (fm.featured_image_alt) meta.image_alt = String(fm.featured_image_alt)
      if (fm.excerpt) meta.excerpt = String(fm.excerpt)

      results.push({ url: urlPath, content: searchable, meta, filters: { type: ['Article'] } })
    }
  }
}

// ─── Shop (products + brands) ────────────────────────────────────────────────

// Fetches product & brand records from Shopify via the site's canonical helpers.
// Fails open: any missing creds / API error yields an empty list so the search
// index still builds with articles.
async function buildShopRecords(): Promise<Record_[]> {
  if (!process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || !process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN) {
    console.log('pagefind: no Shopify creds — skipping products & brands')
    return []
  }

  // Dynamic import AFTER env is loaded (lib/shopify reads creds at module load).
  const { getProducts, getCollections } = await import('../lib/shopify')
  const { NON_BRAND_COLLECTION_HANDLES } = await import('../lib/shop-taxonomy')

  const records: Record_[] = []

  // Products — first 250, newest-updated first (mirrors the chat index cap).
  try {
    const products = await getProducts(250)
    for (const p of products) {
      if (!p.handle || !p.title) continue
      const content = [p.title, p.vendor, p.productType, ...(p.tags ?? []), p.description]
        .filter(Boolean)
        .join('. ')
      const meta: Meta = { title: p.title }
      if (p.vendor) meta.brand = p.vendor
      if (p.featuredImage?.url) meta.image = p.featuredImage.url
      if (p.featuredImage?.altText) meta.image_alt = p.featuredImage.altText
      const price = p.priceRange?.minVariantPrice
      if (price?.amount) {
        const amount = Math.round(Number(price.amount)).toString()
        meta.excerpt = [p.vendor, `$${amount} ${price.currencyCode ?? ''}`.trim()].filter(Boolean).join(' · ')
      } else if (p.vendor) {
        meta.excerpt = p.vendor
      }
      records.push({
        url: `/shop/products/${p.handle}`,
        content,
        meta,
        filters: { type: ['Product'] },
      })
    }
    console.log(`pagefind: ${products.length} products`)
  } catch (err) {
    console.warn('pagefind: product fetch failed —', (err as Error).message)
  }

  // Brands — every Shopify collection that isn't a category / moment / system
  // collection (same rule as the live "Shop by Brand" menu, see brandsFromCollections).
  try {
    const collections = await getCollections(100)
    let brandCount = 0
    for (const c of collections) {
      if (!c.handle || !c.title || NON_BRAND_COLLECTION_HANDLES.has(c.handle)) continue
      const productTitles = (c.products?.nodes ?? []).map(n => n.title).filter(Boolean)
      const content = [c.title, c.description, ...productTitles].filter(Boolean).join('. ')
      const meta: Meta = { title: c.title }
      if (c.image?.url) meta.image = c.image.url
      if (c.image?.altText) meta.image_alt = c.image.altText
      meta.excerpt = c.description ? String(c.description).slice(0, 160) : 'Shop the brand'
      records.push({
        url: `/shop/brands/${c.handle}`,
        content,
        meta,
        filters: { type: ['Brand'] },
      })
      brandCount++
    }
    console.log(`pagefind: ${brandCount} brands`)
  } catch (err) {
    console.warn('pagefind: brand fetch failed —', (err as Error).message)
  }

  return records
}

// ─── Build ───────────────────────────────────────────────────────────────────

async function main() {
  if (!fs.existsSync(contentDir)) {
    console.error(`build-pagefind-index: content dir not found at ${contentDir}`)
    process.exit(1)
  }

  const records: Record_[] = []
  walkArticles(contentDir, records)
  const articleCount = records.length
  records.push(...(await buildShopRecords()))

  const { index } = await pagefind.createIndex()
  for (const r of records) {
    await index.addCustomRecord({
      url: r.url,
      content: r.content,
      language: 'en',
      meta: r.meta,
      filters: r.filters,
    })
  }

  // Clear any stale index then write fresh.
  fs.rmSync(outDir, { recursive: true, force: true })
  await index.writeFiles({ outputPath: outDir })
  await pagefind.close()

  console.log(
    `pagefind: indexed ${records.length} records ` +
    `(${articleCount} articles, ${records.length - articleCount} shop) -> public/pagefind/`,
  )
}

main().catch(err => {
  console.error('build-pagefind-index failed:', err)
  process.exit(1)
})
