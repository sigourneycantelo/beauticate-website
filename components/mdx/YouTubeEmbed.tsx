'use client'

interface Props {
  url: string
  caption?: string
}

function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:v=|youtu\.be\/|shorts\/)([a-zA-Z0-9_-]{11})/)
  return m ? m[1] : null
}

function isShort(url: string): boolean {
  return url.includes('/shorts/')
}

export default function YouTubeEmbed({ url, caption }: Props) {
  const id = getYouTubeId(url)
  if (!id) return null

  // Shorts are 9:16 — use a taller aspect ratio so the video fills the column
  // without black bars. Regular videos stay 16:9.
  const aspectClass = isShort(url) ? 'aspect-[9/16]' : 'aspect-video'

  return (
    <figure className="my-8">
      <div className={`relative w-full overflow-hidden rounded bg-ink ${aspectClass}`}>
        <iframe
          src={`https://www.youtube.com/embed/${id}`}
          title={caption ?? 'Video'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
      {caption && <figcaption className="text-xs text-charcoal-light mt-2 text-center">{caption}</figcaption>}
    </figure>
  )
}
