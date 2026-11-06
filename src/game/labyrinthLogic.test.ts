import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  generateLabyrinth,
  canMoveInLabyrinth,
  moveLabyrinthPlayer,
  revealAdjacent,
} from './labyrinthLogic';

describe('Labyrinth Logic - Grave Digger Dungeon Crawler', () => {
  it('generates a 5x5 labyrinth with entrance at (0,0) and exit at (4,4)', () => {
    const state = generateLabyrinth();
    assert.equal(state.grid.length, 5);
    assert.equal(state.grid[0].length, 5);
    assert.equal(state.grid[0][0].type, 'entrance');
    assert.equal(state.grid[4][4].type, 'exit');
    assert.equal(state.playerPos.x, 0);
    assert.equal(state.playerPos.y, 0);
    assert.equal(state.hasKey, false);
    assert.equal(state.status, 'playing');
    assert.ok(state.torchTurns > 0);
  });

  it('guarantees key, torches, treasures, and obstacles placement', () => {
    const state = generateLabyrinth();
    const flat = state.grid.flat();
    const keys = flat.filter((c) => c.type === 'key');
    const exits = flat.filter((c) => c.type === 'exit');
    const torches = flat.filter((c) => c.type === 'torch');
    const treasures = flat.filter((c) => c.type === 'treasure');

    assert.equal(keys.length, 1);
    assert.equal(exits.length, 1);
    assert.ok(torches.length >= 1);
    assert.ok(treasures.length >= 2);
  });

  it('validates wall collisions correctly', () => {
    assert.equal(canMoveInLabyrinth({ x: 0, y: 0 }, 'up'), false);
    assert.equal(canMoveInLabyrinth({ x: 0, y: 0 }, 'left'), false);
    assert.equal(canMoveInLabyrinth({ x: 0, y: 0 }, 'right'), true);
    assert.equal(canMoveInLabyrinth({ x: 0, y: 0 }, 'down'), true);
    assert.equal(canMoveInLabyrinth({ x: 4, y: 4 }, 'right'), false);
    assert.equal(canMoveInLabyrinth({ x: 4, y: 4 }, 'down'), false);
  });

  it('moves player and consumes a torch turn per step', () => {
    const state = generateLabyrinth();
    state.grid[0][1] = {
      x: 1,
      y: 0,
      type: 'empty',
      revealed: true,
      looted: true,
      name: 'Couloir Obscur',
    };
    const initialTorch = state.torchTurns;
    const nextState = moveLabyrinthPlayer(state, 'right');

    assert.equal(nextState.playerPos.x, 1);
    assert.equal(nextState.playerPos.y, 0);
    assert.equal(nextState.torchTurns, initialTorch - 1);
    assert.ok(nextState.score > 0);
  });

  it('absorbs phantom attack or trap damage when shield is active', () => {
    const state = generateLabyrinth();
    state.hasShield = true;
    state.torchTurns = 15;

    // Placer artificiellement un piège à côté
    state.grid[0][1] = {
      x: 1,
      y: 0,
      type: 'trap',
      revealed: true,
      looted: false,
      name: 'Fosse aux Lames',
    };

    const nextState = moveLabyrinthPlayer(state, 'right');
    assert.equal(nextState.hasShield, false); // bouclier consommé
    // Le piège n'a pas réduit la torche de 5 car le bouclier l'a absorbé (seule la consommation normale de 1 pas a eu lieu)
    assert.equal(nextState.torchTurns, 14);
  });
});
