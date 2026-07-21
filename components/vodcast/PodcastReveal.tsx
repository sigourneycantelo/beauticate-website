'use client'

import { useEffect } from 'react'

/**
 * Reveal effect for the podcast page. Adds the `in` class (from the CSS
 * module, passed in via revealClass) to every element carrying revClass once
 * it scrolls into view. Mirrors the mock's IntersectionObserver behaviour and
 * respects prefers-reduced-motion.
 */
export default function PodcastReveal({
  revClass,
  inClass,
}: {
  revClass: string
  inClass: string
}) {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const els = Array.from(
      document.querySelectorAll<HTMLElement>(`.${revClass}`)
    )

    if (!('IntersectionObserver' in window) || reduce) {
      els.forEach(el => el.classList.add(inClass))
      return
    }

    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add(inClass)
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    )
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [revClass, inClass])

  return null
}
