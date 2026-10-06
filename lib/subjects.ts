import type { Subject } from '@/types/content'
import subjectMap from '@/data/article-subjects.json'

/**
 * The people a story (or podcast episode) is about, as Person structured data.
 *
 * Two sources, frontmatter first:
 *   1. `subjects:` in the story's own frontmatter, for new stories.
 *   2. data/article-subjects.json, keyed `<category>/<subcategory>/<slug>`, for
 *      the back catalogue (~370 interviews and every podcast guest), so that
 *      backfill did not mean editing 400 MDX files other people are editing.
 *
 * A story with no entry gets nothing. We never infer a subject from a title:
 * "The jewellery designer very into skincare" names nobody, and the archive's
 * beauty-icon pieces (Diana, Stevie Nicks...) are not interviews, so the
 * subject has to be stated by a person who read the piece.
 */

const MAP = subjectMap as Record<string, Subject[]>

type SubjectSource = { category?: string; subcategory?: string; slug?: string; subjects?: Subject[] }

export function resolveSubjects(f: SubjectSource): Subject[] {
  if (f.subjects?.length) return f.subjects
  if (!f.category || !f.subcategory || !f.slug) return []
  return MAP[`${f.category}/${f.subcategory}/${f.slug}`] ?? []
}

export function slugifyName(name: string): string {
  return name
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Same person, same @id, on every page that mentions them. That is the point:
 * a crawler reading ten Lady Gaga stories should resolve one entity, not ten.
 * It lives on the home page fragment because we have no people pages to point
 * at, and an @id only has to be stable, not dereferenceable.
 */
export function subjectId(name: string, siteUrl: string): string {
  return `${siteUrl}/#person-${slugifyName(name)}`
}

export function buildSubjectNodes(subjects: Subject[], siteUrl: string): Record<string, unknown>[] {
  return subjects.map(s => ({
    '@type': 'Person',
    '@id': subjectId(s.name, siteUrl),
    name: s.name,
    ...(s.job_title ? { jobTitle: s.job_title } : {}),
    ...(s.same_as?.length ? { sameAs: s.same_as } : {}),
  }))
}
