'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

const TARGETS = '.words, .block, .carousel, .project-text, .next, .frame, .cover, .player-frame, .split, .stills li, .gallery li'

// Ajoute .in aux éléments quand ils entrent à l'écran; sans JavaScript, tout reste visible.
export function Reveal() {
  const path = usePathname()
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    document.documentElement.classList.add('reveal')
    const observer = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); observer.unobserve(e.target) }
    }, { rootMargin: '0px 0px -8% 0px' })
    document.querySelectorAll(`:is(${TARGETS}):not(.in)`).forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [path])
  return null
}
