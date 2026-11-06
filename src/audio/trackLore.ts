/**
 * Textes littéraires d'ambiance pour les 19 musiques de SpookyBeats
 * Rédigés avec soin : style humain, littéraire et évocateur
 * Règles strictes : aucun tiret cadratin ou demi-cadratin, aucune émoticône
 */

export const TRACK_LORE: Record<string, string> = {
  the_umbral_descent:
    "Les marches de pierre calcaire s'enfoncent dans un abîme sans fond où la clarté du jour n'a jamais pénétré. Chaque foulée résonne comme un adieu aux vivants, tandis que le froid de la terre enveloppe lentement les âmes égarées.",

  haunted_cello_chamber:
    "Dans la pénombre de la chambre haute, l'archet invisible glisse sur des cordes oubliées. Une plainte déchirante s'élève entre les tentures fanées, souvenir lancinant d'un amour brisé par la mort.",

  l_eveil_des_lycanthropes:
    "L'argent pâle de la lune fend la brume des sous-bois et réveille l'appel du sang. Les bêtes antiques émergent des taillis obscurs, le regard embrasé par une faim millénaire.",

  shadows_of_dread:
    "À l'orée du sommeil, des silhouettes décharnées rampent le long des boiseries. Leur souffle glacial effleure la nuque, figeant le sang de celui qui ose regarder la nuit en face.",

  haunted_manor:
    "Les portes massives grincent sous l'action d'hôtes sans visage. Des pas feutrés parcourent les galeries désertes où les portraits d'ancêtres disparus semblent retenir leur respiration.",

  blood_moon_ritual:
    "L'astre nocturne se teinte d'un carmin menaçant au-dessus du cercle de monolithes. Les incantations murmurées à voix basse éveillent les forces endormies sous l'humus millénaire.",

  gare_aux_sorcieres:
    "Un rire strident fuse à travers la canopée dépouillée des chênes centenaires. Dans l'air flotte une odeur d'herbes amères et de cire noire, présage certain du sabbat imminent.",

  '2_villagers_died_this_night':
    "Au petit matin, le glas résonne tristement sur la place déserte du hameau. Les volets restent clos, car chacun sait que le mal rôde encore sous une forme familière.",

  ancient_dragon_s_lament:
    "Caché dans les profondeurs de sa caverne de basalte, le dernier grand reptile pleure son ciel perdu. Ses râles ardents embrasent les ténèbres d'une mélancolie grandiose et dévastatrice.",

  awakening_of_the_titan:
    "La montagne frémit et le sol tremble sous une impulsion souterraine colossale. Après des siècles de sommeil léthargique, la force tellurique brise ses chaînes de granit.",

  darkness_claims_its_throne:
    "Le crépuscule dévore les ultimes lueurs du couchant pour asseoir sa souveraineté absolue. Sous son manteau d'ébène, toutes les espérances se fondent dans un silence impérial.",

  echoes_of_the_forgotten:
    "Des voix étouffées remontent des catacombes effondrées, murmurant des noms que nul souvenir ne retient. Elles errent entre les voûtes, cherchant une oreille compatissante.",

  esoteric_procession:
    "Des silhouettes encapuchonnées avancent à la lueur blafarde de cierges de suif. Leurs chants lancinants percent le brouillard d'une ferveur interdite et mystique.",

  la_marche_des_corps_silencieux:
    "Sans un mot, sans un souffle, une cohorte blême s'étire le long du chemin boueux. Leurs yeux éteints ne regardent rien, guidés seulement par un ordre venu d'outre-tombe.",

  la_marche_des_possedes:
    "Leurs membres convulsent sous l'emprise d'une volonté étrangère et implacable. Prisonniers de leur propre chair, ils avancent vers l'abîme au rythme d'une cadence frénétique.",

  la_peste_noire:
    "Un corbeau solitaire survole les toits marqués d'une croix blanche. Le souffle putride de l'épidémie fauche les cités, laissant pour seul chant le grincement des charrettes funèbres.",

  le_cantique_des_profondeurs:
    "Venu des abysses océaniques où ne parvient aucun rayon, un hymne spectral monte vers la surface. Les marins qui l'entendent perdent à jamais le désir de revoir la terre ferme.",

  through_haunted_halls:
    "Le courant d'air souffle la flamme de la bougie au détour d'un corridor infini. Dans l'obscurité subite, le battement précipité du cœur devient le seul repère.",

  treacherous_echoes:
    "La voix qui appelle dans le labyrinthe semble familière, mais chaque pas dans sa direction resserre le piège. Les parois de pierre déforment la vérité pour mieux égarer les téméraires.",
};

export function getTrackLore(slug: string): string {
  return (
    TRACK_LORE[slug] ||
    "Une brume épaisse enveloppe ces notes sépulcrales, murmurant les secrets oubliés des catacombes."
  );
}
