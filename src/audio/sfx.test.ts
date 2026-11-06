import test from 'node:test';
import assert from 'node:assert';
import { getSfxVolumeScale, setSfxMuted, registerMusicPlayingChecker } from './sfx.ts';
import { DEFAULT_TRACKS } from './audioEngine.ts';

test('SFX volume attenuation when music is playing', () => {
  setSfxMuted(false);

  // When music is stopped:
  registerMusicPlayingChecker(() => false);
  assert.strictEqual(getSfxVolumeScale(false), 1.0, 'Ambient sounds at full volume when music stopped');
  assert.strictEqual(getSfxVolumeScale(true), 1.0, 'Voluntary sounds at full volume when music stopped');

  // When music is playing:
  registerMusicPlayingChecker(() => true);
  const ambientScale = getSfxVolumeScale(false);
  const voluntaryScale = getSfxVolumeScale(true);

  assert.ok(ambientScale <= 0.15, 'Ambient sounds attenuated to <= 0.15 volume when music playing');
  assert.ok(voluntaryScale >= 0.4 && voluntaryScale <= 0.5, 'Voluntary user clicks maintained at clear level (0.45)');
  assert.ok(ambientScale < voluntaryScale, 'Ambient sound is softer than voluntary interaction sound');

  // When SFX is muted:
  setSfxMuted(true);
  assert.strictEqual(getSfxVolumeScale(false), 0, 'Volume 0 when muted');
  assert.strictEqual(getSfxVolumeScale(true), 0, 'Volume 0 when muted');
  setSfxMuted(false);
});

test('Track list order and attribution verification', () => {
  assert.strictEqual(DEFAULT_TRACKS[0].slug, 'the_umbral_descent', 'Track 1 must be the_umbral_descent');
  assert.strictEqual(DEFAULT_TRACKS[1].slug, 'haunted_cello_chamber', 'Track 2 must be haunted_cello_chamber');
  assert.strictEqual(DEFAULT_TRACKS[2].slug, 'l_eveil_des_lycanthropes', 'Track 3 must be l_eveil_des_lycanthropes');
  assert.strictEqual(DEFAULT_TRACKS[3].slug, 'shadows_of_dread', 'Track 4 must be shadows_of_dread');
  assert.strictEqual(DEFAULT_TRACKS[4].slug, 'haunted_manor', 'Track 5 must be haunted_manor');
  assert.strictEqual(DEFAULT_TRACKS[5].slug, 'blood_moon_ritual', 'Track 6 must be blood_moon_ritual');
  assert.strictEqual(DEFAULT_TRACKS[6].slug, 'gare_aux_sorcieres', 'Track 7 must be gare_aux_sorcieres');

  // Check all tracks have lore text
  DEFAULT_TRACKS.forEach((track) => {
    assert.ok(track.loreText && track.loreText.length > 20, `Track ${track.slug} has atmospheric lore`);
  });
});

test('Hylst MP3 SFX collection structure and filenames', async () => {
  const { HYLST_MP3_SFX } = await import('./hylstSfxData.ts');
  assert.ok(HYLST_MP3_SFX.length >= 20, 'At least 20 curated MP3 SFX items from hylst.fr');
  
  const categories = new Set(HYLST_MP3_SFX.map((s) => s.category));
  assert.ok(categories.has('spectres'), 'Contains spectres');
  assert.ok(categories.has('curses'), 'Contains curses');
  assert.ok(categories.has('beasts'), 'Contains beasts');
  assert.ok(categories.has('manor'), 'Contains manor');

  HYLST_MP3_SFX.forEach((sfx) => {
    assert.ok(sfx.filename.endsWith('.mp3'), `${sfx.filename} must end in .mp3`);
    assert.ok(sfx.label.length > 0, `${sfx.filename} has a title label`);
    assert.ok(sfx.description.length > 0, `${sfx.filename} has a description`);
    assert.ok(sfx.duration.length > 0, `${sfx.filename} has duration info`);
  });
});

test('AudioEngine DSP equalizer and reverb control APIs', async () => {
  const { audioEngine } = await import('./audioEngine.ts');
  
  // Test equalizer setter and getter
  audioEngine.setEqualizer(6, -3, 4);
  const eq = audioEngine.getEqualizer();
  assert.strictEqual(eq.low, 6, 'EQ low should be 6');
  assert.strictEqual(eq.mid, -3, 'EQ mid should be -3');
  assert.strictEqual(eq.high, 4, 'EQ high should be 4');

  // Test clamp limits (-14 to +14)
  audioEngine.setEqualizer(20, -30, 0);
  const clampedEq = audioEngine.getEqualizer();
  assert.strictEqual(clampedEq.low, 14, 'EQ low clamped to 14');
  assert.strictEqual(clampedEq.mid, -14, 'EQ mid clamped to -14');

  // Test reverb level
  audioEngine.setReverbLevel(0.75);
  assert.strictEqual(audioEngine.getReverbLevel(), 0.75, 'Reverb level should be 0.75');
  audioEngine.setReverbLevel(1.5);
  assert.strictEqual(audioEngine.getReverbLevel(), 1.0, 'Reverb clamped to 1.0');
});

test('Creature SFX helper exports and mute behavior', async () => {
  const {
    playSpiderSilkChitter,
    playPumpkinBounce,
    playBatSwarmFlap,
    playWitchFlightSwoosh,
    setSfxMuted
  } = await import('./sfx.ts');

  // Verify functions exist and can be called safely in Node environment without crashing
  assert.strictEqual(typeof playSpiderSilkChitter, 'function');
  assert.strictEqual(typeof playPumpkinBounce, 'function');
  assert.strictEqual(typeof playBatSwarmFlap, 'function');
  assert.strictEqual(typeof playWitchFlightSwoosh, 'function');

  setSfxMuted(true);
  // Calling when muted should safely exit without errors
  playSpiderSilkChitter();
  playPumpkinBounce();
  playBatSwarmFlap();
  playWitchFlightSwoosh();
  setSfxMuted(false);
});


