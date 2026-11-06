import React, { useState } from 'react';
import { X, Save, RotateCcw, Music, Play, Check } from 'lucide-react';
import { TrackMetadata, DEFAULT_TRACKS } from '../audio/audioEngine';
import { playEctoClick } from '../audio/sfx';

interface AudioConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  tracks: TrackMetadata[];
  onSaveTracks: (updatedTracks: TrackMetadata[]) => void;
  onTestTrack: (track: TrackMetadata) => void;
}

export const AudioConfigModal: React.FC<AudioConfigModalProps> = ({
  isOpen,
  onClose,
  tracks,
  onSaveTracks,
  onTestTrack,
}) => {
  const [urls, setUrls] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    tracks.forEach((t) => {
      map[t.id] = t.url;
    });
    return map;
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  if (!isOpen) return null;

  const handleChange = (id: string, val: string) => {
    setUrls((prev) => ({ ...prev, [id]: val }));
  };

  const handleSave = () => {
    playEctoClick();
    const updated = tracks.map((t) => {
      if (urls[t.id] !== undefined) {
        return { ...t, url: urls[t.id] };
      }
      return t;
    });
    onSaveTracks(updated);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  const handleReset = () => {
    playEctoClick();
    const map: Record<string, string> = {};
    DEFAULT_TRACKS.forEach((t) => {
      map[t.id] = t.url;
    });
    setUrls(map);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-xl crypt-card border-2 border-[#6A0DAD] p-5 shadow-[0_0_35px_rgba(106,13,173,0.4)] max-h-[90vh] overflow-y-auto">
        {/* En-tête de la modale */}
        <div className="flex justify-between items-center pb-3 border-b border-[#6A0DAD]/40">
          <div className="flex items-center gap-2">
            <Music className="w-5 h-5 text-[#FF7518]" />
            <h3 className="font-syne font-extrabold text-lg text-[#E6E1DC]">
              Configuration des 19 Pistes MP3
            </h3>
          </div>
          <button
            onClick={() => {
              playEctoClick();
              onClose();
            }}
            className="p-1 rounded text-[#8C8494] hover:text-[#E6E1DC] transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Explication */}
        <p className="text-xs font-mono text-[#8C8494] my-3 leading-relaxed">
          Toutes les 19 pistes sont configurées avec vos liens officiels sur{' '}
          <span className="text-[#39FF14]">https://hylst.fr/hml/</span> (.mp3 &amp; .webp). Une seule musique tourne en continu quel que soit l'écran, avec des SFX procéduraux en superposition !
        </p>

        {/* Liste des 19 pistes éditables */}
        <div className="flex flex-col gap-3 my-2 max-h-96 overflow-y-auto pr-1">
          {tracks.map((track, idx) => (
            <div key={track.id} className="rounded-lg bg-[#120E17] border border-[#6A0DAD]/40 p-2.5">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-syne font-bold text-[#E6E1DC] flex items-center gap-1.5 truncate">
                  <span className="text-[10px] font-mono text-[#FF7518]">#{idx + 1}</span>
                  <span className="truncate">{track.title}</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    playEctoClick();
                    onTestTrack({ ...track, url: urls[track.id] || track.url });
                  }}
                  className="text-[10px] font-mono text-[#39FF14] flex items-center gap-1 hover:underline cursor-pointer flex-shrink-0 ml-2"
                >
                  <Play className="w-3 h-3" /> Lire
                </button>
              </div>
              <input
                type="text"
                value={urls[track.id] || ''}
                onChange={(e) => handleChange(track.id, e.target.value)}
                className="w-full text-[11px] font-mono px-2.5 py-1.5 rounded bg-[#0B0B0B] border border-[#6A0DAD]/60 text-[#DFB7FF] focus:outline-none focus:border-[#39FF14]"
              />
            </div>
          ))}
        </div>

        {/* Boutons d'actions */}
        <div className="flex items-center justify-between pt-4 border-t border-[#6A0DAD]/40 mt-3">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded bg-[#1C1424] border border-[#6A0DAD]/50 text-xs font-mono text-[#8C8494] hover:text-[#E6E1DC] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Réinitialiser (hylst.fr)</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2 rounded bg-[#FF7518] hover:bg-[#ff8b38] text-black font-syne font-bold text-xs tracking-wider shadow-[0_0_15px_rgba(255,117,24,0.4)] transition-all cursor-pointer"
          >
            {savedSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{savedSuccess ? 'Enregistré !' : 'Enregistrer'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
