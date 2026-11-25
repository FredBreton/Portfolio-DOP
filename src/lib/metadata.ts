import type { Metadata } from 'next'

import { toPublic, type Locale } from './locale'

/** Adresse officielle d'une page et sa version dans l'autre langue, pour Google. */
export const alternates = (locale: Locale, path: string): Metadata['alternates'] => ({
  canonical: toPublic(locale, path),
  languages: { 'fr-CA': toPublic('fr', path), 'en-CA': toPublic('en', path), 'x-default': toPublic('fr', path) },
})
