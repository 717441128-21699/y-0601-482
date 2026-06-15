export interface Player {
  id: string;
  name: string;
  avatar?: string;
  team: 'red' | 'blue' | null;
  isReady: boolean;
  isHost: boolean;
  score: number;
  kills: number;
  deaths: number;
  flagsCaptured: number;
  pointsCaptured: number;
  hasShield: boolean;
  shieldTime: number;
  isSlowdown: boolean;
  slowdownTime: number;
  hasSpeed: boolean;
  speedTime: number;
  position: { x: number; y: number };
  isAlive: boolean;
  respawnTime: number;
  itemCooldowns: Record<string, number>;
  itemRemainingUses: Record<string, number>;
}

export interface MapRules {
  capturePointMode: 'none' | 'occupy' | 'kingOfTheHill';
  flagMode: 'standard' | 'neutralOnly' | 'multiple';
  respawnMode: 'fixed' | 'dynamic' | 'capturedPoints';
  scorePerFlag: number;
  scorePerCapture: number;
  flagCaptureTime: number;
  capturePointTime: number;
  recommendedItems: string[];
}

export interface GameMap {
  id: string;
  name: string;
  description: string;
  difficulty: number;
  maxPlayers: number;
  width: number;
  height: number;
  flagPositions: {
    red: { x: number; y: number };
    blue: { x: number; y: number };
    neutral?: { x: number; y: number };
  };
  spawnPoints: {
    red: { x: number; y: number }[];
    blue: { x: number; y: number }[];
  };
  capturePoints?: { x: number; y: number; id: string; name: string }[];
  rules: MapRules;
}

export interface GameRoom {
  id: string;
  name: string;
  hostId: string;
  password?: string;
  maxPlayers: number;
  players: Player[];
  mapId: string;
  gameStatus: 'waiting' | 'countdown' | 'playing' | 'paused' | 'finished';
  gameMode: 'capture' | 'teamDeathmatch';
  totalRounds: number;
  currentRound: number;
  roundTime: number;
  score: { red: number; blue: number };
  scoreTimeline: { time: number; red: number; blue: number }[];
  activityCode?: string;
  spectators: string[];
  selectedItems: string[];
}

export interface Item {
  id: string;
  name: string;
  type: 'shield' | 'slowdown' | 'speed' | 'invisible' | 'attack' | 'defense' | 'utility' | 'trap';
  description: string;
  duration: number;
  cooldown: number;
  uses: number;
  rarity: number;
  icon: string;
  tips: string;
  mapBonus: { mapId: string; bonus: string }[];
}

export interface GameRecord {
  id: string;
  date: string;
  mapName: string;
  mapId: string;
  duration: number;
  winner: 'red' | 'blue' | 'draw';
  score: { red: number; blue: number };
  scoreTimeline: { time: number; red: number; blue: number }[];
  mvpPlayerId: string;
  mvpReason: string;
  players: {
    playerId: string;
    playerName: string;
    team: 'red' | 'blue';
    score: number;
    kills: number;
    deaths: number;
    flagsCaptured: number;
    pointsCaptured: number;
    isMvp: boolean;
    mvpReason?: string;
    itemsUsed: { itemId: string; count: number }[];
  }[];
}

export interface GameSettings {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  showTeammateNames: boolean;
  autoRespawn: boolean;
  respawnTime: number;
  flagCaptureTime: number;
  slowdownDuration: number;
  shieldDuration: number;
  playerName: string;
}
