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
  { label: '멘토링 횟수', value: '200', suffix: '+회' },
  { label: '참여 학생', value: '100', suffix: '+명' },
  { label: '제작 프로젝트', value: '30', suffix: '+개' },
  { label: '교육 만족도', value: '4.85', suffix: '/5.0' },
  { label: '재참여 의향', value: '4.9', suffix: '/5.0' },
]

export default function Statistics() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            지금 TeamCodeBridge는 이렇게 움직여요
          </h2>
          <p className="text-xl text-gray-600">
            대학생들이 직접 운영하는 비영리 IT 교육봉사, 팀코드브릿지!
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                {isInView ? (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
                  >
                    {stat.value}
                    {stat.suffix && (
                      <span className="text-2xl md:text-3xl">{stat.suffix}</span>
                    )}
                  </motion.span>
                ) : (
                  '0'
                )}
              </div>
              <div className="text-sm md:text-base text-gray-600 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

