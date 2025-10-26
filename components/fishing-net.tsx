"use client"

import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh } from 'three'
import * as THREE from 'three'

interface FishingNetProps {
  isVisible: boolean
  position: [number, number, number]
  onCatchComplete?: () => void
}

export function FishingNet({ isVisible, position, onCatchComplete }: FishingNetProps) {
  const netRef = useRef<Mesh>(null)
  const animationPhase = useRef(0)
  const isAnimating = useRef(false)
  const startTime = useRef(0)

  useEffect(() => {
    if (isVisible && !isAnimating.current) {
      isAnimating.current = true
      startTime.current = Date.now()
      animationPhase.current = 0
    } else if (!isVisible) {
      isAnimating.current = false
      animationPhase.current = 0
    }
  }, [isVisible])

  useFrame(() => {
    if (!netRef.current || !isAnimating.current) return

    const elapsed = Date.now() - startTime.current
    const totalDuration = 2000 // 2 seconds total animation

    if (elapsed >= totalDuration) {
      isAnimating.current = false
      if (onCatchComplete) onCatchComplete()
      return
    }

    const progress = elapsed / totalDuration

    // Phase 1: Drop down (0-0.4)
    // Phase 2: Spread out (0.4-0.7)
    // Phase 3: Pull up (0.7-1.0)

    if (progress < 0.4) {
      // Dropping phase
      const dropProgress = progress / 0.4
      const y = position[1] + 5 - (dropProgress * 8) // Drop down 8 units
      netRef.current.position.set(position[0], y, position[2])
      netRef.current.scale.setScalar(0.5 + dropProgress * 0.5) // Grow as it drops
    } else if (progress < 0.7) {
      // Spreading phase
      const spreadProgress = (progress - 0.4) / 0.3
      const y = position[1] - 3 + Math.sin(spreadProgress * Math.PI) * 0.5
      netRef.current.position.set(position[0], y, position[2])
      netRef.current.scale.setScalar(1 + spreadProgress * 0.3) // Spread wider

      // Rotate slightly for realism
      netRef.current.rotation.y = spreadProgress * 0.2
    } else {
      // Pulling up phase
      const pullProgress = (progress - 0.7) / 0.3
      const y = position[1] - 3 + pullProgress * 8 // Pull back up
      netRef.current.position.set(position[0], y, position[2])
      netRef.current.scale.setScalar(1.3 - pullProgress * 0.8) // Shrink as it rises

      // Return rotation to normal
      netRef.current.rotation.y = 0.2 * (1 - pullProgress)
    }

    // Add slight swaying motion throughout
    const sway = Math.sin(elapsed * 0.005) * 0.1
    netRef.current.rotation.z = sway
  })

  if (!isVisible && !isAnimating.current) return null

  return (
    <mesh ref={netRef} position={position}>
      {/* Net geometry - circular with holes */}
      <cylinderGeometry args={[1, 1.2, 0.1, 16, 1, true]} />
      <meshBasicMaterial
        color="#8B4513"
        transparent
        opacity={0.7}
        side={THREE.DoubleSide}
        wireframe={false}
      />

      {/* Net mesh pattern */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.95, 1.15, 0.12, 32]} />
        <meshBasicMaterial
          color="#654321"
          wireframe={true}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Inner mesh detail */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.8, 1.0, 0.08, 24]} />
        <meshBasicMaterial
          color="#5D4037"
          wireframe={true}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Rope edges */}
      <mesh position={[0, 0.05, 0]}>
        <torusGeometry args={[1.1, 0.02, 8, 32]} />
        <meshBasicMaterial color="#3E2723" />
      </mesh>

      <mesh position={[0, -0.05, 0]}>
        <torusGeometry args={[1.25, 0.02, 8, 32]} />
        <meshBasicMaterial color="#3E2723" />
      </mesh>
    </mesh>
  )
}
