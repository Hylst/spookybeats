import test from 'node:test';
import assert from 'node:assert';
import {
  ENRICHED_BESTIARY_CREATURES,
  filterCreaturesByCategory,
  filterCreaturesByDanger,
  searchCreatures,
  sortCreatures,
  getBestiaryStatsSummary,
  OCCULT_WEAPONS,
  simulateOccultDuel,
  compareCreatures,
} from './bestiaryLogic.ts';

test('Enriched bestiary contains 20 unique dark creatures with full occult lore', () => {
  assert.strictEqual(ENRICHED_BESTIARY_CREATURES.length, 20, 'Should contain exactly 20 detailed creatures');

  const ids = new Set<string>();
  ENRICHED_BESTIARY_CREATURES.forEach((c) => {
    assert.ok(!ids.has(c.id), `Duplicate creature ID found: ${c.id}`);
    ids.add(c.id);

    assert.ok(c.name.length > 3, `${c.id} has a valid title`);
    assert.ok(c.latinName.length > 3, `${c.id} has latin nomenclature`);
    assert.ok(c.dangerLevel >= 1 && c.dangerLevel <= 5, `${c.id} danger level between 1 and 5`);
    assert.ok(c.lore.length > 50, `${c.id} lore is deep and literary`);
    assert.ok(c.weakness.length > 10, `${c.id} has an occult weakness`);
    assert.ok(c.strength.length > 10, `${c.id} has a supernatural strength`);
    assert.ok(c.relicReward.length > 5, `${c.id} has a talisman/relic reward`);
    assert.ok(c.sfxFilename.endsWith('.mp3'), `${c.id} sfx must end in .mp3`);
    assert.ok(c.linkedSlug.length > 0, `${c.id} links to a real Hylst track`);

    // Verify stats
    assert.ok(c.stats.ferocity >= 1 && c.stats.ferocity <= 100);
    assert.ok(c.stats.resilience >= 1 && c.stats.resilience <= 100);
    assert.ok(c.stats.arcane >= 1 && c.stats.arcane <= 100);
    assert.ok(c.stats.stealth >= 1 && c.stats.stealth <= 100);
    assert.ok(c.stats.dread >= 1 && c.stats.dread <= 100);
  });
});

test('filterCreaturesByCategory filters accurately across all 5 occult families', () => {
  const all = filterCreaturesByCategory(ENRICHED_BESTIARY_CREATURES, 'all');
  assert.strictEqual(all.length, 20);

  const undead = filterCreaturesByCategory(ENRICHED_BESTIARY_CREATURES, 'undead');
  assert.strictEqual(undead.length, 5, '5 undead creatures (goule, vampire, cavalier, squelette, anubis)');
  assert.ok(undead.every((c) => c.category === 'undead'));

  const beasts = filterCreaturesByCategory(ENRICHED_BESTIARY_CREATURES, 'beasts');
  assert.strictEqual(beasts.length, 4, '4 beasts (lycanthrope, arachne, corbeau, wendigo)');
  assert.ok(beasts.every((c) => c.category === 'beasts'));

  const spectres = filterCreaturesByCategory(ENRICHED_BESTIARY_CREATURES, 'spectres');
  assert.strictEqual(spectres.length, 4, '4 spectres (spectre, gargouille, banshee, poltergeist)');
  assert.ok(spectres.every((c) => c.category === 'spectres'));

  const demons = filterCreaturesByCategory(ENRICHED_BESTIARY_CREATURES, 'demons');
  assert.strictEqual(demons.length, 3, '3 demons (sorciere, demon, chupacabra)');
  assert.ok(demons.every((c) => c.category === 'demons'));

  const abyssal = filterCreaturesByCategory(ENRICHED_BESTIARY_CREATURES, 'abyssal');
  assert.strictEqual(abyssal.length, 4, '4 abyssal entities (titan, epouvantail, cerbere, leviathan)');
  assert.ok(abyssal.every((c) => c.category === 'abyssal'));
});

test('filterCreaturesByDanger filters minimum danger thresholds', () => {
  const maxDanger = filterCreaturesByDanger(ENRICHED_BESTIARY_CREATURES, 5);
  assert.ok(maxDanger.length >= 6, 'Multiple creatures with danger level 5 (vampire, titan, demon, cavalier, cerbere, wendigo, leviathan)');
  assert.ok(maxDanger.every((c) => c.dangerLevel === 5));
});

