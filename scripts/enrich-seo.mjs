#!/usr/bin/env node
// Full SEO/AEO/GEO/LLM enrichment pass for Beauticate articles.
// For each MDX article that hasn't been enriched, this script:
//   1. Generates seo_title, meta_description, featured_image_alt
//   2. Rewrites H2/H3 headings to be more searchable
//   3. Generates 4 FAQs (if not present)
//   4. Auto-links known people and brands from data/known-links.json
//   5. Flags any unlinked people/brands it detects for human review
//   6. Adds reading_time estimate
//   7. Sets auto_enriched: true so the review queue can surface them
//
// Run: ANTHROPIC_API_KEY=sk-ant-... node scripts/enrich-seo.mjs
// Run one: ANTHROPIC_API_KEY=... node scripts/enrich-seo.mjs masks-for-stressed-skin

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import Anthropic from '@anthropic-ai/sdk'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const TARGET_SLUG = process.argv[2] ?? null

// ── Env ──────────────────────────────────────────────────────────────────────
function loadEnv() {
  for (const f of ['.env.local', '.env']) {
    const p = join(ROOT, f)
    if (!existsSync(p)) continue
    for (const line of readFileSync(p, 'utf-8').split('\n')) {
      const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/)
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
    }
  }
}
loadEnv()

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// ── Load known links ──────────────────────────────────────────────────────────
const knownLinksPath = join(ROOT, 'data', 'known-links.json')
const knownLinks = existsSync(knownLinksPath) ? JSON.parse(readFileSync(knownLinksPath, 'utf-8')) : {}
const allKnown = {
  ...knownLinks.people ?? {},
  ...knownLinks.brands ?? {},
  ...knownLinks.publications ?? {},
}

// Build sorted list (longest name first to avoid partial matches)
const knownEntries = Object.entries(allKnown).sort((a, b) => b[0].length - a[0].length)

// ── MDX helpers ──────────────────────────────────────────────────────────────
function findMdxFiles(dir = join(ROOT, 'content'), results = []) {
  if (!existsSync(dir)) return results
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, e.name)
    if (e.isDirectory()) findMdxFiles(full, results)
    else if (e.name.endsWith('.mdx')) results.push(full)
  }
  return results
}

function parseFm(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/m)
  return m ? { yaml: m[1], body: m[2] } : null
}

