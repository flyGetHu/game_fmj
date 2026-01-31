/**
 * 游戏类型定义
 */

// 角色属性
export interface CharacterStats {
  hp: number;          // 生命值
  mp: number;          // 魔法值
  maxHp: number;       // 最大生命值
  maxMp: number;       // 最大魔法值
  attack: number;      // 攻击力
  defense: number;     // 防御力
  agility: number;     // 敏捷
  level: number;       // 等级
  exp: number;         // 经验值
}

// 角色数据
export interface CharacterData {
  id: string;
  name: string;
  sprite: string;      // 精灵图key
  stats: CharacterStats;
}

// 玩家角色
export interface Player extends CharacterData {
  equipment: {
    weapon?: string;
    armor?: string;
    accessory?: string;
  };
  magics: string[];    // 已学习的魔法ID列表
  items: Record<string, number>; // 物品ID -> 数量
}

// 装备数据
export interface EquipmentData {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'accessory';
  attack?: number;
  defense?: number;
  price: number;
}

// 物品数据
export interface ItemData {
  id: string;
  name: string;
  type: 'consumable' | 'key' | 'misc';
  effect: {
    hp?: number;
    mp?: number;
  };
  price: number;
  description: string;
}

// 魔法数据
export interface MagicData {
  id: string;
  name: string;
  type: 'attack' | 'heal' | 'support';
  mpCost: number;
  power: number;
  description: string;
}

// 怪物数据
export interface MonsterData {
  id: string;
  name: string;
  sprite: string;
  stats: CharacterStats;
  expReward: number;
  goldReward: number;
}

// 战斗行动
export interface BattleAction {
  actor: 'player' | 'enemy';
  type: 'attack' | 'magic' | 'item' | 'run';
  target?: 'player' | 'enemy';
  magicId?: string;
  itemId?: string;
}

// 战斗结果
export interface BattleResult {
  victory: boolean;
  expGained: number;
  goldGained: number;
}

// 对话数据
export interface DialogueData {
  speaker?: string;
  text: string;
  portrait?: string;
  onComplete?: () => void;
}

// NPC数据
export interface NPCData {
  id: string;
  name: string;
  sprite: string;
  x: number;
  y: number;
  dialogues: DialogueData[];
  interactable: boolean;
}