test('searchCreatures searches across names, latin taxonomies, habitats and lore', () => {
  const searchVamp = searchCreatures(ENRICHED_BESTIARY_CREATURES, 'vampirique');
  assert.strictEqual(searchVamp.length, 1);
  assert.strictEqual(searchVamp[0].id, 'vampire');

  const searchWendigo = searchCreatures(ENRICHED_BESTIARY_CREATURES, 'wendigo');
  assert.strictEqual(searchWendigo.length, 1);
  assert.strictEqual(searchWendigo[0].id, 'wendigo');

  const searchLeviathan = searchCreatures(ENRICHED_BESTIARY_CREATURES, 'maelströms');
  assert.strictEqual(searchLeviathan.length, 1);
  assert.strictEqual(searchLeviathan[0].id, 'leviathan');

  const empty = searchCreatures(ENRICHED_BESTIARY_CREATURES, ' licorne arc en ciel ');
  assert.strictEqual(empty.length, 0);
});

test('sortCreatures orders correctly by danger and dread', () => {
  const byDangerDesc = sortCreatures(ENRICHED_BESTIARY_CREATURES, 'danger-desc');
  assert.strictEqual(byDangerDesc[0].dangerLevel, 5);
  assert.strictEqual(byDangerDesc[byDangerDesc.length - 1].dangerLevel, 2);

  const byDread = sortCreatures(ENRICHED_BESTIARY_CREATURES, 'dread');
  assert.ok(byDread[0].stats.dread >= byDread[1].stats.dread);
});

test('getBestiaryStatsSummary aggregates counts correctly for 20 creatures', () => {
  const summary = getBestiaryStatsSummary(ENRICHED_BESTIARY_CREATURES);
  assert.strictEqual(summary.total, 20);
  assert.strictEqual(summary.maxDanger, 5);
  assert.ok(summary.averageDread > 85, 'Average dread is very high for gothic theme');
  assert.strictEqual(summary.categoriesCount['undead'], 5);
  assert.strictEqual(summary.categoriesCount['beasts'], 4);
  assert.strictEqual(summary.categoriesCount['spectres'], 4);
  assert.strictEqual(summary.categoriesCount['demons'], 3);
  assert.strictEqual(summary.categoriesCount['abyssal'], 4);
});

test('OCCULT_WEAPONS provides 5 distinct consecrated sanctified instruments', () => {
  assert.strictEqual(OCCULT_WEAPONS.length, 5);
  const ids = OCCULT_WEAPONS.map((w) => w.id);
  assert.ok(ids.includes('argent'));
  assert.ok(ids.includes('eau_benite'));
  assert.ok(ids.includes('flamme_solaire'));
  assert.ok(ids.includes('lyre_cathedrale'));
  assert.ok(ids.includes('miroir_obsidienne'));
});

test('simulateOccultDuel grants bonus when choosing effective weapon against monster', () => {
  const lycanthrope = ENRICHED_BESTIARY_CREATURES.find((c) => c.id === 'lycanthrope')!;
  
  // Duel with silver blade (bonus against lycanthrope)
  const effectiveResult = simulateOccultDuel(lycanthrope, 'argent', 0.1);
  assert.ok(effectiveResult.isEffective, 'Silver is effective against beasts/lycanthrope');
  assert.ok(effectiveResult.playerDamage > 70, 'Effective weapon deals massive damage');
  assert.ok(effectiveResult.combatLog.length >= 4);

  // Duel with cathedral lyre (not effective against lycanthrope)
  const neutralResult = simulateOccultDuel(lycanthrope, 'lyre_cathedrale', 0.9);
  assert.ok(!neutralResult.isEffective, 'Lyre is not primary weapon for lycanthropes');
  assert.ok(effectiveResult.playerDamage > neutralResult.playerDamage, 'Silver deals more damage than lyre against wolf');
});

test('simulateOccultDuel against Wendigo with Solar Flame unlocks relic on victory', () => {
  const wendigo = ENRICHED_BESTIARY_CREATURES.find((c) => c.id === 'wendigo')!;
  const result = simulateOccultDuel(wendigo, 'flamme_solaire', 0.05);
  
  assert.strictEqual(result.weaponId, 'flamme_solaire');
  assert.ok(result.isEffective);
  assert.ok(result.isCritical);
  assert.ok(result.victory, 'Critical hit with weakness should defeat creature');
  assert.ok(result.relicUnlocked?.includes('Fragment de Cœur de Givre'));
  assert.ok(result.scoreBonus > 1000);
});

test('compareCreatures compares two entities and determines deltas and advantage', () => {
  const leviathan = ENRICHED_BESTIARY_CREATURES.find((c) => c.id === 'leviathan')!;
  const corbeau = ENRICHED_BESTIARY_CREATURES.find((c) => c.id === 'corbeau')!;

  const comparison = compareCreatures(leviathan, corbeau);
  assert.strictEqual(comparison.winnerId, 'leviathan', 'Leviathan should heavily outclass the raven');
  assert.ok(comparison.deltas.total > 0);
  assert.ok(comparison.summarySentence.includes('Léviathan'));
  assert.ok(comparison.tacticalAdvantage.length > 10);
});
