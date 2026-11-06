/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navigation, ScreenId } from './components/Navigation';
import { BackgroundFog } from './components/BackgroundFog';
import { CryptHome } from './components/CryptHome';
import { PhantomPlayer } from './components/PhantomPlayer';
import { SoundVault } from './components/SoundVault';
import { MiniGamesHub } from './components/MiniGamesHub';
import { GrimoireLegendes } from './components/GrimoireLegendes';
import { SanctuaireHylst } from './components/SanctuaireHylst';
import { HauntedManor3D } from './components/HauntedManor3D';
import { InfoSection } from './components/InfoSection';
import { HalloweenBeatPad } from './components/HalloweenBeatPad';
import { BestiaireOmbre } from './components/BestiaireOmbre';
import { EnigmesCrypte } from './components/EnigmesCrypte';
import { ConcertVisualizerModal } from './components/ConcertVisualizerModal';
import { AudioConfigModal } from './components/AudioConfigModal';
import { GothicCobwebCorner, DrippingBloodAccent } from './components/GothicDecorations';
import { GothicCreaturesOverlay } from './components/GothicCreaturesOverlay';
import { audioEngine, DEFAULT_TRACKS, TrackMetadata } from './audio/audioEngine';
import { getTrackLore } from './audio/trackLore';
import { setSfxMuted, playDoorCreak } from './audio/sfx';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('crypte');
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [horrorLevel, setHorrorLevel] = useState<1 | 2 | 3>(1);
  const [tracks, setTracks] = useState<TrackMetadata[]>(DEFAULT_TRACKS);
  const [currentTrack, setCurrentTrack] = useState<TrackMetadata>(DEFAULT_TRACKS[0]);
  const [highScore, setHighScore] = useState<number>(6660);
  const [isConfigOpen, setIsConfigOpen] = useState<boolean>(false);
  const [isConcertOpen, setIsConcertOpen] = useState<boolean>(false);

  // Initialisation et gestion des abonnements audio
  useEffect(() => {
    // Vérifier paramètre ?autostart=1 pour les tests automatisés
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      audioEngine.playTrack(DEFAULT_TRACKS[0]);
      setCurrentScreen('lecteur');
    }

    // Charger les URLs ou records sauvegardés en local
    const savedHighScore = localStorage.getItem('spookybeats_high_score');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }

    const savedTracks = localStorage.getItem('spookybeats_custom_tracks');
    if (savedTracks) {
      try {
        const parsed = JSON.parse(savedTracks);
        // Validation souple : au moins 1 piste valide avec le bon slug initial
        if (Array.isArray(parsed) && parsed.length >= 1 && parsed[0]?.slug === 'the_umbral_descent') {
          const enriched = parsed.map((t: TrackMetadata) => ({
            ...t,
            loreText: t.loreText || getTrackLore(t.slug),
          }));
          setTracks(enriched);
          if (enriched.length > 0) setCurrentTrack(enriched[0]);
        } else {
          setTracks(DEFAULT_TRACKS);
          setCurrentTrack(DEFAULT_TRACKS[0]);
          localStorage.removeItem('spookybeats_custom_tracks');
        }
      } catch (e) {
        setTracks(DEFAULT_TRACKS);
      }
    }

    const unsubTrack = audioEngine.onTrackChange((t) => setCurrentTrack(t));
    const unsubPlay = audioEngine.onPlayStateChange((playing) => setIsPlaying(playing));

    return () => {
      unsubTrack();
      unsubPlay();
    };
  }, []);

  // Transition fluide de type "fondu au noir spectral"
  const navigateWithFade = (newScreen: ScreenId) => {
    if (newScreen === currentScreen) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentScreen(newScreen);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
        setIsTransitioning(false);
      }, 180);
    }, 220);
  };

  const handleEnterCrypt = () => {
    audioEngine.playTrack(tracks[0]);
    navigateWithFade('lecteur');
  };

  const handleTogglePlay = () => {
    audioEngine.togglePlayPause();
  };

  const handleNextTrack = () => {
    audioEngine.nextTrack(tracks);
  };

  const handlePrevTrack = () => {
    audioEngine.prevTrack(tracks);
  };

  const handleSelectTrack = (track: TrackMetadata) => {
    audioEngine.playTrack(track);
  };

  const handleToggleMute = () => {
    const muted = audioEngine.toggleMute();
    setIsMuted(muted);
    setSfxMuted(muted);
  };

  const handleSaveTracks = (updated: TrackMetadata[]) => {
    setTracks(updated);
    localStorage.setItem('spookybeats_custom_tracks', JSON.stringify(updated));
    const currentUpdated = updated.find((t) => t.id === currentTrack.id) || updated[0];
    setCurrentTrack(currentUpdated);
  };

  const handleUpdateHighScore = (newScore: number) => {
    setHighScore(newScore);
    localStorage.setItem('spookybeats_high_score', newScore.toString());
  };

  // Ambiance visuelle en fonction du niveau d'effroi (potions)
  const horrorFilterClass =
    horrorLevel === 3
      ? 'contrast-125 brightness-90 shadow-[inset_0_0_80px_rgba(106,13,173,0.4)]'
      : horrorLevel === 2
      ? 'contrast-110 shadow-[inset_0_0_50px_rgba(255,117,24,0.25)]'
      : '';

  return (
    <div
      className={`min-h-screen bg-[#0B0B0B] text-[#E6E1DC] flex flex-col relative overflow-x-hidden selection:bg-[#FF7518] selection:text-black ${horrorFilterClass}`}
    >
      {/* Fond de brume spectrale, esprits et chauves-souris en Canvas */}
      <BackgroundFog intensity={horrorLevel} />

      {/* Faune gothique interactive : araignées tisseuses, citrouilles bondissantes, chauves-souris, sorcière */}
      <GothicCreaturesOverlay intensity={horrorLevel} />

      {/* Toiles d'araignées gothiques dans les coins de l'écran */}
      <GothicCobwebCorner position="top-left" size={72} className="fixed top-0 left-0 z-50 opacity-60" />
      <GothicCobwebCorner position="top-right" size={72} className="fixed top-0 right-0 z-50 opacity-60" />

      {/* En-tête supérieur */}
      <Header
        currentScreen={currentScreen}
        isPlaying={isPlaying}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenConfig={() => setIsConfigOpen(true)}
        onOpenConcert={() => setIsConcertOpen(true)}
        horrorLevel={horrorLevel}
      />

      {/* Gouttes de sang stylisées sous le header */}
      <DrippingBloodAccent className="sticky top-[57px] z-30" />

      {/* Conteneur principal avec transition en fondu spectral */}
      <main
        className={`flex-1 w-full ${
          currentScreen === 'bestiaire' ||
          currentScreen === 'studio' ||
          currentScreen === 'manoir' ||
          currentScreen === 'massacre' ||
          currentScreen === 'legendes' ||
          currentScreen === 'sanctuaire'
            ? 'max-w-4xl'
            : 'max-w-lg'
        } mx-auto px-4 pt-3 pb-24 relative z-10 transition-all duration-300 ${
          isTransitioning ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        {currentScreen === 'crypte' && (
          <CryptHome
            isPlaying={isPlaying}
            onEnterCrypt={handleEnterCrypt}
            onNavigate={navigateWithFade}
            onSelectTrack={handleSelectTrack}
            tracks={tracks}
            highScore={highScore}
          />
        )}

        {currentScreen === 'lecteur' && (
          <PhantomPlayer
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onTogglePlay={handleTogglePlay}
            onNext={handleNextTrack}
            onPrev={handlePrevTrack}
          />
        )}

        {currentScreen === 'caveau' && (
          <SoundVault
            tracks={tracks}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onSelectTrack={handleSelectTrack}
            onTogglePlay={handleTogglePlay}
            horrorLevel={horrorLevel}
            onChangeHorrorLevel={setHorrorLevel}
          />
        )}

        {currentScreen === 'studio' && (
          <HalloweenBeatPad />
        )}

        {currentScreen === 'massacre' && (
          <MiniGamesHub
            isPlaying={isPlaying}
            onStartTrack4={(t) => audioEngine.playTrack(t)}
            gameTrack={tracks[0]}
            highScore={highScore}
            onUpdateHighScore={handleUpdateHighScore}
          />
        )}

        {currentScreen === 'manoir' && (
          <HauntedManor3D />
        )}

        {currentScreen === 'bestiaire' && (
          <BestiaireOmbre />
        )}

        {currentScreen === 'enigmes' && (
          <EnigmesCrypte
            tracks={tracks}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onSelectTrack={handleSelectTrack}
          />
        )}

        {currentScreen === 'legendes' && (
          <GrimoireLegendes
            tracks={tracks}
            isPlaying={isPlaying}
            onSelectTrack={handleSelectTrack}
          />
        )}

        {currentScreen === 'sanctuaire' && (
          <SanctuaireHylst
            tracks={tracks}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onSelectTrack={handleSelectTrack}
          />
        )}

        {currentScreen === 'info' && (
          <InfoSection onNavigate={navigateWithFade} />
        )}
      </main>

      {/* Barre de navigation inférieure gothique */}
      <Navigation currentScreen={currentScreen} onNavigate={navigateWithFade} />

      {/* Mode Concert Plein Écran */}
      <ConcertVisualizerModal
        isOpen={isConcertOpen}
        onClose={() => setIsConcertOpen(false)}
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onNext={handleNextTrack}
        onPrev={handlePrevTrack}
      />

      {/* Modale de configuration des URLs MP3 */}
      <AudioConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        tracks={tracks}
        onSaveTracks={handleSaveTracks}
        onTestTrack={handleSelectTrack}
      />
    </div>
  );
}
