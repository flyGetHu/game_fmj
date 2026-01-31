/**
 * 启动场景 - 负责加载游戏资源
 */

import Phaser from 'phaser';
import { SCENE_KEYS } from '../config';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.BOOT });
  }

  preload(): void {
    // 创建加载进度条
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: '加载中...',
      style: {
        font: '20px monospace',
        color: '#ffffff',
      },
    });
    loadingText.setOrigin(0.5, 0.5);

    const percentText = this.make.text({
      x: width / 2,
      y: height / 2 - 5,
      text: '0%',
      style: {
        font: '18px monospace',
        color: '#ffffff',
      },
    });
    percentText.setOrigin(0.5, 0.5);

    this.load.on('progress', (value: number) => {
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
      percentText.setText(`${Math.floor(value * 100)}%`);
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
    });

    // 加载游戏资源
    this.loadAssets();
  }

  create(): void {
    // 资源加载完成，启动标题场景
    this.scene.start(SCENE_KEYS.TITLE);
  }

  private loadAssets(): void {
    // TODO: 加载实际的游戏资源
    // 这里暂时使用占位符，后续需要替换为真实的精灵图和地图

    // 加载角色精灵图
    // this.load.image('player', 'assets/images/characters/player.png');
    // this.load.spritesheet('player_walk', 'assets/images/characters/player_walk.png', {
    //   frameWidth: 32,
    //   frameHeight: 32,
    // });

    // 加载地图图块
    // this.load.image('tiles', 'assets/images/tilesets/tiles.png');
    // this.load.tilemapTiledJSON('map_village', 'assets/maps/village.json');

    // 加载UI资源
    // this.load.image('dialogue_box', 'assets/images/ui/dialogue_box.png');

    // 加载数据文件
    this.load.json('characters', 'assets/data/characters.json');
    this.load.json('items', 'assets/data/items.json');
    this.load.json('magics', 'assets/data/magics.json');
    this.load.json('monsters', 'assets/data/monsters.json');
  }
}
