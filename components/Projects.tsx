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
    name: '이OO',
    school: '중학생 멘티',
    review: 'AI가 나의 목소리를 학습해 노래를 부르게 하는 활동이 정말 신기했어요. AI를 어떻게 활용하는지 알게 되었고, 열정적으로 가르쳐주시는 선생님들이 너무 멋져 보였습니다! 🥺',
    gradient: 'from-purple-500 to-pink-500',
    icon: '✨',
  },
  {
    id: 2,
    name: '김OO',
    school: '고등학생 멘티',
    review: '막막했던 생기부 작성의 해답을 찾은 기분이에요. SKY 멘토님들의 직접적인 피드백 덕분에 제 생기부의 문제점을 깨닫고 앞으로의 개선 방향을 확실히 잡을 수 있었습니다.',
    gradient: 'from-blue-500 to-cyan-500',
    icon: '💡',
  },
  {
    id: 3,
    name: '박OO',
    school: '고등학생 멘티',
    review: '단순히 원리를 배우는 것을 넘어 실제 데이터로 사회적 문제를 해결하는 경험을 했습니다. 데이터 전처리와 변수 설정의 중요성을 실감하며 기술의 가능성을 직접 확인했어요.',
    gradient: 'from-orange-500 to-red-500',
    icon: '🎯',
  },
  {
    id: 4,
    name: '최OO',
    school: '고등학생 멘티',
    review: '코딩을 포기하려 했던 적이 있었는데, 이번 활동을 통해 다시 재미를 느꼈어요. 멘토님들의 공부법을 들으며 동기부여도 많이 되었고, 나도 할 수 있다는 자신감을 얻었습니다.',
    gradient: 'from-green-500 to-emerald-500',
    icon: '🤝',
  },
  {
    id: 5,
    name: '정OO',
    school: '고등학생 멘티',
    review: '팀원들과 밤을 지새우며 서로 격려하고 협동했던 과정이 가장 기억에 남아요. 기획부터 개발까지 제대로 부딪혀보며 기술 그 이상의 가치와 소중한 추억을 만들었습니다.',
    gradient: 'from-indigo-500 to-purple-500',
    icon: '❤️',
  },
  {
    id: 6,
    name: '한OO',
    school: '고등학생 멘티',
    review: '세특을 어떻게 쓸지 아무런 지식이 없었는데 전반적인 방향을 잡게 되었어요! 진짜 도움되는 생기부가 뭔지 알게 된 만큼, 열심히 준비해서 꼭 멘토님들의 대학교 후배가 되고 싶습니다.',
    gradient: 'from-rose-500 to-orange-500',
    icon: '🎓',
  },
]

