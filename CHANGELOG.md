# Changelog - SpookyBeats

Toutes les modifications notables de ce projet sont documentées ici.
Format : [Semantic Versioning](https://semver.org/lang/fr/)

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
