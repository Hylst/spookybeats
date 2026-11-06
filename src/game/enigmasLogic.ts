/**
 * Logique pure du Grimoire des Énigmes de la Crypte
 * Conçu pour SpookyBeats - Geoffroy Streit (Hylst)
 */

export type EnigmaTomeId = 
  | 'tome-musique' 
  | 'tome-alchimie' 
  | 'tome-sepulcres' 
  | 'tome-bestiaire' 
  | 'tome-sceaux';

export type EnigmaDifficulty = 'initie' | 'occultiste' | 'archonte';
export type EnigmaType = 'choix_multiple' | 'sceau_runique' | 'anagramme_occulte';
export type RelicRarity = 'commune' | 'maudite' | 'ancestrale' | 'supreme_hylst';

export interface OccultRelic {
  id: string;
  name: string;
  title: string;
  rarity: RelicRarity;
  icon: string;
  lore: string;
  spectralPower: string;
  origin: string;
  soundCue: string;
}

export interface RuneSymbol {
  id: string;
  glyph: string;
  name: string;
  element: string;
}

export interface EnigmaItem {
  id: string;
  tomeId: EnigmaTomeId;
  steleNumber: number;
  title: string;
  question: string;
  latinMotto: string;
  type: EnigmaType;
  difficulty: EnigmaDifficulty;
  options?: string[];
  correctIndex?: number;
  availableRunes?: RuneSymbol[];
  targetRunicSequence?: string[]; // IDs des runes dans l'ordre exact
  anagramData?: {
    scrambled: string;
    normalizedSolution: string;
    displayHint: string;
  };
  subtleHint: string; // Murmure des âmes
  deepHint: string;   // Révélation d'outre-tombe
  explanation: string;
  relicReward: OccultRelic;
  linkedTrackTitle?: string;
  manaPoints: number;
}

export interface EnigmaTome {
  id: EnigmaTomeId;
  title: string;
  subtitle: string;
  icon: string;
  accentColor: string;
  description: string;
}

export interface NecromancerRank {
  tier: number;
  title: string;
  badge: string;
  color: string;
  description: string;
  minSolved: number;
}

export const ENIGMA_TOMES: EnigmaTome[] = [
  {
    id: 'tome-musique',
    title: 'Tome I : Harmonie Funeste & Hylst',
    subtitle: 'Archets Spectraux & Orgues des Profondeurs',
    icon: '🎻',
    accentColor: '#FF7518',
    description: 'Les mystères acoustiques dissimulés dans les 19 compositions de Geoffroy Streit et les vibrations spectrales.',
  },
  {
    id: 'tome-alchimie',
    title: 'Tome II : Sortilèges & Botanique Maudite',
    subtitle: 'Mandragores, Aconits & Chaudrons de Minuit',
    icon: '🧪',
    accentColor: '#39FF14',
    description: 'La science secrète des philtres mortels, herbes de lune et transmutations alchimiques ancestrales.',
  },
  {
    id: 'tome-sepulcres',
    title: 'Tome III : Sépulcres & Pierres d’Ombre',
    subtitle: 'Gothique Sépulcral, Gargouilles & Crypte',
    icon: '🏛️',
    accentColor: '#DFB7FF',
    description: 'L’architecture des mausolées séculaires, fers forgés victoriens et voûtes d’ogives hantées.',
  },
  {
    id: 'tome-bestiaire',
    title: 'Tome IV : Bestiaire Maudit & Exorcismes',
    subtitle: 'Vampires, Lycanthropes & Pactes Nocturnes',
    icon: '🐺',
    accentColor: '#EF4444',
    description: 'Les faiblesses secrètes des démons, rituels de bannissement et coutumes de la meute.',
  },
  {
    id: 'tome-sceaux',
    title: 'Tome V : Rituels Runiques & Nombres Noirs',
    subtitle: 'Sceaux Hermétiques & Kabbale des Ténèbres',
    icon: '🔯',
    accentColor: '#F59E0B',
    description: 'Les combinaisons runiques secrètes et les chiffres gravés sur le grand autel d’Hylst.',
  },
];

export const NECROMANCER_RANKS: NecromancerRank[] = [
  {
    tier: 1,
    title: 'Néophyte des Cryptes',
    badge: '🕯️',
    color: '#8C8494',
    description: 'Vous venez d’allumer votre première chandelle dans les ténèbres du caveau.',
    minSolved: 0,
  },
  {
    tier: 2,
    title: 'Initié aux Murmures',
    badge: '📜',
    color: '#39FF14',
    description: 'Vous entendez la voix des pierres séculaires et déchiffrez les premiers parchemins.',
    minSolved: 4,
  },
  {
    tier: 3,
    title: 'Archiviste de l’Ombre',
    badge: '🗝️',
    color: '#DFB7FF',
    description: 'Les passages secrets de la crypte d’Hylst n’ont presque plus de secrets pour vous.',
    minSolved: 9,
  },
  {
    tier: 4,
    title: 'Grand Exorciste d’Hécate',
    badge: '🔮',
    color: '#FF7518',
    description: 'Vous domptez les sortilèges et brandissez les reliques sacrées avec autorité.',
    minSolved: 14,
  },
  {
    tier: 5,
    title: 'Maître Suprême du Grimoire',
    badge: '👑',
    color: '#F59E0B',
    description: 'Votre esprit a percé tous les mystères de la nuit. Vous régnez sur l’héritage de SpookyBeats.',
    minSolved: 18,
  },
];

