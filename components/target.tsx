"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { RigidBody, type RapierRigidBody } from "@react-three/rapier"
import { useGameStore } from "@/store/game-store"
import * as THREE from "three"

interface TargetProps {
  id: number
  position: [number, number, number]
  onHit: (id: number) => void
}

export function Target({ id, position, onHit }: TargetProps) {
  const targetRef = useRef<RapierRigidBody>(null)
  const meshRef = useRef<THREE.Group>(null)
  const boatPosition = useGameStore((state) => state.boatPosition)
  const isShooting = useGameStore((state) => state.isShooting)
  const boatRotation = useGameStore((state) => state.boatRotation)
  const addScore = useGameStore((state) => state.addScore)
  const incrementTargetsHit = useGameStore((state) => state.incrementTargetsHit)

  useFrame(({ clock }) => {
    if (!meshRef.current || !targetRef.current) return

    const time = clock.getElapsedTime()
    const currentPos = targetRef.current.translation()
    targetRef.current.setTranslation(
      {
        x: currentPos.x + Math.sin(time * 0.5 + id) * 0.02,
        y: position[1] + Math.sin(time * 2 + id) * 0.5,
        z: currentPos.z + Math.cos(time * 0.5 + id) * 0.02,
      },
      true,
    )

    meshRef.current.rotation.y += 0.02

    // Check collision with projectiles instead of just shooting direction
    const projectiles = useGameStore.getState().projectiles
    projectiles.forEach((projectile) => {
      const targetPos = targetRef.current?.translation()
      if (!targetPos) return

      const distance = Math.sqrt(
        Math.pow(projectile.position[0] - targetPos.x, 2) +
        Math.pow(projectile.position[1] - targetPos.y, 2) +
        Math.pow(projectile.position[2] - targetPos.z, 2)
      )

      // Hit detection
      if (distance < 1.5) {
        addScore(50) // More points for hitting targets
        incrementTargetsHit()
        useGameStore.getState().removeProjectile(projectile.id)
        onHit(id)
      }
    })

    // Old shooting logic for backwards compatibility
    if (isShooting) {
      const targetPos = targetRef.current.translation()

      const boatQuat = new THREE.Quaternion(boatRotation.x, boatRotation.y, boatRotation.z, boatRotation.w)
      const shootDirection = new THREE.Vector3(0, 0, -1).applyQuaternion(boatQuat)

      const toTarget = new THREE.Vector3(
        targetPos.x - boatPosition.x,
        targetPos.y - boatPosition.y,
        targetPos.z - boatPosition.z,
      )

      const distance = toTarget.length()
      toTarget.normalize()

      const dotProduct = shootDirection.dot(toTarget)

      if (dotProduct > 0.85 && distance < 30) {
        addScore(25)
        incrementTargetsHit()
        onHit(id)
      }
    }
  })

  return (
    <RigidBody ref={targetRef} position={position} type="kinematicPosition" colliders="ball" sensor>
      <group ref={meshRef}>
        <mesh castShadow>
          <sphereGeometry args={[0.4, 8, 8]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        <mesh position={[-0.5, 0, 0]} rotation={[0, 0, Math.PI / 6]} castShadow>
          <boxGeometry args={[0.8, 0.1, 0.4]} />
          <meshStandardMaterial color="#A0522D" />
        </mesh>
        <mesh position={[0.5, 0, 0]} rotation={[0, 0, -Math.PI / 6]} castShadow>
          <boxGeometry args={[0.8, 0.1, 0.4]} />
          <meshStandardMaterial color="#A0522D" />
        </mesh>
      </group>
    </RigidBody>
  )
}
