import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

function findMdx(dir, results = []) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f)
    if (statSync(p).isDirectory()) findMdx(p, results)
    else if (f.endsWith('.mdx')) results.push(p)
  }
  return results
}

const ENTITIES = {
  '&#038;': '&',
  '&amp;': '&',
  '&nbsp;': ' ',
  '&lt;': '<',
  '&gt;': '>',
  '&#8216;': '‘', // '
  '&#8217;': '’', // '
  '&#8220;': '“', // "
  '&#8221;': '”', // "
  '&#8230;': '…', // …
  '&#8211;': '–', // –
  '&#8212;': '—', // —
  '&mdash;': '—',
  '&ndash;': '–',
  '&ldquo;': '“',
  '&rdquo;': '”',
  '&lsquo;': '‘',
  '&rsquo;': '’',
  '&hellip;': '…',
}

const files = findMdx('content')
let fixed = 0

for (const file of files) {
  const original = readFileSync(file, 'utf8')
  let body = original

  // Only fix entities in the body (after the frontmatter closing ---)
  const fmEnd = body.indexOf('---', 3)
  if (fmEnd === -1) continue
  const frontmatter = body.slice(0, fmEnd + 3)
  let content = body.slice(fmEnd + 3)

  for (const [entity, char] of Object.entries(ENTITIES)) {
    content = content.replaceAll(entity, char)
  }

  // Also fix entities in title/seo_title frontmatter fields
  let fm = frontmatter
  for (const [entity, char] of Object.entries(ENTITIES)) {
    fm = fm.replaceAll(entity, char)
  }

  const result = fm + content
  if (result !== original) {
    writeFileSync(file, result, 'utf8')
    fixed++
  }
}

console.log(`✅ Fixed HTML entities in ${fixed} files`)
