/**
 * Remplit une base vide avec le contenu repris de l'ancien site et les textes de départ.
 * Les fichiers viennent de seed-media/ (non envoyé sur GitHub).
 */
import './load-env'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { getPayload } from 'payload'

import config from '../src/payload.config'
import { awards } from './awards'

const payload = await getPayload({ config })
const dir = path.resolve(process.cwd(), 'seed-media')

if ((await payload.count({ collection: 'projects' })).totalDocs > 0) {
  console.log('La base contient déjà des projets : rien n’est changé.')
  process.exit(0)
}

const text = (value: string) => ({ type: 'text', version: 1, text: value, format: 0, mode: 'normal', style: '', detail: 0 })
const base = { version: 1, format: '' as const, indent: 0, direction: 'ltr' as const }
const heading = (value: string) => ({ ...base, type: 'heading', tag: 'h3', children: [text(value)] })
const paragraph = (value: string) => ({ ...base, type: 'paragraph', textFormat: 0, textStyle: '', children: [text(value)] })
/** Les lignes qui commencent par # deviennent des sous-titres. */
const rich = (...lines: string[]) => ({
  root: { ...base, type: 'root', children: lines.map((l) => (l.startsWith('# ') ? heading(l.slice(2)) : paragraph(l))) },
})

const upload = async (file: string, fr: string, en: string) => {
  const filePath = path.join(dir, file)
  if (!existsSync(filePath)) throw new Error(`Fichier manquant : ${filePath}`)
  const doc = await payload.create({ collection: 'media', locale: 'fr', data: { alt: fr }, filePath })
  await payload.update({ collection: 'media', id: doc.id, locale: 'en', data: { alt: en } })
  return doc.id
}

const category = async (fr: string, en: string, accueil: boolean) => {
  const doc = await payload.create({ collection: 'categories', locale: 'fr', data: { titre: fr, accueil } })
  await payload.update({ collection: 'categories', id: doc.id, locale: 'en', data: { titre: en } })
  return doc.id
}
const fiction = await category('Fiction', 'Fiction', true)
const documentaire = await category('Documentaire', 'Documentary', true)
const creation = await category('Création vidéo', 'Video production', false)

const COURT = ['Court métrage de fiction', 'Short fiction film']
const LONG = ['Long métrage documentaire', 'Feature documentary']
const projects = [
  { titre: 'Dans mes élans de grande obsédée', realisation: 'Alicia Lemieux', categorie: fiction, format: COURT, annee: 2025, file: 'dans-mes-elans.png', video: 'https://www.youtube.com/watch?v=Iv631_HkWv0', alt: ['Un homme torse nu se tient le visage à deux mains', 'A shirtless man holds his face in both hands'] },
  { titre: 'Nucléaire', realisation: 'Philippe Goulet', categorie: fiction, format: COURT, file: 'nucleaire.png', lien: 'https://vimeo.com/1147476870', alt: ['Une personne masquée avance dans le noir avec une lanterne', 'A masked figure moves through the dark with a lantern'] },
  { titre: 'Mes visions de chat', realisation: 'Philippe Goulet', categorie: fiction, format: COURT, file: 'mes-visions-de-chat.jpg', alt: ['Une femme pensive, le menton appuyé sur ses mains', 'A pensive woman rests her chin on her hands'] },
  { titre: 'Gro$ lot', realisation: 'Sharbel El-Showairy', categorie: fiction, format: COURT, file: 'gros-lot.png', lien: 'https://www.vitaldistribution.ca/films/gro%24-lot', alt: ['Un homme en costume rouge tient un papier dans la pénombre', 'A man in a red costume holds a piece of paper in the half-light'] },
  { titre: 'Shattered', realisation: 'Philippe Boissier', categorie: fiction, format: COURT, file: 'shattered.png', lien: 'https://vimeo.com/862045443', alt: ['Une femme aux cheveux longs, assise près d’une fenêtre', 'A long-haired woman sits near a window'] },
  { titre: 'Herby', realisation: 'Antoine Bergevin-Richer', categorie: documentaire, format: LONG, file: 'herby.png', lien: 'https://www.vitaldistribution.ca/films/herby', alt: ['Trois silhouettes à contre-jour dans un salon', 'Three backlit silhouettes in a living room'] },
  { titre: 'Au pied du mur', realisation: 'Alexandra Elkin', categorie: documentaire, format: LONG, annee: 2025, file: 'au-pied-du-mur.png', lien: 'https://www.vitaldistribution.ca/films/au-pied-du-mur', alt: ['Une personne casquée grimpe une paroi en forêt', 'A climber in a helmet scales a rock face in the forest'] },
]
const covers: number[] = []
for (const p of projects) {
  const couverture = await upload(p.file, p.alt[0], p.alt[1])
  covers.push(couverture)
  const doc = await payload.create({
    collection: 'projects',
    locale: 'fr',
    data: {
      titre: p.titre, categorie: p.categorie, format: p.format[0], annee: p.annee, couverture, video: p.video, lien: p.lien,
      realisation: p.realisation, role: 'Direction photo', accueil: true, _status: 'published',
      prix: awards[p.titre]?.map((a) => ({ texte: a.fr })),
    },
  })
  await payload.update({
    collection: 'projects', id: doc.id, locale: 'en',
    data: {
      titre: p.titre, format: p.format[1], role: 'Director of photography', _status: 'published',
      prix: doc.prix?.map((row, i) => ({ id: row.id, texte: awards[p.titre][i].en })),
    },
  })
}

