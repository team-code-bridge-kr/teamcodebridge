'use client'

import { useState, useEffect } from 'react'
import { ClockIcon, CalendarIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface CalendarEvent {
    id: string
    title: string
    description: string | null
    startDate: string
    endDate: string | null
    location: string | null
    type: string
    color: string | null
    createdBy?: {
        id: string
        name: string | null
        email: string | null
    } | null
}

export default function UpcomingMeetingsWidget() {
    const [upcomingEvents, setUpcomingEvents] = useState<CalendarEvent[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchUpcomingEvents()
    }, [])

    const fetchUpcomingEvents = async () => {
        try {
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            const nextWeek = new Date(today)
            nextWeek.setDate(nextWeek.getDate() + 7)

            const res = await fetch(
                `/api/calendar/events?startDate=${today.toISOString()}&endDate=${nextWeek.toISOString()}`
            )
            if (res.ok) {
                const data = await res.json()
                // 회의 타입만 필터링하고 날짜순으로 정렬
                const meetings = data
                    .filter((event: CalendarEvent) => event.type === '회의')
                    .sort((a: CalendarEvent, b: CalendarEvent) => 
                        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
                    )
                    .slice(0, 5) // 최대 5개
                setUpcomingEvents(meetings)
            }
        } catch (error) {
            console.error('Error fetching upcoming events:', error)
        } finally {
            setLoading(false)
        }
    }

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const eventDate = new Date(date)
        eventDate.setHours(0, 0, 0, 0)

        const daysDiff = Math.floor((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

        let dateStr = ''
        if (daysDiff === 0) {
            dateStr = '오늘'
        } else if (daysDiff === 1) {
            dateStr = '내일'
        } else if (daysDiff === 2) {
            dateStr = '모레'
        } else {
            dateStr = `${date.getMonth() + 1}/${date.getDate()}`
        }

        const timeStr = date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })

        return { date: dateStr, time: timeStr }
    }

    if (loading) {
        return (
            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <ClockIcon className="w-6 h-6 text-primary-600" />
                    <h2 className="text-xl font-black text-black">예정된 회의</h2>
                </div>
                <Link
                    href="/workspace/meetings"
                    className="text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors"
                >
                    전체 보기 →
                </Link>
            </div>

            {upcomingEvents.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                    <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="font-bold">예정된 회의가 없습니다</p>
                    <Link
                        href="/workspace/meetings"
                        className="mt-4 inline-block text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors"
                    >
                        회의 일정 투표 →
                    </Link>
                </div>
            ) : (
                <div className="space-y-3">
                    {upcomingEvents.map((event) => {
                        const { date, time } = formatDateTime(event.startDate)
                        return (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 rounded-xl border border-gray-200 hover:border-primary-200 hover:shadow-md transition-all"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="flex-shrink-0 w-14 text-center">
                                                <div className="text-xs font-bold text-gray-500">{date}</div>
                                                <div className="text-sm font-black text-gray-900">{time}</div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-black text-black text-base mb-1 truncate">
                                                    {event.title}
                                                </h3>
                                                {event.location && (
                                                    <div className="text-xs text-gray-500 truncate">
                                                        📍 {event.location}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {event.color && (
                                        <div
                                            className="flex-shrink-0 w-4 h-4 rounded-full"
                                            style={{ backgroundColor: event.color }}
                                        />
                                    )}
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

