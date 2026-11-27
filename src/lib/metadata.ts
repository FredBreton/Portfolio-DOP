import type { Metadata } from 'next'

import { toPublic, type Locale } from './locale'

/** Adresse officielle d'une page et sa version dans l'autre langue, pour Google. */
export const alternates = (locale: Locale, path: string): Metadata['alternates'] => ({
  canonical: toPublic(locale, path),
  languages: { 'fr-CA': toPublic('fr', path), 'en-CA': toPublic('en', path), 'x-default': toPublic('fr', path) },
})

/** Image d'aperçu de partage en JPEG (voir app/partage). `v` change l'adresse quand l'image est remplacée. */
export const shareImage = (image: { id: number; url?: string | null; updatedAt: string } | null) =>
  image?.url ? [{ url: `/partage/${image.id}.jpg?v=${Date.parse(image.updatedAt)}`, width: 1200, height: 630, type: 'image/jpeg' }] : undefined

/** Fiche lisible par Google, glissée dans la page. `<` est échappé pour qu'aucun texte ne ferme la balise. */
export const jsonLd = (data: Record<string, unknown>) => ({
  __html: JSON.stringify({ '@context': 'https://schema.org', ...data }).replaceAll('<', '\\u003c'),
})

/** Coupe un texte à environ 160 caractères, sur un mot, pour les aperçus de partage. */
export const summary = (text?: string | null, max = 160) => {
  if (!text) return undefined
  const clean = text.replace(/\s+/g, ' ').trim()
  return clean.length <= max ? clean : `${clean.slice(0, clean.lastIndexOf(' ', max - 1)).replace(/[,;:.]$/, '')}…`
}
