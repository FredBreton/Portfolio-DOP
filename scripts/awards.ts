/**
 * Sélections et prix reçus par les films (pas par Frédérick).
 * Source : fiches de Vital Distribution, lues le 2026-11-26; prix Fantasia confirmé par Alexis.
 */
type Line = { fr: string; en: string }

export const awards: Record<string, Line[]> = {
  'Gro$ lot': [
    { fr: '41e Rendez-vous Québec Cinéma (Canada)', en: '41st Rendez-vous Québec Cinéma (Canada)' },
    { fr: '7e Courts d’un soir – Festival international de courts-métrages de Montréal (Canada)', en: '7th Courts d’un soir – Montreal International Short Film Festival (Canada)' },
    { fr: '24e ShorTS International Film Festival – section Maremetraggio (Italie)', en: '24th ShorTS International Film Festival – Maremetraggio section (Italy)' },
    { fr: '12e Festival de cinéma de la ville de Québec (Canada)', en: '12th Quebec City Film Festival (Canada)' },
    { fr: '37e Festival international de cinéma francophone d’Acadie (Canada)', en: '37th Festival international de cinéma francophone d’Acadie (Canada)' },
    { fr: '3e Festival de films d’auteur de Val-Morin (Canada)', en: '3rd Festival de films d’auteur de Val-Morin (Canada)' },
    { fr: '8e Ottawa Canadian Film Festival (Canada)', en: '8th Ottawa Canadian Film Festival (Canada)' },
  ],
  'Au pied du mur': [
    { fr: 'Fantasia 2025 – Prix du public, argent, meilleur film québécois', en: 'Fantasia 2025 – Audience Award, silver, Best Québécois Film' },
    { fr: 'Festival du film international de Baie-Comeau (Cinoche) – Sélection officielle, 2026', en: 'Baie-Comeau International Film Festival (Cinoche) – Official selection, 2026' },
    { fr: 'Festival du film de l’Outaouais – Sélection officielle, 2025', en: 'Festival du film de l’Outaouais – Official selection, 2025' },
    { fr: 'Montana International Film Festival – Sélection officielle en compétition, 2025', en: 'Montana International Film Festival – Official selection, in competition, 2025' },
    { fr: 'Ulsan Ulju Mountain Film Festival (Corée du Sud) – Sélection officielle, compétition internationale, 2025', en: 'Ulsan Ulju Mountain Film Festival (South Korea) – Official selection, international competition, 2025' },
  ],
}
