/**
 * Moteur Audio SpookyBeats
 * Pistes réelles MP3 depuis https://hylst.fr/hml/ avec proxy local /hml/
 * Analyseur de fréquences Web Audio pour visualiseur & VU-Mètres
 */

import { getAudioContext, registerMusicPlayingChecker } from './sfx';
import { getTrackLore } from './trackLore';

export interface TrackMetadata {
  id: string;
  slug: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // en secondes
  durationFormatted: string;
  bpm: number;
  key: string;
  genre: string;
  horrorLevel: 1 | 2 | 3;
  url: string;
  coverArt: string;
  lyrics: string[];
  loreText: string;
}

export function resolveAudioUrl(url: string): string {
  // En mode dev local, Vite proxyfie /hml/ vers https://hylst.fr/hml/ pour contourner CORS
  // En production statique (Coolify Nginx), charger directement depuis https://hylst.fr/hml/
  const isDev = Boolean(typeof import.meta !== 'undefined' && import.meta.env?.DEV);
  if (isDev && url.startsWith('https://hylst.fr/hml/')) {
    return url.replace('https://hylst.fr/hml/', '/hml/');
  }
  return url;
}

// Ordre par défaut strictement respecté selon les consignes :
// 1. the_umbral_descent
// 2. haunted_cello_chamber
// 3. l_eveil_des_lycanthropes
// 4. shadows_of_dread
// 5. haunted_manor
// 6. blood_moon_ritual
// 7. gare_aux_sorcieres
// puis les autres
const RAW_TRACKS: Omit<TrackMetadata, 'loreText'>[] = [
  {
    id: 'track-1',
    slug: 'the_umbral_descent',
    title: 'La Descente Ombrale',
    artist: 'Le Puits des Âmes',
    album: 'Sous la Terre Oubliée',
    duration: 210,
    durationFormatted: '03:30',
    bpm: 126,
    key: 'F Mineur',
    genre: 'Descente Sépulcrale',
    horrorLevel: 3,
    url: 'https://hylst.fr/hml/the_umbral_descent.mp3',
    coverArt: 'https://hylst.fr/hml/the_umbral_descent.webp',
    lyrics: [
      "Chaque marche vers le bas fait perdre un souvenir de la lumière.",
      "Plus profond encore, là où même les monstres ont peur.",
      "L'abysse s'ouvre sous nos pas silencieux.",
    ],
  },
  {
    id: 'track-2',
    slug: 'haunted_cello_chamber',
    title: 'La Chambre au Violoncelle Hanté',
    artist: 'Le Fantôme Soliste',
    album: 'Symphonie Funeste',
    duration: 234,
    durationFormatted: '03:54',
    bpm: 115,
    key: 'C Mineur',
    genre: 'Chambre Sépulcrale',
    horrorLevel: 2,
    url: 'https://hylst.fr/hml/haunted_cello_chamber.mp3',
    coverArt: 'https://hylst.fr/hml/haunted_cello_chamber.webp',
    lyrics: [
      "Les cordes résonnent sans qu'aucune main ne les touche.",
      "Une mélodie funèbre traverse le parquet grinçant.",
      "L'archet spectral pleure les disparus.",
    ],
  },
  {
    id: 'track-3',
    slug: 'l_eveil_des_lycanthropes',
    title: "L'Éveil des Lycanthropes",
    artist: 'Meute Sanglante',
    album: 'Pleine Lune Sauvage',
    duration: 205,
    durationFormatted: '03:25',
    bpm: 145,
    key: 'E Mineur',
    genre: 'Darkwave Sauvage',
    horrorLevel: 2,
    url: 'https://hylst.fr/hml/l_eveil_des_lycanthropes.mp3',
    coverArt: 'https://hylst.fr/hml/l_eveil_des_lycanthropes.webp',
    lyrics: [
      "Un hurlement déchire la canopée brumeuse !",
      "Leurs griffes s'enfoncent dans la terre trempée de rosée.",
      "Fuyez la forêt avant que la meute ne vous rattrape !",
    ],
  },
  {
    id: 'track-4',
    slug: 'shadows_of_dread',
    title: "Les Ombres de l'Effroi",
    artist: 'Nocturne Phantoms',
    album: 'Spectres Urbains',
    duration: 225,
    durationFormatted: '03:45',
    bpm: 134,
    key: 'B Mineur',
    genre: 'Dark Synthwave',
    horrorLevel: 2,
    url: 'https://hylst.fr/hml/shadows_of_dread.mp3',
    coverArt: 'https://hylst.fr/hml/shadows_of_dread.webp',
    lyrics: [
      "Les ombres s'étirent et prennent forme humaine sous le réverbère.",
      "Un beat implacable pulse dans les ruelles désertes.",
      "La terreur s'infiltre dans chaque recoin.",
    ],
  },
  {
    id: 'track-5',
    slug: 'haunted_manor',
    title: 'Le Manoir Hanté',
    artist: 'La Crypte Sépulcrale',
    album: 'Rituel Nocturne N°XIII',
    duration: 220,
    durationFormatted: '03:40',
    bpm: 128,
    key: 'D Mineur',
    genre: 'Ambiance Gothique',
    horrorLevel: 1,
    url: 'https://hylst.fr/hml/haunted_manor.mp3',
    coverArt: 'https://hylst.fr/hml/haunted_manor.webp',
    lyrics: [
      "Les portes claquent dans les courants d'air spectraux.",
      "Les chandeliers s'allument d'une flamme violette.",
      "Entrez sans crainte... mais vous ne repartirez plus.",
    ],
  },
  {
    id: 'track-6',
    slug: 'blood_moon_ritual',
    title: 'Le Rituel de la Lune de Sang',
    artist: 'The Blood Coven',
    album: 'Éclipse Écarlate',
    duration: 210,
    durationFormatted: '03:30',
    bpm: 130,
    key: 'D Mineur',
    genre: 'Rituel Occulte',
    horrorLevel: 3,
    url: 'https://hylst.fr/hml/blood_moon_ritual.mp3',
    coverArt: 'https://hylst.fr/hml/blood_moon_ritual.webp',
    lyrics: [
      "La comète rougit le ciel d'un éclat sanglant.",
      "Les calices d'argent se remplissent au pied de l'autel.",
      "Invoquez l'ombre éternelle, que la nuit nous consume !",
    ],
  },
  {
    id: 'track-7',
    slug: 'gare_aux_sorcieres',
    title: 'Gare aux Sorcières',
    artist: 'Le Sabbat de Minuit',
    album: 'Chaudron Électrique',
    duration: 198,
    durationFormatted: '03:18',
    bpm: 140,
    key: 'B Mineur',
    genre: 'Potion Pop & Synth',
    horrorLevel: 1,
    url: 'https://hylst.fr/hml/gare_aux_sorcieres.mp3',
    coverArt: 'https://hylst.fr/hml/gare_aux_sorcieres.webp',
    lyrics: [
      "Vol au-dessus des cheminées sous la lune moqueuse !",
      "Un rire strident éclate dans la tempête d'automne.",
      "Prenez garde voyageur, leur breuvage ensorcelle !",
    ],
  },
  // Les autres pistes de la collection :
  {
    id: 'track-8',
    slug: '2_villagers_died_this_night',
    title: '2 Villageois Morts Cette Nuit',
    artist: 'Chroniques du Sépulcre',
    album: 'Le Village Maudit',
    duration: 215,
    durationFormatted: '03:35',
    bpm: 132,
    key: 'D# Mineur',
    genre: 'Dark Fantasy',
    horrorLevel: 2,
    url: 'https://hylst.fr/hml/2_villagers_died_this_night.mp3',
    coverArt: 'https://hylst.fr/hml/2_villagers_died_this_night.webp',
    lyrics: [
      "Le clocher sonne deux coups funèbres dans le brouillard...",
      "Deux villageois ne se réveilleront plus jamais.",
      "Le loup et l'ombre rodent autour des chaumières.",
    ],
  },
  {
    id: 'track-9',
    slug: 'ancient_dragon_s_lament',
    title: 'La Complainte du Dragon Ancien',
    artist: 'Draco Mortis',
    album: 'Cendres & Écailles',
    duration: 240,
    durationFormatted: '04:00',
    bpm: 120,
    key: 'C Mineur',
    genre: 'Dark Fantasy Épique',
    horrorLevel: 2,
    url: 'https://hylst.fr/hml/ancient_dragon_s_lament.mp3',
    coverArt: 'https://hylst.fr/hml/ancient_dragon_s_lament.webp',
    lyrics: [
      "Dans les cavernes de soufre résonne son chant séculaire...",
      "Un feu millénaire s'éteint dans l'abysse de pierre.",
    ],
  },
  {
    id: 'track-10',
    slug: 'awakening_of_the_titan',
    title: "L'Éveil du Titan",
    artist: 'Colosses de Granit',
    album: 'Cataclysme Primordial',
    duration: 228,
    durationFormatted: '03:48',
    bpm: 138,
    key: 'F# Mineur',
    genre: 'Synthwave Sombre',
    horrorLevel: 3,
    url: 'https://hylst.fr/hml/awakening_of_the_titan.mp3',
    coverArt: 'https://hylst.fr/hml/awakening_of_the_titan.webp',
    lyrics: [
      "La terre tremble, les cryptes se fendent en deux !",
      "Le géant oublié ouvre son œil d'ectoplasme.",
    ],
  },
  {
    id: 'track-11',
    slug: 'darkness_claims_its_throne',
    title: 'Les Ténèbres Réclament Leur Trône',
    artist: 'Seigneurs d’Obsidienne',
    album: 'La Couronne Déchue',
    duration: 252,
    durationFormatted: '04:12',
    bpm: 136,
    key: 'G# Mineur',
    genre: 'Gothique Royal',
    horrorLevel: 3,
    url: 'https://hylst.fr/hml/darkness_claims_its_throne.mp3',
    coverArt: 'https://hylst.fr/hml/darkness_claims_its_throne.webp',
    lyrics: [
      "Le trône de marbre noir ne reste jamais vide.",
      "Les spectres des rois déchus prêtent serment d'allégeance.",
    ],
  },
  {
    id: 'track-12',
    slug: 'echoes_of_the_forgotten',
    title: 'Les Échos des Oubliés',
    artist: 'Âmes Errantes',
    album: 'Le Purgatoire Silencieux',
    duration: 195,
    durationFormatted: '03:15',
    bpm: 110,
    key: 'A Mineur',
    genre: 'Ambiance Funèbre',
    horrorLevel: 1,
    url: 'https://hylst.fr/hml/echoes_of_the_forgotten.mp3',
    coverArt: 'https://hylst.fr/hml/echoes_of_the_forgotten.webp',
    lyrics: [
      "Des murmures glissent le long des catacombes oubliées.",
      "Ne fermez pas les yeux, le vent porte leurs noms.",
    ],
  },
  {
    id: 'track-13',
    slug: 'esoteric_procession',
    title: 'La Procession Ésotérique',
    artist: 'Ordre de la Nuit Noire',
    album: 'Les Liturgies Obscures',
    duration: 218,
    durationFormatted: '03:38',
    bpm: 124,
    key: 'E Mineur',
    genre: 'Cérémonie Mystique',
    horrorLevel: 2,
    url: 'https://hylst.fr/hml/esoteric_procession.mp3',
    coverArt: 'https://hylst.fr/hml/esoteric_procession.webp',
    lyrics: [
      "Cierges de cire noire levés vers les cieux voilés.",
      "Leurs pas lents mesurent le temps jusqu'au grand sacrifice.",
    ],
  },
  {
    id: 'track-14',
    slug: 'la_marche_des_corps_silencieux',
    title: 'La Marche des Corps Silencieux',
    artist: 'Légion des Squelettes',
    album: 'Litanies du Sépulcre',
    duration: 245,
    durationFormatted: '04:05',
    bpm: 112,
    key: 'A Mineur',
    genre: 'Marche Funèbre',
    horrorLevel: 2,
    url: 'https://hylst.fr/hml/la_marche_des_corps_silencieux.mp3',
    coverArt: 'https://hylst.fr/hml/la_marche_des_corps_silencieux.webp',
    lyrics: [
      "Pas à pas dans le brouillard opaque du cimetière...",
      "Aucun mot, aucun souffle, seulement le cliquetis des os.",
    ],
  },
  {
    id: 'track-15',
    slug: 'la_marche_des_possedes',
    title: 'La Marche des Possédés',
    artist: 'Danse Macabre',
    album: 'Possession Immédiate',
    duration: 212,
    durationFormatted: '03:32',
    bpm: 138,
    key: 'D# Mineur',
    genre: 'Synthwave Possédée',
    horrorLevel: 3,
    url: 'https://hylst.fr/hml/la_marche_des_possedes.mp3',
    coverArt: 'https://hylst.fr/hml/la_marche_des_possedes.webp',
    lyrics: [
      "Leurs yeux s'illuminent d'une lueur phosphorescente.",
      "Le beat mécanique dirige leurs mouvements désarticulés.",
    ],
  },
  {
    id: 'track-16',
    slug: 'la_peste_noire',
    title: 'La Peste Noire',
    artist: 'Le Médecin au Masque de Corbeau',
    album: 'Linceul d’Ombre',
    duration: 260,
    durationFormatted: '04:20',
    bpm: 105,
    key: 'C# Mineur',
    genre: 'Dark Drone Médiéval',
    horrorLevel: 3,
    url: 'https://hylst.fr/hml/la_peste_noire.mp3',
    coverArt: 'https://hylst.fr/hml/la_peste_noire.webp',
    lyrics: [
      "Le masque de cuir filtre l'odeur des herbes brûlées.",
      "Le glas tinte pour chaque porte marquée d'une croix rouge.",
    ],
  },
  {
    id: 'track-17',
    slug: 'le_cantique_des_profondeurs',
    title: 'Le Cantique des Profondeurs',
    artist: 'Abysses Ancestraux',
    album: 'La Fosse sans Fond',
    duration: 238,
    durationFormatted: '03:58',
    bpm: 118,
    key: 'G Mineur',
    genre: 'Orgue Maudit',
    horrorLevel: 3,
    url: 'https://hylst.fr/hml/le_cantique_des_profondeurs.mp3',
    coverArt: 'https://hylst.fr/hml/le_cantique_des_profondeurs.webp',
    lyrics: [
      "Des tuyaux d'orgue titanesques dorment au fond de l'océan noir.",
      "Chaque accord fait vibrer la cage thoracique des mortels.",
    ],
  },
  {
    id: 'track-18',
    slug: 'through_haunted_halls',
    title: 'À Travers les Couloirs Hantés',
    artist: 'Spectres du Labyrinthe',
    album: 'Dédale Sépulcral',
    duration: 202,
    durationFormatted: '03:22',
    bpm: 122,
    key: 'D Mineur',
    genre: 'Ambiance Mystérieuse',
    horrorLevel: 1,
    url: 'https://hylst.fr/hml/through_haunted_halls.mp3',
    coverArt: 'https://hylst.fr/hml/through_haunted_halls.webp',
    lyrics: [
      "Les portraits muraux suivent chacun de vos pas.",
      "Des portes dérobées s'ouvrent sur le vide infini.",
    ],
  },
  {
    id: 'track-19',
    slug: 'treacherous_echoes',
    title: 'Les Échos Perfides',
    artist: 'Illusionniste Noir',
    album: 'Miroirs Brisés',
    duration: 216,
    durationFormatted: '03:36',
    bpm: 135,
    key: 'E Mineur',
    genre: 'Synthwave Occulte',
    horrorLevel: 2,
    url: 'https://hylst.fr/hml/treacherous_echoes.mp3',
    coverArt: 'https://hylst.fr/hml/treacherous_echoes.webp',
    lyrics: [
      "Votre propre voix vous répond avec un rire cruel...",
      "Dans cette salle des échos, chaque son est un piège mortel.",
    ],
  },
];

