"use client"

import dynamic from "next/dynamic"

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

export function GameWrapper() {
  return <GameScene />
}
