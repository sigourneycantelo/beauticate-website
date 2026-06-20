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
  const short = isShort(url)

  return (
    <figure className={`my-8 ${short ? 'flex flex-col items-center' : ''}`}>
      <div className={`relative overflow-hidden rounded bg-ink ${short ? 'w-full max-w-[340px] aspect-[9/16]' : 'w-full aspect-video'}`}>
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
