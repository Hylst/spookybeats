/**
 * Logique pure du Caveau Sonore : tri, filtrage, gestion des favoris et mode DJ crossfade.
 */
import { TrackMetadata } from './audioEngine';

export type VaultSortMode = 'default' | 'bpm-asc' | 'bpm-desc' | 'duration-asc' | 'duration-desc' | 'horror-desc';

export interface VaultFilterOptions {
  searchTerm: string;
  horrorLevel: number | 'all';
  onlyFavorites: boolean;
  favoritesList: string[]; // slugs
  sortMode: VaultSortMode;
}

/**
 * Filtre et trie les pistes audio selon les critères
 */
export function filterAndSortTracks(
  tracks: TrackMetadata[],
  options: VaultFilterOptions
): TrackMetadata[] {
  const { searchTerm, horrorLevel, onlyFavorites, favoritesList, sortMode } = options;
  const term = searchTerm.trim().toLowerCase();

  const filtered = tracks.filter((track) => {
    // Recherche textuelle
    const matchesSearch =
      !term ||
      track.title.toLowerCase().includes(term) ||
      track.slug.toLowerCase().includes(term) ||
      track.artist.toLowerCase().includes(term) ||
      (track.album && track.album.toLowerCase().includes(term)) ||
      track.genre.toLowerCase().includes(term) ||
      (track.loreText && track.loreText.toLowerCase().includes(term));

    if (!matchesSearch) return false;

    // Filtre d'effroi (potions)
    if (horrorLevel !== 'all' && track.horrorLevel !== horrorLevel) {
      return false;
    }

    // Filtre favoris
    if (onlyFavorites && !favoritesList.includes(track.slug)) {
      return false;
    }

    return true;
  });

  // Tri
  return [...filtered].sort((a, b) => {
    switch (sortMode) {
      case 'bpm-asc':
        return (a.bpm || 120) - (b.bpm || 120);
      case 'bpm-desc':
        return (b.bpm || 120) - (a.bpm || 120);
      case 'duration-asc':
        return parseDurationSeconds(a.duration) - parseDurationSeconds(b.duration);
      case 'duration-desc':
        return parseDurationSeconds(b.duration) - parseDurationSeconds(a.duration);
      case 'horror-desc':
        return b.horrorLevel - a.horrorLevel;
      case 'default':
      default:
        return a.slug.localeCompare(b.slug);
    }
  });
}

/**
 * Convertit "03:45" en secondes (225)
 */
export function parseDurationSeconds(duration: number | string): number {
  if (typeof duration === 'number') return duration;
  if (!duration) return 0;
  const parts = duration.split(':').map((p) => parseInt(p, 10));
  if (parts.length === 2) {
    return (parts[0] || 0) * 60 + (parts[1] || 0);
  }
  return 0;
}

/**
 * Bascule l'état favori d'une piste
 */
export function toggleTrackFavorite(favorites: string[], slug: string): string[] {
  if (favorites.includes(slug)) {
    return favorites.filter((s) => s !== slug);
  }
  return [...favorites, slug];
}
