import { getVodcastEpisodes } from '@/lib/content'
import VodcastPage from '@/components/article/VodcastPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Vodcast — Beautiful Inside by Beauticate',
  description: 'Join Sigourney Cantelo for conversations with the people, experts and thought leaders shaping beauty, wellness and the way we live.',
}

export default async function Vodcast() {
  const episodes = getVodcastEpisodes()
  return <VodcastPage episodes={episodes} />
}
