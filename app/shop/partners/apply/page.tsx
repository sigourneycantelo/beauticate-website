import type { Metadata } from 'next'
import Image from 'next/image'
import BrandApplyForm from '@/components/shop/BrandApplyForm'

export const metadata: Metadata = {
  title: 'Apply to Partner | Beauticate Shop',
  robots: 'noindex, nofollow',
}

export default function ApplyPage() {
  return (
    <div className="max-w-wide mx-auto px-6 py-14 md:py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
        {/* Left — intro + image */}
        <div>
          <h1
            className="font-serif text-ink"
            style={{ fontSize: 'clamp(32px,4vw,48px)', lineHeight: 1.1 }}
          >
            Be Part of the Shop
          </h1>
          <div className="mt-6 space-y-4 font-serif text-charcoal-light leading-relaxed" style={{ fontSize: 'clamp(15px,1.4vw,17px)' }}>
            <p>
              Beauticate Shop is editorially curated. Every brand in it has been chosen, not listed.
              We work with a small number of partners at a time so that each one gets the storytelling
              it deserves.
            </p>
            <p>
              If you think your brand belongs here, tell us about it. We review every submission as a
              team and we come back to the brands that feel like a fit.
            </p>
          </div>
          <div className="mt-10 relative aspect-[3/4] max-w-[420px]">
            <Image
              src="/images/shop/category-beauty.jpg"
              alt=""
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Right — form */}
        <div className="md:pt-4">
          <BrandApplyForm />
        </div>
      </div>
    </div>
  )
}