export const ALCHEMICAL_RUNES: RuneSymbol[] = [
  { id: 'sulfur', glyph: '🜍', name: 'Soufre Lunaire', element: 'Feu Sombre' },
  { id: 'mercury', glyph: '☿', name: 'Mercure Spectral', element: 'Fluide Astral' },
  { id: 'salt', glyph: '🜔', name: 'Sel Purificateur', element: 'Terre Sacrée' },
  { id: 'moon', glyph: '☽', name: 'Croissant Éthéré', element: 'Nocturne' },
  { id: 'skull', glyph: '☠', name: 'Crâne d’Ossuaire', element: 'Nécromancie' },
  { id: 'fire', glyph: '🜂', name: 'Flamme Sépulcrale', element: 'Cendre' },
];

export const ALL_ENIGMAS: EnigmaItem[] = [
  // --- TOME I : MUSIQUE & HYLST ---
  {
    id: 'riddle-1',
    tomeId: 'tome-musique',
    steleNumber: 1,
    title: 'Le Violoncelle sans Maître',
    latinMotto: 'Vox tacita in tenebris resonat',
    question: 'Dans quelle tonalité sépulcrale résonne l’archet hanté qui pleure les disparus sans qu’aucune main humaine ne l’effleure ?',
    type: 'choix_multiple',
    difficulty: 'initie',
    options: ['Do Majeur Céleste', 'Do Mineur Funeste', 'Sol Majeur Printanier', 'La Dièse Joyeux'],
    correctIndex: 1,
    subtleHint: 'Consultez les métadonnées de la seconde incantation du caveau...',
    deepHint: 'La tonalité préférée de Chopin et Beethoven pour les marches funèbres.',
    explanation: 'Le Do mineur est la signature harmonique universelle des élégies funèbres et du second thème de la crypte.',
    manaPoints: 120,
    linkedTrackTitle: 'Dark Ambient Cello',
    relicReward: {
      id: 'relic-archet-ebene',
      name: 'L’Archet d’Ébène Spectral',
      title: 'Archet des Ombres d’Hylst',
      rarity: 'ancestrale',
      icon: '🎻',
      lore: 'Façonné dans le bois noir de la forêt des pendus, ses crins de cheval fantôme vibrent sans toucher de cordes.',
      spectralPower: '+25% de résonance funèbre dans l’Atelier Alchimique.',
      origin: 'Atelier de luthier maudit de Crémone (1742)',
      soundCue: 'cello_spectral',
    },
  },
  {
    id: 'riddle-2',
    tomeId: 'tome-musique',
    steleNumber: 2,
    title: 'L’Orgue des Profondeurs',
    latinMotto: 'In bassissimis sonus aeternus',
    question: 'À quelle fréquence harmonique fondamentale les tuyaux d’étain de la crypte doivent-ils vibrer pour réveiller la réverbération de la cathédrale ?',
    type: 'choix_multiple',
    difficulty: 'occultiste',
    options: ['880 Hz Aigu', '432 Hz Sépulcral', '20 000 Hz Inaudible', '50 Hz Électrique'],
    correctIndex: 1,
    subtleHint: 'C’est la fréquence naturelle dite de Pythagore et de la terre...',
    deepHint: 'Ce diapason est réputé aligner l’âme avec les ondes souterraines.',
    explanation: 'La fréquence 432 Hz, accordée selon le nombre d’or alchimique, est la vibration maîtresse de la réverbération d’Hylst.',
    manaPoints: 180,
    linkedTrackTitle: 'Cathedral Reverb Requiem',
    relicReward: {
      id: 'relic-diapason-or',
      name: 'Le Diapason d’Orphée Maudit',
      title: 'Résonateur des Limbes',
      rarity: 'maudite',
      icon: '🔔',
      lore: 'Ce diapason ne produit aucun son audible par les vivants, mais fait trembler les vitraux anciens.',
      spectralPower: 'Amplifie les basses profondes de 6 dB sans distorsion.',
      origin: 'Sous-sol de la cathédrale de Strasbourg',
      soundCue: 'bell_deep',
    },
  },
  {
    id: 'riddle-3',
    tomeId: 'tome-musique',
    steleNumber: 3,
    title: 'L’Anagramme du Chant Funèbre',
    latinMotto: 'Litterae mortuorum loquuntur',
    question: 'Déchiffrez le mot sacré de 7 lettres dissimulé dans le désordre des parchemins : cette messe pour les défunts guide les âmes vers le néant.',
    type: 'anagramme_occulte',
    difficulty: 'occultiste',
    anagramData: {
      scrambled: 'Q U E M R I E',
      normalizedSolution: 'REQUIEM',
      displayHint: 'Chant liturgique pour le repos éternel',
    },
    subtleHint: 'Le mode de jeu rythmique de SpookyBeats porte exactement ce nom glorieux...',
    deepHint: 'Commence par un R et s’achève par un M : Mozart n’a jamais pu terminer le sien de son vivant.',
    explanation: 'Le Requiem est la quintessence du chant des défunts, immortalisé dans le mode Rhythm Requiem d’Hylst.',
    manaPoints: 200,
    linkedTrackTitle: 'Requiem of the Lost Souls',
    relicReward: {
      id: 'relic-partition-cendre',
      name: 'La Partition de Cendre',
      title: 'Codex Harmonique Inachevé',
      rarity: 'supreme_hylst',
      icon: '🎼',
      lore: 'Les notes sur ce parchemin se déplacent seules selon les phases de la lune.',
      spectralPower: 'Double le gain de combo dans le jeu Rhythm Requiem.',
      origin: 'Manuscrit secret retrouvé dans l’orgue d’Hylst',
      soundCue: 'page_turn',
    },
  },
  {
    id: 'riddle-4',
    tomeId: 'tome-musique',
    steleNumber: 4,
    title: 'La Cadence du Fossoyeur',
    latinMotto: 'Tempus fugit in umbra mortis',
    question: 'Quel est le tempo standard (en BPM) pré-configuré dans le séquenceur de crypte pour cadencer la marche des spectres ?',
    type: 'choix_multiple',
    difficulty: 'initie',
    options: ['60 BPM (Ralenti)', '128 BPM (Cadence Funeste)', '240 BPM (Panique)', '999 BPM (Chaos)'],
    correctIndex: 1,
    subtleHint: 'Jetez un œil au potentiomètre de l’Atelier Alchimique Sonore.',
    deepHint: 'Une cadence électronique nocturne rythmée à 128 battements.',
    explanation: '128 BPM est le tempo de référence d’Hylst calibré sur le rythme cardiaque d’un être aux prises avec la terreur.',
    manaPoints: 130,
    linkedTrackTitle: 'Crypt Sequencer March',
    relicReward: {
      id: 'relic-metronome-rouille',
      name: 'Le Métronome en Cuivre Rouillé',
      title: 'Horloge du Dernier Soupir',
      rarity: 'commune',
      icon: '⏱️',
      lore: 'Un battement régulier et pesant qui hypnotise quiconque ose fixer son aiguille aiguisée.',
      spectralPower: 'Verrouille la précision rythmique au millième de seconde.',
      origin: 'Crypte des Bénédictins Noirs',
      soundCue: 'tick_spectral',
    },
  },

  // --- TOME II : SORTILÈGES & BOTANIQUE MAUDITE ---
  {
    id: 'riddle-5',
    tomeId: 'tome-alchimie',
    steleNumber: 5,
    title: 'Le Poison du Sabbat',
    latinMotto: 'Radix clamat, homo perit',
    question: 'Quel composant alchimique végétal les sorcières de la clairière arrachent-elles au pied du gibet pour ensorceler le calice ?',
    type: 'choix_multiple',
    difficulty: 'initie',
    options: ['La Pétale de Rose Rouge', 'La Racine de Mandragore Hurlante', 'La Feuille de Menthe Fraîche', 'Le Grain de Blé Doré'],
    correctIndex: 1,
    subtleHint: 'Une plante anthropomorphe dont le cri déchire les tympans à l’arrachage...',
    deepHint: 'Associée aux sortilèges d’Hécate depuis l’Antiquité grecque.',
    explanation: 'La mandragore, dont la racine évoque un corps humain contorsionné, hurle lorsqu’elle est déterrée à minuit.',
    manaPoints: 120,
    linkedTrackTitle: 'Witches Coven Sabbath',
    relicReward: {
      id: 'relic-flacon-venin',
      name: 'Le Flacon de Venin d’Hécate',
      title: 'Élixir Phosphorescent',
      rarity: 'ancestrale',
      icon: '🧪',
      lore: 'Une fiole en cristal soufflé contenant une sève verte qui luit dans les ténèbres les plus impénétrables.',
      spectralPower: 'Neutralise les malédictions des pièges lors du massacre de citrouilles.',
      origin: 'Forêt Noire (Rituel de Walpurgis)',
      soundCue: 'liquid_bubble',
    },
  },
  {
    id: 'riddle-6',
    tomeId: 'tome-alchimie',
    steleNumber: 6,
    title: 'L’Aconit des Clairières Sombres',
    latinMotto: 'Herba lupina venenum regum',
    question: 'Sous quel autre nom vernaculaire funeste désigne-t-on l’Aconit Napel, capable de repousser les bêtes à griffes mais d’arrêter un cœur en quelques gouttes ?',
    type: 'choix_multiple',
    difficulty: 'occultiste',
    options: ['Herbe-au-Loup (Tue-Loup)', 'Fleur de Pâquerette', 'Sauge Bénie', 'Millepertuis Solaire'],
    correctIndex: 0,
    subtleHint: 'Les chasseurs en frottaient leurs flèches contre les loups-garous.',
    deepHint: 'Aussi appelé "Casque-de-Jupiter" ou "Tueur de bêtes sauvages".',
    explanation: 'L’Aconit Tue-Loup est le poison végétal le plus fulgurant des forêts boréales, arme de prédilection contre les lycanthropes.',
    manaPoints: 160,
    linkedTrackTitle: 'Lycanthrope Frenzy',
    relicReward: {
      id: 'relic-amulette-aconit',
      name: 'L’Amulette d’Aconit Séché',
      title: 'Talisman Anti-Lycanthrope',
      rarity: 'maudite',
      icon: '🌿',
      lore: 'Enchâssée dans un médaillon de fer forgé, cette fleur séchée dégage une odeur âcre que les fauves redoutent.',
      spectralPower: 'Affaiblit les bêtes maudites rencontrées dans le Bestiaire de 30%.',
      origin: 'Monts des Carpates',
      soundCue: 'wolf_repel',
    },
  },
  {
    id: 'riddle-7',
    tomeId: 'tome-alchimie',
    steleNumber: 7,
    title: 'Le Sceau Alchimique du Chaudron',
    latinMotto: 'Tria prima in igne coagulantur',
    question: 'Alignez dans le bon ordre la Trinité Alchimique Hermétique nécessaire pour transmuter le plomb en essence spectrale : le Corps (Sel), l’Esprit Astral (Mercure) et l’Âme Ardente (Soufre).',
    type: 'sceau_runique',
    difficulty: 'archonte',
    availableRunes: ALCHEMICAL_RUNES,
    targetRunicSequence: ['salt', 'mercury', 'sulfur'],
    subtleHint: 'Suivez la formule : Sel Purificateur d’abord, Mercure Astral ensuite, Soufre Lunaire enfin.',
    deepHint: 'Glyphes : 🜔 puis ☿ puis 🜍.',
    explanation: 'Paracelse enseignait que les Tria Prima (Sel, Mercure, Soufre) forment l’équilibre absolu de la matière et de l’esprit spectral.',
    manaPoints: 300,
    linkedTrackTitle: 'Alchemical Transmutation',
    relicReward: {
      id: 'relic-athanor-miniature',
      name: 'Le Creuset d’Orichalque',
      title: 'Athanor de l’Alchimiste Suprême',
      rarity: 'supreme_hylst',
      icon: '⚗️',
      lore: 'Un fourneau portatif d’où s’échappent des volutes d’ectoplasme chaud aux reflets d’émeraude.',
      spectralPower: 'Génère 50 points de mana spectral à chaque nouvelle lune.',
      origin: 'Laboratoire de Nicolas Flamel',
      soundCue: 'fire_whoosh',
    },
  },
  {
    id: 'riddle-8',
    tomeId: 'tome-alchimie',
    steleNumber: 8,
    title: 'La Belladonne et le Miroir Noir',
    latinMotto: 'Oculi vident quod cor timet',
    question: 'Quel effet singulier de la Belladonne recherchaient les prêtresses des ombres pour fixer le miroir d’obsidienne sans ciller ?',
    type: 'choix_multiple',
    difficulty: 'occultiste',
    options: ['La dilatation totale des pupilles', 'L’endormissement des paupières', 'La perte temporaire de l’ouïe', 'Le blanchiment des cheveux'],
    correctIndex: 0,
    subtleHint: 'Son nom "Bella Donna" vient des dames de la Renaissance voulant de grands yeux profonds...',
    deepHint: 'L’atropine paralyse l’iris et ouvre grand la porte de la vision nocturne.',
    explanation: 'La mydriase provoquée par la belladonne permettait aux devins des ténèbres d’accueillir la moindre lueur spectrale.',
    manaPoints: 170,
    linkedTrackTitle: 'Shadow Mirror Waltz',
    relicReward: {
      id: 'relic-miroir-obsidienne',
      name: 'Le Miroir d’Obsidienne Scellé',
      title: 'Miroir Catoptrique de Dee',
      rarity: 'ancestrale',
      icon: '🪞',
      lore: 'Une dalle de verre volcanique taillée au Mexique et rapportée par un astrologue de la reine.',
      spectralPower: 'Révèle l’indice secret des énigmes sans pénalité.',
      origin: 'Cabinet des Curiosités de John Dee (1583)',
      soundCue: 'glass_resonate',
    },
  },

  // --- TOME III : SÉPULCRES & PIERRES D’OMBRE ---
  {
    id: 'riddle-9',
    tomeId: 'tome-sepulcres',
    steleNumber: 9,
    title: 'La Porte Séculaire de Chêne',
    latinMotto: 'Clavis ferrea ianuam aperit',
    question: 'Quel son lugubre résonne toujours au moment où le vantail de chêne clouté pivote sur le seuil du caveau ?',
    type: 'choix_multiple',
    difficulty: 'initie',
    options: ['Un tintement cristallin', 'Un lourd grincement de gonds rouillés', 'Un chant d’oiseau matinal', 'Un éclat de trompette d’or'],
    correctIndex: 1,
    subtleHint: 'Chaque visiteur du manoir l’entend en ouvrant le battant.',
    deepHint: 'Le fer corrodé frotte contre la pierre calcaire.',
    explanation: 'Le grincement de porte séculaire est l’avertissement sonore gravé sur le seuil de chaque cryptoportique victorien.',
    manaPoints: 110,
    linkedTrackTitle: 'Ancient Gate Awakening',
    relicReward: {
      id: 'relic-cle-catacombes',
      name: 'La Clé de Fonte des Catacombes',
      title: 'Passe-Partout de l’Abîme',
      rarity: 'commune',
      icon: '🗝️',
      lore: 'Forgée dans une fonte lourde trempée dans l’eau lustrale, elle ouvre les cadenas à trois gorges.',
      spectralPower: 'Déverrouille immédiatement toutes les stèles de niveau Initié.',
      origin: 'Ossuaire Municipal de Montparnasse',
      soundCue: 'key_turn',
    },
  },
  {
    id: 'riddle-10',
    tomeId: 'tome-sepulcres',
    steleNumber: 10,
    title: 'La Sentinelle de Granit',
    latinMotto: 'Statua vigilat dum caelum plorat',
    question: 'Quelle est la fonction architecturale sacrée de la Gargouille gothique, au-delà de son rôle d’évacuation des eaux pluviales ?',
    type: 'choix_multiple',
    difficulty: 'occultiste',
    options: ['Servir de perchoir aux pigeons', 'Éloigner les démons par effet apotropaïque', 'Supporter le toit de la nef', 'Mesurer la vitesse du vent'],
    correctIndex: 1,
    subtleHint: 'Le terme savant "apotropaïque" désigne ce qui détourne le mauvais sort...',
    deepHint: 'En mimant le visage monstrueux du mal, la pierre protège le sanctuaire sacré.',
    explanation: 'L’art gothique plaçait ces chimères de pierre pour effrayer les esprits malins et rejeter les impuretés du ciel loin des fondations.',
    manaPoints: 175,
    linkedTrackTitle: 'Gargoyle Sentinel Flight',
    relicReward: {
      id: 'relic-griffe-granit',
      name: 'La Griffe de Granit Ailé',
      title: 'Fragment de Chimère Déchue',
      rarity: 'ancestrale',
      icon: '🗿',
      lore: 'Un éclat de pierre calcaire sculpté au XIIIe siècle, imprégné des siècles de foudre et de vent.',
      spectralPower: 'Immunité contre les pièges de pierre dans le jeu des Sarcophages.',
      origin: 'Corniche de Notre-Dame',
      soundCue: 'stone_strike',
    },
  },
  {
    id: 'riddle-11',
    tomeId: 'tome-sepulcres',
    steleNumber: 11,
    title: 'Le Labyrinthe des Six Millions',
    latinMotto: 'Arrête ! C’est ici l’empire de la Mort',
    question: 'Combien d’âmes reposent environ dans le plus célèbre ossuaire souterrain de calcaire sous les pavés de Paris ?',
    type: 'choix_multiple',
    difficulty: 'occultiste',
    options: ['10 000 ossements', '100 000 ossements', '6 000 000 d’âmes', '1 000 000 000 d’âmes'],
    correctIndex: 2,
    subtleHint: 'Un nombre titanesque transféré depuis les Saints-Innocents...',
    deepHint: 'Six millions de parisiens reposent dans ces 300 kilomètres de galeries.',
    explanation: 'Transférés à la fin du XVIIIe siècle pour assainir la capitale, six millions de défunts forment le grand ossuaire historique.',
    manaPoints: 190,
    linkedTrackTitle: 'Catacombs Requiem',
    relicReward: {
      id: 'relic-crane-grave',
      name: 'Le Crâne Gravé de Versets',
      title: 'Memento Mori d’Hylst',
      rarity: 'maudite',
      icon: '💀',
      lore: 'Sur sa boîte crânienne est calligraphié à l’encre de seiche le sonnet des morts de Baudelaire.',
      spectralPower: 'Multiplie par deux le bonus de fin de niveau dans la Crypte.',
      origin: 'Chambre des Tombes de la Barrière d’Enfer',
      soundCue: 'bone_rattle',
    },
  },
  {
    id: 'riddle-12',
    tomeId: 'tome-sepulcres',
    steleNumber: 12,
    title: 'La Croisée d’Ogives',
    latinMotto: 'Crux arcuum caelum sustinet',
    question: 'Quel élément d’ingénierie gothique magistral a permis d’élever les cathédrales vers les cieux et d’ouvrir les murs aux vitraux diaphanes ?',
    type: 'choix_multiple',
    difficulty: 'archonte',
    options: ['La voûte en berceau plein cintre', 'La croisée d’ogives sur arcs-boutants', 'Le mur de briques crues', 'La charpente de bambou'],
    correctIndex: 1,
    subtleHint: 'Cette innovation a succédé au style roman lourd et sombre.',
    deepHint: 'Elle reporte les poussées vers des piliers extérieurs plutôt que des murs pleins.',
    explanation: 'La croisée d’ogives est le génie constructif qui a transformé la pierre lourde en dentelle de lumière et de réverbération sonore.',
    manaPoints: 240,
    linkedTrackTitle: 'Gothic Spire Reverie',
    relicReward: {
      id: 'relic-cle-de-voute',
      name: 'La Clé de Voûte en Bas-Relief',
      title: 'Ponceau Céleste d’Hylst',
      rarity: 'supreme_hylst',
      icon: '🏛️',
      lore: 'La pierre centrale qui maintient en suspension tout l’édifice. Si elle cède, le plafond s’effondre.',
      spectralPower: 'Augmente la taille maximale des combos à 99x.',
      origin: 'Abbaye Royale de Saint-Denis',
      soundCue: 'arch_settle',
    },
  },

  // --- TOME IV : BESTIAIRE MAUDIT & EXORCISMES ---
  {
    id: 'riddle-13',
    tomeId: 'tome-bestiaire',
    steleNumber: 13,
    title: 'L’Éveil sous la Lune Sanglante',
    latinMotto: 'Luna rubra furem suscitat',
    question: 'Quelle phase céleste singulière et terrifiante libère la fureur incontrôlable des créatures à fourrure d’acier et griffes sanglantes ?',
    type: 'choix_multiple',
    difficulty: 'initie',
    options: ['Le Croissant Pâle', 'La Lune de Sang (Pleine Lune)', 'La Nouvelle Lune Froide', 'Le Soleil de Midi'],
    correctIndex: 1,
    subtleHint: 'La sixième composition d’Hylst célèbre ce rituel écarlate...',
    deepHint: 'L’éclipse lunaire confère à l’astre une teinte rouge brique cauchemardesque.',
    explanation: 'La Pleine Lune de Sang réveille l’instinct primordial du loup-garou et décuple sa férocité au combat.',
    manaPoints: 120,
    linkedTrackTitle: 'Blood Moon Lycanthrope',
    relicReward: {
      id: 'relic-gemme-ecarlate',
      name: 'La Gemme Écarlate de Lycanthrope',
      title: 'Pierre de Lune Ensanglantée',
      rarity: 'ancestrale',
      icon: '🌕',
      lore: 'Un rubis brut qui s’échauffe et pulse au rythme des battements de cœur d’une meute sauvage.',
      spectralPower: 'Active le mode Frénésie Dorée dès le 5e coup dans Pumpkin Smasher.',
      origin: 'Monts Apuseni (Transylvanie)',
      soundCue: 'wolf_howl',
    },
  },
  {
    id: 'riddle-14',
    tomeId: 'tome-bestiaire',
    steleNumber: 14,
    title: 'Le Miroir d’Argent Inaltéré',
    latinMotto: 'Speculum animam quaerit nec invenit',
    question: 'Pour quelle raison physique et métaphysique le Seigneur Vampire ne projette-t-il aucune ombre ni reflet dans les miroirs victoriens traditionnels ?',
    type: 'choix_multiple',
    difficulty: 'occultiste',
    options: ['Parce qu’il est invisible aux yeux de tous', 'Parce que le miroir était argenté et que l’argent pur repousse l’impie dépourvu d’âme', 'Parce que les lampes à huile étaient éteintes', 'Parce que les miroirs étaient sales'],
    correctIndex: 1,
    subtleHint: 'L’argent (Argentum) est le métal sacré lunaire de la pureté absolue...',
    deepHint: 'Sans âme divine, aucun reflet ne peut s’imprimer sur une surface argentée pure.',
    explanation: 'Les miroirs anciens étaient enduits d’argent véritable ; le vampire, damné sans âme, ne pouvait y imprimer son image.',
    manaPoints: 180,
    linkedTrackTitle: 'Vampire Countess Elegie',
    relicReward: {
      id: 'relic-pendentif-argent',
      name: 'Le Pendentif d’Argent Céleste',
      title: 'Chapelet Purificateur d’Ailes',
      rarity: 'maudite',
      icon: '✝️',
      lore: 'Béni sous trois soleils couchants, ce pendentif brûle les chairs nécrosées au simple contact.',
      spectralPower: 'Dissipe automatiquement l’écran de brume spectrale sur commande.',
      origin: 'Crypte de la Comtesse Bathory',
      soundCue: 'metal_chime',
    },
  },
  {
    id: 'riddle-15',
    tomeId: 'tome-bestiaire',
    steleNumber: 15,
    title: 'La Plainte de la Banshee',
    latinMotto: 'Mulier lamenti mortem nuntiat',
    question: 'Dans le folklore celtique ancestral, quel acte de toilette macabre accomplit la banshee au bord des tourbières brumeuses avant qu’un deuil ne frappe ?',
    type: 'choix_multiple',
    difficulty: 'occultiste',
    options: ['Elle tisse une couronne d’épines', 'Elle lave les linceuls ensanglantés des mourants', 'Elle peint son visage avec de la cendre', 'Elle cueille des baies toxiques'],
    correctIndex: 1,
    subtleHint: 'On la surnomme la "Lavandière de la Nuit" (Bean Nighe)...',
    deepHint: 'Elle trempe dans l’eau froide les vêtements de celui dont l’heure a sonné.',
    explanation: 'La lavandière spectrale frotte les suaires tachés de sang au clair de lune, annonçant le trépas inéluctable d’un membre du clan.',
    manaPoints: 210,
    linkedTrackTitle: 'Banshee Mist Lament',
    relicReward: {
      id: 'relic-peigne-ivoire',
      name: 'Le Peigne d’Ivoire de la Lavandière',
      title: 'Relique des Brumes Funestes',
      rarity: 'ancestrale',
      icon: '🪮',
      lore: 'Trouvé sur les rives d’un loch écossais, les crins pris entre ses dents émettent un murmure quand le vent se lève.',
      spectralPower: 'Donne une seconde chance gratuite lors d’une erreur dans les Énigmes.',
      origin: 'Tourbières des Highlands (1612)',
      soundCue: 'wail_soft',
    },
  },
  {
    id: 'riddle-16',
    tomeId: 'tome-bestiaire',
    steleNumber: 16,
    title: 'L’Entité Frappeuse du Manoir',
    latinMotto: 'Spiritus tumultuans claustra quatit',
    question: 'Déchiffrez ce terme d’origine germanique désignant l’esprit bruyant capable de projeter les meubles et de faire claquer les serrures :',
    type: 'anagramme_occulte',
    difficulty: 'occultiste',
    anagramData: {
      scrambled: 'P L O T E G I R E S T',
      normalizedSolution: 'POLTERGEIST',
      displayHint: 'Esprit tapageur et destructeur',
    },
    subtleHint: 'Poltern (faire du vacarme) + Geist (esprit)...',
    deepHint: '11 lettres, commence par P et se termine par T.',
    explanation: 'Le Poltergeist hante les demeures anciennes par des phénomènes cinétiques violents décrits depuis le Moyen Âge.',
    manaPoints: 220,
    linkedTrackTitle: 'Haunted Manor Haunting',
    relicReward: {
      id: 'relic-cloche-bronze',
      name: 'La Clochette de Bronze d’Exorcisme',
      title: 'Bannisseuse de Tapage Nocturne',
      rarity: 'commune',
      icon: '🔔',
      lore: 'Gravée de psaumes d’éloignement, sa sonnerie stridente disperse instantanément les présences invisibles.',
      spectralPower: 'Calme les secousses de la caméra dans le Manoir 3D.',
      origin: 'Presbytère de Borley',
      soundCue: 'bell_chime',
    },
  },

  // --- TOME V : RITUELS RUNIQUES & NOMBRES NOIRS ---
  {
    id: 'riddle-17',
    tomeId: 'tome-sceaux',
    steleNumber: 17,
    title: 'Le Sceau Suprême d’Hécate',
    latinMotto: 'Hecate trivia portas aperit',
    question: 'Pour déverrouiller la porte scellée de la triple déesse des carrefours, assemblez le Sceau Ternaire : le Croissant Éthéré, la Flamme Sépulcrale et le Crâne d’Ossuaire.',
    type: 'sceau_runique',
    difficulty: 'archonte',
    availableRunes: ALCHEMICAL_RUNES,
    targetRunicSequence: ['moon', 'fire', 'skull'],
    subtleHint: 'Alignez dans l’ordre : Croissant (☽) -> Flamme (🜂) -> Crâne (☠).',
    deepHint: 'L’astre de nuit commande au feu, qui conduit au trépas.',
    explanation: 'Hécate veille sur les trois royaumes : la nuit céleste, le feu du foyer et l’ossuaire des enfers.',
    manaPoints: 320,
    linkedTrackTitle: 'Hecate Triple Gate',
    relicReward: {
      id: 'relic-sceau-hecate',
      name: 'Le Pentacle d’Obsidienne d’Hécate',
      title: 'Grand Sceau des Trois Voies',
      rarity: 'supreme_hylst',
      icon: '🔯',
      lore: 'Un disque d’obsidienne pure orné d’arabesques d’or et de trois clés entrecroisées.',
      spectralPower: 'Débloque le statut d’Archonte dans le Grimoire de SpookyBeats.',
      origin: 'Sanctuaire d’Éleusis',
      soundCue: 'deep_gong',
    },
  },
  {
    id: 'riddle-18',
    tomeId: 'tome-sceaux',
    steleNumber: 18,
    title: 'Le Chiffre Fatidique de la Crypte',
    latinMotto: 'Numerus bestiae in saecula saeculorum',
    question: 'Quel est le chiffre fatidique d’outre-tombe gravé sur la pierre tombale du maître alchimiste de SpookyBeats et record mythique du Massacre ?',
    type: 'choix_multiple',
    difficulty: 'archonte',
    options: ['777 (Lumière)', '666 (Nombre d’Hylst)', '100 (Centurion)', '42 (Réponse Universelle)'],
    correctIndex: 1,
    subtleHint: 'Consultez le record d’origine du Massacre de Citrouilles.',
    deepHint: 'Le triple six kabbalistique mentionné dans l’Apocalypse de Jean.',
    explanation: 'Le 666 est la clef numérique du portail d’Hylst, couronnant l’alchimiste ayant résolu l’ensemble des arcanes du site.',
    manaPoints: 350,
    linkedTrackTitle: 'Crypt 666 Apex',
    relicReward: {
      id: 'relic-couronne-cranes',
      name: 'La Couronne de Crânes d’Hylst',
      title: 'Insigne du Souverain de l’Ombre',
      rarity: 'supreme_hylst',
      icon: '👑',
      lore: 'Forgée dans le fer météoritique et ornée de sept gemmes d’ambre funèbre, elle confère l’immortalité créative.',
      spectralPower: 'Accès illimité à l’ensemble des archives occultes et succès ultime.',
      origin: 'Mausolée Central de SpookyBeats',
      soundCue: 'organ_chord',
    },
  },
];

