import type { Metadata } from 'next'
import Image from 'next/image'
import SuggestForm from '@/components/shop/SuggestForm'

export const metadata: Metadata = {
  title: 'What Should We Be Stocking? | Beauticate Shop',
  description:
    'Tell us which brands and products you want to see in Beauticate Shop. We read every suggestion and chase the ones that keep coming up.',
}

export default function SuggestPage() {
  return (
    <div className="max-w-[600px] mx-auto px-6 py-14 md:py-20">
      <div className="relative aspect-[16/9] mb-10">
        <Image
          src="/images/shop/category-style.jpg"
          alt=""
          fill
          className="object-cover"
        />
      </div>

      <h1
        className="font-serif text-ink text-center"
        style={{ fontSize: 'clamp(28px,4vw,40px)', lineHeight: 1.1 }}
      >
        What Should We Be Stocking?
      </h1>

      <div className="mt-6 mb-10 space-y-4 font-serif text-charcoal-light text-center leading-relaxed" style={{ fontSize: 'clamp(15px,1.4vw,17px)' }}>
        <p>The Shop exists because you asked for it. So keep asking.</p>
        <p>
          If there is a brand you love, a product you cannot live without, or something you wish you
          could buy from us, tell us. We read every one and we chase the ones that keep coming up.
        </p>
      </div>

      <SuggestForm />
    </div>
  )
}
