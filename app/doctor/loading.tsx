"use client"

import { motion } from "framer-motion"

export default function Loading() {
  return (
    <div className="absolute top-0 left-0 w-full h-screen z-[100] overflow-hidden pointer-events-none">
      <motion.div
        initial={{ scaleX: 0, originX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{
          duration: 1.5,
          ease: [0.65, 0, 0.35, 1],
        }}
        className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-cyan-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] z-[101]"
      />
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed inset-0 bg-white/20 backdrop-blur-[2px] z-[99]"
      />
      
      {/* Premium center spinner if needed, but let's keep it clean with skeletons */}
    </div>
  )
}
