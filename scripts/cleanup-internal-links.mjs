#!/usr/bin/env node
/**
 * Cleans stale beauticate.com internal links in MDX content files.
 * 
 * Actions:
 * 1. Valid Vercel paths → strip domain, make relative
 * 2. Old WP route patterns (with redirects) → strip domain (redirect handles)
 * 3. Dead WP cruft (wp-includes, wp-admin, wp-json, xmlrpc, cart, feed) → remove entire link/reference
 * 4. /wp-content/uploads/ image paths → LEAVE (served from WP CDN)
 */

import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

const CONTENT_DIR = path.join(process.cwd(), 'content')

// Paths that exist on the Vercel site (strip domain → relative)
const VALID_PATHS = [
  'beauty-style', 'interviews', 'wellness', 'living', 'vodcast',
  'destinations', 'sigourneys-edit', 'about-beauticate', 'advertise-with-us',
  'shop', 'the-collective'
]

// Old WP paths that have redirects in next.config.ts (strip domain → relative, redirect handles rest)
const REDIRECTED_PATHS = [
  'who', 'how-to', 'how-tos', 'the-go-tos', 'destination',
  'vodcast-by-beauticate', 'news', 'offers', 'product', 'tag'
]

// Dead WP infrastructure — remove entirely
const DEAD_PATTERNS = [
  /https?:\/\/(www\.)?beauticate\.com\/wp-includes\/[^\s"')}\]]+/g,
  /https?:\/\/(www\.)?beauticate\.com\/wp-admin\/[^\s"')}\]]+/g,
  /https?:\/\/(www\.)?beauticate\.com\/wp-json\/[^\s"')}\]]+/g,
  /https?:\/\/(www\.)?beauticate\.com\/xmlrpc\.php[^\s"')}\]]*/g,
  /https?:\/\/(www\.)?beauticate\.com\/feed\/[^\s"')}\]]*/g,
  /https?:\/\/(www\.)?beauticate\.com\/comments\/feed\/[^\s"')}\]]*/g,
  /https?:\/\/(www\.)?beauticate\.com\/cart\/[^\s"')}\]]*/g,
  /https?:\/\/(www\.)?beauticate\.com\/wp-content\/themes\/[^\s"')}\]]+/g,
  /https?:\/\/(www\.)?beauticate\.com\/wp-content\/plugins\/[^\s"')}\]]+/g,
]

// Escaped variants (from JSON-LD or similar embedded content)
const ESCAPED_DEAD_PATTERNS = [
  /https?:\\\/\\\/(www\.)?beauticate\.com\\\/wp-admin\\\/[^\s"')}\]]+/g,
  /https?:\\\/\\\/(www\.)?beauticate\.com\\\/wp-json\\\/[^\s"')}\]]+/g,
  /https?:\\\/\\\/(www\.)?beauticate\.com\\\/wp-content\\\/plugins\\\/[^\s"')}\]]+/g,
  /https?:\\\/\\\/(www\.)?beauticate\.com\\\/wp-content\\\/themes\\\/[^\s"')}\]]+/g,
  /https?:\\\/\\\/(www\.)?beauticate\.com\\\/cart\\\/[^\s"')}\]]*/g,
  /https?:\\\/\\\/(www\.)?beauticate\.com\\\/checkout\\\/[^\s"')}\]]*/g,
  /https?:\\\/\\\/(www\.)?beauticate\.com\\\/collections\\\/[^\s"')}\]]+/g,
  /https?:\\\/\\\/(www\.)?beauticate\.com\\\/products\\\/[^\s"')}\]]+/g,
]

let stats = { converted: 0, deadRemoved: 0, filesModified: 0 }

function findAllMdx() {
  const files = []
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) walk(full)
      else if (entry.name.endsWith('.mdx')) files.push(full)
    }
  }
  walk(CONTENT_DIR)
  return files
}

function cleanFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8')
  const original = content
  
  // 1. Remove dead WP cruft (full lines if the line is ONLY a dead reference)
  for (const pattern of DEAD_PATTERNS) {
    const matches = content.match(pattern)
    if (matches) {
      stats.deadRemoved += matches.length
      content = content.replace(pattern, '')
    }
  }
  
  // 1b. Remove escaped dead patterns (JSON-LD embedded content)
  for (const pattern of ESCAPED_DEAD_PATTERNS) {
    const matches = content.match(pattern)
    if (matches) {
      stats.deadRemoved += matches.length
      content = content.replace(pattern, '')
    }
  }
  
  // 2. Convert valid Vercel paths to relative (with or without trailing content)
  const allKnownPaths = [...VALID_PATHS, ...REDIRECTED_PATHS]
  const knownPathsRegex = new RegExp(
    `https?://(www\\.)?beauticate\\.com/(${allKnownPaths.join('|')})(/[^\\s"')}\]]*)?`,
    'g'
  )
  content = content.replace(knownPathsRegex, (match, _www, segment, rest) => {
    stats.converted++
    const cleaned = `/${segment}${rest || ''}`.replace(/\/+$/, '') || `/${segment}`
    return cleaned
  })

  // 3. Convert /who?tag=... style query links (WP tag search — dead)
  content = content.replace(/https?:\/\/(www\.)?beauticate\.com\/who\?[^\s"')}\]]*/g, () => {
    stats.deadRemoved++
    return ''
  })

  // 4. Convert bare beauticate.com/ or beauticate.com to /
  content = content.replace(/https?:\/\/(www\.)?beauticate\.com\/?(?=["')}\]\s])/g, () => {
    stats.converted++
    return '/'
  })

  // 5. URL-encoded beauticate.com paths
  content = content.replace(/https?:\/\/(www\.)?beauticate\.com(%2F[^\s"')}\]]+)/gi, (match, _www, encoded) => {
    stats.converted++
    try {
      return decodeURIComponent(encoded).replace(/\/+$/, '')
    } catch {
      return encoded.replace(/%2F/gi, '/').replace(/\/+$/, '')
    }
  })
  
  // 6. Escaped beauticate.com\/ paths (JSON-LD blocks) — remove entire block references
  content = content.replace(/https?:\\\/\\\/(www\.)?beauticate\.com(\\\/[^\s"'}\]]+)?/g, (match) => {
    // If it's a wp-content/uploads reference, keep it (images from WP CDN)
    if (match.includes('wp-content\\/uploads') || match.includes('wp-content\\\/uploads')) return match
    stats.deadRemoved++
    return ''
  })

  // Leave /wp-content/uploads/ URLs alone (served from WP CDN)
  
  // Clean up empty lines left by dead removal (3+ consecutive blank lines → 2)
  content = content.replace(/\n{4,}/g, '\n\n\n')
  
  // Remove orphaned markdown links with empty URLs like [text]()
  content = content.replace(/\[([^\]]*)\]\(\s*\)/g, '$1')
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf-8')
    stats.filesModified++
    return true
  }
  return false
}

// Run
const files = findAllMdx()
console.log(`Scanning ${files.length} MDX files...`)

const modified = []
for (const file of files) {
  if (cleanFile(file)) {
    modified.push(path.relative(process.cwd(), file))
  }
}

console.log(`\n✓ Done.`)
console.log(`  Files modified: ${stats.filesModified}`)
console.log(`  Links converted to relative: ${stats.converted}`)
console.log(`  Dead WP references removed: ${stats.deadRemoved}`)

if (modified.length > 0) {
  console.log(`\nModified files:`)
  for (const f of modified) console.log(`  ${f}`)
}
