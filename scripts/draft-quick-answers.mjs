#!/usr/bin/env node
/**
 * draft-quick-answers.mjs — draft a <QuickAnswer> for articles that have none.
 *
 * The QuickAnswer box is the 40-60 word direct answer near the top of a story.
 * It is what AI Overviews and ChatGPT lift and cite, and it is on 6 of 1,848
 * articles. This front-loads the mechanical half of closing that gap.
 *
 * WHAT IT WILL AND WILL NOT DO
 *
 * It drafts ONLY from the article's own body. The model is given the piece and
 * told to answer the headline's question using facts already in the text, and
 * to return REFUSE when the article does not actually contain an answer (a
 * personal essay, an interview, a round-up with no single verdict). That
 * constraint is the whole design: a QuickAnswer is the most quotable sentence
 * on the page, so an invented one gets repeated by an AI with our name on it.
 *
 * Nothing is published. Drafts land in docs/audit/quick-answer-drafts.md for a
 * human to read, edit and paste in. `--write` inserts them into the MDX behind
 * `quick_answer_draft: true` so the review queue can surface them, and even
 * then a person still has to clear the flag.
 *
 * ORDER OF WORK
 *
 * Articles are ranked by docs/SEO-Beauticate-priority-list.csv (real Search
 * Console + GA data: organic sessions, affiliate clicks) so the highest-value
 * pages are drafted first. Anything not on that list sorts last. Run it in
 * batches with --limit rather than all at once: reviewing 40 good drafts beats
 * skimming 600.
 *
 * Usage:
 *   ANTHROPIC_API_KEY=sk-ant-... node scripts/draft-quick-answers.mjs --limit 40
 *   ... --write            also insert into the MDX behind quick_answer_draft
 *   ... --slug <substring>  just the articles whose path matches
 */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import Anthropic from '@anthropic-ai/sdk'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const CONTENT = join(ROOT, 'content')
const OUT = join(ROOT, 'docs/audit/quick-answer-drafts.md')
const PRIORITY_CSV = join(ROOT, 'docs/SEO-Beauticate-priority-list.csv')

const arg = (name, fallback = null) => {
  const i = process.argv.indexOf(name)
  return i === -1 ? fallback : process.argv[i + 1]
}
const LIMIT = Number(arg('--limit', '25'))
const WRITE = process.argv.includes('--write')
const ONLY = arg('--slug')

// ── env ──────────────────────────────────────────────────────────────────────
for (const f of ['.env.local', '.env']) {
  const p = join(ROOT, f)
  if (!existsSync(p)) continue
  for (const line of readFileSync(p, 'utf-8').split('\n')) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
}
if (!process.env.ANTHROPIC_API_KEY) {
  console.error('Set ANTHROPIC_API_KEY (or put it in .env.local).')
  process.exit(1)
}
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// ── content ──────────────────────────────────────────────────────────────────
function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (e.endsWith('.mdx')) out.push(p)
  }
  return out
}
const split = raw => {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  return m ? { fm: m[1], body: m[2] } : { fm: '', body: raw }
}
const field = (fm, name) => {
  const m = fm.match(new RegExp(`^${name}:\\s*(.+)$`, 'm'))
  return m ? m[1].trim().replace(/^['"]|['"]$/g, '') : null
}

/**
 * Traffic rank from the priority list. That CSV is several tables concatenated,
 * so rows are matched loosely: any row whose first cells contain a path we know
 * contributes its largest session figure.
 */
function loadPriority() {
  const score = new Map()
  if (!existsSync(PRIORITY_CSV)) return score
  for (const line of readFileSync(PRIORITY_CSV, 'utf-8').split('\n')) {
    const path = line.match(/\/[a-z0-9-]+(?:\/[a-z0-9-]+)+/)?.[0]
    if (!path) continue
    const nums = [...line.matchAll(/,(\d{2,7}),/g)].map(m => Number(m[1]))
    const best = nums.length ? Math.max(...nums) : 0
    score.set(path, Math.max(score.get(path) ?? 0, best))
  }
  return score
}

const PROMPT = `You are writing a "QuickAnswer" box for Beauticate, an Australian beauty and wellness publication.

A QuickAnswer is 40-60 words placed at the top of an article that answers, directly and factually, the question a reader typed to arrive there. It is what AI assistants quote, so it must be accurate and attributable.

RULES
- Use ONLY facts stated in the article below. Invent nothing. Add no figure, price, timeframe or claim that is not in the text.
- Answer in the first sentence. No scene-setting, no "in this article we".
- Include two or three concrete specifics from the piece: a number, a duration, a price, a product name.
- Where the article hedges or names a limitation, keep it. An honest caveat is what makes it quotable.
- Australian/British spelling. No em dashes. No Oxford commas.
- Keep the publication's own voice: plain, confident, unhyped.
- 40-60 words. One paragraph.

IF THE ARTICLE HAS NO SINGLE ANSWER TO GIVE — it is a personal essay, an interview, a news piece or a list with no verdict — reply with exactly: REFUSE

Reply with the QuickAnswer text alone, or REFUSE. No preamble, no quote marks.

HEADLINE: {{TITLE}}

ARTICLE:
{{BODY}}`

async function draft(title, body) {
  const res = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 400,
    messages: [{
      role: 'user',
      content: PROMPT.replace('{{TITLE}}', title).replace('{{BODY}}', body.slice(0, 14000)),
    }],
  })
  return res.content.map(c => (c.type === 'text' ? c.text : '')).join('').trim()
}

