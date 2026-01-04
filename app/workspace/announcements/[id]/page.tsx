'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ArrowLeftIcon, CalendarIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

interface Announcement {
    id: string
    title: string
    content: string
    category: string
    isImportant: boolean
    createdAt: string
    createdBy?: {
        id: string
        name: string | null
        email: string | null
    } | null
}

export default function AnnouncementDetailPage() {
    const params = useParams()
    const router = useRouter()
    const id = params?.id as string
    const [announcement, setAnnouncement] = useState<Announcement | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchAnnouncement = async () => {
            try {
                const res = await fetch(`/api/announcements`)
                if (res.ok) {
                    const data = await res.json()
                    const found = data.find((a: Announcement) => a.id === id)
                    setAnnouncement(found || null)
                }
            } catch (error) {
                console.error('Error fetching announcement:', error)
            } finally {
                setLoading(false)
            }
        }

        if (id) {
            fetchAnnouncement()
        }
    }, [id])

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
        })
    }

    if (loading) {
        return (
            <div className="p-8 max-w-4xl mx-auto">
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
            </div>
        )
    }

    if (!announcement) {
        return (
            <div className="p-8 max-w-4xl mx-auto">
                <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-12 text-center">
                    <h2 className="text-2xl font-black text-gray-900 mb-4">공지사항을 찾을 수 없습니다</h2>
                    <p className="text-gray-600 mb-6">요청하신 공지사항이 존재하지 않거나 삭제되었습니다.</p>
                    <button
                        onClick={() => router.push('/workspace')}
                        className="px-6 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors"
                    >
                        홈으로 돌아가기
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden"
            >
                {/* 헤더 */}
                <div className="bg-primary-600 px-6 py-4 flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
                    >
                        <ArrowLeftIcon className="w-5 h-5" />
                    </button>
                    <h1 className="text-white font-black text-lg">공지사항</h1>
                </div>

                {/* 본문 */}
                <div className="p-8">
                    {/* 메타 정보 */}
                    <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
                        {announcement.isImportant && (
                            <span className="px-3 py-1 bg-red-500 text-white text-sm font-black rounded-full">중요</span>
                        )}
                        <span className="px-3 py-1 bg-primary-100 text-primary-600 text-sm font-bold rounded-full">
                            {announcement.category}
                        </span>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <CalendarIcon className="w-4 h-4" />
                            <span>{formatDate(announcement.createdAt)}</span>
                        </div>
                    </div>

                    {/* 제목 */}
                    <h2 className="text-3xl font-black text-gray-900 mb-6">{announcement.title}</h2>

                    {/* 내용 */}
                    <div className="prose prose-lg max-w-none">
                        <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {announcement.content}
                        </div>
                    </div>

                    {/* 작성자 정보 */}
                    {announcement.createdBy && (
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <div className="text-sm text-gray-500">
                                <span className="font-bold">작성자:</span> {announcement.createdBy.name || announcement.createdBy.email || '알 수 없음'}
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* 하단 버튼 */}
            <div className="mt-6 flex justify-center">
                <button
                    onClick={() => router.push('/workspace')}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                >
                    목록으로 돌아가기
                </button>
            </div>
        </div>
    )
}

