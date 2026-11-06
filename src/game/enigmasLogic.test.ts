import test from 'node:test';
import assert from 'node:assert';
import {
  ALL_ENIGMAS,
  ENIGMA_TOMES,
  NECROMANCER_RANKS,
  ALCHEMICAL_RUNES,
  filterEnigmas,
  verifyEnigmaAnswer,
  calculateGrimoireProgression,
  getRandomUnsolvedEnigma,
} from './enigmasLogic.ts';

test('ALL_ENIGMAS contains 18 deep gothic enigmas with unique ids and valid fields', () => {
  assert.strictEqual(ALL_ENIGMAS.length, 18, 'Must have exactly 18 enigmas');
  
  const idSet = new Set<string>();
  ALL_ENIGMAS.forEach((e) => {
    assert.ok(!idSet.has(e.id), `Duplicate enigma ID: ${e.id}`);
    idSet.add(e.id);
    assert.ok(e.title.length > 3, `Enigma ${e.id} missing title`);
    assert.ok(e.question.length > 10, `Enigma ${e.id} question too short`);
    assert.ok(e.latinMotto.length > 3, `Enigma ${e.id} missing latin motto`);
    assert.ok(e.subtleHint.length > 5, `Enigma ${e.id} missing subtle hint`);
    assert.ok(e.deepHint.length > 5, `Enigma ${e.id} missing deep hint`);
    assert.ok(e.explanation.length > 10, `Enigma ${e.id} missing explanation`);
    assert.ok(e.manaPoints >= 50, `Enigma ${e.id} must award >= 50 mana`);
    assert.ok(e.relicReward, `Enigma ${e.id} must award a relic`);
    assert.ok(e.relicReward.name.length > 3, `Enigma ${e.id} relic has name`);
    assert.ok(e.relicReward.spectralPower.length > 5, `Enigma ${e.id} relic has spectral power`);
    assert.ok(e.relicReward.icon.length > 0, `Enigma ${e.id} relic has icon`);
  });
});

test('ALL_ENIGMAS covers all 5 tomes and 3 puzzle mechanics', () => {
  const tomeCounts: Record<string, number> = {};
  const typeCounts: Record<string, number> = {};

  ALL_ENIGMAS.forEach((e) => {
    tomeCounts[e.tomeId] = (tomeCounts[e.tomeId] || 0) + 1;
    typeCounts[e.type] = (typeCounts[e.type] || 0) + 1;
  });

  assert.strictEqual(ENIGMA_TOMES.length, 5, 'Must have 5 tomes');
  ENIGMA_TOMES.forEach((tome) => {
    const expectedMin = tome.id === 'tome-sceaux' ? 2 : 4;
    assert.ok(tomeCounts[tome.id] >= expectedMin, `Tome ${tome.id} should have at least ${expectedMin} enigmas`);
  });

  assert.ok(typeCounts['choix_multiple'] >= 6, 'Has multiple choice riddles');
  assert.ok(typeCounts['sceau_runique'] >= 2, 'Has runic seal riddles');
  assert.ok(typeCounts['anagramme_occulte'] >= 2, 'Has anagram riddles');
});

