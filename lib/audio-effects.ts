// Audio effects for game actions
class AudioEffects {
  private context: AudioContext | null = null
  private gainNode: GainNode | null = null

  constructor() {
    if (typeof window !== 'undefined') {
      this.initAudioContext()
    }
  }

  private initAudioContext() {
    try {
      this.context = new (window.AudioContext || (window as any).webkitAudioContext)()
      this.gainNode = this.context.createGain()
      this.gainNode.gain.setValueAtTime(0.3, this.context.currentTime)
      this.gainNode.connect(this.context.destination)
    } catch (error) {
      console.warn('Web Audio API not supported:', error)
    }
  }

  private ensureAudioContext() {
    if (!this.context && typeof window !== 'undefined') {
      this.initAudioContext()
    }
    return this.context && this.gainNode
  }

  // Play shooting sound using actual audio file
  playShootSound() {
    this.playAudioFile('/sound/mixkit-video-game-retro-click-237.wav', 0.4)
  }

  // Play audio file helper
  private playAudioFile(src: string, volume: number = 0.5) {
    if (typeof window === 'undefined') return

    try {
      const audio = new Audio(src)
      audio.volume = volume
      audio.play().catch(error => {
        console.warn(`Failed to play audio: ${src}`, error)
      })
    } catch (error) {
      console.warn(`Error creating audio for: ${src}`, error)
    }
  }

  // Play hit sound using actual audio file
  playHitSound() {
    this.playAudioFile('/sound/mixkit-player-jumping-in-a-video-game-2043.wav', 0.6)
  }

  // Play splash sound - using bonus sound for water hits
  playSplashSound() {
    this.playAudioFile('/sound/mixkit-bonus-earned-in-video-game-2058.wav', 0.3)
  }

  // Play fishing sound with net animation
  playFishingSound() {
    // Cast sound first
    this.playAudioFile('/sound/mixkit-quick-positive-video-game-notification-interface-265.wav', 0.4)

    // Splash sound after delay
    setTimeout(() => this.playSplashSound(), 200)
  }

  // Set master volume for effects
  setVolume(volume: number) {
    if (this.gainNode) {
      this.gainNode.gain.setValueAtTime(Math.max(0, Math.min(1, volume)), this.context!.currentTime)
    }
  }
}

// Singleton instance
export const audioEffects = new AudioEffects()

// Game audio effects hooks
export const useShootingEffects = () => {
  const playShoot = () => {
    audioEffects.playShootSound()
  }

  const playHit = () => {
    audioEffects.playHitSound()
  }

  const playSplash = () => {
    audioEffects.playSplashSound()
  }

  const playFishing = () => {
    audioEffects.playFishingSound()
  }

  return { playShoot, playHit, playSplash, playFishing }
}
