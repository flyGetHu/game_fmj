/**
 * 战斗系统 - 回合制战斗逻辑
 */

import Phaser from 'phaser';
import { Player, MonsterData } from '../types';
import { MONSTERS } from '../utils/constants';

export class BattleSystem extends Phaser.Events.EventEmitter {
  private scene: Phaser.Scene;
  private player: Player;
  private enemy: MonsterData;
  private turn: 'player' | 'enemy' = 'player';
  private playerHPText!: Phaser.GameObjects.Text;
  private enemyHPText!: Phaser.GameObjects.Text;
  private battleLog!: Phaser.GameObjects.Text;
  private menuOptions: Phaser.GameObjects.Text[] = [];
  private selectedMenuIndex: number = 0;
  private isProcessing: boolean = false;

  constructor(scene: Phaser.Scene, player: Player, enemyId: string) {
    super();
    this.scene = scene;
    this.player = player;
    // 确保enemy有效，使用默认史莱姆作为fallback
    const monster = MONSTERS[enemyId];
    this.enemy = monster!; // 非空断言，确保总是有效值

    // 创建战斗UI
    this.createBattleUI();
  }

  private createBattleUI(): void {
    const { width } = this.scene.cameras.main;
    const container = this.scene.add.container(0, 0);

    // 角色信息面板
    this.createPlayerInfo(container, 60, 420);
    this.createEnemyInfo(container, width - 260, 420);

    // 战斗菜单
    this.createBattleMenu(container, 60, 500);

    // 战斗日志
    this.createBattleLog(container, 300, 420);
  }

  private createPlayerInfo(container: Phaser.GameObjects.Container, x: number, y: number): void {
    // 背景
    const bg = this.scene.add.rectangle(x + 100, y + 50, 200, 100, 0x000000, 0.8);
    bg.setStrokeStyle(2, 0x4cc9f0);
    container.add(bg);

    // 名称
    container.add(
      this.scene.add.text(x + 10, y + 10, this.player.name, {
        font: 'bold 18px Arial',
        color: '#4cc9f0',
      })
    );

    // HP
    this.playerHPText = this.scene.add.text(
      x + 10,
      y + 40,
      `HP: ${this.player.stats.hp}/${this.player.stats.maxHp}`,
      {
        font: '16px Arial',
        color: '#ffffff',
      }
    );
    container.add(this.playerHPText);

    // MP
    container.add(
      this.scene.add.text(
        x + 10,
        y + 65,
        `MP: ${this.player.stats.mp}/${this.player.stats.maxMp}`,
        {
          font: '16px Arial',
          color: '#ffffff',
        }
      )
    );
  }

  private createEnemyInfo(container: Phaser.GameObjects.Container, x: number, y: number): void {
    // 背景
    const bg = this.scene.add.rectangle(x + 100, y + 50, 200, 100, 0x000000, 0.8);
    bg.setStrokeStyle(2, 0xf72585);
    container.add(bg);

    // 名称
    container.add(
      this.scene.add.text(x + 10, y + 10, this.enemy.name, {
        font: 'bold 18px Arial',
        color: '#f72585',
      })
    );

    // HP
    this.enemyHPText = this.scene.add.text(
      x + 10,
      y + 40,
      `HP: ${this.enemy.stats.hp}/${this.enemy.stats.maxHp}`,
      {
        font: '16px Arial',
        color: '#ffffff',
      }
    );
    container.add(this.enemyHPText);
  }

  private createBattleMenu(container: Phaser.GameObjects.Container, x: number, y: number): void {
    const options = ['攻击', '魔法', '物品', '逃跑'];

    options.forEach((option, index) => {
      const text = this.scene.add.text(x + (index % 2) * 100, y + Math.floor(index / 2) * 30, option, {
        font: '18px Arial',
        color: index === 0 ? '#ffff00' : '#ffffff',
      });
      text.setOrigin(0, 0);
      container.add(text);
      this.menuOptions.push(text);
    });

    // 指示器
    const indicator = this.scene.add.text(x - 20, y, '▶', {
      font: '20px Arial',
      color: '#ffff00',
    });
    container.add(indicator);

    // 键盘控制
    const cursors = this.scene.input.keyboard!.createCursorKeys();
    cursors.right.on('down', () => this.moveMenuSelection(1));
    cursors.left.on('down', () => this.moveMenuSelection(-1));
    cursors.down.on('down', () => this.moveMenuSelection(2));
    cursors.up.on('down', () => this.moveMenuSelection(-2));

    this.scene.input.keyboard!.on('keydown-ENTER', () => {
      if (this.turn === 'player' && !this.isProcessing) {
        this.executePlayerAction();
      }
    });
  }

