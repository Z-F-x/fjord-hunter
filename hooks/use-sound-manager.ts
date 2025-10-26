"use client"

import { useRef, useEffect } from 'react'

// Enhanced sound system with all the new sounds
interface SoundMap {
  [key: string]: HTMLAudioElement | null
}

class GameSoundManager {
  private sounds: SoundMap = {}
  private volume = 0.7
  private initialized = false

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeSounds()
    }
  }

  private initializeSounds() {
    if (this.initialized) return

    const soundFiles = {
      // UI and Achievement Sounds
      'achievement': '/sound/mixkit-casino-bling-achievement-2067.wav',
      'unlock': '/sound/mixkit-unlock-game-notification-253.wav',
      'bonus': '/sound/mixkit-bonus-earned-in-video-game-2058.wav',
      'notification': '/sound/mixkit-quick-positive-video-game-notification-interface-265.wav',
      'arcade_notification': '/sound/mixkit-retro-arcade-casino-notification-211.wav',

      // Game Action Sounds
      'shoot': '/sound/mixkit-video-game-retro-click-237.wav',
      'hit': '/sound/mixkit-player-jumping-in-a-video-game-2043.wav',
      'collect_treasure': '/sound/mixkit-video-game-treasure-2066.wav',
      'collect_coin': '/sound/mixkit-winning-a-coin-video-game-2069.wav',

      // Game State Sounds
      'level_up': '/sound/mixkit-arcade-rising-231.wav',
      'game_over': '/sound/mixkit-player-losing-or-failing-2042.wav'
    }

    // Pre-load all sounds
    Object.entries(soundFiles).forEach(([key, path]) => {
      try {
        const audio = new Audio(path)
        audio.preload = 'auto'
        audio.volume = this.volume
        audio.loop = false // EKSPLISITT NO LOOP!
        this.sounds[key] = audio
      } catch (error) {
        console.warn(`Failed to load sound: ${path}`, error)
        this.sounds[key] = null
      }
    })

    this.initialized = true
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume))
    Object.values(this.sounds).forEach(audio => {
      if (audio) audio.volume = this.volume
    })
  }

  play(soundKey: string, options?: { volume?: number; playbackRate?: number }) {
    if (!this.initialized) this.initializeSounds()

    const audio = this.sounds[soundKey]
    if (!audio) return

    try {
      // Reset audio to beginning
      audio.currentTime = 0

      // Apply options if provided
      if (options?.volume !== undefined) {
        audio.volume = Math.max(0, Math.min(1, options.volume))
      } else {
        audio.volume = this.volume
      }

      if (options?.playbackRate !== undefined) {
        audio.playbackRate = Math.max(0.25, Math.min(4, options.playbackRate))
      } else {
        audio.playbackRate = 1
      }

      // Play the sound
      audio.play().catch(error => {
        console.warn(`Failed to play sound: ${soundKey}`, error)
      })
    } catch (error) {
      console.warn(`Error playing sound: ${soundKey}`, error)
    }
  }

  stop(soundKey: string) {
    const audio = this.sounds[soundKey]
    if (audio) {
      audio.pause()
      audio.currentTime = 0
    }
  }

  stopAll() {
    Object.values(this.sounds).forEach(audio => {
      if (audio) {
        audio.pause()
        audio.currentTime = 0
      }
    })
  }
}

// Create global sound manager instance
let soundManager: GameSoundManager | null = null

export function useSoundManager() {
  const soundManagerRef = useRef<GameSoundManager | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!soundManager) {
        soundManager = new GameSoundManager()
      }
      soundManagerRef.current = soundManager
    }

    return () => {
      // Cleanup on unmount
      if (soundManagerRef.current) {
        soundManagerRef.current.stopAll()
      }
    }
  }, [])

  return soundManagerRef.current
}

// Export the sound manager for global access
export { GameSoundManager }

// Convenience functions for common sound events
export const playSound = {
  // Achievement sounds
  achievement: () => soundManager?.play('achievement'),
  unlock: () => soundManager?.play('unlock'),
  bonus: () => soundManager?.play('bonus'),
  notification: () => soundManager?.play('notification'),
  arcadeNotification: () => soundManager?.play('arcade_notification'),

  // Action sounds
  shoot: () => soundManager?.play('shoot', { volume: 0.4 }),
  hit: () => soundManager?.play('hit', { volume: 0.6 }),
  collectTreasure: () => soundManager?.play('collect_treasure', { volume: 0.8 }),
  collectCoin: () => soundManager?.play('collect_coin', { volume: 0.6 }),

  // Game state sounds
  levelUp: () => soundManager?.play('level_up', { volume: 0.8 }),
  gameOver: () => soundManager?.play('game_over', { volume: 0.7 }),
}
