/**
 * Moteur d'effets sonores (SFX) procéduraux via Web Audio API.
 * Génère des sonorités horrifiques d'Halloween sans dépendre de fichiers audio externes.
 */

let audioCtx: AudioContext | null = null;
let sfxMuted = false;
let isMusicPlayingChecker: (() => boolean) | null = null;

export function registerMusicPlayingChecker(fn: () => boolean) {
  isMusicPlayingChecker = fn;
}

export function isMusicPlaying(): boolean {
  try {
    return isMusicPlayingChecker ? isMusicPlayingChecker() : false;
  } catch {
    return false;
  }
}

/**
 * Calcule l'atténuation du volume SFX selon que la musique MP3 tourne ou non.
 * Si une musique joue, les sons ambiants sont quasi-inaudibles (x0.1) ou coupés,
 * tandis que les actions volontaires de l'utilisateur ou du mini-jeu restent audibles (x0.45).
 */
export function getSfxVolumeScale(isVoluntary: boolean = false): number {
  if (sfxMuted) return 0;
  const musicPlaying = isMusicPlaying();
  if (musicPlaying) {
    return isVoluntary ? 0.45 : 0.10;
  }
  return 1.0;
}

export function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function setSfxMuted(muted: boolean) {
  sfxMuted = muted;
}

export function isSfxMuted(): boolean {
  return sfxMuted;
}

/**
 * Son de grincement de porte de crypte ancienne (door creak)
 */
export function playDoorCreak(isVoluntary = false) {
  const scale = getSfxVolumeScale(isVoluntary);
  if (scale <= 0) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.exponentialRampToValueAtTime(75, now + 0.3);
    osc.frequency.linearRampToValueAtTime(140, now + 0.6);
    osc.frequency.exponentialRampToValueAtTime(60, now + 1.1);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(320, now);
    filter.Q.setValueAtTime(8, now);

    gain.gain.setValueAtTime(0.001 * scale, now);
    gain.gain.exponentialRampToValueAtTime(0.25 * scale, now + 0.08);
    gain.gain.linearRampToValueAtTime(0.2 * scale, now + 0.7);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 1.25);
  } catch (e) {
    console.debug('SFX audio non initialisé', e);
  }
}

/**
 * Rire maléfique synthétique (evil laugh cackle)
 */
export function playEvilLaugh(isVoluntary = false) {
  const scale = getSfxVolumeScale(isVoluntary);
  if (scale <= 0) return;
  try {
    const ctx = getAudioContext();
    const startTime = ctx.currentTime;

    // Séquence de 6 rires saccadés descendants
    const laughs = [
      { f: 220, dur: 0.12, del: 0 },
      { f: 200, dur: 0.12, del: 0.14 },
      { f: 180, dur: 0.13, del: 0.28 },
      { f: 160, dur: 0.14, del: 0.43 },
      { f: 140, dur: 0.16, del: 0.60 },
      { f: 110, dur: 0.25, del: 0.80 },
    ];

    laughs.forEach(({ f, dur, del }) => {
      const t = startTime + del;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, t);
      osc.frequency.exponentialRampToValueAtTime(f * 0.75, t + dur);

      gain.gain.setValueAtTime(0.001 * scale, t);
      gain.gain.exponentialRampToValueAtTime(0.22 * scale, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001 * scale, t + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + dur + 0.02);
    });
  } catch (e) {
    console.debug('SFX audio non initialisé', e);
  }
}

/**
 * Son "squish" organique d'écrasement de citrouille (Jeu - Volontaire)
 */
export function playPumpkinSquish() {
  const scale = getSfxVolumeScale(true);
  if (scale <= 0) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Oscillateur basse fréquence + bruit
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.18);

    oscGain.gain.setValueAtTime(0.4 * scale, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.19);

    // Bruit d'éclaboussure humide
    const bufferSize = ctx.sampleRate * 0.15;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(800, now);
    noiseFilter.frequency.exponentialRampToValueAtTime(150, now + 0.15);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.35 * scale, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + 0.16);
  } catch (e) {
    console.debug('SFX audio non initialisé', e);
  }
}

/**
 * Cri / gémissement spectral de fantôme
 */
