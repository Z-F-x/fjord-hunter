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
  combo: number
  multiplier: number
  lastActionTime: number
  explosions: Array<{ id: string; position: [number, number, number]; type: "hit" | "collect" }>
  sparkles: Array<{ id: string; position: [number, number, number] }>
  floatingTexts: Array<{ id: string; text: string; position: [number, number, number]; color: string }>
  // Player data
  playerName: string
  difficulty: string
  // Audio system
  currentTrack: string | null
  isAudioPlaying: boolean
  audioVolume: number
  initializeAudio: () => void
  playNextTrack: () => void
  toggleAudio: () => void
  setAudioVolume: (volume: number) => void
  setPlayerName: (name: string) => void
  setDifficulty: (difficulty: string) => void
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
  addExplosion: (position: [number, number, number], type: "hit" | "collect") => void
  removeExplosion: (id: string) => void
  addSparkle: (position: [number, number, number]) => void
  removeSparkle: (id: string) => void
  addFloatingText: (text: string, position: [number, number, number], color: string) => void
  removeFloatingText: (id: string) => void
  incrementCombo: () => void
  resetCombo: () => void
}

// Audio system constants
const MUSIC_TRACKS = [
  '/Color_Index_-_Intervals_Open_Spect_(getmp3.pro).mp3',
  '/TempleOS Hymn Risen [Synthwave Remix] [TubeRipper.com].mp3'
]

let currentAudio: HTMLAudioElement | null = null

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
  combo: 0,
  multiplier: 1,
  lastActionTime: 0,
  explosions: [],
  sparkles: [],
  floatingTexts: [],
  // Player data
  playerName: '',
  difficulty: 'normal',
  // Audio system
  currentTrack: null,
  isAudioPlaying: false,
  audioVolume: 0.3,
  setScore: (score) => {
    set({ score })
    set((state) => ({ stats: { ...state.stats, score } }))
    get().checkAchievements()
  },
  addScore: (points) => {
    const state = get()
    const multipliedPoints = Math.floor(points * state.multiplier)
    const newScore = state.score + multipliedPoints
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
    get().incrementCombo()
    get().checkAchievements()
  },
  incrementTargetsHit: () => {
    set((state) => ({ stats: { ...state.stats, targetsHit: state.stats.targetsHit + 1 } }))
    get().incrementCombo()
    get().checkAchievements()
  },
  incrementCollectiblesFound: () => {
    set((state) => ({ stats: { ...state.stats, collectiblesFound: state.stats.collectiblesFound + 1 } }))
    get().incrementCombo()
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
      combo: 0,
      multiplier: 1,
      lastActionTime: 0,
      explosions: [],
      sparkles: [],
      floatingTexts: [],
    }),
  addExplosion: (position, type) => {
    const id = `explosion-${Date.now()}-${Math.random()}`
    set((state) => ({ explosions: [...state.explosions, { id, position, type }] }))
  },
  removeExplosion: (id) => {
    set((state) => ({ explosions: state.explosions.filter((e) => e.id !== id) }))
  },
  addSparkle: (position) => {
    const id = `sparkle-${Date.now()}-${Math.random()}`
    set((state) => ({ sparkles: [...state.sparkles, { id, position }] }))
  },
  removeSparkle: (id) => {
    set((state) => ({ sparkles: state.sparkles.filter((s) => s.id !== id) }))
  },
  addFloatingText: (text, position, color) => {
    const id = `text-${Date.now()}-${Math.random()}`
    set((state) => ({ floatingTexts: [...state.floatingTexts, { id, text, position, color }] }))
    setTimeout(() => get().removeFloatingText(id), 2000)
  },
  removeFloatingText: (id) => {
    set((state) => ({ floatingTexts: state.floatingTexts.filter((t) => t.id !== id) }))
  },
  incrementCombo: () => {
    const now = Date.now()
    const state = get()
    const timeSinceLastAction = now - state.lastActionTime

    if (timeSinceLastAction < 3000) {
      const newCombo = state.combo + 1
      const newMultiplier = Math.min(1 + Math.floor(newCombo / 5) * 0.5, 5)
      set({ combo: newCombo, multiplier: newMultiplier, lastActionTime: now })
    } else {
      set({ combo: 1, multiplier: 1, lastActionTime: now })
    }
  },
  resetCombo: () => {
    set({ combo: 0, multiplier: 1 })
  },
  // Audio system methods
  initializeAudio: () => {
    if (typeof window !== 'undefined') {
      // Set up user interaction listener for autoplay
      const startAudioOnInteraction = () => {
        get().playNextTrack()
        // Remove listeners after first interaction
        document.removeEventListener('click', startAudioOnInteraction)
        document.removeEventListener('keydown', startAudioOnInteraction)
        document.removeEventListener('touchstart', startAudioOnInteraction)
      }
      
      // Listen for any user interaction to start audio
      document.addEventListener('click', startAudioOnInteraction)
      document.addEventListener('keydown', startAudioOnInteraction)
      document.addEventListener('touchstart', startAudioOnInteraction)
    }
  },
  playNextTrack: () => {
    if (typeof window === 'undefined') return
    
    // Stop current audio if playing
    if (currentAudio) {
      currentAudio.pause()
      currentAudio.removeEventListener('ended', get().playNextTrack)
    }
    
    // Select random track
    const randomIndex = Math.floor(Math.random() * MUSIC_TRACKS.length)
    const trackPath = MUSIC_TRACKS[randomIndex]
    
    // Create new audio element
    currentAudio = new Audio(trackPath)
    currentAudio.volume = get().audioVolume
    currentAudio.loop = false
    
    // Set up event listeners
    currentAudio.addEventListener('ended', () => {
      // Small delay before next track
      setTimeout(() => {
        if (get().isAudioPlaying) {
          get().playNextTrack()
        }
      }, 2000)
    })
    
    currentAudio.addEventListener('canplay', () => {
      if (get().isAudioPlaying && currentAudio) {
        currentAudio.play().catch(console.error)
      }
    })
    
    currentAudio.addEventListener('error', (e) => {
      console.error('Audio error:', e)
      // Try next track after error
      setTimeout(() => {
        if (get().isAudioPlaying) {
          get().playNextTrack()
        }
      }, 1000)
    })
    
    set({ 
      currentTrack: trackPath,
      isAudioPlaying: true 
    })
  },
  toggleAudio: () => {
    const state = get()
    if (state.isAudioPlaying) {
      // Stop audio
      if (currentAudio) {
        currentAudio.pause()
      }
      set({ isAudioPlaying: false })
    } else {
      // Start audio
      set({ isAudioPlaying: true })
      if (currentAudio) {
        currentAudio.play().catch(console.error)
      } else {
        get().playNextTrack()
      }
    }
  },
  setAudioVolume: (volume) => {
    set({ audioVolume: volume })
    if (currentAudio) {
      currentAudio.volume = volume
    }
  },
  setPlayerName: (name) => set({ playerName: name }),
  setDifficulty: (difficulty) => set({ difficulty }),
}))
