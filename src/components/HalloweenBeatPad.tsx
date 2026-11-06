import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Square, 
  Volume2, 
  Sliders, 
  Sparkles, 
  Zap, 
  Activity, 
  Flame, 
  RotateCcw, 
  Music2, 
  Clock,
  Radio,
  Download,
  Mic,
  Dices,
  Save,
  FolderOpen
} from 'lucide-react';
import { audioEngine } from '../audio/audioEngine';
import { 
  GOTHIC_RHYTHM_PRESETS, 
  createEmptySequence, 
  generateRandomPattern, 
  RhythmPreset 
} from '../game/beatPadLogic';
import { 
  playMp3Sfx, 
  playDoorCreak, 
  playEvilLaugh, 
  playGhostHowl, 
  playTombstoneThud, 
  playTrapExplosion, 
  playGoldenFrenzy,
  playEctoClick,
  getAudioContext 
} from '../audio/sfx';
import { 
  VictorianIronworkCard, 
  VictorianFiligreeDivider, 
  VictorianCornerFlourish,
  HorrorGargoyle, 
  DrippingBloodAccent,
  GothicCobwebCorner,
  WroughtIronCrest
} from './GothicDecorations';

interface PadConfig {
  id: string;
  name: string;
  subtitle: string;
  keyLabel: string;
  color: string;
  glowColor: string;
  trigger: () => void;
  sfxFilename?: string;
}

