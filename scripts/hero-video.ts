/** Remplace la vidéo en boucle de l'accueil : node --import tsx scripts/hero-video.ts seed-media/fichier.mp4 */
import './load-env'
import path from 'node:path'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const file = process.argv[2]
if (!file) throw new Error('Indique le fichier vidéo.')
const payload = await getPayload({ config })
const doc = await payload.create({ collection: 'media', locale: 'fr', data: { alt: 'Extraits du travail de Frédérick Breton' }, filePath: path.resolve(file) })
await payload.update({ collection: 'media', id: doc.id, locale: 'en', data: { alt: 'Excerpts from Frédérick Breton’s work' } })
await payload.updateGlobal({ slug: 'accueil', locale: 'fr', data: { video: doc.id, _status: 'published' } })
console.log(`Vidéo de l'accueil remplacée (média ${doc.id}).`)
process.exit(0)
