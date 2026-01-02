'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

interface PhilosophyItem {
  id: number
  title: string
  description: string
}

const philosophies: PhilosophyItem[] = [
  {
    id: 1,
    title: '모두를 위한 교육',
    description: '코딩을 처음 접하는 학생도 쉽게 참여할 수 있는 친절하고 포용적인 교육을 지향합니다.',
  },
  {
    id: 2,
    title: '자율성과 창의성 존중',
    description: '학생이 스스로 주제를 정하고, 문제를 정의하며, 해결 과정을 주도할 수 있도록 돕습니다.',
  },
  {
    id: 3,
    title: '함께 성장하는 팀워크',
    description: '팀 활동을 통해 소통과 협력 능력을 기르며, 함께 고민하고 함께 해결하는 경험을 만듭니다.',
  },
  {
    id: 4,
    title: '기술 접근성 확대',
    description: '누구나 원하는 기술을 배울 수 있도록 개별 수준에 맞춘 멘토링과 실습 중심 교육을 제공합니다.',
  },
]

export default function Philosophy() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            교육 철학
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {philosophies.map((philosophy, index) => (
            <motion.div
              key={philosophy.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {philosophy.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {philosophy.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}


