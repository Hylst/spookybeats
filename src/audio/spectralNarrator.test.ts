import test from 'node:test';
import assert from 'node:assert/strict';
import { spectralNarrator } from './spectralNarrator';

test('SpectralNarratorService initializes with default idle state', () => {
  const state = spectralNarrator.getState();
  assert.strictEqual(state.isSpeaking, false);
  assert.strictEqual(state.currentText, null);
});

test('SpectralNarratorService allows subscription to state changes', () => {
  let capturedState = spectralNarrator.getState();
  const unsubscribe = spectralNarrator.subscribe((s) => {
    capturedState = s;
  });

  assert.ok(capturedState !== undefined);
  assert.strictEqual(typeof capturedState.isSpeaking, 'boolean');
  unsubscribe();
});

test('SpectralNarratorService safely handles stop without crashing when idle', () => {
  assert.doesNotThrow(() => spectralNarrator.stop());
  const state = spectralNarrator.getState();
  assert.strictEqual(state.isSpeaking, false);
});
