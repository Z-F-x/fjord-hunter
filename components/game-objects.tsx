"use client"

import { useEffect, useState } from "react"
import { Fish } from "./fish"
import { Target } from "./target"
import { Collectible } from "./collectible"

export function GameObjects() {
  const [fish, setFish] = useState<Array<{ id: number; x: number; z: number }>>([])
  const [targets, setTargets] = useState<Array<{ id: number; x: number; y: number; z: number }>>([])
  const [collectibles, setCollectibles] = useState<Array<{ id: number; x: number; z: number; type: string }>>([])

  useEffect(() => {
    // Spawn initial fish
    const initialFish = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 80,
      z: (Math.random() - 0.5) * 80,
    }))
    setFish(initialFish)

    // Spawn initial targets (birds)
    const initialTargets = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 100,
      y: 5 + Math.random() * 10,
      z: (Math.random() - 0.5) * 100,
    }))
    setTargets(initialTargets)

    // Spawn collectibles
    const initialCollectibles = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 90,
      z: (Math.random() - 0.5) * 90,
      type: Math.random() > 0.5 ? "coin" : "star",
    }))
    setCollectibles(initialCollectibles)
  }, [])

  const removeFish = (id: number) => {
    setFish((prev) => prev.filter((f) => f.id !== id))
    // Respawn after delay
    setTimeout(() => {
      setFish((prev) => [
        ...prev,
        {
          id: Date.now(),
          x: (Math.random() - 0.5) * 80,
          z: (Math.random() - 0.5) * 80,
        },
      ])
    }, 5000)
  }

  const removeTarget = (id: number) => {
    setTargets((prev) => prev.filter((t) => t.id !== id))
    // Respawn after delay
    setTimeout(() => {
      setTargets((prev) => [
        ...prev,
        {
          id: Date.now(),
          x: (Math.random() - 0.5) * 100,
          y: 5 + Math.random() * 10,
          z: (Math.random() - 0.5) * 100,
        },
      ])
    }, 8000)
  }

  const removeCollectible = (id: number) => {
    setCollectibles((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <>
      {fish.map((f) => (
        <Fish key={f.id} id={f.id} position={[f.x, -0.5, f.z]} onCatch={removeFish} />
      ))}
      {targets.map((t) => (
        <Target key={t.id} id={t.id} position={[t.x, t.y, t.z]} onHit={removeTarget} />
      ))}
      {collectibles.map((c) => (
        <Collectible key={c.id} id={c.id} position={[c.x, 0.5, c.z]} type={c.type} onCollect={removeCollectible} />
      ))}
    </>
  )
}
