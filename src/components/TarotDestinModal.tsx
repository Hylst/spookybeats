import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  RotateCw,
  Eye,
  Scroll,
  HelpCircle,
  Flame,
  ArrowRight,
  Shuffle,
  Volume2,
} from 'lucide-react';
import {
  TarotCard,
  DrawnCard,
  TarotSpreadType,
  TAROT_CARD_BACK_IMAGE,
  drawTarotSpread,
  interpretTarotSpread,
  getAllTarotCards,
} from '../game/tarotLogic';
import {
  playEctoClick,
  playGoldenFrenzy,
  playDoorCreak,
  playTrapExplosion,
} from '../audio/sfx';
import { spectralNarrator } from '../audio/spectralNarrator';

interface TarotDestinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEnigma: (enigmaId: string) => void;
}

export const TarotDestinModal: React.FC<TarotDestinModalProps> = ({
  isOpen,
  onClose,
  onSelectEnigma,
}) => {
  const [spreadType, setSpreadType] = useState<TarotSpreadType>('single');
  const [cards, setCards] = useState<DrawnCard[]>([]);
  const [isShuffling, setIsShuffling] = useState<boolean>(false);
  const [showGallery, setShowGallery] = useState<boolean>(false);
  const [selectedGalleryCard, setSelectedGalleryCard] = useState<TarotCard | null>(null);

  // Initialisation ou nouveau tirage
  const handleDraw = (type: TarotSpreadType = spreadType) => {
    setIsShuffling(true);
    playDoorCreak(true);
    setTimeout(() => {
      const drawn = drawTarotSpread(type, true);
      setCards(drawn);
      setIsShuffling(false);
    }, 450);
  };

  useEffect(() => {
    if (isOpen && cards.length === 0) {
      handleDraw('single');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Révéler une carte individuelle
  const handleFlipCard = (index: number) => {
    if (cards[index]?.revealed) return;
    playGoldenFrenzy(true);
    setCards((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, revealed: true } : item))
    );
  };

  // Révéler toutes les cartes d'un coup
  const handleRevealAll = () => {
    playGoldenFrenzy(true);
    setCards((prev) => prev.map((item) => ({ ...item, revealed: true })));
  };

  const allRevealed = cards.length > 0 && cards.every((c) => c.revealed);
  const interpretation = interpretTarotSpread(cards);
  const allCards = getAllTarotCards();

  // Lecture à haute voix avec le narrateur spectral
  const handleSpeakProphecy = (text: string) => {
    playEctoClick();
    if (spectralNarrator.getState().isSpeaking) {
      spectralNarrator.stop();
    } else {
      spectralNarrator.speak(text, 'mystique');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-2xl bg-gradient-to-b from-[#180E28] via-[#10071C] to-[#08020E] border-2 border-[#6A0DAD] shadow-[0_0_50px_rgba(106,13,173,0.5)] p-5 sm:p-7 text-[#EADCF8] flex flex-col gap-6 custom-scrollbar">
        {/* Ornements victoriens d'angle */}
        <div className="absolute top-2 left-2 text-[#FF7518]/30 text-xs font-mono select-none">
          ✦ 𝔄𝔯𝔠𝔞𝔫𝔞 𝔉𝔲𝔫𝔢𝔰𝔱𝔞 ✦
        </div>
        <div className="absolute top-2 right-12 text-[#39FF14]/30 text-xs font-mono select-none">
          ✦ ℌ𝔶𝔩𝔰𝔱 𝔒𝔠𝔠𝔲𝔩𝔱 ✦
        </div>

        {/* Bouton Fermer */}
        <button
          onClick={() => {
            playEctoClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-xl bg-[#25133B] hover:bg-[#3B1E5C] text-[#C8C2D4] hover:text-white border border-[#6A0DAD]/60 transition-all cursor-pointer shadow-md"
          title="Refermer le Tirage du Destin"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ============================================================== */}
        {/* EN-TÊTE DU TIRAGE DE TAROT                                     */}
        {/* ============================================================== */}
        <div className="text-center space-y-2 pt-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2E1848]/80 border border-[#FF7518]/50 text-[#FF7518] text-xs font-mono font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(255,117,24,0.3)]">
            <Sparkles className="w-3.5 h-3.5 text-[#39FF14]" />
            <span>Tirage du Destin & Cartes Funestes</span>
            <Sparkles className="w-3.5 h-3.5 text-[#39FF14]" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-[#DFB7FF] via-[#FF7518] to-[#39FF14] tracking-wide">
            Le Tarot Sépulcral de la Crypte
          </h2>

          <p className="text-xs sm:text-sm text-[#A69EAF] max-w-2xl mx-auto italic font-serif">
            « Consultez les arcanes de la nuit pour révéler votre prophétie funeste, obtenir les
            bénédictions sarcastiques des spectres et défier l'énigme qui scelle votre destinée. »
          </p>

          {/* Contrôles de tirage */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <div className="inline-flex p-1 rounded-xl bg-[#0B0314] border border-[#6A0DAD]/60">
              <button
                onClick={() => {
                  playEctoClick();
                  setSpreadType('single');
                  handleDraw('single');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  spreadType === 'single'
                    ? 'bg-[#6A0DAD] text-white shadow-[0_0_12px_rgba(106,13,173,0.6)]'
                    : 'text-[#A69EAF] hover:text-white'
                }`}
              >
                Lame Unique (1 Carte)
              </button>
              <button
                onClick={() => {
                  playEctoClick();
                  setSpreadType('trinity');
                  handleDraw('trinity');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  spreadType === 'trinity'
                    ? 'bg-[#6A0DAD] text-white shadow-[0_0_12px_rgba(106,13,173,0.6)]'
                    : 'text-[#A69EAF] hover:text-white'
                }`}
              >
                Triptyque Funeste (3 Cartes)
              </button>
            </div>

            <button
              onClick={() => handleDraw()}
              disabled={isShuffling}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF7518] to-[#B34700] hover:from-[#FF8C3A] hover:to-[#CC5200] text-black font-mono font-black text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(255,117,24,0.4)] transition-all cursor-pointer disabled:opacity-50"
            >
              <Shuffle className={`w-4 h-4 ${isShuffling ? 'animate-spin' : ''}`} />
              <span>{isShuffling ? 'Battage d’outre-tombe...' : 'Mélanger & Tirer'}</span>
            </button>

            {!allRevealed && (
              <button
                onClick={handleRevealAll}
                className="px-3 py-2 rounded-xl bg-[#241738] hover:bg-[#341F52] border border-[#39FF14]/50 text-[#39FF14] font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Révéler Tout</span>
              </button>
            )}

            <button
              onClick={() => {
                playEctoClick();
                setShowGallery(!showGallery);
              }}
              className="px-3 py-2 rounded-xl bg-[#1C0D2E] hover:bg-[#2E1848] border border-[#DFB7FF]/40 text-[#DFB7FF] font-mono text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Scroll className="w-3.5 h-3.5" />
              <span>{showGallery ? 'Retour au Tirage' : 'Galerie des Arcanes'}</span>
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* VUE GALERIE OU VUE DU TIRAGE ACTIF                              */}
        {/* ============================================================== */}
        {showGallery ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#6A0DAD]/30 pb-2">
              <h3 className="font-serif text-lg font-bold text-[#FF7518]">
                Le Panthéon des 5 Arcanes Majeures d’Hylst
              </h3>
              <span className="text-xs font-mono text-[#A69EAF]">5 / 5 Révélées</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {allCards.map((card) => (
                <div
                  key={card.id}
                  onClick={() => {
                    playEctoClick();
                    setSelectedGalleryCard(card);
                  }}
                  className={`group relative rounded-xl overflow-hidden border-2 transition-all cursor-pointer p-1 bg-[#130920] ${
                    selectedGalleryCard?.id === card.id
                      ? 'border-[#39FF14] shadow-[0_0_20px_#39FF14]'
                      : 'border-[#6A0DAD]/50 hover:border-[#FF7518] hover:scale-103'
                  }`}
                >
                  <img
                    src={card.image}
                    alt={card.name}
                    className="w-full aspect-[2/3] object-cover rounded-lg group-hover:brightness-110 transition-all"
                  />
                  <div className="mt-2 text-center">
                    <span className="text-[10px] font-mono font-bold text-[#FF7518] block">
                      Arcane {card.arcanaNumber}
                    </span>
                    <span className="text-xs font-serif font-bold text-white line-clamp-1">
                      {card.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Fiche détaillée de la carte sélectionnée dans la galerie */}
            {selectedGalleryCard && (
              <div className="p-4 rounded-xl bg-[#1B0E2E]/90 border border-[#FF7518]/60 space-y-3 animate-fadeIn">
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <img
                    src={selectedGalleryCard.image}
                    alt={selectedGalleryCard.name}
                    className="w-28 aspect-[2/3] object-cover rounded-lg border border-[#FF7518]/60 shadow-lg mx-auto sm:mx-0"
                  />
                  <div className="space-y-2 flex-1 text-left">
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif font-black text-lg text-white">
                        {selectedGalleryCard.name} ({selectedGalleryCard.arcanaNumber})
                      </h4>
                      <span className="text-xs font-mono text-[#39FF14] bg-[#39FF14]/10 px-2 py-0.5 rounded border border-[#39FF14]/30">
                        +{selectedGalleryCard.spectralManaReward} Mana
                      </span>
                    </div>
                    <p className="text-xs font-mono text-[#FF7518] italic">
                      « {selectedGalleryCard.latinMotto} » — {selectedGalleryCard.subtitle}
                    </p>
                    <p className="text-xs text-[#EADCF8] font-serif leading-relaxed">
                      <strong className="text-[#39FF14]">Prophétie Droite :</strong>{' '}
                      {selectedGalleryCard.uprightProphecy}
                    </p>
                    <p className="text-xs text-[#EADCF8] font-serif leading-relaxed">
                      <strong className="text-[#FF7518]">Prophétie Inversée :</strong>{' '}
                      {selectedGalleryCard.reversedProphecy}
                    </p>
                    <p className="text-xs text-[#DFB7FF] font-mono italic bg-[#10061E] p-2 rounded-lg border border-[#6A0DAD]/40">
                      💡 <em>Conseil funeste :</em> {selectedGalleryCard.darkHumorAdvice}
                    </p>
                    <button
                      onClick={() => {
                        playEctoClick();
                        onSelectEnigma(selectedGalleryCard.linkedEnigmaId);
                        onClose();
                      }}
                      className="py-1.5 px-3 rounded-lg bg-[#39FF14] text-black text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer hover:bg-[#52FF33] transition-all"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span>Défier l'Énigme liée ({selectedGalleryCard.linkedEnigmaId})</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ============================================================== */
          /* TAPIS DE CARTES INTERACTIF 3D                                  */
          /* ============================================================== */
          <div className="space-y-6">
            <div
              className={`grid gap-5 justify-center ${
                cards.length === 1
                  ? 'grid-cols-1 max-w-sm mx-auto'
                  : 'grid-cols-1 md:grid-cols-3 max-w-4xl mx-auto'
              }`}
            >
              {cards.map((item, index) => {
                const { card, isReversed, positionLabel, positionDescription, revealed } = item;

                return (
                  <div key={`${card.id}-${index}`} className="flex flex-col items-center gap-3">
                    {/* Badge de position */}
                    <div className="text-center">
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#FF7518] block">
                        {positionLabel}
                      </span>
                      <span className="text-[10px] text-[#A69EAF] font-serif italic max-w-xs block">
                        {positionDescription}
                      </span>
                    </div>

                    {/* Carte avec retournement 3D */}
                    <div
                      onClick={() => handleFlipCard(index)}
                      className="group relative w-60 sm:w-64 aspect-[2/3] cursor-pointer select-none [perspective:1200px]"
                      title={revealed ? 'Carte révélée' : 'Cliquez pour retourner cette lame'}
                    >
                      <div
                        className={`w-full h-full duration-700 [transform-style:preserve-3d] transition-transform rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] border-2 ${
                          revealed
                            ? 'border-[#39FF14]/80 shadow-[0_0_25px_rgba(57,255,20,0.4)]'
                            : 'border-[#6A0DAD] hover:border-[#FF7518] hover:shadow-[0_0_20px_rgba(255,117,24,0.5)]'
                        }`}
                        style={{
                          transform: revealed ? 'rotateY(180deg)' : 'rotateY(0deg)',
                        }}
                      >
                        {/* DOS DE CARTE (Face cachée) */}
                        <div className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden [backface-visibility:hidden] bg-[#0E0519] flex flex-col items-center justify-between p-3">
                          <img
                            src={TAROT_CARD_BACK_IMAGE}
                            alt="Dos du Tarot Funeste"
                            className="w-full h-full object-cover rounded-xl"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 flex flex-col items-center justify-end pb-4">
                            <span className="text-xs font-mono font-bold text-[#FF7518] animate-pulse flex items-center gap-1.5 bg-black/70 px-3 py-1 rounded-full border border-[#FF7518]/50">
                              <Sparkles className="w-3.5 h-3.5 text-[#39FF14]" />
                              Toucher pour révéler
                            </span>
                          </div>
                        </div>

                        {/* FACE AVANT DE CARTE (Face révélée) */}
                        <div
                          className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden [backface-visibility:hidden] [transform:rotateY(180deg)] bg-[#10071C] flex flex-col justify-between p-2"
                          style={{
                            transform: `rotateY(180deg) ${isReversed ? 'rotate(180deg)' : ''}`,
                          }}
                        >
                          <img
                            src={card.image}
                            alt={card.name}
                            className="w-full h-full object-cover rounded-xl"
                          />

                          {/* Petit macaron inversé si applicable */}
                          {isReversed && (
                            <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/80 border border-[#FF7518] text-[#FF7518] text-[9px] font-mono font-bold rotate-180">
                              Renversée
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Résumé textuel sous la carte si révélée */}
                    {revealed ? (
                      <div className="w-full max-w-xs space-y-1.5 text-center animate-fadeIn bg-[#150B24] p-3 rounded-xl border border-[#6A0DAD]/40">
                        <div className="flex items-center justify-center gap-1">
                          <span className="text-xs font-mono font-bold text-[#39FF14]">
                            Arcane {card.arcanaNumber}
                          </span>
                          <span className="text-xs text-[#A69EAF]">•</span>
                          <span className="text-xs font-serif font-black text-white">
                            {card.name}
                          </span>
                          {isReversed && (
                            <span className="text-[10px] font-mono text-[#FF7518] font-bold">
                              (Inversée)
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-[#C8C2D4] font-serif italic line-clamp-3">
                          « {isReversed ? card.reversedProphecy : card.uprightProphecy} »
                        </p>

                        <div className="flex items-center justify-center gap-2 pt-1">
                          <button
                            onClick={() =>
                              handleSpeakProphecy(
                                isReversed ? card.reversedProphecy : card.uprightProphecy
                              )
                            }
                            className="p-1 rounded-md bg-[#25133B] hover:bg-[#3B1E5C] text-[#DFB7FF] text-xs flex items-center gap-1 cursor-pointer"
                            title="Écouter la prophétie à haute voix"
                          >
                            <Volume2 className="w-3.5 h-3.5 text-[#39FF14]" />
                            <span className="text-[10px] font-mono">Écouter</span>
                          </button>

                          <button
                            onClick={() => {
                              playEctoClick();
                              onSelectEnigma(card.linkedEnigmaId);
                              onClose();
                            }}
                            className="p-1 px-2 rounded-md bg-[#FF7518] hover:bg-[#FFA05C] text-black text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-all"
                            title="Ouvrir l'énigme liée"
                          >
                            <ArrowRight className="w-3 h-3" />
                            <span>Défier l'Énigme</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-[11px] font-mono text-[#6A0DAD] italic">
                        Arcane scellée par la cire noire...
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ============================================================== */}
            {/* L'ORACLE GLOBAL & CONSEIL SARCASTIQUE                           */}
            {/* ============================================================== */}
            {allRevealed && (
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#210E36] via-[#150824] to-[#210E36] border border-[#39FF14]/50 shadow-[0_0_25px_rgba(57,255,20,0.2)] space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-[#39FF14]/20 text-[#39FF14]">
                      <Sparkles className="w-4 h-4" />
                    </span>
                    <h4 className="font-serif font-black text-base sm:text-lg text-white">
                      {interpretation.overallTitle}
                    </h4>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#FF7518] bg-[#FF7518]/10 px-2.5 py-1 rounded-full border border-[#FF7518]/30">
                    +{interpretation.totalRewardMana} Mana Spectral
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#EADCF8] font-serif leading-relaxed italic">
                  {interpretation.verdict}
                </p>

                {/* Conseils funestes combinés */}
                <div className="p-3 rounded-xl bg-[#0C0315] border border-[#6A0DAD]/40 text-xs font-mono text-[#DFB7FF] flex items-start gap-2">
                  <Flame className="w-4 h-4 text-[#FF7518] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#FF7518]">Avertissement du Fossoyeur :</strong>{' '}
                    {cards.map((c) => c.card.darkHumorAdvice).join(' ')}
                  </div>
                </div>

                {/* Bouton pour défier l'une des énigmes tirées */}
                <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                  {cards.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        playEctoClick();
                        onSelectEnigma(item.card.linkedEnigmaId);
                        onClose();
                      }}
                      className="py-1.5 px-3 rounded-xl bg-[#2E1848] hover:bg-[#43236A] border border-[#39FF14]/60 text-white text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-all hover:scale-102"
                    >
                      <ArrowRight className="w-3.5 h-3.5 text-[#39FF14]" />
                      <span>
                        Défier : {item.card.name} ({item.card.linkedEnigmaId})
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Pied de page du modal */}
        <div className="pt-3 border-t border-[#6A0DAD]/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-[#A69EAF]">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#FF7518]" />
            Illustrations d’Arcanes Majeures conçues sur mesure pour Geoffroy Streit (Hylst)
          </span>

          <button
            onClick={() => {
              playEctoClick();
              onClose();
            }}
            className="px-4 py-1.5 rounded-lg bg-[#241738] hover:bg-[#341F52] text-white cursor-pointer transition-all"
          >
            Fermer le Grimoire
          </button>
        </div>
      </div>
    </div>
  );
};