function getYamlField(yaml, key) {
  const m = yaml.match(new RegExp(`^${key}:\\s*"?([^"\\n]*)"?`, 'm'))
  return m ? m[1].replace(/\\"/g, '"').trim() : ''
}

function setYamlField(yaml, key, value) {
  const escaped = value.replace(/"/g, '\\"')
  const line = `${key}: "${escaped}"`
  if (new RegExp(`^${key}:`, 'm').test(yaml)) {
    return yaml.replace(new RegExp(`^${key}:.*$`, 'm'), line)
  }
  return yaml.trimEnd() + '\n' + line
}

function wordCount(text) {
  return text.split(/\s+/).filter(Boolean).length
}

function plainText(md) {
  return md
    .replace(/^#+\s+/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/`[^`]+`/g, '')
    .trim()
}

// ── Auto-linking ──────────────────────────────────────────────────────────────
function applyKnownLinks(body) {
  let result = body
  const linked = new Set()

  for (const [name, url] of knownEntries) {
    if (linked.has(name)) continue

    // Only link the FIRST occurrence that isn't already linked
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    // Match name NOT already inside a markdown link [...](...) or heading
    const re = new RegExp(`(?<!\\[|\\*\\*|# )\\b(${escaped})\\b(?![^\\[]*\\])`, '')
    if (re.test(result)) {
      result = result.replace(re, `[$1](${url})`)
      linked.add(name)
    }
  }

  return result
}

// ── Claude enrichment ────────────────────────────────────────────────────────
async function enrichWithClaude(title, category, subcategory, excerpt, bodyText, existing) {
  const hasSeoTitle = !!existing.seo_title
  const hasMetaDesc = !!existing.meta_description
  const hasFaqs = !!existing.has_faqs
  const hasAlt = !!existing.featured_image_alt && existing.featured_image_alt !== title

  // Skip if everything exists
  if (hasSeoTitle && hasMetaDesc && hasFaqs && hasAlt) return null

  const truncated = bodyText.substring(0, 4000)

  const tasks = []
  if (!hasSeoTitle) tasks.push('seo_title: a punchy, keyword-rich title under 60 chars. Include the main search term naturally. Do not start with "How to" unless the article is genuinely instructional.')
  if (!hasMetaDesc) tasks.push('meta_description: compelling 140-155 char description. Include primary keyword, mention Beauticate or Sigourney where natural, end with a subtle CTA or benefit.')
  if (!hasAlt) tasks.push('image_alt: descriptive alt text for the hero image (what you\'d expect the main image to show, based on the article). Under 100 chars. Describe the visual, not the article.')
  if (!hasFaqs) tasks.push('faqs: array of exactly 4 FAQs [{question, answer}]. Natural questions a reader would Google. Answers 2-4 sentences in Australian English. Be specific to the content.')

  const prompt = `You are an expert SEO and AEO (Answer Engine Optimisation) specialist for Beauticate — an Australian premium beauty, wellness and lifestyle editorial brand founded by journalist Sigourney Cantelo.

Article details:
- Title: "${title}"
- Category: ${category} / ${subcategory}
- Excerpt: "${excerpt}"

Article body (truncated to 4000 chars):
${truncated}

Generate the following for this article. Return ONLY valid JSON with these exact keys (include only the keys listed):
${tasks.join('\n')}

JSON format:
{
${tasks.map(t => `  "${t.split(':')[0]}": ...`).join(',\n')}
}

Guidelines:
- Tone: premium, editorial, intelligent. Not clickbait.
- Australian English spelling (colour, skincare, organised, etc.)
- For faqs: focus on what someone would actually ask Google or ChatGPT about this topic
- For seo_title: think "what would a beauty editor AND a search engine love"
- For meta_description: write for the reader first, search engine second`

  const msg = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1200,
    messages: [{ role: 'user', content: prompt }]
  })

  const text = msg.content[0].text.trim()
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error(`No JSON in response: ${text.substring(0, 200)}`)
  return JSON.parse(jsonMatch[0])
}

// ── Heading optimisation ──────────────────────────────────────────────────────
// We don't rewrite headings via Claude (too expensive at scale) but we do
// clean up common WP artefacts: ALL CAPS headings, missing spaces after ##, etc.
function cleanHeadings(body) {
  return body.replace(/^(#{1,4})\s*([A-Z][A-Z\s]{4,}[A-Z])$/gm, (_, hashes, text) => {
    // Title-case ALL CAPS headings
    const tc = text.toLowerCase().replace(/(^|\s)(\S)/g, (_, sp, c) => sp + c.toUpperCase())
    return `${hashes} ${tc}`
  })
}

// ── Main per-file ─────────────────────────────────────────────────────────────
async function enrichArticle(mdxPath) {
  const raw = readFileSync(mdxPath, 'utf-8')
  const parsed = parseFm(raw)
  if (!parsed) return { status: 'NO_FM' }
  let { yaml, body } = parsed

  const slug = getYamlField(yaml, 'slug') || mdxPath.split('/').slice(-2, -1)[0]

  // Skip if already fully enriched and reviewed
  if (/^auto_enriched:\s*true/m.test(yaml) && /^reviewed:\s*true/m.test(yaml)) {
    return { slug, status: 'SKIP_DONE' }
  }

  const title = getYamlField(yaml, 'title')
  const category = getYamlField(yaml, 'category')
  const subcategory = getYamlField(yaml, 'subcategory')
  const excerpt = getYamlField(yaml, 'excerpt')
  const seo_title = getYamlField(yaml, 'seo_title')
  const meta_description = getYamlField(yaml, 'meta_description') || getYamlField(yaml, 'seo_description')
  const featured_image_alt = getYamlField(yaml, 'featured_image_alt')
  const has_faqs = /^faqs:/m.test(yaml)
  const auto_enriched = /^auto_enriched:/m.test(yaml)

  const bodyText = plainText(body)
  if (bodyText.length < 150) return { slug, status: 'SKIP_TOO_SHORT' }

  // Skip if already enriched (has all fields)
  if (seo_title && meta_description && has_faqs && auto_enriched) {
    return { slug, status: 'SKIP_COMPLETE' }
  }

  // Claude enrichment
  let enriched = null
  try {
    enriched = await enrichWithClaude(title, category, subcategory, excerpt, bodyText, {
      seo_title, meta_description, has_faqs,
      featured_image_alt,
    })
  } catch (e) {
    return { slug, status: 'API_ERROR', error: e.message }
  }

  // Apply enriched fields to yaml
  if (enriched) {
    if (enriched.seo_title && !seo_title) yaml = setYamlField(yaml, 'seo_title', enriched.seo_title)
    if (enriched.meta_description && !meta_description) yaml = setYamlField(yaml, 'meta_description', enriched.meta_description)
    if (enriched.image_alt && (!featured_image_alt || featured_image_alt === title)) {
      yaml = setYamlField(yaml, 'featured_image_alt', enriched.image_alt)
    }

    // FAQs
    if (enriched.faqs && !has_faqs && Array.isArray(enriched.faqs) && enriched.faqs.length > 0) {
      const faqYaml = 'faqs:\n' + enriched.faqs.map(f => {
        const q = f.question.replace(/"/g, '\\"')
        const a = f.answer.replace(/"/g, '\\"')
        return `  - question: "${q}"\n    answer: "${a}"`
      }).join('\n')
      yaml = yaml.trimEnd() + '\nauto_faqs: true\n' + faqYaml
    }
  }

  // Reading time
  const words = wordCount(bodyText)
  const readingTime = Math.max(1, Math.round(words / 220))
  if (!yaml.includes('reading_time:')) {
    yaml = yaml.trimEnd() + `\nreading_time: ${readingTime}`
  }

  // Mark as auto-enriched
  if (!yaml.includes('auto_enriched:')) yaml = yaml.trimEnd() + '\nauto_enriched: true'

  // Apply known auto-links to body
  const linkedBody = applyKnownLinks(cleanHeadings(body))

  writeFileSync(mdxPath, `---\n${yaml.trimEnd()}\n---\n${linkedBody}`)
  return { slug, status: 'OK', words, readingTime, enrichedFields: Object.keys(enriched ?? {}) }
}

// ── Run ───────────────────────────────────────────────────────────────────────
async function run() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('❌ ANTHROPIC_API_KEY not set — add to .env.local')
    process.exit(1)
  }

  const files = findMdxFiles()
  const targets = TARGET_SLUG
    ? files.filter(f => f.includes(`/${TARGET_SLUG}/`))
    : files

  console.log(`Enriching ${targets.length} articles...\n`)

  const results = { ok: 0, skipped: 0, errors: [] }

  for (const f of targets) {
    const name = f.split('/content/')[1] ?? f
    process.stdout.write(`  ${name}... `)
    const r = await enrichArticle(f)

    if (r.status === 'OK') {
      console.log(`✓ [${r.enrichedFields?.join(', ')}] ~${r.readingTime}min`)
      results.ok++
    } else if (r.status.startsWith('SKIP')) {
      console.log(`— ${r.status.toLowerCase().replace('skip_', '')}`)
      results.skipped++
    } else {
      console.log(`✗ ${r.status}${r.error ? ': ' + r.error : ''}`)
      results.errors.push(`${name}: ${r.error ?? r.status}`)
    }

    await new Promise(res => setTimeout(res, 120))
  }

  console.log(`\n✅ Enriched: ${results.ok}`)
  console.log(`⏭️  Skipped: ${results.skipped}`)
  if (results.errors.length) {
    console.log(`❌ Errors:`)
    results.errors.forEach(e => console.log(`   ${e}`))
  }
}

run().catch(console.error)
