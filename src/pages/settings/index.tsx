import React, { useState } from 'react';
import { View, Text, Button, Input, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { useGameStore } from '@/store/gameStore';
import classnames from 'classnames';

const SettingsPage: React.FC = () => {
  const { 
    settings, 
    roomSettings,
    updateSettings,
    updateRoomSettings,
    activityCode,
    setActivityCode,
    setPlayerName,
    myPlayerId
  } = useGameStore();
  
  const [showRoundModal, setShowRoundModal] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [showRespawnModal, setShowRespawnModal] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [rounds, setRounds] = useState(roomSettings.totalRounds);
  const [gameTime, setGameTime] = useState(Math.floor(roomSettings.roundTime / 60));
  const [respawnTime, setRespawnTime] = useState(roomSettings.respawnTime);
  const [inputCode, setInputCode] = useState('');
  const [playerName, setPlayerNameInput] = useState(settings.playerName || '玩家');

  const handleConfirmName = () => {
    if (!playerName.trim()) {
      Taro.showToast({ title: '请输入昵称', icon: 'none' });
      return;
    }
    if (playerName.trim().length > 10) {
      Taro.showToast({ title: '昵称最多10个字符', icon: 'none' });
      return;
    }
    setPlayerName(playerName.trim());
    setShowNameModal(false);
    Taro.showToast({ title: `昵称已改为 ${playerName.trim()}`, icon: 'success' });
    console.log('[Settings] Player name updated:', playerName.trim());
  };

  const toggleSound = () => {
    updateSettings({ soundEnabled: !settings.soundEnabled });
    Taro.showToast({ 
      title: settings.soundEnabled ? '音效已关闭' : '音效已开启', 
      icon: 'none' 
    });
  };

  const toggleVibration = () => {
    updateSettings({ vibrationEnabled: !settings.vibrationEnabled });
    Taro.showToast({ 
      title: settings.vibrationEnabled ? '震动已关闭' : '震动已开启', 
      icon: 'none' 
    });
  };

  const toggleTeammateNames = () => {
    updateSettings({ showTeammateNames: !settings.showTeammateNames });
  };

  const toggleAutoRespawn = () => {
    updateSettings({ autoRespawn: !settings.autoRespawn });
  };

  const handleConfirmRounds = () => {
    updateRoomSettings({ totalRounds: rounds });
    updateSettings({ respawnTime: settings.respawnTime });
    setShowRoundModal(false);
    Taro.showToast({ title: `已设置 ${rounds} 局`, icon: 'success' });
    console.log('[Settings] Rounds updated:', rounds);
  };

  const handleConfirmTime = () => {
    updateRoomSettings({ roundTime: gameTime * 60 });
    setShowTimeModal(false);
    Taro.showToast({ title: `已设置 ${gameTime} 分钟`, icon: 'success' });
    console.log('[Settings] Game time updated:', gameTime);
  };

  const handleConfirmRespawn = () => {
    updateRoomSettings({ respawnTime });
    updateSettings({ respawnTime });
    setShowRespawnModal(false);
    Taro.showToast({ title: `复活时间 ${respawnTime} 秒`, icon: 'success' });
    console.log('[Settings] Respawn time updated:', respawnTime);
  };

  const handleVerifyCode = () => {
    if (!inputCode.trim()) {
      Taro.showToast({ title: '请输入口令', icon: 'none' });
      return;
    }
    setActivityCode(inputCode);
    Taro.showToast({ title: '口令验证成功', icon: 'success' });
    console.log('[Settings] Activity code verified:', inputCode);
  };

  const handlePauseViolation = () => {
    Taro.showModal({
      title: '违规暂停',
      content: '确定要发起违规暂停吗？所有人将暂停游戏。',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '已发起违规暂停', icon: 'none' });
          console.log('[Settings] Violation pause requested');
        }
      }
    });
  };

  const handleClearData = () => {
    Taro.showModal({
      title: '清除数据',
      content: '确定要清除所有本地数据吗？此操作不可恢复。',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '数据已清除', icon: 'success' });
        }
      }
    });
  };

  return (
    <ScrollView className={styles.settingsPage} scrollY>
      {/* 个人信息卡片 */}
      <View className={styles.profileCard}>
        <View className={styles.avatarWrapper}>
          <Text className={styles.avatar}>👤</Text>
        </View>
        <View className={styles.profileInfo}>
          <Text className={styles.playerName}>{settings.playerName || '玩家'}</Text>
          <Text className={styles.playerId}>ID: {myPlayerId}</Text>
        </View>
        <View className={styles.editNameBtn} onClick={() => setShowNameModal(true)}>
          <Text className={styles.editNameText}>修改昵称</Text>
        </View>
      </View>

      {/* 活动口令卡片 */}
      <View className={styles.activityCard}>
        <View className={styles.activityHeader}>
          <Text className={styles.activityIcon}>🎫</Text>
          <Text className={styles.activityTitle}>活动口令</Text>
        </View>
        <Input
          className={styles.inputField}
          placeholder="请输入活动口令"
          placeholderTextColor="#64748B"
          value={inputCode}
          onInput={e => setInputCode(e.detail.value)}
        />
        <Button className={styles.btnPrimary} onClick={handleVerifyCode}>
          验证口令
        </Button>
        <Text className={styles.activityDesc}>
          输入活动口令可加入指定团建活动
        </Text>
      </View>

      {/* 活动设置 */}
      <Text className={styles.sectionTitle}>
        <Text className={styles.icon}>⚙️</Text>
        <Text>活动设置</Text>
      </Text>

      <View className={styles.settingsCard}>
        <View className={styles.settingRow} onClick={() => setShowRoundModal(true)}>
          <View className={styles.settingLeft}>
            <Text className={styles.settingIcon}>🎯</Text>
            <View className={styles.settingInfo}>
              <Text className={styles.settingName}>总局数</Text>
              <Text className={styles.settingDesc}>设置比赛总回合数</Text>
            </View>
          </View>
          <View className={styles.settingRight}>
            <Text className={styles.settingValue}>{rounds} 局</Text>
            <Text className={styles.arrow}>›</Text>
          </View>
        </View>

        <View className={styles.settingRow} onClick={() => setShowTimeModal(true)}>
          <View className={styles.settingLeft}>
            <Text className={styles.settingIcon}>⏱️</Text>
            <View className={styles.settingInfo}>
              <Text className={styles.settingName}>每局时间</Text>
              <Text className={styles.settingDesc}>每局游戏时长</Text>
            </View>
          </View>
          <View className={styles.settingRight}>
            <Text className={styles.settingValue}>{gameTime} 分钟</Text>
            <Text className={styles.arrow}>›</Text>
          </View>
        </View>

        <View className={styles.settingRow} onClick={() => setShowRespawnModal(true)}>
          <View className={styles.settingLeft}>
            <Text className={styles.settingIcon}>💫</Text>
            <View className={styles.settingInfo}>
              <Text className={styles.settingName}>复活时间</Text>
              <Text className={styles.settingDesc}>被击杀后复活等待时间</Text>
            </View>
          </View>
          <View className={styles.settingRight}>
            <Text className={styles.settingValue}>{respawnTime} 秒</Text>
            <Text className={styles.arrow}>›</Text>
          </View>
        </View>

        <View className={styles.settingRow}>
          <View className={styles.settingLeft}>
            <Text className={styles.settingIcon}>🔄</Text>
            <View className={styles.settingInfo}>
              <Text className={styles.settingName}>自动复活</Text>
              <Text className={styles.settingDesc}>倒计时结束后自动复活</Text>
            </View>
          </View>
          <View 
            className={classnames(styles.switch, settings.autoRespawn ? styles.on : styles.off)}
            onClick={toggleAutoRespawn}
          >
            <View className={styles.switchDot}></View>
          </View>
        </View>
      </View>

      {/* 游戏管理 */}
      <Text className={styles.sectionTitle}>
        <Text className={styles.icon}>🎮</Text>
        <Text>游戏管理</Text>
      </Text>

      <View className={styles.settingsCard}>
        <View className={styles.settingRow}>
          <View className={styles.settingLeft}>
            <Text className={styles.settingIcon}>👁️</Text>
            <View className={styles.settingInfo}>
              <Text className={styles.settingName}>显示队友名称</Text>
              <Text className={styles.settingDesc}>在地图上显示队友名字</Text>
            </View>
          </View>
          <View 
            className={classnames(styles.switch, settings.showTeammateNames ? styles.on : styles.off)}
            onClick={toggleTeammateNames}
          >
            <View className={styles.switchDot}></View>
          </View>
        </View>

        <View className={styles.settingRow} onClick={handlePauseViolation}>
          <View className={styles.settingLeft}>
            <Text className={styles.settingIcon}>⚠️</Text>
            <View className={styles.settingInfo}>
              <Text className={styles.settingName}>违规暂停</Text>
              <Text className={styles.settingDesc}>发现违规行为时暂停游戏</Text>
            </View>
          </View>
          <View className={styles.settingRight}>
            <Text className={styles.arrow}>›</Text>
          </View>
        </View>
      </View>

      {/* 音效与震动 */}
      <Text className={styles.sectionTitle}>
        <Text className={styles.icon}>🔊</Text>
        <Text>音效与震动</Text>
      </Text>

      <View className={styles.settingsCard}>
        <View className={styles.settingRow}>
          <View className={styles.settingLeft}>
            <Text className={styles.settingIcon}>🔊</Text>
            <View className={styles.settingInfo}>
              <Text className={styles.settingName}>游戏音效</Text>
              <Text className={styles.settingDesc}>开启/关闭所有音效</Text>
            </View>
          </View>
          <View 
            className={classnames(styles.switch, settings.soundEnabled ? styles.on : styles.off)}
            onClick={toggleSound}
          >
            <View className={styles.switchDot}></View>
          </View>
        </View>

        <View className={styles.settingRow}>
          <View className={styles.settingLeft}>
            <Text className={styles.settingIcon}>📳</Text>
            <View className={styles.settingInfo}>
              <Text className={styles.settingName}>震动反馈</Text>
              <Text className={styles.settingDesc}>操作时的震动提示</Text>
            </View>
          </View>
          <View 
            className={classnames(styles.switch, settings.vibrationEnabled ? styles.on : styles.off)}
            onClick={toggleVibration}
          >
            <View className={styles.switchDot}></View>
          </View>
        </View>
      </View>

      {/* 其他 */}
      <Text className={styles.sectionTitle}>
        <Text className={styles.icon}>📋</Text>
        <Text>其他</Text>
      </Text>

      <View className={styles.settingsCard}>
        <View className={styles.settingRow}>
          <View className={styles.settingLeft}>
            <Text className={styles.settingIcon}>📖</Text>
            <View className={styles.settingInfo}>
              <Text className={styles.settingName}>游戏规则</Text>
              <Text className={styles.settingDesc}>查看详细游戏规则说明</Text>
            </View>
          </View>
          <View className={styles.settingRight}>
            <Text className={styles.arrow}>›</Text>
          </View>
        </View>

        <View className={styles.settingRow}>
          <View className={styles.settingLeft}>
            <Text className={styles.settingIcon}>💬</Text>
            <View className={styles.settingInfo}>
              <Text className={styles.settingName}>意见反馈</Text>
              <Text className={styles.settingDesc}>帮助我们做得更好</Text>
            </View>
          </View>
          <View className={styles.settingRight}>
            <Text className={styles.arrow}>›</Text>
          </View>
        </View>

        <View className={styles.settingRow} onClick={handleClearData}>
          <View className={styles.settingLeft}>
            <Text className={styles.settingIcon}>🗑️</Text>
            <View className={styles.settingInfo}>
              <Text className={styles.settingName}>清除缓存</Text>
              <Text className={styles.settingDesc}>清除本地缓存数据</Text>
            </View>
          </View>
          <View className={styles.settingRight}>
            <Text className={styles.arrow}>›</Text>
          </View>
        </View>
      </View>

      {/* 关于 */}
      <View className={styles.aboutSection}>
        <Text className={styles.logo}>🏆</Text>
        <Text className={styles.appName}>团建夺旗战</Text>
        <Text className={styles.version}>Version 1.0.0</Text>
      </View>

      {/* 局数选择弹窗 */}
      {showRoundModal && (
        <View className={styles.modalOverlay} onClick={() => setShowRoundModal(false)}>
          <View className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <Text className={styles.modalTitle}>选择总局数</Text>
            <View className={styles.optionList}>
              {[1, 3, 5, 7, 9].map(num => (
                <View
                  key={num}
                  className={classnames(styles.optionItem, { [styles.active]: rounds === num })}
                  onClick={() => setRounds(num)}
                >
                  {num} 局
                </View>
              ))}
            </View>
            <View className={styles.modalActions}>
              <Button className={styles.btnSecondary} style={{ flex: 1 }} onClick={() => setShowRoundModal(false)}>
                取消
              </Button>
              <Button className={styles.btnPrimary} style={{ flex: 1 }} onClick={handleConfirmRounds}>
                确定
              </Button>
            </View>
          </View>
        </View>
      )}

      {/* 时间选择弹窗 */}
      {showTimeModal && (
        <View className={styles.modalOverlay} onClick={() => setShowTimeModal(false)}>
          <View className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <Text className={styles.modalTitle}>选择每局时间</Text>
            <View className={styles.optionList}>
              {[5, 10, 15, 20, 30].map(num => (
                <View
                  key={num}
                  className={classnames(styles.optionItem, { [styles.active]: gameTime === num })}
                  onClick={() => setGameTime(num)}
                >
                  {num} 分钟
                </View>
              ))}
            </View>
            <View className={styles.modalActions}>
              <Button className={styles.btnSecondary} style={{ flex: 1 }} onClick={() => setShowTimeModal(false)}>
                取消
              </Button>
              <Button className={styles.btnPrimary} style={{ flex: 1 }} onClick={handleConfirmTime}>
                确定
              </Button>
            </View>
          </View>
        </View>
      )}

      {/* 复活时间弹窗 */}
      {showRespawnModal && (
        <View className={styles.modalOverlay} onClick={() => setShowRespawnModal(false)}>
          <View className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <Text className={styles.modalTitle}>选择复活时间</Text>
            <View className={styles.optionList}>
              {[5, 8, 10, 15, 20].map(num => (
                <View
                  key={num}
                  className={classnames(styles.optionItem, { [styles.active]: respawnTime === num })}
                  onClick={() => setRespawnTime(num)}
                >
                  {num} 秒
                </View>
              ))}
            </View>
            <View className={styles.modalActions}>
              <Button className={styles.btnSecondary} style={{ flex: 1 }} onClick={() => setShowRespawnModal(false)}>
                取消
              </Button>
              <Button className={styles.btnPrimary} style={{ flex: 1 }} onClick={handleConfirmRespawn}>
                确定
              </Button>
            </View>
          </View>
        </View>
      )}

      {/* 修改昵称弹窗 */}
      {showNameModal && (
        <View className={styles.modalOverlay} onClick={() => setShowNameModal(false)}>
          <View className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <Text className={styles.modalTitle}>修改昵称</Text>
            <Input
              className={styles.inputField}
              placeholder="请输入新昵称"
              placeholderTextColor="#64748B"
              value={playerName}
              maxlength={10}
              onInput={e => setPlayerNameInput(e.detail.value)}
            />
            <Text className={styles.inputHint}>最多10个字符</Text>
            <View className={styles.modalActions}>
              <Button className={styles.btnSecondary} style={{ flex: 1 }} onClick={() => setShowNameModal(false)}>
                取消
              </Button>
              <Button className={styles.btnPrimary} style={{ flex: 1 }} onClick={handleConfirmName}>
                确定
              </Button>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default SettingsPage;
