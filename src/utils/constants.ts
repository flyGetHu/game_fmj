/**
 * 游戏常量定义
 */

import { CharacterStats, Player, MagicData, ItemData, MonsterData, EquipmentData } from '../types';

// 默认角色属性
export const DEFAULT_PLAYER_STATS: CharacterStats = {
  hp: 100,
  mp: 50,
  maxHp: 100,
  maxMp: 50,
  attack: 20,
  defense: 10,
  agility: 15,
  level: 1,
  exp: 0,
};

// 主角初始数据
export const INITIAL_PLAYER_DATA: Player = {
  id: 'player',
  name: '叶峰',
  sprite: 'player',
  stats: { ...DEFAULT_PLAYER_STATS },
  equipment: {},
  magics: ['fireball'], // 初始魔法：火球术
  items: {
    'potion_hp_small': 3, // 3个小补 HP 药
  },
};

// 魔法数据
export const MAGICS: Record<string, MagicData> = {
  fireball: {
    id: 'fireball',
    name: '火咒',
    type: 'attack',
    mpCost: 5,
    power: 30,
    description: '召唤火焰攻击敌人',
  },
  heal: {
    id: 'heal',
    name: '治疗术',
    type: 'heal',
    mpCost: 8,
    power: 50,
    description: '恢复生命值',
  },
  thunder: {
    id: 'thunder',
    name: '雷咒',
    type: 'attack',
    mpCost: 12,
    power: 50,
    description: '召唤雷电攻击敌人',
  },
};

// 物品数据
export const ITEMS: Record<string, ItemData> = {
  potion_hp_small: {
    id: 'potion_hp_small',
    name: '小补药',
    type: 'consumable',
    effect: { hp: 50 },
    price: 10,
    description: '恢复50点生命值',
  },
  potion_hp_large: {
    id: 'potion_hp_large',
    name: '大补药',
    type: 'consumable',
    effect: { hp: 200 },
    price: 50,
    description: '恢复200点生命值',
  },
  potion_mp_small: {
    id: 'potion_mp_small',
    name: '小补魔药',
    type: 'consumable',
    effect: { mp: 30 },
    price: 15,
    description: '恢复30点魔法值',
  },
};

// 装备数据
export const EQUIPMENT: Record<string, EquipmentData> = {
  sword_wood: {
    id: 'sword_wood',
    name: '木剑',
    type: 'weapon',
    attack: 5,
    price: 50,
  },
  sword_iron: {
    id: 'sword_iron',
    name: '铁剑',
    type: 'weapon',
    attack: 15,
    price: 200,
  },
  armor_cloth: {
    id: 'armor_cloth',
    name: '布衣',
    type: 'armor',
    defense: 3,
    price: 50,
  },
  armor_leather: {
    id: 'armor_leather',
    name: '皮甲',
    type: 'armor',
    defense: 8,
    price: 150,
  },
};

// 怪物数据
export const MONSTERS: Record<string, MonsterData> & { [key: string]: MonsterData } = {
  slime: {
    id: 'slime',
    name: '史莱姆',
    sprite: 'monster_slime',
    stats: {
      hp: 30,
      mp: 0,
      maxHp: 30,
      maxMp: 0,
      attack: 8,
      defense: 2,
      agility: 5,
      level: 1,
      exp: 0,
    },
    expReward: 10,
    goldReward: 5,
  },
  goblin: {
    id: 'goblin',
    name: '哥布林',
    sprite: 'monster_goblin',
    stats: {
      hp: 50,
      mp: 10,
      maxHp: 50,
      maxMp: 10,
      attack: 12,
      defense: 5,
      agility: 8,
      level: 2,
      exp: 0,
    },
    expReward: 20,
    goldReward: 10,
  },
  wolf: {
    id: 'wolf',
    name: '恶狼',
    sprite: 'monster_wolf',
    stats: {
      hp: 80,
      mp: 0,
      maxHp: 80,
      maxMp: 0,
      attack: 18,
      defense: 6,
      agility: 12,
      level: 3,
      exp: 0,
    },
    expReward: 35,
    goldReward: 15,
  },
};

// 等级经验表
export const LEVEL_EXP_TABLE: Record<number, number> = {
  1: 0,
  2: 100,
  3: 250,
  4: 500,
  5: 900,
  6: 1500,
  7: 2300,
  8: 3400,
  9: 4800,
  10: 6500,
};
