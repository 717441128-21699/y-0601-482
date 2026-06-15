import React, { useState } from 'react';
import { View, Text, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { useGameStore } from '@/store/gameStore';
import type { Item } from '@/types/game';
import classnames from 'classnames';

type TabType = 'all' | 'attack' | 'defense' | 'utility' | 'trap';

const ItemPage: React.FC = () => {
  const { items } = useGameStore();
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  const tabs: { key: TabType; label: string }[] = [
    { key: 'all', label: '全部' },
    { key: 'attack', label: '攻击' },
    { key: 'defense', label: '防御' },
    { key: 'utility', label: '功能' },
    { key: 'trap', label: '陷阱' }
  ];

  const filteredItems = activeTab === 'all' 
    ? items 
    : items.filter(item => item.type === activeTab);

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
    switch (itemId) {
      case 'item1': return '🛡️';
      case 'item2': return '🐌';
      case 'item3': return '⚡';
      case 'item4': return '👁️';
      case 'item5': return '💨';
      case 'item6': return '💥';
      default: return '🎁';
    }
  };

  const handleViewDetail = (item: Item) => {
    setSelectedItem(item);
    setShowDetail(true);
  };

  return (
    <ScrollView className={styles.itemPage} scrollY>
      <View className={styles.pageHeader}>
        <Text className={styles.title}>🎒 道具中心</Text>
        <Text className={styles.subtitle}>掌握道具，掌控战局</Text>
      </View>

      <View className={styles.tabs}>
        {tabs.map(tab => (
          <View
            key={tab.key}
            className={classnames(styles.tabItem, { [styles.active]: activeTab === tab.key })}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </View>
        ))}
      </View>

      <View className={styles.itemList}>
        {filteredItems.map(item => {
          const rarity = getItemRarity(item.rarity);
          
          return (
            <View
              key={item.id}
              className={styles.itemCard}
              onClick={() => handleViewDetail(item)}
            >
              <View className={styles.itemHeader}>
                <View className={styles.itemIcon}>
                  {getItemIcon(item.id)}
                </View>
                <View className={styles.itemInfo}>
                  <Text className={styles.itemName}>{item.name}</Text>
                  <Text className={classnames(styles.itemType, styles[item.type])}>
                    {getItemTypeLabel(item.type)}
                  </Text>
                  <View className={styles.itemRarity}>
                    <Text className={styles.star}>{rarity.stars}</Text>
                    <Text className={styles.rarityText}>{rarity.text}</Text>
                  </View>
                </View>
              </View>

              <Text className={styles.itemDesc}>{item.description}</Text>

              <View className={styles.itemStats}>
                <View className={styles.statItem}>
                  <Text className={styles.statLabel}>持续时间</Text>
                  <Text className={styles.statValue}>{item.duration}s</Text>
                </View>
                <View className={styles.statItem}>
                  <Text className={styles.statLabel}>冷却时间</Text>
                  <Text className={styles.statValue}>{item.cooldown}s</Text>
                </View>
                <View className={styles.statItem}>
                  <Text className={styles.statLabel}>使用次数</Text>
                  <Text className={styles.statValue}>{item.uses}</Text>
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

      {/* 道具详情弹窗 */}
      {showDetail && selectedItem && (
        <View className={styles.detailModal} onClick={() => setShowDetail(false)}>
          <View className={styles.detailContent} onClick={e => e.stopPropagation()}>
            <View className={styles.detailHeader}>
              <Text className={styles.title}>道具详情</Text>
              <Text className={styles.closeBtn} onClick={() => setShowDetail(false)}>✕</Text>
            </View>

            <ScrollView className={styles.detailBody} scrollY>
              <View className={styles.detailIcon}>
                {getItemIcon(selectedItem.id)}
              </View>
              
              <Text className={styles.detailName}>{selectedItem.name}</Text>
              
              <View className={styles.detailTypeRarity}>
                <Text className={classnames(styles.itemType, styles[selectedItem.type])}>
                  {getItemTypeLabel(selectedItem.type)}
                </Text>
                <View className={styles.itemRarity}>
                  <Text className={styles.star}>
                    {getItemRarity(selectedItem.rarity).stars}
                  </Text>
                  <Text className={styles.rarityText}>
                    {getItemRarity(selectedItem.rarity).text}
                  </Text>
                </View>
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

              <View className={styles.detailHowTo}>
                <Text className={styles.howToTitle}>
                  <Text className={styles.icon}>📖</Text>
                  使用方法
                </Text>
                <View className={styles.howToSteps}>
                  {selectedItem.id === 'item1' && (
                    <>
                      <Text>1. 点击道具栏中的护盾图标</Text>
                      <Text>2. 3秒内获得免疫一次伤害的护盾</Text>
                      <Text>3. 被攻击时护盾自动抵消伤害</Text>
                    </>
                  )}
                  {selectedItem.id === 'item2' && (
                    <>
                      <Text>1. 点击道具栏中的减速陷阱图标</Text>
                      <Text>2. 在当前位置放置减速陷阱</Text>
                      <Text>3. 敌方踩中后移动速度降低50%</Text>
                    </>
                  )}
                  {selectedItem.id === 'item3' && (
                    <>
                      <Text>1. 点击道具栏中的加速图标</Text>
                      <Text>2. 5秒内移动速度提升50%</Text>
                      <Text>3. 适合追击敌人或快速撤退</Text>
                    </>
                  )}
                  {selectedItem.id === 'item4' && (
                    <>
                      <Text>1. 点击道具栏中的侦查眼图标</Text>
                      <Text>2. 在当前位置放置侦查眼</Text>
                      <Text>3. 3秒内暴露周围敌人位置</Text>
                    </>
                  )}
                  {selectedItem.id === 'item5' && (
                    <>
                      <Text>1. 点击道具栏中的烟雾弹图标</Text>
                      <Text>2. 向前方投掷烟雾弹</Text>
                      <Text>3. 烟雾区域内视野受阻</Text>
                    </>
                  )}
                  {selectedItem.id === 'item6' && (
                    <>
                      <Text>1. 点击道具栏中的冲击波图标</Text>
                      <Text>2. 释放一圈冲击波</Text>
                      <Text>3. 周围敌人被击退并短暂眩晕</Text>
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
                  {selectedItem.id === 'item1' && (
                    <>
                      <Text>• 抢夺旗帜时优先开启护盾，防止被秒</Text>
                      <Text>• 护盾只能抵挡一次伤害，注意时机</Text>
                      <Text>• 与队友配合，前排玩家必备</Text>
                    </>
                  )}
                  {selectedItem.id === 'item2' && (
                    <>
                      <Text>• 放置在旗帜周围，延缓敌人进攻</Text>
                      <Text>• 狭窄通道放置效果最佳</Text>
                      <Text>• 配合队友包夹减速的敌人</Text>
                    </>
                  )}
                  {selectedItem.id === 'item3' && (
                    <>
                      <Text>• 夺旗后使用加速快速返回基地</Text>
                      <Text>• 被追击时使用加速拉开距离</Text>
                      <Text>• 可以与护盾叠加使用，无敌冲锋</Text>
                    </>
                  )}
                  {selectedItem.id === 'item4' && (
                    <>
                      <Text>• 放置在关键路口，提前预警</Text>
                      <Text>• 配合陷阱使用，效果更佳</Text>
                      <Text>• 侦查眼会被敌方破坏，注意隐蔽</Text>
                    </>
                  )}
                  {selectedItem.id === 'item5' && (
                    <>
                      <Text>• 被追击时投掷烟雾，干扰视线</Text>
                      <Text>• 抢旗时使用烟雾，掩护队友</Text>
                      <Text>• 烟雾中敌我难分，注意误伤</Text>
                    </>
                  )}
                  {selectedItem.id === 'item6' && (
                    <>
                      <Text>• 被围堵时使用，突围神器</Text>
                      <Text>• 可以打断敌方正在进行的夺旗</Text>
                      <Text>• 团战中心释放，效果最大化</Text>
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

export default ItemPage;
