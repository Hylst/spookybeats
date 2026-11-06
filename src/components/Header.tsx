import React from 'react';
import { Volume2, VolumeX, Sliders, Skull, Sparkles, Flame, Eye } from 'lucide-react';
import { playEctoClick } from '../audio/sfx';
import { CarvedPumpkinIcon, FloatingBat, GothicRosaceTracery, WroughtIronCrest } from './GothicDecorations';

interface HeaderProps {
  currentScreen: string;
  isPlaying: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenConfig: () => void;
  onOpenConcert: () => void;
  horrorLevel: 1 | 2 | 3;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  isPlaying,
  isMuted,
  onToggleMute,
  onOpenConfig,
  onOpenConcert,
  horrorLevel,
}) => {
  const screenTitles: Record<string, string> = {
    crypte: 'LA CRYPTE',
    lecteur: 'LE LECTEUR FANTÔME',
    caveau: 'LE CAVEAU SONORE',
    studio: 'STUDIO & BEAT PAD',
    massacre: 'LES JEUX DE LA CRYPTE',
    manoir: 'LE MANOIR HANTÉ 3D',
    bestiaire: 'LE BESTIAIRE DE L\'OMBRE',
    enigmes: 'LES ÉNIGMES DE LA CRYPTE',
    legendes: 'LE GRIMOIRE DES LÉGENDES',
    sanctuaire: 'LE SANCTUAIRE HYLST',
    info: "LE GUIDE DE L'ÉRUDIT & TECHNIQUE",
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#08030F]/95 backdrop-blur-xl border-b-2 border-[#54127F] shadow-[0_8px_30px_rgba(0,0,0,0.9)]">
      {/* Crête de ferronnerie discrète au sommet */}
      <WroughtIronCrest className="opacity-40 -mb-2 hidden sm:block" accentColor="#DFB7FF" />

      <div className="max-w-4xl mx-auto flex items-center justify-between px-3 sm:px-4 py-2.5">
        {/* Logo & Titre Gothique Monumental */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-b from-[#2A1138] to-[#0E0614] border border-[#FF7518]/70 flex items-center justify-center text-[#FF7518] shadow-[0_0_18px_rgba(255,117,24,0.35),inset_0_1px_2px_rgba(255,200,100,0.3)]">
            <CarvedPumpkinIcon size={22} className="animate-pulse" />
            {isPlaying && (
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#39FF14] shadow-[0_0_10px_#39FF14] animate-ping" />
            )}
            <span className="absolute -bottom-1 text-[7px] text-[#DFB7FF] font-mono">❖</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-['Cinzel_Decorative','Syne',serif] text-base sm:text-xl font-black tracking-wider text-[#F5F2EB] text-engraved">
                Spooky<span className="text-[#FF7518] text-engraved-gold">Beats</span>
              </span>
              <FloatingBat className="hidden md:inline-block w-4 h-3 opacity-70" />
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[9px] uppercase font-mono tracking-widest rounded-md bg-[#1C0D2E] text-[#DFB7FF] border border-[#6A0DAD]/70 shadow-inner">
                <span>✦</span> 19 Pistes Hylst
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#39FF14] animate-pulse" />
              <p className="text-[10px] uppercase font-mono tracking-widest text-[#39FF14] font-bold">
                {screenTitles[currentScreen] || 'LA CRYPTE'}
              </p>
            </div>
          </div>
        </div>

        {/* Contrôles droits en ferronnerie */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Badge Niveau de Peur */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#11071C] border border-[#6A0DAD]/60 text-xs font-mono text-[#A69EAF] shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-[#39FF14]" />
            <span className="text-[10px] uppercase tracking-wider text-[#DFB7FF]">Effroi :</span>
            <span className={horrorLevel === 3 ? 'text-[#FF7518] font-bold' : horrorLevel === 2 ? 'text-[#DFB7FF]' : 'text-[#39FF14]'}>
              {horrorLevel === 3 ? 'Cauchemar' : horrorLevel === 2 ? 'Modéré' : 'Frissons'}
            </span>
          </div>

          {/* Mode Concert Plein Écran */}
          <button
            onClick={() => {
              playEctoClick();
              onOpenConcert();
            }}
            aria-label="Mode Concert Plein Écran"
            title="Activer le visualiseur concert plein écran"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#281308] to-[#140803] border border-[#FF7518]/70 text-[#FF9030] hover:border-[#FFB060] transition-all shadow-[0_0_14px_rgba(255,117,24,0.3)] text-xs font-mono font-bold cursor-pointer hover:scale-105 active:scale-95"
          >
            <Flame className="w-3.5 h-3.5 fill-current animate-pulse text-[#FF7518]" />
            <span className="hidden md:inline font-mono text-[11px]">Concert</span>
          </button>

          {/* Configuration des MP3 */}
          <button
            onClick={() => {
              playEctoClick();
              onOpenConfig();
            }}
            aria-label="Configurer les URLs MP3"
            title="Personnaliser les URLs des pistes audio"
            className="p-2 rounded-lg bg-[#140822] border border-[#6A0DAD]/60 text-[#DFB7FF] hover:text-[#39FF14] hover:border-[#39FF14] transition-all cursor-pointer shadow-inner hover:scale-105 active:scale-95"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Toggle Mute */}
          <button
            onClick={() => {
              playEctoClick();
              onToggleMute();
            }}
            aria-label={isMuted ? 'Activer le son' : 'Couper le son'}
            title={isMuted ? 'Activer le son' : 'Couper le son'}
            className={`p-2 rounded border transition-all ${
              isMuted
                ? 'bg-[#1C1424] border-red-500/50 text-red-400'
                : 'bg-[#1C1424] border-[#39FF14]/50 text-[#39FF14] shadow-[0_0_10px_rgba(57,255,20,0.3)]'
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
