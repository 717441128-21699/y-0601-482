import type { GameMap, Item } from '@/types/game';

export const mockMaps: GameMap[] = [
  {
    id: 'map1',
    name: '城市公园',
    description: '经典对称地图，适合新手',
    width: 100,
    height: 100,
    flagPositions: {
      red: { x: 15, y: 50 },
      blue: { x: 85, y: 50 },
      neutral: { x: 50, y: 50 }
    },
    spawnPoints: {
      red: [
        { x: 10, y: 30 },
        { x: 10, y: 70 },
        { x: 20, y: 50 }
      ],
      blue: [
        { x: 90, y: 30 },
        { x: 90, y: 70 },
        { x: 80, y: 50 }
      ]
    },
    capturePoints: [
      { x: 30, y: 30, id: 'cp1' },
      { x: 70, y: 70, id: 'cp2' }
    ]
  },
  {
    id: 'map2',
    name: '森林秘境',
    description: '地形复杂，适合战术配合',
    width: 100,
    height: 100,
    flagPositions: {
      red: { x: 20, y: 20 },
      blue: { x: 80, y: 80 }
    },
    spawnPoints: {
      red: [
        { x: 15, y: 25 },
        { x: 25, y: 15 },
        { x: 10, y: 35 }
      ],
      blue: [
        { x: 85, y: 75 },
        { x: 75, y: 85 },
        { x: 90, y: 65 }
      ]
    },
    capturePoints: [
      { x: 50, y: 50, id: 'cp1' },
      { x: 35, y: 65, id: 'cp2' },
      { x: 65, y: 35, id: 'cp3' }
    ]
  },
  {
    id: 'map3',
    name: '沙漠遗迹',
    description: '开阔地形，速度为王',
    width: 100,
    height: 100,
    flagPositions: {
      red: { x: 10, y: 50 },
      blue: { x: 90, y: 50 }
    },
    spawnPoints: {
      red: [
        { x: 15, y: 40 },
        { x: 15, y: 60 },
        { x: 25, y: 50 }
      ],
      blue: [
        { x: 85, y: 40 },
        { x: 85, y: 60 },
        { x: 75, y: 50 }
      ]
    },
    capturePoints: [
      { x: 50, y: 30, id: 'cp1' },
      { x: 50, y: 70, id: 'cp2' }
    ]
  },
  {
    id: 'map4',
    name: '雪山之巅',
    description: '垂直地形，考验攀爬',
    width: 100,
    height: 120,
    flagPositions: {
      red: { x: 50, y: 15 },
      blue: { x: 50, y: 105 }
    },
    spawnPoints: {
      red: [
        { x: 40, y: 20 },
        { x: 60, y: 20 },
        { x: 50, y: 30 }
      ],
      blue: [
        { x: 40, y: 100 },
        { x: 60, y: 100 },
        { x: 50, y: 90 }
      ]
    },
    capturePoints: [
      { x: 30, y: 50, id: 'cp1' },
      { x: 70, y: 50, id: 'cp2' },
      { x: 50, y: 65, id: 'cp3' }
    ]
  }
];

export const mockItems: Item[] = [
  {
    id: 'shield',
    name: '护盾',
    type: 'shield',
    description: '3秒内免疫一次攻击',
    duration: 3,
    cooldown: 15,
    icon: '🛡️'
  },
  {
    id: 'slowdown',
    name: '减速陷阱',
    type: 'slowdown',
    description: '使范围内敌人移动减速5秒',
    duration: 5,
    cooldown: 20,
    icon: '🕸️'
  },
  {
    id: 'speed',
    name: '加速',
    type: 'speed',
    description: '5秒内移动速度提升50%',
    duration: 5,
    cooldown: 25,
    icon: '⚡'
  },
  {
    id: 'invisible',
    name: '隐身',
    type: 'invisible',
    description: '4秒内不被敌方发现',
    duration: 4,
    cooldown: 30,
    icon: '👻'
  }
];
