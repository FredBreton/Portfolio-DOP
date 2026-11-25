import type { Block, Field } from 'payload'

import { validateLink, validateVideo } from '../lib/video'

const titre: Field = { name: 'titre', label: 'Titre', type: 'text', localized: true }

export const blocks: Block[] = [
  {
    slug: 'texte',
    labels: { singular: 'Texte', plural: 'Textes' },
    fields: [titre, { name: 'contenu', label: 'Contenu', type: 'richText', localized: true, required: true }],
  },
  {
    slug: 'imageTexte',
    labels: { singular: 'Image et texte', plural: 'Images et textes' },
    fields: [
      titre,
      { name: 'image', label: 'Image', type: 'upload', relationTo: 'media', required: true },
      { name: 'contenu', label: 'Contenu', type: 'richText', localized: true, required: true },
      {
        name: 'cote', label: 'Image placée', type: 'select', defaultValue: 'gauche', required: true,
        options: [{ label: 'À gauche', value: 'gauche' }, { label: 'À droite', value: 'droite' }],
      },
    ],
  },
  {
    slug: 'video',
    labels: { singular: 'Vidéo', plural: 'Vidéos' },
    fields: [
      titre,
      { name: 'url', label: 'Adresse YouTube ou Vimeo', type: 'text', required: true, validate: validateVideo },
      { name: 'affiche', label: 'Image avant la lecture', type: 'upload', relationTo: 'media' },
    ],
  },
  {
    slug: 'carrousel',
    labels: { singular: 'Carrousel d’images', plural: 'Carrousels d’images' },
    fields: [titre, { name: 'images', label: 'Images', type: 'upload', relationTo: 'media', hasMany: true, required: true }],
  },
  {
    slug: 'grilleProjets',
    labels: { singular: 'Grille de projets', plural: 'Grilles de projets' },
    fields: [
      titre,
      {
        name: 'categorie', label: 'Catégorie', type: 'relationship', relationTo: 'categories', required: true,
        admin: { description: 'Affiche tous les projets publiés de cette catégorie, dans l’ordre de la liste.' },
      },
    ],
  },
  {
    slug: 'services',
    labels: { singular: 'Services', plural: 'Services' },
    fields: [
      titre,
      {
        name: 'elements', label: 'Services', labels: { singular: 'Service', plural: 'Services' }, type: 'array', minRows: 1,
        fields: [
          { name: 'titre', label: 'Nom', type: 'text', localized: true, required: true },
          { name: 'texte', label: 'Description', type: 'textarea', localized: true },
        ],
      },
    ],
  },
  {
    slug: 'temoignages',
    labels: { singular: 'Témoignages', plural: 'Témoignages' },
    fields: [
      titre,
      {
        name: 'elements', label: 'Témoignages', labels: { singular: 'Témoignage', plural: 'Témoignages' }, type: 'array', minRows: 1,
        fields: [
          { name: 'citation', label: 'Citation', type: 'textarea', localized: true, required: true },
          { name: 'nom', label: 'Nom', type: 'text', required: true },
          { name: 'fonction', label: 'Fonction ou entreprise', type: 'text', localized: true },
        ],
      },
    ],
  },
  {
    slug: 'logos',
    labels: { singular: 'Logos de clients', plural: 'Logos de clients' },
    fields: [
      titre,
      {
        name: 'elements', label: 'Logos', labels: { singular: 'Logo', plural: 'Logos' }, type: 'array', minRows: 1,
        fields: [
          { name: 'logo', label: 'Logo', type: 'upload', relationTo: 'media', required: true },
          { name: 'url', label: 'Site web', type: 'text', validate: validateLink },
        ],
      },
    ],
  },
  {
    slug: 'boutonContact',
    labels: { singular: 'Bouton de contact', plural: 'Boutons de contact' },
    fields: [
      titre,
      { name: 'texte', label: 'Texte', type: 'textarea', localized: true },
      { name: 'libelle', label: 'Texte du bouton', type: 'text', localized: true },
      {
        name: 'type', label: 'Type de projet choisi d’avance', type: 'select', defaultValue: 'film', required: true,
        options: [{ label: 'Fiction ou documentaire', value: 'film' }, { label: 'Création vidéo', value: 'video' }],
      },
    ],
  },
]
