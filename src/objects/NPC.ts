/**
 * NPC类
 */

import Phaser from 'phaser';
import { NPCData } from '../types';

export class NPC extends Phaser.GameObjects.Container {
  private sprite: Phaser.GameObjects.Rectangle;
  private npcData: NPCData;

  constructor(scene: Phaser.Scene, data: NPCData) {
    super(scene, data.x, data.y);
    this.npcData = data;

    // 创建NPC精灵（使用矩形代替）
    const color = this.getNPCColor(data.id);
    this.sprite = scene.add.rectangle(0, 0, 24, 24, color);
    this.add(this.sprite);

    // 添加名称标签
    const nameLabel = scene.add.text(0, -20, data.name, {
      font: '12px Arial',
      color: '#ffffff',
      backgroundColor: '#000000',
    });
    nameLabel.setOrigin(0.5, 0.5);
    this.add(nameLabel);

    // 如果可交互，添加指示器
    if (data.interactable) {
      const indicator = scene.add.text(0, -35, '!', {
        font: 'bold 16px Arial',
        color: '#ffff00',
      });
      indicator.setOrigin(0.5, 0.5);
      this.add(indicator);
    }

    scene.add.existing(this);
  }

  private getNPCColor(id: string): number {
    // 为不同NPC返回不同颜色
    const colors: Record<string, number> = {
      npc_1: 0xff6b6b,
      npc_2: 0x4ecdc4,
      npc_3: 0x95e1d3,
    };
    return colors[id] ?? 0xffcc00;
  }

  public interact(): void {
    if (!this.npcData.interactable) return;

    // TODO: 触发对话系统
    console.log(`Interacting with ${this.npcData.name}`);
  }

  public getData(): NPCData {
    return this.npcData;
  }
}
