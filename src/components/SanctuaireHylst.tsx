import React, { useState } from 'react';
import { getAssetUrl } from '../utils/assetPath';
import {
  Sparkles,
  Music,
  ExternalLink,
  Sliders,
  Volume2,
  Wand2,
  Disc,
  Play,
  Heart,
  Layers,
  Radio,
  Cpu
} from 'lucide-react';
import { TrackMetadata, audioEngine } from '../audio/audioEngine';
import {
  playDoorCreak,
  playEvilLaugh,
  playGhostHowl,
  playTombstoneThud,
  playTrapExplosion,
  playGoldenFrenzy,
  playEctoClick,
  playMp3Sfx,
  stopCurrentMp3Sfx,
  getAudioContext
} from '../audio/sfx';
import {
  VictorianIronworkCard,
  VictorianFiligreeDivider,
  WroughtIronCrest,
  GothicDropCap
} from './GothicDecorations';
import { HYLST_MP3_SFX, type HylstSfxItem } from '../audio/hylstSfxData';
export { HYLST_MP3_SFX, type HylstSfxItem };

interface SanctuaireHylstProps {
  tracks: TrackMetadata[];
  currentTrack: TrackMetadata;
  isPlaying: boolean;
  onSelectTrack: (track: TrackMetadata) => void;
}

// Notes de l'orgue gothique : C3, D3, E3, F3, G3, A3, B3, C4
const ORGAN_NOTES = [
  { note: 'DO', freq: 130.81, label: 'C3' },
  { note: 'RÉ', freq: 146.83, label: 'D3' },
  { note: 'MI', freq: 164.81, label: 'E3' },
  { note: 'FA', freq: 174.61, label: 'F3' },
  { note: 'SOL', freq: 196.0, label: 'G3' },
  { note: 'LA', freq: 220.0, label: 'A3' },
  { note: 'SI', freq: 246.94, label: 'B3' },
  { note: 'DO+', freq: 261.63, label: 'C4' },
];

