import Image from 'next/image'
import Link from 'next/link'
import type { EditorNote } from '@/data/pdp-editors-notes'
import type { ArticleFrontmatter } from '@/types/content'

interface ArticleThumb {
  title: string
  slug: string
  type: 'interview' | 'editorial' | 'vodcast'
  image?: string
}

interface Props {
  note: EditorNote
  articles: ArticleThumb[]
}

function renderNoteWithMentions(text: string, mentions: EditorNote['mentions']) {
  if (mentions.length === 0) return text

  const parts: (string | { name: string; href: string })[] = []
  let remaining = text
  for (const m of mentions) {
    const placeholder = `{${m.name}}`
    const idx = remaining.indexOf(placeholder)
    if (idx === -1) continue
    if (idx > 0) parts.push(remaining.slice(0, idx))
    parts.push(m)
    remaining = remaining.slice(idx + placeholder.length)
  }
  if (remaining) parts.push(remaining)

  return parts.map((part, i) =>
    typeof part === 'string' ? (
      <span key={i}>{part}</span>
    ) : (
      <Link
        key={i}
        href={part.href}
        className="text-terracotta font-medium border-b border-terracotta/30 hover:border-terracotta/60 transition-colors"
      >
        {part.name}
      </Link>
    )
  )
}

export default function PDPEditorNote({ note, articles }: Props) {
  return (
    <section className="mt-[clamp(40px,6vw,72px)] mb-[clamp(24px,4vw,48px)]">
      <div className="max-w-[720px] mx-auto">
        <p className="font-sans text-[11px] tracking-[0.3em] uppercase text-eucalypt font-semibold mb-6">
          Editor's note
        </p>

        <div className="flex gap-[clamp(16px,2.5vw,28px)]">
          <div className="flex-none w-10 pt-1">
            <div className="w-10 h-10 rounded-full bg-cream-200 overflow-hidden">
              <Image
                src="/images/authors/sigourney-cantelo.jpg"
                alt={note.author}
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-sans text-[13px] text-charcoal-light mb-3">
              <span className="font-medium text-ink">{note.author}</span>
              {' '}<span className="opacity-60">{note.authorTitle}</span>
            </p>
            <p className="font-serif text-[15.5px] leading-[1.75] text-charcoal">
              {renderNoteWithMentions(note.note, note.mentions)}
            </p>
          </div>
        </div>

        {articles.length > 0 && (
          <div className="mt-8 pt-6 border-t border-cream-200">
            <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-charcoal-light mb-4">
              As seen in
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-[clamp(12px,1.6vw,20px)]">
              {articles.map((a) => (
                <Link
                  key={a.slug}
                  href={`/${a.slug}`}
                  className="group block"
                >
                  <div className="relative aspect-[3/4] bg-cream-100 rounded-sm overflow-hidden mb-2">
                    {a.image && (
                      <Image
                        src={a.image}
                        alt={a.title}
                        fill
                        sizes="(min-width: 640px) 200px, 45vw"
                        className="object-cover object-[50%_20%] transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    )}
                  </div>
                  <p className="font-serif text-[13px] leading-snug text-ink group-hover:underline group-hover:[text-decoration-thickness:0.5px] group-hover:[text-underline-offset:3px]">
                    {a.title}
                  </p>
                  <p className="font-sans text-[10px] tracking-[0.12em] uppercase text-charcoal-light mt-1">
                    {a.type}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
