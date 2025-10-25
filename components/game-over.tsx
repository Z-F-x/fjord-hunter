"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { saveHighScore } from "@/app/actions"
import { Trophy } from "lucide-react"
import { useGameStore } from "@/store/game-store"

interface GameOverProps {
  score: number
  timePlayed: number
  fishCaught: number
  targetsHit: number
  collectiblesFound: number
  onRestart: () => void
  onViewLeaderboard: () => void
}

export function GameOver({
  score,
  timePlayed,
  fishCaught,
  targetsHit,
  collectiblesFound,
  onRestart,
  onViewLeaderboard,
}: GameOverProps) {
  const [playerName, setPlayerName] = useState("")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const storePlayerName = useGameStore((state) => state.playerName)

  const handleSave = async () => {
    if (!playerName.trim()) return

    setSaving(true)
    const result = await saveHighScore({
      playerName: playerName.trim(),
      score,
      timePlayed,
      fishCaught,
      targetsHit,
      collectiblesFound,
    })

    setSaving(false)
    if (result.success) {
      setSaved(true)
    }
  }

  useEffect(() => {
    // Use player name from store if available
    if (storePlayerName && !saved) {
      setPlayerName(storePlayerName)
      // Auto-save if we have a player name
      setTimeout(() => handleSave(), 100) // Small delay to ensure playerName is set
    }
  }, [storePlayerName, saved])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <Card className="w-full max-w-md bg-gradient-to-b from-blue-900/95 to-blue-950/95 p-8 backdrop-blur-md">
        <div className="mb-6 text-center">
          <Trophy className="mx-auto mb-4 h-16 w-16 text-yellow-400" />
          <h2 className="mb-2 text-4xl font-bold text-white">SPILL SLUTT!</h2>
          <p className="text-white/70">Bra jobba!</p>
        </div>

        <div className="mb-6 space-y-3 rounded-lg bg-black/30 p-4">
          <div className="flex justify-between text-white">
            <span>Poeng:</span>
            <span className="text-2xl font-bold text-yellow-400">{score}</span>
          </div>
          <div className="flex justify-between text-white/80">
            <span>Tid:</span>
            <span className="font-semibold">{formatTime(timePlayed)}</span>
          </div>
          <div className="flex justify-between text-white/80">
            <span>Fisk fanget:</span>
            <span className="font-semibold">{fishCaught}</span>
          </div>
          <div className="flex justify-between text-white/80">
            <span>Mål truffet:</span>
            <span className="font-semibold">{targetsHit}</span>
          </div>
          <div className="flex justify-between text-white/80">
            <span>Items samlet:</span>
            <span className="font-semibold">{collectiblesFound}</span>
          </div>
        </div>

        {!saved ? (
          <div className="mb-6 space-y-3">
            <Input
              placeholder="Skriv inn navnet ditt"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="bg-black/30 text-white placeholder:text-white/50"
              maxLength={20}
            />
            <Button onClick={handleSave} disabled={!playerName.trim() || saving} className="w-full" size="lg">
              {saving ? "Lagrer..." : "Lagre Score"}
            </Button>
          </div>
        ) : (
          <div className="mb-6 rounded-lg bg-green-600/20 p-4 text-center text-green-400">Score lagret!</div>
        )}

        <div className="space-y-2">
          <Button onClick={onViewLeaderboard} variant="outline" className="w-full bg-transparent" size="lg">
            Se Leaderboard
          </Button>
          <Button onClick={onRestart} className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
            Spill Igjen
          </Button>
        </div>
      </Card>
    </div>
  )
}
