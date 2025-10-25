"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { RigidBody, type RapierRigidBody } from "@react-three/rapier"
import { useGameStore } from "@/store/game-store"
import type * as THREE from "three"

interface CollectibleProps {
  id: number
  position: [number, number, number]
  type: string
  onCollect: (id: number) => void
}

export function Collectible({ id, position, type, onCollect }: CollectibleProps) {
  const collectibleRef = useRef<RapierRigidBody>(null)
  const meshRef = useRef<THREE.Mesh>(null)
  const boatPosition = useGameStore((state) => state.boatPosition)
  const addScore = useGameStore((state) => state.addScore)
  const incrementCollectiblesFound = useGameStore((state) => state.incrementCollectiblesFound)

  useFrame(({ clock }) => {
    if (!meshRef.current || !collectibleRef.current) return

    const time = clock.getElapsedTime()
    meshRef.current.rotation.y += 0.05
    meshRef.current.position.y = position[1] + Math.sin(time * 2 + id) * 0.3

    const collectiblePos = collectibleRef.current.translation()
    const distance = Math.sqrt(
      Math.pow(collectiblePos.x - boatPosition.x, 2) + Math.pow(collectiblePos.z - boatPosition.z, 2),
    )

    if (distance < 3) {
      addScore(type === "star" ? 50 : 15)
      incrementCollectiblesFound()
      onCollect(id)
    }
  })

  const color = type === "star" ? "#FFD700" : "#FFA500"
  const geometry = type === "star" ? <octahedronGeometry args={[0.5]} /> : <sphereGeometry args={[0.4]} />

  return (
    <RigidBody ref={collectibleRef} position={position} type="kinematicPosition" colliders="ball" sensor>
      <mesh ref={meshRef} castShadow>
        {geometry}
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} emissive={color} emissiveIntensity={0.3} />
      </mesh>
    </RigidBody>
  )
}
