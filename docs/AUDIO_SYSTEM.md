# Audio System Documentation

## Overview

The D&D Shadowkeep Campaign Manager includes a comprehensive audio system that enhances immersion through background ambient music, sound effects for game actions, and spatial audio for map interactions.

## Architecture

### Components

#### 1. AudioManager (`src/lib/audioManager.ts`)

The core singleton class that manages all audio playback using the Web Audio API.

**Key Features:**
- Singleton pattern for global audio state
- Web Audio API for precise control and advanced features
- Volume control with separate gain nodes for master, SFX, and ambient audio
- Audio fade transitions between tracks
- Spatial audio support for map interactions
- LocalStorage persistence for user preferences
- Sound buffer caching for performance

**Main Methods:**

```typescript
// Play sound effects
audioManager.playSoundEffect(effect: SoundEffect, options?: {
  volume?: number;
  spatial?: { x: number; y: number }
}): Promise<void>

// Play ambient background music
audioManager.playAmbientTrack(track: AmbientTrack, options?: {
  fadeIn?: number;
  loop?: boolean
}): Promise<void>

// Volume controls
audioManager.setMasterVolume(volume: number): void
audioManager.setSfxVolume(volume: number): void
audioManager.setAmbientVolume(volume: number): void

// Enable/disable audio
audioManager.setEnabled(enabled: boolean): void

// Combat music toggle
audioManager.toggleCombatMusic(enabled: boolean): Promise<void>

// Fade out current track
audioManager.fadeOutAmbient(duration?: number): Promise<void>

// Preload sounds for better performance
audioManager.preloadSounds(effects: SoundEffect[]): Promise<void>
```

#### 2. AudioControls Component (`src/components/audio/AudioControls.tsx`)

User interface for managing audio settings.

**Features:**
- Master volume slider
- Sound effects volume slider
- Ambient music volume slider
- Enable/disable toggle
- Test sound button
- Real-time volume percentage display
- Settings persistence via AudioManager

**Usage:**
```tsx
import AudioControls from '@/components/audio/AudioControls';

<AudioControls />
```

#### 3. AmbientMusicSelector Component (`src/components/audio/AmbientMusicSelector.tsx`)

DM control panel for selecting and controlling ambient background music.

**Features:**
- Grid of ambient track options with icons
- Combat music quick toggle
- Visual feedback for currently playing track
- Fade transitions between tracks
- Stop button for current track

**Available Tracks:**
- Tavern 🍺
- Town 🏘️
- Peaceful ☮️
- Forest 🌲
- Dungeon 🏰
- Cave ⛰️
- Mystical ✨
- Combat ⚔️
- Boss Battle 🐉

**Usage:**
```tsx
import AmbientMusicSelector from '@/components/audio/AmbientMusicSelector';

<AmbientMusicSelector />
```

## Integration Points

### 1. Dice Roller (`src/app/(dashboard)/session-tools/components/DiceRoller.tsx`)

**Audio Triggers:**
- Standard dice roll → `dice_roll` sound
- Natural 20 on d20 → `dice_crit_success` sound (boosted volume)
- Natural 1 on d20 → `dice_crit_fail` sound (boosted volume)

### 2. Initiative Tracker (`src/app/(dashboard)/session-tools/components/InitiativeTracker.tsx`)

**Audio Triggers:**
- Combat start → `initiative_start` sound
- Turn change → `initiative_next_turn` sound
- Round restart → `initiative_start` sound (reduced volume)
- New combatant added → `combatant_added` sound

### 3. Map Viewer (`src/app/(dm)/dm/map-control/components/DMMapViewer.tsx`)

**Audio Triggers:**
- Fog of War toggle → `fog_reveal` sound
- Add marker → `map_marker_placed` sound with spatial audio
- Reveal area → `fog_reveal` sound (boosted volume)

**Spatial Audio:**
Map interactions use spatial audio positioning:
- `x`: -1 (left) to 1 (right) for stereo panning
- `y`: 0 (close) to 1 (far) for distance attenuation

## Sound Effect Types

All available sound effects are defined in `src/types/index.ts`:

```typescript
type SoundEffect =
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
```

## Ambient Track Types

```typescript
type AmbientTrack =
  | 'tavern'
  | 'dungeon'
  | 'forest'
  | 'combat'
  | 'boss_battle'
  | 'town'
  | 'cave'
  | 'mystical'
  | 'peaceful';
```

## Audio Files Setup

### Directory Structure

```
public/
├── sounds/          # Sound effects
│   ├── dice-roll.mp3
│   ├── dice-crit-success.mp3
│   ├── dice-crit-fail.mp3
│   ├── initiative-start.mp3
│   ├── initiative-next.mp3
│   ├── combatant-added.mp3
│   ├── ability-cast.mp3
│   ├── marker-placed.mp3
│   ├── marker-removed.mp3
│   ├── fog-reveal.mp3
│   ├── combat-start.mp3
│   └── combat-end.mp3
└── ambient/         # Ambient music
    ├── tavern.mp3
    ├── town.mp3
    ├── peaceful.mp3
    ├── forest.mp3
    ├── dungeon.mp3
    ├── cave.mp3
    ├── mystical.mp3
    ├── combat.mp3
    └── boss-battle.mp3
```

