/**
 * AudioManager - Manages all audio playback in the D&D campaign manager
 * Uses Web Audio API for precise control and advanced features
 */

export type SoundEffect =
  | 'dice_roll'
  | 'dice_crit_success'
  | 'dice_crit_fail'
  | 'initiative_start'
  | 'initiative_next_turn'
  | 'combatant_added'
  | 'ability_cast'
  | 'map_marker_placed'
  | 'map_marker_removed'
  | 'fog_reveal'
  | 'combat_start'
  | 'combat_end';

export type AmbientTrack =
  | 'tavern'
  | 'dungeon'
  | 'forest'
  | 'combat'
  | 'boss_battle'
  | 'town'
  | 'cave'
  | 'mystical'
  | 'peaceful';

export interface AudioSettings {
  masterVolume: number; // 0-1
  sfxVolume: number; // 0-1
  ambientVolume: number; // 0-1
  enabled: boolean;
  combatMusicEnabled: boolean;
}

export interface SpatialAudioOptions {
  x: number; // -1 (left) to 1 (right)
  y: number; // 0 (close) to 1 (far)
}

class AudioManager {
  private static instance: AudioManager;
  private audioContext: AudioContext | null = null;
  private masterGainNode: GainNode | null = null;
  private sfxGainNode: GainNode | null = null;
  private ambientGainNode: GainNode | null = null;

  private currentAmbientTrack: HTMLAudioElement | null = null;
  private currentAmbientSource: MediaElementAudioSourceNode | null = null;
  private fadingOut = false;

  private settings: AudioSettings = {
    masterVolume: 0.7,
    sfxVolume: 0.8,
    ambientVolume: 0.5,
    enabled: true,
    combatMusicEnabled: true,
  };

  // Sound effect buffer cache
  private soundBuffers: Map<SoundEffect, AudioBuffer> = new Map();

  // Sound effect URLs (these would be replaced with actual audio files)
  private soundEffectUrls: Record<SoundEffect, string> = {
    dice_roll: '/sounds/dice-roll.mp3',
    dice_crit_success: '/sounds/dice-crit-success.mp3',
    dice_crit_fail: '/sounds/dice-crit-fail.mp3',
    initiative_start: '/sounds/initiative-start.mp3',
    initiative_next_turn: '/sounds/initiative-next.mp3',
    combatant_added: '/sounds/combatant-added.mp3',
    ability_cast: '/sounds/ability-cast.mp3',
    map_marker_placed: '/sounds/marker-placed.mp3',
    map_marker_removed: '/sounds/marker-removed.mp3',
    fog_reveal: '/sounds/fog-reveal.mp3',
    combat_start: '/sounds/combat-start.mp3',
    combat_end: '/sounds/combat-end.mp3',
  };

  // Ambient track URLs
  private ambientTrackUrls: Record<AmbientTrack, string> = {
    tavern: '/ambient/tavern.mp3',
    dungeon: '/ambient/dungeon.mp3',
    forest: '/ambient/forest.mp3',
    combat: '/ambient/combat.mp3',
    boss_battle: '/ambient/boss-battle.mp3',
    town: '/ambient/town.mp3',
    cave: '/ambient/cave.mp3',
    mystical: '/ambient/mystical.mp3',
    peaceful: '/ambient/peaceful.mp3',
  };

  private constructor() {
    // Private constructor for singleton pattern
    if (typeof window !== 'undefined') {
      this.initialize();
    }
  }

  /**
   * Get the singleton instance of AudioManager
   */
  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  /**
   * Initialize the Web Audio API context and gain nodes
   */
  private async initialize(): Promise<void> {
    try {
      // Create audio context
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

      // Create gain nodes for volume control
      this.masterGainNode = this.audioContext.createGain();
      this.sfxGainNode = this.audioContext.createGain();
      this.ambientGainNode = this.audioContext.createGain();

      // Connect gain nodes
      this.sfxGainNode.connect(this.masterGainNode);
      this.ambientGainNode.connect(this.masterGainNode);
      this.masterGainNode.connect(this.audioContext.destination);

      // Set initial volumes
      this.masterGainNode.gain.value = this.settings.masterVolume;
      this.sfxGainNode.gain.value = this.settings.sfxVolume;
      this.ambientGainNode.gain.value = this.settings.ambientVolume;

      // Load settings from localStorage
      this.loadSettings();

      console.log('AudioManager initialized');
    } catch (error) {
      console.error('Failed to initialize AudioManager:', error);
    }
  }

