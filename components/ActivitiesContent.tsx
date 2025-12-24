'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

interface Activity {
    id: number
    title: string
    description: string
    icon: string
    details: string[]
}

const activities: Activity[] = [
    {
        id: 1,
        title: '멘토링톤',
        description: '컴퓨터공학 전공 선배들과 함께하는 창의적 미니 해커톤!',
        icon: '🚀',
        details: [
            'AI·소프트웨어 프로젝트 기획부터 프로토타입 개발',
            '기획력과 문제해결력을 키우는 팀 기반 챌린지',
            '실제 서비스 런칭 경험',
        ],
    },
    {
        id: 2,
        title: '멘토링',
        description: '대학 진학을 위한 실질적인 진로 상담과 코딩 멘토링',
        icon: '💡',
        details: [
            '입시 꿀팁, 생활기록부 작성 가이드',
            '세특 설계 및 코딩 프로젝트 기획',
            '1:1 맞춤형 멘토링',
        ],
    },
    {
        id: 3,
        title: '스쿨어택',
        description: '멘토들이 직접 고등학교로 찾아가는 출동형 프로그램',
        icon: '🎯',
        details: [
            '코딩 교육 & 진로 멘토링',
            '처음 접하는 학생도 쉽게 이해',
            '학교 맞춤형 커리큘럼 제공',
        ],
    },
    {
        id: 4,
        title: '코딩콘서트',
        description: '우수 멘토들의 성공 스토리와 개발 팁 공유',
        icon: '🎤',
        details: [
            '실제 경험 기반 강연',
            'AI, 소프트웨어 분야 인사이트',
            '네트워킹 기회 제공',
        ],
    },
]

export default function ActivitiesContent() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: '-100px' })

    return (
        <section className="py-24 bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
                        주요 활동
                    </h1>
                    <p className="text-base md:text-lg text-gray-400 max-w-3xl mx-auto">
                        TeamCodeBridge에서 진행하는 다양한 프로그램을 소개합니다
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8">
                    {activities.map((activity, index) => (
                        <motion.div
                            key={activity.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: index * 0.15 }}
                            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-cyan-500/50 transition-all"
                        >
                            <span className="text-5xl mb-4 block">{activity.icon}</span>
                            <h3 className="text-2xl font-bold text-white mb-3">
                                {activity.title}
                            </h3>
                            <p className="text-gray-400 mb-4">{activity.description}</p>
                            <ul className="space-y-2">
                                {activity.details.map((detail, i) => (
                                    <li key={i} className="flex items-start text-gray-500 text-sm">
                                        <span className="text-cyan-400 mr-2">•</span>
                                        {detail}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
