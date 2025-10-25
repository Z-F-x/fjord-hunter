"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, Medal, Award } from "lucide-react"
import { getTopScores } from "@/app/actions"

interface HighScore {
  id: string
  player_name: string
  score: number
  time_played: number
  fish_caught: number
  targets_hit: number
  collectibles_found: number
  created_at: string
}

export function Leaderboard({ onClose }: { onClose: () => void }) {
  const [scores, setScores] = useState<HighScore[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadScores()
  }, [])

  const loadScores = async () => {
    setLoading(true)
    const data = await getTopScores(10)
    setScores(data)
    setLoading(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="h-6 w-6 text-yellow-400" />
    if (index === 1) return <Medal className="h-6 w-6 text-gray-400" />
    if (index === 2) return <Award className="h-6 w-6 text-amber-600" />
    return <span className="text-lg font-bold text-white/60">#{index + 1}</span>
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <Card className="w-full max-w-2xl bg-gradient-to-b from-blue-900/95 to-blue-950/95 p-6 backdrop-blur-md">
        <div className="mb-6 text-center">
          <h2 className="mb-2 text-4xl font-bold text-yellow-400">LEADERBOARD</h2>
          <p className="text-white/70">Topp 10 spillere</p>
        </div>

        {loading ? (
          <div className="py-12 text-center text-white">Laster...</div>
        ) : scores.length === 0 ? (
          <div className="py-12 text-center text-white/70">Ingen high scores ennå. Vær den første!</div>
        ) : (
          <div className="space-y-2">
            {scores.map((score, index) => (
              <div
                key={score.id}
                className="flex items-center gap-4 rounded-lg bg-black/30 p-4 transition-colors hover:bg-black/40"
              >
                <div className="flex w-12 items-center justify-center">{getRankIcon(index)}</div>

                <div className="flex-1">
                  <div className="font-bold text-white">{score.player_name}</div>
                  <div className="text-sm text-white/60">
                    {score.fish_caught} fisk • {score.targets_hit} treff • {score.collectibles_found} items
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold text-yellow-400">{score.score}</div>
                  <div className="text-sm text-white/60">{formatTime(score.time_played)}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-center">
          <Button onClick={onClose} size="lg" className="bg-blue-600 hover:bg-blue-700">
            Lukk
          </Button>
        </div>
      </Card>
    </div>
  )
}
