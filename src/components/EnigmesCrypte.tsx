import React, { useState, useEffect, useMemo } from 'react';
import { 
  Key, 
  Lock, 
  Unlock, 
  Sparkles, 
  Trophy, 
  CheckCircle2, 
  AlertCircle,
  RotateCcw,
  BookOpen,
  Mic,
  Search,
  HelpCircle,
  Flame,
  Volume2,
  ChevronRight,
  Eye,
  RefreshCw,
  Compass,
  X,
  Play,
  Pause,
  Award,
} from 'lucide-react';
import { 
  playEctoClick, 
  playGoldenFrenzy, 
  playTrapExplosion, 
  playDoorCreak, 
  playMp3Sfx 
} from '../audio/sfx';
import { spectralNarrator, SpectralNarratorState } from '../audio/spectralNarrator';
import { 
  VictorianIronworkCard, 
  VictorianFiligreeDivider, 
  VictorianCornerFlourish 
} from './GothicDecorations';
import { TarotDestinModal } from './TarotDestinModal';
import {
  ALL_ENIGMAS,
  ENIGMA_TOMES,
  ALCHEMICAL_RUNES,
  EnigmaItem,
  EnigmaTomeId,
  EnigmaDifficulty,
  OccultRelic,
  filterEnigmas,
  verifyEnigmaAnswer,
  calculateGrimoireProgression,
  getRandomUnsolvedEnigma,
} from '../game/enigmasLogic';
import { TrackMetadata } from '../audio/audioEngine';

interface EnigmesCrypteProps {
  tracks?: TrackMetadata[];
  currentTrack?: TrackMetadata;
  isPlaying?: boolean;
  onSelectTrack?: (track: TrackMetadata) => void;
}

