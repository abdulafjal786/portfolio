'use client'

import { motion } from 'framer-motion'
import { education } from '@/lib/data'

export default function Education() {
  return (
    <section id="education" className="py-20 bg-black/30 backdrop-blur-sm">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Education
          </h2>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          {education.map((edu, idx) => (
            <motion.div
              key={edu.degree}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/5 rounded-xl p-6 text-center"
            >
              <h3 className="text-xl font-bold text-cyan-400 mb-2">{edu.institution}</h3>
              <p className="text-lg mb-1">{edu.degree}</p>
              <p className="text-gray-400">{edu.period}</p>
              <p className="text-gray-400 mt-2">CGPA: {edu.cgpa}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}