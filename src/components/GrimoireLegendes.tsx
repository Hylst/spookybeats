import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  Flame,
  Moon,
  Sparkles,
  Volume2,
  ChevronDown,
  ChevronUp,
  Ghost,
  Mic,
  Search,
  Bookmark,
  BookmarkCheck,
  Compass,
  CheckCircle2,
  Share2,
  ChevronLeft,
  ChevronRight,
  BookMarked,
  Info,
  Calendar,
  MapPin,
  Leaf,
  Wand2,
  X,
  Play,
  RotateCcw,
} from 'lucide-react';
import { TrackMetadata } from '../audio/audioEngine';
import { playEctoClick, playDoorCreak, playGoldenFrenzy } from '../audio/sfx';
import { spectralNarrator, SpectralNarratorState } from '../audio/spectralNarrator';
import {
  VictorianIronworkCard,
  VictorianFiligreeDivider,
  VictorianCornerFlourish,
} from './GothicDecorations';
import {
  ALL_LEGENDS,
  LEGEND_TOMES,
  LegendItem,
  LegendTomeId,
  LegendCategory,
  filterLegends,
  getLegendById,
  getRandomOracleLegend,
  calculateGrimoireReadingProgress,
} from '../game/legendsLogic';

interface GrimoireLegendesProps {
  tracks: TrackMetadata[];
  isPlaying: boolean;
  onSelectTrack: (track: TrackMetadata) => void;
  currentTrack?: TrackMetadata;
}

