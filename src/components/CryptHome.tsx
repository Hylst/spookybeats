import { 
  Skull, 
  Sparkles, 
  Flame, 
  Moon, 
  Music, 
  Radio, 
  ChevronRight, 
  Zap, 
  BookOpen, 
  Wand2, 
  Castle, 
  Info,
  Music2,
  Activity,
  Eye,
  Key
} from 'lucide-react';
import { AudioVisualizer } from './AudioVisualizer';
import { 
  GothicSkullCorner, 
  GothicCobwebCorner, 
  HorrorGargoyle, 
  DrippingBloodAccent, 
  CarvedPumpkinIcon, 
  SkeletonBoneDivider,
  VictorianIronworkCard,
  VictorianFiligreeDivider,
  VictorianCornerFlourish,
  CryptHeroArt,
  GothicPortalButton,
  WroughtIronCrest,
  GothicRosaceTracery
} from './GothicDecorations';
import { playDoorCreak, playEvilLaugh, playEctoClick, playGhostHowl, playBatChirp, playGoldenFrenzy } from '../audio/sfx';
import { ScreenId } from './Navigation';
import { TrackMetadata } from '../audio/audioEngine';

interface CryptHomeProps {
  isPlaying: boolean;
  onEnterCrypt: () => void;
  onNavigate: (screen: ScreenId) => void;
  onSelectTrack: (track: TrackMetadata) => void;
  tracks: TrackMetadata[];
  highScore: number;
}

