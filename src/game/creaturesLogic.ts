/**
 * Logique pure et modèles d'animation physique des créatures gothiques interactives.
 * Découplé du rendu React pour tests unitaires fiables (araignées, citrouilles, chauves-souris, sorcière).
 */

export interface SpiderEntity {
  id: string;
  xPercent: number; // Position horizontale (5% à 95%)
  yPx: number;      // Position verticale actuelle
  minY: number;     // Point de suspension le plus haut (sous l'en-tête)
  maxY: number;     // Descente maximale
  state: 'idle' | 'descending' | 'climbing' | 'scuttled';
  speed: number;
  websSpun: number;
  swayAngle: number; // Balancement au vent
}

export interface PumpkinEntity {
  id: string;
  xPercent: number;
  yPx: number;        // Position verticale au-dessus du sol (0 = au sol)
  vy: number;         // Vitesse verticale
  groundY: number;    // Sol de référence
  isGrounded: boolean;
  scaleX: number;     // Écrasement / étirement physique
  scaleY: number;
  rotDeg: number;
  faceVariant: 'sinister' | 'grinning' | 'maniacal';
  bounceCount: number;
}

export interface BatEntity {
  id: string;
  xPercent: number;
  yPercent: number;
  vx: number;
  vy: number;
  wingPhase: number;
  wingSpeed: number;
  size: number;
  isScattering: boolean;
}

export interface StardustSparkle {
  id: string;
  xPercent: number;
  yPercent: number;
  life: number; // 1.0 -> 0.0
  color: 'violet' | 'amber' | 'green';
  size: number;
}

export interface WitchEntity {
  active: boolean;
  progress: number; // 0 à 100% de la largeur de l'écran
  yPercent: number; // Hauteur de vol dans le ciel nocturne (10% à 30%)
  speed: number;
  direction: 'left-to-right' | 'right-to-left';
  isDoingLoop: boolean;
  loopAngle: number;
  sparkles: StardustSparkle[];
}

// ==========================================
// 1. Logique des Araignées (Toile & Descente)
// ==========================================

export function createInitialSpiders(): SpiderEntity[] {
  return [
    {
      id: 'spider-left',
      xPercent: 12,
      yPx: 110,
      minY: 45,
      maxY: 280,
      state: 'descending',
      speed: 1.2,
      websSpun: 1,
      swayAngle: 0,
    },
    {
      id: 'spider-center-left',
      xPercent: 32,
      yPx: 60,
      minY: 40,
      maxY: 220,
      state: 'idle',
      speed: 0.9,
      websSpun: 2,
      swayAngle: -3,
    },
    {
      id: 'spider-center-right',
      xPercent: 68,
      yPx: 95,
      minY: 42,
      maxY: 250,
      state: 'descending',
      speed: 1.0,
      websSpun: 1,
      swayAngle: 2,
    },
    {
      id: 'spider-right',
      xPercent: 88,
      yPx: 130,
      minY: 50,
      maxY: 310,
      state: 'idle',
      speed: 1.4,
      websSpun: 3,
      swayAngle: 1,
    },
  ];
}

export function updateSpider(spider: SpiderEntity, timeSec: number): SpiderEntity {
  let { yPx, state, websSpun, speed } = spider;
  const swayAngle = Math.sin(timeSec * 1.5 + spider.xPercent) * 4.5;

  if (state === 'scuttled') {
    // Remonte très vite pour échapper au coup
    yPx -= speed * 4.5;
    if (yPx <= spider.minY) {
      yPx = spider.minY;
      state = 'idle';
      websSpun += 1;
    }
  } else if (state === 'descending') {
    yPx += speed * 0.7;
    if (yPx >= spider.maxY) {
      yPx = spider.maxY;
      state = 'idle';
    }
  } else if (state === 'climbing') {
    yPx -= speed * 0.8;
    if (yPx <= spider.minY) {
      yPx = spider.minY;
      state = 'idle';
    }
  }

  return {
    ...spider,
    yPx: Math.max(spider.minY, Math.min(spider.maxY, yPx)),
    state,
    websSpun,
    swayAngle,
  };
}

export function pokeSpider(spider: SpiderEntity): SpiderEntity {
  return {
    ...spider,
    state: 'scuttled',
    speed: Math.max(spider.speed, 2.5),
    websSpun: spider.websSpun + 1,
  };
}

