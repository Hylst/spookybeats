# Changelog - SpookyBeats

Toutes les modifications notables de ce projet sont documentées ici.
Format : [Semantic Versioning](https://semver.org/lang/fr/)

---

## [1.2.0] - 2026-11-06

### 🎮 Intégration Système, MediaSession & Ergonomie UX

#### Système & Contrôle Audio
- **Support complet de l'API MediaSession (`navigator.mediaSession`)** :
  - Métadonnées complètes transmises au système d'exploitation et à l'écran de verrouillage (titre, artiste avec mention Hylst, album "SpookyBeats", illustration haute résolution).
  - Contrôles multimédias globaux actifs (Play/Pause, Précédent, Suivant, Chercher dans la piste).
  - Gestion robuste des erreurs réseau audio : bascule propre de l'état de lecture lors de coupures ou de timeouts.

#### Ergonomie UX & Accessibilité
- **Auto-scroll de l'onglet actif** : dans la barre de navigation mobile/tablette, l'onglet sélectionné défile désormais automatiquement au centre de la vue (`scrollIntoView({ inline: 'center' })`).
- **Raccourcis clavier globaux** :
  - `Espace` : Bascule Lecture / Pause (avec garde pour les champs de saisie et formulaires).
  - `M` / `m` : Coupure / Activation du son (musique + effets sonores).
  - `Alt + Flèche Droite` : Piste audio suivante.
  - `Alt + Flèche Gauche` : Piste audio précédente.
- **Bouton flottant "Retour en haut de crypte" (`ScrollTopButton`)** :
  - Apparition animée dès 400px de défilement vertical.
  - Design gothique en crâne lumineux vert ectoplasme avec lueur citrouille au survol.
  - Défilement fluide vers le haut (`behavior: 'smooth'`).

#### Typage & Robustesse
- **Élimination complète des types `any` résiduels** dans l'ensemble du dossier `src/` (0 `any`). Typage strict de toutes les fonctions de rappel, événements et métadonnées.
- **Sécurisation des fallbacks d'images** : remplacement des URLs distantes par des fallbacks locaux garantis via `getAssetUrl('assets/gothic_vinyl_sarcophagus.webp')`.

#### Conformité PWA & Monorepo Hylst.Games
- **Fichier `manifest.json` PWA** : configuration standalone, orientation portrait-primary, thème `#0B0B0B`, déclaration des icônes 128×128 et 512×512.
- **Assets monorepo** : génération de `icon.webp` (128×128) et `og-image.webp` (1024×576) conformes au standard Hylst.Games.
- **Conservation intégrale des sources** : respect strict de la préservation de toutes les images originales du projet.

---

## [1.1.0] - 2026-11-06

### 🚀 Optimisations Performance & Confort de Lecture

#### Performance & Bundle Splitting
- **Code-splitting React.lazy()** pour tous les écrans interactifs secondaires (`HauntedManor3D`, `BestiaireOmbre`, `HalloweenBeatPad`, `MiniGamesHub`, `GrimoireLegendes`, `SanctuaireHylst`, `EnigmesCrypte`).
- **Composant `CryptLoader.tsx`** : écran de chargement gothique avec crâne animé, étincelles et barres d'invocation spectrales pour les transitions lazy.
- **Réduction drastique du bundle initial** : `index.js` passe de **1 389 kB à 410 kB (-70.4%)**, Three.js étant désormais isolé dans le chunk du manoir 3D.
- **Conversion WebP de 31 images JPEG** : compression via ffmpeg (`scale=1024`, qualité 80), économisant ~24 Mo (-84% en moyenne) et suppression des originaux `.jpg`.

#### Navigation & Deep-Linking
- **Support complet du hash URL** (`#crypte`, `#lecteur`, `#caveau`, `#studio`, `#massacre`, `#manoir`, `#bestiaire`, `#enigmes`, `#legendes`, `#sanctuaire`, `#info`).
- **Synchronisation avec l'historique navigateur** (`pushState` / écouteur `hashchange`) permettant le retour arrière / avance avec les boutons du navigateur sans rechargement de page.

#### Lecteur Audio & Confort
- **Mode aléatoire (Shuffle)** : sélection aléatoire intelligente lors du clic suivant/précédent, activable/désactivable avec retour haptique et sonore.
- **Mode répétition (Loop/Repeat)** : bascule entre boucle continue de la piste courante et auto-enchaînement à la fin du morceau.
- **Persistance localStorage** : sauvegarde et restauration automatique du volume sonore, de la dernière piste écoutée, et de l'état des modes Shuffle et Loop.
- **77/77 tests unitaires** passés au vert (ajout du test de non-régression pour Shuffle, Loop et Volume).

---

## [1.0.0] - 2026-11-06

### 🎉 Première version stable - Nettoyage & Production-ready

#### Corrections (héritages template AI Studio supprimés)
- **Retiré** dépendance `@google/genai` (aucun usage dans le code)
- **Retiré** dépendance `express` (backend inutile pour build statique)
- **Retiré** dépendance `dotenv` (inutile en Vite statique)
- **Retiré** dépendance `@types/express`
- **Renommé** `package.json` : `name` = `"react-example"` → `"spookybeats"`
- **Nettoyé** `vite.config.ts` : suppression commentaires "AI Studio / DISABLE_HMR"
- **Ajouté** `base: '/spookybeats/'` dans `vite.config.ts` pour déploiement Coolify/Nginx sous-chemin
- **Ajouté** config `build` dans `vite.config.ts` (outDir, assetsDir, sourcemap false)
- **Réécrit** `README.md` complet (sans référence Google/AI Studio)
- **Réécrit** `.env.example` (sans GEMINI_API_KEY, sans AI Studio)
- **Réécrit** `.gitignore` (ajout : `.aistudio/`, `bun.lock`, screenshots racine, dossiers IDE)

#### SEO & HTML
- **Amélioré** `index.html` : SEO complet
  - Titre enrichi avec mention Hylst
  - Description longue détaillée (19 compositions, beat pad, manoir 3D...)
  - Ajout `<meta name="author">`, `<meta name="keywords">`, `<meta name="robots">`
  - Ajout `<meta name="theme-color">`
  - Ajout `<link rel="canonical">`
  - Ajout `og:image`, `og:url`, `og:image:width/height`, `og:image:alt`, `og:locale`, `og:site_name`
  - Ajout `twitter:image`, `twitter:image:alt`, `twitter:creator`, `twitter:site`
  - Ajout `<link rel="icon">` et `<link rel="apple-touch-icon">`
  - Création de `favicon.png` (32x32), `icon.png` (128x128), et `og-image.png` (1200x630)
  - Ajout de `robots.txt` et `sitemap.xml` dans `public/`

#### Tests & Qualité
- **Découplé** `HYLST_MP3_SFX` de `SanctuaireHylst.tsx` vers `src/audio/hylstSfxData.ts` pour éviter le chargement de `.jpg` par Node.js test runner
- **76/76 tests unitaires** passés au vert avec succès
- **Build statique Vite** validé et testé sans warning

#### Documentation
- **Créé** `todo.md` - liste de tâches prioritaires
- **Créé** `structure.md` - architecture complète du projet
- **Créé** `features.md` - inventaire fonctionnalités + suggestions d'améliorations
- **Créé** `agents.md` - guide pour agents IA futurs
- **Créé** `CHANGELOG.md` - ce fichier

---

## [0.9.0] - 2026-11-01 (Initial AI Studio Build)

### Version initiale générée depuis AI Studio

- Application React 19 + TypeScript + Tailwind CSS 4 + Vite 8
- 11 sections : Crypte, Lecteur, Caveau, Studio, Jeux, Manoir 3D, Bestiaire, Énigmes, Grimoire, Sanctuaire, Info
- 19 pistes MP3 de Hylst (hébergées sur `hylst.fr/hml/`)
- Moteur audio Web Audio API complet : FFT, EQ 3 bandes, réverbération, 8D spatial
- SFX procéduraux synthétisés en JavaScript (porte crypte, rire démoniaque, fantôme...)
- Soundboard 22 SFX MP3 originaux Hylst (`hylst.fr/mp3/sfx/`)
- Manoir hanté 3D Three.js : raycasting, météo, 7 Reliques
- Beat Pad 16 pads + séquenceur 8 pas + presets gothiques
- 6 mini-jeux : Massacre de citrouilles, Requiem, Simon, Sarcophages, Chaudron, Labyrinthe
- 20 créatures bestiaire avec taxonomie et duels
- 18 énigmes + Tarot du Destin
- 16 chroniques grimoire
- Orgue baroque virtuel 8 notes (C3-C4) avec 3 registres
- Faune gothique interactive : araignées, chauves-souris, sorcière, citrouilles
- 70+ tests unitaires automatisés (logique game découplée)
- Accessibilité partielle : brume configurable, contraste renforcé, réduction mouvements
