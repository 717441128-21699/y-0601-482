import { create } from 'zustand';
import type { Player, GameRoom, GameMap, GameSettings, Item, GameRecord } from '@/types/game';
import { mockPlayers, mockWaitingPlayers } from '@/data/mockPlayers';
import { mockMaps, mockItems } from '@/data/mockMaps';
import { mockRecords } from '@/data/mockRecords';

interface GameState {
  currentRoom: GameRoom | null;
  currentMap: GameMap | null;
  players: Player[];
  maps: GameMap[];
  items: Item[];
  selectedItems: string[];
  gameRecords: GameRecord[];
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
  toggleSelectItem: (itemId: string) => void;
  saveGameRecord: () => void;
  tickEffectTimes: () => void;
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

const defaultSelectedItems = ['shield', 'speed', 'slowdown', 'shockwave'];

export const useGameStore = create<GameState>((set, get) => ({
  currentRoom: null,
  currentMap: mockMaps[0],
  players: [],
  maps: mockMaps,
  items: mockItems,
  selectedItems: defaultSelectedItems,
  gameRecords: mockRecords,
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
    const { roomSettings, currentMap, selectedItems } = get();
    const map = currentMap || mockMaps[0];
    const room: GameRoom = {
      id: 'room-' + Date.now(),
      name,
      hostId: 'p1',
      maxPlayers,
      players: [{ ...mockWaitingPlayers[0], id: 'p1', name: '我', isHost: true, isReady: true }],
      mapId: map.id,
      gameStatus: 'waiting',
      gameMode: 'capture',
      totalRounds: roomSettings.totalRounds,
      currentRound: 1,
      roundTime: roomSettings.roundTime,
      score: { red: 0, blue: 0 },
      spectators: []
    };
    const initPlayers = room.players.map(p => ({
      ...p,
      itemCooldowns: {}
    }));
    set({ 
      currentRoom: { ...room, players: initPlayers }, 
      currentMap: map, 
      players: initPlayers,
      selectedItems: selectedItems.length > 0 ? selectedItems : defaultSelectedItems
    });
    console.log('[GameStore] Room created:', room.id, 'map:', map.name);
  },

  joinRoom: (roomId, activityCode) => {
    const { roomSettings, currentMap, selectedItems } = get();
    const map = currentMap || mockMaps[0];
    const allPlayers = [...mockWaitingPlayers.slice(0, 5), { ...mockWaitingPlayers[0], id: 'p1', name: '我', isHost: false, isReady: false }];
    const shuffled = allPlayers.sort(() => Math.random() - 0.5);
    const players = shuffled.map((p, i) => ({
      ...p,
      team: i % 2 === 0 ? 'red' as const : 'blue' as const,
      isReady: Math.random() > 0.3,
      itemCooldowns: {}
    }));
    
    const room: GameRoom = {
      id: roomId,
      name: '团建活动室',
      hostId: players[0].id,
      maxPlayers: 10,
      players,
      mapId: map.id,
      gameStatus: 'waiting',
      gameMode: 'capture',
      totalRounds: roomSettings.totalRounds,
      currentRound: 1,
      roundTime: roomSettings.roundTime,
      score: { red: 0, blue: 0 },
      activityCode,
      spectators: []
    };
    set({ 
      currentRoom: room, 
      currentMap: map, 
      players,
      selectedItems: selectedItems.length > 0 ? selectedItems : defaultSelectedItems
    });
    console.log('[GameStore] Joined room:', roomId, 'map:', map.name);
  },

  leaveRoom: () => {
    set({ currentRoom: null, players: [], gameTime: 0, isPaused: false });
    console.log('[GameStore] Left room');
  },

  setMap: (mapId) => {
    const map = get().maps.find(m => m.id === mapId);
    if (!map) return;
    
    const { currentRoom } = get();
    if (currentRoom) {
      set({
        currentMap: map,
        currentRoom: { ...currentRoom, mapId }
      });
    } else {
      set({ currentMap: map });
    }
    console.log('[GameStore] Map set:', map.name);
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
    const { currentRoom, currentMap, selectedItems } = get();
    if (!currentRoom || !currentMap) return;
    
    const spawnPoints = currentMap.spawnPoints;
    
    const playersWithInitData = currentRoom.players.map(p => {
      const teamSpawns = p.team === 'red' ? spawnPoints.red : spawnPoints.blue;
      const spawnIdx = Math.floor(Math.random() * teamSpawns.length);
      const spawn = teamSpawns[spawnIdx];
      
      const itemCooldowns: Record<string, number> = {};
      selectedItems.forEach(itemId => {
        itemCooldowns[itemId] = 0;
      });
      
      return {
        ...p,
        score: 0,
        kills: 0,
        deaths: 0,
        flagsCaptured: 0,
        hasShield: false,
        shieldTime: 0,
        isSlowdown: false,
        slowdownTime: 0,
        hasSpeed: false,
        speedTime: 0,
        isAlive: true,
        respawnTime: 0,
        position: { 
          x: spawn.x + (Math.random() - 0.5) * 6, 
          y: spawn.y + (Math.random() - 0.5) * 6 
        },
        itemCooldowns
      };
    });
    
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
    console.log('[GameStore] Game started with', selectedItems.length, 'items');
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
    const { currentRoom, myPlayerId, selectedItems, items } = get();
    if (!currentRoom || !selectedItems.includes(itemId)) return;
    
    const me = currentRoom.players.find(p => p.id === myPlayerId);
    if (!me || !me.isAlive) return;
    
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    
    const cooldown = me.itemCooldowns[itemId];
    if (cooldown && cooldown > 0) return;
    
    const updatedPlayers = currentRoom.players.map(p => {
      if (p.id !== myPlayerId) return p;
      
      const newCooldowns = { ...p.itemCooldowns, [itemId]: item.cooldown };
      
      switch (itemId) {
        case 'shield':
          return { ...p, hasShield: true, shieldTime: item.duration, itemCooldowns: newCooldowns };
        case 'speed':
          return { ...p, hasSpeed: true, speedTime: item.duration, itemCooldowns: newCooldowns };
        case 'slowdown':
          return { ...p, itemCooldowns: newCooldowns };
        case 'shockwave':
          return { ...p, itemCooldowns: newCooldowns };
        case 'invisible':
          return { ...p, itemCooldowns: newCooldowns };
        case 'scout':
          return { ...p, itemCooldowns: newCooldowns };
        default:
          return { ...p, itemCooldowns: newCooldowns };
      }
    });
    
    if (itemId === 'slowdown') {
      const mePlayer = updatedPlayers.find(p => p.id === myPlayerId);
      if (mePlayer) {
        const slowdownRadius = 15;
        updatedPlayers.forEach(p => {
          if (p.team !== mePlayer.team && p.isAlive) {
            const dist = Math.sqrt(
              Math.pow(p.position.x - mePlayer.position.x, 2) + 
              Math.pow(p.position.y - mePlayer.position.y, 2)
            );
            if (dist < slowdownRadius) {
              p.isSlowdown = true;
              p.slowdownTime = item.duration;
            }
          }
        });
      }
    }
    
    if (itemId === 'shockwave') {
      const mePlayer = updatedPlayers.find(p => p.id === myPlayerId);
      if (mePlayer) {
        const shockRadius = 20;
        updatedPlayers.forEach(p => {
          if (p.id !== myPlayerId && p.team !== mePlayer.team && p.isAlive) {
            const dist = Math.sqrt(
              Math.pow(p.position.x - mePlayer.position.x, 2) + 
              Math.pow(p.position.y - mePlayer.position.y, 2)
            );
            if (dist < shockRadius) {
              const angle = Math.atan2(p.position.y - mePlayer.position.y, p.position.x - mePlayer.position.x);
              p.position = {
                x: Math.max(5, Math.min(95, p.position.x + Math.cos(angle) * 10)),
                y: Math.max(5, Math.min(95, p.position.y + Math.sin(angle) * 10))
              };
              p.isSlowdown = true;
              p.slowdownTime = 2;
            }
          }
        });
      }
    }
    
    set({
      currentRoom: { ...currentRoom, players: updatedPlayers },
      players: updatedPlayers
    });
    
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
  },

  toggleSelectItem: (itemId) => {
    const { selectedItems, items } = get();
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    
    let newSelected: string[];
    if (selectedItems.includes(itemId)) {
      newSelected = selectedItems.filter(id => id !== itemId);
    } else {
      if (selectedItems.length >= 4) {
        console.log('[GameStore] Max 4 items allowed');
        return;
      }
      newSelected = [...selectedItems, itemId];
    }
    
    set({ selectedItems: newSelected });
    console.log('[GameStore] Selected items:', newSelected);
  },

  saveGameRecord: () => {
    const { currentRoom, currentMap, gameRecords, myPlayerId, roomSettings } = get();
    if (!currentRoom || !currentMap) return;
    
    const { score, players, roundTime } = currentRoom;
    
    const winner: 'red' | 'blue' | 'draw' = 
      score.red > score.blue ? 'red' : score.blue > score.red ? 'blue' : 'draw';
    
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
    const mvpPlayer = sortedPlayers[0];
    
    const recordPlayers = players.map(p => ({
      playerId: p.id,
      playerName: p.name,
      team: p.team || 'red',
      score: p.score,
      kills: p.kills,
      deaths: p.deaths,
      flagsCaptured: p.flagsCaptured,
      isMvp: p.id === mvpPlayer?.id
    }));
    
    const record: GameRecord = {
      id: 'record-' + Date.now(),
      date: new Date().toLocaleDateString('zh-CN'),
      mapName: currentMap.name,
      duration: roundTime - (get().gameTime || 0),
      winner,
      score: { ...score },
      players: recordPlayers
    };
    
    const updatedRecords = [record, ...gameRecords].slice(0, 20);
    
    set({ gameRecords: updatedRecords });
    console.log('[GameStore] Game record saved:', record.id);
  },

  tickEffectTimes: () => {
    const { currentRoom } = get();
    if (!currentRoom) return;
    
    const updatedPlayers = currentRoom.players.map(p => {
      const updated = { ...p, itemCooldowns: { ...p.itemCooldowns } };
      
      Object.keys(updated.itemCooldowns).forEach(itemId => {
        if (updated.itemCooldowns[itemId] > 0) {
          updated.itemCooldowns[itemId]--;
        }
      });
      
      if (updated.shieldTime > 0) {
        updated.shieldTime--;
        if (updated.shieldTime <= 0) {
          updated.hasShield = false;
        }
      }
      
      if (updated.slowdownTime > 0) {
        updated.slowdownTime--;
        if (updated.slowdownTime <= 0) {
          updated.isSlowdown = false;
        }
      }
      
      if (updated.speedTime > 0) {
        updated.speedTime--;
        if (updated.speedTime <= 0) {
          updated.hasSpeed = false;
        }
      }
      
      return updated;
    });
    
    set({
      currentRoom: { ...currentRoom, players: updatedPlayers },
      players: updatedPlayers
    });
  }
}));
