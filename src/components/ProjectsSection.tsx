'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Layers,
  Zap,
  ArrowUpRight,
} from 'lucide-react';
import { PROJECTS } from '@/data/portfolioData';
import { GithubIcon } from '@/components/SocialIcons';
import { sound } from '@/lib/sound';

export default function ProjectsSection() {
  return (
    <section id="projects" className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative z-10">
      {/* Header (No Category Filters, Displays All) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase tracking-wider mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>Complete Project Portfolio</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400">Software &amp; AI Systems</span>
          </h2>
        </div>

        <p className="text-xs sm:text-sm font-mono text-cyan-400/90 max-w-xs text-left md:text-right">
          Displaying all {PROJECTS.length} active engineering projects &amp; systems
        </p>
      </div>

      {/* Organic Cards Grid displaying all projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {PROJECTS.map((project, index) => {
          const cardShapeClass = index % 2 === 0 ? 'organic-card-1' : 'organic-card-2';

          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              onMouseEnter={() => sound.playHover()}
              className={`group relative p-7 sm:p-8 ${cardShapeClass} bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/10 hover:border-cyan-400/40 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:shadow-[0_25px_60px_rgba(6,182,212,0.15)]`}
            >
              {/* Top ambient highlight gradient */}
              <div
                className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl ${project.gradient} blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-500`}
              />

              <div className="space-y-4 relative z-10">
                {/* Meta header */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300">
                    {project.category}
                  </span>
                  <div className="flex items-center space-x-2">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                      title="View Source on GitHub"
                    >
                      <GithubIcon className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* Title & Subtitle */}
                <div>
                  <h3 className="text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center space-x-2">
                    <span>{project.title}</span>
                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-cyan-400" />
                  </h3>
                  <p className="text-xs font-mono text-indigo-300/80 mt-1">{project.subtitle}</p>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-300 leading-relaxed">{project.description}</p>

                {/* Performance / Architectural Metric */}
                {project.metrics && (
                  <div className="p-3 rounded-2xl bg-black/40 border border-white/5 flex items-center space-x-2.5 text-xs text-emerald-300 font-mono">
                    <Zap className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span>{project.metrics}</span>
                  </div>
                )}
              </div>

              {/* Technologies footer */}
              <div className="pt-6 relative z-10">
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-[11px] font-mono text-gray-300 group-hover:border-cyan-500/20 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
