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

- [ ] Ajouter `prefers-reduced-motion` CSS query respectant le toggle de `InfoSection.tsx`
- [ ] Ajouter gestion du focus visible (outline) pour navigation au clavier (accessibilité WCAG)
- [ ] Lazy loading des composants lourds (HauntedManor3D, BestiaireOmbre) via `React.lazy()`
- [ ] Scroll-to-top automatique après navigation déjà présent - tester sur mobile réel
- [ ] Bouton "Retour en haut" pour les longs écrans (Grimoire, Bestiaire)
- [ ] Transition de navigation : augmenter le `maxWidth` en mode `max-w-4xl` pour le studio

---

## 🟢 FONCTIONNALITÉS - À envisager

- [ ] Mode hors-ligne PWA : Service Worker pour cache des pistes récemment jouées
- [ ] Partage de piste : génération d'URL avec piste sélectionnée (`?track=the_umbral_descent`)
- [ ] Favoris de pistes persistants en localStorage
- [ ] Chronomètre de session / temps d'écoute cumulé
- [ ] Export d'une création Beat Pad en MIDI ou WAV (via Web Audio + MediaRecorder)
- [ ] Thème lumineux "Citrouille" (optionnel, pour accessibilité daltonisme)
- [ ] Partage réseaux sociaux depuis le Lecteur Fantôme

---

## ⚙️ INFRA / DEPLOY

- [ ] Configurer Nginx pour SPA (try_files → index.html)
- [ ] Coolify : vérifier les headers CORS pour les assets audio (si nécessaire)
- [ ] Optionnel : CDN pour les images JPG lourdes (> 1 Mo chacune)
- [ ] Ajouter un `robots.txt` dans `public/`
- [ ] Ajouter un `sitemap.xml` dans `public/` (une seule page → simple)

---

## 🧹 NETTOYAGE REPO

- [ ] Supprimer `.aistudio/` du repo
- [ ] Supprimer les screenshots `screen*.png` à la racine (ou déplacer dans `docs/screenshots/`)
- [ ] Supprimer `home_decor.png` à la racine
- [ ] Nettoyer `bun.lock` si npm est utilisé (ou conserver selon l'outil choisi)
