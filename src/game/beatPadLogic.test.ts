import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  GOTHIC_RHYTHM_PRESETS,
  createEmptySequence,
  toggleSequenceStep,
  generateRandomPattern,
} from './beatPadLogic';

describe('Beat Pad Logic - Presets and Patterns', () => {
  it('contains 5 curated gothic presets with valid dimensions and BPMs', () => {
    assert.equal(GOTHIC_RHYTHM_PRESETS.length, 5);
    GOTHIC_RHYTHM_PRESETS.forEach((p) => {
      assert.ok(p.bpm >= 80 && p.bpm <= 160);
      assert.equal(p.sequence.length, 4);
      p.sequence.forEach((row) => assert.equal(row.length, 8));
    });
  });

  it('creates an empty 4x8 sequence matrix', () => {
    const empty = createEmptySequence();
    assert.equal(empty.length, 4);
    empty.forEach((row) => {
      assert.equal(row.length, 8);
      row.forEach((cell) => assert.equal(cell, false));
    });
  });

  it('toggles a step correctly without mutating other steps', () => {
    const empty = createEmptySequence();
    const updated = toggleSequenceStep(empty, 0, 2);
    assert.equal(updated[0][2], true);
    assert.equal(updated[0][1], false);
    assert.equal(updated[1][2], false);

    const reverted = toggleSequenceStep(updated, 0, 2);
    assert.equal(reverted[0][2], false);
  });

  it('generates random patterns that respect 4x8 bounds', () => {
    const pattern = generateRandomPattern();
    assert.equal(pattern.length, 4);
    pattern.forEach((row) => assert.equal(row.length, 8));
    // Check that kick has at least beat 0 active
    assert.equal(pattern[0][0], true);
  });
});