export const SanctuaireHylst: React.FC<SanctuaireHylstProps> = ({
  tracks,
  currentTrack,
  isPlaying,
  onSelectTrack,
}) => {
  const [organStop, setOrganStop] = useState<'cathedrale' | 'bourdon' | 'spectral'>('cathedrale');
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const [sfxCategory, setSfxCategory] = useState<'all' | 'spectres' | 'curses' | 'beasts' | 'manor'>('all');
  const [activePlayingSfx, setActivePlayingSfx] = useState<string | null>(null);

  const filteredMp3SfxList = sfxCategory === 'all'
    ? HYLST_MP3_SFX
    : HYLST_MP3_SFX.filter((sfx) => sfx.category === sfxCategory);

  const handleTriggerMp3Sfx = (filename: string) => {
    if (activePlayingSfx === filename) {
      stopCurrentMp3Sfx();
      setActivePlayingSfx(null);
      return;
    }
    setActivePlayingSfx(filename);
    playMp3Sfx(filename, true, () => {
      setActivePlayingSfx(null);
    });
  };

  // Synthétiseur d'orgue Web Audio temps réel pour les notes
  const playOrganNote = (freq: number, noteName: string) => {
    setActiveNote(noteName);
    setTimeout(() => setActiveNote(null), 350);

    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, now);
      masterGain.gain.linearRampToValueAtTime(0.28, now + 0.04);
      masterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);
      masterGain.connect(ctx.destination);

      // Fondamentale
      const osc1 = ctx.createOscillator();
      osc1.type = organStop === 'bourdon' ? 'triangle' : organStop === 'spectral' ? 'sine' : 'sawtooth';
      osc1.frequency.setValueAtTime(freq, now);
      osc1.connect(masterGain);
      osc1.start(now);
      osc1.stop(now + 0.85);

      // Harmonique d'octave supérieure (effet tuyau d'église)
      const osc2 = ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq * 2, now);
      const gain2 = ctx.createGain();
      gain2.gain.value = 0.4;
      osc2.connect(gain2);
      gain2.connect(masterGain);
      osc2.start(now);
      osc2.stop(now + 0.85);

      // Quinte (subtile résonance gothique)
      if (organStop === 'cathedrale') {
        const osc3 = ctx.createOscillator();
        osc3.type = 'sine';
        osc3.frequency.setValueAtTime(freq * 1.498, now);
        const gain3 = ctx.createGain();
        gain3.gain.value = 0.2;
        osc3.connect(gain3);
        gain3.connect(masterGain);
        osc3.start(now);
        osc3.stop(now + 0.85);
      }
    } catch (e) {
      // Ignorer si audio bloqué
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Bannière d'hommage et signature de l'auteur en Ferronnerie Victorienne */}
      <div className="relative">
        <WroughtIronCrest className="mb-0.5 opacity-70" accentColor="#FF7518" />
        <VictorianIronworkCard highlightGlow="orange" accentColor="#FF7518" className="p-5 sm:p-6 space-y-4 overflow-hidden">
          {/* Illustration Grand Format de l'Orgue Monumental & Alchimie Sonore */}
          <div className="relative h-48 sm:h-60 w-full overflow-hidden rounded-xl border border-[#6A0DAD]/50 shadow-2xl group">
            <img
              src={getAssetUrl('assets/hylst_organ_sanctuary.webp')}
              alt="Sanctuaire de l'Orgue Gothique et Alchimie d'Hylst"
              className="w-full h-full object-cover object-center scale-100 group-hover:scale-105 transition-transform duration-1000 filter brightness-90 contrast-115"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0E0617] via-[#0E0617]/30 to-transparent pointer-events-none" />
            <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
              <span className="p-1.5 rounded-lg bg-[#07030C]/90 border border-[#FF7518] text-[#39FF14] backdrop-blur-sm shadow-md">
                <Wand2 className="w-4 h-4 animate-spin-slow" />
              </span>
              <span className="text-[10px] uppercase tracking-widest font-mono text-[#39FF14] font-bold bg-[#07030C]/90 px-2 py-1 rounded-lg border border-[#39FF14]/50 backdrop-blur-sm">
                Cathédrale Sonore d'Hylst
              </span>
            </div>
            <div className="absolute bottom-3 left-4 right-4 z-10 flex justify-between items-end">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white font-['Cinzel_Decorative','Syne',serif] tracking-wider text-engraved drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                  L'Atelier d'Hylst
                </h1>
                <p className="text-[10px] font-mono text-[#DFB7FF] tracking-wider">
                  Orgues séculaires, synthèse modulaire & DAW professionnelle
                </p>
              </div>
            </div>
          </div>

          {/* Déclaration officielle de création et de paternité artistique */}
          <div className="p-4 rounded-xl bg-[#0B0412]/95 border-2 border-[#FF7518]/70 shadow-[inset_0_0_20px_rgba(255,117,24,0.2)]">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FF7518]" />
                <span className="text-xs uppercase tracking-wider font-mono text-[#FF7518] font-bold">
                  Paternité & Confection Musicale
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#241738] border border-[#39FF14]/50 text-[10px] font-mono text-[#39FF14] font-bold">
                App réalisée par Hylst avec assistance IA (code)
              </span>
            </div>
            <p className="text-sm font-semibold text-white leading-relaxed">
              Créateur de l'app et des musiques, création assistée par IA (et non pas générées, car mélange de compositions, effets, assemblages, édition audio, DAW, enregistrements, ...) : <span className="text-[#39FF14] underline decoration-[#FF7518] font-bold">Geoffroy Streit alias Hylst</span>
            </p>
            <VictorianFiligreeDivider className="my-2 opacity-50" accentColor="#FF7518" />
            <blockquote className="text-xs sm:text-sm italic font-serif text-[#DFB7FF] border-l-2 border-[#FF7518] pl-2.5">
              « Je suis concepteur / développeur d'applications, mais également artiste éclectique, bancal et passionné. »
            </blockquote>
          </div>

          <p className="text-xs sm:text-sm text-[#C8C2D4] leading-relaxed">
            Chaque morceau de SpookyBeats est le fruit d'un véritable travail d'artisanat sonore. Geoffroy Streit mêle arrangements orchestraux ténébreux, programmation de synthétiseurs vintage, mixage audio sur DAW professionnelle et traitement assisté par modèles d'intelligence artificielle pour forger un univers Halloween sombre et envoûtant.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="https://hylst.fr"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF7518] to-[#8B1AD6] text-white font-['Cinzel_Decorative','Syne',serif] text-xs font-bold shadow-[0_0_18px_rgba(255,117,24,0.45)] transition-transform active:scale-95 border border-[#FFB060]/50 hover:brightness-110"
            >
              <ExternalLink className="w-4 h-4" />
              Visiter l'univers hylst.fr
            </a>
            <span className="text-xs font-mono text-[#DFB7FF]">
              19 Compositions Originales Intégrées
            </span>
          </div>
        </VictorianIronworkCard>
      </div>

      {/* Laboratoire Interactif : L'Orgue Gothique de la Crypte */}
      <VictorianIronworkCard highlightGlow="purple" className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-[#241738] text-[#39FF14]">
              <Music className="w-4 h-4" />
            </span>
            <h2 className="text-base font-bold text-white font-mono">
              L'Orgue de la Crypte
            </h2>
          </div>

          {/* Registres d'orgue */}
          <div className="flex items-center gap-1 bg-[#0B0B0B] p-1 rounded-lg border border-[#6A0DAD]/40 text-[10px] font-mono">
            {[
              { id: 'cathedrale', label: 'Cathédrale' },
              { id: 'bourdon', label: 'Bourdon' },
              { id: 'spectral', label: 'Spectral' },
            ].map((reg) => (
              <button
                key={reg.id}
                onClick={() => {
                  playEctoClick();
                  setOrganStop(reg.id as 'cathedrale' | 'bourdon' | 'spectral');
                }}
                className={`px-2 py-1 rounded transition-colors ${
                  organStop === reg.id
                    ? 'bg-[#6A0DAD] text-white font-bold'
                    : 'text-[#8C8494] hover:text-white'
                }`}
              >
                {reg.label}
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-[#A69EAF]">
          Jouez vos propres harmonies funèbres en direct. Chaque touche déclenche une synthèse polyphonique d'orgue à tuyaux.
        </p>

        {/* Clavier d'orgue 8 touches */}
        <div className="grid grid-cols-8 gap-1.5 sm:gap-2 pt-2">
          {ORGAN_NOTES.map((note) => {
            const isActive = activeNote === note.note;
            return (
              <button
                key={note.note}
                onClick={() => playOrganNote(note.freq, note.note)}
                className={`flex flex-col items-center justify-between py-6 sm:py-8 rounded-lg border transition-all duration-150 select-none ${
                  isActive
                    ? 'bg-[#39FF14] text-black border-[#39FF14] scale-95 shadow-[0_0_20px_#39FF14]'
                    : 'bg-gradient-to-b from-[#221633] to-[#120B1C] text-white border-[#6A0DAD]/60 hover:border-[#FF7518] hover:scale-102 shadow-md'
                }`}
              >
                <span className="text-[10px] font-mono text-[#8C8494]">
                  {note.label}
                </span>
                <span className="text-xs sm:text-sm font-bold font-mono mt-2">
                  {note.note}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF7518] mt-2 opacity-60" />
              </button>
            );
          })}
        </div>
      </VictorianIronworkCard>

      {/* Table d'Alchimie Sonore & Soundboard MP3 Hylst */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#160D24] via-[#10081C] to-[#0A0512] border-2 border-[#6A0DAD]/70 p-5 sm:p-6 shadow-[0_0_35px_rgba(106,13,173,0.3)] space-y-5">
        <div className="absolute top-0 right-0 w-56 h-56 bg-[#FF7518]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-[#39FF14]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#6A0DAD]/40">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-[#241738] border border-[#FF7518]/60 text-[#FF7518] shadow-[0_0_12px_rgba(255,117,24,0.3)]">
              <Radio className="w-5 h-5 animate-pulse" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white font-mono tracking-wide">
                  Table des Sortilèges & Bruitages MP3
                </h2>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#39FF14]/15 border border-[#39FF14]/50 text-[#39FF14] font-bold">
                  22 Sons Originaux Hylst
                </span>
              </div>
              <p className="text-xs text-[#A69EAF]">
                Bruitages et effets sonores originaux de Geoffroy Streit hébergés sur <span className="font-mono text-[#FF7518]">https://hylst.fr/mp3/sfx/</span>
              </p>
            </div>
          </div>

          {/* Bouton d'arrêt d'urgence du SFX actif */}
          {activePlayingSfx && (
            <button
              onClick={() => {
                stopCurrentMp3Sfx();
                setActivePlayingSfx(null);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EF4444]/20 border border-[#EF4444] text-[#FCA5A5] text-xs font-mono font-bold hover:bg-[#EF4444]/40 transition-all active:scale-95 animate-pulse"
            >
              <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-ping" />
              Interrompre le Sortilège
            </button>
          )}
        </div>

        {/* Sélecteur de mode : Bruitages MP3 Hylst ou Synthèses Procédurales */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-1.5 bg-[#0B0B0B] p-1 rounded-xl border border-[#6A0DAD]/50 text-xs font-mono">
            <button
              onClick={() => {
                playEctoClick();
                setSfxCategory('all');
              }}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                sfxCategory === 'all'
                  ? 'bg-gradient-to-r from-[#FF7518] to-[#6A0DAD] text-white font-bold shadow-md'
                  : 'text-[#8C8494] hover:text-white'
              }`}
            >
              Tous (22)
            </button>
            <button
              onClick={() => {
                playEctoClick();
                setSfxCategory('spectres');
              }}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                sfxCategory === 'spectres'
                  ? 'bg-[#6A0DAD] text-white font-bold'
                  : 'text-[#8C8494] hover:text-white'
              }`}
            >
              Spectres
            </button>
            <button
              onClick={() => {
                playEctoClick();
                setSfxCategory('curses');
              }}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                sfxCategory === 'curses'
                  ? 'bg-[#6A0DAD] text-white font-bold'
                  : 'text-[#8C8494] hover:text-white'
              }`}
            >
              Rires & Malédictions
            </button>
            <button
              onClick={() => {
                playEctoClick();
                setSfxCategory('beasts');
              }}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                sfxCategory === 'beasts'
                  ? 'bg-[#6A0DAD] text-white font-bold'
                  : 'text-[#8C8494] hover:text-white'
              }`}
            >
              Créatures
            </button>
            <button
              onClick={() => {
                playEctoClick();
                setSfxCategory('manor');
              }}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                sfxCategory === 'manor'
                  ? 'bg-[#6A0DAD] text-white font-bold'
                  : 'text-[#8C8494] hover:text-white'
              }`}
            >
              Manoir & Angoisse
            </button>
          </div>

          <span className="text-[11px] font-mono text-[#39FF14] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse" />
            Atténuation intelligente en cours de lecture musicale
          </span>
        </div>

        {/* Grille des effets sonores MP3 d'Hylst */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredMp3SfxList.map((sfx) => {
            const isPlayingThis = activePlayingSfx === sfx.filename;
            return (
              <button
                key={sfx.filename}
                onClick={() => handleTriggerMp3Sfx(sfx.filename)}
                className={`relative overflow-hidden flex flex-col p-3.5 rounded-xl border transition-all duration-200 text-left group select-none ${
                  isPlayingThis
                    ? 'bg-gradient-to-r from-[#2B1242] to-[#1F0D33] border-[#39FF14] shadow-[0_0_20px_rgba(57,255,20,0.35)] scale-[1.02]'
                    : 'bg-[#0E0717]/85 border-[#6A0DAD]/40 hover:border-[#FF7518] hover:bg-[#180E26] hover:scale-[1.01]'
                }`}
              >
                {/* Lueur d'effet en lecture */}
                {isPlayingThis && (
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#39FF14]/20 rounded-full blur-xl pointer-events-none" />
                )}

                <div className="flex items-center justify-between w-full relative z-10">
                  <div className="flex items-center gap-2">
                    <span
                      className={`p-1.5 rounded-lg border transition-colors ${
                        isPlayingThis
                          ? 'bg-[#39FF14] text-black border-[#39FF14]'
                          : 'bg-[#1C102B] text-[#FF7518] border-[#6A0DAD]/50 group-hover:text-white group-hover:border-[#FF7518]'
                      }`}
                    >
                      {isPlayingThis ? (
                        <Radio className="w-4 h-4 animate-spin" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0A0512] border border-[#6A0DAD]/40 text-[#DFB7FF]">
                      {sfx.categoryLabel}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-[#8C8494] group-hover:text-[#39FF14]">
                    {sfx.duration}
                  </span>
                </div>

                <div className="mt-2.5 relative z-10">
                  <h3 className="text-xs sm:text-sm font-bold text-white font-mono group-hover:text-[#FF7518] transition-colors flex items-center justify-between">
                    <span>{sfx.label}</span>
                    {isPlayingThis && (
                      <span className="text-[10px] text-[#39FF14] font-normal animate-pulse">
                        En lecture...
                      </span>
                    )}
                  </h3>
                  <p className="text-[11px] text-[#A69EAF] mt-0.5 line-clamp-1">
                    {sfx.description}
                  </p>
                </div>

                {/* Nom du fichier source réel sur hylst.fr */}
                <div className="mt-2 pt-2 border-t border-[#6A0DAD]/25 flex items-center justify-between text-[10px] font-mono text-[#71697E] relative z-10">
                  <span className="truncate max-w-[180px]">{sfx.filename}</span>
                  <span className="text-[#FF7518] opacity-0 group-hover:opacity-100 transition-opacity">
                    Écouter ▶
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Section Bruitages Synthétisés Procéduraux */}
        <div className="pt-4 border-t border-[#6A0DAD]/40">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#39FF14]" />
              Bruitages Procéduraux Temps Réel (Web Audio)
            </h3>
            <span className="text-[10px] font-mono text-[#8C8494]">
              Générés en code pur sans fichier
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {[
              { label: 'Porte Crypte', fn: playDoorCreak, color: '#FF7518' },
              { label: 'Rire Démoniaque', fn: playEvilLaugh, color: '#39FF14' },
              { label: 'Hurlement Spectre', fn: playGhostHowl, color: '#C084FC' },
              { label: 'Dalle Funéraire', fn: playTombstoneThud, color: '#FF7518' },
              { label: 'Piège Infernal', fn: playTrapExplosion, color: '#EF4444' },
              { label: 'Frenzy Ectoplasme', fn: playGoldenFrenzy, color: '#FACC15' },
            ].map((sfx, idx) => (
              <button
                key={idx}
                onClick={() => {
                  stopCurrentMp3Sfx();
                  setActivePlayingSfx(null);
                  sfx.fn(true);
                }}
                className="p-2.5 rounded-lg bg-[#0B0B0B] border border-[#6A0DAD]/30 hover:border-[#39FF14] text-left transition-transform active:scale-95 group"
              >
                <div className="text-[10px] font-mono text-[#8C8494]">Synth 0{idx + 1}</div>
                <div className="text-xs font-bold text-white mt-1 group-hover:text-[#39FF14] truncate">
                  {sfx.label}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Les Coulisses Techniques & Créatives */}
      <section className="rounded-2xl bg-[#140D20] border border-[#6A0DAD]/50 p-5 space-y-3">
        <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#39FF14]" />
          L'Alchimie Créative : Humain & IA
        </h2>

        <div className="space-y-2.5 text-xs text-[#C8C2D4] leading-relaxed">
          <div className="p-3 rounded-xl bg-[#0B0B0B]/60 border border-[#6A0DAD]/30 flex items-start gap-3">
            <Cpu className="w-4 h-4 text-[#FF7518] shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-mono text-[11px] mb-0.5">
                Création Assistée vs Génération Automatique
              </strong>
              L'IA n'a pas conçu ces musiques seule. Elle est intervenue comme un instrument de laboratoire pour inspirer des motifs, générer des textures brutes ou élargir les pistes de violoncelles et de cuivres abyssaux.
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#0B0B0B]/60 border border-[#6A0DAD]/30 flex items-start gap-3">
            <Sliders className="w-4 h-4 text-[#39FF14] shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-mono text-[11px] mb-0.5">
                Édition, Mixage DAW & Mastering
              </strong>
              Chaque piste a été découpée, éditée, égalisée et masterisée sur station de travail audio par Geoffroy Streit afin de préserver une signature cohérente, un punch rythmique sombre et une tension cinématographique.
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#0B0B0B]/60 border border-[#6A0DAD]/30 flex items-start gap-3">
            <Heart className="w-4 h-4 text-[#FF7518] shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-mono text-[11px] mb-0.5">
                Une Passion Dédiée à l'Imaginaire
              </strong>
              Retrouvez l'ensemble des créations, univers fantastiques et musiques sur le site officiel de l'artiste.
            </div>
          </div>
        </div>
      </section>

      {/* Catalogue rapide des 19 Titres de l'Artiste */}
      <section className="rounded-2xl bg-[#140D20] border border-[#6A0DAD]/50 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Disc className="w-4 h-4 text-[#FF7518]" />
            <h2 className="text-base font-bold text-white font-mono">
              Catalogue Complet des 19 Titres
            </h2>
          </div>
          <span className="text-xs font-mono text-[#39FF14] bg-[#39FF14]/10 px-2 py-0.5 rounded border border-[#39FF14]/30">
            Hylst Collection
          </span>
        </div>

        <div className="space-y-2">
          {tracks.map((track, index) => {
            const isCurrent = currentTrack.slug === track.slug;
            return (
              <div
                key={track.id}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                  isCurrent
                    ? 'bg-[#24153B] border-[#39FF14] shadow-[0_0_15px_rgba(57,255,20,0.2)]'
                    : 'bg-[#0B0B0B]/70 border-[#6A0DAD]/30 hover:border-[#FF7518]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="text-xs font-mono text-[#8C8494] w-5 text-right">
                    {index + 1 < 10 ? `0${index + 1}` : index + 1}
                  </span>

                  <img
                    src={track.coverArt}
                    alt={track.title}
                    className="w-10 h-10 rounded-lg object-cover border border-[#6A0DAD]/40 shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        getAssetUrl('assets/gothic_vinyl_sarcophagus.webp');
                    }}
                  />

                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs font-bold text-white truncate font-mono">
                      {track.title}
                    </h3>
                    <p className="text-[11px] text-[#A69EAF] truncate">
                      {track.genre} • {track.bpm} BPM • {track.key}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    playDoorCreak();
                    onSelectTrack(track);
                  }}
                  className={`p-2 rounded-lg transition-transform active:scale-95 shrink-0 ml-2 ${
                    isCurrent && isPlaying
                      ? 'bg-[#39FF14] text-black shadow-[0_0_10px_#39FF14]'
                      : 'bg-[#6A0DAD] text-white hover:bg-[#FF7518]'
                  }`}
                  aria-label={`Écouter ${track.title}`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Badge de Réalisation & Paternité */}
      <footer className="text-center text-[11px] text-[#A69EAF] font-mono py-3 border-t border-[#6A0DAD]/30 space-y-1">
        <div className="font-bold text-[#39FF14]">
          App réalisée par Hylst avec assistance IA (code)
        </div>
        <div className="text-[10px] text-[#8C8494]">
          Geoffroy Streit alias Hylst • Compositions, mixage DAW et design sonore • hylst.fr
        </div>
      </footer>
    </div>
  );
};
