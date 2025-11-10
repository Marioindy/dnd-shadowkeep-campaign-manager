// User Types
export interface User {
  _id: string;
  username: string;
  role: 'player' | 'dm' | 'admin';
  campaignId?: string;
  createdAt: number;
}

// Character Types
export interface Character {
  _id: string;
  userId: string;
  campaignId: string;
  name: string;
  race: string;
  class: string;
  level: number;
  stats: CharacterStats;
  portraitUrl?: string;
  backstory?: string;
  createdAt: number;
  updatedAt: number;
}

export interface CharacterStats {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  hp: number;
  maxHp: number;
  ac: number;
  speed: number;
}

// Inventory Types
export interface InventoryItem {
  _id: string;
  characterId: string;
  name: string;
  type: 'weapon' | 'armor' | 'potion' | 'tool' | 'misc';
  quantity: number;
  weight: number;
  description?: string;
  properties?: Record<string, any>;
  equipped?: boolean;
  equipSlot?: string;
}

export interface Equipment {
  mainHand?: InventoryItem;
  offHand?: InventoryItem;
  head?: InventoryItem;
  chest?: InventoryItem;
  legs?: InventoryItem;
  feet?: InventoryItem;
  accessories?: InventoryItem[];
}

// Map Types
export interface Map {
  _id: string;
  campaignId: string;
  name: string;
  imageUrl: string;
  createdAt: number;
  updatedAt: number;
}

export interface MapMarker {
  _id: string;
  mapId: string;
  type: 'player' | 'npc' | 'enemy' | 'poi';
  x: number;
  y: number;
  label?: string;
  color?: string;
  iconUrl?: string;
  visible: boolean;
}

// Campaign Types
export interface Campaign {
  _id: string;
  name: string;
  description: string;
  dmId: string;
  players: string[];
  currentSession?: string;
  createdAt: number;
  updatedAt: number;
}

// Session Types
// Database type - matches Convex schema
export interface SessionDB {
  _id: string;
  campaignId: string;
  name: string;
  date: number;
  notes: string;
  active: boolean;
}

// Composed view type - includes encounters from separate table
export interface Session extends SessionDB {
  encounters: Encounter[];
}

// Database type - matches Convex schema
export interface EncounterDB {
  _id: string;
  sessionId: string;
  name: string;
  enemies: Enemy[];
  initiative: InitiativeEntry[];
}

// View type - same as DB but without sessionId (implied by parent session)
export interface Encounter {
  id: string;
  name: string;
  enemies: Enemy[];
  initiative: InitiativeEntry[];
}

export interface Enemy {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  ac: number;
  initiativeBonus: number;
}

export interface InitiativeEntry {
  id: string;
  name: string;
  initiative: number;
  type: 'player' | 'enemy' | 'npc';
}

// Audio Types
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
