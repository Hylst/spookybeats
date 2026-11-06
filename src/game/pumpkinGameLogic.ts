/**
 * Logique pure du mini-jeu "Le Massacre de Citrouilles" (The Pumpkin Smasher)
 * Découplée de l'interface graphique pour permettre des tests unitaires fiables.
 */

export type ItemType = 'pumpkin' | 'golden_pumpkin' | 'ghost' | 'trap' | 'hourglass' | 'blood_pumpkin';

export interface ScoreResult {
  pointsEarned: number;
  newScore: number;
  newCombo: number;
  multiplier: number;
  isFrenzy: boolean;
  timeBonusSeconds?: number;
}

export interface SpawnItem {
  id: string;
  type: ItemType;
  position: number; // 0 to 8 (grille 3x3)
  points: number;
  durationMs: number;
  label: string;
}

/**
 * Calcule le multiplicateur de combo
 */
export function getComboMultiplier(combo: number): number {
  if (combo >= 15) return 5.0; // Surnaturel x5
  if (combo >= 10) return 4.0; // Surnaturel x4
  if (combo >= 6) return 3.0;  // Dément x3
  if (combo >= 3) return 2.0;  // Frisson x2
  return 1.0;
}

/**
 * Calcule le score après un coup (citrouille, fantôme, ou piège)
 */
export function processHit(
  currentScore: number,
  currentCombo: number,
  itemType: ItemType
): ScoreResult {
  if (itemType === 'trap') {
    // Piège : pénalité de points et réinitialisation du combo
    const penalty = 200;
    const newScore = Math.max(0, currentScore - penalty);
    return {
      pointsEarned: -penalty,
      newScore,
      newCombo: 0,
      multiplier: 1.0,
      isFrenzy: false,
    };
  }

  const basePoints: Record<Exclude<ItemType, 'trap'>, number> = {
    pumpkin: 100,
    ghost: 200,
    golden_pumpkin: 500,
    hourglass: 150,
    blood_pumpkin: 600,
  };

  const newCombo = currentCombo + 1;
  const multiplier = getComboMultiplier(newCombo);
  const pointsEarned = Math.round(basePoints[itemType] * multiplier);
  const newScore = currentScore + pointsEarned;
  const isFrenzy = itemType === 'golden_pumpkin' || itemType === 'blood_pumpkin' || newCombo >= 10;
  const timeBonusSeconds = itemType === 'hourglass' ? 5 : undefined;

  return {
    pointsEarned,
    newScore,
    newCombo,
    multiplier,
    isFrenzy,
    timeBonusSeconds,
  };
}

/**
 * Attribue un rang nécromantique en fonction du score
 */
export function getNecromancerRank(score: number): { title: string; color: string } {
  if (score >= 20000) return { title: 'Seigneur Suprême des Ténèbres', color: '#39FF14' };
  if (score >= 12000) return { title: 'Maître Fossoyeur', color: '#FF7518' };
  if (score >= 6000) return { title: 'Chasseur de Goules', color: '#DFB7FF' };
  if (score >= 2000) return { title: 'Fossoyeur Initié', color: '#E6E1DC' };
  return { title: 'Apprenti Nécromancien', color: '#8C8494' };
}

/**
 * Génère un item de spawn avec des probabilités dynamiques selon la difficulté
 */
export function generateSpawn(
  occupiedPositions: number[],
  difficultyLevel: number = 1
): SpawnItem | null {
  const allPositions = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const available = allPositions.filter(p => !occupiedPositions.includes(p));

  if (available.length === 0) return null;

  const position = available[Math.floor(Math.random() * available.length)];
  const rand = Math.random();

  let type: ItemType = 'pumpkin';
  let points = 100;
  let label = '+100';
  let durationMs = Math.max(900, 2200 - difficultyLevel * 200);

  if (rand < 0.12) {
    type = 'trap';
    points = -200;
    label = 'PIÈGE !';
    durationMs = Math.max(1200, 2400 - difficultyLevel * 150);
  } else if (rand < 0.28) {
    type = 'ghost';
    points = 200;
    label = '+200';
    durationMs = Math.max(800, 1800 - difficultyLevel * 180);
  } else if (rand < 0.38) {
    type = 'golden_pumpkin';
    points = 500;
    label = '+500 FRENZY';
    durationMs = Math.max(700, 1500 - difficultyLevel * 150);
  } else if (rand < 0.46) {
    type = 'hourglass';
    points = 150;
    label = '+5s SABLIER';
    durationMs = Math.max(900, 1900 - difficultyLevel * 160);
  } else if (rand < 0.52) {
    type = 'blood_pumpkin';
    points = 600;
    label = '+600 SANG FRENZY';
    durationMs = Math.max(650, 1400 - difficultyLevel * 150);
  }

  return {
    id: `spawn-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    type,
    position,
    points,
    durationMs,
    label,
  };
}

/**
 * Formate le temps restant en MM:SS
 */
export function formatGameTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
