import React, { useState, useEffect } from 'react';
import {
  Skull,
  Flame,
  Ghost,
  Sparkles,
  Trophy,
  RotateCcw,
  Shield,
  Key,
  ArrowDownCircle,
  Activity,
  Compass,
  Award,
  Crown,
  Medal,
  X,
  Volume2,
} from 'lucide-react';
import { PumpkinSmasher } from './PumpkinSmasher';
import { RhythmGameRequiem } from './RhythmGameRequiem';
import { WitchCauldronGame } from './WitchCauldronGame';
import { GraveLabyrinthGame } from './GraveLabyrinthGame';
import {
  AltarGlyph,
  getNextAltarGlyph,
  verifyAltarSequence,
  calculateAltarRoundScore,
  generateSarcophagiGrid,
  SarcophagusTile,
  getFloorName,
  calculateFloorClearBonus,
  getAltarRoundTitle,
} from '../game/miniGamesLogic';
import {
  playPumpkinSquish,
  playGhostHowl,
  playGoldenFrenzy,
  playTrapExplosion,
  playTombstoneThud,
  playEvilLaugh,
  playEctoClick,
  playDoorCreak,
} from '../audio/sfx';
import {
  CarvedPumpkinIcon,
  VictorianIronworkCard,
  VictorianCornerFlourish,
} from './GothicDecorations';
import { TrackMetadata } from '../audio/audioEngine';

interface MiniGamesHubProps {
  isPlaying: boolean;
  onStartTrack4: (track: TrackMetadata) => void;
  gameTrack: TrackMetadata;
  highScore: number;
  onUpdateHighScore: (score: number) => void;
}

export type GameTab = 'smasher' | 'requiem' | 'altar' | 'sarcophagi' | 'cauldron' | 'labyrinth';

