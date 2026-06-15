import React, { useState } from 'react';
import { View, Text, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { useGameStore } from '@/store/gameStore';
import type { GameMap } from '@/types/game';
import classnames from 'classnames';

const MapPage: React.FC = () => {
  const { maps, currentMap, setMap, currentRoom, items } = useGameStore();
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

  const getDifficultyText = (level: number) => {
    switch (level) {
      case 1: return '简单';
      case 2: return '中等';
      case 3: return '困难';
      case 4: return '地狱';
      default: return '未知';
    }
  };

  const getCapturePointModeText = (mode: string) => {
    switch (mode) {
      case 'occupy': return '据点占领';
      case 'kingOfTheHill': return '山丘之王';
      case 'none': return '无据点';
      default: return mode;
    }
  };

  const getFlagModeText = (mode: string) => {
    switch (mode) {
      case 'standard': return '标准夺旗';
      case 'neutralOnly': return '中立旗争夺';
      case 'multiple': return '多旗模式';
      default: return mode;
    }
  };

  const getRespawnModeText = (mode: string) => {
    switch (mode) {
      case 'fixed': return '固定复活';
      case 'dynamic': return '动态复活';
      case 'capturedPoints': return '据点复活';
      default: return mode;
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
                  {'⭐'.repeat(map.difficulty)} {getDifficultyText(map.difficulty)}
                </View>
                {isSelected && <View className={styles.mapBadge}>已选择</View>}
              </View>

              <View className={styles.mapInfo}>
                <View className={styles.mapHeader}>
                  <Text className={styles.mapName}>{map.name}</Text>
                  <Text className={styles.playerCount}>👥 {map.maxPlayers}人</Text>
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
                {map.rules && (
                  <View className={styles.mapRules}>
                    <View className={styles.ruleTag}>
                      <Text className={styles.ruleIcon}>🎯</Text>
                      <Text className={styles.ruleText}>{getFlagModeText(map.rules.flagMode)}</Text>
                    </View>
                    {map.rules.capturePointMode !== 'none' && (
                      <View className={styles.ruleTag}>
                        <Text className={styles.ruleIcon}>⭐</Text>
                        <Text className={styles.ruleText}>{getCapturePointModeText(map.rules.capturePointMode)}</Text>
                      </View>
                    )}
                    <View className={styles.ruleTag}>
                      <Text className={styles.ruleIcon}>💀</Text>
                      <Text className={styles.ruleText}>{getRespawnModeText(map.rules.respawnMode)}</Text>
                    </View>
                  </View>
                )}
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
                    >
                      <Text className={styles.cpLabel}>{cp.name?.charAt(0) || '⭐'}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View className={styles.detailInfo}>
                <View className={styles.infoRow}>
                  <Text className={styles.label}>难度等级</Text>
                  <Text className={styles.value}>
                    {'⭐'.repeat(selectedMap.difficulty)} {getDifficultyText(selectedMap.difficulty)}
                  </Text>
                </View>
                <View className={styles.infoRow}>
                  <Text className={styles.label}>最大人数</Text>
                  <Text className={styles.value}>{selectedMap.maxPlayers} 人</Text>
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

              {selectedMap.rules && (
                <View className={styles.detailRules}>
                  <Text className={styles.rulesTitle}>
                    <Text className={styles.icon}>📜</Text>
                    玩法规则
                  </Text>
                  <View className={styles.rulesList}>
                    <View className={styles.ruleItem}>
                      <Text className={styles.ruleItemIcon}>🎯</Text>
                      <View className={styles.ruleItemInfo}>
                        <Text className={styles.ruleItemName}>旗帜模式</Text>
                        <Text className={styles.ruleItemDesc}>
                          {getFlagModeText(selectedMap.rules.flagMode)} · 夺旗得 {selectedMap.rules.scorePerFlag} 分
                        </Text>
                      </View>
                    </View>
                    {selectedMap.rules.capturePointMode !== 'none' && (
                      <View className={styles.ruleItem}>
                        <Text className={styles.ruleItemIcon}>⭐</Text>
                        <View className={styles.ruleItemInfo}>
                          <Text className={styles.ruleItemName}>据点模式</Text>
                          <Text className={styles.ruleItemDesc}>
                            {getCapturePointModeText(selectedMap.rules.capturePointMode)} · 占领得 {selectedMap.rules.scorePerCapture} 分
                          </Text>
                        </View>
                      </View>
                    )}
                    <View className={styles.ruleItem}>
                      <Text className={styles.ruleItemIcon}>💀</Text>
                      <View className={styles.ruleItemInfo}>
                        <Text className={styles.ruleItemName}>复活模式</Text>
                        <Text className={styles.ruleItemDesc}>
                          {getRespawnModeText(selectedMap.rules.respawnMode)}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              )}

              {selectedMap.capturePoints && selectedMap.capturePoints.length > 0 && (
                <View className={styles.detailCapturePoints}>
                  <Text className={styles.sectionTitle}>
                    <Text className={styles.icon}>⭐</Text>
                    据点列表
                  </Text>
                  <View className={styles.capturePointsList}>
                    {selectedMap.capturePoints.map(cp => (
                      <View key={cp.id} className={styles.cpRow}>
                        <Text className={styles.cpRowIcon}>⭐</Text>
                        <View className={styles.cpRowInfo}>
                          <Text className={styles.cpRowName}>{cp.name}</Text>
                          <Text className={styles.cpRowPos}>位置: ({cp.x}%, {cp.y}%)</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {selectedMap.rules?.recommendedItems && selectedMap.rules.recommendedItems.length > 0 && (
                <View className={styles.detailRecommendedItems}>
                  <Text className={styles.sectionTitle}>
                    <Text className={styles.icon}>🎒</Text>
                    推荐道具
                  </Text>
                  <View className={styles.recommendedItemsList}>
                    {selectedMap.rules.recommendedItems.map(itemId => {
                      const item = items.find(i => i.id === itemId);
                      return item ? (
                        <View key={itemId} className={styles.recItem}>
                          <Text className={styles.recItemIcon}>{item.icon}</Text>
                          <Text className={styles.recItemName}>{item.name}</Text>
                        </View>
                      ) : null;
                    })}
                  </View>
                </View>
              )}

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
