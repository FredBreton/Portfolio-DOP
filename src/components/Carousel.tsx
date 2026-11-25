'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

import { copy, type Locale } from '@/lib/locale'

type Props = { locale: Locale; title?: string | null; label: string; kind: 'cards' | 'stills'; children: ReactNode }

export function Carousel({ locale, title, label, kind, children }: Props) {
  const track = useRef<HTMLUListElement>(null)
  const [state, setState] = useState({ overflow: false, start: true, end: false })
  const t = copy[locale]

  useEffect(() => {
    const el = track.current
    if (!el) return
    const update = () => setState({
      overflow: el.scrollWidth > el.clientWidth + 2,
      start: el.scrollLeft <= 2,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2,
    })
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    for (const child of el.children) observer.observe(child)
    el.addEventListener('scroll', update, { passive: true })
    return () => {
      observer.disconnect()
      el.removeEventListener('scroll', update)
    }
  }, [])

  const move = (step: number) => {
    const el = track.current
    const first = el?.firstElementChild as HTMLElement | null
    if (el && first) el.scrollBy({ left: step * (first.offsetWidth + 20) })
  }

  return (
    <section className={`carousel ${kind}`} aria-label={title ?? label}>
      <div className="carousel-head">
        {title ? <h2>{title}</h2> : <span />}
        {state.overflow && (
          <div className="arrows">
            <button type="button" onClick={() => move(-1)} disabled={state.start} aria-label={t.previous}>←</button>
            <button type="button" onClick={() => move(1)} disabled={state.end} aria-label={t.next}>→</button>
          </div>
        )}
      </div>
      <ul className="track" ref={track} tabIndex={state.overflow ? 0 : undefined} role="list" aria-label={title ?? label}>{children}</ul>
    </section>
  )
}
