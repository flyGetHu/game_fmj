/**
 * 敌人类
 */

import Phaser from 'phaser';
import { MonsterData } from '../types';

export class Enemy extends Phaser.GameObjects.Container {
  private sprite: Phaser.GameObjects.Rectangle;
  private monsterData: MonsterData;

  constructor(scene: Phaser.Scene, x: number, y: number, data: MonsterData) {
    super(scene, x, y);
    this.monsterData = data;

    // 创建敌人精灵（使用矩形代替）
    this.sprite = scene.add.rectangle(0, 0, 32, 32, 0xf72585);
    this.add(this.sprite);

    // 添加名称标签
    const nameLabel = scene.add.text(0, -25, data.name, {
      font: '14px Arial',
      color: '#ffffff',
      backgroundColor: '#000000',
    });
    nameLabel.setOrigin(0.5, 0.5);
    this.add(nameLabel);

    // 添加HP条
    this.createHPBar(scene);

    scene.add.existing(this);
  }

  private createHPBar(scene: Phaser.Scene): void {
    const barWidth = 40;
    const barHeight = 4;
    const barY = 15;

    // 背景
    const bgBar = scene.add.rectangle(0, barY, barWidth, barHeight, 0x333333);
    this.add(bgBar);

    // HP条
    const hpPercent = this.monsterData.stats.hp / this.monsterData.stats.maxHp;
    const hpBar = scene.add.rectangle(
      -barWidth / 2 + (barWidth * hpPercent) / 2,
      barY,
      barWidth * hpPercent,
      barHeight,
      0xff0000
    );
    this.add(hpBar);
  }

  public getData(): MonsterData {
    return this.monsterData;
  }

  public takeDamage(damage: number): void {
    this.monsterData.stats.hp -= damage;
    if (this.monsterData.stats.hp < 0) {
      this.monsterData.stats.hp = 0;
    }
  }

  public isDead(): boolean {
    return this.monsterData.stats.hp <= 0;
  }
}
