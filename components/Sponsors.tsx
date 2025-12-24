'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

interface Sponsor {
  id: number
  name: string
  logo: string
}

// 샘플 후원사 데이터 (실제 데이터로 교체 필요)
const sponsors: Sponsor[] = [
  { id: 1, name: 'F-Lab', logo: '/api/placeholder/200/100' },
  { id: 2, name: 'Elice', logo: '/api/placeholder/200/100' },
  { id: 3, name: 'Goorm', logo: '/api/placeholder/200/100' },
  { id: 4, name: 'FiveSpot', logo: '/api/placeholder/200/100' },
  { id: 5, name: 'Greeting', logo: '/api/placeholder/200/100' },
]

export default function Sponsors() {
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
            TeamCodeBridge의 후원사
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            TeamCodeBridge와 새로운 가치를 만들어갈 후원 및 협업 문의, 언제든 기다리고 있습니다.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center">
          {sponsors.map((sponsor, index) => (
            <motion.div
              key={sponsor.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow flex items-center justify-center h-32"
            >
              <div className="text-gray-400 text-lg font-semibold">
                {sponsor.name}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="mailto:contact@teamcodebridge.com"
            className="inline-block bg-gray-900 text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors"
          >
            후원 문의하기
          </a>
        </div>
      </div>
    </section>
  )
}

