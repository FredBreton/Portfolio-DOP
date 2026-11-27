import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

/** Icône de l'écran d'accueil d'un téléphone : les initiales, comme le favicon. */
export default function AppleIcon() {
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0b0b0b', color: '#f1efea', fontSize: 84, fontFamily: 'serif', letterSpacing: 2 }}>FB</div>,
    size,
  )
}
