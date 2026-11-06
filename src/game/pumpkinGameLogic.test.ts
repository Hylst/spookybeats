import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getComboMultiplier,
  processHit,
  getNecromancerRank,
  formatGameTime,
  generateSpawn,
} from './pumpkinGameLogic';

test('getComboMultiplier applies correct tier multipliers', () => {
  assert.equal(getComboMultiplier(0), 1.0);
  assert.equal(getComboMultiplier(2), 1.0);
  assert.equal(getComboMultiplier(3), 2.0);
  assert.equal(getComboMultiplier(5), 2.0);
  assert.equal(getComboMultiplier(6), 3.0);
  assert.equal(getComboMultiplier(10), 4.0);
  assert.equal(getComboMultiplier(16), 5.0);
});

test('processHit calculates points with combo scaling on normal pumpkin', () => {
  // First hit: combo goes 0 -> 1, multiplier 1.0, 100 pts
  const hit1 = processHit(0, 0, 'pumpkin');
  assert.equal(hit1.pointsEarned, 100);
  assert.equal(hit1.newScore, 100);
  assert.equal(hit1.newCombo, 1);
  assert.equal(hit1.multiplier, 1.0);

  // Subsequent hit at combo 2 -> becomes combo 3 with multiplier 2.0
  const hit2 = processHit(hit1.newScore, 2, 'pumpkin');
  assert.equal(hit2.newCombo, 3);
  assert.equal(hit2.multiplier, 2.0);
  assert.equal(hit2.pointsEarned, 200); // 100 * 2
  assert.equal(hit2.newScore, 300);
});

test('processHit with golden pumpkin triggers frenzy and high points', () => {
  const result = processHit(1000, 5, 'golden_pumpkin');
  assert.equal(result.newCombo, 6);
  assert.equal(result.multiplier, 3.0);
  assert.equal(result.pointsEarned, 1500); // 500 * 3
  assert.equal(result.newScore, 2500);
  assert.equal(result.isFrenzy, true);
});

test('processHit on trap resets combo and deducts penalty without going below 0', () => {
  const hitTrap = processHit(150, 8, 'trap');
  assert.equal(hitTrap.newCombo, 0);
  assert.equal(hitTrap.multiplier, 1.0);
  assert.equal(hitTrap.newScore, 0); // 150 - 200 clamped at 0

  const hitTrap2 = processHit(1000, 8, 'trap');
  assert.equal(hitTrap2.newScore, 800);
  assert.equal(hitTrap2.newCombo, 0);
});

test('getNecromancerRank returns accurate title and hierarchy', () => {
  assert.equal(getNecromancerRank(500).title, 'Apprenti Nécromancien');
  assert.equal(getNecromancerRank(3000).title, 'Fossoyeur Initié');
  assert.equal(getNecromancerRank(7500).title, 'Chasseur de Goules');
  assert.equal(getNecromancerRank(13420).title, 'Maître Fossoyeur');
  assert.equal(getNecromancerRank(25000).title, 'Seigneur Suprême des Ténèbres');
});

test('formatGameTime properly formats minutes and seconds', () => {
  assert.equal(formatGameTime(45), '00:45');
  assert.equal(formatGameTime(60), '01:00');
  assert.equal(formatGameTime(125), '02:05');
});

test('generateSpawn only chooses available non-occupied slots', () => {
  const occupied = [0, 1, 2, 3, 4, 5, 6, 7];
  const spawn = generateSpawn(occupied, 1);
  assert.ok(spawn);
  assert.equal(spawn.position, 8);

  const full = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  assert.equal(generateSpawn(full, 1), null);
});

test('processHit with hourglass grants time bonus and points', () => {
  const result = processHit(500, 1, 'hourglass');
  assert.equal(result.timeBonusSeconds, 5);
  assert.equal(result.newCombo, 2);
  assert.equal(result.pointsEarned, 150);
});

test('processHit with blood_pumpkin triggers frenzy and major points', () => {
  const result = processHit(500, 2, 'blood_pumpkin');
  assert.equal(result.isFrenzy, true);
  assert.equal(result.newCombo, 3);
  assert.equal(result.multiplier, 2.0);
  assert.equal(result.pointsEarned, 1200); // 600 * 2
});
