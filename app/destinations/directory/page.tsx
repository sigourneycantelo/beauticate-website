import { Suspense } from 'react'
import { getDirectoryListings } from '@/lib/content'
import DirectoryClient from './DirectoryClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'The Beauty & Wellness Directory — Beauticate',
  description: 'The spas, salons, skin clinics and bathhouses we actually rate, all around Australia.',
}

export default function DirectoryPage() {
  const allListings = getDirectoryListings()

  const venues = allListings.map(a => ({
    title: a!.frontmatter.title,
    slug: a!.frontmatter.slug,
    category: a!.frontmatter.category,
    subcategory: a!.frontmatter.subcategory,
    venueType: a!.frontmatter.venueType ?? 'spa',
    state: a!.frontmatter.state ?? '',
    image: a!.frontmatter.featured_image ?? '',
    imageAlt: a!.frontmatter.featured_image_alt ?? a!.frontmatter.title,
    verdict: a!.frontmatter.verdict ?? '',
    isFeatured: a!.frontmatter.is_featured ?? false,
  }))

  return (
    <Suspense>
      <DirectoryClient venues={venues} />
    </Suspense>
  )
}
