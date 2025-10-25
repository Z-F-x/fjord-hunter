"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lightbulb, Loader2, AlertCircle } from "lucide-react"
import { generateGameTip } from "@/app/actions/ai-actions"
import { useGameStore } from "@/store/game-store"

export function AiTipsPanel() {
  const [tip, setTip] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const stats = useGameStore((state) => state.stats)
  const score = useGameStore((state) => state.score)

  const getTip = async () => {
    setLoading(true)
    setError(false)
    try {
      const newTip = await generateGameTip({
        score,
        fishCaught: stats.fishCaught,
        targetsHit: stats.targetsHit,
        collectiblesFound: stats.collectiblesFound,
      })
      if (newTip === "Fortsett å øve! Du gjør det bra!") {
        setError(true)
      }
      setTip(newTip)
    } catch (err) {
      setError(true)
      setTip("Fortsett å øve! Du gjør det bra!")
    }
    setLoading(false)
  }

  return (
    <Card className="bg-blue-600/90 p-4 backdrop-blur-sm">
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-white">
          <Lightbulb className="h-5 w-5 text-yellow-300" />
          <span className="font-bold">AI COACH</span>
          <span className="text-xs text-white/60">(valgfritt)</span>
        </div>

        {tip ? (
          <div>
            <p className="text-sm text-white">{tip}</p>
            {error && (
              <p className="mt-2 flex items-center gap-1 text-xs text-yellow-300">
                <AlertCircle className="h-3 w-3" />
                AI krever kredittkort i Vercel
              </p>
            )}
          </div>
        ) : (
          <p className="text-sm text-white/70">Få personlige tips fra AI-coachen din! (Krever Vercel AI Gateway)</p>
        )}

        <Button onClick={getTip} disabled={loading} className="w-full bg-white/20 hover:bg-white/30" size="sm">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Genererer tips...
            </>
          ) : (
            "Få AI tips"
          )}
        </Button>
      </div>
    </Card>
  )
}
