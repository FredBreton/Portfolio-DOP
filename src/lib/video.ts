export type Embed = { provider: 'YouTube' | 'Vimeo'; src: string }

/** Lecteur intégré d'une adresse YouTube ou Vimeo; null si l'adresse n'est pas reconnue. */
export function parseVideo(value: unknown): Embed | null {
  if (typeof value !== 'string') return null
  let url: URL
  try {
    url = new URL(value.trim())
  } catch {
    return null
  }
  if (url.protocol !== 'https:') return null
  const host = url.hostname.replace(/^(www|m)\./, '')
  const parts = url.pathname.split('/').filter(Boolean)

  if (host === 'youtu.be' || host === 'youtube.com') {
    const id = host === 'youtu.be'
      ? parts[0]
      : ['embed', 'shorts', 'live'].includes(parts[0] ?? '') ? parts[1] : url.searchParams.get('v')
    return id && /^[\w-]{11}$/.test(id)
      ? { provider: 'YouTube', src: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0` }
      : null
  }
  if (host === 'vimeo.com' || host === 'player.vimeo.com') {
    const at = parts.findIndex((p) => /^\d+$/.test(p))
    if (at < 0) return null
    // Vidéo « non répertoriée » : la clé suit le numéro ou se trouve dans ?h=.
    const key = url.searchParams.get('h') ?? parts[at + 1]
    const h = key && /^[a-f0-9]+$/i.test(key) ? `&h=${key}` : ''
    return { provider: 'Vimeo', src: `https://player.vimeo.com/video/${parts[at]}?autoplay=1&dnt=1${h}` }
  }
  return null
}

export const validateVideo = (value: unknown): true | string =>
  !value || parseVideo(value) ? true : 'Collez une adresse YouTube ou Vimeo complète, par exemple https://vimeo.com/123456.'

export const validateLink = (value: unknown): true | string => {
  if (!value) return true
  try {
    if (['https:', 'http:'].includes(new URL(String(value)).protocol)) return true
  } catch { /* adresse invalide */ }
  return 'L’adresse doit commencer par https://'
}
