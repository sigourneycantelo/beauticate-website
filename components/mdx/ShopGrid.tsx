interface ShopItemProps {
  image: string
  name: string
  price?: string
  url: string
}

export function ShopItem({ image, name, price, url }: ShopItemProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="group block"
    >
      <div className="relative w-full aspect-square bg-cream-100 overflow-hidden mb-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <p className="text-[11px] leading-tight text-charcoal font-medium line-clamp-2 mb-0.5">{name}</p>
      {price && <p className="text-[11px] text-charcoal-light">{price}</p>}
    </a>
  )
}

interface ShopGridProps {
  children: React.ReactNode
}

export function ShopGrid({ children }: ShopGridProps) {
  return (
    <div className="not-prose grid grid-cols-3 gap-3 my-6">
      {children}
    </div>
  )
}
