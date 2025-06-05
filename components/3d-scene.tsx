"use client"

import { useState, useEffect, Suspense } from "react"
import dynamic from "next/dynamic"

// Dynamically import Canvas to avoid SSR issues
const Canvas = dynamic(() => import("@react-three/fiber").then((mod) => mod.Canvas), {
  ssr: false,
  loading: () => <div className="absolute inset-0" />,
})

const OrbitControls = dynamic(() => import("@react-three/drei").then((mod) => mod.OrbitControls), {
  ssr: false,
})

const Sphere = dynamic(() => import("@react-three/drei").then((mod) => mod.Sphere), {
  ssr: false,
})

const MeshDistortMaterial = dynamic(() => import("@react-three/drei").then((mod) => mod.MeshDistortMaterial), {
  ssr: false,
})

const Float = dynamic(() => import("@react-three/drei").then((mod) => mod.Float), {
  ssr: false,
})

function AnimatedSphere({
  position,
  color,
  speed = 1,
}: { position: [number, number, number]; color: string; speed?: number }) {
  return (
    <Suspense fallback={null}>
      <Float speed={speed} rotationIntensity={0.5} floatIntensity={0.5}>
        <Sphere args={[1, 64, 64]} position={position}>
          <MeshDistortMaterial
            color={color}
            attach="material"
            distort={0.3}
            speed={2}
            roughness={0.4}
            metalness={0.8}
          />
        </Sphere>
      </Float>
    </Suspense>
  )
}

function GeometricShapes() {
  return (
    <group>
      <AnimatedSphere position={[-4, 2, -2]} color="#3b82f6" speed={1.2} />
      <AnimatedSphere position={[4, -2, -1]} color="#8b5cf6" speed={0.8} />
      <AnimatedSphere position={[0, 3, -3]} color="#06b6d4" speed={1.5} />
    </group>
  )
}

export default function Scene3D() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <div className="absolute inset-0 pointer-events-none" />
  }

  return (
    <div className="absolute inset-0 pointer-events-none">
      <Suspense fallback={<div className="absolute inset-0" />}>
        <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
          <GeometricShapes />
          <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
        </Canvas>
      </Suspense>
    </div>
  )
}
