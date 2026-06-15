import type { GameRecord } from '@/types/game';

const generateTimeline = (duration: number, finalRed: number, finalBlue: number) => {
  const timeline: { time: number; red: number; blue: number }[] = [];
  const steps = 8;
  let red = 0, blue = 0;
  timeline.push({ time: duration, red: 0, blue: 0 });
  
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const nextRed = Math.min(finalRed, Math.round(finalRed * (t + (Math.random() - 0.5) * 0.3)));
    const nextBlue = Math.min(finalBlue, Math.round(finalBlue * (t + (Math.random() - 0.5) * 0.3)));
    if (nextRed > red || nextBlue > blue) {
      red = nextRed;
      blue = nextBlue;
      timeline.push({ 
        time: Math.round(duration * (1 - t)), 
        red, 
        blue 
      });
    }
  }
  
  timeline.push({ time: 0, red: finalRed, blue: finalBlue });
  return timeline;
};

export const mockRecords: GameRecord[] = [
  {
    id: 'r1',
    date: '2024-01-15 14:30',
    mapName: '城市公园',
    mapId: 'map1',
    duration: 600,
    winner: 'blue',
    score: { red: 2, blue: 3 },
    scoreTimeline: generateTimeline(600, 2, 3),
    mvpPlayerId: 'p5',
    mvpReason: '全场最高击杀 8 次；夺旗 3 次，是进攻核心；综合评分 180，表现全能',
    players: [
      { 
        playerId: 'p1', playerName: '张三', team: 'red', score: 120, kills: 5, deaths: 2, 
        flagsCaptured: 2, pointsCaptured: 1, isMvp: false,
        itemsUsed: [{ itemId: 'shield', count: 2 }, { itemId: 'speed', count: 1 }]
      },
      { 
        playerId: 'p2', playerName: '李四', team: 'red', score: 95, kills: 3, deaths: 3, 
        flagsCaptured: 1, pointsCaptured: 2, isMvp: false,
        itemsUsed: [{ itemId: 'slowdown', count: 2 }, { itemId: 'shockwave', count: 1 }]
      },
      { 
        playerId: 'p5', playerName: '钱七', team: 'blue', score: 180, kills: 8, deaths: 1, 
        flagsCaptured: 3, pointsCaptured: 2, isMvp: true,
        mvpReason: '全场最高击杀 8 次；夺旗 3 次，是进攻核心；综合评分 180，表现全能',
        itemsUsed: [{ itemId: 'shield', count: 3 }, { itemId: 'speed', count: 2 }, { itemId: 'shockwave', count: 1 }]
      },
      { 
        playerId: 'p6', playerName: '孙八', team: 'blue', score: 140, kills: 5, deaths: 2, 
        flagsCaptured: 2, pointsCaptured: 1, isMvp: false,
        itemsUsed: [{ itemId: 'speed', count: 2 }, { itemId: 'slowdown', count: 1 }]
      }
    ]
  },
  {
    id: 'r2',
    date: '2024-01-14 16:00',
    mapName: '森林秘境',
    mapId: 'map2',
    duration: 480,
    winner: 'red',
    score: { red: 5, blue: 3 },
    scoreTimeline: generateTimeline(480, 5, 3),
    mvpPlayerId: 'p1',
    mvpReason: '全场最高击杀 10 次；夺旗 3 次，是进攻核心；综合评分 200，表现全能',
    players: [
      { 
        playerId: 'p1', playerName: '张三', score: 200, kills: 10, deaths: 2, 
        flagsCaptured: 3, pointsCaptured: 2, team: 'red', isMvp: true,
        mvpReason: '全场最高击杀 10 次；夺旗 3 次，是进攻核心；综合评分 200，表现全能',
        itemsUsed: [{ itemId: 'shield', count: 3 }, { itemId: 'speed', count: 2 }, { itemId: 'invisible', count: 1 }]
      },
      { 
        playerId: 'p3', playerName: '王五', score: 150, kills: 6, deaths: 4, 
        flagsCaptured: 2, pointsCaptured: 3, team: 'red', isMvp: false,
        itemsUsed: [{ itemId: 'slowdown', count: 2 }, { itemId: 'scout', count: 1 }]
      },
      { 
        playerId: 'p5', playerName: '钱七', score: 130, kills: 5, deaths: 5, 
        flagsCaptured: 2, pointsCaptured: 1, team: 'blue', isMvp: false,
        itemsUsed: [{ itemId: 'shield', count: 2 }, { itemId: 'shockwave', count: 1 }]
      },
      { 
        playerId: 'p7', playerName: '周九', score: 90, kills: 3, deaths: 6, 
        flagsCaptured: 1, pointsCaptured: 1, team: 'blue', isMvp: false,
        itemsUsed: [{ itemId: 'speed', count: 1 }, { itemId: 'slowdown', count: 1 }]
      }
    ]
  },
  {
    id: 'r3',
    date: '2024-01-13 10:30',
    mapName: '沙漠遗迹',
    mapId: 'map3',
    duration: 720,
    winner: 'draw',
    score: { red: 4, blue: 4 },
    scoreTimeline: generateTimeline(720, 4, 4),
    mvpPlayerId: 'p4',
    mvpReason: '全场最高击杀 8 次；夺旗 3 次，是进攻核心；综合评分 170，表现全能',
    players: [
      { 
        playerId: 'p2', playerName: '李四', score: 160, kills: 7, deaths: 3, 
        flagsCaptured: 2, pointsCaptured: 0, team: 'red', isMvp: false,
        itemsUsed: [{ itemId: 'shield', count: 2 }, { itemId: 'shockwave', count: 2 }]
      },
      { 
        playerId: 'p4', playerName: '赵六', score: 170, kills: 8, deaths: 3, 
        flagsCaptured: 3, pointsCaptured: 0, team: 'red', isMvp: true,
        mvpReason: '全场最高击杀 8 次；夺旗 3 次，是进攻核心；综合评分 170，表现全能',
        itemsUsed: [{ itemId: 'speed', count: 3 }, { itemId: 'invisible', count: 2 }]
      },
      { 
        playerId: 'p6', playerName: '孙八', score: 170, kills: 7, deaths: 3, 
        flagsCaptured: 3, pointsCaptured: 0, team: 'blue', isMvp: true,
        mvpReason: '全场最高击杀 7 次；夺旗 3 次，是进攻核心；综合评分 170，表现全能',
        itemsUsed: [{ itemId: 'shield', count: 2 }, { itemId: 'speed', count: 2 }, { itemId: 'scout', count: 1 }]
      },
      { 
        playerId: 'p8', playerName: '吴十', score: 140, kills: 6, deaths: 4, 
        flagsCaptured: 2, pointsCaptured: 0, team: 'blue', isMvp: false,
        itemsUsed: [{ itemId: 'slowdown', count: 3 }, { itemId: 'shockwave', count: 1 }]
      }
    ]
  },
  {
    id: 'r4',
    date: '2024-01-12 15:45',
    mapName: '雪山之巅',
    mapId: 'map4',
    duration: 540,
    winner: 'blue',
    score: { red: 1, blue: 4 },
    scoreTimeline: generateTimeline(540, 1, 4),
    mvpPlayerId: 'p5',
    mvpReason: '全场最高击杀 12 次；夺旗 4 次，是进攻核心；仅阵亡 1 次，生存能力强；综合评分 220，表现全能',
    players: [
      { 
        playerId: 'p1', playerName: '张三', score: 80, kills: 2, deaths: 5, 
        flagsCaptured: 1, pointsCaptured: 1, team: 'red', isMvp: false,
        itemsUsed: [{ itemId: 'shield', count: 1 }]
      },
      { 
        playerId: 'p3', playerName: '王五', score: 60, kills: 1, deaths: 6, 
        flagsCaptured: 0, pointsCaptured: 0, team: 'red', isMvp: false,
        itemsUsed: [{ itemId: 'slowdown', count: 1 }, { itemId: 'speed', count: 1 }]
      },
      { 
        playerId: 'p5', playerName: '钱七', score: 220, kills: 12, deaths: 1, 
        flagsCaptured: 4, pointsCaptured: 2, team: 'blue', isMvp: true,
        mvpReason: '全场最高击杀 12 次；夺旗 4 次，是进攻核心；仅阵亡 1 次，生存能力强；综合评分 220，表现全能',
        itemsUsed: [{ itemId: 'shield', count: 3 }, { itemId: 'speed', count: 3 }, { itemId: 'shockwave', count: 2 }, { itemId: 'invisible', count: 1 }]
      },
      { 
        playerId: 'p7', playerName: '周九', score: 110, kills: 4, deaths: 3, 
        flagsCaptured: 2, pointsCaptured: 2, team: 'blue', isMvp: false,
        itemsUsed: [{ itemId: 'shield', count: 2 }, { itemId: 'slowdown', count: 2 }, { itemId: 'scout', count: 1 }]
      }
    ]
  },
  {
    id: 'r5',
    date: '2024-01-11 09:00',
    mapName: '城市公园',
    mapId: 'map1',
    duration: 660,
    winner: 'red',
    score: { red: 6, blue: 5 },
    scoreTimeline: generateTimeline(660, 6, 5),
    mvpPlayerId: 'p4',
    mvpReason: '全场最高击杀 9 次；夺旗 4 次，是进攻核心；占领据点 3 次；综合评分 190，表现全能',
    players: [
      { 
        playerId: 'p4', playerName: '赵六', score: 190, kills: 9, deaths: 3, 
        flagsCaptured: 4, pointsCaptured: 3, team: 'red', isMvp: true,
        mvpReason: '全场最高击杀 9 次；夺旗 4 次，是进攻核心；占领据点 3 次；综合评分 190，表现全能',
        itemsUsed: [{ itemId: 'shield', count: 2 }, { itemId: 'speed', count: 3 }, { itemId: 'shockwave', count: 2 }]
      },
      { 
        playerId: 'p2', playerName: '李四', score: 150, kills: 6, deaths: 5, 
        flagsCaptured: 3, pointsCaptured: 2, team: 'red', isMvp: false,
        itemsUsed: [{ itemId: 'slowdown', count: 3 }, { itemId: 'scout', count: 1 }]
      },
      { 
        playerId: 'p8', playerName: '吴十', score: 160, kills: 7, deaths: 4, 
        flagsCaptured: 3, pointsCaptured: 1, team: 'blue', isMvp: false,
        itemsUsed: [{ itemId: 'shield', count: 2 }, { itemId: 'invisible', count: 2 }]
      },
      { 
        playerId: 'p6', playerName: '孙八', score: 180, kills: 8, deaths: 4, 
        flagsCaptured: 4, pointsCaptured: 2, team: 'blue', isMvp: false,
        itemsUsed: [{ itemId: 'speed', count: 3 }, { itemId: 'shockwave', count: 2 }, { itemId: 'slowdown', count: 2 }]
      }
    ]
  }
];
