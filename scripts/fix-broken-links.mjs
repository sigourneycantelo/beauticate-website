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

const files = findMdx('content')
let fixed = 0

for (const file of files) {
  const original = readFileSync(file, 'utf8')
  let body = original

  // Remove markdown links with empty/whitespace-only text: [\n\t   ](url)
  body = body.replace(/\[\s*\]\([^)]*\)/gs, '')

  // Remove bare URLs on their own line that are just tracking/affiliate redirects with no context
  // (lines that are only a URL, no surrounding text)
  body = body.replace(/^\s*(https?:\/\/[^\s]+)\s*$/gm, (match, url) => {
    // Keep YouTube embeds and meaningful standalone links
    if (url.includes('youtube.com') || url.includes('youtu.be')) return match
    return ''
  })

  // Collapse 3+ blank lines
  body = body.replace(/\n{3,}/g, '\n\n')

  if (body !== original) {
    writeFileSync(file, body, 'utf8')
    fixed++
  }
}

console.log(`✅ Fixed broken links in ${fixed} files`)
