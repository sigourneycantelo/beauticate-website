// Builds a slug -> canonical path lookup that middleware.ts uses to catch
// old/renamed article URLs (WordPress-era paths, or articles that were moved
// to a different category/subcategory during an editorial re-file) and 301
// them to wherever the article actually lives today.
//
// Why a lookup instead of one next.config.ts redirect per article: category
// re-filing isn't a clean 1:1 rename (e.g. one Interviews > Creatives piece
// moves to Interviews > Models while its neighbours stay put), so there's no
// static old-prefix -> new-prefix pattern to write. Matching on the slug
// (which survives re-filing) generalises to every article, including ones
// nobody has hit a 404 on yet, without hand-maintaining a giant redirect list.
//
// Run: node scripts/generate-redirect-map.mjs
// Output: data/redirect-slug-map.json
//
// Wired into `npm run build` as a prebuild step so the map never drifts from
// the current content directory.

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import matter from 'gray-matter'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const contentDir = path.join(root, 'content')
const outPath = path.join(root, 'data', 'redirect-slug-map.json')

function walk(dir, parts, results) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    const mdxPath = path.join(dir, entry.name, `${entry.name}.mdx`)
    if (fs.existsSync(mdxPath)) {
      results.push({ parts: [...parts, entry.name], mdxPath })
    } else {
      walk(path.join(dir, entry.name), [...parts, entry.name], results)
    }
  }
}

const found = []
walk(contentDir, [], found)

// Every subcategory segment in the tree — excluded from slug candidates below
// so a bare category-listing URL (e.g. /beauty-style/hair) can never collide
// with an article slug and get redirected somewhere wrong.
const subcategoryNames = new Set()
for (const { parts } of found) {
  if (parts.length >= 3) subcategoryNames.add(parts[1])
}

const slugCounts = new Map()
const slugToPath = new Map()

for (const { parts, mdxPath } of found) {
  const slug = parts[parts.length - 1]
  if (subcategoryNames.has(slug)) continue

  const raw = fs.readFileSync(mdxPath, 'utf-8')
  let frontmatter
  try {
    frontmatter = matter(raw).data
  } catch {
    continue
  }
  if (frontmatter.published === false) continue

  slugCounts.set(slug, (slugCounts.get(slug) ?? 0) + 1)
  slugToPath.set(slug, parts.join('/'))
}

const map = {}
let skippedAmbiguous = 0
for (const [slug, count] of slugCounts) {
  if (count > 1) {
    skippedAmbiguous++
    continue
  }
  map[slug] = slugToPath.get(slug)
}

fs.mkdirSync(path.dirname(outPath), { recursive: true })
fs.writeFileSync(outPath, JSON.stringify(map))

console.log(`Redirect slug map: ${Object.keys(map).length} slugs (${skippedAmbiguous} ambiguous slugs skipped — same slug used in >1 place) -> ${path.relative(root, outPath)}`)
