# 伏魔记 Web 版 -步步高经典RPG重制

> 使用 Phaser 3 + TypeScript + Vite 开发的步步高伏魔记 Web 版本

## 项目简介

这是对步步高电子词典经典RPG游戏"伏魔记"的Web版复刻。项目采用现代化的Web技术栈，旨在还原经典游戏的玩法和体验。

## 技术栈

- **游戏引擎**: Phaser 3.90
- **开发语言**: TypeScript 5.9
- **构建工具**: Vite 7.3
- **包管理**: npm

## 开发进度

### ✅ 已完成 (MVP Phase)

- [x] 项目基础架构搭建
- [x] 场景系统（BootScene, TitleScene, MapScene, BattleScene）
- [x] 角色系统（玩家、NPC、敌人）
- [x] 地图场景和角色移动
- [x] 对话系统
- [x] 基础战斗系统
- [x] TypeScript类型定义
- [x] 游戏数据结构

### 🚧 待完善功能

- [ ] 完整的战斗系统（魔法、物品）
- [ ] 角色升级系统
- [ ] 装备系统
- [ ] 多角色队伍系统
- [ ] 存档/读档功能
- [ ] 音效和音乐
- [ ] 完整剧情实现
- [ ] 更多地图和场景

## 快速开始

### 安装依赖

\`\`\`bash
npm install
\`\`\`

### 开发模式

\`\`\`bash
npm run dev
\`\`\`

访问 http://localhost:3000 查看游戏（如果端口被占用会自动切换到其他端口）。

### 构建

\`\`\`bash
npm run build
\`\`\`

### 类型检查

\`\`\`bash
npm run typecheck
\`\`\`

## 项目结构

\`\`\`
game_fmj/
├── assets/                 # 游戏资源
│   ├── images/            # 图片资源（精灵图、地图图块、UI）
│   ├── audio/             # 音效和音乐
│   └── data/              # 游戏数据JSON
│       ├── characters.json
│       ├── items.json
│       ├── magics.json
│       └── monsters.json
├── src/
│   ├── main.ts            # 入口文件
│   ├── config.ts          # 游戏配置
│   ├── scenes/            # 场景类
│   │   ├── BootScene.ts   # 资源加载
│   │   ├── TitleScene.ts  # 标题画面
│   │   ├── MapScene.ts    # 地图场景
│   │   └── BattleScene.ts # 战斗场景
│   ├── objects/           # 游戏对象
│   │   ├── Player.ts      # 玩家角色
│   │   ├── NPC.ts         # NPC
│   │   └── Enemy.ts       # 敌人
│   ├── systems/           # 游戏系统
│   │   ├── DialogueSystem.ts  # 对话系统
│   │   └── BattleSystem.ts    # 战斗系统
│   ├── types/             # TypeScript类型定义
│   └── utils/             # 工具和常量
├── docs/                  # 项目文档
│   ├── 步步高伏魔记剧情设定.pdf
│   └── 伏魔记Rust重制开发.pdf
└── index.html             # HTML入口
\`\`\`

## 游戏操作

### 键盘控制

- **方向键** 或 **WASD**: 移动角色
- **空格键**: 确认/对话/下一步
- **ESC**: 返回标题画面
- **Enter**: 在战斗场景选择菜单项

## 开发说明

### 代码规范

- 使用 TypeScript strict 模式
- 遵循项目现有的代码风格
- 所有公共方法需要添加注释
- 关键逻辑需要添加说明注释

### 提交规范

提交信息格式：\`type(scope): description\`

- \`feat\`: 新功能
- \`fix\`: 修复bug
- \`docs\`: 文档更新
- \`refactor\`: 代码重构
- \`style\`: 代码格式调整
- \`test\`: 测试相关
- \`chore\`: 构建/工具链相关

## 参考资源

- [Phaser 3 官方文档](https://photonstorm.github.io/phaser3-docs/)
- [Phaser 3 示例](https://phaser.io/examples)
- [参考项目 (Kotlin版)](https://gitee.com/bgwp/fmj.kt)
- [在线演示](https://bgwp.gitee.io/fm/)

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

## 致谢

- 原作：步步高电子词典《伏魔记》
- 参考项目：bgwp/fmj.kt
- 游戏引擎：Phaser 3
