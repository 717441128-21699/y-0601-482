import type { Player } from '@/types/game';

const createBasePlayer = (id: string, name: string): Player => ({
  id,
  name,
  team: null,
  isReady: false,
  isHost: false,
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
  position: { x: 0, y: 0 },
  isAlive: true,
  respawnTime: 0,
  itemCooldowns: {}
});

export const mockPlayers: Player[] = [
  {
    ...createBasePlayer('p1', '张三'),
    team: 'red',
    isReady: true,
    isHost: true,
    score: 120,
    kills: 5,
    deaths: 2,
    flagsCaptured: 2,
    position: { x: 20, y: 30 }
  },
  {
    ...createBasePlayer('p2', '李四'),
    team: 'red',
    isReady: true,
    isHost: false,
    score: 95,
    kills: 3,
    deaths: 3,
    flagsCaptured: 1,
    position: { x: 25, y: 45 }
  },
  {
    ...createBasePlayer('p3', '王五'),
    team: 'red',
    isReady: false,
    isHost: false,
    score: 80,
    kills: 2,
    deaths: 4,
    flagsCaptured: 0,
    hasShield: true,
    shieldTime: 3,
    position: { x: 15, y: 60 },
    isAlive: false,
    respawnTime: 5
  },
  {
    ...createBasePlayer('p4', '赵六'),
    team: 'red',
    isReady: true,
    isHost: false,
    score: 110,
    kills: 4,
    deaths: 1,
    flagsCaptured: 1,
    isSlowdown: true,
    slowdownTime: 3,
    position: { x: 30, y: 35 }
  },
  {
    ...createBasePlayer('p5', '钱七'),
    team: 'blue',
    isReady: true,
    isHost: false,
    score: 130,
    kills: 6,
    deaths: 2,
    flagsCaptured: 2,
    position: { x: 75, y: 30 }
  },
  {
    ...createBasePlayer('p6', '孙八'),
    team: 'blue',
    isReady: true,
    isHost: false,
    score: 100,
    kills: 3,
    deaths: 3,
    flagsCaptured: 1,
    hasShield: true,
    shieldTime: 2,
    position: { x: 70, y: 50 }
  },
  {
    ...createBasePlayer('p7', '周九'),
    team: 'blue',
    isReady: false,
    isHost: false,
    score: 75,
    kills: 2,
    deaths: 5,
    flagsCaptured: 0,
    position: { x: 80, y: 40 },
    isAlive: false,
    respawnTime: 8
  },
  {
    ...createBasePlayer('p8', '吴十'),
    team: 'blue',
    isReady: true,
    isHost: false,
    score: 105,
    kills: 4,
    deaths: 2,
    flagsCaptured: 1,
    position: { x: 65, y: 65 }
  }
];

export const mockWaitingPlayers: Player[] = [
  { ...createBasePlayer('w1', '玩家A') },
  { ...createBasePlayer('w2', '玩家B') },
  { ...createBasePlayer('w3', '玩家C'), isReady: true },
  { ...createBasePlayer('w4', '玩家D'), isReady: true },
  { ...createBasePlayer('w5', '玩家E') },
  { ...createBasePlayer('w6', '玩家F'), isReady: true }
];
