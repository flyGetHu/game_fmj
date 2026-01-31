/**
 * 玩家角色类
 */

import Phaser from 'phaser';
import { GAME_CONSTANTS } from '../config';
import { Player as PlayerData } from '../types';

export class Player extends Phaser.GameObjects.Container {
  public body!: Phaser.Physics.Arcade.Body;
  private sprite!: Phaser.GameObjects.Rectangle;
  private playerData: PlayerData;

  constructor(scene: Phaser.Scene, x: number, y: number, data: PlayerData) {
    super(scene, x, y);
    this.playerData = data;

    // 创建简单的角色精灵（使用矩形代替）
    this.sprite = scene.add.rectangle(0, 0, 24, 24, 0x4cc9f0);
    this.add(this.sprite);

    // 设置物理属性
    scene.physics.add.existing(this, false);
    const physicsBody = this.body as Phaser.Physics.Arcade.Body;
    physicsBody.setSize(24, 24);
    physicsBody.setCollideWorldBounds(true);

    scene.add.existing(this);
  }

  public update(
    cursors: Phaser.Types.Input.Keyboard.CursorKeys,
    wasd: { W: Phaser.Input.Keyboard.Key; A: Phaser.Input.Keyboard.Key; S: Phaser.Input.Keyboard.Key; D: Phaser.Input.Keyboard.Key }
  ): void {
    const velocity = GAME_CONSTANTS.PLAYER_SPEED;

    this.body.setVelocity(0);

    // 水平移动
    if (cursors.left.isDown || wasd.A.isDown) {
      this.body.setVelocityX(-velocity);
    } else if (cursors.right.isDown || wasd.D.isDown) {
      this.body.setVelocityX(velocity);
    }

    // 垂直移动
    if (cursors.up.isDown || wasd.W.isDown) {
      this.body.setVelocityY(-velocity);
    } else if (cursors.down.isDown || wasd.S.isDown) {
      this.body.setVelocityY(velocity);
    }

    // 归一化对角线移动速度
    if (this.body.velocity.x !== 0 && this.body.velocity.y !== 0) {
      this.body.setVelocity(
        this.body.velocity.x * 0.707,
        this.body.velocity.y * 0.707
      );
    }
  }

  public getData(): PlayerData {
    return this.playerData;
  }

  public updateStats(newStats: Partial<PlayerData['stats']>): void {
    this.playerData.stats = { ...this.playerData.stats, ...newStats };
  }
}
