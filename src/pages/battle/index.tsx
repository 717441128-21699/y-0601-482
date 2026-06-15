import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { useGameStore } from '@/store/gameStore';
import classnames from 'classnames';

const BattlePage: React.FC = () => {
  const {
    currentRoom,
    currentMap,
    myPlayerId,
    items,
    selectedItems,
    isPaused,
    roomSettings,
    pauseGame,
    resumeGame,
    updatePlayerGameData,
    updateScore,
    addMessage: addStoreMessage,
    useItem,
    tickEffectTimes,
    saveGameRecord,
    startGame
  } = useGameStore();

  const [localGameTime, setLocalGameTime] = useState(currentRoom?.roundTime || 600);
  const [messages, setMessages] = useState<{ id: string; text: string; type: string }[]>([]);
  const [showStats, setShowStats] = useState(false);
  const [isSpectator, setIsSpectator] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const hasStartedRef = useRef(false);
  const hasSavedRecordRef = useRef(false);

  const players = currentRoom?.players || [];
  const score = currentRoom?.score || { red: 0, blue: 0 };
  const totalRounds = currentRoom?.totalRounds || roomSettings.totalRounds;
  const currentRound = currentRoom?.currentRound || 1;
  const respawnTime = roomSettings.respawnTime;

  const me = players.find(p => p.id === myPlayerId);
  const myTeam = me?.team || 'red';
  const myCooldowns = me?.itemCooldowns || {};

  const battleItems = items.filter(i => selectedItems.includes(i.id));

  useEffect(() => {
    if (currentRoom?.gameStatus === 'waiting' && !hasStartedRef.current) {
      hasStartedRef.current = true;
      startGame();
    }
  }, [currentRoom, startGame]);

  const addMessage = useCallback((text: string, type: string) => {
    const msg = { id: 'msg-' + Date.now() + Math.random(), text, type };
    setMessages(prev => [...prev.slice(-4), msg]);
    addStoreMessage(text, type as any);
    
    setTimeout(() => {
      setMessages(prev => prev.filter(m => m.id !== msg.id));
    }, 4000);
  }, [addStoreMessage]);

  useEffect(() => {
    if (currentRoom?.roundTime) {
      setLocalGameTime(currentRoom.roundTime);
    }
  }, [currentRoom?.roundTime]);

  useEffect(() => {
    if (isPaused || gameEnded || !currentRoom) return;
    
    const timer = setInterval(() => {
      setLocalGameTime(prev => {
        if (prev <= 1) {
          setGameEnded(true);
          addMessage('游戏结束！', 'system');
          return 0;
        }
        return prev - 1;
      });
      
      tickEffectTimes();
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, gameEnded, currentRoom, tickEffectTimes, addMessage]);

  useEffect(() => {
    if (isPaused || gameEnded || !currentRoom) return;

    const moveInterval = setInterval(() => {
      players.forEach(p => {
        if (!p.isAlive) return;
        
        let speedFactor = 1;
        if (p.hasSpeed) speedFactor = 1.5;
        if (p.isSlowdown) speedFactor = 0.5;
        
        const baseSpeed = 6 * speedFactor;
        const dx = (Math.random() - 0.5) * baseSpeed;
        const dy = (Math.random() - 0.5) * baseSpeed;
        
        const newX = Math.max(5, Math.min(95, p.position.x + dx));
        const newY = Math.max(5, Math.min(95, p.position.y + dy));
        
        updatePlayerGameData(p.id, {
          position: { x: newX, y: newY }
        });
      });
    }, 1200);

    return () => clearInterval(moveInterval);
  }, [isPaused, gameEnded, currentRoom, players, updatePlayerGameData]);

  useEffect(() => {
    if (isPaused || gameEnded || !currentRoom) return;

    const flagInterval = setInterval(() => {
      if (Math.random() > 0.82) {
        const scoringTeam = Math.random() > 0.5 ? 'red' : 'blue';
        updateScore(scoringTeam, 1);
        addMessage(`${scoringTeam === 'red' ? '红队' : '蓝队'}夺得旗帜！+1分`, 'system');
        
        const scoringPlayer = players.find(p => p.team === scoringTeam && p.isAlive);
        if (scoringPlayer) {
          updatePlayerGameData(scoringPlayer.id, {
            flagsCaptured: scoringPlayer.flagsCaptured + 1,
            score: scoringPlayer.score + 30
          });
        }
      }
    }, 7000);

    return () => clearInterval(flagInterval);
  }, [isPaused, gameEnded, currentRoom, players, updateScore, updatePlayerGameData, addMessage]);

  useEffect(() => {
    if (isPaused || gameEnded || !currentRoom) return;

    const killInterval = setInterval(() => {
      if (Math.random() > 0.65) {
        const alivePlayers = players.filter(p => p.isAlive);
        if (alivePlayers.length < 4) return;
        
        const killer = alivePlayers[Math.floor(Math.random() * alivePlayers.length)];
        let victim = alivePlayers[Math.floor(Math.random() * alivePlayers.length)];
        
        while (victim.team === killer.team || victim.id === killer.id) {
          victim = alivePlayers[Math.floor(Math.random() * alivePlayers.length)];
          if (alivePlayers.filter(p => p.team !== killer.team).length <= 1) break;
        }
        
        if (victim.team === killer.team) return;
        
        if (victim.hasShield) {
          addMessage(`${victim.name}的护盾挡住了${killer.name}的攻击！`, 'info');
          updatePlayerGameData(victim.id, { hasShield: false, shieldTime: 0 });
          return;
        }
        
        const killerBonus = killer.hasSpeed ? '（加速追击）' : '';
        addMessage(`${killer.name}${killerBonus} 击杀了 ${victim.name}${victim.isSlowdown ? '（减速中）' : ''}`, 'info');
        
        updatePlayerGameData(killer.id, {
          kills: killer.kills + 1,
          score: killer.score + 20
        });
        
        updatePlayerGameData(victim.id, {
          isAlive: false,
          deaths: victim.deaths + 1,
          respawnTime: respawnTime,
          hasShield: false,
          shieldTime: 0,
          isSlowdown: false,
          slowdownTime: 0,
          hasSpeed: false,
          speedTime: 0
        });
      }
    }, 4500);

    return () => clearInterval(killInterval);
  }, [isPaused, gameEnded, currentRoom, players, respawnTime, updatePlayerGameData, addMessage]);

  useEffect(() => {
    if (isPaused || gameEnded || !currentRoom) return;

    const respawnTimer = setInterval(() => {
      players.forEach(p => {
        if (!p.isAlive && p.respawnTime > 0) {
          const newTime = p.respawnTime - 1;
          if (newTime <= 0) {
            addMessage(`${p.name} 复活了！`, 'info');
            const spawnPoints = currentMap?.spawnPoints[p.team || 'red'] || [{ x: 50, y: 50 }];
            const spawn = spawnPoints[Math.floor(Math.random() * spawnPoints.length)];
            updatePlayerGameData(p.id, {
              isAlive: true,
              respawnTime: 0,
              hasShield: false,
              shieldTime: 0,
              isSlowdown: false,
              slowdownTime: 0,
              hasSpeed: false,
              speedTime: 0,
              position: { 
                x: spawn.x + (Math.random() - 0.5) * 6, 
                y: spawn.y + (Math.random() - 0.5) * 6 
              }
            });
          } else {
            updatePlayerGameData(p.id, { respawnTime: newTime });
          }
        }
      });
    }, 1000);

    return () => clearInterval(respawnTimer);
  }, [isPaused, gameEnded, currentRoom, currentMap, players, updatePlayerGameData, addMessage]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleUseItem = (itemId: string) => {
    if (gameEnded || !me || !me.isAlive) return;
    
    const cooldown = myCooldowns[itemId];
    if (cooldown && cooldown > 0) {
      Taro.showToast({ title: '冷却中', icon: 'none' });
      return;
    }

    const item = items.find(i => i.id === itemId);
    if (!item) return;

    useItem(itemId);
    
    if (item.type === 'shield' || itemId === 'shield') {
      addMessage(`护盾已激活！持续${item.duration}秒`, 'team');
    } else if (item.type === 'speed' || itemId === 'speed') {
      addMessage(`加速已开启！速度提升50%`, 'team');
    } else if (item.type === 'trap' || itemId === 'slowdown') {
      addMessage('减速陷阱已释放！', 'team');
    } else if (itemId === 'shockwave') {
      addMessage('冲击波已释放！击退周围敌人', 'team');
    } else if (itemId === 'invisible') {
      addMessage('隐身已开启！', 'team');
    } else if (itemId === 'scout') {
      addMessage('侦查眼已放置！', 'team');
    }

    console.log('[Battle] Item used:', itemId);
  };

  const handlePause = () => {
    if (currentRoom?.hostId === myPlayerId) {
      pauseGame();
      addMessage('游戏已暂停', 'system');
    }
  };

  const handleResume = () => {
    if (currentRoom?.hostId === myPlayerId) {
      resumeGame();
      addMessage('游戏继续', 'system');
    }
  };

  const handleEndGame = () => {
    if (!hasSavedRecordRef.current) {
      hasSavedRecordRef.current = true;
      saveGameRecord();
    }
    Taro.redirectTo({ url: '/pages/record/index' });
  };

  const toggleSpectator = () => {
    setIsSpectator(!isSpectator);
    addMessage(isSpectator ? '已退出观战模式' : '已进入观战模式', 'info');
  };

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  if (!currentRoom || players.length === 0) {
    return (
      <View className={styles.battlePage}>
        <View style={{ padding: 100, textAlign: 'center' }}>
          <Text style={{ fontSize: 32, color: '#F1F5F9' }}>加载中...</Text>
        </View>
      </View>
    );
  }

  return (
    <View className={styles.battlePage}>
      <View className={styles.topBar}>
        <View className={styles.scoreBoard}>
          <View className={classnames(styles.teamScore, styles.redTeam)}>
            <Text className={styles.teamLabel}>🔴 红队</Text>
            <Text className={styles.score}>{score.red}</Text>
          </View>
          
          <View className={styles.centerInfo}>
            <Text className={styles.timer}>{formatTime(localGameTime)}</Text>
            <Text className={styles.roundInfo}>第 {currentRound} / {totalRounds} 局</Text>
          </View>
          
          <View className={classnames(styles.teamScore, styles.blueTeam)}>
            <Text className={styles.teamLabel}>🔵 蓝队</Text>
            <Text className={styles.score}>{score.blue}</Text>
          </View>
        </View>
      </View>

      <View className={styles.messageLog}>
        {messages.map(msg => (
          <View
            key={msg.id}
            className={classnames(
              styles.messageItem,
              msg.type === 'team' && styles.teamMsg,
              msg.type === 'system' && styles.systemMsg,
              msg.type === 'info' && styles.infoMsg
            )}
          >
            {msg.text}
          </View>
        ))}
      </View>

      <View className={styles.gameMapContainer}>
        <View className={styles.gameMap}>
          <View className={styles.mapGrid}></View>
          
          {isSpectator && <View className={styles.spectatorBadge}>👁️ 观战中</View>}

          {currentMap?.flagPositions && (
            <>
              <View
                className={classnames(styles.flag, styles.redFlag)}
                style={{ left: `${currentMap.flagPositions.red.x}%`, top: `${currentMap.flagPositions.red.y}%` }}
              >
                🚩
              </View>
              <View
                className={classnames(styles.flag, styles.blueFlag)}
                style={{ left: `${currentMap.flagPositions.blue.x}%`, top: `${currentMap.flagPositions.blue.y}%` }}
              >
                🚩
              </View>
              {currentMap.flagPositions.neutral && (
                <View
                  className={classnames(styles.flag, styles.neutralFlag)}
                  style={{ left: `${currentMap.flagPositions.neutral.x}%`, top: `${currentMap.flagPositions.neutral.y}%` }}
                >
                  🏳️
                </View>
              )}
            </>
          )}

          {currentMap?.capturePoints?.map((cp, idx) => (
            <View
              key={cp.id}
              className={classnames(
                styles.capturePoint,
                idx % 2 === 0 ? styles.capturedRed : styles.capturedBlue
              )}
              style={{ left: `${cp.x}%`, top: `${cp.y}%` }}
            >
              ⭐
            </View>
          ))}

          {players.map(player => {
            const showPlayer = isSpectator || player.id === myPlayerId || player.team === myTeam || !player.hasShield;
            const isInvisible = (player as any).hasInvisible && player.id !== myPlayerId;
            
            if (isInvisible) return null;
            
            return (
              <View
                key={player.id}
                className={classnames(
                  styles.player,
                  player.team === 'red' ? styles.redPlayer : styles.bluePlayer,
                  { [styles.dead]: !player.isAlive },
                  { [styles.me]: player.id === myPlayerId },
                  { [styles.hasShield]: player.hasShield },
                  { [styles.hasSpeed]: player.hasSpeed },
                  { [styles.isSlowdown]: player.isSlowdown }
                )}
                style={{
                  left: `${player.position.x}%`,
                  top: `${player.position.y}%`
                }}
              >
                {player.isAlive ? (player.id === myPlayerId ? '我' : player.name.charAt(0)) : '💀'}
                
                {player.hasShield && player.shieldTime > 0 && (
                  <View className={styles.effectTimer}>{player.shieldTime}s</View>
                )}
                {player.hasSpeed && player.speedTime > 0 && (
                  <View className={classnames(styles.effectTimer, styles.speedTimer)}>{player.speedTime}s</View>
                )}
                {player.isSlowdown && player.slowdownTime > 0 && (
                  <View className={classnames(styles.effectTimer, styles.slowTimer)}>{player.slowdownTime}s</View>
                )}
              </View>
            );
          })}
        </View>
      </View>

      <View className={styles.bottomBar}>
        <View className={styles.itemBar}>
          {battleItems.length > 0 ? (
            battleItems.map(item => {
              const cd = myCooldowns[item.id] || 0;
              const isOnCooldown = cd > 0;
              const isDisabled = isOnCooldown || !me?.isAlive || gameEnded;
              
              return (
                <View
                  key={item.id}
                  className={classnames(
                    styles.itemSlot, 
                    { [styles.active]: !isOnCooldown },
                    { [styles.disabled]: isDisabled }
                  )}
                  onClick={() => handleUseItem(item.id)}
                >
                  <Text className={styles.itemIcon}>{item.icon}</Text>
                  <Text className={styles.itemName}>{item.name}</Text>
                  {isOnCooldown && (
                    <View className={styles.cooldownOverlay}>
                      {cd}
                    </View>
                  )}
                </View>
              );
            })
          ) : (
            <View className={styles.noItemsHint}>
              <Text>未携带道具，去道具中心装备吧</Text>
            </View>
          )}
        </View>

        <View className={styles.actionButtons}>
          <Button
            className={classnames(styles.actionBtn, styles.secondary)}
            onClick={() => setShowStats(true)}
          >
            📊 战绩
          </Button>
          <Button
            className={classnames(styles.actionBtn, styles.secondary)}
            onClick={toggleSpectator}
          >
            {isSpectator ? '🎮 参战' : '👁️ 观战'}
          </Button>
          <Button
            className={classnames(styles.actionBtn, styles.primary)}
            onClick={isPaused ? handleResume : handlePause}
          >
            {isPaused ? '▶️ 继续' : '⏸️ 暂停'}
          </Button>
        </View>
      </View>

      {me && !me.isAlive && !gameEnded && (
        <View className={styles.respawnOverlay}>
          <Text className={styles.respawnText}>💀 你被击杀了</Text>
          <Text className={styles.respawnTimer}>{me.respawnTime}</Text>
          <Text className={styles.respawnHint}>复活倒计时...</Text>
        </View>
      )}

      {isPaused && !gameEnded && (
        <View className={styles.pauseOverlay}>
          <Text className={styles.pauseIcon}>⏸️</Text>
          <Text className={styles.pauseText}>游戏暂停</Text>
          <Text className={styles.pauseReason}>违规暂停 · 等待房主继续</Text>
          {currentRoom?.hostId === myPlayerId && (
            <View className={styles.pauseActions}>
              <Button
                className={classnames(styles.actionBtn, styles.primary)}
                onClick={handleResume}
                style={{ flex: 1 }}
              >
                ▶️ 继续游戏
              </Button>
            </View>
          )}
        </View>
      )}

      {gameEnded && (
        <View className={styles.pauseOverlay}>
          <Text className={styles.pauseIcon}>🏆</Text>
          <Text className={styles.pauseText}>
            {score.red > score.blue ? '红队获胜！' : score.blue > score.red ? '蓝队获胜！' : '平局！'}
          </Text>
          <Text className={styles.pauseReason}>
            最终比分 {score.red} : {score.blue}
          </Text>
          <View className={styles.mvpLine}>
            <Text className={styles.mvpLabel}>👑 MVP: </Text>
            <Text className={styles.mvpName}>
              {sortedPlayers[0]?.name || '未知'}
            </Text>
            <Text className={styles.mvpScore}> ({sortedPlayers[0]?.score || 0}分)</Text>
          </View>
          <View className={styles.pauseActions}>
            <Button
              className={classnames(styles.actionBtn, styles.primary)}
              onClick={handleEndGame}
              style={{ flex: 1 }}
            >
              查看战绩
            </Button>
          </View>
        </View>
      )}

      {showStats && (
        <>
          <View
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 399 }}
            onClick={() => setShowStats(false)}
          />
          <View className={styles.statsPopup}>
            <Text className={styles.popupTitle}>🏅 实时排名</Text>
            <ScrollView scrollY style={{ maxHeight: 500 }}>
              {sortedPlayers.map((player, index) => (
                <View key={player.id} className={styles.playerStat}>
                  <Text className={styles.rank}>
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                  </Text>
                  <View className={styles.playerInfo}>
                    <Text className={styles.name}>
                      {player.name}
                      {player.id === myPlayerId && ' (我)'}
                    </Text>
                    <Text className={styles.team}>
                      {player.team === 'red' ? '🔴 红队' : '🔵 蓝队'}
                      {' · '}击杀 {player.kills} / 死亡 {player.deaths}
                    </Text>
                    <View className={styles.statusIcons}>
                      {player.hasShield && <Text className={styles.statusIcon}>🛡️</Text>}
                      {player.hasSpeed && <Text className={styles.statusIcon}>⚡</Text>}
                      {player.isSlowdown && <Text className={styles.statusIcon}>🐌</Text>}
                      {!player.isAlive && <Text className={styles.statusIcon}>💀</Text>}
                    </View>
                  </View>
                  <Text className={styles.playerScore}>{player.score}</Text>
                </View>
              ))}
            </ScrollView>
            <Button className={styles.closeBtn} onClick={() => setShowStats(false)}>
              关闭
            </Button>
          </View>
        </>
      )}
    </View>
  );
};

export default BattlePage;
