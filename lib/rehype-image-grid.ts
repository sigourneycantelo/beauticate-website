import type { Root, Element, Node } from 'hast'
import type { Plugin } from 'unified'

/**
 * Rehype plugin that detects runs of 2+ consecutive paragraphs each containing
 * only a single image, and wraps them in a responsive CSS grid.
 *
 * This restores the "3-across" product gallery layout from the WordPress migration
 * without requiring changes to individual MDX files.
 */
const rehypeImageGrid: Plugin<[], Root> = () => {
  return (tree: Root) => {
    const children = tree.children as Node[]
    let i = 0

    while (i < children.length) {
      if (!isImageOnlyParagraph(children[i])) {
        i++
        continue
      }

      // Collect a run of image-unit groups (image + optional caption),
      // skipping whitespace text nodes between them.
      const units: { imgIdx: number; captionIdx?: number }[] = []
      let j = i
      while (j < children.length) {
        if (isImageOnlyParagraph(children[j])) {
          const unit: { imgIdx: number; captionIdx?: number } = { imgIdx: j }
          let next = j + 1
          // skip whitespace
          while (next < children.length && isWhitespaceText(children[next])) next++
          // check if next node is a caption (h6, or italic-only paragraph)
          if (next < children.length && isCaption(children[next])) {
            unit.captionIdx = next
            j = next + 1
          } else {
            j = next
          }
          units.push(unit)
        } else if (isWhitespaceText(children[j])) {
          j++
        } else {
          break
        }
      }

      const runLength = units.length

      if (runLength < 2) {
        i = j
        continue
      }

      // Extract the <img> elements and optional captions from each unit
      const imgUnits = units.map((unit) => {
        const para = children[unit.imgIdx] as Element
        const img = para.children.find(
          (c): c is Element => c.type === 'element' && c.tagName === 'img'
        )!
        img.properties = {
          ...img.properties,
          class: 'w-full h-full object-cover',
        }
        const caption = unit.captionIdx !== undefined
          ? (children[unit.captionIdx] as Element)
          : undefined
        return { img, caption }
      })

      // Chunk into rows: prefer exactly-3 only when the whole run is 3,
      // otherwise use rows of 2 so we get a 2-column layout.
      const chunkSize = runLength === 3 ? 3 : 2
      const gridNodes: Element[] = []
      for (let k = 0; k < imgUnits.length; k += chunkSize) {
        const chunk = imgUnits.slice(k, k + chunkSize)
        // A leftover single image is shown full-width — skip wrapping
        if (chunk.length === 1) {
          const cellChildren: Element[] = [
            { type: 'element', tagName: 'p', properties: {}, children: [chunk[0].img] },
          ]
          if (chunk[0].caption) cellChildren.push(chunk[0].caption)
          gridNodes.push(...cellChildren)
          continue
        }
        const cols = chunk.length === 2 ? 2 : 3
        const gridClass =
          cols === 2
            ? 'not-prose grid gap-3 my-6'
            : 'not-prose grid grid-cols-2 md:grid-cols-3 gap-3 my-6'
        const gridStyle = cols === 2 ? 'grid-template-columns:2fr 1fr' : undefined
        gridNodes.push({
          type: 'element',
          tagName: 'div',
          properties: { class: gridClass, style: gridStyle },
          children: chunk.map(({ img, caption }) => {
            const cellChildren: (Element | Node)[] = [img]
            if (caption) {
              caption.properties = {
                ...caption.properties,
                class: 'text-center text-xs mt-1',
              }
              cellChildren.push(caption)
            }
            return {
              type: 'element' as const,
              tagName: 'div' as const,
              properties: { class: 'flex flex-col items-center justify-center' },
              children: cellChildren,
            }
          }),
        })
      }

      const spliceStart = units[0].imgIdx
      const spliceCount = j - spliceStart
      children.splice(spliceStart, spliceCount, ...gridNodes)
      i = spliceStart + gridNodes.length
    }
  }
}

function isCaption(node: Node): boolean {
  if (node.type !== 'element') return false
  const el = node as Element
  return el.tagName === 'h6'
}

function isWhitespaceText(node: Node): boolean {
  if (node.type !== 'text') return false
  return (node as { value: string }).value.trim() === ''
}

function isImageOnlyParagraph(node: Node): boolean {
  if (node.type !== 'element') return false
  const el = node as Element
  if (el.tagName !== 'p') return false

  // Filter out whitespace text nodes
  const meaningful = el.children.filter(
    (c) => !(c.type === 'text' && (c as { value: string }).value.trim() === '')
  )

  return (
    meaningful.length === 1 &&
    meaningful[0].type === 'element' &&
    (meaningful[0] as Element).tagName === 'img'
  )
}

export default rehypeImageGrid