/**
 * Filtre les énigmes par tome, difficulté, statut de résolution et terme de recherche
 */
export function filterEnigmas(
  enigmas: EnigmaItem[],
  filters: {
    tomeId?: EnigmaTomeId | 'all';
    difficulty?: EnigmaDifficulty | 'all';
    status?: 'all' | 'unsolved' | 'solved';
    solvedIds?: string[];
    searchQuery?: string;
  }
): EnigmaItem[] {
  const solvedList = filters.solvedIds || [];

  return enigmas.filter((item) => {
    // Filtre par Tome
    if (filters.tomeId && filters.tomeId !== 'all') {
      if (item.tomeId !== filters.tomeId) return false;
    }

    // Filtre par Difficulté
    if (filters.difficulty && filters.difficulty !== 'all') {
      if (item.difficulty !== filters.difficulty) return false;
    }

    // Filtre par Statut
    if (filters.status && filters.status !== 'all') {
      const isSolved = solvedList.includes(item.id);
      if (filters.status === 'solved' && !isSolved) return false;
      if (filters.status === 'unsolved' && isSolved) return false;
    }

    // Recherche textuelle
    if (filters.searchQuery && filters.searchQuery.trim().length > 0) {
      const q = filters.searchQuery.toLowerCase().trim();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchQuestion = item.question.toLowerCase().includes(q);
      const matchMotto = item.latinMotto.toLowerCase().includes(q);
      const matchRelic = item.relicReward.name.toLowerCase().includes(q);
      if (!matchTitle && !matchQuestion && !matchMotto && !matchRelic) return false;
    }

    return true;
  });
}

