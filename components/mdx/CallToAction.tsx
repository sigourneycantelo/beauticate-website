import { withNoskim, withNoskimClass } from '@/lib/affiliate-links'
interface Props { text: string; href: string; label?: string }

export default function CallToAction({ text, href, label = 'Shop Now' }: Props) {
  return (
    <div className="my-8 p-6 bg-cream-100 text-center">
      <p className="mb-4 text-sm leading-relaxed">{text}</p>
      <a href={href} rel={withNoskim(undefined, href)} className={withNoskimClass('btn-gold', href)}>{label}</a>
    </div>
  )
}
