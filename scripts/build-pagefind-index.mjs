// Builds the Pagefind search index directly from the MDX source files using
// Pagefind's Node indexing API (https://pagefind.app/docs/node-api/).
//
// Why not the Pagefind CLI? The CLI crawls rendered *HTML*. This site is an
// SSR/ISR Next.js app on Vercel — `next build` emits JS bundles, not static
// HTML, so the CLI found nothing to index and search returned no results.
// Indexing the content directly sidesteps that entirely.
//
// Output: public/pagefind/  (consumed client-side by components/shared/SearchResults.tsx)
// Run as part of `npm run build` BEFORE `next build`, so the index is present
// in public/ when Next collects static assets.

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import matter from 'gray-matter'
import * as pagefind from 'pagefind'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const contentDir = path.join(root, 'content')
const outDir = path.join(root, 'public', 'pagefind')

// Strip MDX/Markdown down to plain, searchable text.
function toPlainText(body) {
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

function isPublished(v) {
  return v === true || v === 'true'
}

function walk(dir, results) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walk(full, results)
    } else if (entry.name.endsWith('.mdx')) {
      const raw = fs.readFileSync(full, 'utf8')
      let parsed
      try {
        parsed = matter(raw)
      } catch {
        continue // malformed frontmatter — skip rather than fail the build
      }
      const fm = parsed.data ?? {}
      if (!isPublished(fm.published) || !fm.title || !fm.slug) continue

      const urlPath = '/' + [fm.category, fm.subcategory, fm.slug].filter(Boolean).join('/')
      const bodyText = toPlainText(parsed.content ?? '')

      // Prepend title/excerpt/author so they're matchable in the body content,
      // since Pagefind searches `content`, not `meta`.
      const searchable = [fm.title, fm.excerpt, fm.author, bodyText]
        .filter(Boolean)
        .join('. ')

      const meta = { title: String(fm.title) }
      if (fm.featured_image) meta.image = String(fm.featured_image)
      if (fm.featured_image_alt) meta.image_alt = String(fm.featured_image_alt)
      if (fm.excerpt) meta.excerpt = String(fm.excerpt)

      results.push({ url: urlPath, content: searchable, meta })
    }
  }
}

async function main() {
  if (!fs.existsSync(contentDir)) {
    console.error(`build-pagefind-index: content dir not found at ${contentDir}`)
    process.exit(1)
  }

  const records = []
  walk(contentDir, records)

  const { index } = await pagefind.createIndex()
  for (const r of records) {
    await index.addCustomRecord({
      url: r.url,
      content: r.content,
      language: 'en',
      meta: r.meta,
    })
  }

  // Clear any stale index then write fresh.
  fs.rmSync(outDir, { recursive: true, force: true })
  await index.writeFiles({ outputPath: outDir })
  await pagefind.close()

  console.log(`pagefind: indexed ${records.length} articles -> public/pagefind/`)
}

main().catch(err => {
  console.error('build-pagefind-index failed:', err)
  process.exit(1)
})
