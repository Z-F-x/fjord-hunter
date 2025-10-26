"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { RigidBody } from "@react-three/rapier"
import * as THREE from "three"
import { useGameStore } from "@/store/game-store"

export function Ocean() {
  const waterRef = useRef<THREE.Mesh>(null)
  const boatPosition = useGameStore((state) => state.boatPosition)

  const waterMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color("#2563eb") },
      },
      vertexShader: `
        uniform float time;
        varying vec2 vUv;
        varying float vElevation;
        varying vec3 vWorldPosition;

        void main() {
          vUv = uv;

          vec3 pos = position;

          // Simple but effective wave system
          float wave1 = sin(pos.x * 0.4 + time * 1.5) * 0.3;
          float wave2 = sin(pos.y * 0.3 + time * 1.2) * 0.25;
          float wave3 = sin((pos.x + pos.y) * 0.2 + time * 0.8) * 0.4;
          float wave4 = sin(pos.x * 0.6 - pos.y * 0.5 + time * 2.0) * 0.15;

          float waveHeight = wave1 + wave2 + wave3 + wave4;
          pos.z += waveHeight;
          vElevation = waveHeight;

          // Calculate world position
          vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
          vWorldPosition = worldPosition.xyz;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        uniform float time;

        varying vec2 vUv;
        varying float vElevation;
        varying vec3 vWorldPosition;

        void main() {
          // Water colors based on wave height
          vec3 shallowWater = vec3(0.3, 0.6, 0.9);   // Light blue
          vec3 deepWater = vec3(0.1, 0.3, 0.7);      // Deep blue

          // Mix colors based on wave height
          float waveInfluence = smoothstep(-0.5, 0.5, vElevation);
          vec3 baseColor = mix(deepWater, shallowWater, waveInfluence);

          // Simple foam on wave peaks
          float foam = smoothstep(0.4, 0.8, vElevation);
          vec3 foamColor = vec3(0.9, 0.95, 1.0);

          // Subtle sparkle effect
          float sparkle = sin(vWorldPosition.x * 10.0 + time * 2.0) * sin(vWorldPosition.z * 8.0 + time * 1.5);
          sparkle = pow(max(0.0, sparkle), 10.0) * 0.1;

          // Combine colors
          vec3 finalColor = mix(baseColor, foamColor, foam * 0.3);
          finalColor += sparkle;

          // Transparent for fish visibility
          float alpha = mix(0.65, 0.8, foam);

          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
    })
  }, [])

  useFrame(({ clock }) => {
    if (waterMaterial) {
      waterMaterial.uniforms.time.value = clock.getElapsedTime()
    }

    if (waterRef.current && boatPosition) {
      waterRef.current.position.x = boatPosition.x
      waterRef.current.position.z = boatPosition.z
    }
  })

  return (
    <>
      <mesh ref={waterRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[2000, 2000, 50, 50]} />
        <primitive object={waterMaterial} attach="material" />
      </mesh>

      {/* Invisible physics floor that follows the boat */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[boatPosition?.x || 0, 0, boatPosition?.z || 0]} visible={false}>
          <boxGeometry args={[2000, 1, 2000]} />
        </mesh>
      </RigidBody>
    </>
  )
}
