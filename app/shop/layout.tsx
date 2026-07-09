import ShopSubNav from '@/components/shop/ShopSubNav'

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ShopSubNav />
      {children}
    </>
  )
}
