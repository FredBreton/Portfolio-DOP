/**
 * Détails des projets : synopsis (résumés en nos mots), équipe et liens.
 * Équipe et production : fiches de Vital Distribution, lues le 2026-11-26.
 * Dans mes élans, Nucléaire et Shattered : descriptions YouTube et Vimeo des films, lues le 2026-11-26.
 */
type Line = { fr: string; en: string }
type Details = {
  realisation?: string
  /** Étiquette d'un vrai prix sur la vignette de l'accueil. */
  mention?: Line
  annee?: number
  /** Bande-annonce Vimeo de Vital Productions; sans version anglaise, l'anglais montre la française. */
  video?: { fr: string; en?: string }
  production?: string
  description?: Line
  liens?: (Line & { url: string })[]
  equipe?: (Line & { noms: string })[]
}

const vimeo = (url: string) => [{ fr: 'Voir sur Vimeo', en: 'Watch on Vimeo', url }]
const SCENARIO = { fr: 'Scénario', en: 'Screenplay' }
const MONTAGE = { fr: 'Montage', en: 'Editing' }
const SON = { fr: 'Son', en: 'Sound' }
const MUSIQUE = { fr: 'Musique', en: 'Music' }

export const details: Record<string, Details> = {
  'Dans mes élans de grande obsédée': {
    description: {
      fr: 'Un film sur les ombres qui naissent dans l’enfance, et sur ces premières blessures qui laissent une longue trace.',
      en: 'A film about the shadows born in childhood, and the first wounds that leave a lasting mark.',
    },
    equipe: [{ ...SCENARIO, noms: 'Alicia Lemieux' }],
  },
  // Aucun synopsis en ligne. Année et interprète : fiches de Devi Julia Pelletier chez Agence Mel et Agence Lafond.
  'Mes visions de chat': {
    annee: 2022,
    equipe: [{ fr: 'Interprétation', en: 'Cast', noms: 'Devi Julia Pelletier' }],
  },
  'Nucléaire': {
    description: {
      fr: 'Un court métrage de poésie, porté par les poèmes d’Alicia Lemieux, dans un monde post-apocalyptique.',
      en: 'A poetry short film carried by Alicia Lemieux’s poems, set in a post-apocalyptic world.',
    },
    liens: vimeo('https://vimeo.com/1147476870'),
    equipe: [
      { fr: 'Poèmes', en: 'Poems', noms: 'Alicia Lemieux' },
      { fr: 'Assistance caméra', en: 'Camera assistant', noms: 'Antoine Doan' },
      { fr: 'Direction artistique', en: 'Art direction', noms: 'Victoria Beaudoin-Côté' },
      { ...MUSIQUE, noms: 'Inès Chfiri' },
      { fr: 'Colorisation', en: 'Colour grading', noms: 'Steven Mercier' },
    ],
  },
  // La vidéo Vimeo n'est plus disponible (vérifié le 2026-11-26) : pas de bouton.
  'Shattered': {
    mention: { fr: 'Mention honorable · Vienne', en: 'Honorable mention · Vienna' },
    description: {
      fr: 'En plein confinement, Alison est quittée par son copain. Seule, elle tente de passer à autre chose, mais son passé la rattrape.',
      en: 'In the middle of a lockdown, Alison’s boyfriend leaves her. Alone, she tries to move on, but her past catches up with her.',
    },
    equipe: [
      { fr: 'Interprétation', en: 'Cast', noms: 'Camille Zorel, Xavier Truong' },
      { ...MONTAGE, noms: 'Philippe Boissier' },
    ],
  },
  'Gro$ lot': {
    video: { fr: 'https://vimeo.com/796682492' },
    production: 'Serge Desrosiers, Vital Productions',
    description: {
      fr: 'Dans un village de Noël, un billet de loterie offert pour consoler un ami s’avère gagnant : un million de dollars. L’argent met leur amitié et leurs valeurs à l’épreuve.',
      en: 'In a Christmas village, a lottery ticket given to cheer up a friend turns out to be a winner: one million dollars. The money puts their friendship and values to the test.',
    },
    liens: [{ fr: 'Fiche du film chez Vital', en: 'Film page at Vital', url: 'https://www.vitaldistribution.ca/films/gro%24-lot' }],
    equipe: [
      { ...SCENARIO, noms: 'Frédérick Breton, Sharbel El-Showairy' },
      { fr: 'Interprétation', en: 'Cast', noms: 'Lénie B. Desrosiers, Sacha Bolduc, Frédérick Breton' },
      { ...MONTAGE, noms: 'Yvann Thibaudeau' },
      { ...SON, noms: 'Jérôme Boiteau' },
      { fr: 'Direction artistique', en: 'Art direction', noms: 'Marie-Andrée Brière' },
    ],
  },
  'Herby': {
    video: { fr: 'https://vimeo.com/1181207584', en: 'https://vimeo.com/1181207647' },
    production: 'Roxanne Geoffroy, Serge Desrosiers, Vital Productions',
    description: {
      fr: 'À 53 ans, Herby réveille un rêve de jeunesse : piloter en NASCAR Canada. Le film suit sa première saison, entre espoirs, blessures du passé et retrouvailles.',
      en: 'At 53, Herby revives a youthful dream: racing in NASCAR Canada. The film follows his first season, through hopes, old wounds and reunions.',
    },
    liens: [{ fr: 'Louer le film chez Vital', en: 'Rent the film at Vital', url: 'https://www.vitaldistribution.ca/films/herby' }],
    equipe: [
      { ...MONTAGE, noms: 'Antoine Bergevin-Richer' },
      { ...MUSIQUE, noms: 'Rioux' },
    ],
  },
  'Au pied du mur': {
    mention: { fr: 'Prix du public · Fantasia 2025', en: 'Audience Award · Fantasia 2025' },
    video: { fr: 'https://vimeo.com/1091824894', en: 'https://vimeo.com/1091824309' },
    realisation: 'Alexandra Elkin, Étienne Plasse',
    production: 'Serge Desrosiers, Vital Productions',
    description: {
      fr: 'De Red Rock Canyon à Yosemite, la cinéaste Alexandra Elkin part à l’aventure avec deux grimpeurs septuagénaires, dont Dierdre Wolownick, qui a gravi El Capitan à 71 ans.',
      en: 'From Red Rock Canyon to Yosemite, filmmaker Alexandra Elkin sets out with two climbers in their seventies, including Dierdre Wolownick, who scaled El Capitan at 71.',
    },
    liens: [{ fr: 'Louer le film chez Vital', en: 'Rent the film at Vital', url: 'https://www.vitaldistribution.ca/films/au-pied-du-mur' }],
    equipe: [
      { ...SCENARIO, noms: 'Alexandra Elkin, Étienne Plasse' },
      { ...MONTAGE, noms: 'Étienne Plasse' },
      { ...MUSIQUE, noms: 'William Gendreau Coronel' },
      { ...SON, noms: 'Jérôme Boiteau' },
    ],
  },
}
