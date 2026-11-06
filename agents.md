# 🤖 Agents — SpookyBeats

> Suggestions de tâches automatisables par agents IA futurs.
> Auteur : Geoffroy Streit (Hylst) — 2026-11-06

---

## Agents Utiles pour ce Projet

### 1. 🎨 Agent Génération d'Images

**Rôle** : Créer les assets visuels manquants
**Outils** : Agnes Image 2.1 Flash / FLUX.1-dev / Playwright screenshot

Tâches :
- Générer `og-image.png` 1200×630 (thème : manoir gothic, citrouille, spectre)
- Générer `favicon.png` 32×32 (citrouille sculptée en pixel art sombre)
- Générer `icon.png` 128×128 (citrouille avec reflets orangés sur fond noir)
- Générer de nouvelles illustrations pour le Grimoire (tome 2)
- Générer des portraits de créatures supplémentaires (20 → 30)

**Prompt og-image suggéré** :
```
Gothic Halloween music platform, dark atmospheric, haunted manor silhouette,
spectral foggy graveyard, pumpkin glowing orange, vinyl record floating,
purple and orange neon glow, cinematic, 1200x630, no text
```

---

### 2. 🧪 Agent QA / Tests

**Rôle** : Vérification qualité du build et de l'expérience utilisateur
**Outils** : Playwright (Chromium installé)

Tâches :
- Lancer `npm run build` et vérifier zéro erreur
- Lancer `npx vite preview --port 4173` et prendre des screenshots de chaque section
- Vérifier qu'aucune console.error n'est émise sur chaque screen
- Vérifier que le lecteur audio démarre bien après clic (autoplay policy)
- Tester la navigation clavier (Tab, Espace, Flèches)
- Tester le responsive mobile (375px, 390px, 430px)
- Vérifier les balises meta dans le HTML du build final

**Script Playwright de base** :
```javascript
// tests/qa-spookybeats.spec.ts
import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:4173/spookybeats/';
const SCREENS = ['crypte', 'lecteur', 'caveau', 'studio', 'massacre', 
                 'manoir', 'bestiaire', 'enigmes', 'legendes', 'sanctuaire', 'info'];

test('Pas d\'erreurs console sur chaque section', async ({ page }) => {
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  
  await page.goto(BASE);
  for (const screen of SCREENS) {
    // naviguer via la barre nav
  }
  expect(errors).toHaveLength(0);
});
```

---

### 3. 📦 Agent Build & Deploy

**Rôle** : Automatiser le workflow de build et copie dans le monorepo
**Outils** : PowerShell, git, npm

Workflow :
```powershell
# 1. Build
cd D:\0CODE\games.hylst.fr\spookybeats
npm run build

# 2. Copier dans le monorepo
$dest = "D:\0CODE\games.hylst.fr\spookybeats-deploy"
Copy-Item -Path "dist\*" -Destination $dest -Recurse -Force

# 3. Vérifier les assets
Get-ChildItem $dest -Recurse | Select-Object Name, Length

# 4. Commit dans le monorepo
cd D:\0CODE\games.hylst.fr
git add spookybeats/
git commit -m "deploy: SpookyBeats vX.Y.Z"
git push
```

---

### 4. 🔍 Agent Audit SEO

**Rôle** : Analyser et optimiser le SEO avant chaque déploiement
**Outils** : Playwright, fetch API

Vérifications :
- `<title>` présent et < 60 chars
- `<meta description>` présent et < 160 chars
- `og:image` pointant vers une image existante 1200×630
- `<link rel="canonical">` présent
- Balises `lang` sur `<html>`
- Performance Lighthouse (Core Web Vitals)
- Accessibilité WCAG AA (axe-core)

---

### 5. 🎵 Agent Audio Vérification

**Rôle** : Vérifier que les 19 MP3 et 22 SFX sont accessibles sur hylst.fr
**Outils** : fetch/curl

```powershell
# Vérifier les 19 pistes
$tracks = @(
  "the_umbral_descent", "haunted_cello_chamber", "l_eveil_des_lycanthropes",
  "shadows_of_dread", "haunted_manor", "blood_moon_ritual", "gare_aux_sorcieres",
  "2_villagers_died_this_night", "ancient_dragon_s_lament", "awakening_of_the_titan",
  "darkness_claims_its_throne", "echoes_of_the_forgotten", "esoteric_procession",
  "la_marche_des_corps_silencieux", "la_marche_des_possedes", "la_peste_noire",
  "le_cantique_des_profondeurs", "through_haunted_halls", "treacherous_echoes"
)

foreach ($track in $tracks) {
  $url = "https://hylst.fr/hml/$track.mp3"
  $resp = Invoke-WebRequest -Uri $url -Method Head -ErrorAction SilentlyContinue
  Write-Host "$track : $($resp.StatusCode)"
}
```

---

## Notes pour les Agents

- **Ne jamais** push de fichiers `.aistudio/`, `.gemini/`, `CLAUDE.md`, `AGENTS.md`
- **Ne jamais** inclure de clés API dans les commits
- **Toujours** vérifier `npm run lint` avant tout commit
- **Toujours** vérifier `npm run build` avant tout déploiement
- Le fichier `vite.config.ts` a `base: '/spookybeats/'` — adapter si le chemin de déploiement change
