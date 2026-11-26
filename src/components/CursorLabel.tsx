'use client'

import { useEffect, useRef } from 'react'

// Avec une souris seulement : un fin cercle suit la flèche avec un léger retard,
// et devient « Voir » sur une image de projet. La vraie flèche reste visible.
export function CursorLabel({ label }: { label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || !matchMedia('(hover: hover) and (pointer: fine)').matches) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const target = { x: 0, y: 0 }
    const pos = { x: 0, y: 0 }
    let frame = 0
    const step = () => {
      pos.x += (target.x - pos.x) * 0.16
      pos.y += (target.y - pos.y) * 0.16
      el.style.translate = `${pos.x}px ${pos.y}px`
      frame = Math.abs(target.x - pos.x) + Math.abs(target.y - pos.y) > 0.2 ? requestAnimationFrame(step) : 0
    }
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      if (!el.classList.contains('visible')) { pos.x = e.clientX; pos.y = e.clientY }
      target.x = e.clientX
      target.y = e.clientY
      el.classList.add('visible')
      el.classList.toggle('on', Boolean((e.target as Element).closest?.('.card .frame')))
      if (!frame) frame = requestAnimationFrame(step)
    }
    const hide = () => el.classList.remove('visible', 'on')
    addEventListener('pointermove', move, { passive: true })
    document.documentElement.addEventListener('pointerleave', hide)
    return () => {
      cancelAnimationFrame(frame)
      removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('pointerleave', hide)
    }
  }, [])
  return <div ref={ref} className="cursor" aria-hidden="true"><span>{label}</span></div>
}