export function playGhostHowl(isVoluntary = false) {
  const scale = getSfxVolumeScale(isVoluntary);
  if (scale <= 0) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    const mainGain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(780, now + 0.2);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.5);

    // Vibrato spectral
    lfo.frequency.setValueAtTime(7, now);
    lfoGain.gain.setValueAtTime(25, now);
    lfo.connect(osc.frequency);

    mainGain.gain.setValueAtTime(0.001 * scale, now);
    mainGain.gain.exponentialRampToValueAtTime(0.25 * scale, now + 0.1);
    mainGain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

    osc.connect(mainGain);
    mainGain.connect(ctx.destination);

    lfo.start(now);
    osc.start(now);
    lfo.stop(now + 0.55);
    osc.stop(now + 0.55);
  } catch (e) {
    console.debug('SFX audio non initialisé', e);
  }
}

/**
 * Carillon Frenzy de la citrouille dorée (Jeu - Volontaire)
 */
export function playGoldenFrenzy(isVoluntary = true) {
  const scale = getSfxVolumeScale(isVoluntary);
  if (scale <= 0) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const chords = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

    chords.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      gain.gain.setValueAtTime(0.001 * scale, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.3 * scale, now + idx * 0.06 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.5);
    });
  } catch (e) {
    console.debug('SFX audio non initialisé', e);
  }
}

/**
 * Détonation / Piège nécrotique (Jeu - Volontaire)
 */
export function playTrapExplosion(isVoluntary = true) {
  const scale = getSfxVolumeScale(isVoluntary);
  if (scale <= 0) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.35);

    gain.gain.setValueAtTime(0.4 * scale, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.36);
  } catch (e) {
    console.debug('SFX audio non initialisé', e);
  }
}

/**
 * Choc lourd de pierre tombale (game over ou fermeture de crypte)
 */
export function playTombstoneThud(isVoluntary = true) {
  const scale = getSfxVolumeScale(isVoluntary);
  if (scale <= 0) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(95, now);
    osc.frequency.exponentialRampToValueAtTime(25, now + 0.45);

    gain.gain.setValueAtTime(0.5 * scale, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.52);
  } catch (e) {
    console.debug('SFX audio non initialisé', e);
  }
}

/**
 * Choc de pierre sépulcrale feutré et résonance sourde pour les clics et interactions UI.
 * Remplace les bips aigus de jeux vidéo par un impact minéral sombre, feutré et noble.
 */
export function playEctoClick(isVoluntary = true) {
  const scale = getSfxVolumeScale(isVoluntary);
  if (scale <= 0) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // 1. Corps d'impact minéral sourd (onde sinusoïdale descendante 95Hz -> 38Hz)
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(95, now);
    osc.frequency.exponentialRampToValueAtTime(38, now + 0.055);

    oscGain.gain.setValueAtTime(0.24 * scale, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(oscGain);

    // 2. Transitoire de pierre polie / mécanisme ancien feutré (triangle bas filtré)
    const clickOsc = ctx.createOscillator();
    const clickGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    clickOsc.type = 'triangle';
    clickOsc.frequency.setValueAtTime(140, now);
    clickOsc.frequency.exponentialRampToValueAtTime(45, now + 0.035);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(260, now);
    filter.Q.setValueAtTime(2.5, now);

    clickGain.gain.setValueAtTime(0.18 * scale, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    clickOsc.connect(filter);
    filter.connect(clickGain);

    // Sortie vers destination
    oscGain.connect(ctx.destination);
    clickGain.connect(ctx.destination);

    osc.start(now);
    clickOsc.start(now);
    osc.stop(now + 0.065);
    clickOsc.stop(now + 0.045);
  } catch (e) {
    console.debug('SFX audio non initialisé', e);
  }
}

/**
 * Stridulation / Bruissement de chauve-souris 3D
 */
export function playBatChirp(isVoluntary = true) {
  const scale = getSfxVolumeScale(isVoluntary);
  if (scale <= 0) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.linearRampToValueAtTime(2200, now + 0.04);
    osc.frequency.linearRampToValueAtTime(900, now + 0.09);

    gain.gain.setValueAtTime(0.001 * scale, now);
    gain.gain.exponentialRampToValueAtTime(0.08 * scale, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.11);
  } catch (e) {
    console.debug('SFX bat chirp non initialisé', e);
  }
}

