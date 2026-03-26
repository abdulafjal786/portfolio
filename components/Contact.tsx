'use client'

import { motion } from 'framer-motion'
import { FiGithub, FiLinkedin, FiMail, FiPhone, FiMapPin } from 'react-icons/fi'

export default function Contact() {
  return (
    <section id="contact" className="py-20 bg-black/30 backdrop-blur-sm">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Get in Touch
          </h2>
          <p className="text-gray-400">Let&apos;s connect and collaborate</p>
        </motion.div>

        <div className="max-w-2xl mx-auto bg-white/5 rounded-xl p-8">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <FiPhone className="text-cyan-400 text-2xl" />
              <div>
                <p className="text-gray-400">Phone</p>
                <a href="tel:+916203561437" className="text-white hover:text-cyan-400 transition">
                  +91 6203561437
                </a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <FiMail className="text-cyan-400 text-2xl" />
              <div>
                <p className="text-gray-400">Email</p>
                <a href="mailto:abdulansari251298@gmail.com" className="text-white hover:text-cyan-400 transition">
                  abdulansari251298@gmail.com
                </a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <FiGithub className="text-cyan-400 text-2xl" />
              <div>
                <p className="text-gray-400">GitHub</p>
                <a href="https://github.com/abdulafjal786" target="_blank" rel="noopener noreferrer" className="text-white hover:text-cyan-400 transition">
                  github.com/abdulafjal786
                </a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <FiLinkedin className="text-cyan-400 text-2xl" />
              <div>
                <p className="text-gray-400">LinkedIn</p>
                <a href="https://linkedin.com/in/Abdul-afjal-ansari-aa0473205" target="_blank" rel="noopener noreferrer" className="text-white hover:text-cyan-400 transition">
                  linkedin.com/in/Abdul-afjal-ansari-aa0473205
                </a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <FiMapPin className="text-cyan-400 text-2xl" />
              <div>
                <p className="text-gray-400">Location</p>
                <p className="text-white">Gurgaon, Haryana, India</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}