export const DEFAULT_TRACKS: TrackMetadata[] = RAW_TRACKS.map((track) => ({
  ...track,
  loreText: getTrackLore(track.slug),
}));

class AudioEngine {
  private audioCtx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private spatialPanner: StereoPannerNode | null = null;
  private isSpatial8D: boolean = false;
  private spatialAngle: number = 0;
  private spatialAnimId: number | null = null;

  // Rack DSP : Égaliseur 3 bandes & Réverbération
  private eqLowNode: BiquadFilterNode | null = null;
  private eqMidNode: BiquadFilterNode | null = null;
  private eqHighNode: BiquadFilterNode | null = null;
  private eqLowGain: number = 0; // -12dB à +12dB
  private eqMidGain: number = 0;
  private eqHighGain: number = 0;
  private reverbNode: ConvolverNode | DelayNode | null = null;
  private reverbWetGain: GainNode | null = null;
  private reverbLevel: number = 0.2; // 0 à 1

  private currentAudioElement: HTMLAudioElement | null = null;
  private currentSourceNode: MediaElementAudioSourceNode | null = null;
  private fadeToken: number = 0;
  private pendingTrackChange: TrackMetadata | null = null;
  private currentTrack: TrackMetadata = DEFAULT_TRACKS[0];
  private isPlaying: boolean = false;
  private isMuted: boolean = false;
  private volume: number = 0.85;
  private isCathédraleReverb: boolean = false;
  private isShuffle: boolean = false;
  private isLoop: boolean = true;
  private recordingDest: MediaStreamAudioDestinationNode | null = null;

