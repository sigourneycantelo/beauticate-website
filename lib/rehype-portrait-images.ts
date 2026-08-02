import type { Root, Element, Node } from 'hast'
import type { Plugin } from 'unified'
import fs from 'node:fs'
import path from 'node:path'
import { imageSize } from 'image-size'

const MAX_WIDTH = 460

/**
 * Rehype plugin that gives lone portrait/square images a consistent
 * treatment: centred, capped at MAX_WIDTH (never upscaled past the file's
 * own width), caption centred beneath. Landscape images are left untouched
 * so they keep filling the body measure.
 *
 * Must run after rehype-image-grid — that plugin claims runs of 2+
 * consecutive images into galleries first, so any `<p><img></p>` still
 * standing here is a genuine lone image. The one exception is an odd
 * leftover from a gallery run (rehype-image-grid tags those images with an
 * `object-cover` class even when it emits them as a plain paragraph) —
 * those are left alone too, since they belong to a run, not a lone image.
 */
const rehypePortraitImages: Plugin<[], Root> = () => {
  return (tree: Root) => {
    const children = tree.children as Node[]
    let i = 0

    while (i < children.length) {
      if (!isImageOnlyParagraph(children[i])) {
        i++
        continue
      }

      const para = children[i] as Element
      const img = para.children.find(
        (c): c is Element => c.type === 'element' && c.tagName === 'img'
      )!

      const existingClass = img.properties?.class
      const belongsToGalleryRun =
        typeof existingClass === 'string' && existingClass.includes('object-cover')

      let next = i + 1
      while (next < children.length && isWhitespaceText(children[next])) next++
      const hasCaption = next < children.length && isCaption(children[next])
      const caption = hasCaption ? (children[next] as Element) : undefined
      const spliceEnd = hasCaption ? next + 1 : i + 1

      if (belongsToGalleryRun) {
        i = spliceEnd
        continue
      }

      const dims = readImageDimensions(String(img.properties?.src ?? ''))

      // Landscape, or dimensions unreadable — leave untouched.
      if (!dims || dims.width > dims.height) {
        i = spliceEnd
        continue
      }

      const cappedWidth = Math.min(MAX_WIDTH, dims.width)
      img.properties = {
        ...img.properties,
        width: dims.width,
        height: dims.height,
        class: 'w-full h-auto rounded',
      }

      const figureChildren: Element[] = [img]
      if (caption) {
        figureChildren.push({
          type: 'element',
          tagName: 'figcaption',
          properties: { class: 'text-center text-xs mt-2' },
          children: caption.children,
        })
      }

      const figure: Element = {
        type: 'element',
        tagName: 'figure',
        properties: { class: 'not-prose mx-auto my-8', style: `max-width:${cappedWidth}px` },
        children: figureChildren,
      }

      children.splice(i, spliceEnd - i, figure)
      i += 1
    }
  }
}

function readImageDimensions(src: string): { width: number; height: number } | null {
  if (!src || !src.startsWith('/')) return null
  try {
    const filePath = path.join(process.cwd(), 'public', src)
    const buffer = fs.readFileSync(filePath)
    const { width, height } = imageSize(buffer)
    if (!width || !height) return null
    return { width, height }
  } catch {
    return null
  }
}

function isCaption(node: Node): boolean {
  if (node.type !== 'element') return false
  return (node as Element).tagName === 'h6'
}

function isWhitespaceText(node: Node): boolean {
  if (node.type !== 'text') return false
  return (node as unknown as { value: string }).value.trim() === ''
}

function isImageOnlyParagraph(node: Node): boolean {
  if (node.type !== 'element') return false
  const el = node as Element
  if (el.tagName !== 'p') return false

  const meaningful = el.children.filter(
    (c) => !(c.type === 'text' && (c as { value: string }).value.trim() === '')
  )

  return (
    meaningful.length === 1 &&
    meaningful[0].type === 'element' &&
    (meaningful[0] as Element).tagName === 'img'
  )
}

export default rehypePortraitImages
