/**
 * Ajoute les stills d'un projet : node --import tsx scripts/stills.ts
 * Fichiers dans seed-media/<dossier>/01.jpg, 02.jpg… dans l'ordre des descriptions.
 * Remplace les stills déjà présents du projet.
 */
import './load-env'
import path from 'node:path'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const stills: Record<string, { dossier: string; alt: [string, string][] }> = {
  'Au pied du mur': {
    dossier: 'au-pied-du-mur',
    alt: [
      ['Une grand-mère tient son petit-fils dans ses bras', 'A grandmother holds her grandson'],
      ['Une main âgée guide celle d’un enfant sur le clavier d’un piano', 'An older hand guides a child’s on a piano keyboard'],
      ['Un trotteur en bois au premier plan, une femme au piano au fond du salon', 'A wooden push walker in the foreground, a woman at the piano in the back'],
      ['Une grand-mère joue du piano avec son petit-fils sur les genoux', 'A grandmother plays piano with her grandson on her lap'],
      ['Une grimpeuse sur une dalle de granit, vue d’en haut, la forêt en contrebas', 'A climber on a granite slab seen from above, forest below'],
      ['Des grimpeurs au fond d’un étroit canyon de roche rouge', 'Climbers at the bottom of a narrow red rock canyon'],
      ['Gros plan sur un mousqueton accroché à la paroi', 'Close-up of a carabiner clipped to the rock'],
      ['Un père lit un livre à son fils dans la cuisine', 'A father reads a book to his son in the kitchen'],
      ['Des grimpeurs minuscules sur un immense dôme de granit', 'Tiny climbers on a huge granite dome'],
      ['Des pics rocheux dans la brume au lever du soleil', 'Rocky peaks in the mist at sunrise'],
      ['Une grimpeuse casquée sur une paroi en forêt', 'A climber in a helmet on a rock face in the forest'],
      ['Une grimpeuse en silhouette sous un surplomb de roche rouge', 'A climber silhouetted under a red rock overhang'],
      ['Un grimpeur sur une paroi de grès rouge', 'A climber on a red sandstone wall'],
      ['Un homme âgé assis en forêt, au soleil couchant', 'An older man sitting in the forest at sunset'],
      ['Une grimpeuse lève les yeux vers la paroi, à contre-jour', 'A climber looks up at the wall, backlit'],
    ],
  },
}

const payload = await getPayload({ config })
for (const [titre, { dossier, alt }] of Object.entries(stills)) {
  const { docs } = await payload.find({ collection: 'projects', locale: 'fr', where: { titre: { equals: titre } }, limit: 1, depth: 0 })
  if (!docs[0]) throw new Error(`Projet introuvable : ${titre}`)
  const images: number[] = []
  for (const [i, [fr, en]] of alt.entries()) {
    const filePath = path.resolve('seed-media', dossier, `${String(i + 1).padStart(2, '0')}.jpg`)
    const doc = await payload.create({ collection: 'media', locale: 'fr', data: { alt: fr }, filePath })
    await payload.update({ collection: 'media', id: doc.id, locale: 'en', data: { alt: en } })
    images.push(doc.id)
  }
  await payload.update({ collection: 'projects', id: docs[0].id, locale: 'fr', data: { images, _status: 'published' } })
  console.log(`${titre} : ${images.length} stills`)
}
process.exit(0)
