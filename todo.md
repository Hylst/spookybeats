# 📋 TODO - SpookyBeats

> Suivi des tâches prioritaires pour la production et l'amélioration continue.
> Auteur : Geoffroy Streit (Hylst) - Mise à jour : 2026-11-06

---

## 🔴 CRITIQUE - À faire avant déploiement Coolify

- [x] Supprimer dépendances AI Studio : `@google/genai`, `express`, `dotenv`, `@types/express`
- [x] Renommer `name` dans `package.json` : `"react-example"` → `"spookybeats"`
- [x] Nettoyer `vite.config.ts` des commentaires AI Studio
- [x] Réécrire `README.md` (sans référence Google/AI Studio)
- [x] Réécrire `.env.example` (sans GEMINI_API_KEY)
- [x] Améliorer `.gitignore` (ajouter `.aistudio/`, `bun.lock`, screenshots)
- [x] SEO complet dans `index.html` (og:image, twitter:image, author, canonical, keywords)
- [x] **Créer `favicon.png` 32×32** et `icon.png` 128×128 → créés et intégrés
- [x] **Créer `og-image.png` 1200×630** pour les partages réseaux sociaux → généré et intégré
- [x] **Vérifier `base` dans `vite.config.ts`** configuré sur `/spookybeats/`
- [x] `npm install` pour régénérer `package-lock.json` sans les dépendances supprimées
- [x] `npm run build` → validé en 527ms avec build statique complet dans `dist/`
- [x] `npm test` → 76/76 tests unitaires passés avec succès
- [x] `npm run lint` → 0 erreur TypeScript

---

## 🟠 IMPORTANT - Corrections de code

- [x] **Image `/src/assets/images/hylst_organ_sanctuary_...jpg`** référencée directement dans `SanctuaireHylst.tsx` → Corrigé avec import ESM Vite bundlé
- [x] **Extraction des données SFX** dans `src/audio/hylstSfxData.ts` pour découpler tests et UI
- [x] **`App.tsx` L60** : condition `parsed.length >= 19` trop stricte → assoupli à `>= 1`
- [x] **`InfoSection.tsx` L42** : `as any` sur valeur localStorage → typé rigoureusement
- [x] **`SanctuaireHylst.tsx` L434** : `as any` sur `organStop` → remplacé par cast typé
- [x] Supprimer dossier `.aistudio/` et `public/assets/aistudio/`
- [x] Nettoyer `metadata.json` (suppression de `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API`)
- [x] Ajout de `robots.txt` et `sitemap.xml` dans `public/`

---

## 🟡 AMÉLIORATIONS - UX & Design

- [x] **Lazy loading des composants lourds** (HauntedManor3D, BestiaireOmbre, etc.) via `React.lazy()` et `CryptLoader` (-70.4% taille bundle initial)
- [x] **Conversion WebP** de tous les assets images locaux (-84% de poids, ~24 Mo économisés)
- [x] **Deep-linking via hash URL** (`#lecteur`, `#studio`, `#manoir`, etc.) et synchronisation historique navigateur
- [x] **Lecteur audio perfectionné** : mode aléatoire (Shuffle), répétition (Loop/Repeat) reliés au moteur audio et persistance localStorage (volume, dernière piste, modes)
- [x] **Auto-scroll de l'onglet actif** en navigation mobile/tablette
- [x] **Raccourcis clavier globaux** (Espace = Play/Pause, M = Mute, Alt+Flèches = Piste suivante/précédente)
- [x] **Bouton "Retour en haut de crypte"** (`ScrollTopButton`) pour les longs écrans (Grimoire, Bestiaire, Énigmes)
- [x] **Support MediaSession API** (`navigator.mediaSession`) pour les notifications et l'écran de verrouillage
- [ ] Ajouter `prefers-reduced-motion` CSS query respectant le toggle de `InfoSection.tsx`
- [ ] Ajouter gestion du focus visible (outline) pour navigation au clavier (accessibilité WCAG)

---

## 🟢 FONCTIONNALITÉS - À envisager

- [ ] Mode hors-ligne PWA complet avec Service Worker pour cache audio
- [ ] Partage de piste : génération d'URL avec piste sélectionnée (`?track=the_umbral_descent`)
- [ ] Favoris de pistes persistants en localStorage
- [ ] Chronomètre de session / temps d'écoute cumulé
- [ ] Export d'une création Beat Pad en MIDI ou WAV (via Web Audio + MediaRecorder)
- [ ] Thème lumineux "Citrouille" (optionnel, pour accessibilité daltonisme)
- [ ] Partage réseaux sociaux depuis le Lecteur Fantôme

---

## ⚙️ INFRA / DEPLOY

- [x] Ajouter un `robots.txt` dans `public/`
- [x] Ajouter un `sitemap.xml` dans `public/`
- [x] Ajouter `manifest.json` PWA et formats d'icônes `icon.webp`, `og-image.webp`
- [ ] Configurer Nginx pour SPA (try_files → index.html)
- [ ] Coolify : vérifier les headers CORS pour les assets audio (si nécessaire)

---

## 🧹 NETTOYAGE REPO

- [x] Supprimer `.aistudio/` et traces AI Studio du repo
- [x] Conservation intégrale des images racines et sources (règle stricte utilisateur)
- [ ] Nettoyer `bun.lock` si npm est définitivement l'unique gestionnaire retenu
