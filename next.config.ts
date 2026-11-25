import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const indexable = process.env.SITE_INDEXABLE === 'true'

const config: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    // Adresses de l'ancien site WordPress.
    return ['/fiction', '/portfolio'].map((source) => ({ source, destination: '/#projets', permanent: true }))
  },
  async headers() {
    return [{
      source: '/:path*',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ...(indexable ? [] : [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }]),
      ],
    }]
  },
}

export default withPayload(config, { devBundleServerPackages: false })