/**
 * Vérifie la réponse selon le type d'énigme
 */
export function verifyEnigmaAnswer(
  enigma: EnigmaItem,
  userAnswer: number | string | string[]
): { isCorrect: boolean; message: string; earnedPoints: number } {
  if (enigma.type === 'choix_multiple') {
    const chosenIndex = typeof userAnswer === 'number' ? userAnswer : -1;
    if (chosenIndex === enigma.correctIndex) {
      return {
        isCorrect: true,
        message: `Sceau brisé avec succès ! Vous empochez ${enigma.relicReward.name}.`,
        earnedPoints: enigma.manaPoints,
      };
    }
    return {
      isCorrect: false,
      message: 'La dalle reste inerte. La réponse choisie ne satisfait pas les esprits du caveau.',
      earnedPoints: 0,
    };
  }

  if (enigma.type === 'anagramme_occulte') {
    if (!enigma.anagramData) {
      return { isCorrect: false, message: 'Données d’anagramme manquantes.', earnedPoints: 0 };
    }
    const cleanUser = String(userAnswer).trim().toUpperCase();
    const cleanSolution = enigma.anagramData.normalizedSolution.toUpperCase();
    if (cleanUser === cleanSolution) {
      return {
        isCorrect: true,
        message: `Mot sacré "${cleanSolution}" prononcé ! Le reliquaire s’ouvre en grand.`,
        earnedPoints: enigma.manaPoints,
      };
    }
    return {
      isCorrect: false,
      message: 'Les lettres résonnent d’une dissonance amère. L’anagramme résiste.',
      earnedPoints: 0,
    };
  }

  if (enigma.type === 'sceau_runique') {
    if (!enigma.targetRunicSequence) {
      return { isCorrect: false, message: 'Données de runes manquantes.', earnedPoints: 0 };
    }
    const chosenSequence = Array.isArray(userAnswer) ? userAnswer : [];
    const isSameLength = chosenSequence.length === enigma.targetRunicSequence.length;
    const isMatching = isSameLength && chosenSequence.every((val, idx) => val === enigma.targetRunicSequence![idx]);

    if (isMatching) {
      return {
        isCorrect: true,
        message: `La Trinité Runique s’embrase d’un feu vert ! Le sceau millénaire cède.`,
        earnedPoints: enigma.manaPoints,
      };
    }
    return {
      isCorrect: false,
      message: 'L’alignement des glyphes est discordant. Les énergies se dissipent.',
      earnedPoints: 0,
    };
  }

  return { isCorrect: false, message: 'Type d’énigme inconnu.', earnedPoints: 0 };
}

