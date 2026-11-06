/**
 * Logique pure de la quête 3D "La Chasse aux 7 Reliques Fantômes du Manoir"
 */

export interface ManorRelic {
  id: string;
  name: string;
  locationName: string;
  clue: string;
  lore: string;
  soundCue: string;
  points: number;
}

export const MANOR_RELICS: ManorRelic[] = [
  {
    id: 'bell',
    name: 'Le Tocsin Funèbre du Clocher',
    locationName: 'Tour aux Chauves-Souris',
    clue: 'Au sommet de la flèche gothique, là où le bronze résonne à minuit.',
    lore: 'Fondu au XVe siècle avec les reliques d\'un prieuré englouti. Son tintement éloigne les goules.',
    soundCue: 'single-church-bell.mp3',
    points: 250,
  },
  {
    id: 'stained_glass',
    name: 'Le Vitrail d\'Awen de Cerridwen',
    locationName: 'Grande Façade',
    clue: 'La haute baie d\'ambre et d\'émeraude qui luit au premier étage.',
    lore: 'Composé de verres teintés à l\'antimoine qui filtrent la lueur lunaire en une onde sonore protectrice.',
    soundCue: 'haunted-magic-bell.mp3',
    points: 250,
  },
  {
    id: 'porch_pumpkin',
    name: 'La Citrouille Gardienne du Seuil',
    locationName: 'Parvis aux Citrouilles',
    clue: 'Au pied des marches de pierre, ses orbites flamboyantes scrutent les visiteurs.',
    lore: 'Sculptée selon le rite de Stingy Jack, elle brûle d\'une braise inextinguible tombée de l\'enfer.',
    soundCue: 'pumpkin-squish',
    points: 200,
  },
  {
    id: 'celtic_cross',
    name: 'La Croix Celtique du Cimetière',
    locationName: 'Cimetière Brumeux',
    clue: 'Parmi les herbes folles et les tombes moussues à l\'ouest du domaine.',
    lore: 'Gravée d\'entrelacs gaéliques, cette stèle marque l\'entrée de l\'ancienne crypte familiale d\'Hylst.',
    soundCue: 'tombstone-thud',
    points: 250,
  },
  {
    id: 'gargoyle_roof',
    name: 'La Gargouille Sentinelle de Faîte',
    locationName: 'Toiture en Ardoise',
    clue: 'Accroupie sur la corniche d\'ardoise, prête à bondir sur les intrus.',
    lore: 'Tant que son regard de basalte reste tourné vers la lune, aucun mauvais esprit ne peut violer le sanctuaire.',
    soundCue: 'creepy-laugh.mp3',
    points: 200,
  },
  {
    id: 'porch_lantern',
    name: 'La Lanterne de Phosphore',
    locationName: 'Entrée Principale',
    clue: 'Suspendue à l\'arche de fer forgé au-dessus du lourd portail de chêne.',
    lore: 'Alimentée par l\'essence éthérée des feux follets prélevés dans les marais.',
    soundCue: 'door-creak',
    points: 150,
  },
  {
    id: 'bat_sentinel',
    name: 'L\'Ombre de la Chauve-Souris Royale',
    locationName: 'Ciel Nocturne',
    clue: 'Virevolte autour de la pleine lune au-dessus des cimes des saules pleureurs.',
    lore: 'Messagère ailée de Geoffroy Streit, elle porte les partitions secrètes entre les dimensions.',
    soundCue: 'bat-chirp',
    points: 200,
  },
];

export interface QuestProgress {
  foundCount: number;
  totalCount: number;
  isComplete: boolean;
  scoreBonus: number;
  title: string;
}

/**
 * Évalue la progression de la quête des reliques
 */
export function calculateManorQuestProgress(foundIds: string[]): QuestProgress {
  const totalCount = MANOR_RELICS.length;
  const uniqueFound = Array.from(new Set(foundIds.filter((id) => MANOR_RELICS.some((r) => r.id === id))));
  const foundCount = uniqueFound.length;
  const isComplete = foundCount === totalCount;

  let scoreBonus = 0;
  for (const id of uniqueFound) {
    const relic = MANOR_RELICS.find((r) => r.id === id);
    if (relic) scoreBonus += relic.points;
  }

  if (isComplete) {
    scoreBonus += 500; // Grand bonus de complétion
  }

  let title = 'Visiteur Égaré';
  if (foundCount >= 7) title = 'Maître Souverain du Manoir d\'Hylst';
  else if (foundCount >= 5) title = 'Initié des Sépulcres';
  else if (foundCount >= 3) title = 'Chercheur d\'Ombres';
  else if (foundCount >= 1) title = 'Explorateur Funeste';

  return {
    foundCount,
    totalCount,
    isComplete,
    scoreBonus,
    title,
  };
}
