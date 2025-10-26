"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Trophy, Medal, Award, Crown } from "lucide-react"
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

export function MenuScoreboard() {
  const [scores, setScores] = useState<HighScore[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadScores()
  }, [])

  const loadScores = async () => {
    try {
      // Check if Supabase is configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        // Use mock data for demo purposes
        const mockScores = [
          {
            id: '1',
            player_name: 'Kaptein Norge',
            score: 15420,
            time_played: 480,
            fish_caught: 12,
            targets_hit: 8,
            collectibles_found: 3,
            created_at: new Date().toISOString()
          },
          {
            id: '2',
            player_name: 'Fjord Master',
            score: 12100,
            time_played: 360,
            fish_caught: 9,
            targets_hit: 6,
            collectibles_found: 2,
            created_at: new Date().toISOString()
          }
        ]
        setScores(mockScores)
      } else {
        const data = await getTopScores(5) // Get top 5 for menu display
        setScores(data || [])
      }
    } catch (error) {
      console.log("Could not load scores:", error)
      setScores([])
    }
    setLoading(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="h-5 w-5 text-yellow-400" />
      case 1:
        return <Medal className="h-5 w-5 text-gray-300" />
      case 2:
        return <Award className="h-5 w-5 text-amber-600" />
      default:
        return <Trophy className="h-4 w-4 text-blue-400" />
    }
  }

  if (loading) {
    return (
      <Card className="w-full max-w-4xl bg-black/60 backdrop-blur-sm border-yellow-500/30">
        <div className="p-4">
          <div className="text-center">
            <div className="animate-pulse text-white">Laster toppscorer...</div>
          </div>
        </div>
      </Card>
    )
  }

  if (scores.length === 0) {
    return (
      <Card className="w-full max-w-4xl bg-black/60 backdrop-blur-sm border-yellow-500/30">
        <div className="p-4">
          <div className="text-center">
            <Trophy className="mx-auto mb-2 h-8 w-8 text-yellow-400" />
            <h3 className="text-lg font-bold text-white mb-2">🏆 TOPPSCORER 🏆</h3>
            <p className="text-white/70 text-sm">Ingen scorer ennå. Bli den første!</p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-4xl bg-black/60 backdrop-blur-sm border-yellow-500/30">
      <div className="p-4">
        <div className="text-center mb-4">
          <Trophy className="mx-auto mb-2 h-8 w-8 text-yellow-400" />
          <h3 className="text-lg font-bold text-white">🏆 TOPPSCORER 🏆</h3>
        </div>

        <div className="grid gap-2">
          {scores.slice(0, 5).map((score, index) => (
            <div
              key={score.id}
              className={`flex items-center justify-between p-3 rounded-lg ${
                index === 0
                  ? 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30'
                  : 'bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {getRankIcon(index)}
                  <span className="text-white font-bold text-lg">#{index + 1}</span>
                </div>
                <div>
                  <div className={`font-semibold ${index === 0 ? 'text-yellow-300' : 'text-white'}`}>
                    {score.player_name}
                  </div>
                  <div className="text-xs text-white/60">
                    {score.fish_caught} 🐟 • {score.targets_hit} 🎯 • {formatTime(score.time_played)}
                  </div>
                </div>
              </div>

              <div className={`text-right ${index === 0 ? 'text-yellow-300' : 'text-white'}`}>
                <div className="font-bold text-lg">{score.score.toLocaleString()}</div>
                <div className="text-xs text-white/60">poeng</div>
              </div>
            </div>
          ))}
        </div>

        {scores.length > 5 && (
          <div className="text-center mt-3 text-white/60 text-sm">
            og {scores.length - 5} flere spillere...
          </div>
        )}
      </div>
    </Card>
  )
}
