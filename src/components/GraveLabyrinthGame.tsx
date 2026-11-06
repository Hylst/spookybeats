import React, { useState, useEffect, useCallback } from 'react';
import {
  Compass,
  Key,
  Shield,
  Flame,
  Sparkles,
  Trophy,
  RotateCcw,
  Skull,
  Eye,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Gem,
  Award,
} from 'lucide-react';
import {
  generateLabyrinth,
  moveLabyrinthPlayer,
  canMoveInLabyrinth,
  LabyrinthState,
  Direction,
  RoomCell,
} from '../game/labyrinthLogic';
import {
  playDoorCreak,
  playEctoClick,
  playGoldenFrenzy,
  playTrapExplosion,
  playTombstoneThud,
  playGhostHowl,
  playEvilLaugh,
} from '../audio/sfx';
import { VictorianIronworkCard, VictorianCornerFlourish } from './GothicDecorations';

interface GraveLabyrinthGameProps {
  onScoreGained?: (points: number) => void;
  highScore: number;
  onUpdateHighScore: (score: number) => void;
}

export const GraveLabyrinthGame: React.FC<GraveLabyrinthGameProps> = ({
  onScoreGained,
  highScore,
  onUpdateHighScore,
}) => {
  const [gameState, setGameState] = useState<LabyrinthState>(() => generateLabyrinth());
  const [totalLabyrinthScore, setTotalLabyrinthScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('spookybeats_labyrinth_score') || '0', 10);
  });
  const [escapesCount, setEscapesCount] = useState<number>(0);

  const startNewGame = useCallback(() => {
    playEvilLaugh();
    const fresh = generateLabyrinth();
    setGameState(fresh);
  }, []);

  const handleMove = useCallback(
    (dir: Direction) => {
      if (gameState.status !== 'playing') return;
      if (!canMoveInLabyrinth(gameState.playerPos, dir)) return;

      playEctoClick();
      const next = moveLabyrinthPlayer(gameState, dir);
      setGameState(next);

      if (next.status === 'escaped') {
        playGoldenFrenzy(true);
        const newTotal = totalLabyrinthScore + next.score;
        setTotalLabyrinthScore(newTotal);
        localStorage.setItem('spookybeats_labyrinth_score', newTotal.toString());
        setEscapesCount((c) => c + 1);
        if (newTotal > highScore) onUpdateHighScore(newTotal);
        if (onScoreGained) onScoreGained(next.score);
      } else if (next.status === 'lost_in_dark' || next.status === 'slain') {
        playTombstoneThud();
      }
    },
    [gameState, totalLabyrinthScore, highScore, onUpdateHighScore, onScoreGained]
  );

  // Écoute clavier (Flèches et ZQSD/WASD)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState.status !== 'playing') return;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'z') {
        e.preventDefault();
        handleMove('up');
      } else if (e.key === 'ArrowDown' || e.key === 's') {
        e.preventDefault();
        handleMove('down');
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'q') {
        e.preventDefault();
        handleMove('left');
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        e.preventDefault();
        handleMove('right');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.status, handleMove]);

  const renderCellIcon = (cell: RoomCell, isPlayerHere: boolean) => {
    if (isPlayerHere) {
      return (
        <div className="relative flex items-center justify-center animate-bounce">
          <span className="text-2xl filter drop-shadow-[0_0_8px_#39FF14]">🕵️</span>
        </div>
      );
    }

    if (!cell.revealed) {
      return <span className="text-base text-[#4A3258] opacity-40 select-none">✦</span>;
    }

    if (cell.looted && cell.type !== 'entrance' && cell.type !== 'exit') {
      return <span className="text-xs text-[#5C4D68] select-none">·</span>;
    }

    switch (cell.type) {
      case 'entrance':
        return <span className="text-xl select-none" title="Entrée">🚪</span>;
      case 'exit':
        return <span className="text-2xl animate-pulse select-none" title="Portail des Âmes">🌀</span>;
      case 'key':
        return <span className="text-xl filter drop-shadow-[0_0_8px_#FBBF24] select-none animate-pulse">🗝️</span>;
      case 'torch':
        return <span className="text-xl filter drop-shadow-[0_0_8px_#F97316] select-none">🏮</span>;
      case 'potion':
        return <span className="text-xl filter drop-shadow-[0_0_8px_#38BDF8] select-none">🧪</span>;
      case 'treasure':
        return <span className="text-xl filter drop-shadow-[0_0_8px_#EAB308] select-none">💎</span>;
      case 'phantom':
        return <span className="text-xl filter drop-shadow-[0_0_8px_#C084FC] select-none animate-pulse">👻</span>;
      case 'trap':
        return <span className="text-xl filter drop-shadow-[0_0_8px_#EF4444] select-none">⚔️</span>;
      case 'empty':
      default:
        return <span className="text-xs text-[#5C4D68] select-none">·</span>;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Bannière Visuelle des Catacombes */}
      <div className="relative rounded-2xl overflow-hidden border border-[#39FF14]/50 shadow-[0_0_30px_rgba(57,255,20,0.2)]">
        <div className="h-44 sm:h-52 w-full relative">
          <img
            src="/assets/games/crypt_sarcophagus.jpg"
            alt="Catacombes de la Crypte"
            className="w-full h-full object-cover object-center filter brightness-90 contrast-115"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0B]/80 via-transparent to-[#0B0B0B]/80" />

          {/* En-tête textuel dans la bannière */}
          <div className="absolute bottom-3 left-4 right-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#FF7518] font-bold">
                  ★ ROGUE-LITE DE CRYPTE ★
                </span>
                <span className="text-xs text-[#8C8494]">·</span>
                <span className="text-[10px] font-mono text-[#39FF14]">
                  {escapesCount} évasions victorieuses
                </span>
              </div>
              <h3 className="font-syne font-extrabold text-xl sm:text-2xl text-[#E6E1DC]">
                Le Labyrinthe du Fossoyeur
              </h3>
              <p className="text-[11px] font-mono text-[#A89CAE] max-w-lg mt-0.5 hidden xs:block">
                Explorez les 25 salles des catacombes, trouvez la Clé Funéraire et atteignez le Portail avant que votre torche ne meure !
              </p>
            </div>

            <div className="bg-[#0B0B0B]/90 border border-[#FF7518]/50 rounded-xl px-3 py-1.5 flex items-center gap-2.5 backdrop-blur-md">
              <Trophy className="w-4 h-4 text-[#39FF14]" />
              <div>
                <span className="text-[9px] font-mono text-[#8C8494] block uppercase">Record Catacombes</span>
                <span className="font-syne font-black text-sm sm:text-base text-[#FF7518] text-glow-pumpkin">
                  {totalLabyrinthScore.toLocaleString()} PTS
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Barre d'État de l'Explorateur (Torche, Clé, Bouclier, Score) */}
      <VictorianIronworkCard highlightGlow="none" className="p-3 sm:p-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          {/* Torche / Tours restants */}
          <div className="p-2.5 rounded-xl bg-[#140A1E]/80 border border-orange-500/40 flex items-center justify-between px-3">
            <div className="flex items-center gap-2">
              <Flame
                className={`w-5 h-5 ${
                  gameState.torchTurns <= 5
                    ? 'text-red-500 animate-bounce'
                    : 'text-orange-400 animate-pulse'
                }`}
              />
              <div className="text-left">
                <span className="text-[9px] font-mono uppercase text-[#8C8494] block">Lueur de Torche</span>
                <span
                  className={`font-syne font-black text-base sm:text-lg ${
                    gameState.torchTurns <= 5 ? 'text-red-400' : 'text-orange-400'
                  }`}
                >
                  {gameState.torchTurns} Tours
                </span>
              </div>
            </div>
            {gameState.torchTurns <= 5 && (
              <span className="text-[9px] font-mono font-bold text-red-400 animate-pulse">Critique !</span>
            )}
          </div>

          {/* Clé Funéraire */}
          <div className="p-2.5 rounded-xl bg-[#140A1E]/80 border border-amber-500/40 flex items-center gap-2 px-3">
            <Key className={`w-5 h-5 ${gameState.hasKey ? 'text-[#FBBF24] animate-bounce' : 'text-[#5C4D68]'}`} />
            <div className="text-left">
              <span className="text-[9px] font-mono uppercase text-[#8C8494] block">Clé du Portail</span>
              <span className={`font-syne font-bold text-xs sm:text-sm ${gameState.hasKey ? 'text-[#FBBF24]' : 'text-[#8C8494]'}`}>
                {gameState.hasKey ? '🗝️ TROUVÉE' : 'Manquante'}
              </span>
            </div>
          </div>

          {/* Bouclier Astral */}
          <div className="p-2.5 rounded-xl bg-[#140A1E]/80 border border-cyan-500/40 flex items-center gap-2 px-3">
            <Shield className={`w-5 h-5 ${gameState.hasShield ? 'text-[#38BDF8] animate-pulse' : 'text-[#5C4D68]'}`} />
            <div className="text-left">
              <span className="text-[9px] font-mono uppercase text-[#8C8494] block">Élixir Protecteur</span>
              <span className={`font-syne font-bold text-xs sm:text-sm ${gameState.hasShield ? 'text-[#38BDF8]' : 'text-[#8C8494]'}`}>
                {gameState.hasShield ? '🛡️ ACTIF' : 'Aucun'}
              </span>
            </div>
          </div>

          {/* Butin accumulé */}
          <div className="p-2.5 rounded-xl bg-[#140A1E]/80 border border-[#39FF14]/40 flex items-center gap-2 px-3">
            <Gem className="w-5 h-5 text-[#39FF14]" />
            <div className="text-left">
              <span className="text-[9px] font-mono uppercase text-[#8C8494] block">Butin Récolté</span>
              <span className="font-syne font-black text-base sm:text-lg text-[#39FF14] text-glow-ectoplasm">
                {gameState.score.toLocaleString()} PTS
              </span>
            </div>
          </div>
        </div>
      </VictorianIronworkCard>

      {/* Plateau de Jeu 5x5 & Contrôles */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
        {/* Grille 5x5 des Catacombes */}
        <div className="md:col-span-7">
          <VictorianIronworkCard highlightGlow="purple" className="p-3 sm:p-4">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-xs font-syne font-bold text-[#E6E1DC] flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-[#FF7518]" />
                Plan des Catacombes Oubliées (5x5)
              </span>
              <span className="text-[10px] font-mono text-[#8C8494]">
                Position : ({gameState.playerPos.x}, {gameState.playerPos.y})
              </span>
            </div>

            {/* Grille 5x5 */}
            <div className="grid grid-cols-5 gap-2 max-w-sm sm:max-w-md mx-auto aspect-square p-2 bg-[#08040C] rounded-2xl border border-[#6A0DAD]/40 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
              {gameState.grid.map((row, y) =>
                row.map((cell, x) => {
                  const isPlayerHere = gameState.playerPos.x === x && gameState.playerPos.y === y;
                  const canStep =
                    gameState.status === 'playing' &&
                    ((Math.abs(gameState.playerPos.x - x) === 1 && gameState.playerPos.y === y) ||
                      (Math.abs(gameState.playerPos.y - y) === 1 && gameState.playerPos.x === x));

                  return (
                    <button
                      key={`${x}-${y}`}
                      onClick={() => {
                        if (canStep) {
                          if (x > gameState.playerPos.x) handleMove('right');
                          else if (x < gameState.playerPos.x) handleMove('left');
                          else if (y > gameState.playerPos.y) handleMove('down');
                          else if (y < gameState.playerPos.y) handleMove('up');
                        }
                      }}
                      disabled={!canStep}
                      className={`rounded-xl border flex flex-col items-center justify-center p-1 relative transition-all duration-300 ${
                        isPlayerHere
                          ? 'bg-[#1C2C18] border-[#39FF14] shadow-[0_0_20px_rgba(57,255,20,0.4)] z-10 scale-105'
                          : cell.revealed
                          ? 'bg-[#140A1E] border-[#6A0DAD]/50 hover:border-[#DFB7FF]'
                          : 'bg-[#08040C] border-[#221032]/40 opacity-70'
                      } ${canStep ? 'cursor-pointer ring-1 ring-[#FF7518]/50 hover:scale-105' : 'cursor-default'}`}
                    >
                      {renderCellIcon(cell, isPlayerHere)}

                      {/* Indicateur de salle visitée */}
                      {cell.revealed && (
                        <span className="text-[7px] font-mono text-[#8C8494] line-clamp-1 truncate max-w-full px-0.5 mt-0.5 select-none">
                          {cell.name.split(' ')[0]}
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {/* Légende rapide */}
            <div className="flex flex-wrap items-center justify-center gap-3 text-[10px] font-mono text-[#8C8494] mt-3 pt-2 border-t border-[#6A0DAD]/30">
              <span className="flex items-center gap-1">🚪 Entrée</span>
              <span className="flex items-center gap-1">🗝️ Clé</span>
              <span className="flex items-center gap-1">🏮 Torche</span>
              <span className="flex items-center gap-1">💎 Joyaux</span>
              <span className="flex items-center gap-1">👻 Spectre</span>
              <span className="flex items-center gap-1">⚔️ Piège</span>
              <span className="flex items-center gap-1">🌀 Portail</span>
            </div>
          </VictorianIronworkCard>
        </div>

        {/* Colonne Droite : Manette Tactile & Journal des Catacombes */}
        <div className="md:col-span-5 flex flex-col gap-3">
          {/* Pad Directionnel Victorien */}
          <VictorianIronworkCard highlightGlow="none" className="p-3 sm:p-4 text-center">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#FF7518] block mb-2 font-bold">
              Commandes de Déplacement (Clavier / Tactile)
            </span>

            <div className="flex flex-col items-center gap-2 max-w-[180px] mx-auto my-1">
              <button
                onClick={() => handleMove('up')}
                disabled={gameState.status !== 'playing' || !canMoveInLabyrinth(gameState.playerPos, 'up')}
                className="w-12 h-12 rounded-xl bg-[#1C0E28] hover:bg-[#2A143E] border border-[#6A0DAD] text-[#E6E1DC] flex items-center justify-center font-bold disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shadow-[0_0_10px_rgba(106,13,173,0.3)] active:scale-95"
              >
                <ArrowUp className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleMove('left')}
                  disabled={gameState.status !== 'playing' || !canMoveInLabyrinth(gameState.playerPos, 'left')}
                  className="w-12 h-12 rounded-xl bg-[#1C0E28] hover:bg-[#2A143E] border border-[#6A0DAD] text-[#E6E1DC] flex items-center justify-center font-bold disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shadow-[0_0_10px_rgba(106,13,173,0.3)] active:scale-95"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <div className="w-8 h-8 rounded-full border border-[#6A0DAD]/40 flex items-center justify-center text-xs text-[#8C8494]">
                  ✦
                </div>

                <button
                  onClick={() => handleMove('right')}
                  disabled={gameState.status !== 'playing' || !canMoveInLabyrinth(gameState.playerPos, 'right')}
                  className="w-12 h-12 rounded-xl bg-[#1C0E28] hover:bg-[#2A143E] border border-[#6A0DAD] text-[#E6E1DC] flex items-center justify-center font-bold disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shadow-[0_0_10px_rgba(106,13,173,0.3)] active:scale-95"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              <button
                onClick={() => handleMove('down')}
                disabled={gameState.status !== 'playing' || !canMoveInLabyrinth(gameState.playerPos, 'down')}
                className="w-12 h-12 rounded-xl bg-[#1C0E28] hover:bg-[#2A143E] border border-[#6A0DAD] text-[#E6E1DC] flex items-center justify-center font-bold disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shadow-[0_0_10px_rgba(106,13,173,0.3)] active:scale-95"
              >
                <ArrowDown className="w-5 h-5" />
              </button>
            </div>

            <p className="text-[9px] font-mono text-[#8C8494] mt-2">
              Touches Clavier : <strong>Flèches</strong> ou <strong>ZQSD / WASD</strong>
            </p>
          </VictorianIronworkCard>

          {/* Journal des Catacombes */}
          <VictorianIronworkCard highlightGlow="none" className="p-3 sm:p-4">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#39FF14] block mb-1.5 font-bold">
              Journal des Catacombes
            </span>
            <div className="flex flex-col gap-1.5 max-h-36 overflow-y-auto pr-1">
              {gameState.log.map((entry, idx) => (
                <div
                  key={idx}
                  className={`text-[10px] font-mono py-1 px-2 rounded-lg border leading-relaxed ${
                    idx === 0
                      ? 'bg-[#1C0E28] border-[#6A0DAD] text-[#DFB7FF]'
                      : 'bg-[#0B0B0B]/60 border-transparent text-[#8C8494]'
                  }`}
                >
                  {entry}
                </div>
              ))}
            </div>
          </VictorianIronworkCard>

          {/* Statut de Fin de Partie (Victoire / Défaite) */}
          {gameState.status !== 'playing' && (
            <div
              className={`p-4 rounded-xl border text-center transition-all animate-fadeIn ${
                gameState.status === 'escaped'
                  ? 'bg-[#0E2610]/95 border-[#39FF14] shadow-[0_0_25px_rgba(57,255,20,0.4)]'
                  : 'bg-[#280808]/95 border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.4)]'
              }`}
            >
              <h4 className="font-syne font-black text-lg text-[#E6E1DC] mb-1">
                {gameState.status === 'escaped' ? '🏆 ÉVASION RÉUSSIE !' : '💀 ENGLOUTI PAR LES OMBRES'}
              </h4>
              <p className="text-xs font-mono text-[#E6E1DC] mb-3">
                {gameState.status === 'escaped'
                  ? 'Vous avez franchi le Portail avec la clé et tout le butin sacré !'
                  : 'Votre lumière s\'est éteinte. Votre âme erre désormais dans la crypte.'}
              </p>
              <button
                onClick={startNewGame}
                className="px-6 py-2 rounded-lg bg-[#FF7518] hover:bg-[#ff8b38] text-black font-syne font-bold text-xs tracking-wider cursor-pointer shadow-[0_0_15px_rgba(255,117,24,0.5)]"
              >
                REPRENDRE UNE EXPÉDITION
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