### Recommended Sources

**Sound Effects:**
- [Freesound.org](https://freesound.org/)
- [Zapsplat.com](https://www.zapsplat.com/)
- [Mixkit.co](https://mixkit.co/)
- BBC Sound Effects

**Ambient Music:**
- [Incompetech.com](https://incompetech.com/) (Kevin MacLeod)
- [Purple Planet Music](https://www.purple-planet.com/)
- [Bensound.com](https://www.bensound.com/)
- [Tabletop Audio](https://tabletopaudio.com/)
- YouTube Audio Library

### File Requirements

**Sound Effects:**
- Format: MP3
- Length: 1-3 seconds
- Size: Keep under 100KB per file
- Volume: Normalized to consistent levels

**Ambient Music:**
- Format: MP3
- Length: 2-5 minutes (loopable)
- Size: Consider compression for web delivery
- Volume: Normalized to consistent levels
- Quality: Seamless loops preferred

## Usage Examples

### Playing a Sound Effect

```typescript
import { audioManager } from '@/lib/audioManager';

// Simple sound effect
audioManager.playSoundEffect('dice_roll');

// With custom volume
audioManager.playSoundEffect('dice_crit_success', { volume: 1.2 });

// With spatial audio
audioManager.playSoundEffect('map_marker_placed', {
  spatial: { x: 0.5, y: 0.3 } // Right side, fairly close
});
```

### Playing Ambient Music

```typescript
import { audioManager } from '@/lib/audioManager';

// Play with fade in
await audioManager.playAmbientTrack('tavern', {
  fadeIn: 2000,  // 2 second fade
  loop: true
});

// Stop current track
await audioManager.fadeOutAmbient(1500); // 1.5 second fade
```

### Adjusting Volumes

```typescript
import { audioManager } from '@/lib/audioManager';

// Set master volume (0-1)
audioManager.setMasterVolume(0.7);

// Set sound effects volume
audioManager.setSfxVolume(0.8);

// Set ambient music volume
audioManager.setAmbientVolume(0.5);

// Mute all audio
audioManager.setEnabled(false);
```

### Preloading Sounds

```typescript
import { audioManager } from '@/lib/audioManager';

// Preload commonly used sounds for better performance
await audioManager.preloadSounds([
  'dice_roll',
  'dice_crit_success',
  'dice_crit_fail',
  'initiative_start',
  'initiative_next_turn'
]);
```

## Browser Compatibility

The audio system uses the Web Audio API, which is supported in:
- Chrome 34+
- Firefox 25+
- Safari 6+
- Edge 12+
- Opera 22+

**Note:** Some browsers require user interaction before allowing audio playback. The AudioManager handles this automatically by resuming the audio context when needed.

## Performance Considerations

1. **Sound Buffer Caching**: Frequently used sound effects are cached in memory after first load
2. **Lazy Loading**: Audio files are only loaded when first requested
3. **Fade Transitions**: Smooth fades prevent audio pops and clicks
4. **Gain Nodes**: Separate volume controls use Web Audio API gain nodes for efficient mixing

## Future Enhancements

Potential improvements for the audio system:

- [ ] 3D positional audio for full surround sound support
- [ ] Dynamic music layering (add/remove instrument layers based on game state)
- [ ] Audio visualization (waveforms, VU meters)
- [ ] Playlist support for longer ambient tracks
- [ ] Custom sound upload for DMs
- [ ] Audio presets (action-packed, cinematic, subtle)
- [ ] Crossfade between ambient tracks
- [ ] Volume ducking (lower music during important sounds)
- [ ] Audio events broadcast via Convex for multiplayer sync
- [ ] Accessibility options (audio descriptions, visual indicators)

## Troubleshooting

### Audio Not Playing

1. **Check browser console** for errors
2. **Verify audio files** exist in `/public/sounds/` and `/public/ambient/`
3. **Check volume settings** in AudioControls component
4. **Ensure audio is enabled** (not muted)
5. **Try user interaction** - some browsers block autoplay

### Performance Issues

1. **Preload frequently used sounds** at app startup
2. **Reduce ambient track file sizes** via compression
3. **Limit concurrent sound effects** in rapid succession
4. **Check browser audio context state** - may be suspended

### Spatial Audio Not Working

1. **Verify browser support** for Web Audio API
2. **Check spatial parameters** are in valid ranges (x: -1 to 1, y: 0 to 1)
3. **Test with headphones** for better spatial perception
4. **Ensure StereoPanner is supported** (fallback to mono if needed)

## License

Audio system code is part of the D&D Shadowkeep Campaign Manager project.

Audio files must be sourced separately under appropriate licenses (Creative Commons, royalty-free, etc.).
