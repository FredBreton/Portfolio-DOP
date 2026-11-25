import config from '@payload-config'
import { draftMode } from 'next/headers'
import { getPayload, type Where } from 'payload'
import { cache } from 'react'

import type { Media } from '@/payload-types'
import type { Locale } from './locale'

export const db = cache(() => getPayload({ config }))

/** En aperçu (personne connectée à Payload), on lit les brouillons; sinon, seulement ce qui est publié. */
const mode = cache(async () => {
  const draft = (await draftMode()).isEnabled
  return { draft, overrideAccess: draft }
})

const findAll = async <T extends 'projects' | 'categories' | 'pages'>(collection: T, locale: Locale, where: Where, depth = 1) => {
  const payload = await db()
  const result = await payload.find({ collection, locale, where, depth, sort: '_order', pagination: false, ...(await mode()) })
  return result.docs
}

export const getSettings = cache(async (locale: Locale) => (await db()).findGlobal({ slug: 'reglages', locale, depth: 1, overrideAccess: false }))
export const getHome = cache(async (locale: Locale) => (await db()).findGlobal({ slug: 'accueil', locale, depth: 2, ...(await mode()) }))

export const getMenu = cache((locale: Locale) => findAll('pages', locale, { menu: { equals: true } }, 0))
export const getPage = cache(async (locale: Locale, slug: string) => (await findAll('pages', locale, { slug: { equals: slug } }, 2))[0])
export const getProject = cache(async (locale: Locale, slug: string) => (await findAll('projects', locale, { slug: { equals: slug } }, 1))[0])
export const getProjectsOf = cache((locale: Locale, categorie: number) => findAll('projects', locale, { categorie: { equals: categorie } }))

/** Carrousels de l'accueil. Une catégorie sans projet à montrer est omise. */
export const getRows = cache(async (locale: Locale) => {
  const [categories, projects] = await Promise.all([
    findAll('categories', locale, { accueil: { equals: true } }, 0),
    findAll('projects', locale, { accueil: { equals: true } }),
  ])
  return categories
    .map((category) => ({ category, projects: projects.filter((p) => idOf(p.categorie) === category.id) }))
    .filter((row) => row.projects.length > 0)
})

export const idOf = (value: number | { id: number } | null | undefined) => (value && typeof value === 'object' ? value.id : value)
export const media = (value: number | Media | null | undefined): Media | null => (value && typeof value === 'object' ? value : null)
export const medias = (values: (number | Media)[] | null | undefined) => (values ?? []).map(media).filter((m): m is Media => Boolean(m))
export const siteUrl = () => (process.env.SITE_URL || 'http://localhost:3010').replace(/\/$/, '')
