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
        // Extract the <img> elements from each <p> and build a grid wrapper
        const imgNodes = children
          .slice(runStart, runStart + runLength)
          .map((p) => {
            const para = p as Element
            const img = para.children.find(
              (c): c is Element => c.type === 'element' && c.tagName === 'img'
            )!
            // Add object-contain so product shots don't crop
            img.properties = {
              ...img.properties,
              class: 'w-full h-auto object-contain',
            }
            return img
          })

        const cols = runLength === 2 ? 2 : 3
        const gridClass =
          cols === 2
            ? 'not-prose grid grid-cols-2 gap-3 my-6'
            : 'not-prose grid grid-cols-2 md:grid-cols-3 gap-3 my-6'

        const gridDiv: Element = {
          type: 'element',
          tagName: 'div',
          properties: { class: gridClass },
          children: imgNodes.map((img) => ({
            type: 'element' as const,
            tagName: 'div' as const,
            properties: { class: 'flex items-center justify-center' },
            children: [img],
          })),
        }

        children.splice(runStart, runLength, gridDiv)
        // i is now at runStart + 1 (the element after the inserted div)
        i = runStart + 1
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