  /**
   * Resume audio context (required for browsers that suspend audio context)
   */
  public async resume(): Promise<void> {
    if (this.audioContext?.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  /**
   * Play a sound effect
   */
  public async playSoundEffect(
    effect: SoundEffect,
    options?: { volume?: number; spatial?: SpatialAudioOptions }
  ): Promise<void> {
    if (!this.settings.enabled || !this.audioContext || !this.sfxGainNode) {
      return;
    }

    await this.resume();

    try {
      // Get or load the sound buffer
      let buffer = this.soundBuffers.get(effect);
      if (!buffer) {
        buffer = await this.loadSoundBuffer(effect);
        if (!buffer) return;
        this.soundBuffers.set(effect, buffer);
      }

      // Create source and gain nodes
      const source = this.audioContext.createBufferSource();
      source.buffer = buffer;

      const gainNode = this.audioContext.createGain();
      gainNode.gain.value = options?.volume ?? 1.0;

      // Apply spatial audio if specified
      if (options?.spatial) {
        const panner = this.audioContext.createStereoPanner();
        panner.pan.value = options.spatial.x;

        // Adjust volume based on distance (y)
        const distanceAttenuation = 1 - (options.spatial.y * 0.7); // Max 70% reduction
        gainNode.gain.value *= distanceAttenuation;

        source.connect(panner);
        panner.connect(gainNode);
      } else {
        source.connect(gainNode);
      }

      gainNode.connect(this.sfxGainNode);

      // Play the sound
      source.start(0);
    } catch (error) {
      console.error(`Failed to play sound effect ${effect}:`, error);
    }
  }

  /**
   * Load a sound buffer from URL
   */
  private async loadSoundBuffer(effect: SoundEffect): Promise<AudioBuffer | null> {
    if (!this.audioContext) return null;

    try {
      const url = this.soundEffectUrls[effect];
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      return audioBuffer;
    } catch (error) {
      console.warn(`Failed to load sound effect ${effect}:`, error);
      return null;
    }
  }

  /**
   * Play ambient background music
   */
  public async playAmbientTrack(
    track: AmbientTrack,
    options?: { fadeIn?: number; loop?: boolean }
  ): Promise<void> {
    if (!this.settings.enabled || !this.audioContext || !this.ambientGainNode) {
      return;
    }

    await this.resume();

    const fadeInDuration = options?.fadeIn ?? 2000; // Default 2 second fade
    const loop = options?.loop ?? true;

    // Fade out current track if playing
    if (this.currentAmbientTrack) {
      await this.fadeOutAmbient(1000); // 1 second fade out
    }

    try {
      // Create new audio element
      const audio = new Audio(this.ambientTrackUrls[track]);
      audio.loop = loop;

      // Create media source
      const source = this.audioContext.createMediaElementSource(audio);

      // Create gain node for fade in/out
      const fadeGain = this.audioContext.createGain();
      fadeGain.gain.value = 0; // Start silent

      // Connect audio path
      source.connect(fadeGain);
      fadeGain.connect(this.ambientGainNode);

      // Start playing
      await audio.play();

      // Fade in
      fadeGain.gain.linearRampToValueAtTime(
        1.0,
        this.audioContext.currentTime + (fadeInDuration / 1000)
      );

      // Store references
      this.currentAmbientTrack = audio;
      this.currentAmbientSource = source;

      console.log(`Playing ambient track: ${track}`);
    } catch (error) {
      console.error(`Failed to play ambient track ${track}:`, error);
    }
  }

  /**
   * Fade out and stop current ambient track
   */
  public async fadeOutAmbient(duration: number = 2000): Promise<void> {
    if (!this.currentAmbientTrack || !this.audioContext || this.fadingOut) {
      return;
    }

    this.fadingOut = true;

    try {
      const audio = this.currentAmbientTrack;

      // Get the gain node (should be connected)
      const fadeGain = this.audioContext.createGain();

      // Fade out
      fadeGain.gain.setValueAtTime(1.0, this.audioContext.currentTime);
      fadeGain.gain.linearRampToValueAtTime(
        0.0,
        this.audioContext.currentTime + (duration / 1000)
      );

      // Stop after fade completes
      setTimeout(() => {
        audio.pause();
        audio.currentTime = 0;
        this.currentAmbientTrack = null;
        this.currentAmbientSource = null;
        this.fadingOut = false;
      }, duration);
    } catch (error) {
      console.error('Failed to fade out ambient track:', error);
      this.fadingOut = false;
    }
  }

  /**
   * Stop ambient track immediately
   */
  public stopAmbient(): void {
    if (this.currentAmbientTrack) {
      this.currentAmbientTrack.pause();
      this.currentAmbientTrack.currentTime = 0;
      this.currentAmbientTrack = null;
      this.currentAmbientSource = null;
    }
  }

  /**
   * Toggle combat music based on DM control
   */
  public async toggleCombatMusic(enabled: boolean): Promise<void> {
    this.settings.combatMusicEnabled = enabled;
    this.saveSettings();

    if (enabled) {
      await this.playAmbientTrack('combat', { fadeIn: 1500 });
    } else {
      await this.fadeOutAmbient(1500);
    }
  }

  /**
   * Update master volume
   */
  public setMasterVolume(volume: number): void {
    this.settings.masterVolume = Math.max(0, Math.min(1, volume));
    if (this.masterGainNode) {
      this.masterGainNode.gain.value = this.settings.masterVolume;
    }
    this.saveSettings();
  }

  /**
   * Update sound effects volume
   */
  public setSfxVolume(volume: number): void {
    this.settings.sfxVolume = Math.max(0, Math.min(1, volume));
    if (this.sfxGainNode) {
      this.sfxGainNode.gain.value = this.settings.sfxVolume;
    }
    this.saveSettings();
  }

  /**
   * Update ambient music volume
   */
  public setAmbientVolume(volume: number): void {
    this.settings.ambientVolume = Math.max(0, Math.min(1, volume));
    if (this.ambientGainNode) {
      this.ambientGainNode.gain.value = this.settings.ambientVolume;
    }
    this.saveSettings();
  }

  /**
   * Enable or disable all audio
   */
  public setEnabled(enabled: boolean): void {
    this.settings.enabled = enabled;
    if (!enabled) {
      this.stopAmbient();
    }
    this.saveSettings();
  }

  /**
   * Get current audio settings
   */
  public getSettings(): AudioSettings {
    return { ...this.settings };
  }

  /**
   * Save settings to localStorage
   */
  private saveSettings(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('audioSettings', JSON.stringify(this.settings));
    }
  }

  /**
   * Load settings from localStorage
   */
  private loadSettings(): void {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('audioSettings');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          this.settings = { ...this.settings, ...parsed };

          // Apply loaded settings
          if (this.masterGainNode) {
            this.masterGainNode.gain.value = this.settings.masterVolume;
          }
          if (this.sfxGainNode) {
            this.sfxGainNode.gain.value = this.settings.sfxVolume;
          }
          if (this.ambientGainNode) {
            this.ambientGainNode.gain.value = this.settings.ambientVolume;
          }
        } catch (error) {
          console.error('Failed to load audio settings:', error);
        }
      }
    }
  }

  /**
   * Preload commonly used sound effects
   */
  public async preloadSounds(effects: SoundEffect[]): Promise<void> {
    if (!this.audioContext) return;

    const promises = effects.map(async (effect) => {
      if (!this.soundBuffers.has(effect)) {
        const buffer = await this.loadSoundBuffer(effect);
        if (buffer) {
          this.soundBuffers.set(effect, buffer);
        }
      }
    });

    await Promise.all(promises);
    console.log(`Preloaded ${effects.length} sound effects`);
  }
}

// Export singleton instance
export const audioManager = AudioManager.getInstance();