/**
 * Frôlement soyeux et cliquetis discret de pattes d'araignée tissant sa toile
 */
export function playSpiderSilkChitter(isVoluntary = true) {
  const scale = getSfxVolumeScale(isVoluntary);
  if (scale <= 0) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // 1. Délicat glissement de fil de soie (bruit blanc hautement filtré)
    const bufferSize = Math.floor(ctx.sampleRate * 0.12);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(3200, now);
    noiseFilter.frequency.exponentialRampToValueAtTime(1800, now + 0.12);
    noiseFilter.Q.setValueAtTime(6.0, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.001 * scale, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.09 * scale, now + 0.02);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

    whiteNoise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    whiteNoise.start(now);

    // 2. Petits cliquetis de mandibules / pattes d'araignée
    for (let step = 0; step < 3; step++) {
      const clickTime = now + 0.02 + step * 0.035;
      const osc = ctx.createOscillator();
      const clickGain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1850 + step * 250, clickTime);
      osc.frequency.exponentialRampToValueAtTime(750, clickTime + 0.02);

      clickGain.gain.setValueAtTime(0.06 * scale, clickTime);
      clickGain.gain.exponentialRampToValueAtTime(0.001, clickTime + 0.025);

      osc.connect(clickGain);
      clickGain.connect(ctx.destination);
      osc.start(clickTime);
      osc.stop(clickTime + 0.03);
    }
  } catch (e) {
    console.debug('SFX spider silk non initialisé', e);
  }
}

/**
 * Rebond souple et sourd de citrouille sculptée (hollow pumpkin thud & boing)
 */
export function playPumpkinBounce(isVoluntary = true) {
  const scale = getSfxVolumeScale(isVoluntary);
  if (scale <= 0) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // 1. Corps creux de citrouille (onde sinusoïdale descendante feutrée avec résonance de pulpe)
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(175, now);
    osc.frequency.exponentialRampToValueAtTime(65, now + 0.16);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, now);

    oscGain.gain.setValueAtTime(0.001 * scale, now);
    oscGain.gain.exponentialRampToValueAtTime(0.28 * scale, now + 0.015);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(filter);
    filter.connect(oscGain);
    oscGain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.23);

    // 2. Harmonique de rebond souple
    const boing = ctx.createOscillator();
    const boingGain = ctx.createGain();
    boing.type = 'triangle';
    boing.frequency.setValueAtTime(110, now + 0.01);
    boing.frequency.linearRampToValueAtTime(145, now + 0.05);
    boing.frequency.exponentialRampToValueAtTime(50, now + 0.18);

    boingGain.gain.setValueAtTime(0.001 * scale, now + 0.01);
    boingGain.gain.exponentialRampToValueAtTime(0.14 * scale, now + 0.03);
    boingGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    boing.connect(boingGain);
    boingGain.connect(ctx.destination);

    boing.start(now + 0.01);
    boing.stop(now + 0.21);
  } catch (e) {
    console.debug('SFX pumpkin bounce non initialisé', e);
  }
}

/**
 * Battements d'ailes précipités et nuée de chauves-souris
 */
export function playBatSwarmFlap(isVoluntary = true) {
  const scale = getSfxVolumeScale(isVoluntary);
  if (scale <= 0) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Rafale de 4 battements d'ailes en cuir rapides
    for (let i = 0; i < 4; i++) {
      const flapTime = now + i * 0.055;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(120, flapTime);
      osc.frequency.exponentialRampToValueAtTime(45, flapTime + 0.045);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(180, flapTime);
      filter.Q.setValueAtTime(2, flapTime);

      gain.gain.setValueAtTime(0.001 * scale, flapTime);
      gain.gain.exponentialRampToValueAtTime(0.12 * scale, flapTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, flapTime + 0.048);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(flapTime);
      osc.stop(flapTime + 0.05);
    }

    // Petit cri suraigu d'envol
    playBatChirp(isVoluntary);
  } catch (e) {
    console.debug('SFX bat swarm flap non initialisé', e);
  }
}

