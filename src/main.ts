/**
 * 伏魔记 - 主入口文件
 */

import Phaser from 'phaser';
import { GAME_CONFIG } from './config';
import { BootScene } from './scenes/BootScene';
import { TitleScene } from './scenes/TitleScene';
import { MapScene } from './scenes/MapScene';
import { BattleScene } from './scenes/BattleScene';

// 隐藏加载提示
const loadingElement = document.getElementById('loading');
if (loadingElement) {
  loadingElement.style.display = 'none';
}

// 创建游戏实例
const game = new Phaser.Game({
  ...GAME_CONFIG,
  scene: [BootScene, TitleScene, MapScene, BattleScene],
});

// 导出游戏实例供调试使用
// @ts-ignore - DEV环境变量
if (import.meta.env?.DEV) {
  (window as any).game = game;
}

export default game;
