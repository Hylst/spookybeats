import React, { useEffect, useRef, useState } from 'react';
import { audioEngine } from '../audio/audioEngine';
import { Flame, Activity, Skull, Gauge } from 'lucide-react';
import { playEctoClick } from '../audio/sfx';

export type VisualizerMode = 'vumeter' | 'flames' | 'oscilloscope' | 'bones';

interface AudioVisualizerProps {
  isPlaying: boolean;
  initialMode?: VisualizerMode;
  height?: number;
  className?: string;
  showModeSelector?: boolean;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  isPlaying,
  initialMode = 'vumeter',
  height = 110,
  className = '',
  showModeSelector = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mode, setMode] = useState<VisualizerMode>(initialMode);

  // Valeurs d'inertie pour les aiguilles du VU-mètre
  const vuLeftRef = useRef<number>(0);
  const vuRightRef = useRef<number>(0);
  const peakLeftRef = useRef<number>(0);
  const peakRightRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const analyser = audioEngine.getAnalyser();
    const bufferLength = analyser ? analyser.frequencyBinCount : 64;
    const freqData = new Uint8Array(bufferLength);
    const timeData = new Uint8Array(bufferLength);

    let idlePhase = 0;

    const render = () => {
      animId = requestAnimationFrame(render);
      const width = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, width, h);

      let hasRealAudio = false;
      if (isPlaying && analyser) {
        analyser.getByteFrequencyData(freqData);
        analyser.getByteTimeDomainData(timeData);
        for (let i = 0; i < bufferLength; i++) {
          if (freqData[i] > 0) {
            hasRealAudio = true;
            break;
          }
        }
      }

      if (!hasRealAudio && isPlaying) {
        // Animation vivante réactive au tempo en lecture quand l'analyseur est muet (cross-origin direct)
        const curTrack = audioEngine.getCurrentTrack();
        const bpm = curTrack?.bpm || 120;
        const curTime = audioEngine.getCurrentTime();
        const beatProgress = (curTime * (bpm / 60)) % 1;
        const beatPulse = Math.sin(beatProgress * Math.PI);
        idlePhase += 0.05;

        for (let i = 0; i < bufferLength; i++) {
          const normIdx = i / bufferLength;
          const bassBoost = Math.max(0, 1 - normIdx * 1.5) * (beatPulse * 90 + 50);
          const midWave = Math.sin(idlePhase * 1.8 + i * 0.35) * 35;
          const highFlicker = Math.sin(idlePhase * 3.5 + i * 0.8) * 20;
          const amp = Math.min(255, Math.max(18, bassBoost + midWave + highFlicker + 60));
          freqData[i] = amp;
          timeData[i] = 128 + Math.sin(idlePhase * 2 + i * 0.4) * (20 + beatPulse * 30);
        }
      } else if (!hasRealAudio && !isPlaying) {
        // Animation vivante en pause
        idlePhase += 0.04;
        for (let i = 0; i < bufferLength; i++) {
          freqData[i] = Math.max(12, Math.sin(idlePhase + i * 0.2) * 20 + 25);
          timeData[i] = 128 + Math.sin(idlePhase + i * 0.3) * 15;
        }
      }

      // ==========================================
      // MODE 1 : VU-MÈTRE SÉPULCRAL HALLOWEEN
      // ==========================================
      if (mode === 'vumeter') {
        renderHalloweenVuMeter(ctx, width, h, freqData, isPlaying);
      }
      // ==========================================
      // MODE 2 : FLAMMES INFERNALES
      // ==========================================
      else if (mode === 'flames') {
        renderFlames(ctx, width, h, freqData, isPlaying);
      }
      // ==========================================
      // MODE 3 : ONDE ECTOPLASMIQUE (OSCILLOSCOPE)
      // ==========================================
      else if (mode === 'oscilloscope') {
        renderEctoplasmWave(ctx, width, h, timeData, isPlaying);
      }
      // ==========================================
      // MODE 4 : COLONNES D'OS & SÉPULTURES
      // ==========================================
      else if (mode === 'bones') {
        renderBonePillars(ctx, width, h, freqData, isPlaying);
      }
    };

    // --- Rendu VU-Mètre Sépulcral ---
    const renderHalloweenVuMeter = (
      c: CanvasRenderingContext2D,
      w: number,
      h: number,
      data: Uint8Array,
      active: boolean
    ) => {
      // Calcul RMS des basses et des aigus
      let sumLow = 0;
      let sumHigh = 0;
      const half = Math.floor(data.length / 2);
      for (let i = 0; i < half; i++) sumLow += data[i];
      for (let i = half; i < data.length; i++) sumHigh += data[i];

      const targetLeft = active ? Math.min(1.15, (sumLow / half / 255) * 1.55) : 0.05;
      const targetRight = active ? Math.min(1.15, (sumHigh / half / 255) * 1.7) : 0.05;

      // Inertie réaliste avec amortissement
      vuLeftRef.current += (targetLeft - vuLeftRef.current) * 0.22;
      vuRightRef.current += (targetRight - vuRightRef.current) * 0.22;

      // Peak holds
      if (vuLeftRef.current > peakLeftRef.current) peakLeftRef.current = vuLeftRef.current;
      else peakLeftRef.current = Math.max(0, peakLeftRef.current - 0.008);

      if (vuRightRef.current > peakRightRef.current) peakRightRef.current = vuRightRef.current;
      else peakRightRef.current = Math.max(0, peakRightRef.current - 0.008);

      const meterWidth = (w - 18) / 2;
      const meterHeight = h;

      drawSingleVuDial(c, 0, 0, meterWidth, meterHeight, vuLeftRef.current, peakLeftRef.current, 'L • CRYPTE', '🎃');
      drawSingleVuDial(c, meterWidth + 18, 0, meterWidth, meterHeight, vuRightRef.current, peakRightRef.current, 'R • SÉPULCRE', '💀');
    };

    const drawSingleVuDial = (
      c: CanvasRenderingContext2D,
      x: number,
      y: number,
      mw: number,
      mh: number,
      value: number,
      peak: number,
      label: string,
      sigil: string
    ) => {
      c.save();
      c.translate(x, y);

      // Fond du cadran : parchemin sombre gothique avec cadre cuivre/obsidienne
      const bgGrad = c.createLinearGradient(0, 0, 0, mh);
      bgGrad.addColorStop(0, '#1A1224');
      bgGrad.addColorStop(0.5, '#120A1A');
      bgGrad.addColorStop(1, '#0B0512');

      c.fillStyle = bgGrad;
      c.strokeStyle = '#6A0DAD';
      c.lineWidth = 1.5;
      c.beginPath();
      c.roundRect(0, 0, mw, mh, 8);
      c.fill();
      c.stroke();

      // Reflet verre fumé supérieur
      const glassGrad = c.createLinearGradient(0, 0, 0, mh * 0.4);
      glassGrad.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
      glassGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      c.fillStyle = glassGrad;
      c.beginPath();
      c.roundRect(2, 2, mw - 4, mh * 0.4, 6);
      c.fill();

      // Centre du pivot de l'aiguille (bas au milieu)
      const pivotX = mw / 2;
      const pivotY = mh * 1.05;
      const radius = mh * 0.88;

      // Arc de graduation : Vert phosphorescent (-20 à 0 dB)
      c.beginPath();
      c.arc(pivotX, pivotY, radius, -Math.PI * 0.78, -Math.PI * 0.45, false);
      c.strokeStyle = '#39FF14';
      c.lineWidth = 3;
      c.shadowColor = 'rgba(57, 255, 20, 0.5)';
      c.shadowBlur = 6;
      c.stroke();

      // Arc orange citrouille (0 à +2 dB)
      c.beginPath();
      c.arc(pivotX, pivotY, radius, -Math.PI * 0.45, -Math.PI * 0.30, false);
      c.strokeStyle = '#FF7518';
      c.lineWidth = 3.5;
      c.shadowColor = 'rgba(255, 117, 24, 0.6)';
      c.shadowBlur = 7;
      c.stroke();

      // Arc rouge sang (+2 à +3 dB PEAK)
      c.beginPath();
      c.arc(pivotX, pivotY, radius, -Math.PI * 0.30, -Math.PI * 0.22, false);
      c.strokeStyle = '#FF3B30';
      c.lineWidth = 4;
      c.shadowColor = '#FF3B30';
      c.shadowBlur = 8;
      c.stroke();
      c.shadowBlur = 0;

      // Graduations de repère (-20, -10, -7, -3, 0, +3 dB)
      const ticks = [-20, -10, -5, 0, 3];
      ticks.forEach((tick, idx) => {
        const norm = (idx / (ticks.length - 1));
        const angle = -Math.PI * 0.78 + norm * (Math.PI * 0.56);
        const tx1 = pivotX + Math.cos(angle) * (radius - 2);
        const ty1 = pivotY + Math.sin(angle) * (radius - 2);
        const tx2 = pivotX + Math.cos(angle) * (radius - 8);
        const ty2 = pivotY + Math.sin(angle) * (radius - 8);

        c.beginPath();
        c.moveTo(tx1, ty1);
        c.lineTo(tx2, ty2);
        c.strokeStyle = tick > 0 ? '#FF3B30' : tick === 0 ? '#FF7518' : '#8C8494';
        c.lineWidth = tick === 0 || tick === 3 ? 2 : 1;
        c.stroke();
      });

      // Sigil d'Halloween central gravé
      c.font = '16px serif';
      c.textAlign = 'center';
      c.fillStyle = 'rgba(255, 255, 255, 0.35)';
      c.fillText(sigil, pivotX, mh * 0.48);

      // Label & VU texte
      c.font = '9px monospace';
      c.fillStyle = '#DFB7FF';
      c.fillText(label, pivotX, mh * 0.7);

      // Voyant PEAK / EFFROI en coin supérieur
      const isPeaking = peak > 0.85;
      c.beginPath();
      c.arc(mw - 14, 14, 4, 0, Math.PI * 2);
      c.fillStyle = isPeaking ? '#FF3B30' : '#330808';
      c.shadowColor = isPeaking ? '#FF3B30' : 'transparent';
      c.shadowBlur = isPeaking ? 10 : 0;
      c.fill();
      c.shadowBlur = 0;

      c.font = '7px monospace';
      c.fillStyle = isPeaking ? '#FF7518' : '#666';
      c.fillText('PEAK', mw - 14, 26);

      // Aiguille analogique luminescente
      const needleAngle = -Math.PI * 0.78 + Math.min(1.1, value) * (Math.PI * 0.56);
      const needleLength = radius + 2;
      const nx = pivotX + Math.cos(needleAngle) * needleLength;
      const ny = pivotY + Math.sin(needleAngle) * needleLength;

      c.beginPath();
      c.moveTo(pivotX, pivotY);
      c.lineTo(nx, ny);
      c.strokeStyle = '#FF7518';
      c.lineWidth = 2;
      c.shadowColor = '#FF7518';
      c.shadowBlur = 8;
      c.stroke();
      c.shadowBlur = 0;

      // Bouton/pivot central en laiton ouvragé
      c.beginPath();
      c.arc(pivotX, pivotY, 10, 0, Math.PI * 2);
      c.fillStyle = '#FF7518';
      c.fill();
      c.beginPath();
      c.arc(pivotX, pivotY, 5, 0, Math.PI * 2);
      c.fillStyle = '#12081C';
      c.fill();

      c.restore();
    };

    // --- Mode Flammes ---
    const renderFlames = (c: CanvasRenderingContext2D, w: number, h: number, data: Uint8Array, active: boolean) => {
      const bars = 28;
      const barSpacing = 4;
      const barW = (w - (bars - 1) * barSpacing) / bars;

      for (let i = 0; i < bars; i++) {
        const val = data[Math.floor((i / bars) * (data.length * 0.7))] || 0;
        const norm = val / 255;
        const barH = Math.max(6, norm * (h - 8));
        const x = i * (barW + barSpacing);
        const y = h - barH;

        const grad = c.createLinearGradient(0, y, 0, h);
        grad.addColorStop(0, '#39FF14');
        grad.addColorStop(0.4, '#FF7518');
        grad.addColorStop(1, '#6A0DAD');

        c.fillStyle = grad;
        c.shadowColor = active ? (i % 2 === 0 ? '#39FF14' : '#FF7518') : 'rgba(106, 13, 173, 0.4)';
        c.shadowBlur = active ? 10 : 3;

        c.beginPath();
        c.roundRect(x, y, barW, barH, [4, 4, 0, 0]);
        c.fill();
        c.shadowBlur = 0;

        // Étincelle spectrale
        if (active && norm > 0.4) {
          c.fillStyle = '#FFFFFF';
          c.beginPath();
          c.arc(x + barW / 2, y - 2, 1.5, 0, Math.PI * 2);
          c.fill();
        }
      }
    };

    // --- Mode Onde d'Ectoplasme ---
    const renderEctoplasmWave = (c: CanvasRenderingContext2D, w: number, h: number, data: Uint8Array, active: boolean) => {
      c.beginPath();
      const sliceW = w / data.length;
      let x = 0;

      for (let i = 0; i < data.length; i++) {
        const v = data[i] / 128.0;
        const y = (v * h) / 2;

        if (i === 0) c.moveTo(x, y);
        else c.lineTo(x, y);

        x += sliceW;
      }

      c.lineTo(w, h / 2);
      c.strokeStyle = '#39FF14';
      c.lineWidth = 3;
      c.shadowColor = '#39FF14';
      c.shadowBlur = 12;
      c.stroke();
      c.shadowBlur = 0;

      // Onde miroir violette
      c.beginPath();
      x = 0;
      for (let i = 0; i < data.length; i++) {
        const v = data[i] / 128.0;
        const y = h - (v * h) / 2;
        if (i === 0) c.moveTo(x, y);
        else c.lineTo(x, y);
        x += sliceW;
      }
      c.strokeStyle = 'rgba(223, 183, 255, 0.4)';
      c.lineWidth = 1.5;
      c.stroke();
    };

    // --- Mode Colonnes d'Os ---
    const renderBonePillars = (c: CanvasRenderingContext2D, w: number, h: number, data: Uint8Array, active: boolean) => {
      const cols = 22;
      const colSpacing = 6;
      const colW = (w - (cols - 1) * colSpacing) / cols;
      const segmentH = 7;
      const segmentGap = 3;
      const maxSegments = Math.floor(h / (segmentH + segmentGap));

      for (let i = 0; i < cols; i++) {
        const val = data[Math.floor((i / cols) * (data.length * 0.75))] || 0;
        const activeSegments = Math.round((val / 255) * maxSegments);
        const x = i * (colW + colSpacing);

        for (let s = 0; s < maxSegments; s++) {
          const y = h - (s + 1) * (segmentH + segmentGap);
          const isLit = s < activeSegments;

          c.beginPath();
          c.roundRect(x, y, colW, segmentH, 2);

          if (isLit) {
            if (s > maxSegments * 0.75) {
              c.fillStyle = '#FF3B30';
              c.shadowColor = '#FF3B30';
              c.shadowBlur = 6;
            } else if (s > maxSegments * 0.4) {
              c.fillStyle = '#FF7518';
              c.shadowColor = '#FF7518';
              c.shadowBlur = 5;
            } else {
              c.fillStyle = '#39FF14';
              c.shadowColor = '#39FF14';
              c.shadowBlur = 4;
            }
          } else {
            c.fillStyle = 'rgba(28, 20, 36, 0.6)';
            c.shadowBlur = 0;
          }

          c.fill();
          c.shadowBlur = 0;
        }
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isPlaying, mode]);

  return (
    <div className={`relative w-full flex flex-col gap-2 ${className}`}>
      {/* Sélecteur de mode de visualisation */}
      {showModeSelector && (
        <div className="flex items-center justify-between px-1">
          <span className="text-[9px] font-mono tracking-widest text-[#DFB7FF] uppercase flex items-center gap-1">
            <Activity className="w-3 h-3 text-[#39FF14]" />
            Visualiseur Spectral
          </span>

          <div className="flex items-center gap-1 bg-[#120E17] border border-[#6A0DAD]/40 rounded-lg p-0.5">
            <button
              onClick={() => {
                playEctoClick();
                setMode('vumeter');
              }}
              title="VU-Mètre Sépulcral Halloween"
              aria-label="Mode VU-mètre"
              className={`px-2 py-1 rounded text-[10px] font-mono flex items-center gap-1 transition-all ${
                mode === 'vumeter'
                  ? 'bg-[#FF7518] text-black font-bold shadow-[0_0_8px_rgba(255,117,24,0.5)]'
                  : 'text-[#8C8494] hover:text-[#E6E1DC]'
              }`}
            >
              <Gauge className="w-3 h-3" />
              <span>VU-Mètre</span>
            </button>

            <button
              onClick={() => {
                playEctoClick();
                setMode('flames');
              }}
              title="Flammes Infernales"
              aria-label="Mode flammes"
              className={`px-2 py-1 rounded text-[10px] font-mono flex items-center gap-1 transition-all ${
                mode === 'flames'
                  ? 'bg-[#39FF14] text-black font-bold shadow-[0_0_8px_rgba(57,255,20,0.5)]'
                  : 'text-[#8C8494] hover:text-[#E6E1DC]'
              }`}
            >
              <Flame className="w-3 h-3" />
              <span>Flammes</span>
            </button>

            <button
              onClick={() => {
                playEctoClick();
                setMode('oscilloscope');
              }}
              title="Onde d'Ectoplasme"
              aria-label="Mode onde"
              className={`px-2 py-1 rounded text-[10px] font-mono flex items-center gap-1 transition-all ${
                mode === 'oscilloscope'
                  ? 'bg-[#6A0DAD] text-white font-bold shadow-[0_0_8px_rgba(106,13,173,0.5)]'
                  : 'text-[#8C8494] hover:text-[#E6E1DC]'
              }`}
            >
              <Activity className="w-3 h-3" />
              <span>Onde</span>
            </button>

            <button
              onClick={() => {
                playEctoClick();
                setMode('bones');
              }}
              title="Colonnes d'Ossements"
              aria-label="Mode ossements"
              className={`px-2 py-1 rounded text-[10px] font-mono flex items-center gap-1 transition-all ${
                mode === 'bones'
                  ? 'bg-[#DFB7FF] text-black font-bold shadow-[0_0_8px_rgba(223,183,255,0.5)]'
                  : 'text-[#8C8494] hover:text-[#E6E1DC]'
              }`}
            >
              <Skull className="w-3 h-3" />
              <span>Os</span>
            </button>
          </div>
        </div>
      )}

      {/* Surface Canvas du Visualiseur */}
      <div className="relative w-full overflow-hidden rounded-lg">
        <canvas
          ref={canvasRef}
          width={420}
          height={height}
          className="w-full h-full block"
        />
      </div>
    </div>
  );
};
