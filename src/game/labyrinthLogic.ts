/**
 * Logique pure du mini-jeu "Le Labyrinthe du Fossoyeur" (Grave Digger's Dungeon Crawler)
 * Découplée de l'interface graphique pour permettre des tests unitaires fiables.
 */

export type RoomType =
  | 'entrance'
  | 'exit'
  | 'empty'
  | 'treasure'
  | 'key'
  | 'torch'
  | 'potion'
  | 'phantom'
  | 'trap';

export interface RoomCell {
  x: number;
  y: number;
  type: RoomType;
  revealed: boolean;
  looted: boolean;
  name: string;
}

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface LabyrinthState {
  grid: RoomCell[][]; // 5x5
  playerPos: { x: number; y: number };
  torchTurns: number;
  score: number;
  hasKey: boolean;
  hasShield: boolean;
  status: 'playing' | 'escaped' | 'lost_in_dark' | 'slain';
  log: string[];
}

/**
 * Crée une grille 5x5 de catacombes procédurale
 */
export function generateLabyrinth(seed?: number): LabyrinthState {
  const size = 5;
  const grid: RoomCell[][] = [];

  for (let y = 0; y < size; y++) {
    const row: RoomCell[] = [];
    for (let x = 0; x < size; x++) {
      row.push({
        x,
        y,
        type: 'empty',
        revealed: false,
        looted: false,
        name: 'Couloir Obscur',
      });
    }
    grid.push(row);
  }

  // Positionner l'entrée en (0, 0)
  grid[0][0] = {
    x: 0,
    y: 0,
    type: 'entrance',
    revealed: true,
    looted: true,
    name: 'Escalier de la Crypte',
  };

  // Positionner la sortie scellée en (4, 4)
  grid[4][4] = {
    x: 4,
    y: 4,
    type: 'exit',
    revealed: false,
    looted: false,
    name: 'Portail des Âmes (Verrouillé)',
  };

  // Liste des positions disponibles pour les objets et monstres
  const availableCoords: { x: number; y: number }[] = [];
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if ((x === 0 && y === 0) || (x === 4 && y === 4)) continue;
      availableCoords.push({ x, y });
    }
  }

  // Mélanger les coordonnées
  for (let i = availableCoords.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [availableCoords[i], availableCoords[j]] = [availableCoords[j], availableCoords[i]];
  }

  // Placement garanti de la clé
  const keyCoord = availableCoords.pop()!;
  grid[keyCoord.y][keyCoord.x] = {
    x: keyCoord.x,
    y: keyCoord.y,
    type: 'key',
    revealed: false,
    looted: false,
    name: 'Autel de la Clé Funéraire',
  };

  // Placement de 2 torches (+tours de lumière)
  for (let k = 0; k < 2 && availableCoords.length > 0; k++) {
    const coord = availableCoords.pop()!;
    grid[coord.y][coord.x] = {
      x: coord.x,
      y: coord.y,
      type: 'torch',
      revealed: false,
      looted: false,
      name: 'Lanterne de Phosphore',
    };
  }

  // Placement de 2 potions spectrales (bouclier)
  for (let k = 0; k < 2 && availableCoords.length > 0; k++) {
    const coord = availableCoords.pop()!;
    grid[coord.y][coord.x] = {
      x: coord.x,
      y: coord.y,
      type: 'potion',
      revealed: false,
      looted: false,
      name: 'Flacon d\'Élixir Astral',
    };
  }

  // Placement de 4 trésors
  for (let k = 0; k < 4 && availableCoords.length > 0; k++) {
    const coord = availableCoords.pop()!;
    grid[coord.y][coord.x] = {
      x: coord.x,
      y: coord.y,
      type: 'treasure',
      revealed: false,
      looted: false,
      name: 'Urne de Joyaux Funèbres',
    };
  }

  // Placement de 3 fantômes errants
  for (let k = 0; k < 3 && availableCoords.length > 0; k++) {
    const coord = availableCoords.pop()!;
    grid[coord.y][coord.x] = {
      x: coord.x,
      y: coord.y,
      type: 'phantom',
      revealed: false,
      looted: false,
      name: 'Chambre de la Spectre Errant',
    };
  }

  // Placement de 3 pièges de pierre
  for (let k = 0; k < 3 && availableCoords.length > 0; k++) {
    const coord = availableCoords.pop()!;
    grid[coord.y][coord.x] = {
      x: coord.x,
      y: coord.y,
      type: 'trap',
      revealed: false,
      looted: false,
      name: 'Fosse aux Lames Maudites',
    };
  }

  // Révéler les cases adjacentes à l'entrée
  revealAdjacent(grid, 0, 0);

  return {
    grid,
    playerPos: { x: 0, y: 0 },
    torchTurns: 18,
    score: 0,
    hasKey: false,
    hasShield: false,
    status: 'playing',
    log: ['Vous descendez l\'escalier dans les catacombes. Votre torche vacille...'],
  };
}

/**
 * Révèle les cases adjacentes au joueur (Haut, Bas, Gauche, Droite)
 */
