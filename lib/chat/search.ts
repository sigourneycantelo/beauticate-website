import fs from 'fs'
import path from 'path'

export interface ChatArticle {
  title: string
  slug: string
  category: string
  subcategory: string
  tags: string[]
  excerpt: string
  date: string
  url: string
  body: string
  products: { name: string; handle?: string }[]
}

export interface ChatProduct {
  handle: string
  title: string
  description: string
  vendor: string
  type: string
  tags: string[]
  price: string
  currency: string
  available: boolean
  url: string
}

interface ChatIndex {
  articles: ChatArticle[]
  products: ChatProduct[]
}

let _index: ChatIndex | null = null

function loadIndex(): ChatIndex {
  if (_index) return _index
  const p = path.join(process.cwd(), 'data', 'chat-index.json')
  const raw = JSON.parse(fs.readFileSync(p, 'utf-8'))
  // Support both old (array) and new (object with articles/products) formats
  if (Array.isArray(raw)) {
    _index = { articles: raw, products: [] }
  } else {
    _index = raw
  }
  return _index!
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2)
}

const STOP_WORDS = new Set([
  'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had',
  'her', 'was', 'one', 'our', 'out', 'has', 'have', 'been', 'some',
  'them', 'than', 'its', 'over', 'also', 'that', 'with', 'this', 'from',
  'what', 'when', 'how', 'which', 'about', 'into', 'more', 'other',
  'would', 'there', 'their', 'will', 'each', 'make', 'like', 'just',
  'very', 'your', 'does', 'most',
])

export function searchProducts(query: string, limit = 4): ChatProduct[] {
  const { products } = loadIndex()
  if (products.length === 0) return []

  const terms = tokenize(query).filter(t => !STOP_WORDS.has(t))
  if (terms.length === 0) return products.filter(p => p.available).slice(0, limit)

  const scored = products.map(product => {
    let score = 0
    const titleLower = product.title.toLowerCase()
    const descLower = product.description.toLowerCase()
    const vendorLower = product.vendor.toLowerCase()
    const typeLower = product.type.toLowerCase()
    const tagsLower = product.tags.map(t => t.toLowerCase())

    for (const term of terms) {
      if (titleLower.includes(term)) score += 10
      if (vendorLower.includes(term)) score += 6
      if (typeLower.includes(term)) score += 5
      if (tagsLower.some(t => t.includes(term))) score += 4
      if (descLower.includes(term)) score += 2
    }

    if (!product.available) score *= 0.3

    return { product, score }
  })

  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(s => s.product)
}

export function searchArticles(query: string, limit = 6): ChatArticle[] {
  const { articles } = loadIndex()
  const terms = tokenize(query).filter(t => !STOP_WORDS.has(t))

  if (terms.length === 0) {
    return articles.slice(0, limit)
  }

  const now = Date.now()

  const scored = articles.map(article => {
    let score = 0
    const titleLower = article.title.toLowerCase()
    const tagsLower = article.tags.map(t => t.toLowerCase())
    const excerptLower = article.excerpt.toLowerCase()
    const bodyLower = article.body.toLowerCase()
    const categoryLower = article.category.toLowerCase()

    for (const term of terms) {
      if (titleLower.includes(term)) score += 10
      if (tagsLower.some(t => t.includes(term))) score += 6
      if (categoryLower.includes(term)) score += 4
      if (excerptLower.includes(term)) score += 3

      const bodyMatches = bodyLower.split(term).length - 1
      score += Math.min(bodyMatches, 5)
    }

    // Recency boost: recent articles reflect current opinions
    if (article.date) {
      const ageMs = now - new Date(article.date).getTime()
      const ageDays = ageMs / (1000 * 60 * 60 * 24)
      if (ageDays < 365) score *= 2.0        // last year
      else if (ageDays < 730) score *= 1.5   // last 2 years
      else if (ageDays < 1095) score *= 1.2  // last 3 years
    }

    return { article, score }
  })

  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(s => s.article)
}
