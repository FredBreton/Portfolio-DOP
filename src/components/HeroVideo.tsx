'use client'

import { useEffect, useRef, useState } from 'react'

import { copy, type Locale } from '@/lib/locale'
import { parseVideo } from '@/lib/video'

type Props = { locale: Locale; video?: string | null; poster?: string | null; alt: string; reel?: string | null }

export function HeroVideo({ locale, video, poster, alt, reel }: Props) {
  const t = copy[locale]
  const ref = useRef<HTMLVideoElement>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const [playing, setPlaying] = useState(false)
  const [broken, setBroken] = useState(false)
  const [open, setOpen] = useState(false)
  const embed = parseVideo(reel)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // L'erreur peut survenir avant que React écoute la vidéo.
    if (el.error) setBroken(true)
    else if (!matchMedia('(prefers-reduced-motion: reduce)').matches) el.play().catch(() => { /* lecture automatique refusée : l'image reste */ })
  }, [])

  const toggle = () => {
    const el = ref.current
    if (!el) return
    if (el.paused) el.play().catch(() => setBroken(true))
    else el.pause()
  }
  const showReel = () => {
    ref.current?.pause()
    setOpen(true)
    dialog.current?.showModal()
  }

  if (!video && !poster) return null
  return (
    <div className="hero">
      {video && !broken ? (
        <video
          ref={ref} src={video} poster={poster ?? undefined} aria-label={alt} muted loop playsInline preload="metadata"
          onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => setBroken(true)}
        />
      ) : poster ? <img src={poster} alt={alt} fetchPriority="high" /> : null}
      <div className="hero-actions">
        {embed && <button type="button" className="button" onClick={showReel}>{t.watchReel}</button>}
        {video && !broken && <button type="button" className="button quiet" onClick={toggle}>{playing ? t.pause : t.play}</button>}
      </div>
      {embed && (
        <dialog ref={dialog} aria-label={t.watchReel} onClose={() => setOpen(false)} onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}>
          <form method="dialog"><button className="button quiet">{t.close}</button></form>
          {open && <iframe src={embed.src} title={t.watchReel} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />}
          <a href={reel!} target="_blank" rel="noreferrer">{t.openOn} {embed.provider}</a>
        </dialog>
      )}
    </div>
  )
}
