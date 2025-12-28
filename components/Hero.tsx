'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

interface StatItem {
  label: string
  value: string
  suffix?: string
}

const stats: StatItem[] = [
  { label: '참여 대학', value: '10', suffix: '개' },
  { label: '멘토링 횟수', value: '200', suffix: '+' },
  { label: '참여 학생', value: '1000', suffix: '+' },
  { label: '협력 학교', value: '30', suffix: '+' },
  { label: '프로젝트', value: '100', suffix: '+' },
]

export default function Hero() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="relative min-h-screen bg-black overflow-hidden flex items-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/Users/activejang/.gemini/antigravity/brain/cdbe3d7f-c4f6-49c2-8a1b-913e3922433a/tcb_hero_premium_illustration_1766587384682.png"
          alt="TCB Hero Background"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />
      </div>

      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/10 rounded-full"
            initial={{
              x: Math.random() * 100 + '%',
              y: Math.random() * 100 + '%',
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{
              y: [null, '-100%'],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 mb-8"
          >
            <span className="text-yellow-400 text-lg">🏆</span>
            <span className="text-white text-sm font-semibold tracking-tight">교육부장관상 수상</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="gradient-text text-base md:text-lg font-bold mb-4 tracking-widest uppercase">
              At the Edge of Possibility, IT Education Begins
            </p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-[40px] font-bold text-white mb-6 leading-tight"
          >
            가능성의 끝에서
            <br />
            <span className="gradient-text">
              IT 교육이 시작되는 곳
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-gray-400 text-base md:text-lg max-w-3xl mx-auto mb-10"
          >
            대학생들이 직접 운영하는 비영리 IT 교육봉사, 팀코드브릿지!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20"
          >
            <a
              href="#recruit"
              className="bg-gradient-to-r from-brand to-brand-dark text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-brand-light hover:to-brand transition-all transform hover:scale-105 shadow-lg shadow-brand/25"
            >
              26 시즌 멘토링 신청 →
            </a>
            <a
              href="#about"
              className="border border-white/30 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition-all backdrop-blur-sm"
            >
              더 알아보기
            </a>
          </motion.div>
        </div>

        {/* Statistics Section */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-4 max-w-5xl mx-auto"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                {stat.value}
                <span className="text-primary-500 text-xl md:text-2xl">{stat.suffix}</span>
              </div>
              <div className="text-gray-500 text-sm md:text-base font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-3 bg-white/50 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
