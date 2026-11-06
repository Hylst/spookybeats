import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CRYPT_TAROT_DECK,
  getAllTarotCards,
  getTarotCardById,
  drawTarotSpread,
  interpretTarotSpread,
} from './tarotLogic';

test('Tarot Logic - Deck integrity and properties', () => {
  const cards = getAllTarotCards();
  assert.equal(cards.length, 5, 'Le deck doit comporter 5 cartes majeures illustrées');

  for (const card of cards) {
    assert.ok(card.id, 'Chaque carte doit avoir un id');
    assert.ok(card.arcanaNumber, 'Chaque carte doit avoir un numéro d’arcane');
    assert.ok(card.name, 'Chaque carte doit avoir un nom');
    assert.ok(card.uprightProphecy, 'Chaque carte doit avoir une prophétie droite');
    assert.ok(card.reversedProphecy, 'Chaque carte doit avoir une prophétie inversée');
    assert.ok(card.darkHumorAdvice, 'Chaque carte doit avoir un conseil teinté d’humour');
    assert.ok(card.linkedEnigmaId, 'Chaque carte doit être liée à une énigme');
    assert.ok(card.spectralManaReward > 0, 'Chaque carte doit accorder du mana');
  }
});

test('Tarot Logic - getTarotCardById lookup', () => {
  const cellist = getTarotCardById('squelette-celliste');
  assert.ok(cellist, 'Doit trouver le squelette celliste');
  assert.equal(cellist?.arcanaNumber, 'XIII');

  const pumpkin = getTarotCardById('roi-citrouille');
  assert.ok(pumpkin, 'Doit trouver le roi citrouille');
  assert.equal(pumpkin?.element, 'vegetal');

  const nonExistent = getTarotCardById('fantome-inexistant');
  assert.equal(nonExistent, undefined);
});

test('Tarot Logic - drawTarotSpread single draw', () => {
  const draw = drawTarotSpread('single', false, () => 0.1);
  assert.equal(draw.length, 1);
  assert.equal(draw[0].isReversed, false);
  assert.equal(draw[0].positionLabel, 'Lame du Destin Immédiat');
  assert.equal(draw[0].revealed, false);
});

test('Tarot Logic - drawTarotSpread trinity draw has unique cards', () => {
  const draw = drawTarotSpread('trinity', true, () => 0.4);
  assert.equal(draw.length, 3);
  const ids = new Set(draw.map((d) => d.card.id));
  assert.equal(ids.size, 3, 'Les 3 cartes tirées doivent être distinctes');
});

test('Tarot Logic - interpretTarotSpread single vs trinity', () => {
  const single = drawTarotSpread('single', false, () => 0.1);
  const singleInterp = interpretTarotSpread(single);
  assert.ok(singleInterp.overallTitle.includes('L’Oracle d’Arcane'));
  assert.ok(singleInterp.totalRewardMana > 0);

  const trinity = drawTarotSpread('trinity', false, () => 0.1);
  const trinityInterp = interpretTarotSpread(trinity);
  assert.equal(trinityInterp.overallTitle, 'L’Harmonie Chaotique des Trois Sépulcres');
  assert.ok(trinityInterp.totalRewardMana > 150);
});
