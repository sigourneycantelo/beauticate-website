import Image from 'next/image'
import Link from 'next/link'

interface Article {
  frontmatter: {
    title: string
    slug: string
    category: string
    subcategory?: string
    excerpt?: string
    featured_image?: string
    featured_image_alt?: string
  }
}

interface Props {
  articles: Article[]
}

function articleHref(f: Article['frontmatter']) {
  return `/${f.category}${f.subcategory ? `/${f.subcategory}` : ''}/${f.slug}`
}

export default function MoreToRead({ articles }: Props) {
  if (!articles.length) return null

  return (
    <section className="border-t border-cream-200 px-[clamp(20px,6vw,104px)] py-[clamp(48px,6vw,82px)]">
      <div className="text-center mb-12">
        <p className="font-sans text-[11px] tracking-[0.34em] uppercase opacity-50">Keep reading</p>
        <h2 className="font-serif font-normal mt-2" style={{ fontSize: 'clamp(24px, 3vw, 38px)' }}>
          More to <em className="italic">explore</em>
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[clamp(20px,2.4vw,34px)]">
        {articles.slice(0, 4).map((a, i) => {
          const f = a.frontmatter
          return (
            <Link key={i} href={articleHref(f)} className="group block">
              <div className="relative overflow-hidden rounded-[2px] border border-cream-200 aspect-[4/5]">
                {f.featured_image ? (
                  <Image
                    src={f.featured_image}
                    alt={f.featured_image_alt ?? f.title}
                    fill
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#cdc4bb] to-[#8f857b]" />
                )}
              </div>
              <span className="font-serif italic text-[15px] opacity-70 block mt-3.5 mb-1.5">
                {(f.subcategory ?? f.category).replace(/-/g, ' ')}
              </span>
              <h3 className="font-serif font-normal text-[20px] leading-[1.16]">{f.title}</h3>
            </Link>
          )
        })}
      </div>

      <div className="text-center mt-10">
        <Link
          href="/beauty-style"
          className="inline-block font-sans text-[10.5px] tracking-[0.2em] uppercase border border-ink px-7 py-3 rounded-[1px] hover:bg-ink hover:text-white transition-colors duration-300"
        >
          Explore the magazine
        </Link>
      </div>
    </section>
  )
}