/**
 * Rafale mystique et souffle féerique du passage d'une sorcière sur son balai
 */
export function playWitchFlightSwoosh(isVoluntary = true) {
  const scale = getSfxVolumeScale(isVoluntary);
  if (scale <= 0) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // 1. Souffle de vent magique montant puis descendant (Doppler effect)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(130, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.4);
    osc.frequency.exponentialRampToValueAtTime(90, now + 1.1);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(250, now);
    filter.frequency.exponentialRampToValueAtTime(680, now + 0.4);
    filter.frequency.exponentialRampToValueAtTime(180, now + 1.1);
    filter.Q.setValueAtTime(3.5, now);

    gain.gain.setValueAtTime(0.001 * scale, now);
    gain.gain.exponentialRampToValueAtTime(0.16 * scale, now + 0.35);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.15);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 1.2);

    // 2. Tintement de grelots / étincelles magiques de traînée de balai
    const sparkleTimes = [0.25, 0.45, 0.65, 0.85];
    const sparkleFreqs = [1550, 1820, 2240, 1680];
    sparkleTimes.forEach((st, idx) => {
      const spOsc = ctx.createOscillator();
      const spGain = ctx.createGain();

      spOsc.type = 'sine';
      spOsc.frequency.setValueAtTime(sparkleFreqs[idx], now + st);
      spOsc.frequency.exponentialRampToValueAtTime(sparkleFreqs[idx] * 0.7, now + st + 0.12);

      spGain.gain.setValueAtTime(0.05 * scale, now + st);
      spGain.gain.exponentialRampToValueAtTime(0.0001, now + st + 0.12);

      spOsc.connect(spGain);
      spGain.connect(ctx.destination);

      spOsc.start(now + st);
      spOsc.stop(now + st + 0.13);
    });
  } catch (e) {
    console.debug('SFX witch flight swoosh non initialisé', e);
  }
}


/**
 * Gestionnaire de lecture des vrais fichiers MP3 SFX d'Hylst hébergés sur https://hylst.fr/mp3/sfx/
 */
let activeMp3Audio: HTMLAudioElement | null = null;

export function stopCurrentMp3Sfx(): void {
  if (activeMp3Audio) {
    try {
      activeMp3Audio.pause();
      activeMp3Audio.currentTime = 0;
    } catch {
      // Ignorer si déjà arrêté
    }
    activeMp3Audio = null;
  }
}

export function playMp3Sfx(
  filename: string,
  isVoluntary = true,
  onEnded?: () => void
): HTMLAudioElement | null {
  if (sfxMuted) return null;
  const scale = getSfxVolumeScale(isVoluntary);
  if (scale <= 0) return null;

  try {
    stopCurrentMp3Sfx();

    // En dev : proxy /mp3/sfx/, en production statique : accès direct https://hylst.fr/mp3/sfx/
    const isDev = Boolean(typeof import.meta !== 'undefined' && import.meta.env?.DEV);
    const primaryUrl = isDev ? `/mp3/sfx/${filename}` : `https://hylst.fr/mp3/sfx/${filename}`;
    const fallbackUrl = `https://hylst.fr/mp3/sfx/${filename}`;

    const audio = new Audio(primaryUrl);
    audio.crossOrigin = 'anonymous';

    // Volume proportionnel : si une musique joue, les clics volontaires de la soundboard restent clairs sans saturer
    const baseVol = isMusicPlaying() ? 0.55 : 0.85;
    audio.volume = Math.min(1.0, Math.max(0.05, baseVol * (isVoluntary ? 1.0 : 0.3)));

    audio.addEventListener('error', () => {
      if (audio.src !== fallbackUrl) {
        audio.src = fallbackUrl;
        audio.play().catch(() => {});
      }
    });

    audio.addEventListener('ended', () => {
      if (activeMp3Audio === audio) {
        activeMp3Audio = null;
      }
      if (onEnded) onEnded();
    });

    audio.play().catch((err) => {
      console.debug('Lecture SFX MP3 bloquée par le navigateur', filename, err);
    });

    activeMp3Audio = audio;
    return audio;
  } catch (err) {
    console.debug('Erreur playMp3Sfx', err);
    return null;
  }
}
