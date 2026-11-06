import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  RotateCcw, 
  Trophy, 
  Flame, 
  Sparkles, 
  Music, 
  Volume2, 
  Skull,
  Zap,
  ChevronDown,
  Award,
  Check,
  CheckCircle2
} from 'lucide-react';
import { TrackMetadata, audioEngine, DEFAULT_TRACKS } from '../audio/audioEngine';
import { playEctoClick, playGoldenFrenzy, playTombstoneThud, playTrapExplosion, playDoorCreak } from '../audio/sfx';

interface RhythmGameRequiemProps {
  currentTrack: TrackMetadata;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

interface NoteItem {
  id: number;
  lane: number; // 0, 1, 2, 3
  y: number; // 0 à 100%
  hit: boolean;
  missed: boolean;
  glyph: string;
}

type DifficultyMode = 'normal' | 'difficile' | 'cauchemar';

const LANES = [
  { key: 'D', label: 'D', color: '#FF7518', border: 'border-[#FF7518]', glyph: '💀' },
  { key: 'F', label: 'F', color: '#6A0DAD', border: 'border-[#6A0DAD]', glyph: '⚡' },
  { key: 'J', label: 'J', color: '#39FF14', border: 'border-[#39FF14]', glyph: '🎃' },
  { key: 'K', label: 'K', color: '#C084FC', border: 'border-[#C084FC]', glyph: '🦇' },
];

export const RhythmGameRequiem: React.FC<RhythmGameRequiemProps> = ({
  currentTrack,
  isPlaying,
  onTogglePlay,
}) => {
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [difficulty, setDifficulty] = useState<DifficultyMode>('normal');
  const [isTrackPickerOpen, setIsTrackPickerOpen] = useState<boolean>(false);
  const [showResultSummary, setShowResultSummary] = useState<boolean>(false);

  // Statistiques de précision
  const [perfectHits, setPerfectHits] = useState<number>(0);
  const [goodHits, setGoodHits] = useState<number>(0);
  const [missedHits, setMissedHits] = useState<number>(0);

  const [highScore, setHighScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('spookybeats_rhythm_high_score') || '1200', 10);
  });
  const [feedback, setFeedback] = useState<{ text: string; color: string } | null>(null);
  const [isGameRunning, setIsGameRunning] = useState<boolean>(false);
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [activeLanes, setActiveLanes] = useState<boolean[]>([false, false, false, false]);

  const nextNoteIdRef = useRef<number>(1);
  const lastSpawnTimeRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);

  // Démarrer la musique si pas déjà lancée
  const startGame = () => {
    setIsGameRunning(true);
    setShowResultSummary(false);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setPerfectHits(0);
    setGoodHits(0);
    setMissedHits(0);
    setNotes([]);
    if (!isPlaying) {
      audioEngine.play();
    }
  };

  const stopGame = () => {
    setIsGameRunning(false);
    setShowResultSummary(true);
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('spookybeats_rhythm_high_score', score.toString());
    }
  };

  // Gestion des appuis de touches
  const triggerLane = (laneIdx: number) => {
    // Animation d'appui
    setActiveLanes((prev) => {
      const copy = [...prev];
      copy[laneIdx] = true;
      return copy;
    });
    setTimeout(() => {
      setActiveLanes((prev) => {
        const copy = [...prev];
        copy[laneIdx] = false;
        return copy;
      });
    }, 120);

    if (!isGameRunning) return;

    // Détection de frappe sur les notes proches de la ligne cible (85% de hauteur)
    const targetY = 85;
    const hitTolerance = 12;

    const targetNote = notes.find(
      (n) => n.lane === laneIdx && !n.hit && !n.missed && Math.abs(n.y - targetY) <= hitTolerance
    );

    if (targetNote) {
      const distance = Math.abs(targetNote.y - targetY);
      targetNote.hit = true;

      if (distance <= 5) {
        // PARFAIT !
        playGoldenFrenzy(true);
        setPerfectHits((p) => p + 1);
        const pts = 100 * (1 + Math.floor(combo / 5) * 0.5);
        setScore((s) => s + Math.round(pts));
        setCombo((c) => {
          const nextC = c + 1;
          setMaxCombo((m) => Math.max(m, nextC));
          return nextC;
        });
        showFeedback('PARFAIT ! +100', '#39FF14');
      } else {
        // SINISTRE !
        playEctoClick();
        setGoodHits((g) => g + 1);
        const pts = 50 * (1 + Math.floor(combo / 5) * 0.5);
        setScore((s) => s + Math.round(pts));
        setCombo((c) => {
          const nextC = c + 1;
          setMaxCombo((m) => Math.max(m, nextC));
          return nextC;
        });
        showFeedback('SINISTRE ! +50', '#FF7518');
      }
    } else {
      // Frappe dans le vide
      showFeedback('TROP TÔT', '#8C8494');
    }
  };

  const showFeedback = (text: string, color: string) => {
    setFeedback({ text, color });
    setTimeout(() => setFeedback(null), 600);
  };

  // Clavier physique
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      if (key === 'D') triggerLane(0);
      else if (key === 'F') triggerLane(1);
      else if (key === 'J') triggerLane(2);
      else if (key === 'K') triggerLane(3);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGameRunning, notes, combo]);

  // Boucle de mise à jour des notes
  useEffect(() => {
    if (!isGameRunning) return;

    let lastTime = performance.now();

    const difficultySpeedMultiplier = difficulty === 'normal' ? 1.0 : difficulty === 'difficile' ? 1.35 : 1.7;
    const difficultySpawnDivider = difficulty === 'normal' ? 1.0 : difficulty === 'difficile' ? 1.3 : 1.6;

    const loop = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      // Vitesse calculée selon le BPM et la difficulté
      const speed = (currentTrack.bpm / 120) * 45 * difficultySpeedMultiplier;

      // Génération de nouvelles notes rythmées
      const spawnInterval = ((60 / currentTrack.bpm) * 1000) / difficultySpawnDivider;
      if (time - lastSpawnTimeRef.current >= spawnInterval) {
        lastSpawnTimeRef.current = time;
        const randomLane = Math.floor(Math.random() * 4);
        setNotes((prev) => [
          ...prev,
          {
            id: nextNoteIdRef.current++,
            lane: randomLane,
            y: 0,
            hit: false,
            missed: false,
            glyph: LANES[randomLane].glyph,
          },
        ]);
      }

      // Mise à jour de la position des notes
      setNotes((prevNotes) => {
        const nextNotes: NoteItem[] = [];

        for (const note of prevNotes) {
          if (note.hit) continue; // Note réussie, retirée
          const newY = note.y + speed * delta;

          // Dépassé la ligne cible sans être touchée
          if (newY > 95 && !note.missed) {
            note.missed = true;
            setMissedHits((m) => m + 1);
            setCombo(0);
            playTrapExplosion(true);
            showFeedback('MANQUÉ !', '#EF4444');
          }

          if (newY <= 105) {
            nextNotes.push({ ...note, y: newY });
          }
        }

        return nextNotes;
      });

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isGameRunning, currentTrack.bpm, difficulty]);

  const totalHits = perfectHits + goodHits + missedHits;
  const accuracy = totalHits > 0 
    ? Math.round(((perfectHits * 100 + goodHits * 60) / (totalHits * 100)) * 100) 
    : 100;

  const getGrade = (acc: number) => {
    if (acc >= 95) return { grade: 'S', title: 'Maître Sépulcral Suprême', color: '#39FF14' };
    if (acc >= 85) return { grade: 'A', title: 'Virtuose des Catacombes', color: '#FF7518' };
    if (acc >= 70) return { grade: 'B', title: 'Initié du Sabbat', color: '#DFB7FF' };
    return { grade: 'C', title: 'Apprenti Déboussolé', color: '#EF4444' };
  };

  const finalGrade = getGrade(accuracy);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* En-tête avec sélecteur de morceau & difficulté */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#1E0E2C] via-[#12091D] to-[#0A0512] border-2 border-[#39FF14]/60 p-5 shadow-[0_0_30px_rgba(57,255,20,0.2)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 rounded-md bg-[#241738] text-[#39FF14] border border-[#39FF14]/40">
                <Music className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#39FF14] font-bold">
                Requiem des Ténèbres
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white font-mono">
              Le Jeu de Rythme Funèbre
            </h1>
            <p className="text-xs text-[#C8C2D4] mt-1">
              Synchronisé au morceau <strong className="text-white">{currentTrack.title}</strong> ({currentTrack.bpm} BPM).
            </p>
          </div>

          {/* Tableau des scores */}
          <div className="flex items-center gap-3 bg-[#0A0512]/90 p-2.5 rounded-xl border border-[#6A0DAD]/50">
            <div>
              <span className="text-[10px] font-mono text-[#8C8494] block">Score</span>
              <span className="text-base font-bold text-white font-mono">{score}</span>
            </div>
            <div className="h-6 w-[1px] bg-[#6A0DAD]/50" />
            <div>
              <span className="text-[10px] font-mono text-[#8C8494] block">Combo</span>
              <span className="text-base font-bold text-[#FF7518] font-mono">x{combo}</span>
            </div>
            <div className="h-6 w-[1px] bg-[#6A0DAD]/50" />
            <div>
              <span className="text-[10px] font-mono text-[#8C8494] block">Record</span>
              <span className="text-base font-bold text-[#39FF14] font-mono">{highScore}</span>
            </div>
          </div>
        </div>

        {/* Ligne des réglages : Morceau & Difficulté */}
        <div className="mt-4 pt-3 border-t border-[#6A0DAD]/40 flex flex-wrap items-center justify-between gap-2.5">
          {/* Bouton de sélection de morceau */}
          <button
            onClick={() => {
              playEctoClick();
              setIsTrackPickerOpen((prev) => !prev);
            }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#241738] border border-[#6A0DAD]/60 text-xs font-mono text-[#DFB7FF] hover:border-[#FF7518] transition-colors"
          >
            <Music className="w-3.5 h-3.5 text-[#FF7518]" />
            <span>Piste : {currentTrack.title}</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {/* Sélecteur de difficulté */}
          <div className="flex items-center gap-1.5 bg-[#0B0612] p-1 rounded-lg border border-[#6A0DAD]/40">
            {(['normal', 'difficile', 'cauchemar'] as DifficultyMode[]).map((diff) => (
              <button
                key={diff}
                onClick={() => {
                  playEctoClick();
                  setDifficulty(diff);
                }}
                disabled={isGameRunning}
                className={`px-2.5 py-1 rounded text-[11px] font-mono uppercase font-bold transition-all ${
                  difficulty === diff
                    ? diff === 'cauchemar'
                      ? 'bg-red-600 text-white shadow-[0_0_10px_#ef4444]'
                      : diff === 'difficile'
                      ? 'bg-[#FF7518] text-black shadow-[0_0_10px_#FF7518]'
                      : 'bg-[#39FF14] text-black shadow-[0_0_10px_#39FF14]'
                    : 'text-[#8C8494] hover:text-white'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Menu déroulant de sélection des 19 morceaux d'Hylst */}
        {isTrackPickerOpen && (
          <div className="mt-3 p-3 rounded-xl bg-[#0F0819] border border-[#6A0DAD] max-h-56 overflow-y-auto no-scrollbar space-y-1.5 animate-fadeIn">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#39FF14] block mb-1">
              ★ 19 Compositions d'Hylst disponibles ★
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {DEFAULT_TRACKS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    playEctoClick();
                    audioEngine.playTrack(t);
                    setIsTrackPickerOpen(false);
                    if (isGameRunning) stopGame();
                  }}
                  className={`p-2 rounded-lg text-left flex items-center justify-between border transition-all ${
                    t.id === currentTrack.id
                      ? 'bg-[#2A1640] border-[#39FF14] text-white'
                      : 'bg-[#150B22] border-[#6A0DAD]/30 text-[#C8C2D4] hover:border-[#FF7518]'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <span className="text-xs font-mono font-bold block truncate">{t.title}</span>
                    <span className="text-[10px] text-[#8C8494] block truncate">{t.artist}</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#39FF14] shrink-0 font-bold">
                    {t.bpm} BPM
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Zone de jeu des 4 Pistes */}
      <section className="relative rounded-2xl bg-[#0E0617] border-2 border-[#6A0DAD]/60 p-4 overflow-hidden shadow-[0_0_25px_rgba(106,13,173,0.3)]">
        {/* Lueur d'ambiance */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-32 bg-[#6A0DAD]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Feedback textuel au centre */}
        {feedback && (
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 font-black text-lg sm:text-xl font-mono tracking-widest pointer-events-none animate-bounce"
            style={{ color: feedback.color, textShadow: `0 0 15px ${feedback.color}` }}
          >
            {feedback.text}
          </div>
        )}

        {/* Hauteur du couloir de défilement (384px) */}
        <div className="relative h-96 grid grid-cols-4 gap-2 border-b-4 border-[#39FF14]">
          {/* Ligne cible d'impact (à 85%) */}
          <div className="absolute top-[85%] left-0 right-0 h-1 bg-gradient-to-r from-[#FF7518] via-[#39FF14] to-[#C084FC] opacity-75 shadow-[0_0_12px_#39FF14] pointer-events-none z-10" />

          {/* 4 Couloirs */}
          {LANES.map((lane, idx) => {
            const isLaneActive = activeLanes[idx];
            return (
              <div
                key={lane.key}
                onClick={() => triggerLane(idx)}
                className={`relative h-full flex flex-col justify-end items-center rounded-xl transition-colors cursor-pointer select-none ${
                  isLaneActive
                    ? 'bg-[#2A153D]'
                    : 'bg-[#140A1F]/80 hover:bg-[#1C0E2B]'
                } border border-[#6A0DAD]/30`}
              >
                {/* Ligne directrice */}
                <div className="absolute inset-y-0 w-[1px] bg-[#6A0DAD]/20 pointer-events-none" />

                {/* Bouton de frappe au bas du couloir */}
                <div
                  className={`w-12 h-12 mb-2 rounded-xl flex flex-col items-center justify-center font-mono font-bold text-white border transition-all ${
                    isLaneActive
                      ? 'scale-90 shadow-[0_0_20px_#39FF14] bg-[#39FF14] text-black border-[#39FF14]'
                      : 'bg-[#1C102A] border-[#6A0DAD]/60'
                  }`}
                  style={{
                    borderColor: isLaneActive ? '#39FF14' : lane.color,
                  }}
                >
                  <span className="text-sm">{lane.label}</span>
                </div>
              </div>
            );
          })}

          {/* Notes en mouvement */}
          {notes.map((note) => {
            const lane = LANES[note.lane];
            return (
              <div
                key={note.id}
                className="absolute z-20 w-11 h-11 -ml-5.5 rounded-full flex items-center justify-center text-lg shadow-lg pointer-events-none transition-transform"
                style={{
                  top: `${note.y}%`,
                  left: `${(note.lane + 0.5) * 25}%`,
                  backgroundColor: lane.color,
                  boxShadow: `0 0 15px ${lane.color}`,
                }}
              >
                <span>{note.glyph}</span>
              </div>
            );
          })}
        </div>

        {/* Contrôles du jeu sous la piste */}
        <div className="flex items-center justify-between pt-4 mt-2">
          <div className="text-xs font-mono text-[#8C8494]">
            Appuyez sur <span className="text-white font-bold">D, F, J, K</span> ou touchez les pistes.
          </div>

          <div className="flex items-center gap-2">
            {!isGameRunning ? (
              <button
                onClick={startGame}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#39FF14] to-[#10B981] hover:from-[#4EFA2E] hover:to-[#16A34A] text-black font-mono text-xs font-black shadow-[0_0_20px_rgba(57,255,20,0.5)] transition-transform active:scale-95"
              >
                <Play className="w-4 h-4 fill-current" />
                Lancer le Requiem
              </button>
            ) : (
              <button
                onClick={stopGame}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#EF4444]/20 border border-[#EF4444] text-[#FCA5A5] font-mono text-xs font-bold hover:bg-[#EF4444]/30 transition-all active:scale-95"
              >
                Terminer la Session
              </button>
            )}
          </div>
        </div>

        {/* Scorecard de fin de session */}
        {showResultSummary && totalHits > 0 && (
          <div className="mt-5 p-4 rounded-xl bg-[#140A1E] border-2 border-[#6A0DAD] shadow-2xl animate-scaleIn">
            <div className="flex items-center justify-between pb-3 border-b border-[#6A0DAD]/40">
              <div className="flex items-center gap-2">
                <span
                  className="w-10 h-10 rounded-xl font-mono font-black text-2xl flex items-center justify-center text-black shadow-lg"
                  style={{ backgroundColor: finalGrade.color }}
                >
                  {finalGrade.grade}
                </span>
                <div>
                  <h3 className="font-mono font-bold text-white text-sm">{finalGrade.title}</h3>
                  <span className="text-xs font-mono text-[#DFB7FF]">Précision : {accuracy}%</span>
                </div>
              </div>

              <span className="font-mono font-bold text-base text-[#39FF14]">
                {score.toLocaleString()} PTS
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 pt-3 text-center font-mono">
              <div className="p-2 rounded-lg bg-[#0A0512]">
                <span className="text-[10px] text-[#39FF14] block">Parfaits</span>
                <span className="text-sm font-bold text-white">{perfectHits}</span>
              </div>
              <div className="p-2 rounded-lg bg-[#0A0512]">
                <span className="text-[10px] text-[#FF7518] block">Sinistres</span>
                <span className="text-sm font-bold text-white">{goodHits}</span>
              </div>
              <div className="p-2 rounded-lg bg-[#0A0512]">
                <span className="text-[10px] text-red-400 block">Manqués</span>
                <span className="text-sm font-bold text-white">{missedHits}</span>
              </div>
              <div className="p-2 rounded-lg bg-[#0A0512]">
                <span className="text-[10px] text-[#DFB7FF] block">Max Combo</span>
                <span className="text-sm font-bold text-white">x{maxCombo}</span>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