// ==========================================
// 2. Logique des Citrouilles Bondissantes
// ==========================================

export function createInitialPumpkins(): PumpkinEntity[] {
  return [
    {
      id: 'pumpkin-corner-left',
      xPercent: 8,
      yPx: 0,
      vy: 14,
      groundY: 0,
      isGrounded: true,
      scaleX: 1,
      scaleY: 1,
      rotDeg: 0,
      faceVariant: 'sinister',
      bounceCount: 0,
    },
    {
      id: 'pumpkin-mid-left',
      xPercent: 26,
      yPx: 0,
      vy: 11,
      groundY: 0,
      isGrounded: true,
      scaleX: 1,
      scaleY: 1,
      rotDeg: 0,
      faceVariant: 'grinning',
      bounceCount: 0,
    },
    {
      id: 'pumpkin-mid-right',
      xPercent: 74,
      yPx: 0,
      vy: 13,
      groundY: 0,
      isGrounded: true,
      scaleX: 1,
      scaleY: 1,
      rotDeg: 0,
      faceVariant: 'maniacal',
      bounceCount: 0,
    },
    {
      id: 'pumpkin-corner-right',
      xPercent: 92,
      yPx: 0,
      vy: 16,
      groundY: 0,
      isGrounded: true,
      scaleX: 1,
      scaleY: 1,
      rotDeg: 0,
      faceVariant: 'sinister',
      bounceCount: 0,
    },
  ];
}

export function updatePumpkinPhysics(
  p: PumpkinEntity,
  gravity = 0.92,
  restitution = 0.82
): PumpkinEntity {
  let { yPx, vy, isGrounded, scaleX, scaleY, rotDeg, bounceCount } = p;

  if (isGrounded) {
    // Si au sol, retour progressif à la forme ronde standard
    scaleX += (1.0 - scaleX) * 0.25;
    scaleY += (1.0 - scaleY) * 0.25;
    rotDeg += (0 - rotDeg) * 0.15;
    return { ...p, scaleX, scaleY, rotDeg };
  }

  // En vol : application de la gravité
  vy -= gravity;
  yPx += vy;
  rotDeg += vy * 0.8;

  // Étirement en vol (stretch)
  if (Math.abs(vy) > 3) {
    scaleY = 1.0 + Math.min(0.28, Math.abs(vy) * 0.015);
    scaleX = 1.0 - Math.min(0.2, Math.abs(vy) * 0.012);
  }

  // Impact au sol (squash)
  if (yPx <= p.groundY) {
    yPx = p.groundY;
    bounceCount += 1;

    if (Math.abs(vy) > 2.5) {
      // Rebondit avec restitution d'énergie
      vy = -vy * restitution;
      // Écrasement élastique horizontal au contact du sol
      scaleX = 1.32;
      scaleY = 0.72;
      isGrounded = false;
    } else {
      // S'arrête au sol
      vy = 0;
      isGrounded = true;
      scaleX = 1.15;
      scaleY = 0.88;
    }
  }

  return {
    ...p,
    yPx,
    vy,
    isGrounded,
    scaleX,
    scaleY,
    rotDeg,
    bounceCount,
  };
}

export function launchPumpkinJump(p: PumpkinEntity, impulse = 18): PumpkinEntity {
  const nextVariant =
    p.faceVariant === 'sinister' ? 'grinning' : p.faceVariant === 'grinning' ? 'maniacal' : 'sinister';

  return {
    ...p,
    vy: impulse + Math.random() * 4,
    isGrounded: false,
    scaleX: 0.82,
    scaleY: 1.25,
    rotDeg: (Math.random() - 0.5) * 35,
    faceVariant: nextVariant,
    bounceCount: p.bounceCount + 1,
  };
}

// ==========================================
// 3. Logique des Chauves-Souris Virevoltantes
// ==========================================

export function createInitialBats(): BatEntity[] {
  return [
    {
      id: 'bat-1',
      xPercent: 18,
      yPercent: 18,
      vx: 0.35,
      vy: 0.18,
      wingPhase: 0,
      wingSpeed: 0.28,
      size: 26,
      isScattering: false,
    },
    {
      id: 'bat-2',
      xPercent: 45,
      yPercent: 24,
      vx: -0.42,
      vy: -0.15,
      wingPhase: 1.5,
      wingSpeed: 0.32,
      size: 22,
      isScattering: false,
    },
    {
      id: 'bat-3',
      xPercent: 78,
      yPercent: 15,
      vx: 0.28,
      vy: 0.22,
      wingPhase: 3.1,
      wingSpeed: 0.25,
      size: 30,
      isScattering: false,
    },
  ];
}

