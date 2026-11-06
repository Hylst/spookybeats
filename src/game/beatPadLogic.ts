/**
 * Logique pure du Beat Pad Studio : banques de presets gothiques, motifs rythmiques et gestion des patterns.
 */

export interface RhythmPreset {
  id: string;
  name: string;
  bpm: number;
  description: string;
  genre: string;
  sequence: boolean[][]; // 4 pistes x 8 steps (Kick, Snare/Cloche, Hi-Hat, SFX)
}

export const GOTHIC_RHYTHM_PRESETS: RhythmPreset[] = [
  {
    id: 'valse_macabre',
    name: 'Valse Macabre',
    bpm: 128,
    genre: 'Gothique Syncopé',
    description: 'Cadence ternaire sombre avec battements sourds et tintements de cloche funèbre.',
    sequence: [
      [true, false, false, true, false, false, true, false],  // Kick
      [false, false, true, false, false, true, false, false],  // Cloche / Snare
      [true, true, true, true, true, true, true, true],        // Hi-Hat
      [false, false, false, false, true, false, false, false],  // SFX Cri
    ],
  },
  {
    id: 'requiem_industriel',
    name: 'Requiem Industriel',
    bpm: 140,
    genre: 'Dark Electro / EBM',
    description: 'Rythme lourd, martial et percutant taillé pour la cathédrale souterraine.',
    sequence: [
      [true, false, false, false, true, false, false, false],  // Kick 4-on-the-floor
      [false, false, true, false, false, false, true, false],  // Snare lourd
      [true, true, true, true, true, true, true, true],        // Hi-Hat rapide
      [false, false, false, true, false, false, false, true],  // SFX Électro
    ],
  },
  {
    id: 'marche_funebre_dub',
    name: 'Marche Funèbre Dub',
    bpm: 90,
    genre: 'Dark Ambient Dub',
    description: 'Basse abyssale lente, échos de chaîne et réverbération caverneuse.',
    sequence: [
      [true, false, false, false, false, false, true, false],  // Kick lent
      [false, false, false, false, true, false, false, false],  // Snare dub
      [true, false, true, false, true, false, true, false],    // Hi-Hat espacé
      [false, true, false, false, false, false, false, true],  // SFX Grincement
    ],
  },
  {
    id: 'sabbat_acid',
    name: 'Sabbat Acid des Sorcières',
    bpm: 135,
    genre: 'Acid Synth Horror',
    description: 'Hi-hats fiévreux, syncopes agressives et cris de créatures sous la pleine lune.',
    sequence: [
      [true, false, true, false, false, true, false, false],  // Kick syncopé
      [false, false, true, false, false, false, true, false],  // Snare
      [true, true, true, true, true, true, true, true],        // Hi-Hat
      [true, false, false, true, false, true, false, false],   // SFX Hurlement
    ],
  },
  {
    id: 'danse_spectres',
    name: 'Danse des Spectres',
    bpm: 120,
    genre: 'Halloween Groovy',
    description: 'Percussions dansantes d’ossements et clapotis d’ectoplasme joueur.',
    sequence: [
      [true, false, false, true, false, false, true, false],  // Kick
      [false, false, true, false, false, false, true, false],  // Snare
      [false, true, false, true, false, true, false, true],    // Hi-Hat contre-temps
      [false, false, false, false, false, true, false, false], // SFX Rire
    ],
  },
];

/**
 * Crée une grille vierge de 4 pistes x 8 steps
 */
export function createEmptySequence(): boolean[][] {
  return [
    [false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false],
  ];
}

/**
 * Alterne l'état d'un pas dans la séquence
 */
export function toggleSequenceStep(
  seq: boolean[][],
  trackIdx: number,
  stepIdx: number
): boolean[][] {
  return seq.map((track, tIdx) => {
    if (tIdx !== trackIdx) return [...track];
    return track.map((val, sIdx) => (sIdx === stepIdx ? !val : val));
  });
}

/**
 * Génère un motif rythmique procédural aléatoire
 */
export function generateRandomPattern(): boolean[][] {
  return [
    // Kick (priorité aux temps forts 0, 4)
    [true, Math.random() < 0.2, Math.random() < 0.3, false, true, Math.random() < 0.2, false, Math.random() < 0.2],
    // Snare (priorité aux temps 2, 6)
    [false, false, true, Math.random() < 0.2, false, false, true, Math.random() < 0.1],
    // Hi-Hat (densité soutenue)
    Array.from({ length: 8 }, () => Math.random() < 0.75),
    // SFX (ponctuels)
    Array.from({ length: 8 }, () => Math.random() < 0.2),
  ];
}
