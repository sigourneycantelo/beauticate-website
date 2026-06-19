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

  // Remove all [vc_*] and [/vc_*] shortcodes (WPBakery/Visual Composer)
  let body = original

  // Strip shortcode tags — greedy match handles quoted attributes with ] inside
  body = body.replace(/\[\/?(vc_|cs_|us_|uncode_)[^\[]*?\]/g, '')

  // Strip other common WP shortcodes
  body = body.replace(/\[\/?caption[^\[]*?\]/g, '')
  body = body.replace(/\[\/?gallery[^\[]*?\]/g, '')
  body = body.replace(/\[\/?embed[^\[]*?\]/g, '')

  // Collapse 3+ consecutive blank lines into 2
  body = body.replace(/\n{3,}/g, '\n\n')

  if (body !== original) {
    writeFileSync(file, body, 'utf8')
    fixed++
  }
}

console.log(`✅ Stripped shortcodes from ${fixed} files`)
