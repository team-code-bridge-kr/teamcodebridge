'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

interface Achievement {
  category: string
  items: string[]
}

const achievements: Achievement[] = [
  {
    category: '전국 규모 수상 실적',
    items: [
      'LG CNS 전국 AI Genius Academy 1위',
      'POSCO DX 전국 AI Youth Challenge 2위',
      '제3회 전국 유스해커톤 1위',
      'K-해커톤 2분과 대상 (421팀 중 1위)',
      '전국 대학생 SW 창업경진대회 2년 연속 대상 수상',
    ],
  },
  {
    category: '실전 프로젝트 & 창업 경험',
    items: [
      '예비창업패키지 6천만 원 사업비 수혜',
      '서울시 캠퍼스타운 입주기업 선정',
      'UNIST 슈퍼컴퓨팅캠프 KISTI 원장상 수상',
      'AI취업솔루션 TIO 대표 운영',
      '(주) 더이노베이터스 / 렉쳐플래닛 등 에듀테크·AI기업 실무 참여',
    ],
  },
  {
    category: '교육 전문가 & 강의 경력',
    items: [
      '동국대학교사범대학부속고 AI/SW 교사',
      '대치동 출강 영어/프로그래밍 강사',
      '광운대, 서령고, 충남 평생교육원 등 다수 강의',
      '초중고 대상 AI·코딩 멘토링 200+회 이상 진행',
      '연필자루책 시리즈 저자 및 출판사 대표',
    ],
  },
  {
    category: 'AI·SW 연구 및 논문 활동',
    items: [
      '악플탐지 관련 AI 특허 4건 출원',
      '열화상 얼굴 집중도 분석 등 AI 기반 논문 다수',
      '정보보호·수학·로봇 관련 영재원 최우수 이수 다수',
      '한국저작권위원회 다수의 프로그램 저작권 등록',
    ],
  },
]

export default function Mentors() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="mentors" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            TeamCodeBridge 멘토, 왜 특별할까요?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            단순히 "코딩을 가르치는 사람"이 아닙니다.
            <br />
            학생의 가능성을 발견하고, 함께 성장하는 리더들입니다.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.category}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-gradient-to-br from-primary-50 to-white rounded-2xl p-8 shadow-lg"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="text-primary-600 mr-3">✨</span>
                {achievement.category}
              </h3>
              <ul className="space-y-3">
                {achievement.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start">
                    <span className="text-primary-600 mr-3 mt-1">•</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <div className="bg-gray-900 text-white rounded-2xl p-8">
            <p className="text-xl font-semibold mb-2">
              이 멘토들이 바로, TeamCodeBridge를 이끌어갑니다.
            </p>
            <p className="text-gray-300">
              디지털 콘텐츠 & 온라인 영향력: 유튜브·인스타그램·틱톡 총합 2천만 조회수 이상
              <br />
              활발한 대외활동 & 리더십: 연세·고려·숭실·광운대 등 주요 대학 IT학회 리더
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

