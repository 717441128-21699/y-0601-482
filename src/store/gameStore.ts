import { create } from 'zustand';
import type { Player, GameRoom, GameMap, GameSettings, Item } from '@/types/game';
import { mockPlayers, mockWaitingPlayers } from '@/data/mockPlayers';
import { mockMaps, mockItems } from '@/data/mockMaps';

interface GameState {
  currentRoom: GameRoom | null;
  currentMap: GameMap | null;
  players: Player[];
  maps: GameMap[];
  items: Item[];
  gameTime: number;
  isPaused: boolean;
  myPlayerId: string;
  settings: GameSettings;
  activityCode: string;
  messages: { id: string; text: string; type: 'info' | 'team' | 'system' }[];
  roomSettings: {
    totalRounds: number;
    roundTime: number;
    respawnTime: number;
  };

  createRoom: (name: string, maxPlayers: number) => void;
  joinRoom: (roomId: string, activityCode?: string) => void;
  leaveRoom: () => void;
  setMap: (mapId: string) => void;
  toggleReady: () => void;
  autoAssignTeams: () => void;
  swapPlayerTeam: (playerId: string) => void;
  startCountdown: () => void;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  updatePlayerPosition: (playerId: string, x: number, y: number) => void;
  useItem: (itemId: string) => void;
  addMessage: (text: string, type: 'info' | 'team' | 'system') => void;
  updateSettings: (settings: Partial<GameSettings>) => void;
  updateRoomSettings: (settings: { totalRounds?: number; roundTime?: number; respawnTime?: number }) => void;
  setActivityCode: (code: string) => void;
  updatePlayerGameData: (playerId: string, data: Partial<Player>) => void;
  updateScore: (team: 'red' | 'blue', delta: number) => void;
}

const initialSettings: GameSettings = {
  soundEnabled: true,
  vibrationEnabled: true,
  showTeammateNames: true,
  autoRespawn: true,
  respawnTime: 10,
  flagCaptureTime: 5,
  slowdownDuration: 5,
  shieldDuration: 3
};

