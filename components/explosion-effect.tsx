"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

interface ExplosionEffectProps {
  position: [number, number, number]
  onComplete: () => void
  type?: "hit" | "collect"
}

export function ExplosionEffect({ position, onComplete, type = "hit" }: ExplosionEffectProps) {
  const particlesRef = useRef<THREE.Points>(null)
  const timeRef = useRef(0)
  const particleCount = 20

  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(particleCount * 3)
  const velocities = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3
    positions[i3] = position[0]
    positions[i3 + 1] = position[1]
    positions[i3 + 2] = position[2]

    const angle = Math.random() * Math.PI * 2
    const speed = 2 + Math.random() * 3
    velocities[i3] = Math.cos(angle) * speed
    velocities[i3 + 1] = Math.random() * 3 + 2
    velocities[i3 + 2] = Math.sin(angle) * speed

    if (type === "collect") {
      colors[i3] = 1
      colors[i3 + 1] = 0.8 + Math.random() * 0.2
      colors[i3 + 2] = 0
    } else {
      colors[i3] = 1
      colors[i3 + 1] = 0.3 + Math.random() * 0.3
      colors[i3 + 2] = 0
    }
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute("velocity", new THREE.BufferAttribute(velocities, 3))
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))

  useFrame((_, delta) => {
    if (!particlesRef.current) return

    timeRef.current += delta

    const positions = geometry.attributes.position.array as Float32Array
    const velocities = geometry.attributes.velocity.array as Float32Array

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      positions[i3] += velocities[i3] * delta
      positions[i3 + 1] += velocities[i3 + 1] * delta
      positions[i3 + 2] += velocities[i3 + 2] * delta

      velocities[i3 + 1] -= 9.8 * delta
    }

    geometry.attributes.position.needsUpdate = true

    if (timeRef.current > 1.5) {
      onComplete()
    }
  })

  return (
    <points ref={particlesRef} geometry={geometry}>
      <pointsMaterial size={0.3} vertexColors transparent opacity={0.8} />
    </points>
  )
}
