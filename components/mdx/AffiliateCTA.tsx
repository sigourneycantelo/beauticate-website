interface Props {
  href: string
  label?: string
  children: React.ReactNode
}

/**
 * Boxed affiliate call-to-action — a short line of copy plus a tracked button.
 * The button always carries rel="sponsored noopener" target="_blank" so paid
 * affiliate links are disclosed to search engines and open safely in a new tab.
 */
export default function AffiliateCTA({ href, label = 'Shop now', children }: Props) {
  return (
    <aside className="not-prose my-8 border border-gold/40 bg-cream-100 p-6 sm:p-7 text-center">
      <div className="text-[15px] sm:text-base leading-relaxed text-charcoal mb-4 [&_p]:m-0">
        {children}
      </div>
      <a
        href={href}
        target="_blank"
        rel="sponsored noopener"
        className="btn-gold inline-block"
      >
        {label}
      </a>
    </aside>
  )
}
