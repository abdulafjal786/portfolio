'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

// Individual Diamond Shape Component
function Diamond({ position, color, size, rotationSpeed, floatSpeed }) {
  const meshRef = useRef()
  const initialY = useRef(position[1])
  // eslint-disable-next-line react-hooks/purity
  const timeOffset = useRef(Math.random() * Math.PI * 2)

  // Create custom diamond geometry
  const geometry = useMemo(() => {
    const shape = new THREE.Shape()
    
    // Create a diamond-like shape in 2D then extrude or use OctahedronGeometry with stretching
    // Using OctahedronGeometry and scaling to get diamond look
    const geo = new THREE.OctahedronGeometry(size)
    // Scale to make it more diamond-like (pointy top and bottom)
    geo.scale(1, 1.5, 0.8)
    return geo
  }, [size])

  useFrame(({ clock }) => {
    if (meshRef.current) {
      // Rotation animation - infinite spin
      meshRef.current.rotation.x += rotationSpeed
      meshRef.current.rotation.y += rotationSpeed * 0.8
      meshRef.current.rotation.z += rotationSpeed * 0.5

      // Floating motion up and down
      const floatY = Math.sin(clock.elapsedTime * floatSpeed + timeOffset.current) * 0.3
      meshRef.current.position.y = initialY.current + floatY
      
      // Subtle scale pulse
      const pulse = 1 + Math.sin(clock.elapsedTime * 2 + timeOffset.current) * 0.05
      meshRef.current.scale.set(pulse, pulse, pulse)
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <primitive object={geometry} attach="geometry" />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.3}
        metalness={0.8}
        roughness={0.2}
        transparent
        opacity={0.85}
      />
    </mesh>
  )
}

// Main Background Component
export default function DiamondBackground() {
  // Create an array of diamonds with random positions, colors, and animations
  const diamonds = useMemo(() => {
    const count = 45
    const colors = [
      '#06b6d4', // cyan-500
      '#3b82f6', // blue-500
      '#8b5cf6', // violet-500
      '#a855f7', // purple-500
      '#14b8a6', // teal-500
      '#6366f1', // indigo-500
      '#0ea5e9', // sky-500
    ]
    
    const diamondsArray = []
    
    for (let i = 0; i < count; i++) {
      // Distribute diamonds in a 3D sphere-like formation
      // eslint-disable-next-line react-hooks/purity
      const radius = 8 + Math.random() * 5
      // eslint-disable-next-line react-hooks/purity
      const theta = Math.random() * Math.PI * 2
      // eslint-disable-next-line react-hooks/purity
      const phi = Math.acos(2 * Math.random() - 1)
      
      const x = Math.sin(phi) * Math.cos(theta) * radius
      const y = Math.sin(phi) * Math.sin(theta) * radius * 0.8
      const z = Math.cos(phi) * radius
      
      diamondsArray.push({
        position: [x, y, z],
        // eslint-disable-next-line react-hooks/purity
        color: colors[Math.floor(Math.random() * colors.length)],
        // eslint-disable-next-line react-hooks/purity
        size: 0.2 + Math.random() * 0.3,
        // eslint-disable-next-line react-hooks/purity
        rotationSpeed: 0.005 + Math.random() * 0.01,
        // eslint-disable-next-line react-hooks/purity
        floatSpeed: 0.5 + Math.random() * 0.8,
      })
    }
    
    // Add some smaller diamonds closer to center
    for (let i = 0; i < 25; i++) {
        // eslint-disable-next-line react-hooks/purity
      const radius = 3 + Math.random() * 4
      // eslint-disable-next-line react-hooks/purity
      const theta = Math.random() * Math.PI * 2
      // eslint-disable-next-line react-hooks/purity
      const phi = Math.acos(2 * Math.random() - 1)
      
      const x = Math.sin(phi) * Math.cos(theta) * radius
      const y = Math.sin(phi) * Math.sin(theta) * radius * 0.6
      const z = Math.cos(phi) * radius
      
      diamondsArray.push({
        position: [x, y, z],
        // eslint-disable-next-line react-hooks/purity
        color: colors[Math.floor(Math.random() * colors.length)],
        // eslint-disable-next-line react-hooks/purity
        size: 0.1 + Math.random() * 0.2,
        // eslint-disable-next-line react-hooks/purity
        rotationSpeed: 0.008 + Math.random() * 0.012,
        // eslint-disable-next-line react-hooks/purity
        floatSpeed: 0.6 + Math.random() * 0.9,
      })
    }
    
    return diamondsArray
  }, [])

  return (
    <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 2, 12], fov: 50 }}
        style={{ background: 'linear-gradient(135deg, #0a0a1a 0%, #0f0f23 100%)' }}
      >
        {/* Ambient and directional lighting for better diamond sparkle */}
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <pointLight position={[-10, -5, -10]} intensity={0.5} color="#8b5cf6" />
        <directionalLight position={[5, 10, 7]} intensity={1} />
        <directionalLight position={[-5, 3, -4]} intensity={0.5} color="#06b6d4" />
        
        {/* Central glow effect */}
        <pointLight position={[0, 0, 0]} intensity={0.3} color="#a855f7" distance={15} />
        
        {/* All diamonds */}
        {diamonds.map((diamond, index) => (
          <Diamond
            key={index}
            position={diamond.position}
            color={diamond.color}
            size={diamond.size}
            rotationSpeed={diamond.rotationSpeed}
            floatSpeed={diamond.floatSpeed}
          />
        ))}
        
        {/* Optional: subtle rotating star-like particles */}
        <Stars radius={15} depth={50} count={800} factor={4} saturation={0} fade speed={0.5} />
      </Canvas>
    </div>
  )
}

// Simple Stars component for background twinkling effect
function Stars({ radius, depth, count, factor, saturation, fade, speed }) {
  const meshRef = useRef()
  
  const starsGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
        // eslint-disable-next-line react-hooks/purity
      const r = radius + Math.random() * depth
      // eslint-disable-next-line react-hooks/purity
      const theta = Math.random() * Math.PI * 2
      // eslint-disable-next-line react-hooks/purity
      const phi = Math.acos(2 * Math.random() - 1)
      
      positions[i * 3] = Math.sin(phi) * Math.cos(theta) * r
      positions[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * r * 0.5
      positions[i * 3 + 2] = Math.cos(phi) * r
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geometry
  }, [count, radius, depth])
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.elapsedTime * 0.02
      meshRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.01) * 0.1
    }
  })
  
  return (
    <points ref={meshRef} geometry={starsGeometry}>
      <pointsMaterial
        color="#ffffff"
        size={0.08}
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}