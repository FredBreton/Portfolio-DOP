/** Ajoute les sélections et prix de awards.ts aux projets déjà présents, s'ils n'en ont pas. */
import './load-env'
import { getPayload } from 'payload'

import config from '../src/payload.config'
import { awards } from './awards'

const payload = await getPayload({ config })
for (const [titre, lines] of Object.entries(awards)) {
  const { docs } = await payload.find({ collection: 'projects', locale: 'fr', where: { titre: { equals: titre } }, limit: 1, draft: false })
  const doc = docs[0]
  if (!doc) { console.log(`Absent : ${titre}`); continue }
  if (doc.prix?.length) { console.log(`Déjà rempli : ${titre}`); continue }
  const fr = await payload.update({ collection: 'projects', id: doc.id, locale: 'fr', data: { prix: lines.map((l) => ({ texte: l.fr })), _status: 'published' } })
  await payload.update({
    collection: 'projects', id: doc.id, locale: 'en',
    data: { prix: fr.prix!.map((row, i) => ({ id: row.id, texte: lines[i].en })), _status: 'published' },
  })
  console.log(`Ajouté : ${titre} (${lines.length})`)
}
process.exit(0)
