import { postgresAdapter } from '@payloadcms/db-postgres'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { en } from '@payloadcms/translations/languages/en'
import { fr } from '@payloadcms/translations/languages/fr'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { collections } from './collections'
import { globals } from './globals'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const env = process.env

if (!env.PAYLOAD_SECRET) throw new Error('PAYLOAD_SECRET est requis (voir .env.example).')

export default buildConfig({
  secret: env.PAYLOAD_SECRET,
  serverURL: env.SITE_URL,
  admin: {
    user: 'users',
    importMap: { baseDir: dirname },
    meta: { titleSuffix: ' · Frédérick Breton' },
  },
  i18n: { supportedLanguages: { fr, en }, fallbackLanguage: 'fr' },
  localization: {
    locales: [{ code: 'fr', label: 'Français' }, { code: 'en', label: 'Anglais' }],
    defaultLocale: 'fr',
    fallback: true,
  },
  collections,
  globals,
  editor: lexicalEditor(),
  graphQL: { disable: true },
  sharp,
  db: postgresAdapter({
    pool: { connectionString: env.DATABASE_URL },
    migrationDir: path.resolve(dirname, 'migrations'),
    push: false,
  }),
  email: env.SMTP_HOST
    ? nodemailerAdapter({
        defaultFromAddress: env.SMTP_FROM || env.SMTP_USER || '',
        defaultFromName: 'Site de Frédérick Breton',
        // Un serveur de courriel en panne ne doit pas empêcher le site de démarrer.
        skipVerify: true,
        transportOptions: {
          host: env.SMTP_HOST,
          port: Number(env.SMTP_PORT || 587),
          secure: env.SMTP_PORT === '465',
          auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASSWORD } : undefined,
          connectionTimeout: 6000,
          greetingTimeout: 6000,
          socketTimeout: 8000,
        },
      })
    : undefined,
  plugins: [
    s3Storage({
      enabled: Boolean(env.S3_BUCKET),
      bucket: env.S3_BUCKET || '',
      // Le fichier part du navigateur : les hébergeurs limitent les envois à environ 4,5 Mo.
      clientUploads: true,
      collections: {
        media: {
          disablePayloadAccessControl: true,
          generateFileURL: ({ filename, prefix }) => [env.S3_PUBLIC_URL, prefix, encodeURIComponent(filename)].filter(Boolean).join('/'),
        },
      },
      config: {
        region: 'auto',
        endpoint: env.S3_ENDPOINT,
        forcePathStyle: true,
        credentials: { accessKeyId: env.S3_ACCESS_KEY_ID || '', secretAccessKey: env.S3_SECRET_ACCESS_KEY || '' },
      },
    }),
  ],
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
})
