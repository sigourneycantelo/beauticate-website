#!/usr/bin/env node
/**
 * clean-mdx.mjs
 * Cleans WordPress-imported MDX content bodies.
 *
 * Usage:
 *   node scripts/clean-mdx.mjs [slug-path]
 *   node scripts/clean-mdx.mjs beauty-style/beauty-tips/beauticate-team-winter-edit
 *   node scripts/clean-mdx.mjs --all   (clean every MDX file in content/)
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CONTENT_DIR = path.join(__dirname, '../content')

// ─── Core cleaner ────────────────────────────────────────────────────────────

export function cleanMdxBody(raw) {
  // Split frontmatter from body
  const fmMatch = raw.match(/^(---[\s\S]*?---\n)/)
  if (!fmMatch) return raw
  const frontmatter = fmMatch[1]
  let body = raw.slice(frontmatter.length)

  // 1. Collapse multi-line BUY NOW / price links to single line
  //    Pattern: [\n   BUY NOW / $ text \n](url)
  body = body.replace(
    /\[\s*\n\s*(BUY NOW|\$[^\n]*|[A-Z][^\n]{0,40})\s*\n\s*\]\(([^)]+)\)/gi,
    (_, text, url) => {
      const label = text.trim().replace(/\s+/g, ' ')
      // Skip if label is just a price with no useful text
      if (/^\$?\s*AUD$/.test(label) || label === '$ AUD') return `[Shop Now](${url})`
      if (/^BUY NOW$/i.test(label)) return `[Buy Now](${url})`
      return `[${label}](${url})`
    }
  )

  // 2. Remove lines that are only whitespace/tabs (keep blank separator lines)
  const lines = body.split('\n')
  const cleaned = []
  let blankCount = 0

  for (const line of lines) {
    const isWhitespaceOnly = /^\s+$/.test(line)
    const isEmpty = line === ''

    if (isWhitespaceOnly) {
      // Treat as blank line
      blankCount++
      if (blankCount <= 1) cleaned.push('')
    } else if (isEmpty) {
      blankCount++
      if (blankCount <= 1) cleaned.push('')
    } else {
      blankCount = 0
      cleaned.push(line)
    }
  }

  body = cleaned.join('\n')

  // 3. Collapse 3+ consecutive blank lines to 2
  body = body.replace(/\n{3,}/g, '\n\n')

  // 4. Remove empty HTML comment blocks and stray HTML artifacts
  body = body.replace(/<!--[\s\S]*?-->/g, '')

  // 5. Fix bold markdown with spaces: ** [text](url)** → **[text](url)**
  body = body.replace(/\*\* \[/g, '**[')
  body = body.replace(/\]\*\* /g, ']** ')

  // 6. Strip leading spaces/tabs from lines that aren't code blocks
  const bodyLines = body.split('\n')
  let inCode = false
  body = bodyLines.map(line => {
    if (line.startsWith('```')) inCode = !inCode
    if (inCode) return line
    return line.trimEnd() // keep leading indent only in code, strip trailing everywhere
  }).join('\n')

  // 7. Strip leading indent from non-code lines that are just text/links/prices
  body = body.replace(/^[ \t]+([\$\[\!\#])/gm, '$1')

  // 8. Trim leading/trailing whitespace from body
  body = body.trim() + '\n'

  return frontmatter + body
}

// ─── File helpers ─────────────────────────────────────────────────────────────

function getMdxFiles(dir, results = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      getMdxFiles(full, results)
    } else if (entry.name.endsWith('.mdx')) {
      results.push(full)
    }
  }
  return results
}

function cleanFile(mdxPath) {
  const raw = fs.readFileSync(mdxPath, 'utf-8')
  const cleaned = cleanMdxBody(raw)
  if (cleaned !== raw) {
    fs.writeFileSync(mdxPath, cleaned, 'utf-8')
    return true
  }
  return false
}

// ─── CLI ─────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2)

if (args.includes('--all')) {
  const files = getMdxFiles(CONTENT_DIR)
  let changed = 0
  for (const f of files) {
    if (cleanFile(f)) {
      changed++
      console.log('cleaned:', path.relative(CONTENT_DIR, f))
    }
  }
  console.log(`\nDone — ${changed}/${files.length} files updated`)
} else if (args[0]) {
  const slugPath = args[0].replace(/^\//, '')
  const parts = slugPath.split('/')
  const slug = parts[parts.length - 1]
  const mdxPath = path.join(CONTENT_DIR, ...parts, `${slug}.mdx`)
  if (!fs.existsSync(mdxPath)) {
    console.error('File not found:', mdxPath)
    process.exit(1)
  }
  const changed = cleanFile(mdxPath)
  console.log(changed ? 'Cleaned.' : 'Already clean — no changes.')
} else {
  console.log('Usage:')
  console.log('  node scripts/clean-mdx.mjs beauty-style/beauty-tips/beauticate-team-winter-edit')
  console.log('  node scripts/clean-mdx.mjs --all')
}
