'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

export default function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const features = [
    {
      icon: '💡',
      title: '생각을 확장하고',
      description: '다양한 관점에서 문제를 바라보는 시야를 키웁니다'
    },
    {
      icon: '🔍',
      title: '새로운 관점으로 바라보며',
      description: '기술을 통해 세상의 문제를 해결하는 방법을 배웁니다'
    },
    {
      icon: '🎯',
      title: '결과물을 만들어냅니다',
      description: '아이디어를 실제 프로젝트로 구현하는 경험을 합니다'
    }
  ]

  return (
    <section id="about" className="py-24 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
            TeamCodeBridge란?
          </h2>
          <p className="text-base md:text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
            우리는 '코드'라는 도구로 세상과 연결되는 다리를 만들고 있습니다.
            <br className="hidden md:block" />
            단순한 기술 전달을 넘어, 함께 성장하는 경험을 제공합니다.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-cyan-500/50 transition-all group"
            >
              <span className="text-4xl mb-4 block group-hover:scale-110 transition-transform">
                {feature.icon}
              </span>
              <h3 className="text-xl font-bold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-gradient-to-r from-cyan-500/10 to-teal-600/10 rounded-3xl p-8 md:p-12 border border-cyan-500/20"
        >
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed text-center">
            TeamCodeBridge는 단순히 '코딩을 가르치는 교육팀'이 아닙니다.
            <br className="hidden md:block" />
            학생들이 <span className="text-cyan-400 font-semibold">스스로 기획하고, 제작하고, 세상에 선보일 수 있는 힘</span>을 기르는 것을 목표로 합니다.
            <br className="hidden md:block" />
            누구든지 자신의 생각을 표현하고, 사람들과 연결되고, 의미 있는 결과를 만들어내는 경험.
            <br className="hidden md:block" />
            그게 바로 TeamCodeBridge가 지향하는 교육입니다.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
