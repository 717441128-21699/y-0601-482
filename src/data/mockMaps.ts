import type { GameMap, Item } from '@/types/game';

export const mockMaps: GameMap[] = [
  {
    id: 'map1',
    name: '城市公园',
    description: '经典对称地图，适合新手练习夺旗战术，双方出生点距离适中',
    difficulty: 1,
    maxPlayers: 10,
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
        { x: 20, y: 50 },
        { x: 15, y: 40 },
        { x: 15, y: 60 }
      ],
      blue: [
        { x: 90, y: 30 },
        { x: 90, y: 70 },
        { x: 80, y: 50 },
        { x: 85, y: 40 },
        { x: 85, y: 60 }
      ]
    },
    capturePoints: [
      { x: 30, y: 30, id: 'cp1', name: '东北角楼' },
      { x: 70, y: 70, id: 'cp2', name: '西南角楼' }
    ],
    rules: {
      capturePointMode: 'occupy',
      flagMode: 'standard',
      respawnMode: 'fixed',
      scorePerFlag: 1,
      scorePerCapture: 2,
      flagCaptureTime: 5,
      capturePointTime: 8,
      recommendedItems: ['shield', 'speed', 'slowdown']
    }
  },
  {
    id: 'map2',
    name: '森林秘境',
    description: '地形复杂，掩体众多，适合战术配合与伏击战，三个据点争夺激烈',
    difficulty: 3,
    maxPlayers: 16,
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
        { x: 10, y: 35 },
        { x: 20, y: 30 },
        { x: 30, y: 25 }
      ],
      blue: [
        { x: 85, y: 75 },
        { x: 75, y: 85 },
        { x: 90, y: 65 },
        { x: 80, y: 70 },
        { x: 70, y: 75 }
      ]
    },
    capturePoints: [
      { x: 50, y: 50, id: 'cp1', name: '湖心岛' },
      { x: 35, y: 65, id: 'cp2', name: '东瞭望台' },
      { x: 65, y: 35, id: 'cp3', name: '西瞭望台' }
    ],
    rules: {
      capturePointMode: 'kingOfTheHill',
      flagMode: 'standard',
      respawnMode: 'capturedPoints',
      scorePerFlag: 2,
      scorePerCapture: 3,
      flagCaptureTime: 6,
      capturePointTime: 10,
      recommendedItems: ['slowdown', 'invisible', 'scout']
    }
  },
  {
    id: 'map3',
    name: '沙漠遗迹',
    description: '开阔地形，视野良好，速度为王的正面对决，中立旗是核心',
    difficulty: 2,
    maxPlayers: 12,
    width: 100,
    height: 100,
    flagPositions: {
      red: { x: 10, y: 50 },
      blue: { x: 90, y: 50 },
      neutral: { x: 50, y: 50 }
    },
    spawnPoints: {
      red: [
        { x: 15, y: 40 },
        { x: 15, y: 60 },
        { x: 25, y: 50 },
        { x: 20, y: 35 },
        { x: 20, y: 65 }
      ],
      blue: [
        { x: 85, y: 40 },
        { x: 85, y: 60 },
        { x: 75, y: 50 },
        { x: 80, y: 35 },
        { x: 80, y: 65 }
      ]
    },
    capturePoints: [
      { x: 50, y: 30, id: 'cp1', name: '北神殿' },
      { x: 50, y: 70, id: 'cp2', name: '南神殿' }
    ],
    rules: {
      capturePointMode: 'occupy',
      flagMode: 'neutralOnly',
      respawnMode: 'fixed',
      scorePerFlag: 3,
      scorePerCapture: 1,
      flagCaptureTime: 4,
      capturePointTime: 6,
      recommendedItems: ['speed', 'shield', 'shockwave']
    }
  },
  {
    id: 'map4',
    name: '雪山之巅',
    description: '垂直地形，多层结构，考验攀爬与上下层联动，复活点随占领变化',
    difficulty: 4,
    maxPlayers: 12,
    width: 100,
    height: 120,
    flagPositions: {
      red: { x: 50, y: 15 },
      blue: { x: 50, y: 105 },
      neutral: { x: 50, y: 60 }
    },
    spawnPoints: {
      red: [
        { x: 40, y: 20 },
        { x: 60, y: 20 },
        { x: 50, y: 30 },
        { x: 35, y: 25 },
        { x: 65, y: 25 }
      ],
      blue: [
        { x: 40, y: 100 },
        { x: 60, y: 100 },
        { x: 50, y: 90 },
        { x: 35, y: 95 },
        { x: 65, y: 95 }
      ]
    },
    capturePoints: [
      { x: 30, y: 50, id: 'cp1', name: '左侧平台' },
      { x: 70, y: 50, id: 'cp2', name: '右侧平台' },
      { x: 50, y: 65, id: 'cp3', name: '中央祭坛' }
    ],
    rules: {
      capturePointMode: 'kingOfTheHill',
      flagMode: 'multiple',
      respawnMode: 'dynamic',
      scorePerFlag: 2,
      scorePerCapture: 2,
      flagCaptureTime: 7,
      capturePointTime: 12,
      recommendedItems: ['shockwave', 'scout', 'invisible']
    }
  }
];

