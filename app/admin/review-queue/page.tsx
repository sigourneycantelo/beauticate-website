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
  readingTime?: number
  issues: string[]
  path: string
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

      const issues: string[] = []
      if (!f.meta_description && !f.seo_description) issues.push('meta_description')
      if (!f.seo_title) issues.push('seo_title')
      if (!f.featured_image) issues.push('hero image')
      const hasFaqs = f.faqs && f.faqs.length > 0
      if (!hasFaqs) issues.push('faqs')
      else if (autoFaqs && !f.reviewed) issues.push('faqs: ai draft')

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
}

export default function ReviewQueuePage() {
  const items = getReviewItems()
  const needsReview = items.filter(i => i.issues.length > 0 || !i.reviewed)
  const ready = items.filter(i => i.reviewed && i.issues.length === 0)
  const unpublished = items.filter(i => !i.published)
  const aiDrafted = items.filter(i => i.autoFaqs && !i.reviewed)

  const stats = [
    { label: 'Total articles', value: items.length, bg: 'bg-white' },
    { label: 'Needs attention', value: needsReview.length, bg: 'bg-red-50' },
    { label: 'AI FAQs to review', value: aiDrafted.length, bg: 'bg-sky-50' },
    { label: 'Ready to publish', value: ready.length, bg: 'bg-green-50' },
    { label: 'Unpublished (no image)', value: unpublished.length, bg: 'bg-gray-50' },
  ]

  return (
    <div className="min-h-screen bg-[#f7f6f4] p-6 md:p-10">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl text-gray-900 mb-1">Content Review Queue</h1>
          <p className="text-sm text-gray-400">
            Beauticate editorial dashboard · {items.length} articles total
          </p>
        </div>

        {/* How to use this page */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8 text-sm text-amber-900">
          <strong className="font-medium">How to use this dashboard:</strong>
          <ul className="mt-2 space-y-1 list-disc list-inside text-amber-800">
            <li>Rows with <span className="inline-block px-1.5 py-0.5 rounded bg-sky-100 text-sky-700 text-xs">faqs: ai draft</span> = Claude wrote the FAQs — check they're accurate and on-brand</li>
            <li>Rows with <span className="inline-block px-1.5 py-0.5 rounded bg-red-100 text-red-700 text-xs">meta_description</span> = needs SEO copy before publishing</li>
            <li>Rows with <span className="inline-block px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 text-xs">hero image</span> = article set to draft — add an image and it auto-publishes</li>
            <li>Once happy with an article, add <code className="bg-amber-100 px-1 rounded">reviewed: true</code> to its MDX frontmatter to mark it complete</li>
          </ul>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
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
                  <th className="text-left py-3 px-4 font-normal min-w-[260px]">Article</th>
                  <th className="text-left py-3 px-4 font-normal">Category</th>
                  <th className="text-left py-3 px-4 font-normal whitespace-nowrap">Published</th>
                  <th className="text-left py-3 px-4 font-normal">Read</th>
                  <th className="text-left py-3 px-4 font-normal" title="YouTube video added">YT</th>
                  <th className="text-left py-3 px-4 font-normal">Status</th>
                  <th className="text-left py-3 px-4 font-normal min-w-[220px]">Needs</th>
                  <th className="py-3 px-4 font-normal w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {items.map((item: ReviewItem) => (
                  <tr
                    key={item.slug}
                    className={`hover:bg-gray-50/60 transition-colors ${!item.published ? 'opacity-60' : ''}`}
                  >
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900 leading-snug max-w-xs">{item.title}</div>
                      <div className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{item.slug}</div>
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-500 whitespace-nowrap">
                      <span>{item.category}</span>
                      {item.subcategory && <><span className="text-gray-300 mx-1">/</span><span className="text-gray-400">{item.subcategory}</span></>}
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-400 whitespace-nowrap">
                      {item.date?.substring(0, 10)}
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-400 whitespace-nowrap">
                      {item.readingTime ? `${item.readingTime} min` : '—'}
                    </td>
                    <td className="py-3 px-4 text-center" title={item.hasYoutube ? 'YouTube video added' : 'No YouTube video yet'}>
                      {item.hasYoutube
                        ? <span className="text-red-500 text-sm">▶</span>
                        : <span className="text-gray-200 text-sm" title="Add youtube_embed to frontmatter">○</span>
                      }
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs w-fit ${
                          item.reviewed
                            ? 'bg-green-100 text-green-700'
                            : item.autoEnriched
                            ? 'bg-sky-100 text-sky-600'
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {item.reviewed ? '✓ Reviewed' : item.autoEnriched ? '⚡ AI-enriched' : 'Pending'}
                        </span>
                        {!item.published && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-500 w-fit">Draft</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1 flex-wrap">
                        {item.issues.length === 0
                          ? <span className="text-xs text-green-500">All good ✓</span>
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
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={item.path}
                        target="_blank"
                        className="text-xs text-gray-300 hover:text-gray-600 transition-colors"
                        title="View article"
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

        {/* Footer legend */}
        <div className="mt-6 flex flex-wrap gap-4 text-xs text-gray-400">
          <span>Badges: <span className="text-red-600">red</span> = missing SEO field · <span className="text-orange-600">orange</span> = missing SEO title · <span className="text-purple-600">purple</span> = no hero image · <span className="text-yellow-600">yellow</span> = no FAQs · <span className="text-sky-600">blue</span> = AI-drafted FAQs need checking</span>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Add <code className="bg-gray-100 px-1 rounded">reviewed: true</code> to MDX frontmatter to mark an article complete. Remove <code className="bg-gray-100 px-1 rounded">auto_faqs: true</code> once you've verified the FAQs.
        </p>
      </div>
    </div>
  )
}
