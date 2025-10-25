"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { MainMenu } from "@/components/main-menu"
import { Leaderboard } from "@/components/leaderboard"

const GameScene = dynamic(() => import("@/components/game-scene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen w-full items-center justify-center bg-gradient-to-b from-sky-400 to-blue-600">
      <div className="text-center">
        <div className="mb-4 text-6xl font-bold text-white">FJORD HUNTER</div>
        <div className="text-xl text-white/80">Laster spillet...</div>
      </div>
    </div>
  ),
})

type GameState = 'menu' | 'playing' | 'leaderboard'

export function GameWrapper() {
  const [gameState, setGameState] = useState<GameState>('menu')
  const [playerName, setPlayerName] = useState('')

  useEffect(() => {
    // Load player settings from localStorage
    const savedName = localStorage.getItem('fjord-hunter-player-name')
    if (savedName) {
      setPlayerName(savedName)
    }
  }, [])

  const handleStartGame = () => {
    setGameState('playing')
  }

  const handleShowLeaderboard = () => {
    setGameState('leaderboard')
  }

  const handleBackToMenu = () => {
    setGameState('menu')
  }

  if (gameState === 'leaderboard') {
    return (
      <div className="relative">
        <div className="fixed inset-0 z-40 bg-gradient-to-b from-blue-900 to-blue-600" />
        <Leaderboard onClose={handleBackToMenu} />
      </div>
    )
  }

  if (gameState === 'menu') {
    return (
      <MainMenu
        onStartGame={handleStartGame}
        onShowLeaderboard={handleShowLeaderboard}
      />
    )
  }

  return (
    <div className="relative">
      <GameScene />
      {/* Back to menu button during gameplay */}
      <button
        onClick={handleBackToMenu}
        className="fixed top-4 left-4 z-50 rounded bg-black/60 px-4 py-2 text-sm font-medium text-white hover:bg-black/70 transition-colors"
        title="Gå tilbake til hovedmenyen"
      >
        ← Tilbake til Meny
      </button>
    </div>
  )
}
