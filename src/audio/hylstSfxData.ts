// Catalogue sélectionné des effets sonores MP3 originaux de Geoffroy Streit (hylst.fr/mp3/sfx/)
export interface HylstSfxItem {
  filename: string;
  label: string;
  description: string;
  category: 'spectres' | 'curses' | 'beasts' | 'manor';
  categoryLabel: string;
  duration: string;
}

export const HYLST_MP3_SFX: HylstSfxItem[] = [
  // Spectres & Brumes
  {
    filename: 'eerie_ghostly.mp3',
    label: 'Esprits Tourmentés',
    description: 'Complainte et râles spectraux d’âmes errantes',
    category: 'spectres',
    categoryLabel: 'Spectres',
    duration: '00:21'
  },
  {
    filename: 'cemetery_wind.mp3',
    label: 'Vent du Cimetière',
    description: 'Bourrasque glaciale soufflant entre les tombes',
    category: 'spectres',
    categoryLabel: 'Spectres',
    duration: '00:12'
  },
  {
    filename: 'ghost-breathing.mp3',
    label: 'Souffle de Spectre',
    description: 'Respiration sépulcrale dans l’obscurité totale',
    category: 'spectres',
    categoryLabel: 'Spectres',
    duration: '00:18'
  },
  {
    filename: 'ghostly-sounds.mp3',
    label: 'Échos Poltergeist',
    description: 'Murmures surnaturels et manifestations invisibles',
    category: 'spectres',
    categoryLabel: 'Spectres',
    duration: '00:07'
  },

  // Rires & Malédictions
  {
    filename: 'evil-laugh-with-reverb.mp3',
    label: 'Rire Démoniaque Réverbéré',
    description: 'Ricanement sardonique résonnant dans la nef maudite',
    category: 'curses',
    categoryLabel: 'Malédictions',
    duration: '00:03'
  },
  {
    filename: 'creepy-laugh.mp3',
    label: 'Ricanement Sinistre',
    description: 'Rire étouffé et narquois venu des entrailles',
    category: 'curses',
    categoryLabel: 'Malédictions',
    duration: '00:01'
  },
  {
    filename: 'witch-laugh.mp3',
    label: 'Rire de Sorcière',
    description: 'Ricanement strident au-dessus du chaudron bouillonnant',
    category: 'curses',
    categoryLabel: 'Malédictions',
    duration: '00:01'
  },
  {
    filename: 'demonic-spirit-voice-sinister-laughter.mp3',
    label: 'Voix Infernale des Abysses',
    description: 'Possession et incantation funeste aux échos sombres',
    category: 'curses',
    categoryLabel: 'Malédictions',
    duration: '00:05'
  },
  {
    filename: 'dark-magic-short.mp3',
    label: 'Sortilège d’Ombre',
    description: 'Déflagration arcanique et onde d’énergie nécromancienne',
    category: 'curses',
    categoryLabel: 'Malédictions',
    duration: '00:08'
  },
  {
    filename: 'in-nomine-patris.mp3',
    label: 'Incantation Maudite',
    description: 'Litanie latine funèbre sous les voûtes de pierre',
    category: 'curses',
    categoryLabel: 'Malédictions',
    duration: '00:10'
  },

  // Créatures de la Nuit
  {
    filename: 'wolf-howl.mp3',
    label: 'Hurlement de Loup-Garou',
    description: 'Cri sauvage déchirant la brume sous la lune de sang',
    category: 'beasts',
    categoryLabel: 'Créatures',
    duration: '00:07'
  },
  {
    filename: 'monster-growl-roar-scary.mp3',
    label: 'Rugissement de Monstre',
    description: 'Grognement bestial d’une bête tapie dans l’ombre',
    category: 'beasts',
    categoryLabel: 'Créatures',
    duration: '00:04'
  },
  {
    filename: 'beast_growl.mp3',
    label: 'Grognement Abyssal',
    description: 'Menace sourde d’un prédateur sanguinaire',
    category: 'beasts',
    categoryLabel: 'Créatures',
    duration: '00:01'
  },
  {
    filename: 'owl-hooting.mp3',
    label: 'Chouette Effraie',
    description: 'Ululation d’oiseau de mauvais augure dans les bois',
    category: 'beasts',
    categoryLabel: 'Créatures',
    duration: '00:03'
  },
  {
    filename: 'zombie-moan.mp3',
    label: 'Plainte de Goule',
    description: 'Gémissement d’un mort-vivant réveillé du sommeil éternel',
    category: 'beasts',
    categoryLabel: 'Créatures',
    duration: '00:04'
  },
  {
    filename: 'female-vampire-bite.mp3',
    label: 'Morsure Vampirique',
    description: 'Baiser fatal et succion de sang dans le cou',
    category: 'beasts',
    categoryLabel: 'Créatures',
    duration: '00:04'
  },

  // Manoir & Angoisse
  {
    filename: 'door-creaking-opening-and-close.mp3',
    label: 'Porte Séculaire Grinçante',
    description: 'Lourd vantail de chêne s’ouvrant sur l’inconnu',
    category: 'manor',
    categoryLabel: 'Manoir',
    duration: '00:08'
  },
  {
    filename: 'heavy-door-unlocking.mp3',
    label: 'Déverrouillage de Crypte',
    description: 'Tour de clé rouillée dans la serrure d’un sarcophage',
    category: 'manor',
    categoryLabel: 'Manoir',
    duration: '00:02'
  },
  {
    filename: 'chain-noises-scary.mp3',
    label: 'Chaînes Rouillées Spectrales',
    description: 'Fers de suppliciés traînés sur les pavés humides',
    category: 'manor',
    categoryLabel: 'Manoir',
    duration: '00:20'
  },
  {
    filename: 'single-church-bell.mp3',
    label: 'Glas Funèbre de Minuit',
    description: 'Sonnerie lugubre de la cathédrale des morts',
    category: 'manor',
    categoryLabel: 'Manoir',
    duration: '00:03'
  },
  {
    filename: 'bone-crunching.mp3',
    label: 'Craquement d’Ossements',
    description: 'Piétinement et fracture de reliques squelettiques',
    category: 'manor',
    categoryLabel: 'Manoir',
    duration: '00:13'
  },
  {
    filename: 'thunderstorm-and-rain.mp3',
    label: 'Tonnerre & Tempête',
    description: 'Éclair foudroyant le clocher et pluie battante',
    category: 'manor',
    categoryLabel: 'Manoir',
    duration: '00:10'
  }
];
