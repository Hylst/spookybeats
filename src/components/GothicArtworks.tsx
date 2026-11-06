import React from 'react';

/**
 * Illustration vectorielle de Manoir Gothique & Cimetière brumeux pour le Hero de La Crypte
 */
export const CryptHeroArt: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative w-full h-full bg-[#0E0A14] overflow-hidden ${className}`}>
      {/* Ciel nocturne dégradé */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1E0B2B] via-[#12081C] to-[#0B0B0B]" />

      {/* Lune pleine brumeuse avec halo violet */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-28 rounded-full bg-gradient-to-tr from-[#FF7518]/30 via-[#DFB7FF]/40 to-[#E6E1DC] shadow-[0_0_60px_rgba(223,183,255,0.4)] opacity-80" />

      {/* Silhouette de cathédrale / manoir hanté en SVG */}
      <svg
        viewBox="0 0 800 400"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="castleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#251636" />
            <stop offset="60%" stopColor="#140B1E" />
            <stop offset="100%" stopColor="#0B0B0B" />
          </linearGradient>
          <linearGradient id="fogGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(106, 13, 173, 0)" />
            <stop offset="70%" stopColor="rgba(106, 13, 173, 0.45)" />
            <stop offset="100%" stopColor="rgba(11, 11, 11, 0.95)" />
          </linearGradient>
        </defs>

        {/* Flèches lointaines de la cathédrale */}
        <polygon points="120,380 145,180 155,180 180,380" fill="#1C1029" opacity="0.7" />
        <polygon points="190,380 210,130 220,130 240,380" fill="#1C1029" opacity="0.7" />
        <polygon points="560,380 580,140 590,140 610,380" fill="#1C1029" opacity="0.7" />
        <polygon points="630,380 650,190 660,190 680,380" fill="#1C1029" opacity="0.7" />

        {/* Corps principal du manoir / cathédrale gothique */}
        {/* Tour centrale */}
        <polygon points="360,400 395,70 405,70 440,400" fill="url(#castleGrad)" />
        <polygon points="390,70 400,30 410,70" fill="#3D1E5A" />
        {/* Croix sur la flèche */}
        <rect x="398" y="15" width="4" height="25" fill="#FF7518" />
        <rect x="393" y="22" width="14" height="4" fill="#FF7518" />

        {/* Tours latérales */}
        <polygon points="280,400 310,120 330,120 360,400" fill="url(#castleGrad)" />
        <polygon points="310,120 320,80 330,120" fill="#2E1744" />

        <polygon points="440,400 470,120 490,120 520,400" fill="url(#castleGrad)" />
        <polygon points="470,120 480,80 490,120" fill="#2E1744" />

        {/* Fenêtres ogivales éclairées en orange et violet */}
        <path d="M388,140 Q400,120 412,140 L412,180 L388,180 Z" fill="#FF7518" opacity="0.85" filter="drop-shadow(0 0 8px #FF7518)" />
        <path d="M312,160 Q320,145 328,160 L328,190 L312,190 Z" fill="#39FF14" opacity="0.8" filter="drop-shadow(0 0 6px #39FF14)" />
        <path d="M472,160 Q480,145 488,160 L488,190 L472,190 Z" fill="#DFB7FF" opacity="0.8" filter="drop-shadow(0 0 6px #DFB7FF)" />

        {/* Tombes & croix au sol */}
        <path d="M80,380 L80,340 Q95,330 110,340 L110,380 Z" fill="#140B1E" />
        <rect x="91" y="315" width="6" height="30" fill="#1C1029" />
        <rect x="85" y="325" width="18" height="6" fill="#1C1029" />

        <path d="M680,380 L680,335 Q695,325 710,335 L710,380 Z" fill="#140B1E" />

        {/* Arbres aux branches tortueuses */}
        <path d="M40,400 Q70,300 50,220 Q40,180 20,150 M50,220 Q80,180 110,160 M70,300 Q110,260 130,220" stroke="#12081C" strokeWidth="8" strokeLinecap="round" fill="none" />
        <path d="M760,400 Q730,290 750,210 Q770,170 780,140 M750,210 Q710,170 690,150" stroke="#12081C" strokeWidth="8" strokeLinecap="round" fill="none" />

        {/* Chauves-souris en vol */}
        <path d="M220,100 Q210,90 200,95 Q205,105 220,100 Q235,105 240,95 Q230,90 220,100 Z" fill="#0B0B0B" />
        <path d="M260,80 Q252,72 245,76 Q249,84 260,80 Q271,84 275,76 Q268,72 260,80 Z" fill="#0B0B0B" />
        <path d="M520,70 Q512,62 505,66 Q509,74 520,70 Q531,74 535,66 Q528,62 520,70 Z" fill="#0B0B0B" />

        {/* Couche de brume spectrale basse */}
        <rect x="0" y="240" width="800" height="160" fill="url(#fogGrad)" />
      </svg>
    </div>
  );
};

/**
 * Illustration de la pochette d'album "Dance of the Vampires" :
 * Château gothique sous Lune Rouge Sang (Blood Moon)
 */
export const BloodMoonCoverArt: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative w-full h-full bg-[#0A050E] overflow-hidden ${className}`}>
      {/* Ciel nocturne abyssal */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#14061F] via-[#2A0826] to-[#0A050E]" />

      {/* Lune Rouge Sang (Blood Moon) géante */}
      <div className="absolute top-6 left-6 w-32 h-32 rounded-full bg-gradient-to-br from-[#FF3B30] via-[#D32F2F] to-[#7B1FA2] shadow-[0_0_50px_rgba(255,59,48,0.6)] border border-[#FF7518]/40" />

      {/* Silhouette de château gothique rocheux */}
      <svg
        viewBox="0 0 300 300"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      >
        <defs>
          <linearGradient id="rockGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1E122B" />
            <stop offset="100%" stopColor="#0B0710" />
          </linearGradient>
        </defs>

        {/* Piton rocheux */}
        <polygon points="20,300 70,160 120,180 180,130 240,170 290,300" fill="url(#rockGrad)" />

        {/* Flèches de château acérées */}
        <polygon points="110,190 125,75 130,75 145,190" fill="#120A1C" />
        <polygon points="140,180 155,90 160,90 175,180" fill="#180C26" />
        <polygon points="165,190 180,60 185,60 200,190" fill="#120A1C" />
        <polygon points="80,210 95,110 100,110 115,210" fill="#150B20" />

        {/* Fenêtres incandescentes sous la lune */}
        <rect x="126" y="110" width="3" height="7" rx="1.5" fill="#FF7518" opacity="0.9" filter="drop-shadow(0 0 4px #FF7518)" />
        <rect x="156" y="125" width="3" height="7" rx="1.5" fill="#39FF14" opacity="0.9" filter="drop-shadow(0 0 4px #39FF14)" />
        <rect x="181" y="95" width="3" height="7" rx="1.5" fill="#DFB7FF" opacity="0.9" filter="drop-shadow(0 0 4px #DFB7FF)" />

        {/* Brume violette d'ambiance */}
        <circle cx="150" cy="280" r="130" fill="rgba(106, 13, 173, 0.3)" filter="blur(20px)" />
      </svg>
    </div>
  );
};
