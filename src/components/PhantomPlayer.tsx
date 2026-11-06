import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Radio,
  Sparkles,
  Sliders,
  Volume2,
  Mic,
  VolumeX,
} from 'lucide-react';
import { AudioVisualizer } from './AudioVisualizer';
import { BloodMoonCoverArt } from './GothicArtworks';
import { playEctoClick, playDoorCreak } from '../audio/sfx';
import { audioEngine, TrackMetadata } from '../audio/audioEngine';
import { spectralNarrator, SpectralNarratorState } from '../audio/spectralNarrator';
import { VictorianIronworkCard, VictorianFiligreeDivider, VictorianCornerFlourish } from './GothicDecorations';

interface PhantomPlayerProps {
  currentTrack: TrackMetadata;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export const PhantomPlayer: React.FC<PhantomPlayerProps> = ({
  currentTrack,
  isPlaying,
  onTogglePlay,
  onNext,
  onPrev,
}) => {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(currentTrack.duration || 222);
  const [is8D, setIs8D] = useState<boolean>(false);
  const [isCathedrale, setIsCathedrale] = useState<boolean>(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [isRepeat, setIsRepeat] = useState<boolean>(true);
  const [activeLyricIndex, setActiveLyricIndex] = useState<number>(0);
  const [narratorState, setNarratorState] = useState<SpectralNarratorState>(spectralNarrator.getState());
  const [isCollectorView, setIsCollectorView] = useState<boolean>(false);

  useEffect(() => {
    const unsub = spectralNarrator.subscribe((state) => {
      setNarratorState(state);
    });
    return unsub;
  }, []);

  useEffect(() => {
    const unsub = audioEngine.onTimeUpdate((cur, dur) => {
      setCurrentTime(cur);
      if (dur && !isNaN(dur)) setDuration(dur);

      // Animation des paroles synchronisées
      if (currentTrack.lyrics && currentTrack.lyrics.length > 0) {
        const step = Math.floor((cur / (dur || 200)) * currentTrack.lyrics.length);
        setActiveLyricIndex(Math.min(step, currentTrack.lyrics.length - 1));
      }
    });

    return unsub;
  }, [currentTrack]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    audioEngine.seek(newTime);
  };

  const toggle8DMode = () => {
    playEctoClick();
    const active = audioEngine.toggle8D();
    setIs8D(active);
  };

  const toggleCathedraleMode = () => {
    playDoorCreak();
    const active = audioEngine.toggleCathedrale();
    setIsCathedrale(active);
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col gap-5 pb-24 animate-fadeIn">
      {/* En-tête de la piste */}
      <div className="text-center pt-1">
        <h2 className="font-syne text-2xl sm:text-3xl font-extrabold text-[#E6E1DC] tracking-wide">
          {currentTrack.title}
        </h2>
        <p className="text-xs font-mono text-[#8C8494] mt-1">
          <span className="text-[#DFB7FF]">{currentTrack.artist}</span> •{' '}
          <span className="uppercase tracking-widest text-[10px]">{currentTrack.album}</span>
        </p>
      </div>

      {/* Pochette d'album hantée avec rotation vinyle */}
      <div className="relative mx-auto w-64 h-64 sm:w-72 sm:h-72">
        {/* Halo spectral arrière */}
        <div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-tr from-[#6A0DAD] via-[#FF7518]/30 to-[#39FF14]/40 blur-xl transition-opacity duration-700 ${
            isPlaying ? 'opacity-70 animate-pulse' : 'opacity-20'
          }`}
        />

        {/* Cadre de pochette */}
        <div className="relative w-full h-full rounded-xl overflow-hidden crypt-card border-2 border-[#6A0DAD]/60 shadow-[0_15px_35px_rgba(0,0,0,0.9)] flex items-center justify-center p-3">
          {/* Disque vinyle rotatif intérieur */}
          <div
            className={`relative w-full h-full rounded-full overflow-hidden border-4 border-[#0B0B0B] shadow-2xl flex items-center justify-center ${
              isPlaying ? 'animate-spin-slow' : 'animate-spin-slow animate-spin-slow-paused'
            }`}
          >
            {/* Sillons du vinyle */}
            <div className="absolute inset-0 rounded-full border border-white/5" />
            <div className="absolute inset-4 rounded-full border border-white/5" />
            <div className="absolute inset-8 rounded-full border border-white/5" />

            {/* Illustration WebP de la piste ou Vinyle Collector Or Occulte */}
            <img
              src={isCollectorView ? '/src/assets/images/gothic_vinyl_sarcophagus_1793965924636.jpg' : currentTrack.coverArt}
              alt={currentTrack.title}
              onError={(e) => {
                // Si l'image externe échoue, afficher le vinyle collector généré
                (e.target as HTMLImageElement).src = '/src/assets/images/gothic_vinyl_sarcophagus_1793965924636.jpg';
              }}
              className="w-full h-full object-cover filter contrast-125 brightness-95 transition-all duration-700"
            />
            <div className="absolute inset-0 -z-10">
              <BloodMoonCoverArt className="w-full h-full" />
            </div>

            {/* Macaron central du vinyle */}
            <div className="absolute w-16 h-16 rounded-full bg-[#0B0B0B] border-2 border-[#FF7518] flex items-center justify-center shadow-lg">
              <div className="w-4 h-4 rounded-full bg-[#120E17] border border-[#39FF14]" />
            </div>
          </div>

          {/* Bouton Bascule Édition Collector / Piste Originale */}
          <button
            onClick={() => {
              playEctoClick();
              setIsCollectorView(!isCollectorView);
            }}
            className="absolute top-4 right-4 p-2 rounded-full bg-[#0B0B0B]/80 border border-[#39FF14]/50 text-[#39FF14] hover:shadow-[0_0_12px_#39FF14] transition-all cursor-pointer backdrop-blur-sm z-20"
            title={isCollectorView ? "Revenir à la pochette originale" : "Voir l'Édition Vinyle Or Gravé"}
            aria-label="Basculer pochette collector"
          >
            <Sparkles className="w-4 h-4 animate-spin-slow" />
          </button>

          {/* Badge Vinyle Collector */}
          {isCollectorView && (
            <div className="absolute bottom-4 left-4 right-4 text-center z-20 pointer-events-none">
              <span className="px-2.5 py-1 rounded-full bg-[#0B0B0B]/90 border border-[#FF7518]/60 text-[#FFB347] font-mono text-[9px] uppercase tracking-widest backdrop-blur-sm shadow-md">
                ✦ Sarcophage Vinyle Collector • Or & Obsidienne ✦
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Égaliseur graphique & VU-Mètres d'Halloween dans cadre victorien */}
      <VictorianIronworkCard highlightGlow="purple" className="p-3.5 sm:p-4">
        <AudioVisualizer isPlaying={isPlaying} initialMode="vumeter" height={100} />

        {/* Barre de progression & Curseur citrouille */}
        <div className="mt-3">
          <div className="relative flex items-center">
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.5}
              value={currentTime}
              onChange={handleSeek}
              aria-label="Progression de la musique"
              className="w-full h-1.5 bg-[#1C1424] rounded-lg appearance-none cursor-pointer accent-[#FF7518] focus:outline-none"
            />
          </div>
          <div className="flex justify-between items-center text-[11px] font-mono mt-1 text-[#8C8494]">
            <span className="text-[#39FF14]">{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </VictorianIronworkCard>

      {/* Contrôles de lecture */}
      <div className="flex items-center justify-between px-4 sm:px-8">
        {/* Shuffle */}
        <button
          onClick={() => {
            playEctoClick();
            setIsShuffle(!isShuffle);
          }}
          className={`p-2.5 rounded transition-all cursor-pointer ${
            isShuffle ? 'text-[#39FF14] shadow-[0_0_10px_rgba(57,255,20,0.3)]' : 'text-[#8C8494] hover:text-[#E6E1DC]'
          }`}
          aria-label="Mode aléatoire"
          title="Lecture aléatoire"
        >
          <Shuffle className="w-5 h-5" />
        </button>

        {/* Précédent */}
        <button
          onClick={() => {
            playEctoClick();
            onPrev();
          }}
          className="p-3 rounded-full bg-[#1C1424] border border-[#6A0DAD]/50 text-[#E6E1DC] hover:text-[#FF7518] hover:border-[#FF7518] transition-all hover:scale-105 cursor-pointer"
          aria-label="Piste précédente"
          title="Précédent"
        >
          <SkipBack className="w-5 h-5" />
        </button>

        {/* Play / Pause Principal Flamboyant */}
        <button
          onClick={() => {
            playEctoClick();
            onTogglePlay();
          }}
          className="w-16 h-16 rounded-2xl bg-[#FF7518] hover:bg-[#ff8b38] text-[#0B0B0B] flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-[0_0_30px_rgba(255,117,24,0.6)] cursor-pointer active:scale-95"
          aria-label={isPlaying ? 'Mettre en pause' : 'Lancer la lecture'}
          title={isPlaying ? 'Pause' : 'Lecture'}
        >
          {isPlaying ? (
            <Pause className="w-8 h-8 fill-current text-[#0B0B0B]" />
          ) : (
            <Play className="w-8 h-8 fill-current text-[#0B0B0B] translate-x-0.5" />
          )}
        </button>

        {/* Suivant */}
        <button
          onClick={() => {
            playEctoClick();
            onNext();
          }}
          className="p-3 rounded-full bg-[#1C1424] border border-[#6A0DAD]/50 text-[#E6E1DC] hover:text-[#FF7518] hover:border-[#FF7518] transition-all hover:scale-105 cursor-pointer"
          aria-label="Piste suivante"
          title="Suivant"
        >
          <SkipForward className="w-5 h-5" />
        </button>

        {/* Repeat */}
        <button
          onClick={() => {
            playEctoClick();
            setIsRepeat(!isRepeat);
          }}
          className={`p-2.5 rounded transition-all cursor-pointer ${
            isRepeat ? 'text-[#FF7518] shadow-[0_0_10px_rgba(255,117,24,0.3)]' : 'text-[#8C8494] hover:text-[#E6E1DC]'
          }`}
          aria-label="Répéter la piste"
          title="Répétition"
        >
          <Repeat className="w-5 h-5" />
        </button>
      </div>

      {/* Commutateurs 8D & Cathédrale */}
      <div className="grid grid-cols-2 gap-3">
        {/* Toggle 8D */}
        <button
          onClick={toggle8DMode}
          className={`crypt-card rounded-lg p-3 flex items-center justify-between transition-all cursor-pointer ${
            is8D ? 'border-[#39FF14] shadow-[0_0_15px_rgba(57,255,20,0.25)]' : 'border-[#6A0DAD]/40'
          }`}
        >
          <div className="flex items-center gap-2">
            <Radio className={`w-4 h-4 ${is8D ? 'text-[#39FF14] animate-pulse' : 'text-[#8C8494]'}`} />
            <div className="text-left">
              <span className="font-syne font-bold text-xs text-[#E6E1DC] block">8D Spatial</span>
              <span className="text-[9px] font-mono text-[#8C8494]">
                {is8D ? 'Actif (Orbite)' : 'Désactivé'}
              </span>
            </div>
          </div>
          <div
            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
              is8D ? 'bg-[#39FF14] border-[#39FF14]' : 'border-[#8C8494]'
            }`}
          >
            {is8D && <span className="w-1.5 h-1.5 rounded-full bg-black" />}
          </div>
        </button>

        {/* Toggle Cathédrale Reverb */}
        <button
          onClick={toggleCathedraleMode}
          className={`crypt-card rounded-lg p-3 flex items-center justify-between transition-all cursor-pointer ${
            isCathedrale ? 'border-[#DFB7FF] shadow-[0_0_15px_rgba(223,183,255,0.25)]' : 'border-[#6A0DAD]/40'
          }`}
        >
          <div className="flex items-center gap-2">
            <Sliders className={`w-4 h-4 ${isCathedrale ? 'text-[#DFB7FF]' : 'text-[#8C8494]'}`} />
            <div className="text-left">
              <span className="font-syne font-bold text-xs text-[#E6E1DC] block">Crypte Vero</span>
              <span className="text-[9px] font-mono text-[#8C8494]">
                {isCathedrale ? 'Cathédrale' : 'Studio'}
              </span>
            </div>
          </div>
          <div
            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
              isCathedrale ? 'bg-[#DFB7FF] border-[#DFB7FF]' : 'border-[#8C8494]'
            }`}
          >
            {isCathedrale && <span className="w-1.5 h-1.5 rounded-full bg-black" />}
          </div>
        </button>
      </div>

      {/* Chronique Littéraire & Ambiance de la Piste */}
      {currentTrack.loreText && (
        <VictorianIronworkCard highlightGlow="orange" accentColor="#FF7518" className="p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#6A0DAD]/30">
            <span className="text-[10px] font-mono tracking-widest text-[#FF7518] uppercase flex items-center gap-1.5 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#FF7518]" />
              Chronique d'Ambiance de la Pièce
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  playEctoClick();
                  spectralNarrator.toggle(currentTrack.loreText!, currentTrack.title);
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-[10px] font-bold border transition-all ${
                  narratorState.isSpeaking && narratorState.currentText === currentTrack.loreText
                    ? 'bg-[#39FF14] text-black border-[#39FF14] shadow-[0_0_12px_#39FF14] animate-pulse'
                    : 'bg-[#241738] text-[#DFB7FF] border-[#6A0DAD]/60 hover:border-[#39FF14] hover:text-white'
                }`}
                title="Écouter la chronique en voix off spectrale (local)"
              >
                <Mic className="w-3 h-3" />
                <span>
                  {narratorState.isSpeaking && narratorState.currentText === currentTrack.loreText
                    ? 'Voix Active...'
                    : 'Voix des Ombres'}
                </span>
              </button>
              <span className="text-[9px] font-mono text-[#39FF14] uppercase">
                Hylst Lore
              </span>
            </div>
          </div>
          <p className="font-serif italic text-xs sm:text-sm text-[#E2D8CE] leading-relaxed text-justify">
            « {currentTrack.loreText} »
          </p>
          <div className="mt-3 pt-2 border-t border-[#6A0DAD]/30 flex items-center justify-between text-[10px] text-[#A69EAF] font-mono">
            <span>Composition originale & mixage</span>
            <span className="text-[#39FF14] font-semibold">Geoffroy Streit alias Hylst</span>
          </div>
        </VictorianIronworkCard>
      )}

      {/* Incantations Maudites (Paroles spectrales synchronisées) */}
      <VictorianIronworkCard highlightGlow="purple" accentColor="#DFB7FF" className="p-4 sm:p-5">
        <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#6A0DAD]/30">
          <span className="text-[10px] font-mono tracking-widest text-[#FF7518] text-glow-pumpkin uppercase flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-[#FF7518]" />
            Incantations Maudites
          </span>
          <span className="text-[9px] font-mono text-[#39FF14] uppercase flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#39FF14] animate-ping" />
            Synchronisé
          </span>
        </div>

        <div className="flex flex-col gap-2 py-2 text-center">
          {currentTrack.lyrics && currentTrack.lyrics.map((line, idx) => {
            const isCurrent = idx === activeLyricIndex;
            return (
              <p
                key={idx}
                className={`transition-all duration-300 font-serif italic text-xs sm:text-sm ${
                  isCurrent
                    ? 'text-[#FF7518] font-bold text-glow-pumpkin scale-105 my-1'
                    : 'text-[#8C8494] opacity-50'
                }`}
              >
                {line}
              </p>
            );
          })}
        </div>
      </VictorianIronworkCard>
    </div>
  );
};
