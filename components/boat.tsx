"use client"

import { useRef, useEffect, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { RigidBody, type RapierRigidBody } from "@react-three/rapier"
import { useKeyboardControls } from "@/hooks/use-keyboard-controls"
import { useGameStore } from "@/store/game-store"
import { useShootingEffects } from "@/lib/audio-effects"
import * as THREE from "three"

export function Boat() {
  const boatRef = useRef<RapierRigidBody>(null)
  const muzzleFlashRef = useRef<THREE.Mesh>(null)
  const { forward, backward, left, right, space, shift, f } = useKeyboardControls()
  const mobileControls = useGameStore((state) => state.mobileControls)
  const { playShoot, playFishing } = useShootingEffects()
  const setBoatPosition = useGameStore((state) => state.setBoatPosition)
  const setBoatRotation = useGameStore((state) => state.setBoatRotation)
  const setBoatSpeed = useGameStore((state) => state.setBoatSpeed)
  const setIsFishing = useGameStore((state) => state.setIsFishing)
  const setIsShooting = useGameStore((state) => state.setIsShooting)
  const setIsUnderwater = useGameStore((state) => state.setIsUnderwater)
  const addProjectile = useGameStore((state) => state.addProjectile)

  const [showMuzzleFlash, setShowMuzzleFlash] = useState(false)
  const [recoilOffset, setRecoilOffset] = useState(0)
  const lastShotTime = useRef(0)
  const shootCooldown = 300 // milliseconds between shots

  // Disable right-click context menu during gameplay
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault() // Prevent right-click context menu
    }

    document.addEventListener('contextmenu', handleContextMenu)

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
    }
  }, [])

  // Fishing with F key - med lyd og animasjon
  useEffect(() => {
    if (f) {
      setIsFishing(true)
      playFishing() // Spill av fiske-lyd
      setTimeout(() => setIsFishing(false), 1000) // Lengre animasjon
    }
  }, [f, setIsFishing, playFishing])

  // Shooting with space bar or shift key
  useEffect(() => {
    if (shift || space) {
      const now = Date.now()
      if (now - lastShotTime.current < shootCooldown) return

      lastShotTime.current = now
      setIsShooting(true)
      setShowMuzzleFlash(true)
      setRecoilOffset(-0.5)

      // Play shooting sound
      playShoot()

      // Fire projectile from boat position
      if (boatRef.current) {
        const position = boatRef.current.translation()
        const rotation = boatRef.current.rotation()

        // Calculate forward direction from boat rotation (negative Z for forward in Three.js)
        const forward = new THREE.Vector3(0, 0, -1)
        forward.applyQuaternion(new THREE.Quaternion(rotation.x, rotation.y, rotation.z, rotation.w))

        // Adjust firing position to be in front of boat (further forward)
        const muzzlePos: [number, number, number] = [
          position.x + forward.x * 4,
          position.y + 6, // VELDIG høy posisjon for å sikte øverst på skjermen
          position.z + forward.z * 4
        ]

        // Fire direction aimed much higher for flying objects
        const fireDir: [number, number, number] = [
          forward.x,
          1.2, // VELDIG høy vinkel for å treffe fugler øverst på skjermen
          forward.z
        ]

        addProjectile(muzzlePos, fireDir)
      }

      setTimeout(() => {
        setShowMuzzleFlash(false)
        setIsShooting(false)
      }, 250)

      setTimeout(() => {
        setRecoilOffset(0)
      }, 200)
    }
  }, [shift, space, setIsShooting, playShoot, addProjectile])

  useFrame(() => {
    if (!boatRef.current) return

    const impulseStrength = 35.0 // Slightly increased for better acceleration
    const maxSpeed = 300
    const baseTurnRate = 10.0 // HØYERE kraft for raskere 360° rotasjon!

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

    // Konstant svingkraft for både desktop og mobil
    const effectiveTurnRate = baseTurnRate

    const angVel = boatRef.current.angvel()

    if (isLeft) {
      // DIREKTE sett rotasjonshastighet for kontinuerlig venstre-sving
      boatRef.current.setAngvel(
        {
          x: angVel.x * 0.8,
          y: effectiveTurnRate, // Sett direkte til mål-hastighet
          z: angVel.z * 0.8,
        },
        true,
      )
    } else if (isRight) {
      // DIREKTE sett rotasjonshastighet for kontinuerlig høyre-sving
      boatRef.current.setAngvel(
        {
          x: angVel.x * 0.8,
          y: -effectiveTurnRate, // Sett direkte til mål-hastighet
          z: angVel.z * 0.8,
        },
        true,
      )
    } else {
      // MINIMAL damping når ikke aktivt svinger - for smooth coast
      boatRef.current.setAngvel(
        {
          x: angVel.x * 0.6,
          y: angVel.y * 0.985, // SÅ lite damping som mulig uten at båten spinner ukontrollert
          z: angVel.z * 0.6,
        },
        true,
      )
    }

    if (isForward && currentSpeed < maxSpeed) {
      const forwardDir = new THREE.Vector3(0, 0, -1).applyEuler(euler)
      boatRef.current.applyImpulse({ x: forwardDir.x * impulseStrength, y: 0, z: forwardDir.z * impulseStrength }, true)
    }
    if (isBackward && currentSpeed < maxSpeed / 2) {
      const forwardDir = new THREE.Vector3(0, 0, -1).applyEuler(euler)
      boatRef.current.applyImpulse(
        { x: -forwardDir.x * impulseStrength * 0.5, y: 0, z: -forwardDir.z * impulseStrength * 0.5 },
        true,
      )
    }

    if (!isForward && !isBackward && currentSpeed > 0.5) {
      const dragForce = 0.98 // Gentle drag for smooth deceleration
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

    // FIKSET: Kun stabiliser PITCH og ROLL, ikke YAW (Y-rotasjon)
    if (Math.abs(euler.x) > 0.1 || Math.abs(euler.z) > 0.1) {
      const stabilizationForce = 3.5 // Increased for better stability
      boatRef.current.applyTorqueImpulse(
        {
          x: -euler.x * stabilizationForce,
          y: 0, // IKKE påvirk Y-rotasjon (venstre/høyre svinging)!
          z: -euler.z * stabilizationForce,
        },
        true,
      )
    }

    // FIKSET: Kun reset ekstrem pitch/roll, BEVAR Y-rotasjon for full 360° svinging!
    if (Math.abs(euler.x) > Math.PI / 3 || Math.abs(euler.z) > Math.PI / 3) {
      // BEVARER euler.y for kontinuerlig rotasjon!
      const uprightWithYaw = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, euler.y, 0))
      boatRef.current.setRotation(uprightWithYaw, true)
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
      linearDamping={1.0}
      angularDamping={0.05} // EKSTREMT lav for perfekt 360° rotasjon!
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
