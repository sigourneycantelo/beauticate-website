// Builds a compact JSON index of all published articles for the Ask Sig chatbot.
// Run: node scripts/build-chat-index.mjs
// Output: data/chat-index.json

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import matter from 'gray-matter'

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
const contentDir = path.join(root, 'content')
const outPath = path.join(root, 'data', 'chat-index.json')

const MAX_BODY_WORDS = 600

function stripMdx(body) {
  return body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/import\s+.*?from\s+['"][^'"]+['"]/g, ' ')
    .replace(/export\s+(default\s+)?/g, ' ')
    .replace(/[#*_~>`|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function truncateWords(text, max) {
  const words = text.split(/\s+/)
  if (words.length <= max) return text
  return words.slice(0, max).join(' ') + '…'
}

function walk(dir, parts, results) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    const mdxPath = path.join(dir, entry.name, `${entry.name}.mdx`)
    if (fs.existsSync(mdxPath)) {
      const slugParts = [...parts, entry.name]
      try {
        const raw = fs.readFileSync(mdxPath, 'utf-8')
        const { data, content } = matter(raw)

        if (data.published === false) continue

        const plain = stripMdx(content)
        const body = truncateWords(plain, MAX_BODY_WORDS)

        const category = slugParts[0] || ''
        const subcategory = slugParts.length > 2 ? slugParts[1] : ''
        const slug = data.slug || entry.name

        const urlPath = subcategory
          ? `/${category}/${subcategory}/${slug}`
          : `/${category}/${slug}`

        results.push({
          title: data.title || entry.name,
          slug,
          category,
          subcategory,
          author: data.author || '',
          tags: data.tags || [],
          excerpt: data.excerpt || '',
          date: data.date_published || '',
          url: urlPath,
          body,
          products: (data.product_links || [])
            .filter(p => p.type === 'shop')
            .map(p => ({ name: p.name, handle: p.handle })),
        })
      } catch (err) {
        console.warn(`  skip ${mdxPath}: ${err.message}`)
      }
    } else {
      walk(path.join(dir, entry.name), [...parts, entry.name], results)
    }
  }
}

const articles = []
walk(contentDir, [], articles)

articles.sort((a, b) => {
  const da = new Date(a.date || '2000-01-01').getTime()
  const db = new Date(b.date || '2000-01-01').getTime()
  return db - da
})

// ─── Shopify products ───────────────────────────────────────────────────────

async function fetchShopifyProducts() {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
  const token = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN
  if (!domain || !token) {
    console.log('  Shopify: no credentials, skipping product fetch')
    return []
  }

  const query = `{
    products(first: 250, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        handle title description vendor productType tags
        priceRange { minVariantPrice { amount currencyCode } }
        variants(first: 1) { nodes { availableForSale } }
      }
    }
  }`

  try {
    const res = await fetch(`https://${domain}/api/2024-10/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Shopify-Storefront-Private-Token': token,
      },
      body: JSON.stringify({ query }),
    })
    const { data } = await res.json()
    const products = (data?.products?.nodes || []).map(p => ({
      handle: p.handle,
      title: p.title,
      description: (p.description || '').slice(0, 300),
      vendor: p.vendor,
      type: p.productType,
      tags: p.tags || [],
      price: p.priceRange?.minVariantPrice?.amount,
      currency: p.priceRange?.minVariantPrice?.currencyCode,
      available: p.variants?.nodes?.[0]?.availableForSale ?? false,
      url: `/shop/products/${p.handle}`,
    }))
    console.log(`  Shopify: ${products.length} products fetched`)
    return products
  } catch (err) {
    console.warn('  Shopify fetch failed:', err.message)
    return []
  }
}

const products = await fetchShopifyProducts()

const index = { articles, products }
fs.writeFileSync(outPath, JSON.stringify(index, null, 0))

const sizeMB = (Buffer.byteLength(JSON.stringify(index)) / 1024 / 1024).toFixed(2)
console.log(`Chat index: ${articles.length} articles, ${products.length} products, ${sizeMB} MB → ${outPath}`)
