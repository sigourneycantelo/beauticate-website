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

  // Rewrite /wp-content/uploads/ paths to absolute beauticate.com URLs
  // These appear in markdown images: ![alt](/wp-content/uploads/...)
  // and also bare in <img src="/wp-content/..."> tags
  let body = original.replace(
    /(['"\(])\/?wp-content\/uploads\//g,
    '$1https://beauticate.com/wp-content/uploads/'
  )

  if (body !== original) {
    writeFileSync(file, body, 'utf8')
    fixed++
  }
}

console.log(`✅ Fixed WordPress image paths in ${fixed} files`)
