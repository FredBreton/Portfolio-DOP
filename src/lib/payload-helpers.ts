import { revalidatePath } from 'next/cache'
import type { Access, Field } from 'payload'

import { toPublic, type Locale } from './locale'

export const connected: Access = ({ req }) => Boolean(req.user)
export const publishedOrConnected: Access = ({ req }) => (req.user ? true : { _status: { equals: 'published' } })

/** Rafraîchit le site public après une modification dans Payload. */
export const refreshSite = () => {
  try {
    revalidatePath('/', 'layout')
  } catch {
    // Hors de Next (import, tests) : il n'y a aucun cache à rafraîchir.
  }
}
export const refreshHooks = { afterChange: [refreshSite], afterDelete: [refreshSite] }

export const previewUrl = (path: string, locale: unknown) =>
  `/preview?path=${encodeURIComponent(toPublic(locale === 'en' ? 'en' : ('fr' satisfies Locale), path))}`

export const slugify = (value: string) =>
  value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\$/g, 's').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

const RESERVED = ['projets', 'contact', 'projects', 'en', 'fr', 'admin', 'api', 'preview', 'about', 'video-production', 'privacy']

export const slugField = (reserved = false): Field => ({
  name: 'slug',
  label: 'Adresse',
  type: 'text',
  unique: true,
  index: true,
  admin: { position: 'sidebar', description: 'Fin de l’adresse de la page. Se remplit seule à partir du titre.' },
  hooks: {
    // Traduire un titre ne doit jamais changer l'adresse déjà publique.
    beforeValidate: [({ value, data, originalDoc }) =>
      slugify(value || originalDoc?.slug || (typeof data?.titre === 'string' ? data.titre : '')) || undefined],
  },
  validate: (value: unknown) =>
    reserved && RESERVED.includes(String(value)) ? 'Cette adresse est déjà réservée par le site.' : true,
})

export const seoField: Field = {
  name: 'seo',
  label: 'Google et partage',
  type: 'group',
  fields: [
    { name: 'titre', label: 'Titre', type: 'text', localized: true, maxLength: 70 },
    { name: 'description', label: 'Description', type: 'textarea', localized: true, maxLength: 170 },
  ],
}
