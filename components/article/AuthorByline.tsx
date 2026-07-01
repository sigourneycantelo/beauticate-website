import Image from 'next/image'
import { getAuthor } from '@/lib/authors'

interface Props {
  name: string
  date: string
  readingTime?: number
  affiliateDisclosure?: boolean
  showDate?: boolean
  /** ISO date — when set, surfaces a visible "Last updated {Month Year}" freshness cue. */
  lastUpdated?: string
}

export default function AuthorByline({ name, date, readingTime, affiliateDisclosure, showDate = false, lastUpdated }: Props) {
  const author = getAuthor(name)
  const displayName = author?.name ?? name
  const role = author?.role
  const photo = author?.photo

  const formattedDate = new Date(date).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const formattedUpdated = lastUpdated
    ? new Date(lastUpdated).toLocaleDateString('en-AU', { month: 'long', year: 'numeric' })
    : undefined

  return (
    <div className="flex items-center gap-3 text-xs text-charcoal-light mb-10 pb-6 border-b border-cream-200">
      {photo && (
        <div className="relative shrink-0 w-16 h-16 rounded-full overflow-hidden ring-1 ring-cream-200">
          <Image
            src={photo}
            alt={displayName}
            fill
            sizes="64px"
            className="object-cover object-top scale-[1.6]"
          />
        </div>
      )}
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="font-medium text-charcoal leading-none">
          {displayName}
          {role && <span className="font-normal text-charcoal-light"> — {role}</span>}
        </span>
        <div className="flex items-center gap-3 text-[11px]">
          {showDate && <span>{formattedDate}</span>}
          {formattedUpdated && <span>Last updated {formattedUpdated}</span>}
          {readingTime && <span>{readingTime} min read</span>}
          {affiliateDisclosure && <span className="text-gold">Affiliate links</span>}
        </div>
      </div>
    </div>
  )
}
