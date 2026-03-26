'use client'

import { motion } from 'framer-motion'

export default function About() {
  return (
    <section id="about" className="py-20 bg-black/30 backdrop-blur-sm">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            About Me
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            Fullstack Developer with 3.6 years of experience specializing in building responsive, scalable, and user-friendly
            web and mobile applications. Proficient in React.js, React Native, Redux, Tailwind CSS, and API integration, with
            hands-on experience in Next.js, Bootstrap, and Material UI. Skilled in backend development using Python Django
            and Node.js, with working knowledge of MongoDB. Successfully delivered full-stack projects like SkillVibes.in,
            HumHai.in, and AdornmentsByDeepti.com. A fast learner, effective communicator, and collaborative team player
            seeking opportunities to grow as a full-stack developer.
          </p>
        </motion.div>
      </div>
    </section>
  )
}