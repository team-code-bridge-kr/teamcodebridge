'use client'

import { useState } from 'react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

interface Project {
    id: number
    title: string
    subtitle: string
    description: string
    image: string
    color: string
    details: string[]
    date?: string
}

const projects: Project[] = [
    {
        id: 1,
        title: '멘토링톤',
        subtitle: '미니 해커톤',
        description: '컴퓨터공학 전공 선배들과 함께하는 창의적 미니 해커톤! AI·소프트웨어 프로젝트를 기획부터 프로토타입 개발까지 함께 진행합니다.',
        image: '/images/mentoringthon.jpg',
        color: 'from-purple-500 to-pink-500',
        details: [
            '팀 빌딩 및 아이디어 발굴',
            '기획서 작성 및 피드백',
            '프로토타입 개발',
            '최종 발표 및 시상',
        ],
        date: '2024.12',
    },
    {
        id: 2,
        title: '멘토링',
        subtitle: '1:1 진로 상담',
        description: '대학 진학을 위한 입시 꿀팁부터, 생활기록부 작성, 세특 설계, 코딩 프로젝트 기획 등 실질적인 진로 상담을 제공합니다.',
        image: '/images/mentoring.jpg',
        color: 'from-blue-500 to-cyan-500',
        details: [
            '입시 전략 상담',
            '생활기록부 작성 가이드',
            '세특 주제 선정 및 설계',
            '코딩 프로젝트 기획 지원',
        ],
        date: '상시 운영',
    },
    {
        id: 3,
        title: '스쿨어택',
        subtitle: '찾아가는 코딩 교육',
        description: '멘토들이 직접 고등학교로 찾아가는 출동형 코딩 교육 & 진로 멘토링 프로그램입니다.',
        image: '/images/schoolattack.jpg',
        color: 'from-orange-500 to-red-500',
        details: [
            '학교 방문 코딩 수업',
            '진로 특강 진행',
            '학교 맞춤형 커리큘럼',
            '실습 중심 교육',
        ],
        date: '2024.11',
    },
    {
        id: 4,
        title: '코딩콘서트',
        subtitle: '성공 스토리 강연',
        description: '우수 멘토들이 들려주는 실제 경험 기반의 성공 스토리와 AI, 소프트웨어 분야의 개발 팁을 공유하는 강연입니다.',
        image: '/images/codingconcert.jpg',
        color: 'from-green-500 to-emerald-500',
        details: [
            '멘토 경험담 공유',
            'AI/SW 트렌드 소개',
            '진로 Q&A 세션',
            '네트워킹 시간',
        ],
        date: '2024.10',
    },
    {
        id: 5,
        title: 'AI 워크숍',
        subtitle: '실습형 AI 교육',
        description: 'ChatGPT, 이미지 생성 AI 등 최신 AI 도구를 활용한 실습 중심 워크숍을 진행합니다.',
        image: '/images/aiworkshop.jpg',
        color: 'from-indigo-500 to-purple-500',
        details: [
            'ChatGPT 활용법',
            '이미지 생성 AI 실습',
            'AI 프로젝트 기획',
            '결과물 공유',
        ],
        date: '2024.09',
    },
]

export default function ProjectsPage() {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null)

    return (
        <main className="min-h-screen bg-white">
            <Navigation variant="light" />

            {/* Hero Section */}
            <section className="pt-24 pb-12 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-cyan-600 font-medium mb-4 tracking-wide">PROJECTS</p>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                        활동 갤러리
                    </h1>
                    <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
                        TeamCodeBridge의 활동들을 확인해보세요.<br className="hidden md:block" />
                        이미지를 클릭하면 상세 내용을 볼 수 있습니다.
                    </p>
                </div>
            </section>

            {/* Gallery Grid - Notion Style */}
            <section className="py-8 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                onClick={() => setSelectedProject(project)}
                                className="group cursor-pointer relative aspect-square rounded-xl overflow-hidden bg-gray-100 hover:shadow-xl transition-all duration-300"
                            >
                                {/* Gradient Background (placeholder for image) */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-90`} />

                                {/* Content */}
                                <div className="absolute inset-0 p-4 flex flex-col justify-end">
                                    <div className="transform group-hover:translate-y-0 transition-transform">
                                        <p className="text-white/80 text-xs mb-1">{project.subtitle}</p>
                                        <h3 className="text-white font-bold text-lg md:text-xl">{project.title}</h3>
                                        {project.date && (
                                            <p className="text-white/60 text-xs mt-2">{project.date}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Hover overlay */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                    <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium">
                                        자세히 보기 →
                                    </span>
                                </div>
                            </div>
                        ))}

                        {/* Add placeholder for adding more */}
                        <div className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                            <div className="text-center text-gray-400">
                                <span className="text-3xl block mb-2">+</span>
                                <span className="text-sm">더 많은 활동이<br />추가될 예정입니다</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Modal */}
            {selectedProject && (
                <div
                    className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedProject(null)}
                >
                    <div
                        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header with gradient */}
                        <div className={`h-48 bg-gradient-to-br ${selectedProject.color} relative rounded-t-2xl`}>
                            <button
                                onClick={() => setSelectedProject(null)}
                                className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
                            >
                                ✕
                            </button>
                            <div className="absolute bottom-6 left-6">
                                <p className="text-white/80 text-sm mb-1">{selectedProject.subtitle}</p>
                                <h2 className="text-white text-3xl font-bold">{selectedProject.title}</h2>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6">
                            {selectedProject.date && (
                                <p className="text-gray-400 text-sm mb-4">{selectedProject.date}</p>
                            )}

                            <p className="text-gray-700 leading-relaxed mb-6">
                                {selectedProject.description}
                            </p>

                            <h4 className="font-semibold text-gray-900 mb-3">주요 내용</h4>
                            <ul className="space-y-2 mb-6">
                                {selectedProject.details.map((detail, i) => (
                                    <li key={i} className="flex items-start text-gray-600">
                                        <span className="text-cyan-500 mr-3">•</span>
                                        {detail}
                                    </li>
                                ))}
                            </ul>

                            <div className="pt-4 border-t border-gray-100">
                                <a
                                    href="/#recruit"
                                    className="inline-block bg-gray-900 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
                                >
                                    참여 신청하기 →
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </main>
    )
}
