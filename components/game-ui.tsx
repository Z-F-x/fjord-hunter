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
import { Trophy, Pause, Play, Award, ChevronDown, ChevronUp } from "lucide-react"
import { calculateLevel, getLevelProgress } from "@/lib/achievements"
import type { Achievement } from "@/lib/achievements"
import { GameInfo } from "./game-info"

export function GameUI() {
  const [time, setTime] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [showGameOver, setShowGameOver] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [showAchievements, setShowAchievements] = useState(false)
  const [showSidebar, setShowSidebar] = useState(true)
  const [currentNotification, setCurrentNotification] = useState<Achievement | null>(null)
  const score = useGameStore((state) => state.score)
  const boatSpeed = useGameStore((state) => state.boatSpeed)
  const stats = useGameStore((state) => state.stats)

  const level = calculateLevel(score)
  const levelProgress = getLevelProgress(score)

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
        <div className="absolute left-1/2 top-6 -translate-x-1/2">
          <div className="pointer-events-auto">
            <GameInfo />
          </div>
        </div>

        <div className="absolute right-6 top-6 space-y-3">
          <Button
            onClick={() => setShowSidebar(!showSidebar)}
            className="pointer-events-auto w-full bg-black/60 hover:bg-black/70"
            size="sm"
          >
            {showSidebar ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            <span className="ml-2">AI Innhold (valgfritt)</span>
          </Button>

          {showSidebar && (
            <div className="pointer-events-auto space-y-3">
              <DailyChallenge />
              <AiTipsPanel />
            </div>
          )}
        </div>

        <div className="flex items-start justify-start gap-4 p-6">
          <Card className="pointer-events-auto bg-black/60 p-4 backdrop-blur-sm">
            <div className="space-y-2 text-white">
              <div className="text-sm font-medium text-white/70">POENG</div>
              <div className="text-4xl font-bold">{score}</div>
              <div className="mt-2">
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-white/70">Level {level}</span>
                  <span className="text-white/70">{Math.round(levelProgress)}%</span>
                </div>
                <Progress value={levelProgress} className="h-2" />
              </div>
            </div>
          </Card>

          <Card className="pointer-events-auto bg-black/60 p-4 backdrop-blur-sm">
            <div className="space-y-2 text-white">
              <div className="text-sm font-medium text-white/70">FART</div>
              <div className="text-4xl font-bold">{Math.round(boatSpeed * 3.6)} km/t</div>
            </div>
          </Card>

          <Card className="pointer-events-auto bg-black/60 p-4 backdrop-blur-sm">
            <div className="space-y-2 text-white">
              <div className="text-sm font-medium text-white/70">TID</div>
              <div className="text-4xl font-bold">{formatTime(time)}</div>
            </div>
          </Card>
        </div>

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

        <div className="absolute bottom-6 right-6 flex gap-2">
          <Button
            onClick={() => setShowAchievements(true)}
            className="pointer-events-auto bg-purple-600 hover:bg-purple-700"
            size="lg"
          >
            <Award className="mr-2 h-5 w-5" />
            Achievements
          </Button>
          <Button
            onClick={() => setShowLeaderboard(true)}
            className="pointer-events-auto bg-yellow-600 hover:bg-yellow-700"
            size="lg"
          >
            <Trophy className="mr-2 h-5 w-5" />
            Leaderboard
          </Button>
          <Button
            onClick={() => setIsPaused(!isPaused)}
            className="pointer-events-auto bg-blue-600 hover:bg-blue-700"
            size="lg"
          >
            {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
          </Button>
          <Button onClick={handleEndGame} className="pointer-events-auto bg-red-600 hover:bg-red-700" size="lg">
            Avslutt
          </Button>
        </div>
      </div>

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
