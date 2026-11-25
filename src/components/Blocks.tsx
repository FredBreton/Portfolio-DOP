import { RichText } from '@payloadcms/richtext-lexical/react'
import Link from 'next/link'

import { getProjectsOf, idOf, media, medias } from '@/lib/data'
import { copy, toPublic, type Locale } from '@/lib/locale'
import type { Page } from '@/payload-types'

import { Carousel } from './Carousel'
import { Picture } from './Picture'
import { ProjectCard } from './ProjectCard'
import { VideoPlayer } from './VideoPlayer'

type AnyBlock = NonNullable<Page['blocs']>[number]
const Title = ({ children }: { children?: string | null }) => (children ? <h2>{children}</h2> : null)

async function BlockView({ block, locale }: { block: AnyBlock; locale: Locale }) {
  switch (block.blockType) {
    case 'texte':
      return <section className="block prose"><Title>{block.titre}</Title><RichText data={block.contenu} /></section>
    case 'imageTexte':
      return (
        <section className={`block split ${block.cote === 'droite' ? 'reverse' : ''}`}>
          <Picture image={media(block.image)} sizes="(max-width: 800px) 90vw, 560px" />
          <div className="prose"><Title>{block.titre}</Title><RichText data={block.contenu} /></div>
        </section>
      )
    case 'video':
      return (
        <section className="block">
          <Title>{block.titre}</Title>
          <VideoPlayer locale={locale} url={block.url} title={block.titre || copy[locale].playVideo}>
            <Picture image={media(block.affiche)} sizes="90vw" />
          </VideoPlayer>
        </section>
      )
    case 'carrousel': {
      const images = medias(block.images)
      if (!images.length) return null
      return (
        <div className="block">
          <Carousel locale={locale} title={block.titre} label={copy[locale].images} kind="stills">
            {images.map((image, i) => <li key={`${image.id}-${i}`}><Picture image={image} sizes="(max-width: 640px) 86vw, 900px" /></li>)}
          </Carousel>
        </div>
      )
    }
    case 'grilleProjets': {
      const category = idOf(block.categorie)
      const projects = category ? await getProjectsOf(locale, category) : []
      if (!projects.length) return null
      return (
        <section className="block">
          <Title>{block.titre}</Title>
          <ul className="grid" role="list">{projects.map((p) => <ProjectCard key={p.id} project={p} locale={locale} />)}</ul>
        </section>
      )
    }
    case 'services':
      if (!block.elements?.length) return null
      return (
        <section className="block">
          <Title>{block.titre}</Title>
          <ul className="services" role="list">
            {block.elements.map((s) => <li key={s.id}><h3>{s.titre}</h3>{s.texte && <p>{s.texte}</p>}</li>)}
          </ul>
        </section>
      )
    case 'temoignages':
      if (!block.elements?.length) return null
      return (
        <section className="block">
          <Title>{block.titre}</Title>
          <div className="quotes">
            {block.elements.map((q) => (
              <figure key={q.id}>
                <blockquote>{q.citation}</blockquote>
                <figcaption>{q.nom}{q.fonction && <span className="muted">, {q.fonction}</span>}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )
    case 'logos':
      if (!block.elements?.length) return null
      return (
        <section className="block">
          <Title>{block.titre}</Title>
          <ul className="logos" role="list">
            {block.elements.map((l) => {
              const image = <Picture image={media(l.logo)} sizes="180px" />
              return <li key={l.id}>{l.url ? <a href={l.url} target="_blank" rel="noreferrer">{image}</a> : image}</li>
            })}
          </ul>
        </section>
      )
    case 'boutonContact':
      return (
        <section className="block call">
          <Title>{block.titre}</Title>
          {block.texte && <p>{block.texte}</p>}
          <Link className="button arrow" href={`${toPublic(locale, '/contact')}${block.type === 'video' ? '?type=video' : ''}`}>
            {block.libelle || copy[locale].contactMe}
          </Link>
        </section>
      )
  }
}

export function Blocks({ blocks, locale }: { blocks?: AnyBlock[] | null; locale: Locale }) {
  return <>{blocks?.map((block) => <BlockView key={block.id} block={block} locale={locale} />)}</>
}
