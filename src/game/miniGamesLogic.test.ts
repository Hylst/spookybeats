import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getNextAltarGlyph,
  verifyAltarSequence,
  calculateAltarRoundScore,
  generateSarcophagiGrid,
  getFloorName,
  calculateFloorClearBonus,
  AltarGlyph,
} from './miniGamesLogic';

test('getNextAltarGlyph returns a valid glyph', () => {
  const glyph = getNextAltarGlyph();
  assert.ok(['pumpkin', 'skull', 'ghost', 'bat'].includes(glyph));
});

test('verifyAltarSequence detects correct, partial and failing sequences', () => {
  const sequence: AltarGlyph[] = ['pumpkin', 'skull', 'ghost'];

  // Correct partial
  assert.deepEqual(verifyAltarSequence(sequence, ['pumpkin']), {
    isCorrect: true,
    isComplete: false,
  });

  // Correct complete
  assert.deepEqual(verifyAltarSequence(sequence, ['pumpkin', 'skull', 'ghost']), {
    isCorrect: true,
    isComplete: true,
  });

  // Wrong input
  assert.deepEqual(verifyAltarSequence(sequence, ['pumpkin', 'bat']), {
    isCorrect: false,
    isComplete: false,
  });
});

test('calculateAltarRoundScore scales with rounds', () => {
  assert.equal(calculateAltarRoundScore(1), 250);
  assert.equal(calculateAltarRoundScore(4), 1000);
});

test('generateSarcophagiGrid creates 9 tiles with exactly 2 curses by default', () => {
  const grid = generateSarcophagiGrid();
  assert.equal(grid.length, 9);
  const curses = grid.filter((t) => t.content === 'curse');
  assert.equal(curses.length, 2);
});

test('generateSarcophagiGrid scales curses according to floor', () => {
  const floor1 = generateSarcophagiGrid(1);
  assert.equal(floor1.filter((t) => t.content === 'curse').length, 1);

  const floor3 = generateSarcophagiGrid(3);
  assert.equal(floor3.filter((t) => t.content === 'curse').length, 3);
});

test('getFloorName and calculateFloorClearBonus work properly', () => {
  assert.equal(getFloorName(1), 'Les Catacombes Oubliées');
  assert.equal(getFloorName(2), 'Le Caveau des Sacrifices');
  assert.equal(calculateFloorClearBonus(1), 500);
  assert.equal(calculateFloorClearBonus(3), 1500);
});
