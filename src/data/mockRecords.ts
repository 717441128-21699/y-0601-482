import type { GameRecord } from '@/types/game';

export const mockRecords: GameRecord[] = [
  {
    id: 'r1',
    date: '2024-01-15 14:30',
    mapName: '城市公园',
    duration: 600,
    winner: 'blue',
    score: { red: 2, blue: 3 },
    players: [
      { playerId: 'p1', playerName: '张三', team: 'red', score: 120, kills: 5, deaths: 2, flagsCaptured: 2, isMvp: false },
      { playerId: 'p2', playerName: '李四', team: 'red', score: 95, kills: 3, deaths: 3, flagsCaptured: 1, isMvp: false },
      { playerId: 'p5', playerName: '钱七', team: 'blue', score: 180, kills: 8, deaths: 1, flagsCaptured: 3, isMvp: true },
      { playerId: 'p6', playerName: '孙八', team: 'blue', score: 140, kills: 5, deaths: 2, flagsCaptured: 2, isMvp: false }
    ]
  },
  {
    id: 'r2',
    date: '2024-01-14 16:00',
    mapName: '森林秘境',
    duration: 480,
    winner: 'red',
    score: { red: 5, blue: 3 },
    players: [
      { playerId: 'p1', playerName: '张三', score: 200, kills: 10, deaths: 2, flagsCaptured: 3, team: 'red', isMvp: true },
      { playerId: 'p3', playerName: '王五', score: 150, kills: 6, deaths: 4, flagsCaptured: 2, team: 'red', isMvp: false },
      { playerId: 'p5', playerName: '钱七', score: 130, kills: 5, deaths: 5, flagsCaptured: 2, team: 'blue', isMvp: false },
      { playerId: 'p7', playerName: '周九', score: 90, kills: 3, deaths: 6, flagsCaptured: 1, team: 'blue', isMvp: false }
    ]
  },
  {
    id: 'r3',
    date: '2024-01-13 10:30',
    mapName: '沙漠遗迹',
    duration: 720,
    winner: 'draw',
    score: { red: 4, blue: 4 },
    players: [
      { playerId: 'p2', playerName: '李四', score: 160, kills: 7, deaths: 3, flagsCaptured: 2, team: 'red', isMvp: false },
      { playerId: 'p4', playerName: '赵六', score: 170, kills: 8, deaths: 3, flagsCaptured: 3, team: 'red', isMvp: true },
      { playerId: 'p6', playerName: '孙八', score: 170, kills: 7, deaths: 3, flagsCaptured: 3, team: 'blue', isMvp: true },
      { playerId: 'p8', playerName: '吴十', score: 140, kills: 6, deaths: 4, flagsCaptured: 2, team: 'blue', isMvp: false }
    ]
  },
  {
    id: 'r4',
    date: '2024-01-12 15:45',
    mapName: '雪山之巅',
    duration: 540,
    winner: 'blue',
    score: { red: 1, blue: 4 },
    players: [
      { playerId: 'p1', playerName: '张三', score: 80, kills: 2, deaths: 5, flagsCaptured: 1, team: 'red', isMvp: false },
      { playerId: 'p3', playerName: '王五', score: 60, kills: 1, deaths: 6, flagsCaptured: 0, team: 'red', isMvp: false },
      { playerId: 'p5', playerName: '钱七', score: 220, kills: 12, deaths: 1, flagsCaptured: 4, team: 'blue', isMvp: true },
      { playerId: 'p7', playerName: '周九', score: 110, kills: 4, deaths: 3, flagsCaptured: 2, team: 'blue', isMvp: false }
    ]
  },
  {
    id: 'r5',
    date: '2024-01-11 09:00',
    mapName: '城市公园',
    duration: 660,
    winner: 'red',
    score: { red: 6, blue: 5 },
    players: [
      { playerId: 'p4', playerName: '赵六', score: 190, kills: 9, deaths: 3, flagsCaptured: 4, team: 'red', isMvp: true },
      { playerId: 'p2', playerName: '李四', score: 150, kills: 6, deaths: 5, flagsCaptured: 3, team: 'red', isMvp: false },
      { playerId: 'p8', playerName: '吴十', score: 160, kills: 7, deaths: 4, flagsCaptured: 3, team: 'blue', isMvp: false },
      { playerId: 'p6', playerName: '孙八', score: 180, kills: 8, deaths: 4, flagsCaptured: 4, team: 'blue', isMvp: false }
    ]
  }
];
