import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Skull, 
  Volume2, 
  Sparkles, 
  Flame, 
  Music, 
  Mic, 
  Maximize2, 
  X,
  Search,
  SlidersHorizontal,
  BookOpen,
  Shield,
  Swords,
  Shuffle,
  Trophy,
  Award,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Crosshair
} from 'lucide-react';
import { 
  ENRICHED_BESTIARY_CREATURES, 
  BestiaryCreature, 
  BestiaryCategory,
  filterCreaturesByCategory,
  searchCreatures,
  sortCreatures,
  getBestiaryStatsSummary,
  OCCULT_WEAPONS,
  OccultWeaponId,
  simulateOccultDuel,
  OccultDuelResult,
  compareCreatures
} from '../game/bestiaryLogic';
import { playMp3Sfx, stopCurrentMp3Sfx, playEctoClick } from '../audio/sfx';
import { audioEngine, DEFAULT_TRACKS } from '../audio/audioEngine';
import { spectralNarrator, SpectralNarratorState } from '../audio/spectralNarrator';
import { 
  VictorianIronworkCard
} from './GothicDecorations';

export const BestiaireOmbre: React.FC = () => {
  const [creatures] = useState<BestiaryCreature[]>(ENRICHED_BESTIARY_CREATURES);
  const [selectedCreature, setSelectedCreature] = useState<BestiaryCreature>(ENRICHED_BESTIARY_CREATURES[0]);
  const [activePlayingId, setActivePlayingId] = useState<string | null>(null);
  const [narratorState, setNarratorState] = useState<SpectralNarratorState>(spectralNarrator.getState());
  const [inspectCreature, setInspectCreature] = useState<BestiaryCreature | null>(null);
  
  // Filtres et recherche
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<BestiaryCategory>('all');
  const [sortBy, setSortBy] = useState<'danger-desc' | 'danger-asc' | 'name' | 'dread'>('danger-desc');

  // Duel Sépulcral (Simulateur d'Exorcisme)
  const [duelCreature, setDuelCreature] = useState<BestiaryCreature | null>(null);
  const [selectedWeaponId, setSelectedWeaponId] = useState<OccultWeaponId>('argent');
  const [duelResult, setDuelResult] = useState<OccultDuelResult | null>(null);
  const [isStriking, setIsStriking] = useState(false);

  // Face-à-Face Occulte (Comparateur de Monstres)
  const [showComparator, setShowComparator] = useState(false);
  const [comparatorA, setComparatorA] = useState<BestiaryCreature>(ENRICHED_BESTIARY_CREATURES[0]);
  const [comparatorB, setComparatorB] = useState<BestiaryCreature>(
    ENRICHED_BESTIARY_CREATURES.find(c => c.id === 'wendigo') || ENRICHED_BESTIARY_CREATURES[1]
  );

  // Armoire des Reliques Purifiées
  const [showRelicsModal, setShowRelicsModal] = useState(false);
  const [unlockedRelics, setUnlockedRelics] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('spookybeats_bestiary_relics');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const saveRelicReward = (relicName: string) => {
    setUnlockedRelics(prev => {
      if (prev.includes(relicName)) return prev;
      const next = [...prev, relicName];
      try {
        localStorage.setItem('spookybeats_bestiary_relics', JSON.stringify(next));
      } catch (err) {
        console.error('Failed to save relic:', err);
      }
      return next;
    });
  };

  useEffect(() => {
    const unsub = spectralNarrator.subscribe((state) => {
      setNarratorState(state);
    });
    return unsub;
  }, []);

  // Application des filtres et tris
  const filteredByCategory = filterCreaturesByCategory(creatures, selectedCategory);
  const filteredBySearch = searchCreatures(filteredByCategory, searchQuery);
  const displayedCreatures = sortCreatures(filteredBySearch, sortBy);

  const statsSummary = getBestiaryStatsSummary(creatures);

  const handlePlaySound = (creature: BestiaryCreature) => {
    if (activePlayingId === creature.id) {
      stopCurrentMp3Sfx();
      setActivePlayingId(null);
      return;
    }

    setActivePlayingId(creature.id);
    playMp3Sfx(creature.sfxFilename, true, () => {
      setActivePlayingId(null);
    });
  };

  const handleToggleNarrator = (creature: BestiaryCreature) => {
    playEctoClick();
    const narrationText = `${creature.name}. Nom rituel : ${creature.latinName}. Niveau de péril : ${creature.dangerLevel} sur cinq. Habitat : ${creature.habitat}. ${creature.lore} Faiblesse occulte : ${creature.weakness}`;
    spectralNarrator.toggle(narrationText, creature.name);
  };

  const handlePlayTrack = (slug: string) => {
    playEctoClick();
    const track = DEFAULT_TRACKS.find(t => t.slug === slug);
    if (track) {
      audioEngine.playTrack(track);
    }
  };

  const handleRandomEncounter = () => {
    playEctoClick();
    const randomIndex = Math.floor(Math.random() * creatures.length);
    const chosen = creatures[randomIndex];
    setSelectedCreature(chosen);
    setInspectCreature(chosen);
    handlePlaySound(chosen);
  };

  const startDuelWith = (creature: BestiaryCreature) => {
    playEctoClick();
    setDuelCreature(creature);
    setDuelResult(null);
    setIsStriking(false);
  };

  const executeDuelStrike = () => {
    if (!duelCreature) return;
    playEctoClick();
    setIsStriking(true);
    setTimeout(() => {
      const res = simulateOccultDuel(duelCreature, selectedWeaponId);
      setDuelResult(res);
      setIsStriking(false);
      if (res.victory && res.relicUnlocked) {
        saveRelicReward(res.relicUnlocked);
      }
    }, 600);
  };

  const comparison = compareCreatures(comparatorA, comparatorB);

  const categories = [
    { id: 'all' as BestiaryCategory, label: 'Toutes', count: creatures.length, icon: '❖' },
    { id: 'undead' as BestiaryCategory, label: 'Morts-Vivants', count: statsSummary.categoriesCount['undead'] || 0, icon: '💀' },
    { id: 'beasts' as BestiaryCategory, label: 'Bêtes Maudites', count: statsSummary.categoriesCount['beasts'] || 0, icon: '🐺' },
    { id: 'spectres' as BestiaryCategory, label: 'Spectres & Brumes', count: statsSummary.categoriesCount['spectres'] || 0, icon: '👻' },
    { id: 'demons' as BestiaryCategory, label: 'Invocations', count: statsSummary.categoriesCount['demons'] || 0, icon: '👹' },
    { id: 'abyssal' as BestiaryCategory, label: 'Seigneurs Abysses', count: statsSummary.categoriesCount['abyssal'] || 0, icon: '🗿' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* ========================================================= */}
      {/* 1. EN-TÊTE VICTORIEN DU BESTIAIRE                         */}
      {/* ========================================================= */}
      <VictorianIronworkCard
        highlightGlow="purple"
        className="p-5 sm:p-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="p-1 rounded bg-[#241738] text-[#DFB7FF] border border-[#6A0DAD]/60">
                <BookOpen className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#DFB7FF] font-bold">
                Codex Sépulcral • 20 Entités Mythologiques
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#39FF14]/10 text-[#39FF14] border border-[#39FF14]/30 flex items-center gap-1">
                <Trophy className="w-3 h-3" />
                <span>{unlockedRelics.length} / 20 Reliques Purifiées</span>
              </span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black text-white font-gothic tracking-wider">
              Le Grand Bestiaire de l'Ombre
            </h1>
            <p className="text-xs sm:text-sm text-[#C8C2D4] mt-1 max-w-3xl leading-relaxed font-serif">
              Encyclopédie occulte des monstres, lycanthropes, spectres et titans de l'univers d'Hylst. Chaque entité dispose de son cri authentique en haute fidélité, de sa narration spectrale, de son simulateur de duel sépulcral et de son talisman à purifier.
            </p>
          </div>

          {/* Boutons d'Action Rapide de l'En-tête */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Reliques débloquées */}
            <button
              onClick={() => {
                playEctoClick();
                setShowRelicsModal(true);
              }}
              className="px-3.5 py-2.5 rounded-xl bg-[#1A0E2E] hover:bg-[#2A164A] text-[#DFB7FF] font-mono text-xs font-bold border border-[#6A0DAD] flex items-center gap-1.5 transition-all shadow-md active:scale-95"
              title="Consulter les reliques et talismans purifiés"
            >
              <Award className="w-4 h-4 text-[#F59E0B]" />
              <span>Reliques ({unlockedRelics.length})</span>
            </button>

            {/* Comparateur Face-à-Face */}
            <button
              onClick={() => {
                playEctoClick();
                setShowComparator(true);
              }}
              className="px-3.5 py-2.5 rounded-xl bg-[#200B1A] hover:bg-[#34122B] text-[#FB7185] font-mono text-xs font-bold border border-[#F43F5E]/60 flex items-center gap-1.5 transition-all shadow-md active:scale-95"
              title="Comparer deux monstres face-à-face"
            >
              <Swords className="w-4 h-4 text-[#F43F5E]" />
              <span>Face-à-Face</span>
            </button>

            {/* Rencontre Inconnue */}
            <button
              onClick={handleRandomEncounter}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#6A0DAD] to-[#FF7518] hover:from-[#8B22D4] hover:to-[#FF8B38] text-white font-mono text-xs font-bold shadow-[0_0_20px_rgba(255,117,24,0.4)] flex items-center gap-2 border border-[#DFB7FF]/40 transition-transform active:scale-95"
              title="Tirer une créature au sort et entendre son rugissement"
            >
              <Shuffle className="w-4 h-4 animate-spin-slow" />
              <span>Rencontre</span>
            </button>
          </div>
        </div>

        {/* Bannière de narration active */}
        {narratorState.isSpeaking && (
          <div className="mt-4 p-2.5 rounded-xl bg-[#39FF14]/10 border border-[#39FF14]/50 flex items-center justify-between gap-2 text-xs font-mono text-[#39FF14] animate-pulse">
            <div className="flex items-center gap-2 truncate">
              <span className="w-2.5 h-2.5 rounded-full bg-[#39FF14] shrink-0" />
              <span className="truncate">Récit spectral en cours : « {narratorState.currentTitle || 'Entité'} »</span>
            </div>
            <button
              onClick={() => spectralNarrator.stop()}
              className="px-2 py-0.5 rounded bg-black/60 text-[#E6E1DC] hover:text-[#FF7518] border border-[#39FF14]/40 text-[10px] whitespace-nowrap"
            >
              Interrompre
            </button>
          </div>
        )}
      </VictorianIronworkCard>

      {/* ========================================================= */}
      {/* 2. BARRE D'OUTILS : RECHERCHE, ONGLETS & TRI              */}
      {/* ========================================================= */}
      <div className="space-y-3 bg-[#11071F]/90 p-3 sm:p-4 rounded-xl border border-[#6A0DAD]/40 backdrop-blur-md shadow-lg">
        {/* Ligne Recherche et Tri */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Barre de recherche */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#8C8494] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par nom, latin (ex: Cannibalis), faiblesse (ex: feu alchimique), relique..."
              className="w-full pl-9 pr-3 py-2 bg-[#0A0312] border border-[#6A0DAD]/50 rounded-lg text-xs font-mono text-[#E6E1DC] placeholder-[#665D72] focus:border-[#39FF14] focus:outline-none focus:ring-1 focus:ring-[#39FF14]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#8C8494] hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sélecteur de tri */}
          <div className="flex items-center gap-2 shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#DFB7FF]" />
            <span className="text-[11px] font-mono text-[#8C8494] hidden sm:inline">Tri :</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#0A0312] border border-[#6A0DAD]/50 rounded-lg px-2.5 py-1.5 text-xs font-mono text-[#DFB7FF] focus:border-[#39FF14] focus:outline-none"
            >
              <option value="danger-desc">Péril Décroissant (💀 V à I)</option>
              <option value="danger-asc">Péril Croissant (💀 I à V)</option>
              <option value="dread">Terreur & Frissons</option>
              <option value="name">Ordre Alphabétique</option>
            </select>
          </div>
        </div>

        {/* Onglets de Catégories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                playEctoClick();
                setSelectedCategory(cat.id);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 whitespace-nowrap transition-all border ${
                selectedCategory === cat.id
                  ? 'bg-[#6A0DAD] text-white border-[#DFB7FF] shadow-[0_0_12px_rgba(106,13,173,0.6)]'
                  : 'bg-[#0E061A] text-[#8C8494] border-[#6A0DAD]/30 hover:border-[#FF7518] hover:text-[#DFB7FF]'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
              <span className={`text-[10px] px-1 rounded-full ${
                selectedCategory === cat.id ? 'bg-black/40 text-[#DFB7FF]' : 'bg-[#1D112B] text-[#8C8494]'
              }`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Résultat si vide */}
      {displayedCreatures.length === 0 && (
        <div className="p-8 text-center rounded-xl bg-[#0D0517] border border-[#6A0DAD]/40">
          <p className="text-sm font-serif text-[#DFB7FF]">
            Aucune entité n'a répondu à l'appel occulte pour « {searchQuery} ».
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="mt-3 px-3 py-1 text-xs font-mono text-[#FF7518] hover:underline"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. GRILLE DES CARTES DU BESTIAIRE ENRICHI (20 CRÉATURES)  */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {displayedCreatures.map((creature) => {
          const isPlayingThis = activePlayingId === creature.id;
          const isNarratingThis = Boolean(narratorState.isSpeaking && narratorState.currentText?.includes(creature.name));
          const isSelected = selectedCreature.id === creature.id;
          const isRelicPurified = unlockedRelics.includes(creature.relicReward);

          return (
            <div
              key={creature.id}
              onClick={() => {
                playEctoClick();
                setSelectedCreature(creature);
              }}
              className={`rounded-2xl border p-4 sm:p-5 flex flex-col justify-between transition-all duration-200 cursor-pointer relative overflow-hidden group ${
                isSelected
                  ? 'bg-[#180E26] border-[#39FF14] shadow-[0_0_25px_rgba(57,255,20,0.25)]'
                  : 'bg-[#10081C]/90 border-[#6A0DAD]/40 hover:border-[#FF7518] hover:bg-[#150A24]'
              }`}
            >
              {/* Lueur d'ambiance selon la créature */}
              <div 
                className="absolute top-0 right-0 w-36 h-36 rounded-full filter blur-3xl opacity-10 pointer-events-none"
                style={{ backgroundColor: creature.themeColor }}
              />

              <div>
                {/* En-tête de la carte */}
                <div className="flex items-start justify-between pb-2 border-b border-[#6A0DAD]/30 gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">{creature.glyph}</span>
                      <h2 className="text-base sm:text-lg font-bold text-white font-gothic tracking-wide">
                        {creature.name}
                      </h2>
                    </div>
                    <span className="text-[11px] italic font-serif text-[#DFB7FF]">
                      {creature.latinName}
                    </span>
                  </div>

                  {/* Jauge de Péril (Crânes) */}
                  <div className="flex items-center gap-1 bg-[#0A0512] px-2 py-1 rounded-lg border border-[#6A0DAD]/40 shrink-0">
                    <span className="text-[9px] font-mono text-[#8C8494] mr-0.5">Péril</span>
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <span
                        key={idx}
                        className={`text-xs ${
                          idx < creature.dangerLevel ? 'text-[#FF7518]' : 'text-[#3E3447]'
                        }`}
                      >
                        💀
                      </span>
                    ))}
                  </div>
                </div>

                {/* Corps de carte avec illustration et lore */}
                <div className="mt-3.5 flex flex-col sm:flex-row gap-3.5 items-start">
                  {/* Miniature Illustration avec zoom */}
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      playEctoClick();
                      setInspectCreature(creature);
                    }}
                    className="relative w-full sm:w-28 h-40 sm:h-28 shrink-0 rounded-xl overflow-hidden border border-[#6A0DAD]/60 group/img cursor-pointer shadow-md bg-[#08020F]"
                    title="Cliquer pour ouvrir le codex complet et les stats"
                  >
                    <img 
                      src={creature.imageUrl} 
                      alt={creature.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                    
                    {/* Badge catégorie en bas de l'image */}
                    <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/75 text-[9px] font-mono text-[#DFB7FF] border border-[#6A0DAD]/40">
                      {creature.categoryLabel}
                    </div>

                    <div className="absolute top-1 right-1 p-1 rounded-md bg-black/60 text-[#DFB7FF] opacity-0 group-hover/img:opacity-100 transition-opacity">
                      <Maximize2 className="w-3 h-3" />
                    </div>
                  </div>

                  {/* Lore et aperçu des pouvoirs */}
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-mono text-[#DFB7FF] flex items-center gap-1.5 mb-1">
                      <span className="text-[#39FF14]">◆</span>
                      <span className="truncate">{creature.habitat}</span>
                    </div>

                    <p className="text-xs text-[#E6E1DC] font-serif leading-relaxed line-clamp-3 mb-2">
                      {creature.lore}
                    </p>

                    {/* Mini barres de statistiques comparatives */}
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#6A0DAD]/20 text-[10px] font-mono">
                      <div>
                        <div className="flex justify-between text-[#8C8494] mb-0.5">
                          <span>Férocité</span>
                          <span className="text-white">{creature.stats.ferocity}</span>
                        </div>
                        <div className="w-full h-1 bg-[#1C1424] rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#EA580C]" 
                            style={{ width: `${creature.stats.ferocity}%` }} 
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[#8C8494] mb-0.5">
                          <span>Occulte</span>
                          <span className="text-white">{creature.stats.arcane}</span>
                        </div>
                        <div className="w-full h-1 bg-[#1C1424] rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#A855F7]" 
                            style={{ width: `${creature.stats.arcane}%` }} 
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[#8C8494] mb-0.5">
                          <span>Terreur</span>
                          <span className="text-white">{creature.stats.dread}</span>
                        </div>
                        <div className="w-full h-1 bg-[#1C1424] rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#39FF14]" 
                            style={{ width: `${creature.stats.dread}%` }} 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Relique & Talisman */}
                <div className="mt-2.5 px-2.5 py-1.5 rounded-lg bg-[#0B0414] border border-[#6A0DAD]/30 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-[#DFB7FF] flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#FF7518]" /> Relique :
                  </span>
                  <div className="flex items-center gap-1.5 truncate max-w-[220px]">
                    <span className="text-[#E6E1DC] truncate">
                      {creature.relicReward}
                    </span>
                    {isRelicPurified && (
                      <span className="px-1.5 py-0.2 rounded bg-[#39FF14]/20 text-[#39FF14] text-[9px] border border-[#39FF14]/40 shrink-0">
                        Purifiée
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions interactives */}
              <div className="mt-4 pt-3 border-t border-[#6A0DAD]/30 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  {/* Bouton Duel Sépulcral */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startDuelWith(creature);
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-mono text-[11px] font-bold bg-[#33111E] text-[#FB7185] border border-[#F43F5E]/60 hover:bg-[#F43F5E] hover:text-white transition-all shadow-sm"
                    title="Engager un affrontement d'exorcisme contre cette entité"
                  >
                    <Swords className="w-3 h-3" />
                    <span>Duel</span>
                  </button>

                  {/* Bouton Voix Off Spectrale Locale */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleNarrator(creature);
                    }}
                    className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-mono text-[11px] font-bold transition-all border ${
                      isNarratingThis
                        ? 'bg-[#39FF14] text-black border-[#39FF14] shadow-[0_0_12px_#39FF14] animate-pulse'
                        : 'bg-[#1F1333] text-[#DFB7FF] border-[#6A0DAD]/60 hover:border-[#39FF14] hover:text-white'
                    }`}
                    title="Écouter le récit littéraire lu par le narrateur spectral autonome"
                  >
                    <Mic className="w-3 h-3" />
                    <span>{isNarratingThis ? 'Voix...' : 'Récit'}</span>
                  </button>

                  {/* Bouton Cri mp3 réel */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlaySound(creature);
                    }}
                    className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-mono text-[11px] font-bold transition-all border ${
                      isPlayingThis
                        ? 'bg-[#FF7518] text-black border-[#FF7518] shadow-[0_0_12px_#FF7518] animate-pulse'
                        : 'bg-gradient-to-r from-[#FF7518] to-[#9333EA] text-white border-transparent hover:opacity-90'
                    }`}
                    title={`Jouer le cri réel : ${creature.sfxFilename}`}
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>{isPlayingThis ? 'Cri...' : 'Cri'}</span>
                  </button>

                  {/* Bouton Ouvrir le Codex */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playEctoClick();
                      setInspectCreature(creature);
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-mono text-[11px] font-semibold bg-[#160B24] text-[#DFB7FF] hover:bg-[#2B1448] border border-[#6A0DAD]/50 transition-colors"
                    title="Examiner la fiche complète et faiblesses"
                  >
                    <BookOpen className="w-3 h-3" />
                    <span className="hidden sm:inline">Codex</span>
                  </button>
                </div>

                {/* Bouton Musique associée d'Hylst */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayTrack(creature.linkedSlug);
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-mono text-[11px] font-semibold bg-[#241738] text-[#DFB7FF] hover:bg-[#39FF14] hover:text-black border border-[#6A0DAD]/50 transition-colors"
                  title={`Lancer la piste d'Hylst : ${creature.linkedTrackTitle}`}
                >
                  <Music className="w-3 h-3" />
                  <span className="max-w-[95px] truncate">{creature.linkedTrackTitle}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* 4. MODAL DU GRAND CODEX (DOSSIER OCCULTE COMPLET)         */}
      {/* ========================================================= */}
      {inspectCreature && typeof document !== 'undefined' && createPortal(
        <div 
          onClick={() => setInspectCreature(null)}
          className="fixed inset-0 z-[100] w-screen h-screen bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl w-full bg-gradient-to-b from-[#180B2B] via-[#10061E] to-[#0A0413] border-2 border-[#6A0DAD] rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(106,13,173,0.7)] text-[#E6E1DC] my-auto"
          >
            {/* Bouton Fermer */}
            <button
              onClick={() => setInspectCreature(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/70 text-white hover:bg-[#FF7518] transition-colors z-20 border border-[#6A0DAD]"
              aria-label="Fermer le codex"
            >
              <X className="w-5 h-5" />
            </button>

            {/* En-tête du Grimoire */}
            <div className="p-6 border-b border-[#6A0DAD]/40 bg-gradient-to-r from-[#2B104A] to-[#120524] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{inspectCreature.glyph}</span>
                  <span className="text-xs font-mono text-[#39FF14] uppercase tracking-wider font-bold">
                    Dossier d'Observation Occulte • Rang {inspectCreature.categoryLabel}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white font-gothic tracking-wide">
                  {inspectCreature.name}
                </h2>
                <span className="text-sm italic font-serif text-[#DFB7FF]">
                  {inspectCreature.latinName}
                </span>
              </div>

              {/* Indicateur de Danger */}
              <div className="bg-black/60 px-3 py-2 rounded-xl border border-[#FF7518]/50 flex items-center gap-2">
                <span className="text-xs font-mono text-[#8C8494]">Niveau de Péril :</span>
                <div className="flex gap-1 text-base">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <span
                      key={idx}
                      className={idx < inspectCreature.dangerLevel ? 'text-[#FF7518]' : 'text-[#3E3447]'}
                    >
                      💀
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Corps du Codex */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Disposition 2 Colonnes : Image & Lore */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {/* Illustration plein format avec cadre gothique */}
                <div className="relative rounded-xl overflow-hidden border-2 border-[#6A0DAD] shadow-xl bg-black">
                  <img 
                    src={inspectCreature.imageUrl} 
                    alt={inspectCreature.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono">
                    <span className="px-2 py-1 rounded bg-black/80 text-[#39FF14] border border-[#39FF14]/40">
                      Habitat : {inspectCreature.habitat}
                    </span>
                  </div>
                </div>

                {/* Radar / Jauges complètes des 5 statistiques */}
                <div className="space-y-3.5 bg-[#0C0416] p-4 rounded-xl border border-[#6A0DAD]/30">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-[#DFB7FF] flex items-center gap-1.5 font-bold">
                    <Swords className="w-4 h-4 text-[#FF7518]" /> Caractéristiques de Combat Occulte
                  </h3>

                  <div className="space-y-2.5 text-xs font-mono">
                    <div>
                      <div className="flex justify-between text-[#8C8494] mb-1">
                        <span>Férocité & Dégâts</span>
                        <span className="text-white font-bold">{inspectCreature.stats.ferocity} / 100</span>
                      </div>
                      <div className="w-full h-2 bg-[#1C1424] rounded-full overflow-hidden">
                        <div className="h-full bg-[#EA580C]" style={{ width: `${inspectCreature.stats.ferocity}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[#8C8494] mb-1">
                        <span>Résistance & Vitalité</span>
                        <span className="text-white font-bold">{inspectCreature.stats.resilience} / 100</span>
                      </div>
                      <div className="w-full h-2 bg-[#1C1424] rounded-full overflow-hidden">
                        <div className="h-full bg-[#3B82F6]" style={{ width: `${inspectCreature.stats.resilience}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[#8C8494] mb-1">
                        <span>Puissance Arcanique</span>
                        <span className="text-white font-bold">{inspectCreature.stats.arcane} / 100</span>
                      </div>
                      <div className="w-full h-2 bg-[#1C1424] rounded-full overflow-hidden">
                        <div className="h-full bg-[#A855F7]" style={{ width: `${inspectCreature.stats.arcane}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[#8C8494] mb-1">
                        <span>Furtivité Nocturne</span>
                        <span className="text-white font-bold">{inspectCreature.stats.stealth} / 100</span>
                      </div>
                      <div className="w-full h-2 bg-[#1C1424] rounded-full overflow-hidden">
                        <div className="h-full bg-[#64748B]" style={{ width: `${inspectCreature.stats.stealth}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[#8C8494] mb-1">
                        <span>Aura de Terreur</span>
                        <span className="text-[#39FF14] font-bold">{inspectCreature.stats.dread} / 100</span>
                      </div>
                      <div className="w-full h-2 bg-[#1C1424] rounded-full overflow-hidden">
                        <div className="h-full bg-[#39FF14]" style={{ width: `${inspectCreature.stats.dread}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Récit Littéraire & Mythologie */}
              <div className="bg-[#120722] p-4 sm:p-5 rounded-xl border border-[#6A0DAD]/40">
                <h3 className="text-sm font-gothic tracking-wider text-[#DFB7FF] mb-2 flex items-center gap-2">
                  <span>📜</span> Récit des Témoins & Chroniques d'Hylst
                </h3>
                <p className="text-sm font-serif leading-relaxed text-[#E6E1DC]">
                  {inspectCreature.lore}
                </p>
              </div>

              {/* Faiblesses et Pouvoirs (Guide de survie) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Pouvoir Surnaturel */}
                <div className="p-4 rounded-xl bg-[#210D04] border border-[#EA580C]/50 text-xs font-serif">
                  <span className="font-mono text-[11px] text-[#FF7518] uppercase tracking-wider font-bold flex items-center gap-1.5 mb-1.5">
                    <Flame className="w-4 h-4" /> Pouvoir Dominant
                  </span>
                  <p className="text-[#FED7AA] leading-relaxed">
                    {inspectCreature.strength}
                  </p>
                </div>

                {/* Faiblesse Occulte */}
                <div className="p-4 rounded-xl bg-[#08180E] border border-[#39FF14]/50 text-xs font-serif">
                  <span className="font-mono text-[11px] text-[#39FF14] uppercase tracking-wider font-bold flex items-center gap-1.5 mb-1.5">
                    <Shield className="w-4 h-4" /> Faiblesse & Exorcisme
                  </span>
                  <p className="text-[#BBF7D0] leading-relaxed">
                    {inspectCreature.weakness}
                  </p>
                </div>
              </div>
            </div>

            {/* Pied de Grimoire avec Actions Intégrées */}
            <div className="p-4 bg-[#08020E] border-t border-[#6A0DAD]/40 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                {/* Bouton Duel Sépulcral */}
                <button
                  onClick={() => {
                    const c = inspectCreature;
                    setInspectCreature(null);
                    startDuelWith(c);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#4A1525] hover:bg-[#F43F5E] text-white font-mono text-xs font-bold border border-[#F43F5E] transition-all flex items-center gap-2"
                >
                  <Swords className="w-4 h-4" />
                  <span>Affronter en Duel Sépulcral</span>
                </button>

                {/* Voix Off Locale */}
                <button
                  onClick={() => handleToggleNarrator(inspectCreature)}
                  className="px-4 py-2 rounded-xl bg-[#1F1333] hover:bg-[#39FF14] hover:text-black text-[#DFB7FF] font-mono text-xs font-bold border border-[#6A0DAD] transition-all flex items-center gap-2"
                >
                  <Mic className="w-4 h-4" />
                  <span>Voix Off Spectrale</span>
                </button>

                {/* Cri Réel */}
                <button
                  onClick={() => handlePlaySound(inspectCreature)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF7518] to-[#9333EA] hover:opacity-90 text-white font-mono text-xs font-bold transition-all flex items-center gap-2"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Jouer le Cri Réel</span>
                </button>
              </div>

              {/* Lancer la Musique */}
              <button
                onClick={() => {
                  handlePlayTrack(inspectCreature.linkedSlug);
                  setInspectCreature(null);
                }}
                className="px-4 py-2 rounded-xl bg-[#6A0DAD] hover:bg-[#8B22D4] text-white font-mono text-xs font-bold border border-[#DFB7FF]/40 transition-all flex items-center gap-2"
              >
                <Music className="w-4 h-4" />
                <span>Thème : {inspectCreature.linkedTrackTitle}</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ========================================================= */}
      {/* 5. MODAL DE DUEL SÉPULCRAL (SIMULATEUR D'EXORCISME)        */}
      {/* ========================================================= */}
      {duelCreature && typeof document !== 'undefined' && createPortal(
        <div 
          onClick={() => setDuelCreature(null)}
          className="fixed inset-0 z-[110] w-screen h-screen bg-black/92 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl w-full bg-gradient-to-b from-[#1C0A24] via-[#100518] to-[#08020D] border-2 border-[#F43F5E] rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(244,63,94,0.5)] text-[#E6E1DC] my-auto"
          >
            {/* Bouton Fermer */}
            <button
              onClick={() => setDuelCreature(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/70 text-white hover:bg-[#F43F5E] transition-colors z-20 border border-[#6A0DAD]"
              aria-label="Quitter le duel"
            >
              <X className="w-5 h-5" />
            </button>

            {/* En-tête de l'arène */}
            <div className="p-5 border-b border-[#F43F5E]/40 bg-gradient-to-r from-[#380D21] to-[#17051F]">
              <div className="flex items-center gap-2 mb-1">
                <Swords className="w-5 h-5 text-[#F43F5E] animate-pulse" />
                <span className="text-xs font-mono text-[#F43F5E] uppercase tracking-wider font-bold">
                  Arène des Brumes • Exorcisme Sépulcral
                </span>
              </div>
              <h2 className="text-2xl font-black text-white font-gothic tracking-wide">
                Affrontement : {duelCreature.name}
              </h2>
              <p className="text-xs font-serif text-[#DFB7FF] mt-0.5">
                Choisissez une arme consacrée adaptée à la faille occulte de l'entité pour maximiser les dégâts de purification.
              </p>
            </div>

            {/* Corps du duel */}
            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Carte de la créature adverse */}
              <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#12051C] border border-[#6A0DAD]/50">
                <img 
                  src={duelCreature.imageUrl} 
                  alt={duelCreature.name}
                  className="w-16 h-16 rounded-lg object-cover border border-[#F43F5E]"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold font-gothic text-white text-base truncate">{duelCreature.name}</h3>
                    <div className="flex items-center gap-0.5 text-xs text-[#FF7518]">
                      {Array.from({ length: duelCreature.dangerLevel }).map((_, i) => (
                        <span key={i}>💀</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs font-serif text-[#DFB7FF] truncate">
                    Faille : {duelCreature.weakness}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5 text-[10px] font-mono text-[#8C8494]">
                    <span>Férocité : <b className="text-white">{duelCreature.stats.ferocity}</b></span>
                    <span>Résilience : <b className="text-white">{duelCreature.stats.resilience}</b></span>
                    <span>Terreur : <b className="text-[#39FF14]">{duelCreature.stats.dread}</b></span>
                  </div>
                </div>
              </div>

              {/* Sélection de l'arme consacrée */}
              <div>
                <label className="block text-xs font-mono uppercase text-[#DFB7FF] font-bold mb-2">
                  1. Sélection de votre Relique Sacrée :
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {OCCULT_WEAPONS.map((weapon) => {
                    const isSelected = selectedWeaponId === weapon.id;
                    const isEffective = weapon.strongAgainstCategories.includes(duelCreature.category) ||
                      weapon.bonusCreatures.includes(duelCreature.id);

                    return (
                      <div
                        key={weapon.id}
                        onClick={() => {
                          playEctoClick();
                          setSelectedWeaponId(weapon.id);
                        }}
                        className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#2E0B20] border-[#F43F5E] shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                            : 'bg-[#0A0314] border-[#6A0DAD]/40 hover:border-[#DFB7FF]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                            <span className="text-base">{weapon.icon}</span>
                            <span>{weapon.name}</span>
                          </span>
                          {isEffective && (
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#39FF14]/20 text-[#39FF14] border border-[#39FF14]/40 font-bold">
                              Efficace
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-[#A69EAF] font-serif line-clamp-2">
                          {weapon.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Résultat du combat */}
              {duelResult && (
                <div className={`p-4 rounded-xl border animate-fadeIn ${
                  duelResult.victory
                    ? 'bg-[#062414] border-[#39FF14] text-[#BBF7D0]'
                    : 'bg-[#2E0B14] border-[#F43F5E] text-[#FECDD3]'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {duelResult.victory ? (
                        <CheckCircle2 className="w-5 h-5 text-[#39FF14]" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-[#F43F5E]" />
                      )}
                      <h4 className="font-gothic font-bold text-lg text-white">
                        {duelResult.victory ? 'Victoire et Purification !' : 'Riposte Meurtrière !'}
                      </h4>
                    </div>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-black/50 text-[#DFB7FF]">
                      +{duelResult.scoreBonus} pts
                    </span>
                  </div>

                  <div className="space-y-1 text-xs font-serif leading-relaxed mb-3">
                    {duelResult.combatLog.map((line, idx) => (
                      <p key={idx} className="flex items-start gap-1.5">
                        <span className="text-[#DFB7FF]">▸</span>
                        <span>{line}</span>
                      </p>
                    ))}
                  </div>

                  {duelResult.victory && duelResult.relicUnlocked && (
                    <div className="mt-2 p-2.5 rounded-lg bg-black/60 border border-[#F59E0B]/60 flex items-center gap-2 text-xs font-mono text-[#FDE68A]">
                      <Trophy className="w-4 h-4 text-[#F59E0B] shrink-0" />
                      <span>Relique gravée dans votre collection : <b>{duelResult.relicUnlocked}</b></span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Pied du duel */}
            <div className="p-4 bg-[#08020E] border-t border-[#F43F5E]/40 flex items-center justify-between gap-3">
              <span className="text-xs font-mono text-[#8C8494]">
                Arme : <b className="text-white">{OCCULT_WEAPONS.find(w => w.id === selectedWeaponId)?.name}</b>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDuelCreature(null)}
                  className="px-3 py-2 rounded-xl bg-transparent hover:bg-white/10 text-[#8C8494] hover:text-white font-mono text-xs"
                >
                  Fermer
                </button>
                <button
                  disabled={isStriking}
                  onClick={executeDuelStrike}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F43F5E] to-[#9333EA] hover:from-[#FB7185] hover:to-[#A855F7] text-white font-mono text-xs font-bold transition-all shadow-[0_0_20px_rgba(244,63,94,0.4)] flex items-center gap-2 disabled:opacity-50 active:scale-95"
                >
                  <Zap className={`w-4 h-4 ${isStriking ? 'animate-spin' : ''}`} />
                  <span>{isStriking ? 'Invocation en cours...' : 'Brandir & Exorciser'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ========================================================= */}
      {/* 6. MODAL FACE-À-FACE OCCULTE (COMPARATEUR DE CRÉATURES)   */}
      {/* ========================================================= */}
      {showComparator && typeof document !== 'undefined' && createPortal(
        <div 
          onClick={() => setShowComparator(false)}
          className="fixed inset-0 z-[110] w-screen h-screen bg-black/92 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl w-full bg-gradient-to-b from-[#180A26] via-[#0E0417] to-[#06020A] border-2 border-[#A855F7] rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(168,85,247,0.4)] text-[#E6E1DC] my-auto"
          >
            {/* Bouton Fermer */}
            <button
              onClick={() => setShowComparator(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/70 text-white hover:bg-[#A855F7] transition-colors z-20 border border-[#6A0DAD]"
              aria-label="Fermer le comparateur"
            >
              <X className="w-5 h-5" />
            </button>

            {/* En-tête */}
            <div className="p-5 border-b border-[#A855F7]/40 bg-gradient-to-r from-[#2B0E44] to-[#120521]">
              <div className="flex items-center gap-2 mb-1">
                <Crosshair className="w-5 h-5 text-[#A855F7]" />
                <span className="text-xs font-mono text-[#DFB7FF] uppercase tracking-wider font-bold">
                  Face-à-Face Occulte • Comparateur de Caractéristiques
                </span>
              </div>
              <h2 className="text-2xl font-black text-white font-gothic tracking-wide">
                Affrontement Astral des Ombres
              </h2>
              <p className="text-xs font-serif text-[#C8C2D4] mt-0.5">
                Sélectionnez deux entités du bestiaire pour comparer leurs 5 statistiques de combat et découvrir qui possèderait l'avantage absolu.
              </p>
            </div>

            {/* Sélecteurs des deux monstres */}
            <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Monstre A */}
                <div className="p-3.5 rounded-xl bg-[#140722] border border-[#6A0DAD]/50">
                  <label className="block text-[11px] font-mono text-[#DFB7FF] mb-1 font-bold">
                    Entité Alpha :
                  </label>
                  <select
                    value={comparatorA.id}
                    onChange={(e) => {
                      const found = creatures.find(c => c.id === e.target.value);
                      if (found) setComparatorA(found);
                    }}
                    className="w-full bg-[#08020F] border border-[#6A0DAD]/60 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white focus:border-[#39FF14] focus:outline-none mb-2"
                  >
                    {creatures.map(c => (
                      <option key={c.id} value={c.id}>{c.glyph} {c.name}</option>
                    ))}
                  </select>
                  <div className="flex items-center gap-2.5 mt-2">
                    <img 
                      src={comparatorA.imageUrl} 
                      alt={comparatorA.name}
                      className="w-14 h-14 rounded-lg object-cover border border-[#6A0DAD]"
                    />
                    <div className="text-xs font-mono truncate">
                      <div className="font-bold text-white">{comparatorA.name}</div>
                      <div className="text-[#8C8494]">{comparatorA.categoryLabel}</div>
                      <div className="text-[#FF7518]">Péril : {'💀'.repeat(comparatorA.dangerLevel)}</div>
                    </div>
                  </div>
                </div>

                {/* Monstre B */}
                <div className="p-3.5 rounded-xl bg-[#140722] border border-[#6A0DAD]/50">
                  <label className="block text-[11px] font-mono text-[#DFB7FF] mb-1 font-bold">
                    Entité Bêta :
                  </label>
                  <select
                    value={comparatorB.id}
                    onChange={(e) => {
                      const found = creatures.find(c => c.id === e.target.value);
                      if (found) setComparatorB(found);
                    }}
                    className="w-full bg-[#08020F] border border-[#6A0DAD]/60 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white focus:border-[#39FF14] focus:outline-none mb-2"
                  >
                    {creatures.map(c => (
                      <option key={c.id} value={c.id}>{c.glyph} {c.name}</option>
                    ))}
                  </select>
                  <div className="flex items-center gap-2.5 mt-2">
                    <img 
                      src={comparatorB.imageUrl} 
                      alt={comparatorB.name}
                      className="w-14 h-14 rounded-lg object-cover border border-[#6A0DAD]"
                    />
                    <div className="text-xs font-mono truncate">
                      <div className="font-bold text-white">{comparatorB.name}</div>
                      <div className="text-[#8C8494]">{comparatorB.categoryLabel}</div>
                      <div className="text-[#FF7518]">Péril : {'💀'.repeat(comparatorB.dangerLevel)}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tableau comparatif des caractéristiques */}
              <div className="bg-[#0D0417] p-4 rounded-xl border border-[#6A0DAD]/40 space-y-3">
                <h4 className="text-xs font-mono uppercase text-[#DFB7FF] font-bold">
                  Comparaison directe des 5 attributs :
                </h4>

                {[
                  { label: 'Férocité', key: 'ferocity' as const, aVal: comparatorA.stats.ferocity, bVal: comparatorB.stats.ferocity },
                  { label: 'Résilience', key: 'resilience' as const, aVal: comparatorA.stats.resilience, bVal: comparatorB.stats.resilience },
                  { label: 'Puissance Arcanique', key: 'arcane' as const, aVal: comparatorA.stats.arcane, bVal: comparatorB.stats.arcane },
                  { label: 'Furtivité', key: 'stealth' as const, aVal: comparatorA.stats.stealth, bVal: comparatorB.stats.stealth },
                  { label: 'Aura de Terreur', key: 'dread' as const, aVal: comparatorA.stats.dread, bVal: comparatorB.stats.dread },
                ].map((item) => {
                  const delta = item.aVal - item.bVal;
                  return (
                    <div key={item.key} className="text-xs font-mono">
                      <div className="flex justify-between items-center text-[#8C8494] mb-1">
                        <span className={item.aVal > item.bVal ? 'text-[#39FF14] font-bold' : 'text-white'}>
                          {item.aVal}
                        </span>
                        <span className="text-[#DFB7FF] font-bold">{item.label}</span>
                        <span className={item.bVal > item.aVal ? 'text-[#39FF14] font-bold' : 'text-white'}>
                          {item.bVal}
                        </span>
                      </div>
                      <div className="flex h-2 bg-[#1C1424] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#EA580C] transition-all" 
                          style={{ width: `${(item.aVal / (item.aVal + item.bVal)) * 100}%` }} 
                        />
                        <div 
                          className="h-full bg-[#3B82F6] transition-all" 
                          style={{ width: `${(item.bVal / (item.aVal + item.bVal)) * 100}%` }} 
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Verdict du Comparateur */}
              <div className="p-4 rounded-xl bg-[#1C0D2E] border border-[#A855F7]/60 text-xs font-serif space-y-1.5">
                <div className="flex items-center gap-2 text-sm font-gothic text-white font-bold">
                  <Trophy className="w-4 h-4 text-[#F59E0B]" />
                  <span>Verdict Astral : {comparison.summarySentence}</span>
                </div>
                <p className="text-[#DFB7FF] leading-relaxed">
                  {comparison.tacticalAdvantage}
                </p>
              </div>
            </div>

            {/* Pied */}
            <div className="p-4 bg-[#08020E] border-t border-[#A855F7]/40 flex justify-end">
              <button
                onClick={() => setShowComparator(false)}
                className="px-4 py-2 rounded-xl bg-[#6A0DAD] hover:bg-[#8B22D4] text-white font-mono text-xs font-bold transition-all"
              >
                Fermer l'Arène
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ========================================================= */}
      {/* 7. MODAL DES RELIQUES PURIFIÉES                           */}
      {/* ========================================================= */}
      {showRelicsModal && typeof document !== 'undefined' && createPortal(
        <div 
          onClick={() => setShowRelicsModal(false)}
          className="fixed inset-0 z-[110] w-screen h-screen bg-black/92 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl w-full bg-gradient-to-b from-[#180C26] via-[#0E0617] to-[#07020B] border-2 border-[#F59E0B] rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(245,158,11,0.4)] text-[#E6E1DC] my-auto"
          >
            {/* Bouton Fermer */}
            <button
              onClick={() => setShowRelicsModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/70 text-white hover:bg-[#F59E0B] transition-colors z-20 border border-[#6A0DAD]"
              aria-label="Fermer la chambre des reliques"
            >
              <X className="w-5 h-5" />
            </button>

            {/* En-tête */}
            <div className="p-5 border-b border-[#F59E0B]/40 bg-gradient-to-r from-[#2E1805] to-[#14091C]">
              <div className="flex items-center gap-2 mb-1">
                <Award className="w-5 h-5 text-[#F59E0B]" />
                <span className="text-xs font-mono text-[#F59E0B] uppercase tracking-wider font-bold">
                  Chambre des Reliques • Collection Sépulcrale
                </span>
              </div>
              <h2 className="text-2xl font-black text-white font-gothic tracking-wide">
                Talismans & Bénédictions Mythologiques
              </h2>
              <p className="text-xs font-serif text-[#FDE68A] mt-0.5">
                Chaque victoire en duel contre une créature purifie sa relique et renforce vos pouvoirs dans l'expérience musicale d'Hylst.
              </p>
            </div>

            {/* Liste des 20 Reliques */}
            <div className="p-5 space-y-2.5 max-h-[65vh] overflow-y-auto">
              {creatures.map((creature) => {
                const isPurified = unlockedRelics.includes(creature.relicReward);
                return (
                  <div
                    key={creature.id}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs font-mono transition-all ${
                      isPurified
                        ? 'bg-[#1C1405] border-[#F59E0B] text-[#FEF08A] shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                        : 'bg-[#0A0312] border-[#6A0DAD]/30 text-[#8C8494] opacity-75'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-xl shrink-0">{creature.glyph}</span>
                      <div className="truncate">
                        <div className="font-bold text-white truncate">{creature.name}</div>
                        <div className="text-[11px] text-[#DFB7FF] truncate">{creature.relicReward}</div>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {isPurified ? (
                        <span className="px-2 py-0.5 rounded-full bg-[#39FF14]/20 text-[#39FF14] text-[10px] border border-[#39FF14]/40 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Purifiée
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            setShowRelicsModal(false);
                            startDuelWith(creature);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#2E0B20] text-[#FB7185] border border-[#F43F5E]/60 text-[10px] hover:bg-[#F43F5E] hover:text-white transition-colors"
                        >
                          Défier
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pied */}
            <div className="p-4 bg-[#08020E] border-t border-[#F59E0B]/40 flex justify-between items-center text-xs font-mono">
              <span className="text-[#DFB7FF]">
                Progression : <b>{unlockedRelics.length} / 20</b>
              </span>
              <button
                onClick={() => setShowRelicsModal(false)}
                className="px-4 py-2 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-black font-mono text-xs font-bold transition-all"
              >
                Fermer la Chambre
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
