import Link from 'next/link'

const BRANDS = [
  'Archer Farrar Perfume Atelier', 'Basics by B', 'Booie Beauty',
  'Christophe Robin', 'JSHealth Vitamins', 'Lumira',
  'Maison Balzac', 'Mukti Organics', 'Subtle Energies',
  'Tulita Parfum', 'Sunescape', 'Lamav',
]

export default function BrandGrid() {
  return (
    <section className="max-w-wide mx-auto px-4 py-12 border-t border-cream-200">
      <h2 className="mb-8">Shop by Brand</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {BRANDS.map(brand => (
          <Link
            key={brand}
            href={`/shop/brands/${brand.toLowerCase().replace(/\s+/g, '-')}`}
            className="border border-cream-200 p-4 text-sm text-center hover:border-gold hover:text-gold transition-colors"
          >
            {brand}
          </Link>
        ))}
      </div>
    </section>
  )
}
