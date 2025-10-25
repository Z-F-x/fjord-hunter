import { create } from "zustand"
import { ACHIEVEMENTS, type Achievement } from "@/lib/achievements"
import type { GameStats } from "@/lib/achievements"

interface GameState {
  score: number
  boatPosition: { x: number; y: number; z: number }
  boatRotation: { x: number; y: number; z: number; w: number }
  boatSpeed: number
  isFishing: boolean
  isShooting: boolean
  isUnderwater: boolean
  mobileControls: {
    forward: boolean
    backward: boolean
    left: boolean
    right: boolean
  }
  stats: GameStats
  unlockedAchievements: string[]
  lastUnlockedAchievement: Achievement | null
  setScore: (score: number) => void
  addScore: (points: number) => void
  setBoatPosition: (position: { x: number; y: number; z: number }) => void
  setBoatRotation: (rotation: { x: number; y: number; z: number; w: number }) => void
  setBoatSpeed: (speed: number) => void
  setIsFishing: (fishing: boolean) => void
  setIsShooting: (shooting: boolean) => void
  setIsUnderwater: (underwater: boolean) => void
  setMobileControls: (control: string, active: boolean) => void
  incrementFishCaught: () => void
  incrementTargetsHit: () => void
  incrementCollectiblesFound: () => void
  checkAchievements: () => void
  resetGame: () => void
}

export const useGameStore = create<GameState>((set, get) => ({
  score: 0,
  boatPosition: { x: 0, y: 0, z: 0 },
  boatRotation: { x: 0, y: 0, z: 0, w: 1 },
  boatSpeed: 0,
  isFishing: false,
  isShooting: false,
  isUnderwater: false,
  mobileControls: {
    forward: false,
    backward: false,
    left: false,
    right: false,
  },
  stats: {
    score: 0,
    fishCaught: 0,
    targetsHit: 0,
    collectiblesFound: 0,
    timePlayed: 0,
    topSpeed: 0,
  },
  unlockedAchievements: [],
  lastUnlockedAchievement: null,
  setScore: (score) => {
    set({ score })
    set((state) => ({ stats: { ...state.stats, score } }))
    get().checkAchievements()
  },
  addScore: (points) => {
    const newScore = get().score + points
    set({ score: newScore })
    set((state) => ({ stats: { ...state.stats, score: newScore } }))
    get().checkAchievements()
  },
  setBoatPosition: (position) => set({ boatPosition: position }),
  setBoatRotation: (rotation) => set({ boatRotation: rotation }),
  setBoatSpeed: (speed) => {
    set({ boatSpeed: speed })
    const currentTopSpeed = get().stats.topSpeed
    const speedKmh = speed * 3.6
    if (speedKmh > currentTopSpeed) {
      set((state) => ({ stats: { ...state.stats, topSpeed: speedKmh } }))
      get().checkAchievements()
    }
  },
  setIsFishing: (fishing) => set({ isFishing: fishing }),
  setIsShooting: (shooting) => set({ isShooting: shooting }),
  setIsUnderwater: (underwater) => set({ isUnderwater: underwater }),
  setMobileControls: (control, active) => {
    set((state) => ({
      mobileControls: {
        ...state.mobileControls,
        [control]: active,
      },
    }))
  },
  incrementFishCaught: () => {
    set((state) => ({ stats: { ...state.stats, fishCaught: state.stats.fishCaught + 1 } }))
    get().checkAchievements()
  },
  incrementTargetsHit: () => {
    set((state) => ({ stats: { ...state.stats, targetsHit: state.stats.targetsHit + 1 } }))
    get().checkAchievements()
  },
  incrementCollectiblesFound: () => {
    set((state) => ({ stats: { ...state.stats, collectiblesFound: state.stats.collectiblesFound + 1 } }))
    get().checkAchievements()
  },
  checkAchievements: () => {
    const state = get()
    const stats = state.stats

    ACHIEVEMENTS.forEach((achievement) => {
      if (!state.unlockedAchievements.includes(achievement.id) && achievement.condition(stats)) {
        set((state) => ({
          unlockedAchievements: [...state.unlockedAchievements, achievement.id],
          lastUnlockedAchievement: achievement,
        }))
      }
    })
  },
  resetGame: () =>
    set({
      score: 0,
      stats: { score: 0, fishCaught: 0, targetsHit: 0, collectiblesFound: 0, timePlayed: 0, topSpeed: 0 },
      unlockedAchievements: [],
      lastUnlockedAchievement: null,
    }),
}))
