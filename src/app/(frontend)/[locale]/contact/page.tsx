import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { ContactForm } from '@/components/ContactForm'
import { getSettings } from '@/lib/data'
import { copy, isLocale } from '@/lib/locale'
import { alternates } from '@/lib/metadata'

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ type?: string | string[] }> }

// Lit ?type= dans l'adresse : jamais gardée en mémoire.
export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  return { title: copy[locale].contact, alternates: alternates(locale, '/contact') }
}

export default async function ContactPage({ params, searchParams }: Props) {
  const [{ locale }, { type }] = await Promise.all([params, searchParams])
  if (!isLocale(locale)) notFound()
  const s = await getSettings(locale)
  return (
    <>
      <div className="intro"><h1>{copy[locale].contact}</h1>{s.contactIntro && <p className="lead">{s.contactIntro}</p>}</div>
      <div className="contact">
        <ContactForm locale={locale} type={type === 'video' ? 'video' : 'film'} />
        <div className="coords">
          {s.courriel && <a className="link" href={`mailto:${s.courriel}`}>{s.courriel}</a>}
          {s.reseaux?.map((r) => <a key={r.id} className="link" href={r.url} target="_blank" rel="noreferrer">{r.nom}</a>)}
        </div>
      </div>
    </>
  )
}
