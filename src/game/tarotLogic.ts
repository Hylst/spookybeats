import { getAssetUrl } from '../utils/assetPath';
/**
 * Logique pure du Tarot Funeste de la Crypte
 * Conçu pour SpookyBeats - Geoffroy Streit (Hylst)
 */

export interface TarotCard {
  id: string;
  arcanaNumber: string;
  name: string;
  title: string;
  subtitle: string;
  latinMotto: string;
  element: 'spectral' | 'alchimique' | 'tenebreux' | 'osseux' | 'vegetal';
  image: string;
  uprightProphecy: string;
  reversedProphecy: string;
  darkHumorAdvice: string;
  linkedEnigmaId: string;
  spectralManaReward: number;
}

export interface DrawnCard {
  card: TarotCard;
  isReversed: boolean;
  positionLabel: string;
  positionDescription: string;
  revealed: boolean;
}

export type TarotSpreadType = 'single' | 'trinity';

export const TAROT_CARD_BACK_IMAGE = getAssetUrl('assets/tarot/back.jpg');

export const CRYPT_TAROT_DECK: TarotCard[] = [
  {
    id: 'squelette-celliste',
    arcanaNumber: 'XIII',
    name: 'Le Squelette au Violoncelle',
    title: 'L’Archet d’Outre-Tombe',
    subtitle: 'Virtuosité Post-Mortem & Résonance Sépulcrale',
    latinMotto: 'Musica mortis nunquam tacet',
    element: 'osseux',
    image: getAssetUrl('assets/tarot/skeleton_cellist.jpg'),
    uprightProphecy:
      'Votre prochain solo sépulcral réveillera un vampire particulièrement mélomane et susceptible. Les vibrations de vos graves fissureront les doutes qui vous retenaient cloué au sol.',
    reversedProphecy:
      'Une corde de boyau spectral va claquer en plein récital solennel. Pas de panique : le public des spectres croira à une audace contemporaine révolutionnaire.',
    darkHumorAdvice:
      'Toujours accorder son violoncelle au diapason d’un glas d’église abandonnée : ça évite d’attirer les fausses notes et les créanciers.',
    linkedEnigmaId: 'enigma-musique-1',
    spectralManaReward: 65,
  },
  {
    id: 'roi-citrouille',
    arcanaNumber: 'IV',
    name: 'Le Roi Citrouille Désabusé',
    title: 'Le Monarque des Potagers Hantés',
    subtitle: 'Souveraineté Végétale & Mauvaise Humeur Royale',
    latinMotto: 'Cucurbita regnat in cinere',
    element: 'vegetal',
    image: getAssetUrl('assets/tarot/grumpy_pumpkin.jpg'),
    uprightProphecy:
      'Un être mesquin et mal inspiré tentera de vous réduire en velouté d’automne au potimarron. Restez stoïque : votre écorce est mille fois trop coriace pour leurs modestes couteaux de cuisine.',
    reversedProphecy:
      'Votre couronne vacille dangereusement sur vos pépins roussis. Les courges de votre entourage manigancent un coup d’État légumier sous vos yeux mi-clos.',
    darkHumorAdvice:
      'Ne souriez jamais à un maraîcher nocturne sans avoir d’abord vérifié qu’il n’a pas une râpe à muscade cachée dans sa redingote.',
    linkedEnigmaId: 'enigma-bestiaire-2',
    spectralManaReward: 60,
  },
  {
    id: 'chauve-souris-the',
    arcanaNumber: 'XVIII',
    name: 'La Chauve-Souris Nostalgique',
    title: 'L’Infusion Crépusculaire',
    subtitle: 'Écholocation Mélancolique & Tisane en Suspens',
    latinMotto: 'Volo ergo somnio inversus',
    element: 'spectral',
    image: getAssetUrl('assets/tarot/depressed_bat.jpg'),
    uprightProphecy:
      'Siroter une tisane de belladone la tête en bas sous un quartier de lune vous apportera une illumination philosophique d’une profondeur abyssale. Vous comprendrez enfin le sens des impôts fonciers.',
    reversedProphecy:
      'Distrait par une pensée spleenétique, vous risquez de percuter de plein fouet une gargouille en grès. Saluez-la poliment en accusant l’humidité ambiante.',
    darkHumorAdvice:
      'Si votre écholocation vous renvoie un écho d’angoisse existentielle, éteignez la lune et reprenez deux sucres dans votre infusion.',
    linkedEnigmaId: 'enigma-bestiaire-1',
    spectralManaReward: 55,
  },
  {
    id: 'faucheuse-conge',
    arcanaNumber: '0',
    name: 'La Faucheuse en Congé',
    title: 'Le Repos de l’Ankou',
    subtitle: 'Cocktail de Mort-aux-Rats & Scythe Décorée',
    latinMotto: 'Mors quoque requiescit in umbra',
    element: 'tenebreux',
    image: getAssetUrl('assets/tarot/reaper_vacation.jpg'),
    uprightProphecy:
      'Tous vos e-mails marqués « URGENT : Réponse demandée avant hier » resteront enfouis dans les sables du temps. Personne ne viendra troubler votre sieste au caveau.',
    reversedProphecy:
      'Votre remplaçant par intérim n’a pas lu le mode d’emploi de la faux et a accidentellement tondu le gazon du cimetière au lieu de récolter les âmes en perdition.',
    darkHumorAdvice:
      'Mettre un répondeur vocal qui émet un râle d’outre-tombe suffit généralement à réduire de 98% les réunions inutiles.',
    linkedEnigmaId: 'enigma-sepulcres-1',
    spectralManaReward: 70,
  },
  {
    id: 'chat-alchimiste',
    arcanaNumber: 'I',
    name: 'Le Chat Alchimiste',
    title: 'Le Renversement Magistral',
    subtitle: 'Curiosité Féline & Transmutation Chaotique',
    latinMotto: 'Felix cadit, elixir manat',
    element: 'alchimique',
    image: getAssetUrl('assets/tarot/alchemist_cat.jpg'),
    uprightProphecy:
      'Par une nonchalante poussée de patte, vous allez renverser une situation que d’autres croyaient immuable depuis trois siècles. La réaction en chaîne sera miraculeuse.',
    reversedProphecy:
      'Une fiole contenant l’essence même de votre sérénité va glisser du rebord de la commode. Inutile de feindre l’innocence avec vos grands yeux ronds.',
    darkHumorAdvice:
      'Si un rituel alchimique échoue lamentablement, marchez dessus avec dédain et allez dormir dix-huit heures sur le grimoire du maître.',
    linkedEnigmaId: 'enigma-alchimie-1',
    spectralManaReward: 60,
  },
];

