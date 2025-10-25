"use client"

import { useEffect, useState, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Fish } from "./fish"
import { Target } from "./target"
import { Collectible } from "./collectible"
import { useGameStore } from "@/store/game-store"

export function GameObjects() {
  const boatPosition = useGameStore((state) => state.boatPosition)
  const [fish, setFish] = useState<Array<{ id: number; x: number; z: number }>>([])
  const [targets, setTargets] = useState<Array<{ id: number; x: number; y: number; z: number }>>([])
  const [collectibles, setCollectibles] = useState<Array<{ id: number; x: number; z: number; type: string }>>([])

  const lastSpawnCheck = useRef(0)

  const spawnRadius = 150
  const despawnRadius = 200

  const spawnObjectsAroundBoat = () => {
    if (!boatPosition) return

    const newFish = Array.from({ length: 15 }, (_, i) => ({
      id: Date.now() + i,
      x: boatPosition.x + (Math.random() - 0.5) * spawnRadius * 2,
      z: boatPosition.z + (Math.random() - 0.5) * spawnRadius * 2,
    }))
    setFish(newFish)

    const newTargets = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i + 1000,
      x: boatPosition.x + (Math.random() - 0.5) * spawnRadius * 2,
      y: 5 + Math.random() * 10,
      z: boatPosition.z + (Math.random() - 0.5) * spawnRadius * 2,
    }))
    setTargets(newTargets)

    const newCollectibles = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i + 2000,
      x: boatPosition.x + (Math.random() - 0.5) * spawnRadius * 2,
      z: boatPosition.z + (Math.random() - 0.5) * spawnRadius * 2,
      type: Math.random() > 0.7 ? "star" : "coin",
    }))
    setCollectibles(newCollectibles)
  }

  useEffect(() => {
    spawnObjectsAroundBoat()
  }, [])

  useFrame((_, delta) => {
    if (!boatPosition) return

    lastSpawnCheck.current += delta
    if (lastSpawnCheck.current < 0.5) return
    lastSpawnCheck.current = 0

    setFish((prev) =>
      prev.filter((f) => {
        const distance = Math.sqrt((f.x - boatPosition.x) ** 2 + (f.z - boatPosition.z) ** 2)
        return distance < despawnRadius
      }),
    )

    setTargets((prev) =>
      prev.filter((t) => {
        const distance = Math.sqrt((t.x - boatPosition.x) ** 2 + (t.z - boatPosition.z) ** 2)
        return distance < despawnRadius
      }),
    )

    setCollectibles((prev) =>
      prev.filter((c) => {
        const distance = Math.sqrt((c.x - boatPosition.x) ** 2 + (c.z - boatPosition.z) ** 2)
        return distance < despawnRadius
      }),
    )

    if (fish.length < 12) {
      setFish((prev) => [
        ...prev,
        {
          id: Date.now(),
          x: boatPosition.x + (Math.random() - 0.5) * spawnRadius * 2,
          z: boatPosition.z + (Math.random() - 0.5) * spawnRadius * 2,
        },
      ])
    }

    if (targets.length < 6) {
      setTargets((prev) => [
        ...prev,
        {
          id: Date.now(),
          x: boatPosition.x + (Math.random() - 0.5) * spawnRadius * 2,
          y: 5 + Math.random() * 10,
          z: boatPosition.z + (Math.random() - 0.5) * spawnRadius * 2,
        },
      ])
    }

    if (collectibles.length < 10) {
      setCollectibles((prev) => [
        ...prev,
        {
          id: Date.now(),
          x: boatPosition.x + (Math.random() - 0.5) * spawnRadius * 2,
          z: boatPosition.z + (Math.random() - 0.5) * spawnRadius * 2,
          type: Math.random() > 0.7 ? "star" : "coin",
        },
      ])
    }
  })

  const removeFish = (id: number) => {
    setFish((prev) => prev.filter((f) => f.id !== id))
  }

  const removeTarget = (id: number) => {
    setTargets((prev) => prev.filter((t) => t.id !== id))
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
