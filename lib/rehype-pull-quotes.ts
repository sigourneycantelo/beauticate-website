import type { Root, Element, Node, Text } from 'hast'
import type { Plugin } from 'unified'

/**
 * Rehype plugin that detects paragraphs whose entire content is italic
 * (a single <em> child) and promotes them to styled pull-quotes.
 *
 * In interview articles, these are the section-opening quotes like:
 *   *"I had a really nice, normal upbringing..."*
 *
 * They render as bold-italic at ~1.5x body font size.
 */
const CREDIT_PATTERN = /^(story by|photography by|words by|images? by|interview by|hair by|makeup by|styled by|produced by|directed by|shot by|written by|videography by)/i

function getTextContent(node: Node): string {
  if (node.type === 'text') return (node as Text).value
  if (node.type === 'element') {
    return ((node as Element).children ?? []).map(getTextContent).join('')
  }
  return ''
}

function isImageParagraph(node: Node): boolean {
  if (node.type !== 'element') return false
  const el = node as Element
  if (el.tagName !== 'p') return false
  const meaningful = el.children.filter(
    (c) => !(c.type === 'text' && (c as Text).value.trim() === '')
  )
  return (
    meaningful.length === 1 &&
    meaningful[0].type === 'element' &&
    (meaningful[0] as Element).tagName === 'img'
  )
}

function isHr(node: Node): boolean {
  return node.type === 'element' && (node as Element).tagName === 'hr'
}

const rehypePullQuotes: Plugin<[], Root> = () => {
  return (tree: Root) => {
    const elements = tree.children.filter((c) => c.type === 'element')
    let afterHr = false

    for (let i = 0; i < elements.length; i++) {
      const el = elements[i] as Element

      if (isHr(el)) {
        afterHr = true
        continue
      }

      if (el.tagName !== 'p') continue
      if (afterHr) continue

      const meaningful = el.children.filter(
        (c) => !(c.type === 'text' && (c as Text).value.trim() === '')
      )

      if (
        meaningful.length === 1 &&
        meaningful[0].type === 'element' &&
        (meaningful[0] as Element).tagName === 'em'
      ) {
        const text = getTextContent(meaningful[0]).trim()
        if (CREDIT_PATTERN.test(text)) continue

        const prev = i > 0 ? elements[i - 1] : null
        if (prev && isImageParagraph(prev)) continue

        el.properties = {
          ...el.properties,
          className: [
            ...((el.properties?.className as string[]) ?? []),
            'interview-pull-quote',
          ],
        }
      }
    }
  }
}

export default rehypePullQuotes
