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

  // Split frontmatter from body
  const match = original.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/m)
  if (!match) continue
  const fm = match[1]
  let body = match[2]

  // 1. Remove IMAGE: caption placeholders (e.g. "IMAGE: INSTAGRAM @HANDLE")
  body = body.replace(/^IMAGE:.*$/gim, '')

  // 2. Remove leftover WPBakery shortcodes missed by first pass (with quoted attrs)
  body = body.replace(/\[\/?(vc_|cs_|us_)[^\[]*?\]/g, '')

  // 3. Strip inline HTML style attributes
  body = body.replace(/ style="[^"]*"/g, '')

  // 4. Remove empty markdown links []()
  body = body.replace(/\[\]\(\)/g, '')

  // 5. Remove WordPress-style caption shortcodes
  body = body.replace(/\[caption[^\]]*\]|\[\/caption\]/g, '')

  // 6. Remove stray HTML comments
  body = body.replace(/<!--[\s\S]*?-->/g, '')

  // 7. Collapse 3+ blank lines to 2
  body = body.replace(/\n{3,}/g, '\n\n')

  // 8. Remove lines that are just whitespace
  body = body.replace(/^[ \t]+$/gm, '')

  const result = `---\n${fm}\n---\n${body}`
  if (result !== original) {
    writeFileSync(file, result, 'utf8')
    fixed++
  }
}

console.log(`✅ Cleaned ${fixed} articles`)
