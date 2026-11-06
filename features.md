# ✨ Features - SpookyBeats

> Inventaire complet des fonctionnalités existantes et suggestions d'améliorations.
> Auteur : Geoffroy Streit (Hylst) - 2026-11-06

---

## Fonctionnalités Existantes (v1.0)

### 🎵 Audio & Musique

| Fonctionnalité | Statut | Détails |
|----------------|--------|---------|
| Lecteur MP3 avec 19 pistes | ✅ | Web Audio API + HTMLAudioElement |
| Analyseur de spectre FFT temps réel | ✅ | 128 bins, smoothing 0.82 |
| Égaliseur paramétrique 3 bandes | ✅ | Low 120Hz / Mid 1.2kHz / High 6kHz |
| Réverbération de crypte (delay) | ✅ | Niveau configurable 0-1 |
| Mode Audio 8D spatial | ✅ | StereoPanner animé en sinus |
| Mode Cathédrale reverb | ✅ | Toggle |
| Crossfade entre pistes (500ms) | ✅ | Fondu sortant + entrant |
| Mute global (musique + SFX) | ✅ | Raccourci touche M / m |
| Contrôle de volume | ✅ | 0.85 par défaut + persistance localStorage |
| Lecture aléatoire (Shuffle) & Répétition (Loop) | ✅ | Connecté au moteur audio avec persistance |
| MediaSession API (contrôle OS / mobile) | ✅ | Titre, artiste Hylst, pochette, touches médias |
| Raccourcis clavier globaux | ✅ | Espace (Play/Pause), M (Mute), Alt+Flèches (Pistes) |
| Défilement retour haut de crypte | ✅ | Bouton flottant après 400px de scroll |
| File de lecture (playlist) | ❌ | À ajouter |
| Favoris de pistes | ❌ | À ajouter |

### 🥁 Beat Pad Studio

| Fonctionnalité | Statut |
|----------------|--------|
| 16 pads de percussion interactifs | ✅ |
| Séquenceur 8 pas | ✅ |
| 5 presets rythmiques gothiques | ✅ |
| Rack d'effets DSP | ✅ |
| Export WAV / MIDI | ❌ |
| BPM configurable | À vérifier |

### 🏰 Manoir Hanté 3D

| Fonctionnalité | Statut |
|----------------|--------|
| Rendu WebGL procédural Three.js | ✅ |
| Éclairage dynamique + ombres | ✅ |
| Brume exponentielle | ✅ |
| Vision nocturne | ✅ |
| Chasse aux 7 Reliques fantômes | ✅ |
| Raycasting interactif | ✅ |
| Météo spectrale dynamique | ✅ |
| Navigation FPS (ZQSD + souris) | ✅ |

### 🎮 Mini-Jeux

| Jeu | Statut |
|-----|--------|
| Massacre de citrouilles | ✅ |
| Requiem Rythmique (rhythm game) | ✅ |
| Simon de l'Autel | ✅ |
| Sarcophages (memory) | ✅ |
| Chaudron d'Awen | ✅ |
| Labyrinthe spectral | ✅ |
| High score global | ✅ |

### 👁️ Bestiaire de l'Ombre

| Fonctionnalité | Statut |
|----------------|--------|
| 20 créatures avec taxonomie latine | ✅ |
| Duels sépulcraux entre créatures | ✅ |
| Comparateur de créatures | ✅ |
| Bibliothèque de cris MP3 | ✅ |
| Portraits haute résolution | ✅ |

### 🔮 Énigmes & Tarot

| Fonctionnalité | Statut |
|----------------|--------|
| 18 énigmes en 5 tomes | ✅ |
| Devinettes runiques | ✅ |
| Anagrammes | ✅ |
| Tirage du Destin (Tarot funeste) | ✅ |
| Score & progression | ✅ |

### 📖 Grimoire des Légendes

| Fonctionnalité | Statut |
|----------------|--------|
| 16 chroniques celtiques & victoriennes | ✅ |
| Lettrines enluminées | ✅ |
| Recettes d'herboristerie | ✅ |
| Oracle de Samhain | ✅ |

### 🎹 Sanctuaire Hylst

