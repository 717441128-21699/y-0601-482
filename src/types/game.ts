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
  hasShield: boolean;
  isSlowdown: boolean;
  position: { x: number; y: number };
  isAlive: boolean;
  respawnTime: number;
}

export interface GameMap {
  id: string;
  name: string;
  description: string;
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
  capturePoints?: { x: number; y: number; id: string }[];
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
  activityCode?: string;
  spectators: string[];
}

export interface Item {
  id: string;
  name: string;
  type: 'shield' | 'slowdown' | 'speed' | 'invisible';
  description: string;
  duration: number;
  cooldown: number;
  icon: string;
}

export interface GameRecord {
  id: string;
  date: string;
  mapName: string;
  duration: number;
  winner: 'red' | 'blue' | 'draw';
  score: { red: number; blue: number };
  players: {
    playerId: string;
    playerName: string;
    team: 'red' | 'blue';
    score: number;
    kills: number;
    deaths: number;
    flagsCaptured: number;
    isMvp: boolean;
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
}
