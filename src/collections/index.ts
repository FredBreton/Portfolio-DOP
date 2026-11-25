import path from 'node:path'
import type { CollectionConfig } from 'payload'

import { blocks } from '../blocks'
import { connected, previewUrl, publishedOrConnected, refreshHooks, seoField, slugField } from '../lib/payload-helpers'
import { validateLink, validateVideo } from '../lib/video'

const drafts = { drafts: true, maxPerDoc: 20 }
const write = { create: connected, update: connected, delete: connected }

const Projects: CollectionConfig = {
  slug: 'projects',
  labels: { singular: 'Projet', plural: 'Projets' },
  orderable: true,
  defaultSort: '_order',
  versions: drafts,
  access: { read: publishedOrConnected, readVersions: connected, ...write },
  hooks: refreshHooks,
  admin: {
    useAsTitle: 'titre',
    group: 'Contenu',
    defaultColumns: ['titre', 'categorie', 'accueil', '_status'],
    description: 'Glissez les lignes pour changer l’ordre sur le site.',
    preview: (doc, { locale }) => previewUrl(`/projets/${doc.slug}`, locale),
  },
  fields: [
    { name: 'titre', label: 'Titre', type: 'text', required: true, localized: true },
    {
      type: 'row',
      fields: [
        { name: 'categorie', label: 'Catégorie', type: 'relationship', relationTo: 'categories', required: true },
        { name: 'format', label: 'Format', type: 'text', localized: true, admin: { placeholder: 'Court métrage, long métrage, publicité…' } },
        { name: 'annee', label: 'Année', type: 'number', min: 1900, max: 2100 },
      ],
    },
    { name: 'couverture', label: 'Image principale', type: 'upload', relationTo: 'media', required: true },
    { name: 'images', label: 'Carrousel d’images', type: 'upload', relationTo: 'media', hasMany: true },
    { name: 'video', label: 'Vidéo ou bande-annonce (YouTube ou Vimeo)', type: 'text', validate: validateVideo },
    { name: 'description', label: 'Courte description', type: 'textarea', localized: true },
    {
      type: 'row',
      fields: [
        { name: 'realisation', label: 'Réalisation', type: 'text' },
        { name: 'production', label: 'Production ou client', type: 'text' },
        { name: 'role', label: 'Rôle de Frédérick', type: 'text', localized: true },
      ],
    },
    {
      name: 'prix', label: 'Prix et festivals', labels: { singular: 'Prix ou festival', plural: 'Prix et festivals' }, type: 'array',
      fields: [{ name: 'texte', label: 'Prix ou festival', type: 'text', localized: true, required: true }],
    },
    { name: 'lien', label: 'Lien externe', type: 'text', validate: validateLink },
    seoField,
    slugField(),
    { name: 'accueil', label: 'Afficher sur l’accueil', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
  ],
}

const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: 'Catégorie', plural: 'Catégories' },
  orderable: true,
  defaultSort: '_order',
  access: { read: () => true, ...write },
  hooks: refreshHooks,
  admin: { useAsTitle: 'titre', group: 'Contenu', defaultColumns: ['titre', 'accueil'] },
  fields: [
    { name: 'titre', label: 'Nom', type: 'text', required: true, localized: true },
    {
      name: 'accueil', label: 'Carrousel sur l’accueil', type: 'checkbox', defaultValue: true,
      admin: { description: 'Décoché pour la création vidéo : ces projets restent dans leur propre page.' },
    },
  ],
}

const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Page', plural: 'Pages' },
  orderable: true,
  defaultSort: '_order',
  versions: drafts,
  access: { read: publishedOrConnected, readVersions: connected, ...write },
  hooks: refreshHooks,
  admin: {
    useAsTitle: 'titre',
    group: 'Contenu',
    defaultColumns: ['titre', 'slug', 'menu', '_status'],
    description: 'Une page en brouillon est invisible. Publiez-la pour l’afficher.',
    preview: (doc, { locale }) => previewUrl(`/${doc.slug}`, locale),
  },
  fields: [
    { name: 'titre', label: 'Titre', type: 'text', required: true, localized: true },
    { name: 'intro', label: 'Introduction', type: 'textarea', localized: true },
    { name: 'blocs', label: 'Blocs', labels: { singular: 'Bloc', plural: 'Blocs' }, type: 'blocks', blocks },
    seoField,
    slugField(true),
    { name: 'menu', label: 'Afficher dans le menu', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
  ],
}

const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Fichier', plural: 'Images et fichiers' },
  access: { read: () => true, ...write },
  hooks: refreshHooks,
  admin: { group: 'Contenu' },
  upload: {
    staticDir: path.resolve(process.cwd(), 'media'),
    // SVG refusé : il peut contenir du code.
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'video/mp4'],
    adminThumbnail: 'petite',
    imageSizes: [['petite', 640], ['moyenne', 1280], ['grande', 1920]].map(([name, width]) => ({
      name: String(name),
      width: Number(width),
      withoutEnlargement: true,
      formatOptions: { format: 'webp' as const, options: { quality: 84 } },
    })),
  },
  fields: [
    {
      name: 'alt', label: 'Description de l’image', type: 'text', required: true, localized: true,
      admin: { description: 'Lue aux personnes qui ne voient pas l’image, et utilisée par Google.' },
    },
  ],
}

const Messages: CollectionConfig = {
  slug: 'messages',
  labels: { singular: 'Message', plural: 'Messages' },
  defaultSort: '-createdAt',
  access: { read: connected, ...write, create: () => false },
  admin: { useAsTitle: 'nom', group: 'Boîte de réception', defaultColumns: ['nom', 'type', 'lu', 'notification', 'createdAt'] },
  fields: [
    { name: 'lu', label: 'Lu', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    { name: 'nom', label: 'Nom', type: 'text', required: true },
    { name: 'courriel', label: 'Courriel', type: 'email', required: true },
    {
      name: 'type', label: 'Type de projet', type: 'select', required: true,
      options: [{ label: 'Fiction ou documentaire', value: 'film' }, { label: 'Création vidéo', value: 'video' }],
    },
    { name: 'message', label: 'Message', type: 'textarea', required: true },
    {
      name: 'notification', label: 'Avis par courriel', type: 'select', defaultValue: 'attente', admin: { position: 'sidebar', readOnly: true },
      options: [
        { label: 'En attente', value: 'attente' },
        { label: 'Envoyé', value: 'envoye' },
        { label: 'Courriel non configuré', value: 'desactive' },
        { label: 'Échec', value: 'echec' },
      ],
    },
    { name: 'erreur', label: 'Détail de l’échec', type: 'textarea', admin: { readOnly: true, condition: (data) => Boolean(data?.erreur) } },
    { name: 'expediteur', type: 'text', index: true, admin: { hidden: true } },
  ],
}

const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Utilisateur', plural: 'Utilisateurs' },
  auth: { maxLoginAttempts: 6, lockTime: 10 * 60 * 1000, tokenExpiration: 60 * 60 * 24 * 7 },
  access: { read: connected, ...write },
  admin: { useAsTitle: 'email', group: 'Administration' },
  fields: [],
}

export const collections = [Projects, Categories, Pages, Media, Messages, Users]