test('verifyEnigmaAnswer correctly validates multiple choice, runic ternary, and anagrams', () => {
  // 1. Multiple choice
  const mcEnigma = ALL_ENIGMAS.find((e) => e.type === 'choix_multiple')!;
  const correctOpt = mcEnigma.correctIndex!;
  const resSuccess = verifyEnigmaAnswer(mcEnigma, correctOpt);
  assert.strictEqual(resSuccess.isCorrect, true);
  assert.strictEqual(resSuccess.earnedPoints, mcEnigma.manaPoints);

  const resFail = verifyEnigmaAnswer(mcEnigma, (correctOpt + 1) % 4);
  assert.strictEqual(resFail.isCorrect, false);
  assert.strictEqual(resFail.earnedPoints, 0);

  // 2. Runic seal
  const runeEnigma = ALL_ENIGMAS.find((e) => e.type === 'sceau_runique')!;
  const targetSeq = runeEnigma.targetRunicSequence!;
  const resRuneOk = verifyEnigmaAnswer(runeEnigma, targetSeq);
  assert.strictEqual(resRuneOk.isCorrect, true);
  assert.strictEqual(resRuneOk.earnedPoints, runeEnigma.manaPoints);

  const resRuneBad = verifyEnigmaAnswer(runeEnigma, [targetSeq[1], targetSeq[0], targetSeq[2]]);
  assert.strictEqual(resRuneBad.isCorrect, false);

  // 3. Anagram
  const anagramEnigma = ALL_ENIGMAS.find((e) => e.type === 'anagramme_occulte')!;
  const sol = anagramEnigma.anagramData!.normalizedSolution;
  const resAnagramOk = verifyEnigmaAnswer(anagramEnigma, sol.toUpperCase());
  assert.strictEqual(resAnagramOk.isCorrect, true);

  const resAnagramWithAccents = verifyEnigmaAnswer(anagramEnigma, sol);
  assert.strictEqual(resAnagramWithAccents.isCorrect, true);

  const resAnagramWrong = verifyEnigmaAnswer(anagramEnigma, 'mauvaise-reponse');
  assert.strictEqual(resAnagramWrong.isCorrect, false);
});

test('calculateGrimoireProgression evaluates mana, percentage and necromancer tiers', () => {
  const emptyProg = calculateGrimoireProgression([]);
  assert.strictEqual(emptyProg.solvedCount, 0);
  assert.strictEqual(emptyProg.totalCount, 18);
  assert.strictEqual(emptyProg.percentage, 0);
  assert.strictEqual(emptyProg.totalMana, 0);
  assert.strictEqual(emptyProg.rank.tier, 1);
  assert.ok(emptyProg.nextRank !== null);

  const fiveSolved = ALL_ENIGMAS.slice(0, 5).map((e) => e.id);
  const fiveProg = calculateGrimoireProgression(fiveSolved);
  assert.strictEqual(fiveProg.solvedCount, 5);
  assert.strictEqual(fiveProg.percentage, Math.round((5 / 18) * 100));
  assert.ok(fiveProg.totalMana > 400);
  assert.strictEqual(fiveProg.rank.tier, 2);

  const allSolved = ALL_ENIGMAS.map((e) => e.id);
  const fullProg = calculateGrimoireProgression(allSolved);
  assert.strictEqual(fullProg.solvedCount, 18);
  assert.strictEqual(fullProg.percentage, 100);
  assert.strictEqual(fullProg.rank.tier, 5);
  assert.strictEqual(fullProg.nextRank, null);
});

test('filterEnigmas filters by tome, difficulty, status, and query', () => {
  const filteredTome = filterEnigmas(ALL_ENIGMAS, { tomeId: 'tome-musique' });
  assert.ok(filteredTome.every((e) => e.tomeId === 'tome-musique'));

  const filteredArchonte = filterEnigmas(ALL_ENIGMAS, { difficulty: 'archonte' });
  assert.ok(filteredArchonte.every((e) => e.difficulty === 'archonte'));

  const solvedIds = [ALL_ENIGMAS[0].id, ALL_ENIGMAS[1].id];
  const solvedOnly = filterEnigmas(ALL_ENIGMAS, { status: 'solved', solvedIds });
  assert.strictEqual(solvedOnly.length, 2);

  const unsolvedOnly = filterEnigmas(ALL_ENIGMAS, { status: 'unsolved', solvedIds });
  assert.strictEqual(unsolvedOnly.length, 16);

  const searchResults = filterEnigmas(ALL_ENIGMAS, { searchQuery: 'violoncelle' });
  assert.ok(searchResults.length >= 1);
});

test('getRandomUnsolvedEnigma returns an unsolved item when available', () => {
  const solvedIds = ALL_ENIGMAS.slice(0, 17).map((e) => e.id);
  const randomUnsolved = getRandomUnsolvedEnigma(solvedIds);
  assert.strictEqual(randomUnsolved.id, ALL_ENIGMAS[17].id);
});
