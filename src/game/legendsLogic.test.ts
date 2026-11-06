import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ALL_LEGENDS,
  LEGEND_TOMES,
  filterLegends,
  getLegendById,
  getRandomOracleLegend,
  calculateGrimoireReadingProgress,
} from './legendsLogic';

test('Legends Logic - Collection integrity and 16 legends across 5 tomes', () => {
  assert.equal(ALL_LEGENDS.length, 16, 'Le Grimoire doit comporter 16 légendes complètes');
  assert.equal(LEGEND_TOMES.length, 5, 'Le Grimoire doit comporter 5 tomes distincts');

  const tomeCounts: Record<string, number> = {};
  for (const legend of ALL_LEGENDS) {
    assert.ok(legend.id, 'Chaque légende doit avoir un id');
    assert.ok(legend.title, 'Chaque légende doit avoir un titre');
    assert.ok(legend.subtitle, 'Chaque légende doit avoir un sous-titre');
    assert.ok(legend.geographicalOrigin, 'Chaque légende doit avoir une origine géographique');
    assert.ok(legend.latinMotto, 'Chaque légende doit avoir une devise latine');
    assert.ok(legend.latinTranslation, 'Chaque légende doit avoir une traduction latine');
    assert.ok(legend.epigraph, 'Chaque légende doit avoir une épigraphe');
    assert.ok(legend.fullStory.length >= 3, 'Chaque légende doit comporter au moins 3 paragraphes complets');
    assert.ok(legend.occultRitual, 'Chaque légende doit proposer un rituel occulte');
    assert.ok(legend.botanicalPreservation, 'Chaque légende doit comporter un conseil botanique');
    assert.ok(legend.associatedTrackSlug, 'Chaque légende doit être associée à un morceau');
    assert.ok(legend.divinationOracleReading, 'Chaque légende doit avoir une prophétie divinatoire');

    tomeCounts[legend.tomeId] = (tomeCounts[legend.tomeId] || 0) + 1;
  }

  assert.equal(tomeCounts['tome-celtique'], 3);
  assert.equal(tomeCounts['tome-damnes'], 4);
  assert.equal(tomeCounts['tome-malefices'], 4);
  assert.equal(tomeCounts['tome-revenants'], 3);
  assert.equal(tomeCounts['tome-hylst'], 2);
});

test('Legends Logic - getLegendById lookup', () => {
  const samhain = getLegendById('samhain');
  assert.ok(samhain);
  assert.equal(samhain?.tomeId, 'tome-celtique');
  assert.equal(samhain?.chronicleNumber, 1);

  const jack = getLegendById('jack-lanterne');
  assert.ok(jack);
  assert.equal(jack?.tomeId, 'tome-damnes');

  const nonExistent = getLegendById('fantome-inconnu');
  assert.equal(nonExistent, undefined);
});

test('Legends Logic - filterLegends by tome, category and search query', () => {
  const celtiqueLegends = filterLegends(ALL_LEGENDS, { tomeId: 'tome-celtique' });
  assert.equal(celtiqueLegends.length, 3);

  const maleficesLegends = filterLegends(ALL_LEGENDS, { tomeId: 'tome-malefices' });
  assert.equal(maleficesLegends.length, 4);

  // Recherche par texte
  const searchJack = filterLegends(ALL_LEGENDS, { searchQuery: 'forgeron' });
  assert.ok(searchJack.some((l) => l.id === 'jack-lanterne'));

  const searchPrague = filterLegends(ALL_LEGENDS, { searchQuery: 'Prague' });
  assert.ok(searchPrague.some((l) => l.id === 'golem-prague'));

  // Filtre favoris
  const bookmarked = filterLegends(ALL_LEGENDS, {
    bookmarkedOnly: true,
    bookmarkedIds: ['samhain', 'jack-lanterne'],
  });
  assert.equal(bookmarked.length, 2);
});

test('Legends Logic - getRandomOracleLegend returns valid prophecy', () => {
  const oracle = getRandomOracleLegend(() => 0);
  assert.ok(oracle.legend);
  assert.equal(oracle.legend.id, ALL_LEGENDS[0].id);
  assert.ok(oracle.oracleText.length > 10);
});

test('Legends Logic - calculateGrimoireReadingProgress levels', () => {
  const emptyProg = calculateGrimoireReadingProgress([]);
  assert.equal(emptyProg.percentage, 0);
  assert.equal(emptyProg.tier, 'Apprenti des Veillées');

  const partialProg = calculateGrimoireReadingProgress(['samhain', 'jack-lanterne', 'cavalier-sleepy-hollow', 'dame-blanche']);
  assert.equal(partialProg.readCount, 4);
  assert.equal(partialProg.percentage, 25);
  assert.equal(partialProg.tier, 'Lecteur de Samhain');

  const allIds = ALL_LEGENDS.map((l) => l.id);
  const fullProg = calculateGrimoireReadingProgress(allIds);
  assert.equal(fullProg.percentage, 100);
  assert.equal(fullProg.tier, 'Grand Archiviste d’Hylst');
});
