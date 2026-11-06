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
import { InfoSection } from './components/InfoSection';
import { ConcertVisualizerModal } from './components/ConcertVisualizerModal';
import { AudioConfigModal } from './components/AudioConfigModal';
import { GothicCobwebCorner, DrippingBloodAccent } from './components/GothicDecorations';
import { GothicCreaturesOverlay } from './components/GothicCreaturesOverlay';
import { CryptLoader } from './components/CryptLoader';
import { audioEngine, DEFAULT_TRACKS, TrackMetadata } from './audio/audioEngine';
import { getTrackLore } from './audio/trackLore';
import { setSfxMuted } from './audio/sfx';

// Code-splitting React.lazy() pour les ecrans secondaires lourds (Three.js, Canvas, etc.)
const HauntedManor3D = React.lazy(() =>
  import('./components/HauntedManor3D').then((m) => ({ default: m.HauntedManor3D }))
);
const BestiaireOmbre = React.lazy(() =>
  import('./components/BestiaireOmbre').then((m) => ({ default: m.BestiaireOmbre }))
);
const HalloweenBeatPad = React.lazy(() =>
  import('./components/HalloweenBeatPad').then((m) => ({ default: m.HalloweenBeatPad }))
);
const MiniGamesHub = React.lazy(() =>
  import('./components/MiniGamesHub').then((m) => ({ default: m.MiniGamesHub }))
);
const GrimoireLegendes = React.lazy(() =>
  import('./components/GrimoireLegendes').then((m) => ({ default: m.GrimoireLegendes }))
);
const SanctuaireHylst = React.lazy(() =>
  import('./components/SanctuaireHylst').then((m) => ({ default: m.SanctuaireHylst }))
);
const EnigmesCrypte = React.lazy(() =>
  import('./components/EnigmesCrypte').then((m) => ({ default: m.EnigmesCrypte }))
);

const VALID_SCREENS: ScreenId[] = [
  'crypte',
  'lecteur',
  'caveau',
  'studio',
  'massacre',
  'manoir',
  'bestiaire',
  'enigmes',
  'legendes',
  'sanctuaire',
  'info',
];

const getScreenFromHash = (): ScreenId | null => {
  if (typeof window === 'undefined') return null;
  const hash = window.location.hash.replace(/^#\/?/, '').trim().toLowerCase() as ScreenId;
  return VALID_SCREENS.includes(hash) ? hash : null;
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>(() => getScreenFromHash() || 'crypte');
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(() => audioEngine.isSoundMuted());
  const [horrorLevel, setHorrorLevel] = useState<1 | 2 | 3>(1);
  const [tracks, setTracks] = useState<TrackMetadata[]>(DEFAULT_TRACKS);
  const [currentTrack, setCurrentTrack] = useState<TrackMetadata>(() => audioEngine.getCurrentTrack());
  const [highScore, setHighScore] = useState<number>(6660);
  const [isConfigOpen, setIsConfigOpen] = useState<boolean>(false);
  const [isConcertOpen, setIsConcertOpen] = useState<boolean>(false);

  // Synchronisation du hash URL (deep-linking et boutons precedent/suivant navigateur)
  useEffect(() => {
    const handleHashChange = () => {
      const screen = getScreenFromHash();
      if (screen && screen !== currentScreen) {
        setCurrentScreen(screen);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [currentScreen]);

  // Initialisation et gestion des abonnements audio
  useEffect(() => {
    // Verifier parametre ?autostart=1 pour les tests automatises
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      audioEngine.playTrack(DEFAULT_TRACKS[0]);
      setCurrentScreen('lecteur');
      window.history.replaceState(null, '', '#lecteur');
    }

    // Charger les URLs ou records sauvegardes en local
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
          const savedSlug = localStorage.getItem('spookybeats_last_track');
          const found = savedSlug ? enriched.find((t: TrackMetadata) => t.slug === savedSlug) : null;
          setTracks(enriched);
          if (found) {
            setCurrentTrack(found);
          } else if (enriched.length > 0) {
            setCurrentTrack(enriched[0]);
          }
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
      if (window.location.hash.replace(/^#\/?/, '') !== newScreen) {
        window.history.pushState(null, '', `#${newScreen}`);
      }
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

      {/* Faune gothique interactive : araignees tisseuses, citrouilles bondissantes, chauves-souris, sorciere */}
      <GothicCreaturesOverlay intensity={horrorLevel} />

      {/* Toiles d'araignees gothiques dans les coins de l'ecran */}
      <GothicCobwebCorner position="top-left" size={72} className="fixed top-0 left-0 z-50 opacity-60" />
      <GothicCobwebCorner position="top-right" size={72} className="fixed top-0 right-0 z-50 opacity-60" />

      {/* En-tete superieur */}
      <Header
        currentScreen={currentScreen}
        isPlaying={isPlaying}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenConfig={() => setIsConfigOpen(true)}
        onOpenConcert={() => setIsConcertOpen(true)}
        horrorLevel={horrorLevel}
      />

      {/* Gouttes de sang stylisees sous le header */}
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
          <React.Suspense fallback={<CryptLoader message="Ouverture du Beat Pad..." subtext="Chargement des synthétiseurs gothiques et percussions" />}>
            <HalloweenBeatPad />
          </React.Suspense>
        )}

        {currentScreen === 'massacre' && (
          <React.Suspense fallback={<CryptLoader message="Préparation des Épreuves..." subtext="Chargement des mini-jeux d'arcade" />}>
            <MiniGamesHub
              isPlaying={isPlaying}
              onStartTrack4={(t) => audioEngine.playTrack(t)}
              gameTrack={tracks[0]}
              highScore={highScore}
              onUpdateHighScore={handleUpdateHighScore}
            />
          </React.Suspense>
        )}

        {currentScreen === 'manoir' && (
          <React.Suspense fallback={<CryptLoader message="Invocation du Manoir 3D..." subtext="Initialisation du moteur Three.js et des spectres" />}>
            <HauntedManor3D />
          </React.Suspense>
        )}

        {currentScreen === 'bestiaire' && (
          <React.Suspense fallback={<CryptLoader message="Éveil du Bestiaire..." subtext="Consultation des 20 créatures des ténèbres" />}>
            <BestiaireOmbre />
          </React.Suspense>
        )}

        {currentScreen === 'enigmes' && (
          <React.Suspense fallback={<CryptLoader message="Déchiffrement des Énigmes..." subtext="Ouverture des grimoires ancestraux" />}>
            <EnigmesCrypte
              tracks={tracks}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              onSelectTrack={handleSelectTrack}
            />
          </React.Suspense>
        )}

        {currentScreen === 'legendes' && (
          <React.Suspense fallback={<CryptLoader message="Ouverture du Grimoire..." subtext="Consultation des légendes et contes occultes" />}>
            <GrimoireLegendes
              tracks={tracks}
              isPlaying={isPlaying}
              onSelectTrack={handleSelectTrack}
            />
          </React.Suspense>
        )}

        {currentScreen === 'sanctuaire' && (
          <React.Suspense fallback={<CryptLoader message="Accès au Sanctuaire..." subtext="Laboratoire sonore et orgue d'Hylst" />}>
            <SanctuaireHylst
              tracks={tracks}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              onSelectTrack={handleSelectTrack}
            />
          </React.Suspense>
        )}

        {currentScreen === 'info' && (
          <InfoSection onNavigate={navigateWithFade} />
        )}
      </main>

      {/* Barre de navigation inferieure gothique */}
      <Navigation currentScreen={currentScreen} onNavigate={navigateWithFade} />

      {/* Mode Concert Plein Ecran */}
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
