/**
 * Logique métier et modèle du Bestiaire de l'Ombre.
 * Découplé du rendu React pour tests unitaires fiables.
 */

export interface BestiaryCreatureStats {
  ferocity: number;   // Férocité (1-100)
  resilience: number; // Résistance physique/magique (1-100)
  arcane: number;     // Puissance magique/spectrale (1-100)
  stealth: number;    // Furtivité dans la nuit (1-100)
  dread: number;      // Coefficient de terreur (1-100)
}

export type BestiaryCategory = 'all' | 'undead' | 'beasts' | 'spectres' | 'demons' | 'abyssal';

export interface BestiaryCreature {
  id: string;
  name: string;
  latinName: string;
  dangerLevel: number; // 1 à 5 crânes
  category: 'undead' | 'beasts' | 'spectres' | 'demons' | 'abyssal';
  categoryLabel: string;
  habitat: string;
  lore: string;
  weakness: string;
  strength: string;
  relicReward: string;
  stats: BestiaryCreatureStats;
  sfxFilename: string;
  sfxLabel: string;
  iconBg: string;
  borderColor: string;
  themeColor: string;
  glyph: string;
  imageUrl: string;
  linkedSlug: string;
  linkedTrackTitle: string;
}

export const ENRICHED_BESTIARY_CREATURES: BestiaryCreature[] = [
  {
    id: 'lycanthrope',
    name: 'Le Lycanthrope Sauvage',
    latinName: 'Homo Lupinus Feralis',
    dangerLevel: 4,
    category: 'beasts',
    categoryLabel: 'Bêtes Maudites',
    habitat: 'Forêts brumeuses et clairières sous la lune de sang',
    lore: 'Autrefois seigneur déchu ou voyageur égaré, la malédiction du loup transforme sa chair lors des nuits d’éclipse. Ses griffes acérées déchirent la pierre et son hurlement glace le sang des villageois calfeutrés derrière leurs volets scellés.',
    weakness: 'Lames d’argent trempées dans l’eau de source consacrée et aconit séché.',
    strength: 'Frénésie nocturne sous la pleine lune et régénération musculaire quasi-instantanée.',
    relicReward: 'Croc de Loup d’Argent (+15% score de rythme)',
    stats: { ferocity: 92, resilience: 84, arcane: 35, stealth: 78, dread: 88 },
    sfxFilename: 'wolf-howl.mp3',
    sfxLabel: 'Hurlement sauvage de meute',
    iconBg: 'from-[#7C2D12] to-[#2B0E04]',
    borderColor: '#EA580C',
    themeColor: '#EA580C',
    glyph: '🐺',
    imageUrl: '/src/assets/images/creature_lycanthrope_1793708630383.jpg',
    linkedSlug: 'l_eveil_des_lycanthropes',
    linkedTrackTitle: "L'Éveil des Lycanthropes",
  },
  {
    id: 'goule',
    name: 'Le Mort-Vivant des Catacombes',
    latinName: 'Necromorphus Putridus',
    dangerLevel: 3,
    category: 'undead',
    categoryLabel: 'Morts-Vivants',
    habitat: 'Sépulcres oubliés et charniers sous la crypte',
    lore: 'Arraché au repos éternel par des invocations d’outre-tombe, ce cadavre réanimé erre à la recherche de chaleur vitale. Ses membres décharnés grincent à chaque pas et sa plainte rauque hante les passages étroits où l’air s’épuise.',
    weakness: 'Feu grégeois et décapitation par lame bénite.',
    strength: 'Insensibilité à la douleur, morsure gangrenée et nombre écrasant en horde.',
    relicReward: 'Fragment d’Osselet Consacré (Protection contre 1 malus)',
    stats: { ferocity: 70, resilience: 75, arcane: 20, stealth: 55, dread: 72 },
    sfxFilename: 'zombie-moan.mp3',
    sfxLabel: 'Gémissement de goule affamée',
    iconBg: 'from-[#14532D] to-[#052E16]',
    borderColor: '#39FF14',
    themeColor: '#39FF14',
    glyph: '💀',
    imageUrl: '/src/assets/images/creature_goule_1793708685540.jpg',
    linkedSlug: 'shadows_of_dread',
    linkedTrackTitle: "Les Ombres de l'Effroi",
  },
  {
    id: 'vampire',
    name: 'La Comtesse Vampirique',
    latinName: 'Sanguis Nocturna Nobilis',
    dangerLevel: 5,
    category: 'undead',
    categoryLabel: 'Morts-Vivants',
    habitat: 'Alcôves de velours pourpre et chambres des miroirs brisés',
    lore: 'Drapée dans d’antiques soies brodées, la dame du manoir ne vieillit jamais. Son regard hypnotique paralyse les intrus avant qu’un baiser glacial sur la nuque ne scelle leur destin pour l’éternité.',
    weakness: 'Pieu de frêne planté au cœur au zénith, miroirs d’argent et rayons de l’aube.',
    strength: 'Séduction télépathique, métamorphose en brume écarlate et vol silencieux.',
    relicReward: 'Calice d’Ambre Écarlate (Décuple les combos parfaits)',
    stats: { ferocity: 88, resilience: 90, arcane: 94, stealth: 96, dread: 95 },
    sfxFilename: 'female-vampire-bite.mp3',
    sfxLabel: 'Morsure et succion fatale',
    iconBg: 'from-[#580C1F] to-[#1C050B]',
    borderColor: '#BE123C',
    themeColor: '#BE123C',
    glyph: '🩸',
    imageUrl: '/src/assets/images/creature_vampire_1793708643832.jpg',
    linkedSlug: 'blood_moon_ritual',
    linkedTrackTitle: 'Rituel de la Lune de Sang',
  },
  {
    id: 'sorciere',
    name: 'La Sorcière d’Hécate',
    latinName: 'Maga Venefica Coven',
    dangerLevel: 4,
    category: 'demons',
    categoryLabel: 'Invocations Démoniaques',
    habitat: 'Clairières aux feux follets et huttes aux racines de mandragore',
    lore: 'Gardienne des recettes interdites et des herbes vénéneuses, elle converse avec les corbeaux messagers. Son rire strident annonce le déchaînement d’un maléfice capable de changer l’eau des fontaines en poison ténébreux.',
    weakness: 'Brûler son grimoire secret et briser son miroir de divination en obsidienne.',
    strength: 'Métamorphoses illusoires, potions de catalepsie et malédictions télékinétiques.',
    relicReward: 'Fiole de Mandragore Luminescente (Bonus de temps permanent)',
    stats: { ferocity: 65, resilience: 72, arcane: 96, stealth: 82, dread: 86 },
    sfxFilename: 'witch-laugh.mp3',
    sfxLabel: 'Ricanement au chaudron bouillonnant',
    iconBg: 'from-[#4C1D95] to-[#1E0E38]',
    borderColor: '#C084FC',
    themeColor: '#C084FC',
    glyph: '🧙‍♀️',
    imageUrl: '/src/assets/images/creature_sorciere_1793708656798.jpg',
    linkedSlug: 'gare_aux_sorcieres',
    linkedTrackTitle: 'Gare aux Sorcières !',
  },
  {
    id: 'spectre',
    name: 'Le Spectre des Voûtes',
    latinName: 'Phantasma Sépulcralis',
    dangerLevel: 3,
    category: 'spectres',
    categoryLabel: 'Spectres & Brumes',
    habitat: 'Nefs de cathédrales effondrées et corridors sans issue',
    lore: 'Une silhouette de brume laiteuse, intangible et froide comme le givre. Les spectres ne peuvent plus toucher le monde des vivants, mais leurs complaintes déchirantes font perdre la raison à quiconque les écoute trop longtemps.',
    weakness: 'Sel gemme sanctifié répandu en cercle et fumigations d’encens de myrrhe.',
    strength: 'Intangibilité totale aux armes terrestres, traversée des murs et souffle de glace.',
    relicReward: 'Voile Ectoplasmique (Immunité aux erreurs de timing)',
    stats: { ferocity: 52, resilience: 98, arcane: 85, stealth: 95, dread: 91 },
    sfxFilename: 'eerie_ghostly.mp3',
    sfxLabel: 'Complainte et râle ectoplasmique',
    iconBg: 'from-[#1E1B4B] to-[#0A0726]',
    borderColor: '#818CF8',
    themeColor: '#818CF8',
    glyph: '👻',
    imageUrl: '/src/assets/images/creature_spectre_1793708671784.jpg',
    linkedSlug: 'the_umbral_descent',
    linkedTrackTitle: 'La Descente Ombrale',
  },
  {
    id: 'titan',
    name: 'Le Titan Abyssal',
    latinName: 'Colossus Subterraneus',
    dangerLevel: 5,
    category: 'abyssal',
    categoryLabel: 'Seigneurs des Abysses',
    habitat: 'Profondeurs insondables sous les fondations du manoir',
    lore: 'Endormi depuis des millénaires avant que la première pierre ne fût posée, ce béhémoth de basalte et de flammes sombres commence à s’agiter. Chacune de ses respirations fait trembler les voûtes de granit.',
    weakness: 'Sceau runique des Sept Sages gravé dans son cœur de magma noirci.',
    strength: 'Masse colossale titanesque provoquant des ondes de choc dévastatrices.',
    relicReward: 'Roc de Basalte Primordial (Double la réverbération de la crypte)',
    stats: { ferocity: 98, resilience: 99, arcane: 78, stealth: 10, dread: 99 },
    sfxFilename: 'monster-growl-roar-scary.mp3',
    sfxLabel: 'Rugissement et grondement abyssal',
    iconBg: 'from-[#451A03] to-[#1C0A02]',
    borderColor: '#FF7518',
    themeColor: '#FF7518',
    glyph: '🗿',
    imageUrl: '/src/assets/images/creature_titan_1793708714016.jpg',
    linkedSlug: 'awakening_of_the_titan',
    linkedTrackTitle: "L'Éveil du Titan",
  },
  {
    id: 'demon',
    name: 'L’Invocateur Démoniaque',
    latinName: 'Daemonis Archon Inferni',
    dangerLevel: 5,
    category: 'demons',
    categoryLabel: 'Invocations Démoniaques',
    habitat: 'Portails arcaniques scellés par des runes de sang',
    lore: 'Entité issue du vide primordial, invoquée par imprudence lors d’un rituel de comète écarlate. Sa voix sépulcrale s’exprime par doubles tonalités et murmure d’effroyables promesses de puissance.',
    weakness: 'Répétition inversée des psaumes funéraires et sceau de Salomon gravé sur bronze.',
    strength: 'Téléportation dimensionnelle, flammes noires corrompant l’esprit et domination.',
    relicReward: 'Sceau Démoniaque Pourpre (Débloque les sonorités infernales du Beat Pad)',
    stats: { ferocity: 94, resilience: 88, arcane: 99, stealth: 74, dread: 98 },
    sfxFilename: 'demonic-spirit-voice-sinister-laughter.mp3',
    sfxLabel: 'Voix infernale démoniaque',
    iconBg: 'from-[#7F1D1D] to-[#2C0A0A]',
    borderColor: '#EF4444',
    themeColor: '#EF4444',
    glyph: '👹',
    imageUrl: '/src/assets/images/creature_demon_1793708733271.jpg',
    linkedSlug: 'darkness_claims_its_throne',
    linkedTrackTitle: 'Les Ténèbres Réclament Leur Trône',
  },
  {
    id: 'gargouille',
    name: 'La Gargouille Gardienne',
    latinName: 'Saxum Animatum Custos',
    dangerLevel: 2,
    category: 'spectres',
    categoryLabel: 'Spectres & Brumes',
    habitat: 'Contreforts des toits et gargouilles sculptées de pierre',
    lore: 'Pendant le jour, elle ne semble être qu’une statue difforme de calcaire gris. Mais lorsque sonne la douzième heure de la nuit, la pierre s’anime et ses yeux rubis s’embrasent pour chasser les profanateurs.',
    weakness: 'Frappe de marteau bénit sur les jointures ailées lors de la phase d’endormissement.',
    strength: 'Peau minérale impénétrable aux flèches, plongeon en piqué foudroyant.',
    relicReward: 'Œil de Rubis Pétrifié (+10% précision de frappe)',
    stats: { ferocity: 60, resilience: 95, arcane: 40, stealth: 88, dread: 65 },
    sfxFilename: 'creepy-laugh.mp3',
    sfxLabel: 'Ricanement rocailleux et railleur',
    iconBg: 'from-[#312E81] to-[#131138]',
    borderColor: '#A5B4FC',
    themeColor: '#A5B4FC',
    glyph: '🦇',
    imageUrl: '/src/assets/images/creature_gargouille_1793708699808.jpg',
    linkedSlug: 'haunted_cello_chamber',
    linkedTrackTitle: 'La Chambre au Violoncelle Hanté',
  },
  {
    id: 'banshee',
    name: 'La Banshee des Brumes',
    latinName: 'Bean Sidhe Clangens',
    dangerLevel: 4,
    category: 'spectres',
    categoryLabel: 'Spectres & Brumes',
    habitat: 'Tourbières écossaises, cascades solitaires et cimetières noircis',
    lore: 'Vierge éplorée drapée d’un linceul déchiré par les ronces de bruyère. Sa chevelure d’argent flotte sans vent et ses larmes de sang coulent sans fin. Lorsque son cri strident déchire le silence, il prophétise la mort certaine d’un être cher avant l’aube.',
    weakness: 'Peigne d’or pur jeté dans l’eau stagnante et silence absolu de l’auditeur.',
    strength: 'Cri supersonique déchirant les tympans et causant des hémorragies fatales instantanées.',
    relicReward: 'Linceul d’Argent Tissé (Atténue le son des pièges)',
    stats: { ferocity: 75, resilience: 60, arcane: 95, stealth: 90, dread: 97 },
    sfxFilename: 'eerie_ghostly.mp3',
    sfxLabel: 'Complainte déchirante de la Banshee',
    iconBg: 'from-[#0F172A] to-[#020617]',
    borderColor: '#38BDF8',
    themeColor: '#38BDF8',
    glyph: '🕯️',
    imageUrl: '/src/assets/images/creature_banshee_1793969050873.jpg',
    linkedSlug: 'echoes_of_the_forgotten',
    linkedTrackTitle: 'Les Échos des Oubliés',
  },
  {
    id: 'arachne',
    name: 'L’Arachné des Cryptes',
    latinName: 'Arachne Sepulcralis Gigas',
    dangerLevel: 3,
    category: 'beasts',
    categoryLabel: 'Bêtes Maudites',
    habitat: 'Coins obscurs des cryptes, charpentes centenaires et caveaux royaux',
    lore: 'Tisseuse titanesque aux huit pattes velues ornées d’anneaux d’obsidienne. Elle tisse patiemment des toiles de soie noire d’une résistance supérieure au fer forgé, capturant spectres et chauves-souris pour s’abreuver de leur essence astrale.',
    weakness: 'Torches de résine d’ambre enflammées et vibrations d’accords de violoncelle bas.',
    strength: 'Venin nécrotique paralysant les muscles et soie adhésive indestructible.',
    relicReward: 'Bobine de Soie Lunaire (Accroît la souplesse du Beat Pad)',
    stats: { ferocity: 82, resilience: 70, arcane: 58, stealth: 94, dread: 85 },
    sfxFilename: 'dark-magic-short.mp3',
    sfxLabel: 'Tissage et venin foudroyant',
    iconBg: 'from-[#2E1065] to-[#0F0524]',
    borderColor: '#A855F7',
    themeColor: '#A855F7',
    glyph: '🕷️',
    imageUrl: '/src/assets/images/creature_goule_1793708685540.jpg',
    linkedSlug: 'treacherous_echoes',
    linkedTrackTitle: 'Les Échos Perfides',
  },
  {
    id: 'corbeau',
    name: 'Le Corbeau Messager de Poe',
    latinName: 'Corvus Umbrae Mortis',
    dangerLevel: 2,
    category: 'beasts',
    categoryLabel: 'Bêtes Maudites',
    habitat: 'Frontons de marbre, branches de chêne foudroyé et cloîtres déserts',
    lore: 'Oiseau prophétique au plumage d’un noir d’abysse iridescent. Il observe d’un œil d’agate les défunts et répète inlassablement l’unique mot des amants condamnés : Nevermore. Ses battements d’ailes dispersent des miasmes d’oubli.',
    weakness: 'Miroir réflecteur de lumière céleste et sel fin semé en croix.',
    strength: 'Prophéties fatales, vol acrobatique insaisissable et vision astrale perçante.',
    relicReward: 'Plume Noire de Nevermore (Garantit un coup critique d’orgue)',
    stats: { ferocity: 45, resilience: 50, arcane: 86, stealth: 92, dread: 78 },
    sfxFilename: 'owl-hooting.mp3',
    sfxLabel: 'Croassement spectral dans la nuit',
    iconBg: 'from-[#172554] to-[#081026]',
    borderColor: '#60A5FA',
    themeColor: '#60A5FA',
    glyph: '🦅',
    imageUrl: '/src/assets/images/creature_gargouille_1793708699808.jpg',
    linkedSlug: 'through_haunted_halls',
    linkedTrackTitle: 'À Travers les Couloirs Hantés',
  },
  {
    id: 'poltergeist',
    name: 'Le Poltergeist du Manoir',
    latinName: 'Spiritus Turbator Claustrum',
    dangerLevel: 3,
    category: 'spectres',
    categoryLabel: 'Spectres & Brumes',
    habitat: 'Bibliothèques secrètes, galeries de tableaux et combles poussiéreux',
    lore: 'Entité invisible nourrie de rancœur séculaire. Elle se manifeste par des vacarmes soudains, fait claquer les lourds vantaux de chêne, projette la vaisselle de porcelaine contre les murs et agite les fers rouillés pour terroriser les hôtes.',
    weakness: 'Cloches de bronze tintées à la volée et sel consacré sur les seuils de portes.',
    strength: 'Télékinésie foudroyante, invisibilité totale et imprévisibilité chaotique.',
    relicReward: 'Clé Rouillée de Porte Secrète (Débloque les trésors du manoir)',
    stats: { ferocity: 68, resilience: 85, arcane: 89, stealth: 99, dread: 82 },
    sfxFilename: 'chain-noises-scary.mp3',
    sfxLabel: 'Chaînes agitées et fracas de meubles',
    iconBg: 'from-[#374151] to-[#111827]',
    borderColor: '#9CA3AF',
    themeColor: '#9CA3AF',
    glyph: '⛓️',
    imageUrl: '/src/assets/images/creature_spectre_1793708671784.jpg',
    linkedSlug: 'haunted_manor',
    linkedTrackTitle: 'Le Manoir Hanté',
  },
  {
    id: 'cavalier',
    name: 'Le Cavalier Sans Tête',
    latinName: 'Eques Decapitatus Hellebore',
    dangerLevel: 5,
    category: 'undead',
    categoryLabel: 'Morts-Vivants',
    habitat: 'Ponts de bois vermoulu et ravins embrumés de Sleepy Hollow',
    lore: 'Chevalier mercenaire trahi et décapité durant une guerre d’autrefois. Il galope sur un étalon noir aux sabots enflammés, brandissant une citrouille sculptée embrasée en guise de tête et tranchant la route de tout voyageur imprudent.',
    weakness: 'Franchir un cours d’eau vive ou un pont sacré avant que son sabre n’abatte le cou.',
    strength: 'Vitesse de charge invincible, épée de fer maudit et terreur primale paralysante.',
    relicReward: 'Fer à Cheval Incandescent (Multiplicateur x3 permanent)',
    stats: { ferocity: 96, resilience: 92, arcane: 74, stealth: 65, dread: 98 },
    sfxFilename: 'beast_growl.mp3',
    sfxLabel: 'Galop d’étalon et rire étouffé',
    iconBg: 'from-[#78350F] to-[#1C0F02]',
    borderColor: '#F59E0B',
    themeColor: '#F59E0B',
    glyph: '🎃',
    imageUrl: '/src/assets/images/creature_cavalier_1793969052145.jpg',
    linkedSlug: 'la_marche_des_possedes',
    linkedTrackTitle: 'La Marche des Possédés',
  },
  {
    id: 'squelette',
    name: 'Le Squelette Nécromancien',
    latinName: 'Ossium Magister Tenebrarum',
    dangerLevel: 4,
    category: 'undead',
    categoryLabel: 'Morts-Vivants',
    habitat: 'Ossuaires royaux, cryptes de cathédrales et chapelles oubliées',
    lore: 'Ancien prélat corrompu dont seule subsiste l’armature osseuse blanchie par le temps. Coiffé d’une mitre déchiquetée, il joue des cantiques funèbres sur son orgue de tuyaux d’argent pour réveiller les bataillons de soldats ensevelis.',
    weakness: 'Briser son sceptre d’os taillé dans le fémur d’un roi maudit.',
    strength: 'Invocation perpétuelle de squelettes guerriers et maîtrise des accords dissonants.',
    relicReward: 'Tibia Harmonique (Améliore la clarté des percussions)',
    stats: { ferocity: 78, resilience: 76, arcane: 94, stealth: 60, dread: 89 },
    sfxFilename: 'in-nomine-patris.mp3',
    sfxLabel: 'Incantation latine et orgue sépulcral',
    iconBg: 'from-[#1E293B] to-[#0F172A]',
    borderColor: '#CBD5E1',
    themeColor: '#CBD5E1',
    glyph: '🦴',
    imageUrl: '/src/assets/images/game_crypt_sarcophagus_1793869174001.jpg',
    linkedSlug: 'la_marche_des_corps_silencieux',
    linkedTrackTitle: 'La Marche des Corps Silencieux',
  },
  {
    id: 'epouvantail',
    name: 'L’Épouvantail des Marais',
    latinName: 'Terriculamentum Animatum',
    dangerLevel: 3,
    category: 'abyssal',
    categoryLabel: 'Seigneurs des Abysses',
    habitat: 'Champs de courges abandonnés, marais de saules et croisées des chemins',
    lore: 'Mannequin de toile de jute rembourré de paille desséchée et cloué à une poutre de chêne noirci. Des esprits malins ont animé ses membres noueux ; la nuit tombée, il descend de son pieu, armé d’une faux rouillée pour faucher les imprudents.',
    weakness: 'Feu alchimique immédiat et déchirement des coutures du visage de chanvre.',
    strength: 'Mouvements désarticulés imprévisibles, camouflage dans les champs et faux acérée.',
    relicReward: 'Cœur de Paille Ensorcelée (Augmente les fenêtres de réussite)',
    stats: { ferocity: 80, resilience: 64, arcane: 65, stealth: 90, dread: 84 },
    sfxFilename: 'cemetery_wind.mp3',
    sfxLabel: 'Vent sinistre et crissement de paille',
    iconBg: 'from-[#713F12] to-[#2E1906]',
    borderColor: '#EAB308',
    themeColor: '#EAB308',
    glyph: '🌾',
    imageUrl: '/src/assets/images/game_pumpkin_graveyard_1793869137851.jpg',
    linkedSlug: '2_villagers_died_this_night',
    linkedTrackTitle: '2 Villageois Morts Cette Nuit',
  },
  {
    id: 'cerbere',
    name: 'Le Molosse des Enfers',
    latinName: 'Cerberus Infernalis Triceps',
    dangerLevel: 5,
    category: 'abyssal',
    categoryLabel: 'Seigneurs des Abysses',
    habitat: 'Rives du fleuve de lave noire et seuils des cryptes abyssales',
    lore: 'Chien titanesque aux trois têtes baveuses couronnées d’échines osseuses et de vipères sifflantes. Ses yeux brillent d’un feu vert infernal et sa gueule crache de la poix liquide consumant toute armure en quelques battements de cœur.',
    weakness: 'Musique céleste de lyre ou violoncelle apaisant les trois têtes simultanément.',
    strength: 'Triple morsure écrasante, haleine empoisonnée et veille perpétuelle sans sommeil.',
    relicReward: 'Collier d’Airain Infernal (Régénération de bouclier arcanique)',
    stats: { ferocity: 99, resilience: 96, arcane: 82, stealth: 40, dread: 99 },
    sfxFilename: 'beast_growl.mp3',
    sfxLabel: 'Triple grognement d’airain infernal',
    iconBg: 'from-[#4C0519] to-[#1C0006]',
    borderColor: '#F43F5E',
    themeColor: '#F43F5E',
    glyph: '🐕‍🦺',
    imageUrl: '/src/assets/images/creature_demon_1793708733271.jpg',
    linkedSlug: 'le_cantique_des_profondeurs',
    linkedTrackTitle: 'Le Cantique des Profondeurs',
  },
  // NOUVELLES CRÉATURES MYTHOLOGIQUES DU SABBAT :
  {
    id: 'wendigo',
    name: 'Le Wendigo des Frimas',
    latinName: 'Cannibalis Glacialis',
    dangerLevel: 5,
    category: 'beasts',
    categoryLabel: 'Bêtes Maudites',
    habitat: 'Forêts boréales maudites, congères éternelles et cols glaciaires',
    lore: 'Monstre squelettique né de l’avidité et du cannibalisme dans les hivers les plus impitoyables. Sa tête est un crâne de cerf aux bois étincelants de givre sanglant et son cœur est un bloc de glace noire. Plus il dévore d’âmes errantes, plus sa faim insatiable le dévore de l’intérieur.',
    weakness: 'Feu alchimique solaire et percer son cœur de glace noire avec une lame ardente.',
    strength: 'Vitesse spectrale dans le blizzard, souffle congelant et mimétisme des voix humaines.',
    relicReward: 'Fragment de Cœur de Givre (Ralentit la chute des notes dans Requiem)',
    stats: { ferocity: 98, resilience: 91, arcane: 72, stealth: 95, dread: 99 },
    sfxFilename: 'wolf-howl.mp3',
    sfxLabel: 'Hurlement spectral dans le blizzard',
    iconBg: 'from-[#0C4A6E] to-[#082F49]',
    borderColor: '#38BDF8',
    themeColor: '#38BDF8',
    glyph: '❄️',
    imageUrl: '/src/assets/images/creature_wendigo_1793969051822.jpg',
    linkedSlug: 'l_eveil_des_lycanthropes',
    linkedTrackTitle: "L'Éveil des Lycanthropes",
  },
  {
    id: 'anubis',
    name: "Le Gardien d'Anubis",
    latinName: 'Psychopompus Sepulchralis',
    dangerLevel: 4,
    category: 'undead',
    categoryLabel: 'Morts-Vivants',
    habitat: 'Nécropoles de sable noir, mastabas souterrains et salles du jugement',
    lore: "Sentinelle au corps d'homme et à tête de chacal d'ébène, tenant la balance du cœur et de la plume de Maât. Il veille sur le seuil de la momification et guide les spectres vers le royaume des ombres sous le chant funèbre des prêtres d'autrefois.",
    weakness: "Parfums de myrrhe pure et invocation du scarabée d'or sacré.",
    strength: "Jugement spirituel instantané, sceptre ouas maudit et armée de scarabées carnivores.",
    relicReward: "Scarabée de Lapis-Lazuli (Multiplie les points de combos dans le Hub)",
    stats: { ferocity: 82, resilience: 88, arcane: 96, stealth: 70, dread: 90 },
    sfxFilename: 'in-nomine-patris.mp3',
    sfxLabel: 'Litanie sacrée des nécropoles',
    iconBg: 'from-[#78350F] to-[#451A03]',
    borderColor: '#F59E0B',
    themeColor: '#F59E0B',
    glyph: '⚖️',
    imageUrl: '/src/assets/images/game_altar_monolith_1793869186293.jpg',
    linkedSlug: 'the_umbral_descent',
    linkedTrackTitle: 'La Descente Ombrale',
  },
  {
    id: 'chupacabra',
    name: 'Le Chupacabra Sanguinaire',
    latinName: 'Vampirus Reptilis Nocturnus',
    dangerLevel: 3,
    category: 'demons',
    categoryLabel: 'Invocations Démoniaques',
    habitat: 'Ranches désolés, collines arides et cavernes de basalte',
    lore: 'Créature reptilienne aux yeux rougeoyants et à l’échine hérissée de piquants fluorescents. Elle bondit sans bruit dans la nuit pour vider le bétail et les voyageurs de leur sang en ne laissant que deux marques punctiformes bleuâtres.',
    weakness: 'Sulfure incandescent, sel gemme et lumière d’aube vive.',
    strength: 'Bonds prodigieux de dix toises, griffes crochues et venin anticoagulant.',
    relicReward: 'Épine Dorsale Fluorescente (Révèle les pièges des Sarcophages)',
    stats: { ferocity: 85, resilience: 68, arcane: 60, stealth: 97, dread: 86 },
    sfxFilename: 'female-vampire-bite.mp3',
    sfxLabel: 'Sifflement reptilien et succion',
    iconBg: 'from-[#831843] to-[#4C0519]',
    borderColor: '#FB7185',
    themeColor: '#FB7185',
    glyph: '🦎',
    imageUrl: '/src/assets/images/creature_lycanthrope_1793708630383.jpg',
    linkedSlug: 'blood_moon_ritual',
    linkedTrackTitle: 'Rituel de la Lune de Sang',
  },
  {
    id: 'leviathan',
    name: 'Le Léviathan des Abysses Noires',
    latinName: 'Monstrum Profundum Tenebrosum',
    dangerLevel: 5,
    category: 'abyssal',
    categoryLabel: 'Seigneurs des Abysses',
    habitat: 'Fosse abyssale des tempêtes et mers noires sous-marines',
    lore: 'Bête primordiale colossale dont la tête écailleuse perce les flots sombres sous la lune écarlate. Des runes d’un langage oublié brillent sur son poitrail et ses tentacules titanesques peuvent engloutir une flottille en un seul remous.',
    weakness: 'Accords d’orgue cathédrale purs résonnant à la fréquence de résonance des eaux.',
    strength: 'Contrôle des maelströms, blindage d’écailles millénaires et onde de choc océanique.',
    relicReward: 'Écaille de Léviathan Maudite (Active le son 8D immersif maximal)',
    stats: { ferocity: 100, resilience: 100, arcane: 92, stealth: 30, dread: 100 },
    sfxFilename: 'monster-growl-roar-scary.mp3',
    sfxLabel: 'Rugissement abyssal des profondeurs',
    iconBg: 'from-[#042F2E] to-[#021C1B]',
    borderColor: '#2DD4BF',
    themeColor: '#2DD4BF',
    glyph: '🦑',
    imageUrl: '/src/assets/images/creature_leviathan_1793969052287.jpg',
    linkedSlug: 'le_cantique_des_profondeurs',
    linkedTrackTitle: 'Le Cantique des Profondeurs',
  },
];

