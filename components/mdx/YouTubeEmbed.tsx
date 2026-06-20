'use client'

interface Props {
  url: string
  caption?: string
}

function getYouTubeId(url: string): string | null {
  // Handles: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/shorts/ID
  const m = url.match(/(?:v=|youtu\.be\/|shorts\/)([a-zA-Z0-9_-]{11})/)
  return m ? m[1] : null
}

export default function YouTubeEmbed({ url, caption }: Props) {
  const id = getYouTubeId(url)
  if (!id) return null
  return (
    <figure className="my-8">
      <div className="relative w-full aspect-video rounded overflow-hidden bg-ink">
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
