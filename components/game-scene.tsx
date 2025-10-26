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
import { FishingNet } from "./fishing-net"
import { useGameStore } from "@/store/game-store"
import { Projectile, Crosshair } from "./projectile"
import { FlyingTargets } from "./flying-targets"
import { Collectibles } from "./collectibles"
import { HowToPlayModal } from "./how-to-play"

export default function GameScene() {
  const explosions = useGameStore((state) => state.explosions)
  const sparkles = useGameStore((state) => state.sparkles)
  const floatingTexts = useGameStore((state) => state.floatingTexts)
  const projectiles = useGameStore((state) => state.projectiles)
  const isFishing = useGameStore((state) => state.isFishing)
  const boatPosition = useGameStore((state) => state.boatPosition)
  const removeExplosion = useGameStore((state) => state.removeExplosion)
  const removeSparkle = useGameStore((state) => state.removeSparkle)
  const removeProjectile = useGameStore((state) => state.removeProjectile)
  const addExplosion = useGameStore((state) => state.addExplosion)

  return (
    <div className="h-screen w-full">
      <Canvas shadows>
        <fog attach="fog" args={["#87CEEB", 80, 600]} />

        <FollowCamera />

        <Suspense fallback={null}>
          <Sky sunPosition={[100, 20, 100]} />
          <Environment preset="sunset" />

          <ambientLight intensity={0.4} />
          <directionalLight
            position={[50, 80, 20]}
            intensity={1.2}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-far={200}
            shadow-camera-left={-50}
            shadow-camera-right={50}
            shadow-camera-top={50}
            shadow-camera-bottom={-50}
          />
          {/* Additional light for better ocean visibility */}
          <pointLight position={[0, 15, 0]} intensity={0.3} color="#ffffff" />

          <Physics gravity={[0, -9.81, 0]}>
            <Ocean />
            <Boat />
            <GameObjects />
            <FlyingTargets />
            <Collectibles />
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

          {/* Fishing Net Animation */}
          <FishingNet
            isVisible={isFishing}
            position={[boatPosition.x, boatPosition.y, boatPosition.z]}
          />

          {projectiles.map((projectile) => (
            <Projectile
              key={projectile.id}
              position={projectile.position}
              direction={projectile.direction}
              speed={projectile.speed}
              onHit={(position) => {
                // Create splash/hit effect
                addExplosion(position, "hit")
                removeProjectile(projectile.id)
              }}
              onExpire={() => removeProjectile(projectile.id)}
            />
          ))}
        </Suspense>
      </Canvas>

      <Crosshair />
      <UnderwaterEffect />
      <GameUI />
      <HowToPlayModal />
    </div>
  )
}
