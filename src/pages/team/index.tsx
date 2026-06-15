import React, { useState, useEffect } from 'react';
import { View, Text, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { useGameStore } from '@/store/gameStore';
import classnames from 'classnames';

const TeamPage: React.FC = () => {
  const { 
    currentRoom, 
    currentMap, 
    maps, 
    myPlayerId,
    roomSettings,
    toggleReady, 
    autoAssignTeams, 
    swapPlayerTeam, 
    setMap, 
    startCountdown,
    startGame,
    joinRoom
  } = useGameStore();

  const [countdown, setCountdown] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    if (!currentRoom) {
      joinRoom('demo-room');
    }
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && currentRoom?.gameStatus === 'countdown' && !isNavigating) {
      setIsNavigating(true);
      startGame();
      console.log('[Team] Countdown finished, navigating to battle');
      Taro.redirectTo({ url: '/pages/battle/index' });
    }
  }, [countdown, currentRoom?.gameStatus, isNavigating]);

  if (!currentRoom) {
    return (
      <View className={styles.teamPage}>
        <Text>加载中...</Text>
      </View>
    );
  }

  const redPlayers = currentRoom.players.filter(p => p.team === 'red');
  const bluePlayers = currentRoom.players.filter(p => p.team === 'blue');
  const me = currentRoom.players.find(p => p.id === myPlayerId);
  const isHost = me?.isHost;
  const isReady = me?.isReady;
  const allReady = currentRoom.players.every(p => p.isReady) && currentRoom.players.length >= 2;

  const handleStart = () => {
    if (!isHost) {
      Taro.showToast({ title: '只有房主可以开始', icon: 'none' });
      return;
    }
    if (!allReady) {
      Taro.showToast({ title: '请等待所有人准备', icon: 'none' });
      return;
    }
    startCountdown();
    setCountdown(3);
    console.log('[Team] Countdown started');
  };

  const handlePlayerClick = (playerId: string) => {
    if (!isHost || playerId === myPlayerId) return;
    swapPlayerTeam(playerId);
  };

  const handleCopyRoomId = () => {
    Taro.setClipboardData({ data: currentRoom.id });
    Taro.showToast({ title: '房间号已复制', icon: 'success' });
  };

  return (
    <ScrollView className={styles.teamPage} scrollY>
      <View className={styles.roomInfo}>
        <Text className={styles.roomName}>{currentRoom.name}</Text>
        <View className={styles.roomMeta}>
          <Text className={styles.roomId} onClick={handleCopyRoomId}>房间号: {currentRoom.id}</Text>
          <Text>{currentRoom.players.length}/{currentRoom.maxPlayers} 人</Text>
        </View>
      </View>

      <View className={styles.sectionTitle}>
        <Text className={styles.icon}>🗺️</Text>
        <Text>选择地图</Text>
      </View>

      <ScrollView className={styles.mapSelector} scrollX>
        {maps.map(map => (
          <View
            key={map.id}
            className={classnames(styles.mapCard, { [styles.active]: currentMap?.id === map.id })}
            onClick={() => isHost && setMap(map.id)}
          >
            <View className={styles.mapPreview}>
              {map.id === 'map1' && '🌳'}
              {map.id === 'map2' && '🌲'}
              {map.id === 'map3' && '🏜️'}
              {map.id === 'map4' && '🏔️'}
            </View>
            <Text className={styles.mapName}>{map.name}</Text>
            <Text className={styles.mapDesc}>{map.description}</Text>
          </View>
        ))}
      </ScrollView>

      <View className={styles.sectionTitle}>
        <Text className={styles.icon}>⚔️</Text>
        <Text>队伍分配</Text>
        {isHost && <Text style={{ fontSize: 22, color: '#64748B', marginLeft: 8 }}>（点击玩家可换队）</Text>}
      </View>

      <View className={styles.teamsContainer}>
        <View className={classnames(styles.teamColumn, styles.redTeam)}>
          <View className={styles.teamHeader}>
            <Text className={classnames(styles.teamName, styles.redText)}>🔴 红队</Text>
            <Text className={styles.teamCount}>{redPlayers.length} 人</Text>
          </View>
          {redPlayers.map(player => (
            <View
              key={player.id}
              className={styles.playerItem}
              onClick={() => handlePlayerClick(player.id)}
            >
              <View className={styles.playerAvatar}>👤</View>
              <View className={styles.playerInfo}>
                <Text className={styles.playerName}>
                  {player.id === myPlayerId ? '我' : player.name}
                </Text>
                <Text className={styles.playerRole}>
                  {player.isHost ? '房主' : '队员'}
                </Text>
              </View>
              <View className={classnames(styles.readyBadge, player.isReady ? styles.ready : styles.notReady)}>
                {player.isReady ? '就绪' : '未就绪'}
              </View>
            </View>
          ))}
          {redPlayers.length === 0 && (
            <Text style={{ textAlign: 'center', color: '#64748B', fontSize: 24, paddingTop: 40 }}>暂无队员</Text>
          )}
          {isHost && (
            <Button className={styles.btnAuto} onClick={autoAssignTeams}>
              🎲 随机分队
            </Button>
          )}
        </View>

        <View className={classnames(styles.teamColumn, styles.blueTeam)}>
          <View className={styles.teamHeader}>
            <Text className={classnames(styles.teamName, styles.blueText)}>🔵 蓝队</Text>
            <Text className={styles.teamCount}>{bluePlayers.length} 人</Text>
          </View>
          {bluePlayers.map(player => (
            <View
              key={player.id}
              className={styles.playerItem}
              onClick={() => handlePlayerClick(player.id)}
            >
              <View className={styles.playerAvatar}>👤</View>
              <View className={styles.playerInfo}>
                <Text className={styles.playerName}>
                  {player.id === myPlayerId ? '我' : player.name}
                </Text>
                <Text className={styles.playerRole}>
                  {player.isHost ? '房主' : '队员'}
                </Text>
              </View>
              <View className={classnames(styles.readyBadge, player.isReady ? styles.ready : styles.notReady)}>
                {player.isReady ? '就绪' : '未就绪'}
              </View>
            </View>
          ))}
          {bluePlayers.length === 0 && (
            <Text style={{ textAlign: 'center', color: '#64748B', fontSize: 24, paddingTop: 40 }}>暂无队员</Text>
          )}
        </View>
      </View>

      <View className={styles.sectionTitle}>
        <Text className={styles.icon}>⚙️</Text>
        <Text>游戏设置</Text>
      </View>

      <View className={styles.settingsRow}>
        <Text className={styles.settingLabel}>总局数</Text>
        <Text className={styles.settingValue}>{currentRoom.totalRounds} 局</Text>
      </View>
      <View className={styles.settingsRow}>
        <Text className={styles.settingLabel}>每局时间</Text>
        <Text className={styles.settingValue}>{Math.floor(currentRoom.roundTime / 60)} 分钟</Text>
      </View>
      <View className={styles.settingsRow}>
        <Text className={styles.settingLabel}>游戏模式</Text>
        <Text className={styles.settingValue}>夺旗战</Text>
      </View>
      <View className={styles.settingsRow} style={{ borderBottom: 'none' }}>
        <Text className={styles.settingLabel}>复活时间</Text>
        <Text className={styles.settingValue}>{roomSettings.respawnTime} 秒</Text>
      </View>

      <View className={styles.actionBar}>
        {isHost ? (
          <>
            <Button 
              className={classnames(styles.btnReady, isReady ? styles.ready : styles.notReady)} 
              onClick={toggleReady}
            >
              {isReady ? '✓ 已准备' : '准备游戏'}
            </Button>
            <Button 
              className={styles.btnStart} 
              onClick={handleStart}
              disabled={!allReady}
            >
              {countdown > 0 ? `${countdown} 秒后开始` : '🚀 开始游戏'}
            </Button>
          </>
        ) : (
          <Button 
            className={classnames(styles.btnReady, isReady ? styles.ready : styles.notReady)} 
            onClick={toggleReady}
            style={{ flex: 1 }}
          >
            {isReady ? '✓ 已准备' : '准备游戏'}
          </Button>
        )}
      </View>
    </ScrollView>
  );
};

export default TeamPage;
