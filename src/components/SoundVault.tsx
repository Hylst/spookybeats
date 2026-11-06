import React, { useState, useEffect } from 'react';
import {
  Search,
  FlaskConical,
  Play,
  Pause,
  MoreVertical,
  Skull,
  Flame,
  Radio,
  Sparkles,
  Mic,
  Star,
  SlidersHorizontal,
  Disc3,
  Layers,
} from 'lucide-react';
import { TrackMetadata } from '../audio/audioEngine';
import { playEctoClick, playEvilLaugh, playDoorCreak, playGoldenFrenzy } from '../audio/sfx';
import { spectralNarrator, SpectralNarratorState } from '../audio/spectralNarrator';
import { 
  filterAndSortTracks, 
  toggleTrackFavorite, 
  VaultSortMode 
} from '../audio/vaultLogic';
import { 
  VictorianIronworkCard, 
  VictorianFiligreeDivider, 
  VictorianCornerFlourish,
  GothicCobwebCorner 
} from './GothicDecorations';

interface SoundVaultProps {
  tracks: TrackMetadata[];
  currentTrack: TrackMetadata;
  isPlaying: boolean;
  onSelectTrack: (track: TrackMetadata) => void;
  onTogglePlay: () => void;
  horrorLevel: 1 | 2 | 3;
  onChangeHorrorLevel: (level: 1 | 2 | 3) => void;
}

