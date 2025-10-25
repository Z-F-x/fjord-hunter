export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  condition: (stats: GameStats) => boolean
  points: number
}

export interface GameStats {
  score: number
  fishCaught: number
  targetsHit: number
  collectiblesFound: number
  timePlayed: number
  topSpeed: number
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_catch",
    name: "Første Fangst",
    description: "Fang din første fisk",
    icon: "🐟",
    condition: (stats) => stats.fishCaught >= 1,
    points: 10,
  },
  {
    id: "master_fisher",
    name: "Mesterfisker",
    description: "Fang 25 fisk",
    icon: "🎣",
    condition: (stats) => stats.fishCaught >= 25,
    points: 50,
  },
  {
    id: "legendary_fisher",
    name: "Legendarisk Fisker",
    description: "Fang 100 fisk",
    icon: "👑",
    condition: (stats) => stats.fishCaught >= 100,
    points: 100,
  },
  {
    id: "first_shot",
    name: "Første Skudd",
    description: "Treff ditt første mål",
    icon: "🎯",
    condition: (stats) => stats.targetsHit >= 1,
    points: 10,
  },
  {
    id: "sharpshooter",
    name: "Skarpskytte",
    description: "Treff 20 mål",
    icon: "🏹",
    condition: (stats) => stats.targetsHit >= 20,
    points: 50,
  },
  {
    id: "sniper",
    name: "Sniper",
    description: "Treff 50 mål",
    icon: "💥",
    condition: (stats) => stats.targetsHit >= 50,
    points: 100,
  },
  {
    id: "collector",
    name: "Samler",
    description: "Samle 10 items",
    icon: "⭐",
    condition: (stats) => stats.collectiblesFound >= 10,
    points: 25,
  },
  {
    id: "treasure_hunter",
    name: "Skattejeger",
    description: "Samle 50 items",
    icon: "💎",
    condition: (stats) => stats.collectiblesFound >= 50,
    points: 75,
  },
  {
    id: "speed_demon",
    name: "Fartsdemon",
    description: "Nå 50 km/t",
    icon: "⚡",
    condition: (stats) => stats.topSpeed >= 50,
    points: 30,
  },
  {
    id: "century_club",
    name: "100-klubben",
    description: "Få 100 poeng",
    icon: "💯",
    condition: (stats) => stats.score >= 100,
    points: 20,
  },
  {
    id: "high_roller",
    name: "Storspiller",
    description: "Få 500 poeng",
    icon: "🔥",
    condition: (stats) => stats.score >= 500,
    points: 50,
  },
  {
    id: "legend",
    name: "Legende",
    description: "Få 1000 poeng",
    icon: "🏆",
    condition: (stats) => stats.score >= 1000,
    points: 100,
  },
  {
    id: "marathon",
    name: "Maratonløper",
    description: "Spill i 10 minutter",
    icon: "⏱️",
    condition: (stats) => stats.timePlayed >= 600,
    points: 40,
  },
  {
    id: "all_rounder",
    name: "Allrounder",
    description: "Fang 10 fisk, treff 10 mål, og samle 10 items",
    icon: "🌟",
    condition: (stats) => stats.fishCaught >= 10 && stats.targetsHit >= 10 && stats.collectiblesFound >= 10,
    points: 75,
  },
]

export function calculateLevel(score: number): number {
  return Math.floor(score / 100) + 1
}

export function getNextLevelScore(currentLevel: number): number {
  return currentLevel * 100
}

export function getLevelProgress(score: number): number {
  const currentLevelScore = (calculateLevel(score) - 1) * 100
  const nextLevelScore = calculateLevel(score) * 100
  return ((score - currentLevelScore) / (nextLevelScore - currentLevelScore)) * 100
}
