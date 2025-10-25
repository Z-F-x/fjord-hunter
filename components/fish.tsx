"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { RigidBody, type RapierRigidBody } from "@react-three/rapier"
import { useGameStore } from "@/store/game-store"
import type * as THREE from "three"

interface FishProps {
  id: number
  position: [number, number, number]
  onCatch: (id: number) => void
}

export function Fish({ id, position, onCatch }: FishProps) {
  const fishRef = useRef<RapierRigidBody>(null)
  const meshRef = useRef<THREE.Group>(null)
  const boatPosition = useGameStore((state) => state.boatPosition)
  const isFishing = useGameStore((state) => state.isFishing)
  const addScore = useGameStore((state) => state.addScore)
  const incrementFishCaught = useGameStore((state) => state.incrementFishCaught)

  useFrame(({ clock }) => {
    if (!meshRef.current) return

    const time = clock.getElapsedTime()
    meshRef.current.position.y = position[1] + Math.sin(time * 2 + id) * 0.2
    meshRef.current.rotation.y = Math.sin(time + id) * 0.3

    if (isFishing && fishRef.current) {
      const fishPos = fishRef.current.translation()
      const distance = Math.sqrt(Math.pow(fishPos.x - boatPosition.x, 2) + Math.pow(fishPos.z - boatPosition.z, 2))

      if (distance < 5) {
        addScore(10)
        incrementFishCaught()
        onCatch(id)
      }
    }
  })

  return (
    <RigidBody ref={fishRef} position={position} type="kinematicPosition" colliders="ball" sensor>
      <group ref={meshRef}>
        <mesh castShadow>
          <sphereGeometry args={[0.3, 8, 8]} />
          <meshStandardMaterial color="#FF6B35" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0.3, 0, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
          <coneGeometry args={[0.2, 0.4, 3]} />
          <meshStandardMaterial color="#FF8C42" />
        </mesh>
      </group>
    </RigidBody>
  )
}