export function revealAdjacent(grid: RoomCell[][], px: number, py: number): void {
  const deltas = [
    { dx: 0, dy: 0 },
    { dx: 1, dy: 0 },
    { dx: -1, dy: 0 },
    { dx: 0, dy: 1 },
    { dx: 0, dy: -1 },
  ];

  for (const { dx, dy } of deltas) {
    const nx = px + dx;
    const ny = py + dy;
    if (nx >= 0 && nx < 5 && ny >= 0 && ny < 5) {
      grid[ny][nx].revealed = true;
    }
  }
}

/**
 * Vérifie si le déplacement est valide
 */
export function canMoveInLabyrinth(pos: { x: number; y: number }, dir: Direction): boolean {
  if (dir === 'up') return pos.y > 0;
  if (dir === 'down') return pos.y < 4;
  if (dir === 'left') return pos.x > 0;
  if (dir === 'right') return pos.x < 4;
  return false;
}

/**
 * Déplace le joueur dans le labyrinthe et résout les rencontres
 */
export function moveLabyrinthPlayer(
  state: LabyrinthState,
  dir: Direction
): LabyrinthState {
  if (state.status !== 'playing') return state;
  if (!canMoveInLabyrinth(state.playerPos, dir)) return state;

  const dx = dir === 'left' ? -1 : dir === 'right' ? 1 : 0;
  const dy = dir === 'up' ? -1 : dir === 'down' ? 1 : 0;

  const nextPos = {
    x: state.playerPos.x + dx,
    y: state.playerPos.y + dy,
  };

  // Cloner la grille
  const nextGrid = state.grid.map((row) => row.map((cell) => ({ ...cell })));
  revealAdjacent(nextGrid, nextPos.x, nextPos.y);

  let torch = state.torchTurns - 1;
  let score = state.score + 20; // 20 pts par pas d'exploration
  let hasKey = state.hasKey;
  let hasShield = state.hasShield;
  let status: LabyrinthState['status'] = 'playing';
  const newLog = [...state.log];

  const targetCell = nextGrid[nextPos.y][nextPos.x];

  // Résolution selon le type de salle si non encore fouillée
  if (!targetCell.looted) {
    targetCell.looted = true;

    switch (targetCell.type) {
      case 'treasure':
        score += 350;
        newLog.unshift('💎 Joyaux funéraires trouvés ! (+350 pts)');
        break;

      case 'key':
        hasKey = true;
        score += 500;
        newLog.unshift('🗝️ Clé Funéraire en bronze trouvée ! Le portail final est prêt.');
        break;

      case 'torch':
        torch = Math.min(25, torch + 7);
        score += 150;
        newLog.unshift('🏮 Huile de phosphore récoltée ! Torche ravivée (+7 tours).');
        break;

      case 'potion':
        hasShield = true;
        score += 200;
        newLog.unshift('🛡️ Élixir Astral consommé ! Vous êtes protégé contre le prochain piège ou spectre.');
        break;

      case 'phantom':
        if (hasShield) {
          hasShield = false;
          newLog.unshift('🛡️ Le spectre fond sur vous, mais votre Élixir Astral se dissout pour vous protéger !');
        } else {
          torch = Math.max(0, torch - 4);
          score = Math.max(0, score - 150);
          newLog.unshift('👻 Un spectre glacial traverse votre corps ! (-4 tours de torche, -150 pts)');
        }
        break;

      case 'trap':
        if (hasShield) {
          hasShield = false;
          newLog.unshift('🛡️ Des lames jaillissent du sol ! Le bouclier astral absorbe le coup.');
        } else {
          torch = Math.max(0, torch - 5);
          score = Math.max(0, score - 200);
          newLog.unshift('⚔️ Vous déclenchez une fosse aux lames ! (-5 tours de torche, -200 pts)');
        }
        break;

      case 'exit':
        if (hasKey) {
          status = 'escaped';
          score += 1000 + torch * 50; // Bonus pour la lumière restante
          newLog.unshift(`🏆 VICTOIRE ! Vous franchissez le Portail des Âmes vivant avec tout votre trésor (+${1000 + torch * 50} pts bonus) !`);
        } else {
          targetCell.looted = false; // Ne pas considérer fouillé tant qu'on n'a pas la clé
          newLog.unshift('🔒 Le Portail des Âmes est verrouillé par un sceau lourd. Trouvez d\'abord la Clé Funéraire !');
        }
        break;

      case 'empty':
        newLog.unshift('🕯️ Une salle poussiéreuse résonne de vos pas hésitants.');
        break;
    }
  }

  // Vérifier extinction de la torche
  if (torch <= 0 && status === 'playing') {
    status = 'lost_in_dark';
    newLog.unshift('🌑 Votre torche s\'éteint dans un grésillement. Les ténèbres vous engloutissent à jamais...');
  }

  return {
    grid: nextGrid,
    playerPos: nextPos,
    torchTurns: Math.max(0, torch),
    score,
    hasKey,
    hasShield,
    status,
    log: newLog.slice(0, 8),
  };
}
