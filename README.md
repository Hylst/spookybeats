# SpookyBeats 🎃🕷️

**Expérience Sonore Gothique & Halloween - par Geoffroy Streit (Hylst)**

> *« Je suis concepteur / développeur d'applications, mais également artiste éclectique, bancal et passionné. »*

---

## Présentation

SpookyBeats est une application web Halloween 100% frontend - plateforme musicale immersive et gothique créée par Geoffroy Streit (alias **Hylst**).

**19 compositions originales** mêlant synthèse soustractive, violoncelles spectraux, orgue baroque, montage et masterisation sur DAW. L'IA est intervenue comme outil d'inspiration, non comme compositeur.

## Fonctionnalités

| Section | Description |
|---------|-------------|
| 🏚️ **La Crypte** | Accueil, vue panoramique, rituel d'entrée |
| 👻 **Lecteur Fantôme** | Platine gothique, égaliseur 3 bandes, visualiseur FFT, paroles |
| 🎵 **Caveau Sonore** | Bibliothèque 19 pistes, tri BPM, crossfade DJ |
| 🥁 **Beat Pad Studio** | 16 pads de percussion + séquenceur 8 pas + presets gothiques |
| 🎮 **Jeux de la Crypte** | 6 mini-jeux : Massacre de citrouilles, Requiem, Simon Autel, Sarcophages, Chaudron, Labyrinthe |
| 🏰 **Manoir Hanté 3D** | Exploration Three.js/WebGL, météo spectrale, vision nocturne, 7 Reliques |
| 🐺 **Bestiaire de l'Ombre** | 20 créatures avec duels, comparateur, cris MP3 |
| 🔮 **Énigmes de la Crypte** | 18 énigmes, Tarot du Destin, devinettes runiques |
| 📖 **Grimoire des Légendes** | 16 chroniques celtiques, herboristerie, Oracle de Samhain |
| 🎹 **Sanctuaire Hylst** | Orgue baroque virtuel, soundboard 22 SFX MP3 originaux |
| ℹ️ **Guide de l'Érudit** | Manuel, raccourcis clavier, accessibilité, architecture |

## Stack Technique

- **React 19** + **TypeScript 7** + **Tailwind CSS 4**
- **Vite 8** (build statique)
- **Web Audio API** - moteur audio complet : FFT, égaliseur biquad, réverbération, 8D spatial
- **Three.js** - rendu 3D WebGL procédural
- **SFX procéduraux** - tous les effets sonores UI générés en code pur (zéro fichier)
- **70+ tests unitaires** via runner natif Node.js

## Audio

Les 19 pistes MP3 et 22 SFX sont hébergés sur **https://hylst.fr** :
- `/hml/*.mp3` - Compositions principales
- `/mp3/sfx/*.mp3` - Effets sonores originaux

Le proxy Vite (`/hml/` → `https://hylst.fr/hml/`) est actif en développement pour contourner le CORS de l'analyseur de spectre. En production statique, le fallback URL directe prend le relais automatiquement.

## Installation & Développement

```bash
# Installation
npm install

# Développement local (port 3000)
npm run dev

# Build de production statique
npm run build

# Prévisualisation du build
npm run preview

# Tests unitaires
npm test

# Vérification TypeScript
npm run lint
```

## Déploiement (Coolify / Nginx statique)

L'application est conçue pour être hébergée comme build statique dans un conteneur Nginx.

```
games.hylst.fr/spookybeats/   ← dossier dist/ déployé ici
```

**Configuration Nginx recommandée :**
```nginx
location /spookybeats/ {
    alias /var/www/spookybeats/;
    try_files $uri $uri/ /spookybeats/index.html;
}
```

> ⚠️ Adapter `base` dans `vite.config.ts` selon le chemin de déploiement.

## Auteur

**Geoffroy Streit** - alias **Hylst**
- Site officiel : [hylst.fr](https://hylst.fr)
- Catalogue musical, créations artistiques et projets de développement.

## Licence

Code source : MIT
Compositions musicales et SFX : © Geoffroy Streit (Hylst) - tous droits réservés