const portrait = await upload('portrait.jpg', 'Frédérick Breton derrière sa caméra', 'Frédérick Breton behind his camera')
const loop = await upload('boucle-accueil.mp4', 'Extraits du travail de Frédérick Breton', 'Excerpts from Frédérick Breton’s work')

type Localized = { fr: string; en: string }
type Draft = { titre: Localized; intro?: Localized; slug: string; menu: boolean; status: 'draft' | 'published'; blocs: (l: 'fr' | 'en', old?: any[]) => any[] }
const page = async ({ titre, intro, slug, menu, status, blocs }: Draft) => {
  const doc = await payload.create({
    collection: 'pages', locale: 'fr',
    data: { titre: titre.fr, intro: intro?.fr, slug, menu, blocs: blocs('fr'), _status: status },
  })
  // Reprendre les identifiants : les deux langues partagent les mêmes blocs.
  const english = blocs('en').map((block, i) => {
    const old = (doc.blocs as any[])[i]
    return {
      ...block,
      id: old.id,
      ...(block.elements ? { elements: block.elements.map((e: any, j: number) => ({ ...e, id: old.elements[j].id })) } : {}),
    }
  })
  await payload.update({
    collection: 'pages', id: doc.id, locale: 'en',
    data: { titre: titre.en, intro: intro?.en, blocs: english, _status: status },
  })
}

await page({
  titre: { fr: 'Création vidéo', en: 'Video production' },
  intro: {
    fr: 'L’exigence du cinéma pour raconter votre entreprise. Je m’occupe de votre vidéo du premier échange jusqu’au montage final.',
    en: 'The care of cinema, put to work telling your company’s story. I handle your video from the first conversation to the final cut.',
  },
  slug: 'creation-video', menu: true, status: 'draft',
  blocs: (l) => [
    {
      blockType: 'services', titre: l === 'fr' ? 'Une vidéo clé en main' : 'A turnkey video',
      elements: l === 'fr'
        ? [
            { titre: 'L’idée', texte: 'On précise ensemble votre message, votre public et l’endroit où la vidéo sera vue.' },
            { titre: 'Le tournage', texte: 'Une image soignée, avec la même attention à la lumière et au cadre que sur un plateau de film.' },
            { titre: 'Le montage', texte: 'Une vidéo terminée, dans les formats dont vous avez besoin.' },
          ]
        : [
            { titre: 'The idea', texte: 'Together we define your message, your audience and where the video will be seen.' },
            { titre: 'The shoot', texte: 'A carefully crafted image, with the same attention to light and framing as on a film set.' },
            { titre: 'The edit', texte: 'A finished video, in the formats you need.' },
          ],
    },
    { blockType: 'grilleProjets', titre: l === 'fr' ? 'Mandats choisis' : 'Selected work', categorie: creation },
    {
      blockType: 'boutonContact', type: 'video',
      titre: l === 'fr' ? 'Vous avez un projet en tête?' : 'Have a project in mind?',
      libelle: l === 'fr' ? 'Parler de votre projet' : 'Tell me about your project',
    },
  ],
})

