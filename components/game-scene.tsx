"use client"

import { Canvas } from "@react-three/fiber"
import { Sky, Environment } from "@react-three/drei"
import { Physics } from "@react-three/rapier"
import { Suspense } from "react"
import { Boat } from "./boat"
import { Ocean } from "./ocean"
import { GameUI } from "./game-ui"
import { FollowCamera } from "./follow-camera"
import { GameObjects } from "./game-objects"
import { UnderwaterEffect } from "./underwater-effect"
import { ExplosionEffect } from "./explosion-effect"
import { SparkleEffect } from "./sparkle-effect"
import { FloatingText } from "./floating-text"
import { useGameStore } from "@/store/game-store"

export default function GameScene() {
  const explosions = useGameStore((state) => state.explosions)
  const sparkles = useGameStore((state) => state.sparkles)
  const floatingTexts = useGameStore((state) => state.floatingTexts)
  const removeExplosion = useGameStore((state) => state.removeExplosion)
  const removeSparkle = useGameStore((state) => state.removeSparkle)

  return (
    <div className="h-screen w-full">
      <Canvas shadows>
        <fog attach="fog" args={["#87CEEB", 50, 400]} />

        <FollowCamera />

        <Suspense fallback={null}>
          <Sky sunPosition={[100, 20, 100]} />
          <Environment preset="sunset" />

          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow shadow-mapSize={[1024, 1024]} />

          <Physics gravity={[0, -9.81, 0]}>
            <Ocean />
            <Boat />
            <GameObjects />
          </Physics>

          {explosions.map((explosion) => (
            <ExplosionEffect
              key={explosion.id}
              position={explosion.position}
              type={explosion.type}
              onComplete={() => removeExplosion(explosion.id)}
            />
          ))}

          {sparkles.map((sparkle) => (
            <SparkleEffect key={sparkle.id} position={sparkle.position} onComplete={() => removeSparkle(sparkle.id)} />
          ))}

          {floatingTexts.map((text) => (
            <FloatingText key={text.id} text={text.text} position={text.position} color={text.color} />
          ))}
        </Suspense>
      </Canvas>

      <UnderwaterEffect />
      <GameUI />
    </div>
  )
}
