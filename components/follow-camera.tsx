"use client"

import { useRef } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { PerspectiveCamera } from "@react-three/drei"
import * as THREE from "three"
import { useGameStore } from "@/store/game-store"

export function FollowCamera() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null)
  const { camera } = useThree()
  const boatPosition = useGameStore((state) => state.boatPosition)
  const boatRotation = useGameStore((state) => state.boatRotation)

  useFrame(() => {
    if (!cameraRef.current) return

    // Increased distance for more zoomed out view
    const offset = new THREE.Vector3(0, 12, 20)
    const rotationQuaternion = new THREE.Quaternion(boatRotation.x, boatRotation.y, boatRotation.z, boatRotation.w)
    offset.applyQuaternion(rotationQuaternion)

    const targetPosition = new THREE.Vector3(boatPosition.x, boatPosition.y, boatPosition.z).add(offset)

    cameraRef.current.position.lerp(targetPosition, 0.08)

    // Look at boat with slight forward offset for better view
    const lookAtTarget = new THREE.Vector3(boatPosition.x, boatPosition.y + 2, boatPosition.z)
    cameraRef.current.lookAt(lookAtTarget)
  })

  return <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 15, 25]} fov={60} />
}
