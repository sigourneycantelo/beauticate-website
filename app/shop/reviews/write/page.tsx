import Link from 'next/link'
import type { Metadata } from 'next'
import { getProductByHandle } from '@/lib/shopify'
import { cleanProductTitle } from '@/lib/product-format'
import { productIdFromGid } from '@/lib/judgeme'
import { GIFT_HANDLES } from '@/lib/gwp'
import ReviewForm from '@/components/shop/ReviewForm'

const SITE = 'https://www.beauticate.com'

export const metadata: Metadata = {
  title: 'Write a review | Beauticate Shop',
  description: 'Tell us what you thought of something you bought from the Beauticate shop.',
  alternates: { canonical: `${SITE}/shop/reviews/write` },
  // A form page has nothing to offer search, and indexing it invites
  // submissions from people who never came from a product.
  robots: { index: false, follow: true },
}

interface Props {
  searchParams: Promise<{ product?: string }>
}

export default async function WriteReviewPage({ searchParams }: Props) {
  const { product: handle } = await searchParams

  // Gift SKUs have no product page (see lib/gwp.ts), so they get no review form
  // either — a review there could never be displayed anywhere.
  const product = handle && !GIFT_HANDLES.includes(handle) ? await getProductByHandle(handle) : null
  const productId = productIdFromGid(product?.id)

  return (
    <div className="max-w-wide mx-auto px-[clamp(16px,5vw,64px)] py-[clamp(32px,6vw,72px)]">
      <nav aria-label="Breadcrumb" className="font-sans text-[11px] tracking-[0.08em] text-charcoal-light mb-8">
        <Link href="/" className="hover:text-ink transition-colors">Home</Link>
        <span className="mx-2 opacity-40">/</span>
        <Link href="/shop" className="hover:text-ink transition-colors">Shop</Link>
        <span className="mx-2 opacity-40">/</span>
        <span className="text-ink">Write a review</span>
      </nav>

      <div className="max-w-[640px] mx-auto">
        <div className="text-center mb-10">
          <p className="font-sans text-[11px] tracking-[0.34em] uppercase text-eucalypt font-semibold mb-3">
            Write a review
          </p>
          {product && productId ? (
            <>
              <h1 className="font-serif font-normal leading-[1.15]" style={{ fontSize: 'clamp(26px,3.4vw,38px)' }}>
                {cleanProductTitle(product.title)}
              </h1>
              <p className="font-sans text-[10.5px] tracking-[0.22em] uppercase font-semibold opacity-60 mt-3">
                {product.vendor}
              </p>
            </>
          ) : (
            <h1 className="font-serif font-normal leading-[1.15]" style={{ fontSize: 'clamp(26px,3.4vw,38px)' }}>
              Tell us what you thought
            </h1>
          )}
        </div>

        {product && productId ? (
          <ReviewForm
            productId={productId}
            productTitle={cleanProductTitle(product.title)}
            productHandle={product.handle}
          />
        ) : (
          // Without a product there is nothing to attach a review to — Judge.me
          // would file it as a review of the shop, which would never appear on
          // the page the reader expected. Send them to pick one instead.
          <div className="text-center">
            <p className="font-serif text-[16px] leading-[1.6] text-charcoal-light">
              Open the product you&rsquo;d like to review and choose{' '}
              <em className="italic">Write a review</em> from its page, so your words land in
              the right place.
            </p>
            <Link
              href="/shop"
              className="inline-block mt-6 font-sans text-[10.5px] tracking-[0.18em] uppercase font-semibold text-ink border-b border-ink/40 pb-1 hover:border-ink transition-colors"
            >
              Browse the shop
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
