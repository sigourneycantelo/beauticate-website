import type { Root, Element, ElementContent, Node } from 'hast'
import type { Plugin } from 'unified'

/** Block-level prose a floated portrait is allowed to wrap. */
const WRAPPABLE_TAGS = new Set(['p', 'ul', 'ol'])

/**
 * Rehype plugin that gives `<Portrait>` a flow context to float inside.
 *
 * `.article-body` is a CSS grid (gutter / measure / gutter), and `float` is
 * inert on a grid item — so a bare `<Portrait>` renders as a small block hard
 * against the left edge and the prose beside it never wraps. This wraps each
 * portrait together with the paragraphs it is meant to wrap in a single
 * `display: flow-root` block, which is one grid item and re-establishes the
 * normal flow the float needs.
 *
 * Scanning stops at the first thing that starts a new block — a heading, an
 * image, another component, another portrait — so a portrait only ever wraps
 * the prose that actually belongs to it. A portrait with no prose after it is
 * marked `--solo` and centred instead, since a float with nothing beside it
 * just reads as misaligned.
 *
 * Must run LAST in the pipeline: the other rehype plugins pattern-match over
 * `tree.children`, and anything moved inside a wrapper is no longer visible
 * to them.
 */
const rehypePortraitFloat: Plugin<[], Root> = () => {
  return (tree: Root) => {
    const children = tree.children as Node[]
    let i = 0

    while (i < children.length) {
      if (!isPortrait(children[i])) {
        i++
        continue
      }

      // Collect the prose this portrait should wrap.
      let end = i + 1
      let wrapped = 0
      let j = i + 1
      while (j < children.length) {
        if (isWhitespaceText(children[j])) {
          j++
          continue
        }
        if (!isWrappableProse(children[j])) break
        wrapped++
        j++
        end = j
      }

      const group: Element = {
        type: 'element',
        tagName: 'div',
        properties: {
          class: wrapped
            ? 'article-float-group'
            : 'article-float-group article-float-group--solo',
        },
        children: children.slice(i, end) as ElementContent[],
      }

      children.splice(i, end - i, group)
      i += 1
    }
  }
}

function isPortrait(node: Node): boolean {
  return (
    node.type === 'mdxJsxFlowElement' &&
    (node as unknown as { name?: string }).name === 'Portrait'
  )
}

/**
 * A paragraph or list the portrait can wrap. Image-only paragraphs are
 * excluded — a lone landscape image is still a `<p><img></p>` at this point
 * and belongs to the full measure, not beside a float.
 */
function isWrappableProse(node: Node): boolean {
  if (node.type !== 'element') return false
  const el = node as Element
  if (!WRAPPABLE_TAGS.has(el.tagName)) return false
  return !isImageOnlyParagraph(el)
}

function isImageOnlyParagraph(el: Element): boolean {
  if (el.tagName !== 'p') return false
  const meaningful = el.children.filter(
    (c) => !(c.type === 'text' && c.value.trim() === '')
  )
  return (
    meaningful.length === 1 &&
    meaningful[0].type === 'element' &&
    (meaningful[0] as Element).tagName === 'img'
  )
}

function isWhitespaceText(node: Node): boolean {
  if (node.type !== 'text') return false
  return (node as unknown as { value: string }).value.trim() === ''
}

export default rehypePortraitFloat
