/**
 * Logique pure du mini-jeu "Le Chaudron d'Awen" (Witch's Cauldron Potion Brewing)
 * Découplée de l'interface graphique pour permettre des tests unitaires fiables.
 */

export type IngredientType = 'dragon_blood' | 'bone_dust' | 'toad_slime' | 'banshee_tears' | 'hell_ember';

export interface IngredientInfo {
  id: IngredientType;
  name: string;
  latinName: string;
  icon: string;
  color: string;
  textColor: string;
  borderColor: string;
  description: string;
  heatEffect: number; // impact sur la température du chaudron (+/-)
}

export const INGREDIENTS: Record<IngredientType, IngredientInfo> = {
  dragon_blood: {
    id: 'dragon_blood',
    name: 'Sang de Dragon',
    latinName: 'Sanguis Draconis',
    icon: '🩸',
    color: '#EF4444',
    textColor: 'text-red-400',
    borderColor: 'border-red-500/60',
    description: 'Fluide ardent récolté sur les monts brumeux d\'Écosse. Fait bouillonner la décoction.',
    heatEffect: +15,
  },
  bone_dust: {
    id: 'bone_dust',
    name: 'Poudre d\'Os de Spectre',
    latinName: 'Pulvis Ossium',
    icon: '🦴',
    color: '#E2E8F0',
    textColor: 'text-slate-300',
    borderColor: 'border-slate-400/60',
    description: 'Calcinée dans les catacombes de Prague. Stabilise la réaction alchimique.',
    heatEffect: 0,
  },
  toad_slime: {
    id: 'toad_slime',
    name: 'Bave de Crapaud Venimeux',
    latinName: 'Mucus Bufonis',
    icon: '🐸',
    color: '#22C55E',
    textColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/60',
    description: 'Extrait visqueux des marais du Dartmoor. Épaissit les sucs occultes.',
    heatEffect: -10,
  },
  banshee_tears: {
    id: 'banshee_tears',
    name: 'Larmes de Banshee',
    latinName: 'Lacrimae Funebres',
    icon: '💧',
    color: '#06B6D4',
    textColor: 'text-cyan-400',
    borderColor: 'border-cyan-500/60',
    description: 'Condensation spectrale recueillie à l\'aube après le chant funèbre.',
    heatEffect: -20,
  },
  hell_ember: {
    id: 'hell_ember',
    name: 'Braise Infernale de Samhain',
    latinName: 'Carbo Infernalis',
    icon: '🔥',
    color: '#F97316',
    textColor: 'text-orange-400',
    borderColor: 'border-orange-500/60',
    description: 'Charbon ardent prélevé sur le grand feu druidique de Tlachtga.',
    heatEffect: +25,
  },
};

export interface PotionRecipe {
  id: string;
  name: string;
  subtitle: string;
  targetIngredients: Record<IngredientType, number>;
  optimalHeatMin: number;
  optimalHeatMax: number;
  basePoints: number;
  difficulty: 'Initié' | 'Adepte' | 'Maître Occulte';
  color: string;
  glowColor: string;
  lore: string;
}

export const POTION_RECIPES: PotionRecipe[] = [
  {
    id: 'elixir_spectre',
    name: 'Élixir de Voile Spectral',
    subtitle: 'Permet de traverser les murs de pierre et d\'échapper aux goules',
    targetIngredients: {
      banshee_tears: 2,
      bone_dust: 1,
      dragon_blood: 0,
      toad_slime: 1,
      hell_ember: 0,
    },
    optimalHeatMin: 25,
    optimalHeatMax: 50,
    basePoints: 350,
    difficulty: 'Initié',
    color: '#38BDF8',
    glowColor: 'rgba(56, 189, 248, 0.5)',
    lore: 'Une décoction translucide et glacée qui fait vibrer l\'âme à la même fréquence que le monde éthéré.',
  },
  {
    id: 'philtre_lycanthrope',
    name: 'Philtre d\'Éveil Lycanthrope',
    subtitle: 'Décuple la force animale et aiguise l\'ouïe nocturne',
    targetIngredients: {
      dragon_blood: 2,
      bone_dust: 1,
      toad_slime: 1,
      banshee_tears: 0,
      hell_ember: 1,
    },
    optimalHeatMin: 55,
    optimalHeatMax: 80,
    basePoints: 550,
    difficulty: 'Adepte',
    color: '#EF4444',
    glowColor: 'rgba(239, 68, 68, 0.5)',
    lore: 'Bout avec une violence sauvage et exhale un parfum musqué de forêt sous la pleine lune.',
  },
  {
    id: 'rosee_avalon',
    name: 'Rosée Vénérable d\'Avalon',
    subtitle: 'Restaure l\'esprit et apaise les tourments de l\'outre-monde',
    targetIngredients: {
      banshee_tears: 2,
      toad_slime: 2,
      bone_dust: 1,
      dragon_blood: 0,
      hell_ember: 0,
    },
    optimalHeatMin: 20,
    optimalHeatMax: 45,
    basePoints: 500,
    difficulty: 'Adepte',
    color: '#10B981',
    glowColor: 'rgba(16, 185, 129, 0.5)',
    lore: 'Distillée selon la tradition des prêtresses celtiques de Cerridwen sous la brume d\'automne.',
  },
  {
    id: 'flamme_hylst',
    name: 'Flamme Harmonieuse d\'Hylst',
    subtitle: 'Transmute les ondes sonores en énergie nécromantique pure',
    targetIngredients: {
      hell_ember: 2,
      dragon_blood: 1,
      bone_dust: 2,
      banshee_tears: 1,
      toad_slime: 0,
    },
    optimalHeatMin: 65,
    optimalHeatMax: 90,
    basePoints: 850,
    difficulty: 'Maître Occulte',
    color: '#A855F7',
    glowColor: 'rgba(168, 85, 247, 0.6)',
    lore: 'Composée par Geoffroy Streit au fond de la crypte lors de l\'enregistrement de "The Umbral Descent".',
  },
  {
    id: 'pierre_philosophale',
    name: 'Élixir Suprême de Samhain',
    subtitle: 'La quintessence alchimique qui ouvre le passage entre vivants et défunts',
    targetIngredients: {
      hell_ember: 2,
      dragon_blood: 2,
      bone_dust: 2,
      banshee_tears: 2,
      toad_slime: 2,
    },
    optimalHeatMin: 45,
    optimalHeatMax: 65,
    basePoints: 1200,
    difficulty: 'Maître Occulte',
    color: '#F59E0B',
    glowColor: 'rgba(245, 158, 11, 0.7)',
    lore: 'L\'ultime chef-d\'œuvre du chaudron d\'airain, n\'accordé qu\'aux plus grands maîtres de l\'Art Noir.',
  },
];