// ── select ───────────────────────────────────────────────────────────────────
const priority = loadPriority()
const candidates = []
for (const file of walk(CONTENT)) {
  const { fm, body } = split(readFileSync(file, 'utf-8'))
  if (field(fm, 'published') === 'false') continue
  if (body.includes('<QuickAnswer')) continue
  if (field(fm, 'quick_answer_draft') === 'true') continue
  const rel = file.replace(CONTENT + '/', '')
  if (ONLY && !rel.includes(ONLY)) continue
  // Too short to contain an answer worth extracting.
  if (body.length < 900) continue
  candidates.push({
    file, rel, body,
    title: field(fm, 'title') ?? rel,
    url: '/' + rel.replace(/\/[^/]+\.mdx$/, ''),
  })
}
for (const c of candidates) c.score = priority.get(c.url) ?? 0
candidates.sort((a, b) => b.score - a.score)

const batch = candidates.slice(0, LIMIT)
console.log(`${candidates.length} articles without a QuickAnswer. Drafting the top ${batch.length} by traffic.\n`)

const drafted = [], refused = []
for (const [i, c] of batch.entries()) {
  process.stdout.write(`  [${i + 1}/${batch.length}] ${c.rel.slice(0, 68)} ... `)
  try {
    const text = await draft(c.title, c.body)
    if (/^REFUSE/i.test(text)) { refused.push(c); console.log('no single answer, skipped'); continue }
    const words = text.split(/\s+/).length
    drafted.push({ ...c, text, words })
    console.log(`${words}w`)
  } catch (err) {
    console.log(`failed: ${err.message}`)
  }
}

// ── report ───────────────────────────────────────────────────────────────────
mkdirSync(dirname(OUT), { recursive: true })
const lines = [
  '# QuickAnswer drafts — for review',
  '',
  `Generated ${new Date().toISOString().slice(0, 10)} by \`scripts/draft-quick-answers.mjs\`.`,
  'Drafted from each article\'s own text, ordered by search traffic.',
  '',
  '**Nothing here is live.** Read each one against the article, edit it, then paste it in',
  'as `<QuickAnswer>...</QuickAnswer>` below the standfirst. Check every number against the piece:',
  'this is the passage most likely to be quoted back with our name on it.',
  '',
  `${drafted.length} drafted · ${refused.length} skipped as having no single answer.`,
  '',
]
for (const d of drafted) {
  lines.push(`## ${d.title}`, '', `\`${d.url}\` · ${d.words} words${d.score ? ` · ~${d.score} sessions` : ''}`, '',
    '```mdx', '<QuickAnswer>', d.text, '</QuickAnswer>', '```', '')
}
if (refused.length) {
  lines.push('---', '', '## Skipped — no single answer to give', '',
    'These are essays, interviews or round-ups. A QuickAnswer would have to be invented, so none was.', '')
  for (const r of refused) lines.push(`- \`${r.url}\``)
  lines.push('')
}
writeFileSync(OUT, lines.join('\n'))

if (WRITE) {
  for (const d of drafted) {
    const raw = readFileSync(d.file, 'utf-8')
    const { fm, body } = split(raw)
    const yaml = /^quick_answer_draft:/m.test(fm) ? fm : fm.trimEnd() + '\nquick_answer_draft: true'
    writeFileSync(d.file, `---\n${yaml}\n---\n\n<QuickAnswer>\n${d.text}\n</QuickAnswer>\n${body.replace(/^\s*\n/, '\n')}`)
  }
  console.log(`\nInserted ${drafted.length} drafts behind quick_answer_draft: true.`)
}

console.log(`\nDrafts written to ${OUT.replace(ROOT + '/', '')}`)
console.log(drafted.length ? 'Review them before anything ships.\n' : '')
