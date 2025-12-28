'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

interface Testimonial {
  id: number
  name: string
  school: string
  review: string
  gradient: string
  icon: string
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: '김민준',
    school: 'OO고등학교 2학년',
    review: '막연하기만 했던 AI 개발자의 꿈이 구체화되었어요. 멘토님들과 함께 프로젝트를 완성하며 할 수 있다는 자신감을 얻었습니다!',
    gradient: 'from-purple-500 to-pink-500',
    icon: '✨',
  },
  {
    id: 2,
    name: '이서연',
    school: 'XX중학교 3학년',
    review: '코딩이 이렇게 재밌는 건지 처음 알았어요. 어려운 개념도 눈높이에 맞춰 설명해주셔서 포기하지 않고 끝까지 마칠 수 있었습니다.',
    gradient: 'from-blue-500 to-cyan-500',
    icon: '💡',
  },
  {
    id: 3,
    name: '박지훈',
    school: '△△고등학교 1학년',
    review: '생기부 세특 방향을 못 잡고 있었는데, 멘토링을 통해 저만의 차별화된 IT 프로젝트 스토리를 만들 수 있어 정말 유익했습니다.',
    gradient: 'from-orange-500 to-red-500',
    icon: '🎯',
  },
  {
    id: 4,
    name: '최아인',
    school: '□□고등학교 2학년',
    review: '해커톤에서 팀원들과 밤새 고민하며 문제를 해결했던 경험은 평생 잊지 못할 거예요. 기술 그 이상의 가치를 배웠습니다.',
    gradient: 'from-green-500 to-emerald-500',
    icon: '🤝',
  },
  {
    id: 5,
    name: '정우진',
    school: '◇◇중학교 2학년',
    review: '단순한 강의가 아니라 진짜 형, 누나처럼 진로 고민을 들어주셔서 감사했어요. 다음 시즌에도 꼭 다시 참여하고 싶어요!',
    gradient: 'from-indigo-500 to-purple-500',
    icon: '❤️',
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
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Scroll to current testimonial
  useEffect(() => {
    if (scrollRef.current) {
      const cardWidth = 340
      const gap = 20
      scrollRef.current.scrollTo({
        left: currentIndex * (cardWidth + gap),
        behavior: 'smooth'
      })
    }
  }, [currentIndex])

  return (
    <section id="projects" className="py-20 bg-black relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            함께 성장한 <span className="gradient-text">학생들의 이야기</span>
          </h2>
          <p className="text-sm md:text-base text-gray-400">
            팀코드브릿지와 함께 꿈을 현실로 만든 멘티들의 생생한 후기입니다
          </p>
        </motion.div>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-10 px-4 md:px-8 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Spacer for centering */}
          <div className="flex-shrink-0 w-[calc((100vw-300px)/2-20px)] hidden md:block" />

          {testimonials.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`flex-shrink-0 w-[280px] md:w-[340px] snap-center cursor-pointer group transition-all duration-500 ${currentIndex === index ? 'scale-100' : 'scale-90 opacity-40 blur-[1px]'
                }`}
              onClick={() => setCurrentIndex(index)}
            >
              <div className="h-full bg-white/[0.03] border border-white/10 rounded-2xl p-6 md:p-8 relative overflow-hidden backdrop-blur-sm">
                {/* Quote Icon */}
                <div className="absolute top-4 right-6 text-white/10 text-6xl font-serif">"</div>

                <div className="relative z-10">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${item.gradient} flex items-center justify-center text-2xl mb-6 shadow-lg`}>
                    {item.icon}
                  </div>

                  <p className="text-white/90 text-sm md:text-base leading-relaxed mb-8 font-medium italic">
                    "{item.review}"
                  </p>

                  <div className="flex items-center border-t border-white/10 pt-6">
                    <div>
                      <h4 className="text-white font-bold text-base">{item.name} 학생</h4>
                      <p className="text-gray-500 text-xs mt-1">{item.school}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Spacer for centering */}
          <div className="flex-shrink-0 w-[calc((100vw-300px)/2-20px)] hidden md:block" />
        </div>

        {/* Progress dots */}
        <div className="flex justify-center space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${currentIndex === index
                ? 'bg-brand w-8'
                : 'bg-white/20 w-1.5 hover:bg-white/40'
                }`}
              aria-label={`후기 ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* View more link */}
      <div className="text-center mt-12">
        <a
          href="/activities"
          className="inline-flex items-center text-gray-400 hover:text-white font-medium transition-colors group"
        >
          활동 후기 더보기
          <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
        </a>
      </div>
    </section>
  )
}
