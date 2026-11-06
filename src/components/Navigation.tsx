import React from 'react';
import { 
  Skull, 
  Disc, 
  Library, 
  Crosshair, 
  Castle, 
  BookOpen, 
  Wand2, 
  Info,
  Music2,
  Activity,
  Eye,
  Key
} from 'lucide-react';
import { playEctoClick } from '../audio/sfx';

export type ScreenId = 
  | 'crypte' 
  | 'lecteur' 
  | 'caveau' 
  | 'studio' 
  | 'massacre' 
  | 'manoir' 
  | 'bestiaire' 
  | 'enigmes' 
  | 'legendes' 
  | 'sanctuaire' 
  | 'info';

interface NavigationProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentScreen, onNavigate }) => {
  const activeTabRef = React.useRef<HTMLButtonElement | null>(null);

  React.useEffect(() => {
    if (activeTabRef.current) {
      activeTabRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [currentScreen]);

  const navItems = [
    { id: 'crypte' as ScreenId, label: 'Crypte', icon: Skull },
    { id: 'lecteur' as ScreenId, label: 'Lecteur', icon: Disc },
    { id: 'caveau' as ScreenId, label: 'Caveau', icon: Library },
    { id: 'studio' as ScreenId, label: 'Beat Pad', icon: Music2 },
    { id: 'massacre' as ScreenId, label: 'Jeux', icon: Crosshair },
    { id: 'manoir' as ScreenId, label: 'Manoir 3D', icon: Castle },
    { id: 'bestiaire' as ScreenId, label: 'Bestiaire', icon: Eye },
    { id: 'enigmes' as ScreenId, label: 'Énigmes', icon: Key },
    { id: 'legendes' as ScreenId, label: 'Grimoire', icon: BookOpen },
    { id: 'sanctuaire' as ScreenId, label: 'Hylst', icon: Wand2 },
    { id: 'info' as ScreenId, label: 'Info', icon: Info },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#07030C]/95 backdrop-blur-2xl border-t-2 border-[#5B138A] shadow-[0_-10px_35px_rgba(0,0,0,0.95)] pb-safe">
      {/* Balustrade en fer forgé victorien au sommet */}
      <div className="absolute -top-3 left-0 right-0 h-3 overflow-hidden pointer-events-none opacity-60">
        <svg viewBox="0 0 600 12" className="w-full h-full" preserveAspectRatio="none">
          <path
            d="M0,12 L600,12 M0,8 L600,8"
            stroke="#DFB7FF"
            strokeWidth="0.8"
          />
          {Array.from({ length: 30 }).map((_, i) => (
            <path
              key={i}
              d={`M${i * 20 + 10},12 L${i * 20 + 10},3 L${i * 20 + 7},6 M${i * 20 + 10},3 L${i * 20 + 13},6`}
              stroke="#FF7518"
              strokeWidth="1"
              fill="none"
            />
          ))}
        </svg>
      </div>

      <div className="max-w-xl mx-auto flex items-center overflow-x-auto no-scrollbar scroll-smooth gap-1.5 px-3 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                playEctoClick();
                onNavigate(item.id);
              }}
              className={`relative shrink-0 min-w-[56px] sm:min-w-[62px] flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all duration-300 group cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-b from-[#220E33] to-[#0E0616] border border-[#39FF14]/70 shadow-[0_0_15px_rgba(57,255,20,0.3)] scale-105'
                  : 'hover:bg-[#12081C]/70 border border-transparent hover:border-[#6A0DAD]/40'
              }`}
              ref={isActive ? activeTabRef : null}
              aria-label={`Aller à ${item.label}`}
            >
              {/* Point ogival supérieur sur l'onglet actif */}
              {isActive && (
                <div className="absolute -top-1.5 w-3 h-1.5 bg-[#39FF14] rounded-full shadow-[0_0_8px_#39FF14] animate-pulse" />
              )}

              <div
                className={`p-1.5 rounded-lg transition-transform duration-300 group-hover:scale-110 ${
                  isActive
                    ? 'text-[#39FF14]'
                    : 'text-[#8C8494] group-hover:text-[#FF7518]'
                }`}
              >
                <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </div>

              <span
                className={`text-[9px] sm:text-[10px] font-['MedievalSharp','Space_Mono',cursive] tracking-tight mt-0.5 truncate max-w-full transition-colors ${
                  isActive
                    ? 'text-[#39FF14] font-bold text-glow-ectoplasm'
                    : 'text-[#A69EAF] group-hover:text-[#E6E1DC]'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