export const CryptHome: React.FC<CryptHomeProps> = ({
  isPlaying,
  onEnterCrypt,
  onNavigate,
  onSelectTrack,
  tracks,
  highScore,
}) => {
  const currentAmbient = tracks[0];
  const lastIncantation = tracks[1] || tracks[0];

  const handleQuickRitual = (type: 'bass' | 'drones' | 'leads') => {
    if (type === 'bass') {
      playDoorCreak();
      if (tracks[10]) onSelectTrack(tracks[10]); // L'Éveil des Lycanthropes
    } else if (type === 'drones') {
      playGhostHowl();
      if (tracks[0]) onSelectTrack(tracks[0]);
    } else {
      playEvilLaugh();
      if (tracks[7]) onSelectTrack(tracks[7]); // Gare aux Sorcières
    }
    onNavigate('lecteur');
  };

  return (
    <div className="flex flex-col gap-5 pb-24 animate-fadeIn">
      {/* Bannière Hero Manoir / Crypte façon Ferronnerie Victorienne */}
      <div className="relative">
        <WroughtIronCrest className="mb-0.5 opacity-70" accentColor="#FF7518" />
        <VictorianIronworkCard highlightGlow="purple" accentColor="#DFB7FF" className="relative overflow-hidden group">
          {/* Illustration cinématique gothique du manoir et de la crypte */}
          <div className="relative h-56 sm:h-64 w-full overflow-hidden rounded-xl">
            <img
              src="/src/assets/images/crypt_manor_hero_banner_1793965923581.jpg"
              alt="Manoir et crypte gothique sous la lune de Samhain"
              className="w-full h-full object-cover object-center scale-100 group-hover:scale-105 transition-transform duration-1000 filter brightness-95 contrast-110"
              onError={(e) => {
                // En cas d'erreur de chargement, basculer sur l'illustration vectorielle
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            {/* Fallback SVG si l'image est indisponible */}
            <div className="absolute inset-0 -z-10">
              <CryptHeroArt className="w-full h-full scale-100 hover:scale-105 transition-transform duration-1000" />
            </div>

            {/* Dégradé atmosphérique profond */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0E0617] via-[#0E0617]/40 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(11,4,18,0.6)_100%)] pointer-events-none" />

            {/* Badges Flottants */}
            <div className="absolute top-3 left-3 right-3 flex justify-between items-center text-[10px] font-mono tracking-widest z-20">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#07030C]/90 text-[#39FF14] border border-[#39FF14]/60 shadow-[0_0_12px_rgba(57,255,20,0.4)] backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#39FF14] animate-ping" />
                CRYPTE ACTIVE
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#07030C]/90 text-[#FF7518] border border-[#FF7518]/60 shadow-[0_0_12px_rgba(255,117,24,0.4)] backdrop-blur-sm">
                <Zap className="w-3 h-3 text-[#FF7518]" />
                138 BPM
              </span>
            </div>

            {/* Titre Gothique Monumental dans le Hero */}
            <div className="absolute bottom-3 left-4 right-4 text-center z-20">
              <h1 className="font-['Cinzel_Decorative','Syne',serif] text-2xl sm:text-3xl font-black text-[#F5F2EB] tracking-wider drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] animate-flicker text-engraved">
                Spooky<span className="text-[#FF7518] text-engraved-gold">Beats</span>
              </h1>
              <p className="text-[10px] sm:text-xs font-mono text-[#DFB7FF] tracking-widest mt-1 opacity-95 uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                ✦ L'Expérience Sonore des Ténèbres • Rituel N°XIII ✦
              </p>
            </div>
          </div>
        </VictorianIronworkCard>
      </div>

      {/* Portail Sépulcral Gothique "ENTRER DANS LA CRYPTE" */}
      <div className="relative">
        <GothicPortalButton
          onClick={() => {
            playDoorCreak();
            onEnterCrypt();
          }}
          subtitle="Invoquer le premier sortilège • The Umbral Descent"
        >
          ENTRER DANS LA CRYPTE
        </GothicPortalButton>
      </div>

      {/* Carte "Ambiance Actuelle" façon Ferronnerie */}
      <VictorianIronworkCard highlightGlow="purple" accentColor="#DFB7FF" className="p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1C1424] border border-[#6A0DAD]/60 flex items-center justify-center text-[#DFB7FF] shadow-inner">
            <Moon className="w-5 h-5 text-[#DFB7FF]" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#8C8494] block">
              Ambiance Actuelle
            </span>
            <span className="font-['Cinzel_Decorative','Syne',serif] font-bold text-xs sm:text-sm text-[#E6E1DC]">
              {currentAmbient.title}
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono text-[#FF7518] font-bold block">
            {currentAmbient.bpm} BPM
          </span>
          <span className="text-[10px] font-mono text-[#8C8494]">
            Tonalité {currentAmbient.key}
          </span>
        </div>
      </VictorianIronworkCard>

      {/* Section "Rituels Soniques Rapides" en coffrage victorien */}
      <VictorianIronworkCard highlightGlow="orange" className="p-3.5 sm:p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-['Cinzel_Decorative','Syne',serif] font-bold text-[#E6E1DC] uppercase tracking-wider">
            <Flame className="w-4 h-4 text-[#FF7518]" />
            <span>Rituels Soniques Rapides</span>
          </div>
          <span className="text-[10px] font-mono text-[#FF7518] px-2 py-0.5 rounded bg-[#FF7518]/15 border border-[#FF7518]/40 font-bold">
            3 INCANTATIONS
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {/* Rituel 1 */}
          <button
            onClick={() => handleQuickRitual('bass')}
            className="relative rounded-xl p-2.5 flex flex-col items-center text-center cursor-pointer group border border-[#6A0DAD]/50 bg-gradient-to-b from-[#1C0F2B] to-[#0D0616] hover:border-[#DFB7FF] transition-all hover:scale-105 shadow-inner"
          >
            <div className="w-9 h-9 rounded-lg bg-[#0A0410] border border-[#6A0DAD]/60 flex items-center justify-center mb-1.5 group-hover:border-[#DFB7FF] transition-colors shadow">
              <Radio className="w-4 h-4 text-[#DFB7FF]" />
            </div>
            <span className="font-['Cinzel_Decorative','Syne',serif] font-bold text-[11px] text-[#E6E1DC] group-hover:text-[#DFB7FF] truncate w-full">
              Vol Nocturne
            </span>
            <span className="text-[9px] font-mono text-[#8C8494] mt-0.5">
              Synth Bass
            </span>
          </button>

          {/* Rituel 2 */}
          <button
            onClick={() => handleQuickRitual('drones')}
            className="relative rounded-xl p-2.5 flex flex-col items-center text-center cursor-pointer group border border-[#FF7518]/50 bg-gradient-to-b from-[#2B1407] to-[#120601] hover:border-[#FF7518] transition-all hover:scale-105 shadow-inner"
          >
            <div className="w-9 h-9 rounded-lg bg-[#0A0410] border border-[#FF7518]/60 flex items-center justify-center mb-1.5 group-hover:border-[#FF7518] transition-colors shadow">
              <Flame className="w-4 h-4 text-[#FF7518]" />
            </div>
            <span className="font-['Cinzel_Decorative','Syne',serif] font-bold text-[11px] text-[#E6E1DC] group-hover:text-[#FF7518] truncate w-full">
              Cire Sombre
            </span>
            <span className="text-[9px] font-mono text-[#8C8494] mt-0.5">
              Drones & Chœurs
            </span>
          </button>

          {/* Rituel 3 */}
          <button
            onClick={() => handleQuickRitual('leads')}
            className="relative rounded-xl p-2.5 flex flex-col items-center text-center cursor-pointer group border border-[#39FF14]/50 bg-gradient-to-b from-[#112415] to-[#051108] hover:border-[#39FF14] transition-all hover:scale-105 shadow-inner"
          >
            <div className="w-9 h-9 rounded-lg bg-[#0A0410] border border-[#39FF14]/60 flex items-center justify-center mb-1.5 group-hover:border-[#39FF14] transition-colors shadow">
              <Zap className="w-4 h-4 text-[#39FF14]" />
            </div>
            <span className="font-['Cinzel_Decorative','Syne',serif] font-bold text-[11px] text-[#E6E1DC] group-hover:text-[#39FF14] truncate w-full">
              Venin Vert
            </span>
            <span className="text-[9px] font-mono text-[#8C8494] mt-0.5">
              Acid Leads
            </span>
          </button>
        </div>
      </VictorianIronworkCard>

      {/* Section "Archives & Sépultures" en coffrage victorien */}
      <VictorianIronworkCard highlightGlow="purple" className="p-3.5 sm:p-4 flex flex-col gap-3">
        <div className="flex items-center gap-2 text-xs font-['Cinzel_Decorative','Syne',serif] font-bold text-[#E6E1DC] uppercase tracking-wider">
          <Music className="w-4 h-4 text-[#39FF14]" />
          <span>Archives & Sépultures</span>
        </div>

        {/* Dernière Incantation */}
        <div
          onClick={() => {
            playEctoClick();
            onSelectTrack(lastIncantation);
            onNavigate('lecteur');
          }}
          className="relative rounded-xl border border-[#6A0DAD]/60 bg-gradient-to-r from-[#170E24] via-[#0E0617] to-[#170E24] p-3 flex items-center justify-between cursor-pointer hover:border-[#39FF14] transition-all shadow-inner group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#0A0412] border border-[#6A0DAD]/60 flex items-center justify-center text-[#DFB7FF] group-hover:text-[#39FF14] transition-colors">
              <Music className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[9px] uppercase font-mono tracking-wider text-[#A69EAF] block">
                Dernière Incantation
              </span>
              <span className="font-['Cinzel_Decorative','Syne',serif] font-bold text-xs text-[#E6E1DC] group-hover:text-[#39FF14] transition-colors">
                {lastIncantation.title}
              </span>
              <span className="text-[10px] text-[#8C8494] block font-mono">
                {lastIncantation.artist} • {lastIncantation.durationFormatted}
              </span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#0A0412] border border-[#39FF14]/40 flex items-center justify-center text-[#39FF14] shadow-[0_0_10px_rgba(57,255,20,0.3)]">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
          </div>
        </div>

        {/* Record Pumpkin Smasher */}
        <div className="rounded-xl border border-[#FF7518]/60 bg-gradient-to-r from-[#221006] via-[#100602] to-[#221006] p-3 flex items-center justify-between shadow-inner">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#0D0401] border border-[#FF7518]/60 flex items-center justify-center text-[#FF7518]">
              <Skull className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[9px] uppercase font-mono tracking-wider text-[#FFB347] block font-semibold">
                Record Écrabouilleur de Citrouilles
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-['Cinzel_Decorative','Syne',serif] font-black text-sm sm:text-base text-[#FF7518] text-engraved-gold">
                  {highScore.toLocaleString()} PTS
                </span>
                <span className="text-[9px] font-mono text-[#DFB7FF]">
                  Rang : Maître Fossoyeur
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              playEvilLaugh();
              onNavigate('massacre');
            }}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#FF7518] to-[#FF9030] hover:brightness-110 text-black font-['Cinzel_Decorative','Syne',serif] text-xs font-black tracking-wider flex items-center gap-1 transition-all shadow-[0_0_12px_rgba(255,117,24,0.45)] cursor-pointer border border-[#FFB060]/50"
          >
            <span>DÉFIER</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </VictorianIronworkCard>

        {/* Portails d'Exploration & Activités de la Crypte : Stèles en pierre sculptée */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          {/* Portail Beat Pad & Studio */}
          <button
            onClick={() => {
              playGoldenFrenzy(true);
              onNavigate('studio');
            }}
            className="relative rounded-xl p-3 flex flex-col items-start text-left border-2 border-[#FF7518]/60 group cursor-pointer overflow-hidden bg-gradient-to-b from-[#241122] via-[#120718] to-[#07020C] hover:scale-[1.03] transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(255,117,24,0.35)]"
          >
            <span className="absolute top-1.5 right-2 text-[8px] text-[#FFB347] font-mono select-none opacity-60">❖</span>
            <div className="flex items-center justify-between w-full mb-1.5">
              <span className="p-1.5 rounded-lg bg-[#30161A] text-[#FF7518] group-hover:scale-110 transition-transform shadow-inner border border-[#FF7518]/40">
                <Music2 className="w-4 h-4" />
              </span>
              <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-[#FF7518]/20 text-[#FF7518] border border-[#FF7518]/50 font-bold">
                DSP
              </span>
            </div>
            <span className="font-['Cinzel_Decorative','Syne',serif] font-bold text-xs text-white group-hover:text-[#FF7518] transition-colors tracking-wide">
              Beat Pad Studio
            </span>
            <span className="text-[10px] text-[#A69EAF] mt-0.5 font-mono">
              Percussions & Égaliseur
            </span>
          </button>

          {/* Portail Requiem Rythme */}
          <button
            onClick={() => {
              playGoldenFrenzy(true);
              onNavigate('massacre');
            }}
            className="relative rounded-xl p-3 flex flex-col items-start text-left border-2 border-[#39FF14]/60 group cursor-pointer overflow-hidden bg-gradient-to-b from-[#142618] via-[#09150C] to-[#040A06] hover:scale-[1.03] transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(57,255,20,0.35)]"
          >
            <span className="absolute top-1.5 right-2 text-[8px] text-[#39FF14] font-mono select-none opacity-60">❖</span>
            <div className="flex items-center justify-between w-full mb-1.5">
              <span className="p-1.5 rounded-lg bg-[#143320] text-[#39FF14] group-hover:scale-110 transition-transform shadow-inner border border-[#39FF14]/40">
                <Activity className="w-4 h-4" />
              </span>
              <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-[#39FF14]/20 text-[#39FF14] border border-[#39FF14]/50 font-bold">
                Jeu
              </span>
            </div>
            <span className="font-['Cinzel_Decorative','Syne',serif] font-bold text-xs text-white group-hover:text-[#39FF14] transition-colors tracking-wide">
              Requiem Rythme
            </span>
            <span className="text-[10px] text-[#A69EAF] mt-0.5 font-mono">
              Notes au tempo d'Hylst
            </span>
          </button>

          {/* Portail Bestiaire de l'Ombre */}
          <button
            onClick={() => {
              playGhostHowl();
              onNavigate('bestiaire');
            }}
            className="relative rounded-xl p-3 flex flex-col items-start text-left border-2 border-[#DFB7FF]/60 group cursor-pointer overflow-hidden bg-gradient-to-b from-[#241334] via-[#120820] to-[#07020E] hover:scale-[1.03] transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(223,183,255,0.35)]"
          >
            <span className="absolute top-1.5 right-2 text-[8px] text-[#DFB7FF] font-mono select-none opacity-60">❖</span>
            <div className="flex items-center justify-between w-full mb-1.5">
              <span className="p-1.5 rounded-lg bg-[#301648] text-[#DFB7FF] group-hover:scale-110 transition-transform shadow-inner border border-[#DFB7FF]/40">
                <Eye className="w-4 h-4" />
              </span>
              <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-[#DFB7FF]/20 text-[#DFB7FF] border border-[#DFB7FF]/50 font-bold">
                Cris MP3
              </span>
            </div>
            <span className="font-['Cinzel_Decorative','Syne',serif] font-bold text-xs text-white group-hover:text-[#DFB7FF] transition-colors tracking-wide">
              Bestiaire Ombres
            </span>
            <span className="text-[10px] text-[#A69EAF] mt-0.5 font-mono">
              20 créatures, duels & cris MP3
            </span>
          </button>

          {/* Portail Énigmes de la Crypte */}
          <button
            onClick={() => {
              playEctoClick();
              onNavigate('enigmes');
            }}
            className="relative rounded-xl p-3 flex flex-col items-start text-left border-2 border-[#FBBF24]/60 group cursor-pointer overflow-hidden bg-gradient-to-b from-[#281C09] via-[#140E04] to-[#080501] hover:scale-[1.03] transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(251,191,36,0.35)]"
          >
            <span className="absolute top-1.5 right-2 text-[8px] text-[#FBBF24] font-mono select-none opacity-60">❖</span>
            <div className="flex items-center justify-between w-full mb-1.5">
              <span className="p-1.5 rounded-lg bg-[#3D2808] text-[#FBBF24] group-hover:scale-110 transition-transform shadow-inner border border-[#FBBF24]/40">
                <Key className="w-4 h-4" />
              </span>
              <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-[#FBBF24]/20 text-[#FBBF24] border border-[#FBBF24]/50 font-bold">
                Grimoire
              </span>
            </div>
            <span className="font-['Cinzel_Decorative','Syne',serif] font-bold text-xs text-white group-hover:text-[#FBBF24] transition-colors tracking-wide">
              Énigmes Crypte
            </span>
            <span className="text-[10px] text-[#A69EAF] mt-0.5 font-mono">
              18 stèles, 5 tomes & reliques
            </span>
          </button>

          {/* Portail Manoir 3D */}
          <button
            onClick={() => {
              playBatChirp(true);
              onNavigate('manoir');
            }}
            className="relative rounded-xl p-3 flex flex-col items-start text-left border-2 border-[#6A0DAD]/70 group cursor-pointer overflow-hidden bg-gradient-to-b from-[#20102E] via-[#0E0616] to-[#06020A] hover:scale-[1.03] transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(106,13,173,0.4)]"
          >
            <GothicCobwebCorner position="top-right" size={38} className="absolute top-0 right-0 opacity-40" />
            <div className="flex items-center justify-between w-full mb-1.5">
              <span className="p-1.5 rounded-lg bg-[#2E1546] text-[#DFB7FF] group-hover:scale-110 transition-transform shadow-inner border border-[#6A0DAD]/50">
                <Castle className="w-4 h-4" />
              </span>
              <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-[#39FF14]/20 text-[#39FF14] border border-[#39FF14]/50 font-bold">
                3D Visite
              </span>
            </div>
            <span className="font-['Cinzel_Decorative','Syne',serif] font-bold text-xs text-white group-hover:text-[#DFB7FF] transition-colors tracking-wide">
              Manoir Hanté 3D
            </span>
            <span className="text-[10px] text-[#A69EAF] mt-0.5 font-mono">
              Visite libre & chauves-souris
            </span>
          </button>

          {/* Portail Grimoire des Légendes */}
          <button
            onClick={() => {
              playDoorCreak(true);
              onNavigate('legendes');
            }}
            className="relative rounded-xl p-3 flex flex-col items-start text-left border-2 border-[#FF7518]/60 group cursor-pointer overflow-hidden bg-gradient-to-b from-[#261208] via-[#120703] to-[#070201] hover:scale-[1.03] transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(255,117,24,0.35)]"
          >
            <span className="absolute top-1.5 right-2 text-[8px] text-[#FF7518] font-mono select-none opacity-60">❖</span>
            <div className="flex items-center justify-between w-full mb-1.5">
              <span className="p-1.5 rounded-lg bg-[#33180B] text-[#FF7518] group-hover:scale-110 transition-transform shadow-inner border border-[#FF7518]/40">
                <BookOpen className="w-4 h-4" />
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-[#8C8494] group-hover:text-[#FF7518] transition-colors" />
            </div>
            <span className="font-['Cinzel_Decorative','Syne',serif] font-bold text-xs text-white group-hover:text-[#FF7518] transition-colors tracking-wide">
              Grimoire Légendes
            </span>
            <span className="text-[10px] text-[#A69EAF] mt-0.5 font-mono">
              Samhain, Jack & Mythes
            </span>
          </button>

          {/* Portail Atelier d'Hylst */}
          <button
            onClick={() => {
              playEctoClick();
              onNavigate('sanctuaire');
            }}
            className="relative rounded-xl p-3 flex flex-col items-start text-left border-2 border-[#39FF14]/60 group cursor-pointer overflow-hidden bg-gradient-to-b from-[#12281A] via-[#08150D] to-[#030A05] hover:scale-[1.03] transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(57,255,20,0.35)]"
          >
            <span className="absolute top-1.5 right-2 text-[8px] text-[#39FF14] font-mono select-none opacity-60">❖</span>
            <div className="flex items-center justify-between w-full mb-1.5">
              <span className="p-1.5 rounded-lg bg-[#1B3624] text-[#39FF14] group-hover:scale-110 transition-transform shadow-inner border border-[#39FF14]/40">
                <Wand2 className="w-4 h-4" />
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-[#8C8494] group-hover:text-[#39FF14] transition-colors" />
            </div>
            <span className="font-['Cinzel_Decorative','Syne',serif] font-bold text-xs text-white group-hover:text-[#39FF14] transition-colors tracking-wide">
              Atelier d'Hylst
            </span>
            <span className="text-[10px] text-[#A69EAF] mt-0.5 font-mono">
              Orgue gothique & 22 SFX MP3
            </span>
          </button>

          {/* Portail Info & Manifeste */}
          <button
            onClick={() => {
              playEctoClick();
              onNavigate('info');
            }}
            className="relative rounded-xl p-3 flex flex-col items-start text-left border-2 border-[#DFB7FF]/50 group cursor-pointer overflow-hidden bg-gradient-to-b from-[#221030] via-[#100618] to-[#07020C] hover:scale-[1.03] transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(223,183,255,0.3)]"
          >
            <span className="absolute top-1.5 right-2 text-[8px] text-[#DFB7FF] font-mono select-none opacity-60">❖</span>
            <div className="flex items-center justify-between w-full mb-1.5">
              <span className="p-1.5 rounded-lg bg-[#2E1442] text-[#DFB7FF] group-hover:scale-110 transition-transform shadow-inner border border-[#DFB7FF]/40">
                <Info className="w-4 h-4" />
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-[#8C8494] group-hover:text-[#FF7518] transition-colors" />
            </div>
            <span className="font-['Cinzel_Decorative','Syne',serif] font-bold text-xs text-white group-hover:text-[#DFB7FF] transition-colors tracking-wide">
              Guide de l'Érudit
            </span>
            <span className="text-[10px] text-[#A69EAF] mt-0.5 font-mono">
              Carte, raccourcis & confort
            </span>
          </button>
        </div>

        {/* Bannière de Paternité Artistique & Citation */}
        <VictorianIronworkCard highlightGlow="orange" className="p-4 text-left">
          <div className="flex items-center gap-2 mb-2">
            <HorrorGargoyle size={24} />
            <span className="text-[11px] uppercase font-mono text-[#FF7518] font-bold tracking-widest">
              Signature & Confection Artistique
            </span>
          </div>
          <p className="text-[11px] text-[#C8C2D4] leading-relaxed mb-2">
            Créateur de l'application et des musiques, création assistée par IA (et non pas générées, car mélange de compositions, effets, assemblages, édition audio en DAW, enregistrements, ...) : <strong className="text-[#39FF14]">Geoffroy Streit alias Hylst</strong>
          </p>
          <VictorianFiligreeDivider className="my-2.5 opacity-60" />
          <p className="text-[11px] italic font-serif text-[#DFB7FF] border-l-2 border-[#FF7518] pl-2.5 opacity-90">
            « Je suis concepteur / développeur d'applications, mais également artiste éclectique, bancal et passionné. »
          </p>
        </VictorianIronworkCard>

      {/* Fréquences Ectoplasmiques & VU-Mètre Sépulcral */}
      <VictorianIronworkCard highlightGlow="purple" className="p-4 relative">
        <AudioVisualizer isPlaying={isPlaying} initialMode="vumeter" height={85} />
      </VictorianIronworkCard>
    </div>
  );
};