export const HalloweenBeatPad: React.FC = () => {
  const [activePad, setActivePad] = useState<string | null>(null);
  const [isLooping, setIsLooping] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [bpm, setBpm] = useState<number>(128);
  const [sequence, setSequence] = useState<boolean[][]>([
    // 8 steps pour 4 voix majeures (Kick, Caisse claire, Hi-Hat, Son funeste)
    [true, false, false, false, true, false, false, false],  // Kick
    [false, false, true, false, false, false, true, false],  // Cloche / Snare
    [true, true, true, true, true, true, true, true],        // Hi-Hat
    [false, false, false, true, false, false, false, true],  // Cri / Grincement
  ]);

  // DSP Rack States
  const [eqLow, setEqLow] = useState<number>(0);
  const [eqMid, setEqMid] = useState<number>(0);
  const [eqHigh, setEqHigh] = useState<number>(0);
  const [reverb, setReverb] = useState<number>(0.25);

  useEffect(() => {
    const eq = audioEngine.getEqualizer();
    setEqLow(eq.low);
    setEqMid(eq.mid);
    setEqHigh(eq.high);
    setReverb(audioEngine.getReverbLevel());
  }, []);

  const updateEq = (low: number, mid: number, high: number) => {
    setEqLow(low);
    setEqMid(mid);
    setEqHigh(high);
    audioEngine.setEqualizer(low, mid, high);
  };

  const updateReverb = (level: number) => {
    setReverb(level);
    audioEngine.setReverbLevel(level);
  };

  const resetDsp = () => {
    playEctoClick();
    updateEq(0, 0, 0);
    updateReverb(0.25);
  };

  const loopTimerRef = useRef<number | null>(null);

  // Sons synthétiques percussifs de crypte
  const triggerSyntheticKick = () => {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(32, now + 0.18);

      gain.gain.setValueAtTime(0.7, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.26);
    } catch {
      // Ignorer si audio restreint
    }
  };

  const triggerSyntheticHat = () => {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(8000, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.05);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.07);
    } catch {
      // Ignorer
    }
  };

  const PADS: PadConfig[] = [
    {
      id: 'pad-1',
      name: 'Kick Sépulcral',
      subtitle: 'Percussion de tombeau',
      keyLabel: 'A',
      color: 'from-[#FF7518] to-[#993D00]',
      glowColor: '#FF7518',
      trigger: () => {
        triggerSyntheticKick();
        playTombstoneThud(true);
      },
    },
    {
      id: 'pad-2',
      name: 'Glas Funèbre',
      subtitle: 'Cloche de minuit',
      keyLabel: 'Z',
      color: 'from-[#6A0DAD] to-[#3B0764]',
      glowColor: '#C084FC',
      trigger: () => playMp3Sfx('single-church-bell.mp3', true),
      sfxFilename: 'single-church-bell.mp3',
    },
    {
      id: 'pad-3',
      name: 'Hi-Hat Spectre',
      subtitle: 'Fers de suppliciés',
      keyLabel: 'E',
      color: 'from-[#10B981] to-[#047857]',
      glowColor: '#34D399',
      trigger: () => {
        triggerSyntheticHat();
        playMp3Sfx('chain-noises-scary.mp3', true);
      },
      sfxFilename: 'chain-noises-scary.mp3',
    },
    {
      id: 'pad-4',
      name: 'Grincement Séculaire',
      subtitle: 'Lourd vantail de crypte',
      keyLabel: 'R',
      color: 'from-[#D97706] to-[#78350F]',
      glowColor: '#FBBF24',
      trigger: () => playDoorCreak(true),
    },
    {
      id: 'pad-5',
      name: 'Rire Sardonique',
      subtitle: 'Spectre moqueur',
      keyLabel: 'Q',
      color: 'from-[#EF4444] to-[#991B1B]',
      glowColor: '#F87171',
      trigger: () => playMp3Sfx('evil-laugh-with-reverb.mp3', true),
      sfxFilename: 'evil-laugh-with-reverb.mp3',
    },
    {
      id: 'pad-6',
      name: 'Hurlement de Loup',
      subtitle: 'Pleine lune de sang',
      keyLabel: 'S',
      color: 'from-[#8B5CF6] to-[#5B21B6]',
      glowColor: '#A78BFA',
      trigger: () => playMp3Sfx('wolf-howl.mp3', true),
      sfxFilename: 'wolf-howl.mp3',
    },
    {
      id: 'pad-7',
      name: 'Plainte de Goule',
      subtitle: 'Mort-vivant affamé',
      keyLabel: 'D',
      color: 'from-[#39FF14] to-[#15803D]',
      glowColor: '#39FF14',
      trigger: () => playMp3Sfx('zombie-moan.mp3', true),
      sfxFilename: 'zombie-moan.mp3',
    },
    {
      id: 'pad-8',
      name: 'Sort d’Ombre',
      subtitle: 'Déflagration arcanique',
      keyLabel: 'F',
      color: 'from-[#EC4899] to-[#831843]',
      glowColor: '#F472B6',
      trigger: () => playMp3Sfx('dark-magic-short.mp3', true),
      sfxFilename: 'dark-magic-short.mp3',
    },
  ];

  // Gestion du clavier physique
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      const pad = PADS.find((p) => p.keyLabel === key);
      if (pad) {
        handleTriggerPad(pad);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleTriggerPad = (pad: PadConfig) => {
    playEctoClick();
    setActivePad(pad.id);
    pad.trigger();
    setTimeout(() => setActivePad(null), 180);
  };

  // États de l'Enregistreur Spectral (Session Recorder)
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const recordIntervalRef = useRef<number | null>(null);

  // Presets rythmiques gothiques & Custom Patterns
  const [activePresetId, setActivePresetId] = useState<string | null>('marche_funebre');
  const [presetToast, setPresetToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setPresetToast(msg);
    setTimeout(() => setPresetToast(null), 3000);
  };

  const applyGothicPreset = (preset: RhythmPreset) => {
    playEctoClick();
    setActivePresetId(preset.id);
    setBpm(preset.bpm);
    setSequence(preset.sequence.map((row: boolean[]) => [...row]));
    showToast(`Rythme activé : ${preset.name} (${preset.bpm} BPM)`);
  };

  const handleRandomizePattern = () => {
    playGoldenFrenzy(true);
    const randomized = generateRandomPattern();
    setSequence(randomized);
    setActivePresetId(null);
    showToast('Motif invoqué par les arcanes du hasard !');
  };

  const handleClearPattern = () => {
    playEctoClick();
    setSequence(createEmptySequence());
    setActivePresetId(null);
    showToast('Matrice de crypte effacée.');
  };

  const handleSaveCustomPattern = () => {
    try {
      playGoldenFrenzy(true);
      const data = { bpm, sequence, timestamp: Date.now() };
      localStorage.setItem('spookybeats_custom_pattern', JSON.stringify(data));
      showToast('Votre motif rythmique a été gravé dans la mémoire de la crypte !');
    } catch {
      showToast('Impossible de graver le motif dans ce grimoire.');
    }
  };

  const handleLoadCustomPattern = () => {
    try {
      const saved = localStorage.getItem('spookybeats_custom_pattern');
      if (saved) {
        playDoorCreak(true);
        const data = JSON.parse(saved);
        if (data.bpm) setBpm(data.bpm);
        if (data.sequence) setSequence(data.sequence);
        setActivePresetId(null);
        showToast('Motif personnel restauré avec succès !');
      } else {
        showToast('Aucun motif préalablement gravé.');
      }
    } catch {
      showToast('Erreur lors de la lecture du grimoire.');
    }
  };

  // Boucle du séquenceur 8-pas
  useEffect(() => {
    if (!isLooping) {
      if (loopTimerRef.current) clearInterval(loopTimerRef.current);
      setCurrentStep(0);
      return;
    }

    const stepDurationMs = (60 / bpm / 2) * 1000;

    loopTimerRef.current = window.setInterval(() => {
      setCurrentStep((prev) => {
        const next = (prev + 1) % 8;

        // Déclenchement des voix actives
        if (sequence[0][next]) triggerSyntheticKick();
        if (sequence[1][next]) playMp3Sfx('single-church-bell.mp3', false);
        if (sequence[2][next]) triggerSyntheticHat();
        if (sequence[3][next]) playDoorCreak(false);

        return next;
      });
    }, stepDurationMs);

    return () => {
      if (loopTimerRef.current) clearInterval(loopTimerRef.current);
    };
  }, [isLooping, bpm, sequence]);

  // Enregistrement Audio de Session
  const startRecording = () => {
    playEctoClick();
    recordedChunksRef.current = [];
    setRecordedAudioUrl(null);

    try {
      const dest = audioEngine.getRecordingDestination();
      if (!dest) {
        alert('Enregistrement non disponible sur ce navigateur.');
        return;
      }

      const recorder = new MediaRecorder(dest.stream);

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedAudioUrl(url);
      };

      recorder.start(100);
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordingSeconds(0);

      recordIntervalRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.warn('MediaRecorder non supporté dans cet environnement', err);
    }
  };

  const stopRecording = () => {
    playEctoClick();
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    if (recordIntervalRef.current) clearInterval(recordIntervalRef.current);
  };

  // Formatage mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const toggleSequenceCell = (trackIdx: number, stepIdx: number) => {
    playEctoClick();
    setSequence((prev) => {
      const copy = prev.map((row) => [...row]);
      copy[trackIdx][stepIdx] = !copy[trackIdx][stepIdx];
      return copy;
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* En-tête de section avec Ferronnerie Victorienne & Crête Gothique */}
      <div className="relative">
        <WroughtIronCrest className="mb-0.5 opacity-70" accentColor="#FF7518" />
        <VictorianIronworkCard highlightGlow="orange" accentColor="#FF7518" className="p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="p-1.5 rounded-lg bg-[#2B1642] text-[#FF7518] border border-[#FF7518]/50 shadow-[0_0_10px_rgba(255,117,24,0.3)]">
                  <Music2 className="w-4 h-4 animate-pulse" />
                </span>
                <span className="text-[10px] font-mono tracking-widest uppercase text-[#39FF14] font-bold">
                  Ferronnerie Victorienne & Alchimie Sonore
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white font-['Cinzel_Decorative','Syne',serif] tracking-wider text-engraved">
                L'Atelier Alchimique Sonore
              </h1>
              <p className="text-xs text-[#C8C2D4] mt-1 font-mono max-w-xl">
                Frappez les stèles d'onyx pour composer vos rythmes spectraux en superposition avec les 19 morceaux d'Hylst.
              </p>
            </div>

            {/* Contrôle de lecture de la boucle */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  playEctoClick();
                  setIsLooping(!isLooping);
                }}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-['Cinzel_Decorative','Syne',serif] text-xs font-bold transition-all border shadow-lg cursor-pointer ${
                  isLooping
                    ? 'bg-[#EF4444] text-white border-[#EF4444] shadow-[0_0_20px_#EF4444] animate-pulse'
                    : 'bg-gradient-to-r from-[#FF7518] to-[#8B1AD6] text-white border-[#FFB060]/70 shadow-[0_0_18px_rgba(255,117,24,0.45)] hover:brightness-110 active:scale-95'
                }`}
              >
                {isLooping ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                <span>{isLooping ? 'Arrêter la Boucle' : 'Lancer le Séquenceur'}</span>
              </button>
            </div>
          </div>

          <VictorianFiligreeDivider className="my-3 opacity-60" accentColor="#FF7518" />

          <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-[#DFB7FF] pt-1">
            <span>Cadence alchimique : {bpm} BPM</span>
            <span className="text-[#39FF14]">8 Dalles d'Onyx Gravées • Synthèse & MP3 d'Hylst</span>
          </div>
        </VictorianIronworkCard>
      </div>

      {/* Le Magnétophone Spectral : Enregistreur Audio de Session */}
      <VictorianIronworkCard highlightGlow="purple" accentColor="#EF4444" className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className={`w-3.5 h-3.5 rounded-full ${isRecording ? 'bg-[#EF4444] shadow-[0_0_15px_#EF4444] animate-ping' : 'bg-[#EF4444]/40'}`} />
            <div>
              <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                Le Magnétophone Spectral (Session REC)
              </h2>
              <span className="text-xs text-[#A69EAF]">
                Enregistrez votre performance en direct (musique d'Hylst + percussions de crypte)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isRecording ? (
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-[#EF4444] animate-pulse bg-black/50 px-2.5 py-1 rounded-lg border border-[#EF4444]/60">
                  REC {formatTime(recordingSeconds)}
                </span>
                <button
                  onClick={stopRecording}
                  className="px-4 py-2 rounded-xl bg-[#EF4444] text-white font-mono text-xs font-bold shadow-[0_0_15px_#EF4444] transition-all hover:bg-[#DC2626]"
                >
                  Arrêter l'enregistrement
                </button>
              </div>
            ) : (
              <button
                onClick={startRecording}
                className="px-4 py-2 rounded-xl bg-[#2A1117] border border-[#EF4444]/80 hover:bg-[#EF4444] text-[#FCA5A5] hover:text-white font-mono text-xs font-bold transition-all shadow-[0_0_12px_rgba(239,68,68,0.25)] flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
                Enregistrer la Session
              </button>
            )}
          </div>
        </div>

        {/* Aperçu audio et téléchargement si session enregistrée */}
        {recordedAudioUrl && (
          <div className="mt-4 p-3.5 rounded-xl bg-[#09040F] border border-[#39FF14]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn shadow-inner">
            <div className="flex items-center gap-2 text-xs font-mono text-[#39FF14]">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Session spectrale immortalisée avec succès !</span>
            </div>

            <div className="flex items-center gap-3">
              <audio src={recordedAudioUrl} controls className="h-8 max-w-[220px]" />
              <a
                href={recordedAudioUrl}
                download="spookybeats_session.webm"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#39FF14] text-black font-mono text-xs font-bold hover:bg-[#4EFA2E] transition-all shadow-[0_0_12px_#39FF14]"
              >
                <Download className="w-3.5 h-3.5" />
                Télécharger (.webm)
              </a>
            </div>
          </div>
        )}
      </VictorianIronworkCard>

      {/* Grille des 8 Pads de Frappe façonnés en Dalles d'Onyx et Ferronnerie */}
      <VictorianIronworkCard highlightGlow="purple" accentColor="#DFB7FF" className="p-4 sm:p-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#6A0DAD]/30 mb-3.5">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#39FF14]" />
            <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Stèles d'Onyx & Pads de Percussion
            </h2>
          </div>
          <span className="text-[10px] font-mono text-[#8C8494] hidden sm:inline">
            Clavier : A - Z - E - R  /  Q - S - D - F
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-3.5">
          {PADS.map((pad) => {
            const isActive = activePad === pad.id;
            return (
              <button
                key={pad.id}
                onClick={() => handleTriggerPad(pad)}
                className={`relative overflow-hidden h-28 sm:h-32 rounded-xl border-2 p-3 flex flex-col justify-between text-left transition-all duration-100 select-none cursor-pointer group shadow-lg ${
                  isActive
                    ? 'border-[#39FF14] scale-95 bg-gradient-to-b from-[#241738] to-[#120B1C]'
                    : 'bg-gradient-to-b from-[#180F26] via-[#0F071A] to-[#07030C] border-[#6A0DAD]/60 hover:border-[#FF7518] hover:shadow-[0_0_15px_rgba(255,117,24,0.3)]'
                }`}
                style={{
                  boxShadow: isActive ? `0 0 25px ${pad.glowColor}, inset 0 0 15px ${pad.glowColor}40` : undefined,
                }}
              >
                {/* Filigrane d'angle victorien intérieur au pad */}
                <div className="absolute top-1 right-1 pointer-events-none opacity-40 group-hover:opacity-80 transition-opacity">
                  <svg width="18" height="18" viewBox="0 0 18 18">
                    <path d="M0,0 L18,0 L18,18" stroke="#DFB7FF" strokeWidth="1" fill="none" />
                    <circle cx="12" cy="6" r="1.5" fill="#FF7518" />
                  </svg>
                </div>

                <div className="flex items-center justify-between w-full">
                  <span className="w-7 h-7 rounded-lg bg-[#08030E] border border-[#6A0DAD]/70 text-xs font-mono font-black text-[#DFB7FF] flex items-center justify-center group-hover:border-[#FF7518] group-hover:text-white transition-colors shadow-inner">
                    {pad.keyLabel}
                  </span>
                  <span className="text-[9px] font-mono text-[#8C8494] tracking-widest uppercase">
                    PAD
                  </span>
                </div>

                <div>
                  <h3 className="text-xs sm:text-sm font-['Cinzel_Decorative','Syne',serif] font-bold text-white leading-tight group-hover:text-[#FF7518] transition-colors text-engraved">
                    {pad.name}
                  </h3>
                  <p className="text-[10px] text-[#DFB7FF] truncate mt-0.5 font-['MedievalSharp','Space_Grotesk',cursive] opacity-80">
                    {pad.subtitle}
                  </p>
                </div>

                {/* Barre indicatrice de résonance */}
                <div className="w-full h-1 bg-[#12071C] rounded-full overflow-hidden mt-1">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isActive ? 'w-full bg-[#39FF14]' : 'w-0 group-hover:w-1/3 bg-[#FF7518]'
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </VictorianIronworkCard>

      {/* Séquenceur Pas-à-Pas (8 Steps) & Presets */}
      <VictorianIronworkCard highlightGlow="green" accentColor="#39FF14" className="p-4 sm:p-5">
        <div className="space-y-3 pb-3 border-b border-[#6A0DAD]/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#39FF14]" />
              <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Séquenceur de Crypte (8 Pas)
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-[#39FF14] font-bold">Tempo : {bpm} BPM</span>
              <input
                type="range"
                min="80"
                max="160"
                value={bpm}
                onChange={(e) => setBpm(parseInt(e.target.value, 10))}
                className="w-24 accent-[#39FF14] cursor-pointer"
              />
            </div>
          </div>

          {/* 5 Presets Rythmiques Gothiques Curatés */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-mono text-[#DFB7FF] mr-1 font-semibold">5 Presets :</span>
            {GOTHIC_RHYTHM_PRESETS.map((preset) => {
              const isSelected = activePresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => applyGothicPreset(preset)}
                  title={preset.description}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#39FF14] text-black border-[#39FF14] font-bold shadow-[0_0_10px_#39FF14]'
                      : 'bg-[#1C1226] hover:bg-[#6A0DAD] text-[#E6E1DC] border-[#6A0DAD]/50'
                  }`}
                >
                  {preset.name} ({preset.bpm})
                </button>
              );
            })}
          </div>

          {/* Outils Alchimiques : Aléatoire, Sauvegarder, Charger, Effacer */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#6A0DAD]/20">
            <button
              onClick={handleRandomizePattern}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#241335] hover:bg-[#FF7518] text-[#FFB060] hover:text-black border border-[#FF7518]/50 text-[10px] font-mono transition-all cursor-pointer font-bold"
              title="Générer un motif sépulcral procédural aléatoire"
            >
              <Dices className="w-3 h-3" />
              <span>Invoquer Aléatoire</span>
            </button>

            <button
              onClick={handleSaveCustomPattern}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#141F16] hover:bg-[#39FF14] text-[#86EFAC] hover:text-black border border-[#39FF14]/50 text-[10px] font-mono transition-all cursor-pointer"
              title="Enregistrer ce motif dans votre grimoire local"
            >
              <Save className="w-3 h-3" />
              <span>Sauvegarder Sabbat</span>
            </button>

            <button
              onClick={handleLoadCustomPattern}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#19192B] hover:bg-[#C084FC] text-[#D8B4FE] hover:text-black border border-[#C084FC]/50 text-[10px] font-mono transition-all cursor-pointer"
              title="Restaurer votre motif gravé"
            >
              <FolderOpen className="w-3 h-3" />
              <span>Charger Sabbat</span>
            </button>

            <button
              onClick={handleClearPattern}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#1C0E14] hover:bg-[#EF4444] text-[#FCA5A5] hover:text-white border border-[#EF4444]/50 text-[10px] font-mono transition-all cursor-pointer ml-auto"
              title="Effacer toute la grille"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Effacer</span>
            </button>
          </div>

          {/* Toast Notification si action récente */}
          {presetToast && (
            <div className="p-2 rounded-lg bg-[#0D0814] border border-[#39FF14]/60 text-[#39FF14] text-xs font-mono animate-fadeIn text-center flex items-center justify-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{presetToast}</span>
            </div>
          )}
        </div>

        {/* Grille du séquenceur stylisée en lanternes victoriennes */}
        <div className="space-y-2.5 pt-3">
          {['Kick Sépulcre', 'Cloche Glas', 'Hi-Hat Spectre', 'Porte Crypte'].map((label, trackIdx) => (
            <div key={trackIdx} className="flex items-center gap-2.5">
              <span className="w-24 sm:w-28 text-[11px] font-mono text-[#DFB7FF] truncate text-right shrink-0">
                {label}
              </span>
              <div className="flex-1 grid grid-cols-8 gap-1.5 sm:gap-2">
                {sequence[trackIdx].map((isActive, stepIdx) => {
                  const isCurrent = isLooping && currentStep === stepIdx;
                  return (
                    <button
                      key={stepIdx}
                      onClick={() => toggleSequenceCell(trackIdx, stepIdx)}
                      className={`h-9 sm:h-10 rounded-lg border transition-all cursor-pointer relative overflow-hidden flex items-center justify-center ${
                        isActive
                          ? 'bg-[#FF7518] border-[#FF7518] shadow-[0_0_12px_#FF7518]'
                          : 'bg-[#10071A] border-[#6A0DAD]/50 hover:border-[#DFB7FF]'
                      } ${isCurrent ? 'ring-2 ring-[#39FF14] scale-105 z-10' : ''}`}
                    >
                      {isActive && (
                        <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_6px_#ffffff]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </VictorianIronworkCard>

      {/* Rack DSP : Égaliseur & Réverbération façon Pupitre d'Alchimiste */}
      <VictorianIronworkCard highlightGlow="purple" accentColor="#DFB7FF" className="p-4 sm:p-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#6A0DAD]/30 mb-2">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#DFB7FF]" />
            <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Rack DSP : Égaliseur & Réverbération
            </h2>
          </div>

          <button
            onClick={resetDsp}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1C1226] text-[11px] font-mono text-[#8C8494] hover:text-white border border-[#6A0DAD]/40 hover:border-[#FF7518] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            Réinitialiser
          </button>
        </div>

        <p className="text-xs text-[#A69EAF] font-mono mb-4">
          Potentiomètres de sculpture spectrale intégrés directement dans le moteur Web Audio.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
          {/* Basses */}
          <div className="p-3.5 rounded-xl bg-[#09040F] border border-[#FF7518]/50 space-y-2 relative overflow-hidden shadow-inner">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#FF7518] font-bold">BASSES</span>
              <span className="text-white font-bold">{eqLow > 0 ? `+${eqLow}` : eqLow} dB</span>
            </div>
            <input
              type="range"
              min="-12"
              max="12"
              value={eqLow}
              onChange={(e) => updateEq(parseFloat(e.target.value), eqMid, eqHigh)}
              className="w-full accent-[#FF7518] cursor-pointer"
            />
            <span className="text-[10px] font-mono text-[#8C8494] block text-center">120 Hz LowShelf</span>
          </div>

          {/* Médiums */}
          <div className="p-3.5 rounded-xl bg-[#09040F] border border-[#DFB7FF]/50 space-y-2 relative overflow-hidden shadow-inner">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#DFB7FF] font-bold">MÉDIUMS</span>
              <span className="text-white font-bold">{eqMid > 0 ? `+${eqMid}` : eqMid} dB</span>
            </div>
            <input
              type="range"
              min="-12"
              max="12"
              value={eqMid}
              onChange={(e) => updateEq(eqLow, parseFloat(e.target.value), eqHigh)}
              className="w-full accent-[#C084FC] cursor-pointer"
            />
            <span className="text-[10px] font-mono text-[#8C8494] block text-center">1.2 kHz Peaking</span>
          </div>

          {/* Aigus */}
          <div className="p-3.5 rounded-xl bg-[#09040F] border border-[#39FF14]/50 space-y-2 relative overflow-hidden shadow-inner">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#39FF14] font-bold">AIGUS</span>
              <span className="text-white font-bold">{eqHigh > 0 ? `+${eqHigh}` : eqHigh} dB</span>
            </div>
            <input
              type="range"
              min="-12"
              max="12"
              value={eqHigh}
              onChange={(e) => updateEq(eqLow, eqMid, parseFloat(e.target.value))}
              className="w-full accent-[#39FF14] cursor-pointer"
            />
            <span className="text-[10px] font-mono text-[#8C8494] block text-center">6 kHz HighShelf</span>
          </div>

          {/* Réverbération */}
          <div className="p-3.5 rounded-xl bg-[#09040F] border border-[#FBBF24]/50 space-y-2 relative overflow-hidden shadow-inner">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#FBBF24] font-bold">RÉVERB</span>
              <span className="text-white font-bold">{Math.round(reverb * 100)} %</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={reverb}
              onChange={(e) => updateReverb(parseFloat(e.target.value))}
              className="w-full accent-[#FBBF24] cursor-pointer"
            />
            <span className="text-[10px] font-mono text-[#8C8494] block text-center">Crypte Cathédrale</span>
          </div>
        </div>
      </VictorianIronworkCard>
    </div>
  );
};
