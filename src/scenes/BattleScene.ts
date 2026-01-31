/**
 * 战斗场景 - 回合制战斗系统
 */

import Phaser from 'phaser';
import { SCENE_KEYS } from '../config';
import { BattleSystem } from '../systems/BattleSystem';
import { INITIAL_PLAYER_DATA } from '../utils/constants';

export class BattleScene extends Phaser.Scene {
  private battleSystem!: BattleSystem;
  private playerData = INITIAL_PLAYER_DATA;

  constructor() {
    super({ key: SCENE_KEYS.BATTLE });
  }

  init(data: { enemyId: string }): void {
    // 从场景参数获取敌人ID
    const enemyId = data.enemyId ?? 'slime';
    this.battleSystem = new BattleSystem(this, this.playerData, enemyId);
  }

  create(): void {
    // 战斗背景
    this.createBackground();

    // 创建战斗UI
    this.battleSystem.createUI();

    // 监听战斗结束事件
    this.battleSystem.on('battle-end', (result: { victory: boolean }) => {
      this.time.delayedCall(1500, () => {
        if (result.victory) {
          this.returnToMap();
        } else {
          this.gameOver();
        }
      });
    });

    // 开始战斗
    this.battleSystem.startBattle();

    // 淡入效果
    this.cameras.main.fadeIn(500, 0, 0, 0);
  }

  private createBackground(): void {
    const { width, height } = this.cameras.main;

    // 战斗背景
    this.add.rectangle(0, 0, width, height, 0x1a1a2e).setOrigin(0, 0);

    // 绘制战斗场地
    const graphics = this.add.graphics();
    graphics.fillStyle(0x16213e, 1);
    graphics.fillRect(50, 100, 300, 300);
    graphics.fillRect(450, 100, 300, 300);

    // 边框
    graphics.lineStyle(3, 0x0f3460, 1);
    graphics.strokeRect(50, 100, 300, 300);
    graphics.strokeRect(450, 100, 300, 300);

    // 标签
    this.add.text(200, 80, '我方', {
      font: 'bold 20px Arial',
      color: '#4cc9f0',
    }).setOrigin(0.5, 0.5);

    this.add.text(600, 80, '敌方', {
      font: 'bold 20px Arial',
      color: '#f72585',
    }).setOrigin(0.5, 0.5);
  }

  private returnToMap(): void {
    this.cameras.main.fade(500, 0, 0, 0);
    this.time.delayedCall(500, () => {
      this.scene.stop(SCENE_KEYS.BATTLE);
      this.scene.resume(SCENE_KEYS.MAP);
    });
  }

  private gameOver(): void {
    this.cameras.main.fade(500, 0, 0, 0);
    this.time.delayedCall(500, () => {
      this.scene.stop(SCENE_KEYS.BATTLE);
      this.scene.stop(SCENE_KEYS.MAP);
      this.scene.start(SCENE_KEYS.TITLE);
    });
  }

  public endBattle(victory: boolean): void {
    this.battleSystem.endBattle(victory);
  }
}