  // Listeners
  private onTrackChangeCallbacks: ((track: TrackMetadata) => void)[] = [];
  private onPlayStateChangeCallbacks: ((isPlaying: boolean) => void)[] = [];
  private onTimeUpdateCallbacks: ((currentTime: number, duration: number) => void)[] = [];

  constructor() {
    if (typeof localStorage !== 'undefined') {
      try {
        const savedVol = localStorage.getItem('spookybeats_volume');
        if (savedVol !== null) {
          const v = parseFloat(savedVol);
          if (!isNaN(v) && v >= 0 && v <= 1) this.volume = v;
        }
        const savedShuffle = localStorage.getItem('spookybeats_shuffle');
        if (savedShuffle !== null) {
          this.isShuffle = savedShuffle === '1';
        }
        const savedLoop = localStorage.getItem('spookybeats_loop');
        if (savedLoop !== null) {
          this.isLoop = savedLoop === '1';
        }
        const savedSlug = localStorage.getItem('spookybeats_last_track');
        if (savedSlug) {
          const found = DEFAULT_TRACKS.find(t => t.slug === savedSlug);
          if (found) {
            this.currentTrack = found;
          }
        }
      } catch (e) {
        // Ignorer les erreurs d'acces au stockage local
      }
    }
  }

  public init() {
    if (this.audioCtx) return;
    const ctx = getAudioContext();
    this.audioCtx = ctx;

    this.masterGain = ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.volume, ctx.currentTime);

