import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  MANOR_RELICS,
  calculateManorQuestProgress,
} from './manorQuestLogic';

describe('Manor Quest Logic - 7 Ghost Relics Hunt', () => {
  it('contains exactly 7 unique relics with lore, sound cue and clues', () => {
    assert.equal(MANOR_RELICS.length, 7);
    const ids = new Set(MANOR_RELICS.map((r) => r.id));
    assert.equal(ids.size, 7);
    MANOR_RELICS.forEach((r) => {
      assert.ok(r.name.length > 5);
      assert.ok(r.clue.length > 10);
      assert.ok(r.lore.length > 10);
      assert.ok(r.points >= 150);
    });
  });

  it('calculates initial progress when no relics are found', () => {
    const progress = calculateManorQuestProgress([]);
    assert.equal(progress.foundCount, 0);
    assert.equal(progress.totalCount, 7);
    assert.equal(progress.isComplete, false);
    assert.equal(progress.scoreBonus, 0);
    assert.equal(progress.title, 'Visiteur Égaré');
  });

  it('calculates partial progress and deduplicates IDs', () => {
    const progress = calculateManorQuestProgress(['bell', 'bell', 'celtic_cross']);
    assert.equal(progress.foundCount, 2);
    assert.equal(progress.isComplete, false);
    assert.equal(progress.scoreBonus, 250 + 250);
    assert.equal(progress.title, 'Explorateur Funeste');
  });

  it('calculates completion and awards the grand mastery bonus', () => {
    const allIds = MANOR_RELICS.map((r) => r.id);
    const progress = calculateManorQuestProgress(allIds);
    assert.equal(progress.foundCount, 7);
    assert.equal(progress.isComplete, true);
    assert.equal(progress.title, "Maître Souverain du Manoir d'Hylst");
    // sum of all points + 500 bonus
    const baseSum = MANOR_RELICS.reduce((sum, r) => sum + r.points, 0);
    assert.equal(progress.scoreBonus, baseSum + 500);
  });
});
