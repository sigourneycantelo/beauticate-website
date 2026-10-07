'use client'

interface Props {
  url: string
  caption?: string
}

function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:v=|youtu\.be\/|shorts\/)([a-zA-Z0-9_-]{11})/)
  return m ? m[1] : null
}

export default function YouTubeEmbed({ url, caption }: Props) {
  const id = getYouTubeId(url)
  if (!id) return null
  const isShort = url.includes('/shorts/')

  return (
    <figure className={`my-8 ${isShort ? 'flex flex-col items-center' : ''}`}>
      <div
        className="relative overflow-hidden rounded bg-ink"
        style={isShort ? { width: '100%', maxWidth: '380px', aspectRatio: '9/16' } : { width: '100%', aspectRatio: '16/9' }}
      >
        <iframe
          src={`https://www.youtube.com/embed/${id}`}
          title={caption ?? 'Video'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          // An embed in an article body is almost never the first thing on screen.
          // Without this every embed pulled its whole player (~1.2 MB of JS) at page
          // load, ahead of the hero image that is the page's LCP.
          loading="lazy"
          className="absolute inset-0 w-full h-full"
        />
      </div>
      {caption && <figcaption className="text-xs text-charcoal-light mt-2 text-center">{caption}</figcaption>}
    </figure>
  )
}
