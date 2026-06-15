import React, { useState } from 'react';
import { View, Text, Button, Input, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { useGameStore } from '@/store/gameStore';

const LobbyPage: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [activityCode, setActivityCode] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(10);

  const { createRoom, joinRoom, setActivityCode: setStoreActivityCode } = useGameStore();

  const handleCreateRoom = () => {
    if (!roomName.trim()) {
      Taro.showToast({ title: '请输入房间名称', icon: 'none' });
      return;
    }
    createRoom(roomName, maxPlayers);
    setShowCreateModal(false);
    Taro.navigateTo({ url: '/pages/team/index' });
    console.log('[Lobby] Create room:', roomName);
  };

  const handleJoinRoom = () => {
    if (!roomCode.trim()) {
      Taro.showToast({ title: '请输入房间号', icon: 'none' });
      return;
    }
    joinRoom(roomCode, activityCode || undefined);
    setShowJoinModal(false);
    Taro.navigateTo({ url: '/pages/team/index' });
    console.log('[Lobby] Join room:', roomCode);
  };

  const handleActivityCode = () => {
    if (!activityCode.trim()) {
      Taro.showToast({ title: '请输入活动口令', icon: 'none' });
      return;
    }
    setStoreActivityCode(activityCode);
    setShowCodeModal(false);
    Taro.showToast({ title: '口令验证成功', icon: 'success' });
    console.log('[Lobby] Activity code:', activityCode);
  };

  const handleScanCode = () => {
    Taro.scanCode({
      success: (res) => {
        console.log('[Lobby] Scan result:', res.result);
        joinRoom(res.result);
        Taro.navigateTo({ url: '/pages/team/index' });
      },
      fail: () => {
        Taro.showToast({ title: '扫码失败', icon: 'none' });
      }
    });
  };

  const hotRooms = [
    { id: 1, name: '技术部团建赛', map: '城市公园', players: '8/10', status: '等待中' },
    { id: 2, name: '市场部练习场', map: '森林秘境', players: '6/8', status: '进行中' },
    { id: 3, name: '全员大作战', map: '沙漠遗迹', players: '12/16', status: '等待中' }
  ];

  return (
    <ScrollView className={styles.lobbyPage} scrollY>
      <View className={styles.header}>
        <Text className={styles.title}>🏆 团建夺旗战</Text>
        <Text className={styles.subtitle}>分队对战 · 道具对抗 · 燃爆全场</Text>
      </View>

      <View className={styles.userCard}>
        <View className={styles.avatar}>👤</View>
        <View className={styles.userInfo}>
          <Text className={styles.name}>玩家编号 888</Text>
          <Text className={styles.stats}>战绩 12 胜 / MVP 3 次</Text>
        </View>
      </View>

      <View className={styles.actionButtons}>
        <Button className={styles.btnPrimary} onClick={() => setShowCreateModal(true)}>
          ➕ 创建房间
        </Button>
        <Button className={styles.btnSecondary} onClick={() => setShowJoinModal(true)}>
          🔢 输入房间号加入
        </Button>
        <Button className={styles.btnSecondary} onClick={handleScanCode}>
          📱 扫码加入
        </Button>
        <Button className={`${styles.btnSecondary} ${styles.btnGold}`} onClick={() => setShowCodeModal(true)}>
          🎫 活动口令
        </Button>
      </View>

      <View className={styles.sectionTitle}>
        <Text className={styles.icon}>🎯</Text>
        <Text>功能入口</Text>
      </View>

      <View className={styles.quickGrid}>
        <View 
          className={styles.quickCard}
          onClick={() => Taro.navigateTo({ url: '/pages/map/index' })}
        >
          <Text className={styles.quickIcon}>🗺️</Text>
          <Text className={styles.quickTitle}>地图中心</Text>
          <Text className={styles.quickDesc}>浏览战场详情</Text>
        </View>
        <View 
          className={styles.quickCard}
          onClick={() => Taro.navigateTo({ url: '/pages/item/index' })}
        >
          <Text className={styles.quickIcon}>🎒</Text>
          <Text className={styles.quickTitle}>道具中心</Text>
          <Text className={styles.quickDesc}>掌握道具技巧</Text>
        </View>
      </View>

      <View className={styles.sectionTitle}>
        <Text className={styles.icon}>🔥</Text>
        <Text>热门房间</Text>
      </View>

      <View className={styles.roomList}>
        {hotRooms.map(room => (
          <View
            key={room.id}
            className={styles.roomCard}
            onClick={() => {
              joinRoom(String(room.id));
              Taro.navigateTo({ url: '/pages/team/index' });
            }}
          >
            <View className={styles.roomHeader}>
              <Text className={styles.roomName}>{room.name}</Text>
              <Text className={styles.roomStatus}>{room.status}</Text>
            </View>
            <View className={styles.roomInfo}>
              <Text className={styles.mapName}>地图：{room.map}</Text>
              <Text className={styles.playerCount}>{room.players} 人</Text>
            </View>
          </View>
        ))}
      </View>

      {showCreateModal && (
        <View className={styles.modalOverlay} onClick={() => setShowCreateModal(false)}>
          <View className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <Text className={styles.modalTitle}>创建房间</Text>
            <Input
              className={styles.codeInput}
              placeholder="请输入房间名称"
              placeholderTextColor="#64748B"
              value={roomName}
              onInput={e => setRoomName(e.detail.value)}
            />
            <Input
              className={styles.codeInput}
              type="number"
              placeholder="最大人数（默认10）"
              placeholderTextColor="#64748B"
              value={String(maxPlayers)}
              onInput={e => setMaxPlayers(Number(e.detail.value))}
            />
            <View className={styles.modalActions}>
              <Button className={`${styles.btnSecondary}`} style={{ flex: 1 }} onClick={() => setShowCreateModal(false)}>
                取消
              </Button>
              <Button className={styles.btnPrimary} style={{ flex: 1 }} onClick={handleCreateRoom}>
                创建
              </Button>
            </View>
          </View>
        </View>
      )}

      {showJoinModal && (
        <View className={styles.modalOverlay} onClick={() => setShowJoinModal(false)}>
          <View className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <Text className={styles.modalTitle}>加入房间</Text>
            <Input
              className={styles.codeInput}
              placeholder="请输入房间号"
              placeholderTextColor="#64748B"
              value={roomCode}
              onInput={e => setRoomCode(e.detail.value)}
            />
            <Input
              className={styles.codeInput}
              placeholder="活动口令（选填）"
              placeholderTextColor="#64748B"
              value={activityCode}
              onInput={e => setActivityCode(e.detail.value)}
            />
            <View className={styles.modalActions}>
              <Button className={styles.btnSecondary} style={{ flex: 1 }} onClick={() => setShowJoinModal(false)}>
                取消
              </Button>
              <Button className={styles.btnPrimary} style={{ flex: 1 }} onClick={handleJoinRoom}>
                加入
              </Button>
            </View>
          </View>
        </View>
      )}

      {showCodeModal && (
        <View className={styles.modalOverlay} onClick={() => setShowCodeModal(false)}>
          <View className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <Text className={styles.modalTitle}>活动口令</Text>
            <Input
              className={styles.codeInput}
              placeholder="请输入活动口令"
              placeholderTextColor="#64748B"
              value={activityCode}
              onInput={e => setActivityCode(e.detail.value)}
            />
            <View className={styles.modalActions}>
              <Button className={styles.btnSecondary} style={{ flex: 1 }} onClick={() => setShowCodeModal(false)}>
                取消
              </Button>
              <Button className={styles.btnPrimary} style={{ flex: 1 }} onClick={handleActivityCode}>
                验证
              </Button>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default LobbyPage;
