import { getArticleSlugs, getArticleBySlug } from '@/lib/content'
import Link from 'next/link'

interface ReviewItem {
  slug: string
  title: string
  category: string
  subcategory?: string
  date: string
  published: boolean
  reviewed: boolean
  autoEnriched: boolean
  autoFaqs: boolean
  hasYoutube: boolean
  needsRewrite: boolean
  wordCount: number
  readingTime?: number
  issues: string[]
  path: string
}

// Heuristics for "needs rewrite" — articles flagged here should be
// manually improved or put through enrich-seo.mjs for a Claude rewrite.
// Criteria: thin content (<300 words), missing seo_title, old + unreviewed,
// or explicitly flagged needs_rewrite: true in frontmatter.
function shouldFlagRewrite(f: Record<string, unknown>, bodyWordCount: number, raw: Record<string, unknown>): boolean {
  if (raw.needs_rewrite === true) return true
  if (bodyWordCount < 300) return true  // stub content
  if (!f.seo_title && !f.meta_description) return true  // no SEO at all
  const date = String(f.date_published ?? '')
  const isOld = date < '2023-01-01'
  const isUnreviewed = raw.reviewed !== true
  if (isOld && isUnreviewed && bodyWordCount < 800) return true  // old thin content
  return false
}

function getReviewItems(): ReviewItem[] {
  return getArticleSlugs()
    .map((parts): ReviewItem | null => {
      const article = getArticleBySlug(parts)
      if (!article) return null
      const f = article.frontmatter
      const raw = f as unknown as Record<string, unknown>

      const autoEnriched = raw.auto_enriched === true
      const autoFaqs = raw.auto_faqs === true
      const hasYoutube = !!f.youtube_embed
      const readingTime = raw.reading_time as number | undefined

      // Estimate word count from content
      const wordCount = article.content.split(/\s+/).filter(Boolean).length
      const needsRewrite = shouldFlagRewrite(f as unknown as Record<string, unknown>, wordCount, raw)

      const issues: string[] = []
      if (!f.meta_description && !f.seo_description) issues.push('meta_description')
      if (!f.seo_title) issues.push('seo_title')
      if (!f.featured_image) issues.push('hero image')
      const hasFaqs = f.faqs && f.faqs.length > 0
      if (!hasFaqs) issues.push('faqs')
      else if (autoFaqs && !f.reviewed) issues.push('faqs: ai draft')
      if (needsRewrite) issues.push('needs rewrite')

      return {
        slug: f.slug ?? parts[parts.length - 1],
        title: f.title,
        category: f.category,
        subcategory: f.subcategory,
        date: f.date_published,
        published: f.published !== false,
        reviewed: f.reviewed === true,
        autoEnriched,
        autoFaqs,
        hasYoutube,
        needsRewrite,
        wordCount,
        readingTime,
        issues,
        path: `/${parts.join('/')}`,
      }
    })
    .filter((item): item is ReviewItem => item !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

const BADGE: Record<string, string> = {
  'meta_description': 'bg-red-100 text-red-700',
  'seo_title': 'bg-orange-100 text-orange-700',
  'hero image': 'bg-purple-100 text-purple-700',
  'faqs': 'bg-yellow-100 text-yellow-700',
  'faqs: ai draft': 'bg-sky-100 text-sky-700',
  'needs rewrite': 'bg-pink-100 text-pink-700',
}

export default function ReviewQueuePage() {
  const items = getReviewItems()
  const needsReview = items.filter(i => i.issues.length > 0 || !i.reviewed)
  const ready = items.filter(i => i.reviewed && i.issues.length === 0)
  const unpublished = items.filter(i => !i.published)
  const aiDrafted = items.filter(i => i.autoFaqs && !i.reviewed)
  const needsRewrite = items.filter(i => i.needsRewrite)

  const stats = [
    { label: 'Total articles', value: items.length, bg: 'bg-white' },
    { label: 'Needs attention', value: needsReview.length, bg: 'bg-red-50' },
    { label: 'AI FAQs to review', value: aiDrafted.length, bg: 'bg-sky-50' },
    { label: 'Needs rewrite', value: needsRewrite.length, bg: 'bg-pink-50' },
    { label: 'Ready / reviewed', value: ready.length, bg: 'bg-green-50' },
    { label: 'Unpublished', value: unpublished.length, bg: 'bg-gray-50' },
  ]

  // Group by category for the filter links at top
  const categories = [...new Set(items.map(i => i.category))].sort()

  return (
    <div className="min-h-screen bg-[#f7f6f4] p-6 md:p-10">
      <div className="max-w-8xl mx-auto" style={{ maxWidth: '1400px' }}>

        {/* Header */}
        <div className="mb-6 flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-serif text-3xl text-gray-900 mb-1">Content Review Queue</h1>
            <p className="text-sm text-gray-400">Beauticate editorial dashboard · {items.length} articles</p>
          </div>
          <div className="flex gap-3 text-xs text-gray-500 flex-wrap">
            {categories.map(cat => (
              <a key={cat} href={`#${cat}`} className="hover:text-gray-800 transition-colors capitalize">
                {cat.replace(/-/g, ' ')}
              </a>
            ))}
          </div>
        </div>

        {/* How to use */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-amber-900">
          <strong className="font-medium">Badge guide: </strong>
          <span className="inline-block px-1.5 py-0.5 rounded bg-pink-100 text-pink-700 text-xs mx-1">needs rewrite</span> thin or outdated content ·
          <span className="inline-block px-1.5 py-0.5 rounded bg-sky-100 text-sky-700 text-xs mx-1">faqs: ai draft</span> Claude wrote them, check accuracy ·
          <span className="inline-block px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 text-xs mx-1">hero image</span> no image, article is draft ·
          <span className="inline-block px-1.5 py-0.5 rounded bg-red-100 text-red-700 text-xs mx-1">meta_description</span> missing SEO copy ·
          YT <strong>▶</strong> = has YouTube, <strong>○</strong> = needs one ·
          Add <code className="bg-amber-100 px-1 rounded">reviewed: true</code> to MDX to mark complete ·
          Add <code className="bg-amber-100 px-1 rounded">needs_rewrite: true</code> to manually flag for rewrite
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
          {stats.map(s => (
            <div key={s.label} className={`${s.bg} border border-gray-200 rounded-xl p-4`}>
              <div className="text-2xl font-serif text-gray-900">{s.value}</div>
              <div className="text-xs text-gray-500 mt-0.5 leading-tight">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400 bg-gray-50/60">
                  <th className="text-left py-3 px-4 font-normal min-w-[240px]">Article</th>
                  <th className="text-left py-3 px-4 font-normal">Category</th>
                  <th className="text-left py-3 px-4 font-normal whitespace-nowrap">Date</th>
                  <th className="text-left py-3 px-4 font-normal">Words</th>
                  <th className="text-left py-3 px-4 font-normal" title="YouTube video">YT</th>
                  <th className="text-left py-3 px-4 font-normal">Status</th>
                  <th className="text-left py-3 px-4 font-normal min-w-[240px]">Issues</th>
                  <th className="py-3 px-4 font-normal w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {items.map((item: ReviewItem) => (
                  <tr
                    key={item.slug}
                    id={item.category}
                    className={`hover:bg-gray-50/60 transition-colors ${
                      !item.published ? 'opacity-50' : ''
                    } ${item.needsRewrite ? 'bg-pink-50/20' : ''}`}
                  >
                    <td className="py-2.5 px-4">
                      <div className="font-medium text-gray-900 leading-snug max-w-[280px] text-sm">{item.title}</div>
                      <div className="text-xs text-gray-400 mt-0.5 truncate max-w-[280px]">{item.slug}</div>
                    </td>
                    <td className="py-2.5 px-4 text-xs text-gray-500 whitespace-nowrap">
                      <span className="capitalize">{item.category.replace(/-/g, ' ')}</span>
                      {item.subcategory && (
                        <div className="text-gray-400 capitalize">{item.subcategory.replace(/-/g, ' ')}</div>
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-xs text-gray-400 whitespace-nowrap">
                      {item.date?.substring(0, 10)}
                    </td>
                    <td className="py-2.5 px-4 text-xs whitespace-nowrap">
                      <span className={item.wordCount < 300 ? 'text-pink-600 font-medium' : item.wordCount < 600 ? 'text-orange-500' : 'text-gray-400'}>
                        {item.wordCount.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-center" title={item.hasYoutube ? 'YouTube video added' : 'No YouTube video yet'}>
                      {item.hasYoutube
                        ? <span className="text-red-500 text-sm">▶</span>
                        : <span className="text-gray-200 text-sm">○</span>
                      }
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs w-fit ${
                          item.reviewed
                            ? 'bg-green-100 text-green-700'
                            : item.autoEnriched
                            ? 'bg-sky-100 text-sky-600'
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {item.reviewed ? '✓ Done' : item.autoEnriched ? '⚡ AI' : 'Pending'}
                        </span>
                        {!item.published && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-500 w-fit">Draft</span>
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="flex gap-1 flex-wrap">
                        {item.issues.length === 0
                          ? <span className="text-xs text-green-500">✓</span>
                          : item.issues.map((issue: string) => (
                            <span
                              key={issue}
                              className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${BADGE[issue] ?? 'bg-gray-100 text-gray-600'}`}
                            >
                              {issue}
                            </span>
                          ))
                        }
                      </div>
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <Link
                        href={item.path}
                        target="_blank"
                        className="text-xs text-gray-300 hover:text-gray-600 transition-colors"
                      >
                        ↗
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-4 text-center">
          Word counts: <span className="text-pink-600">pink = under 300</span> · <span className="text-orange-500">orange = 300–600</span> · gray = 600+
        </p>
      </div>
    </div>
  )
}
