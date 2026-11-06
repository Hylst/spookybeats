import React, { useEffect, useRef, useState } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Sparkles, 
  Flame, 
  Layers, 
  CircleDot,
  Volume2,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { TrackMetadata, audioEngine } from '../audio/audioEngine';
import { playEctoClick } from '../audio/sfx';
import { getAssetUrl } from '../utils/assetPath';

interface ConcertVisualizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTrack: TrackMetadata;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
}

type VisualizerMode = 'flames' | 'mandala' | 'columns';

export const ConcertVisualizerModal: React.FC<ConcertVisualizerModalProps> = ({
  isOpen,
  onClose,
  currentTrack,
  isPlaying,
  onTogglePlay,
  onNext,
  onPrev,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [visMode, setVisMode] = useState<VisualizerMode>('flames');
  const [isControlsVisible, setIsControlsVisible] = useState<boolean>(true);
  const [isNativeFullscreen, setIsNativeFullscreen] = useState<boolean>(false);
  const idleTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const handleFsChange = () => {
      setIsNativeFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleNativeFullscreen = () => {
    playEctoClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  // Masquer les contrôles après 3s d'inactivité de la souris
  const handleMouseMove = () => {
    setIsControlsVisible(true);
    if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    idleTimerRef.current = window.setTimeout(() => {
      setIsControlsVisible(false);
    }, 3200);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        } else {
          onClose();
        }
      }
      if (e.key === ' ') {
        e.preventDefault();
        onTogglePlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onTogglePlay]);

  // Boucle de rendu Canvas réactif au spectre audio
  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const analyser = audioEngine.getAnalyser();
    const dataArray = analyser ? new Uint8Array(analyser.frequencyBinCount) : new Uint8Array(64);

    let angle = 0;

    const render = () => {
      animId = requestAnimationFrame(render);
      angle += 0.015;

      let hasRealAudio = false;
      if (analyser && isPlaying) {
        analyser.getByteFrequencyData(dataArray);
        for (let i = 0; i < dataArray.length; i++) {
          if (dataArray[i] > 0) {
            hasRealAudio = true;
            break;
          }
        }
      }

      if (!hasRealAudio && isPlaying) {
        const curTrack = audioEngine.getCurrentTrack();
        const bpm = curTrack?.bpm || 120;
        const curTime = audioEngine.getCurrentTime();
        const beatProgress = (curTime * (bpm / 60)) % 1;
        const beatPulse = Math.sin(beatProgress * Math.PI);
        for (let i = 0; i < dataArray.length; i++) {
          const normIdx = i / dataArray.length;
          const bassBoost = Math.max(0, 1 - normIdx * 1.4) * (beatPulse * 95 + 40);
          const wave = Math.sin(angle * 1.5 + i * 0.3) * 30;
          dataArray[i] = Math.min(255, Math.max(15, bassBoost + wave + 50));
        }
      } else if (!hasRealAudio && !isPlaying) {
        // Oscillation subtile de repos
        for (let i = 0; i < dataArray.length; i++) {
          dataArray[i] = Math.max(12, Math.sin(angle + i * 0.2) * 25 + 20);
        }
      }

      ctx.fillStyle = 'rgba(11, 11, 11, 0.25)';
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // MODE 1 : FLAMMES SPECTRALES
      if (visMode === 'flames') {
        const barCount = 48;
        const barWidth = (width / barCount) * 0.8;
        const spacing = (width / barCount) * 0.2;

        for (let i = 0; i < barCount; i++) {
          const val = dataArray[i % dataArray.length] / 255;
          const barHeight = val * (height * 0.65);
          const x = i * (barWidth + spacing) + spacing / 2;
          const y = height - barHeight;

          const grad = ctx.createLinearGradient(x, height, x, y);
          grad.addColorStop(0, '#6A0DAD');
          grad.addColorStop(0.5, '#FF7518');
          grad.addColorStop(1, '#39FF14');

          ctx.fillStyle = grad;
          ctx.shadowColor = '#FF7518';
          ctx.shadowBlur = val > 0.6 ? 20 : 6;

          // Forme d'ogive gothique / flamme
          ctx.beginPath();
          ctx.moveTo(x, height);
          ctx.lineTo(x, y + 15);
          ctx.quadraticCurveTo(x + barWidth / 2, y, x + barWidth, y + 15);
          ctx.lineTo(x + barWidth, height);
          ctx.fill();

          ctx.shadowBlur = 0;
        }
      }

      // MODE 2 : MANDALA ARCANIQUE
      else if (visMode === 'mandala') {
        const count = 36;
        const baseRadius = Math.min(width, height) * 0.22;

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(angle * 0.3);

        for (let i = 0; i < count; i++) {
          const val = (dataArray[i % dataArray.length] / 255) || 0.15;
          const rad = (i * Math.PI * 2) / count;
          const len = baseRadius + val * 160;

          const x1 = Math.cos(rad) * baseRadius;
          const y1 = Math.sin(rad) * baseRadius;
          const x2 = Math.cos(rad) * len;
          const y2 = Math.sin(rad) * len;

          ctx.strokeStyle = i % 2 === 0 ? '#39FF14' : '#FF7518';
          ctx.shadowColor = '#39FF14';
          ctx.shadowBlur = val > 0.5 ? 15 : 4;
          ctx.lineWidth = 3;

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();

          // Sceau au bout
          ctx.fillStyle = '#DFB7FF';
          ctx.beginPath();
          ctx.arc(x2, y2, 3 + val * 5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Cœur central pulsant
        const avgEnergy = dataArray.reduce((acc, v) => acc + v, 0) / dataArray.length / 255;
        ctx.fillStyle = '#6A0DAD';
        ctx.shadowColor = '#FF7518';
        ctx.shadowBlur = 30;
        ctx.beginPath();
        ctx.arc(0, 0, baseRadius * 0.65 + avgEnergy * 40, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      // MODE 3 : COLONNES DE CATHÉDRALE
      else if (visMode === 'columns') {
        const cols = 28;
        const colWidth = width / cols;

        for (let i = 0; i < cols; i++) {
          const val = dataArray[i % dataArray.length] / 255;
          const h = val * (height * 0.7);
          const x = i * colWidth;

          // Colonne haute descendante (stalactite)
          const gradTop = ctx.createLinearGradient(x, 0, x, h * 0.5);
          gradTop.addColorStop(0, '#1E1030');
          gradTop.addColorStop(1, '#6A0DAD');
          ctx.fillStyle = gradTop;
          ctx.fillRect(x + 2, 0, colWidth - 4, h * 0.5);

          // Colonne basse ascendante (stalagmite)
          const gradBottom = ctx.createLinearGradient(x, height, x, height - h);
          gradBottom.addColorStop(0, '#FF7518');
          gradBottom.addColorStop(1, '#39FF14');
          ctx.fillStyle = gradBottom;
          ctx.fillRect(x + 2, height - h, colWidth - 4, h);
        }
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen, visMode, isPlaying]);

  if (!isOpen) return null;

  return (
    <div
      onMouseMove={handleMouseMove}
      className="fixed inset-0 z-50 bg-[#0B0B0B] flex flex-col justify-between overflow-hidden cursor-default select-none animate-fadeIn"
    >
      {/* Canvas du visualiseur plein écran */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Barre supérieure flottante */}
      <header
        className={`relative z-10 w-full p-4 sm:p-6 flex items-center justify-between transition-opacity duration-300 ${
          isControlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0B0B0B]/70 backdrop-blur-md border border-[#6A0DAD]/60">
            <Sparkles className="w-4 h-4 text-[#FF7518] animate-pulse" />
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Mode Concert Plein Écran
            </span>
          </div>

          {/* Sélecteur de mode de visualisation */}
          <div className="flex items-center gap-1 bg-[#0B0B0B]/80 backdrop-blur-md p-1 rounded-xl border border-[#6A0DAD]/50 text-xs font-mono">
            <button
              onClick={() => {
                playEctoClick();
                setVisMode('flames');
              }}
              className={`px-3 py-1 rounded-lg transition-colors ${
                visMode === 'flames' ? 'bg-[#FF7518] text-black font-bold' : 'text-[#8C8494] hover:text-white'
              }`}
            >
              Flammes
            </button>
            <button
              onClick={() => {
                playEctoClick();
                setVisMode('mandala');
              }}
              className={`px-3 py-1 rounded-lg transition-colors ${
                visMode === 'mandala' ? 'bg-[#39FF14] text-black font-bold' : 'text-[#8C8494] hover:text-white'
              }`}
            >
              Mandala
            </button>
            <button
              onClick={() => {
                playEctoClick();
                setVisMode('columns');
              }}
              className={`px-3 py-1 rounded-lg transition-colors ${
                visMode === 'columns' ? 'bg-[#6A0DAD] text-white font-bold' : 'text-[#8C8494] hover:text-white'
              }`}
            >
              Cathédrale
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Bouton Plein Écran Natif */}
          <button
            onClick={toggleNativeFullscreen}
            className="p-2.5 rounded-xl bg-[#0B0B0B]/80 hover:bg-[#39FF14]/20 border border-[#6A0DAD]/50 hover:border-[#39FF14] text-white hover:text-[#39FF14] transition-all active:scale-95 shadow-lg"
            title={isNativeFullscreen ? 'Quitter le plein écran' : 'Plein écran complet'}
            aria-label={isNativeFullscreen ? 'Quitter le plein écran' : 'Plein écran complet'}
          >
            {isNativeFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>

          {/* Bouton Quitter */}
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-[#0B0B0B]/80 hover:bg-[#EF4444]/30 border border-[#6A0DAD]/50 hover:border-[#EF4444] text-white transition-all active:scale-95 shadow-lg"
            aria-label="Quitter le mode concert"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Barre inférieure des contrôles de lecture */}
      <footer
        className={`relative z-10 w-full max-w-xl mx-auto p-4 sm:p-6 transition-opacity duration-300 ${
          isControlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="p-4 rounded-2xl bg-[#0B0B0B]/85 backdrop-blur-md border border-[#FF7518]/60 shadow-[0_0_35px_rgba(255,117,24,0.3)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={currentTrack.coverArt}
              alt={currentTrack.title}
              className="w-12 h-12 rounded-xl object-cover border border-[#6A0DAD]/50 shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).src = getAssetUrl('assets/gothic_vinyl_sarcophagus.webp');
              }}
            />
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-white font-mono truncate">
                {currentTrack.title}
              </h2>
              <p className="text-xs text-[#39FF14] truncate font-mono">
                {currentTrack.artist} • {currentTrack.bpm} BPM
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                playEctoClick();
                onPrev();
              }}
              className="p-2 rounded-lg text-white hover:text-[#FF7518] transition-colors"
              aria-label="Piste précédente"
            >
              <SkipBack className="w-5 h-5" />
            </button>

            <button
              onClick={() => {
                playEctoClick();
                onTogglePlay();
              }}
              className="p-3 rounded-full bg-gradient-to-r from-[#FF7518] to-[#6A0DAD] text-white shadow-[0_0_15px_rgba(255,117,24,0.5)] transition-transform active:scale-95"
              aria-label={isPlaying ? 'Pause' : 'Lecture'}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>

            <button
              onClick={() => {
                playEctoClick();
                onNext();
              }}
              className="p-2 rounded-lg text-white hover:text-[#FF7518] transition-colors"
              aria-label="Piste suivante"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
