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
      const runStart = i

      // Find the length of a run of image-only paragraphs starting at i
      while (
        i < children.length &&
        isImageOnlyParagraph(children[i])
      ) {
        i++
      }

      const runLength = i - runStart

      if (runLength === 0) {
        // Non-image node — advance so the outer loop doesn't spin forever
        i++
        continue
      }

      if (runLength >= 2) {
        // Extract the <img> elements from each <p>
        const imgNodes = children
          .slice(runStart, runStart + runLength)
          .map((p) => {
            const para = p as Element
            const img = para.children.find(
              (c): c is Element => c.type === 'element' && c.tagName === 'img'
            )!
            img.properties = {
              ...img.properties,
              class: 'w-full h-auto object-contain',
            }
            return img
          })

        // Chunk into rows: prefer exactly-3 only when the whole run is 3,
        // otherwise use rows of 2 so we get a 2-column layout.
        const chunkSize = runLength === 3 ? 3 : 2
        const gridNodes: Element[] = []
        for (let j = 0; j < imgNodes.length; j += chunkSize) {
          const chunk = imgNodes.slice(j, j + chunkSize)
          // A leftover single image is shown full-width — skip wrapping
          if (chunk.length === 1) {
            gridNodes.push({
              type: 'element',
              tagName: 'p',
              properties: {},
              children: [chunk[0]],
            })
            continue
          }
          const cols = chunk.length === 2 ? 2 : 3
          const gridClass =
            cols === 2
              ? 'not-prose grid grid-cols-2 gap-3 my-6'
              : 'not-prose grid grid-cols-2 md:grid-cols-3 gap-3 my-6'
          gridNodes.push({
            type: 'element',
            tagName: 'div',
            properties: { class: gridClass },
            children: chunk.map((img) => ({
              type: 'element' as const,
              tagName: 'div' as const,
              properties: { class: 'flex items-center justify-center' },
              children: [img],
            })),
          })
        }

        children.splice(runStart, runLength, ...gridNodes)
        i = runStart + gridNodes.length
      }
    }
  }
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
