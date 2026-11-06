/**
 * Helper de résolution des chemins d'accès aux assets statiques hébergés dans public/
 * Prend en compte automatiquement le chemin de base Vite (ex: /spookybeats/ ou /)
 * Compatible environnement navigateur Vite (import.meta.env.BASE_URL) et Node.js tests.
 */
export function getAssetUrl(path: string): string {
  // En environnement navigateur Vite, import.meta.env.BASE_URL est injecté (/spookybeats/ ou /)
  // En environnement Node.js test runner, import.meta.env est indéfini
  let base = '/';
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env && typeof import.meta.env.BASE_URL === 'string') {
      base = import.meta.env.BASE_URL;
    }
  } catch {
    base = '/';
  }

  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${normalizedBase}${cleanPath}`;
}
