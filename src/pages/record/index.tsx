import React, { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { useGameStore } from '@/store/gameStore';
import type { GameRecord } from '@/types/game';
import classnames from 'classnames';

const RecordPage: React.FC = () => {
  const { gameRecords, myPlayerId } = useGameStore();
  const [activeTab, setActiveTab] = useState<'all' | 'win' | 'mvp'>('all');
  const [selectedRecord, setSelectedRecord] = useState<GameRecord | null>(null);

  const totalGames = gameRecords.length;
  const winGames = gameRecords.filter(r => {
    const myPlayer = r.players.find(p => p.playerId === myPlayerId);
    if (!myPlayer) return false;
    return r.winner === myPlayer.team;
  }).length;
  const mvpCount = gameRecords.reduce((acc, r) => {
    return acc + r.players.filter(p => p.isMvp && p.playerId === myPlayerId).length;
  }, 0);
  const totalKills = gameRecords.reduce((acc, r) => {
    const me = r.players.find(p => p.playerId === myPlayerId);
    return acc + (me?.kills || 0);
  }, 0);
  const totalFlags = gameRecords.reduce((acc, r) => {
    const me = r.players.find(p => p.playerId === myPlayerId);
    return acc + (me?.flagsCaptured || 0);
  }, 0);
  const totalPoints = gameRecords.reduce((acc, r) => {
    const me = r.players.find(p => p.playerId === myPlayerId);
    return acc + (me?.pointsCaptured || 0);
  }, 0);
  const winRate = totalGames > 0 ? Math.round((winGames / totalGames) * 100) : 0;

  const filteredRecords = gameRecords.filter(r => {
    const myPlayer = r.players.find(p => p.playerId === myPlayerId);
    if (activeTab === 'all') return true;
    if (activeTab === 'win') return myPlayer && r.winner === myPlayer.team;
    if (activeTab === 'mvp') return r.players.some(p => p.isMvp && p.playerId === myPlayerId);
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
    const myPlayer = record.players.find(p => p.playerId === myPlayerId);
    if (record.winner === 'draw') return '平局';
    if (!myPlayer) return '未知';
    return record.winner === myPlayer.team ? '胜利' : '失败';
  };

  const getResultClass = (record: GameRecord) => {
    const myPlayer = record.players.find(p => p.playerId === myPlayerId);
    if (record.winner === 'draw') return 'draw';
    if (!myPlayer) return 'lose';
    return record.winner === myPlayer.team ? 'win' : 'lose';
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}分${secs}秒`;
  };

  const getScoreChartData = (record: GameRecord) => {
    if (!record.scoreTimeline || record.scoreTimeline.length === 0) return [];
    return record.scoreTimeline.slice(-10);
  };

  const getMvpPlayer = (record: GameRecord) => {
    return record.players.find(p => p.playerId === record.mvpPlayerId) || 
           record.players.find(p => p.isMvp) ||
           [...record.players].sort((a, b) => b.score - a.score)[0];
  };

  const handleRecordClick = (record: GameRecord) => {
    setSelectedRecord(record);
    console.log('[Record] View record detail:', record.id);
  };

  const allMvpPlayers = gameRecords.flatMap(r => r.players.filter(p => p.isMvp));
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
            <Text className={styles.statValue}>{totalKills}</Text>
            <Text className={styles.statLabel}>总击杀</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{totalFlags}</Text>
            <Text className={styles.statLabel}>总夺旗</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{totalPoints}</Text>
            <Text className={styles.statLabel}>总占点</Text>
          </View>
        </View>
      </View>

      <View className={styles.mvpSection}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.icon}>🏆</Text>
          <Text>本周 MVP 榜</Text>
        </Text>
        <View className={styles.mvpCard}>
          <View className={styles.mvpAvatar}>👑</View>
          <View className={styles.mvpInfo}>
            <Text className={styles.mvpTitle}>MVP 之王</Text>
            <Text className={styles.mvpPlayer}>{topMvp?.playerName || '暂无数据'}</Text>
            <Text className={styles.mvpStats}>
              {topMvp?.count || 0} 次 MVP
            </Text>
          </View>
        </View>
      </View>

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

      <Text className={styles.sectionTitle}>
        <Text className={styles.icon}>📜</Text>
        <Text>历史战绩</Text>
      </Text>

      {filteredRecords.length === 0 ? (
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>🎮</Text>
          <Text className={styles.emptyText}>暂无战绩记录</Text>
          <Text className={styles.emptySubtext}>完成一局比赛后这里会显示你的战绩</Text>
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
              <View className={styles.detailMeta}>
                <Text className={styles.metaText}>{selectedRecord.date}</Text>
                <Text className={styles.metaText}>⏱️ {formatDuration(selectedRecord.duration)}</Text>
              </View>

              <View className={styles.detailScore}>
                <View className={classnames(styles.detailTeamScore, styles.redTeam)}>
                  <Text className={styles.teamName}>🔴 红队</Text>
                  <Text className={styles.teamScoreValue}>{selectedRecord.score.red}</Text>
                </View>
                <View className={styles.detailVs}>
                  <Text className={styles.vsLabel}>VS</Text>
                  <Text className={classnames(styles.resultLabel, 
                    selectedRecord.winner === 'draw' ? styles.drawResult : 
                    selectedRecord.winner === 'red' ? styles.redResult : styles.blueResult)}>
                    {selectedRecord.winner === 'draw' ? '平局' : selectedRecord.winner === 'red' ? '红胜' : '蓝胜'}
                  </Text>
                </View>
                <View className={classnames(styles.detailTeamScore, styles.blueTeam)}>
                  <Text className={styles.teamName}>🔵 蓝队</Text>
                  <Text className={styles.teamScoreValue}>{selectedRecord.score.blue}</Text>
                </View>
              </View>

              {selectedRecord.mvpPlayerId && (
                <View className={styles.detailMvpSection}>
                  <Text className={styles.detailSectionLabel}>👑 本局 MVP</Text>
                  <View className={styles.detailMvpCard}>
                    <View className={styles.detailMvpAvatar}>👑</View>
                    <View className={styles.detailMvpInfo}>
                      <Text className={styles.detailMvpName}>{getMvpPlayer(selectedRecord)?.playerName || '未知'}</Text>
                      <Text className={styles.detailMvpScore}>
                        综合评分 {getMvpPlayer(selectedRecord)?.score || 0}
                      </Text>
                      {selectedRecord.mvpReason && (
                        <Text className={styles.detailMvpReason}>{selectedRecord.mvpReason}</Text>
                      )}
                    </View>
                  </View>
                </View>
              )}

              {getScoreChartData(selectedRecord).length > 0 && (
                <View className={styles.detailTimelineSection}>
                  <Text className={styles.detailSectionLabel}>📈 比分走势</Text>
                  <View className={styles.detailTimelineChart}>
                    {getScoreChartData(selectedRecord).map((point, idx) => {
                      const maxScore = Math.max(point.red, point.blue, 1);
                      const redHeight = (point.red / maxScore) * 100;
                      const blueHeight = (point.blue / maxScore) * 100;
                      return (
                        <View key={idx} className={styles.detailTimelineColumn}>
                          <View className={styles.detailTimelineBars}>
                            <View 
                              className={classnames(styles.detailBar, styles.detailRedBar)} 
                              style={{ height: `${redHeight}%` }}
                            />
                            <View 
                              className={classnames(styles.detailBar, styles.detailBlueBar)} 
                              style={{ height: `${blueHeight}%` }}
                            />
                          </View>
                          <Text className={styles.detailTimelineScore}>
                            {point.red}:{point.blue}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              )}

              <View className={styles.detailStatsSection}>
                <Text className={styles.detailSectionLabel}>� 详细数据</Text>
                
                <Text className={styles.detailTeamLabel}>🔴 红队</Text>
                {selectedRecord.players
                  .filter(p => p.team === 'red')
                  .sort((a, b) => b.score - a.score)
                  .map((player, idx) => (
                    <View key={player.playerId} className={styles.detailPlayerRow}>
                      <Text className={classnames(
                        styles.detailRank,
                        idx === 0 ? styles.detailGold : idx === 1 ? styles.detailSilver : idx === 2 ? styles.detailBronze : styles.detailNormalRank
                      )}>
                        {idx + 1}
                      </Text>
                      <View className={styles.detailPlayerInfo}>
                        <Text className={styles.detailPlayerName}>
                          {player.playerName}
                          {player.isMvp && <Text className={styles.detailMvpBadge}> 👑</Text>}
                          {player.playerId === myPlayerId && <Text className={styles.detailMeBadge}> (我)</Text>}
                        </Text>
                        <Text className={styles.detailPlayerSub}>
                          击杀 {player.kills} · 死亡 {player.deaths} · 夺旗 {player.flagsCaptured || 0} · 占点 {player.pointsCaptured || 0}
                        </Text>
                      </View>
                      <Text className={styles.detailPlayerScore}>{player.score}</Text>
                    </View>
                  ))}

                <Text className={classnames(styles.detailTeamLabel, styles.detailBlueLabel)}>🔵 蓝队</Text>
                {selectedRecord.players
                  .filter(p => p.team === 'blue')
                  .sort((a, b) => b.score - a.score)
                  .map((player, idx) => (
                    <View key={player.playerId} className={styles.detailPlayerRow}>
                      <Text className={classnames(
                        styles.detailRank,
                        idx === 0 ? styles.detailGold : idx === 1 ? styles.detailSilver : idx === 2 ? styles.detailBronze : styles.detailNormalRank
                      )}>
                        {idx + 1}
                      </Text>
                      <View className={styles.detailPlayerInfo}>
                        <Text className={styles.detailPlayerName}>
                          {player.playerName}
                          {player.isMvp && <Text className={styles.detailMvpBadge}> 👑</Text>}
                          {player.playerId === myPlayerId && <Text className={styles.detailMeBadge}> (我)</Text>}
                        </Text>
                        <Text className={styles.detailPlayerSub}>
                          击杀 {player.kills} · 死亡 {player.deaths} · 夺旗 {player.flagsCaptured || 0} · 占点 {player.pointsCaptured || 0}
                        </Text>
                      </View>
                      <Text className={styles.detailPlayerScore}>{player.score}</Text>
                    </View>
                  ))}
              </View>

              {selectedRecord.itemsUsed && selectedRecord.itemsUsed.length > 0 && (
                <View className={styles.detailItemsSection}>
                  <Text className={styles.detailSectionLabel}>🎒 道具使用统计</Text>
                  <View className={styles.detailItemsList}>
                    {selectedRecord.itemsUsed.map((item, idx) => (
                      <View key={idx} className={styles.detailItemStat}>
                        <Text className={styles.detailItemIcon}>🎯</Text>
                        <Text className={styles.detailItemName}>{item.itemId}</Text>
                        <Text className={styles.detailItemCount}>×{item.count}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default RecordPage;
