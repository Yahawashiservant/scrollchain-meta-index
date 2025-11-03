"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import {
  OrbitControls,
  Environment,
  PerspectiveCamera,
  Text,
  MeshTransmissionMaterial,
  Sparkles,
} from "@react-three/drei"
import { useRef } from "react"
import * as THREE from "three"

interface Studio3DProps {
  spectrum?: Float32Array
  isPlaying?: boolean
}

function SpectrumBars({ spectrum }: { spectrum?: Float32Array }) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const materialRef = useRef<THREE.MeshStandardMaterial>(null)

  useFrame(() => {
    if (!meshRef.current || !spectrum) return

    const count = Math.min(128, spectrum.length)
    const dummy = new THREE.Object3D()

    for (let i = 0; i < count; i++) {
      const x = (i - count / 2) * 0.15
      const height = Math.max(0.1, spectrum[i] * 8)
      const hue = (i / count) * 0.3 + 0.5 // Cyan to purple range

      dummy.position.set(x, height / 2 - 1, 0)
      dummy.scale.set(0.12, height, 0.12)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }

    meshRef.current.instanceMatrix.needsUpdate = true

    // Pulse the emissive intensity
    if (materialRef.current) {
      const avgLevel = spectrum.reduce((a, b) => a + b, 0) / spectrum.length
      materialRef.current.emissiveIntensity = 0.5 + avgLevel * 2
    }
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, 128]}>
      <boxGeometry />
      <meshStandardMaterial
        ref={materialRef}
        color="#00ffff"
        emissive="#00ffff"
        emissiveIntensity={0.5}
        metalness={0.8}
        roughness={0.2}
      />
    </instancedMesh>
  )
}

function FloatingParticles() {
  return <Sparkles count={200} scale={[20, 10, 20]} size={2} speed={0.3} opacity={0.6} color="#00ffff" />
}

function StudioRoom() {
  const floorRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (floorRef.current) {
      // Subtle pulsing effect
      const scale = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.02
      floorRef.current.scale.set(scale, 1, scale)
    }
  })

  return (
    <group>
      {/* Floor with grid */}
      <mesh ref={floorRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.1} envMapIntensity={1} />
      </mesh>

      {/* Grid lines */}
      <gridHelper args={[40, 40, "#00ffff", "#ffffff"]} position={[0, -1.99, 0]} />

      {/* Back wall */}
      <mesh position={[0, 3, -12]} receiveShadow>
        <planeGeometry args={[40, 12]} />
        <meshStandardMaterial color="#111" metalness={0.7} roughness={0.3} envMapIntensity={0.5} />
      </mesh>

      {/* Neon accent strips */}
      <mesh position={[-15, 6, -11.9]}>
        <boxGeometry args={[0.1, 0.1, 30]} />
        <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={3} />
      </mesh>
      <mesh position={[15, 6, -11.9]}>
        <boxGeometry args={[0.1, 0.1, 30]} />
        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={3} />
      </mesh>

      {/* Vertical accent bars */}
      <mesh position={[-15, 0, -11.8]}>
        <boxGeometry args={[0.2, 12, 0.2]} />
        <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={2} />
      </mesh>
      <mesh position={[15, 0, -11.8]}>
        <boxGeometry args={[0.2, 12, 0.2]} />
        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={2} />
      </mesh>

      {/* Console label with glow */}
      <Text
        position={[0, 7, -11.7]}
        fontSize={0.8}
        color="#00ffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        SCROLLCHAIN NEURAL CONSOLE
      </Text>

      {/* Floating holographic panels */}
      <mesh position={[-8, 2, -8]} rotation={[0, 0.3, 0]}>
        <planeGeometry args={[3, 2]} />
        <MeshTransmissionMaterial
          transmission={0.9}
          thickness={0.5}
          roughness={0.1}
          chromaticAberration={0.5}
          anisotropy={1}
          color="#00ffff"
        />
      </mesh>
      <mesh position={[8, 2, -8]} rotation={[0, -0.3, 0]}>
        <planeGeometry args={[3, 2]} />
        <MeshTransmissionMaterial
          transmission={0.9}
          thickness={0.5}
          roughness={0.1}
          chromaticAberration={0.5}
          anisotropy={1}
          color="#ff00ff"
        />
      </mesh>
    </group>
  )
}

export default function Studio3D({ spectrum, isPlaying }: Studio3DProps) {
  return (
    <div className="w-full h-full bg-gradient-to-b from-black/50 to-transparent">
      <Canvas shadows dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 3, 15]} fov={60} />
        <OrbitControls
          enablePan={false}
          minDistance={8}
          maxDistance={25}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.2}
          autoRotate
          autoRotateSpeed={0.5}
        />

        {/* Lighting setup */}
        <ambientLight intensity={0.3} />
        <pointLight position={[0, 8, 5]} intensity={2} castShadow color="#ffffff" />
        <pointLight position={[-10, 4, -8]} intensity={1.5} color="#ff00ff" />
        <pointLight position={[10, 4, -8]} intensity={1.5} color="#00ffff" />
        <spotLight position={[0, 10, 0]} angle={0.5} penumbra={1} intensity={1} castShadow color="#00ffff" />

        <StudioRoom />
        {isPlaying && spectrum && <SpectrumBars spectrum={spectrum} />}
        <FloatingParticles />

        <Environment preset="night" />
        <fog attach="fog" args={["#0B0E13", 10, 40]} />
      </Canvas>
    </div>
  )
}
