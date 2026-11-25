import type { MetadataRoute } from 'next'

import { siteUrl } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default function robots(): MetadataRoute.Robots {
  if (process.env.SITE_INDEXABLE !== 'true') return { rules: { userAgent: '*', disallow: '/' } }
  return { rules: { userAgent: '*', disallow: ['/admin', '/preview'] }, sitemap: `${siteUrl()}/sitemap.xml` }
}
