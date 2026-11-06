# 🏗️ Structure - SpookyBeats

> Documentation de l'architecture complète du projet.
> Auteur : Geoffroy Streit (Hylst) - 2026-11-06

---

## Arborescence du projet

```
spookybeats/
├── index.html                    # Point d'entrée HTML, SEO complet
├── package.json                  # Dépendances npm (nom: spookybeats)
├── vite.config.ts                # Config Vite + proxy dev /hml/ /mp3/
├── tsconfig.json                 # Config TypeScript strict
├── .gitignore                    # Exclusions git
├── .env.example                  # Exemple de variables d'environnement
├── README.md                     # Documentation principale
├── todo.md                       # Tâches à faire
├── structure.md                  # Ce fichier - architecture
├── features.md                   # Inventaire des fonctionnalités
├── agents.md                     # Suggestions pour agents IA futurs
├── CHANGELOG.md                  # Historique des versions
│
├── public/                       # Assets statiques (copiés tels quels)
│   ├── favicon.png               # À créer - 32×32px
│   ├── icon.png                  # À créer - 128×128px
│   ├── og-image.png              # À créer - 1200×630px
│   ├── robots.txt                # À créer
│   └── assets/
│       ├── bestiary/             # Images créatures du bestiaire
│       ├── games/                # Images mini-jeux
│       ├── grimoire/             # Images grimoire des légendes
│       └── tarot/                # Images cartes de tarot
│
└── src/
    ├── main.tsx                  # Point d'entrée React
    ├── App.tsx                   # Composant racine - routing + état global
    ├── index.css                 # Tailwind + thème gothique custom
    │
    ├── components/               # Composants UI React
    │   ├── Header.tsx            # En-tête sticky : logo, contrôles audio, navigation
    │   ├── Navigation.tsx        # Barre nav inférieure fixe (11 screens)
    │   ├── BackgroundFog.tsx     # Canvas brume spectrale animée
    │   ├── GothicCreaturesOverlay.tsx  # Araignées, chauves-souris, sorcière interactive
    │   ├── GothicDecorations.tsx # Composants SVG réutilisables : toiles, ferronnerie, citrouilles
    │   │
    │   ├── CryptHome.tsx         # Screen 1 : Accueil / Crypte
    │   ├── PhantomPlayer.tsx     # Screen 2 : Lecteur audio + visualiseur FFT
    │   ├── SoundVault.tsx        # Screen 3 : Bibliothèque 19 pistes + DJ
    │   ├── HalloweenBeatPad.tsx  # Screen 4 : Beat Pad 16 pads + séquenceur
    │   ├── MiniGamesHub.tsx      # Screen 5 : Hub de 6 mini-jeux
    │   ├── HauntedManor3D.tsx    # Screen 6 : Manoir 3D Three.js
    │   ├── BestiaireOmbre.tsx    # Screen 7 : Bestiaire de créatures
    │   ├── EnigmesCrypte.tsx     # Screen 8 : Énigmes + Tarot
    │   ├── GrimoireLegendes.tsx  # Screen 9 : Grimoire des légendes
    │   ├── SanctuaireHylst.tsx   # Screen 10 : Orgue + Soundboard Hylst
    │   ├── InfoSection.tsx       # Screen 11 : Guide + accessibilité + architecture
    │   │
    │   ├── ConcertVisualizerModal.tsx  # Modal plein écran : mode concert
    │   ├── AudioConfigModal.tsx        # Modal config des URLs MP3 custom
    │   ├── TarotDestinModal.tsx        # Modal tirage de tarot
    │   ├── PumpkinSmasher.tsx          # Jeu : Massacre de citrouilles
    │   ├── RhythmGameRequiem.tsx       # Jeu : Requiem rythmique
    │   └── WitchCauldronGame.tsx       # Jeu : Chaudron de la sorcière
    │
    ├── audio/                    # Moteur audio complet
    │   ├── audioEngine.ts        # Moteur principal : Web Audio API, FFT, EQ, 8D
    │   ├── sfx.ts                # Synthèse SFX procédurale + lecteur MP3 SFX
    │   ├── trackLore.ts          # Textes lore des 19 pistes
    │   ├── spectralNarrator.ts   # Narrateur vocal via Web Speech API
    │   ├── vaultLogic.ts         # Logique du caveau sonore (tri, filtres)
    │   ├── sfx.test.ts           # Tests unitaires SFX
    │   ├── spectralNarrator.test.ts
    │   └── vaultLogic.test.ts
    │
    ├── game/                     # Logique pure des jeux (sans UI)
    │   ├── beatPadLogic.ts       # Beat Pad : séquenceur, pads, presets
    │   ├── bestiaryLogic.ts      # Bestiaire : créatures, duels, comparateur
    │   ├── cauldronLogic.ts      # Chaudron : potions, ingrédients
    │   ├── creaturesLogic.ts     # Créatures overlay : mouvements, interactions
    │   ├── enigmasLogic.ts       # Énigmes : questions, validation, scoring
    │   ├── labyrinthLogic.ts     # Labyrinthe : génération procédurale, pathfinding
    │   ├── legendsLogic.ts       # Grimoire : chroniques, données
    │   ├── manorQuestLogic.ts    # Manoir 3D : reliques, météo, quêtes
    │   ├── miniGamesLogic.ts     # Logique commune mini-jeux
    │   ├── pumpkinGameLogic.ts   # Massacre de citrouilles
    │   ├── tarotLogic.ts         # Tarot du Destin : cartes, tirages
    │   └── *.test.ts             # Tests unitaires correspondants
    │
    └── assets/                   # Assets importés par Vite
        └── images/               # Images haute résolution (1-2 Mo/image)
            ├── creature_*.jpg    # Portraits de créatures (11)
            ├── game_*.jpg        # Images mini-jeux (4)
            ├── grimoire_*.jpg    # Illustrations grimoire (6)
            ├── tarot_*.jpg       # Cartes de tarot (6)
            ├── hylst_organ_sanctuary_*.jpg
            ├── manor_haunted_night_skybox_*.jpg
            ├── crypt_manor_hero_banner_*.jpg
            └── gothic_vinyl_sarcophagus_*.jpg
```

