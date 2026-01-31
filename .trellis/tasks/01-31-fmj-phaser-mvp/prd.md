# 伏魔记 Phaser Web MVP 开发

## 目标

使用 Phaser 3 框架开发步步高伏魔记的 Web 版本 MVP，复刻经典电子词典游戏的核心体验。

## 背景

- **原游戏**: 步步高电子词典经典RPG游戏"伏魔记"
- **参考项目**: https://gitee.com/bgwp/fmj.kt (Kotlin H5版本)
- **技术文档**: `docs/伏魔记Rust重制开发.pdf` (包含完整技术设计)
- **剧情设定**: `docs/步步高伏魔记剧情设定.pdf` (包含完整游戏数据)

## 技术栈

- **游戏引擎**: Phaser 3
- **开发语言**: TypeScript
- **构建工具**: Vite
- **包管理**: npm/yarn

## MVP 功能范围

### 1. 场景系统 ✓
- [ ] BootScene - 资源加载初始化
- [ ] TitleScene - 标题画面（开始游戏、加载游戏）
- [ ] MapScene - 地图场景（角色移动、对话、碰撞检测）
- [ ] BattleScene - 战斗场景（回合制战斗）

### 2. 角色系统 ✓
- [ ] 主角叶峰（4方向行走精灵）
- [ ] 角色属性：HP、MP、攻击、防御、敏捷、等级
- [ ] 角色状态管理
- [ ] 简单的NPC（支持对话）

### 3. 地图系统 ✓
- [ ] Tilemap 地图加载和渲染
- [ ] 角色移动控制（键盘方向键/WASD）
- [ ] 碰撞检测（墙壁、障碍物）
- [ ] 地图切换（场景转换）
- [ ] 至少2个场景：村庄、室内

### 4. 对话系统 ✓
- [ ] 文本对话框UI
- [ ] 打字机效果文本显示
- [ ] 点击/按键继续对话
- [ ] 对话历史记录（可选）

### 5. 战斗系统 ✓
- [ ] 回合制战斗逻辑
- [ ] 战斗UI（角色信息、敌人信息、指令菜单）
- [ ] 普通攻击
- [ ] 至少1个魔法技能（例如：火咒）
- [ ] 简单敌人AI（随机攻击）
- [ ] 胜利/失败判定

### 6. 数据管理 ✓
- [ ] 角色数据结构
- [ ] 装备数据（武器、防具）
- [ ] 物品/药品数据
- [ ] 魔法数据
- [ ] 怪物数据

## 验收标准

- [ ] 能够在浏览器中正常运行游戏
- [ ] 角色可以在地图上流畅移动
- [ ] 能够触发和显示对话
- [ ] 能够进入战斗并完成战斗
- [ ] 代码结构清晰，易于扩展
- [ ] TypeScript 类型检查通过
- [ ] 项目打包后体积合理

## 技术约束

1. **性能要求**:
   - 60 FPS 流畅运行
   - 快速加载（首屏 < 3秒）

2. **兼容性**:
   - Chrome/Edge 最新版本
   - Firefox 最新版本
   - Safari 最新版本
   - 移动端浏览器（可选）

3. **代码质量**:
   - TypeScript strict 模式
   - ESLint 检查通过
   - 代码注释完整

## 项目结构

```
game_fmj/
├── assets/                 # 资源文件
│   ├── images/            # 图片资源
│   │   ├── characters/    # 角色精灵图
│   │   ├── tilesets/      # 地图图块
│   │   └── ui/            # UI元素
│   ├── audio/             # 音效和音乐（MVP可选）
│   └── data/              # 游戏数据JSON
│       ├── characters.json
│       ├── items.json
│       ├── magics.json
│       └── monsters.json
├── src/
│   ├── main.ts            # 入口文件
│   ├── config.ts          # 游戏配置
│   ├── scenes/            # 场景类
│   │   ├── BootScene.ts
│   │   ├── TitleScene.ts
│   │   ├── MapScene.ts
│   │   └── BattleScene.ts
│   ├── objects/           # 游戏对象
│   │   ├── Player.ts
│   │   ├── NPC.ts
│   │   └── Enemy.ts
│   ├── systems/           # 游戏系统
│   │   ├── DialogueSystem.ts
│   │   ├── BattleSystem.ts
│   │   └── DataManager.ts
│   ├── ui/                # UI组件
│   │   ├── DialogueBox.ts
│   │   └── BattleUI.ts
│   ├── types/             # TypeScript类型定义
│   │   └── index.ts
│   └── utils/             # 工具函数
│       └── constants.ts
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 开发阶段

### Phase 1: 项目初始化
- 初始化项目结构
- 配置 Phaser 3 + TypeScript + Vite
- 创建基础场景框架

### Phase 2: 核心场景
- 实现地图场景和角色移动
- 实现对话系统
- 添加碰撞检测

### Phase 3: 战斗系统
- 实现战斗场景
- 实现回合制战斗逻辑
- 添加战斗UI

### Phase 4: 数据和内容
- 创建示例数据（角色、装备、魔法、怪物）
- 创建示例地图
- 整合所有系统

### Phase 5: 优化和完善
- 性能优化
- bug修复
- 代码重构

## 参考资料

1. **Phaser 3 官方文档**: https://photonstorm.github.io/phaser3-docs/
2. **Phaser 3 示例**: https://phaser.io/examples
3. **参考项目**: https://gitee.com/bgwp/fmj.kt
4. **技术设计文档**: `docs/伏魔记Rust重制开发.pdf`
5. **游戏数据**: `docs/步步高伏魔记剧情设定.pdf`
