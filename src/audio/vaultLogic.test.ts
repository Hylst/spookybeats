import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  filterAndSortTracks,
  parseDurationSeconds,
  toggleTrackFavorite,
  VaultFilterOptions,
} from './vaultLogic';
import { DEFAULT_TRACKS } from './audioEngine';

describe('Vault Logic - Filter, Sort and Favorites', () => {
  it('parses duration string correctly to seconds', () => {
    assert.equal(parseDurationSeconds('03:45'), 225);
    assert.equal(parseDurationSeconds('00:30'), 30);
    assert.equal(parseDurationSeconds(''), 0);
  });

  it('filters tracks by search term', () => {
    const options: VaultFilterOptions = {
      searchTerm: 'Umbral',
      horrorLevel: 'all',
      onlyFavorites: false,
      favoritesList: [],
      sortMode: 'default',
    };
    const results = filterAndSortTracks(DEFAULT_TRACKS, options);
    assert.ok(results.length >= 1);
    assert.equal(results[0].slug, 'the_umbral_descent');
  });

  it('filters tracks by horror level and favorites', () => {
    const favs = ['the_umbral_descent', 'haunted_manor'];
    const options: VaultFilterOptions = {
      searchTerm: '',
      horrorLevel: 'all',
      onlyFavorites: true,
      favoritesList: favs,
      sortMode: 'default',
    };
    const results = filterAndSortTracks(DEFAULT_TRACKS, options);
    assert.equal(results.length, 2);
    assert.ok(results.some((t) => t.slug === 'the_umbral_descent'));
    assert.ok(results.some((t) => t.slug === 'haunted_manor'));
  });

  it('sorts tracks by BPM ascending and descending', () => {
    const asc = filterAndSortTracks(DEFAULT_TRACKS, {
      searchTerm: '',
      horrorLevel: 'all',
      onlyFavorites: false,
      favoritesList: [],
      sortMode: 'bpm-asc',
    });
    for (let i = 0; i < asc.length - 1; i++) {
      assert.ok(asc[i].bpm <= asc[i + 1].bpm);
    }

    const desc = filterAndSortTracks(DEFAULT_TRACKS, {
      searchTerm: '',
      horrorLevel: 'all',
      onlyFavorites: false,
      favoritesList: [],
      sortMode: 'bpm-desc',
    });
    for (let i = 0; i < desc.length - 1; i++) {
      assert.ok(desc[i].bpm >= desc[i + 1].bpm);
    }
  });

  it('toggles track favorite state idempotently', () => {
    let favs: string[] = [];
    favs = toggleTrackFavorite(favs, 'the_umbral_descent');
    assert.deepEqual(favs, ['the_umbral_descent']);
    favs = toggleTrackFavorite(favs, 'the_umbral_descent');
    assert.deepEqual(favs, []);
  });
});
