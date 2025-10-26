"use client"

import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { RigidBody, type RapierRigidBody } from "@react-three/rapier"
import { useGameStore } from "@/store/game-store"
import * as THREE from "three"

interface FlyingTargetProps {
  id: string
  startPosition: [number, number, number]
  onHit: (id: string) => void
}

export function FlyingTarget({ id, startPosition, onHit }: FlyingTargetProps) {
  const targetRef = useRef<RapierRigidBody>(null)
  const meshRef = useRef<THREE.Group>(null)
  const [isHit, setIsHit] = useState(false)
  const addScore = useGameStore((state) => state.addScore)
  const incrementTargetsHit = useGameStore((state) => state.incrementTargetsHit)
  const addExplosion = useGameStore((state) => state.addExplosion)
  const removeProjectile = useGameStore((state) => state.removeProjectile)
  const playSoundEffect = useGameStore((state) => state.playSoundEffect)

  useFrame(({ clock }) => {
    if (!targetRef.current || !meshRef.current || isHit) return

    const time = clock.getElapsedTime()
    const currentPos = targetRef.current.translation()

    // Flying pattern - circular motion with some variation
    const radius = 35 // Litt større radius for bedre synlighet
    const speed = 0.6 // Litt langsommere for lettere sikte
    const height = 20 + Math.sin(time * 2) * 4 // VELDIG høyt, mellom 16-24 units

    targetRef.current.setTranslation(
      {
        x: startPosition[0] + Math.sin(time * speed) * radius,
        y: height,
        z: startPosition[2] + Math.cos(time * speed) * radius,
      },
      true,
    )

    // Wing flapping animation
    meshRef.current.rotation.z = Math.sin(time * 8) * 0.3

    // Check collision with projectiles
    const projectiles = useGameStore.getState().projectiles
    projectiles.forEach((projectile) => {
      const targetPos = targetRef.current?.translation()
      if (!targetPos) return

      const distance = Math.sqrt(
        Math.pow(projectile.position[0] - targetPos.x, 2) +
        Math.pow(projectile.position[1] - targetPos.y, 2) +
        Math.pow(projectile.position[2] - targetPos.z, 2)
      )

      // Hit detection - MEGET generøs hitbox for casual spill!
      if (distance < 6 && !isHit) {
        setIsHit(true)
        addScore(100) // High points for flying targets
        incrementTargetsHit()
        removeProjectile(projectile.id)
        addExplosion([targetPos.x, targetPos.y, targetPos.z], "hit")

        // Play hit sound
        playSoundEffect.hit()

        // Remove this target after short delay
        setTimeout(() => onHit(id), 500)
      }
    })
  })

  if (isHit) {
    return null // Hide the target after hit
  }

  return (
    <RigidBody ref={targetRef} position={startPosition} type="kinematicPosition" colliders="ball" sensor>
      <group ref={meshRef}>
        {/* Bird body - større for casual spill */}
        <mesh castShadow>
          <boxGeometry args={[2, 1, 0.6]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>

        {/* Wings - større og mer synlige */}
        <mesh position={[-1.2, 0, 0]} rotation={[0, 0, 0.2]} castShadow>
          <boxGeometry args={[2.5, 0.2, 1.2]} />
          <meshStandardMaterial color="#A0522D" />
        </mesh>
        <mesh position={[1.2, 0, 0]} rotation={[0, 0, -0.2]} castShadow>
          <boxGeometry args={[2.5, 0.2, 1.2]} />
          <meshStandardMaterial color="#A0522D" />
        </mesh>

        {/* Head - større */}
        <mesh position={[0, 0.3, 0.5]} castShadow>
          <sphereGeometry args={[0.5, 8, 8]} />
          <meshStandardMaterial color="#654321" />
        </mesh>

        {/* Beak - større */}
        <mesh position={[0, 0.2, 1]} castShadow>
          <coneGeometry args={[0.15, 0.5, 6]} />
          <meshStandardMaterial color="#FFA500" />
        </mesh>
      </group>
    </RigidBody>
  )
}

// Flying targets manager component
export function FlyingTargets() {
  const [targets, setTargets] = useState<Array<{
    id: string
    position: [number, number, number]
  }>>([
    { id: "bird1", position: [20, 20, 20] },
    { id: "bird2", position: [-25, 22, 15] },
    { id: "bird3", position: [15, 18, -30] },
    { id: "bird4", position: [-20, 24, -20] },
    { id: "bird5", position: [35, 21, 10] },
  ])

  const handleTargetHit = (id: string) => {
    // Remove the hit target and respawn a new one after some time
    setTargets(prev => prev.filter(t => t.id !== id))

    // Respawn after 10 seconds in a random position
    setTimeout(() => {
      const angle = Math.random() * Math.PI * 2
      const radius = 25 + Math.random() * 20
      const newTarget = {
        id: `bird-${Date.now()}-${Math.random()}`,
        position: [
          Math.sin(angle) * radius,
          18 + Math.random() * 6, // Spawn høyt oppe, mellom 18-24
          Math.cos(angle) * radius
        ] as [number, number, number]
      }
      setTargets(prev => [...prev, newTarget])
    }, 10000)
  }

  return (
    <>
      {targets.map((target) => (
        <FlyingTarget
          key={target.id}
          id={target.id}
          startPosition={target.position}
          onHit={handleTargetHit}
        />
      ))}
    </>
  )
}
