/**
 * 标题场景 - 游戏开始界面
 *
 * 伏魔记标题画面
 * - 显示游戏标题和副标题
 * - 背景故事简介
 * - 菜单系统（开始游戏、读取进度、退出游戏）
 * - 古典风格设计
 */

import Phaser from 'phaser';
import { SCENE_KEYS } from '../config';

export class TitleScene extends Phaser.Scene {
  private menuOptions: Phaser.GameObjects.Text[] = [];
  private cursor: number = 0;
  private cursorIndicator!: Phaser.GameObjects.Text;
  private menuY: number = 0;

  // 菜单配置
  private readonly MENU_ITEMS = [
    { text: '开始游戏', action: () => this.startGame() },
    { text: '读取进度', action: () => this.loadGame() },
    { text: '退出游戏', action: () => this.exitGame() },
  ];

  constructor() {
    super({ key: SCENE_KEYS.TITLE });
  }

  create(): void {
    const { width, height } = this.cameras.main;

    // 创建背景
    this.createBackground(width, height);

    // 创建标题
    this.createTitle(width, height);

    // 创建背景故事简介
    this.createStory(width, height);

    // 创建菜单
    this.createMenu(width, height);

    // 创建版权信息
    this.createCopyright(width, height);

    // 淡入效果
    this.cameras.main.fadeIn(1000, 0, 0, 0);
  }

  /**
   * 创建背景 - 古典风格渐变背景
   */
  private createBackground(width: number, height: number): void {
    // 深色渐变背景（模拟古代宣纸质感）
    const graphics = this.add.graphics();

    // 背景渐变 - 从深蓝到深紫
    graphics.fillGradientStyle(0x1a1a2e, 0x1a1a2e, 0x16213e, 0x16213e, 1);
    graphics.fillRect(0, 0, width, height);

    // 添加装饰边框（古典风格）
    const borderColor = 0x8b7355; // 古铜色
    const borderWidth = 8;

    // 外边框
    graphics.lineStyle(borderWidth, borderColor, 1);
    graphics.strokeRect(borderWidth / 2, borderWidth / 2, width - borderWidth, height - borderWidth);

    // 内边框（双线效果）
    graphics.lineStyle(2, 0xffcc00, 0.5);
    graphics.strokeRect(borderWidth + 8, borderWidth + 8, width - borderWidth * 2 - 16, height - borderWidth * 2 - 16);

    // 添加角落装饰
    this.addCornerDecor(graphics, width, height, borderColor);
  }

  /**
   * 添加角落装饰图案
   */
  private addCornerDecor(graphics: Phaser.GameObjects.Graphics, width: number, height: number, color: number): void {
    const size = 40;
    const offset = 20;

    graphics.lineStyle(3, color, 0.8);

    // 左上角
    graphics.beginPath();
    graphics.moveTo(offset, offset + size);
    graphics.lineTo(offset, offset);
    graphics.lineTo(offset + size, offset);
    graphics.strokePath();

    // 右上角
    graphics.beginPath();
    graphics.moveTo(width - offset - size, offset);
    graphics.lineTo(width - offset, offset);
    graphics.lineTo(width - offset, offset + size);
    graphics.strokePath();

    // 左下角
    graphics.beginPath();
    graphics.moveTo(offset, height - offset - size);
    graphics.lineTo(offset, height - offset);
    graphics.lineTo(offset + size, height - offset);
    graphics.strokePath();

    // 右下角
    graphics.beginPath();
    graphics.moveTo(width - offset - size, height - offset);
    graphics.lineTo(width - offset, height - offset);
    graphics.lineTo(width - offset, height - offset - size);
    graphics.strokePath();
  }

