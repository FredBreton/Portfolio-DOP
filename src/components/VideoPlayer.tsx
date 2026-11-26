'use client'

import { useState, type ReactNode } from 'react'

import { copy, type Locale } from '@/lib/locale'
import { parseVideo } from '@/lib/video'

/** Le lecteur externe se charge au clic seulement. Le lien reste si la vidéo a été retirée. */
export function VideoPlayer({ locale, url, title, label, children }: { locale: Locale; url: string; title: string; label?: string; children?: ReactNode }) {
  const [playing, setPlaying] = useState(false)
  const t = copy[locale]
  const text = label ?? t.playVideo
  const embed = parseVideo(url)
  if (!embed) return <>{children}</>
  return (
    <div className="player">
      <div className="player-frame">
        {playing ? (
          <iframe src={embed.src} title={title} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
        ) : (
          <button type="button" onClick={() => setPlaying(true)} aria-label={`${text} : ${title}`}>
            {children}
            <span className="play-badge" aria-hidden>
              <span className="ring"><svg viewBox="0 0 12 12"><path d="M3 1.5v9l7.5-4.5z" /></svg></span>
              <span className="play-label">{text}</span>
            </span>
          </button>
        )}
      </div>
      <a className="muted" href={url} target="_blank" rel="noreferrer">{t.openOn} {embed.provider}</a>
    </div>
  )
}
