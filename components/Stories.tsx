'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'

interface Story {
  id: string
  title: string
  date: string
  category: string
  image: string
  url?: string
}

export default function Stories() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // API에서 스토리 가져오기
    const fetchStories = async () => {
      try {
        // 환경 변수에서 소스 확인 (기본값: 'notion')
        const source = process.env.NEXT_PUBLIC_STORIES_SOURCE || 'notion'
        const response = await fetch(`/api/stories?source=${source}`)
        const data = await response.json()
        
        if (data.stories && data.stories.length > 0) {
          setStories(data.stories)
        } else {
          // 폴백: 기본 데이터 사용
          setStories([
            {
              id: '1',
              title: '26기 대상 수상팀, 쏙(SSOK)을 만나다',
              date: '2024.01.15',
              category: '수상',
              image: '/api/placeholder/400/250',
            },
            {
              id: '2',
              title: 'TeamCodeBridge 26기, 열매를 수확하다 — 데모데이 현장 스케치',
              date: '2024.01.10',
              category: '이벤트',
              image: '/api/placeholder/400/250',
            },
            {
              id: '3',
              title: '실제처럼 점검하다! 26기 2차 UT 세션 현장',
              date: '2024.01.05',
              category: '세션',
              image: '/api/placeholder/400/250',
            },
            {
              id: '4',
              title: '집중력 ON! 멤버들의 한여름 해커톤 세션 현장',
              date: '2023.12.20',
              category: '해커톤',
              image: '/api/placeholder/400/250',
            },
            {
              id: '5',
              title: 'TeamCodeBridge 26기 운영진을 소개합니다!',
              date: '2023.12.15',
              category: '소개',
              image: '/api/placeholder/400/250',
            },
            {
              id: '6',
              title: 'TeamCodeBridge 26기의 시작, OT부터 팀 매칭까지',
              date: '2023.12.10',
              category: '시작',
              image: '/api/placeholder/400/250',
            },
          ])
        }
      } catch (error) {
        console.error('Error fetching stories:', error)
        // 에러 발생 시 기본 데이터 사용
        setStories([
          {
            id: '1',
            title: '26기 대상 수상팀, 쏙(SSOK)을 만나다',
            date: '2024.01.15',
            category: '수상',
            image: '/api/placeholder/400/250',
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchStories()
  }, [])

  return (
    <section id="stories" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            TeamCodeBridge 안의 사람들, 그리고 이야기
          </h2>
          <p className="text-xl text-gray-600">
            멤버들의 성장 과정, 활동 후기, 밋업 현장과 다양한 이야기를 담고 있어요
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse"
              >
                <div className="aspect-video bg-gray-200" />
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-20 mb-3" />
                  <div className="h-6 bg-gray-200 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((story, index) => (
              <motion.a
                key={story.id}
                href={story.url || '#'}
                target={story.url ? '_blank' : undefined}
                rel={story.url ? 'noopener noreferrer' : undefined}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer group block"
              >
                <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 relative overflow-hidden">
                  {story.image && story.image !== '/api/placeholder/400/250' ? (
                    <img
                      src={story.image}
                      alt={story.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      <svg
                        className="w-16 h-16"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                      {story.category}
                    </span>
                    <span className="text-sm text-gray-500">{story.date}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
                    {story.title}
                  </h3>
                </div>
              </motion.a>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <a
            href="#stories"
            className="inline-block text-gray-700 hover:text-gray-900 font-medium"
          >
            이야기 더보기 ＞
          </a>
        </div>
      </div>
    </section>
  )
}
