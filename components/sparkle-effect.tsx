"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

interface SparkleEffectProps {
  position: [number, number, number]
  onComplete: () => void
}

export function SparkleEffect({ position, onComplete }: SparkleEffectProps) {
  const particlesRef = useRef<THREE.Points>(null)
  const timeRef = useRef(0)
  const particleCount = 30

  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)
  const sizes = new Float32Array(particleCount)

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3
    const radius = Math.random() * 2
    const angle = Math.random() * Math.PI * 2
    positions[i3] = position[0] + Math.cos(angle) * radius
    positions[i3 + 1] = position[1] + Math.random() * 2
    positions[i3 + 2] = position[2] + Math.sin(angle) * radius

    colors[i3] = 1
    colors[i3 + 1] = 0.9 + Math.random() * 0.1
    colors[i3 + 2] = 0.2 + Math.random() * 0.3

    sizes[i] = 0.2 + Math.random() * 0.3
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1))

  useFrame((_, delta) => {
    if (!particlesRef.current) return

    timeRef.current += delta

    const positions = geometry.attributes.position.array as Float32Array
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      positions[i3 + 1] += delta * 2
    }

    geometry.attributes.position.needsUpdate = true
    particlesRef.current.material.opacity = Math.max(0, 1 - timeRef.current * 2)

    if (timeRef.current > 1) {
      onComplete()
    }
  })

  return (
    <points ref={particlesRef} geometry={geometry}>
      <pointsMaterial size={0.4} vertexColors transparent opacity={1} />
    </points>
  )
}