// ==========================================
// Fonctions pures de filtrage et d'analyse
// ==========================================

export function filterCreaturesByCategory(
  creatures: BestiaryCreature[],
  category: BestiaryCategory
): BestiaryCreature[] {
  if (category === 'all') return creatures;
  return creatures.filter((c) => c.category === category);
}

export function filterCreaturesByDanger(
  creatures: BestiaryCreature[],
  minDanger: number
): BestiaryCreature[] {
  return creatures.filter((c) => c.dangerLevel >= minDanger);
}

export function searchCreatures(
  creatures: BestiaryCreature[],
  query: string
): BestiaryCreature[] {
  const q = query.trim().toLowerCase();
  if (!q) return creatures;
  return creatures.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.latinName.toLowerCase().includes(q) ||
      c.habitat.toLowerCase().includes(q) ||
      c.lore.toLowerCase().includes(q) ||
      c.categoryLabel.toLowerCase().includes(q) ||
      c.weakness.toLowerCase().includes(q) ||
      c.strength.toLowerCase().includes(q) ||
      c.relicReward.toLowerCase().includes(q)
  );
}

export function sortCreatures(
  creatures: BestiaryCreature[],
  sortBy: 'danger-desc' | 'danger-asc' | 'name' | 'dread'
): BestiaryCreature[] {
  const copy = [...creatures];
  switch (sortBy) {
    case 'danger-desc':
      return copy.sort((a, b) => b.dangerLevel - a.dangerLevel);
    case 'danger-asc':
      return copy.sort((a, b) => a.dangerLevel - b.dangerLevel);
    case 'name':
      return copy.sort((a, b) => a.name.localeCompare(b.name, 'fr'));
    case 'dread':
      return copy.sort((a, b) => b.stats.dread - a.stats.dread);
    default:
      return copy;
  }
}

