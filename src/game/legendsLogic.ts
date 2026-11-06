import { getAssetUrl } from '../utils/assetPath';
/**
 * Logique pure du Grand Grimoire des Légendes d'Halloween & d'Octobre
 * SpookyBeats - Geoffroy Streit (Hylst)
 */

export type LegendTomeId = 
  | 'tome-celtique' 
  | 'tome-damnes' 
  | 'tome-malefices' 
  | 'tome-revenants' 
  | 'tome-hylst';

export type LegendCategory = 'origines' | 'esprits' | 'monstres' | 'revenants' | 'hylst';

export interface LegendTomeInfo {
  id: LegendTomeId;
  title: string;
  subtitle: string;
  icon: string;
  accentColor: string;
  description: string;
  totalLegends: number;
}

export interface LegendItem {
  id: string;
  tomeId: LegendTomeId;
  chronicleNumber: number;
  category: LegendCategory;
  categoryLabel: string;
  title: string;
  subtitle: string;
  historicalPeriod: string;
  geographicalOrigin: string;
  latinMotto: string;
  latinTranslation: string;
  epigraph: string;
  fullStory: string[];
  occultRitual: string;
  botanicalPreservation: string;
  associatedTrackSlug: string;
  associatedTrackTitle: string;
  imagePath?: string;
  audioMood: 'mystique' | 'tenebreux' | 'dramatique' | 'sepulcral';
  divinationKeywords: string[];
  divinationOracleReading: string;
}

export const LEGEND_TOMES: LegendTomeInfo[] = [
  {
    id: 'tome-celtique',
    title: 'Tome I : Rituels & Origines Celtiques',
    subtitle: 'La Fête de Samhain & Le Voile Évanoui',
    icon: '🔥',
    accentColor: '#FF7518',
    description: 'Les célébrations antiques pastorales de l’Irlande et de l’Écosse où l’année s’achevait et où le Sidh ouvrait ses tumulus sacrés.',
    totalLegends: 3,
  },
  {
    id: 'tome-damnes',
    title: 'Tome II : Damnés & Spectres des Ténèbres',
    subtitle: 'Errances Perpétuelles & Pactes Funestes',
    icon: '🕯️',
    accentColor: '#DFB7FF',
    description: 'Les âmes réprouvées, bannies de l’éternité céleste et du brasier infernal, condamnées à arpenter la tourbe avec une flamme vacillante.',
    totalLegends: 4,
  },
  {
    id: 'tome-malefices',
    title: 'Tome III : Monstres & Maléfices Nocturnes',
    subtitle: 'Chaudrons de Belladone & Métamorphoses',
    icon: '🧪',
    accentColor: '#39FF14',
    description: 'Les sabbats sous la lune de sang, le venin des jusquiames et la fureur animale des bêtes affamées brisant les liens de la chair.',
    totalLegends: 4,
  },
  {
    id: 'tome-revenants',
    title: 'Tome IV : Créatures & Revenants d’Outre-Tombe',
    subtitle: 'Danses Macabres & Linceuls de Cendre',
    icon: '💀',
    accentColor: '#93C5FD',
    description: 'Les ossuaires animés au douzième coup de minuit, les lamentations des banshees et les gardiens de pierre sculptés sur les cathédrales.',
    totalLegends: 3,
  },
  {
    id: 'tome-hylst',
    title: 'Tome V : Mystères & Alchimie Sonore d’Hylst',
    subtitle: 'L’Archet Hanté & Les Synthétiseurs de Minuit',
    icon: '🎻',
    accentColor: '#F59E0B',
    description: 'La chronique moderne de Geoffroy Streit (Hylst), l’assemblage des synthés analogiques et des résonances spectrales pour ressusciter l’obscurité.',
    totalLegends: 2,
  },
];

