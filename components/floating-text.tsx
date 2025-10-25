"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Text } from "@react-three/drei"
import type * as THREE from "three"

interface FloatingTextProps {
  text: string
  position: [number, number, number]
  color: string
}

export function FloatingText({ text, position, color }: FloatingTextProps) {
  const textRef = useRef<THREE.Mesh>(null)
  const timeRef = useRef(0)

  useFrame((_, delta) => {
    if (!textRef.current) return

    timeRef.current += delta
    textRef.current.position.y += delta * 2

    const opacity = Math.max(0, 1 - timeRef.current * 0.5)
    if (textRef.current.material) {
      ;(textRef.current.material as THREE.MeshBasicMaterial).opacity = opacity
    }
  })

  return (
    <Text
      ref={textRef}
      position={[position[0], position[1] + 2, position[2]]}
      fontSize={1}
      color={color}
      anchorX="center"
      anchorY="middle"
      outlineWidth={0.1}
      outlineColor="#000000"
    >
      {text}
    </Text>
  )
}
