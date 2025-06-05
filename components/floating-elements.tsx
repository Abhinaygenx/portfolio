"use client"

import { motion } from "framer-motion"

export default function FloatingElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating geometric shapes */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/20 rounded-full"
        animate={{
          y: [-20, 20, -20],
          x: [-10, 10, -10],
          opacity: [0.2, 0.8, 0.2],
        }}
        transition={{
          duration: 6,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute top-1/3 right-1/4 w-1 h-1 bg-purple-400/30 rounded-full"
        animate={{
          y: [20, -20, 20],
          x: [10, -10, 10],
          opacity: [0.3, 0.9, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      <motion.div
        className="absolute bottom-1/3 left-1/3 w-3 h-3 border border-blue-400/20 rounded-full"
        animate={{
          rotate: [0, 360],
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.6, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />

      <motion.div
        className="absolute top-2/3 right-1/3 w-4 h-4 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-sm"
        animate={{
          y: [-30, 30, -30],
          x: [-15, 15, -15],
          scale: [1, 1.5, 1],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 2,
        }}
      />
    </div>
  )
}
