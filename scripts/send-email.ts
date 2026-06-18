#!/usr/bin/env tsx
/**
 * Render an MDX email file and post it to Klaviyo as a campaign
 * Usage: npx tsx scripts/send-email.ts email/newsletters/2024-01-issue-01/email.mdx
 */
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const KLAVIYO_KEY = process.env.KLAVIYO_API_KEY!
const LIST_ID = process.env.NEXT_PUBLIC_KLAVIYO_LIST_ID!

async function main() {
  const filePath = process.argv[2]
  if (!filePath) {
    console.error('Usage: npx tsx scripts/send-email.ts <path-to-email.mdx>')
    process.exit(1)
  }

  const raw = fs.readFileSync(path.resolve(filePath), 'utf-8')
  const { data: frontmatter, content } = matter(raw)

  console.log(`📧 Preparing: ${frontmatter.subject}`)
  console.log(`   List: ${LIST_ID}`)
  console.log(`   Content length: ${content.length} chars`)
  console.log()
  console.log('ℹ️  To post to Klaviyo, wire up the Campaigns API:')
  console.log('   POST https://a.klaviyo.com/api/campaigns/ with your rendered HTML')
  console.log('   Then POST /api/campaigns/{id}/campaign-send-job/ to send')
  console.log()
  console.log('Frontmatter:', JSON.stringify(frontmatter, null, 2))
}

main()
