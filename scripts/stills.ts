/**
 * Ajoute les stills des projets : node --import tsx scripts/stills.ts
 * Fichiers dans seed-media/<dossier>/, dans l'ordre choisi par Frédérick (canevas du 27 novembre 2026).
 * Remplace les stills déjà présents de chaque projet et efface les anciens fichiers.
 * Images recadrées sans bandes noires avant l'import (même coupe pour toutes les images d'un film).
 */
import './load-env'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { getPayload } from 'payload'
import config from '../src/payload.config'

type Still = [fichier: string, fr: string, en: string]

export const stills: Record<string, { dossier: string; images: Still[] }> = {
  'Gro$ lot': {
    dossier: 'gros-lot',
    images: [
      ['01.jpg', 'Un lutin de Noël en costume rouge tient un papier', 'A Christmas elf in a red costume holds a paper'],
      ['02.jpg', 'Une femme en tuque sous des guirlandes lumineuses', 'A woman in a knit hat under string lights'],
      ['03.jpg', 'Un sapin lumineux géant devant un village de Noël, la nuit', 'A giant lit-up tree in front of a Christmas village at night'],
    ],
  },
  'Mes visions de chat': {
    dossier: 'mes-visions-de-chat',
    images: [
      ['01.jpg', 'Une jeune femme pensive, le menton appuyé sur ses mains', 'A pensive young woman, chin resting on her hands'],
      ['02.jpg', 'Un chat persan blanc assis sur un tapis', 'A white Persian cat sitting on a rug'],
      ['03.jpg', 'Un homme et une jeune femme dans une ruelle', 'A man and a young woman in an alley'],
      ['04.jpg', 'Une jeune femme et un homme près d’une fenêtre, une rose sur la table', 'A young woman and a man by a window, a rose on the table'],
    ],
  },
  'Au pied du mur': {
    dossier: 'au-pied-du-mur',
    images: [
      ['04.jpg', 'Une grand-mère joue du piano avec son petit-fils sur les genoux', 'A grandmother plays piano with her grandson on her lap'],
      ['02.jpg', 'Une main âgée guide celle d’un enfant sur le clavier d’un piano', 'An older hand guides a child’s on a piano keyboard'],
      ['10.jpg', 'Des pics rocheux dans la brume au lever du soleil', 'Rocky peaks in the mist at sunrise'],
      ['09.jpg', 'Des grimpeurs minuscules sur un immense dôme de granit', 'Tiny climbers on a huge granite dome'],
      ['05.jpg', 'Une grimpeuse sur une dalle de granit, vue d’en haut, la forêt en contrebas', 'A climber on a granite slab seen from above, forest below'],
      ['06.jpg', 'Des grimpeurs au fond d’un étroit canyon de roche rouge', 'Climbers at the bottom of a narrow red rock canyon'],
      ['12.jpg', 'Une grimpeuse en silhouette sous un surplomb de roche rouge', 'A climber silhouetted under a red rock overhang'],
      ['13.jpg', 'Un grimpeur sur une paroi de grès rouge', 'A climber on a red sandstone wall'],
      ['11.jpg', 'Une grimpeuse casquée sur une paroi en forêt', 'A climber in a helmet on a rock face in the forest'],
      ['07.jpg', 'Gros plan sur un mousqueton accroché à la paroi', 'Close-up of a carabiner clipped to the rock'],
      ['15.jpg', 'Une grimpeuse lève les yeux vers la paroi, à contre-jour', 'A climber looks up at the wall, backlit'],
      ['14.jpg', 'Un homme âgé assis en forêt, au soleil couchant', 'An older man sitting in the forest at sunset'],
    ],
  },
  'Dans mes élans de grande obsédée': {
    dossier: 'dans-mes-elans',
    images: [
      ['01.jpg', 'Un homme torse nu se tient le visage à deux mains', 'A shirtless man holds his face in both hands'],
      ['02.jpg', 'Un homme âgé et une jeune femme dans un chalet en bois', 'An older man and a young woman in a wood-panelled cabin'],
      ['03.jpg', 'Une jeune femme rousse debout dans l’embrasure d’une porte', 'A red-haired young woman standing in a doorway'],
      ['04.jpg', 'Une jeune femme rousse allongée sourit à un homme', 'A red-haired young woman lying down smiles at a man'],
      ['05.jpg', 'Deux personnes enlacées dans la pénombre bleutée', 'Two people embracing in bluish darkness'],
      ['06.jpg', 'Une jeune femme descend un escalier étroit', 'A young woman goes down a narrow staircase'],
      ['07.jpg', 'Une femme de dos, assise sur un lit face à la fenêtre', 'A woman seen from behind, sitting on a bed facing the window'],
    ],
  },
  Herby: {
    dossier: 'herby',
    images: [
      ['01.jpg', 'Un enfant assis par terre dans un salon sombre', 'A child sitting on the floor of a dark living room'],
      ['02.jpg', 'Un enfant à genoux sur un sofa regarde par la fenêtre', 'A child kneeling on a sofa looks out the window'],
      ['03.jpg', 'Un enfant de profil devant des rideaux lumineux', 'A child in profile against bright curtains'],
      ['04.jpg', 'Deux hommes en silhouette se parlent dans un salon', 'Two silhouetted men talk in a living room'],
      ['05.jpg', 'Deux hommes assis sur un sofa dans la lumière du jour', 'Two men sitting on a sofa in daylight'],
      ['06.jpg', 'Un salon filmé à l’envers, un homme suspendu au plafond', 'A living room filmed upside down, a man hanging from the ceiling'],
      ['07.jpg', 'Un homme au volant, dans l’ombre', 'A man at the wheel, in shadow'],
      ['08.jpg', 'Un homme en silhouette devant la forêt au crépuscule', 'A man silhouetted against the forest at dusk'],
      ['09.jpg', 'Une main tient une ampoule allumée', 'A hand holds a lit light bulb'],
      ['10.jpg', 'Un homme lit le journal dans un salon', 'A man reads the newspaper in a living room'],
      ['11.jpg', 'Une femme en silhouette près d’une fenêtre', 'A woman silhouetted by a window'],
      ['12.jpg', 'Deux personnes dans un salon encombré', 'Two people in a cluttered living room'],
      ['13.jpg', 'Un boulanger étend de la pâte au rouleau', 'A baker rolls out dough'],
      ['14.jpg', 'Deux silhouettes dans la fumée, la nuit, près d’une voiture', 'Two silhouettes in the smoke at night, near a car'],
      ['15.jpg', 'Une voiture blanche sur une route de campagne', 'A white car on a country road'],
    ],
  },
  Nucléaire: {
    dossier: 'nucleaire',
    images: [
      ['01.jpg', 'Une personne masquée dans un sous-sol envahi de poussière blanche', 'A masked person in a basement filled with white dust'],
      ['02.jpg', 'Une lanterne éclaire un sous-sol en ruine', 'A lantern lights up a ruined basement'],
      ['03.jpg', 'Une grange en ruine, une silhouette dans l’ouverture enneigée', 'A ruined barn, a figure in the snowy opening'],
      ['04.jpg', 'Gros plan sur le visage d’un homme, en noir et blanc', 'Close-up of a man’s face, in black and white'],
      ['05.jpg', 'Une lanterne dans l’obscurité totale', 'A lantern in total darkness'],
      ['06.jpg', 'Une jeune femme couchée dans la neige regarde vers le haut', 'A young woman lying in the snow looks up'],
    ],
  },
}

// Lancé directement (pas importé pour ses données).
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const payload = await getPayload({ config })
  for (const [titre, { dossier, images: liste }] of Object.entries(stills)) {
    const { docs } = await payload.find({ collection: 'projects', locale: 'fr', where: { titre: { equals: titre } }, limit: 1, depth: 0 })
    if (!docs[0]) throw new Error(`Projet introuvable : ${titre}`)
    const images: number[] = []
    for (const [fichier, fr, en] of liste) {
      const doc = await payload.create({ collection: 'media', locale: 'fr', data: { alt: fr }, filePath: path.resolve('seed-media', dossier, fichier) })
      await payload.update({ collection: 'media', id: doc.id, locale: 'en', data: { alt: en } })
      images.push(doc.id)
    }
    await payload.update({ collection: 'projects', id: docs[0].id, locale: 'fr', data: { images, _status: 'published' } })
    // Les anciens stills de ce projet ne servent plus : on les efface pour ne pas encombrer la médiathèque.
    const anciens = (docs[0].images ?? []).map((m) => (typeof m === 'number' ? m : m.id))
    if (anciens.length) await payload.delete({ collection: 'media', where: { id: { in: anciens } } })
    console.log(`${titre} : ${images.length} stills`)
  }
  process.exit(0)
}
