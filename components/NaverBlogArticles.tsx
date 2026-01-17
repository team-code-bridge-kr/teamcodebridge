'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface Article {
    id: string
    title: string
    date: string
    category: string
    image: string
    description?: string
    url?: string
}

export default function NaverBlogArticles() {
    const [articles, setArticles] = useState<Article[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                setLoading(true)
                // 네이버 블로그 RSS URL
                const naverBlogRssUrl = process.env.NEXT_PUBLIC_NAVER_BLOG_RSS_URL ||
                    'https://blog.naver.com/activejang?fromRss=true&trackingCode=rss' // 기본값

                const response = await fetch(
                    `/api/stories?source=rss&rss_url=${encodeURIComponent(naverBlogRssUrl)}`
                )

                if (!response.ok) {
                    throw new Error('Failed to fetch articles')
                }

                const data = await response.json()
                // 최대 6개만 표시 (2x3 그리드)
                setArticles((data.stories || []).slice(0, 6))
            } catch (err) {
                console.error('Error fetching Naver Blog articles:', err)
                setError('기사를 불러올 수 없습니다.')
            } finally {
                setLoading(false)
            }
        }

        fetchArticles()
    }, [])

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto text-center py-12">
                <div className="text-gray-400">기사를 불러오는 중...</div>
            </div>
        )
    }

    if (error || articles.length === 0) {
        return (
            <div className="max-w-6xl mx-auto text-center py-12">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    최신 소식
                </h2>
                <p className="text-gray-600">
                    {error || '표시할 기사가 없습니다.'}
                </p>
            </div>
        )
    }

    return (
        <>
            {/* 헤더 섹션 - 전체 너비 */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 w-screen p-12 md:p-16 mb-12 overflow-hidden"
                style={{ marginLeft: 'calc(50% - 50vw)', marginRight: 'calc(50% - 50vw)' }}
            >
                {/* 배경 장식 요소 */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-500/20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />

                <div className="relative z-10 max-w-6xl mx-auto">
                    <div className="flex-1">
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                            BE THE BRIDGE!
                        </h2>
                        <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                            팀코드브릿지의 활동, 교육현장, 활동후기를 포스팅하고 있어요.
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* 2x3 그리드 */}
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.map((article, index) => (
                        <motion.a
                            key={article.id}
                            href={article.url || '#'}
                            target={article.url ? '_blank' : undefined}
                            rel={article.url ? 'noopener noreferrer' : undefined}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer group block border border-gray-200 flex flex-col"
                        >
                            {/* 이미지 */}
                            <div className="relative w-full aspect-video bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
                                {article.image && article.image !== '/api/placeholder/400/250' ? (
                                    <img
                                        src={article.image}
                                        alt={article.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        loading="lazy"
                                        referrerPolicy="no-referrer"
                                        onError={(e) => {
                                            console.error('Image load error:', article.image)
                                            const target = e.currentTarget
                                            // 네이버 블로그 이미지 URL에서 ?type=s3 제거 시도
                                            if (target.src.includes('blogthumb.pstatic.net') && target.src.includes('?type=')) {
                                                const newSrc = target.src.split('?')[0]
                                                console.log('Trying without query params:', newSrc)
                                                target.src = newSrc
                                            } else {
                                                target.src = '/api/placeholder/400/250'
                                            }
                                        }}
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
                            </div>

                            {/* 내용 */}
                            <div className="p-6">
                                {/* 날짜 */}
                                <div className="text-xs text-gray-500 mb-3">
                                    {article.date}
                                </div>

                                {/* 제목 */}
                                <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-cyan-600 transition-colors break-keep">
                                    {article.title}
                                </h3>

                                {/* 설명 (있는 경우) */}
                                {article.description && (
                                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 break-keep">
                                        {article.description}
                                    </p>
                                )}
                            </div>
                        </motion.a>
                    ))}
                </div>
            </div>
        </>
    )
}

