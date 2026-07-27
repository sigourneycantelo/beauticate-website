import { getCollectionByHandle } from '@/lib/shopify'
import AutoScrollRail from './AutoScrollRail'

interface Props { handle: string; title?: string }

/**
 * MDX-friendly wrapper: fetches a Shopify collection by handle on the server
 * and feeds it into the client-side auto-scrolling rail. Use in articles as
 * <CollectionRail handle="editors-essentials" title="Editor's Essentials" />.
 */
export default async function CollectionRail({ handle, title }: Props) {
  const collection = await getCollectionByHandle(handle)
  if (!collection) return null
  const products = collection.products?.nodes ?? []
  if (!products.length) return null

  return <AutoScrollRail products={products} handle={handle} title={title ?? collection.title} />
}