export const MiniGamesHub: React.FC<MiniGamesHubProps> = ({
  isPlaying,
  onStartTrack4,
  gameTrack,
  highScore,
  onUpdateHighScore,
}) => {
  const [activeTab, setActiveTab] = useState<GameTab>('smasher');
  const [isHallOfFameOpen, setIsHallOfFameOpen] = useState<boolean>(false);

  // --- ÉTATS DU SIMON OCCULTE (L'AUTEL DES SORTILÈGES) ---
  const [altarState, setAltarState] = useState<'idle' | 'showing' | 'player' | 'gameover'>('idle');
  const [altarSequence, setAltarSequence] = useState<AltarGlyph[]>([]);
  const [altarPlayerInput, setAltarPlayerInput] = useState<AltarGlyph[]>([]);
  const [altarRound, setAltarRound] = useState<number>(1);
  const [altarScore, setAltarScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('spookybeats_altar_score') || '0', 10);
  });
  const [activeAltarGlyph, setActiveAltarGlyph] = useState<AltarGlyph | null>(null);

  // --- ÉTATS DES SARCOPHAGES MAUDITS ---
  const [sarcophagiFloor, setSarcophagiFloor] = useState<number>(1);
  const [sarcophagiGrid, setSarcophagiGrid] = useState<SarcophagusTile[]>(() => generateSarcophagiGrid(1));
  const [sarcophagiScore, setSarcophagiScore] = useState<number>(0);
  const [sarcophagiGameOver, setSarcophagiGameOver] = useState<boolean>(false);
  const [sarcophagiWon, setSarcophagiWon] = useState<boolean>(false);
  const [sarcophagiShield, setSarcophagiShield] = useState<boolean>(false);
  const [sarcophagiHasKey, setSarcophagiHasKey] = useState<boolean>(false);
  const [sarcophagiMessage, setSarcophagiMessage] = useState<string | null>(null);

  // Records des autres jeux pour le Panthéon
  const rhythmScore = parseInt(localStorage.getItem('spookybeats_rhythm_high_score') || '1200', 10);
  const cauldronScore = parseInt(localStorage.getItem('spookybeats_cauldron_score') || '0', 10);
  const labyrinthScore = parseInt(localStorage.getItem('spookybeats_labyrinth_score') || '0', 10);
  const totalSoulPower = highScore + rhythmScore + altarScore + cauldronScore + labyrinthScore;

  // === LOGIQUE AUTEL SIMON ===
  const startAltarGame = () => {
    playEvilLaugh();
    if (!isPlaying) onStartTrack4(gameTrack);
    const initialSeq: AltarGlyph[] = [getNextAltarGlyph(), getNextAltarGlyph()];
    setAltarSequence(initialSeq);
    setAltarPlayerInput([]);
    setAltarRound(1);
    setAltarScore(0);
    setAltarState('showing');
    playAltarSequence(initialSeq);
  };

  const playAltarSequence = (seq: AltarGlyph[]) => {
    setAltarState('showing');
    setAltarPlayerInput([]);
    let idx = 0;

    const interval = setInterval(() => {
      if (idx >= seq.length) {
        clearInterval(interval);
        setActiveAltarGlyph(null);
        setAltarState('player');
        return;
      }

      const glyph = seq[idx];
      flashGlyph(glyph);
      idx++;
    }, 700);
  };

  const flashGlyph = (glyph: AltarGlyph) => {
    setActiveAltarGlyph(glyph);
    if (glyph === 'pumpkin') playPumpkinSquish();
    else if (glyph === 'skull') playTrapExplosion();
    else if (glyph === 'ghost') playGhostHowl();
    else playGoldenFrenzy();

    setTimeout(() => {
      setActiveAltarGlyph(null);
    }, 380);
  };

  const handleAltarClick = (glyph: AltarGlyph) => {
    if (altarState !== 'player') return;

    flashGlyph(glyph);
    const nextInput = [...altarPlayerInput, glyph];
    setAltarPlayerInput(nextInput);

    const verification = verifyAltarSequence(altarSequence, nextInput);

    if (!verification.isCorrect) {
      playTombstoneThud();
      setAltarState('gameover');
      localStorage.setItem('spookybeats_altar_score', altarScore.toString());
      if (altarScore > highScore) onUpdateHighScore(altarScore);
      return;
    }

    if (verification.isComplete) {
      playGoldenFrenzy();
      const points = calculateAltarRoundScore(altarRound);
      const newScore = altarScore + points;
      setAltarScore(newScore);
      localStorage.setItem('spookybeats_altar_score', newScore.toString());
      if (newScore > highScore) onUpdateHighScore(newScore);

      const nextRound = altarRound + 1;
      setAltarRound(nextRound);
      const nextSeq = [...altarSequence, getNextAltarGlyph()];
      setAltarSequence(nextSeq);

      setTimeout(() => {
        playAltarSequence(nextSeq);
      }, 1000);
    }
  };

  // === LOGIQUE SARCOPHAGES (DESCENTE DE CRYPTE) ===
  const startSarcophagiGame = () => {
    playEvilLaugh();
    if (!isPlaying) onStartTrack4(gameTrack);
    setSarcophagiFloor(1);
    setSarcophagiGrid(generateSarcophagiGrid(1));
    setSarcophagiScore(0);
    setSarcophagiGameOver(false);
    setSarcophagiWon(false);
    setSarcophagiShield(false);
    setSarcophagiHasKey(false);
    setSarcophagiMessage("Étage 1 : Trouvez la clé pour descendre plus bas ou fuyez avec votre butin.");
  };

  const handleNextFloor = () => {
    playDoorCreak(true);
    const bonus = calculateFloorClearBonus(sarcophagiFloor);
    const newScore = sarcophagiScore + bonus;
    setSarcophagiScore(newScore);
    if (newScore > highScore) onUpdateHighScore(newScore);

    const nextFloor = sarcophagiFloor + 1;
    setSarcophagiFloor(nextFloor);
    setSarcophagiGrid(generateSarcophagiGrid(nextFloor));
    setSarcophagiHasKey(false);
    setSarcophagiWon(false);
    setSarcophagiMessage(`Étage ${nextFloor} atteint (+${bonus} pts bonus) ! La brume s'épaissit.`);
  };

  const handleSarcophagusClick = (tile: SarcophagusTile) => {
    if (tile.revealed || sarcophagiGameOver || sarcophagiWon) return;

    if (tile.content === 'curse') {
      if (sarcophagiShield) {
        playGoldenFrenzy(true);
        setSarcophagiShield(false);
        setSarcophagiMessage("🛡️ Votre Élixir Spectral s'est brisé pour absorber la malédiction !");
        setSarcophagiGrid((prev) => prev.map((t) => (t.id === tile.id ? { ...t, revealed: true } : t)));
        return;
      }

      playTrapExplosion(true);
      setSarcophagiGameOver(true);
      setSarcophagiMessage("💀 Une goule millénaire s'éveille ! Butin perdu dans les entrailles de la crypte.");
      setSarcophagiGrid((prev) => prev.map((t) => ({ ...t, revealed: true })));
    } else {
      playEctoClick();
      if (tile.content === 'shield') {
        setSarcophagiShield(true);
        setSarcophagiMessage("🛡️ Élixir Spectral acquis ! Protège contre la prochaine malédiction.");
      } else if (tile.content === 'key') {
        setSarcophagiHasKey(true);
        setSarcophagiMessage("🗝️ Clé Arcanique trouvée ! L'escalier vers l'étage inférieur est déverrouillé.");
      }

      const newScore = sarcophagiScore + tile.points;
      setSarcophagiScore(newScore);
      if (newScore > highScore) onUpdateHighScore(newScore);

      const updated = sarcophagiGrid.map((t) => (t.id === tile.id ? { ...t, revealed: true } : t));
      setSarcophagiGrid(updated);

      const remainingTreasures = updated.filter((t) => !t.revealed && t.content !== 'curse');
      if (remainingTreasures.length === 0) {
        playGoldenFrenzy(true);
        setSarcophagiWon(true);
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 pb-28 animate-fadeIn">
      {/* Barre de navigation des 6 Mini-Jeux d'Halloween */}
      <VictorianIronworkCard highlightGlow="none" className="p-1.5 sm:p-2">
        <div className="flex flex-wrap items-center justify-between gap-1 sm:gap-1.5">
          <button
            onClick={() => {
              playEctoClick();
              setActiveTab('smasher');
            }}
            className={`flex-1 min-w-[95px] py-2 px-1.5 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
              activeTab === 'smasher'
                ? 'bg-gradient-to-r from-[#FF7518] to-[#FF9030] text-black border-[#FFB060] shadow-[0_0_14px_rgba(255,117,24,0.5)]'
                : 'text-[#8C8494] hover:text-[#E6E1DC] border-transparent hover:border-[#6A0DAD]/40'
            }`}
          >
            <CarvedPumpkinIcon size={15} />
            <span>Massacre</span>
          </button>

          <button
            onClick={() => {
              playEctoClick();
              setActiveTab('requiem');
            }}
            className={`flex-1 min-w-[95px] py-2 px-1.5 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
              activeTab === 'requiem'
                ? 'bg-gradient-to-r from-[#39FF14] to-[#79FF5B] text-black border-[#A5FFA0] shadow-[0_0_14px_rgba(57,255,20,0.5)]'
                : 'text-[#8C8494] hover:text-[#E6E1DC] border-transparent hover:border-[#6A0DAD]/40'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Requiem</span>
          </button>

          <button
            onClick={() => {
              playEctoClick();
              setActiveTab('altar');
            }}
            className={`flex-1 min-w-[95px] py-2 px-1.5 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
              activeTab === 'altar'
                ? 'bg-gradient-to-r from-[#8B1AD6] to-[#6A0DAD] text-white border-[#DFB7FF] shadow-[0_0_14px_rgba(106,13,173,0.6)]'
                : 'text-[#8C8494] hover:text-[#E6E1DC] border-transparent hover:border-[#6A0DAD]/40'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#39FF14]" />
            <span>Autel Simon</span>
          </button>

          <button
            onClick={() => {
              playEctoClick();
              setActiveTab('sarcophagi');
            }}
            className={`flex-1 min-w-[95px] py-2 px-1.5 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
              activeTab === 'sarcophagi'
                ? 'bg-gradient-to-r from-[#FF7518] to-[#FF9030] text-black border-[#FFB060] shadow-[0_0_14px_rgba(255,117,24,0.5)]'
                : 'text-[#8C8494] hover:text-[#E6E1DC] border-transparent hover:border-[#6A0DAD]/40'
            }`}
          >
            <Skull className="w-3.5 h-3.5" />
            <span>Sarcophages</span>
          </button>

          <button
            onClick={() => {
              playEctoClick();
              setActiveTab('cauldron');
            }}
            className={`flex-1 min-w-[95px] py-2 px-1.5 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
              activeTab === 'cauldron'
                ? 'bg-gradient-to-r from-[#06B6D4] to-[#10B981] text-black border-[#67E8F9] shadow-[0_0_14px_rgba(6,182,212,0.5)]'
                : 'text-[#8C8494] hover:text-[#E6E1DC] border-transparent hover:border-[#06B6D4]/40'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-yellow-300" />
            <span>Chaudron</span>
          </button>

          <button
            onClick={() => {
              playEctoClick();
              setActiveTab('labyrinth');
            }}
            className={`flex-1 min-w-[95px] py-2 px-1.5 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
              activeTab === 'labyrinth'
                ? 'bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-black border-[#FDE68A] shadow-[0_0_14px_rgba(245,158,11,0.5)]'
                : 'text-[#8C8494] hover:text-[#E6E1DC] border-transparent hover:border-[#F59E0B]/40'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Labyrinthe</span>
          </button>

          {/* Bouton Panthéon des Damnés */}
          <button
            onClick={() => {
              playEctoClick();
              setIsHallOfFameOpen(true);
            }}
            className="py-2 px-2.5 rounded-lg text-xs font-mono font-bold bg-[#1C0E28] hover:bg-[#28143A] text-[#DFB7FF] border border-[#6A0DAD] flex items-center gap-1 cursor-pointer transition-all shadow-[0_0_10px_rgba(106,13,173,0.3)]"
            title="Consulter le Panthéon des Damnés"
          >
            <Trophy className="w-3.5 h-3.5 text-[#FF7518]" />
            <span className="hidden md:inline">Panthéon</span>
          </button>
        </div>
      </VictorianIronworkCard>

      {/* ONGLET 1 : MASSACRE DE CITROUILLES */}
      {activeTab === 'smasher' && (
        <PumpkinSmasher
          isPlaying={isPlaying}
          onStartTrack4={onStartTrack4}
          gameTrack={gameTrack}
          highScore={highScore}
          onUpdateHighScore={onUpdateHighScore}
        />
      )}

      {/* ONGLET 2 : LE REQUIEM DU RYTHME */}
      {activeTab === 'requiem' && (
        <RhythmGameRequiem
          currentTrack={gameTrack}
          isPlaying={isPlaying}
          onTogglePlay={() => onStartTrack4(gameTrack)}
        />
      )}

      {/* ONGLET 3 : L'AUTEL DES SORTILÈGES (SIMON OCCULTE ENRICHI DE GRAPHISMES) */}
      {activeTab === 'altar' && (
        <div className="flex flex-col gap-4 animate-fadeIn">
          {/* Bannière Visuelle de l'Autel Druidique */}
          <div className="relative rounded-2xl overflow-hidden border border-[#6A0DAD]/60 shadow-[0_0_30px_rgba(106,13,173,0.3)]">
            <div className="h-44 sm:h-52 w-full relative">
              <img
                src="/assets/games/altar_monolith.jpg"
                alt="Autel Mégalithique Druidique"
                className="w-full h-full object-cover object-center filter brightness-90 contrast-115"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0B]/80 via-transparent to-[#0B0B0B]/80" />

              <div className="absolute bottom-3 left-4 right-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#39FF14] font-bold">
                      ★ ÉPREUVE DE MÉMOIRE OCCULTE ★
                    </span>
                    <span className="text-xs text-[#8C8494]">·</span>
                    <span className="text-[10px] font-mono text-[#DFB7FF]">
                      {getAltarRoundTitle(altarRound)}
                    </span>
                  </div>
                  <h3 className="font-syne font-extrabold text-xl sm:text-2xl text-[#E6E1DC]">
                    L'Autel des Sortilèges d'Hylst
                  </h3>
                  <p className="text-[11px] font-mono text-[#A89CAE] max-w-lg mt-0.5 hidden xs:block">
                    Mémorisez la séquence des monolithes gravés de runes ancestrales et reproduisez la cadence sans faillir !
                  </p>
                </div>

                <div className="bg-[#0B0B0B]/90 border border-[#6A0DAD]/60 rounded-xl px-3 py-1.5 flex items-center gap-2.5 backdrop-blur-md">
                  <Trophy className="w-4 h-4 text-[#FF7518]" />
                  <div>
                    <span className="text-[9px] font-mono text-[#8C8494] block uppercase">Score du Rituel</span>
                    <span className="font-syne font-black text-sm sm:text-base text-[#FF7518] text-glow-pumpkin">
                      {altarScore.toLocaleString()} PTS
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <VictorianIronworkCard highlightGlow="purple" className="p-4 sm:p-5 relative">
            <VictorianCornerFlourish position="top-left" color="#6A0DAD" />
            <VictorianCornerFlourish position="top-right" color="#6A0DAD" />

            {/* Tableau de score & Round */}
            <div className="flex justify-between items-center px-4 py-2.5 rounded-xl bg-[#0B0B0B]/80 border border-[#6A0DAD]/40 mb-4">
              <div>
                <span className="text-[9px] font-mono uppercase text-[#8C8494] block">Sorcellerie Accumulée</span>
                <span className="font-syne font-black text-xl text-[#FF7518] text-glow-pumpkin">
                  {altarScore.toLocaleString()} PTS
                </span>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-mono uppercase text-[#39FF14] block">Étage Astral</span>
                <span className="font-syne font-bold text-base text-[#DFB7FF]">
                  Round #{altarRound}
                </span>
              </div>
            </div>

            {/* Statut du tour */}
            <div className="text-center mb-4 text-xs font-mono">
              {altarState === 'idle' && (
                <span className="text-[#8C8494]">Préparez vos sens... Le sabbat va commencer.</span>
              )}
              {altarState === 'showing' && (
                <span className="text-[#39FF14] animate-pulse font-bold">✦ Observez l'illumination des monolithes sacrés... ✦</span>
              )}
              {altarState === 'player' && (
                <span className="text-[#FF7518] font-bold text-glow-pumpkin animate-bounce">
                  À votre tour ! Frappez les runes ({altarPlayerInput.length}/{altarSequence.length})
                </span>
              )}
              {altarState === 'gameover' && (
                <span className="text-red-400 font-bold">Malédiction ! La formule s'est brisée dans les ténèbres.</span>
              )}
            </div>

            {/* Grille 2x2 des 4 monolithes runiques enrichis */}
            <div className="grid grid-cols-2 gap-3.5 max-w-sm mx-auto aspect-square">
              {/* Monolithe 1 : Citrouille Ardente */}
              <button
                onClick={() => handleAltarClick('pumpkin')}
                disabled={altarState !== 'player'}
                aria-label="Monolithe Citrouille"
                className={`rounded-2xl border-2 flex flex-col items-center justify-center p-4 transition-all duration-300 cursor-pointer relative overflow-hidden ${
                  activeAltarGlyph === 'pumpkin'
                    ? 'bg-gradient-to-b from-[#FF7518] to-[#B45309] border-white scale-105 shadow-[0_0_35px_#FF7518]'
                    : 'bg-[#1C0F08] border-[#FF7518]/60 hover:border-[#FF7518] hover:bg-[#2A140A]'
                }`}
              >
                <div className="w-14 h-14 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow">
                    <ellipse cx="50" cy="55" rx="36" ry="28" fill="#F97316" />
                    <polygon points="36,48 46,48 41,38" fill="#FEF08A" />
                    <polygon points="54,48 64,48 59,38" fill="#FEF08A" />
                    <path d="M 32 64 L 40 62 L 50 67 L 60 62 L 68 64 L 62 70 L 50 72 L 38 70 Z" fill="#FEF08A" />
                  </svg>
                </div>
                <span className="text-[10px] font-mono font-extrabold text-[#FF7518] mt-2 tracking-wider">
                  CITROUILLE
                </span>
                <span className="text-[8px] font-mono text-[#8C8494]">Rune de Samhain</span>
              </button>

              {/* Monolithe 2 : Crâne Maudit */}
              <button
                onClick={() => handleAltarClick('skull')}
                disabled={altarState !== 'player'}
                aria-label="Monolithe Crâne"
                className={`rounded-2xl border-2 flex flex-col items-center justify-center p-4 transition-all duration-300 cursor-pointer relative overflow-hidden ${
                  activeAltarGlyph === 'skull'
                    ? 'bg-gradient-to-b from-red-600 to-red-900 border-white scale-105 shadow-[0_0_35px_#ef4444]'
                    : 'bg-[#220808] border-red-500/60 hover:border-red-500 hover:bg-[#320C0C]'
                }`}
              >
                <div className="w-14 h-14 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow">
                    <circle cx="50" cy="45" r="28" fill="#FCA5A5" />
                    <rect x="36" y="65" width="28" height="15" rx="4" fill="#FCA5A5" />
                    <ellipse cx="40" cy="45" rx="6" ry="8" fill="#000000" />
                    <ellipse cx="60" cy="45" rx="6" ry="8" fill="#000000" />
                    <polygon points="50,56 46,62 54,62" fill="#000000" />
                  </svg>
                </div>
                <span className="text-[10px] font-mono font-extrabold text-red-400 mt-2 tracking-wider">
                  CRÂNE SÉPULCRAL
                </span>
                <span className="text-[8px] font-mono text-[#8C8494]">Rune de Mort</span>
              </button>

              {/* Monolithe 3 : Spectre Éthéré */}
              <button
                onClick={() => handleAltarClick('ghost')}
                disabled={altarState !== 'player'}
                aria-label="Monolithe Fantôme"
                className={`rounded-2xl border-2 flex flex-col items-center justify-center p-4 transition-all duration-300 cursor-pointer relative overflow-hidden ${
                  activeAltarGlyph === 'ghost'
                    ? 'bg-gradient-to-b from-[#39FF14] to-emerald-800 text-black border-white scale-105 shadow-[0_0_35px_#39FF14]'
                    : 'bg-[#0A1E0E] border-[#39FF14]/60 hover:border-[#39FF14] hover:bg-[#0F2D15]'
                }`}
              >
                <div className="w-14 h-14 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow">
                    <path
                      d="M 32 50 C 32 28 68 28 68 50 C 68 70 64 80 58 76 C 54 72 50 78 46 74 C 42 70 38 78 32 50 Z"
                      fill="#86EFAC"
                    />
                    <circle cx="44" cy="44" r="3.5" fill="#000000" />
                    <circle cx="56" cy="44" r="3.5" fill="#000000" />
                    <ellipse cx="50" cy="56" rx="4" ry="6" fill="#000000" />
                  </svg>
                </div>
                <span className="text-[10px] font-mono font-extrabold text-[#39FF14] mt-2 tracking-wider">
                  FANTÔME ASTRAL
                </span>
                <span className="text-[8px] font-mono text-[#8C8494]">Rune d'Ectoplasme</span>
              </button>

              {/* Monolithe 4 : Chauve-Souris Nocturne */}
              <button
                onClick={() => handleAltarClick('bat')}
                disabled={altarState !== 'player'}
                aria-label="Monolithe Chauve-souris"
                className={`rounded-2xl border-2 flex flex-col items-center justify-center p-4 transition-all duration-300 cursor-pointer relative overflow-hidden ${
                  activeAltarGlyph === 'bat'
                    ? 'bg-gradient-to-b from-[#A855F7] to-[#581C87] border-white scale-105 shadow-[0_0_35px_#A855F7]'
                    : 'bg-[#180A26] border-[#DFB7FF]/60 hover:border-[#DFB7FF] hover:bg-[#25103A]'
                }`}
              >
                <div className="w-14 h-14 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow">
                    <path
                      d="M 50 35 Q 35 15 20 25 Q 25 45 10 55 Q 30 65 42 50 L 45 65 L 55 65 L 58 50 Q 70 65 90 55 Q 75 45 80 25 Q 65 15 50 35 Z"
                      fill="#DFB7FF"
                    />
                    <circle cx="46" cy="45" r="2" fill="#FFFFFF" />
                    <circle cx="54" cy="45" r="2" fill="#FFFFFF" />
                  </svg>
                </div>
                <span className="text-[10px] font-mono font-extrabold text-[#DFB7FF] mt-2 tracking-wider">
                  CHAUVE-SOURIS
                </span>
                <span className="text-[8px] font-mono text-[#8C8494]">Rune de Ténèbres</span>
              </button>
            </div>

            {/* Bouton de Démarrage / Réessai */}
            <div className="mt-5 text-center">
              {altarState === 'idle' && (
                <button
                  onClick={startAltarGame}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#FF7518] to-[#FF9030] hover:brightness-110 text-black font-syne font-extrabold text-xs tracking-wider shadow-[0_0_20px_rgba(255,117,24,0.5)] cursor-pointer"
                >
                  COMMENCER LE RITUEL DES MONOLITHES
                </button>
              )}

              {altarState === 'gameover' && (
                <button
                  onClick={startAltarGame}
                  className="px-8 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-syne font-extrabold text-xs tracking-wider flex items-center gap-2 mx-auto cursor-pointer shadow-[0_0_20px_rgba(239,68,68,0.5)]"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>RÉINVOQUER L'AUTEL SACRÉ</span>
                </button>
              )}
            </div>
          </VictorianIronworkCard>
        </div>
      )}

      {/* ONGLET 4 : LES SARCOPHAGES DE LA CRYPTE ENRICHI DE GRAPHISMES */}
      {activeTab === 'sarcophagi' && (
        <div className="flex flex-col gap-4 animate-fadeIn">
          {/* Bannière Visuelle de la Crypte */}
          <div className="relative rounded-2xl overflow-hidden border border-[#39FF14]/50 shadow-[0_0_30px_rgba(57,255,20,0.2)]">
            <div className="h-44 sm:h-52 w-full relative">
              <img
                src="/assets/games/crypt_sarcophagus.jpg"
                alt="Catacombes et Sarcophages"
                className="w-full h-full object-cover object-center filter brightness-90 contrast-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0B]/80 via-transparent to-[#0B0B0B]/80" />

              <div className="absolute bottom-3 left-4 right-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#FF7518] font-bold">
                      ★ EXPÉDITION SOUTERRAINE • ÉTAGE {sarcophagiFloor} ★
                    </span>
                    <span className="text-xs text-[#8C8494]">·</span>
                    <span className="text-[10px] font-mono text-[#39FF14]">
                      {getFloorName(sarcophagiFloor)}
                    </span>
                  </div>
                  <h3 className="font-syne font-extrabold text-xl sm:text-2xl text-[#E6E1DC]">
                    Les Sarcophages de la Crypte
                  </h3>
                  <p className="text-[11px] font-mono text-[#A89CAE] max-w-lg mt-0.5 hidden xs:block">
                    Fouillez les cercueils de pierre pour amasser les reliques royales. Trouvez la <strong className="text-[#FBBF24]">Clé 🗝️</strong> pour descendre plus profondément !
                  </p>
                </div>

                <div className="bg-[#0B0B0B]/90 border border-[#39FF14]/50 rounded-xl px-3 py-1.5 flex items-center gap-2.5 backdrop-blur-md">
                  <Trophy className="w-4 h-4 text-[#39FF14]" />
                  <div>
                    <span className="text-[9px] font-mono text-[#8C8494] block uppercase">Butin Déterré</span>
                    <span className="font-syne font-black text-sm sm:text-base text-[#39FF14] text-glow-ectoplasm">
                      {sarcophagiScore.toLocaleString()} PTS
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <VictorianIronworkCard highlightGlow="green" className="p-4 sm:p-5 relative">
            <VictorianCornerFlourish position="top-left" color="#39FF14" />
            <VictorianCornerFlourish position="top-right" color="#39FF14" />

            {/* Bandeau d'information dynamique */}
            {sarcophagiMessage && (
              <div className="mb-3 px-3 py-2 rounded-xl bg-[#140A1E] border border-[#6A0DAD]/60 text-center">
                <span className="text-xs font-mono text-[#DFB7FF]">{sarcophagiMessage}</span>
              </div>
            )}

            {/* Butin accumulé & Statuts d'exploration */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 px-3 py-2.5 rounded-xl bg-[#0B0B0B]/85 border border-[#39FF14]/40 mb-4">
              <div>
                <span className="text-[9px] font-mono uppercase text-[#8C8494] block">Butin Funéraire</span>
                <span className="font-syne font-black text-lg sm:text-xl text-[#39FF14] text-glow-ectoplasm">
                  {sarcophagiScore.toLocaleString()} PTS
                </span>
              </div>

              <div>
                <span className="text-[9px] font-mono uppercase text-[#8C8494] block">Étage Actuel</span>
                <span className="font-syne font-bold text-sm text-[#FF7518]">
                  Niveau #{sarcophagiFloor}
                </span>
              </div>

              <div>
                <span className="text-[9px] font-mono uppercase text-[#8C8494] block">Protection</span>
                <span className={`text-xs font-mono font-bold flex items-center gap-1 ${sarcophagiShield ? 'text-[#38BDF8]' : 'text-[#8C8494]'}`}>
                  <Shield className="w-3.5 h-3.5" />
                  {sarcophagiShield ? 'Bouclier Actif' : 'Aucune'}
                </span>
              </div>

              <div className="text-right sm:text-left">
                <span className="text-[9px] font-mono uppercase text-[#DFB7FF] block">Malédictions</span>
                <span className="text-xs font-mono text-red-400 font-bold">
                  {sarcophagiFloor === 1 ? '1' : sarcophagiFloor === 2 ? '2' : sarcophagiFloor === 3 ? '3' : '4'} Pièges 💀
                </span>
              </div>
            </div>

            {/* Grille 3x3 des 9 sarcophages avec rendu 3D de cercueil de pierre */}
            <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto aspect-square">
              {sarcophagiGrid.map((tile) => (
                <button
                  key={tile.id}
                  onClick={() => handleSarcophagusClick(tile)}
                  disabled={tile.revealed || sarcophagiGameOver || sarcophagiWon}
                  aria-label={`Sarcophage #${tile.id + 1}`}
                  className={`rounded-2xl border-2 flex flex-col items-center justify-center p-2 transition-all duration-300 cursor-pointer relative overflow-hidden ${
                    tile.revealed
                      ? tile.content === 'curse'
                        ? 'bg-[#280505] border-red-500 shadow-[0_0_25px_#ef4444]'
                        : 'bg-[#161F18] border-[#39FF14] shadow-[0_0_20px_rgba(57,255,20,0.4)]'
                      : 'bg-gradient-to-b from-[#1C1426] to-[#100918] border-[#6A0DAD]/60 hover:border-[#39FF14] hover:scale-105 shadow-[0_4px_12px_rgba(0,0,0,0.6)]'
                  }`}
                >
                  {!tile.revealed ? (
                    <>
                      {/* Cercueil de pierre fermé avec croix et gravures */}
                      <svg viewBox="0 0 60 80" className="w-10 h-14 filter drop-shadow">
                        <polygon points="12,10 48,10 56,28 48,74 12,74 4,28" fill="#2E203C" stroke="#6A0DAD" strokeWidth="2" />
                        <polygon points="16,14 44,14 50,28 44,70 16,70 10,28" fill="#1E1428" stroke="#4C2A68" strokeWidth="1" />
                        <line x1="30" y1="25" x2="30" y2="55" stroke="#DFB7FF" strokeWidth="2" opacity="0.6" />
                        <line x1="20" y1="35" x2="40" y2="35" stroke="#DFB7FF" strokeWidth="2" opacity="0.6" />
                      </svg>
                      <span className="text-[8px] font-mono text-[#8C8494] mt-1">Sarcophage #{tile.id + 1}</span>
                    </>
                  ) : tile.content === 'curse' ? (
                    <>
                      <span className="text-3xl animate-bounce">🧟</span>
                      <span className="text-[8px] font-mono font-bold text-red-400 mt-1">MALÉDICTION</span>
                    </>
                  ) : tile.content === 'key' ? (
                    <>
                      <span className="text-3xl animate-bounce filter drop-shadow-[0_0_8px_#FBBF24]">🗝️</span>
                      <span className="text-[8px] font-mono font-bold text-[#FBBF24] mt-1">+300 Clé</span>
                    </>
                  ) : tile.content === 'shield' ? (
                    <>
                      <span className="text-3xl animate-pulse filter drop-shadow-[0_0_8px_#38BDF8]">🛡️</span>
                      <span className="text-[8px] font-mono font-bold text-[#38BDF8] mt-1">+200 Élixir</span>
                    </>
                  ) : tile.content === 'gem' ? (
                    <>
                      <span className="text-3xl animate-pulse filter drop-shadow-[0_0_8px_#DFB7FF]">💎</span>
                      <span className="text-[8px] font-mono font-bold text-[#DFB7FF] mt-1">+400 Gemme</span>
                    </>
                  ) : tile.content === 'relic' ? (
                    <>
                      <span className="text-3xl animate-spin-slow filter drop-shadow-[0_0_8px_#FFD700]">👑</span>
                      <span className="text-[8px] font-mono font-bold text-[#FFD700] mt-1">+750 Relique</span>
                    </>
                  ) : (
                    <>
                      <span className="text-3xl filter drop-shadow-[0_0_8px_#FF7518]">🍬</span>
                      <span className="text-[8px] font-mono font-bold text-[#FF7518] mt-1">+150 Bonbon</span>
                    </>
                  )}
                </button>
              ))}
            </div>

            {/* Actions de fin de tour ou descente */}
            <div className="mt-5 flex flex-col items-center gap-2.5">
              {sarcophagiHasKey && !sarcophagiGameOver && (
                <button
                  onClick={handleNextFloor}
                  className="w-full max-w-sm py-3 px-4 rounded-xl bg-gradient-to-r from-[#FF7518] to-[#39FF14] text-black font-syne font-extrabold text-xs tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(57,255,20,0.5)] cursor-pointer active:scale-95 transition-all"
                >
                  <ArrowDownCircle className="w-4 h-4" />
                  <span>DESCENDRE À L'ÉTAGE {sarcophagiFloor + 1} (+{calculateFloorClearBonus(sarcophagiFloor)} PTS BONUS)</span>
                </button>
              )}

              {sarcophagiGameOver && (
                <div className="flex flex-col items-center gap-2">
                  <span className="text-red-400 font-mono text-xs font-bold">
                    La goule vous a terrassé ! Votre butin s'est éparpillé.
                  </span>
                  <button
                    onClick={startSarcophagiGame}
                    className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-syne text-xs font-bold flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                  >
                    <RotateCcw className="w-4 h-4" /> Recommencer à l'Étage 1
                  </button>
                </div>
              )}

              {sarcophagiWon && (
                <div className="flex flex-col items-center gap-2">
                  <span className="text-[#39FF14] font-mono text-xs font-bold text-glow-ectoplasm">
                    Étage sanctifié ! Tous les trésors ont été exhumés (+{sarcophagiScore} PTS).
                  </span>
                  <button
                    onClick={startSarcophagiGame}
                    className="px-6 py-2.5 rounded-xl bg-[#39FF14] hover:bg-[#79ff5b] text-black font-syne text-xs font-bold flex items-center gap-2 cursor-pointer shadow-[0_0_15px_#39FF14]"
                  >
                    <RotateCcw className="w-4 h-4" /> Nouvelle Expédition
                  </button>
                </div>
              )}

              {!sarcophagiGameOver && !sarcophagiWon && sarcophagiScore > 0 && (
                <button
                  onClick={() => {
                    playGoldenFrenzy(true);
                    setSarcophagiWon(true);
                    setSarcophagiMessage(`Victoire ! Vous vous êtes enfui avec ${sarcophagiScore.toLocaleString()} PTS de reliques !`);
                  }}
                  className="w-full max-w-sm py-2.5 rounded-xl bg-[#FF7518] hover:bg-[#ff8b38] text-black font-syne text-xs font-bold cursor-pointer shadow-[0_0_15px_rgba(255,117,24,0.4)] transition-all"
                >
                  Encaisser le Butin ({sarcophagiScore.toLocaleString()} PTS) et Férir la Crypte
                </button>
              )}
            </div>
          </VictorianIronworkCard>
        </div>
      )}

      {/* ONGLET 5 : LE CHAUDRON D'AWEN (ALCHIMIE DE POTION NOUVEAU) */}
      {activeTab === 'cauldron' && (
        <WitchCauldronGame
          highScore={highScore}
          onUpdateHighScore={onUpdateHighScore}
        />
      )}

      {/* ONGLET 6 : LE LABYRINTHE DU FOSSOYEUR (DUNGEON CRAWLER NOUVEAU) */}
      {activeTab === 'labyrinth' && (
        <GraveLabyrinthGame
          highScore={highScore}
          onUpdateHighScore={onUpdateHighScore}
        />
      )}

      {/* MODAL DU PANTHÉON DES DAMNÉS (TROPHY CABINET / HALL OF FAME) */}
      {isHallOfFameOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-2xl bg-[#0F0818] border-2 border-[#6A0DAD] rounded-2xl p-5 relative shadow-[0_0_40px_rgba(106,13,173,0.5)] overflow-hidden">
            <VictorianCornerFlourish position="top-left" color="#FF7518" />
            <VictorianCornerFlourish position="top-right" color="#FF7518" />

            <button
              onClick={() => setIsHallOfFameOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#1C0E28] hover:bg-[#2A143E] border border-[#6A0DAD] text-[#DFB7FF] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center mb-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#39FF14] font-bold">
                ★ LE PANTHÉON DES DAMNÉS ★
              </span>
              <h3 className="font-syne font-extrabold text-2xl text-[#E6E1DC] mt-1">
                Grand Grimoire des Trophées
              </h3>
              <p className="text-xs font-mono text-[#8C8494] mt-1">
                Tableau récapitulatif de votre puissance nécromantique sur l'ensemble des 6 épreuves de SpookyBeats.
              </p>
            </div>

            {/* Puissance d'Âme Totale */}
            <div className="p-3.5 rounded-xl bg-[#1C1028] border border-[#FF7518]/60 flex items-center justify-between mb-4 shadow-[0_0_20px_rgba(255,117,24,0.2)]">
              <div className="flex items-center gap-3">
                <Crown className="w-7 h-7 text-[#FFD700] animate-bounce" />
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#8C8494] block">Puissance Spirituelle Cumulée</span>
                  <span className="font-syne font-black text-xl sm:text-2xl text-[#FF7518] text-glow-pumpkin">
                    {totalSoulPower.toLocaleString()} POINTS D'ÂME
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-[#39FF14] block">Titre Suprême</span>
                <span className="text-xs font-syne font-bold text-[#E6E1DC]">
                  {totalSoulPower >= 30000
                    ? 'Archi-Nécromancien Légendaire'
                    : totalSoulPower >= 15000
                    ? 'Maître des Sépulcres'
                    : totalSoulPower >= 8000
                    ? 'Érudit des Cryptes'
                    : 'Initié du Sabbat'}
                </span>
              </div>
            </div>

            {/* Grille des 6 Mini-Jeux et de leurs scores */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-80 overflow-y-auto pr-1">
              <div className="p-3 rounded-xl bg-[#140A1E] border border-[#FF7518]/40 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">🎃</span>
                  <div>
                    <span className="font-syne font-bold text-xs text-[#E6E1DC] block">Massacre de Citrouilles</span>
                    <span className="text-[9px] font-mono text-[#8C8494]">Réflexe & Frappe Syncopée</span>
                  </div>
                </div>
                <span className="font-syne font-bold text-sm text-[#FF7518]">{highScore.toLocaleString()} pts</span>
              </div>

              <div className="p-3 rounded-xl bg-[#140A1E] border border-[#39FF14]/40 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">⚡</span>
                  <div>
                    <span className="font-syne font-bold text-xs text-[#E6E1DC] block">Requiem du Rythme</span>
                    <span className="text-[9px] font-mono text-[#8C8494]">Cadence & Précision 4 Pistes</span>
                  </div>
                </div>
                <span className="font-syne font-bold text-sm text-[#39FF14]">{rhythmScore.toLocaleString()} pts</span>
              </div>

              <div className="p-3 rounded-xl bg-[#140A1E] border border-[#6A0DAD]/60 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">🔮</span>
                  <div>
                    <span className="font-syne font-bold text-xs text-[#E6E1DC] block">Autel Simon Occulte</span>
                    <span className="text-[9px] font-mono text-[#8C8494]">Mémoire des 4 Monolithes</span>
                  </div>
                </div>
                <span className="font-syne font-bold text-sm text-[#DFB7FF]">{altarScore.toLocaleString()} pts</span>
              </div>

              <div className="p-3 rounded-xl bg-[#140A1E] border border-[#FF7518]/40 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">⚰️</span>
                  <div>
                    <span className="font-syne font-bold text-xs text-[#E6E1DC] block">Sarcophages de Crypte</span>
                    <span className="text-[9px] font-mono text-[#8C8494]">Stop ou Encore & Clés</span>
                  </div>
                </div>
                <span className="font-syne font-bold text-sm text-[#FF7518]">{sarcophagiScore.toLocaleString()} pts</span>
              </div>

              <div className="p-3 rounded-xl bg-[#140A1E] border border-cyan-500/40 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">🧪</span>
                  <div>
                    <span className="font-syne font-bold text-xs text-[#E6E1DC] block">Chaudron d'Awen</span>
                    <span className="text-[9px] font-mono text-[#8C8494]">Alchimie & Température</span>
                  </div>
                </div>
                <span className="font-syne font-bold text-sm text-cyan-300">{cauldronScore.toLocaleString()} pts</span>
              </div>

              <div className="p-3 rounded-xl bg-[#140A1E] border border-amber-500/40 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">🧭</span>
                  <div>
                    <span className="font-syne font-bold text-xs text-[#E6E1DC] block">Labyrinthe du Fossoyeur</span>
                    <span className="text-[9px] font-mono text-[#8C8494]">Rogue-lite 5x5 Catacombes</span>
                  </div>
                </div>
                <span className="font-syne font-bold text-sm text-amber-400">{labyrinthScore.toLocaleString()} pts</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#6A0DAD]/30 text-center">
              <button
                onClick={() => setIsHallOfFameOpen(false)}
                className="px-6 py-2 rounded-xl bg-[#6A0DAD] hover:bg-[#7E12CE] text-white font-syne font-bold text-xs tracking-wider cursor-pointer shadow-[0_0_15px_rgba(106,13,173,0.4)]"
              >
                FERMER LE PANTHÉON
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
