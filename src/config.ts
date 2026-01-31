/**
 * 游戏配置
 */

import Phaser from 'phaser';

export const GAME_CONFIG: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  backgroundColor: '#000000',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false,
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  pixelArt: true, // 像素艺术风格
};

// 场景常量
export const SCENE_KEYS = {
  BOOT: 'BootScene',
  TITLE: 'TitleScene',
  MAP: 'MapScene',
  BATTLE: 'BattleScene',
} as const;

// 游戏常量
export const GAME_CONSTANTS = {
  // 角色移动速度
  PLAYER_SPEED: 100,

  // 地图图块大小
  TILE_SIZE: 32,

  // 对话打字速度（毫秒/字符）
  DIALOG_TYPING_SPEED: 30,

  // 战斗动画速度
  BATTLE_ANIMATION_SPEED: 500,
} as const;