export const mockItems: Item[] = [
  {
    id: 'shield',
    name: '护盾',
    type: 'defense',
    description: '激活后获得3秒护盾，可抵挡一次敌方攻击或陷阱伤害',
    duration: 3,
    cooldown: 15,
    uses: 3,
    rarity: 2,
    icon: '🛡️',
    tips: '夺旗时优先开启，防止被秒。护盾只能抵挡一次伤害，注意时机。',
    mapBonus: [
      { mapId: 'map1', bonus: '公园开阔地带，护盾冲锋成功率+20%' },
      { mapId: 'map3', bonus: '沙漠正面刚，护盾抵挡关键伤害' }
    ]
  },
  {
    id: 'slowdown',
    name: '减速陷阱',
    type: 'trap',
    description: '在原地放置减速陷阱，敌方踩中后移动速度降低50%，持续5秒',
    duration: 5,
    cooldown: 20,
    uses: 2,
    rarity: 2,
    icon: '🕸️',
    tips: '放置在旗帜周围或狭窄通道效果最佳，配合队友包夹减速的敌人。',
    mapBonus: [
      { mapId: 'map2', bonus: '森林狭窄路口，陷阱触发率+30%' },
      { mapId: 'map4', bonus: '雪山平台入口，减速敌人登顶' }
    ]
  },
  {
    id: 'speed',
    name: '加速',
    type: 'utility',
    description: '5秒内自身移动速度提升50%，追击或撤退神器',
    duration: 5,
    cooldown: 25,
    uses: 3,
    rarity: 2,
    icon: '⚡',
    tips: '夺旗后使用加速快速返回基地，也可与护盾叠加使用形成无敌冲锋。',
    mapBonus: [
      { mapId: 'map3', bonus: '沙漠开阔地，速度优势最大化' },
      { mapId: 'map1', bonus: '公园对称地形，快速往返' }
    ]
  },
  {
    id: 'invisible',
    name: '隐身',
    type: 'utility',
    description: '4秒内进入隐身状态，敌方无法看到你的位置',
    duration: 4,
    cooldown: 30,
    uses: 2,
    rarity: 3,
    icon: '👻',
    tips: '隐身时夺旗不会被发现，但攻击或被攻击会解除隐身效果。',
    mapBonus: [
      { mapId: 'map2', bonus: '森林多掩体，隐身突袭效果拔群' },
      { mapId: 'map4', bonus: '雪山多死角，隐身绕后偷旗' }
    ]
  },
  {
    id: 'shockwave',
    name: '冲击波',
    type: 'attack',
    description: '释放一圈冲击波，击退周围敌人并造成短暂眩晕',
    duration: 2,
    cooldown: 35,
    uses: 2,
    rarity: 3,
    icon: '💥',
    tips: '被围堵时使用可以突围，也可以打断敌方正在进行的夺旗。',
    mapBonus: [
      { mapId: 'map4', bonus: '雪山平台混战，冲击波击退多人' },
      { mapId: 'map3', bonus: '沙漠据点防守，冲击波清场神器' }
    ]
  },
  {
    id: 'scout',
    name: '侦查眼',
    type: 'utility',
    description: '放置侦查眼，持续暴露周围敌人位置，持续10秒',
    duration: 10,
    cooldown: 40,
    uses: 2,
    rarity: 2,
    icon: '👁️',
    tips: '放置在关键路口提前预警，配合陷阱使用效果更佳。',
    mapBonus: [
      { mapId: 'map2', bonus: '森林视野差，侦查眼掌握全局' },
      { mapId: 'map4', bonus: '雪山多层结构，眼位控视野' }
    ]
  }
];
