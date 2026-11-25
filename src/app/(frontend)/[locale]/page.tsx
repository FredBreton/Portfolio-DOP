import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Blocks } from '@/components/Blocks'
import { Carousel } from '@/components/Carousel'
import { HeroVideo } from '@/components/HeroVideo'
import { ProjectCard } from '@/components/ProjectCard'
import { getHome, getRows, getSettings, media } from '@/lib/data'
import { isLocale } from '@/lib/locale'
import { alternates } from '@/lib/metadata'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const home = await getHome(locale)
  return {
    ...(home.seo?.titre ? { title: { absolute: home.seo.titre } } : {}),
    ...(home.seo?.description ? { description: home.seo.description } : {}),
    alternates: alternates(locale, '/'),
  }
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const [home, rows, s] = await Promise.all([getHome(locale), getRows(locale), getSettings(locale)])
  const poster = media(home.image)

  return (
    <>
      <h1 className="sr-only">{s.nom}, {s.metier}</h1>
      <HeroVideo
        locale={locale}
        video={media(home.video)?.url}
        poster={poster?.sizes?.grande?.url ?? poster?.url}
        alt={media(home.video)?.alt ?? poster?.alt ?? ''}
        reel={home.demo}
      />
      <div id="projets">
        {rows.map(({ category, projects }) => (
          <Carousel key={category.id} locale={locale} title={category.titre} label={category.titre} kind="cards">
            {projects.map((p) => <ProjectCard key={p.id} project={p} locale={locale} />)}
          </Carousel>
        ))}
      </div>
      <Blocks blocks={home.blocs} locale={locale} />
    </>
  )
}
