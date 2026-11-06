import React from 'react';

/**
 * Ornements Dark Fantasy : Crânes, Chauves-souris, Citrouilles sculptées, et Squelettes
 */

export const GothicSkullCorner: React.FC<{ position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'; className?: string }> = ({
  position = 'top-left',
  className = '',
}) => {
  const transform =
    position === 'top-right'
      ? 'scale-x-[-1]'
      : position === 'bottom-left'
      ? 'scale-y-[-1]'
      : position === 'bottom-right'
      ? 'scale-[-1]'
      : '';

  return (
    <div className={`pointer-events-none select-none ${transform} ${className}`}>
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        {/* Filigrane d'angle en fer forgé gothique */}
        <path d="M2,34 L2,6 Q2,2 6,2 L34,2" stroke="#6A0DAD" strokeWidth="1.5" opacity="0.6" />
        <path d="M6,24 L6,8 Q6,6 8,6 L24,6" stroke="#FF7518" strokeWidth="1" opacity="0.4" />
        {/* Petit crâne stylisé dans le coin */}
        <circle cx="10" cy="10" r="4.5" fill="#1C1424" stroke="#DFB7FF" strokeWidth="1" />
        <circle cx="8.5" cy="9.5" r="1" fill="#39FF14" />
        <circle cx="11.5" cy="9.5" r="1" fill="#39FF14" />
        <rect x="8.5" y="13.5" width="3" height="2" rx="0.5" fill="#DFB7FF" />
      </svg>
    </div>
  );
};

export const FloatingBat: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`inline-block animate-pulse pointer-events-none ${className}`}>
      <svg width="28" height="18" viewBox="0 0 28 18" fill="none">
        <path
          d="M14,12 Q9,2 2,6 Q5,14 11,13 Q14,16 17,13 Q23,14 26,6 Q19,2 14,12 Z"
          fill="#1C1424"
          stroke="#6A0DAD"
          strokeWidth="1"
        />
        <circle cx="12.5" cy="10" r="0.75" fill="#FF7518" />
        <circle cx="15.5" cy="10" r="0.75" fill="#FF7518" />
      </svg>
    </div>
  );
};

export const CarvedPumpkinIcon: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = '' }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={`inline-block ${className}`}>
      {/* Pédoncule */}
      <path d="M15,4 Q14,1 18,2" stroke="#39FF14" strokeWidth="2.5" strokeLinecap="round" />
      {/* Corps de citrouille */}
      <ellipse cx="16" cy="18" rx="13" ry="11" fill="#FF7518" />
      <path d="M16,7 Q9,14 9,22 Q9,27 16,29 Q23,27 23,22 Q23,14 16,7 Z" fill="#E65100" opacity="0.35" />
      {/* Yeux triangulaires malicieux */}
      <polygon points="10,14 13,17 10,18" fill="#12081C" />
      <polygon points="22,14 19,17 22,18" fill="#12081C" />
      {/* Nez */}
      <polygon points="16,17 15,20 17,20" fill="#12081C" />
      {/* Sourire édenté sculpté */}
      <path
        d="M9,22 Q12,27 16,27 Q20,27 23,22 Q21,25 16,25 Q11,25 9,22 Z"
        fill="#12081C"
      />
      <rect x="13" y="22" width="2" height="2" fill="#FFD700" />
      <rect x="17" y="24" width="2" height="2" fill="#FFD700" />
    </svg>
  );
};

