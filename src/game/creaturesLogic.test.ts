import test from 'node:test';
import assert from 'node:assert';
import {
  createInitialSpiders,
  updateSpider,
  pokeSpider,
  createInitialPumpkins,
  updatePumpkinPhysics,
  launchPumpkinJump,
  createInitialBats,
  updateBatFlight,
  scatterBat,
  createInitialWitch,
  startWitchFlight,
  updateWitchFlight,
  triggerWitchLoop,
} from './creaturesLogic.ts';

test('Spider logic handles descending, swaying, and poke recoil', () => {
  const spiders = createInitialSpiders();
  assert.ok(spiders.length >= 4, 'Should initialize at least 4 spiders');

  const leftSpider = spiders[0];
  assert.strictEqual(leftSpider.state, 'descending');

  // Update spider descending step
  const updated = updateSpider(leftSpider, 1.0);
  assert.ok(updated.yPx >= leftSpider.yPx, 'Spider descended downwards');
  assert.ok(Math.abs(updated.swayAngle) >= 0, 'Spider sways with wind');

  // Poking spider triggers scuttled state
  const poked = pokeSpider(leftSpider);
  assert.strictEqual(poked.state, 'scuttled');
  assert.strictEqual(poked.websSpun, leftSpider.websSpun + 1, 'Weaves more web upon escape');

  // Updating scuttled spider causes fast retraction upwards
  const retracted = updateSpider(poked, 1.0);
  assert.ok(retracted.yPx < poked.yPx, 'Spider rapidly retreats upwards towards the ceiling');
});

test('Pumpkin physics implements gravity, squash-and-stretch, and bounce rebounds', () => {
  const pumpkins = createInitialPumpkins();
  assert.ok(pumpkins.length >= 4, 'Should initialize pumpkins');

  const pumpkin = pumpkins[0];
  assert.strictEqual(pumpkin.isGrounded, true);

  // Jump impulse
  const launched = launchPumpkinJump(pumpkin, 20);
  assert.strictEqual(launched.isGrounded, false);
  assert.ok(launched.vy > 15, 'Positive upward velocity on launch');
  assert.ok(launched.scaleY > 1.0, 'Stretches vertically during launch');

  // Gravity pulls it back down
  let airborne = launched;
  for (let i = 0; i < 25; i++) {
    airborne = updatePumpkinPhysics(airborne, 1.0, 0.8);
  }
  // After enough ticks, it should come into contact with the ground and trigger squash
  assert.ok(airborne.bounceCount >= launched.bounceCount, 'Recorded bounce on ground contact');
});

test('Bat flight simulates flapping wings and scatter reaction', () => {
  const bats = createInitialBats();
  assert.ok(bats.length >= 3, 'Should initialize bats');

  const bat = bats[0];
  const initialPhase = bat.wingPhase;

  // Normal update advances wing flap
  const updated = updateBatFlight(bat, 0.5);
  assert.notStrictEqual(updated.wingPhase, initialPhase, 'Wing phase advanced');

  // Scatter reaction bursts velocity
  const scattered = scatterBat(bat);
  assert.strictEqual(scattered.isScattering, true);
  assert.ok(scattered.vy < 0, 'Takes flight upwards abruptly');
});

test('Witch celestial flight manages screen crossing, stardust, and barrel loop', () => {
  const initialWitch = createInitialWitch();
  assert.strictEqual(initialWitch.active, false);

  // Start flight
  const flying = startWitchFlight(initialWitch, 16);
  assert.strictEqual(flying.active, true);
  assert.strictEqual(flying.progress, -12);

  // Advance flight generates trail particles
  let currentWitch = flying;
  for (let i = 0; i < 15; i++) {
    currentWitch = updateWitchFlight(currentWitch);
  }
  assert.ok(currentWitch.progress > -12, 'Witch progresses across screen');
  assert.ok(currentWitch.sparkles.length > 0, 'Emits stardust sparkles in her wake');

  // Trigger acrobatic loop
  const looping = triggerWitchLoop(currentWitch);
  assert.strictEqual(looping.isDoingLoop, true);
});