  /**
   * 创建游戏标题
   */
  private createTitle(width: number, height: number): void {
    // 主标题 - 伏魔记
    const titleText = this.add.text(width / 2, height * 0.2, '伏魔记', {
      fontFamily: 'Arial, "Microsoft YaHei", sans-serif',
      fontSize: '72px',
      fontStyle: 'bold',
      color: '#ffcc00',
      stroke: '#8b4513',
      strokeThickness: 8,
      shadow: {
        offsetX: 3,
        offsetY: 3,
        color: '#000',
        blur: 5,
        fill: true,
      },
    });
    titleText.setOrigin(0.5, 0.5);

    // 副标题 - 步步高经典RPG
    const subtitleText = this.add.text(width / 2, height * 0.28, '步步高经典RPG · 复刻版', {
      fontFamily: 'Arial, "Microsoft YaHei", sans-serif',
      fontSize: '24px',
      color: '#cd853f', // 秘鲁色
      fontStyle: 'italic',
    });
    subtitleText.setOrigin(0.5, 0.5);

    // 添加标题下划线装饰
    const lineGraphics = this.add.graphics();
    lineGraphics.fillStyle(0xffcc00, 0.8);
    lineGraphics.fillRect(width / 2 - 100, height * 0.32, 200, 3);
  }

  /**
   * 创建背景故事简介
   */
  private createStory(width: number, height: number): void {
    const storyText = `明朝中叶，凤阳府。
世代行医的叶家，突遭大劫。
家园化为灰烬，父母惨遭杀害。
十八岁的叶峰，抱着复仇的决心，
踏上了充满危险的江湖之路……`;

    const storyBox = this.add.text(width / 2, height * 0.42, storyText, {
      fontFamily: '"Microsoft YaHei", "SimSun", serif',
      fontSize: '16px',
      color: '#d4af37', // 金色
      align: 'center',
      lineSpacing: 8,
      padding: {
        x: 20,
        y: 15,
      },
    });

    storyBox.setOrigin(0.5, 0.5);

    // 添加半透明背景
    const storyBg = this.add.rectangle(
      width / 2,
      height * 0.42,
      storyBox.width + 40,
      storyBox.height + 30,
      0x000000,
      0.4
    );
    storyBg.setStrokeStyle(2, 0x8b7355, 0.5);

    // 将背景放到文字后面
    storyBg.setDepth(-1);
  }

  /**
   * 创建菜单系统
   */
  private createMenu(width: number, height: number): void {
    this.menuY = height * 0.65;
    const menuItemSpacing = 50;

    // 创建菜单选项
    this.MENU_ITEMS.forEach((item, index) => {
      const menuItem = this.add.text(width / 2, this.menuY + index * menuItemSpacing, item.text, {
        fontFamily: '"Microsoft YaHei", Arial, sans-serif',
        fontSize: '28px',
        color: index === 0 ? '#ffff00' : '#ffffff',
        fontStyle: index === 0 ? 'bold' : 'normal',
      });
      menuItem.setOrigin(0.5, 0.5);

      this.menuOptions.push(menuItem);
    });

    // 创建选择指示器（使用古典风格的箭头）
    this.cursorIndicator = this.add.text(width / 2 - 120, this.menuY, '◆', {
      fontSize: '24px',
      color: '#ffcc00',
    });
    this.cursorIndicator.setOrigin(0.5, 0.5);

    // 添加菜单背景框
    const menuBg = this.add.rectangle(
      width / 2,
      this.menuY + (this.MENU_ITEMS.length - 1) * menuItemSpacing / 2,
      250,
      this.MENU_ITEMS.length * menuItemSpacing + 30,
      0x000000,
      0.3
    );
    menuBg.setStrokeStyle(2, 0x8b7355, 0.4);
    menuBg.setDepth(-2);

    // 设置键盘控制
    this.setupKeyboardControls();
  }

  /**
   * 设置键盘控制
   */
  private setupKeyboardControls(): void {
    const cursors = this.input.keyboard!.createCursorKeys();

    // 上下键选择菜单
    cursors.up.on('down', () => {
      this.moveCursor(-1);
    });

    cursors.down.on('down', () => {
      this.moveCursor(1);
    });

    // Enter键确认
    this.input.keyboard!.on('keydown-ENTER', () => {
      this.selectMenuItem();
    });

    // WASD也支持
    const wKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    const sKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S);

    wKey.on('down', () => {
      this.moveCursor(-1);
    });

