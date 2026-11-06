import React from 'react';
import { Skull, Sparkles } from 'lucide-react';

interface CryptLoaderProps {
  message?: string;
  subtext?: string;
}

export const CryptLoader: React.FC<CryptLoaderProps> = ({
  message = 'Invocation des spectres...',
  subtext = 'Chargement de la scène gothique',
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[380px] p-8 text-center animate-fadeIn">
      {/* Halo spectral */}
      <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#6A0DAD] via-[#FF7518]/30 to-[#39FF14]/40 blur-xl animate-pulse" />
        <div className="relative w-20 h-20 rounded-2xl bg-[#120E17] border-2 border-[#6A0DAD]/60 flex items-center justify-center shadow-[0_0_25px_rgba(106,13,173,0.5)]">
          <Skull className="w-10 h-10 text-[#FF7518] animate-bounce" />
          <Sparkles className="w-4 h-4 text-[#39FF14] absolute -top-1 -right-1 animate-spin-slow" />
        </div>
      </div>

      {/* Titre et sous-titre */}
      <h3 className="font-syne text-lg font-bold text-[#E6E1DC] tracking-wide mb-1">
        {message}
      </h3>
      <p className="font-mono text-xs text-[#8C8494]">
        {subtext}
      </p>

      {/* Barre de chargement stylisée */}
      <div className="w-48 h-1 bg-[#1C1424] rounded-full mt-5 overflow-hidden border border-[#6A0DAD]/30">
        <div className="h-full bg-gradient-to-r from-[#FF7518] via-[#6A0DAD] to-[#39FF14] animate-pulse rounded-full w-full" />
      </div>
    </div>
  );
};
