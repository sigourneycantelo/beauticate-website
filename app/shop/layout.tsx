import ShopSubNav from '@/components/shop/ShopSubNav'
import AnnouncementBar from '@/components/layout/AnnouncementBar'

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnnouncementBar message="Beauticate Shop is in beta — your feedback shapes what we build next. Get in touch →" href="/contact" />
      <ShopSubNav />
      {children}
    </>
  )
}
