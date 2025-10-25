"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useGameStore } from "@/store/game-store"
import { GameOver } from "./game-over"
import { Leaderboard } from "./leaderboard"
import { AchievementsPanel } from "./achievements-panel"
import { AchievementNotification } from "./achievement-notification"
import { DailyChallenge } from "./daily-challenge"
import { AiTipsPanel } from "./ai-tips-panel"
import { MobileControls } from "./mobile-controls"
import { Trophy, Pause, Play, Award, ChevronDown, ChevronUp, Volume2, VolumeX } from "lucide-react"
import { calculateLevel, getLevelProgress } from "@/lib/achievements"
import type { Achievement } from "@/lib/achievements"
import { GameInfo } from "./game-info"

export function GameUI() {
  const [time, setTime] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [showGameOver, setShowGameOver] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [showAchievements, setShowAchievements] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false) // Default to hidden on mobile
  const [currentNotification, setCurrentNotification] = useState<Achievement | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const score = useGameStore((state) => state.score)
  const boatSpeed = useGameStore((state) => state.boatSpeed)
  const stats = useGameStore((state) => state.stats)
  const combo = useGameStore((state) => state.combo)
  const multiplier = useGameStore((state) => state.multiplier)
  const isAudioPlaying = useGameStore((state) => state.isAudioPlaying)
  const currentTrack = useGameStore((state) => state.currentTrack)
  const initializeAudio = useGameStore((state) => state.initializeAudio)
  const toggleAudio = useGameStore((state) => state.toggleAudio)
  const [showAudioPrompt, setShowAudioPrompt] = useState(true)

  const level = calculateLevel(score)
  const levelProgress = getLevelProgress(score)

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    // Initialize audio system when component mounts
    initializeAudio()
  }, [initializeAudio])

  useEffect(() => {
    // Hide audio prompt when music starts playing
    if (isAudioPlaying && currentTrack) {
      setShowAudioPrompt(false)
    }
  }, [isAudioPlaying, currentTrack])

  useEffect(() => {
    if (isPaused || showGameOver) return

    const interval = setInterval(() => {
      setTime((t) => t + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [isPaused, showGameOver])

  useEffect(() => {
    const unsubscribe = useGameStore.subscribe((state, prevState) => {
      const newAchievements = state.unlockedAchievements.filter((id) => !prevState.unlockedAchievements.includes(id))
      if (newAchievements.length > 0) {
        const achievement = state.lastUnlockedAchievement
        if (achievement) {
          setCurrentNotification(achievement)
        }
      }
    })

    return unsubscribe
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleEndGame = () => {
    setShowGameOver(true)
  }

  const handleRestart = () => {
    setShowGameOver(false)
    setShowLeaderboard(false)
    setTime(0)
    useGameStore.getState().resetGame()
    window.location.reload()
  }

  return (
    <>
      <AchievementNotification achievement={currentNotification} onClose={() => setCurrentNotification(null)} />

      <MobileControls />

      <div className="pointer-events-none absolute inset-0">
        {combo > 1 && (
          <div className="absolute left-1/2 top-24 -translate-x-1/2 animate-pulse">
            <div className="rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-3 text-center shadow-lg">
              <div className="text-4xl font-bold text-white">{combo}x COMBO!</div>
              {multiplier > 1 && (
                <div className="text-xl font-semibold text-white/90">{multiplier}x Poeng Multiplier</div>
              )}
            </div>
          </div>
        )}

        <div className="absolute left-1/2 top-6 -translate-x-1/2">
          <div className="pointer-events-auto">
            <GameInfo />
          </div>
        </div>

        {/* Audio prompt for autoplay */}
        {showAudioPrompt && !isAudioPlaying && (
          <div className="absolute left-1/2 top-20 -translate-x-1/2 animate-pulse">
            <div className="rounded-lg bg-blue-600/80 px-4 py-2 text-center shadow-lg backdrop-blur-sm">
              <div className="text-sm font-medium text-white">🎵 Klikk hvor som helst for å starte musikk</div>
            </div>
          </div>
        )}

        {/* AI Sidebar - Hidden on mobile by default, shows as overlay when opened */}
        <div className={`absolute right-2 top-2 space-y-2 ${isMobile ? 'max-w-xs' : ''}`}>
          {!isMobile && (
            <Button
              onClick={() => setShowSidebar(!showSidebar)}
              className="pointer-events-auto w-full bg-black/60 hover:bg-black/70"
              size="sm"
              title={showSidebar ? "Skjul AI innhold" : "Vis AI innhold"}
            >
              {showSidebar ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              <span className="ml-2">{showSidebar ? 'Skjul AI Tips' : 'Vis AI Tips'}</span>
            </Button>
          )}

          {showSidebar && !isMobile && (
            <div className="pointer-events-auto space-y-2">
              <DailyChallenge />
              <AiTipsPanel />
            </div>
          )}
        </div>

        {/* Game Stats - Compact layout for mobile */}
        <div className={`${isMobile
          ? 'flex flex-wrap gap-2 p-2'
          : 'flex items-start justify-start gap-4 p-6'
        }`}>
          <Card className={`pointer-events-auto bg-black/60 backdrop-blur-sm ${
            isMobile ? 'p-2 flex-1 min-w-[100px]' : 'p-4'
          }`}>
            <div className={`space-y-1 text-white ${isMobile ? 'text-center' : ''}`}>
              <div className={`font-medium text-white/70 ${isMobile ? 'text-xs' : 'text-sm'}`}>POENG</div>
              <div className={`font-bold ${isMobile ? 'text-lg' : 'text-4xl'}`}>{score}</div>
              {multiplier > 1 && (
                <div className={`font-semibold text-yellow-400 ${isMobile ? 'text-xs' : 'text-lg'}`}>
                  {multiplier}x
                </div>
              )}
              {!isMobile && (
                <div className="mt-2">
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-white/70">Level {level}</span>
                    <span className="text-white/70">{Math.round(levelProgress)}%</span>
                  </div>
                  <Progress value={levelProgress} className="h-2" />
                </div>
              )}
            </div>
          </Card>

          <Card className={`pointer-events-auto bg-black/60 backdrop-blur-sm ${
            isMobile ? 'p-2 flex-1 min-w-[80px]' : 'p-4'
          }`}>
            <div className={`space-y-1 text-white ${isMobile ? 'text-center' : ''}`}>
              <div className={`font-medium text-white/70 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                {isMobile ? 'KM/T' : 'FART'}
              </div>
              <div className={`font-bold ${isMobile ? 'text-lg' : 'text-4xl'}`}>
                {Math.round(boatSpeed * 3.6)}
              </div>
            </div>
          </Card>

          <Card className={`pointer-events-auto bg-black/60 backdrop-blur-sm ${
            isMobile ? 'p-2 flex-1 min-w-[80px]' : 'p-4'
          }`}>
            <div className={`space-y-1 text-white ${isMobile ? 'text-center' : ''}`}>
              <div className={`font-medium text-white/70 ${isMobile ? 'text-xs' : 'text-sm'}`}>TID</div>
              <div className={`font-bold ${isMobile ? 'text-lg' : 'text-4xl'}`}>{formatTime(time)}</div>
            </div>
          </Card>
        </div>

        {/* Controls info - Only show on desktop */}
        {!isMobile && (
          <div className="absolute bottom-6 left-6">
            <Card className="bg-black/60 p-4 backdrop-blur-sm">
              <div className="space-y-2 text-sm text-white">
                <div className="font-bold">KONTROLLER</div>
                <div className="text-white/70">W/↑ - Fremover</div>
                <div className="text-white/70">S/↓ - Bakover</div>
                <div className="text-white/70">A/← - Venstre</div>
                <div className="text-white/70">D/→ - Høyre</div>
                <div className="text-white/70">SPACE - Fiske</div>
                <div className="text-white/70">SHIFT - Skyte</div>
              </div>
            </Card>
          </div>
        )}

        {/* Action buttons - Responsive layout */}
        <div className={`absolute ${isMobile
          ? 'top-2 right-2 flex gap-1'
          : 'bottom-6 right-6 flex gap-2'
        }`}>
          <Button
            onClick={() => setShowAchievements(true)}
            className={`pointer-events-auto bg-purple-600 hover:bg-purple-700 ${
              isMobile ? 'p-2' : 'px-4 py-2'
            }`}
            size={isMobile ? "sm" : "lg"}
          >
            <Award className={`${isMobile ? 'h-4 w-4' : 'mr-2 h-5 w-5'}`} />
            {!isMobile && 'Prestasjoner'}
          </Button>
          <Button
            onClick={() => setShowLeaderboard(true)}
            className={`pointer-events-auto bg-yellow-600 hover:bg-yellow-700 ${
              isMobile ? 'p-2' : 'px-4 py-2'
            }`}
            size={isMobile ? "sm" : "lg"}
          >
            <Trophy className={`${isMobile ? 'h-4 w-4' : 'mr-2 h-5 w-5'}`} />
            {!isMobile && 'Toppscorer'}
          </Button>
          <Button
            onClick={() => setIsPaused(!isPaused)}
            className={`pointer-events-auto bg-blue-600 hover:bg-blue-700 ${
              isMobile ? 'p-2' : 'px-4 py-2'
            }`}
            size={isMobile ? "sm" : "lg"}
            title={isPaused ? "Fortsett spillet" : "Pause spillet"}
          >
            {isPaused ? <Play className={`${isMobile ? 'h-4 w-4' : 'mr-1 h-5 w-5'}`} /> : <Pause className={`${isMobile ? 'h-4 w-4' : 'mr-1 h-5 w-5'}`} />}
            {!isMobile && (isPaused ? 'Fortsett' : 'Pause')}
          </Button>
          <Button
            onClick={toggleAudio}
            className={`pointer-events-auto ${
              isAudioPlaying ? 'bg-green-600 hover:bg-green-700' : 
              currentTrack ? 'bg-yellow-600 hover:bg-yellow-700' : 
              'bg-blue-600 hover:bg-blue-700 animate-pulse'
            } ${isMobile ? 'p-2' : 'px-4 py-2'}`}
            size={isMobile ? "sm" : "lg"}
            title={!currentTrack ? "Klikk for å starte musikk" : isAudioPlaying ? "Pause musikk" : "Start musikk"}
          >
            {isAudioPlaying ? <Volume2 className={`${isMobile ? 'h-4 w-4' : 'mr-1 h-5 w-5'}`} /> : <VolumeX className={`${isMobile ? 'h-4 w-4' : 'mr-1 h-5 w-5'}`} />}
            {!isMobile && (isAudioPlaying ? 'Musikk På' : 'Musikk Av')}
          </Button>
          <Button
            onClick={handleEndGame}
            className={`pointer-events-auto bg-red-600 hover:bg-red-700 ${
              isMobile ? 'p-2' : 'px-4 py-2'
            }`}
            size={isMobile ? "sm" : "lg"}
            title="Avslutt spillet"
          >
            {isMobile ? '✕' : 'Avslutt Spill'}
          </Button>
        </div>

        {/* Mobile AI menu toggle - floating button */}
        {isMobile && (
          <Button
            onClick={() => setShowSidebar(!showSidebar)}
            className="pointer-events-auto absolute right-2 bottom-20 bg-black/60 hover:bg-black/70 px-3 py-2"
            size="sm"
            title="Vis AI tips og innhold"
          >
            <span className="text-xs font-medium">AI Tips</span>
          </Button>
        )}
      </div>

      {/* Mobile AI Sidebar Modal */}
      {isMobile && showSidebar && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm space-y-3 rounded-t-lg bg-gradient-to-b from-blue-900/95 to-blue-950/95 p-4 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">AI Features</h3>
              <Button
                onClick={() => setShowSidebar(false)}
                className="bg-white/20 hover:bg-white/30 p-1 h-8 w-8"
                size="sm"
              >
                ✕
              </Button>
            </div>
            <DailyChallenge />
            <AiTipsPanel />
          </div>
        </div>
      )}

      {showGameOver && (
        <GameOver
          score={score}
          timePlayed={time}
          fishCaught={stats.fishCaught}
          targetsHit={stats.targetsHit}
          collectiblesFound={stats.collectiblesFound}
          onRestart={handleRestart}
          onViewLeaderboard={() => {
            setShowGameOver(false)
            setShowLeaderboard(true)
          }}
        />
      )}

      {showLeaderboard && !showGameOver && <Leaderboard onClose={() => setShowLeaderboard(false)} />}
      {showAchievements && <AchievementsPanel onClose={() => setShowAchievements(false)} />}
    </>
  )
}