export function getBestiaryStatsSummary(creatures: BestiaryCreature[]) {
  const total = creatures.length;
  const categoriesCount: Record<string, number> = {};
  let totalDread = 0;
  let maxDanger = 0;

  creatures.forEach((c) => {
    categoriesCount[c.category] = (categoriesCount[c.category] || 0) + 1;
    totalDread += c.stats.dread;
    if (c.dangerLevel > maxDanger) maxDanger = c.dangerLevel;
  });

  return {
    total,
    averageDread: total > 0 ? Math.round(totalDread / total) : 0,
    maxDanger,
    categoriesCount,
  };
}

// ==========================================
// Armes Occultes et Simulateur de Duel Sépulcral
// ==========================================

export type OccultWeaponId =
  | 'argent'
  | 'eau_benite'
  | 'flamme_solaire'
  | 'lyre_cathedrale'
  | 'miroir_obsidienne';

export interface OccultWeapon {
  id: OccultWeaponId;
  name: string;
  icon: string;
  description: string;
  strongAgainstCategories: BestiaryCategory[];
  bonusCreatures: string[];
  baseDamage: number;
  criticalChance: number;
  flavorText: string;
}

export const OCCULT_WEAPONS: OccultWeapon[] = [
  {
    id: 'argent',
    name: "Lame d'Argent Gravée",
    icon: '🗡️',
    description: "Forgée dans l'argent lunaire bénit par les prélats de l'ordre sépulcral.",
    strongAgainstCategories: ['beasts', 'undead'],
    bonusCreatures: ['lycanthrope', 'vampire', 'goule', 'cavalier'],
    baseDamage: 55,
    criticalChance: 0.35,
    flavorText: "L'argent consume la chair maudite et brise net les pactes de sang séculaires.",
  },
  {
    id: 'eau_benite',
    name: "Fiole d'Eau Bénite Primordiale",
    icon: '🧪',
    description: "Tirée des sept fontaines saintes de la crypte oubliée.",
    strongAgainstCategories: ['demons', 'undead'],
    bonusCreatures: ['demon', 'sorciere', 'anubis', 'chupacabra'],
    baseDamage: 50,
    criticalChance: 0.30,
    flavorText: "Une unique goutte vaporise la peau démoniaque dans un grésillement d'encens et de soufre.",
  },
  {
    id: 'flamme_solaire',
    name: "Encensoir de Feu Solaire",
    icon: '🔥',
    description: "Résines d'ambre purifiées consumées par une braise inextinguible.",
    strongAgainstCategories: ['beasts', 'abyssal'],
    bonusCreatures: ['wendigo', 'epouvantail', 'arachne'],
    baseDamage: 60,
    criticalChance: 0.25,
    flavorText: "La flamme sacrée dissout le givre maudit et réduit les chairs putrides en poussière stellaire.",
  },
  {
    id: 'lyre_cathedrale',
    name: "Lyre Funéraire Consacrée",
    icon: '🎻',
    description: "Cordes de boyau vibrant à la fréquence sacrée des orgues d'antan.",
    strongAgainstCategories: ['abyssal', 'spectres'],
    bonusCreatures: ['cerbere', 'leviathan', 'titan'],
    baseDamage: 52,
    criticalChance: 0.40,
    flavorText: "Les accords célestes apaisent la fureur des bêtes titanesques et scellent l'abysse.",
  },
  {
    id: 'miroir_obsidienne',
    name: "Miroir d'Obsidienne Runique",
    icon: '🪞',
    description: "Poli dans le basalte des catacombes et gravé des sceaux de Salomon.",
    strongAgainstCategories: ['spectres', 'demons'],
    bonusCreatures: ['spectre', 'banshee', 'poltergeist', 'gargouille'],
    baseDamage: 58,
    criticalChance: 0.30,
    flavorText: "Réfracte les terreurs astrales et piège les ombres errantes dans leur propre reflet maudit.",
  },
];