    // Initialisation des filtres d'égalisation
    this.eqLowNode = ctx.createBiquadFilter();
    this.eqLowNode.type = 'lowshelf';
    this.eqLowNode.frequency.setValueAtTime(120, ctx.currentTime);
    this.eqLowNode.gain.setValueAtTime(this.eqLowGain, ctx.currentTime);

    this.eqMidNode = ctx.createBiquadFilter();
    this.eqMidNode.type = 'peaking';
    this.eqMidNode.frequency.setValueAtTime(1200, ctx.currentTime);
    this.eqMidNode.Q.setValueAtTime(1.0, ctx.currentTime);
    this.eqMidNode.gain.setValueAtTime(this.eqMidGain, ctx.currentTime);

    this.eqHighNode = ctx.createBiquadFilter();
    this.eqHighNode.type = 'highshelf';
    this.eqHighNode.frequency.setValueAtTime(6000, ctx.currentTime);
    this.eqHighNode.gain.setValueAtTime(this.eqHighGain, ctx.currentTime);

    // Réverbération de crypte / cathédrale
    const delay = ctx.createDelay();
    delay.delayTime.setValueAtTime(0.045, ctx.currentTime);
    this.reverbNode = delay;

    this.reverbWetGain = ctx.createGain();
    this.reverbWetGain.gain.setValueAtTime(this.reverbLevel, ctx.currentTime);

