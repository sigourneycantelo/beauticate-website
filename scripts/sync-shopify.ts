#!/usr/bin/env tsx
/**
 * Weekly Shopify product sync → data/shopify-products.json
 * Run via GitHub Actions on schedule, or: npx tsx scripts/sync-shopify.ts
 */
import fs from 'fs'
import path from 'path'

const STORE = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!
const TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!

const QUERY = `{
  products(first: 250) {
    edges {
      node {
        id handle title vendor description
        priceRange { minVariantPrice { amount currencyCode } }
        images(first: 1) { edges { node { url altText } } }
        variants(first: 5) { edges { node { id title availableForSale price { amount currencyCode } } } }
        collections(first: 5) { edges { node { handle title } } }
        tags
        metafields(identifiers: [
          { namespace: "custom", key: "editorial_note" }
        ]) { key value }
      }
    }
  }
}`

async function main() {
  if (!STORE || !TOKEN) {
    console.error('Missing NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN or NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN')
    process.exit(1)
  }

  const res = await fetch(`https://${STORE}/api/2024-10/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': TOKEN,
    },
    body: JSON.stringify({ query: QUERY }),
  })

  const { data, errors } = await res.json()
  if (errors) { console.error(errors); process.exit(1) }

  const products = data.products.edges.map((e: any) => e.node)
  const outPath = path.join(process.cwd(), 'data', 'shopify-products.json')
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, JSON.stringify(products, null, 2))
  console.log(`✅ Synced ${products.length} products → ${outPath}`)
}

main()
