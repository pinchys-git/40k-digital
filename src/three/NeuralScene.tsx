import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'
import { useReducedMotion } from '../hooks/useReducedMotion'

// Particle sphere + connecting neural lines
function ParticleNetwork({ reduced }: { reduced: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const linesRef = useRef<THREE.LineSegments>(null)
  const particlesRef = useRef<THREE.Points>(null)

  const PARTICLE_COUNT = 800
  const RADIUS = 2.2
  const CONNECTION_RADIUS = 1.1

  // Generate sphere particles
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const colors = new Float32Array(PARTICLE_COUNT * 3)

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Fibonacci sphere distribution for even spread
      const phi = Math.acos(1 - (2 * (i + 0.5)) / PARTICLE_COUNT)
      const theta = Math.PI * (1 + Math.sqrt(5)) * i

      const r = RADIUS + (Math.random() - 0.5) * 0.3
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)

      // Cyan to slightly blue-white range
      const t = Math.random()
      colors[i * 3] = 0.2 + t * 0.1       // R
      colors[i * 3 + 1] = 0.85 + t * 0.15 // G
      colors[i * 3 + 2] = 1.0              // B
    }

    return { positions, colors }
  }, [])

  // Generate neural network connection lines (sparse, beautiful)
  const lineGeometry = useMemo(() => {
    const linePositions: number[] = []
    const lineColors: number[] = []

    // Only connect nearby particles
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      for (let j = i + 1; j < PARTICLE_COUNT; j++) {
        const dx = positions[i * 3] - positions[j * 3]
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1]
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2]
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

        if (dist < CONNECTION_RADIUS && Math.random() > 0.85) {
          linePositions.push(
            positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
            positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
          )
          // Fade opacity based on distance
          const alpha = (1 - dist / CONNECTION_RADIUS) * 0.35
          lineColors.push(0, alpha * 0.9, alpha, 0, alpha * 0.9, alpha)
        }
      }
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3))
    geo.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3))
    return geo
  }, [positions])

  // Animate
  useFrame((state) => {
    if (reduced) return
    const t = state.clock.elapsedTime

    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.06
      groupRef.current.rotation.x = Math.sin(t * 0.04) * 0.15
    }

    // Subtle pulse on particle size
    if (particlesRef.current) {
      const mat = particlesRef.current.material as THREE.PointsMaterial
      mat.size = 0.022 + Math.sin(t * 0.8) * 0.004
    }
  })

  return (
    <group ref={groupRef}>
      {/* Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.022}
          vertexColors
          transparent
          opacity={0.85}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      {/* Neural connections */}
      <lineSegments ref={linesRef} geometry={lineGeometry}>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.6}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  )
}

// Inner core  -  distorted sphere that pulses
function CoreOrb({ reduced }: { reduced: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (reduced || !meshRef.current) return
    const t = state.clock.elapsedTime
    meshRef.current.rotation.y = t * 0.15
    meshRef.current.rotation.z = t * 0.08
    const scale = 1 + Math.sin(t * 1.2) * 0.04
    meshRef.current.scale.setScalar(scale)
  })

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.4}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[0.5, 1]} />
        <meshStandardMaterial
          color="#00f3ff"
          emissive="#00f3ff"
          emissiveIntensity={0.6}
          wireframe
          transparent
          opacity={0.5}
        />
      </mesh>
    </Float>
  )
}

// Ambient glow rings
function GlowRings({ reduced }: { reduced: boolean }) {
  const ring1 = useRef<THREE.Mesh>(null)
  const ring2 = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (reduced) return
    const t = state.clock.elapsedTime
    if (ring1.current) ring1.current.rotation.z = t * 0.05
    if (ring2.current) ring2.current.rotation.x = t * 0.04
  })

  return (
    <>
      <mesh ref={ring1} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.6, 0.003, 8, 100]} />
        <meshBasicMaterial color="#00f3ff" transparent opacity={0.12} />
      </mesh>
      <mesh ref={ring2} rotation={[0.5, 0, Math.PI / 6]}>
        <torusGeometry args={[2.9, 0.002, 8, 100]} />
        <meshBasicMaterial color="#00f3ff" transparent opacity={0.07} />
      </mesh>
    </>
  )
}

interface NeuralSceneProps {
  className?: string
  style?: React.CSSProperties
}

export function NeuralScene({ className, style }: NeuralSceneProps) {
  const reduced = useReducedMotion()

  return (
    <div
      className={className}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        ...style,
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.1} />
        <pointLight position={[0, 0, 0]} color="#00f3ff" intensity={2} distance={8} />
        <pointLight position={[4, 2, 2]} color="#0040ff" intensity={0.5} distance={12} />
        <pointLight position={[-4, -2, -2]} color="#00f3ff" intensity={0.3} distance={12} />

        <ParticleNetwork reduced={reduced} />
        <CoreOrb reduced={reduced} />
        <GlowRings reduced={reduced} />
      </Canvas>
    </div>
  )
}

// Mobile CSS fallback
export function NeuralFallback() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 50% 50%, rgba(0, 243, 255, 0.08) 0%, rgba(0, 64, 255, 0.04) 50%, transparent 70%)',
        pointerEvents: 'none',
      }}
    />
  )
}
