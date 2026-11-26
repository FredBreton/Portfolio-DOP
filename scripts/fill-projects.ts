/**
 * Réécrit synopsis, équipe, liens, sélections et prix des projets déjà présents (details.ts et awards.ts).
 * Attention : remplace ce qui a été saisi dans Payload pour ces champs.
 */
import './load-env'
import { getPayload } from 'payload'

import config from '../src/payload.config'
import { fillProject } from './fill'

const payload = await getPayload({ config })
const { docs } = await payload.find({ collection: 'projects', locale: 'fr', limit: 100, depth: 0 })
for (const doc of docs) {
  await fillProject(payload, doc.id, doc.titre)
  console.log(`Rempli : ${doc.titre}`)
}
process.exit(0)
