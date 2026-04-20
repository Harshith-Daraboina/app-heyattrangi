"use client"

import { motion } from "framer-motion"

export default function Shimmer() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "linear",
        }}
        className="h-full w-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
      />
    </div>
  )
}
