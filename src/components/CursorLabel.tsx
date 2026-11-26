'use client'

import { useEffect, useRef } from 'react'

// Avec une souris seulement : sur une image de projet, la flèche devient un cercle « Voir ».
export function CursorLabel({ label }: { label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || !matchMedia('(hover: hover) and (pointer: fine)').matches) return
    document.documentElement.classList.add('cursor-label')
    const move = (e: PointerEvent) => {
      const over = e.pointerType === 'mouse' && (e.target as Element).closest?.('.card .frame')
      el.style.translate = `${e.clientX}px ${e.clientY}px`
      el.classList.toggle('on', Boolean(over))
    }
    const hide = () => el.classList.remove('on')
    addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerleave', hide)
    addEventListener('scroll', hide, { passive: true })
    return () => {
      removeEventListener('pointermove', move)
      document.removeEventListener('pointerleave', hide)
      removeEventListener('scroll', hide)
      document.documentElement.classList.remove('cursor-label')
    }
  }, [])
  return <div ref={ref} className="cursor" aria-hidden="true"><span>{label}</span></div>
}
