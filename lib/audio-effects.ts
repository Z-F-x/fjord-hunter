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

  // Generate shooting sound effect
  playShootSound() {
    if (!this.ensureAudioContext()) return

    const now = this.context!.currentTime
    const oscillator = this.context!.createOscillator()
    const envelope = this.context!.createGain()
    
    // Connect audio nodes
    oscillator.connect(envelope)
    envelope.connect(this.gainNode!)
    
    // Configure shooting sound (quick pop)
    oscillator.frequency.setValueAtTime(800, now)
    oscillator.frequency.exponentialRampToValueAtTime(200, now + 0.1)
    
    // Envelope for sharp attack and quick decay
    envelope.gain.setValueAtTime(0, now)
    envelope.gain.linearRampToValueAtTime(0.3, now + 0.01)
    envelope.gain.exponentialRampToValueAtTime(0.001, now + 0.15)
    
    // Start and stop
    oscillator.start(now)
    oscillator.stop(now + 0.15)
  }

  // Generate explosion/hit sound effect
  playHitSound() {
    if (!this.ensureAudioContext()) return

    const now = this.context!.currentTime
    
    // Create noise buffer for explosion effect
    const bufferSize = this.context!.sampleRate * 0.2 // 0.2 seconds
    const buffer = this.context!.createBuffer(1, bufferSize, this.context!.sampleRate)
    const data = buffer.getChannelData(0)
    
    // Generate white noise
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }
    
    const noise = this.context!.createBufferSource()
    const filter = this.context!.createBiquadFilter()
    const envelope = this.context!.createGain()
    
    // Setup audio chain
    noise.buffer = buffer
    noise.connect(filter)
    filter.connect(envelope)
    envelope.connect(this.gainNode!)
    
    // Configure filter for explosion sound
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(1000, now)
    filter.frequency.exponentialRampToValueAtTime(100, now + 0.2)
    
    // Explosion envelope
    envelope.gain.setValueAtTime(0, now)
    envelope.gain.linearRampToValueAtTime(0.5, now + 0.01)
    envelope.gain.exponentialRampToValueAtTime(0.001, now + 0.2)
    
    // Play explosion
    noise.start(now)
    noise.stop(now + 0.2)
  }

  // Generate splash sound for water hits
  playSplashSound() {
    if (!this.ensureAudioContext()) return

    const now = this.context!.currentTime
    
    // Create filtered noise for splash
    const bufferSize = this.context!.sampleRate * 0.3
    const buffer = this.context!.createBuffer(1, bufferSize, this.context!.sampleRate)
    const data = buffer.getChannelData(0)
    
    // Generate filtered noise
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3))
    }
    
    const splash = this.context!.createBufferSource()
    const filter = this.context!.createBiquadFilter()
    const envelope = this.context!.createGain()
    
    splash.buffer = buffer
    splash.connect(filter)
    filter.connect(envelope)
    envelope.connect(this.gainNode!)
    
    // Water splash characteristics
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(400, now)
    filter.Q.setValueAtTime(2, now)
    
    // Splash envelope
    envelope.gain.setValueAtTime(0, now)
    envelope.gain.linearRampToValueAtTime(0.2, now + 0.02)
    envelope.gain.exponentialRampToValueAtTime(0.001, now + 0.3)
    
    splash.start(now)
    splash.stop(now + 0.3)
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

// Shooting system hooks
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

  return { playShoot, playHit, playSplash }
}