import type { ArticleFrontmatter } from '@/types/content'

/**
 * Which hero treatment an article gets.
 *
 * Two layouts:
 *   full  — the image runs full width at 1200px, and the headline, standfirst
 *           and byline sit underneath it. The default for an article with a
 *           landscape `hero_image`; force it with `hero_layout: "full"`.
 *   split — the editorial split: image on one side, greige panel on the other
 *           carrying the breadcrumb, headline, standfirst and byline. The default
 *           when there is no `hero_image`; opt in explicitly with
 *           `hero_layout: "split"`.
 *
 * An article with no image at all has always used the split panel, since there
 * is nothing to run full-bleed — that behaviour is unchanged.
 *
 * Both ArticleHero and ArticlePage need this answer and must agree on it:
 * ArticleHero decides which hero to draw, and ArticlePage uses it to suppress
 * its own title block in split mode, where the hero panel already carries the
 * headline. Keep the two in step by calling this rather than re-deriving it.
 */
export function usesSplitHero(f: Pick<ArticleFrontmatter, 'hero_layout' | 'hero_image' | 'hero_video' | 'featured_image'>): boolean {
  if (f.hero_layout === 'split') return true
  if (f.hero_layout === 'full') return !(f.hero_image || f.featured_image)
  // Unset: full-bleed only when there is a real landscape holding shot. Without
  // one the full layout stretches the portrait thumbnail across 1200px, which
  // is the fuzzy banner on ~1,700 articles. Split is the safe default.
  return !(f.hero_image || f.hero_video)
}
