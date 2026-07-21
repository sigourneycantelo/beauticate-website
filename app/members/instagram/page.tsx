import type { Metadata } from 'next'
import InstagramForm from './InstagramForm'

export const metadata: Metadata = {
  title: "Instagram Points — Members’ Club — Beauticate",
  description: "Submit your Instagram tag or follow for Members’ Club points.",
}

export default function InstagramPointsPage() {
  return (
    <main className="py-20 md:py-28 px-6">
      <div className="max-w-[540px] mx-auto">
        <div className="text-center mb-12">
          <span className="block font-sans text-[11px] tracking-[0.34em] uppercase font-medium opacity-50 mb-3">
            Earn Points
          </span>
          <h1
            className="font-serif font-normal"
            style={{ fontSize: 'clamp(24px, 3vw, 36px)' }}
          >
            Instagram submission
          </h1>
          <p className="font-serif mt-4 opacity-70 text-[15px] leading-relaxed max-w-[440px] mx-auto">
            Tagged us or followed? Submit the details below and our team will
            verify and add your points within the week.
          </p>
        </div>
        <InstagramForm />
      </div>
    </main>
  )
}
