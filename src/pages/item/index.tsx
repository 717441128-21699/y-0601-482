import React, { useState } from 'react';
import { View, Text, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { useGameStore } from '@/store/gameStore';
import type { Item } from '@/types/game';
import classnames from 'classnames';

type TabType = 'all' | 'attack' | 'defense' | 'utility' | 'trap';

const ItemPage: React.FC = () => {
  const { items, selectedItems, toggleSelectItem, currentMap, maps } = useGameStore();
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  const recommendedItemIds = currentMap?.rules?.recommendedItems || [];

  const tabs: { key: TabType; label: string; icon: string }[] = [
    { key: 'all', label: '全部', icon: '📦' },
    { key: 'attack', label: '攻击', icon: '⚔️' },
    { key: 'defense', label: '防御', icon: '🛡️' },
    { key: 'utility', label: '功能', icon: '✨' },
    { key: 'trap', label: '陷阱', icon: '🕸️' }
  ];

  const filteredItems = activeTab === 'all' 
    ? items 
    : items.filter(item => item.type === activeTab);

  const getMapBonus = (item: Item) => {
    if (!currentMap || !item.mapBonus) return null;
    return item.mapBonus.find(b => b.mapId === currentMap.id);
  };

  const getItemTypeLabel = (type: string) => {
    switch (type) {
      case 'attack': return '攻击';
      case 'defense': return '防御';
      case 'utility': return '功能';
      case 'trap': return '陷阱';
      default: return '其他';
    }
  };

  const getItemRarity = (rarity: number) => {
    const stars = '⭐'.repeat(rarity);
    const text = ['普通', '稀有', '史诗', '传说', '神话'][rarity - 1] || '未知';
    return { stars, text };
  };

  const getItemIcon = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    return item?.icon || '🎁';
  };

  const handleViewDetail = (item: Item) => {
    setSelectedItem(item);
    setShowDetail(true);
  };

  const handleToggleSelect = (item: Item, e?: any) => {
    if (e) e.stopPropagation();
    
    if (!selectedItems.includes(item.id) && selectedItems.length >= 4) {
      Taro.showToast({ title: '最多携带4个道具', icon: 'none' });
      return;
    }
    
    toggleSelectItem(item.id);
  };

  const handleConfirmLoadout = () => {
    if (selectedItems.length === 0) {
      Taro.showToast({ title: '请至少选择1个道具', icon: 'none' });
      return;
    }
    Taro.showToast({ title: `已装备 ${selectedItems.length} 个道具`, icon: 'success' });
    setTimeout(() => {
      Taro.navigateBack();
    }, 800);
  };

  return (
    <View className={styles.itemPage}>
      <ScrollView className={styles.scrollContent} scrollY>
        <View className={styles.pageHeader}>
          <Text className={styles.title}>🎒 道具中心</Text>
          <Text className={styles.subtitle}>选择你的战备道具（最多4个）</Text>
        </View>

        {currentMap && (
          <View className={styles.mapInfoCard}>
            <View className={styles.mapInfoHeader}>
              <Text className={styles.mapIcon}>🗺️</Text>
              <View className={styles.mapInfoText}>
                <Text className={styles.mapNameLabel}>当前地图</Text>
                <Text className={styles.mapName}>{currentMap.name}</Text>
              </View>
            </View>
            {recommendedItemIds.length > 0 && (
              <View className={styles.mapRecommendations}>
                <Text className={styles.recommendationLabel}>💡 本地图推荐道具：</Text>
                <View className={styles.recommendedItems}>
                  {recommendedItemIds.map(id => {
                    const item = items.find(i => i.id === id);
                    return item ? (
                      <View key={id} className={styles.recommendedItemTag}>
                        <Text className={styles.tagIcon}>{item.icon}</Text>
                        <Text className={styles.tagName}>{item.name}</Text>
                      </View>
                    ) : null;
                  })}
                </View>
              </View>
            )}
          </View>
        )}

        {/* 已选道具栏 */}
        <View className={styles.loadoutSection}>
          <View className={styles.loadoutHeader}>
            <Text className={styles.loadoutTitle}>⚔️ 出战装备</Text>
            <Text className={styles.loadoutCount}>{selectedItems.length} / 4</Text>
          </View>
          <View className={styles.loadoutSlots}>
            {[0, 1, 2, 3].map(slotIdx => {
              const itemId = selectedItems[slotIdx];
              const item = items.find(i => i.id === itemId);
              return (
                <View
                  key={slotIdx}
                  className={classnames(styles.loadoutSlot, { [styles.filled]: !!item })}
                  onClick={() => item && handleViewDetail(item)}
                >
                  {item ? (
                    <>
                      <Text className={styles.loadoutIcon}>{item.icon}</Text>
                      <Text className={styles.loadoutName}>{item.name}</Text>
                    </>
                  ) : (
                    <Text className={styles.emptySlot}>+</Text>
                  )}
                </View>
              );
            })}
          </View>
          <Button className={styles.confirmBtn} onClick={handleConfirmLoadout}>
            ✓ 确认装备
          </Button>
        </View>

        {/* 分类标签 */}
        <View className={styles.tabs}>
          {tabs.map(tab => (
            <View
              key={tab.key}
              className={classnames(styles.tabItem, { [styles.active]: activeTab === tab.key })}
              onClick={() => setActiveTab(tab.key)}
            >
              <Text className={styles.tabIcon}>{tab.icon}</Text>
              <Text className={styles.tabLabel}>{tab.label}</Text>
            </View>
          ))}
        </View>

        {/* 道具列表 */}
        <View className={styles.itemList}>
          {filteredItems.map(item => {
            const rarity = getItemRarity(item.rarity);
            const isSelected = selectedItems.includes(item.id);
            const isRecommended = recommendedItemIds.includes(item.id);
            const mapBonus = getMapBonus(item);
            
            return (
              <View
                key={item.id}
                className={classnames(
                  styles.itemCard, 
                  { [styles.selected]: isSelected },
                  { [styles.recommended]: isRecommended }
                )}
                onClick={() => handleViewDetail(item)}
              >
                <View className={styles.itemHeader}>
                  <View className={styles.itemIconWrapper}>
                    <Text className={styles.itemIcon}>{item.icon}</Text>
                    {isSelected && <View className={styles.selectedBadge}>✓</View>}
                    {isRecommended && !isSelected && <View className={styles.recommendedBadge}>荐</View>}
                  </View>
                  <View className={styles.itemInfo}>
                    <View className={styles.itemNameRow}>
                      <Text className={styles.itemName}>{item.name}</Text>
                      <View className={classnames(styles.itemType, styles[item.type])}>
                        {getItemTypeLabel(item.type)}
                      </View>
                    </View>
                    <View className={styles.itemRarity}>
                      <Text className={styles.star}>{rarity.stars}</Text>
                      <Text className={styles.rarityText}>{rarity.text}</Text>
                    </View>
                  </View>
                  <View
                    className={classnames(styles.selectBtn, { [styles.selected]: isSelected })}
                    onClick={(e) => handleToggleSelect(item, e)}
                  >
                    {isSelected ? '已选' : '选择'}
                  </View>
                </View>

                <Text className={styles.itemDesc}>{item.description}</Text>

                {mapBonus && (
                  <View className={styles.mapBonus}>
                    <Text className={styles.bonusIcon}>🎯</Text>
                    <Text className={styles.bonusText}>
                      <Text className={styles.bonusLabel}>{currentMap?.name}：</Text>
                      {mapBonus.bonus}
                    </Text>
                  </View>
                )}

                <View className={styles.itemStats}>
                  <View className={styles.statItem}>
                    <Text className={styles.statIcon}>⏱️</Text>
                    <Text className={styles.statValue}>{item.duration}s</Text>
                    <Text className={styles.statLabel}>持续</Text>
                  </View>
                  <View className={styles.statItem}>
                    <Text className={styles.statIcon}>🔄</Text>
                    <Text className={styles.statValue}>{item.cooldown}s</Text>
                    <Text className={styles.statLabel}>冷却</Text>
                  </View>
                  <View className={styles.statItem}>
                    <Text className={styles.statIcon}>🎯</Text>
                    <Text className={styles.statValue}>{item.uses}</Text>
                    <Text className={styles.statLabel}>次数</Text>
                  </View>
                </View>

                <View className={styles.itemTips}>
                  <Text className={styles.tipsIcon}>💡</Text>
                  <Text className={styles.tipsText}>{item.tips}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* 道具详情弹窗 */}
      {showDetail && selectedItem && (
        <View className={styles.detailModal} onClick={() => setShowDetail(false)}>
          <View className={styles.detailContent} onClick={e => e.stopPropagation()}>
            <View className={styles.detailHeader}>
              <Text className={styles.title}>道具详情</Text>
              <Text className={styles.closeBtn} onClick={() => setShowDetail(false)}>✕</Text>
            </View>

            <ScrollView className={styles.detailBody} scrollY>
              <View className={styles.detailIconWrapper}>
                <Text className={styles.detailIcon}>{selectedItem.icon}</Text>
                <View className={styles.detailRarity}>
                  {getItemRarity(selectedItem.rarity).stars}
                </View>
              </View>
              
              <Text className={styles.detailName}>{selectedItem.name}</Text>
              
              <View className={styles.detailTypeRarity}>
                <View className={classnames(styles.itemType, styles[selectedItem.type])}>
                  {getItemTypeLabel(selectedItem.type)}
                </View>
                <Text className={styles.rarityText}>
                  {getItemRarity(selectedItem.rarity).text}
                </Text>
              </View>

              <Text className={styles.detailDesc}>{selectedItem.description}</Text>

              <View className={styles.detailStats}>
                <View className={styles.statBox}>
                  <Text className={styles.statIcon}>⏱️</Text>
                  <Text className={styles.statValue}>{selectedItem.duration}s</Text>
                  <Text className={styles.statLabel}>持续时间</Text>
                </View>
                <View className={styles.statBox}>
                  <Text className={styles.statIcon}>🔄</Text>
                  <Text className={styles.statValue}>{selectedItem.cooldown}s</Text>
                  <Text className={styles.statLabel}>冷却时间</Text>
                </View>
                <View className={styles.statBox}>
                  <Text className={styles.statIcon}>🎯</Text>
                  <Text className={styles.statValue}>{selectedItem.uses}</Text>
                  <Text className={styles.statLabel}>使用次数</Text>
                </View>
              </View>

              {getMapBonus(selectedItem) && (
                <View className={styles.detailMapBonus}>
                  <Text className={styles.bonusTitle}>
                    <Text className={styles.icon}>🎯</Text>
                    地图适配
                  </Text>
                  <View className={styles.bonusContent}>
                    <Text className={styles.bonusMapName}>🗺️ {currentMap?.name}</Text>
                    <Text className={styles.bonusDesc}>{getMapBonus(selectedItem)?.bonus}</Text>
                  </View>
                </View>
              )}

              <View className={styles.detailHowTo}>
                <Text className={styles.howToTitle}>
                  <Text className={styles.icon}>📖</Text>
                  使用方法
                </Text>
                <View className={styles.howToSteps}>
                  {selectedItem.id === 'shield' && (
                    <>
                      <Text>1. 点击道具栏中的护盾图标</Text>
                      <Text>2. 获得{selectedItem.duration}秒护盾，可抵挡一次伤害</Text>
                      <Text>3. 被攻击时护盾自动抵消，效果消失</Text>
                    </>
                  )}
                  {selectedItem.id === 'slowdown' && (
                    <>
                      <Text>1. 点击道具栏中的减速陷阱图标</Text>
                      <Text>2. 在当前位置放置减速陷阱</Text>
                      <Text>3. 敌方踩中后移动速度降低50%，持续{selectedItem.duration}秒</Text>
                    </>
                  )}
                  {selectedItem.id === 'speed' && (
                    <>
                      <Text>1. 点击道具栏中的加速图标</Text>
                      <Text>2. {selectedItem.duration}秒内移动速度提升50%</Text>
                      <Text>3. 适合追击敌人或快速撤退</Text>
                    </>
                  )}
                  {selectedItem.id === 'invisible' && (
                    <>
                      <Text>1. 点击道具栏中的隐身图标</Text>
                      <Text>2. {selectedItem.duration}秒内进入隐身状态</Text>
                      <Text>3. 攻击或被攻击会解除隐身效果</Text>
                    </>
                  )}
                  {selectedItem.id === 'shockwave' && (
                    <>
                      <Text>1. 点击道具栏中的冲击波图标</Text>
                      <Text>2. 释放一圈冲击波击退周围敌人</Text>
                      <Text>3. 被击中的敌人会短暂眩晕减速</Text>
                    </>
                  )}
                  {selectedItem.id === 'scout' && (
                    <>
                      <Text>1. 点击道具栏中的侦查眼图标</Text>
                      <Text>2. 在当前位置放置侦查眼</Text>
                      <Text>3. 持续{selectedItem.duration}秒暴露周围敌人位置</Text>
                    </>
                  )}
                </View>
              </View>

              <View className={styles.detailStrategy}>
                <Text className={styles.strategyTitle}>
                  <Text className={styles.icon}>💡</Text>
                  使用策略
                </Text>
                <View className={styles.strategyTips}>
                  {selectedItem.id === 'shield' && (
                    <>
                      <Text>• 抢夺旗帜时优先开启护盾，防止被秒</Text>
                      <Text>• 护盾只能抵挡一次伤害，注意时机</Text>
                      <Text>• 与队友配合，前排玩家必备</Text>
                    </>
                  )}
                  {selectedItem.id === 'slowdown' && (
                    <>
                      <Text>• 放置在旗帜周围，延缓敌人进攻</Text>
                      <Text>• 狭窄通道放置效果最佳</Text>
                      <Text>• 配合队友包夹减速的敌人</Text>
                    </>
                  )}
                  {selectedItem.id === 'speed' && (
                    <>
                      <Text>• 夺旗后使用加速快速返回基地</Text>
                      <Text>• 被追击时使用加速拉开距离</Text>
                      <Text>• 可以与护盾叠加使用，无敌冲锋</Text>
                    </>
                  )}
                  {selectedItem.id === 'invisible' && (
                    <>
                      <Text>• 隐身时可以偷偷潜入敌方基地</Text>
                      <Text>• 适合偷旗战术，出其不意</Text>
                      <Text>• 注意隐身结束时机，别被包围</Text>
                    </>
                  )}
                  {selectedItem.id === 'shockwave' && (
                    <>
                      <Text>• 被围堵时使用，突围神器</Text>
                      <Text>• 可以打断敌方正在进行的夺旗</Text>
                      <Text>• 团战中心释放，效果最大化</Text>
                    </>
                  )}
                  {selectedItem.id === 'scout' && (
                    <>
                      <Text>• 放置在关键路口，提前预警</Text>
                      <Text>• 配合陷阱使用，效果更佳</Text>
                      <Text>• 侦查眼会被敌方破坏，注意隐蔽</Text>
                    </>
                  )}
                </View>
              </View>
            </ScrollView>

            <View className={styles.detailFooter}>
              <Button
                className={classnames(styles.selectBtnLarge, { 
                  [styles.selected]: selectedItems.includes(selectedItem.id) 
                })}
                onClick={() => handleToggleSelect(selectedItem)}
              >
                {selectedItems.includes(selectedItem.id) ? '✓ 已装备' : '+ 装备道具'}
              </Button>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default ItemPage;
