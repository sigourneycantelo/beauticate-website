import { GWP } from '@/lib/gwp'

/**
 * The gift-with-purchase pitch, shown on a qualifying brand's product pages
 * before anything is in the cart — the promotion only works as a reason to buy
 * if the reader knows about it while they are still deciding.
 *
 * Rendered only when the gift is genuinely in stock (the caller checks), so the
 * offer disappears the moment the 22 units are gone rather than promising
 * something the cart will then quietly decline to add.
 */
export default function GiftBanner() {
  return (
    <div className="mt-5 border border-eucalypt/30 bg-eucalypt/[0.06] rounded-[2px] px-4 py-3">
      <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-eucalypt font-semibold">
        {GWP.badge}
      </p>
      <p className="font-serif text-charcoal mt-1.5" style={{ fontSize: '14px', lineHeight: 1.45 }}>
        {GWP.pitch}
      </p>
      <p className="font-sans text-[10px] tracking-[0.06em] text-charcoal-light/70 mt-1.5">
        Added to your cart automatically. While stocks last.
      </p>
    </div>
  )
}