export interface OccultDuelResult {
  creatureId: string;
  creatureName: string;
  weaponId: OccultWeaponId;
  weaponName: string;
  victory: boolean;
  playerDamage: number;
  monsterCounterDamage: number;
  playerHealthRemaining: number;
  creatureHealthRemaining: number;
  isEffective: boolean;
  isCritical: boolean;
  combatLog: string[];
  relicUnlocked?: string;
  scoreBonus: number;
}

/**
 * Simule un affrontement d'exorcisme contre une entité du bestiaire
 * @param creature L'entité affrontée
 * @param weaponId L'arme sacrée choisie
 * @param forcedRoll Optionnel: pour tests déterministes (0 à 1)
 */
export function simulateOccultDuel(
  creature: BestiaryCreature,
  weaponId: OccultWeaponId,
  forcedRoll?: number
): OccultDuelResult {
  const weapon = OCCULT_WEAPONS.find((w) => w.id === weaponId) || OCCULT_WEAPONS[0];
  const roll = forcedRoll !== undefined ? forcedRoll : Math.random();

  const isCategoryBonus = weapon.strongAgainstCategories.includes(creature.category);
  const isCreatureBonus = weapon.bonusCreatures.includes(creature.id);
  const isEffective = isCategoryBonus || isCreatureBonus;

  // Calcul du coup critique
  const isCritical = roll < weapon.criticalChance;

  // Multiplicateurs de dégâts
  let weaponMultiplier = 1.0;
  if (isEffective) weaponMultiplier += 0.65;
  if (isCreatureBonus) weaponMultiplier += 0.35;
  if (isCritical) weaponMultiplier *= 1.5;

  // Points de vie de base de la créature (dérivés de sa résilience et de son danger)
  const monsterMaxHp = 80 + creature.stats.resilience * 1.2 + creature.dangerLevel * 15;
  // Dégâts infligés par le joueur
  const baseHit = weapon.baseDamage * weaponMultiplier;
  const variance = forcedRoll !== undefined ? 1.0 : 0.9 + Math.random() * 0.2;
  const playerDamage = Math.round(baseHit * variance);

  // Dégâts de riposte de la créature
  const monsterCounterBase = (creature.stats.ferocity * 0.6 + creature.stats.dread * 0.4) * (creature.dangerLevel * 0.25);
  // Si l'arme est très efficace, elle étourdit la créature et réduit sa riposte
  const counterMitigation = isEffective ? 0.5 : 1.0;
  const monsterCounterDamage = Math.round(monsterCounterBase * counterMitigation * (forcedRoll !== undefined ? 1.0 : (0.85 + Math.random() * 0.3)));

  const creatureHealthRemaining = Math.max(0, Math.round(monsterMaxHp - playerDamage));
  const playerInitialHp = 100;
  const playerHealthRemaining = Math.max(0, playerInitialHp - monsterCounterDamage);

  // Victoire si le monstre est vaincu ou si le joueur lui a infligé plus de 60% de ses HP et a survécu
  const victory = creatureHealthRemaining <= 0 || (creatureHealthRemaining < monsterMaxHp * 0.4 && playerHealthRemaining > 0);

  const combatLog: string[] = [];
  combatLog.push(`Invocation : Vous brandissez ${weapon.name} face à ${creature.name}.`);

  if (isCreatureBonus) {
    combatLog.push(`Faiblesse primordiale exploitée ! ${weapon.name} correspond parfaitement à la faille de ${creature.name}.`);
  } else if (isEffective) {
    combatLog.push(`Affinité occulte : ${weapon.name} est hautement efficace contre les ${creature.categoryLabel}.`);
  } else {
    combatLog.push(`Arme neutre : ${creature.name} résiste partiellement au métal sans enchantement dédié.`);
  }

  if (isCritical) {
    combatLog.push(`Frappe Sainte Foudroyante ! Coup critique asséné avec éclat.`);
  }

  combatLog.push(`Résultat : Vous infligez ${playerDamage} points de purification astrale.`);

  if (victory) {
    combatLog.push(`Victoire sépulcrale ! ${creature.name} est bannie vers le néant.`);
    combatLog.push(`Relique purifiée : « ${creature.relicReward} ».`);
  } else {
    combatLog.push(`Riposte sanglante : ${creature.name} vous assène ${monsterCounterDamage} dégâts d'effroi.`);
    combatLog.push(`Repli tactique requis pour recharger vos énergies occultes.`);
  }

  const scoreBonus = victory ? creature.dangerLevel * 250 + Math.round(playerDamage * 2) : 50;

  return {
    creatureId: creature.id,
    creatureName: creature.name,
    weaponId: weapon.id,
    weaponName: weapon.name,
    victory,
    playerDamage,
    monsterCounterDamage,
    playerHealthRemaining,
    creatureHealthRemaining,
    isEffective,
    isCritical,
    combatLog,
    relicUnlocked: victory ? creature.relicReward : undefined,
    scoreBonus,
  };
}

