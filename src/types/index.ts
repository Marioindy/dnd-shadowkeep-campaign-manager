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
  name: string;
  race: string;
  class: string;
  level: number;
  stats: CharacterStats;
  inventory: InventoryItem[];
  equipment: Equipment;
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
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'potion' | 'tool' | 'misc';
  quantity: number;
  weight: number;
  description?: string;
  properties?: Record<string, any>;
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
  markers: MapMarker[];
  createdAt: number;
  updatedAt: number;
}

export interface MapMarker {
  _id: string;
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
export interface Session {
  _id: string;
  campaignId: string;
  name: string;
  date: number;
  notes: string;
  encounters: Encounter[];
  active: boolean;
}

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
