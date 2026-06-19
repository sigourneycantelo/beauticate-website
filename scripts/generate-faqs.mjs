#!/usr/bin/env node
// Auto-generate FAQs for every article MDX that doesn't already have them.
// Uses Claude Haiku for speed and cost. FAQs are marked auto_faqs: true so
// the review queue knows they're AI-drafted, not human-verified.
//
// Run:  ANTHROPIC_API_KEY=sk-ant-... node scripts/generate-faqs.mjs
// Or:   node scripts/generate-faqs.mjs            (reads key from env / .env.local)

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import Anthropic from '@anthropic-ai/sdk'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

// Load .env.local if present
function loadEnv() {
  const envPath = join(ROOT, '.env.local')
  if (!existsSync(envPath)) return
  for (const line of readFileSync(envPath, 'utf-8').split('\n')) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
}
loadEnv()

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// Walk content dir and return all MDX paths
function findMdxFiles(dir = join(ROOT, 'content'), results = []) {
  if (!existsSync(dir)) return results
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) findMdxFiles(full, results)
    else if (entry.name.endsWith('.mdx')) results.push(full)
  }
  return results
}

// Parse frontmatter from MDX (simple regex, not gray-matter, to preserve exact formatting)
function parseFrontmatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/m)
  if (!m) return null
  return { yaml: m[1], body: m[2] }
}

// Check if faqs already exist
function hasFaqs(yaml) {
  return /^faqs:/m.test(yaml)
}

// Check if body has enough content to generate FAQs from
function getBodyText(body) {
  return body.replace(/\*\*|\*|#+\s|!\[.*?\]\(.*?\)|\[.*?\]\(.*?\)/g, '').trim()
}

async function generateFaqs(title, excerpt, bodyText) {
  const truncated = bodyText.substring(0, 3000)
  const msg = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 800,
    messages: [{
      role: 'user',
      content: `You are an SEO content specialist writing FAQ schema for a beauty, wellness and lifestyle editorial website called Beauticate, based in Australia.

Article title: "${title}"
Excerpt: "${excerpt}"

Article content (truncated):
${truncated}

Generate exactly 4 FAQs a reader would genuinely ask about this topic. Each FAQ should:
- Be a natural question someone would search for
- Have a concise, helpful answer (2–4 sentences) in Australian English
- Be specific to the article content, not generic
- Include one FAQ that cites a specific product, treatment, or tip from the article where possible

Return ONLY valid JSON, no other text:
[
  { "question": "...", "answer": "..." },
  { "question": "...", "answer": "..." },
  { "question": "...", "answer": "..." },
  { "question": "...", "answer": "..." }
]`
    }]
  })

  const text = msg.content[0].text.trim()
  // Extract JSON array even if model wraps it in markdown code fences
  const jsonMatch = text.match(/\[[\s\S]*\]/)
  if (!jsonMatch) throw new Error(`No JSON array in response: ${text.substring(0, 100)}`)
  return JSON.parse(jsonMatch[0])
}

function faqsToYaml(faqs) {
  return faqs.map(f => {
    // Escape any double quotes in the strings
    const q = f.question.replace(/"/g, '\\"')
    const a = f.answer.replace(/"/g, '\\"')
    return `  - question: "${q}"\n    answer: "${a}"`
  }).join('\n')
}

async function processFile(mdxPath) {
  const raw = readFileSync(mdxPath, 'utf-8')
  const parsed = parseFrontmatter(raw)
  if (!parsed) return { path: mdxPath, status: 'NO_FRONTMATTER' }

  const { yaml, body } = parsed

  if (hasFaqs(yaml)) return { path: mdxPath, status: 'SKIP_HAS_FAQS' }

  // Extract title and excerpt from yaml
  const titleMatch = yaml.match(/^title:\s*"?(.*?)"?\s*$/m)
  const excerptMatch = yaml.match(/^excerpt:\s*"?(.*?)"?\s*$/m)
  const publishedMatch = yaml.match(/^published:\s*(true|false)/m)

  const title = titleMatch?.[1]?.replace(/\\"/g, '"') ?? ''
  const excerpt = excerptMatch?.[1]?.replace(/\\"/g, '"') ?? ''
  const published = publishedMatch?.[1] !== 'false'

  const bodyText = getBodyText(body)

  // Skip stubs — not enough content to generate meaningful FAQs
  if (bodyText.length < 200) return { path: mdxPath, status: 'SKIP_TOO_SHORT' }

  let faqs
  try {
    faqs = await generateFaqs(title, excerpt, bodyText)
  } catch (e) {
    return { path: mdxPath, status: 'API_ERROR', error: e.message }
  }

  if (!faqs || faqs.length === 0) return { path: mdxPath, status: 'NO_FAQS_RETURNED' }

  // Insert faqs + auto_faqs flag before the closing --- of frontmatter
  // Place after the last existing field
  const faqYaml = `faqs:\n${faqsToYaml(faqs)}\nauto_faqs: true`
  const newYaml = yaml.trimEnd() + '\n' + faqYaml
  const newRaw = `---\n${newYaml}\n---\n${body}`
  writeFileSync(mdxPath, newRaw)

  return { path: mdxPath, status: 'OK', count: faqs.length }
}

async function run() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('❌ ANTHROPIC_API_KEY not set. Add it to .env.local or pass as env var.')
    process.exit(1)
  }

  const files = findMdxFiles()
  console.log(`Found ${files.length} MDX files\n`)

  const results = { ok: 0, skipped: 0, short: 0, errors: [] }

  for (const file of files) {
    const name = file.split('/content/')[1] ?? file
    process.stdout.write(`  ${name}... `)
    const r = await processFile(file)

    if (r.status === 'OK') {
      console.log(`✓ ${r.count} FAQs generated`)
      results.ok++
    } else if (r.status === 'SKIP_HAS_FAQS') {
      console.log(`— already has FAQs`)
      results.skipped++
    } else if (r.status === 'SKIP_TOO_SHORT' || r.status === 'NO_FRONTMATTER') {
      console.log(`— skipped (${r.status.toLowerCase()})`)
      results.short++
    } else {
      console.log(`✗ ${r.status}${r.error ? ': ' + r.error : ''}`)
      results.errors.push(name)
    }

    // Polite rate-limit pause
    await new Promise(res => setTimeout(res, 150))
  }

  console.log(`\n✅  FAQs written: ${results.ok}`)
  console.log(`⏭️  Skipped (already done): ${results.skipped}`)
  console.log(`📄  Skipped (too short): ${results.short}`)
  if (results.errors.length) {
    console.log(`❌  Errors (${results.errors.length}):`)
    results.errors.forEach(e => console.log(`    ${e}`))
  }
}

run().catch(console.error)
