'use client'

import { motion } from 'framer-motion'

export default function BackgroundAnimation() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        animate={{
          x: ['0%', '100%', '0%'],
          y: ['0%', '50%', '0%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        animate={{
          x: ['0%', '-50%', '0%'],
          y: ['0%', '-30%', '0%'],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      <motion.div
        className="absolute top-3/4 left-1/2 w-[400px] h-[400px] bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        animate={{
          x: ['0%', '30%', '0%'],
          y: ['0%', '-40%', '0%'],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  )
}