import fs from 'fs'
import path from 'path'
import { imageSize } from 'image-size'
import { SITE } from '@/lib/feed'

/**
 * Reading image facts off disk — kept in its own module ON PURPOSE.
 *
 * resolveImage() reads a file whose path is only known at runtime. @vercel/nft,
 * which decides what ships inside a serverless function, cannot resolve that
 * statically, so it conservatively traces the ENTIRE public/ tree — 3.3GB of
 * article photography — into the bundle of every dynamic route that can reach
 * this code. That is what broke the deploy: /sitemap-news.xml is dynamic, it
 * imported lib/feed.ts, and it inherited a 3.3GB bundle. The build died with
 * `ENOSPC: no space left on device` while collecting build traces.
 *
 * The article route already carries that cost for a pre-existing reason
 * (lib/rehype-portrait-images.ts reads public/ the same way and genuinely needs
 * those files at request time), and one such bundle fits. Two did not.
 *
 * So: nothing imported by a DYNAMIC route may import this file. Only
 * app/feed.xml/route.ts does, and that route is force-static — it renders at
 * build time and produces no function bundle at all, so tracing never sees it.
 *
 * Do not re-export this from lib/feed.ts, and do not import it from
 * app/sitemap-news.xml/route.ts. That is the whole reason the two are separate.
 */

const PUBLIC_DIR = path.join(process.cwd(), 'public')


export interface FeedImage {
  url: string
  width?: number
  height?: number
  /** File size in bytes — RSS <enclosure> requires a length attribute. */
  bytes?: number
  /** MIME type, for <enclosure type>. */
  mimeType?: string
}

type ImageFacts = { width: number; height: number; bytes: number; mimeType: string }

const MIME_BY_EXT: Record<string, string> = {
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.webp': 'image/webp', '.gif': 'image/gif', '.avif': 'image/avif',
}

const imageFactsCache = new Map<string, ImageFacts | null>()

/**
 * Absolute URL plus intrinsic pixel dimensions for an image referenced from
 * frontmatter. Content images are repo files under public/, so size and byte
 * length are read straight off disk — no network, and no guessing at an aspect
 * ratio.
 *
 * A local path with no file behind it returns undefined, NOT a URL. Some
 * published listings point at a hero.jpg that was left behind when the listing
 * was re-filed to a new path, and a feed item whose only image 404s is worse
 * than no item: Pinterest and the carousel automation both exist to turn that
 * image into a post. Callers fall through to the next candidate, and
 * getFeedArticles drops the item if nothing resolves.
 *
 * A remote URL (legacy WordPress CDN) is returned as-is and unverified —
 * checking it would mean a network call per item.
 */
export function resolveImage(src: string | undefined): FeedImage | undefined {
  if (!src || typeof src !== 'string') return undefined
  const trimmed = src.trim()
  if (!trimmed) return undefined
  if (/^https?:\/\//i.test(trimmed)) return { url: trimmed }
  if (!trimmed.startsWith('/')) return undefined

  const url = `${SITE}${trimmed}`
  if (!imageFactsCache.has(trimmed)) {
    let facts: ImageFacts | null = null
    try {
      const filePath = path.join(PUBLIC_DIR, decodeURIComponent(trimmed))
      // Keep the lookup inside public/ — a frontmatter path is content, and
      // content should never be able to point the reader at another directory.
      if (filePath.startsWith(PUBLIC_DIR) && fs.existsSync(filePath)) {
        const buffer = fs.readFileSync(filePath)
        const { width, height } = imageSize(buffer)
        const mimeType = MIME_BY_EXT[path.extname(filePath).toLowerCase()]
        if (width && height && mimeType) {
          facts = { width, height, bytes: buffer.byteLength, mimeType }
        }
      }
    } catch {
      facts = null
    }
    imageFactsCache.set(trimmed, facts)
  }
  const cached = imageFactsCache.get(trimmed)
  return cached ? { url, ...cached } : undefined
}

