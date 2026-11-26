import type { Payload } from 'payload'

import { awards } from './awards'
import { details } from './details'

/** Écrit synopsis, équipe, liens, sélections et prix d'un projet, en français puis en anglais. */
export async function fillProject(payload: Payload, id: number, titre: string) {
  const d = details[titre] ?? {}
  const prix = awards[titre] ?? []
  const fr = await payload.update({
    collection: 'projects', id, locale: 'fr',
    data: {
      ...(d.realisation && { realisation: d.realisation }),
      ...(d.video && { video: d.video }),
      ...(d.production && { production: d.production }),
      ...(d.description && { description: d.description.fr }),
      liens: (d.liens ?? []).map((l) => ({ libelle: l.fr, url: l.url })),
      equipe: (d.equipe ?? []).map((m) => ({ poste: m.fr, noms: m.noms })),
      prix: prix.map((p) => ({ texte: p.fr })),
      _status: 'published',
    },
  })
  await payload.update({
    collection: 'projects', id, locale: 'en',
    data: {
      ...(d.description && { description: d.description.en }),
      liens: (fr.liens ?? []).map((row, i) => ({ id: row.id, url: row.url, libelle: d.liens![i].en })),
      equipe: (fr.equipe ?? []).map((row, i) => ({ id: row.id, noms: row.noms, poste: d.equipe![i].en })),
      prix: (fr.prix ?? []).map((row, i) => ({ id: row.id, texte: prix[i].en })),
      _status: 'published',
    },
  })
}
