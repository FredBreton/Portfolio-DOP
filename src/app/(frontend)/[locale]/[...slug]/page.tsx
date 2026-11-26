import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Blocks } from '@/components/Blocks'
import { Words } from '@/components/Words'
import { getPage } from '@/lib/data'
import { isLocale } from '@/lib/locale'
import { alternates } from '@/lib/metadata'

type Props = { params: Promise<{ locale: string; slug: string[] }> }

export const generateStaticParams = () => []

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const page = isLocale(locale) && slug.length === 1 ? await getPage(locale, slug[0]) : undefined
  if (!page || !isLocale(locale)) return {}
  return {
    title: page.seo?.titre || page.titre,
    description: page.seo?.description || page.intro || undefined,
    alternates: alternates(locale, `/${slug[0]}`),
  }
}

export default async function FreePage({ params }: Props) {
  const { locale, slug } = await params
  if (!isLocale(locale) || slug.length !== 1) notFound()
  const page = await getPage(locale, slug[0])
  if (!page) notFound()
  return (
    <>
      <div className="intro"><h1><Words text={page.titre} /></h1>{page.intro && <p className="lead">{page.intro}</p>}</div>
      <Blocks blocks={page.blocs} locale={locale} />
    </>
  )
}