export const ALL_LEGENDS: LegendItem[] = [
  // =========================================================================
  // TOME I : RITUELS & ORIGINES CELTIQUES
  // =========================================================================
  {
    id: 'samhain',
    tomeId: 'tome-celtique',
    chronicleNumber: 1,
    category: 'origines',
    categoryLabel: 'Origines Celtiques',
    title: 'Samhain et les Portes du Sidh',
    subtitle: 'La nuit sacrée où le voile entre les mondes s’efface',
    historicalPeriod: 'Ier millénaire avant notre ère',
    geographicalOrigin: 'Collines de Tlachtga & Tara, Irlande',
    latinMotto: 'Vigilia mortuorum, porta umbrarum aperitur',
    latinTranslation: 'Veillée des défunts, la porte des ombres s’ouvre',
    epigraph: 'Lorsque le dernier troupeau rentre au bercail et que les feux de l’âtre sont éteints, la terre cesse d’appartenir aux vivants pour une unique nuit d’effroi sacré.',
    fullStory: [
      'Dans l’antique calendrier tripartite des peuples gaéliques, Samhain - littéralement « la fin de l’été » - ne marquait pas simplement le trépas des récoltes, mais une rupture métaphysique dans la trame du temps. Les tribus éteignaient tous les foyers domestiques au crépuscule, plongeant les collines dans une noirceur totale et absolue.',
      'Au sommet du mont sacré de Tlachtga, les druides allumaient alors un unique brasier purificateur au moyen d’un frottement de chêne et de silex. Chaque clan envoyait un messager muni d’une torche pour rapporter la braise nouvelle et ranimer le feu du foyer familial, symbole de survie pour l’hiver naissant.',
      'Durant cet intervalle hors du temps, les collines creuses (les Sidhe) s’entrouvraient. Les défunts de la lignée revenaient chercher la tiédeur des braises et les offrandes d’avoine laissées sur le pas de porte. Mais avec eux s’échappaient les Fomorés, monstres difformes et esprits querelleurs. Pour ne pas être dévorés ou reconnus, les paysans noircissaient leurs visages de suie et revêtaient des peaux de bêtes brutes, se fondant parmi les ombres.'
    ],
    occultRitual: 'Éteindre toute source de lumière électrique, puis allumer une bougie de cire vierge au centre de la pièce en formulant un hommage aux ancêtres de la lignée.',
    botanicalPreservation: 'Feuilles de chêne centenaire, baies de sorbier des oiseleurs et branches de bruyère noire séchées.',
    associatedTrackSlug: 'the_umbral_descent',
    associatedTrackTitle: 'The Umbral Descent',
    imagePath: getAssetUrl('assets/grimoire/samhain_ritual.jpg'),
    audioMood: 'mystique',
    divinationKeywords: ['Renouveau', 'Transition', 'Hommage aux racines', 'Purification par l’ombre'],
    divinationOracleReading: 'Samhain vous rappelle qu’avant chaque renaissance printanière, la graine doit accepter le silence et la noirceur féconde de la terre froide.'
  },
  {
    id: 'pommes-avalon',
    tomeId: 'tome-celtique',
    chronicleNumber: 2,
    category: 'origines',
    categoryLabel: 'Divination & Moissons',
    title: 'Oidhche Shamhna & Les Pommes d’Avalon',
    subtitle: 'Rituels divinatoires de l’eau, noisettes d’âtre et miroirs nocturnes',
    historicalPeriod: 'Haut Moyen Âge gaélique',
    geographicalOrigin: 'Highlands d’Écosse & Comté de Mayo, Irlande',
    latinMotto: 'In speculo noctis fatum tuum cernis',
    latinTranslation: 'Dans le miroir de la nuit, tu discernes ton destin',
    epigraph: 'La pomme tranchée horizontalement révèle une étoile à cinq branches : le pentacle secret d’Avalon, l’île des bienheureux où dorment les rois blessés.',
    fullStory: [
      'Sous les chaumes des veillées d’automne, la nuit d’Oidhche Shamhna était celle où les jeunes gens interrogeaient l’invisible sur leur destinée amoureuse et leur longévité. Le célèbre jeu de mordre la pomme flottante (« bobbing for apples ») n’était pas un divertissement puéril, mais une ordalie rituelle de l’eau sacrée.',
      'L’eau stagnante du baquet représentait le lac primordial séparant le monde profane de l’île mythique d’Avalon. Celui qui parvenait à saisir la pomme d’or sans l’aide de ses mains capturait l’essence de l’arbre de vie et s’assurait la faveur des fées pour l’hiver.',
      'À minuit sonnant, les jeunes filles marchaient à reculons dans une chambre obscure, un cierge allumé dans une main et une pomme pelée d’un seul ruban dans l’autre. En fixant le miroir en étain tout en mangeant le fruit, elles espéraient voir apparaître au-dessus de leur épaule le visage de leur futur époux... ou celui d’un crâne grimaçant si la faucheuse devait les emporter avant le printemps.'
    ],
    occultRitual: 'Jeter deux noisettes dans les braises chaudes : si elles brûlent paisiblement côte à côte, l’harmonie régnera ; si l’une éclate avec fracas, une discorde inattendue surviendra.',
    botanicalPreservation: 'Pommes sauvages acidulées, noisettes de coudrier et écorce de cannelle d’Orient.',
    associatedTrackSlug: 'la_marche_des_corps_silencieux',
    associatedTrackTitle: 'La Marche des Corps Silencieux',
    imagePath: getAssetUrl('assets/grimoire/samhain_ritual.jpg'),
    audioMood: 'mystique',
    divinationKeywords: ['Clairvoyance', 'Révélation de l’inconnu', 'Audace', 'Reflet intérieur'],
    divinationOracleReading: 'Ne craignez pas ce que révèle le miroir de vos pensées les plus secrètes : la vérité, même austère, délivre des illusions trompeuses.'
  },
  {
    id: 'chaudron-cerridwen',
    tomeId: 'tome-celtique',
    chronicleNumber: 3,
    category: 'origines',
    categoryLabel: 'Alchimie Primordiale',
    title: 'Le Chaudron d’Airain de Cerridwen',
    subtitle: 'La métamorphose des trois gouttes d’Awen et l’illumination poétique',
    historicalPeriod: 'Légendes bardiques celtiques galloises',
    geographicalOrigin: 'Lac Bala, Pays de Galles (Cymru)',
    latinMotto: 'Tria guttata sapientiae universum aperiunt',
    latinTranslation: 'Trois gouttes de sagesse dévoilent l’univers',
    epigraph: 'Pendant un an et un jour, le bouillonnement ne doit jamais s’interrompre, car seule l’essence ultime concentre la mémoire de toutes les âmes.',
    fullStory: [
      'Dans les mythes de tradition cambrienne, la déesse et enchanteresse Cerridwen veillait sur un immense chaudron d’airain ouvragé nommé l’Awen. Désireuse d’offrir à son fils difforme, Morfran, un don supérieur pour compenser sa laideur, elle composa une potion conférant le savoir absolu et la prescience poétique.',
      'Le breuvage exigeait une décoction de plantes rares cueillies aux conjonctions astrales les plus périlleuses, maintenue à frémissement continu durant trois cent soixante-six jours. Cerridwen chargea le jeune garçon Gwion Bach d’attiser le feu sans jamais goûter à la mixture.',
      'Au dernier jour, trois gouttes brûlantes giclèrent hors du chaudron et atterrirent sur le pouce de Gwion. Par réflexe involontaire, l’enfant porta son pouce à sa bouche : instantanément, les secrets du passé, du présent et de l’avenir s’illuminèrent dans son esprit. Poursuivi par la fureur de la déesse, il se métamorphosa en lièvre, en poisson et en grain de blé, avant de renaître sous les traits de Taliesin, le barde immortel de la crypte.'
    ],
    occultRitual: 'Faire infuser dans de l’eau de source tiède trois feuilles de sauge blanche et une pincée de verveine officinale avant d’écouter une composition en boucle.',
    botanicalPreservation: 'Feuilles de verveine sauvage, fleurs de sureau noir et résine d’ambre rouge.',
    associatedTrackSlug: 'spectral_reverie',
    associatedTrackTitle: 'Spectral Reverie',
    imagePath: getAssetUrl('assets/grimoire/witches_sabbath.jpg'),
    audioMood: 'mystique',
    divinationKeywords: ['Inspiration suprême', 'Éveil artistique', 'Intuition fulgurante', 'Patience récompensée'],
    divinationOracleReading: 'L’étincelle de la créativité jaillit souvent d’un accident imprévu. Soyez attentif aux petits incidents du jour : ils abritent le génie de demain.'
  },

  // =========================================================================
  // TOME II : DAMNÉS & SPECTRES DES TÉNÈBRES
  // =========================================================================
  {
    id: 'jack-lanterne',
    tomeId: 'tome-damnes',
    chronicleNumber: 4,
    category: 'esprits',
    categoryLabel: 'Légendes des Marais',
    title: 'La Damnation de Jack à la Lanterne',
    subtitle: 'L’errance perpétuelle de l’âme bannie du Ciel et de l’Enfer',
    historicalPeriod: 'XVIIe siècle folklorique',
    geographicalOrigin: 'Tourbières du Connemara, Irlande',
    latinMotto: 'Nec caelum nec infernum animam meam accipit',
    latinTranslation: 'Ni le ciel ni l’enfer n’accueillent mon âme',
    epigraph: 'Un navet creusé, une braise d’Enfer et l’arrogance d’un forgeron suffirent à créer la sentinelle la plus célèbre des nuits d’octobre.',
    fullStory: [
      'Forgeron avare, querelleur notoire et rusé comme la vipère des haies, Jack dupait paysans, nobles et clercs dans toutes les tavernes du comté. Un soir d’octobre où la bruine noyait la lande, le Malin en personne vint réclamer son âme noircie par le péché.',
      'Jack feignit la résignation mais demanda une ultime pinte de bière amère, arguant qu’il n’avait point de quoi payer. Il convainquit le Diable de se changer en une pièce de six pence d’argent pour régler l’aubergiste. Dès que la métamorphose s’opéra, Jack emprisonna la pièce dans sa bourse de cuir, serrée contre une croix d’argent bénite qui privait l’entité de ses pouvoirs.',
      'Des années plus tard, à l’instant de son trépas, Saint Pierre lui refusa l’entrée du Paradis pour sa vie de mensonges. Au seuil de l’Enfer, le Diable, encore furieux de l’affront subi, lui claqua les portes de fer au nez en s’écriant : « Va-t’en, retourne dans la nuit des tourbières ! » Mais par ironie cynique, il lui jeta un tison de charbon incandescent qui ne s’éteindrait jamais. Jack le glissa dans un navet creusé pour éclairer ses pas d’éternel errant.'
    ],
    occultRitual: 'Déposer une lanterne sculptée sur le rebord de fenêtre tourné vers le couchant pour détourner les faux amis et les démarcheurs d’âmes.',
    botanicalPreservation: 'Navet d’hiver ou citrouille creusée, cire d’abeille noire et clous de girofle piqués dans la pulpe.',
    associatedTrackSlug: 'gare_aux_sorcieres',
    associatedTrackTitle: 'Gare aux Sorcières',
    imagePath: getAssetUrl('assets/grimoire/jack_lantern.jpg'),
    audioMood: 'tenebreux',
    divinationKeywords: ['Ruse excessive', 'Solitude de l’esprit', 'Pragmatisme', 'Lumière dans l’obscurité'],
    divinationOracleReading: 'À force de vouloir tromper tout le monde, on finit par s’enfermer dans sa propre solitude. Éclairez votre route sans chercher à éblouir les autres.'
  },
  {
    id: 'cavalier-sleepy-hollow',
    tomeId: 'tome-damnes',
    chronicleNumber: 5,
    category: 'esprits',
    categoryLabel: 'Spectres Guerriers',
    title: 'Le Cavalier Sans Tête de Sleepy Hollow',
    subtitle: 'La chevauchée nocturne du mercenaire héssois de la vallée endormie',
    historicalPeriod: 'Fin XVIIIe siècle (Guerre d’Indépendance américaine)',
    geographicalOrigin: 'Tarrytown & Sleepy Hollow, État de New York',
    latinMotto: 'Equitat sine capite per silvas nocturnas',
    latinTranslation: 'Il chevauche sans tête à travers les forêts nocturnes',
    epigraph: 'Le sabot ferré de son étalon noir bat le tablier vermoulu du pont avec la violence d’une salve de mousqueterie sous l’orage.',
    fullStory: [
      'Dans le vallon boisé et mélancolique de Sleepy Hollow, près des berges embrumées de l’Hudson, subsiste l’écho d’un mercenaire hessois engagé par la couronne britannique. Au cours d’un bombardement acharné durant la bataille de White Plains, un boulet de canon égaré lui arracha net la tête au ras des épaules.',
      'Inhumé à la hâte par les villageois dans le cimetière de la vieille église hollandaise, le soldat ne connut jamais le repos. Dès que les feuilles d’érable rougeoient et tourbillonnent sous les rafales d’octobre, l’ombre gigantesque du cavalier s’extrait de son tertre.',
      'Monté sur un étalon aux sabots de braise, le manteau noir déployé comme les ailes d’un grand corbeau, il traque les voyageurs isolés qui ont l’imprudence d’attarder leur calèche après l’angélus du soir. Armé d’un sabre ébréché et portant parfois sur le pommeau de sa selle une citrouille flamboyante, il pourchasse les âmes jusqu’au pont de bois sacré qui marque la frontière infranchissable des eaux vives.'
    ],
    occultRitual: 'Ne jamais se retourner si un claquement de sabots retentit derrière vous sur une route de campagne. Toujours franchir un ruisseau ou une passerelle d’eau courante pour rompre la poursuite spectrale.',
    botanicalPreservation: 'Écorce de bouleau blanc, feuilles d’érable automnales séchées et clous en fer forgé forgés à froid.',
    associatedTrackSlug: 'la_marche_des_corps_silencieux',
    associatedTrackTitle: 'La Marche des Corps Silencieux',
    imagePath: getAssetUrl('assets/grimoire/sleepy_hollow.jpg'),
    audioMood: 'dramatique',
    divinationKeywords: ['Poursuite implacable', 'Traumatisme du passé', 'Détermination féroce', 'Franchir le pont'],
    divinationOracleReading: 'Une obsession ancienne vous court après. N’ayez crainte : il suffit de franchir le pont symbolique d’une décision nette pour que le spectre s’évanouisse dans l’eau.'
  },
  {
    id: 'dame-blanche',
    tomeId: 'tome-damnes',
    chronicleNumber: 6,
    category: 'esprits',
    categoryLabel: 'Fantômes & Manoirs',
    title: 'La Dame Blanche des Chemins Creux',
    subtitle: 'Linceul d’argent, présage funèbre et auto-stoppeuse des brumes',
    historicalPeriod: 'Traditions médiévales et contemporaines',
    geographicalOrigin: 'Bretagne, Normandie & Châteaux de la Loire',
    latinMotto: 'Candida domina in nebula plorat',
    latinTranslation: 'La dame d’albâtre pleure dans la brume',
    epigraph: 'Elle ne demande rien, ne prononce aucun mot superflu, mais son silence pétrifie le cœur du voyageur le plus intrépide.',
    fullStory: [
      'Présente sous d’infinies variations de la pointe du Raz jusqu’aux forêts de Bohême, la Dame Blanche incarne la figure intemporelle de la fiancée trahie ou de la mère endeuillée. Vêtue d’une robe d’albâtre immaculée qui flotte sans jamais toucher la boue du chemin, elle se tient au bord des virages dangereux ou sur le parapet des ponts étroits.',
      'Dans les récits de marins bretons, elle apparaît sous les traits des « Lavandières de la Nuit » qui battent le linceul des vivants dans le ruisseau à la lueur des étoiles. Quiconque s’arrête pour les aider à essorer le linge se retrouve broyé dans l’étreinte glaciale de leurs bras d’os.',
      'À l’époque contemporaine, la légende a revêtu le manteau de l’auto-stoppeuse fantôme : prise à bord d’un véhicule au détour d’une route forestière sombre, elle crie subitement au virage fatal avant de disparaître dans l’habitacle clos, laissant derrière elle une odeur subtile de lys et d’eau de pluie.'
    ],
    occultRitual: 'Placer un galet blanc poli par le ressac sur le tableau de bord ou près du seuil de sa demeure pour conjurer les périls routiers.',
    botanicalPreservation: 'Pétales de lys blancs séchés, branches d’aubépine et eau lustrale de source.',
    associatedTrackSlug: 'spectral_reverie',
    associatedTrackTitle: 'Spectral Reverie',
    imagePath: getAssetUrl('assets/grimoire/banshee_mist.jpg'),
    audioMood: 'sepulcral',
    divinationKeywords: ['Avertissement bienveillant', 'Intuition du danger', 'Tristesse sublimée', 'Patience'],
    divinationOracleReading: 'Un signal discret vous invite à ralentir la cadence. Écoutez vos pressentiments avant d’aborder le prochain virage de votre vie.'
  },
  {
    id: 'feux-follets',
    tomeId: 'tome-damnes',
    chronicleNumber: 7,
    category: 'esprits',
    categoryLabel: 'Lueurs Trompeuses',
    title: 'Les Feux Follets des Marais Oubliés',
    subtitle: 'Will-o’-the-Wisp & les chandelles spectrales des fondrières',
    historicalPeriod: 'Antiquité pastorale & Moyen Âge',
    geographicalOrigin: 'Fens du Lincolnshire & Marais Poitevin',
    latinMotto: 'Ignis fatuus ad interitum ducit',
    latinTranslation: 'Le feu trompeur conduit au gouffre',
    epigraph: 'Suivre la flamme bleue dans le marécage, c’est promettre son dernier souffle à la fange sans épitaphe.',
    fullStory: [
      'Dans les fondrières désertes où stagnent les eaux noires et les herbes pourrissantes, de petites flammèches bleutées ou verdâtres s’élèvent au crépuscule sans consumer la moindre tige de jonc. Les paysans anglais les nommaient « Jack-o’-Lantern » ou « Corpse Candles » (chandelles des cadavres).',
      'Le voyageur égaré dans le brouillard voit scintiller cette lueur au loin et imagine la fenêtre accueillante d’une auberge avec feu de cheminée et vin chaud. Il quitte le sentier balisé, accélère le pas, mais la lumière recule d’un bond léger dès qu’il s’en approche.',
      'Pas après pas, la terre ferme cède la place à la boue gluante, puis aux tourbières mouvantes qui aspirent irrémédiablement les chevilles, jusqu’à ce que le promeneur disparaisse dans les eaux froides. La science y discerne la combustion spontanée du gaz des marais ; le grimoire d’Hylst y reconnaît les esprits farceurs qui égarent ceux qui courent après des promesses trop faciles.'
    ],
    occultRitual: 'Ne jamais courir après une étincelle fugace. Si vous vous perdez dans un lieu étranger, plantez votre bâton en terre et attendez le chant du coq sans bouger d’une semelle.',
    botanicalPreservation: 'Roseaux des marais séchés, mousse de tourbe et copeaux d’écorce de saule pleureur.',
    associatedTrackSlug: 'echoes_of_the_forgotten',
    associatedTrackTitle: 'Echoes of the Forgotten',
    imagePath: getAssetUrl('assets/grimoire/jack_lantern.jpg'),
    audioMood: 'tenebreux',
    divinationKeywords: ['Mirage', 'Prudence indispensable', 'Méfiance des paillettes', 'Recentrage'],
    divinationOracleReading: 'Toutes les lumières qui scintillent ne sont pas des havres de paix. Rejetez les propositions trop alléchantes qui vous éloignent de votre chemin d’origine.'
  },

  // =========================================================================
  // TOME III : MONSTRES & MALÉFICES NOCTURNES
  // =========================================================================
  {
    id: 'lycanthropie-gevaudan',
    tomeId: 'tome-malefices',
    chronicleNumber: 8,
    category: 'monstres',
    categoryLabel: 'Métamorphoses & Bêtes',
    title: 'Le Maléfice des Hommes-Loups du Gévaudan',
    subtitle: 'La métamorphose sous l’empire de la pleine lune écarlate',
    historicalPeriod: 'XVIIIe siècle (1764 - 1767)',
    geographicalOrigin: 'Monts de la Margeride & Gévaudan, France',
    latinMotto: 'Homo homini lupus in nocte lunae',
    latinTranslation: 'L’homme est un loup pour l’homme dans la nuit de lune',
    epigraph: 'La bête ne vit pas recluse au fond des bois : elle dort sous la peau de velours de ceux qui sourient le jour au milieu du village.',
    fullStory: [
      'Entre 1764 et 1767, la province du Gévaudan fut ensanglantée par une créature féroce qui défia les dragons du roi Louis XV et les meilleurs louvetiers du royaume. Mais bien avant cette traque historique, la tradition de la lycanthropie hantait les mémoires paysannes de toute l’Europe.',
      'Selon les traités démonologiques du XVIe siècle, nul besoin d’une morsure pour contracter le maléfice : une ceinture taillée dans la dépouille d’un loup abattu par un traître, un onguent de jusquiame frotté sur les tempes ou une gorgée d’eau croupie bue dans l’empreinte d’un grand carnassier suffisaient à dénouer les digues de l’humanité.',
      'Lorsque la lune rougeoyante monte au faîte des épicéas, la cage thoracique s’élargit dans une douleur lancinante, les canines s’allongent et l’esprit s’embrume d’une soif inextinguible de chasse. Au lever de l’aube, le malheureux se réveille prostré dans son lit, les ongles maculés de terre noire et de brindilles cassées, incapable d’expliquer la terreur qui fait aboyer les chiens à son passage.'
    ],
    occultRitual: 'Suspendre une tresse d’ail sauvage et un rameau de frêne au-dessus du lit lors des trois nuits entourant la pleine lune pour protéger son sommeil des pulsions destructrices.',
    botanicalPreservation: 'Wolfsbane (aconit tue-loup) séché avec précaution, baies de genièvre et fleurs de millepertuis.',
    associatedTrackSlug: 'l_eveil_des_lycanthropes',
    associatedTrackTitle: 'L’Éveil des Lycanthropes',
    imagePath: getAssetUrl('assets/grimoire/samhain_ritual.jpg'),
    audioMood: 'dramatique',
    divinationKeywords: ['Instinct sauvage', 'Force brute refoulée', 'Dualité de l’âme', 'Maîtrise des colères'],
    divinationOracleReading: 'Votre énergie brute demande à être canalisée plutôt que réprimée. Donnez une expression artistique ou physique à votre feu intérieur.'
  },
  {
    id: 'sabbat-brocken',
    tomeId: 'tome-malefices',
    chronicleNumber: 9,
    category: 'monstres',
    categoryLabel: 'Sorcellerie & Chaudrons',
    title: 'Le Sabbat Noir du Mont Brocken',
    subtitle: 'La nuit de Walpurgis, les covens d’octobre et les danses anti-horaires',
    historicalPeriod: 'Moyen Âge & Renaissance',
    geographicalOrigin: 'Massif du Harz, Allemagne & Mont Pilat, France',
    latinMotto: 'In gyrum imus nocte et consumimur igni',
    latinTranslation: 'Nous tournons en rond dans la nuit et nous sommes consumés par le feu',
    epigraph: 'La fumée de mandragore monte vers les étoiles mortes, inversant pour quelques heures les lois rigides du monde diurne.',
    fullStory: [
      'Au sommet du Brocken, le point culminant du massif du Harz perpétuellement couronné d’orages et de spectres lumineux, les légendes populaires situent le rassemblement suprême des sorcières et sorciers de la nuit de Walpurgis et des veillées de Samhain.',
      'À minuit pétant, les chaudrons de bronze s’allument sans bois visible. Les participantes y jettent les herbes vénéneuses cueillies sous le gibet : la racine tortueuse de mandragore qui pousse un cri mortel lors de son arrachage, l’aconit napel et la belladone noire dont les sucs provoquent des hallucinations de vol céleste.',
      'La danse circulaire tourne rigoureusement en sens inverse des aiguilles d’une montre (widdershins), dénouant le cours du temps et effaçant les conventions sociales. Les rires résonnent comme le croassement d’un millier de corneilles, et la terre piétinée reste stérile pendant sept années consécutives.'
    ],
    occultRitual: 'Tracer un cercle de sel gris et de farine d’orge autour de son espace de travail pour se prémunir des influences négatives et des ragots malveillants.',
    botanicalPreservation: 'Feuilles séchées de belladone (symbolique), fleurs de lavande noire et graines de pavot somnifère.',
    associatedTrackSlug: 'blood_moon_ritual',
    associatedTrackTitle: 'Blood Moon Ritual',
    imagePath: getAssetUrl('assets/grimoire/witches_sabbath.jpg'),
    audioMood: 'tenebreux',
    divinationKeywords: ['Affranchissement des règles', 'Pouvoir collectif', 'Magie féminine', 'Audace transgressive'],
    divinationOracleReading: 'Il est parfois nécessaire de briser les habitudes établies pour retrouver votre liberté d’action. Réinventez vos propres rituels quotidiens.'
  },
  {
    id: 'vampires-strigoi',
    tomeId: 'tome-malefices',
    chronicleNumber: 10,
    category: 'monstres',
    categoryLabel: 'Morts-Vivants Sépulcraux',
    title: 'La Légende de Vlad Țepeș & Les Strigoi',
    subtitle: 'La terre natale scellée, le sang séculaire et l’immortalité maudite',
    historicalPeriod: 'XVe siècle transylvanien',
    geographicalOrigin: 'Château de Poenari, Carpates & Valachie',
    latinMotto: 'Sanguis est vita, mors est aeterna umbra',
    latinTranslation: 'Le sang est la vie, la mort est une ombre éternelle',
    epigraph: 'Dormir dans la terre de ses ancêtres, fuir le soleil brûlant et ne refléter aucun visage dans l’argent : tel est le tribut de l’éternité.',
    fullStory: [
      'Bien avant que le roman de Bram Stoker ne popularise le comte Dracula, les villages des Carpates vivaient dans la crainte sourde des Strigoi, les âmes rebelles qui refusent de quitter leur dépouille après l’enterrement.',
      'Le prince Vlad III de Valachie, dit Țepeș (« l’Empaleur »), défendit farouchement ses principautés contre l’empire ottoman avec une cruauté légendaire qui marqua durablement les esprits de son époque. Ses ennemis dépeignaient un seigneur dînait au milieu des pals de ses victimes, trempant son pain noir dans leur sang fumant.',
      'Selon le folklore roumain, le Strigoi mort ne peut franchir le seuil des vivants sans leur invitation formelle. Il doit reposer chaque jour dans un coffre contenant une poignée de sa terre natale. Pour conjurer sa résurrection nocturne, les villageois ouvraient les tombes suspectes au quarante-neuvième jour pour enfoncer un pieu de frêne ou d’aubépine au centre de la poitrine et répandre des graines de pavot sur le linceul.'
    ],
    occultRitual: 'Ne jamais inviter chez soi une personne dont les intentions vous semblent troubles : le vampire moderne franchit le seuil dès qu’on lui en accorde la permission.',
    botanicalPreservation: 'Gousses d’ail noir fermenté, branches d’aubépine épineuse et fleurs d’églantier rouge.',
    associatedTrackSlug: 'the_vampire_masquerade',
    associatedTrackTitle: 'The Vampire Masquerade',
    imagePath: getAssetUrl('assets/grimoire/sleepy_hollow.jpg'),
    audioMood: 'dramatique',
    divinationKeywords: ['Énergie vitale', 'Frontières personnelles', 'Séduction sombre', 'Préservation de son sang'],
    divinationOracleReading: 'Prenez garde aux personnes énergivores qui drainent votre enthousiasme. Protégez votre temps précieux comme votre bien le plus cher.'
  },
  {
    id: 'gargouilles-notredame',
    tomeId: 'tome-malefices',
    chronicleNumber: 11,
    category: 'monstres',
    categoryLabel: 'Sentinelles de Pierre',
    title: 'Les Chimères & Gargouilles de Notre-Dame',
    subtitle: 'La pierre animée à minuit pour repousser les légions démoniaques',
    historicalPeriod: 'XIIe - XIXe siècle gothique',
    geographicalOrigin: 'Île de la Cité, Paris & Cathédrales gothiques de France',
    latinMotto: 'Custodes lapidei in altis silentio vigilant',
    latinTranslation: 'Les gardiens de pierre veillent en silence sur les hauteurs',
    epigraph: 'Leurs gueules béantes crachent les eaux de pluie le jour, mais la nuit venue, elles fixent la cité humaine avec la sagesse impassible des monstres bienveillants.',
    fullStory: [
      'Perchées sur les balustrades aériennes des cathédrales gothiques, les chimères et gargouilles sculptées par les maîtres tailleurs de pierre ne servaient pas uniquement à rejeter au loin les eaux d’orage pour préserver les fondations de calcaire.',
      'Dans la pensée médiévale inspirée de saint Bernard de Clairvaux, ces représentations grimaçantes de démons, de boucs ailés et de stryges volantes jouaient un rôle d’exorcisme architectural (« l’apotropaïsme »). En exhibant le mal sous sa forme la plus repoussante à l’extérieur du sanctuaire, les tailleurs empêchaient les véritables forces ténébreuses de franchir les portes consacrées.',
      'Une légende parisienne murmure qu’au solstice d’hiver et lors de la nuit de Samhain, lorsque les cloches sonnent les douze coups de minuit, la pierre s’assouplit. Les chimères déploient leurs ailes de grès pour voler au-dessus des toits d’ardoise de la capitale, chassant les cauchemars avant que les premiers rayons de l’aube ne les pétrifient à nouveau sur leurs socles vertigineux.'
    ],
    occultRitual: 'Placer une petite statuette de pierre sculptée sur une étagère haute face à la porte d’entrée pour veiller sur la sérénité du foyer.',
    botanicalPreservation: 'Mousse de calcaire ancien, feuilles de lierre grimpant et copeaux d’ardoise noire.',
    associatedTrackSlug: 'organ_of_the_damned',
    associatedTrackTitle: 'Organ of the Damned',
    imagePath: getAssetUrl('assets/grimoire/danse_macabre.jpg'),
    audioMood: 'sepulcral',
    divinationKeywords: ['Protection vigilante', 'Caractère inébranlable', 'Hauteur de vue', 'Résilience'],
    divinationOracleReading: 'Adoptez la posture de la gargouille : observez les tempêtes passagères depuis les hauteurs de votre sérénité sans vous laisser ébranler.'
  },

  // =========================================================================
  // TOME IV : CRÉATURES & REVENANTS D’OUTRE-TOMBE
  // =========================================================================
  {
    id: 'danse-macabre',
    tomeId: 'tome-revenants',
    chronicleNumber: 12,
    category: 'revenants',
    categoryLabel: 'Allégories Sépulcrales',
    title: 'La Danse Macabre des Squelettes de Minuit',
    subtitle: 'L’égalité absolue devant le trépas au rythme du violon d’ébène',
    historicalPeriod: 'XVe siècle (Cimetière des Innocents, 1424)',
    geographicalOrigin: 'Paris, Bâle & Lübeck',
    latinMotto: 'Mors omnia aequat, pulvis et umbra sumus',
    latinTranslation: 'La mort rend tout égal, nous ne sommes que poussière et ombre',
    epigraph: 'Papes, empereurs, laboureurs et ménestrels : tous se tiennent par la main quand l’archet du squelette attaque sa ritournelle endiablée.',
    fullStory: [
      'Née au lendemain des grandes pestes noires qui décimèrent l’Europe au XIVe siècle, la Danse Macabre fut peinte pour la première fois en 1424 sur les murs du cimetière des Saints-Innocents à Paris. Elle ne cherchait pas à susciter l’épouvante, mais à enseigner la vanité des grandeurs terrestres.',
      'Chaque tableau présentait un squelette rieur et bondissant invitant poliment un vivant à entrer dans la ronde. Le pape avec sa tiare dorée, le roi avec son sceptre fleurdelisé, le moine bedonnant et le jeune enfant innocent : nul ne pouvait décliner l’invitation du danseur sans chair.',
      'Dans les contes paysans du Berry et d’Auvergne, on raconte que chaque veille de Toussaint, le fossoyeur qui s’attarde près du charnier entend un violoncelle ou un violon accorder ses cordes sur une pierre tombale. Les dalles de granit glissent alors sans bruit, et les ossements blanchis entament une gigue frénétique sous la lune, riant de bon cœur de la prétention des vivants qui croient posséder le monde.'
    ],
    occultRitual: 'Écouter une pièce musicale de violon ou de violoncelle sépulcral les yeux fermés, en méditant sur la légèreté de l’existence et la libération des vanités.',
    botanicalPreservation: 'Fleurs d’immortelles jaunes séchées, branches d’if millénaire et poudre de marbre blanc.',
    associatedTrackSlug: 'danse_macabre_techno',
    associatedTrackTitle: 'Danse Macabre Techno',
    imagePath: getAssetUrl('assets/grimoire/danse_macabre.jpg'),
    audioMood: 'dramatique',
    divinationKeywords: ['Égalité', 'Lâcher-prise', 'Fête malgré les peines', 'Humour libérateur'],
    divinationOracleReading: 'Riez de vos tracas : la vie est trop courte pour s’encombrer de solennités inutiles. Rejoignez la danse du présent.'
  },
  {
    id: 'banshee-lamentation',
    tomeId: 'tome-revenants',
    chronicleNumber: 13,
    category: 'revenants',
    categoryLabel: 'Messagères Gaéliques',
    title: 'La Banshee et le Hurlement Funèbre',
    subtitle: 'La femme féerique du monticule, le peigne d’argent et le glas de l’âme',
    historicalPeriod: 'Traditions orales gaéliques immémoriales',
    geographicalOrigin: 'Lacs de Killarney & Collines d’Ulster, Irlande',
    latinMotto: 'Vox doloris mortem nobilem nuntiat',
    latinTranslation: 'La voix de la douleur annonce la mort d’un noble esprit',
    epigraph: 'Si vous entendez la plainte glacée de la femme aux cheveux blancs flotter sur la lande, ne cherchez pas sa silhouette : une âme va bientôt s’envoler.',
    fullStory: [
      'La Bean Sídhe (littéralement « femme du monticule féerique ») est l’une des créatures les plus vénérées et redoutées de l’imaginaire irlandais. Contrairement aux spectres malveillants, la Banshee n’est jamais la cause du trépas : elle en est la pleureuse solennelle et compatissante.',
      'Attachée depuis des générations aux cinq grandes familles gaéliques d’origine royale (les O’Neill, O’Brien, O’Connor, O’Grady et Kavanagh), elle apparaît au crépuscule près des étangs brumeux. Elle prend la forme d’une jeune femme d’une beauté diaphane ou d’une aïeule ridée coiffée d’une chevelure argentée qui cascade jusqu’au sol.',
      'Elle passe lentement un peigne d’argent dans ses mèches tout en poussant le « keening », une lamentation polyphonique déchirante qui traverse les murs les plus épais. Si un passant trouve le peigne d’argent tombé dans l’herbe, il ne doit sous aucun prétexte le ramasser : la Banshee viendrait frapper à sa fenêtre à minuit pour réclamer son bien.'
    ],
    occultRitual: 'Conserver un peigne en corne ou en bois d’ébène dans un étui de velours noir sans jamais le prêter à un inconnu.',
    botanicalPreservation: 'Feuilles de saule blanc, mousse des tourbières et fleurs d’asphodèle printanier.',
    associatedTrackSlug: 'echoes_of_the_forgotten',
    associatedTrackTitle: 'Echoes of the Forgotten',
    imagePath: getAssetUrl('assets/grimoire/banshee_mist.jpg'),
    audioMood: 'sepulcral',
    divinationKeywords: ['Élégie nécessaire', 'Respect du deuil', 'Annonce de transformation', 'Dignité'],
    divinationOracleReading: 'Une étape de votre existence touche à sa fin naturelle. Accueillez la mélancolie avec douceur : elle nettoie l’âme pour préparer l’avenir.'
  },
  {
    id: 'golem-prague',
    tomeId: 'tome-revenants',
    chronicleNumber: 14,
    category: 'revenants',
    categoryLabel: 'Argile & Kabbale',
    title: 'Le Golem d’Argile & Les Sceaux de Cendre',
    subtitle: 'La créature de la Vltava et le mot sacré EMETH gravé au front',
    historicalPeriod: 'Fin XVIe siècle (vers 1580)',
    geographicalOrigin: 'Josefov, Prague, Bohême',
    latinMotto: 'Ex luto creatus, verbo divino excitatus',
    latinTranslation: 'Créé de la boue, éveillé par le verbe divin',
    epigraph: 'La matière inanimée n’attend qu’un souffle de vérité pour se lever ; mais gare au mot de trop qui brise le sanctuaire.',
    fullStory: [
      'À la fin du XVIe siècle, sous le règne de l’empereur alchimiste Rodolphe II à Prague, le sage rabbin Judah Loew ben Bezalel cherchait un moyen de protéger la communauté du quartier juif contre les persécutions et les accusations infamantes.',
      'Accompagné de ses deux plus fidèles disciples représentant le feu et l’eau, le rabbin se rendit sur les berges boueuses de la rivière Vltava au cœur de la nuit. Avec de l’argile vierge pétrie avec ferveur, ils façonnèrent le corps colossal d’un être humain gigantesque.',
      'Après avoir accompli sept circumambulations en récitant les permutations sacrées du Sefer Yetzirah, le maître grava sur le front du colosse le mot hébreu אמת (EMETH, la Vérité). Le golem ouvrit des yeux de braise et se dressa, docile et invincible. Mais lorsque sa force devint incontrôlable, le rabbin dut effacer la première lettre pour ne laisser que מת (METH, la Mort) : le titan retomba en poussière dans les combles obscurs de la synagogue Vieille-Nouvelle.'
    ],
    occultRitual: 'Inscrire un objectif capital sur un parchemin vierge avec de l’encre noire, puis le plier trois fois et le déposer sous une pierre lourde pour ancrer sa détermination.',
    botanicalPreservation: 'Argile rouge de rivière séchée, graines de lin et résine d’oliban impérial.',
    associatedTrackSlug: 'alchemical_transmutation',
    associatedTrackTitle: 'Alchemical Transmutation',
    imagePath: getAssetUrl('assets/grimoire/samhain_ritual.jpg'),
    audioMood: 'dramatique',
    divinationKeywords: ['Protection colossale', 'Puissance de l’écriture', 'Discipline indispensable', 'Création concrète'],
    divinationOracleReading: 'Vos projets ont désormais la force d’un titan. Veillez toutefois à en garder la maîtrise éclairée pour ne point être dépassé par votre propre élan.'
  },

  // =========================================================================
  // TOME V : MYSTÈRES & ALCHIMIE D’HYLST
  // =========================================================================
  {
    id: 'archet-geoffroy-streit',
    tomeId: 'tome-hylst',
    chronicleNumber: 15,
    category: 'hylst',
    categoryLabel: 'L’Atelier d’Hylst',
    title: 'L’Archet Hanté de Geoffroy Streit (Hylst)',
    subtitle: 'La genèse de SpookyBeats : 19 incantations entre violoncelle et DAW de minuit',
    historicalPeriod: 'Époque contemporaine (2024 - 2026)',
    geographicalOrigin: 'Le Studio des Ombres, France',
    latinMotto: 'Ars et sonus umbras vivificant',
    latinTranslation: 'L’art et le son donnent vie aux ombres',
    epigraph: 'Créateur de l’application et des musiques : création assistée par IA, fruit d’un alliage patient de DAW, effets analogiques, montages audacieux et passion gothique.',
    fullStory: [
      'Dans les profondeurs feutrées de son studio d’expérimentation sonore, Geoffroy Streit - connu sous le pseudonyme d’Hylst - ne s’est pas contenté de concevoir une application : il a bâti une véritable cathédrale électronique pour les fantômes mélomanes.',
      'Artiste éclectique, développeur inventif et compositeur passionné, Hylst tisse un dialogue inédit entre les technologies numériques avancées et les traditions musicales les plus ténébreuses. Chaque morceau des 19 compositions de SpookyBeats a fait l’objet d’un travail d’orfèvre : sélection de timbres spectraux, nappes de violoncelles sépulcraux frottés à la résine noire, basses analogiques 808 grondantes et montages chirurgicaux en station audio numérique (DAW).',
      'Le résultat est une odyssée immersive où l’auditeur n’est plus un simple spectateur, mais un néophyte invité à desceller les arcanes de la crypte. De « The Umbral Descent » à « Danse Macabre Techno », la musique d’Hylst prouve que la modernité technologique peut servir d’écrin aux plus beaux mythes de l’humanité.'
    ],
    occultRitual: 'Brancher son casque audio dans une pièce sombre, fermer les yeux et écouter un morceau d’Hylst d’une seule traite sans toucher à son écran.',
    botanicalPreservation: 'Café noir serré, copeaux de bois de lutherie et étincelles d’inspiration nocturne.',
    associatedTrackSlug: 'danse_macabre_techno',
    associatedTrackTitle: 'Danse Macabre Techno',
    imagePath: getAssetUrl('assets/grimoire/danse_macabre.jpg'),
    audioMood: 'mystique',
    divinationKeywords: ['Créativité authentique', 'Alliage moderne & ancien', 'Passion d’artiste', 'Dépassement'],
    divinationOracleReading: 'Soyez l’artisan de votre propre légende. N’ayez pas peur de combiner vos passions éclectiques pour bâtir une œuvre singulière qui vous ressemble.'
  },
  {
    id: 'sabbat-citrouilles-or',
    tomeId: 'tome-hylst',
    chronicleNumber: 16,
    category: 'hylst',
    categoryLabel: 'Légendes de la Crypte',
    title: 'Le Grand Sabbat des Citrouilles d’Or',
    subtitle: 'La nuit où les courges s’illuminent de vert pour défier les lois de la pesanteur',
    historicalPeriod: 'Légendaire SpookyBeats',
    geographicalOrigin: 'Le Potager de la Crypte d’Hylst',
    latinMotto: 'Cucurbita aurea in tenebris saltat',
    latinTranslation: 'La citrouille d’or bondit dans les ténèbres',
    epigraph: 'Ricanements d’automne, yeux de braise et rebonds malicieux : quand le glas sonne treize heures, les citrouilles ne se mangent plus, elles mènent la danse.',
    fullStory: [
      'Dans les catacombes oubliées sous le manoir victorien de SpookyBeats pousse une variété tout à fait exceptionnelle de cucurbitacées que les jardiniers de la nuit nomment les Citrouilles d’Or d’Hylst. Nourries par les vibrations des basses fréquences et l’eau filtrée par les cryptes millénaires, leurs écorces luisent d’un éclat mordoré.',
      'Une fois par siècle, lors d’un alignement rare entre la lune sanglante et l’étoile polaire, ces citrouilles s’arrachent de leurs tiges rampantes. Elles s’assemblent sur les dalles de marbre de l’autel pour un sabbat burlesque et virevoltant, échangeant des énigmes avec les chauves-souris en maraude et les araignées tisseuses.',
      'C’est de cette légende que naquit le fameux défi de l’Écrabouilleur de Citrouilles : le joueur qui parvient à percer leurs grimaces et à esquiver les crânes maudits reçoit la bénédiction du Roi Citrouille et empoche des milliers de points de mana spectral.'
    ],
    occultRitual: 'Taper un rythme à trois temps sur une table en bois avant de lancer une partie d’arcade pour éveiller la faveur des citrouilles dorées.',
    botanicalPreservation: 'Graines de citrouille torréfiées au miel noir, feuilles de vigne vierge et zestes d’orange confite.',
    associatedTrackSlug: 'gare_aux_sorcieres',
    associatedTrackTitle: 'Gare aux Sorcières',
    imagePath: getAssetUrl('assets/grimoire/jack_lantern.jpg'),
    audioMood: 'mystique',
    divinationKeywords: ['Joie communicative', 'Humour complice', 'Fortune inattendue', 'Légèreté d’esprit'],
    divinationOracleReading: 'La vie n’est pas qu’une affaire solennelle : autorisez-vous des éclats de rire joyeux face aux absurdités du destin.'
  }
];

