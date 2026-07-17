import Image from 'next/image'

interface Props {
  title?: string
  label?: string
  productImage?: string
  productName?: string
  productPrice?: string
  productUrl?: string
  /** Shopify product handle — links to our own PDP at /shop/products/{handle} */
  handle?: string
  /** Override the default link label ("Shop now" / "In our shop") */
  linkLabel?: string
  children: React.ReactNode
}

/**
 * Boxed "Editor's Note" callout — an editorial aside with its own blurb and a
 * single product card (image + name + price + buy link). Distinct from the
 * inline `*Editor's Note:*` italic style used elsewhere.
 */
export default function EditorNote({
  title,
  label = "Editor's Note",
  productImage,
  productName,
  productPrice,
  productUrl,
  handle,
  linkLabel,
  children,
}: Props) {
  const href = handle ? `/shop/products/${handle}` : productUrl
  const isInternal = !!handle || (!!productUrl && productUrl.startsWith('/'))
  const shopLabel = linkLabel ?? (handle ? 'In our shop' : 'Shop now ↗')

  return (
    <aside className="not-prose my-12 border border-cream-200 bg-parchment p-6 sm:p-8">
      <p className="font-sans text-[11px] tracking-[0.3em] uppercase text-wine mb-3">
        {label}
      </p>
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
        <div className="flex-1">
          {title && <h3 className="font-serif text-2xl leading-snug mb-3">{title}</h3>}
          <div className="text-[15px] text-charcoal-light leading-relaxed [&_p]:mb-3 [&_p:last-child]:mb-0">
            {children}
          </div>
        </div>

        {productImage && href && (
          <a
            href={href}
            {...(!isInternal && { target: '_blank', rel: 'sponsored noopener' })}
            className="group block w-full sm:w-[180px] flex-none text-center"
          >
            <div className={`relative ${handle ? 'aspect-square' : 'aspect-[3/4]'} bg-white rounded-sm overflow-hidden mb-2`}>
              <Image
                src={productImage}
                alt={productName ?? ''}
                fill
                sizes="180px"
                className={`${handle ? 'object-contain p-2' : 'object-cover'} transition-transform duration-500 group-hover:scale-[1.04]`}
              />
            </div>
            {productName && (
              <p className="font-serif text-sm leading-tight group-hover:underline group-hover:[text-decoration-thickness:0.5px] group-hover:[text-underline-offset:3px]">
                {productName}
              </p>
            )}
            {productPrice && (
              <p className="font-sans text-xs text-charcoal-light mt-0.5">{productPrice}</p>
            )}
            <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-wine mt-1.5">
              {shopLabel}
            </p>
          </a>
        )}
      </div>
    </aside>
  )
}
