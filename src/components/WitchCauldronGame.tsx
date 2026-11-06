import { getAssetUrl } from '../utils/assetPath';
import React, { useState, useEffect } from 'react';
import {
  Flame,
  Sparkles,
  RotateCcw,
  Trophy,
  AlertTriangle,
  BookOpen,
  ThermometerSnowflake,
  ThermometerSun,
  CheckCircle2,
  XCircle,
  Clock,
  Wind,
} from 'lucide-react';
import {
  INGREDIENTS,
  POTION_RECIPES,
  evaluatePotionBrew,
  IngredientType,
  PotionRecipe,
  BrewEvaluation,
} from '../game/cauldronLogic';
import {
  playPumpkinSquish,
  playGoldenFrenzy,
  playTrapExplosion,
  playTombstoneThud,
  playEctoClick,
  playEvilLaugh,
} from '../audio/sfx';
import { VictorianIronworkCard, VictorianCornerFlourish } from './GothicDecorations';

interface WitchCauldronGameProps {
  onScoreGained?: (points: number) => void;
  highScore: number;
  onUpdateHighScore: (score: number) => void;
}

export const WitchCauldronGame: React.FC<WitchCauldronGameProps> = ({
  onScoreGained,
  highScore,
  onUpdateHighScore,
}) => {
  const [selectedRecipe, setSelectedRecipe] = useState<PotionRecipe>(POTION_RECIPES[0]);
  const [addedIngredients, setAddedIngredients] = useState<Record<IngredientType, number>>({
    dragon_blood: 0,
    bone_dust: 0,
    toad_slime: 0,
    banshee_tears: 0,
    hell_ember: 0,
  });
  const [cauldronHeat, setCauldronHeat] = useState<number>(30); // 0 à 100 °C
  const [isBrewing, setIsBrewing] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<BrewEvaluation | null>(null);
  const [totalAlchemyScore, setTotalAlchemyScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('spookybeats_cauldron_score') || '0', 10);
  });
  const [potionsBrewedCount, setPotionsBrewedCount] = useState<number>(0);
  const [bubbleAnimation, setBubbleAnimation] = useState<boolean>(false);

  // Dissipation naturelle de la chaleur si aucune braise n'est attisée
  useEffect(() => {
    if (evaluation) return;
    const interval = setInterval(() => {
      setCauldronHeat((prev) => {
        if (prev > 20) return Math.max(20, prev - 1);
        return prev;
      });
    }, 1800);
    return () => clearInterval(interval);
  }, [evaluation]);

  const handleAddIngredient = (type: IngredientType) => {
    if (evaluation) return;
    playEctoClick();
    setBubbleAnimation(true);
    setTimeout(() => setBubbleAnimation(false), 600);

    const ing = INGREDIENTS[type];
    setAddedIngredients((prev) => ({
      ...prev,
      [type]: (prev[type] || 0) + 1,
    }));

    // Impact sur la température
    setCauldronHeat((h) => Math.min(100, Math.max(0, h + ing.heatEffect)));
  };

  const handleAdjustHeat = (delta: number) => {
    if (evaluation) return;
    if (delta > 0) {
      playPumpkinSquish();
    } else {
      playEctoClick();
    }
    setCauldronHeat((h) => Math.min(100, Math.max(0, h + delta)));
  };

  const handleResetIngredients = () => {
    playEctoClick();
    setAddedIngredients({
      dragon_blood: 0,
      bone_dust: 0,
      toad_slime: 0,
      banshee_tears: 0,
      hell_ember: 0,
    });
    setCauldronHeat(30);
    setEvaluation(null);
  };

  const handleFinishBrew = () => {
    setIsBrewing(true);
    playEctoClick();

    setTimeout(() => {
      const result = evaluatePotionBrew(selectedRecipe, addedIngredients, cauldronHeat);
      setEvaluation(result);
      setIsBrewing(false);

      if (result.success) {
        playGoldenFrenzy(true);
        const newTotal = totalAlchemyScore + result.pointsEarned;
        setTotalAlchemyScore(newTotal);
        localStorage.setItem('spookybeats_cauldron_score', newTotal.toString());
        setPotionsBrewedCount((c) => c + 1);
        if (newTotal > highScore) onUpdateHighScore(newTotal);
        if (onScoreGained) onScoreGained(result.pointsEarned);
      } else {
        if (result.heatStatus === 'critique') {
          playTrapExplosion(true);
        } else {
          playTombstoneThud();
        }
      }
    }, 850);
  };

  const isHeatOptimal =
    cauldronHeat >= selectedRecipe.optimalHeatMin && cauldronHeat <= selectedRecipe.optimalHeatMax;

  return (
    <div className="flex flex-col gap-4">
      {/* Bannière d'Ambiance de Laboratoire Alchimique */}
      <div className="relative rounded-2xl overflow-hidden border border-[#6A0DAD]/60 shadow-[0_0_30px_rgba(106,13,173,0.3)]">
        <div className="h-44 sm:h-52 w-full relative">
          <img
            src={getAssetUrl('assets/games/witch_cauldron.jpg')}
            alt="Laboratoire Alchimique de la Sorcière"
            className="w-full h-full object-cover object-center filter brightness-90 contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0B]/80 via-transparent to-[#0B0B0B]/80" />

          {/* En-tête textuel dans la bannière */}
          <div className="absolute bottom-3 left-4 right-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#39FF14] font-bold">
                  ★ ALCHIMIE D'HALLOWEEN ★
                </span>
                <span className="text-xs text-[#8C8494]">·</span>
                <span className="text-[10px] font-mono text-[#DFB7FF]">
                  {potionsBrewedCount} décoctions réussies
                </span>
              </div>
              <h3 className="font-syne font-extrabold text-xl sm:text-2xl text-[#E6E1DC]">
                Le Chaudron d'Awen de la Sorcière
              </h3>
              <p className="text-[11px] font-mono text-[#A89CAE] max-w-lg mt-0.5 hidden xs:block">
                Dosez les sucs occultes, régulez la flamme d'obsidienne et distillez les élixirs légendaires de Samhain.
              </p>
            </div>

            <div className="bg-[#0B0B0B]/90 border border-[#39FF14]/50 rounded-xl px-3 py-1.5 flex items-center gap-2.5 backdrop-blur-md">
              <Trophy className="w-4 h-4 text-[#FF7518]" />
              <div>
                <span className="text-[9px] font-mono text-[#8C8494] block uppercase">Magie Alchimique</span>
                <span className="font-syne font-black text-sm sm:text-base text-[#39FF14] text-glow-ectoplasm">
                  {totalAlchemyScore.toLocaleString()} PTS
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sélecteur de Recettes Occultes */}
      <VictorianIronworkCard highlightGlow="purple" className="p-3 sm:p-4">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#FF7518]" />
            <h4 className="font-syne font-bold text-sm text-[#E6E1DC] tracking-wide">
              Grimoire des Formules Hermétiques
            </h4>
          </div>
          <span className="text-[10px] font-mono text-[#8C8494]">
            Difficulté : <strong className="text-[#DFB7FF]">{selectedRecipe.difficulty}</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {POTION_RECIPES.map((recipe) => {
            const isSelected = selectedRecipe.id === recipe.id;
            return (
              <button
                key={recipe.id}
                onClick={() => {
                  playEctoClick();
                  setSelectedRecipe(recipe);
                  handleResetIngredients();
                }}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#1C0E28] border-[#DFB7FF] shadow-[0_0_15px_rgba(168,85,247,0.4)] scale-[1.02]'
                    : 'bg-[#120A1A]/70 border-[#6A0DAD]/40 hover:border-[#DFB7FF]/60 opacity-80 hover:opacity-100'
                }`}
              >
                <div>
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-full mb-1.5"
                    style={{ backgroundColor: recipe.color, boxShadow: `0 0 8px ${recipe.color}` }}
                  />
                  <h5 className="font-syne font-bold text-xs text-[#E6E1DC] leading-snug line-clamp-1">
                    {recipe.name}
                  </h5>
                  <p className="text-[9px] font-mono text-[#8C8494] line-clamp-1 mt-0.5">
                    {recipe.subtitle}
                  </p>
                </div>
                <div className="mt-2 pt-1 border-t border-[#6A0DAD]/30 flex items-center justify-between text-[9px] font-mono">
                  <span className="text-[#39FF14]">+{recipe.basePoints} pts</span>
                  <span className="text-[#8C8494]">{recipe.optimalHeatMin}-{recipe.optimalHeatMax}°C</span>
                </div>
              </button>
            );
          })}
        </div>
      </VictorianIronworkCard>

      {/* Atelier Central : Le Chaudron & Les Ingrédients */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Colonne Gauche : Étagère d'Ingrédients Mystiques */}
        <div className="md:col-span-5 flex flex-col gap-2">
          <VictorianIronworkCard highlightGlow="none" className="p-3 sm:p-4 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-syne font-bold text-[#E6E1DC] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#39FF14]" />
                  Étagère de l'Herboriste
                </span>
                <span className="text-[10px] font-mono text-[#8C8494]">Cliquez pour verser</span>
              </div>

              {/* Liste des ingrédients */}
              <div className="flex flex-col gap-2">
                {(Object.keys(INGREDIENTS) as IngredientType[]).map((type) => {
                  const ing = INGREDIENTS[type];
                  const currentCount = addedIngredients[type] || 0;
                  const targetCount = selectedRecipe.targetIngredients[type] || 0;
                  const isRequired = targetCount > 0;

                  return (
                    <button
                      key={type}
                      onClick={() => handleAddIngredient(type)}
                      disabled={!!evaluation}
                      className={`p-2 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                        isRequired
                          ? 'bg-[#140A1E]/80 border-[#6A0DAD]/60 hover:border-[#39FF14] hover:bg-[#1E0F2E]'
                          : 'bg-[#0E0715]/60 border-[#2E183E]/60 hover:border-red-500/50 hover:bg-[#1A0A10]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl filter drop-shadow select-none">{ing.icon}</span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className={`text-xs font-syne font-bold ${ing.textColor}`}>
                              {ing.name}
                            </span>
                            {isRequired && (
                              <span className="text-[9px] font-mono text-[#FF7518] font-bold">
                                (Requis : {targetCount})
                              </span>
                            )}
                          </div>
                          <span className="text-[9px] font-mono text-[#8C8494] block italic">
                            {ing.latinName} · Effet therm. : {ing.heatEffect >= 0 ? `+${ing.heatEffect}°` : `${ing.heatEffect}°`}
                          </span>
                        </div>
                      </div>

                      {/* Compteur dans le chaudron */}
                      <div className="flex items-center gap-1">
                        <span
                          className={`font-mono text-xs font-bold px-2 py-0.5 rounded-lg border ${
                            currentCount === targetCount && isRequired
                              ? 'bg-[#39FF14]/20 border-[#39FF14] text-[#39FF14]'
                              : currentCount > targetCount
                              ? 'bg-red-900/30 border-red-500 text-red-400'
                              : 'bg-[#0B0B0B] border-[#6A0DAD]/40 text-[#E6E1DC]'
                          }`}
                        >
                          x{currentCount}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-[#6A0DAD]/30 flex justify-between items-center">
              <button
                onClick={handleResetIngredients}
                className="px-3 py-1.5 rounded-lg bg-[#140A1E] hover:bg-[#201030] border border-[#6A0DAD]/50 text-[11px] font-mono text-[#DFB7FF] flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                Vider le chaudron
              </button>

              <span className="text-[10px] font-mono text-[#8C8494]">
                Total sucs : {Object.values(addedIngredients).reduce((a, b) => a + b, 0)}
              </span>
            </div>
          </VictorianIronworkCard>
        </div>

        {/* Colonne Droite : Le Chaudron En Action & Thermomètre */}
        <div className="md:col-span-7 flex flex-col gap-3">
          <VictorianIronworkCard highlightGlow="green" className="p-4 sm:p-5 flex flex-col items-center justify-between relative overflow-hidden">
            <VictorianCornerFlourish position="top-left" color="#39FF14" />
            <VictorianCornerFlourish position="top-right" color="#39FF14" />

            {/* Titre de la formule sélectionnée */}
            <div className="text-center mb-2 w-full">
              <span className="text-[9px] font-mono uppercase tracking-widest text-[#FF7518] block">
                Formule en cours de distillation
              </span>
              <h4 className="font-syne font-extrabold text-lg text-[#E6E1DC]">
                {selectedRecipe.name}
              </h4>
              <p className="text-[10px] font-mono text-[#8C8494] max-w-sm mx-auto">
                {selectedRecipe.lore}
              </p>
            </div>

            {/* Représentation Visuelle Stylisée du Chaudron */}
            <div className="relative my-2 w-52 h-44 flex items-center justify-center">
              {/* Vapeur / Bulles animées */}
              <div
                className={`absolute -top-6 w-32 h-16 rounded-full blur-xl transition-all duration-700 pointer-events-none ${
                  bubbleAnimation ? 'opacity-90 scale-125' : 'opacity-50 scale-100'
                }`}
                style={{ backgroundColor: selectedRecipe.color }}
              />

              {/* Corps du Chaudron en Fonte avec Gravures Celtiques */}
              <div className="relative w-44 h-36">
                {/* Flammes d'obsidienne sous le chaudron */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center justify-center gap-1">
                  <Flame
                    className={`w-6 h-6 transition-all duration-300 ${
                      cauldronHeat > 70
                        ? 'text-orange-500 animate-pulse scale-125 filter drop-shadow-[0_0_8px_#f97316]'
                        : cauldronHeat > 35
                        ? 'text-yellow-500 scale-100'
                        : 'text-blue-400 scale-75 opacity-70'
                    }`}
                  />
                  <Flame
                    className={`w-8 h-8 transition-all duration-300 ${
                      cauldronHeat > 70
                        ? 'text-red-500 animate-bounce scale-125 filter drop-shadow-[0_0_12px_#ef4444]'
                        : cauldronHeat > 35
                        ? 'text-orange-500 scale-100'
                        : 'text-cyan-400 scale-75 opacity-70'
                    }`}
                  />
                  <Flame
                    className={`w-6 h-6 transition-all duration-300 ${
                      cauldronHeat > 70
                        ? 'text-orange-500 animate-pulse scale-125 filter drop-shadow-[0_0_8px_#f97316]'
                        : cauldronHeat > 35
                        ? 'text-yellow-500 scale-100'
                        : 'text-blue-400 scale-75 opacity-70'
                    }`}
                  />
                </div>

                {/* SVG du Chaudron Victorien */}
                <svg viewBox="0 0 200 160" className="w-full h-full filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
                  {/* Pieds en fer forgé */}
                  <path d="M 40 140 Q 30 155 20 158" stroke="#3A2A48" strokeWidth="8" strokeLinecap="round" fill="none" />
                  <path d="M 160 140 Q 170 155 180 158" stroke="#3A2A48" strokeWidth="8" strokeLinecap="round" fill="none" />
                  <path d="M 100 145 Q 100 158 100 160" stroke="#3A2A48" strokeWidth="8" strokeLinecap="round" fill="none" />

                  {/* Cuve ventrue */}
                  <ellipse cx="100" cy="90" rx="80" ry="55" fill="#1C1224" stroke="#4C2A68" strokeWidth="4" />
                  
                  {/* Ornements gravés sur le chaudron */}
                  <circle cx="100" cy="95" r="24" stroke="#6A0DAD" strokeWidth="2" strokeDasharray="3 3" fill="none" />
                  <path d="M 100 80 L 100 110 M 85 95 L 115 95" stroke="#DFB7FF" strokeWidth="1.5" opacity="0.6" />

                  {/* Col et rebord du chaudron */}
                  <ellipse cx="100" cy="45" rx="72" ry="16" fill="#281A34" stroke="#6A0DAD" strokeWidth="4" />

                  {/* Liquide magique bouillonnant */}
                  <ellipse
                    cx="100"
                    cy="45"
                    rx="64"
                    ry="13"
                    fill={selectedRecipe.color}
                    className="filter drop-shadow-[0_0_12px_currentColor]"
                    opacity="0.85"
                  />

                  {/* Bulles flottantes dans le liquide */}
                  <circle cx="85" cy="44" r="3" fill="#FFFFFF" opacity="0.7" className="animate-ping" />
                  <circle cx="115" cy="46" r="2.5" fill="#FFFFFF" opacity="0.8" className="animate-pulse" />
                  <circle cx="100" cy="43" r="4" fill="#FFFFFF" opacity="0.6" className="animate-bounce" />

                  {/* Anses en fer */}
                  <path d="M 28 50 C 10 50 10 80 28 80" stroke="#4C2A68" strokeWidth="4" fill="none" />
                  <path d="M 172 50 C 190 50 190 80 172 80" stroke="#4C2A68" strokeWidth="4" fill="none" />
                </svg>
              </div>
            </div>

            {/* Jauge de Température du Chaudron */}
            <div className="w-full max-w-md bg-[#0B0B0B]/80 border border-[#6A0DAD]/40 rounded-xl p-3 my-2">
              <div className="flex justify-between items-center mb-1 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-[#8C8494]">
                  <ThermometerSun className="w-3.5 h-3.5 text-orange-400" />
                  Température du Breuvage :
                </span>
                <span
                  className={`font-bold font-syne ${
                    isHeatOptimal
                      ? 'text-[#39FF14]'
                      : cauldronHeat > selectedRecipe.optimalHeatMax
                      ? 'text-red-400 animate-pulse'
                      : 'text-cyan-400'
                  }`}
                >
                  {cauldronHeat}°C · {isHeatOptimal ? 'OPTIMALE' : cauldronHeat < selectedRecipe.optimalHeatMin ? 'TROP TIÈDE' : 'SURCHAUFFE'}
                </span>
              </div>

              {/* Barre de progression avec zone optimale marquée */}
              <div className="relative h-4 bg-[#140A1E] rounded-full overflow-hidden border border-[#6A0DAD]/50">
                {/* Zone optimale surlignée en vert */}
                <div
                  className="absolute top-0 bottom-0 bg-[#39FF14]/25 border-x border-[#39FF14]"
                  style={{
                    left: `${selectedRecipe.optimalHeatMin}%`,
                    width: `${selectedRecipe.optimalHeatMax - selectedRecipe.optimalHeatMin}%`,
                  }}
                />

                {/* Niveau actuel de chaleur */}
                <div
                  className={`h-full transition-all duration-300 ${
                    cauldronHeat >= 95
                      ? 'bg-red-600 animate-pulse'
                      : isHeatOptimal
                      ? 'bg-gradient-to-r from-emerald-500 to-[#39FF14]'
                      : cauldronHeat < selectedRecipe.optimalHeatMin
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-400'
                      : 'bg-gradient-to-r from-orange-500 to-red-500'
                  }`}
                  style={{ width: `${cauldronHeat}%` }}
                />
              </div>

              {/* Contrôles du Soufflet & Glaçon */}
              <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-[#6A0DAD]/20">
                <button
                  onClick={() => handleAdjustHeat(-10)}
                  disabled={cauldronHeat <= 0 || !!evaluation}
                  className="px-2.5 py-1 rounded-lg bg-[#0E1726] hover:bg-[#16243C] border border-cyan-500/40 text-[10px] font-mono text-cyan-300 flex items-center gap-1 cursor-pointer"
                >
                  <ThermometerSnowflake className="w-3 h-3" />
                  Refroidir (-10°C)
                </button>

                <span className="text-[10px] font-mono text-[#8C8494]">
                  Cible : {selectedRecipe.optimalHeatMin}-{selectedRecipe.optimalHeatMax}°C
                </span>

                <button
                  onClick={() => handleAdjustHeat(+15)}
                  disabled={cauldronHeat >= 100 || !!evaluation}
                  className="px-2.5 py-1 rounded-lg bg-[#26120E] hover:bg-[#3C1C16] border border-orange-500/40 text-[10px] font-mono text-orange-400 flex items-center gap-1 cursor-pointer"
                >
                  <Flame className="w-3 h-3" />
                  Attiser (+15°C)
                </button>
              </div>
            </div>

            {/* Bouton de Scellement / Fin de Décoction */}
            {!evaluation ? (
              <button
                onClick={handleFinishBrew}
                disabled={isBrewing}
                className={`w-full max-w-md py-3 rounded-xl font-syne font-extrabold text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 shadow-[0_0_20px_rgba(57,255,20,0.3)] ${
                  isBrewing
                    ? 'bg-[#2E183E] text-[#8C8494]'
                    : 'bg-gradient-to-r from-[#39FF14] to-[#79FF5B] hover:brightness-110 text-black border border-[#A5FFA0]'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>{isBrewing ? 'INCANTATION DU BREUVAGE EN COURS...' : 'SCELLER ET DISTILLER LA POTION'}</span>
              </button>
            ) : (
              /* Rapport d'évaluation du breuvage */
              <div
                className={`w-full max-w-md p-4 rounded-xl border text-center transition-all animate-fadeIn ${
                  evaluation.success
                    ? 'bg-[#0E2610]/90 border-[#39FF14] shadow-[0_0_25px_rgba(57,255,20,0.3)]'
                    : 'bg-[#280808]/90 border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.3)]'
                }`}
              >
                <div className="flex items-center justify-center gap-2 mb-1">
                  {evaluation.success ? (
                    <CheckCircle2 className="w-5 h-5 text-[#39FF14]" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400" />
                  )}
                  <h5 className="font-syne font-bold text-base text-[#E6E1DC]">
                    {evaluation.rankTitle}
                  </h5>
                </div>

                <p className="text-xs font-mono text-[#E6E1DC] mb-2">{evaluation.feedback}</p>

                <div className="flex justify-around items-center py-2 px-3 rounded-lg bg-[#0B0B0B]/70 border border-[#6A0DAD]/40 text-xs font-mono mb-3">
                  <div>
                    <span className="text-[9px] text-[#8C8494] block uppercase">Pureté Occulte</span>
                    <span className="font-syne font-black text-sm text-[#DFB7FF]">
                      {evaluation.purityScore}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-[#8C8494] block uppercase">Points Gagnés</span>
                    <span className="font-syne font-black text-sm text-[#39FF14] text-glow-ectoplasm">
                      +{evaluation.pointsEarned} PTS
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleResetIngredients}
                  className="px-5 py-2 rounded-lg bg-[#FF7518] hover:bg-[#ff8b38] text-black font-syne font-bold text-xs tracking-wider cursor-pointer shadow-[0_0_12px_rgba(255,117,24,0.4)]"
                >
                  BREUVER UNE NOUVELLE POTION
                </button>
              </div>
            )}
          </VictorianIronworkCard>
        </div>
      </div>
    </div>
  );
};
