'use client'

import { useState, type ReactNode } from 'react'

import { copy, type Locale } from '@/lib/locale'
import { parseVideo } from '@/lib/video'

/** Le lecteur externe se charge au clic seulement. Le lien reste si la vidéo a été retirée. */
export function VideoPlayer({ locale, url, title, children }: { locale: Locale; url: string; title: string; children?: ReactNode }) {
  const [playing, setPlaying] = useState(false)
  const t = copy[locale]
  const embed = parseVideo(url)
  if (!embed) return <>{children}</>
  return (
    <div className="player">
      <div className="player-frame">
        {playing ? (
          <iframe src={embed.src} title={title} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
        ) : (
          <button type="button" onClick={() => setPlaying(true)} aria-label={`${t.playVideo} : ${title}`}>
            {children}
            <span className="button" aria-hidden>{t.playVideo}</span>
          </button>
        )}
      </div>
      <a className="muted" href={url} target="_blank" rel="noreferrer">{t.openOn} {embed.provider}</a>
    </div>
  )
}
