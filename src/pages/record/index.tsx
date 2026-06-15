import React, { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { mockRecords } from '@/data/mockRecords';
import type { GameRecord } from '@/types/game';
import classnames from 'classnames';

const RecordPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'win' | 'mvp'>('all');
  const [selectedRecord, setSelectedRecord] = useState<GameRecord | null>(null);

  const totalGames = mockRecords.length;
  const winGames = mockRecords.filter(r => {
    const myTeam = 'red';
    return (r.winner === myTeam);
  }).length;
  const mvpCount = mockRecords.reduce((acc, r) => {
    return acc + r.players.filter(p => p.isMvp && p.playerName === '张三').length;
  }, 0);
  const winRate = totalGames > 0 ? Math.round((winGames / totalGames) * 100) : 0;

  const filteredRecords = mockRecords.filter(r => {
    if (activeTab === 'all') return true;
    if (activeTab === 'win') return r.winner === 'red';
    if (activeTab === 'mvp') return r.players.some(p => p.isMvp && p.playerName === '张三');
    return true;
  });

  const getMapIcon = (mapName: string) => {
    if (mapName.includes('公园')) return '🌳';
    if (mapName.includes('森林')) return '🌲';
    if (mapName.includes('沙漠')) return '🏜️';
    if (mapName.includes('雪山')) return '🏔️';
    return '🗺️';
  };

  const getResultText = (record: GameRecord) => {
    const myTeam = 'red';
    if (record.winner === 'draw') return '平局';
    return record.winner === myTeam ? '胜利' : '失败';
  };

  const getResultClass = (record: GameRecord) => {
    const myTeam = 'red';
    if (record.winner === 'draw') return 'draw';
    return record.winner === myTeam ? 'win' : 'lose';
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}分${secs}秒`;
  };

  const handleRecordClick = (record: GameRecord) => {
    setSelectedRecord(record);
    console.log('[Record] View record detail:', record.id);
  };

  // 找出MVP
  const allMvpPlayers = mockRecords.flatMap(r => r.players.filter(p => p.isMvp));
  const topMvp = allMvpPlayers.reduce((acc, p) => {
    const existing = acc.find(a => a.playerId === p.playerId);
    if (existing) {
      existing.count++;
    } else {
      acc.push({ ...p, count: 1 });
    }
    return acc;
  }, [] as any[]).sort((a, b) => b.count - a.count)[0];

  return (
    <ScrollView className={styles.recordPage} scrollY>
      {/* 个人统计总览 */}
      <View className={styles.statsOverview}>
        <Text className={styles.title}>📊 个人战绩总览</Text>
        <View className={styles.statsGrid}>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{totalGames}</Text>
            <Text className={styles.statLabel}>总场次</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{winRate}%</Text>
            <Text className={styles.statLabel}>胜率</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{mvpCount}</Text>
            <Text className={styles.statLabel}>MVP次数</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>42</Text>
            <Text className={styles.statLabel}>总击杀</Text>
          </View>
        </View>
      </View>

      {/* MVP评选 */}
      <View className={styles.mvpSection}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.icon}>🏆</Text>
          <Text>本周 MVP 榜</Text>
        </Text>
        <View className={styles.mvpCard}>
          <View className={styles.mvpAvatar}>👑</View>
          <View className={styles.mvpInfo}>
            <Text className={styles.mvpTitle}>MVP 之王</Text>
            <Text className={styles.mvpPlayer}>{topMvp?.playerName || '张三'}</Text>
            <Text className={styles.mvpStats}>
              {topMvp?.count || 3} 次 MVP · 场均击杀 8.5
            </Text>
          </View>
        </View>
      </View>

      {/* Tab 切换 */}
      <View className={styles.tabs}>
        <View
          className={classnames(styles.tabItem, { [styles.active]: activeTab === 'all' })}
          onClick={() => setActiveTab('all')}
        >
          全部
        </View>
        <View
          className={classnames(styles.tabItem, { [styles.active]: activeTab === 'win' })}
          onClick={() => setActiveTab('win')}
        >
          胜利
        </View>
        <View
          className={classnames(styles.tabItem, { [styles.active]: activeTab === 'mvp' })}
          onClick={() => setActiveTab('mvp')}
        >
          MVP
        </View>
      </View>

      {/* 历史战绩列表 */}
      <Text className={styles.sectionTitle}>
        <Text className={styles.icon}>📜</Text>
        <Text>历史战绩</Text>
      </Text>

      {filteredRecords.length === 0 ? (
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>🎮</Text>
          <Text className={styles.emptyText}>暂无战绩记录</Text>
        </View>
      ) : (
        <View className={styles.recordList}>
          {filteredRecords.map(record => (
            <View
              key={record.id}
              className={styles.recordCard}
              onClick={() => handleRecordClick(record)}
            >
              <View className={styles.recordHeader}>
                <View className={styles.mapInfo}>
                  <Text className={styles.mapIcon}>{getMapIcon(record.mapName)}</Text>
                  <View>
                    <Text className={styles.mapName}>{record.mapName}</Text>
                    <Text className={styles.date}>{record.date}</Text>
                  </View>
                </View>
                <View className={classnames(styles.resultBadge, styles[getResultClass(record)])}>
                  {getResultText(record)}
                </View>
              </View>

              <View className={styles.scoreRow}>
                <View className={styles.teamScore}>
                  <Text className={styles.teamName}>🔴 红队</Text>
                  <Text className={classnames(styles.score, styles.red)}>{record.score.red}</Text>
                </View>
                <Text className={styles.vsText}>VS</Text>
                <View className={styles.teamScore}>
                  <Text className={styles.teamName}>🔵 蓝队</Text>
                  <Text className={classnames(styles.score, styles.blue)}>{record.score.blue}</Text>
                </View>
              </View>

              <View className={styles.mvpRow}>
                <Text className={styles.mvpLabel}>
                  <Text className={styles.mvpIcon}>👑</Text>
                  MVP
                </Text>
                <Text className={styles.mvpName}>
                  {record.players.find(p => p.isMvp)?.playerName || '-'}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* 战绩详情弹窗 */}
      {selectedRecord && (
        <View 
          className={styles.detailModal} 
          onClick={() => setSelectedRecord(null)}
        >
          <View className={styles.detailContent} onClick={e => e.stopPropagation()}>
            <View className={styles.detailHeader}>
              <Text className={styles.title}>
                {getMapIcon(selectedRecord.mapName)} {selectedRecord.mapName}
              </Text>
              <Text className={styles.closeBtn} onClick={() => setSelectedRecord(null)}>✕</Text>
            </View>
            <ScrollView className={styles.detailBody} scrollY>
              <View style={{ marginBottom: 16, fontSize: 24, color: '#94A3B8' }}>
                {selectedRecord.date} · {formatDuration(selectedRecord.duration)}
              </View>
              
              <Text style={{ fontSize: 26, fontWeight: 600, color: '#F1F5F9', marginBottom: 12 }}>
                🔴 红队
              </Text>
              {selectedRecord.players
                .filter(p => p.team === 'red')
                .sort((a, b) => b.score - a.score)
                .map((player, idx) => (
                  <View key={player.playerId} className={styles.playerRow}>
                    <Text className={classnames(
                      styles.rank,
                      idx === 0 ? styles.gold : idx === 1 ? styles.silver : idx === 2 ? styles.bronze : styles.normal
                    )}>
                      {idx + 1}
                    </Text>
                    <View className={styles.playerInfo}>
                      <View className={styles.avatar}>👤</View>
                      <View>
                        <Text className={styles.name}>
                          {player.playerName}
                          {player.isMvp && <Text className={styles.mvpBadge}>👑</Text>}
                        </Text>
                      </View>
                    </View>
                    <View className={styles.playerStats}>
                      <View>击杀 {player.kills}</View>
                      <View>死亡 {player.deaths}</View>
                    </View>
                    <Text className={styles.score}>{player.score}</Text>
                  </View>
                ))}

              <Text style={{ fontSize: 26, fontWeight: 600, color: '#F1F5F9', margin: '20px 0 12px' }}>
                🔵 蓝队
              </Text>
              {selectedRecord.players
                .filter(p => p.team === 'blue')
                .sort((a, b) => b.score - a.score)
                .map((player, idx) => (
                  <View key={player.playerId} className={styles.playerRow}>
                    <Text className={classnames(
                      styles.rank,
                      idx === 0 ? styles.gold : idx === 1 ? styles.silver : idx === 2 ? styles.bronze : styles.normal
                    )}>
                      {idx + 1}
                    </Text>
                    <View className={styles.playerInfo}>
                      <View className={styles.avatar}>👤</View>
                      <View>
                        <Text className={styles.name}>
                          {player.playerName}
                          {player.isMvp && <Text className={styles.mvpBadge}>👑</Text>}
                        </Text>
                      </View>
                    </View>
                    <View className={styles.playerStats}>
                      <View>击杀 {player.kills}</View>
                      <View>死亡 {player.deaths}</View>
                    </View>
                    <Text className={styles.score}>{player.score}</Text>
                  </View>
                ))}
            </ScrollView>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default RecordPage;
