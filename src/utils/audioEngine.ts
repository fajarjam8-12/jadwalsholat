/**
 * Audio Engine for "Demi Waktu"
 * Supports realistic recorded MP3/MPEG Adzan audio file as default,
 * with zero-dependency Web Audio API procedural synthesis fallback.
 */

export const DEFAULT_ADZAN_AUDIO_PATH = '/assets/aistudio/WhatsApp_Audio_2026-10-27_at_16.01.07_7b041e01.mpeg';
export const CUSTOM_ADZAN_STORAGE_KEY = 'demi_waktu_custom_adzan_audio';

export type AdzanSoundType =
  | 'adzan_default'
  | 'adzan_custom'
  | 'adzan_melodic'
  | 'bedug_takbir'
  | 'adzan_short'
  | 'soft_chime';

class AudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private activeNodes: { stop?: () => void; disconnect?: () => void }[] = [];
  private currentVolume: number = 0.85;
  private unlocked: boolean = false;
  private currentAudioEl: HTMLAudioElement | null = null;
  private customAudioDataUrl: string | null = null;

  constructor() {
    this.loadCustomAudioFromStorage();
  }

  public loadCustomAudioFromStorage() {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(CUSTOM_ADZAN_STORAGE_KEY);
        if (stored) {
          this.customAudioDataUrl = stored;
        }
      }
    } catch (e) {
      console.warn('Error reading custom adzan audio from storage:', e);
    }
  }

  public setCustomAudio(dataUrl: string, name?: string) {
    this.customAudioDataUrl = dataUrl;
    try {
      localStorage.setItem(CUSTOM_ADZAN_STORAGE_KEY, dataUrl);
      if (name) {
        localStorage.setItem(CUSTOM_ADZAN_STORAGE_KEY + '_name', name);
      }
    } catch (e) {
      console.warn('Failed saving custom audio to localStorage (file might be too large):', e);
    }
  }

  public getCustomAudioName(): string | null {
    try {
      return localStorage.getItem(CUSTOM_ADZAN_STORAGE_KEY + '_name') || 'Audio Adzan Kustom';
    } catch {
      return null;
    }
  }

  public hasCustomAudio(): boolean {
    return !!this.customAudioDataUrl;
  }

  public removeCustomAudio() {
    this.customAudioDataUrl = null;
    try {
      localStorage.removeItem(CUSTOM_ADZAN_STORAGE_KEY);
      localStorage.removeItem(CUSTOM_ADZAN_STORAGE_KEY + '_name');
    } catch {}
  }

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /**
   * Unlock AudioContext on first user interaction (required by mobile browsers/Android WebView)
   */
  public unlockAudio() {
    if (this.unlocked) return;
    try {
      const ctx = this.getContext();
      const buffer = ctx.createBuffer(1, 1, 22050);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);
      this.unlocked = true;
    } catch (e) {
      // ignore
    }
  }

  public setVolume(vol: number) {
    this.currentVolume = Math.max(0, Math.min(1, vol));
    if (this.currentAudioEl) {
      try {
        this.currentAudioEl.volume = this.currentVolume;
      } catch {}
    }
  }

  public getVolume(): number {
    return this.currentVolume;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public stopAll() {
    this.isPlaying = false;
    if (this.currentAudioEl) {
      try {
        this.currentAudioEl.pause();
        this.currentAudioEl.currentTime = 0;
        this.currentAudioEl = null;
      } catch {}
    }
    for (const node of this.activeNodes) {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (e) {
        // ignore already stopped
      }
    }
    this.activeNodes = [];
  }

  /**
   * Play vibration feedback on supported Android / mobile devices
   */
  public triggerVibration(pattern: number[] = [300, 150, 400, 150, 600]) {
    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(pattern);
      }
    } catch {}
  }

  /**
   * Play selected adzan/alert sound (defaults to recorded adzan_default)
   */
  public async playSound(type: AdzanSoundType = 'adzan_default', onEnded?: () => void) {
    this.stopAll();
    this.unlockAudio();
    this.isPlaying = true;
    this.triggerVibration();

    const ctx = this.getContext();
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.currentVolume, ctx.currentTime);
    masterGain.connect(ctx.destination);

    switch (type) {
      case 'adzan_custom':
        if (this.customAudioDataUrl) {
          this.playAdzanAudioFile(this.customAudioDataUrl, masterGain, onEnded);
        } else {
          this.playAdzanAudioFile(DEFAULT_ADZAN_AUDIO_PATH, masterGain, onEnded);
        }
        break;
      case 'adzan_default':
        this.playAdzanAudioFile(DEFAULT_ADZAN_AUDIO_PATH, masterGain, onEnded);
        break;
      case 'bedug_takbir':
        this.playBedugTakbir(ctx, masterGain, onEnded);
        break;
      case 'adzan_short':
        this.playAdzanShort(ctx, masterGain, onEnded);
        break;
      case 'soft_chime':
        this.playSoftChime(ctx, masterGain, onEnded);
        break;
      case 'adzan_melodic':
      default:
        this.playAdzanMelodic(ctx, masterGain, onEnded);
        break;
    }
  }

  /**
   * Plays the default recorded Adzan audio file
   * Features graceful fallback to melodic procedural synthesis if offline or blocked
   */
  private playAdzanAudioFile(url: string, destination: GainNode, onEnded?: () => void) {
    try {
      const audio = new Audio(url);
      this.currentAudioEl = audio;
      audio.volume = this.currentVolume;
      audio.preload = 'auto';

      let isFinished = false;
      const finishPlayback = () => {
        if (isFinished) return;
        isFinished = true;
        if (this.currentAudioEl === audio) {
          this.currentAudioEl = null;
        }
        this.isPlaying = false;
        if (onEnded) onEnded();
      };

      audio.onended = finishPlayback;
      audio.onerror = (e) => {
        console.warn('Audio element error, falling back to melodic synth:', e);
        if (this.isPlaying && this.currentAudioEl === audio) {
          this.currentAudioEl = null;
          this.playAdzanMelodic(this.getContext(), destination, onEnded);
        }
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Audio play was prevented by browser policy, falling back to WebAudio synth:', err);
          if (this.isPlaying && this.currentAudioEl === audio) {
            this.currentAudioEl = null;
            this.playAdzanMelodic(this.getContext(), destination, onEnded);
          }
        });
      }
    } catch (err) {
      console.warn('Failed to initialize Audio element, falling back to WebAudio:', err);
      this.playAdzanMelodic(this.getContext(), destination, onEnded);
    }
  }

  /**
   * Synthesize resonant traditional Mosque Bedug (Nusantara Drum)
   */
  private playBedugTakbir(ctx: AudioContext, destination: GainNode, onEnded?: () => void) {
    const startTime = ctx.currentTime;
    // Rhythm pattern: strike - pause - strike - strike - double-thump
    const strikeTimes = [0, 0.6, 1.2, 1.7, 2.3, 2.7, 3.1, 3.8, 4.4, 5.0, 5.6];

    strikeTimes.forEach((t) => {
      const strikeStart = startTime + t;

      // Deep drum shell resonance (35-70 Hz)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';

      // Pitch drop for realistic membrane physics
      osc.frequency.setValueAtTime(95, strikeStart);
      osc.frequency.exponentialRampToValueAtTime(42, strikeStart + 0.09);

      // Amplitude envelope
      gain.gain.setValueAtTime(0, strikeStart);
      gain.gain.linearRampToValueAtTime(0.85, strikeStart + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, strikeStart + 0.55);

      // Lowpass filter for deep wooden acoustic timbre
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, strikeStart);

      osc.connect(gain);
      gain.connect(filter);
      filter.connect(destination);

      osc.start(strikeStart);
      osc.stop(strikeStart + 0.6);
      this.activeNodes.push(osc, gain, filter);
    });

    const totalDuration = 6.2;
    setTimeout(() => {
      if (this.isPlaying) {
        this.isPlaying = false;
        if (onEnded) onEnded();
      }
    }, totalDuration * 1000);
  }

  /**
   * Melodic Adzan synthesis (Bayati/Hijaz vocal overtones & microtonal inflections)
   */
  private playAdzanMelodic(ctx: AudioContext, destination: GainNode, onEnded?: () => void) {
    const startTime = ctx.currentTime + 0.1;

    // Adzan phrase notes sequence: "Allahu Akbar..."
    // Musical frequencies approximating Maqam Hijaz/Bayati (D4 root around 293 Hz)
    // D4 (293.66), Eb4 (311.13), F#4 (369.99), G4 (392.00), A4 (440.00), Bb4 (466.16)
    const melody: { f: number; dur: number; bendTo?: number }[] = [
      // Al-laa-hu
      { f: 293.66, dur: 0.9, bendTo: 311.13 },
      { f: 369.99, dur: 1.2, bendTo: 392.00 },
      // Ak-bar
      { f: 440.00, dur: 1.5, bendTo: 415.30 },
      { f: 369.99, dur: 1.8, bendTo: 293.66 },

      // Pause / breath
      { f: 0, dur: 0.5 },

      // Al-laa-hu (second repetition)
      { f: 293.66, dur: 0.8, bendTo: 329.63 },
      { f: 369.99, dur: 1.1, bendTo: 392.00 },
      // Ak-bar
      { f: 440.00, dur: 1.6, bendTo: 466.16 },
      { f: 392.00, dur: 1.2, bendTo: 369.99 },
      { f: 293.66, dur: 2.2, bendTo: 293.66 },

      // Pause
      { f: 0, dur: 0.6 },

      // Ash-hadu an laa ilaaha illallaah
      { f: 369.99, dur: 1.2, bendTo: 392.00 },
      { f: 440.00, dur: 1.4, bendTo: 466.16 },
      { f: 440.00, dur: 1.2, bendTo: 392.00 },
      { f: 369.99, dur: 1.5, bendTo: 311.13 },
      { f: 293.66, dur: 2.8, bendTo: 293.66 },
    ];

    let currentT = startTime;

    melody.forEach((note) => {
      if (note.f > 0) {
        // Dual harmonic oscillator to synthesize rich resonant vocal formants
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const subOsc = ctx.createOscillator();

        const noteGain = ctx.createGain();
        const formantFilter = ctx.createBiquadFilter();

        osc1.type = 'sawtooth';
        osc2.type = 'triangle';
        subOsc.type = 'sine';

        // Frequency with smooth vocal bend
        osc1.frequency.setValueAtTime(note.f, currentT);
        osc2.frequency.setValueAtTime(note.f * 1.002, currentT); // slight detune for chorus warmth
        subOsc.frequency.setValueAtTime(note.f / 2, currentT);

        if (note.bendTo) {
          osc1.frequency.linearRampToValueAtTime(note.bendTo, currentT + note.dur * 0.75);
          osc2.frequency.linearRampToValueAtTime(note.bendTo * 1.002, currentT + note.dur * 0.75);
        }

        // Formant filter (emulates human vocal tract vowel 'A' and 'U')
        formantFilter.type = 'bandpass';
        formantFilter.frequency.setValueAtTime(750, currentT);
        formantFilter.Q.setValueAtTime(3.5, currentT);

        // Vocal envelope
        noteGain.gain.setValueAtTime(0, currentT);
        noteGain.gain.linearRampToValueAtTime(0.5, currentT + 0.12);
        noteGain.gain.setValueAtTime(0.45, currentT + note.dur - 0.15);
        noteGain.gain.linearRampToValueAtTime(0.001, currentT + note.dur);

        // Connect
        osc1.connect(formantFilter);
        osc2.connect(formantFilter);
        subOsc.connect(noteGain);
        formantFilter.connect(noteGain);
        noteGain.connect(destination);

        osc1.start(currentT);
        osc2.start(currentT);
        subOsc.start(currentT);

        const stopT = currentT + note.dur;
        osc1.stop(stopT);
        osc2.stop(stopT);
        subOsc.stop(stopT);

        this.activeNodes.push(osc1, osc2, subOsc, noteGain, formantFilter);
      }
      currentT += note.dur;
    });

    const totalSeconds = currentT - startTime + 0.5;
    setTimeout(() => {
      if (this.isPlaying) {
        this.isPlaying = false;
        if (onEnded) onEnded();
      }
    }, totalSeconds * 1000);
  }

  /**
   * Short 4-second Takbir Call
   */
  private playAdzanShort(ctx: AudioContext, destination: GainNode, onEnded?: () => void) {
    const startTime = ctx.currentTime + 0.05;
    const notes = [
      { f: 293.66, dur: 0.7, bend: 329.63 },
      { f: 369.99, dur: 0.9, bend: 392.00 },
      { f: 440.00, dur: 1.1, bend: 415.30 },
      { f: 369.99, dur: 1.4, bend: 293.66 },
    ];

    let t = startTime;
    notes.forEach((n) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, t);
      osc.frequency.linearRampToValueAtTime(n.bend, t + n.dur * 0.8);

      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.6, t + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, t + n.dur);

      osc.connect(gain);
      gain.connect(destination);

      osc.start(t);
      osc.stop(t + n.dur);
      this.activeNodes.push(osc, gain);
      t += n.dur;
    });

    setTimeout(() => {
      if (this.isPlaying) {
        this.isPlaying = false;
        if (onEnded) onEnded();
      }
    }, (t - startTime + 0.3) * 1000);
  }

  /**
   * Soft Chime (Gentle Bell/Kalimba for offices)
   */
  private playSoftChime(ctx: AudioContext, destination: GainNode, onEnded?: () => void) {
    const startTime = ctx.currentTime + 0.05;
    const chords = [523.25, 659.25, 783.99, 1046.5]; // C Major arpeggio

    chords.forEach((freq, idx) => {
      const t = startTime + idx * 0.22;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.4, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);

      osc.connect(gain);
      gain.connect(destination);

      osc.start(t);
      osc.stop(t + 1.7);
      this.activeNodes.push(osc, gain);
    });

    setTimeout(() => {
      if (this.isPlaying) {
        this.isPlaying = false;
        if (onEnded) onEnded();
      }
    }, 2800);
  }
}

export const audioEngine = new AudioEngine();
