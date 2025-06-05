"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { MapPin } from "lucide-react"

interface JourneyPoint {
  id: number
  title: string
  date: string
  description: string
  x: number
  y: number
}

const journeyPoints: JourneyPoint[] = [
  {
    id: 1,
    title: "Passed my class 10 exam and started a new journey",
    date: "2020",
    description: "Began learning the various fields and domains of technology",
    x: 10,
    y: 80,
  },
  {
    id: 2,
    title: "Highly demotivated and was broken mentally",
    date: "2021",
    description: "Due to the pandemic, I was unable to focus on my studies and career",
    x: 25,
    y: 40,
  },
  {
    id: 3,
    title: "Started jee preparation ",
    date: "2022",
    description: "Started preparing for JEE and other competitive exams",
    x: 40,
    y: 60,
  },
  {
    id: 4,
    title: "Landed in electrical engineering in NIT Silchar and started my coding journey",
    date: "2023",
    description: "got into NIT Silchar for my B.Tech in Electrical Engineering",
    x: 60,
    y: 30,
  },
  {
    id: 5,
    title: "Launched my first startup and got my first freelance project",
    date: "2024",
    description: "Co-founded and launched a startup focused on social media and content creation and landed clients for freelance projects",
    x: 75,
    y: 50,
  },
  {
    id: 6,
    title: "Present",
    date: "2025",
    description: "Working on exciting new projects and developing my skills further",
    x: 90,
    y: 20,
  },
]

export default function JourneyMap() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [pathLength, setPathLength] = useState(0)
  const [activePath, setActivePath] = useState(0)
  const [activePoint, setActivePoint] = useState<JourneyPoint | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  // Generate path points
  const pathPoints = journeyPoints.map((point) => `${point.x}% ${point.y}%`).join(" L ")
  const pathData = `M ${pathPoints}`

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    const calculatePathLength = () => {
      try {
        if (svgRef.current) {
          const path = svgRef.current.querySelector("path")
          if (path && typeof path.getTotalLength === "function") {
            const length = path.getTotalLength()
            if (length && !isNaN(length) && length > 0) {
              setPathLength(length)
            }
          }
        }
      } catch (error) {
        console.warn("Error calculating path length:", error)
        // Fallback to a default length
        setPathLength(1000)
      }
    }

    // Use requestAnimationFrame to ensure DOM is ready
    const rafId = requestAnimationFrame(() => {
      calculatePathLength()
    })

    const timer = setTimeout(() => {
      setActivePath(1)
    }, 500)

    return () => {
      cancelAnimationFrame(rafId)
      clearTimeout(timer)
    }
  }, [isMounted])

  if (!isMounted) {
    return (
      <div className="relative h-full w-full flex items-center justify-center">
        <div className="text-gray-400 text-sm">Loading journey map...</div>
      </div>
    )
  }

  return (
    <div className="relative h-full w-full">
      {/* Map SVG */}
      <svg ref={svgRef} className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Dotted background path */}
        <path
          d={pathData}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="2 4"
          strokeOpacity="0.3"
          className="text-gray-600"
        />

        {/* Animated foreground path */}
        {pathLength > 0 && (
          <motion.path
            d={pathData}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray={pathLength}
            strokeDashoffset={pathLength}
            initial={{ strokeDashoffset: pathLength }}
            animate={{ strokeDashoffset: pathLength * (1 - activePath) }}
            transition={{ duration: 3, ease: "easeInOut" }}
            className="text-blue-400"
          />
        )}
      </svg>

      {/* Journey points */}
      {journeyPoints.map((point, index) => (
        <motion.div
          key={point.id}
          className="absolute"
          style={{
            left: `${point.x}%`,
            top: `${point.y}%`,
            transform: "translate(-50%, -50%)",
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 + index * 0.3, duration: 0.5 }}
          onMouseEnter={() => setActivePoint(point)}
          onMouseLeave={() => setActivePoint(null)}
        >
          <div className="relative">
            <MapPin
              className={`h-6 w-6 ${activePoint?.id === point.id ? "text-blue-400" : "text-white"}`}
              fill={activePoint?.id === point.id ? "currentColor" : "transparent"}
            />

            <motion.div
              className="absolute top-0 left-0 w-full h-full rounded-full bg-blue-400/20"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.7, 0, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
              }}
            />

            {/* Year label */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-400">
              {point.date}
            </div>
          </div>

          {/* Tooltip */}
          {activePoint?.id === point.id && (
            <motion.div
              className="absolute z-10 bg-gray-900 border border-gray-700 rounded-lg shadow-lg p-3 w-48"
              style={{
                top: point.y < 50 ? "120%" : "auto",
                bottom: point.y >= 50 ? "120%" : "auto",
                left: "50%",
                transform: "translateX(-50%)",
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <h4 className="font-medium text-sm text-white">{point.title}</h4>
              <p className="text-xs text-gray-400 mt-1">{point.description}</p>
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  )
}
