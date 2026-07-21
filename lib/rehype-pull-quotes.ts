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

const rehypePullQuotes: Plugin<[], Root> = () => {
  return (tree: Root) => {
    for (const node of tree.children) {
      if (node.type !== 'element') continue
      const el = node as Element
      if (el.tagName !== 'p') continue

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