// ==========================================
// Comparateur de Monstres ("Face-à-Face Occulte")
// ==========================================

export interface CreatureComparison {
  creatureA: BestiaryCreature;
  creatureB: BestiaryCreature;
  deltas: {
    ferocity: number;
    resilience: number;
    arcane: number;
    stealth: number;
    dread: number;
    total: number;
  };
  winnerId: string | 'draw';
  summarySentence: string;
  tacticalAdvantage: string;
}

export function compareCreatures(
  a: BestiaryCreature,
  b: BestiaryCreature
): CreatureComparison {
  const deltas = {
    ferocity: a.stats.ferocity - b.stats.ferocity,
    resilience: a.stats.resilience - b.stats.resilience,
    arcane: a.stats.arcane - b.stats.arcane,
    stealth: a.stats.stealth - b.stats.stealth,
    dread: a.stats.dread - b.stats.dread,
    total:
      a.stats.ferocity +
      a.stats.resilience +
      a.stats.arcane +
      a.stats.stealth +
      a.stats.dread -
      (b.stats.ferocity +
        b.stats.resilience +
        b.stats.arcane +
        b.stats.stealth +
        b.stats.dread),
  };

  let winnerId: string | 'draw' = 'draw';
  if (deltas.total > 0) winnerId = a.id;
  else if (deltas.total < 0) winnerId = b.id;

  let summarySentence = '';
  if (winnerId === 'draw') {
    summarySentence = `Équilibre absolu des ombres : ${a.name} et ${b.name} possèdent une puissance occulte équivalente.`;
  } else if (winnerId === a.id) {
    summarySentence = `${a.name} surclasse ${b.name} avec un avantage total de +${deltas.total} points de caractéristiques.`;
  } else {
    summarySentence = `${b.name} domine ${a.name} avec un avantage total de +${Math.abs(deltas.total)} points de caractéristiques.`;
  }

  let tacticalAdvantage = '';
  if (Math.abs(deltas.arcane) >= 15) {
    tacticalAdvantage = deltas.arcane > 0
      ? `${a.name} domine sur le plan ésotérique et les rituels magiques.`
      : `${b.name} domine sur le plan ésotérique et les rituels magiques.`;
  } else if (Math.abs(deltas.ferocity) >= 15) {
    tacticalAdvantage = deltas.ferocity > 0
      ? `${a.name} possède une puissance brute de frappe physique écrasante.`
      : `${b.name} possède une puissance brute de frappe physique écrasante.`;
  } else {
    tacticalAdvantage = `Duel serré : l'affrontement se décidera sur la furtivité et la résistance à l'effroi.`;
  }

  return {
    creatureA: a,
    creatureB: b,
    deltas,
    winnerId,
    summarySentence,
    tacticalAdvantage,
  };
}

