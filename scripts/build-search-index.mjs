// Generates public/search-index.json from all published MDX articles.
// Run automatically as part of `npm run build` via the prebuild script.
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const contentDir = path.join(root, 'content')
const outFile = path.join(root, 'public', 'search-index.json')

function extractFrontmatter(text) {
  if (!text.startsWith('---')) return null
  const end = text.indexOf('---', 3)
  if (end === -1) return null
  const fm = text.slice(3, end)
  const obj = {}
  for (const line of fm.split('\n')) {
    const m = line.match(/^(\w+):\s*(.+)$/)
    if (m) {
      let val = m[2].trim().replace(/^["']|["']$/g, '')
      obj[m[1]] = val
    }
  }
  return obj
}

function walk(dir, results) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full, results)
    else if (entry.name.endsWith('.mdx')) {
      const text = fs.readFileSync(full, 'utf8')
      const fm = extractFrontmatter(text)
      if (!fm || fm.published !== 'true' || !fm.title || !fm.slug) continue
      // Build the URL from frontmatter category/subcategory/slug
      const parts = [fm.category, fm.subcategory, fm.slug].filter(Boolean)
      const urlPath = '/' + parts.join('/')
      results.push({
        title: fm.title,
        slug: fm.slug,
        url: urlPath,
        category: fm.category ?? '',
        subcategory: fm.subcategory ?? '',
        author: fm.author ?? '',
        date: fm.date_published ?? '',
        excerpt: fm.excerpt ?? '',
      })
    }
  }
}

const results = []
walk(contentDir, results)
results.sort((a, b) => b.date.localeCompare(a.date))

fs.writeFileSync(outFile, JSON.stringify(results, null, 2))
console.log(`search-index.json — ${results.length} articles written to public/`)
