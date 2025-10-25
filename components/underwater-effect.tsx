"use client"

import { useGameStore } from "@/store/game-store"
import { useEffect, useState } from "react"

export function UnderwaterEffect() {
  const isUnderwater = useGameStore((state) => state.isUnderwater)
  const [bubbles, setBubbles] = useState<Array<{ id: number; x: number; delay: number }>>([])

  useEffect(() => {
    if (isUnderwater) {
      // Generate random bubbles
      const newBubbles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 2,
      }))
      setBubbles(newBubbles)
    }
  }, [isUnderwater])

  if (!isUnderwater) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-10">
      {/* Blue underwater tint */}
      <div className="absolute inset-0 bg-blue-600/40 animate-pulse" />

      {/* Bubbles */}
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="absolute bottom-0 h-4 w-4 animate-bounce rounded-full bg-white/30"
          style={{
            left: `${bubble.x}%`,
            animationDelay: `${bubble.delay}s`,
            animationDuration: "3s",
          }}
        />
      ))}

      {/* Underwater text */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <p className="text-4xl font-bold text-white drop-shadow-lg">UNDER VANN!</p>
        <p className="mt-2 text-xl text-white/80">Båten flyter opp snart...</p>
      </div>
    </div>
  )
}