/**
 * Récupère toutes les cartes de la crypte
 */
export function getAllTarotCards(): TarotCard[] {
  return [...CRYPT_TAROT_DECK];
}

/**
 * Recherche une carte par son identifiant
 */
export function getTarotCardById(id: string): TarotCard | undefined {
  return CRYPT_TAROT_DECK.find((c) => c.id === id);
}

/**
 * Réalise un tirage de cartes avec positions spécifiques
 */
export function drawTarotSpread(
  spreadType: TarotSpreadType = 'single',
  allowReversed: boolean = true,
  seedRandom?: () => number
): DrawnCard[] {
  const rng = seedRandom || Math.random;
  const deckCopy = [...CRYPT_TAROT_DECK];

  // Mélange de Fisher-Yates
  for (let i = deckCopy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [deckCopy[i], deckCopy[j]] = [deckCopy[j], deckCopy[i]];
  }

  if (spreadType === 'single') {
    const card = deckCopy[0];
    const isReversed = allowReversed ? rng() > 0.6 : false;
    return [
      {
        card,
        isReversed,
        positionLabel: 'Lame du Destin Immédiat',
        positionDescription: 'L’influence occulte qui pèse sur vos décisions de l’instant.',
        revealed: false,
      },
    ];
  }

  // Triptyque Funeste (3 cartes)
  const positions = [
    {
      label: 'Passé Maudit',
      description: 'Ce qui a péri dans l’ombre mais continue de gratter à votre porte.',
    },
    {
      label: 'Présent Spectral',
      description: 'La brume dans laquelle vous avancez en trébuchant sur de vieilles reliques.',
    },
    {
      label: 'Avenir Sépulcral',
      description: 'Ce que les astres décatis et les chauves-souris vous réservent sans pitié.',
    },
  ];

  return deckCopy.slice(0, 3).map((card, idx) => ({
    card,
    isReversed: allowReversed ? rng() > 0.55 : false,
    positionLabel: positions[idx].label,
    positionDescription: positions[idx].description,
    revealed: false,
  }));
}

/**
 * Calcule l'interprétation d'ensemble d'un tirage
 */
export function interpretTarotSpread(drawn: DrawnCard[]): {
  overallTitle: string;
  verdict: string;
  totalRewardMana: number;
} {
  if (drawn.length === 0) {
    return {
      overallTitle: 'Le Silence du Tombeau',
      verdict: 'Aucune carte n’a encore bravé la lumière de nos bougies spectrales.',
      totalRewardMana: 0,
    };
  }

  const totalMana = drawn.reduce((sum, item) => sum + item.card.spectralManaReward, 0);

  if (drawn.length === 1) {
    const card = drawn[0].card;
    const isRev = drawn[0].isReversed;
    return {
      overallTitle: `L’Oracle d’Arcane ${card.arcanaNumber}`,
      verdict: isRev ? card.reversedProphecy : card.uprightProphecy,
      totalRewardMana: totalMana,
    };
  }

  // Triptyque
  const hasReversed = drawn.some((d) => d.isReversed);
  const elements = drawn.map((d) => d.card.element);

  let verdict = `Le Triptyque révèle un équilibre instable entre vos obsessions passées et vos déboires futurs. `;
  if (hasReversed) {
    verdict += `Certaines arcanes sont renversées : prenez garde aux chaudrons qui débordent et aux chats érudits. `;
  } else {
    verdict += `Toutes les arcanes se tiennent droites : un alignement rarissime qui réjouit les squelettes mélomanes. `;
  }

  verdict += `Les énergies [${elements.join(', ')}] conspirent pour vous ouvrir les portes du grand grimoire.`;

  return {
    overallTitle: 'L’Harmonie Chaotique des Trois Sépulcres',
    verdict,
    totalRewardMana: totalMana + 25, // Bonus de triptyque
  };
}
