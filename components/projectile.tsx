"use client"

import { useRef, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { Sphere, Trail } from "@react-three/drei"
import * as THREE from "three"

interface ProjectileProps {
  position: [number, number, number]
  direction: [number, number, number]
  speed: number
  onHit?: (position: [number, number, number]) => void
  onExpire?: () => void
}

export function Projectile({ position, direction, speed, onHit, onExpire }: ProjectileProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const startTime = useRef(Date.now())
  const maxLifetime = 5000 // 5 seconds max lifetime

  useFrame((state, delta) => {
    if (!meshRef.current) return

    // Move projectile
    const velocity = new THREE.Vector3(...direction).multiplyScalar(speed * delta)
    meshRef.current.position.add(velocity)

    // Check if projectile should expire
    if (Date.now() - startTime.current > maxLifetime) {
      onExpire?.()
      return
    }

    // Simple collision detection with water surface (y = 0)
    if (meshRef.current.position.y <= 0) {
      onHit?.(meshRef.current.position.toArray() as [number, number, number])
      return
    }

    // Remove if too far away
    if (meshRef.current.position.length() > 200) {
      onExpire?.()
    }
  })

  return (
    <group>
      {/* Projectile trail */}
      <Trail
        width={0.5}
        length={10}
        color="orange"
        attenuation={(width) => width * 0.5}
      >
        {/* Projectile sphere */}
        <Sphere ref={meshRef} position={position} args={[0.1, 8, 8]}>
          <meshStandardMaterial color="orange" emissive="orange" emissiveIntensity={0.3} />
        </Sphere>
      </Trail>
    </group>
  )
}

// Crosshair/Targeting system component
export function Crosshair() {
  return (
    <div className="fixed inset-0 z-10 pointer-events-none flex items-start justify-center pt-24">
      {/* Litt ned fra toppen (20% ned) for å sikte på flyvende mål */}
      <div className="relative">
        {/* Main crosshair - hvitt og tydeligere */}
        <div className="w-12 h-12 border-3 border-white border-opacity-90 rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>

        {/* Crosshair lines - hvite og tydeligere */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-16 h-1 bg-white opacity-80"></div>
          <div className="w-1 h-16 bg-white opacity-80 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>

        {/* Corner indicators - hvite for casual spill */}
        <div className="absolute -top-8 -left-8 w-4 h-4 border-l-2 border-t-2 border-white opacity-70"></div>
        <div className="absolute -top-8 -right-8 w-4 h-4 border-r-2 border-t-2 border-white opacity-70"></div>
        <div className="absolute -bottom-8 -left-8 w-4 h-4 border-l-2 border-b-2 border-white opacity-70"></div>
        <div className="absolute -bottom-8 -right-8 w-4 h-4 border-r-2 border-b-2 border-white opacity-70"></div>

        {/* Fugl-indikator */}
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-white text-xs font-bold opacity-80">
          🐦 FUGLESIKTE
        </div>
      </div>
    </div>
  )
}
