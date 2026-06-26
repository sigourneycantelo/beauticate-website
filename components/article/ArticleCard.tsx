import Link from 'next/link'
import Image from 'next/image'
import type { ArticleFrontmatter } from '@/types/content'

interface Props {
  frontmatter: ArticleFrontmatter
  href: string
  size?: 'default' | 'large' | 'small'
}

export default function ArticleCard({ frontmatter: f, href, size = 'default' }: Props) {
  return (
    <article className="group">
      <Link href={href} className="block">
        <div className={`relative overflow-hidden bg-cream-100 ${size === 'large' ? 'aspect-[3/2]' : 'aspect-square'}`}>
          {f.featured_image && (
            <Image
              src={f.featured_image}
              alt={f.featured_image_alt ?? f.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              unoptimized={f.featured_image.endsWith('.gif')}
            />
          )}
        </div>
        <div className="mt-3">
          {f.category && (
            <p className="text-xs tracking-widest uppercase text-charcoal-light mb-1">
              {f.category.replace(/-/g, ' ')}
            </p>
          )}
          <h3 className={`font-serif leading-snug group-hover:text-gold transition-colors ${size === 'small' ? 'text-base' : 'text-lg md:text-xl'}`}>
            {f.title}
          </h3>
          {size !== 'small' && f.excerpt && (
            <p className="text-sm text-charcoal-light mt-1 line-clamp-2">{f.excerpt}</p>
          )}
        </div>
      </Link>
    </article>
  )
}