await page({
  titre: { fr: 'À propos', en: 'About' }, slug: 'a-propos', menu: true, status: 'published',
  blocs: (l) => [
    {
      blockType: 'imageTexte', image: portrait, cote: 'gauche',
      contenu: l === 'fr'
        ? rich(
            'Frédérick Breton est directeur photo. Il signe l’image de courts métrages de fiction et de longs métrages documentaires.',
            'D’un projet à l’autre, il cherche avec les cinéastes la lumière, le cadre et le rythme qui servent l’histoire.',
          )
        : rich(
            'Frédérick Breton is a director of photography. He shoots short fiction films and feature documentaries.',
            'On each project, he works with filmmakers to find the light, framing and rhythm that serve the story.',
          ),
    },
  ],
})

await page({
  titre: { fr: 'Confidentialité', en: 'Privacy' }, slug: 'confidentialite', menu: false, status: 'published',
  blocs: (l) => [
    {
      blockType: 'texte',
      contenu: l === 'fr'
        ? rich(
            '# Ce que le site recueille',
            'Le formulaire de contact recueille votre nom, votre courriel, le type de projet et votre message. Une empreinte technique, qui ne permet pas de lire votre adresse IP, sert à limiter les envois abusifs.',
            '# À quoi ça sert',
            'Ces renseignements servent seulement à répondre à votre demande. Ils ne sont ni vendus ni utilisés pour de la publicité.',
            '# Où ils se trouvent',
            'Ils sont conservés chez les fournisseurs qui hébergent le site et les courriels, dont les serveurs peuvent se trouver à l’extérieur du Québec.',
            '# Vidéos',
            'Les vidéos YouTube et Vimeo se chargent seulement quand vous cliquez pour les lire. Ces services peuvent alors recueillir des renseignements selon leurs propres règles.',
            '# Vos droits',
            'Frédérick Breton est responsable de ces renseignements. Vous pouvez demander de les voir, de les corriger ou de les supprimer en écrivant à l’adresse de la page Contact.',
          )
        : rich(
            '# What this site collects',
            'The contact form collects your name, email, type of project and message. A technical fingerprint, from which your IP address cannot be read, is used to limit abusive submissions.',
            '# Why',
            'This information is used only to answer your request. It is never sold or used for advertising.',
            '# Where it is kept',
            'It is stored with the providers that host this site and its email, whose servers may be located outside Quebec.',
            '# Videos',
            'YouTube and Vimeo videos load only when you click to play them. These services may then collect information under their own policies.',
            '# Your rights',
            'Frédérick Breton is responsible for this information. You can ask to see, correct or delete it by writing to the address on the Contact page.',
          ),
    },
  ],
})

await payload.updateGlobal({
  slug: 'accueil', locale: 'fr',
  data: { video: loop, image: covers[0], demo: 'https://vimeo.com/801094222', _status: 'published' },
})
await payload.updateGlobal({
  slug: 'reglages', locale: 'fr',
  data: {
    nom: 'Frédérick Breton', metier: 'Directeur photo', courriel: 'fred.breton1354@gmail.com', image: covers[0],
    description: 'Frédérick Breton, directeur photo : courts métrages de fiction et longs métrages documentaires.',
    contactIntro: 'Un film, un documentaire ou une vidéo pour votre entreprise? Écrivez-moi quelques lignes sur votre projet.',
    reseaux: [
      { nom: 'Instagram', url: 'https://www.instagram.com/fred_b_pictures/' },
      { nom: 'Vimeo', url: 'https://vimeo.com/user54027089' },
    ],
  },
})
await payload.updateGlobal({
  slug: 'reglages', locale: 'en',
  data: {
    metier: 'Director of photography',
    description: 'Frédérick Breton, director of photography: short fiction films and feature documentaries.',
    contactIntro: 'A film, a documentary or a video for your company? Write me a few lines about your project.',
  },
})

// Compte local de test seulement : jamais créé si ces valeurs sont absentes.
const { SEED_ADMIN_EMAIL: email, SEED_ADMIN_PASSWORD: password } = process.env
if (email && password && (await payload.count({ collection: 'users' })).totalDocs === 0) {
  await payload.create({ collection: 'users', data: { email, password } })
}

console.log('Contenu de départ créé.')
process.exit(0)
