'use client'

import { useRef, useState, type ReactNode } from 'react'

import { copy, type Locale } from '@/lib/locale'

type Item = { thumb: ReactNode; src: string; alt: string }

// Grille de stills; un clic ouvre l'image en grand, avec les flèches du clavier pour passer à la suivante.
export function Gallery({ locale, title, items }: { locale: Locale; title: string; items: Item[] }) {
  const t = copy[locale]
  const dialog = useRef<HTMLDialogElement>(null)
  const [at, setAt] = useState(0)
  const go = (step: number) => setAt((i) => (i + step + items.length) % items.length)
  const open = (i: number) => { setAt(i); dialog.current?.showModal() }
  const current = items[at]

  return (
    <section className="block">
      <h2>{title}</h2>
      <ul className="gallery" role="list">
        {items.map((item, i) => (
          <li key={i}><button type="button" onClick={() => open(i)} aria-label={`${t.enlarge} ${i + 1} / ${items.length}`}>{item.thumb}</button></li>
        ))}
      </ul>
      <dialog
        ref={dialog} className="lightbox" aria-label={title}
        onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}
        onKeyDown={(e) => { if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1) }}
      >
        {current && <img src={current.src} alt={current.alt} />}
        <div className="lightbox-bar">
          <span className="muted">{at + 1} / {items.length}</span>
          {items.length > 1 && (
            <span className="arrows">
              <button type="button" onClick={() => go(-1)} aria-label={t.previous}>←</button>
              <button type="button" onClick={() => go(1)} aria-label={t.next}>→</button>
            </span>
          )}
          <form method="dialog"><button className="button quiet">{t.close}</button></form>
        </div>
      </dialog>
    </section>
  )
}
