'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

interface Project {
  id: number
  name: string
  description: string
  gradient: string
  icon: string
}

const projects: Project[] = [
  {
    id: 1,
    name: '멘토링톤',
    description: '컴퓨터공학 전공 선배들과 함께하는 창의적 미니 해커톤! AI·소프트웨어 프로젝트를 기획부터 프로토타입 개발까지 함께 진행합니다.',
    gradient: 'from-purple-500 to-pink-500',
    icon: '🚀',
  },
  {
    id: 2,
    name: '멘토링',
    description: '대학 진학을 위한 입시 꿀팁부터, 생활기록부 작성, 세특 설계, 코딩 프로젝트 기획 등 실질적인 진로 상담을 제공합니다.',
    gradient: 'from-blue-500 to-cyan-500',
    icon: '💡',
  },
  {
    id: 3,
    name: '스쿨어택',
    description: '멘토들이 직접 고등학교로 찾아가는 출동형 코딩 교육 & 진로 멘토링 프로그램입니다.',
    gradient: 'from-orange-500 to-red-500',
    icon: '🎯',
  },
  {
    id: 4,
    name: '코딩콘서트',
    description: '우수 멘토들이 들려주는 실제 경험 기반의 성공 스토리와 AI, 소프트웨어 분야의 개발 팁을 공유하는 강연입니다.',
    gradient: 'from-green-500 to-emerald-500',
    icon: '🎤',
  },
  {
    id: 5,
    name: 'AI 워크숍',
    description: 'ChatGPT, 이미지 생성 AI 등 최신 AI 도구를 활용한 실습 중심 워크숍을 진행합니다.',
    gradient: 'from-indigo-500 to-purple-500',
    icon: '🤖',
  },
]

export default function Projects() {
  const ref = useRef(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [currentIndex, setCurrentIndex] = useState(0)

  // Auto scroll effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % projects.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  // Scroll to current project
  useEffect(() => {
    if (scrollRef.current) {
      const cardWidth = 360
      const gap = 24
      scrollRef.current.scrollTo({
        left: currentIndex * (cardWidth + gap),
        behavior: 'smooth'
      })
    }
  }, [currentIndex])

  return (
    <section id="projects" className="py-16 bg-black overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            활동 사례 모아보기
          </h2>
          <p className="text-sm md:text-base text-gray-400">
            TeamCodeBridge의 다양한 프로그램을 소개합니다
          </p>
        </motion.div>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-6 px-4 md:px-8 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Spacer for centering */}
          <div className="flex-shrink-0 w-[calc((100vw-320px)/2-20px)] hidden md:block" />

          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`flex-shrink-0 w-[300px] md:w-[340px] snap-center cursor-pointer group transition-all duration-300 ${currentIndex === index ? 'scale-100' : 'scale-95 opacity-70'
                }`}
              onClick={() => setCurrentIndex(index)}
            >
              <div className={`h-full bg-gradient-to-br ${project.gradient} rounded-2xl p-6 relative overflow-hidden`}>
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                </div>

                <div className="relative z-10">
                  <span className="text-4xl mb-3 block">{project.icon}</span>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {project.name}
                  </h3>
                  <p className="text-white/90 text-xs md:text-sm leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Hover effect */}
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300 rounded-2xl" />
              </div>
            </motion.div>
          ))}

          {/* Spacer for centering */}
          <div className="flex-shrink-0 w-[calc((100vw-360px)/2-24px)] hidden md:block" />
        </div>

        {/* Progress dots */}
        <div className="flex justify-center mt-8 space-x-2">
          {projects.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${currentIndex === index
                ? 'bg-cyan-500 w-8'
                : 'bg-gray-600 w-2 hover:bg-gray-500'
                }`}
              aria-label={`프로젝트 ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* View more link */}
      <div className="text-center mt-12">
        <a
          href="#all-projects"
          className="inline-flex items-center text-gray-400 hover:text-white font-medium transition-colors group"
        >
          프로젝트 더보기
          <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
        </a>
      </div>
    </section>
  )
}