export function updateBatFlight(bat: BatEntity, timeSec: number): BatEntity {
  let { xPercent, yPercent, vx, vy, wingPhase, wingSpeed, isScattering } = bat;

  // Ondulation sinusoïdale du vol
  const waveY = Math.sin(timeSec * 2.5 + bat.size) * 0.22;
  xPercent += vx;
  yPercent += vy + waveY;

  // Rebond sur les limites d'écran (10% à 90%)
  if (xPercent < 5) {
    xPercent = 5;
    vx = Math.abs(vx);
  } else if (xPercent > 95) {
    xPercent = 95;
    vx = -Math.abs(vx);
  }

  if (yPercent < 8) {
    yPercent = 8;
    vy = Math.abs(vy);
  } else if (yPercent > 50) {
    yPercent = 50;
    vy = -Math.abs(vy);
  }

  // Battement d'ailes
  wingPhase += wingSpeed * (isScattering ? 2.2 : 1.0);

  return {
    ...bat,
    xPercent,
    yPercent,
    vx,
    vy,
    wingPhase,
    isScattering: false,
  };
}

export function scatterBat(bat: BatEntity): BatEntity {
  const angle = (Math.random() * Math.PI) - Math.PI / 2;
  const speed = 1.2 + Math.random() * 0.8;

  return {
    ...bat,
    vx: Math.cos(angle) * speed,
    vy: -Math.abs(Math.sin(angle) * speed) - 0.5,
    wingSpeed: 0.65,
    isScattering: true,
  };
}

// ==========================================
// 4. Logique de la Sorcière sur son Balai
// ==========================================

export function createInitialWitch(): WitchEntity {
  return {
    active: false,
    progress: -15, // Commence hors écran
    yPercent: 14,
    speed: 0.45,
    direction: 'left-to-right',
    isDoingLoop: false,
    loopAngle: 0,
    sparkles: [],
  };
}

export function startWitchFlight(witch: WitchEntity, y = 14): WitchEntity {
  return {
    ...witch,
    active: true,
    progress: -12,
    yPercent: y,
    isDoingLoop: false,
    loopAngle: 0,
    sparkles: [],
  };
}

export function updateWitchFlight(witch: WitchEntity): WitchEntity {
  if (!witch.active) return witch;

  let progress = witch.progress + witch.speed;
  let active = true;
  let isDoingLoop = witch.isDoingLoop;
  let loopAngle = witch.loopAngle;

  if (isDoingLoop) {
    loopAngle += 18;
    if (loopAngle >= 360) {
      loopAngle = 0;
      isDoingLoop = false;
    }
  }

  // Hors écran : le vol se termine
  if (progress > 115) {
    active = false;
    progress = -15;
  }

  // Génération de poussière d'étoiles / étincelles magiques à l'arrière du balai
  const newSparkles = [...witch.sparkles];
  if (Math.random() > 0.35) {
    newSparkles.push({
      id: `sparkle-${Date.now()}-${Math.random()}`,
      xPercent: progress - 4 + (Math.random() - 0.5) * 2,
      yPercent: witch.yPercent + (Math.random() - 0.5) * 3,
      life: 1.0,
      color: Math.random() > 0.5 ? 'violet' : Math.random() > 0.5 ? 'amber' : 'green',
      size: 4 + Math.random() * 5,
    });
  }

  // Décroissance et nettoyage des particules
  const updatedSparkles = newSparkles
    .map((s) => ({
      ...s,
      life: s.life - 0.05,
      yPercent: s.yPercent + 0.12, // retombent doucement
    }))
    .filter((s) => s.life > 0);

  return {
    ...witch,
    active,
    progress,
    isDoingLoop,
    loopAngle,
    sparkles: updatedSparkles,
  };
}

export function triggerWitchLoop(witch: WitchEntity): WitchEntity {
  if (!witch.active) return startWitchFlight(witch);
  return {
    ...witch,
    isDoingLoop: true,
    loopAngle: 0,
  };
}
