"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { RigidBody } from "@react-three/rapier"
import * as THREE from "three"

export function Ocean() {
  const waterRef = useRef<THREE.Mesh>(null)

  const waterMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color("#1e40af") },
      },
      vertexShader: `
        uniform float time;
        varying vec2 vUv;
        varying float vElevation;
        
        void main() {
          vUv = uv;
          
          // Create wave patterns
          vec3 pos = position;
          float wave1 = sin(pos.x * 0.5 + time * 2.0) * 0.3;
          float wave2 = sin(pos.y * 0.3 + time * 1.5) * 0.25;
          float wave3 = sin((pos.x + pos.y) * 0.4 + time * 1.8) * 0.2;
          
          pos.z += wave1 + wave2 + wave3;
          vElevation = wave1 + wave2 + wave3;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        varying vec2 vUv;
        varying float vElevation;
        
        void main() {
          // Add foam on wave peaks
          vec3 finalColor = color;
          if (vElevation > 0.4) {
            finalColor = mix(color, vec3(0.9, 0.95, 1.0), (vElevation - 0.4) * 2.0);
          }
          
          gl_FragColor = vec4(finalColor, 0.85);
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
  })

  return (
    <>
      {/* Water surface with animated waves */}
      <mesh ref={waterRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[200, 200, 100, 100]} />
        <primitive object={waterMaterial} attach="material" />
      </mesh>

      {/* Invisible physics floor */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[0, 0, 0]} visible={false}>
          <boxGeometry args={[200, 1, 200]} />
        </mesh>
      </RigidBody>
    </>
  )
}
