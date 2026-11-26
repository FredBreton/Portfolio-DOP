import Link from 'next/link'

import { media } from '@/lib/data'
import { copy, toPublic, type Locale } from '@/lib/locale'
import type { Project } from '@/payload-types'

import { Picture } from './Picture'

export function ProjectCard({ project, locale }: { project: Project; locale: Locale }) {
  return (
    <li className="card">
      <Link href={toPublic(locale, `/projets/${project.slug}`)}>
        <span className="frame"><Picture image={media(project.couverture)} sizes="(max-width: 640px) 86vw, 560px" />{project.mention && <span className="badge">{project.mention}</span>}</span>
        <span className="caption">
          <b>{project.titre}</b>
          <span>{project.realisation ? `${copy[locale].directedBy} ${locale === 'fr' ? ': ' : ''}${project.realisation}` : project.production}</span>
        </span>
      </Link>
    </li>
  )
}