  private createBattleLog(container: Phaser.GameObjects.Container, x: number, y: number): void {
    const bg = this.scene.add.rectangle(x + 240, y + 70, 480, 140, 0x000000, 0.8);
    bg.setStrokeStyle(2, 0x666666);
    container.add(bg);

    this.battleLog = this.scene.add.text(x + 10, y + 10, '', {
      font: '16px Arial',
      color: '#ffffff',
      wordWrap: { width: 460 },
      lineSpacing: 6,
    });
    container.add(this.battleLog);
  }

  private moveMenuSelection(direction: number): void {
    if (this.turn !== 'player' || this.isProcessing) return;

    this.menuOptions[this.selectedMenuIndex]?.setColor('#ffffff');
    this.selectedMenuIndex = (this.selectedMenuIndex + direction + 4) % 4;
    this.menuOptions[this.selectedMenuIndex]?.setColor('#ffff00');
  }

  public startBattle(): void {
    this.log(`遭遇了 ${this.enemy.name}！`);
    this.turn = 'player';
  }

  private executePlayerAction(): void {
    this.isProcessing = true;

    switch (this.selectedMenuIndex) {
      case 0: // 攻击
        this.playerAttack();
        break;
      case 1: // 魔法
        this.showMagicMenu();
        break;
      case 2: // 物品
        this.showItemMenu();
        break;
      case 3: // 逃跑
        this.tryEscape();
        break;
    }
  }

  private playerAttack(): void {
    const damage = Math.max(1, this.player.stats.attack - this.enemy.stats.defense);
    this.enemy.stats.hp -= damage;

    this.log(`你攻击了 ${this.enemy.name}，造成 ${damage} 点伤害！`);
    this.updateUI();

    if (this.enemy.stats.hp <= 0) {
      this.endBattle(true);
    } else {
      this.scene.time.delayedCall(1000, () => {
        this.enemyTurn();
      });
    }
  }

  private showMagicMenu(): void {
    // TODO: 显示魔法选择菜单
    this.log('魔法功能开发中...');
    this.isProcessing = false;
  }

  private showItemMenu(): void {
    // TODO: 显示物品选择菜单
    this.log('物品功能开发中...');
    this.isProcessing = false;
  }

  private tryEscape(): void {
    const escapeChance = 0.5;
    if (Math.random() < escapeChance) {
      this.log('逃跑成功！');
      this.scene.time.delayedCall(1000, () => {
        this.endBattle(false);
      });
    } else {
      this.log('逃跑失败！');
      this.scene.time.delayedCall(1000, () => {
        this.enemyTurn();
      });
    }
  }

  private enemyTurn(): void {
    this.turn = 'enemy';

    const damage = Math.max(1, this.enemy.stats.attack - this.player.stats.defense);
    this.player.stats.hp -= damage;

    this.log(`${this.enemy.name} 攻击了你，造成 ${damage} 点伤害！`);
    this.updateUI();

    if (this.player.stats.hp <= 0) {
      this.endBattle(false);
    } else {
      this.scene.time.delayedCall(1000, () => {
        this.turn = 'player';
        this.isProcessing = false;
      });
    }
  }

  private updateUI(): void {
    this.playerHPText.setText(`HP: ${this.player.stats.hp}/${this.player.stats.maxHp}`);
    this.enemyHPText.setText(`HP: ${this.enemy.stats.hp}/${this.enemy.stats.maxHp}`);
  }

  private log(message: string): void {
    this.battleLog.setText(message);
  }

  public endBattle(victory: boolean): void {
    if (victory) {
      this.log(`战斗胜利！获得 ${this.enemy.expReward} 经验值！`);
    } else {
      this.log('战斗失败...');
    }
    this.emit('battle-end', { victory });
  }

  public createUI(): void {
    // UI已在构造函数中创建
  }
}