    sKey.on('down', () => {
      this.moveCursor(1);
    });
  }

  /**
   * 移动光标
   */
  private moveCursor(direction: number): void {
    const itemCount = this.MENU_ITEMS.length;

    // 更新光标位置
    this.cursor = (this.cursor + direction + itemCount) % itemCount;

    // 更新指示器位置
    this.cursorIndicator.setY(this.menuY + this.cursor * 50);

    // 更新菜单项颜色
    this.menuOptions.forEach((item, index) => {
      if (index === this.cursor) {
        item.setColor('#ffff00');
        item.setFontStyle('bold');
      } else {
        item.setColor('#ffffff');
        item.setFontStyle('normal');
      }
    });

    // 播放选择音效（可选）
    // this.sound.play('select');
  }

  /**
   * 选择菜单项
   */
  private selectMenuItem(): void {
    const menuItem = this.MENU_ITEMS[this.cursor];
    menuItem.action();

    // 播放确认音效（可选）
    // this.sound.play('confirm');
  }

  /**
   * 创建版权信息
   */
  private createCopyright(width: number, height: number): void {
    const copyrightText = '© 2024 伏魔记 Web 版 | 复刻自步步高电子词典经典游戏';

    const copyright = this.add.text(width / 2, height - 25, copyrightText, {
      fontFamily: 'Arial, "Microsoft YaHei", sans-serif',
      fontSize: '14px',
      color: '#666666',
    });
    copyright.setOrigin(0.5, 0.5);

    // 添加提示信息
    const hint = this.add.text(width / 2, height - 50, '使用 ↑↓ 或 W/S 选择菜单 · Enter 确认', {
      fontFamily: 'Arial, "Microsoft YaHei", sans-serif',
      fontSize: '14px',
      color: '#888888',
    });
    hint.setOrigin(0.5, 0.5);

    // 添加闪烁效果
    this.tweens.add({
      targets: hint,
      alpha: 0.4,
      duration: 1000,
      yoyo: true,
      repeat: -1,
    });
  }

  /**
   * 开始游戏
   */
  private startGame(): void {
    this.cameras.main.fade(500, 0, 0, 0);
    this.time.delayedCall(500, () => {
      this.scene.start(SCENE_KEYS.MAP);
    });
  }

  /**
   * 读取游戏进度
   */
  private loadGame(): void {
    // TODO: 实现存档读取系统
    this.showMessage('暂无存档', '请先开始游戏并保存进度');
  }

  /**
   * 退出游戏
   */
  private exitGame(): void {
    this.showMessage('再见！', '感谢游玩伏魔记');

    this.time.delayedCall(2000, () => {
      // 在浏览器中无法真正关闭窗口
      // 可以跳转到空白页面或显示感谢信息
      window.location.href = 'about:blank';
    });
  }

  /**
   * 显示消息提示
   */
  private showMessage(title: string, message?: string): void {
    const { width, height } = this.cameras.main;

    // 创建半透明背景
    const bg = this.add.rectangle(width / 2, height / 2, 400, 200, 0x000000, 0.9);
    bg.setStrokeStyle(3, 0x8b7355, 1);

    // 标题
    const titleText = this.add.text(width / 2, height / 2 - 30, title, {
      fontFamily: '"Microsoft YaHei", Arial, sans-serif',
      fontSize: '28px',
      color: '#ffcc00',
      fontStyle: 'bold',
    });
    titleText.setOrigin(0.5, 0.5);

    // 消息内容（如果有）
    let messageText: Phaser.GameObjects.Text | null = null;
    if (message) {
      messageText = this.add.text(width / 2, height / 2 + 20, message, {
        fontFamily: '"Microsoft YaHei", Arial, sans-serif',
        fontSize: '16px',
        color: '#ffffff',
        align: 'center',
      });
      messageText.setOrigin(0.5, 0.5);
    }

    // 提示信息
    const hint = this.add.text(width / 2, height / 2 + 70, '按任意键继续', {
      fontFamily: 'Arial, "Microsoft YaHei", sans-serif',
      fontSize: '14px',
      color: '#888888',
    });
    hint.setOrigin(0.5, 0.5);

    // 闪烁效果
    this.tweens.add({
      targets: hint,
      alpha: 0.4,
      duration: 800,
      yoyo: true,
      repeat: -1,
    });

    // 监听任意键关闭消息
    const closeMessage = () => {
      bg.destroy();
      titleText.destroy();
      messageText?.destroy();
      hint.destroy();
      this.input.keyboard!.off('keydown', closeMessage);
    };

    this.time.delayedCall(2000, closeMessage);
  }
}
