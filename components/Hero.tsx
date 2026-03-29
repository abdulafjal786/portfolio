'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { FiGithub, FiLinkedin, FiMail, FiPhone } from 'react-icons/fi'
import abdul from "../assets/abdul.jpeg"
import DiamondBackground from './DiamondBackground' // Import the background
import AbstractGeometricBackground from "./AbstractGeometricBackground"

export default function Hero() {
  return (
    <>
      {/* 3D Diamond Background */}
      {/* <DiamondBackground /> */}
      <AbstractGeometricBackground/>
      
      
      {/* Hero Content */}
      <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 z-10">
        <div className="container mx-auto px-6 py-20 flex flex-col-reverse md:flex-row items-center justify-center gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center md:text-left"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Abdul Afjal Ansari
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-4">Fullstack Developer</p>
            <p className="text-lg text-gray-400 mb-6">3.6+ years of experience building scalable web & mobile apps</p>
            <div className="flex justify-center md:justify-start gap-4 mb-8">
              <a href="https://github.com/abdulafjal786" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-cyan-400 transition">
                <FiGithub />
              </a>
              <a href="https://linkedin.com/in/Abdul-afjal-ansari-aa0473205" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-cyan-400 transition">
                <FiLinkedin />
              </a>
              <a href="mailto:abdulansari251298@gmail.com" className="text-2xl hover:text-cyan-400 transition">
                <FiMail />
              </a>
              <a href="tel:+916203561437" className="text-2xl hover:text-cyan-400 transition">
                <FiPhone />
              </a>
            </div>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#contact"
              className="inline-block px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full font-semibold shadow-lg"
            >
              Get in touch
            </motion.a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Add a subtle glow effect around the profile image */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 blur-xl opacity-50 animate-pulse"></div>
            <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 p-1 animate-float relative z-10">
              <div className="w-full h-full rounded-full overflow-hidden bg-gray-900">
                <Image
                  src={abdul}
                  alt="Abdul Afjal Ansari"
                  width={320}
                  height={320}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}