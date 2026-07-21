'use client'
import { useEffect } from 'react'

export default function ScrollReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            obs.unobserve(e.target)
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px 400px 0px' }
    )

    function observeAll() {
      document.querySelectorAll('.reveal:not(.in)').forEach(el => obs.observe(el))
    }

    observeAll()

    const mo = new MutationObserver(observeAll)
    mo.observe(document.body, { childList: true, subtree: true })

    return () => { obs.disconnect(); mo.disconnect() }
  }, [])
  return null
}
