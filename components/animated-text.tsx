"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface AnimatedTextProps {
  text: string
  className?: string
  delay?: number
  speed?: number
}

export default function AnimatedText({ text, className = "", delay = 0, speed = 30 }: AnimatedTextProps) {
  const [displayText, setDisplayText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, speed + delay)

      return () => clearTimeout(timeout)
    } else {
      // Hide cursor after typing is complete
      const cursorTimeout = setTimeout(() => {
        setShowCursor(false)
      }, 1000)
      return () => clearTimeout(cursorTimeout)
    }
  }, [currentIndex, text, delay, speed])

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: delay / 1000 }}
    >
      {displayText}
      {showCursor && (
        <motion.span
          className="inline-block w-0.5 h-8 bg-blue-400 ml-1"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
        />
      )}
    </motion.span>
  )
}
