#!/usr/bin/env node
/**
 * Scans recently modified/created .mdx articles and suggests whether they
 * should be tagged as NewsArticle (is_news: true) based on content signals.
 *
 * Usage:
 *   node scripts/suggest-news-tag.mjs              # check uncommitted/recent articles
 *   node scripts/suggest-news-tag.mjs --all        # scan entire content directory
 *   node scripts/suggest-news-tag.mjs path/to/article.mdx  # check one file
 */

import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import matter from 'gray-matter'

const CONTENT_DIR = path.join(process.cwd(), 'content')

// ─── News signals ───────────────────────────────────────────────────────────

const TITLE_SIGNALS = [
  /\b(launch|launches|launched|launching)\b/i,
  /\b(reveals?|revealed|revealing)\b/i,
  /\b(opens?|opened|opening)\b/i,
  /\b(announces?|announced|announcing)\b/i,
  /\b(debuts?|debuted|debuting)\b/i,
  /\b(introduces?|introduced|introducing)\b/i,
  /\b(exclusive|first look|sneak peek|breaking)\b/i,
  /\b(new|brand.new|just.dropped)\b/i,
  /\b(wins?|won|award|awarded)\b/i,
  /\b(collab|collaboration|partners? with)\b/i,
  /\b(20\d{2})\b/,  // year reference = timely
  /\b(january|february|march|april|may|june|july|august|september|october|november|december)\b/i,
  /\b(summer|autumn|winter|spring)\s+20\d{2}\b/i,
]

const BODY_SIGNALS = [
  /\b(just launched|now available|drops today|available from)\b/i,
  /\b(this week|this month|today|yesterday)\b/i,
  /\b(we spoke to|we sat down with|in conversation with)\b/i,
  /\b(event|launch event|press preview)\b/i,
  /\b(trending|gone viral|tiktok)\b/i,
]

const NEWS_CATEGORIES = ['interviews', 'destinations']
const NEWS_SUBCATEGORIES = ['travel']
const NEWS_TAGS = ['news', 'trending', 'interview', 'launch', 'exclusive']

function scoreArticle(frontmatter, content) {
  const signals = []
  let score = 0
  const title = frontmatter.title || ''
  const tags = (frontmatter.tags || []).map(t => t.toLowerCase())
  const category = (frontmatter.category || '').toLowerCase()
  const subcategory = (frontmatter.subcategory || '').toLowerCase()

  // Already tagged
  if (frontmatter.is_news) {
    return { score: 0, signals: ['Already tagged as news'], recommend: false }
  }

  // Category/subcategory match (these auto-detect as NewsArticle anyway)
  if (NEWS_CATEGORIES.includes(category)) {
    signals.push(`Category "${category}" auto-detects as NewsArticle`)
    score += 3
  }
  if (NEWS_SUBCATEGORIES.includes(subcategory)) {
    signals.push(`Subcategory "${subcategory}" auto-detects as NewsArticle`)
    score += 3
  }

  // Tag match
  const matchedTags = tags.filter(t => NEWS_TAGS.includes(t))
  if (matchedTags.length > 0) {
    signals.push(`Tags already include: ${matchedTags.join(', ')}`)
    score += 2
  }

  // Title signals
  for (const regex of TITLE_SIGNALS) {
    if (regex.test(title)) {
      signals.push(`Title matches: "${title.match(regex)[0]}"`)
      score += 2
      break // one title signal is enough
    }
  }

  // Body signals (check first 1000 chars for speed)
  const bodySnippet = content.slice(0, 1000)
  for (const regex of BODY_SIGNALS) {
    if (regex.test(bodySnippet)) {
      signals.push(`Body contains: "${bodySnippet.match(regex)[0]}"`)
      score += 1
      break
    }
  }

  // Recency — published in last 7 days
  if (frontmatter.date_published) {
    const pubDate = new Date(frontmatter.date_published)
    const daysAgo = (Date.now() - pubDate.getTime()) / (1000 * 60 * 60 * 24)
    if (daysAgo <= 7) {
      signals.push(`Published ${Math.round(daysAgo)} days ago (fresh)`)
      score += 1
    }
  }

  // Review-type articles should NOT be news (they get Review schema instead)
  const isReview = /\b(review|we tried|i tried|we tested|road.test)\b/i.test(title) ||
    tags.includes('review') || frontmatter.review_rating != null
  if (isReview) {
    signals.push('Looks like a Review — Review schema takes priority over NewsArticle')
    return { score: 0, signals, recommend: false }
  }

  const recommend = score >= 3
  return { score, signals, recommend }
}

// ─── File discovery ─────────────────────────────────────────────────────────

function findRecentMdx() {
  try {
    const diff = execSync('git diff --name-only HEAD~5 HEAD -- content/', { encoding: 'utf-8' })
    const staged = execSync('git diff --name-only --cached -- content/', { encoding: 'utf-8' })
    const untracked = execSync('git ls-files --others --exclude-standard -- content/', { encoding: 'utf-8' })
    const files = [...new Set([...diff.split('\n'), ...staged.split('\n'), ...untracked.split('\n')])]
      .filter(f => f.endsWith('.mdx'))
      .map(f => path.resolve(f))
      .filter(f => fs.existsSync(f))
    return files
  } catch {
    return []
  }
}

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

// ─── Main ───────────────────────────────────────────────────────────────────

const args = process.argv.slice(2)
let files

if (args.includes('--all')) {
  files = findAllMdx()
} else if (args.length > 0 && !args[0].startsWith('--')) {
  files = args.map(f => path.resolve(f)).filter(f => fs.existsSync(f))
} else {
  files = findRecentMdx()
}

if (files.length === 0) {
  console.log('No articles to check. Use --all to scan everything.')
  process.exit(0)
}

let suggestions = 0

for (const file of files) {
  const raw = fs.readFileSync(file, 'utf-8')
  const { data: frontmatter, content } = matter(raw)
  const { score, signals, recommend } = scoreArticle(frontmatter, content)

  if (recommend) {
    suggestions++
    const rel = path.relative(process.cwd(), file)
    console.log(`\n📰 ${frontmatter.title}`)
    console.log(`   ${rel}`)
    console.log(`   Score: ${score} — SUGGEST adding is_news: true`)
    for (const s of signals) console.log(`   • ${s}`)
  }
}

if (suggestions === 0) {
  console.log(`\n✓ Checked ${files.length} articles — no new news suggestions.`)
} else {
  console.log(`\n─────────────────────────────────────────`)
  console.log(`${suggestions} article(s) could benefit from is_news: true`)
  console.log(`Add it to frontmatter to include them in the news sitemap.`)
}
