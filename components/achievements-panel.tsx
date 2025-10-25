"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ACHIEVEMENTS, calculateLevel, getLevelProgress } from "@/lib/achievements"
import { useGameStore } from "@/store/game-store"
import { Lock, CheckCircle2 } from "lucide-react"

interface AchievementsPanelProps {
  onClose: () => void
}

export function AchievementsPanel({ onClose }: AchievementsPanelProps) {
  const unlockedAchievements = useGameStore((state) => state.unlockedAchievements)
  const score = useGameStore((state) => state.score)
  const stats = useGameStore((state) => state.stats)

  const level = calculateLevel(score)
  const levelProgress = getLevelProgress(score)
  const totalXP = unlockedAchievements.reduce((sum, id) => {
    const achievement = ACHIEVEMENTS.find((a) => a.id === id)
    return sum + (achievement?.points || 0)
  }, 0)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <Card className="max-h-[90vh] w-full max-w-3xl overflow-y-auto bg-gradient-to-b from-blue-900/95 to-blue-950/95 p-6 backdrop-blur-md">
        <div className="mb-6">
          <h2 className="mb-4 text-4xl font-bold text-yellow-400">ACHIEVEMENTS</h2>

          <div className="mb-4 rounded-lg bg-black/30 p-4">
            <div className="mb-2 flex items-center justify-between text-white">
              <span className="text-2xl font-bold">Level {level}</span>
              <span className="text-sm text-white/70">{totalXP} Total XP</span>
            </div>
            <Progress value={levelProgress} className="h-3" />
            <div className="mt-1 text-xs text-white/60">{Math.round(levelProgress)}% til neste level</div>
          </div>

          <div className="mb-4 grid grid-cols-3 gap-4 rounded-lg bg-black/30 p-4 text-center text-white">
            <div>
              <div className="text-2xl font-bold text-yellow-400">{stats.fishCaught}</div>
              <div className="text-xs text-white/70">Fisk Fanget</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-400">{stats.targetsHit}</div>
              <div className="text-xs text-white/70">Mål Truffet</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">{stats.collectiblesFound}</div>
              <div className="text-xs text-white/70">Items Samlet</div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {ACHIEVEMENTS.map((achievement) => {
            const isUnlocked = unlockedAchievements.includes(achievement.id)

            return (
              <div
                key={achievement.id}
                className={`flex items-center gap-4 rounded-lg p-4 transition-colors ${
                  isUnlocked ? "bg-green-600/20" : "bg-black/30"
                }`}
              >
                <div className="text-4xl">{achievement.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{achievement.name}</span>
                    {isUnlocked && <CheckCircle2 className="h-5 w-5 text-green-400" />}
                    {!isUnlocked && <Lock className="h-4 w-4 text-white/40" />}
                  </div>
                  <div className="text-sm text-white/70">{achievement.description}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-yellow-400">{achievement.points} XP</div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-6 flex justify-center">
          <Button onClick={onClose} size="lg" className="bg-blue-600 hover:bg-blue-700">
            Lukk
          </Button>
        </div>
      </Card>
    </div>
  )
}
