"use client"

import { useRef, useEffect, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { RigidBody, type RapierRigidBody } from "@react-three/rapier"
import { useKeyboardControls } from "@/hooks/use-keyboard-controls"
import { useGameStore } from "@/store/game-store"
import * as THREE from "three"

export function Boat() {
  const boatRef = useRef<RapierRigidBody>(null)
  const muzzleFlashRef = useRef<THREE.Mesh>(null)
  const { forward, backward, left, right, space, shift } = useKeyboardControls()
  const mobileControls = useGameStore((state) => state.mobileControls)
  const setBoatPosition = useGameStore((state) => state.setBoatPosition)
  const setBoatRotation = useGameStore((state) => state.setBoatRotation)
  const setBoatSpeed = useGameStore((state) => state.setBoatSpeed)
  const setIsFishing = useGameStore((state) => state.setIsFishing)
  const setIsShooting = useGameStore((state) => state.setIsShooting)
  const setIsUnderwater = useGameStore((state) => state.setIsUnderwater)

  const [showMuzzleFlash, setShowMuzzleFlash] = useState(false)
  const [recoilOffset, setRecoilOffset] = useState(0)

  useEffect(() => {
    if (space) {
      setIsFishing(true)
      setTimeout(() => setIsFishing(false), 500)
    }
  }, [space, setIsFishing])

  useEffect(() => {
    if (shift) {
      setIsShooting(true)
      setShowMuzzleFlash(true)
      setRecoilOffset(-0.5)

      setTimeout(() => {
        setShowMuzzleFlash(false)
        setIsShooting(false)
      }, 250)

      setTimeout(() => {
        setRecoilOffset(0)
      }, 200)
    }
  }, [shift, setIsShooting])

  useFrame(() => {
    if (!boatRef.current) return

    const impulseStrength = 20.0 // Increased for faster acceleration
    const baseRotationSpeed = 0.03 // Base rotation speed, will be multiplied by velocity for natural steering
    const maxSpeed = 300

    const velocity = boatRef.current.linvel()
    const currentSpeed = Math.sqrt(velocity.x ** 2 + velocity.z ** 2)

    const isForward = forward || mobileControls.forward
    const isBackward = backward || mobileControls.backward
    const isLeft = left || mobileControls.left
    const isRight = right || mobileControls.right

    const rotation = boatRef.current.rotation()
    const euler = new THREE.Euler().setFromQuaternion(
      new THREE.Quaternion(rotation.x, rotation.y, rotation.z, rotation.w),
    )

    const speedFactor = Math.min(currentSpeed / 20, 1) // Normalize speed for turning
    const turnRate = baseRotationSpeed + speedFactor * 0.08 // Faster turning when moving

    if (isLeft) {
      const newRotation = new THREE.Quaternion().setFromEuler(new THREE.Euler(euler.x, euler.y + turnRate, euler.z))
      boatRef.current.setRotation(newRotation, true)
    }
    if (isRight) {
      const newRotation = new THREE.Quaternion().setFromEuler(new THREE.Euler(euler.x, euler.y - turnRate, euler.z))
      boatRef.current.setRotation(newRotation, true)
    }

    if (isForward && currentSpeed < maxSpeed) {
      const forwardDir = new THREE.Vector3(0, 0, -1).applyEuler(euler)
      boatRef.current.applyImpulse({ x: forwardDir.x * impulseStrength, y: 0, z: forwardDir.z * impulseStrength }, true)
    }
    if (isBackward && currentSpeed < maxSpeed) {
      const forwardDir = new THREE.Vector3(0, 0, -1).applyEuler(euler)
      boatRef.current.applyImpulse(
        { x: -forwardDir.x * impulseStrength * 0.5, y: 0, z: -forwardDir.z * impulseStrength * 0.5 },
        true,
      )
    }

    if (!isForward && !isBackward && currentSpeed > 0.5) {
      const dragForce = 0.95
      boatRef.current.setLinvel({ x: velocity.x * dragForce, y: velocity.y, z: velocity.z * dragForce }, true)
    }

    const position = boatRef.current.translation()
    const waterLevel = 0.5

    if (position.y < -0.5) {
      const buoyancyForce = (waterLevel - position.y) * 150
      boatRef.current.applyImpulse({ x: 0, y: buoyancyForce, z: 0 }, true)
      setIsUnderwater(true)
    } else {
      if (position.y < waterLevel) {
        const buoyancyForce = (waterLevel - position.y) * 150
        boatRef.current.applyImpulse({ x: 0, y: buoyancyForce, z: 0 }, true)
      }
      setIsUnderwater(false)
    }

    if (position.y < -1) {
      boatRef.current.setTranslation({ x: position.x, y: 1.5, z: position.z }, true)
      boatRef.current.setLinvel({ x: velocity.x, y: 0, z: velocity.z }, true)
    }

    if (Math.abs(euler.x) > 0.15 || Math.abs(euler.z) > 0.15) {
      const stabilizationForce = 2.5
      boatRef.current.applyTorqueImpulse(
        {
          x: -euler.x * stabilizationForce,
          y: 0,
          z: -euler.z * stabilizationForce,
        },
        true,
      )
    }

    if (Math.abs(euler.x) > Math.PI / 3 || Math.abs(euler.z) > Math.PI / 3) {
      const upright = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, euler.y, 0))
      boatRef.current.setRotation(upright, true)
    }

    setBoatPosition(position)
    setBoatRotation(rotation)
    setBoatSpeed(currentSpeed)

    if (muzzleFlashRef.current && showMuzzleFlash) {
      muzzleFlashRef.current.rotation.z += 0.5
    }
  })

  return (
    <RigidBody
      ref={boatRef}
      position={[0, 1.5, 0]}
      colliders="cuboid"
      mass={100}
      linearDamping={2.5}
      angularDamping={5}
    >
      <group>
        <group position={[0, 0, recoilOffset]}>
          <mesh castShadow receiveShadow position={[0, 0, 0]}>
            <boxGeometry args={[2.2, 1, 5]} />
            <meshStandardMaterial color="#654321" roughness={0.7} metalness={0.1} />
          </mesh>

          <mesh castShadow receiveShadow position={[0, -0.3, 0]}>
            <boxGeometry args={[2, 0.4, 4.8]} />
            <meshStandardMaterial color="#3d2817" roughness={0.9} />
          </mesh>

          <mesh castShadow position={[0, 0.6, 0]}>
            <boxGeometry args={[2, 0.15, 4.5]} />
            <meshStandardMaterial color="#D2B48C" roughness={0.8} metalness={0.0} />
          </mesh>

          <mesh castShadow position={[-1, 0.9, 0]}>
            <boxGeometry args={[0.1, 0.5, 4.5]} />
            <meshStandardMaterial color="#8B7355" />
          </mesh>

          <mesh castShadow position={[1, 0.9, 0]}>
            <boxGeometry args={[0.1, 0.5, 4.5]} />
            <meshStandardMaterial color="#8B7355" />
          </mesh>

          <mesh castShadow position={[0, 1.4, -0.5]}>
            <boxGeometry args={[1.6, 1.2, 2.2]} />
            <meshStandardMaterial color="#A0522D" roughness={0.6} />
          </mesh>

          <mesh castShadow position={[0, 2.1, -0.5]}>
            <boxGeometry args={[1.8, 0.2, 2.4]} />
            <meshStandardMaterial color="#654321" />
          </mesh>

          <mesh position={[0, 1.5, -1.6]}>
            <boxGeometry args={[1.2, 0.6, 0.05]} />
            <meshStandardMaterial color="#87CEEB" transparent opacity={0.6} metalness={0.9} roughness={0.1} />
          </mesh>

          <mesh castShadow position={[0, 0.2, -2.8]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[1.1, 1.8, 4]} />
            <meshStandardMaterial color="#654321" roughness={0.7} metalness={0.1} />
          </mesh>

          <mesh castShadow position={[0, 0.3, 2.5]}>
            <boxGeometry args={[2.2, 0.8, 0.5]} />
            <meshStandardMaterial color="#654321" />
          </mesh>

          <mesh castShadow position={[0, 0.8, 2.3]}>
            <boxGeometry args={[0.8, 0.6, 0.8]} />
            <meshStandardMaterial color="#2F4F4F" metalness={0.7} roughness={0.3} />
          </mesh>

          <mesh castShadow position={[0.8, 0.8, 1.5]}>
            <cylinderGeometry args={[0.05, 0.05, 1.5]} />
            <meshStandardMaterial color="#8B7355" />
          </mesh>

          <mesh castShadow position={[0, 2.3, -1.5]}>
            <cylinderGeometry args={[0.03, 0.03, 0.8]} />
            <meshStandardMaterial color="#C0C0C0" metalness={0.8} />
          </mesh>

          <mesh position={[0.3, 2.5, -1.5]}>
            <boxGeometry args={[0.5, 0.3, 0.02]} />
            <meshStandardMaterial color="#BA0C2F" />
          </mesh>

          <mesh castShadow position={[0, 1.2, -2.5]}>
            <cylinderGeometry args={[0.08, 0.08, 0.8]} />
            <meshStandardMaterial color="#2F4F4F" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>

        {showMuzzleFlash && (
          <mesh ref={muzzleFlashRef} position={[0, 1.2, -2.9]}>
            <sphereGeometry args={[0.6, 16, 16]} />
            <meshBasicMaterial color="#FF6600" transparent opacity={0.9} />
          </mesh>
        )}

        {showMuzzleFlash && (
          <>
            <mesh position={[0, 1.2, -3.8]}>
              <sphereGeometry args={[0.4, 8, 8]} />
              <meshBasicMaterial color="#FFFF00" transparent opacity={0.7} />
            </mesh>
            <mesh position={[0, 1.2, -5.0]}>
              <sphereGeometry args={[0.25, 8, 8]} />
              <meshBasicMaterial color="#FFFF00" transparent opacity={0.5} />
            </mesh>
            <mesh position={[0, 1.2, -6.5]}>
              <sphereGeometry args={[0.15, 6, 6]} />
              <meshBasicMaterial color="#FFA500" transparent opacity={0.3} />
            </mesh>
            {/* Smoke effect */}
            <mesh position={[0, 1.4, -3.5]}>
              <sphereGeometry args={[0.5, 8, 8]} />
              <meshBasicMaterial color="#888888" transparent opacity={0.4} />
            </mesh>
          </>
        )}
      </group>
    </RigidBody>
  )
}
