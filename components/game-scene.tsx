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

export default function GameScene() {
  return (
    <div className="h-screen w-full">
      <Canvas shadows>
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
        </Suspense>
      </Canvas>

      <UnderwaterEffect />
      <GameUI />
    </div>
  )
}
