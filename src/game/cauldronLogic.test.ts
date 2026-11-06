import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  INGREDIENTS,
  POTION_RECIPES,
  evaluatePotionBrew,
  IngredientType,
} from './cauldronLogic';

describe('Cauldron Logic - Potion Brewing & Alchemy', () => {
  it('contains 5 balanced occult ingredients with descriptions and heat effects', () => {
    const keys = Object.keys(INGREDIENTS);
    assert.equal(keys.length, 5);
    assert.ok(INGREDIENTS.dragon_blood.heatEffect > 0);
    assert.ok(INGREDIENTS.banshee_tears.heatEffect < 0);
    assert.ok(INGREDIENTS.bone_dust.heatEffect === 0);
  });

  it('contains 5 detailed recipes with difficulty tiers and lore', () => {
    assert.equal(POTION_RECIPES.length, 5);
    const supreme = POTION_RECIPES.find((r) => r.id === 'pierre_philosophale');
    assert.ok(supreme);
    assert.equal(supreme.difficulty, 'Maître Occulte');
  });

  it('evaluates a flawless brew with 100% ingredients and optimal temperature', () => {
    const recipe = POTION_RECIPES[0]; // elixir_spectre: 2 banshee_tears, 1 bone_dust, 1 toad_slime. Temp: 25-50
    const ingredients: Record<IngredientType, number> = {
      banshee_tears: 2,
      bone_dust: 1,
      toad_slime: 1,
      dragon_blood: 0,
      hell_ember: 0,
    };
    const heat = 35; // optimal

    const evalResult = evaluatePotionBrew(recipe, ingredients, heat);
    assert.equal(evalResult.success, true);
    assert.ok(evalResult.purityScore >= 90);
    assert.equal(evalResult.rankTitle, "Chef-d'œuvre Hermétique");
    assert.ok(evalResult.pointsEarned > recipe.basePoints);
  });

  it('penalizes temperature extremes and triggers explosion on critical overheating', () => {
    const recipe = POTION_RECIPES[0];
    const ingredients: Record<IngredientType, number> = {
      banshee_tears: 2,
      bone_dust: 1,
      toad_slime: 1,
      dragon_blood: 0,
      hell_ember: 0,
    };

    // Température critique : 99°C
    const explosion = evaluatePotionBrew(recipe, ingredients, 99);
    assert.equal(explosion.success, false);
    assert.equal(explosion.heatStatus, 'critique');
    assert.equal(explosion.rankTitle, 'Catastrophe Alchimique');
    assert.equal(explosion.pointsEarned, 0);
  });

  it('correctly handles incorrect or missing ingredients', () => {
    const recipe = POTION_RECIPES[1]; // philtre_lycanthrope
    const ingredients: Record<IngredientType, number> = {
      banshee_tears: 3, // wrong ingredient
      bone_dust: 0,
      toad_slime: 0,
      dragon_blood: 0,
      hell_ember: 0,
    };

    const failed = evaluatePotionBrew(recipe, ingredients, 60);
    assert.equal(failed.success, false);
    assert.ok(failed.purityScore < 35);
  });
});
