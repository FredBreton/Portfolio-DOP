import type { GlobalConfig } from 'payload'

import { blocks } from '../blocks'
import { connected, previewUrl, publishedOrConnected, refreshSite, seoField } from '../lib/payload-helpers'
import { validateLink, validateVideo } from '../lib/video'

const Home: GlobalConfig = {
  slug: 'accueil',
  label: 'Accueil',
  versions: { drafts: true, max: 20 },
  access: { read: publishedOrConnected, readVersions: connected, update: connected },
  hooks: { afterChange: [refreshSite] },
  admin: { group: 'Contenu', preview: (_doc, { locale }) => previewUrl('/', locale) },
  fields: [
    {
      name: 'video', label: 'Vidéo en boucle', type: 'upload', relationTo: 'media', filterOptions: { mimeType: { contains: 'video' } },
      admin: { description: 'MP4 H.264, sans son, 10 à 20 secondes, 5 Mo ou moins.' },
    },
    {
      name: 'image', label: 'Image de remplacement', type: 'upload', relationTo: 'media', filterOptions: { mimeType: { contains: 'image' } },
      admin: { description: 'Affichée pendant le chargement ou si la vidéo ne joue pas.' },
    },
    { name: 'demo', label: 'Démo complet (YouTube ou Vimeo)', type: 'text', validate: validateVideo },
    {
      name: 'blocs', label: 'Blocs sous les carrousels', labels: { singular: 'Bloc', plural: 'Blocs' }, type: 'blocks', blocks,
      admin: { description: 'Facultatif. Les carrousels viennent des projets et des catégories.' },
    },
    seoField,
  ],
}

const Settings: GlobalConfig = {
  slug: 'reglages',
  label: 'Réglages',
  access: { read: () => true, update: connected },
  hooks: { afterChange: [refreshSite] },
  admin: { group: 'Administration' },
  fields: [
    { name: 'nom', label: 'Nom', type: 'text', required: true, defaultValue: 'Frédérick Breton' },
    { name: 'metier', label: 'Métier', type: 'text', localized: true, required: true, defaultValue: 'Directeur photo' },
    { name: 'description', label: 'Description pour Google', type: 'textarea', localized: true, maxLength: 170 },
    { name: 'image', label: 'Image de partage', type: 'upload', relationTo: 'media', filterOptions: { mimeType: { contains: 'image' } } },
    { name: 'courriel', label: 'Courriel public', type: 'email' },
    {
      name: 'courrielMessages', label: 'Courriel qui reçoit les messages', type: 'email',
      access: { read: ({ req }) => Boolean(req.user) },
      admin: { description: 'Vide : le courriel public est utilisé.' },
    },
    { name: 'contactIntro', label: 'Texte de la page Contact', type: 'textarea', localized: true },
    {
      name: 'reseaux', label: 'Réseaux sociaux', labels: { singular: 'Réseau', plural: 'Réseaux' }, type: 'array',
      fields: [
        { name: 'nom', label: 'Nom', type: 'text', required: true },
        { name: 'url', label: 'Adresse', type: 'text', required: true, validate: validateLink },
      ],
    },
  ],
}

export const globals = [Home, Settings]