/**
 * Calcule la progression du joueur, points de mana et rang nécromancien
 */
export function calculateGrimoireProgression(
  solvedIds: string[],
  allEnigmasList: EnigmaItem[] = ALL_ENIGMAS
): {
  solvedCount: number;
  totalCount: number;
  percentage: number;
  totalMana: number;
  rank: NecromancerRank;
  nextRank: NecromancerRank | null;
  relicsCount: number;
} {
  const totalCount = allEnigmasList.length;
  const solvedCount = solvedIds.filter((id) => allEnigmasList.some((e) => e.id === id)).length;
  const percentage = totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;

  // Calcul du mana total
  const totalMana = allEnigmasList
    .filter((e) => solvedIds.includes(e.id))
    .reduce((acc, curr) => acc + curr.manaPoints, 0);

  // Détermination du rang actuel
  let currentRank = NECROMANCER_RANKS[0];
  for (const r of NECROMANCER_RANKS) {
    if (solvedCount >= r.minSolved) {
      currentRank = r;
    }
  }

  // Prochain rang
  const nextRank = NECROMANCER_RANKS.find((r) => r.minSolved > solvedCount) || null;

  return {
    solvedCount,
    totalCount,
    percentage,
    totalMana,
    rank: currentRank,
    nextRank,
    relicsCount: solvedCount,
  };
}

/**
 * Tire au sort l'énigme du jour ou une énigme inconnue
 */
export function getRandomUnsolvedEnigma(
  solvedIds: string[],
  allEnigmasList: EnigmaItem[] = ALL_ENIGMAS
): EnigmaItem {
  const unsolved = allEnigmasList.filter((e) => !solvedIds.includes(e.id));
  if (unsolved.length === 0) {
    // Si toutes résolues, renvoyer une aléatoire
    const idx = Math.floor(Math.random() * allEnigmasList.length);
    return allEnigmasList[idx];
  }
  const idx = Math.floor(Math.random() * unsolved.length);
  return unsolved[idx];
}
