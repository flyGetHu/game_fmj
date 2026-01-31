/**
 * 标题场景 - 游戏开始界面
 */

import Phaser from 'phaser';
import { SCENE_KEYS } from '../config';

export class TitleScene extends Phaser.Scene {
  private titleText!: Phaser.GameObjects.Text;
  private startText!: Phaser.GameObjects.Text;
  private cursor!: number; // 0: 开始游戏, 1: 读取进度, 2: 退出

  constructor() {
    super({ key: SCENE_KEYS.TITLE });
  }

  create(): void {
    const { width, height } = this.cameras.main;

    // 背景
    this.add.rectangle(0, 0, width, height, 0x000033).setOrigin(0, 0);

    // 游戏标题
    this.titleText = this.add.text(width / 2, height / 3, '伏魔记', {
      font: 'bold 64px Arial',
      color: '#ffcc00',
      stroke: '#000000',
      strokeThickness: 6,
    });
    this.titleText.setOrigin(0.5, 0.5);

    // 副标题
    this.add.text(width / 2, height / 3 + 60, '步步高经典RPG', {
      font: '24px Arial',
      color: '#ffffff',
    }).setOrigin(0.5, 0.5);

    // 菜单选项
    this.cursor = 0;
    const menuY = height / 2 + 50;

    this.startText = this.add.text(width / 2, menuY, '开始游戏', {
      font: '28px Arial',
      color: '#ffffff',
    });
    this.startText.setOrigin(0.5, 0.5);

    this.add.text(width / 2, menuY + 50, '读取进度', {
      font: '28px Arial',
      color: '#888888',
    }).setOrigin(0.5, 0.5);

    this.add.text(width / 2, menuY + 100, '退出游戏', {
      font: '28px Arial',
      color: '#888888',
    }).setOrigin(0.5, 0.5);

    // 选择指示器
    const cursorIndicator = this.add.text(width / 2 - 150, menuY, '▶', {
      font: '32px Arial',
      color: '#ffcc00',
    });
    cursorIndicator.setOrigin(0.5, 0.5);

    // 键盘控制
    this.input.keyboard?.on('keydown-UP', () => {
      this.cursor = Math.max(0, this.cursor - 1);
      this.updateMenu(cursorIndicator, menuY);
    });

    this.input.keyboard?.on('keydown-DOWN', () => {
      this.cursor = Math.min(2, this.cursor + 1);
      this.updateMenu(cursorIndicator, menuY);
    });

    this.input.keyboard?.on('keydown-ENTER', () => {
      this.selectMenu();
    });

    // 添加版权信息
    this.add.text(width / 2, height - 30, '© 2024 伏魔记 Web 版', {
      font: '16px Arial',
      color: '#666666',
    }).setOrigin(0.5, 0.5);

    // 淡入效果
    this.cameras.main.fadeIn(500, 0, 0, 0);
  }

  private updateMenu(cursorIndicator: Phaser.GameObjects.Text, menuY: number): void {
    cursorIndicator.setY(menuY + this.cursor * 50);
  }

  private selectMenu(): void {
    switch (this.cursor) {
      case 0: // 开始游戏
        this.startGame();
        break;
      case 1: // 读取进度
        // TODO: 实现存档读取
        this.showMessage('暂无存档');
        break;
      case 2: // 退出游戏
        this.showMessage('再见！');
        setTimeout(() => {
          window.close();
        }, 1000);
        break;
    }
  }

  private startGame(): void {
    this.cameras.main.fade(500, 0, 0, 0);
    this.time.delayedCall(500, () => {
      this.scene.start(SCENE_KEYS.MAP);
    });
  }

  private showMessage(message: string): void {
    const { width, height } = this.cameras.main;
    const msgText = this.add.text(width / 2, height / 2, message, {
      font: '32px Arial',
      color: '#ffffff',
      backgroundColor: '#000000',
    });
    msgText.setOrigin(0.5, 0.5);

    this.time.delayedCall(1500, () => {
      msgText.destroy();
    });
  }
}