export const EnigmesCrypte: React.FC<EnigmesCrypteProps> = ({
  tracks = [],
  currentTrack,
  isPlaying = false,
  onSelectTrack,
}) => {
  // Sauvegarde persistante des énigmes résolues
  const [solvedIds, setSolvedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('spookybeats_unlocked_secrets');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Filtres et navigation
  const [selectedTomeId, setSelectedTomeId] = useState<EnigmaTomeId | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<EnigmaDifficulty | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'unsolved' | 'solved'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Énigme sélectionnée
  const [activeEnigmaId, setActiveEnigmaId] = useState<string>(ALL_ENIGMAS[0].id);

  // Réponses utilisateur selon le type d'énigme
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [selectedRunes, setSelectedRunes] = useState<string[]>([]);
  const [anagramInput, setAnagramInput] = useState<string>('');

  // Indices dévoilés (par énigme)
  const [revealedHints, setRevealedHints] = useState<Record<string, { subtle: boolean; deep: boolean }>>({});

  // Message de retour (succès / échec)
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  // Relique en cours d'inspection
  const [inspectedRelic, setInspectedRelic] = useState<OccultRelic | null>(null);

  // Affichage du Grand Reliquaire
  const [showReliquaryView, setShowReliquaryView] = useState<boolean>(false);

  // Affichage du Tirage de Tarot Funeste
  const [showTarotModal, setShowTarotModal] = useState<boolean>(false);
  const [tarotDestinyNotice, setTarotDestinyNotice] = useState<string | null>(null);

  // État du narrateur vocal spectral
  const [narratorState, setNarratorState] = useState<SpectralNarratorState>(spectralNarrator.getState());

  useEffect(() => {
    const unsub = spectralNarrator.subscribe((state) => {
      setNarratorState(state);
    });
    return unsub;
  }, []);

  // Progression calculée
  const progression = useMemo(() => {
    return calculateGrimoireProgression(solvedIds, ALL_ENIGMAS);
  }, [solvedIds]);

  // Énigmes filtrées
  const filteredEnigmas = useMemo(() => {
    return filterEnigmas(ALL_ENIGMAS, {
      tomeId: selectedTomeId,
      difficulty: selectedDifficulty,
      status: selectedStatus,
      solvedIds,
      searchQuery,
    });
  }, [selectedTomeId, selectedDifficulty, selectedStatus, solvedIds, searchQuery]);

  // Énigme active
  const activeEnigma = useMemo(() => {
    return ALL_ENIGMAS.find((e) => e.id === activeEnigmaId) || ALL_ENIGMAS[0];
  }, [activeEnigmaId]);

  const isAlreadySolved = solvedIds.includes(activeEnigma.id);

  // Réinitialiser les inputs lors du changement d'énigme
  const handleSelectEnigma = (enigmaId: string) => {
    playEctoClick();
    setActiveEnigmaId(enigmaId);
    setSelectedOption(null);
    setSelectedRunes([]);
    setAnagramInput('');
    setFeedback(null);
  };

  // Gestion des runes alchimiques (Type Sceau Runique)
  const handleToggleRune = (runeId: string) => {
    playEctoClick();
    if (selectedRunes.includes(runeId)) {
      setSelectedRunes(selectedRunes.filter((r) => r !== runeId));
    } else {
      if (selectedRunes.length < 3) {
        setSelectedRunes([...selectedRunes, runeId]);
      }
    }
  };

  const handleClearRunes = () => {
    playEctoClick();
    setSelectedRunes([]);
  };

  // Validation de la réponse
  const handleValidate = () => {
    let answer: number | string | string[] | null = null;

    if (activeEnigma.type === 'choix_multiple') {
      if (selectedOption === null) return;
      answer = selectedOption;
    } else if (activeEnigma.type === 'sceau_runique') {
      if (selectedRunes.length !== 3) return;
      answer = selectedRunes;
    } else if (activeEnigma.type === 'anagramme_occulte') {
      if (!anagramInput.trim()) return;
      answer = anagramInput;
    }

    if (answer === null) return;

    const verification = verifyEnigmaAnswer(activeEnigma, answer);

    if (verification.isCorrect) {
      playGoldenFrenzy(true);
      setFeedback({
        isCorrect: true,
        text: `Arcane brisé ! ${verification.message}`,
      });

      if (!solvedIds.includes(activeEnigma.id)) {
        const next = [...solvedIds, activeEnigma.id];
        setSolvedIds(next);
        localStorage.setItem('spookybeats_unlocked_secrets', JSON.stringify(next));
      }
    } else {
      playTrapExplosion(true);
      setFeedback({
        isCorrect: false,
        text: verification.message,
      });
    }
  };

  // Dévoilement d'indices
  const handleUnlockHint = (type: 'subtle' | 'deep') => {
    playEctoClick();
    setRevealedHints((prev) => ({
      ...prev,
      [activeEnigma.id]: {
        subtle: type === 'subtle' ? true : prev[activeEnigma.id]?.subtle || false,
        deep: type === 'deep' ? true : prev[activeEnigma.id]?.deep || false,
      },
    }));
  };

  // Lancer une énigme au hasard non résolue
  const handleRandomEnigma = () => {
    playEctoClick();
    const random = getRandomUnsolvedEnigma(solvedIds, ALL_ENIGMAS);
    handleSelectEnigma(random.id);
  };

  // Sélectionner une énigme depuis le Tirage du Destin (Tarot)
  const handleSelectEnigmaFromTarot = (enigmaId: string) => {
    handleSelectEnigma(enigmaId);
    setShowTarotModal(false);
    setTarotDestinyNotice('Prophétie Funeste en cours : triomphez de cet arcane pour honorer le Destin !');
    setTimeout(() => {
      const el = document.getElementById('stele-workspace');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 150);
  };

  // Réinitialiser toutes les énigmes
  const handleResetAll = () => {
    if (window.confirm('Voulez-vous réinitialiser toutes les énigmes résolues et reverrouiller le reliquaire ?')) {
      playDoorCreak(true);
      setSolvedIds([]);
      localStorage.removeItem('spookybeats_unlocked_secrets');
      setSelectedOption(null);
      setSelectedRunes([]);
      setAnagramInput('');
      setFeedback(null);
      setRevealedHints({});
    }
  };

  // Jouer la piste musicale associée si disponible
  const handlePlayLinkedTrack = (trackTitle?: string) => {
    if (!trackTitle || !onSelectTrack || tracks.length === 0) return;
    const match = tracks.find(
      (t) => t.title.toLowerCase().includes(trackTitle.toLowerCase()) || 
             trackTitle.toLowerCase().includes(t.title.toLowerCase())
    );
    if (match) {
      playEctoClick();
      onSelectTrack(match);
    }
  };

  const currentHints = revealedHints[activeEnigma.id] || { subtle: false, deep: false };

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* ============================================================== */}
      {/* EN-TÊTE VICTORIEN & BARRE DE PROGRESSION DU NÉCROMANCIEN         */}
      {/* ============================================================== */}
      <VictorianIronworkCard highlightGlow="orange" className="p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#2B1642] text-[#FF7518] border border-[#FF7518]/50 shadow-[0_0_10px_rgba(255,117,24,0.3)]">
                <BookOpen className="w-5 h-5" />
              </span>
              <span className="text-[11px] font-mono tracking-widest uppercase text-[#39FF14] font-bold">
                Le Grimoire Sépulcral des 18 Arcanes
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#180E26] border border-[#6A0DAD]/60 text-[#DFB7FF] font-mono">
                Édition Hylst 2026
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight flex items-center gap-3">
              <span>Chambre des Énigmes & Reliques</span>
            </h1>

            <p className="text-xs sm:text-sm text-[#C8C2D4] max-w-2xl leading-relaxed">
              Pénétrez les 5 Tomes occultes conçus autour des compositions de Geoffroy Streit. Résolvez les énigmes à choix multiples, forgez les sceaux runiques ternaires et recomposez les anagrammes de cendre pour éveiller les 18 reliques sacrées.
            </p>
          </div>

          {/* Badge de Rang & Mana */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#180E26] to-[#0A0512] border border-[#FF7518]/40 shadow-inner flex items-center justify-between sm:justify-start gap-4">
              <div className="text-3xl p-2 rounded-xl bg-[#2A1640] border border-[#FF7518]/30 shadow-[0_0_15px_rgba(255,117,24,0.3)]">
                {progression.rank.badge}
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#FF7518] font-bold block">
                  Rang Nécromancien (Tier {progression.rank.tier}/5)
                </span>
                <span className="text-sm font-bold font-mono text-white block">
                  {progression.rank.title}
                </span>
                <span className="text-[10px] text-[#A69EAF] font-mono">
                  {progression.totalMana} Mana Spectral accumulé
                </span>
              </div>
            </div>

            {/* Boutons d'action rapides */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  playEctoClick();
                  setShowTarotModal(true);
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-[#2F154A] via-[#220E38] to-[#2F154A] border-2 border-[#FF7518]/70 hover:border-[#39FF14] text-white text-xs font-mono font-black flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md hover:scale-[1.03] shadow-[0_0_15px_rgba(255,117,24,0.3)] hover:shadow-[0_0_20px_rgba(57,255,20,0.4)]"
                title="Consulter le Tirage de Cartes de Tarot Funestes de la Crypte"
              >
                <Compass className="w-4 h-4 text-[#39FF14] animate-spin-slow" />
                <span className="tracking-wide">Tirage du Destin</span>
                <Sparkles className="w-3.5 h-3.5 text-[#FF7518]" />
              </button>

              <button
                onClick={() => {
                  playEctoClick();
                  setShowReliquaryView(!showReliquaryView);
                }}
                className={`py-2 px-3 rounded-xl border text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  showReliquaryView
                    ? 'bg-[#39FF14] text-black border-[#39FF14] shadow-[0_0_15px_#39FF14]'
                    : 'bg-[#180E26] text-[#FF7518] border-[#FF7518]/50 hover:bg-[#2A1640]'
                }`}
              >
                <Trophy className="w-4 h-4" />
                <span>{progression.relicsCount}/18 Reliques</span>
              </button>
            </div>
          </div>
        </div>

        {/* Barre de progression globale */}
        <div className="mt-5 pt-4 border-t border-[#6A0DAD]/30">
          <div className="flex items-center justify-between text-xs font-mono mb-1.5">
            <span className="text-[#A69EAF] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#39FF14]" />
              Progression vers le Sceau Suprême d’Hylst
            </span>
            <span className="font-bold text-white">
              {progression.solvedCount} / {progression.totalCount} Arcanes ({progression.percentage}%)
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-[#0E0617] border border-[#6A0DAD]/50 overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#6A0DAD] via-[#FF7518] to-[#39FF14] transition-all duration-700 shadow-[0_0_12px_rgba(57,255,20,0.5)]"
              style={{ width: `${progression.percentage}%` }}
            />
          </div>
        </div>
      </VictorianIronworkCard>

      {/* ============================================================== */}
      {/* SÉLECTEUR DES 5 TOMES OCCULTES                                 */}
      {/* ============================================================== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        <button
          onClick={() => {
            playEctoClick();
            setSelectedTomeId('all');
          }}
          className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
            selectedTomeId === 'all'
              ? 'bg-gradient-to-b from-[#2E1848] to-[#140A20] border-[#FF7518] text-white shadow-[0_0_15px_rgba(255,117,24,0.4)] scale-102'
              : 'bg-[#0E0617]/90 border-[#6A0DAD]/40 text-[#C8C2D4] hover:border-[#DFB7FF]'
          }`}
        >
          <span className="text-xl mb-1">📖</span>
          <span className="text-[11px] font-mono font-bold">Tous les Tomes</span>
          <span className="text-[9px] text-[#A69EAF] mt-0.5 font-mono">18 Énigmes</span>
        </button>

        {ENIGMA_TOMES.map((tome) => {
          const isSelected = selectedTomeId === tome.id;
          const tomeEnigmas = ALL_ENIGMAS.filter((e) => e.tomeId === tome.id);
          const solvedInTome = tomeEnigmas.filter((e) => solvedIds.includes(e.id)).length;
          const isComplete = solvedInTome === tomeEnigmas.length;

          return (
            <button
              key={tome.id}
              onClick={() => {
                playEctoClick();
                setSelectedTomeId(tome.id);
              }}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all cursor-pointer relative overflow-hidden ${
                isSelected
                  ? 'bg-gradient-to-b from-[#2E1848] to-[#140A20] border-[#FF7518] text-white shadow-[0_0_15px_rgba(255,117,24,0.4)] scale-102'
                  : 'bg-[#0E0617]/90 border-[#6A0DAD]/40 text-[#C8C2D4] hover:border-[#DFB7FF]'
              }`}
            >
              {isComplete && (
                <span className="absolute top-1 right-1 text-[9px] text-[#39FF14] font-bold">
                  ✓
                </span>
              )}
              <span className="text-xl mb-1">{tome.icon}</span>
              <span className="text-[11px] font-mono font-bold line-clamp-1">
                {tome.title.split(':')[0]}
              </span>
              <span className="text-[9px] text-[#A69EAF] mt-0.5 font-mono">
                {solvedInTome}/{tomeEnigmas.length} résolues
              </span>
            </button>
          );
        })}
      </div>

      {/* ============================================================== */}
      {/* BARRE DE FILTRES SECONDAIRES & RECHERCHE                       */}
      {/* ============================================================== */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl bg-[#0E0617] border border-[#6A0DAD]/40">
        {/* Recherche */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#8C8494] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher une énigme, mot latin, relique..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#180E26] border border-[#6A0DAD]/50 text-white placeholder-[#8C8494] text-xs font-mono focus:outline-none focus:border-[#FF7518]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8C8494] hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filtre de difficulté */}
        <div className="flex items-center gap-1.5 text-xs font-mono">
          <span className="text-[10px] text-[#A69EAF] uppercase tracking-wider hidden md:inline">
            Difficulté :
          </span>
          {(['all', 'initie', 'occultiste', 'archonte'] as const).map((diff) => (
            <button
              key={diff}
              onClick={() => {
                playEctoClick();
                setSelectedDifficulty(diff);
              }}
              className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold capitalize transition-colors cursor-pointer ${
                selectedDifficulty === diff
                  ? 'bg-[#FF7518] text-black border-[#FF7518]'
                  : 'bg-[#180E26] text-[#C8C2D4] border-[#6A0DAD]/40 hover:border-[#C8C2D4]'
              }`}
            >
              {diff === 'all' ? 'Toutes' : diff}
            </button>
          ))}
        </div>

        {/* Filtre de statut */}
        <div className="flex items-center gap-1.5 text-xs font-mono">
          <span className="text-[10px] text-[#A69EAF] uppercase tracking-wider hidden md:inline">
            Statut :
          </span>
          {(['all', 'unsolved', 'solved'] as const).map((st) => (
            <button
              key={st}
              onClick={() => {
                playEctoClick();
                setSelectedStatus(st);
              }}
              className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold transition-colors cursor-pointer ${
                selectedStatus === st
                  ? 'bg-[#39FF14] text-black border-[#39FF14]'
                  : 'bg-[#180E26] text-[#C8C2D4] border-[#6A0DAD]/40 hover:border-[#C8C2D4]'
              }`}
            >
              {st === 'all' ? 'Tous' : st === 'unsolved' ? 'Scellées 🔒' : 'Résolues ✨'}
            </button>
          ))}
        </div>
      </div>

      {/* ============================================================== */}
      {/* VUE RELIQUAIRE COMPLET (SI TOGGLE ACTIF)                        */}
      {/* ============================================================== */}
      {showReliquaryView && (
        <VictorianIronworkCard highlightGlow="green" className="p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#6A0DAD]/40">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏺</span>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white font-mono">
                  Le Grand Reliquaire des 18 Ombres d’Hylst
                </h2>
                <p className="text-xs text-[#A69EAF]">
                  Artéfacts sacrés conférant des pouvoirs mystiques au gré de votre ascension.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowReliquaryView(false)}
              className="p-1.5 rounded-lg bg-[#180E26] text-[#C8C2D4] hover:text-white border border-[#6A0DAD]/50"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {ALL_ENIGMAS.map((enigma) => {
              const relic = enigma.relicReward;
              const isUnlocked = solvedIds.includes(enigma.id);

              return (
                <div
                  key={relic.id}
                  onClick={() => {
                    if (isUnlocked) {
                      playEctoClick();
                      setInspectedRelic(relic);
                    }
                  }}
                  className={`p-3.5 rounded-xl border transition-all flex items-start gap-3 relative ${
                    isUnlocked
                      ? 'bg-[#0E0617] border-[#39FF14]/50 hover:border-[#39FF14] shadow-[0_0_12px_rgba(57,255,20,0.15)] cursor-pointer hover:scale-[1.02]'
                      : 'bg-[#07030A] border-[#6A0DAD]/20 opacity-50'
                  }`}
                >
                  <div className="text-3xl p-2 rounded-xl bg-[#180E26] border border-[#6A0DAD]/40 shrink-0">
                    {isUnlocked ? relic.icon : '🔒'}
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className={`text-[9px] font-mono uppercase tracking-wider font-bold px-1.5 py-0.5 rounded ${
                        relic.rarity === 'supreme_hylst'
                          ? 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]'
                          : relic.rarity === 'ancestrale'
                          ? 'bg-[#39FF14]/20 text-[#39FF14] border border-[#39FF14]'
                          : relic.rarity === 'maudite'
                          ? 'bg-[#FF7518]/20 text-[#FF7518] border border-[#FF7518]'
                          : 'bg-[#C8C2D4]/20 text-[#C8C2D4] border border-[#C8C2D4]'
                      }`}>
                        {relic.rarity.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] font-mono text-[#8C8494]">
                        Stèle 0{enigma.steleNumber}
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-white font-mono truncate">
                      {isUnlocked ? relic.name : 'Relique Scellée'}
                    </h3>
                    <p className="text-[11px] text-[#A69EAF] line-clamp-2 leading-relaxed">
                      {isUnlocked ? relic.spectralPower : `Résolvez l’énigme "${enigma.title}" pour desceller.`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </VictorianIronworkCard>
      )}

      {/* ============================================================== */}
      {/* CARROUSEL / GRILLE DES STÈLES DU TOME ACTIF                    */}
      {/* ============================================================== */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-[#C8C2D4] px-1">
          <span>Stèles disponibles ({filteredEnigmas.length}) :</span>
          <span className="text-[10px] text-[#A69EAF]">Cliquez pour sélectionner l’énigme</span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-9 gap-2">
          {filteredEnigmas.map((enigma) => {
            const isSolved = solvedIds.includes(enigma.id);
            const isCurrent = activeEnigmaId === enigma.id;

            return (
              <button
                key={enigma.id}
                onClick={() => handleSelectEnigma(enigma.id)}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer relative ${
                  isCurrent
                    ? 'bg-gradient-to-b from-[#2E1848] to-[#140A20] border-[#FF7518] shadow-[0_0_15px_rgba(255,117,24,0.4)] scale-102 z-10'
                    : 'bg-[#0E0617] border-[#6A0DAD]/40 hover:border-[#DFB7FF]'
                }`}
              >
                {isSolved ? (
                  <span className="text-lg">{enigma.relicReward.icon}</span>
                ) : (
                  <Lock className="w-5 h-5 text-[#8C8494]" />
                )}
                <span className="text-[10px] font-mono font-bold mt-1 text-white">
                  Stèle 0{enigma.steleNumber}
                </span>
                <span className={`text-[8px] font-mono uppercase mt-0.5 ${
                  enigma.difficulty === 'archonte'
                    ? 'text-[#EF4444]'
                    : enigma.difficulty === 'occultiste'
                    ? 'text-[#A855F7]'
                    : 'text-[#39FF14]'
                }`}>
                  {enigma.difficulty}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ============================================================== */}
      {/* STÈLE ACTIVE : PANNEAU DE JEU & INTERACTION                    */}
      {/* ============================================================== */}
      <div id="stele-workspace">
        <VictorianIronworkCard highlightGlow="purple" className="p-5 sm:p-7 space-y-5">
          {/* Bannière de Prophétie du Tarot si active */}
          {tarotDestinyNotice && (
            <div className="p-3 rounded-xl bg-gradient-to-r from-[#FF7518]/20 via-[#2A1640] to-[#39FF14]/20 border border-[#FF7518] flex items-center justify-between gap-2 animate-fadeIn text-xs font-mono">
              <span className="flex items-center gap-2 text-[#DFB7FF]">
                <Sparkles className="w-4 h-4 text-[#FF7518] shrink-0" />
                <span>{tarotDestinyNotice}</span>
              </span>
              <button
                onClick={() => setTarotDestinyNotice(null)}
                className="text-xs text-[#A69EAF] hover:text-white p-1 cursor-pointer"
                title="Masquer l’avertissement"
              >
                ✕
              </button>
            </div>
          )}

          {/* Entête de l'énigme active */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#6A0DAD]/30">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono uppercase text-[#39FF14] tracking-widest font-bold">
                Stèle No 0{activeEnigma.steleNumber} • {activeEnigma.type.replace('_', ' ')}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#180E26] border border-[#6A0DAD]/50 text-[#FF7518] font-mono font-bold">
                +{activeEnigma.manaPoints} Mana
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white font-mono">
              {activeEnigma.title}
            </h2>
            <p className="text-xs text-[#FF7518] italic font-serif mt-0.5">
              « {activeEnigma.latinMotto} »
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Récit vocal spectral */}
            <button
              onClick={() => {
                playEctoClick();
                spectralNarrator.toggle(
                  `${activeEnigma.title}. ${activeEnigma.latinMotto}. ${activeEnigma.question}`,
                  activeEnigma.title
                );
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-bold border transition-all cursor-pointer ${
                narratorState.isSpeaking && narratorState.currentText?.includes(activeEnigma.title)
                  ? 'bg-[#39FF14] text-black border-[#39FF14] shadow-[0_0_12px_#39FF14] animate-pulse'
                  : 'bg-[#241738] text-[#DFB7FF] border-[#6A0DAD]/60 hover:border-[#39FF14]'
              }`}
              title="Écouter l'incantation vocale récitée par le spectre"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>
                {narratorState.isSpeaking && narratorState.currentText?.includes(activeEnigma.title)
                  ? 'Voix Active...'
                  : 'Récit Vocal'}
              </span>
            </button>

            {/* Statut de résolution */}
            {isAlreadySolved ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#39FF14]/15 border border-[#39FF14] text-[#39FF14] text-xs font-mono font-bold">
                <CheckCircle2 className="w-4 h-4" />
                Résolue
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FF7518]/15 border border-[#FF7518] text-[#FF7518] text-xs font-mono font-bold">
                <Lock className="w-4 h-4" />
                Scellée
              </span>
            )}
          </div>
        </div>

        {/* Énoncé de l'énigme */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-[#180E26]/80 to-[#0A0512] border border-[#6A0DAD]/40">
          <p className="text-sm sm:text-base font-serif italic text-white leading-relaxed">
            « {activeEnigma.question} »
          </p>
        </div>

        {/* ============================================================== */}
        {/* MÉCANIQUE 1 : CHOIX MULTIPLE                                    */}
        {/* ============================================================== */}
        {activeEnigma.type === 'choix_multiple' && activeEnigma.options && (
          <div className="space-y-3">
            <span className="text-[10px] font-mono text-[#A69EAF] uppercase tracking-wider block">
              Choisissez l’incantation correcte :
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {activeEnigma.options.map((option, optIdx) => {
                const isSelected = selectedOption === optIdx;
                const isCorrectAnswer = isAlreadySolved && optIdx === activeEnigma.correctIndex;

                return (
                  <button
                    key={optIdx}
                    onClick={() => {
                      playEctoClick();
                      setSelectedOption(optIdx);
                    }}
                    className={`p-3.5 rounded-xl border text-left font-mono text-xs transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-[#39FF14] text-black font-bold border-[#39FF14] shadow-[0_0_15px_#39FF14]'
                        : isCorrectAnswer
                        ? 'bg-[#39FF14]/20 text-[#39FF14] border-[#39FF14]'
                        : 'bg-[#0B0512] text-white border-[#6A0DAD]/40 hover:border-[#FF7518]'
                    }`}
                  >
                    <span>{option}</span>
                    <span className="text-[10px] opacity-60">
                      Choix 0{optIdx + 1}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MÉCANIQUE 2 : SCEAU RUNIQUE TERNAIRE                            */}
        {/* ============================================================== */}
        {activeEnigma.type === 'sceau_runique' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#A69EAF] uppercase tracking-wider">
                Assemblez la Trinité Runique dans l’ordre exact (3 glyphes requis) :
              </span>
              {selectedRunes.length > 0 && (
                <button
                  onClick={handleClearRunes}
                  className="text-[10px] font-mono text-[#8C8494] hover:text-[#EF4444] transition-colors cursor-pointer"
                >
                  Effacer l’alignement
                </button>
              )}
            </div>

            {/* Socle d'assemblage des 3 runes */}
            <div className="flex items-center justify-center gap-4 p-4 rounded-xl bg-[#090410] border border-[#6A0DAD]/50">
              {[0, 1, 2].map((slotIdx) => {
                const runeId = selectedRunes[slotIdx];
                const runeData = ALCHEMICAL_RUNES.find((r) => r.id === runeId);

                return (
                  <div
                    key={slotIdx}
                    onClick={() => {
                      if (runeId) {
                        playEctoClick();
                        setSelectedRunes(selectedRunes.filter((_, idx) => idx !== slotIdx));
                      }
                    }}
                    className={`w-20 h-24 rounded-xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer ${
                      runeData
                        ? 'bg-gradient-to-b from-[#2E1848] to-[#180E26] border-[#39FF14] shadow-[0_0_15px_rgba(57,255,20,0.3)]'
                        : 'bg-[#0E0617] border-dashed border-[#6A0DAD]/60 hover:border-[#DFB7FF]'
                    }`}
                  >
                    {runeData ? (
                      <>
                        <span className="text-3xl font-serif text-[#39FF14]">
                          {runeData.glyph}
                        </span>
                        <span className="text-[9px] font-mono font-bold text-white mt-1">
                          {runeData.name.split(' ')[0]}
                        </span>
                        <span className="text-[8px] text-[#A69EAF]">
                          Slot 0{slotIdx + 1}
                        </span>
                      </>
                    ) : (
                      <span className="text-xs font-mono text-[#8C8494]">
                        [Vide 0{slotIdx + 1}]
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Palette des runes sélectionnables */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {ALCHEMICAL_RUNES.map((rune) => {
                const isPicked = selectedRunes.includes(rune.id);

                return (
                  <button
                    key={rune.id}
                    onClick={() => handleToggleRune(rune.id)}
                    className={`p-2.5 rounded-xl border flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                      isPicked
                        ? 'bg-[#39FF14]/20 border-[#39FF14] text-[#39FF14]'
                        : 'bg-[#0E0617] border-[#6A0DAD]/40 text-white hover:border-[#FF7518]'
                    }`}
                  >
                    <span className="text-2xl font-serif">{rune.glyph}</span>
                    <span className="text-[10px] font-mono font-bold mt-0.5">
                      {rune.name}
                    </span>
                    <span className="text-[8px] text-[#A69EAF]">{rune.element}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MÉCANIQUE 3 : ANAGRAMME OCCULTE                                 */}
        {/* ============================================================== */}
        {activeEnigma.type === 'anagramme_occulte' && activeEnigma.anagramData && (
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-mono text-[#A69EAF] uppercase tracking-wider block mb-1">
                Lettres dispersées par les vents sépulcraux :
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {activeEnigma.anagramData.scrambled.split(' ').map((letter, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      playEctoClick();
                      setAnagramInput((prev) => prev + letter);
                    }}
                    className="w-10 h-10 rounded-lg bg-[#241738] border border-[#FF7518]/60 text-white font-mono font-black text-sm flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    {letter}
                  </button>
                ))}
              </div>
            </div>

            {/* Saisie de la solution */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-[#A69EAF] uppercase tracking-wider block">
                Saisissez le mot sacré :
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Ex: REQUIEM..."
                  value={anagramInput}
                  onChange={(e) => setAnagramInput(e.target.value.toUpperCase())}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#090410] border border-[#6A0DAD]/60 text-white font-mono text-sm tracking-widest uppercase focus:outline-none focus:border-[#39FF14]"
                />
                {anagramInput && (
                  <button
                    onClick={() => {
                      playEctoClick();
                      setAnagramInput('');
                    }}
                    className="px-3 py-2.5 rounded-xl bg-[#180E26] text-[#8C8494] hover:text-white border border-[#6A0DAD]/40 font-mono text-xs cursor-pointer"
                  >
                    Effacer
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Bouton de validation & action */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <button
            onClick={handleValidate}
            className="px-6 py-3 rounded-xl font-mono text-xs font-black transition-all active:scale-95 cursor-pointer bg-gradient-to-r from-[#FF7518] to-[#6A0DAD] text-white shadow-[0_0_15px_rgba(255,117,24,0.4)] hover:brightness-110 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#39FF14]" />
            <span>Invoquer la Réponse</span>
          </button>

          {/* Si l'énigme est liée à une piste d'Hylst */}
          {activeEnigma.linkedTrackTitle && onSelectTrack && (
            <button
              onClick={() => handlePlayLinkedTrack(activeEnigma.linkedTrackTitle)}
              className="px-4 py-2 rounded-xl bg-[#180E26] border border-[#6A0DAD]/60 text-[#DFB7FF] hover:border-[#39FF14] text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
              title="Écouter la piste musicale correspondante"
            >
              <Volume2 className="w-3.5 h-3.5 text-[#FF7518]" />
              <span>Musique liée : {activeEnigma.linkedTrackTitle}</span>
            </button>
          )}
        </div>

        {/* Message de feedback (succès ou erreur) */}
        {feedback && (
          <div
            className={`p-4 rounded-xl border text-xs font-mono flex items-start gap-3 ${
              feedback.isCorrect
                ? 'bg-[#39FF14]/15 border-[#39FF14] text-[#39FF14]'
                : 'bg-[#EF4444]/15 border-[#EF4444] text-[#FCA5A5]'
            }`}
          >
            {feedback.isCorrect ? (
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <span className="font-bold block">{feedback.text}</span>
              {feedback.isCorrect && (
                <span className="text-[11px] opacity-80 block">
                  Explication occulte : {activeEnigma.explanation}
                </span>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* SYSTÈME D'INDICES PROGRESSIFS (DEUX NIVEAUX)                    */}
        {/* ============================================================== */}
        <div className="pt-3 border-t border-[#6A0DAD]/30 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-[#A69EAF]">
            <span className="flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-[#FF7518]" />
              Révélation des Arcanes & Indices :
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Niveau 1 : Murmure des âmes */}
            <div className="p-3 rounded-xl bg-[#0B0512] border border-[#6A0DAD]/30 text-xs font-mono">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[#39FF14] font-bold text-[10px] uppercase">
                  Niveau I : Murmure des Âmes
                </span>
                {!currentHints.subtle && (
                  <button
                    onClick={() => handleUnlockHint('subtle')}
                    className="text-[10px] text-[#FF7518] hover:underline cursor-pointer"
                  >
                    Dévoiler
                  </button>
                )}
              </div>
              {currentHints.subtle ? (
                <p className="text-white text-[11px] leading-relaxed italic">
                  « {activeEnigma.subtleHint} »
                </p>
              ) : (
                <p className="text-[#8C8494] text-[11px] italic">
                  Les murmures sont étouffés... Cliquez pour écouter les âmes errantes.
                </p>
              )}
            </div>

            {/* Niveau 2 : Révélation d'outre-tombe */}
            <div className="p-3 rounded-xl bg-[#0B0512] border border-[#6A0DAD]/30 text-xs font-mono">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[#FF7518] font-bold text-[10px] uppercase">
                  Niveau II : Révélation d’Outre-Tombe
                </span>
                {!currentHints.deep && (
                  <button
                    onClick={() => handleUnlockHint('deep')}
                    className="text-[10px] text-[#39FF14] hover:underline cursor-pointer"
                  >
                    Dévoiler
                  </button>
                )}
              </div>
              {currentHints.deep ? (
                <p className="text-white text-[11px] leading-relaxed italic">
                  « {activeEnigma.deepHint} »
                </p>
              ) : (
                <p className="text-[#8C8494] text-[11px] italic">
                  La dalle de marbre est scellée... Cliquez pour invoquer la révélation.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* RELIQUE DE CETTE STÈLE                                         */}
        {/* ============================================================== */}
        <div className="pt-3 border-t border-[#6A0DAD]/30">
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#180E26] to-[#0A0512] border border-[#6A0DAD]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="text-3xl p-2 rounded-xl bg-[#0B0512] border border-[#6A0DAD]/50 shrink-0">
                {isAlreadySolved ? activeEnigma.relicReward.icon : '🔒'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white font-mono">
                    {isAlreadySolved ? activeEnigma.relicReward.name : 'Relique Envoûtée Scellée'}
                  </span>
                  <span className="text-[9px] px-2 py-0.5 rounded bg-[#2A1640] text-[#39FF14] font-mono uppercase font-bold border border-[#39FF14]/40">
                    {activeEnigma.relicReward.rarity.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-[11px] text-[#A69EAF] mt-0.5 leading-relaxed">
                  {isAlreadySolved
                    ? activeEnigma.relicReward.spectralPower
                    : 'Cette relique sera ajoutée à votre Reliquaire des Ombres dès résolution de cette stèle.'}
                </p>
              </div>
            </div>

            {isAlreadySolved && (
              <button
                onClick={() => {
                  playEctoClick();
                  setInspectedRelic(activeEnigma.relicReward);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-[#241738] border border-[#6A0DAD]/60 hover:border-[#39FF14] text-white text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto"
              >
                <Eye className="w-3.5 h-3.5 text-[#39FF14]" />
                <span>Examiner</span>
              </button>
            )}
          </div>
        </div>
      </VictorianIronworkCard>
      </div>

      {/* ============================================================== */}
      {/* MODAL D'INSPECTION D'UNE RELIQUE                               */}
      {/* ============================================================== */}
      {inspectedRelic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="max-w-md w-full bg-[#140A20] border-2 border-[#FF7518] rounded-2xl p-6 space-y-4 shadow-[0_0_30px_rgba(255,117,24,0.4)] relative">
            <button
              onClick={() => {
                playEctoClick();
                setInspectedRelic(null);
              }}
              className="absolute top-4 right-4 text-[#8C8494] hover:text-white p-1 rounded-lg bg-[#241738] border border-[#6A0DAD]/40 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-4">
              <div className="text-4xl p-3 rounded-2xl bg-[#241738] border border-[#FF7518]/50 shadow-[0_0_15px_rgba(255,117,24,0.3)]">
                {inspectedRelic.icon}
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#39FF14] uppercase tracking-wider font-bold">
                  {inspectedRelic.rarity.replace('_', ' ')} • {inspectedRelic.origin}
                </span>
                <h3 className="text-lg font-bold text-white font-mono">
                  {inspectedRelic.name}
                </h3>
                <p className="text-xs text-[#DFB7FF] font-mono italic">
                  « {inspectedRelic.title} »
                </p>
              </div>
            </div>

            <VictorianFiligreeDivider className="opacity-50" />

            <div className="space-y-2 text-xs font-mono">
              <div>
                <span className="text-[#A69EAF] uppercase tracking-wider text-[10px] block">
                  Histoire Secrète :
                </span>
                <p className="text-white mt-0.5 leading-relaxed font-serif italic text-sm">
                  « {inspectedRelic.lore} »
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#090410] border border-[#39FF14]/40">
                <span className="text-[#39FF14] uppercase tracking-wider text-[10px] font-bold block">
                  Pouvoir Spectral Actif :
                </span>
                <p className="text-white mt-0.5 leading-relaxed">
                  {inspectedRelic.spectralPower}
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  playEctoClick();
                  setInspectedRelic(null);
                }}
                className="px-4 py-2 rounded-xl bg-[#241738] text-white border border-[#6A0DAD]/60 font-mono text-xs font-bold hover:bg-[#342050] cursor-pointer"
              >
                Fermer l’artéfact
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* BOUTON DE RÉINITIALISATION DU GRIMOIRE                         */}
      {/* ============================================================== */}
      {solvedIds.length > 0 && (
        <div className="pt-4 flex justify-center">
          <button
            onClick={handleResetAll}
            className="text-xs font-mono text-[#8C8494] hover:text-[#EF4444] transition-colors flex items-center gap-1.5 cursor-pointer p-2 rounded-lg hover:bg-[#180E26]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Réinitialiser la progression du Grimoire</span>
          </button>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL DU TIRAGE DU DESTIN (TAROT FUNESTE)                      */}
      {/* ============================================================== */}
      <TarotDestinModal
        isOpen={showTarotModal}
        onClose={() => setShowTarotModal(false)}
        onSelectEnigma={handleSelectEnigmaFromTarot}
      />
    </div>
  );
};
