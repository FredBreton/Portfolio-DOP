import type { MetadataRoute } from 'next'

import { db, siteUrl } from '@/lib/data'
import { toPublic } from '@/lib/locale'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await db()
  const published = { pagination: false, depth: 0, overrideAccess: false } as const
  const [pages, projects] = await Promise.all([
    payload.find({ collection: 'pages', ...published }),
    payload.find({ collection: 'projects', ...published }),
  ])
  const paths = [
    { path: '/' },
    { path: '/contact' },
    ...pages.docs.map((p) => ({ path: `/${p.slug}`, lastModified: p.updatedAt })),
    ...projects.docs.map((p) => ({ path: `/projets/${p.slug}`, lastModified: p.updatedAt })),
  ]
  const url = (locale: 'fr' | 'en', path: string) => siteUrl() + toPublic(locale, path)
  return paths.flatMap(({ path, ...rest }) =>
    (['fr', 'en'] as const).map((locale) => ({
      url: url(locale, path),
      ...rest,
      alternates: { languages: { 'fr-CA': url('fr', path), 'en-CA': url('en', path) } },
    })))
}
