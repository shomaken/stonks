import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

// Floating particles component
function FloatingParticles({ count = 100 }) {
  const mesh = useRef()
  
  // Generate random positions for particles
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      // Position particles randomly in 3D space
      positions[i * 3] = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20
      
      // Set green color with some variation
      colors[i * 3] = 0.2 + Math.random() * 0.3     // R
      colors[i * 3 + 1] = 0.7 + Math.random() * 0.3 // G  
      colors[i * 3 + 2] = 0.2 + Math.random() * 0.3 // B
    }
    
    return [positions, colors]
  }, [count])
  
  // Animate particles
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
      mesh.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1
      
      // Move particles up and down gently
      const positions = mesh.current.geometry.attributes.position.array
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(state.clock.elapsedTime + positions[i]) * 0.002
      }
      mesh.current.geometry.attributes.position.needsUpdate = true
    }
  })
  
  return (
    <Points ref={mesh} positions={positions} colors={colors}>
      <PointMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation={false}
      />
    </Points>
  )
}

// Floating arrows component
function FloatingArrows({ count = 10 }) {
  const groupRef = useRef()
  
  // Create arrow geometry
  const arrowGeometry = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(0, 1)
    shape.lineTo(0.5, 0.5)
    shape.lineTo(0.2, 0.5)
    shape.lineTo(0.2, -1)
    shape.lineTo(-0.2, -1)
    shape.lineTo(-0.2, 0.5)
    shape.lineTo(-0.5, 0.5)
    shape.lineTo(0, 1)
    
    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.1,
      bevelEnabled: false,
    })
  }, [])
  
  // Generate random positions and rotations for arrows
  const arrows = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 10
      ],
      rotation: [
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      ],
      scale: 0.3 + Math.random() * 0.2,
      speed: 0.5 + Math.random() * 0.5
    }))
  }, [count])
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05
      
      // Animate individual arrows
      groupRef.current.children.forEach((arrow, i) => {
        arrow.position.y += Math.sin(state.clock.elapsedTime * arrows[i].speed) * 0.01
        arrow.rotation.z += 0.005
      })
    }
  })
  
  return (
    <group ref={groupRef}>
      {arrows.map((arrow, i) => (
        <mesh
          key={i}
          geometry={arrowGeometry}
          position={arrow.position}
          rotation={arrow.rotation}
          scale={arrow.scale}
        >
          <meshLambertMaterial
            color="#3FBF3F"
            transparent
            opacity={0.4}
            emissive="#1a5a1a"
          />
        </mesh>
      ))}
    </group>
  )
}

// Main background canvas component
function BackgroundCanvas() {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        style={{ background: 'linear-gradient(180deg, #0A1128 0%, #041022 100%)' }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} color="#3FBF3F" />
        <pointLight position={[-5, -5, -5]} intensity={0.3} color="#ffffff" />
        
        {/* Animated elements */}
        <FloatingParticles count={150} />
        <FloatingArrows count={12} />
        
        {/* Fog for depth */}
        <fog attach="fog" args={['#0A1128', 5, 25]} />
      </Canvas>
    </div>
  )
}

export default BackgroundCanvas 