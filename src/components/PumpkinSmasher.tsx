import { getAssetUrl } from '../utils/assetPath';
import React, { useState, useEffect, useRef } from 'react';
import {
  Skull,
  Flame,
  Sparkles,
  Zap,
  RotateCcw,
  Share2,
  Trophy,
  Ghost,
  AlertTriangle,
  Hourglass,
} from 'lucide-react';
import {
  processHit,
  getNecromancerRank,
  generateSpawn,
  formatGameTime,
  SpawnItem,
  ItemType,
} from '../game/pumpkinGameLogic';
import {
  playPumpkinSquish,
  playGhostHowl,
  playGoldenFrenzy,
  playTrapExplosion,
  playTombstoneThud,
  playEvilLaugh,
  playEctoClick,
  playMp3Sfx,
} from '../audio/sfx';
import { TrackMetadata } from '../audio/audioEngine';
import { VictorianIronworkCard, VictorianCornerFlourish } from './GothicDecorations';

interface PumpkinSmasherProps {
  isPlaying: boolean;
  onStartTrack4: (track: TrackMetadata) => void;
  gameTrack: TrackMetadata;
  highScore: number;
  onUpdateHighScore: (score: number) => void;
}

interface FloatingText {
  id: string;
  text: string;
  position: number;
  color: string;
}

