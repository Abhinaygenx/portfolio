"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    let isActive = true

    const updateMousePosition = (e: MouseEvent) => {
      if (!isActive) return
      setMousePosition({ x: e.clientX, y: e.clientY })
      setIsVisible(true)
    }

    const handleMouseEnter = () => {
      if (!isActive) return
      setIsHovering(true)
    }

    const handleMouseLeave = () => {
      if (!isActive) return
      setIsHovering(false)
    }

    const handleMouseOut = () => {
      if (!isActive) return
      setIsVisible(false)
    }

    // Add document event listeners with safety checks
    const addDocumentListeners = () => {
      try {
        if (typeof document !== "undefined" && document.addEventListener) {
          document.addEventListener("mousemove", updateMousePosition, { passive: true })
          document.addEventListener("mouseout", handleMouseOut, { passive: true })
        }
      } catch (error) {
        console.warn("Error adding document listeners:", error)
      }
    }

    // Add interactive element listeners with delay and safety checks
    const addInteractiveListeners = () => {
      try {
        if (typeof document !== "undefined" && document.querySelectorAll) {
          const elements = document.querySelectorAll('a, button, [role="button"], input, textarea, select')

          elements.forEach((el) => {
            if (el && typeof el.addEventListener === "function") {
              try {
                el.addEventListener("mouseenter", handleMouseEnter, { passive: true })
                el.addEventListener("mouseleave", handleMouseLeave, { passive: true })
              } catch (error) {
                console.warn("Error adding element listener:", error)
              }
            }
          })

          return elements
        }
      } catch (error) {
        console.warn("Error querying interactive elements:", error)
      }
      return []
    }

    addDocumentListeners()

    // Delay interactive element listeners to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      if (isActive) {
        addInteractiveListeners()
      }
    }, 100)

    return () => {
      isActive = false
      clearTimeout(timeoutId)

      try {
        if (typeof document !== "undefined") {
          document.removeEventListener("mousemove", updateMousePosition)
          document.removeEventListener("mouseout", handleMouseOut)

          const elements = document.querySelectorAll('a, button, [role="button"], input, textarea, select')
          elements.forEach((el) => {
            if (el && typeof el.removeEventListener === "function") {
              try {
                el.removeEventListener("mouseenter", handleMouseEnter)
                el.removeEventListener("mouseleave", handleMouseLeave)
              } catch (error) {
                console.warn("Error removing element listener:", error)
              }
            }
          })
        }
      } catch (error) {
        console.warn("Error cleaning up listeners:", error)
      }
    }
  }, [isMounted])

  if (!isMounted || !isVisible) return null

  return (
    <>
      {/* Main cursor */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        animate={{
          x: mousePosition.x - 8,
          y: mousePosition.y - 8,
          scale: isHovering ? 1.5 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 28,
          mass: 0.5,
        }}
      >
        <div className="w-4 h-4 bg-white rounded-full" />
      </motion.div>

      {/* Glow effect */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        animate={{
          x: mousePosition.x - 20,
          y: mousePosition.y - 20,
          scale: isHovering ? 1.8 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          mass: 0.8,
        }}
      >
        <div className="w-10 h-10 bg-blue-400/30 rounded-full blur-md" />
      </motion.div>

      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9997] border border-blue-400/50 rounded-full"
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
          scale: isHovering ? 2 : 1,
          opacity: isHovering ? 0.8 : 0.4,
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 25,
          mass: 1,
        }}
      >
        <div className="w-8 h-8" />
      </motion.div>
    </>
  )
}
