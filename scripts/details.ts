/**
 * Détails des projets : synopsis (résumés en nos mots), équipe et liens.
 * Équipe et production : fiches de Vital Distribution, lues le 2026-11-26.
 */
type Line = { fr: string; en: string }
type Details = {
  realisation?: string
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
  'Nucléaire': { liens: vimeo('https://vimeo.com/1147476870') },
  'Shattered': { liens: vimeo('https://vimeo.com/862045443') },
  'Gro$ lot': {
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
