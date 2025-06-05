"use client"

import { useState, useEffect, Suspense } from "react"
import dynamic from "next/dynamic"

// Dynamically import Canvas to avoid SSR issues
const Canvas = dynamic(() => import("@react-three/fiber").then((mod) => mod.Canvas), {
  ssr: false,
  loading: () => <div className="w-32 h-32 pointer-events-none" />,
})

const Float = dynamic(() => import("@react-three/drei").then((mod) => mod.Float), {
  ssr: false,
})

const Center = dynamic(() => import("@react-three/drei").then((mod) => mod.Center), {
  ssr: false,
})

function FloatingCard({ text }: { text: string }) {
  return (
    <Suspense fallback={null}>
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.3}>
        <Center>
          <mesh>
            <boxGeometry args={[2, 0.5, 0.2]} />
            <meshStandardMaterial color="#3b82f6" metalness={0.8} roughness={0.2} />
          </mesh>
        </Center>
      </Float>
    </Suspense>
  )
}

export default function Floating3DCard({ text = "DEV" }: { text?: string }) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <div className="w-32 h-32 pointer-events-none" />
  }

  return (
    <div className="w-32 h-32 pointer-events-none">
      <Suspense fallback={<div className="w-32 h-32" />}>
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[5, 5, 5]} intensity={1} />
          <FloatingCard text={text} />
        </Canvas>
      </Suspense>
    </div>
  )
}
