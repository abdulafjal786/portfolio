'use client'

import { motion } from 'framer-motion'
import { projects } from '@/lib/data'
import { FiExternalLink } from 'react-icons/fi'

export default function Projects() {
  return (
    <section id="projects" className="relative py-20 min-h-screen">
      <div className="container mx-auto px-6 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Projects
          </h2>
          <p className="text-gray-300">Some of my recent work</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, idx) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-md rounded-xl overflow-hidden border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300 shadow-2xl"
            >
              {/* Animated gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 to-purple-500/0 group-hover:from-cyan-500/10 group-hover:to-purple-500/10 transition-all duration-500" />
              
              {/* Shine effect on hover */}
              <div className="absolute -inset-full group-hover:inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-1000" />
              
              <div className="p-6 relative z-10">
                {/* Header with icon */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {project.title}
                    </h3>
                  </div>
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-cyan-400 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FiExternalLink className="text-lg" />
                    </a>
                  )}
                </div>
                
                {/* Period badge */}
                <div className="inline-block px-2 py-1 bg-cyan-500/20 rounded-md mb-3">
                  <p className="text-cyan-400 text-xs font-mono">
                    {project.period}
                  </p>
                </div>
                
                {/* Description */}
                <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                  {project.description}
                </p>
                
                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech) => (
                    <span 
                      key={tech} 
                      className="px-2 py-1 bg-gray-800/80 backdrop-blur-sm rounded-md text-xs text-gray-300 border border-gray-700 hover:border-cyan-500/50 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center gap-4 pt-3 border-t border-gray-700/50">
               
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-cyan-400 transition-colors group/btn"
                    >
                      <FiExternalLink className="text-base group-hover/btn:animate-pulse" />
                      <span>Live Demo</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}