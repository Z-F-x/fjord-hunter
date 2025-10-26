"use client"

import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { RigidBody, type RapierRigidBody } from "@react-three/rapier"
import { useGameStore } from "@/store/game-store"
import * as THREE from "three"

interface CollectibleProps {
  id: string
  type: 'pearl' | 'diamond'
  position: [number, number, number]
  onCollect: (id: string, type: 'pearl' | 'diamond') => void
}

export function Collectible({ id, type, position, onCollect }: CollectibleProps) {
  const collectibleRef = useRef<RapierRigidBody>(null)
  const meshRef = useRef<THREE.Group>(null)
  const [isCollected, setIsCollected] = useState(false)
  const boatPosition = useGameStore((state) => state.boatPosition)
  const addScore = useGameStore((state) => state.addScore)
  const incrementCollectiblesFound = useGameStore((state) => state.incrementCollectiblesFound)
  const addSparkle = useGameStore((state) => state.addSparkle)
  const playSoundEffect = useGameStore((state) => state.playSoundEffect)

  useFrame(({ clock }) => {
    if (!collectibleRef.current || !meshRef.current || isCollected) return

    const time = clock.getElapsedTime()

    // Gentle floating motion
    const currentPos = collectibleRef.current.translation()
    collectibleRef.current.setTranslation(
      {
        x: currentPos.x,
        y: position[1] + Math.sin(time * 2 + parseFloat(id.slice(-3))) * 0.3,
        z: currentPos.z,
      },
      true,
    )

    // Rotation animation
    meshRef.current.rotation.y = time * 1.5

    // Check collision with boat
    const distance = Math.sqrt(
      Math.pow(currentPos.x - boatPosition.x, 2) +
      Math.pow(currentPos.y - boatPosition.y, 2) +
      Math.pow(currentPos.z - boatPosition.z, 2)
    )

    // Collect detection - generous hitbox for casual gameplay
    if (distance < 4 && !isCollected) {
      setIsCollected(true)

      // Points based on type
      const points = type === 'diamond' ? 50 : 25
      addScore(points)
      incrementCollectiblesFound()
      addSparkle([currentPos.x, currentPos.y, currentPos.z])

      // Play collect sound based on type
      if (type === 'diamond') {
        playSoundEffect.collectTreasure() // Treasure sound for diamonds
      } else {
        playSoundEffect.collectCoin() // Coin sound for pearls
      }

      // Remove after sparkle effect
      setTimeout(() => onCollect(id, type), 200)
    }
  })

  if (isCollected) {
    return null
  }

  return (
    <RigidBody ref={collectibleRef} position={position} type="kinematicPosition" colliders="ball" sensor>
      <group ref={meshRef}>
        {type === 'pearl' ? (
          // Pearl - hvit perle
          <>
            <mesh castShadow>
              <sphereGeometry args={[0.4, 16, 16]} />
              <meshStandardMaterial
                color="#F8F8FF"
                metalness={0.1}
                roughness={0.1}
                emissive="#E6E6FA"
                emissiveIntensity={0.2}
              />
            </mesh>
            {/* Inner glow */}
            <mesh scale={0.8}>
              <sphereGeometry args={[0.4, 8, 8]} />
              <meshBasicMaterial
                color="#FFFFFF"
                transparent
                opacity={0.3}
              />
            </mesh>
          </>
        ) : (
          // Diamond - blå diamant
          <>
            <mesh castShadow rotation={[0.3, 0, 0.3]}>
              <octahedronGeometry args={[0.5, 0]} />
              <meshStandardMaterial
                color="#4169E1"
                metalness={0.9}
                roughness={0.1}
                emissive="#1E90FF"
                emissiveIntensity={0.3}
              />
            </mesh>
            {/* Diamond sparkle */}
            <mesh scale={1.2} rotation={[0.3, Math.PI/4, 0.3]}>
              <octahedronGeometry args={[0.5, 0]} />
              <meshBasicMaterial
                color="#87CEEB"
                transparent
                opacity={0.2}
              />
            </mesh>
          </>
        )}
      </group>
    </RigidBody>
  )
}

// Collectibles manager
export function Collectibles() {
  const [collectibles, setCollectibles] = useState<Array<{
    id: string
    type: 'pearl' | 'diamond'
    position: [number, number, number]
  }>>([
    // Initial pearls
    { id: "pearl1", type: 'pearl', position: [15, 1, 25] },
    { id: "pearl2", type: 'pearl', position: [-20, 1, 15] },
    { id: "pearl3", type: 'pearl', position: [25, 1, -30] },
    { id: "pearl4", type: 'pearl', position: [-15, 1, -20] },

    // Initial diamonds (rarer)
    { id: "diamond1", type: 'diamond', position: [30, 1.5, 10] },
    { id: "diamond2", type: 'diamond', position: [-35, 1.5, -15] },
  ])

  const handleCollect = (id: string, type: 'pearl' | 'diamond') => {
    // Remove collected item
    setCollectibles(prev => prev.filter(c => c.id !== id))

    // Respawn after some time
    const respawnTime = type === 'diamond' ? 30000 : 15000 // Diamonds are rarer
    setTimeout(() => {
      const angle = Math.random() * Math.PI * 2
      const radius = 20 + Math.random() * 30
      const newCollectible = {
        id: `${type}-${Date.now()}-${Math.random()}`,
        type,
        position: [
          Math.sin(angle) * radius,
          type === 'diamond' ? 1.5 : 1,
          Math.cos(angle) * radius
        ] as [number, number, number]
      }
      setCollectibles(prev => [...prev, newCollectible])
    }, respawnTime)
  }

  return (
    <>
      {collectibles.map((collectible) => (
        <Collectible
          key={collectible.id}
          id={collectible.id}
          type={collectible.type}
          position={collectible.position}
          onCollect={handleCollect}
        />
      ))}
    </>
  )
}