/**
 * Filtre les légendes selon les critères
 */
export function filterLegends(
  legends: LegendItem[],
  options: {
    tomeId?: LegendTomeId | 'all';
    category?: LegendCategory | 'all';
    searchQuery?: string;
    bookmarkedOnly?: boolean;
    bookmarkedIds?: string[];
  }
): LegendItem[] {
  const {
    tomeId = 'all',
    category = 'all',
    searchQuery = '',
    bookmarkedOnly = false,
    bookmarkedIds = [],
  } = options;

  const normalizedQuery = searchQuery.trim().toLowerCase();

  return legends.filter((item) => {
    // Filtre par tome
    if (tomeId !== 'all' && item.tomeId !== tomeId) {
      return false;
    }

    // Filtre par catégorie
    if (category !== 'all' && item.category !== category) {
      return false;
    }

    // Filtre favoris
    if (bookmarkedOnly && !bookmarkedIds.includes(item.id)) {
      return false;
    }

    // Recherche textuelle
    if (normalizedQuery) {
      const matchTitle = item.title.toLowerCase().includes(normalizedQuery);
      const matchSubtitle = item.subtitle.toLowerCase().includes(normalizedQuery);
      const matchOrigin = item.geographicalOrigin.toLowerCase().includes(normalizedQuery);
      const matchLatin = item.latinMotto.toLowerCase().includes(normalizedQuery);
      const matchStory = item.fullStory.some((p) => p.toLowerCase().includes(normalizedQuery));
      const matchKeywords = item.divinationKeywords.some((k) => k.toLowerCase().includes(normalizedQuery));

      if (!matchTitle && !matchSubtitle && !matchOrigin && !matchLatin && !matchStory && !matchKeywords) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Recherche une légende par son ID
 */
export function getLegendById(id: string): LegendItem | undefined {
  return ALL_LEGENDS.find((l) => l.id === id);
}

/**
 * Tire au sort une légende pour la consultation oraculaire du Grimoire
 */
export function getRandomOracleLegend(seedRandom?: () => number): {
  legend: LegendItem;
  oracleText: string;
} {
  const rng = seedRandom || Math.random;
  const index = Math.floor(rng() * ALL_LEGENDS.length);
  const legend = ALL_LEGENDS[index];
  return {
    legend,
    oracleText: legend.divinationOracleReading,
  };
}

/**
 * Calcule la progression de lecture du Grimoire
 */
export function calculateGrimoireReadingProgress(readIds: string[]): {
  total: number;
  readCount: number;
  percentage: number;
  tier: string;
} {
  const total = ALL_LEGENDS.length;
  const validReads = readIds.filter((id) => ALL_LEGENDS.some((l) => l.id === id));
  const readCount = validReads.length;
  const percentage = Math.round((readCount / total) * 100);

  let tier = 'Apprenti des Veillées';
  if (percentage >= 100) {
    tier = 'Grand Archiviste d’Hylst';
  } else if (percentage >= 75) {
    tier = 'Érudit des Brumes Célestes';
  } else if (percentage >= 50) {
    tier = 'Chroniqueur des Sépulcres';
  } else if (percentage >= 25) {
    tier = 'Lecteur de Samhain';
  }

  return {
    total,
    readCount,
    percentage,
    tier,
  };
}