    this.analyser = ctx.createAnalyser();
    this.analyser.fftSize = 128;
    this.analyser.smoothingTimeConstant = 0.82;

    // Chaîne audio :
    // MasterGain -> EQLow -> EQMid -> EQHigh -> SpatialPanner -> Analyser -> Destination
    // Parallèle reverb : EQHigh -> Delay -> ReverbWetGain -> Analyser
    this.masterGain.connect(this.eqLowNode);
    this.eqLowNode.connect(this.eqMidNode);
    this.eqMidNode.connect(this.eqHighNode);

    if (ctx.createStereoPanner) {
      this.spatialPanner = ctx.createStereoPanner();
      this.eqHighNode.connect(this.spatialPanner);
      this.spatialPanner.connect(this.analyser);
    } else {
      this.eqHighNode.connect(this.analyser);
    }

    // Connexion boucle de réverbération
    this.eqHighNode.connect(delay);
    delay.connect(this.reverbWetGain);
    this.reverbWetGain.connect(this.analyser);

    this.analyser.connect(ctx.destination);
  }

  public setEqualizer(low: number, mid: number, high: number) {
    this.eqLowGain = Math.max(-14, Math.min(14, low));
    this.eqMidGain = Math.max(-14, Math.min(14, mid));
    this.eqHighGain = Math.max(-14, Math.min(14, high));

    if (this.audioCtx) {
      const now = this.audioCtx.currentTime;
      if (this.eqLowNode) this.eqLowNode.gain.setValueAtTime(this.eqLowGain, now);
      if (this.eqMidNode) this.eqMidNode.gain.setValueAtTime(this.eqMidGain, now);
      if (this.eqHighNode) this.eqHighNode.gain.setValueAtTime(this.eqHighGain, now);
    }
  }

  public getEqualizer(): { low: number; mid: number; high: number } {
    return { low: this.eqLowGain, mid: this.eqMidGain, high: this.eqHighGain };
  }

  public setReverbLevel(level: number) {
    this.reverbLevel = Math.max(0, Math.min(1, level));
    if (this.audioCtx && this.reverbWetGain) {
      this.reverbWetGain.gain.setValueAtTime(this.reverbLevel, this.audioCtx.currentTime);
    }
  }

  public getReverbLevel(): number {
    return this.reverbLevel;
  }

  public getCurrentTime(): number {
    return this.currentAudioElement?.currentTime || 0;
  }

  public getDuration(): number {
    return this.currentAudioElement?.duration || this.currentTrack.duration;
  }

  public getAnalyser(): AnalyserNode | null {
    if (!this.analyser) {
      this.init();
    }
    return this.analyser;
  }

  public getRecordingDestination(): MediaStreamAudioDestinationNode | null {
    if (!this.audioCtx) {
      this.init();
    }
    if (!this.audioCtx) return null;

    if (!this.recordingDest) {
      try {
        this.recordingDest = this.audioCtx.createMediaStreamDestination();
        if (this.analyser) {
          this.analyser.connect(this.recordingDest);
        }
      } catch (err) {
        console.warn('MediaStreamDestination not supported', err);
        return null;
      }
    }
    return this.recordingDest;
  }

  public getCurrentTrack(): TrackMetadata {
    return this.currentTrack;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getVolume(): number {
    return this.volume;
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.currentAudioElement) {
      this.currentAudioElement.volume = this.isMuted ? 0 : this.volume;
    }
    if (this.masterGain && this.audioCtx && !this.isMuted) {
      this.masterGain.gain.setValueAtTime(this.volume, this.audioCtx.currentTime);
    }
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('spookybeats_volume', this.volume.toString());
      } catch (e) {
        // ignore
      }
    }
  }

  public setShuffle(enabled: boolean) {
    this.isShuffle = enabled;
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('spookybeats_shuffle', enabled ? '1' : '0');
      } catch (e) {
        // ignore
      }
    }
  }

  public getIsShuffle(): boolean {
    return this.isShuffle;
  }

  public setLoop(enabled: boolean) {
    this.isLoop = enabled;
    if (this.currentAudioElement) {
      this.currentAudioElement.loop = enabled;
    }
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('spookybeats_loop', enabled ? '1' : '0');
      } catch (e) {
        // ignore
      }
    }
  }

  public getIsLoop(): boolean {
    return this.isLoop;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.currentAudioElement) {
      this.currentAudioElement.muted = this.isMuted;
      // Si la piste a ete creee pendant une coupure, son volume peut etre a 0 :
      // on le restaure explicitement au retour du son.
      if (!this.isMuted) {
        this.currentAudioElement.volume = this.volume;
      }
    }
    if (this.masterGain && this.audioCtx) {
      const target = this.isMuted ? 0 : this.volume;
      this.masterGain.gain.setValueAtTime(target, this.audioCtx.currentTime);
    }
    return this.isMuted;
  }

  public isSoundMuted(): boolean {
    return this.isMuted;
  }

  public toggle8D(): boolean {
    this.isSpatial8D = !this.isSpatial8D;
    if (this.isSpatial8D) {
      this.start8DLoop();
    } else {
      if (this.spatialAnimId) cancelAnimationFrame(this.spatialAnimId);
      if (this.spatialPanner && this.audioCtx) {
        this.spatialPanner.pan.setValueAtTime(0, this.audioCtx.currentTime);
      }
    }
    return this.isSpatial8D;
  }

  public getIs8D(): boolean {
    return this.isSpatial8D;
  }

  private start8DLoop() {
    if (!this.isSpatial8D || !this.spatialPanner || !this.audioCtx) return;
    this.spatialAngle += 0.015;
    const panValue = Math.sin(this.spatialAngle);
    this.spatialPanner.pan.setValueAtTime(panValue, this.audioCtx.currentTime);
    this.spatialAnimId = requestAnimationFrame(() => this.start8DLoop());
  }

  public toggleCathedrale(): boolean {
    this.isCathédraleReverb = !this.isCathédraleReverb;
    return this.isCathédraleReverb;
  }

  public getIsCathedrale(): boolean {
    return this.isCathédraleReverb;
  }

  /**
   * Joue une piste avec transition fluide
   */
  public playTrack(track: TrackMetadata) {
    this.init();
    this.currentTrack = track;
    this.pendingTrackChange = null;
    this.notifyTrackChange(track);
    this.updateMediaSession(track);
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('spookybeats_last_track', track.slug);
      } catch (e) {
        // ignore
      }
    }

    if (this.currentAudioElement && this.isPlaying) {
      this.crossfadeToNewTrack(track);
    } else {
      this.startAudioTrack(track);
    }
  }

  private crossfadeToNewTrack(newTrack: TrackMetadata) {
    const fadeDuration = 500; // ms
    const current = this.currentAudioElement;

    if (!current) {
      this.startAudioTrack(newTrack);
      return;
    }

    // Jeton : un clic rapide sur une autre piste annule le fondu en cours
    const token = ++this.fadeToken;
    this.pendingTrackChange = newTrack;
    const startedAt = performance.now();
    const initialVol = current.volume;

    const fade = () => {
      if (token !== this.fadeToken) return; // un autre fondu a pris le relais
      const progress = Math.min(1, (performance.now() - startedAt) / fadeDuration);
      if (progress < 1) {
        current.volume = Math.max(0, initialVol * (1 - progress));
        // setTimeout plutot que setInterval : resiste au throttling des onglets en arriere-plan
        setTimeout(fade, 50);
      } else {
        current.volume = 0;
        this.pendingTrackChange = null;
        this.stopCurrentAudio();
        this.startAudioTrack(newTrack);
      }
    };
    setTimeout(fade, 50);
  }

  private startAudioTrack(track: TrackMetadata, autoplay: boolean = true) {
    this.stopCurrentAudio();

    // Résolution URL : utilise /hml/ en priorité (proxy même origine) pour permettre l'analyseur audio
    const resolvedUrl = resolveAudioUrl(track.url);

    const audio = new Audio();
    // Pas de crossOrigin anonymous forcé qui bloquerait la lecture MP3
    audio.src = resolvedUrl;
    audio.loop = this.isLoop;
    audio.volume = this.volume;
    audio.muted = this.isMuted;
    this.currentAudioElement = audio;

    audio.addEventListener('timeupdate', () => {
      if (this.currentAudioElement !== audio) return;
      this.notifyTimeUpdate(audio.currentTime, audio.duration || track.duration);
    });

    audio.addEventListener('ended', () => {
      if (this.currentAudioElement !== audio) return;
      if (!this.isLoop) {
        this.nextTrack();
      }
    });

    audio.addEventListener('error', (e) => {
      // Ignore les erreurs d'une piste deja remplacee : vider le src d'un element
      // declenche un event "error" qui, sans ce garde-fou, relancait l'ancienne piste
      // par-dessus la nouvelle. C'etait la cause de la cacophonie.
      if (this.currentAudioElement !== audio) return;
      console.warn(`Erreur de lecture sur ${resolvedUrl}, tentative avec URL directe ${track.url}`, e);
      if (audio.src !== track.url) {
        audio.src = track.url;
        audio.play().catch(() => {
          this.isPlaying = false;
          this.notifyPlayState(false);
        });
      } else {
        this.isPlaying = false;
        this.notifyPlayState(false);
      }
    });

    this.connectSourceNode(audio, resolvedUrl);

    if (!autoplay) {
      // Piste chargee mais volontairement silencieuse (pause demandee pendant un fondu)
      this.isPlaying = false;
      this.notifyPlayState(false);
      return;
    }

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          // La piste a pu etre remplacee pendant le chargement : on ne touche a rien
          if (this.currentAudioElement !== audio) return;
          this.isPlaying = true;
          this.notifyPlayState(true);
        })
        .catch((err) => {
          console.warn('Autoplay bloqué en attente de clic utilisateur:', err);
          this.isPlaying = false;
          this.notifyPlayState(false);
        });
    }
  }

  /**
   * Raccordement à l'analyseur de spectre, uniquement si la ressource est de même origine.
   * Une ressource cross-origin branchée sur createMediaElementSource deviendrait muette
   * (flux CORS-tainted), donc on la laisse sortir directement par le haut-parleur HTML5.
   */
  private connectSourceNode(audio: HTMLAudioElement, resolvedUrl: string) {
    try {
      const isSameOrigin = typeof window !== 'undefined' && (
        resolvedUrl.startsWith('/') ||
        resolvedUrl.startsWith(window.location.origin)
      );
      if (isSameOrigin && this.audioCtx && this.masterGain && !this.currentSourceNode) {
        const source = this.audioCtx.createMediaElementSource(audio);
        source.connect(this.masterGain);
        this.currentSourceNode = source;
      }
    } catch (e) {
      // Si le routage Web Audio échoue (sécurité navigateur), le flux audio HTML5 continue quand même
      console.debug('Connexion MediaElementSource bypassée:', e);
    }
  }

  public togglePlayPause() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  public play() {
    this.init();
    if (this.currentAudioElement) {
      this.currentAudioElement.play().then(() => {
        this.isPlaying = true;
        this.notifyPlayState(true);
      }).catch((err) => {
        console.warn('Erreur lecture audio:', err);
      });
    } else {
      this.playTrack(this.currentTrack);
    }
  }

  public pause() {
    this.isPlaying = false;
    this.notifyPlayState(false);

    // Pause pendant un fondu : on arrete net l'ancienne piste et on charge la nouvelle
    // sans la jouer, pour que "reprendre" lance bien la piste selectionnee.
    if (this.pendingTrackChange) {
      const pending = this.pendingTrackChange;
      this.pendingTrackChange = null;
      this.fadeToken++;
      this.stopCurrentAudio();
      this.startAudioTrack(pending, false);
      return;
    }

    if (this.currentAudioElement) {
      this.currentAudioElement.pause();
    }
  }

  public seek(seconds: number) {
    if (this.currentAudioElement && !isNaN(this.currentAudioElement.duration)) {
      this.currentAudioElement.currentTime = seconds;
    }
  }

  public nextTrack(tracks: TrackMetadata[] = DEFAULT_TRACKS) {
    if (tracks.length === 0) return;
    if (this.isShuffle && tracks.length > 1) {
      const curIdx = tracks.findIndex(t => t.id === this.currentTrack.id);
      let nextIdx = Math.floor(Math.random() * tracks.length);
      if (nextIdx === curIdx) {
        nextIdx = (nextIdx + 1) % tracks.length;
      }
      this.playTrack(tracks[nextIdx]);
    } else {
      const idx = tracks.findIndex(t => t.id === this.currentTrack.id);
      const nextIdx = (idx + 1) % tracks.length;
      this.playTrack(tracks[nextIdx]);
    }
  }

  public prevTrack(tracks: TrackMetadata[] = DEFAULT_TRACKS) {
    if (tracks.length === 0) return;
    if (this.isShuffle && tracks.length > 1) {
      const curIdx = tracks.findIndex(t => t.id === this.currentTrack.id);
      let prevIdx = Math.floor(Math.random() * tracks.length);
      if (prevIdx === curIdx) {
        prevIdx = (prevIdx - 1 + tracks.length) % tracks.length;
      }
      this.playTrack(tracks[prevIdx]);
    } else {
      const idx = tracks.findIndex(t => t.id === this.currentTrack.id);
      const prevIdx = (idx - 1 + tracks.length) % tracks.length;
      this.playTrack(tracks[prevIdx]);
    }
  }

  private stopCurrentAudio() {
    const audio = this.currentAudioElement;
    // On detache d'abord la reference : les handlers (error, timeupdate) ignores ainsi
    // les evenements tardifs de l'element qu'on est en train de jeter.
    this.currentAudioElement = null;
    this.fadeToken++;

    if (audio) {
      try {
        audio.pause();
        audio.removeAttribute('src');
        audio.load(); // libere le tampon reseau
      } catch (e) {
        // ignore
      }
    }

    if (this.currentSourceNode) {
      try {
        this.currentSourceNode.disconnect();
      } catch (e) {
        // ignore
      }
      this.currentSourceNode = null;
    }
  }

  // Abonnements
  public onTrackChange(cb: (track: TrackMetadata) => void) {
    this.onTrackChangeCallbacks.push(cb);
    return () => {
      this.onTrackChangeCallbacks = this.onTrackChangeCallbacks.filter(c => c !== cb);
    };
  }

  public onPlayStateChange(cb: (isPlaying: boolean) => void) {
    this.onPlayStateChangeCallbacks.push(cb);
    return () => {
      this.onPlayStateChangeCallbacks = this.onPlayStateChangeCallbacks.filter(c => c !== cb);
    };
  }

  public onTimeUpdate(cb: (cur: number, dur: number) => void) {
    this.onTimeUpdateCallbacks.push(cb);
    return () => {
      this.onTimeUpdateCallbacks = this.onTimeUpdateCallbacks.filter(c => c !== cb);
    };
  }

  private notifyTrackChange(track: TrackMetadata) {
    this.onTrackChangeCallbacks.forEach(cb => cb(track));
  }

  private notifyPlayState(isPlaying: boolean) {
    if (typeof navigator !== 'undefined' && 'mediaSession' in navigator) {
      try {
        navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
      } catch (e) {
        // ignore
      }
    }
    this.onPlayStateChangeCallbacks.forEach(cb => cb(isPlaying));
  }

  private updateMediaSession(track: TrackMetadata) {
    if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return;
    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist: `${track.artist} (Hylst)`,
        album: track.album || 'SpookyBeats',
        artwork: [
          { src: track.coverArt, sizes: '512x512', type: 'image/webp' },
        ],
      });

      navigator.mediaSession.setActionHandler('play', () => {
        this.play();
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        this.pause();
      });
      navigator.mediaSession.setActionHandler('previoustrack', () => {
        this.prevTrack();
      });
      navigator.mediaSession.setActionHandler('nexttrack', () => {
        this.nextTrack();
      });
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime !== undefined && details.seekTime !== null) {
          this.seek(details.seekTime);
        }
      });
    } catch (e) {
      // ignore
    }
  }

  private notifyTimeUpdate(cur: number, dur: number) {
    this.onTimeUpdateCallbacks.forEach(cb => cb(cur, dur));
  }
}

export const audioEngine = new AudioEngine();
registerMusicPlayingChecker(() => audioEngine.getIsPlaying());
