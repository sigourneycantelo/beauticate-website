import type { Root, Element, Node, Text } from 'hast'
import type { Plugin } from 'unified'

const rehypeShopGrid: Plugin<[], Root> = () => {
  return (tree: Root) => {
    const children = tree.children as Node[]

    // Filter to only element nodes for pattern matching, but track original indices
    let i = 0
    while (i < children.length) {
      if (!isShopHeading(children[i])) {
        i++
        continue
      }

      // Found a Shop heading — scan forward collecting linked-image + caption pairs
      const headingIdx = i
      let j = i + 1

      // Skip whitespace text nodes
      while (j < children.length && isWhitespace(children[j])) j++

      const products: { imageIdx: number; captionIdx: number | null }[] = []

      while (j < children.length) {
        // Skip whitespace
        while (j < children.length && isWhitespace(children[j])) j++
        if (j >= children.length) break

        if (!isLinkedImageParagraph(children[j])) break
        const imageIdx = j
        j++

        // Skip whitespace
        while (j < children.length && isWhitespace(children[j])) j++

        let captionIdx: number | null = null
        if (j < children.length && isCaption(children[j])) {
          captionIdx = j
          j++
        }

        products.push({ imageIdx, captionIdx })
      }

      if (products.length < 2) {
        i = j
        continue
      }

      // Build card elements
      const cards: Element[] = products.map(({ imageIdx, captionIdx }) => {
        const para = children[imageIdx] as Element
        const anchor = para.children.find(
          (c): c is Element => c.type === 'element' && c.tagName === 'a'
        )!
        const img = anchor.children.find(
          (c): c is Element => c.type === 'element' && c.tagName === 'img'
        )!

        const cardChildren: Element[] = [
          {
            type: 'element',
            tagName: 'a',
            properties: { ...anchor.properties, class: 'block no-underline' },
            children: [
              {
                type: 'element',
                tagName: 'img',
                properties: { ...img.properties, class: 'w-full h-auto object-contain rounded-sm' },
                children: [],
              },
            ],
          },
        ]

        if (captionIdx !== null) {
          const caption = children[captionIdx] as Element
          cardChildren.push({
            type: 'element',
            tagName: 'p',
            properties: { class: 'shop-grid-caption' },
            children: [...caption.children],
          })
        }

        return {
          type: 'element' as const,
          tagName: 'div',
          properties: { class: 'shop-grid-card' },
          children: cardChildren,
        }
      })

      const gridWrapper: Element = {
        type: 'element',
        tagName: 'div',
        properties: { class: 'not-prose shop-grid' },
        children: cards,
      }

      // Replace everything from after the heading to the last consumed node
      const firstProductIdx = products[0].imageIdx
      const lastIdx = products[products.length - 1].captionIdx ?? products[products.length - 1].imageIdx
      const removeCount = lastIdx - firstProductIdx + 1
      children.splice(firstProductIdx, removeCount, gridWrapper)
      i = firstProductIdx + 1
    }
  }
}

function isWhitespace(node: Node): boolean {
  return node.type === 'text' && (node as Text).value.trim() === ''
}

function textContent(node: Node): string {
  if (node.type === 'text') return (node as Text).value
  if (node.type === 'element') {
    return (node as Element).children.map(textContent).join('')
  }
  return ''
}

function isShopHeading(node: Node): boolean {
  if (node.type !== 'element') return false
  const el = node as Element
  if (el.tagName !== 'h2') return false
  const text = textContent(el).toLowerCase().replace(/:$/, '').trim()
  return text.startsWith('shop ')
}

function isLinkedImageParagraph(node: Node): boolean {
  if (node.type !== 'element') return false
  const el = node as Element
  if (el.tagName !== 'p') return false
  const meaningful = el.children.filter(
    (c) => !(c.type === 'text' && (c as Text).value.trim() === '')
  )
  if (meaningful.length !== 1) return false
  const child = meaningful[0]
  if (child.type !== 'element' || (child as Element).tagName !== 'a') return false
  const anchor = child as Element
  const anchorKids = anchor.children.filter(
    (c) => !(c.type === 'text' && (c as Text).value.trim() === '')
  )
  return (
    anchorKids.length === 1 &&
    anchorKids[0].type === 'element' &&
    (anchorKids[0] as Element).tagName === 'img'
  )
}

function isCaption(node: Node): boolean {
  if (node.type !== 'element') return false
  const el = node as Element
  return el.tagName === 'h6' || el.tagName === 'h5'
}

export default rehypeShopGrid