export const GrimoireLegendes: React.FC<GrimoireLegendesProps> = ({
  tracks,
  isPlaying,
  onSelectTrack,
  currentTrack,
}) => {
  // Navigation et mode d'affichage
  const [viewMode, setViewMode] = useState<'codex' | 'index'>('codex');
  const [selectedTomeId, setSelectedTomeId] = useState<LegendTomeId | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<LegendCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [bookmarkedOnly, setBookmarkedOnly] = useState<boolean>(false);

  // Légende active en mode Codex
  const [activeLegendId, setActiveLegendId] = useState<string>('samhain');

  // État des légendes lues et des signets (stockage local persistant)
  const [readIds, setReadIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('spookybeats_grimoire_read');
      return saved ? JSON.parse(saved) : ['samhain'];
    } catch {
      return ['samhain'];
    }
  });

  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('spookybeats_grimoire_bookmarks');
      return saved ? JSON.parse(saved) : ['samhain', 'jack-lanterne'];
    } catch {
      return ['samhain', 'jack-lanterne'];
    }
  });

  // Modal / Fenêtre de consultation de l'Oracle de Samhain
  const [oracleResult, setOracleResult] = useState<{ legend: LegendItem; oracleText: string } | null>(null);

  // Narrateur spectral vocal
  const [narratorState, setNarratorState] = useState<SpectralNarratorState>(spectralNarrator.getState());

  useEffect(() => {
    const unsub = spectralNarrator.subscribe((state) => {
      setNarratorState(state);
    });
    return unsub;
  }, []);

  // Marquer la légende active comme lue
  useEffect(() => {
    if (activeLegendId && !readIds.includes(activeLegendId)) {
      const next = [...readIds, activeLegendId];
      setReadIds(next);
      try {
        localStorage.setItem('spookybeats_grimoire_read', JSON.stringify(next));
      } catch {}
    }
  }, [activeLegendId]);

  // Basculer un signet / favori
  const toggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    playEctoClick();
    const next = bookmarkedIds.includes(id)
      ? bookmarkedIds.filter((item) => item !== id)
      : [...bookmarkedIds, id];
    setBookmarkedIds(next);
    try {
      localStorage.setItem('spookybeats_grimoire_bookmarks', JSON.stringify(next));
    } catch {}
  };

  // Progression calculée
  const progress = useMemo(() => {
    return calculateGrimoireReadingProgress(readIds);
  }, [readIds]);

  // Légendes filtrées
  const filteredLegends = useMemo(() => {
    return filterLegends(ALL_LEGENDS, {
      tomeId: selectedTomeId,
      category: selectedCategory,
      searchQuery,
      bookmarkedOnly,
      bookmarkedIds,
    });
  }, [selectedTomeId, selectedCategory, searchQuery, bookmarkedOnly, bookmarkedIds]);

  // Légende affichée en mode Codex
  const activeLegend = useMemo(() => {
    return getLegendById(activeLegendId) || ALL_LEGENDS[0];
  }, [activeLegendId]);

  // Index de la légende active dans la liste filtrée
  const activeIndex = useMemo(() => {
    return filteredLegends.findIndex((l) => l.id === activeLegend.id);
  }, [filteredLegends, activeLegend]);

  // Navigation précédente / suivante en mode Codex
  const handlePrevLegend = () => {
    playEctoClick();
    if (activeIndex > 0) {
      setActiveLegendId(filteredLegends[activeIndex - 1].id);
    } else {
      setActiveLegendId(filteredLegends[filteredLegends.length - 1].id);
    }
  };

  const handleNextLegend = () => {
    playEctoClick();
    if (activeIndex < filteredLegends.length - 1) {
      setActiveLegendId(filteredLegends[activeIndex + 1].id);
    } else {
      setActiveLegendId(filteredLegends[0].id);
    }
  };

  // Jouer la composition musicale associée
  const handlePlayAssociatedTrack = (slug: string) => {
    playDoorCreak(true);
    const track = tracks.find(
      (t) => t.slug === slug || slug.includes(t.slug) || t.slug.includes(slug)
    );
    if (track) {
      onSelectTrack(track);
    }
  };

  // Récit vocal spectral
  const handleToggleNarrator = (legend: LegendItem) => {
    playEctoClick();
    const fullText = `${legend.title}. Origine : ${legend.geographicalOrigin}. Devise latine : ${legend.latinMotto}, ce qui signifie : ${legend.latinTranslation}. ${legend.epigraph} ${legend.fullStory.join(' ')} Rituel traditionnel : ${legend.occultRitual}`;
    spectralNarrator.toggle(fullText, legend.title);
  };

  // Consultation de l'Oracle
  const handleConsultOracle = () => {
    playGoldenFrenzy(true);
    const result = getRandomOracleLegend();
    setOracleResult(result);
  };

  const isCurrentLegendPlaying = currentTrack?.slug === activeLegend.associatedTrackSlug && isPlaying;
  const isNarratingActive = narratorState.isSpeaking && narratorState.currentTitle === activeLegend.title;

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* ============================================================== */}
      {/* BANNIÈRE VICTORIENNE DU CODEX DE SAMHAIN                        */}
      {/* ============================================================== */}
      <VictorianIronworkCard highlightGlow="orange" className="p-5 sm:p-7 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#2B1642] text-[#FF7518] border border-[#FF7518]/50 shadow-[0_0_12px_rgba(255,117,24,0.4)]">
                <BookOpen className="w-5 h-5 animate-pulse" />
              </span>
              <span className="text-[11px] font-mono tracking-widest uppercase text-[#39FF14] font-bold">
                Grand Codex Sépulcral d’Octobre
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#10061E] border border-[#6A0DAD]/60 text-[#DFB7FF] font-mono">
                16 Récits Authentiques
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FF7518] to-[#DFB7FF] tracking-wide">
              Le Grimoire des Légendes d’Halloween
            </h1>

            <p className="text-xs sm:text-sm text-[#C8C2D4] font-serif leading-relaxed italic">
              « Explorez les chroniques sacrées de Samhain, les pactes de Jack à la Lanterne, les chevauchées
              de Sleepy Hollow et la genèse des 19 compositions d’Hylst. Chaque page résonne d’un écho séculaire. »
            </p>
          </div>

          {/* Statut du lecteur & Actions de l'Oracle */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 shrink-0">
            {/* Badge de Progression */}
            <div className="p-3 rounded-xl bg-[#140A20] border border-[#6A0DAD]/60 text-right space-y-1">
              <div className="flex items-center justify-between sm:justify-end gap-2 text-xs font-mono">
                <span className="text-[#A69EAF]">Rang d’Érudit :</span>
                <span className="text-[#39FF14] font-bold">{progress.tier}</span>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-2 text-[11px] font-mono text-[#EADCF8]">
                <span>{progress.readCount} / {progress.total} Chroniques lues</span>
                <span className="text-[#FF7518] font-bold">({progress.percentage}%)</span>
              </div>
            </div>

            {/* Boutons d'Action rapide */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleConsultOracle}
                className="py-2 px-3 rounded-xl bg-gradient-to-r from-[#FF7518] to-[#B34700] hover:from-[#FF8C3A] hover:to-[#CC5200] text-black font-mono font-bold text-xs flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(255,117,24,0.3)] transition-all cursor-pointer hover:scale-102"
                title="Consulter l’Oracle divinatoire du Grimoire"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Oracle de Samhain</span>
              </button>

              <button
                onClick={() => {
                  playEctoClick();
                  setViewMode(viewMode === 'codex' ? 'index' : 'codex');
                }}
                className={`py-2 px-3 rounded-xl border text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'codex'
                    ? 'bg-[#6A0DAD] text-white border-[#DFB7FF] shadow-[0_0_12px_rgba(106,13,173,0.5)]'
                    : 'bg-[#180E26] text-[#DFB7FF] border-[#6A0DAD]/60 hover:bg-[#25133B]'
                }`}
              >
                <BookMarked className="w-3.5 h-3.5" />
                <span>{viewMode === 'codex' ? 'Vue Codex' : 'Vue Index'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Barre de lecture globale */}
        <div className="mt-4 pt-3 border-t border-[#6A0DAD]/30">
          <div className="w-full h-2 rounded-full bg-[#0E0617] border border-[#6A0DAD]/50 overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#6A0DAD] via-[#FF7518] to-[#39FF14] transition-all duration-700 shadow-[0_0_10px_rgba(57,255,20,0.5)]"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        </div>
      </VictorianIronworkCard>

      {/* ============================================================== */}
      {/* SÉLECTEUR DES 5 TOMES DU CODEX                                 */}
      {/* ============================================================== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        <button
          onClick={() => {
            playEctoClick();
            setSelectedTomeId('all');
          }}
          className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
            selectedTomeId === 'all'
              ? 'bg-gradient-to-b from-[#2E1848] to-[#140A20] border-[#FF7518] text-white shadow-[0_0_15px_rgba(255,117,24,0.4)] scale-102 font-bold'
              : 'bg-[#0E0617]/90 border-[#6A0DAD]/40 text-[#C8C2D4] hover:border-[#DFB7FF]'
          }`}
        >
          <span className="text-xl mb-1">📜</span>
          <span className="text-xs font-mono font-bold">Tous les Tomes</span>
          <span className="text-[10px] text-[#A69EAF] font-mono mt-0.5">16 Récits</span>
        </button>

        {LEGEND_TOMES.map((tome) => {
          const isSelected = selectedTomeId === tome.id;
          return (
            <button
              key={tome.id}
              onClick={() => {
                playEctoClick();
                setSelectedTomeId(tome.id);
                // Si la légende active n'appartient pas au tome sélectionné, sélectionner la première
                const inTome = ALL_LEGENDS.filter((l) => l.tomeId === tome.id);
                if (inTome.length > 0 && !inTome.some((l) => l.id === activeLegendId)) {
                  setActiveLegendId(inTome[0].id);
                }
              }}
              className={`p-2.5 rounded-xl border flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-b from-[#2E1848] to-[#140A20] border-[#39FF14] text-white shadow-[0_0_15px_rgba(57,255,20,0.3)] scale-102 font-bold'
                  : 'bg-[#0E0617]/90 border-[#6A0DAD]/40 text-[#C8C2D4] hover:border-[#DFB7FF]'
              }`}
            >
              <span className="text-lg mb-1">{tome.icon}</span>
              <span className="text-[11px] font-mono font-bold line-clamp-1">{tome.title.split(':')[0]}</span>
              <span className="text-[9px] text-[#A69EAF] font-mono mt-0.5">{tome.totalLegends} Légendes</span>
            </button>
          );
        })}
      </div>

      {/* ============================================================== */}
      {/* BARRE D'OUTILS : RECHERCHE & FILTRES RAPIDES                   */}
      {/* ============================================================== */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 rounded-xl bg-[#0D0517] border border-[#6A0DAD]/40 text-xs font-mono">
        {/* Champ de recherche */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#A69EAF] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par mythe, lieu (Irlande, Prague, Sleepy Hollow), latin ou rituel..."
            className="w-full pl-9 pr-8 py-2 rounded-lg bg-[#180E28] border border-[#6A0DAD]/50 text-white placeholder-[#8C8494] text-xs focus:outline-none focus:border-[#39FF14]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#A69EAF] hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filtres par Signets & Catégories */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              playEctoClick();
              setBookmarkedOnly(!bookmarkedOnly);
            }}
            className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 cursor-pointer transition-all ${
              bookmarkedOnly
                ? 'bg-[#FF7518] text-black border-[#FF7518] font-bold shadow-[0_0_10px_rgba(255,117,24,0.4)]'
                : 'bg-[#180E28] text-[#DFB7FF] border-[#6A0DAD]/40 hover:text-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Signets ({bookmarkedIds.length})</span>
          </button>

          <span className="text-[#8C8494] hidden sm:inline">|</span>

          <div className="flex items-center gap-1">
            <span className="text-[#8C8494] text-[10px] hidden sm:inline">Affichage :</span>
            <button
              onClick={() => {
                playEctoClick();
                setViewMode('codex');
              }}
              className={`p-1.5 px-2.5 rounded-lg cursor-pointer ${
                viewMode === 'codex' ? 'bg-[#39FF14] text-black font-bold' : 'text-[#A69EAF] hover:text-white'
              }`}
            >
              Codex
            </button>
            <button
              onClick={() => {
                playEctoClick();
                setViewMode('index');
              }}
              className={`p-1.5 px-2.5 rounded-lg cursor-pointer ${
                viewMode === 'index' ? 'bg-[#39FF14] text-black font-bold' : 'text-[#A69EAF] hover:text-white'
              }`}
            >
              Index
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* VUE 1 : CODEX ENLUMINÉ (PAGES DU MANUSCRIT SÉCULAIRE)          */}
      {/* ============================================================== */}
      {viewMode === 'codex' && (
        <div className="space-y-4">
          {/* Barre de navigation de chronique (Précédent / Sélecteur / Suivant) */}
          <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-[#140A22] border border-[#6A0DAD]/40 text-xs font-mono">
            <button
              onClick={handlePrevLegend}
              className="py-1.5 px-3 rounded-lg bg-[#241738] hover:bg-[#382054] text-[#DFB7FF] hover:text-white flex items-center gap-1 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 text-[#FF7518]" />
              <span className="hidden sm:inline">Chronique Précédente</span>
              <span className="sm:hidden">Préc.</span>
            </button>

            <div className="flex items-center gap-2 text-center">
              <span className="text-[11px] font-bold text-white">
                Chronique No 0{activeLegend.chronicleNumber} / 16
              </span>
              <span className="text-[10px] text-[#A69EAF] hidden md:inline">
                ({activeLegend.categoryLabel})
              </span>
            </div>

            <button
              onClick={handleNextLegend}
              className="py-1.5 px-3 rounded-lg bg-[#241738] hover:bg-[#382054] text-[#DFB7FF] hover:text-white flex items-center gap-1 transition-all cursor-pointer"
            >
              <span className="hidden sm:inline">Chronique Suivante</span>
              <span className="sm:hidden">Suiv.</span>
              <ChevronRight className="w-4 h-4 text-[#39FF14]" />
            </button>
          </div>

          {/* Grand Parchemin du Codex */}
          <VictorianIronworkCard highlightGlow="purple" className="p-5 sm:p-8 space-y-6 relative overflow-hidden">
            {/* Coins ornementaux */}
            <VictorianCornerFlourish position="top-left" size={32} />
            <VictorianCornerFlourish position="top-right" size={32} />
            <VictorianCornerFlourish position="bottom-left" size={32} />
            <VictorianCornerFlourish position="bottom-right" size={32} />

            {/* En-tête de la chronique */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-[#6A0DAD]/40">
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-mono uppercase text-[#39FF14] tracking-widest font-bold bg-[#39FF14]/10 px-2.5 py-0.5 rounded border border-[#39FF14]/30">
                    Chronique 0{activeLegend.chronicleNumber} • {activeLegend.categoryLabel}
                  </span>
                  <span className="text-[10px] font-mono text-[#DFB7FF] flex items-center gap-1 bg-[#180E28] px-2 py-0.5 rounded border border-[#6A0DAD]/40">
                    <Calendar className="w-3 h-3 text-[#FF7518]" />
                    {activeLegend.historicalPeriod}
                  </span>
                  <span className="text-[10px] font-mono text-[#A69EAF] flex items-center gap-1 bg-[#180E28] px-2 py-0.5 rounded border border-[#6A0DAD]/40">
                    <MapPin className="w-3 h-3 text-[#39FF14]" />
                    {activeLegend.geographicalOrigin}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-black text-white tracking-wide mt-2">
                  {activeLegend.title}
                </h2>

                <p className="text-xs sm:text-sm text-[#FF7518] font-serif italic">
                  « {activeLegend.latinMotto} »
                  <span className="text-[#A69EAF] text-xs not-italic ml-1">
                    ({activeLegend.latinTranslation})
                  </span>
                </p>
              </div>

              {/* Actions de signet & lecture vocale */}
              <div className="flex items-center gap-2 self-start md:self-auto">
                <button
                  onClick={(e) => toggleBookmark(activeLegend.id, e)}
                  className={`p-2 rounded-xl border transition-all cursor-pointer ${
                    bookmarkedIds.includes(activeLegend.id)
                      ? 'bg-[#FF7518] text-black border-[#FF7518] shadow-[0_0_12px_rgba(255,117,24,0.5)]'
                      : 'bg-[#180E28] text-[#A69EAF] border-[#6A0DAD]/60 hover:text-white'
                  }`}
                  title={bookmarkedIds.includes(activeLegend.id) ? 'Retirer le signet' : 'Poser un signet sur cette légende'}
                >
                  <Bookmark className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleToggleNarrator(activeLegend)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-mono text-xs font-bold border transition-all cursor-pointer ${
                    isNarratingActive
                      ? 'bg-[#39FF14] text-black border-[#39FF14] shadow-[0_0_15px_#39FF14] animate-pulse'
                      : 'bg-[#1C1424] text-[#DFB7FF] border-[#6A0DAD]/60 hover:border-[#39FF14] hover:text-white'
                  }`}
                  title="Écouter le récit complet en diction sépulcrale"
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>{isNarratingActive ? 'Récit en cours...' : 'Récit Vocal'}</span>
                </button>
              </div>
            </div>

            {/* Illustration enluminée si disponible */}
            {activeLegend.imagePath && (
              <div className="relative rounded-2xl overflow-hidden border-2 border-[#6A0DAD]/60 shadow-[0_0_30px_rgba(0,0,0,0.8)] group">
                <img
                  src={activeLegend.imagePath}
                  alt={activeLegend.title}
                  className="w-full aspect-[16/9] object-cover rounded-xl transition-transform duration-700 group-hover:scale-102"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs font-mono text-[#DFB7FF]">
                  <span className="italic font-serif text-[11px] text-[#FF7518] bg-black/70 px-2.5 py-1 rounded-md border border-[#FF7518]/40">
                    Enluminure de la Crypte • {activeLegend.subtitle}
                  </span>
                  <span className="text-[10px] text-[#39FF14] bg-black/70 px-2 py-0.5 rounded border border-[#39FF14]/30 hidden sm:inline">
                    ✦ Archives Sacrées d’Hylst ✦
                  </span>
                </div>
              </div>
            )}

            {/* Épigraphe littéraire */}
            <div className="p-4 rounded-xl bg-[#0C0614] border-l-4 border-[#FF7518] text-xs sm:text-sm italic text-[#EADCF8] font-serif leading-relaxed shadow-inner">
              « {activeLegend.epigraph} »
            </div>

            {/* Corps du récit en prose avec lettrine gothique */}
            <div className="space-y-4 text-xs sm:text-sm text-[#DDD5C7] leading-relaxed font-serif">
              {activeLegend.fullStory.map((paragraph, index) => {
                if (index === 0) {
                  const firstChar = paragraph.charAt(0);
                  const remainder = paragraph.slice(1);
                  return (
                    <p key={index} className="text-justify leading-relaxed">
                      <span className="float-left text-4xl sm:text-5xl font-serif font-black text-[#FF7518] leading-none pr-3 pt-1 select-none font-mono drop-shadow-[0_0_10px_rgba(255,117,24,0.6)]">
                        {firstChar}
                      </span>
                      {remainder}
                    </p>
                  );
                }
                return (
                  <p key={index} className="text-justify indent-4 leading-relaxed">
                    {paragraph}
                  </p>
                );
              })}
            </div>

            <VictorianFiligreeDivider />

            {/* Encadrés Mystiques : Rituel occulte & Herboristerie */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {/* Rituel Folklorique */}
              <div className="p-4 rounded-xl bg-[#150A24] border border-[#39FF14]/40 space-y-1.5 shadow-sm">
                <div className="flex items-center gap-2 text-[#39FF14] text-xs font-mono font-bold uppercase tracking-wider">
                  <Wand2 className="w-4 h-4" />
                  <span>Rituel de Préservation & Coutume :</span>
                </div>
                <p className="text-xs text-[#EADCF8] font-serif leading-relaxed">
                  {activeLegend.occultRitual}
                </p>
              </div>

              {/* Herboristerie & Talismans */}
              <div className="p-4 rounded-xl bg-[#150A24] border border-[#FF7518]/40 space-y-1.5 shadow-sm">
                <div className="flex items-center gap-2 text-[#FF7518] text-xs font-mono font-bold uppercase tracking-wider">
                  <Leaf className="w-4 h-4" />
                  <span>Herbes Rituelles & Talismans :</span>
                </div>
                <p className="text-xs text-[#EADCF8] font-serif leading-relaxed">
                  {activeLegend.botanicalPreservation}
                </p>
              </div>
            </div>

            {/* Passerelle Musicale vers la piste d'Hylst */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-[#1B0D30] via-[#10061E] to-[#1B0D30] border border-[#6A0DAD]/60 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-left w-full sm:w-auto">
                <span className="text-[10px] uppercase font-mono text-[#A69EAF] block">
                  Évocation Sonore de la Chronique :
                </span>
                <span className="text-sm font-bold text-white font-mono flex items-center gap-2">
                  <span className="text-[#39FF14]">✦</span>
                  <span>{activeLegend.associatedTrackTitle}</span>
                  {isCurrentLegendPlaying && (
                    <span className="text-[10px] text-[#39FF14] font-mono animate-pulse">
                      (En cours d'écoute...)
                    </span>
                  )}
                </span>
              </div>

              <button
                onClick={() => handlePlayAssociatedTrack(activeLegend.associatedTrackSlug)}
                className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isCurrentLegendPlaying
                    ? 'bg-[#39FF14] text-black shadow-[0_0_15px_#39FF14]'
                    : 'bg-gradient-to-r from-[#6A0DAD] to-[#FF7518] hover:from-[#7E12D0] hover:to-[#FF8833] text-white shadow-[0_0_15px_rgba(255,117,24,0.3)] hover:scale-102'
                }`}
              >
                <Volume2 className="w-4 h-4" />
                <span>{isCurrentLegendPlaying ? 'Musique Active' : 'Invoquer la Musique'}</span>
              </button>
            </div>
          </VictorianIronworkCard>
        </div>
      )}

      {/* ============================================================== */}
      {/* VUE 2 : INDEX DES PARCHEMINS (GRILLE GLOBALE)                  */}
      {/* ============================================================== */}
      {viewMode === 'index' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-[#C8C2D4] px-1">
            <span>Parchemins découverts ({filteredLegends.length}) :</span>
            <span className="text-[10px] text-[#A69EAF]">Cliquez pour ouvrir la chronique dans le Codex</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLegends.map((legend) => {
              const isRead = readIds.includes(legend.id);
              const isBookmarked = bookmarkedIds.includes(legend.id);
              const isCurrent = activeLegendId === legend.id;

              return (
                <div
                  key={legend.id}
                  onClick={() => {
                    playEctoClick();
                    setActiveLegendId(legend.id);
                    setViewMode('codex');
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between gap-3 group ${
                    isCurrent
                      ? 'bg-gradient-to-b from-[#24133A] to-[#12081E] border-[#39FF14] shadow-[0_0_20px_rgba(57,255,20,0.25)]'
                      : 'bg-[#11071B]/90 border-[#6A0DAD]/40 hover:border-[#FF7518] hover:bg-[#1A0E2A]'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-[#39FF14] uppercase tracking-wider font-bold">
                        Chronique 0{legend.chronicleNumber}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {isRead && (
                          <span className="text-[9px] font-mono text-[#39FF14] bg-[#39FF14]/10 px-1.5 py-0.5 rounded border border-[#39FF14]/30">
                            Lu ✓
                          </span>
                        )}
                        <button
                          onClick={(e) => toggleBookmark(legend.id, e)}
                          className={`p-1 rounded-md text-xs transition-colors ${
                            isBookmarked ? 'text-[#FF7518]' : 'text-[#8C8494] hover:text-white'
                          }`}
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h3 className="font-serif font-black text-base text-white group-hover:text-[#FF7518] transition-colors line-clamp-1">
                      {legend.title}
                    </h3>

                    <p className="text-xs text-[#A69EAF] font-serif italic line-clamp-2">
                      « {legend.epigraph} »
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#6A0DAD]/30 flex items-center justify-between text-[10px] font-mono text-[#DFB7FF]">
                    <span className="truncate max-w-[150px]">{legend.geographicalOrigin}</span>
                    <span className="text-[#39FF14] group-hover:translate-x-1 transition-transform">
                      Feuilleter →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL ORACULAIRE DE SAMHAIN                                    */}
      {/* ============================================================== */}
      {oracleResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-2xl bg-gradient-to-b from-[#1C0E2D] to-[#0E0518] border-2 border-[#FF7518] shadow-[0_0_40px_rgba(255,117,24,0.4)] p-6 text-[#EADCF8] space-y-4">
            <button
              onClick={() => {
                playEctoClick();
                setOracleResult(null);
              }}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-[#25133B] text-[#A69EAF] hover:text-white border border-[#6A0DAD]/40 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-xs font-mono text-[#39FF14] uppercase tracking-widest font-bold">
              <Sparkles className="w-4 h-4 text-[#FF7518]" />
              <span>Présage de l’Oracle de Samhain</span>
            </div>

            <h3 className="text-xl font-serif font-black text-white">
              {oracleResult.legend.title}
            </h3>

            <div className="p-4 rounded-xl bg-[#090310] border border-[#FF7518]/50 text-xs sm:text-sm font-serif italic text-white leading-relaxed">
              « {oracleResult.oracleText} »
            </div>

            <div className="flex flex-wrap gap-1.5">
              {oracleResult.legend.divinationKeywords.map((kw, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#2A1640] border border-[#DFB7FF]/40 text-[#DFB7FF]"
                >
                  #{kw}
                </span>
              ))}
            </div>

            <div className="pt-2 flex items-center justify-between gap-2 border-t border-[#6A0DAD]/40">
              <button
                onClick={() => {
                  playEctoClick();
                  setActiveLegendId(oracleResult.legend.id);
                  setViewMode('codex');
                  setOracleResult(null);
                }}
                className="py-2 px-3 rounded-lg bg-[#39FF14] text-black text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer hover:bg-[#52FF33] transition-all"
              >
                <span>Lire cette Chronique dans le Codex</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleConsultOracle}
                className="py-2 px-3 rounded-lg bg-[#241738] text-white text-xs font-mono hover:bg-[#341F52] cursor-pointer"
              >
                Autre Présage
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* NOTE FINALE & ÉPILOGUE D’HYLST                                 */}
      {/* ============================================================== */}
      <footer className="p-4 rounded-xl bg-[#120A1E] border border-[#6A0DAD]/30 text-center text-xs text-[#A69EAF] space-y-1">
        <p className="font-serif italic text-[#DFB7FF]">
          « Les mythes d'Halloween ne sont pas de simples fables d'effroi : ils constituent la mémoire vive de nos veillées, où la lumière n'a de sens que face à l'ombre. »
        </p>
        <p className="font-mono text-[10px] text-[#FF7518]">
          Compilé & enluminé avec déférence pour l'expérience sonore SpookyBeats par Geoffroy Streit (Hylst)
        </p>
      </footer>
    </div>
  );
};
