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
    <section className="relative min-h-screen bg-black overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black to-slate-900" />

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
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-cyan-400 text-base md:text-lg font-medium mb-4 tracking-wide">
              가능성의 끝에서 IT 교육의 시작!
            </p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-[40px] font-bold text-white mb-6 leading-tight"
          >
            아이디어와 열정, 실행력을 가진
            <br />
            사람들이 함께
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-500">
              세상을 바꾸는 프로젝트
            </span>
            를 만들어요
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-gray-400 text-base md:text-lg max-w-3xl mx-auto mb-10"
          >
            연세대·고려대·포항공대·숭실대·동국대·광운대·명지대·삼육대·가천대
            <br className="hidden md:block" />
            컴퓨터 관련 학과 학생들이 모인 연합 봉사 동아리
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20"
          >
            <a
              href="#recruit"
              className="bg-gradient-to-r from-cyan-500 to-teal-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-cyan-600 hover:to-teal-700 transition-all transform hover:scale-105 shadow-lg shadow-cyan-500/25"
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
                <span className="text-cyan-400 text-xl md:text-2xl">{stat.suffix}</span>
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
