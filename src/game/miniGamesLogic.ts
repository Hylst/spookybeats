/**
 * Logique pure des mini-jeux d'Halloween :
 * 1. Simon de l'Autel des Sortilèges (Altar Memory)
 * 2. Les Sarcophages de la Crypte (Sarcophagi Treasure Push Your Luck)
 */

export type AltarGlyph = 'pumpkin' | 'skull' | 'ghost' | 'bat';

export type SarcophagusContent = 'gem' | 'candy' | 'relic' | 'curse' | 'key' | 'shield';

export interface SarcophagusTile {
  id: number;
  revealed: boolean;
  content: SarcophagusContent;
  points: number;
}

/**
 * Simon Altar : Génère le prochain glyphe aléatoire dans la séquence
 */
export function getNextAltarGlyph(): AltarGlyph {
  const glyphs: AltarGlyph[] = ['pumpkin', 'skull', 'ghost', 'bat'];
  return glyphs[Math.floor(Math.random() * glyphs.length)];
}

/**
 * Simon Altar : Titre d'ambiance selon le tour
 */
export function getAltarRoundTitle(round: number): string {
  const titles = [
    'Éveil du Sépulcre',
    'Lueur de la Mandragore',
    'Appel du Lycanthrope',
    'Danse des Spectres',
    'Rituel de la Lune Rouge',
    'Incantation Suprême d\'Hylst',
  ];
  return titles[Math.min(round - 1, titles.length - 1)];
}

/**
 * Simon Altar : Vérifie l'entrée du joueur
 */
export function verifyAltarSequence(
  sequence: AltarGlyph[],
  playerInput: AltarGlyph[]
): { isCorrect: boolean; isComplete: boolean } {
  for (let i = 0; i < playerInput.length; i++) {
    if (playerInput[i] !== sequence[i]) {
      return { isCorrect: false, isComplete: false };
    }
  }
  return {
    isCorrect: true,
    isComplete: playerInput.length === sequence.length,
  };
}

/**
 * Calcule le score pour un tour d'Autel réussi
 */
export function calculateAltarRoundScore(round: number): number {
  return round * 250;
}

/**
 * Nom de l'étage pour la descente de crypte
 */
export function getFloorName(floor: number): string {
  switch (floor) {
    case 1:
      return 'Les Catacombes Oubliées';
    case 2:
      return 'Le Caveau des Sacrifices';
    case 3:
      return 'La Chambre Funéraire Royale';
    case 4:
      return 'L\'Abysse des Âmes Perdues';
    default:
      return `Crypte Profonde - Niveau ${floor}`;
  }
}

/**
 * Bonus de passage à l'étage inférieur
 */
export function calculateFloorClearBonus(floor: number): number {
  return floor * 500;
}

/**
 * Sarcophages : Génère une grille de 9 sarcophages avec difficulté par étage.
 * Par défaut (floor = 2), génère exactement 2 malédictions pour une compatibilité totale.
 */
export function generateSarcophagiGrid(floor: number = 2): SarcophagusTile[] {
  let contents: SarcophagusContent[];

  if (floor === 1) {
    contents = ['curse', 'key', 'shield', 'relic', 'gem', 'gem', 'candy', 'candy', 'candy'];
  } else if (floor === 2) {
    // 2 malédictions pour l'étage 2 (compatibilité stricte avec les tests existants)
    contents = ['curse', 'curse', 'key', 'shield', 'relic', 'gem', 'gem', 'candy', 'candy'];
  } else if (floor === 3) {
    contents = ['curse', 'curse', 'curse', 'key', 'relic', 'relic', 'gem', 'gem', 'candy'];
  } else {
    // Étage 4 et + : 4 malédictions impitoyables
    contents = ['curse', 'curse', 'curse', 'curse', 'key', 'relic', 'gem', 'gem', 'candy'];
  }

  // Mélange aléatoire de Fisher-Yates
  for (let i = contents.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [contents[i], contents[j]] = [contents[j], contents[i]];
  }

  const pointMap: Record<SarcophagusContent, number> = {
    gem: 400,
    candy: 150,
    relic: 750,
    key: 300,
    shield: 200,
    curse: 0,
  };

  return contents.map((c, idx) => ({
    id: idx,
    revealed: false,
    content: c,
    points: pointMap[c],
  }));
}
