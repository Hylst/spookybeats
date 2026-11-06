import React, { useState, useEffect } from 'react';
import { ChevronsUp } from 'lucide-react';

/**
 * Bouton "Retour en haut de crypte" - apparait apres 400px de scroll
 * Position fixe bas-droite, au-dessus de la barre de nav (bottom-24)
 * Style gothique : crane lumineux vert ectoplasme + lueur citrouille au survol
 */
export const ScrollTopButton: React.FC = () => {
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Retour en haut de la crypte"
      title="Remonter vers les cieux sombres"
      className="fixed bottom-24 right-4 z-30 w-11 h-11 flex items-center justify-center rounded-full
        bg-[#07030C]/90 border border-[#39FF14]/60 shadow-[0_0_18px_rgba(57,255,20,0.35)]
        hover:bg-[#0E0616] hover:border-[#FF7518] hover:shadow-[0_0_22px_rgba(255,117,24,0.5)]
        active:scale-90 transition-all duration-300 backdrop-blur-sm"
    >
      <ChevronsUp className="w-5 h-5 text-[#39FF14] group-hover:text-[#FF7518] transition-colors" />
    </button>
  );
};
