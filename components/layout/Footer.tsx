import Link from 'next/link'
import Image from 'next/image'

const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://www.instagram.com/beauticate/' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@sigourneycantelo' },
  { label: 'Pinterest', href: 'https://www.pinterest.com/beauticate/' },
  { label: 'YouTube', href: 'https://www.youtube.com/sigourneycantelo' },
  { label: 'Threads', href: 'https://www.threads.net/@sigourneycantelo' },
  { label: 'Facebook', href: 'https://www.facebook.com/beauticate' },
  { label: 'Spotify', href: 'https://open.spotify.com/show/5su7l0yO5Ue0706K2Lzd8q' },
]

const FOOTER_NAV = [
  { label: 'About', href: '/about-beauticate' },
  { label: "Sigourney's Edit", href: '/sigourneys-edit' },
  { label: 'Press', href: '/press' },
  { label: 'From the Archive', href: '/archive' },
  { label: 'Advertise With Us', href: '/advertise-with-us' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms & Conditions', href: '/terms' },
  { label: 'Exclusive Offers', href: '/offers' },
  { label: 'Shipping Policy', href: '/shop/shipping' },
  { label: 'Refund Policy', href: '/shop/refund-policy' },
  { label: 'Contact', href: '/contact' },
]

export default function Footer() {
  return (
    <footer className="bg-charcoal text-cream mt-20">
      <div className="max-w-wide mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

          {/* Brand */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/logo-white.png"
                alt="Beauticate"
                width={160}
                height={22}
                className="h-7 w-auto"
              />
            </Link>
            <p className="text-sm text-cream/70 leading-relaxed">
              Elevating beauty, wellness, and lifestyle with trusted tips, expert voices, and stories that inspire.
            </p>
          </div>

          {/* Nav */}
          <div>
            <h4 className="text-xs tracking-widest text-cream/50 uppercase mb-4">Navigate</h4>
            <ul className="space-y-2">
              {FOOTER_NAV.map(item => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-cream/70 hover:text-cream transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Social */}
          <div>
            <h4 className="text-xs tracking-widest text-cream/50 uppercase mb-4">Get In Touch</h4>
            <a href="mailto:info@beauticate.com" className="text-sm text-cream/70 hover:text-cream transition-colors block mb-6">
              info@beauticate.com
            </a>
            <div className="flex flex-wrap gap-3">
              {SOCIAL_LINKS.map(s => (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-cream/50 hover:text-cream transition-colors"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-cream/10 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <p className="text-xs text-cream/40">
            © Beauticate {new Date().getFullYear()}, All Rights Reserved.
          </p>
          <p className="text-xs text-cream/40">
            Beauticate occasionally uses affiliate links and may receive a small commission on purchases.
          </p>
        </div>
      </div>
    </footer>
  )
}
