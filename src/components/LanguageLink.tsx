'use client'

import { usePathname } from 'next/navigation'

import { toInternal, toPublic, type Locale } from '@/lib/locale'

export function LanguageLink({ locale }: { locale: Locale }) {
  const pathname = usePathname()
  // Selon le contexte, Next donne l'adresse publique ou l'adresse interne (/fr/...).
  const { path } = toInternal(pathname.replace(/^\/fr(?=\/|$)/, '') || '/')
  const other: Locale = locale === 'fr' ? 'en' : 'fr'
  return (
    <a href={toPublic(other, path)} hrefLang={other} lang={other} aria-label={other === 'en' ? 'English version' : 'Version française'} suppressHydrationWarning>
      {other.toUpperCase()}
    </a>
  )
}
