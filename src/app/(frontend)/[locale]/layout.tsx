import type { Metadata, Viewport } from 'next'
import { Hanken_Grotesk, Instrument_Serif } from 'next/font/google'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ViewTransition, type ReactNode } from 'react'

import { CursorLabel } from '@/components/CursorLabel'
import { LanguageLink } from '@/components/LanguageLink'
import { Reveal } from '@/components/Reveal'
import { getMenu, getSettings, media, siteUrl } from '@/lib/data'
import { copy, isLocale, toPublic } from '@/lib/locale'
import { jsonLd } from '@/lib/metadata'

import './site.css'

const font = Hanken_Grotesk({ subsets: ['latin'], weight: ['400', '500', '600'], display: 'swap' })
const serif = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], display: 'swap', variable: '--serif' })

type Props = { params: Promise<{ locale: string }> }

// Aucune page n'est bâtie d'avance : chacune est créée à la première visite, puis gardée en mémoire.
export const generateStaticParams = () => []

export const viewport: Viewport = { themeColor: '#0b0b0b' }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const s = await getSettings(locale)
  const title = `${s.nom} | ${s.metier}`
  const image = media(s.image)
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: title, template: `%s | ${s.nom}` },
    description: s.description ?? undefined,
    openGraph: {
      siteName: s.nom,
      locale: locale === 'fr' ? 'fr_CA' : 'en_CA',
      type: 'website',
      images: image?.url ? [image.sizes?.moyenne?.url ?? image.url] : undefined,
    },
  }
}

export default async function Layout({ children, params }: Props & { children: ReactNode }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = copy[locale]
  const [s, menu, draft] = await Promise.all([getSettings(locale), getMenu(locale), draftMode()])

  return (
    <html lang={locale === 'fr' ? 'fr-CA' : 'en-CA'} className={serif.variable}>
      <body className={font.className}>
        <a className="skip" href="#contenu">{t.skip}</a>
        {draft.isEnabled && <p className="draft">{t.preview} <a href="/preview?fin=1">{t.leavePreview}</a></p>}
        <div className="shell">
          <header className="head">
            <Link className="name" href={toPublic(locale, '/')}><b>{s.nom}</b><span>{s.metier}</span></Link>
            <nav aria-label={t.menu}>
              <Link href={toPublic(locale, '/#projets')}>{t.projects}</Link>
              {menu.map((page) => <Link key={page.id} href={toPublic(locale, `/${page.slug}`)}>{page.titre}</Link>)}
              <Link href={toPublic(locale, '/contact')}>{t.contact}</Link>
              <LanguageLink locale={locale} />
            </nav>
          </header>
          <main id="contenu"><ViewTransition default="page">{children}</ViewTransition></main>
          <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd({
            '@type': 'Person', name: s.nom, jobTitle: s.metier, url: siteUrl() + toPublic(locale, '/'),
            sameAs: s.reseaux?.map((r) => r.url),
          })} />
          <Reveal />
          <CursorLabel label={t.view} />
          <footer className="foot">
            <Link href={toPublic(locale, '/contact')}>{t.contactMe}</Link>
            {s.reseaux?.map((r) => <a key={r.id} href={r.url} target="_blank" rel="noreferrer">{r.nom}</a>)}
            <Link href={toPublic(locale, '/confidentialite')}>{t.privacy}</Link>
          </footer>
        </div>
      </body>
    </html>
  )
}
