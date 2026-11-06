/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Narrateur Spectral Local (Web Speech API)
 * Entièrement autonome, sans aucune dépendance ni API distante payante.
 * Reproduit une diction sépulcrale, grave et envoûtante pour le lore gothique.
 */

export interface SpectralNarratorState {
  isSpeaking: boolean;
  currentText: string | null;
  currentTitle: string | null;
  isSupported: boolean;
}

type StateListener = (state: SpectralNarratorState) => void;

class SpectralNarratorService {
  private utterance: SpeechSynthesisUtterance | null = null;
  private listeners: Set<StateListener> = new Set();
  private state: SpectralNarratorState = {
    isSpeaking: false,
    currentText: null,
    currentTitle: null,
    isSupported: typeof window !== 'undefined' && 'speechSynthesis' in window,
  };

  constructor() {
    if (this.state.isSupported) {
      // Préchargement des voix si disponibles
      try {
        window.speechSynthesis.onvoiceschanged = () => {
          // Voix chargées
        };
      } catch {
        // Ignorer en environnement restreint
      }
    }
  }

  public getState(): SpectralNarratorState {
    return { ...this.state };
  }

  public subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const currentState = this.getState();
    this.listeners.forEach((fn) => {
      try {
        fn(currentState);
      } catch (err) {
        console.error('Erreur listener narrateur spectral:', err);
      }
    });
  }

  private getGothicFrenchVoice(): SpeechSynthesisVoice | null {
    if (!this.state.isSupported) return null;
    try {
      const voices = window.speechSynthesis.getVoices();
      if (!voices || voices.length === 0) return null;

      // 1. Chercher une voix française masculine ou grave
      const frVoices = voices.filter(v => v.lang.startsWith('fr'));
      if (frVoices.length === 0) return voices[0] || null;

      // Priorité aux voix naturelles ou françaises connues
      const preferred = frVoices.find(v => 
        /thomas|paul|nicolas|bernard|antoine|françois|natural|google français/i.test(v.name)
      );
      return preferred || frVoices[0];
    } catch {
      return null;
    }
  }

  public speak(text: string, title?: string): boolean {
    if (!this.state.isSupported) {
      console.warn('Synthèse vocale non supportée sur ce navigateur.');
      return false;
    }

    // Si le même texte est déjà en cours de récitation, on stoppe
    if (this.state.isSpeaking && this.state.currentText === text) {
      this.stop();
      return false;
    }

    // Arrêter toute narration précédente
    this.stop();

    try {
      // Nettoyage littéraire du texte
      const sanitized = text
        .replace(/[*_#`~[\]]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (!sanitized) return false;

      const utterance = new SpeechSynthesisUtterance(sanitized);
      const voice = this.getGothicFrenchVoice();
      if (voice) {
        utterance.voice = voice;
      }

      utterance.lang = 'fr-FR';
      // Paramètres sépulcraux : voix grave et rythme solennel
      utterance.pitch = 0.82;
      utterance.rate = 0.88;
      utterance.volume = 1.0;

      utterance.onstart = () => {
        this.state.isSpeaking = true;
        this.state.currentText = text;
        this.state.currentTitle = title || null;
        this.notify();
      };

      utterance.onend = () => {
        this.state.isSpeaking = false;
        this.state.currentText = null;
        this.state.currentTitle = null;
        this.utterance = null;
        this.notify();
      };

      utterance.onerror = () => {
        this.state.isSpeaking = false;
        this.state.currentText = null;
        this.state.currentTitle = null;
        this.utterance = null;
        this.notify();
      };

      this.utterance = utterance;
      window.speechSynthesis.speak(utterance);
      return true;
    } catch (err) {
      console.error('Erreur démarrage synthèse vocale:', err);
      this.state.isSpeaking = false;
      this.notify();
      return false;
    }
  }

  public stop(): void {
    if (!this.state.isSupported) return;
    try {
      window.speechSynthesis.cancel();
    } catch {
      // Ignore
    }
    this.state.isSpeaking = false;
    this.state.currentText = null;
    this.state.currentTitle = null;
    this.utterance = null;
    this.notify();
  }

  public toggle(text: string, title?: string): boolean {
    if (this.state.isSpeaking && this.state.currentText === text) {
      this.stop();
      return false;
    }
    return this.speak(text, title);
  }
}

export const spectralNarrator = new SpectralNarratorService();
