export const LOCALES = ['fr', 'en'] as const
export type Locale = (typeof LOCALES)[number]
export const isLocale = (v: unknown): v is Locale => LOCALES.includes(v as Locale)

// Premier segment des adresses anglaises. Une page absente d'ici garde son adresse française.
const EN_SEGMENTS: Record<string, string> = {
  projets: 'projects',
  'a-propos': 'about',
  'creation-video': 'video-production',
  confidentialite: 'privacy',
}
const FR_SEGMENTS = Object.fromEntries(Object.entries(EN_SEGMENTS).map(([fr, en]) => [en, fr]))

const swapFirst = (path: string, table: Record<string, string>) => {
  const [, first = '', ...rest] = path.split('/')
  return '/' + [table[first] ?? first, ...rest].join('/')
}

/** Adresse publique d'un chemin interne (toujours écrit en français, sans langue). */
export function toPublic(locale: Locale, path: string): string {
  if (locale === 'fr') return path
  const translated = swapFirst(path, EN_SEGMENTS)
  return translated === '/' || translated.startsWith('/#') ? `/en${translated.slice(1)}` : `/en${translated}`
}

/** Langue et chemin interne d'une adresse publique. */
export function toInternal(pathname: string): { locale: Locale; path: string } {
  if (pathname === '/en' || pathname.startsWith('/en/')) {
    return { locale: 'en', path: swapFirst(pathname.slice(3) || '/', FR_SEGMENTS) }
  }
  return { locale: 'fr', path: pathname }
}

const fr = {
  projects: 'Projets',
  contact: 'Contact',
  contactMe: 'Me contacter',
  watchReel: 'Voir le démo',
  pause: 'Pause',
  play: 'Lecture',
  previous: 'Précédent',
  next: 'Suivant',
  close: 'Fermer',
  directedBy: 'Réalisation',
  production: 'Production',
  year: 'Année',
  role: 'Rôle',
  awards: 'Sélections et prix du film',
  nextProject: 'Projet suivant',
  allProjects: 'Tous les projets',
  camera: 'Caméra et objectifs',
  stills: 'Images du film',
  enlarge: 'Agrandir l’image',
  view: 'Voir',
  playVideo: 'Lire la vidéo',
  watchTrailer: 'Voir la bande-annonce',
  watchFilm: 'Voir le film',
  openOn: 'Ouvrir sur',
  menu: 'Menu principal',
  skip: 'Aller au contenu',
  notFound: 'Cette page est introuvable.',
  home: 'Retour à l’accueil',
  preview: 'Aperçu du brouillon',
  leavePreview: 'Quitter l’aperçu',
  privacy: 'Confidentialité',
  images: 'Images',
  name: 'Nom',
  email: 'Courriel',
  kind: 'Type de projet',
  kindFilm: 'Fiction ou documentaire',
  kindVideo: 'Création vidéo pour une entreprise',
  message: 'Message',
  send: 'Envoyer',
  sending: 'Envoi en cours…',
  sent: 'Merci, votre message est bien reçu.',
  errors: {
    requis: 'Remplissez votre nom, votre courriel et votre message.',
    courriel: 'Cette adresse courriel ne semble pas valide.',
    long: 'Un des champs est trop long. Raccourcissez votre texte.',
    verification: 'La vérification a échoué. Réessayez dans un instant.',
    limite: 'Vous avez envoyé plusieurs messages. Attendez 10 minutes avant de réessayer.',
    panne: 'Votre message n’a pas pu être enregistré. Réessayez ou écrivez-moi par courriel.',
  },
}
const en: typeof fr = {
  projects: 'Projects',
  contact: 'Contact',
  contactMe: 'Get in touch',
  watchReel: 'Watch the reel',
  pause: 'Pause',
  play: 'Play',
  previous: 'Previous',
  next: 'Next',
  close: 'Close',
  directedBy: 'Directed by',
  production: 'Production',
  year: 'Year',
  role: 'Role',
  awards: 'The film’s selections and awards',
  nextProject: 'Next project',
  allProjects: 'All projects',
  camera: 'Camera and lenses',
  stills: 'Stills',
  enlarge: 'Enlarge image',
  view: 'View',
  playVideo: 'Play the video',
  watchTrailer: 'Watch the trailer',
  watchFilm: 'Watch the film',
  openOn: 'Open on',
  menu: 'Main menu',
  skip: 'Skip to content',
  notFound: 'This page could not be found.',
  home: 'Back to home',
  preview: 'Draft preview',
  leavePreview: 'Leave preview',
  privacy: 'Privacy',
  images: 'Images',
  name: 'Name',
  email: 'Email',
  kind: 'Type of project',
  kindFilm: 'Fiction or documentary',
  kindVideo: 'Video production for a business',
  message: 'Message',
  send: 'Send',
  sending: 'Sending…',
  sent: 'Thank you, your message has been received.',
  errors: {
    requis: 'Please fill in your name, email and message.',
    courriel: 'This email address does not look valid.',
    long: 'One of the fields is too long. Please shorten your text.',
    verification: 'Verification failed. Please try again in a moment.',
    limite: 'You have sent several messages. Please wait 10 minutes before trying again.',
    panne: 'Your message could not be saved. Please try again or write to me by email.',
  },
}
export const copy = { fr, en }