| Fonctionnalité | Statut |
|----------------|--------|
| Orgue baroque virtuel 8 notes (C3-C4) | ✅ |
| 3 registres : Cathédrale / Bourdon / Spectral | ✅ |
| Polyphonie synthèse Web Audio | ✅ |
| Soundboard 22 SFX MP3 originaux Hylst | ✅ |
| Filtrage par catégorie (Spectres, Malédictions, Créatures, Manoir) | ✅ |
| 6 SFX procéduraux synthétisés en temps réel | ✅ |
| Arrêt d'urgence SFX actif | ✅ |

### 🕷️ Effets Visuels & Ambiance

| Fonctionnalité | Statut |
|----------------|--------|
| Brume spectrale Canvas animée | ✅ |
| Araignées tisseuses interactives | ✅ |
| Chauves-souris volantes | ✅ |
| Citrouilles bondissantes | ✅ |
| Sorcière interactive | ✅ |
| Toiles d'araignées décoratives (coins) | ✅ |
| Gouttes de sang stylisées | ✅ |
| Ferronnerie victorienne SVG | ✅ |
| Niveau d'effroi visuel (3 niveaux) | ✅ |
| Filtre d'ambiance CSS (contraste, ombres colorées) | ✅ |

### ♿ Accessibilité

| Fonctionnalité | Statut |
|----------------|--------|
| Densité de brume configurable | ✅ |
| Contraste renforcé (WCAG) | ✅ |
| Réduction des animations | ✅ |
| Aria-labels sur les boutons | Partiel |
| Navigation clavier complète | Partiel |
| Focus visible | ❌ Absent |
| Support `prefers-reduced-motion` CSS | ❌ Non appliqué |

---

## Suggestions d'Améliorations (v1.1 et +)

### 🔧 Corrections Prioritaires

1. **Référence `/src/assets/`** dans SanctuaireHylst → Importer via Vite
2. **condition >= 19** dans App.tsx pour custom tracks → Assouplir
3. **Accessibilité focus** → Ajouter `focus-visible:ring` Tailwind
4. **prefers-reduced-motion** → Lire le media query CSS et lier au toggle de l'InfoSection

### 🎵 Audio (v1.1)

- **Lecture aléatoire** et **répétition de piste** (boutons dans PhantomPlayer)
- **Queue/playlist** : réordonner les pistes par glisser-déposer
- **Favoris** : marquer des pistes avec ♥, filtrer dans le Caveau
- **Timer de sommeil** : arrêt automatique après X minutes
- **Partage de piste** : URL `?track=slug` pour accéder directement à une piste
- **Export Beat Pad** : MediaRecorder API → téléchargement WAV

### 🏰 Manoir 3D (v1.1)

- **Minimap** : carte SVG simple du manoir visible en transparence
- **Mode fantôme** : noclip pour explorer les murs
- **Objets interactifs** : cliquer sur meubles pour des événements textuels
- **Ambiance sonore procédurale** : vent, grincements selon la position du joueur

### 🎮 Jeux (v1.1)

- **Mode défi timed** : variantes minutées pour chaque jeu
- **Classement local** : top 5 scores par jeu en localStorage
- **Difficulté progressive** : niveaux Apprenti / Nécromancien / Archilliche
- **Nouveaux jeux** : Pendu Gothique, Memory Créatures, Mots-croisés Grimoire

### 🌐 Web / SEO (v1.1)

- **PWA** : Service Worker + manifest.json pour installation
- **Cache intelligent** : mise en cache des MP3 les plus joués
- **Deeplinks** : URL hash `#lecteur`, `#manoir` pour navigation directe
- **sitemap.xml** et **robots.txt**
- **JSON-LD** : données structurées pour les moteurs de recherche (MusicAlbum, WebApplication)

### 🎨 UI / Design (v1.1)

- **Thème "Citrouille Lumineuse"** : variante orange/jaune pour daltoniens
- **Mode portrait mobile optimisé** : réduction des marges sur petits écrans
- **Lazy loading** des composants lourds (HauntedManor3D, BestiaireOmbre)
- **Transitions** entre screens : variantes (slide, zoom, dissolve)
- **Bouton retour en haut** pour les sections longues

### 🌍 Internationalisation (v1.2)

- **Version anglaise** : traduction du label navigateur + mots-clés SEO EN
- **Sous-titres** pour le Grimoire (accessibilité)
