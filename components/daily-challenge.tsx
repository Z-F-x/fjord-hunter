"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Trophy, Target, Fish, Star, Clock, Zap } from "lucide-react"
import { generateDailyChallenge } from "@/app/actions/ai-actions"
import { useGameStore } from "@/store/game-store"
import { useEffect } from "react"

interface Challenge {
  title: string
  description: string
  goal: {
    type: "fish" | "targets" | "collectibles" | "score" | "time"
    amount: number
  }
  reward: number
  difficulty: "easy" | "medium" | "hard"
  tip: string
}

const defaultChallenges: Challenge[] = [
  {
    title: "Fiskekongen",
    description: "Fang 20 fisk i løpet av spillet",
    goal: { type: "fish", amount: 20 },
    reward: 150,
    difficulty: "medium",
    tip: "Kjør sakte når du nærmer deg fisk for bedre presisjon!",
  },
  {
    title: "Skarpskyteren",
    description: "Treff 15 fugler på rad",
    goal: { type: "targets", amount: 15 },
    reward: 200,
    difficulty: "hard",
    tip: "Sikt litt foran fuglen når den flyr!",
  },
  {
    title: "Skattejegeren",
    description: "Samle 25 gjenstander",
    goal: { type: "collectibles", amount: 25 },
    reward: 175,
    difficulty: "medium",
    tip: "Gullmynter og stjerner gir mest poeng!",
  },
  {
    title: "Poengmesteren",
    description: "Oppnå 1000 poeng",
    goal: { type: "score", amount: 1000 },
    reward: 250,
    difficulty: "hard",
    tip: "Kombiner fiske, skyting og samling for maksimale poeng!",
  },
]

export function DailyChallenge() {
  const [challenge, setChallenge] = useState<Challenge>(defaultChallenges[0])
  const [loading, setLoading] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [useAI, setUseAI] = useState(false)
  const stats = useGameStore((state) => state.stats)
  const score = useGameStore((state) => state.score)
  const addScore = useGameStore((state) => state.addScore)

  const loadChallenge = async (withAI = false) => {
    if (withAI) {
      setLoading(true)
      setUseAI(true)
      const newChallenge = await generateDailyChallenge()
      setChallenge(newChallenge)
      setLoading(false)
    } else {
      const randomChallenge = defaultChallenges[Math.floor(Math.random() * defaultChallenges.length)]
      setChallenge(randomChallenge)
    }
    setCompleted(false)
  }

  useEffect(() => {
    if (!challenge || completed) return

    let progress = 0
    switch (challenge.goal.type) {
      case "fish":
        progress = stats.fishCaught
        break
      case "targets":
        progress = stats.targetsHit
        break
      case "collectibles":
        progress = stats.collectiblesFound
        break
      case "score":
        progress = score
        break
    }

    if (progress >= challenge.goal.amount && !completed) {
      setCompleted(true)
      addScore(challenge.reward)
    }
  }, [stats, score, challenge, completed, addScore])

  const getIcon = () => {
    switch (challenge.goal.type) {
      case "fish":
        return <Fish className="h-6 w-6" />
      case "targets":
        return <Target className="h-6 w-6" />
      case "collectibles":
        return <Star className="h-6 w-6" />
      case "score":
        return <Trophy className="h-6 w-6" />
      case "time":
        return <Clock className="h-6 w-6" />
    }
  }

  const getDifficultyColor = () => {
    switch (challenge.difficulty) {
      case "easy":
        return "text-green-400"
      case "medium":
        return "text-yellow-400"
      case "hard":
        return "text-red-400"
    }
  }

  let progress = 0
  switch (challenge.goal.type) {
    case "fish":
      progress = stats.fishCaught
      break
    case "targets":
      progress = stats.targetsHit
      break
    case "collectibles":
      progress = stats.collectiblesFound
      break
    case "score":
      progress = score
      break
  }

  const progressPercent = Math.min((progress / challenge.goal.amount) * 100, 100)

  return (
    <Card className="bg-gradient-to-r from-purple-600/90 to-pink-600/90 p-4 backdrop-blur-sm">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <Zap className="h-5 w-5 text-yellow-300" />
            <span className="font-bold">DAGENS UTFORDRING</span>
          </div>
          <span className={`text-sm font-semibold ${getDifficultyColor()}`}>{challenge.difficulty.toUpperCase()}</span>
        </div>

        <div>
          <h3 className="text-xl font-bold text-white">{challenge.title}</h3>
          <p className="text-sm text-white/80">{challenge.description}</p>
        </div>

        <div className="flex items-center gap-2 text-white">
          {getIcon()}
          <span className="text-sm">
            {progress} / {challenge.goal.amount}
          </span>
          {completed && <span className="ml-2 text-green-300">✓ FULLFØRT!</span>}
        </div>

        <Progress value={progressPercent} className="h-2" />

        <div className="flex items-center justify-between text-sm">
          <span className="text-white/70">💡 {challenge.tip}</span>
          <span className="font-bold text-yellow-300">+{challenge.reward} poeng</span>
        </div>

        {completed && (
          <div className="flex gap-2">
            <Button onClick={() => loadChallenge(false)} className="flex-1 bg-white/20 hover:bg-white/30" size="sm">
              Ny utfordring
            </Button>
            <Button
              onClick={() => loadChallenge(true)}
              disabled={loading}
              className="flex-1 bg-white/20 hover:bg-white/30"
              size="sm"
            >
              {loading ? "Genererer..." : "AI Utfordring"}
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}
