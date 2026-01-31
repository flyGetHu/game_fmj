/**
 * 地图场景 - 游戏主要场景，处理角色移动和对话
 */

import Phaser from 'phaser';
import { SCENE_KEYS, GAME_CONSTANTS } from '../config';
import { Player } from '../objects/Player';
import { DialogueSystem } from '../systems/DialogueSystem';
import { INITIAL_PLAYER_DATA } from '../utils/constants';

export class MapScene extends Phaser.Scene {
  private player!: Player;
  private dialogueSystem!: DialogueSystem;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
  };
  private interactionKey!: Phaser.Input.Keyboard.Key;
  private isDialogueActive: boolean = false;

  constructor() {
    super({ key: SCENE_KEYS.MAP });
  }

  create(): void {
    // 创建简单的测试地图
    this.createTestMap();

    // 创建玩家
    this.player = new Player(this, 400, 300, INITIAL_PLAYER_DATA);

    // 创建对话系统
    this.dialogueSystem = new DialogueSystem(this);

    // 设置键盘控制
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = {
      W: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      S: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };
    this.interactionKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // 监听交互键
    this.interactionKey.on('down', () => {
      if (!this.isDialogueActive) {
        this.checkInteraction();
      } else {
        this.dialogueSystem.advance();
      }
    });

    // 监听对话状态
    this.dialogueSystem.on('dialogue-start', () => {
      this.isDialogueActive = true;
    });

    this.dialogueSystem.on('dialogue-end', () => {
      this.isDialogueActive = false;
    });

    // 添加UI
    this.createUI();

    // 淡入效果
    this.cameras.main.fadeIn(500, 0, 0, 0);
  }

  update(): void {
    if (!this.isDialogueActive) {
      this.player.update(this.cursors, this.wasd);
    }
  }

  private createTestMap(): void {
    // 创建简单的网格背景
    const graphics = this.add.graphics();

    // 地面
    graphics.fillStyle(0x3a5f3a, 1); // 草绿色
    graphics.fillRect(0, 0, 800, 600);

    // 绘制网格线
    graphics.lineStyle(1, 0x2a4f2a, 0.3);
    for (let x = 0; x < 800; x += GAME_CONSTANTS.TILE_SIZE) {
      graphics.strokeRect(x, 0, 1, 600);
    }
    for (let y = 0; y < 600; y += GAME_CONSTANTS.TILE_SIZE) {
      graphics.strokeRect(0, y, 800, 1);
    }

    // 添加一些简单的墙壁/障碍物
    graphics.fillStyle(0x8b4513, 1); // 棕色
    graphics.fillRect(100, 100, 200, 50); // 横墙
    graphics.fillRect(500, 200, 50, 150); // 竖墙

    // 添加一个简单的建筑物
    graphics.fillStyle(0x6b4423, 1);
    graphics.fillRect(350, 100, 150, 150);
    graphics.fillStyle(0x4a3520, 1); // 门
    graphics.fillRect(410, 200, 30, 50);

    // 添加一些树木
    this.createTree(150, 400);
    this.createTree(650, 150);
    this.createTree(700, 450);
  }

  private createTree(x: number, y: number): void {
    const graphics = this.add.graphics();

    // 树干
    graphics.fillStyle(0x8b4513, 1);
    graphics.fillRect(x - 5, y, 10, 20);

    // 树冠
    graphics.fillStyle(0x228b22, 1);
    graphics.fillCircle(x, y - 10, 20);
  }

  private checkInteraction(): void {
    // 检查玩家面前是否有可交互对象
    // 这里暂时使用测试对话
    this.dialogueSystem.show([
      {
        speaker: '系统',
        text: '欢迎来到伏魔记！这是游戏的主场景。\n\n使用方向键或WASD移动，空格键确认。',
      },
      {
        speaker: '系统',
        text: '目前游戏正在开发中，敬请期待更多内容！',
      },
    ]);
  }

  private createUI(): void {
    // 角色信息面板
    const panelX = 10;
    const panelY = 10;

    // 背景
    this.add.rectangle(panelX + 150, panelY + 60, 300, 120, 0x000000, 0.7).setOrigin(0.5, 0.5);

    // 角色名称
    this.add.text(panelX + 10, panelY + 10, INITIAL_PLAYER_DATA.name, {
      font: 'bold 20px Arial',
      color: '#ffffff',
    });

    // HP
    this.add.text(panelX + 10, panelY + 40, `HP: ${INITIAL_PLAYER_DATA.stats.hp}/${INITIAL_PLAYER_DATA.stats.maxHp}`, {
      font: '16px Arial',
      color: '#ff6666',
    });

    // MP
    this.add.text(panelX + 10, panelY + 65, `MP: ${INITIAL_PLAYER_DATA.stats.mp}/${INITIAL_PLAYER_DATA.stats.maxMp}`, {
      font: '16px Arial',
      color: '#6666ff',
    });

    // 等级
    this.add.text(panelX + 10, panelY + 90, `Lv.${INITIAL_PLAYER_DATA.stats.level}`, {
      font: '16px Arial',
      color: '#ffff66',
    });

    // 操作提示
    const controlsText =
      '方向键/WASD: 移动\n空格: 确认/对话\nESC: 返回标题';
    this.add.text(790, 590, controlsText, {
      font: '14px Arial',
      color: '#ffffff',
      backgroundColor: '#000000',
      align: 'right',
    }).setOrigin(1, 1);

    // ESC键返回标题
    this.input.keyboard!.on('keydown-ESC', () => {
      if (!this.isDialogueActive) {
        this.returnToTitle();
      }
    });
  }

  private returnToTitle(): void {
    this.cameras.main.fade(500, 0, 0, 0);
    this.time.delayedCall(500, () => {
      this.scene.start(SCENE_KEYS.TITLE);
    });
  }

  public triggerBattle(enemyId: string): void {
    // 触发战斗
    this.scene.pause(SCENE_KEYS.MAP);
    this.scene.launch(SCENE_KEYS.BATTLE, { enemyId });
  }
}