export const SkeletonBoneDivider: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex items-center justify-center gap-2 py-2 opacity-75 ${className}`}>
      <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#6A0DAD]" />
      <span className="text-sm">🦴</span>
      <span className="text-xs">💀</span>
      <span className="text-sm">🦴</span>
      <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#6A0DAD]" />
    </div>
  );
};

export const GothicCobwebCorner: React.FC<{
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
  size?: number;
}> = ({ position = 'top-left', className = '', size = 52 }) => {
  const transform =
    position === 'top-right'
      ? 'scale-x-[-1]'
      : position === 'bottom-left'
      ? 'scale-y-[-1]'
      : position === 'bottom-right'
      ? 'scale-[-1]'
      : '';

  return (
    <div className={`pointer-events-none select-none ${transform} ${className}`}>
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        {/* Rayons de la toile d'araignée */}
        <line x1="0" y1="0" x2="100" y2="0" stroke="#DFB7FF" strokeWidth="0.8" opacity="0.35" />
        <line x1="0" y1="0" x2="85" y2="40" stroke="#DFB7FF" strokeWidth="0.8" opacity="0.35" />
        <line x1="0" y1="0" x2="60" y2="75" stroke="#DFB7FF" strokeWidth="0.8" opacity="0.35" />
        <line x1="0" y1="0" x2="35" y2="92" stroke="#DFB7FF" strokeWidth="0.8" opacity="0.35" />
        <line x1="0" y1="0" x2="0" y2="100" stroke="#DFB7FF" strokeWidth="0.8" opacity="0.35" />

        {/* Spirales concentriques en arc brisé */}
        <path d="M25,0 Q18,18 0,25" stroke="#8C8494" strokeWidth="0.9" fill="none" opacity="0.4" />
        <path d="M48,0 Q34,35 0,48" stroke="#8C8494" strokeWidth="0.9" fill="none" opacity="0.4" />
        <path d="M72,0 Q50,52 0,72" stroke="#8C8494" strokeWidth="0.9" fill="none" opacity="0.45" />
        <path d="M96,0 Q68,70 0,96" stroke="#8C8494" strokeWidth="0.9" fill="none" opacity="0.45" />

        {/* Petite araignée tapie */}
        <circle cx="48" cy="28" r="2.5" fill="#1C1424" stroke="#6A0DAD" strokeWidth="0.8" />
        <line x1="46" y1="26" x2="42" y2="23" stroke="#6A0DAD" strokeWidth="0.6" />
        <line x1="50" y1="26" x2="54" y2="23" stroke="#6A0DAD" strokeWidth="0.6" />
        <line x1="46" y1="30" x2="43" y2="33" stroke="#6A0DAD" strokeWidth="0.6" />
        <line x1="50" y1="30" x2="53" y2="33" stroke="#6A0DAD" strokeWidth="0.6" />
      </svg>
    </div>
  );
};

export const HorrorGargoyle: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 48,
}) => {
  return (
    <div className={`inline-block pointer-events-none select-none ${className}`}>
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        {/* Ailes démoniaques de gargouille */}
        <path
          d="M32,24 C20,12 8,16 4,28 C8,30 18,28 22,34 C12,38 8,46 10,54 C16,48 24,46 30,42 Z"
          fill="#1C1424"
          stroke="#4A154B"
          strokeWidth="1.2"
        />
        <path
          d="M32,24 C44,12 56,16 60,28 C56,30 46,28 42,34 C52,38 56,46 54,54 C48,48 40,46 34,42 Z"
          fill="#1C1424"
          stroke="#4A154B"
          strokeWidth="1.2"
        />
        {/* Tête cornue et crocs */}
        <path
          d="M26,18 L22,8 L28,14 L32,12 L36,14 L42,8 L38,18 C42,22 42,28 38,32 L34,36 L30,36 L26,32 C22,28 22,22 26,18 Z"
          fill="#120A1A"
          stroke="#6A0DAD"
          strokeWidth="1.2"
        />
        {/* Yeux rubis maléfiques luisants */}
        <circle cx="28" cy="22" r="1.5" fill="#FF1E27" className="animate-pulse" />
        <circle cx="36" cy="22" r="1.5" fill="#FF1E27" className="animate-pulse" />
        {/* Crocs acérés */}
        <polygon points="29,28 30,32 31,28" fill="#E6E1DC" />
        <polygon points="33,28 34,32 35,28" fill="#E6E1DC" />
      </svg>
    </div>
  );
};

export const DrippingBloodAccent: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`w-full overflow-hidden pointer-events-none ${className}`}>
      <svg viewBox="0 0 600 24" className="w-full h-4 sm:h-5" preserveAspectRatio="none">
        <path
          d="M0,0 L600,0 L600,6 
             L560,6 C558,16 554,22 552,22 C550,22 548,16 546,6 
             L480,6 C478,14 476,19 474,19 C472,19 470,13 468,6 
             L390,6 C388,18 385,24 382,24 C379,24 378,18 376,6 
             L290,6 C288,12 286,16 284,16 C282,16 280,12 278,6 
             L210,6 C208,18 205,23 203,23 C201,23 199,17 197,6 
             L120,6 C118,15 116,21 114,21 C112,21 110,15 108,6 
             L40,6 C38,12 36,17 34,17 C32,17 30,12 28,6 L0,6 Z"
          fill="#580C1F"
          opacity="0.85"
        />
        <path
          d="M0,0 L600,0 L600,3 
             L385,3 C384,12 383,18 382,18 C381,18 380,12 379,3 
             L205,3 C204,11 203,16 202,16 C201,16 200,11 199,3 
             L0,3 Z"
          fill="#8B0000"
          opacity="0.9"
        />
      </svg>
    </div>
  );
};

/**
 * Coin en Ferronnerie Victorienne Ouvragée avec arabesques et pointes de lance gothiques
 */
export const VictorianCornerFlourish: React.FC<{
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
  size?: number;
  color?: string;
}> = ({ position = 'top-left', className = '', size = 38, color = '#DFB7FF' }) => {
  const transform =
    position === 'top-right'
      ? 'scale-x-[-1]'
      : position === 'bottom-left'
      ? 'scale-y-[-1]'
      : position === 'bottom-right'
      ? 'scale-[-1]'
      : '';

  return (
    <div className={`pointer-events-none select-none ${transform} ${className}`}>
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        {/* Volute principale extérieure en fer forgé */}
        <path
          d="M3,45 L3,14 C3,7 7,3 14,3 L45,3"
          stroke="#6A0DAD"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.8"
        />
        {/* Filet intérieur ouvragé */}
        <path
          d="M7,45 L7,16 C7,11 11,7 16,7 L45,7"
          stroke={color}
          strokeWidth="1"
          opacity="0.5"
        />
        {/* Arabesque en volute victorienne */}
        <path
          d="M12,24 C10,18 14,12 20,12 C25,12 28,16 26,21 C24,25 18,25 16,21 C15,19 16,16 19,16"
          stroke={color}
          strokeWidth="1.2"
          fill="none"
          opacity="0.75"
        />
        {/* Pointe de lance / fleuron gothique sur l'angle */}
        <path
          d="M4,4 L12,12 L8,14 L14,8 Z"
          fill="#FF7518"
          opacity="0.85"
        />
        <circle cx="14" cy="14" r="1.5" fill="#39FF14" />
      </svg>
    </div>
  );
};

/**
 * Séparateur ornemental en fer forgé victorien avec fleuron / rosette centrale
 */
export const VictorianFiligreeDivider: React.FC<{
  className?: string;
  accentColor?: string;
}> = ({ className = '', accentColor = '#FF7518' }) => {
  return (
    <div className={`flex items-center justify-center gap-2 py-2.5 pointer-events-none select-none ${className}`}>
      <svg viewBox="0 0 320 20" className="w-full max-w-md h-5" fill="none">
        {/* Ligne gauche avec volutes */}
        <path d="M10,10 L120,10" stroke="#6A0DAD" strokeWidth="1.2" opacity="0.6" />
        <path d="M60,10 C75,5 95,5 110,10 C95,15 75,15 60,10 Z" stroke="#6A0DAD" strokeWidth="0.8" opacity="0.4" />
        <circle cx="20" cy="10" r="2" fill="#6A0DAD" />
        <circle cx="70" cy="10" r="1.5" fill={accentColor} opacity="0.7" />

        {/* Rosette centrale gothique */}
        <g transform="translate(160, 10)">
          <path
            d="M0,-8 C4,-4 8,-4 8,0 C8,4 4,4 0,8 C-4,4 -8,4 -8,0 C-8,-4 -4,-4 0,-8 Z"
            fill="#1A0D26"
            stroke={accentColor}
            strokeWidth="1.4"
          />
          <circle cx="0" cy="0" r="2.5" fill="#39FF14" />
          {/* Volutes latérales de la rosette */}
          <path d="M-8,0 C-14,-6 -20,-3 -22,0 C-20,3 -14,6 -8,0" stroke="#DFB7FF" strokeWidth="1" fill="none" opacity="0.8" />
          <path d="M8,0 C14,-6 20,-3 22,0 C20,3 14,6 8,0" stroke="#DFB7FF" strokeWidth="1" fill="none" opacity="0.8" />
        </g>

        {/* Ligne droite symétrique */}
        <path d="M200,10 L310,10" stroke="#6A0DAD" strokeWidth="1.2" opacity="0.6" />
        <path d="M210,10 C225,5 245,5 260,10 C245,15 225,15 210,10 Z" stroke="#6A0DAD" strokeWidth="0.8" opacity="0.4" />
        <circle cx="250" cy="10" r="1.5" fill={accentColor} opacity="0.7" />
        <circle cx="300" cy="10" r="2" fill="#6A0DAD" />
      </svg>
    </div>
  );
};

/**
 * Cadre en Ferronnerie Victorienne Ouvragée (remplace les cartes plates basiques)
 */
export const VictorianIronworkCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  highlightGlow?: 'purple' | 'orange' | 'green' | 'none';
  accentColor?: string;
  onClick?: () => void;
}> = ({
  children,
  className = '',
  highlightGlow = 'purple',
  accentColor = '#DFB7FF',
  onClick,
}) => {
  const glowStyles = {
    purple: 'border-[#6A0DAD]/70 shadow-[0_10px_35px_rgba(106,13,173,0.3),inset_0_1px_0_rgba(223,183,255,0.15)]',
    orange: 'border-[#FF7518]/70 shadow-[0_10px_35px_rgba(255,117,24,0.3),inset_0_1px_0_rgba(255,117,24,0.2)]',
    green: 'border-[#39FF14]/70 shadow-[0_10px_35px_rgba(57,255,20,0.3),inset_0_1px_0_rgba(57,255,20,0.2)]',
    none: 'border-[#6A0DAD]/40 shadow-[0_8px_25px_rgba(0,0,0,0.7)]',
  }[highlightGlow];

  return (
    <div
      onClick={onClick}
      className={`relative rounded-2xl border-2 bg-gradient-to-b from-[#150B24] via-[#0E0718] to-[#07030D] ${glowStyles} overflow-hidden ${className}`}
    >
      {/* 4 Coins en ferronnerie victorienne ouvragée */}
      <VictorianCornerFlourish position="top-left" size={32} color={accentColor} className="absolute top-0 left-0 z-10" />
      <VictorianCornerFlourish position="top-right" size={32} color={accentColor} className="absolute top-0 right-0 z-10" />
      <VictorianCornerFlourish position="bottom-left" size={32} color={accentColor} className="absolute bottom-0 left-0 z-10" />
      <VictorianCornerFlourish position="bottom-right" size={32} color={accentColor} className="absolute bottom-0 right-0 z-10" />

      {/* Rosettes de fixation en fer forgé au centre haut et bas */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none opacity-60">
        <svg width="24" height="6" viewBox="0 0 24 6">
          <path d="M0,0 Q12,6 24,0" stroke="#DFB7FF" strokeWidth="1" fill="#1C102E" />
          <circle cx="12" cy="2.5" r="1.5" fill="#FF7518" />
        </svg>
      </div>

      {/* Trame subtile d'arabesques en filigrane d'arrière-plan */}
      <div className="absolute inset-0 bg-[radial-gradient(#6a0dad_1px,transparent_1px)] [background-size:18px_18px] opacity-10 pointer-events-none" />

      {/* Contenu enfant */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

/**
 * Illustration Gothique du Manoir Victorien & Cimetière Sépulcral
 */
export const CryptHeroArt: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative w-full h-full pointer-events-none select-none ${className}`}>
      <svg
        viewBox="0 0 800 360"
        className="w-full h-full object-cover"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <defs>
          <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0B0314" />
            <stop offset="60%" stopColor="#1C0E2D" />
            <stop offset="100%" stopColor="#0D0716" />
          </linearGradient>
          <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#39FF14" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#DFB7FF" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#0B0314" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="windowGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFB347" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FF7518" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ciel nocturne profond */}
        <rect width="800" height="360" fill="url(#skyGrad)" />

        {/* Halo et Lune Spectrale d'Outre-Tombe */}
        <circle cx="560" cy="110" r="140" fill="url(#moonGlow)" />
        <circle cx="560" cy="110" r="48" fill="#F4E8C1" opacity="0.9" />
        <circle cx="585" cy="98" r="44" fill="#180C26" />

        {/* Étoiles spectrales clignotantes */}
        <circle cx="120" cy="45" r="1.5" fill="#39FF14" opacity="0.7" />
        <circle cx="280" cy="30" r="1.2" fill="#DFB7FF" opacity="0.8" />
        <circle cx="410" cy="55" r="1.5" fill="#39FF14" opacity="0.6" />
        <circle cx="710" cy="70" r="1.5" fill="#DFB7FF" opacity="0.7" />

        {/* Silhouette de colline brumeuse arrière */}
        <path
          d="M0,290 Q220,220 480,270 Q640,300 800,260 L800,360 L0,360 Z"
          fill="#0D0616"
          opacity="0.8"
        />

        {/* Silhouette du Manoir Victorien Gothique */}
        <g fill="#07020C" stroke="#251239" strokeWidth="1.2">
          {/* Aile gauche */}
          <rect x="220" y="160" width="110" height="150" />
          <polygon points="215,160 275,80 335,160" fill="#050109" />
          {/* Flèche gothique & girouette */}
          <line x1="275" y1="80" x2="275" y2="40" stroke="#6A0DAD" strokeWidth="2" />
          <polygon points="275,40 282,48 268,48" fill="#FF7518" />

          {/* Corps de logis principal */}
          <rect x="330" y="130" width="140" height="180" />
          <polygon points="320,130 400,60 480,130" fill="#050109" />
          <line x1="400" y1="60" x2="400" y2="20" stroke="#6A0DAD" strokeWidth="2" />
          <line x1="392" y1="30" x2="408" y2="30" stroke="#39FF14" strokeWidth="1.5" />

          {/* Tour octogonale droite */}
          <rect x="470" y="110" width="85" height="200" />
          <polygon points="460,110 512,35 565,110" fill="#040107" />
          <line x1="512" y1="35" x2="512" y2="5" stroke="#6A0DAD" strokeWidth="2" />
          {/* Chauve-souris sur la flèche */}
          <circle cx="512" cy="5" r="3" fill="#FF7518" />

          {/* Cheminées penchées */}
          <rect x="235" y="95" width="16" height="45" />
          <line x1="231" y1="95" x2="255" y2="95" stroke="#3A1E54" strokeWidth="2" />
          <rect x="440" y="80" width="18" height="50" />
          <line x1="436" y1="80" x2="462" y2="80" stroke="#3A1E54" strokeWidth="2" />
        </g>

        {/* Fenêtres ogivales éclairées à la bougie */}
        <g fill="#FFB347" opacity="0.85">
          {/* Fenêtre aile gauche */}
          <path d="M260,195 Q275,170 290,195 L290,230 L260,230 Z" />
          <line x1="275" y1="180" x2="275" y2="230" stroke="#050109" strokeWidth="1.5" />
          <line x1="260" y1="205" x2="290" y2="205" stroke="#050109" strokeWidth="1.5" />

          {/* Grande baie ogivale centrale */}
          <path d="M375,170 Q400,135 425,170 L425,230 L375,230 Z" />
          <line x1="400" y1="145" x2="400" y2="230" stroke="#050109" strokeWidth="2" />
          <line x1="375" y1="185" x2="425" y2="185" stroke="#050109" strokeWidth="1.5" />

          {/* Meurtrières de la tour */}
          <rect x="504" y="140" width="16" height="35" rx="8" fill="#39FF14" opacity="0.9" />
          <rect x="504" y="200" width="16" height="35" rx="8" fill="#FF7518" opacity="0.9" />
        </g>

        {/* Portail victorien en fer forgé au centre */}
        <path
          d="M370,310 L370,265 Q400,240 430,265 L430,310 Z"
          fill="#030005"
          stroke="#6A0DAD"
          strokeWidth="1.5"
        />

        {/* Arbres décharnés et tombes du premier plan */}
        <g stroke="#030005" strokeWidth="3" fill="#030005">
          {/* Arbre mort gauche */}
          <path d="M110,320 Q120,240 100,200 Q70,170 45,160 M100,200 Q130,165 145,130 M100,235 Q70,225 55,240" strokeLinecap="round" />
          {/* Arbre mort droite */}
          <path d="M680,320 Q660,230 690,190 Q725,160 750,150 M690,190 Q655,160 640,120" strokeLinecap="round" />
        </g>

        {/* Croix sépulcrales et stèles sur la butte */}
        <g fill="#07020C" stroke="#251239" strokeWidth="1">
          <rect x="150" y="275" width="22" height="30" rx="3" />
          {/* Croix */}
          <rect x="188" y="260" width="6" height="32" />
          <rect x="178" y="270" width="26" height="6" />

          <rect x="600" y="280" width="24" height="28" rx="4" />
          <rect x="645" y="255" width="6" height="36" />
          <rect x="635" y="267" width="26" height="6" />
        </g>

        {/* Chauves-souris en vol dans la nuit */}
        <g fill="#160824" stroke="#DFB7FF" strokeWidth="0.5">
          <path d="M490,90 Q475,75 460,82 Q470,95 480,92 Q490,100 500,92 Q510,95 520,82 Q505,75 490,90 Z" />
          <path d="M380,60 Q370,48 358,54 Q366,64 374,62 Q380,68 388,62 Q396,64 404,54 Q392,48 380,60 Z" />
          <path d="M620,120 Q612,110 600,115 Q608,124 614,122 Q620,127 626,122 Q632,124 640,115 Q628,110 620,120 Z" />
        </g>

        {/* Liseré de brume au ras du sol */}
        <path
          d="M0,340 Q200,320 400,335 Q600,350 800,330 L800,360 L0,360 Z"
          fill="#1C0E28"
          opacity="0.6"
        />
      </svg>
    </div>
  );
};

/**
 * Crête de ferronnerie gothique à pointes de lance (couronnement de card)
 */
export const WroughtIronCrest: React.FC<{ className?: string; accentColor?: string }> = ({
  className = '',
  accentColor = '#DFB7FF',
}) => {
  return (
    <div className={`w-full overflow-hidden pointer-events-none select-none ${className}`}>
      <svg viewBox="0 0 400 24" className="w-full h-4 sm:h-5" preserveAspectRatio="none" fill="none">
        {/* Rail inférieur en fer forgé */}
        <line x1="0" y1="22" x2="400" y2="22" stroke="#6A0DAD" strokeWidth="2" opacity="0.8" />
        <line x1="0" y1="18" x2="400" y2="18" stroke={accentColor} strokeWidth="1" opacity="0.4" />
        
        {/* Piques de lance et volutes régulières */}
        {Array.from({ length: 17 }).map((_, i) => {
          const x = 12 + i * 23.5;
          const isFleurDeLys = i % 4 === 2;
          return (
            <g key={i}>
              {/* Pique principale */}
              <line x1={x} y1="22" x2={x} y2={isFleurDeLys ? 2 : 6} stroke="#3A1259" strokeWidth="1.5" />
              {isFleurDeLys ? (
                /* Fleuron gothique */
                <path
                  d={`M${x - 4},12 C${x - 6},8 ${x - 5},5 ${x},2 C${x + 5},5 ${x + 6},8 ${x + 4},12 Z`}
                  fill="#FF7518"
                  stroke="#39FF14"
                  strokeWidth="0.8"
                />
              ) : (
                /* Pointe de lance biseautée */
                <polygon
                  points={`${x},4 ${x - 3},10 ${x + 3},10`}
                  fill={accentColor}
                  opacity="0.9"
                />
              )}
              {/* Petites volutes bilatérales */}
              <path
                d={`M${x - 5},18 Q${x - 2},14 ${x},18 Q${x + 2},14 ${x + 5},18`}
                stroke="#6A0DAD"
                strokeWidth="1"
                fill="none"
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
};

/**
 * Rosace Gothique ajourée (tracery vitrail cathédrale)
 */
export const GothicRosaceTracery: React.FC<{ size?: number; className?: string; color?: string }> = ({
  size = 40,
  className = '',
  color = '#DFB7FF',
}) => {
  return (
    <div className={`inline-block pointer-events-none select-none ${className}`}>
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        {/* Cercle extérieur à pointes */}
        <circle cx="32" cy="32" r="30" stroke="#6A0DAD" strokeWidth="1.5" opacity="0.7" />
        <circle cx="32" cy="32" r="26" stroke={color} strokeWidth="1" opacity="0.4" />

        {/* Quadrilobe gothique intérieur */}
        <path
          d="M32,10 C38,10 42,14 42,20 C48,20 54,24 54,32 C54,40 48,44 42,44 C42,50 38,54 32,54 C26,54 22,50 22,44 C16,44 10,40 10,32 C10,24 16,20 22,20 C22,14 26,10 32,10 Z"
          stroke={color}
          strokeWidth="1.2"
          fill="#140822"
          opacity="0.85"
        />

        {/* Cœur de rosace avec trèfles */}
        <circle cx="32" cy="32" r="6" fill="#1C0A30" stroke="#FF7518" strokeWidth="1.2" />
        <circle cx="32" cy="32" r="2" fill="#39FF14" />

        {/* 4 Pétales de lancettes cardinales */}
        <circle cx="32" cy="18" r="3.5" stroke="#DFB7FF" strokeWidth="0.9" fill="none" />
        <circle cx="46" cy="32" r="3.5" stroke="#DFB7FF" strokeWidth="0.9" fill="none" />
        <circle cx="32" cy="46" r="3.5" stroke="#DFB7FF" strokeWidth="0.9" fill="none" />
        <circle cx="18" cy="32" r="3.5" stroke="#DFB7FF" strokeWidth="0.9" fill="none" />
      </svg>
    </div>
  );
};

/**
 * Bouton Portail Sépulcral Gothique (pour ENTRER DANS LA CRYPTE & actions héroïques)
 */
export const GothicPortalButton: React.FC<{
  onClick: () => void;
  children: React.ReactNode;
  subtitle?: string;
  className?: string;
}> = ({ onClick, children, subtitle, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`relative w-full group overflow-hidden cursor-pointer rounded-2xl border-2 border-[#FF7518] bg-gradient-to-b from-[#2A1105] via-[#1B0A03] to-[#0D0401] p-1 shadow-[0_10px_35px_rgba(255,117,24,0.45),inset_0_2px_4px_rgba(255,180,60,0.3)] transition-all duration-300 hover:scale-[1.015] hover:shadow-[0_15px_45px_rgba(255,117,24,0.65),inset_0_2px_8px_rgba(255,200,80,0.5)] active:scale-[0.99] ${className}`}
    >
      {/* Texture de ferronnerie & linteau ogival */}
      <div className="absolute inset-0 bg-[radial-gradient(#ff7518_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />

      {/* Rivets de fer forgé dans les 4 coins */}
      <span className="absolute top-2 left-3 text-[10px] text-[#FFB347] font-mono select-none opacity-80">❖</span>
      <span className="absolute top-2 right-3 text-[10px] text-[#FFB347] font-mono select-none opacity-80">❖</span>
      <span className="absolute bottom-2 left-3 text-[10px] text-[#FFB347] font-mono select-none opacity-80">❖</span>
      <span className="absolute bottom-2 right-3 text-[10px] text-[#FFB347] font-mono select-none opacity-80">❖</span>

      {/* Cadre intérieur ouvragé avec double filet */}
      <div className="relative py-4 px-6 rounded-xl border border-[#FF7518]/60 bg-gradient-to-r from-black/60 via-transparent to-black/60 flex flex-col items-center justify-center text-center">
        {/* Lueur de braise traversante au hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FF7518]/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

        <div className="flex items-center gap-3">
          <span className="text-xl group-hover:rotate-12 transition-transform duration-300">💀</span>
          <span className="font-['Cinzel_Decorative','Syne',serif] text-base sm:text-lg font-black tracking-widest text-[#FFF3E0] text-engraved-gold group-hover:text-[#FFE0B2] transition-colors">
            {children}
          </span>
          <span className="text-xl group-hover:-rotate-12 transition-transform duration-300">⚔️</span>
        </div>

        {subtitle && (
          <p className="font-mono text-[10px] uppercase tracking-widest text-[#FFB060] mt-1 opacity-90">
            {subtitle}
          </p>
        )}
      </div>
    </button>
  );
};

/**
 * Lettrine gothique enluminée pour les textes de lore & chroniques
 */
export const GothicDropCap: React.FC<{ letter: string; className?: string }> = ({
  letter,
  className = '',
}) => {
  return (
    <span
      className={`float-left mr-2.5 my-0.5 w-10 h-10 rounded-lg border border-[#FF7518]/80 bg-gradient-to-br from-[#2D1204] to-[#120502] flex items-center justify-center font-['Pirata_One','MedievalSharp',cursive] text-2xl font-bold text-[#FF9030] shadow-[0_0_12px_rgba(255,117,24,0.4)] select-none ${className}`}
    >
      {letter}
    </span>
  );
};
