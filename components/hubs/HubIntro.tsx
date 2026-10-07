import Image from 'next/image'
import Link from 'next/link'
import { getArticleBySlug } from '@/lib/content'
import { buildHubSchema, type Hub } from '@/lib/hubs'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.beauticate.com'

/** Renders [label](/path) inline links and nothing else. */
function Inline({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g)
  return (
    <>
      {parts.map((p, i) => {
        const m = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
        return m ? (
          <Link key={i} href={m[2]} className="underline decoration-wine/40 underline-offset-4 hover:text-wine">
            {m[1]}
          </Link>
        ) : (
          <span key={i}>{p}</span>
        )
      })}
    </>
  )
}

const PAD = 'clamp(20px,6vw,104px)'

/**
 * The pillar block above a category or subcategory grid. All text is plain
 * server-rendered HTML (the FAQ is deliberately not an accordion: answers a
 * reader has to click to reveal are text Google may discount). Thumbnails use
 * the same 4:5 card as the contents pages.
 */
export default function HubIntro({ hub }: { hub: Hub }) {
  const picks = hub.startHere
    .map(path => {
      const article = getArticleBySlug(path.split('/'))
      if (!article || article.frontmatter.published === false) return null
      const f = article.frontmatter
      return {
        href: `/${path}`,
        title: f.title as string,
        label: path.split('/')[1].replace(/-/g, ' '),
        src: (f.thumbnailPortrait ?? f.featured_image) as string | undefined,
        alt: (f.thumbnailPortrait_alt ?? f.featured_image_alt ?? f.title) as string,
      }
    })
    .filter((p): p is NonNullable<typeof p> => p !== null)

  const schema = buildHubSchema(
    hub,
    picks.map(p => ({ name: p.title, url: `${SITE_URL}${p.href}` })),
  )

  return (
    <section aria-label={hub.eyebrow}>
      {/* Plain <script>, not next/script: next/script withholds JSON-LD from the served HTML. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* Direct answer + body */}
      <div className="text-center" style={{ padding: `clamp(24px,3vw,40px) ${PAD} 0` }}>
        <span className="block font-sans text-[11px] tracking-[0.34em] uppercase font-medium" style={{ opacity: 0.5 }}>
          {hub.eyebrow}
        </span>
        <p
          className="font-serif text-ink mx-auto mt-4 max-w-3xl leading-snug"
          style={{ fontSize: 'clamp(20px,2.1vw,27px)' }}
        >
          {hub.answer}
        </p>
        <div className="mx-auto mt-6 max-w-2xl space-y-4 text-left">
          {hub.body.map((para, i) => (
            <p key={i} className="font-serif text-base md:text-lg text-charcoal/75 leading-relaxed">
              <Inline text={para} />
            </p>
          ))}
        </div>
      </div>

      {/* Start here: thumbnail cards, same 4:5 card as the contents pages */}
      {picks.length > 0 && (
        <div style={{ padding: `clamp(28px,4vw,52px) ${PAD} 0` }}>
          <h2 className="text-center font-serif font-normal" style={{ fontSize: 'clamp(24px,3vw,36px)' }}>
            {hub.startHereTitle}
          </h2>
          <div
            className={`mt-6 grid grid-cols-2 items-start ${picks.length % 4 !== 0 && picks.length % 3 === 0 ? 'md:grid-cols-3' : 'md:grid-cols-4'}`}
            style={{ gap: 'clamp(16px,2.4vw,36px)' }}
          >
            {picks.map(p => (
              <article key={p.href}>
                <Link href={p.href} className="block group">
                  <div className="relative overflow-hidden rounded-[2px] aspect-[4/5] mb-3">
                    {p.src ? (
                      <Image
                        src={p.src}
                        alt={p.alt}
                        fill
                        className="object-cover object-[50%_20%] transition-transform duration-700 group-hover:scale-[1.04]"
                        sizes="(max-width:768px) 50vw, 22vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-cream-100" />
                    )}
                  </div>
                  <span className="block font-sans text-[10px] tracking-[.22em] uppercase font-medium text-charcoal-light mb-1.5">
                    {p.label}
                  </span>
                  <h3
                    className="font-serif font-normal text-ink leading-[1.2] group-hover:text-wine transition-colors"
                    style={{ fontSize: 'clamp(17px,1.4vw,20px)' }}
                  >
                    {p.title}
                  </h3>
                </Link>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* Browse by */}
      {hub.browse && (
        <nav
          aria-label="Browse by"
          className="flex flex-wrap justify-center gap-x-6 gap-y-2"
          style={{ padding: `clamp(24px,3vw,40px) ${PAD} 0` }}
        >
          {hub.browse.map(b => (
            <Link
              key={b.href}
              href={b.href}
              className="font-sans text-[11px] tracking-[0.2em] uppercase text-charcoal border-b border-charcoal/30 pb-0.5 hover:text-wine hover:border-wine transition-colors"
            >
              {b.label}
            </Link>
          ))}
        </nav>
      )}

      {/* FAQ: always-visible text, not an accordion */}
      <div style={{ padding: `clamp(32px,4vw,56px) ${PAD} clamp(8px,2vw,24px)` }}>
        <h2 className="text-center font-serif font-normal" style={{ fontSize: 'clamp(22px,2.4vw,30px)' }}>
          Common questions
        </h2>
        <dl className="mx-auto mt-6 grid max-w-5xl gap-x-12 gap-y-6 md:grid-cols-2">
          {hub.faqs.map(f => (
            <div key={f.question} className="border-t border-charcoal/15 pt-4">
              <dt className="font-serif text-lg text-ink">{f.question}</dt>
              <dd className="mt-1 font-serif text-base text-charcoal/75 leading-relaxed">
                <Inline text={f.answer} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
