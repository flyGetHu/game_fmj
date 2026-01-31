# Phaser 3 Game Development Guidelines

> Best practices for developing games with Phaser 3 in this project.

---

## Overview

This document covers conventions and patterns for Phaser 3 game development based on the 伏魔记 (FMJ) project.

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Scene Organization](#scene-organization)
3. [Game Objects](#game-objects)
4. [Event System](#event-system)
5. [Type Safety](#type-safety)
6. [Common Mistakes](#common-mistakes)
7. [Performance Tips](#performance-tips)

---

## Project Structure

### Recommended Directory Layout

```
src/
├── main.ts              # Entry point, game instance creation
├── config.ts            # Game configuration constants
├── scenes/              # All scene classes
│   ├── BootScene.ts     # Resource loading
│   ├── TitleScene.ts    # Title/menu screen
│   ├── MapScene.ts      # Main gameplay
│   └── BattleScene.ts   # Battle system
├── objects/             # Game object classes
│   ├── Player.ts
│   ├── NPC.ts
│   └── Enemy.ts
├── systems/             # Game logic systems
│   ├── DialogueSystem.ts
│   └── BattleSystem.ts
├── ui/                  # UI components
├── types/               # TypeScript definitions
│   └── index.ts
└── utils/               # Utilities and constants
    └── constants.ts
```

**Why**: Clear separation of concerns makes the codebase maintainable as the game grows.

---

## Scene Organization

### Scene Keys Pattern

**DO**: Define scene keys as constants in `config.ts`:

```typescript
// config.ts
export const SCENE_KEYS = {
  BOOT: 'BootScene',
  TITLE: 'TitleScene',
  MAP: 'MapScene',
  BATTLE: 'BattleScene',
} as const;

// main.ts
const game = new Phaser.Game({
  ...GAME_CONFIG,
  scene: [BootScene, TitleScene, MapScene, BattleScene],
});
```

**DON'T**: Hardcode string keys throughout the code.

### Scene Transitions

**DO**: Use fade effects for smooth transitions:

```typescript
// Fade out, then switch scene
this.cameras.main.fade(500, 0, 0, 0);
this.time.delayedCall(500, () => {
  this.scene.start(SCENE_KEYS.TITLE);
});

// Or use built-in method
this.cameras.main.once('camerafadeoutcomplete', () => {
  this.scene.start(SCENE_KEYS.TITLE);
});
this.cameras.main.fade(500, 0, 0, 0);
```

### Scene Communication

**DO**: Pass data through scene parameters:

```typescript
// Launch scene with data
this.scene.launch(SCENE_KEYS.BATTLE, { enemyId: 'slime' });

// Receive data in target scene
init(data: { enemyId: string }): void {
  const enemyId = data.enemyId ?? 'slime';
  // ...
}
```

---

## Game Objects

### Extending Container

**DO**: Extend `Phaser.GameObjects.Container` for complex objects:

```typescript
export class Player extends Phaser.GameObjects.Container {
  private sprite: Phaser.GameObjects.Rectangle;
  private playerData: PlayerData;

  constructor(scene: Phaser.Scene, x: number, y: number, data: PlayerData) {
    super(scene, x, y);
    this.playerData = data;

    // Add child objects
    this.sprite = scene.add.rectangle(0, 0, 24, 24, 0x4cc9f0);
    this.add(this.sprite);

    scene.add.existing(this);
  }
}
```

**Why**: Containers allow grouping multiple game objects and managing them as a unit.

### Physics Setup

**DO**: Add physics to containers properly:

```typescript
constructor(scene: Phaser.Scene, x: number, y: number, data: PlayerData) {
  super(scene, x, y);

  // Create sprite
  this.sprite = scene.add.rectangle(0, 0, 24, 24, 0x4cc9f0);
  this.add(this.sprite);

  // Add physics body to container
  scene.physics.add.existing(this, false);
  const physicsBody = this.body as Phaser.Physics.Arcade.Body;
  physicsBody.setSize(24, 24);
  physicsBody.setCollideWorldBounds(true);

  scene.add.existing(this);
}
```

**Common Mistake**: Forgetting to call `scene.add.existing(this)` after adding physics.

### Property Naming Conflict

**DON'T**: Use `data` as a property name in game objects:

```typescript
// ❌ DON'T - Conflicts with Phaser's built-in data property
export class Player extends Phaser.GameObjects.Container {
  private data: PlayerData;  // Conflict!
}
```

**DO**: Use descriptive names:

```typescript
// ✅ DO - Clear naming
export class Player extends Phaser.GameObjects.Container {
  private playerData: PlayerData;  // No conflict
  private monsterData: MonsterData;
  private npcData: NPCData;
}
```

**Why**: Phaser.GameObjects.GameObject already has a `data` property (DataManager type), causing type conflicts.

---

## Event System

### Use Phaser's EventEmitter

**CRITICAL**: Don't use Node.js `events` module in browser games.

```typescript
// ❌ DON'T - Won't work in browser
import { EventEmitter } from 'events';

export class DialogueSystem extends EventEmitter {
  // ...
}
```

**DO**: Use Phaser's EventEmitter:

```typescript
// ✅ DO - Browser compatible
import Phaser from 'phaser';

export class DialogueSystem extends Phaser.Events.EventEmitter {
  // ...

  public show(dialogues: DialogueData[]): void {
    this.emit('dialogue-start');  // Works in browser
  }
}
```

**Error you'll see**:
```
Uncaught Error: Module "events" has been externalized for browser compatibility.
Cannot access "events.EventEmitter" in client code.
```

### Event Naming Convention

**DO**: Use kebab-case for event names:

```typescript
this.emit('dialogue-start');
this.emit('dialogue-end');
this.emit('battle-end', { victory: true });
```

**DO**: Define event names as constants if used frequently:

```typescript
export const DIALOGUE_EVENTS = {
  START: 'dialogue-start',
  END: 'dialogue-end',
  ADVANCE: 'dialogue-advance',
} as const;
```

---

## Type Safety

### Avoid `any` Type

**DO**: Define proper types for game data:

```typescript
// types/index.ts
export interface CharacterStats {
  hp: number;
  mp: number;
  maxHp: number;
  maxMp: number;
  attack: number;
  defense: number;
  agility: number;
  level: number;
  exp: number;
}

export interface CharacterData {
  id: string;
  name: string;
  sprite: string;
  stats: CharacterStats;
}
```

**DO**: Use these types in game objects:

```typescript
export class Player extends Phaser.GameObjects.Container {
  private playerData: Player;  // Strong typing

  public getData(): Player {
    return this.playerData;
  }

  public updateStats(newStats: Partial<Player['stats']>): void {
    this.playerData.stats = { ...this.playerData.stats, ...newStats };
  }
}
```

### Type Assertions

**DO**: Use non-null assertion operator carefully:

```typescript
const monster = MONSTERS[enemyId] as MonsterData | undefined;
this.enemy = monster!;  // Non-null assertion
```

**DO**: Use nullish coalescing for fallbacks:

```typescript
const enemyId = data.enemyId ?? 'slime';  // Better than ||
const monster = MONSTERS[enemyId] || MONSTERS.slime;
```

**Why**: `??` only treats `null` and `undefined` as nullish, while `||` treats all falsy values (0, '', false) as nullish.

---

## Common Mistakes

### 1. Graphics API Changes

**Symptom**: `TypeError: graphics.drawLine is not a function`

**Cause**: Phaser 3 changed the Graphics API in newer versions.

**Fix**:
```typescript
// ❌ Old API
graphics.drawLine(x1, y1, x2, y2);

// ✅ New API
graphics.strokeRect(x, y, width, height);
// or
graphics.lineBetween(x1, y1, x2, y2);
```

### 2. Missing Scene Parameters

**Symptom**: `Cannot read property 'enemyId' of undefined`

**Fix**: Always provide default values:
```typescript
init(data: { enemyId: string }): void {
  const enemyId = data.enemyId ?? 'slime';  // Fallback
}
```

### 3. Array Access Without Checking

**Symptom**: `Cannot read property 'setName' of undefined`

**Fix**: Use optional chaining:
```typescript
this.menuOptions[this.selectedMenuIndex]?.setColor('#ffffff');
```

### 4. Forgetting to Destroy Timers

**Symptom**: Memory leaks, timers continuing after scene shutdown

**Fix**: Always clean up timers:
```typescript
private typingTimer?: Phaser.Time.TimerEvent;

private typeText(text: string): void {
  if (this.typingTimer) {
    this.typingTimer.destroy();
  }

  this.typingTimer = this.scene.time.addEvent({
    delay: 30,
    callback: () => { /* ... */ },
    loop: true,
  });
}

// Don't forget to clean up in scene shutdown
destroy(): void {
  this.typingTimer?.destroy();
  super.destroy();
}
```

---

## Performance Tips

### Object Pooling

For frequently created/destroyed objects (like projectiles, particles):

```typescript
class BulletPool {
  private pool: Phaser.GameObjects.Sprite[] = [];

  get(x: number, y: number): Phaser.GameObjects.Sprite {
    const bullet = this.pool.pop() || this.scene.add.sprite(x, y, 'bullet');
    bullet.setPosition(x, y);
    bullet.setActive(true);
    bullet.setVisible(true);
    return bullet;
  }

  release(bullet: Phaser.GameObjects.Sprite): void {
    bullet.setActive(false);
    bullet.setVisible(false);
    this.pool.push(bullet);
  }
}
```

### Tilemap Optimization

**DO**: Use tilemap layers for collision:

```typescript
// Instead of checking every tile
const tiles = map.createFromTiles(tileIndex, -1, 'objects');

// Use physics layers
const layer = map.createLayer('Collision', tileset);
layer.setCollisionByProperty({ collides: true });
this.physics.add.collider(player, layer);
```

### Sprite Sheets

**DO**: Use sprite sheets instead of individual images:

```typescript
// Load sprite sheet
this.load.spritesheet('player', 'assets/player.png', {
  frameWidth: 32,
  frameHeight: 32,
});

// Create animations
this.anims.create({
  key: 'walk',
  frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
  frameRate: 10,
  repeat: -1,
});
```

---

## Vite + Phaser Configuration

### Vite Config

**DO**: Configure path aliases and optimize builds:

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
```

### TypeScript Config

**DO**:
- Enable strict mode
- Use ESNext target
- Enable path mapping

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "strict": true,
    "moduleResolution": "bundler",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

---

## Debugging Tips

### Enable Physics Debug

```typescript
// In scene create()
this.physics.world.createDebugGraphic();

// Toggle debug with key
this.input.keyboard!.on('keydown-DEBUG', () => {
  this.physics.world.drawDebug = !this.physics.world.drawDebug;
  this.physics.world.debugGraphic.clear();
});
```

### Scene Inspector

In browser console:
```javascript
// Access game instance
window.game;

// Get current scene
game.scene.getScene('MapScene');

// Access scene objects
const scene = game.scene.getScene('MapScene');
console.log(scene.children);  // All game objects
```

---

## Summary Checklist

Before committing Phaser code:

- [ ] Scene keys defined as constants
- [ ] Game objects use Container properly
- [ ] Physics bodies configured correctly
- [ ] Events use Phaser's EventEmitter
- [ ] Types defined for all game data
- [ ] Optional chaining for array access
- [ ] Timers cleaned up on destroy
- [ ] No `any` types without justification
- [ ] No use of Node.js-only modules
- [ ] Fade effects for scene transitions
