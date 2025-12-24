'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

interface Activity {
  id: number
  name: string
  description: string
  icon: string
}

const activities: Activity[] = [
  {
    id: 1,
    name: '멘토링톤',
    description: '컴퓨터공학 전공 선배들과 함께하는 창의적 미니 해커톤! AI·소프트웨어 프로젝트를 기획부터 프로토타입 개발까지 함께 진행하며, 기획력과 문제해결력을 키울 수 있는 팀 기반 챌린지형 활동입니다.',
    icon: '🚀',
  },
  {
    id: 2,
    name: '멘토링',
    description: '대학 진학을 위한 입시 꿀팁부터, 생활기록부 작성, 세특 설계, 코딩 프로젝트 기획 등 실질적인 진로 상담과 코딩 멘토링을 제공합니다. 비전공자도 쉽게 접근할 수 있도록 1:1 또는 소규모 그룹으로 진행됩니다.',
    icon: '👥',
  },
  {
    id: 3,
    name: '스쿨어택',
    description: '멘토들이 직접 고등학교로 찾아가는 출동형 코딩 교육 & 진로 멘토링 프로그램입니다. 코딩을 처음 접하는 학생도 이해할 수 있도록 구성되며, 학생들과 눈높이를 맞춘 멘토들이 직접 수업을 진행합니다.',
    icon: '🏫',
  },
  {
    id: 4,
    name: '코딩콘서트',
    description: '우수 멘토들이 들려주는 실제 경험 기반의 성공 스토리와 AI, 소프트웨어 분야의 유용한 개발 팁을 공유하는 강연 프로그램입니다. 프로젝트에 동기부여가 필요한 학생들에게 자극과 영감을 주는 시간이 됩니다.',
    icon: '🎤',
  },
]

export default function Activities() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="activities" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            주요 활동
          </h2>
          <p className="text-xl text-gray-600">
            TeamCodeBridge의 활동은 크게 멘토링톤, 멘토링, 스쿨어택, 코딩콘서트로 나뉩니다
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex items-start space-x-4">
                <div className="text-5xl">{activity.icon}</div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {activity.name}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {activity.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