export const SoundVault: React.FC<SoundVaultProps> = ({
  tracks,
  currentTrack,
  isPlaying,
  onSelectTrack,
  onTogglePlay,
  horrorLevel,
  onChangeHorrorLevel,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPotion, setSelectedPotion] = useState<number | 'all'>('all');
  const [sortMode, setSortMode] = useState<VaultSortMode>('default');
  const [onlyFavorites, setOnlyFavorites] = useState<boolean>(false);
  const [isDjCrossfadeActive, setIsDjCrossfadeActive] = useState<boolean>(false);
  const [narratorState, setNarratorState] = useState<SpectralNarratorState>(spectralNarrator.getState());

  // Persistent favorites from localStorage
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('spookybeats_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('spookybeats_favorites', JSON.stringify(favoriteIds));
    } catch {
      // Ignorer
    }
  }, [favoriteIds]);

  useEffect(() => {
    const unsub = spectralNarrator.subscribe((state) => {
      setNarratorState(state);
    });
    return unsub;
  }, []);

  const handleToggleFavorite = (trackSlug: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playGoldenFrenzy(true);
    setFavoriteIds((prev) => toggleTrackFavorite(prev, trackSlug));
  };

  const filteredTracks = filterAndSortTracks(tracks, {
    searchTerm,
    horrorLevel: selectedPotion,
    sortMode,
    onlyFavorites,
    favoritesList: favoriteIds,
  });

  const handlePotionClick = (level: 1 | 2 | 3) => {
    playEvilLaugh();
    setSelectedPotion(level);
    onChangeHorrorLevel(level);
  };

  const renderSkulls = (level: number) => {
    return Array.from({ length: 4 }).map((_, i) => (
      <Skull
        key={i}
        className={`w-3 h-3 inline-block ${
          i < level ? 'text-[#FF7518] fill-[#FF7518]/20' : 'text-[#8C8494]/30'
        }`}
      />
    ));
  };

  return (
    <div className="flex flex-col gap-5 pb-28 animate-fadeIn">
      {/* En-tête avec ferronnerie victorienne */}
      <VictorianIronworkCard highlightGlow="purple" className="p-4 sm:p-5 text-left">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#FF7518] font-bold">
                Archives Sépulcrales
              </span>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#39FF14]/15 border border-[#39FF14]/40 text-[#39FF14] font-mono">
                19 Compositions
              </span>
            </div>
            <h2 className="font-syne text-2xl sm:text-3xl font-extrabold text-[#F5F2EB] tracking-wide">
              Le Caveau Sonore
            </h2>
            <p className="text-xs font-mono text-[#A69EAF] mt-1">
              Invoquez les fréquences d'outre-tombe composées par Hylst...
            </p>
          </div>
          <Skull className="w-8 h-8 text-[#6A0DAD] opacity-70 hidden sm:block" />
        </div>

        <VictorianFiligreeDivider className="my-3 opacity-60" />

        {/* Barre de recherche incrustée */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C8494]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Chercher un sortilège, un titre, un monstre..."
            aria-label="Recherche de pistes"
            className="w-full pl-10 pr-9 py-2.5 rounded-lg bg-[#0C0712] border border-[#6A0DAD]/60 text-sm text-[#E6E1DC] placeholder-[#8C8494] focus:outline-none focus:border-[#39FF14] focus:shadow-[0_0_15px_rgba(57,255,20,0.3)] transition-all font-mono"
          />
          {searchTerm && (
            <button
              onClick={() => {
                playEctoClick();
                setSearchTerm('');
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-xs font-mono text-[#8C8494] hover:text-[#E6E1DC] bg-[#1C1424] rounded-full"
            >
              ✕
            </button>
          )}
        </div>
      </VictorianIronworkCard>

      {/* Filtre interactif "Degré d'Effroi (Potions)" */}
      <VictorianIronworkCard highlightGlow="none" className="p-3.5 sm:p-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] font-mono tracking-widest text-[#DFB7FF] uppercase flex items-center gap-1.5 font-bold">
            <FlaskConical className="w-3.5 h-3.5 text-[#39FF14]" />
            Degré d'Effroi Sépulcral
          </span>
          <button
            onClick={() => {
              playEctoClick();
              setSelectedPotion('all');
            }}
            className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded transition-all ${
              selectedPotion === 'all'
                ? 'text-[#39FF14] bg-[#39FF14]/15 border border-[#39FF14]/50 font-bold'
                : 'text-[#8C8494] hover:text-[#E6E1DC]'
            }`}
          >
            Tous les poisons ({tracks.length})
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {/* Potion 1 : Frissons (Vert) */}
          <button
            onClick={() => handlePotionClick(1)}
            className={`relative p-3 rounded-lg flex flex-col items-center text-center cursor-pointer transition-all border ${
              selectedPotion === 1
                ? 'border-[#39FF14] bg-gradient-to-b from-[#1E2E1B] to-[#0D150B] shadow-[0_0_15px_rgba(57,255,20,0.35)]'
                : 'border-[#6A0DAD]/40 bg-[#0E0916] hover:border-[#39FF14]/60'
            }`}
          >
            <div className="w-9 h-9 rounded-lg bg-[#07050A] border border-[#39FF14]/50 flex items-center justify-center mb-1 text-[#39FF14] shadow-inner">
              <FlaskConical className="w-5 h-5 animate-pulse" />
            </div>
            <span className="font-syne font-bold text-xs text-[#39FF14]">Frissons</span>
            <span className="text-[9px] font-mono text-[#8C8494]">Niveau I</span>
            <div className="mt-1 flex gap-0.5">{renderSkulls(1)}</div>
          </button>

          {/* Potion 2 : Modérée (Orange) */}
          <button
            onClick={() => handlePotionClick(2)}
            className={`relative p-3 rounded-lg flex flex-col items-center text-center cursor-pointer transition-all border ${
              selectedPotion === 2
                ? 'border-[#FF7518] bg-gradient-to-b from-[#2E1D13] to-[#150B06] shadow-[0_0_15px_rgba(255,117,24,0.35)]'
                : 'border-[#6A0DAD]/40 bg-[#0E0916] hover:border-[#FF7518]/60'
            }`}
          >
            <div className="w-9 h-9 rounded-lg bg-[#07050A] border border-[#FF7518]/50 flex items-center justify-center mb-1 text-[#FF7518] shadow-inner">
              <Flame className="w-5 h-5 animate-pulse" />
            </div>
            <span className="font-syne font-bold text-xs text-[#FF7518]">Modérée</span>
            <span className="text-[9px] font-mono text-[#8C8494]">Niveau II</span>
            <div className="mt-1 flex gap-0.5">{renderSkulls(2)}</div>
          </button>

          {/* Potion 3 : Cauchemar (Violet) */}
          <button
            onClick={() => handlePotionClick(3)}
            className={`relative p-3 rounded-lg flex flex-col items-center text-center cursor-pointer transition-all border ${
              selectedPotion === 3
                ? 'border-[#DFB7FF] bg-gradient-to-b from-[#2E143E] to-[#14081E] shadow-[0_0_15px_rgba(223,183,255,0.35)]'
                : 'border-[#6A0DAD]/40 bg-[#0E0916] hover:border-[#DFB7FF]/60'
            }`}
          >
            <div className="w-9 h-9 rounded-lg bg-[#07050A] border border-[#DFB7FF]/50 flex items-center justify-center mb-1 text-[#DFB7FF] shadow-inner">
              <Skull className="w-5 h-5 animate-pulse" />
            </div>
            <span className="font-syne font-bold text-xs text-[#DFB7FF]">Cauchemar</span>
            <span className="text-[9px] font-mono text-[#8C8494]">Niveau III</span>
            <div className="mt-1 flex gap-0.5">{renderSkulls(3)}</div>
          </button>
        </div>
      </VictorianIronworkCard>

      {/* Mode DJ Sépulcral & Enchaînement Spectral */}
      <div className={`p-3.5 rounded-xl border transition-all ${
        isDjCrossfadeActive
          ? 'bg-gradient-to-r from-[#1E0D33] via-[#2A1040] to-[#140824] border-[#39FF14] shadow-[0_0_16px_rgba(57,255,20,0.3)]'
          : 'bg-[#0B0612] border-[#6A0DAD]/40'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className={`p-1.5 rounded-lg border ${
              isDjCrossfadeActive 
                ? 'bg-[#39FF14]/20 border-[#39FF14] text-[#39FF14] animate-spin'
                : 'bg-[#1C1424] border-[#6A0DAD]/50 text-[#8C8494]'
            }`}>
              <Disc3 className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#E6E1DC] uppercase tracking-wider">
                  Mode DJ Sépulcral (Crossfade 2.5s)
                </span>
                {isDjCrossfadeActive && (
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#39FF14] text-black font-bold font-mono animate-pulse">
                    ACTIF
                  </span>
                )}
              </div>
              <p className="text-[10px] font-mono text-[#8C8494]">
                Enchaîne les morceaux d'Hylst sans aucun silence pour vos soirées de Samhain.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playEctoClick();
              setIsDjCrossfadeActive(!isDjCrossfadeActive);
            }}
            className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold border transition-all cursor-pointer ${
              isDjCrossfadeActive
                ? 'bg-[#39FF14] text-black border-[#39FF14] shadow-[0_0_12px_#39FF14]'
                : 'bg-[#1C1226] text-[#DFB7FF] border-[#6A0DAD]/60 hover:border-[#39FF14]'
            }`}
          >
            {isDjCrossfadeActive ? 'Désactiver DJ' : 'Activer Mode DJ'}
          </button>
        </div>
      </div>

      {/* Barre de Tri & Filtre Favoris */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 rounded-xl bg-[#0C0714] border border-[#6A0DAD]/40 text-xs font-mono">
        {/* Filtre Favoris */}
        <button
          onClick={() => {
            playEctoClick();
            setOnlyFavorites(!onlyFavorites);
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
            onlyFavorites
              ? 'bg-[#FF7518] text-black border-[#FF7518] font-bold shadow-[0_0_12px_rgba(255,117,24,0.4)]'
              : 'bg-[#160E21] text-[#DFB7FF] border-[#6A0DAD]/50 hover:border-[#FF7518]'
          }`}
        >
          <Star className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-black' : 'text-[#FF7518]'}`} />
          <span>Mes Favoris ({favoriteIds.length})</span>
        </button>

        {/* Sélecteur de Tri */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#DFB7FF]" />
          <span className="text-[#8C8494] text-[11px] hidden sm:inline">Trier par :</span>
          <select
            value={sortMode}
            onChange={(e) => {
              playEctoClick();
              setSortMode(e.target.value as VaultSortMode);
            }}
            aria-label="Trier les morceaux"
            className="bg-[#160E21] border border-[#6A0DAD]/60 text-[#DFB7FF] text-xs font-mono rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#39FF14] cursor-pointer"
          >
            <option value="default">Ordre Original de la Crypte</option>
            <option value="bpm-asc">BPM : Lent vers Rapide</option>
            <option value="bpm-desc">BPM : Rapide vers Lent</option>
            <option value="duration-desc">Durée : Plus longues d'abord</option>
            <option value="horror-desc">Effroi : Plus terrifiants d'abord</option>
          </select>
        </div>
      </div>

      {/* Liste des Pistes */}
      <div className="flex flex-col gap-2.5">
        <div className="flex justify-between items-center text-[10px] font-mono text-[#8C8494] px-1">
          <span className="tracking-widest uppercase">
            {filteredTracks.length} incantations dans la crypte
          </span>
          <span>BPM / EFFROI / FAVORIS</span>
        </div>

        {filteredTracks.map((track) => {
          const isCurrent = currentTrack.id === track.id;
          const isPlayingThis = isCurrent && isPlaying;
          const isFav = favoriteIds.includes(track.slug);

          return (
            <div
              key={track.id}
              onClick={() => {
                playDoorCreak();
                onSelectTrack(track);
              }}
              className={`relative rounded-xl border p-0.5 cursor-pointer group transition-all duration-200 ${
                isCurrent
                  ? 'border-[#39FF14] bg-gradient-to-r from-[#170F24] via-[#101912] to-[#170F24] shadow-[0_0_18px_rgba(57,255,20,0.25)]'
                  : 'border-[#3A1E54]/70 bg-[#0E0817] hover:border-[#6A0DAD] hover:bg-[#140D21]'
              }`}
            >
              {/* Arabesques de coin subtiles sur piste active */}
              {isCurrent && (
                <>
                  <VictorianCornerFlourish position="top-left" size={26} color="#39FF14" className="opacity-60" />
                  <VictorianCornerFlourish position="top-right" size={26} color="#39FF14" className="opacity-60" />
                </>
              )}

              <div className="p-3 flex items-center justify-between relative z-10">
                {/* Gauche : Image + Titre */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-[#6A0DAD]/60 flex-shrink-0 bg-[#0B0612] shadow-inner">
                    <img
                      src={track.coverArt}
                      alt={track.title}
                      onError={(e) => {
                        (e.target as HTMLElement).style.opacity = '0';
                      }}
                      className="w-full h-full object-cover filter contrast-125"
                    />
                    <div className="absolute inset-0 -z-10 flex items-center justify-center text-base">
                      💀
                    </div>
                    {isPlayingThis && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-[#39FF14]">
                        <Radio className="w-5 h-5 animate-pulse" />
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-[#0B0B0B]/90 text-[8px] font-mono text-center text-[#39FF14] py-0.5 border-t border-[#39FF14]/30">
                      {track.bpm} BPM
                    </div>
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-syne font-bold text-xs sm:text-sm text-[#E6E1DC] group-hover:text-[#39FF14] transition-colors truncate">
                      {track.title}
                    </h3>
                    <p className="text-[10px] text-[#A69EAF] truncate">
                      {track.artist}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-[#6A0DAD]/30 text-[#DFB7FF] border border-[#6A0DAD]/50">
                        {track.genre}
                      </span>
                      <div className="flex items-center gap-0.5">
                        {renderSkulls(track.horrorLevel)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Droite : Favori + Durée + Bouton Play */}
                <div className="flex items-center gap-2.5 flex-shrink-0">
                  {/* Bouton Favori */}
                  <button
                    onClick={(e) => handleToggleFavorite(track.slug, e)}
                    aria-label={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                    title={isFav ? 'Retirer des favoris de Samhain' : 'Ajouter aux favoris de Samhain'}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer border ${
                      isFav
                        ? 'bg-[#FF7518]/20 border-[#FF7518] text-[#FF7518] shadow-[0_0_8px_rgba(255,117,24,0.4)]'
                        : 'bg-[#140C1D] border-[#6A0DAD]/40 text-[#8C8494] hover:text-[#FF7518] hover:border-[#FF7518]/60'
                    }`}
                  >
                    <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-[#FF7518]' : ''}`} />
                  </button>

                  <span className="text-[11px] font-mono text-[#8C8494]">
                    {track.durationFormatted}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isCurrent) {
                        onTogglePlay();
                      } else {
                        onSelectTrack(track);
                      }
                    }}
                    aria-label={isPlayingThis ? 'Pause' : 'Lire'}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      isPlayingThis
                        ? 'bg-[#39FF14] text-[#0B0B0B] shadow-[0_0_14px_#39FF14]'
                        : 'bg-gradient-to-br from-[#FF8822] to-[#D45500] text-[#0B0B0B] hover:scale-105 shadow-[0_0_12px_rgba(255,117,24,0.4)]'
                    }`}
                  >
                    {isPlayingThis ? (
                      <Pause className="w-4 h-4 fill-current" />
                    ) : (
                      <Play className="w-4 h-4 fill-current translate-x-0.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Ambiance Littéraire de la Piste Active */}
              {isCurrent && track.loreText && (
                <div className="px-3 pb-3 -mt-0.5 pt-2 border-t border-[#6A0DAD]/30 text-left relative z-10 bg-[#0E0817]/60">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[9px] font-mono text-[#39FF14] font-semibold">
                      Chronique de Geoffroy Streit (Hylst)
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playEctoClick();
                        spectralNarrator.toggle(track.loreText!, track.title);
                      }}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-mono text-[9px] font-bold border transition-all cursor-pointer ${
                        narratorState.isSpeaking && narratorState.currentText === track.loreText
                          ? 'bg-[#39FF14] text-black border-[#39FF14] shadow-[0_0_12px_#39FF14] animate-pulse'
                          : 'bg-[#1C122C] text-[#DFB7FF] border-[#6A0DAD]/70 hover:border-[#39FF14] hover:text-[#39FF14]'
                      }`}
                      title="Écouter la chronique en voix off spectrale (local)"
                    >
                      <Mic className="w-3 h-3" />
                      <span>
                        {narratorState.isSpeaking && narratorState.currentText === track.loreText
                          ? 'Voix Active...'
                          : 'Voix des Ombres'}
                      </span>
                    </button>
                  </div>
                  <p className="text-[11px] font-serif italic text-[#E2D8CE] leading-relaxed">
                    « {track.loreText} »
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mini-Lecteur Persistant "Chaudron Actif" */}
      <VictorianIronworkCard highlightGlow="green" className="p-3.5 shadow-[0_0_20px_rgba(57,255,20,0.25)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-2.5 h-2.5 rounded-full bg-[#39FF14] animate-ping flex-shrink-0" />
            <div className="truncate">
              <span className="text-[9px] font-mono uppercase tracking-widest text-[#39FF14] font-bold block">
                Chaudron Actif
              </span>
              <span className="font-syne font-bold text-xs text-[#E6E1DC] truncate block">
                {currentTrack.title} en lévitation...
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-shrink-0">
            <span className="text-xs font-mono text-[#8C8494] px-1" title="Boucle infinie">
              ∞
            </span>
            <button
              onClick={() => {
                playEctoClick();
                onTogglePlay();
              }}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#FF7518] to-[#FF9030] hover:brightness-110 text-black font-syne font-bold text-xs flex items-center gap-1.5 shadow-[0_0_14px_rgba(255,117,24,0.45)] transition-all cursor-pointer border border-[#FFB060]/50"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>Chaudron</span>
            </button>
          </div>
        </div>
      </VictorianIronworkCard>
    </div>
  );
};