export interface BrewEvaluation {
  success: boolean;
  purityScore: number; // 0 à 100%
  pointsEarned: number;
  rankTitle: string;
  feedback: string;
  heatStatus: 'trop_froid' | 'optimal' | 'trop_chaud' | 'critique';
}

/**
 * Évalue la décoction du chaudron en fonction des ingrédients ajoutés et de la température finale
 */
export function evaluatePotionBrew(
  recipe: PotionRecipe,
  currentIngredients: Record<IngredientType, number>,
  currentHeat: number
): BrewEvaluation {
  let ingredientMatches = 0;
  let totalRequired = 0;
  let excessIngredients = 0;

  for (const [ingKey, targetCount] of Object.entries(recipe.targetIngredients) as [IngredientType, number][]) {
    totalRequired += targetCount;
    const current = currentIngredients[ingKey] || 0;
    if (current === targetCount) {
      ingredientMatches += targetCount;
    } else if (current < targetCount) {
      ingredientMatches += current;
    } else {
      ingredientMatches += targetCount;
      excessIngredients += (current - targetCount);
    }
  }

  // Vérifier aussi les ingrédients qui ne devaient pas être mis
  for (const [ingKey, count] of Object.entries(currentIngredients) as [IngredientType, number][]) {
    if (!recipe.targetIngredients[ingKey] && count > 0) {
      excessIngredients += count;
    }
  }

  // Ratio des ingrédients (0 à 1)
  const ingredientRatio = totalRequired > 0 
    ? Math.max(0, (ingredientMatches - excessIngredients * 0.5) / totalRequired)
    : 0;

  // Évaluation de la chaleur (0 à 1)
  let heatPenalty = 0;
  let heatStatus: 'trop_froid' | 'optimal' | 'trop_chaud' | 'critique' = 'optimal';

  if (currentHeat < recipe.optimalHeatMin) {
    const diff = recipe.optimalHeatMin - currentHeat;
    heatPenalty = Math.min(0.5, diff * 0.02);
    heatStatus = 'trop_froid';
  } else if (currentHeat > recipe.optimalHeatMax) {
    const diff = currentHeat - recipe.optimalHeatMax;
    heatPenalty = Math.min(0.8, diff * 0.03);
    heatStatus = currentHeat >= 95 ? 'critique' : 'trop_chaud';
  }

  // Si chaleur critique (>= 98°C), le chaudron explose
  if (currentHeat >= 98) {
    return {
      success: false,
      purityScore: 0,
      pointsEarned: 0,
      rankTitle: 'Catastrophe Alchimique',
      feedback: '💥 Le chaudron a surchauffé et a explosé dans une déflagration de soufre !',
      heatStatus: 'critique',
    };
  }

  const purityScore = Math.max(0, Math.min(100, Math.round((ingredientRatio * (1 - heatPenalty)) * 100)));

  if (purityScore >= 90) {
    const points = Math.round(recipe.basePoints * 1.5);
    return {
      success: true,
      purityScore,
      pointsEarned: points,
      rankTitle: 'Chef-d\'œuvre Hermétique',
      feedback: '✨ Pureté immaculée ! La potion resplendit d\'une aura légendaire.',
      heatStatus,
    };
  } else if (purityScore >= 60) {
    const points = recipe.basePoints;
    return {
      success: true,
      purityScore,
      pointsEarned: points,
      rankTitle: 'Décoction Réussie',
      feedback: '🧪 Les vapeurs sont stables. La potion produira ses pleins effets occultes.',
      heatStatus,
    };
  } else if (purityScore >= 35) {
    const points = Math.round(recipe.basePoints * 0.4);
    return {
      success: false,
      purityScore,
      pointsEarned: points,
      rankTitle: 'Brouet Impur',
      feedback: '⚠️ Dosage hésitant ou température instable. L\'élixir s\'est troublé.',
      heatStatus,
    };
  } else {
    return {
      success: false,
      purityScore,
      pointsEarned: 0,
      rankTitle: 'Échec de Transmutation',
      feedback: '☠️ Le mélange a tourné au poison fade. Les esprits rejettent cette offrande.',
      heatStatus,
    };
  }
}
