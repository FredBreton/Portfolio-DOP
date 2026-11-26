import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Carousel } from '@/components/Carousel'
import { Picture } from '@/components/Picture'
import { Words } from '@/components/Words'
import { VideoPlayer } from '@/components/VideoPlayer'
import { getProject, getProjectsOf, idOf, media, medias } from '@/lib/data'
import { copy, isLocale, toPublic } from '@/lib/locale'
import { alternates } from '@/lib/metadata'

type Props = { params: Promise<{ locale: string; slug: string }> }

export const generateStaticParams = () => []

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const project = isLocale(locale) ? await getProject(locale, slug) : undefined
  if (!project || !isLocale(locale)) return {}
  const image = media(project.couverture)
  return {
    title: project.seo?.titre || project.titre,
    description: project.seo?.description || project.description || undefined,
    alternates: alternates(locale, `/projets/${slug}`),
    openGraph: { images: image?.url ? [image.sizes?.moyenne?.url ?? image.url] : undefined },
  }
}

export default async function ProjectPage({ params }: Props) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()
  const project = await getProject(locale, slug)
  if (!project) notFound()

  const t = copy[locale]
  const category = idOf(project.categorie)
  const siblings = category ? await getProjectsOf(locale, category) : []
  const at = siblings.findIndex((p) => p.id === project.id)
  const next = siblings.length > 1 ? siblings[(at + 1) % siblings.length] : undefined
  const images = medias(project.images)
  const cover = <Picture image={media(project.couverture)} sizes="(max-width: 1320px) 90vw, 1144px" priority />
  const credits = [
    [t.directedBy, project.realisation],
    [t.production, project.production],
    [t.role, project.role],
    [t.year, project.annee],
  ].filter(([, value]) => value)

  return (
    <article className="project">
      {project.video ? <VideoPlayer locale={locale} url={project.video} title={project.titre}>{cover}</VideoPlayer> : <div className="cover">{cover}</div>}
      <div className="project-text">
        <div>
          <h1><Words text={project.titre} /></h1>
          {project.format && <p className="muted">{project.format}</p>}
          {project.description && <p className="lead">{project.description}</p>}
          {project.lien && <p><a className="link" href={project.lien} target="_blank" rel="noreferrer">{t.seeProject}</a></p>}
        </div>
        {credits.length > 0 && <dl>{credits.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>}
      </div>
      {images.length > 0 && (
        <Carousel locale={locale} label={t.images} kind="stills">
          {images.map((image, i) => <li key={`${image.id}-${i}`}><Picture image={image} sizes="(max-width: 640px) 86vw, 900px" /></li>)}
        </Carousel>
      )}
      {project.prix && project.prix.length > 0 && (
        <section className="block"><h2>{t.awards}</h2><ul className="awards">{project.prix.map((p) => <li key={p.id}>{p.texte}</li>)}</ul></section>
      )}
      {next && <p className="next"><span className="muted">{t.nextProject}</span> <Link href={toPublic(locale, `/projets/${next.slug}`)}>{next.titre}</Link></p>}
    </article>
  )
}