---

## Flux de navigation (ScreenId)

```
crypte → lecteur → caveau → studio → massacre → manoir
       ↘ bestiaire → enigmes → legendes → sanctuaire → info
```

Toutes les transitions se font via `navigateWithFade()` dans `App.tsx` avec fondu spectral 400ms.

---

## Routing

Pas de router externe (React Router). Navigation par état React (`useState<ScreenId>`).
- Avantage : zéro dépendance, build statique simple
- Inconvénient : pas d'URL deeplink pour les sections (à améliorer via `URL hash`)

---

## État Global (App.tsx)

| State | Type | Description |
|-------|------|-------------|
| `currentScreen` | `ScreenId` | Section active |
| `isTransitioning` | `boolean` | Opacité fondu |
| `isPlaying` | `boolean` | Lecture audio active |
| `isMuted` | `boolean` | Son global coupé |
| `horrorLevel` | `1\|2\|3` | Niveau d'effroi visuel |
| `tracks` | `TrackMetadata[]` | 19 pistes (ou custom) |
| `currentTrack` | `TrackMetadata` | Piste en cours |
| `highScore` | `number` | Meilleur score jeux |
| `isConfigOpen` | `boolean` | Modal config MP3 |
| `isConcertOpen` | `boolean` | Modal mode concert |

---

## Persistance localStorage

| Clé | Contenu |
|-----|---------|
| `spookybeats_high_score` | Meilleur score mini-jeux |
| `spookybeats_custom_tracks` | URLs personnalisées des 19 pistes |
| `spookybeats_fog_level` | Densité brume (`faible/normal/dense`) |
| `spookybeats_high_contrast` | Contraste renforcé (`true/false`) |
| `spookybeats_reduced_motion` | Réduction mouvements (`true/false`) |
