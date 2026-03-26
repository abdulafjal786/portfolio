'use client'

import { motion } from 'framer-motion'

export default function Activities() {
  return (
    <section id="activities" className="py-20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Activities & Growth
          </h2>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8">
            <p className="text-gray-300 text-lg leading-relaxed italic">
              &quot;During my working years I have learned many things and I have converted myself a good asset for the organization I am working in.&quot;
            </p>
            <div className="mt-6">
              <p className="text-cyan-400 font-semibold">Continuous learner • Team contributor • Problem solver</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}