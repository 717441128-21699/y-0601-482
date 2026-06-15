import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { useGameStore } from '@/store/gameStore';
import { mockPlayers } from '@/data/mockPlayers';
import classnames from 'classnames';

const BattlePage: React.FC = () => {
  const { currentRoom, currentMap, myPlayerId, items, isPaused, pauseGame, resumeGame } = useGameStore();
  
  const [gameTime, setGameTime] = useState(600);
  const [score, setScore] = useState({ red: 0, blue: 0 });
  const [players, setPlayers] = useState(mockPlayers);
  const [messages, setMessages] = useState<{ id: string; text: string; type: string }[]>([]);
  const [itemCooldowns, setItemCooldowns] = useState<Record<string, number>>({});
  const [showStats, setShowStats] = useState(false);
  const [isSpectator, setIsSpectator] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);

  const me = players.find(p => p.id === myPlayerId) || players[0];
  const myTeam = me.team || 'red';

  // 游戏计时器
  useEffect(() => {
    if (isPaused || gameEnded) return;
    
    const timer = setInterval(() => {
      setGameTime(prev => {
        if (prev <= 1) {
          setGameEnded(true);
          addMessage('游戏结束！', 'system');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, gameEnded]);

  // 冷却计时
  useEffect(() => {
    if (isPaused) return;
    
    const timer = setInterval(() => {
      setItemCooldowns(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(key => {
          if (next[key] > 0) next[key]--;
        });
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused]);

  // 模拟玩家移动
  useEffect(() => {
    if (isPaused || gameEnded) return;

    const moveInterval = setInterval(() => {
      setPlayers(prev => prev.map(p => {
        if (!p.isAlive) return p;
        const dx = (Math.random() - 0.5) * 6;
        const dy = (Math.random() - 0.5) * 6;
        return {
          ...p,
          position: {
            x: Math.max(5, Math.min(95, p.position.x + dx)),
            y: Math.max(5, Math.min(95, p.position.y + dy))
          }
        };
      }));
    }, 1500);

    return () => clearInterval(moveInterval);
  }, [isPaused, gameEnded]);

  // 模拟夺旗
  useEffect(() => {
    if (isPaused || gameEnded) return;

    const flagInterval = setInterval(() => {
      if (Math.random() > 0.85) {
        const scoringTeam = Math.random() > 0.5 ? 'red' : 'blue';
        setScore(prev => ({
          ...prev,
          [scoringTeam]: prev[scoringTeam as keyof typeof prev] + 1
        }));
        addMessage(`${scoringTeam === 'red' ? '红队' : '蓝队'}夺得旗帜！`, 'system');
        
        // 增加对应队玩家的夺旗数
        setPlayers(prev => prev.map(p => {
          if (p.team === scoringTeam && p.isAlive) {
            return { ...p, flagsCaptured: p.flagsCaptured + 1, score: p.score + 30 };
          }
          return p;
        }));
      }
    }, 8000);

    return () => clearInterval(flagInterval);
  }, [isPaused, gameEnded]);

  // 模拟击杀
  useEffect(() => {
    if (isPaused || gameEnded) return;

    const killInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setPlayers(prev => {
          const alivePlayers = prev.filter(p => p.isAlive);
          if (alivePlayers.length < 4) return prev;
          
          const killer = alivePlayers[Math.floor(Math.random() * alivePlayers.length)];
          let victim = alivePlayers[Math.floor(Math.random() * alivePlayers.length)];
          
          // 确保不是队友
          while (victim.team === killer.team) {
            victim = alivePlayers[Math.floor(Math.random() * alivePlayers.length)];
          }
          
          if (victim.hasShield) {
            addMessage(`${victim.name}的护盾挡住了攻击！`, 'info');
            return prev.map(p => 
              p.id === victim.id ? { ...p, hasShield: false } : p
            );
          }
          
          addMessage(`${killer.name} 击杀了 ${victim.name}`, 'info');
          
          return prev.map(p => {
            if (p.id === killer.id) {
              return { ...p, kills: p.kills + 1, score: p.score + 20 };
            }
            if (p.id === victim.id) {
              return { 
                ...p, 
                isAlive: false, 
                deaths: p.deaths + 1,
                respawnTime: 10
              };
            }
            return p;
          });
        });
      }
    }, 5000);

    return () => clearInterval(killInterval);
  }, [isPaused, gameEnded]);

  // 复活计时
  useEffect(() => {
    if (isPaused || gameEnded) return;

    const respawnTimer = setInterval(() => {
      setPlayers(prev => prev.map(p => {
        if (!p.isAlive && p.respawnTime > 0) {
          const newTime = p.respawnTime - 1;
          if (newTime <= 0) {
            addMessage(`${p.name} 复活了！`, 'info');
            return { 
              ...p, 
              isAlive: true, 
              respawnTime: 0,
              position: p.team === 'red' 
                ? { x: 15 + Math.random() * 10, y: 40 + Math.random() * 20 }
                : { x: 75 + Math.random() * 10, y: 40 + Math.random() * 20 }
            };
          }
          return { ...p, respawnTime: newTime };
        }
        return p;
      }));
    }, 1000);

    return () => clearInterval(respawnTimer);
  }, [isPaused, gameEnded]);

  const addMessage = useCallback((text: string, type: string) => {
    const msg = { id: 'msg-' + Date.now(), text, type };
    setMessages(prev => [...prev.slice(-4), msg]);
    
    setTimeout(() => {
      setMessages(prev => prev.filter(m => m.id !== msg.id));
    }, 4000);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleUseItem = (itemId: string) => {
    if (gameEnded) return;
    if (itemCooldowns[itemId] > 0) {
      Taro.showToast({ title: '冷却中', icon: 'none' });
      return;
    }

    const item = items.find(i => i.id === itemId);
    if (!item) return;

    if (item.type === 'shield') {
      setPlayers(prev => prev.map(p => 
        p.id === myPlayerId ? { ...p, hasShield: true } : p
      ));
      addMessage('护盾已激活！', 'team');
    } else if (item.type === 'slowdown') {
      setPlayers(prev => prev.map(p => 
        p.id !== myPlayerId && p.team !== myTeam ? { ...p, isSlowdown: true } : p
      ));
      addMessage('减速陷阱已释放！', 'team');
      setTimeout(() => {
        setPlayers(prev => prev.map(p => ({ ...p, isSlowdown: false })));
      }, 5000);
    }

    setItemCooldowns(prev => ({
      ...prev,
      [itemId]: item.cooldown
    }));

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
    Taro.redirectTo({ url: '/pages/record/index' });
  };

  const toggleSpectator = () => {
    setIsSpectator(!isSpectator);
    addMessage(isSpectator ? '已退出观战模式' : '已进入观战模式', 'info');
  };

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <View className={styles.battlePage}>
      {/* 顶部比分板 */}
      <View className={styles.topBar}>
        <View className={styles.scoreBoard}>
          <View className={classnames(styles.teamScore, styles.redTeam)}>
            <Text className={styles.teamLabel}>🔴 红队</Text>
            <Text className={styles.score}>{score.red}</Text>
          </View>
          
          <View className={styles.centerInfo}>
            <Text className={styles.timer}>{formatTime(gameTime)}</Text>
            <Text className={styles.roundInfo}>第 1 / 3 局</Text>
          </View>
          
          <View className={classnames(styles.teamScore, styles.blueTeam)}>
            <Text className={styles.teamLabel}>🔵 蓝队</Text>
            <Text className={styles.score}>{score.blue}</Text>
          </View>
        </View>
      </View>

      {/* 消息提示 */}
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

      {/* 游戏地图 */}
      <View className={styles.gameMapContainer}>
        <View className={styles.gameMap}>
          <View className={styles.mapGrid}></View>
          
          {isSpectator && <View className={styles.spectatorBadge}>👁️ 观战中</View>}

          {/* 出生点区域 */}
          <View 
            className={classnames(styles.spawnZone, styles.redZone)} 
            style={{ left: '15%', top: '50%', width: '25%', height: '40%' }}
          ></View>
          <View 
            className={classnames(styles.spawnZone, styles.blueZone)} 
            style={{ left: '85%', top: '50%', width: '25%', height: '40%' }}
          ></View>

          {/* 旗帜 */}
          <View 
            className={classnames(styles.flag, styles.redFlag)} 
            style={{ left: '15%', top: '50%' }}
          >
            🚩
          </View>
          <View 
            className={classnames(styles.flag, styles.blueFlag)} 
            style={{ left: '85%', top: '50%' }}
          >
            🚩
          </View>
          <View 
            className={classnames(styles.flag, styles.neutralFlag)} 
            style={{ left: '50%', top: '50%' }}
          >
            🏳️
          </View>

          {/* 占点 */}
          <View 
            className={classnames(styles.capturePoint, styles.capturedRed)} 
            style={{ left: '35%', top: '30%' }}
          >
            ⭐
          </View>
          <View 
            className={classnames(styles.capturePoint, styles.capturedBlue)} 
            style={{ left: '65%', top: '70%' }}
          >
            ⭐
          </View>

          {/* 玩家 */}
          {players.map(player => (
            <View
              key={player.id}
              className={classnames(
                styles.player,
                player.team === 'red' ? styles.redPlayer : styles.bluePlayer,
                { [styles.dead]: !player.isAlive },
                { [styles.me]: player.id === myPlayerId },
                { [styles.hasShield]: player.hasShield }
              )}
              style={{
                left: `${player.position.x}%`,
                top: `${player.position.y}%`
              }}
            >
              {player.isAlive ? (player.id === myPlayerId ? '我' : player.name.charAt(0)) : '💀'}
            </View>
          ))}
        </View>
      </View>

      {/* 底部道具栏 */}
      <View className={styles.bottomBar}>
        <View className={styles.itemBar}>
          {items.slice(0, 4).map(item => (
            <View
              key={item.id}
              className={classnames(styles.itemSlot, { [styles.active]: itemCooldowns[item.id] === 0 })}
              onClick={() => handleUseItem(item.id)}
            >
              <Text className={styles.itemIcon}>{item.icon}</Text>
              <Text className={styles.itemName}>{item.name}</Text>
              {itemCooldowns[item.id] > 0 && (
                <View className={styles.cooldownOverlay}>
                  {itemCooldowns[item.id]}
                </View>
              )}
            </View>
          ))}
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
            onClick={handlePause}
          >
            ⏸️ 暂停
          </Button>
        </View>
      </View>

      {/* 复活覆盖层 */}
      {!me.isAlive && !gameEnded && (
        <View className={styles.respawnOverlay}>
          <Text className={styles.respawnText}>💀 你被击杀了</Text>
          <Text className={styles.respawnTimer}>{me.respawnTime}</Text>
          <Text className={styles.respawnHint}>复活倒计时...</Text>
        </View>
      )}

      {/* 暂停覆盖层 */}
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

      {/* 游戏结束 */}
      {gameEnded && (
        <View className={styles.pauseOverlay}>
          <Text className={styles.pauseIcon}>🏆</Text>
          <Text className={styles.pauseText}>
            {score.red > score.blue ? '红队获胜！' : score.blue > score.red ? '蓝队获胜！' : '平局！'}
          </Text>
          <Text className={styles.pauseReason}>
            最终比分 {score.red} : {score.blue}
          </Text>
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

      {/* 战绩弹窗 */}
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
                    <Text className={styles.name}>{player.name}</Text>
                    <Text className={styles.team}>
                      {player.team === 'red' ? '🔴 红队' : '🔵 蓝队'}
                      {' · '}击杀 {player.kills} / 死亡 {player.deaths}
                    </Text>
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
