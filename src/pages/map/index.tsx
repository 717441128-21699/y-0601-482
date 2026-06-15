import React, { useState } from 'react';
import { View, Text, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { useGameStore } from '@/store/gameStore';
import type { GameMap } from '@/types/game';
import classnames from 'classnames';

const MapPage: React.FC = () => {
  const { maps, currentMap, setMap, currentRoom } = useGameStore();
  const [selectedMap, setSelectedMap] = useState<GameMap | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  const getMapIcon = (mapId: string) => {
    switch (mapId) {
      case 'map1': return '🌳';
      case 'map2': return '🌲';
      case 'map3': return '🏜️';
      case 'map4': return '🏔️';
      default: return '🗺️';
    }
  };

  const getDifficulty = (mapId: string) => {
    switch (mapId) {
      case 'map1': return { text: '简单', level: 1 };
      case 'map2': return { text: '困难', level: 3 };
      case 'map3': return { text: '中等', level: 2 };
      case 'map4': return { text: '地狱', level: 4 };
      default: return { text: '未知', level: 0 };
    }
  };

  const getPlayerCount = (mapId: string) => {
    switch (mapId) {
      case 'map1': return '4-10人';
      case 'map2': return '6-16人';
      case 'map3': return '4-12人';
      case 'map4': return '6-12人';
      default: return '4-10人';
    }
  };

  const handleSelectMap = (map: GameMap) => {
    setMap(map.id);
    Taro.showToast({ title: `已选择 ${map.name}`, icon: 'success' });
    console.log('[Map] Map selected:', map.name);
  };

  const handleViewDetail = (map: GameMap) => {
    setSelectedMap(map);
    setShowDetail(true);
  };

  return (
    <ScrollView className={styles.mapPage} scrollY>
      <View className={styles.pageHeader}>
        <Text className={styles.title}>🗺️ 地图中心</Text>
        <Text className={styles.subtitle}>选择适合你的战场</Text>
      </View>

      <View className={styles.mapGrid}>
        {maps.map(map => {
          const difficulty = getDifficulty(map.id);
          const isSelected = currentMap?.id === map.id;
          
          return (
            <View
              key={map.id}
              className={classnames(styles.mapCard, { [styles.active]: isSelected })}
            >
              <View 
                className={styles.mapPreview}
                onClick={() => handleViewDetail(map)}
              >
                <Text className={styles.mapIcon}>{getMapIcon(map.id)}</Text>
                <View className={styles.difficultyBadge}>
                  {'⭐'.repeat(difficulty.level)} {difficulty.text}
                </View>
                {isSelected && <View className={styles.mapBadge}>已选择</View>}
              </View>

              <View className={styles.mapInfo}>
                <View className={styles.mapHeader}>
                  <Text className={styles.mapName}>{map.name}</Text>
                  <Text className={styles.playerCount}>👥 {getPlayerCount(map.id)}</Text>
                </View>
                <Text className={styles.mapDesc}>{map.description}</Text>
                <View className={styles.mapStats}>
                  <View className={styles.statItem}>
                    <Text className={styles.statIcon}>🚩</Text>
                    <Text className={styles.statValue}>{Object.keys(map.flagPositions).length}</Text>
                    <Text className={styles.statLabel}>旗帜</Text>
                  </View>
                  <View className={styles.statItem}>
                    <Text className={styles.statIcon}>⭐</Text>
                    <Text className={styles.statValue}>{map.capturePoints?.length || 0}</Text>
                    <Text className={styles.statLabel}>据点</Text>
                  </View>
                  <View className={styles.statItem}>
                    <Text className={styles.statIcon}>🏠</Text>
                    <Text className={styles.statValue}>{map.spawnPoints.red.length}</Text>
                    <Text className={styles.statLabel}>出生点</Text>
                  </View>
                </View>
              </View>

              <View className={styles.mapAction}>
                <Button
                  className={classnames(styles.selectBtn, { [styles.selected]: isSelected })}
                  onClick={() => handleSelectMap(map)}
                >
                  {isSelected ? '✓ 已选择' : '选择此地图'}
                </Button>
              </View>
            </View>
          );
        })}
      </View>

      {/* 地图详情弹窗 */}
      {showDetail && selectedMap && (
        <View className={styles.detailModal} onClick={() => setShowDetail(false)}>
          <View className={styles.detailContent} onClick={e => e.stopPropagation()}>
            <View className={styles.detailHeader}>
              <Text className={styles.title}>{selectedMap.name}</Text>
              <Text className={styles.closeBtn} onClick={() => setShowDetail(false)}>✕</Text>
            </View>

            <ScrollView className={styles.detailBody} scrollY>
              <View className={styles.detailPreview}>
                <Text className={styles.bigIcon}>{getMapIcon(selectedMap.id)}</Text>
                <View className={styles.miniMap}>
                  <View className={styles.gridOverlay}></View>
                  
                  {Object.entries(selectedMap.flagPositions).map(([key, pos]) => (
                    <View
                      key={key}
                      className={styles.flagPoint}
                      style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                    >
                      {key === 'red' ? '🚩' : key === 'blue' ? '🚩' : '🏳️'}
                    </View>
                  ))}

                  {selectedMap.spawnPoints.red.map((pos, idx) => (
                    <View
                      key={`red-${idx}`}
                      className={classnames(styles.spawnPoint, styles.red)}
                      style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                    ></View>
                  ))}
                  
                  {selectedMap.spawnPoints.blue.map((pos, idx) => (
                    <View
                      key={`blue-${idx}`}
                      className={classnames(styles.spawnPoint, styles.blue)}
                      style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                    ></View>
                  ))}

                  {selectedMap.capturePoints?.map(cp => (
                    <View
                      key={cp.id}
                      className={styles.capturePoint}
                      style={{ left: `${cp.x}%`, top: `${cp.y}%` }}
                    ></View>
                  ))}
                </View>
              </View>

              <View className={styles.detailInfo}>
                <View className={styles.infoRow}>
                  <Text className={styles.label}>难度等级</Text>
                  <Text className={styles.value}>
                    {'⭐'.repeat(getDifficulty(selectedMap.id).level)} {getDifficulty(selectedMap.id).text}
                  </Text>
                </View>
                <View className={styles.infoRow}>
                  <Text className={styles.label}>推荐人数</Text>
                  <Text className={styles.value}>{getPlayerCount(selectedMap.id)}</Text>
                </View>
                <View className={styles.infoRow}>
                  <Text className={styles.label}>旗帜数量</Text>
                  <Text className={styles.value}>{Object.keys(selectedMap.flagPositions).length} 个</Text>
                </View>
                <View className={styles.infoRow}>
                  <Text className={styles.label}>据点数量</Text>
                  <Text className={styles.value}>{selectedMap.capturePoints?.length || 0} 个</Text>
                </View>
                <View className={styles.infoRow}>
                  <Text className={styles.label}>地图尺寸</Text>
                  <Text className={styles.value}>{selectedMap.width} × {selectedMap.height}</Text>
                </View>
              </View>

              <View className={styles.detailTips}>
                <Text className={styles.tipsTitle}>
                  <Text className={styles.icon}>💡</Text>
                  地图攻略
                </Text>
                <View className={styles.tipsList}>
                  {selectedMap.id === 'map1' && (
                    <>
                      <Text>• 经典对称地图，适合新手练习</Text>
                      <Text>• 中央中立旗是争夺焦点</Text>
                      <Text>• 注意两侧据点的控制权</Text>
                    </>
                  )}
                  {selectedMap.id === 'map2' && (
                    <>
                      <Text>• 地形复杂，适合战术配合</Text>
                      <Text>• 多利用掩体进行伏击</Text>
                      <Text>• 三个据点需要分兵把守</Text>
                    </>
                  )}
                  {selectedMap.id === 'map3' && (
                    <>
                      <Text>• 开阔地形，速度为王</Text>
                      <Text>• 加速道具效果更佳</Text>
                      <Text>• 注意躲避对方远程攻击</Text>
                    </>
                  )}
                  {selectedMap.id === 'map4' && (
                    <>
                      <Text>• 垂直地形，考验攀爬</Text>
                      <Text>• 上下层之间有传送点</Text>
                      <Text>• 居高临下有视野优势</Text>
                    </>
                  )}
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default MapPage;
