import type { ArticleFrontmatter } from '@/types/content'

/**
 * Which hero treatment an article gets.
 *
 * Two layouts:
 *   full  — the image runs full width at 1200px, and the headline, standfirst
 *           and byline sit underneath it. This is the default for any article
 *           that has an image.
 *   split — the editorial split: image on one side, greige panel on the other
 *           carrying the breadcrumb, headline, standfirst and byline. Opt in
 *           per article with `hero_layout: "split"` in the frontmatter.
 *
 * An article with no image at all has always used the split panel, since there
 * is nothing to run full-bleed — that behaviour is unchanged.
 *
 * Both ArticleHero and ArticlePage need this answer and must agree on it:
 * ArticleHero decides which hero to draw, and ArticlePage uses it to suppress
 * its own title block in split mode, where the hero panel already carries the
 * headline. Keep the two in step by calling this rather than re-deriving it.
 */
export function usesSplitHero(f: Pick<ArticleFrontmatter, 'hero_layout' | 'hero_image' | 'featured_image'>): boolean {
  if (f.hero_layout === 'split') return true
  return !(f.hero_image || f.featured_image)
}