export const useGameStore = create<GameState>((set, get) => ({
  currentRoom: null,
  currentMap: null,
  players: [],
  maps: mockMaps,
  items: mockItems,
  gameTime: 0,
  isPaused: false,
  myPlayerId: 'p1',
  settings: initialSettings,
  activityCode: '',
  messages: [],
  roomSettings: {
    totalRounds: 3,
    roundTime: 600,
    respawnTime: 10
  },

  createRoom: (name, maxPlayers) => {
    const { roomSettings } = get();
    const room: GameRoom = {
      id: 'room-' + Date.now(),
      name,
      hostId: 'p1',
      maxPlayers,
      players: [{ ...mockWaitingPlayers[0], id: 'p1', name: '我', isHost: true, isReady: true }],
      mapId: 'map1',
      gameStatus: 'waiting',
      gameMode: 'capture',
      totalRounds: roomSettings.totalRounds,
      currentRound: 1,
      roundTime: roomSettings.roundTime,
      score: { red: 0, blue: 0 },
      spectators: []
    };
    set({ currentRoom: room, currentMap: mockMaps[0], players: room.players });
    console.log('[GameStore] Room created:', room.id);
  },

  joinRoom: (roomId, activityCode) => {
    const { roomSettings } = get();
    const allPlayers = [...mockWaitingPlayers.slice(0, 5), { ...mockWaitingPlayers[0], id: 'p1', name: '我', isHost: false, isReady: false }];
    const shuffled = allPlayers.sort(() => Math.random() - 0.5);
    const players = shuffled.map((p, i) => ({
      ...p,
      team: i % 2 === 0 ? 'red' as const : 'blue' as const,
      isReady: Math.random() > 0.3
    }));
    
    const room: GameRoom = {
      id: roomId,
      name: '团建活动室',
      hostId: players[0].id,
      maxPlayers: 10,
      players,
      mapId: 'map1',
      gameStatus: 'waiting',
      gameMode: 'capture',
      totalRounds: roomSettings.totalRounds,
      currentRound: 1,
      roundTime: roomSettings.roundTime,
      score: { red: 0, blue: 0 },
      activityCode,
      spectators: []
    };
    set({ currentRoom: room, currentMap: mockMaps[0], players });
    console.log('[GameStore] Joined room:', roomId);
  },

  leaveRoom: () => {
    set({ currentRoom: null, currentMap: null, players: [], gameTime: 0, isPaused: false });
    console.log('[GameStore] Left room');
  },

  setMap: (mapId) => {
    const map = get().maps.find(m => m.id === mapId);
    if (map && get().currentRoom) {
      set({
        currentMap: map,
        currentRoom: { ...get().currentRoom!, mapId }
      });
      console.log('[GameStore] Map set:', map.name);
    }
  },

  toggleReady: () => {
    const { currentRoom, myPlayerId } = get();
    if (!currentRoom) return;
    
    const updatedPlayers = currentRoom.players.map(p => 
      p.id === myPlayerId ? { ...p, isReady: !p.isReady } : p
    );
    
    set({
      currentRoom: { ...currentRoom, players: updatedPlayers },
      players: updatedPlayers
    });
    console.log('[GameStore] Ready toggled');
  },

  autoAssignTeams: () => {
    const { currentRoom } = get();
    if (!currentRoom) return;
    
    const shuffled = [...currentRoom.players].sort(() => Math.random() - 0.5);
    const updatedPlayers = shuffled.map((p, i) => ({
      ...p,
      team: i % 2 === 0 ? 'red' as const : 'blue' as const
    }));
    
    set({
      currentRoom: { ...currentRoom, players: updatedPlayers },
      players: updatedPlayers
    });
    console.log('[GameStore] Teams auto assigned');
  },

  swapPlayerTeam: (playerId) => {
    const { currentRoom } = get();
    if (!currentRoom) return;
    
    const updatedPlayers = currentRoom.players.map(p => 
      p.id === playerId ? { ...p, team: p.team === 'red' ? 'blue' as const : 'red' as const } : p
    );
    
    set({
      currentRoom: { ...currentRoom, players: updatedPlayers },
      players: updatedPlayers
    });
    console.log('[GameStore] Player team swapped:', playerId);
  },

  startCountdown: () => {
    const { currentRoom } = get();
    if (!currentRoom) return;
    
    set({
      currentRoom: { ...currentRoom, gameStatus: 'countdown' }
    });
    console.log('[GameStore] Countdown started');
  },

  startGame: () => {
    const { currentRoom } = get();
    if (!currentRoom) return;
    
    const playersWithInitData = currentRoom.players.map(p => ({
      ...p,
      score: 0,
      kills: 0,
      deaths: 0,
      flagsCaptured: 0,
      hasShield: false,
      isSlowdown: false,
      isAlive: true,
      respawnTime: 0,
      position: p.team === 'red' 
        ? { x: 15 + Math.random() * 10, y: 40 + Math.random() * 20 }
        : { x: 75 + Math.random() * 10, y: 40 + Math.random() * 20 }
    }));
    
    set({
      currentRoom: { 
        ...currentRoom, 
        gameStatus: 'playing',
        players: playersWithInitData,
        score: { red: 0, blue: 0 }
      },
      players: playersWithInitData,
      gameTime: currentRoom.roundTime,
      isPaused: false
    });
    console.log('[GameStore] Game started');
  },

  pauseGame: () => {
    const { currentRoom } = get();
    if (!currentRoom) return;
    
    set({
      currentRoom: { ...currentRoom, gameStatus: 'paused' },
      isPaused: true
    });
    console.log('[GameStore] Game paused');
  },

  resumeGame: () => {
    const { currentRoom } = get();
    if (!currentRoom) return;
    
    set({
      currentRoom: { ...currentRoom, gameStatus: 'playing' },
      isPaused: false
    });
    console.log('[GameStore] Game resumed');
  },

  updatePlayerPosition: (playerId, x, y) => {
    const { currentRoom } = get();
    if (!currentRoom) return;
    
    const updatedPlayers = currentRoom.players.map(p => 
      p.id === playerId ? { ...p, position: { x, y } } : p
    );
    
    set({
      currentRoom: { ...currentRoom, players: updatedPlayers },
      players: updatedPlayers
    });
  },

  useItem: (itemId) => {
    console.log('[GameStore] Item used:', itemId);
  },

  addMessage: (text, type) => {
    const msg = { id: 'msg-' + Date.now(), text, type };
    set(state => ({
      messages: [...state.messages.slice(-9), msg]
    }));
  },

  updateSettings: (newSettings) => {
    set(state => ({
      settings: { ...state.settings, ...newSettings }
    }));
    console.log('[GameStore] Settings updated');
  },

  updateRoomSettings: (newRoomSettings) => {
    set(state => {
      const updatedRoomSettings = { ...state.roomSettings, ...newRoomSettings };
      const updatedRoom = state.currentRoom ? {
        ...state.currentRoom,
        totalRounds: updatedRoomSettings.totalRounds,
        roundTime: updatedRoomSettings.roundTime
      } : null;
      return {
        roomSettings: updatedRoomSettings,
        currentRoom: updatedRoom
      };
    });
    console.log('[GameStore] Room settings updated:', newRoomSettings);
  },

  updatePlayerGameData: (playerId, data) => {
    const { currentRoom } = get();
    if (!currentRoom) return;
    
    const updatedPlayers = currentRoom.players.map(p => 
      p.id === playerId ? { ...p, ...data } : p
    );
    
    set({
      currentRoom: { ...currentRoom, players: updatedPlayers },
      players: updatedPlayers
    });
  },

  updateScore: (team, delta) => {
    const { currentRoom } = get();
    if (!currentRoom) return;
    
    const updatedScore = {
      ...currentRoom.score,
      [team]: currentRoom.score[team] + delta
    };
    
    set({
      currentRoom: { ...currentRoom, score: updatedScore }
    });
  },

  setActivityCode: (code) => {
    set({ activityCode: code });
  }
}));
