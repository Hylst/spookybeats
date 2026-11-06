import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Keyboard,
  Sliders,
  Sparkles,
  Music,
  ExternalLink,
  Shield,
  HelpCircle,
  Eye,
  CheckCircle2,
  Volume2,
  Radio,
  Flame,
  Feather,
  Compass,
  Cpu,
} from 'lucide-react';
import {
  VictorianIronworkCard,
  VictorianFiligreeDivider,
  VictorianCornerFlourish,
  HorrorGargoyle,
  DrippingBloodAccent,
  WroughtIronCrest,
} from './GothicDecorations';
import { playEctoClick, playEvilLaugh, playGoldenFrenzy } from '../audio/sfx';
import { ScreenId } from './Navigation';

type InfoTab = 'guide' | 'shortcuts' | 'comfort' | 'architecture';

interface InfoSectionProps {
  onNavigate?: (screen: ScreenId) => void;
}

export const InfoSection: React.FC<InfoSectionProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<InfoTab>('guide');

  // États de confort visuel et audio (sauvegardés en local)
  const [fogLevel, setFogLevel] = useState<'faible' | 'normal' | 'dense'>(() => {
    const saved = localStorage.getItem('spookybeats_fog_level');
    return (saved === 'faible' || saved === 'dense' ? saved : 'normal') as 'faible' | 'normal' | 'dense';
  });
  const [highContrast, setHighContrast] = useState<boolean>(() => {
    return localStorage.getItem('spookybeats_high_contrast') === 'true';
  });
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    return localStorage.getItem('spookybeats_reduced_motion') === 'true';
  });

  const handleSetFog = (lvl: 'faible' | 'normal' | 'dense') => {
    playEctoClick();
    setFogLevel(lvl);
    localStorage.setItem('spookybeats_fog_level', lvl);
    // Appliquer une classe globale sur le body
    document.body.dataset.fog = lvl;
  };

  const handleToggleContrast = () => {
    playEctoClick();
    const next = !highContrast;
    setHighContrast(next);
    localStorage.setItem('spookybeats_high_contrast', String(next));
    if (next) {
      document.documentElement.classList.add('contrast-125');
    } else {
      document.documentElement.classList.remove('contrast-125');
    }
  };

  const handleToggleMotion = () => {
    playEctoClick();
    const next = !reducedMotion;
    setReducedMotion(next);
    localStorage.setItem('spookybeats_reduced_motion', String(next));
  };

  const SANCTUARIES: Array<{ id: ScreenId; name: string; desc: string }> = [
    { id: 'crypte', name: 'La Crypte (Accueil)', desc: 'Portail central, vue d\'ensemble des 19 compositions, rituel d\'entrée et visualiseur audio.' },
    { id: 'lecteur', name: 'Le Lecteur Fantôme', desc: 'Platine vinyle/cassette, égaliseur paramétrique 3 bandes, analyseur de spectre temps réel et paroles.' },
    { id: 'caveau', name: 'Le Caveau Sonore', desc: 'Bibliothèque des 19 morceaux d\'Hylst, tri par BPM, mode DJ crossfade spectral et favoris.' },
    { id: 'studio', name: 'Beat Pad Studio', desc: 'Station de percussion 16 pads, séquenceur 8-pas, rack d\'effets DSP et 5 presets rythmiques gothiques.' },
    { id: 'massacre', name: 'Les Jeux de la Crypte', desc: '6 épreuves : Massacre de citrouilles, Requiem, Autel Simon, Sarcophages, Chaudron d\'Awen et Labyrinthe.' },
    { id: 'manoir', name: 'Le Manoir Hanté 3D', desc: 'Exploration temps réel Three.js, météo spectrale, vision nocturne et Chasse aux 7 Reliques fantômes.' },
    { id: 'bestiaire', name: 'Le Bestiaire de l\'Ombre', desc: '20 créatures de cauchemar avec taxonomie latine, duels sépulcraux, comparateur et bibliothèque de cris réels MP3.' },
    { id: 'enigmes', name: 'Les Énigmes de la Crypte', desc: '18 énigmes réparties en 5 tomes, devinettes runiques, anagrammes et Tirage du Destin (Tarot funeste).' },
    { id: 'legendes', name: 'Le Grimoire des Légendes', desc: 'Codex enluminé de 16 chroniques celtiques et victoriennes, lettrines, recettes d\'herboristerie et Oracle de Samhain.' },
    { id: 'sanctuaire', name: 'Le Sanctuaire Hylst', desc: 'Hommage à Geoffroy Streit : orgue baroque virtuel jouable, soundboard de 22 SFX MP3 et genèse musicale.' },
    { id: 'info', name: 'Le Guide de l\'Érudit', desc: 'Manuel officiel : cartographie des 11 sanctuaires, raccourcis clavier, confort visuel et architecture technique.' },
  ];

  return (
    <div className="w-full flex flex-col gap-4 pb-28 animate-fadeIn">
      {/* En-tête Gothique Victorien */}
      <VictorianIronworkCard highlightGlow="purple" className="p-4 sm:p-5 relative text-center overflow-hidden">
        <VictorianCornerFlourish position="top-left" color="#DFB7FF" />
        <VictorianCornerFlourish position="top-right" color="#DFB7FF" />
        <DrippingBloodAccent className="mb-1 opacity-70" />

        <span className="text-[10px] font-mono tracking-widest text-[#39FF14] uppercase font-bold">
          ★ ARCHIVES & SAVOIR DE L'APPLICATION ★
        </span>
        <h2 className="font-syne text-2xl sm:text-3xl font-extrabold text-[#E6E1DC] mt-0.5 tracking-wide">
          Le Guide de l'Érudit
        </h2>
        <p className="text-xs font-mono text-[#A89CAE] max-w-xl mx-auto mt-1">
          Manuel complet de SpookyBeats : cartographie des 11 sanctuaires, raccourcis secrets, options d'accessibilité et architecture audio.
        </p>

        {/* Barre d'onglets du Guide */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 mt-4 pt-3 border-t border-[#6A0DAD]/30">
          <button
            onClick={() => {
              playEctoClick();
              setActiveTab('guide');
            }}
            className={`py-1.5 px-3 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
              activeTab === 'guide'
                ? 'bg-[#FF7518] text-black border-[#FFB060] shadow-[0_0_12px_rgba(255,117,24,0.4)]'
                : 'bg-[#140A1E] text-[#8C8494] hover:text-[#E6E1DC] border-[#6A0DAD]/40'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Carte des Sanctuaires</span>
          </button>

          <button
            onClick={() => {
              playEctoClick();
              setActiveTab('shortcuts');
            }}
            className={`py-1.5 px-3 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
              activeTab === 'shortcuts'
                ? 'bg-[#39FF14] text-black border-[#A5FFA0] shadow-[0_0_12px_rgba(57,255,20,0.4)]'
                : 'bg-[#140A1E] text-[#8C8494] hover:text-[#E6E1DC] border-[#6A0DAD]/40'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>Raccourcis Clavier</span>
          </button>

          <button
            onClick={() => {
              playEctoClick();
              setActiveTab('comfort');
            }}
            className={`py-1.5 px-3 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
              activeTab === 'comfort'
                ? 'bg-[#06B6D4] text-black border-[#67E8F9] shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                : 'bg-[#140A1E] text-[#8C8494] hover:text-[#E6E1DC] border-[#6A0DAD]/40'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Confort & Accessibilité</span>
          </button>

          <button
            onClick={() => {
              playEctoClick();
              setActiveTab('architecture');
            }}
            className={`py-1.5 px-3 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
              activeTab === 'architecture'
                ? 'bg-[#A855F7] text-white border-[#DFB7FF] shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                : 'bg-[#140A1E] text-[#8C8494] hover:text-[#E6E1DC] border-[#6A0DAD]/40'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Architecture & Artiste</span>
          </button>
        </div>
      </VictorianIronworkCard>

      {/* ONGLET 1 : CARTE DES SANCTUAIRES */}
      {activeTab === 'guide' && (
        <div className="flex flex-col gap-3 animate-fadeIn">
          <VictorianIronworkCard highlightGlow="none" className="p-4">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#FF7518] block mb-2 font-bold">
              Guide d'Orientation des 11 Sanctuaires
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {SANCTUARIES.map((s, idx) => (
                <div
                  key={s.id}
                  className="p-3 rounded-xl bg-[#140A1E]/80 border border-[#6A0DAD]/40 flex flex-col justify-between hover:border-[#DFB7FF]/60 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-syne font-bold text-xs sm:text-sm text-[#E6E1DC]">
                        {s.name}
                      </span>
                      <span className="text-[9px] font-mono text-[#39FF14] px-1.5 py-0.5 rounded bg-[#39FF14]/15 border border-[#39FF14]/30">
                        #{idx + 1}
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-[#8C8494] leading-relaxed">
                      {s.desc}
                    </p>
                  </div>

                  {onNavigate && s.id !== 'info' && (
                    <button
                      onClick={() => {
                        playEctoClick();
                        onNavigate(s.id);
                      }}
                      className="mt-2 text-[10px] font-mono text-[#FF7518] hover:text-[#39FF14] flex items-center gap-1 transition-colors self-end cursor-pointer font-bold"
                    >
                      <span>Ouvrir le Sanctuaire</span>
                      <span>➔</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </VictorianIronworkCard>
        </div>
      )}

      {/* ONGLET 2 : RACCOURCIS CLAVIER */}
      {activeTab === 'shortcuts' && (
        <div className="flex flex-col gap-3 animate-fadeIn">
          <VictorianIronworkCard highlightGlow="green" className="p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3">
              <Keyboard className="w-5 h-5 text-[#39FF14]" />
              <h3 className="font-syne font-bold text-base text-[#E6E1DC]">
                Commandes Célestes & Raccourcis Rapides
              </h3>
            </div>
            <p className="text-xs font-mono text-[#8C8494] mb-4">
              Contrôlez l'expérience au clavier pour une immersion absolue sans interrompre vos rituels.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              {/* Lecteur Audio */}
              <div className="p-3 rounded-xl bg-[#0F0718] border border-[#6A0DAD]/50 flex flex-col gap-2">
                <span className="font-syne font-bold text-xs text-[#FF7518] uppercase">
                  Lecteur & Ambiance
                </span>
                <div className="flex justify-between items-center py-1 border-b border-[#6A0DAD]/20">
                  <span className="text-[#8C8494]">Lecture / Pause</span>
                  <kbd className="px-2 py-0.5 rounded bg-[#1C0E28] border border-[#6A0DAD] text-[#DFB7FF] font-bold">Espace</kbd>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[#6A0DAD]/20">
                  <span className="text-[#8C8494]">Couper / Rétablir le son</span>
                  <kbd className="px-2 py-0.5 rounded bg-[#1C0E28] border border-[#6A0DAD] text-[#DFB7FF] font-bold">M</kbd>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[#6A0DAD]/20">
                  <span className="text-[#8C8494]">Piste Suivante / Précédente</span>
                  <div className="flex gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-[#1C0E28] border border-[#6A0DAD] text-[#DFB7FF] font-bold">←</kbd>
                    <kbd className="px-1.5 py-0.5 rounded bg-[#1C0E28] border border-[#6A0DAD] text-[#DFB7FF] font-bold">→</kbd>
                  </div>
                </div>
              </div>

              {/* Mini-Jeux & Labyrinthe */}
              <div className="p-3 rounded-xl bg-[#0F0718] border border-[#39FF14]/40 flex flex-col gap-2">
                <span className="font-syne font-bold text-xs text-[#39FF14] uppercase">
                  Jeux & Labyrinthe
                </span>
                <div className="flex justify-between items-center py-1 border-b border-[#6A0DAD]/20">
                  <span className="text-[#8C8494]">Déplacements Labyrinthe</span>
                  <div className="flex gap-1">
                    <kbd className="px-1 py-0.5 rounded bg-[#1C0E28] border border-[#6A0DAD] text-[#39FF14] font-bold">ZQSD</kbd>
                    <span className="text-[#8C8494]">/</span>
                    <kbd className="px-1 py-0.5 rounded bg-[#1C0E28] border border-[#6A0DAD] text-[#39FF14] font-bold">Flèches</kbd>
                  </div>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[#6A0DAD]/20">
                  <span className="text-[#8C8494]">Frappe Requiem (4 pistes)</span>
                  <div className="flex gap-1">
                    <kbd className="px-1 py-0.5 rounded bg-[#1C0E28] border border-[#6A0DAD] text-[#FF7518] font-bold">D</kbd>
                    <kbd className="px-1 py-0.5 rounded bg-[#1C0E28] border border-[#6A0DAD] text-[#A855F7] font-bold">F</kbd>
                    <kbd className="px-1 py-0.5 rounded bg-[#1C0E28] border border-[#6A0DAD] text-[#39FF14] font-bold">J</kbd>
                    <kbd className="px-1 py-0.5 rounded bg-[#1C0E28] border border-[#6A0DAD] text-[#C084FC] font-bold">K</kbd>
                  </div>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[#6A0DAD]/20">
                  <span className="text-[#8C8494]">Orgue de Barbarie (Sanctuaire)</span>
                  <kbd className="px-2 py-0.5 rounded bg-[#1C0E28] border border-[#6A0DAD] text-[#DFB7FF] font-bold">A à K</kbd>
                </div>
              </div>
            </div>
          </VictorianIronworkCard>
        </div>
      )}

      {/* ONGLET 3 : CONFORT VISUEL & ACCESSIBILITÉ */}
      {activeTab === 'comfort' && (
        <div className="flex flex-col gap-3 animate-fadeIn">
          <VictorianIronworkCard highlightGlow="none" className="p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3">
              <Sliders className="w-5 h-5 text-[#06B6D4]" />
              <h3 className="font-syne font-bold text-base text-[#E6E1DC]">
                Préférences Visuelles & Ambiance
              </h3>
            </div>
            <p className="text-xs font-mono text-[#8C8494] mb-4">
              Ajustez l'intensité des effets atmosphériques selon vos préférences et les capacités de votre appareil.
            </p>

            <div className="flex flex-col gap-3">
              {/* Brume Spectrale */}
              <div className="p-3 rounded-xl bg-[#140A1E]/80 border border-[#6A0DAD]/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <span className="font-syne font-bold text-xs text-[#E6E1DC] block">
                    Densité du Brouillard Spectral
                  </span>
                  <span className="text-[10px] font-mono text-[#8C8494]">
                    Régule les particules et nuages de brume en arrière-plan
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {(['faible', 'normal', 'dense'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => handleSetFog(lvl)}
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase transition-all cursor-pointer border ${
                        fogLevel === lvl
                          ? 'bg-[#06B6D4] text-black border-[#67E8F9] shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                          : 'bg-[#0B0612] text-[#8C8494] border-[#6A0DAD]/40 hover:text-[#E6E1DC]'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contraste Gothique Élevé */}
              <div className="p-3 rounded-xl bg-[#140A1E]/80 border border-[#6A0DAD]/40 flex justify-between items-center">
                <div>
                  <span className="font-syne font-bold text-xs text-[#E6E1DC] block">
                    Contraste Renforcé (WCAG)
                  </span>
                  <span className="text-[10px] font-mono text-[#8C8494]">
                    Augmente la netteté des textes et assombrit les fonds
                  </span>
                </div>
                <button
                  onClick={handleToggleContrast}
                  className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer border ${
                    highContrast
                      ? 'bg-[#39FF14] text-black border-[#A5FFA0] shadow-[0_0_10px_rgba(57,255,20,0.4)]'
                      : 'bg-[#0B0612] text-[#8C8494] border-[#6A0DAD]/40'
                  }`}
                >
                  {highContrast ? 'ACTIF' : 'DÉSACTIVÉ'}
                </button>
              </div>

              {/* Réduction de Mouvement */}
              <div className="p-3 rounded-xl bg-[#140A1E]/80 border border-[#6A0DAD]/40 flex justify-between items-center">
                <div>
                  <span className="font-syne font-bold text-xs text-[#E6E1DC] block">
                    Réduction des Mouvements
                  </span>
                  <span className="text-[10px] font-mono text-[#8C8494]">
                    Diminue la fréquence des animations oscillantes
                  </span>
                </div>
                <button
                  onClick={handleToggleMotion}
                  className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer border ${
                    reducedMotion
                      ? 'bg-[#A855F7] text-white border-[#DFB7FF] shadow-[0_0_10px_rgba(168,85,247,0.4)]'
                      : 'bg-[#0B0612] text-[#8C8494] border-[#6A0DAD]/40'
                  }`}
                >
                  {reducedMotion ? 'ACTIF' : 'DÉSACTIVÉ'}
                </button>
              </div>
            </div>
          </VictorianIronworkCard>
        </div>
      )}

      {/* ONGLET 4 : ARCHITECTURE & ARTISTE */}
      {activeTab === 'architecture' && (
        <div className="flex flex-col gap-3 animate-fadeIn">
          {/* Hommage Geoffroy Streit */}
          <VictorianIronworkCard highlightGlow="orange" className="p-4 sm:p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-[#FF7518]/20 border border-[#FF7518]/50 text-[#FF7518]">
                <Feather className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-syne font-bold text-base text-[#E6E1DC]">
                  Geoffroy Streit (Hylst)
                </h3>
                <span className="text-[10px] font-mono text-[#FF7518]">
                  Concepteur, Développeur & Compositeur
                </span>
              </div>
            </div>

            <blockquote className="my-2 p-3 rounded-xl bg-[#0B0612]/75 border-l-4 border-[#FF7518] text-xs sm:text-sm font-serif italic text-[#E6E1DC] leading-relaxed">
              « Je suis concepteur / développeur d'applications, mais également artiste éclectique, bancal et passionné. »
            </blockquote>

            <p className="text-xs font-mono text-[#A89CAE] leading-relaxed mt-2">
              Les morceaux de SpookyBeats ne sont pas de simples générations brutes par intelligence artificielle : il s'agit d'un travail d'orfèvre hybride combinant composition originale, synthèse soustractive, violoncelles spectraux, orgue baroque, montage et masterisation sur station audionumérique (DAW).
            </p>

            <div className="mt-3 pt-2 border-t border-[#6A0DAD]/30 flex flex-wrap justify-between items-center gap-2">
              <span className="text-[10px] font-mono text-[#8C8494]">
                Site officiel & catalogue d'œuvres :
              </span>
              <a
                href="https://hylst.fr"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playEctoClick()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#6A0DAD]/30 hover:bg-[#6A0DAD]/60 border border-[#6A0DAD] text-xs font-mono text-[#DFB7FF] hover:text-white transition-all cursor-pointer"
              >
                <span>hylst.fr</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </VictorianIronworkCard>

          {/* Architecture Technique */}
          <VictorianIronworkCard highlightGlow="none" className="p-4">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#39FF14] block mb-2 font-bold">
              Architecture Technique de l'Expérience
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-[#140A1E]/70 border border-[#6A0DAD]/40">
                <span className="text-[#39FF14] font-bold block mb-1">Moteur Audio Web</span>
                <p className="text-[10px] text-[#8C8494]">
                  Web Audio API avec proxy CORS, analyseur FFT pour visualiseur spectral et moteur d'égalisation biquad 3 bandes.
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-[#140A1E]/70 border border-[#6A0DAD]/40">
                <span className="text-[#FF7518] font-bold block mb-1">Scène 3D Three.js</span>
                <p className="text-[10px] text-[#8C8494]">
                  Rendu WebGL procédural avec système d'éclairage dynamique, ombres douces, brume exponentielle et raycasting de reliques.
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-[#140A1E]/70 border border-[#6A0DAD]/40">
                <span className="text-[#DFB7FF] font-bold block mb-1">Codebase Découplée</span>
                <p className="text-[10px] text-[#8C8494]">
                  Logique pure découplée avec plus de 70 tests unitaires automatisés validés via le runner natif Node.js.
                </p>
              </div>
            </div>
          </VictorianIronworkCard>
        </div>
      )}
    </div>
  );
};
