import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Gallery } from '@/components/Gallery'
import { Picture } from '@/components/Picture'
import { Words } from '@/components/Words'
import { VideoPlayer } from '@/components/VideoPlayer'
import { getProject, getProjectsOf, getSettings, idOf, media, medias, siteUrl } from '@/lib/data'
import { copy, isLocale, toPublic } from '@/lib/locale'
import { alternates, jsonLd, shareImage, summary } from '@/lib/metadata'

type Props = { params: Promise<{ locale: string; slug: string }> }

export const generateStaticParams = () => []

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const project = isLocale(locale) ? await getProject(locale, slug) : undefined
  if (!project || !isLocale(locale)) return {}
  const image = media(project.couverture)
  const title = project.seo?.titre || project.titre
  const description = project.seo?.description || summary(project.description)
  const page = alternates(locale, `/projets/${slug}`)
  return {
    title,
    description,
    alternates: page,
    // Next remplace tout le bloc openGraph du parent : on redonne nom du site et langue.
    openGraph: {
      title, description, type: 'article', url: toPublic(locale, `/projets/${slug}`),
      siteName: (await getSettings(locale)).nom, locale: locale === 'fr' ? 'fr_CA' : 'en_CA',
      images: shareImage(image),
    },
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
    ...(project.equipe ?? []).map((m) => [m.poste, m.noms]),
  ].filter(([label, value]) => label && value)
  const coverUrl = media(project.couverture)?.url
  const film = jsonLd({
    '@type': 'Movie', name: project.titre, url: siteUrl() + toPublic(locale, `/projets/${slug}`),
    description: summary(project.description, 300), dateCreated: project.annee ? String(project.annee) : undefined,
    director: project.realisation ? { '@type': 'Person', name: project.realisation } : undefined,
    image: coverUrl ? new URL(coverUrl, siteUrl()).href : undefined,
    contributor: { '@type': 'Person', name: (await getSettings(locale)).nom, jobTitle: project.role ?? undefined },
  })

  return (
    <article className="project">
      <script type="application/ld+json" dangerouslySetInnerHTML={film} />
      <Link className="back" href={toPublic(locale, '/#projets')}>← {t.allProjects}</Link>
      {project.video ? <VideoPlayer locale={locale} url={project.video} title={project.titre} label={project.videoType === 'film' ? t.watchFilm : t.watchTrailer}>{cover}</VideoPlayer> : <div className="cover">{cover}</div>}
      <div className="project-text">
        <div>
          <h1><Words text={project.titre} /></h1>
          {project.format && <p className="muted">{project.format}</p>}
          {project.description && <p className="lead">{project.description}</p>}
          {project.liens && project.liens.length > 0 && (
            <p className="watch">
              {project.liens.map((l, i) => (
                <a key={l.id} className={`button arrow${i > 0 ? ' quiet' : ''}`} href={l.url} target="_blank" rel="noreferrer">{l.libelle}</a>
              ))}
            </p>
          )}
        </div>
        {credits.length > 0 && <dl>{credits.map(([label, value], i) => <div key={i}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>}
      </div>
      {images.length > 0 && (
        <Gallery
          locale={locale} title={t.stills}
          items={images.map((image) => ({
            thumb: <Picture image={image} sizes="(max-width: 700px) 90vw, 560px" />,
            src: image.sizes?.grande?.url ?? image.url ?? '',
            alt: image.alt ?? '',
          }))}
        />
      )}
      {project.prix && project.prix.length > 0 && (
        <section className="block"><h2>{t.awards}</h2><ul className="awards">{project.prix.map((p) => <li key={p.id}>{p.texte}</li>)}</ul></section>
      )}
      {next && (
        <Link className="next" href={toPublic(locale, `/projets/${next.slug}`)}>
          <Picture image={media(next.couverture)} sizes="(max-width: 1320px) 90vw, 1144px" />
          <span className="next-text">
            <span className="next-label">{t.nextProject}</span>
            <span className="next-title">{next.titre} <span aria-hidden="true">→</span></span>
          </span>
        </Link>
      )}
    </article>
  )
}