export default function Projects() {
  const ref = useRef(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [currentIndex, setCurrentIndex] = useState(0)
  const isProgrammaticScroll = useRef(false) // Flag to prevent scroll event conflict

  // Auto scroll effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isProgrammaticScroll.current) {
        handleNext()
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Scroll to current testimonial
  useEffect(() => {
    if (scrollRef.current) {
      const isMobile = window.innerWidth < 768
      let cardWidth
      let gap

      if (isMobile) {
        cardWidth = window.innerWidth * 0.85
        if (cardWidth > 320) cardWidth = 320
        gap = 16
      } else {
        cardWidth = 340
        gap = 20
      }

      const scrollPos = currentIndex * (cardWidth + gap)

      scrollRef.current.scrollTo({
        left: scrollPos,
        behavior: 'smooth'
      })

      // Reset flag after animation
      const timeout = setTimeout(() => {
        isProgrammaticScroll.current = false
      }, 600) // Slightly longer than smooth scroll duration

      return () => clearTimeout(timeout)
    }
  }, [currentIndex])

  const handlePrev = () => {
    isProgrammaticScroll.current = true
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const handleNext = () => {
    isProgrammaticScroll.current = true
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const handleDotClick = (index: number) => {
    isProgrammaticScroll.current = true
    setCurrentIndex(index)
  }

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
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 break-keep">
            함께 성장한 <span className="gradient-text">학생들의 이야기</span>
          </h2>
          <p className="text-sm md:text-base text-gray-400 break-keep">
            팀코드브릿지와 함께 꿈을 현실로 만든 멘티들의 생생한 후기입니다
          </p>
        </motion.div>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="relative group">
        {/* Navigation Buttons - Hidden on mobile */}
        <button
          onClick={handlePrev}
          className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/50 hover:bg-black/80 border border-white/20 rounded-full items-center justify-center text-white transition-all backdrop-blur-sm opacity-0 group-hover:opacity-100 disabled:opacity-0"
          aria-label="Previous slide"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <button
          onClick={handleNext}
          className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/50 hover:bg-black/80 border border-white/20 rounded-full items-center justify-center text-white transition-all backdrop-blur-sm opacity-0 group-hover:opacity-100 disabled:opacity-0"
          aria-label="Next slide"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

        <div
          ref={scrollRef}
          className="flex gap-4 md:gap-5 overflow-x-auto pb-10 px-[50vw] md:px-8 scrollbar-hide snap-x snap-mandatory"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
          onScroll={(e) => {
            if (isProgrammaticScroll.current) return // Ignore scroll events during programmatic scroll

            const container = e.currentTarget
            const scrollLeft = container.scrollLeft

            // Calculate item width dynamically
            // Mobile: 85vw, Desktop: 340px
            let itemWidth
            if (window.innerWidth < 768) {
              itemWidth = window.innerWidth * 0.85
              if (itemWidth > 320) itemWidth = 320 // max-w-[320px]
            } else {
              itemWidth = 340
            }
            // Add gap
            const gap = window.innerWidth < 768 ? 16 : 20 // gap-4 or gap-5
            const totalItemWidth = itemWidth + gap

            const newIndex = Math.round(scrollLeft / totalItemWidth)

            if (newIndex !== currentIndex && newIndex >= 0 && newIndex < testimonials.length) {
              setCurrentIndex(newIndex)
            }
          }}
        >
          {/* Spacer for centering - Adjusted for mobile */}
          <div className="flex-shrink-0 w-[calc((100vw-85vw)/2)] md:w-[calc((100vw-300px)/2-20px)] md:hidden" />
          <div className="flex-shrink-0 w-[calc((100vw-300px)/2-20px)] hidden md:block" />

          {testimonials.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`flex-shrink-0 w-[85vw] max-w-[320px] md:w-[340px] snap-center cursor-pointer group transition-all duration-500 ${currentIndex === index ? 'scale-100 opacity-100' : 'scale-95 opacity-40 blur-[1px]'
                }`}
              onClick={() => handleDotClick(index)}
            >
              <div className="h-full bg-white/[0.03] border border-white/10 rounded-2xl p-6 md:p-8 relative overflow-hidden backdrop-blur-sm">
                {/* Quote Icon */}
                <div className="absolute top-4 right-6 text-white/10 text-6xl font-serif">"</div>

                <div className="relative z-10">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${item.gradient} flex items-center justify-center text-2xl mb-6 shadow-lg`}>
                    {item.icon}
                  </div>

                  <p className="text-white/90 text-sm md:text-base leading-relaxed mb-8 font-medium italic break-keep">
                    "{item.review}"
                  </p>

                  <div className="flex items-center border-t border-white/10 pt-6">
                    <div>
                      <h4 className="text-white font-bold text-base break-keep">{item.name} 학생</h4>
                      <p className="text-gray-500 text-xs mt-1 break-keep">{item.school}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Spacer for centering */}
          <div className="flex-shrink-0 w-[calc((100vw-85vw)/2)] md:w-[calc((100vw-300px)/2-20px)] md:hidden" />
          <div className="flex-shrink-0 w-[calc((100vw-300px)/2-20px)] hidden md:block" />
        </div>

        {/* Progress dots */}
        <div className="flex justify-center space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${currentIndex === index
                ? 'bg-brand w-8'
                : 'bg-white/20 w-1.5 hover:bg-white/40'
                }`}
              aria-label={`후기 ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
