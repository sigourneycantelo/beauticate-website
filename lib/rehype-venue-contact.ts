import type { Root, Element, Node, Text, RootContent } from 'hast'
import type { Plugin } from 'unified'

function getTextContent(node: Node): string {
  if (node.type === 'text') return (node as Text).value
  if (node.type === 'element') {
    return ((node as Element).children ?? []).map(getTextContent).join('')
  }
  return ''
}

/**
 * Rehype plugin for venue/destination pages:
 * 1. Wraps everything from ## CONTACT onwards in a .venue-contact div
 * 2. Removes empty ## MENU headings
 * 3. Converts "Review by …" blockquotes to a subtle attribution line
 */
const rehypeVenueContact: Plugin<[], Root> = () => {
  return (tree: Root) => {
    const children = tree.children as (Element | Node)[]
    let contactIdx = -1

    for (let i = 0; i < children.length; i++) {
      const node = children[i]
      if (node.type !== 'element') continue
      const el = node as Element

      // Convert "Review by" blockquotes to subtle attribution
      if (el.tagName === 'blockquote') {
        const text = getTextContent(el).trim()
        if (/review by/i.test(text)) {
          const cleanText = text
            .replace(/^[""“]|[""”]$/g, '')
            .replace(/^_|_$/g, '')
            .trim()
          children[i] = {
            type: 'element',
            tagName: 'p',
            properties: { className: ['venue-attribution'] },
            children: [{ type: 'text', value: cleanText }],
          } as Element
        }
      }

      // Find ## CONTACT heading
      if (el.tagName === 'h2') {
        const text = getTextContent(el).trim().replace(/:$/, '')
        if (/^contact$/i.test(text) && contactIdx === -1) {
          contactIdx = i
        }
        // Remove ## MENU headings entirely
        if (/^menu$/i.test(text)) {
          children.splice(i, 1)
          i--
        }
      }
    }

    // Wrap contact section in a div
    if (contactIdx >= 0) {
      const contactChildren = children.splice(contactIdx) as Element[]
      const wrapper: Element = {
        type: 'element',
        tagName: 'div',
        properties: { className: ['venue-contact'] },
        children: contactChildren,
      }
      children.push(wrapper)
    }

    tree.children = children as RootContent[]
  }
}

export default rehypeVenueContact