export const PumpkinSmasher: React.FC<PumpkinSmasherProps> = ({
  isPlaying,
  onStartTrack4,
  gameTrack,
  highScore,
  onUpdateHighScore,
}) => {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [multiplier, setMultiplier] = useState<number>(1);
  const [timeLeft, setTimeLeft] = useState<number>(45); // 45 secondes de rituel
  const [activeItems, setActiveItems] = useState<SpawnItem[]>([]);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [isFrenzy, setIsFrenzy] = useState<boolean>(false);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  const spawnTimerRef = useRef<NodeJS.Timeout | null>(null);
  const gameClockRef = useRef<NodeJS.Timeout | null>(null);

  // Démarrage du jeu
  const startGame = () => {
    playEvilLaugh();
    if (!isPlaying) {
      onStartTrack4(gameTrack);
    }
    setScore(0);
    setCombo(0);
    setMultiplier(1);
    setTimeLeft(45);
    setActiveItems([]);
    setFloatingTexts([]);
    setIsFrenzy(false);
    setGameState('playing');
  };

  // Boucle de jeu (compte à rebours)
  useEffect(() => {
    if (gameState !== 'playing') return;

    gameClockRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (gameClockRef.current) clearInterval(gameClockRef.current);
    };
  }, [gameState, score]);

  // Génération des citrouilles & monstres
  useEffect(() => {
    if (gameState !== 'playing') return;

    const spawnInterval = isFrenzy ? 450 : 650;

    spawnTimerRef.current = setInterval(() => {
      setActiveItems((currentItems) => {
        const occupied = currentItems.map((i) => i.position);
        if (occupied.length >= 6) return currentItems; // Max 6 sur la grille

        const newSpawn = generateSpawn(occupied, isFrenzy ? 3 : 1);
        if (!newSpawn) return currentItems;

        // Auto-expiration de l'item après sa durée
        setTimeout(() => {
          setActiveItems((prev) => prev.filter((item) => item.id !== newSpawn.id));
        }, newSpawn.durationMs);

        return [...currentItems, newSpawn];
      });
    }, spawnInterval);

    return () => {
      if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
    };
  }, [gameState, isFrenzy]);

  const endGame = () => {
    playTombstoneThud();
    setGameState('gameover');
    if (score > highScore) {
      onUpdateHighScore(score);
    }
    if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
    if (gameClockRef.current) clearInterval(gameClockRef.current);
  };

  const handleCellClick = (position: number) => {
    if (gameState !== 'playing') return;

    const targetItem = activeItems.find((item) => item.position === position);

    if (!targetItem) {
      // Clic dans le vide : brise le combo
      if (combo > 0) setCombo(0);
      return;
    }

    // Effet sonore spécifique
    if (targetItem.type === 'pumpkin') {
      playPumpkinSquish();
    } else if (targetItem.type === 'ghost') {
      playGhostHowl();
    } else if (targetItem.type === 'golden_pumpkin') {
      playGoldenFrenzy();
    } else if (targetItem.type === 'trap') {
      playTrapExplosion();
    } else if (targetItem.type === 'hourglass') {
      playMp3Sfx('single-church-bell.mp3', true);
    } else if (targetItem.type === 'blood_pumpkin') {
      playMp3Sfx('monster-growl-roar-scary.mp3', true);
    }

    // Traitement du coup
    const result = processHit(score, combo, targetItem.type);
    setScore(result.newScore);
    setCombo(result.newCombo);
    setMultiplier(result.multiplier);
    setIsFrenzy(result.isFrenzy);

    if (result.timeBonusSeconds) {
      setTimeLeft((t) => Math.min(60, t + result.timeBonusSeconds!));
    }

    if (result.newScore > highScore) {
      onUpdateHighScore(result.newScore);
    }

    // Texte flottant de score
    const floatId = `float-${Date.now()}-${Math.random()}`;
    const color =
      targetItem.type === 'trap'
        ? '#FF4444'
        : targetItem.type === 'golden_pumpkin'
        ? '#FFD700'
        : targetItem.type === 'ghost'
        ? '#39FF14'
        : targetItem.type === 'hourglass'
        ? '#38BDF8'
        : targetItem.type === 'blood_pumpkin'
        ? '#EF4444'
        : '#FF7518';

    const text =
      targetItem.type === 'trap'
        ? '-200 PIÈGE'
        : targetItem.type === 'hourglass'
        ? `+${result.pointsEarned} (+5s !)`
        : targetItem.type === 'blood_pumpkin'
        ? `+${result.pointsEarned} SANG !`
        : `+${result.pointsEarned}`;

    setFloatingTexts((prev) => [
      ...prev,
      {
        id: floatId,
        text,
        position,
        color,
      },
    ]);

    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((f) => f.id !== floatId));
    }, 800);

    // Retirer l'item touché
    setActiveItems((prev) => prev.filter((i) => i.id !== targetItem.id));
  };

  const handleShare = () => {
    playEctoClick();
    const rank = getNecromancerRank(score);
    const text = `🎃 J'ai accompli le massacre avec ${score.toLocaleString()} PTS sur SpookyBeats ! Rang : ${rank.title}. Relèveras-tu le défi ?`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  const rank = getNecromancerRank(score);
  const timeProgress = (timeLeft / 45) * 100;

  // Rendu graphique d'un item riche en SVG
  const renderItemGraphics = (type: ItemType) => {
    switch (type) {
      case 'pumpkin':
        return (
          <div className="flex flex-col items-center justify-center animate-scaleIn">
            <svg viewBox="0 0 100 100" className="w-12 h-12 filter drop-shadow-[0_0_12px_#FF7518]">
              {/* Tige de la citrouille */}
              <path d="M 50 15 C 48 5 56 2 54 0 C 46 2 44 8 46 15" fill="#166534" />
              {/* Corps orangé côtelé */}
              <ellipse cx="50" cy="55" rx="42" ry="34" fill="#EA580C" />
              <ellipse cx="50" cy="55" rx="30" ry="34" fill="#F97316" />
              <ellipse cx="50" cy="55" rx="16" ry="34" fill="#FB923C" />
              {/* Yeux triangulaires maléfiques illuminés */}
              <polygon points="32,46 44,46 38,36" fill="#FEF08A" />
              <polygon points="56,46 68,46 62,36" fill="#FEF08A" />
              <polygon points="50,50 46,56 54,56" fill="#FEF08A" />
              {/* Bouche découpée en dents de scie avec lueur jaune */}
              <path d="M 28 65 L 34 68 L 40 64 L 46 69 L 52 64 L 58 69 L 64 64 L 72 66 L 68 73 L 60 72 L 54 75 L 48 72 L 42 75 L 36 71 Z" fill="#FEF08A" />
            </svg>
            <span className="text-[9px] font-mono font-bold text-[#FF7518] uppercase tracking-wider mt-0.5">
              +100
            </span>
          </div>
        );

      case 'golden_pumpkin':
        return (
          <div className="flex flex-col items-center justify-center animate-scaleIn">
            <svg viewBox="0 0 100 100" className="w-12 h-12 filter drop-shadow-[0_0_16px_#FACC15]">
              {/* Rayons solaires */}
              <circle cx="50" cy="50" r="46" fill="none" stroke="#FDE047" strokeWidth="1.5" strokeDasharray="4 4" className="animate-spin-slow" />
              {/* Tige dorée */}
              <path d="M 50 15 C 48 5 56 2 54 0 C 46 2 44 8 46 15" fill="#CA8A04" />
              {/* Corps or flamboyant */}
              <ellipse cx="50" cy="55" rx="42" ry="34" fill="#CA8A04" />
              <ellipse cx="50" cy="55" rx="30" ry="34" fill="#EAB308" />
              <ellipse cx="50" cy="55" rx="16" ry="34" fill="#FDE047" />
              {/* Yeux et bouche incandescents blancs */}
              <polygon points="32,46 44,46 38,36" fill="#FFFFFF" />
              <polygon points="56,46 68,46 62,36" fill="#FFFFFF" />
              <path d="M 28 65 L 40 64 L 50 68 L 60 64 L 72 65 L 68 73 L 50 76 L 32 72 Z" fill="#FFFFFF" />
            </svg>
            <span className="text-[8px] font-mono font-black text-[#FACC15] uppercase tracking-wider mt-0.5">
              +500 FRENZY
            </span>
          </div>
        );

      case 'ghost':
        return (
          <div className="flex flex-col items-center justify-center animate-scaleIn">
            <svg viewBox="0 0 100 100" className="w-12 h-12 filter drop-shadow-[0_0_14px_#39FF14]">
              {/* Corps spectral ondulant */}
              <path
                d="M 28 50 C 28 25 72 25 72 50 C 72 75 66 85 62 82 C 58 79 54 86 50 82 C 46 78 42 86 38 82 C 34 78 28 85 28 50 Z"
                fill="#86EFAC"
                opacity="0.9"
              />
              {/* Bras éthérés */}
              <path d="M 28 52 Q 15 48 22 40" stroke="#86EFAC" strokeWidth="5" strokeLinecap="round" fill="none" />
              <path d="M 72 52 Q 85 48 78 40" stroke="#86EFAC" strokeWidth="5" strokeLinecap="round" fill="none" />
              {/* Yeux creux d'outre-tombe */}
              <ellipse cx="42" cy="42" rx="4" ry="6" fill="#0B0B0B" />
              <ellipse cx="58" cy="42" rx="4" ry="6" fill="#0B0B0B" />
              {/* Bouche hurlante */}
              <ellipse cx="50" cy="56" rx="5" ry="8" fill="#0B0B0B" />
            </svg>
            <span className="text-[9px] font-mono font-bold text-[#39FF14] uppercase tracking-wider mt-0.5">
              +200 SPECTRE
            </span>
          </div>
        );

      case 'hourglass':
        return (
          <div className="flex flex-col items-center justify-center animate-scaleIn">
            <svg viewBox="0 0 100 100" className="w-12 h-12 filter drop-shadow-[0_0_14px_#38BDF8]">
              {/* Monture en bronze */}
              <rect x="25" y="15" width="50" height="6" rx="2" fill="#0284C7" />
              <rect x="25" y="79" width="50" height="6" rx="2" fill="#0284C7" />
              {/* Verre sablier */}
              <path d="M 32 21 L 68 21 L 53 48 L 53 52 L 68 79 L 32 79 L 47 52 L 47 48 Z" fill="#0C4A6E" stroke="#38BDF8" strokeWidth="2" />
              {/* Sable bleu céleste */}
              <polygon points="36,25 64,25 50,45" fill="#38BDF8" />
              <polygon points="42,76 58,76 50,60" fill="#38BDF8" />
            </svg>
            <span className="text-[8px] font-mono font-bold text-[#38BDF8] uppercase tracking-wider mt-0.5">
              +5s TEMPS
            </span>
          </div>
        );

      case 'blood_pumpkin':
        return (
          <div className="flex flex-col items-center justify-center animate-scaleIn">
            <svg viewBox="0 0 100 100" className="w-12 h-12 filter drop-shadow-[0_0_16px_#DC2626]">
              {/* Cornes démoniaques */}
              <path d="M 35 25 Q 25 10 18 12 Q 22 24 32 30" fill="#991B1B" />
              <path d="M 65 25 Q 75 10 82 12 Q 78 24 68 30" fill="#991B1B" />
              {/* Corps carmin */}
              <ellipse cx="50" cy="58" rx="40" ry="32" fill="#991B1B" />
              <ellipse cx="50" cy="58" rx="28" ry="32" fill="#DC2626" />
              <ellipse cx="50" cy="58" rx="14" ry="32" fill="#EF4444" />
              {/* Yeux rougeoyants sanglants */}
              <polygon points="34,48 44,48 38,40" fill="#FEE2E2" />
              <polygon points="56,48 66,48 62,40" fill="#FEE2E2" />
              {/* Gouttes de sang */}
              <circle cx="50" cy="85" r="3" fill="#DC2626" className="animate-ping" />
            </svg>
            <span className="text-[8px] font-mono font-black text-[#EF4444] uppercase tracking-wider mt-0.5">
              +600 SANG
            </span>
          </div>
        );

      case 'trap':
        return (
          <div className="flex flex-col items-center justify-center animate-scaleIn">
            <svg viewBox="0 0 100 100" className="w-12 h-12 filter drop-shadow-[0_0_14px_#EF4444]">
              {/* Mâchoire du piège en fer dentelé */}
              <ellipse cx="50" cy="50" rx="40" ry="25" fill="#450A0A" stroke="#DC2626" strokeWidth="3" />
              <path d="M 15 50 L 25 38 L 35 50 L 45 38 L 55 50 L 65 38 L 75 50 L 85 38" stroke="#EF4444" strokeWidth="3" fill="none" />
              <path d="M 15 50 L 25 62 L 35 50 L 45 62 L 55 50 L 65 62 L 75 50 L 85 62" stroke="#EF4444" strokeWidth="3" fill="none" />
              {/* Crâne de mise en garde au centre */}
              <circle cx="50" cy="50" r="12" fill="#F87171" />
              <circle cx="46" cy="48" r="2.5" fill="#000000" />
              <circle cx="54" cy="48" r="2.5" fill="#000000" />
            </svg>
            <span className="text-[8px] font-mono font-black text-red-400 uppercase tracking-wider mt-0.5 animate-pulse">
              PIÈGE MORTEL !
            </span>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col gap-4 animate-fadeIn select-none">
      {/* Bannière Graphique Somptueuse du Cimetière aux Citrouilles */}
      <div className="relative rounded-2xl overflow-hidden border border-[#FF7518]/60 shadow-[0_0_30px_rgba(255,117,24,0.3)]">
        <div className="h-44 sm:h-52 w-full relative">
          <img
            src={getAssetUrl('assets/games/pumpkin_graveyard.jpg')}
            alt="Cimetière Hanté de Citrouilles"
            className="w-full h-full object-cover object-center filter brightness-90 contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0B]/80 via-transparent to-[#0B0B0B]/80" />

          {/* En-tête textuel dans la bannière */}
          <div className="absolute bottom-3 left-4 right-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#FF7518] font-bold">
                  ★ JEU DE RÉFLEXE D'HALLOWEEN ★
                </span>
                <span className="text-xs text-[#8C8494]">·</span>
                <span className="text-[10px] font-mono text-[#39FF14]">
                  Rang : {rank.title}
                </span>
              </div>
              <h3 className="font-syne font-extrabold text-xl sm:text-2xl text-[#E6E1DC]">
                Le Massacre de Citrouilles
              </h3>
              <p className="text-[11px] font-mono text-[#A89CAE] max-w-lg mt-0.5 hidden xs:block">
                Écrasez les Jack-o'-Lanterns et les âmes errantes avant qu'elles ne s'évaporent dans le brouillard.
              </p>
            </div>

            <div className="bg-[#0B0B0B]/90 border border-[#FF7518]/50 rounded-xl px-3 py-1.5 flex items-center gap-2.5 backdrop-blur-md">
              <Trophy className="w-4 h-4 text-[#FF7518]" />
              <div>
                <span className="text-[9px] font-mono text-[#8C8494] block uppercase">Record de la Crypte</span>
                <span className="font-syne font-black text-sm sm:text-base text-[#FF7518] text-glow-pumpkin">
                  {highScore.toLocaleString()} PTS
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tableau de Bord : Score, Combo & Sablier */}
      <VictorianIronworkCard highlightGlow="orange" className="p-3.5">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] font-mono tracking-widest text-[#8C8494] uppercase">
            Score du Sacrifice
          </span>
          {combo > 1 && (
            <span className="text-[10px] font-mono font-bold text-[#FF7518] text-glow-pumpkin animate-pulse">
              COMBO x{multiplier} SURNATUREL ! (+{Math.round((multiplier - 1) * 100)}%)
            </span>
          )}
        </div>

        <div className="flex items-baseline justify-between">
          <div className="font-syne font-extrabold text-2xl sm:text-3xl text-[#FF7518] text-glow-pumpkin">
            {score.toLocaleString()}{' '}
            <span className="text-xs font-mono text-[#8C8494]">PTS</span>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-mono text-[#39FF14] text-glow-ectoplasm block">
              Sablier d'Ectoplasme
            </span>
            <span className="text-base font-mono font-bold text-[#E6E1DC]">
              {formatGameTime(timeLeft)}
            </span>
          </div>
        </div>

        {/* Barre de temps d'ectoplasme */}
        <div className="w-full h-2.5 bg-[#1C1424] rounded-full overflow-hidden mt-2 border border-[#6A0DAD]/40">
          <div
            className={`h-full transition-all duration-300 ${
              timeLeft < 10
                ? 'bg-red-500 shadow-[0_0_12px_#ef4444]'
                : isFrenzy
                ? 'bg-[#39FF14] shadow-[0_0_12px_#39FF14]'
                : 'bg-gradient-to-r from-[#6A0DAD] via-[#FF7518] to-[#FF9030]'
            }`}
            style={{ width: `${timeProgress}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-[9px] font-mono text-[#8C8494] mt-1.5">
          <span>ZONE FUNÉRAIRE NO. 13</span>
          <span className="text-[#39FF14]">FRENZY MULTIPLICATEUR ACTIF •</span>
        </div>
      </VictorianIronworkCard>

      {/* Grille de Jeu 3x3 avec Graphismes Somptueux */}
      <VictorianIronworkCard highlightGlow="purple" className="p-3 relative overflow-hidden">
        <VictorianCornerFlourish position="top-left" color="#FF7518" />
        <VictorianCornerFlourish position="top-right" color="#FF7518" />

        {/* Écran d'accueil avant de jouer */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 bg-[#0B0B0B]/90 backdrop-blur-sm z-20 rounded-xl flex flex-col items-center justify-center p-6 text-center">
            <Skull className="w-14 h-14 text-[#FF7518] animate-bounce mb-3 shadow-[0_0_20px_rgba(255,117,24,0.4)]" />
            <h3 className="font-syne text-xl font-extrabold text-[#E6E1DC]">
              LE MASSACRE DE CITROUILLES
            </h3>
            <p className="text-xs font-mono text-[#8C8494] mt-2 max-w-xs">
              Écrasez les citrouilles spectrales et les fantômes au rythme de la musique !
              Évitez les pièges de pierre maudits.
            </p>

            <button
              onClick={startGame}
              className="mt-5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#FF7518] to-[#FF9030] hover:brightness-110 text-black font-syne font-extrabold text-sm tracking-wider shadow-[0_0_25px_rgba(255,117,24,0.5)] transition-all transform hover:scale-105 active:scale-95 cursor-pointer border border-[#FFB060]"
            >
              COMMENCER LE MASSACRE
            </button>
          </div>
        )}

        {/* Écran Game Over / Fin de rituel (Forme de pierre tombale victorienne) */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-[#0B0B0B]/95 backdrop-blur-md z-30 rounded-xl flex flex-col items-center justify-center p-5 text-center animate-fadeIn">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#39FF14] text-glow-ectoplasm">
              ★ RITUEL ACCOMPLI ★
            </span>
            <h3 className="font-syne text-2xl font-extrabold text-[#E6E1DC] mt-1">
              MASSACRE ACHEVÉ !
            </h3>
            <p className="text-[11px] text-[#8C8494] max-w-xs mt-1">
              Les cryptes résonnent de vos frappes maudites. L'ectoplasme bouillonne dans le grimoire des légendes.
            </p>

            {/* Pierre tombale de score */}
            <div className="w-full max-w-xs my-4 p-4 rounded-t-3xl rounded-b-lg bg-[#1C1424] border-2 border-[#6A0DAD] shadow-[0_0_25px_rgba(106,13,173,0.3)]">
              <span className="text-[9px] font-mono tracking-widest text-[#8C8494] block uppercase">
                R.I.P.
              </span>
              <div className="my-2">
                <span className="text-[10px] font-mono text-[#8C8494] block uppercase">Score Obtenu</span>
                <span className="font-syne font-black text-2xl text-[#FF7518] text-glow-pumpkin">
                  {score.toLocaleString()} PTS
                </span>
              </div>
              <div className="flex justify-between items-center text-xs font-mono pt-2 border-t border-[#6A0DAD]/40">
                <span className="text-[#8C8494]">Meilleur Record :</span>
                <span className="text-[#39FF14] font-bold">{Math.max(score, highScore).toLocaleString()}</span>
              </div>
              <div className="text-[10px] font-mono text-[#DFB7FF] mt-1">
                Rang : {rank.title}
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex flex-col gap-2 w-full max-w-xs">
              <button
                onClick={startGame}
                className="w-full py-3 rounded-xl bg-[#FF7518] hover:bg-[#ff8b38] text-black font-syne font-bold text-xs tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,117,24,0.4)] cursor-pointer active:scale-95 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>RÉINVOQUER LE MASSACRE</span>
              </button>

              <button
                onClick={handleShare}
                className="w-full py-2.5 rounded-xl bg-[#120E17] border border-[#6A0DAD] text-[#E6E1DC] hover:text-[#39FF14] hover:border-[#39FF14] font-mono text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedShare ? 'Copié dans le grimoire !' : 'Partager le score funeste'}</span>
              </button>
            </div>
          </div>
        )}

        {/* 9 cases de la grille avec bordures forgées gothiques */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5 aspect-square max-w-sm mx-auto">
          {Array.from({ length: 9 }).map((_, index) => {
            const activeItem = activeItems.find((item) => item.position === index);
            const float = floatingTexts.find((f) => f.position === index);

            // Style de case dynamique
            let cellStyle = 'bg-[#120E17]/80 border-[#6A0DAD]/30';
            if (activeItem) {
              if (activeItem.type === 'pumpkin') {
                cellStyle = 'bg-[#2E1408] border-[#FF7518] shadow-[0_0_20px_rgba(255,117,24,0.4)]';
              } else if (activeItem.type === 'golden_pumpkin') {
                cellStyle = 'bg-[#26200A] border-[#FFD700] shadow-[0_0_25px_rgba(255,215,0,0.6)]';
              } else if (activeItem.type === 'ghost') {
                cellStyle = 'bg-[#201030] border-[#39FF14] shadow-[0_0_20px_rgba(57,255,20,0.4)]';
              } else if (activeItem.type === 'hourglass') {
                cellStyle = 'bg-[#08202A] border-[#38BDF8] shadow-[0_0_20px_rgba(56,189,248,0.5)]';
              } else if (activeItem.type === 'blood_pumpkin') {
                cellStyle = 'bg-[#300508] border-[#DC2626] shadow-[0_0_25px_rgba(220,38,38,0.6)]';
              } else if (activeItem.type === 'trap') {
                cellStyle = 'bg-[#280808] border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]';
              }
            }

            return (
              <button
                key={index}
                onClick={() => handleCellClick(index)}
                aria-label={`Tombe numéro ${index + 1}`}
                className={`relative rounded-xl border flex flex-col items-center justify-center p-2 transition-all active:scale-95 overflow-hidden cursor-pointer ${cellStyle}`}
              >
                {/* Numéro de crypte discret */}
                {!activeItem && (
                  <span className="text-[10px] font-mono text-[#8C8494]/25 select-none">
                    #{index + 1}
                  </span>
                )}

                {/* Élément actif qui apparaît avec graphismes SVG */}
                {activeItem && renderItemGraphics(activeItem.type)}

                {/* Texte flottant lors du clic */}
                {float && (
                  <div
                    className="absolute inset-0 flex items-center justify-center font-syne font-black text-sm sm:text-base animate-floatUp pointer-events-none z-10"
                    style={{ color: float.color, textShadow: `0 0 10px ${float.color}` }}
                  >
                    {float.text}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </VictorianIronworkCard>

      {/* Buffs & Reliques Graphiques */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="p-3 rounded-xl bg-[#140A1E]/80 border-l-4 border-l-[#FF7518] border border-[#6A0DAD]/40 flex items-center gap-3">
          <span className="text-2xl filter drop-shadow">👁️</span>
          <div>
            <span className="font-syne font-bold text-xs text-[#E6E1DC] block">
              Gélatines d'yeux de Triton
            </span>
            <span className="text-[9px] font-mono text-[#FF7518]">
              Multiplicateur de combo actif (+50%)
            </span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#140A1E]/80 border-l-4 border-l-[#39FF14] border border-[#6A0DAD]/40 flex items-center gap-3">
          <span className="text-2xl filter drop-shadow">🧪</span>
          <div>
            <span className="font-syne font-bold text-xs text-[#E6E1DC] block">
              Ectoplasme Concentré #39FF14
            </span>
            <span className="text-[9px] font-mono text-[#39FF14]">
              Frénésie spectrale d'Hylst
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
