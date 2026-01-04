'use client'

import { useState, useEffect } from 'react'
import { CalendarIcon, PlusIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

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

export default function CalendarWidget() {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [events, setEvents] = useState<CalendarEvent[]>([])
    const [loading, setLoading] = useState(true)
    const [viewMode, setViewMode] = useState<'month' | 'week'>('month')

    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    useEffect(() => {
        fetchEvents()
    }, [currentDate])

    const fetchEvents = async () => {
        try {
            const startOfMonth = new Date(year, month, 1)
            const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59)
            
            const res = await fetch(
                `/api/calendar/events?startDate=${startOfMonth.toISOString()}&endDate=${endOfMonth.toISOString()}`
            )
            if (res.ok) {
                const data = await res.json()
                setEvents(data)
            }
        } catch (error) {
            console.error('Error fetching events:', error)
        } finally {
            setLoading(false)
        }
    }

    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
    }

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
    }

    const getEventsForDate = (day: number) => {
        return events.filter(event => {
            const eventDate = new Date(event.startDate)
            return eventDate.getDate() === day && 
                   eventDate.getMonth() === month && 
                   eventDate.getFullYear() === year
        })
    }

    const navigateMonth = (direction: 'prev' | 'next') => {
        setCurrentDate(prev => {
            const newDate = new Date(prev)
            if (direction === 'prev') {
                newDate.setMonth(prev.getMonth() - 1)
            } else {
                newDate.setMonth(prev.getMonth() + 1)
            }
            return newDate
        })
    }

    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
    const weekDays = ['일', '월', '화', '수', '목', '금', '토']
    const today = new Date()

    const isToday = (day: number) => {
        return day === today.getDate() && 
               month === today.getMonth() && 
               year === today.getFullYear()
    }

    return (
        <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <CalendarIcon className="w-6 h-6 text-primary-600" />
                    <h2 className="text-xl font-black text-black">TeamCodeBridge 캘린더</h2>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setViewMode(viewMode === 'month' ? 'week' : 'month')}
                        className="px-3 py-1.5 text-xs font-bold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        {viewMode === 'month' ? '주간' : '월간'}
                    </button>
                    <button
                        onClick={() => setCurrentDate(new Date())}
                        className="px-3 py-1.5 text-xs font-bold text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                    >
                        오늘
                    </button>
                </div>
            </div>

            {/* 월 네비게이션 */}
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={() => navigateMonth('prev')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
                </button>
                <h3 className="text-lg font-black text-gray-900">
                    {year}년 {month + 1}월
                </h3>
                <button
                    onClick={() => navigateMonth('next')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ChevronRightIcon className="w-5 h-5 text-gray-600" />
                </button>
            </div>

            {/* 캘린더 그리드 */}
            <div className="grid grid-cols-7 gap-1 mb-4">
                {weekDays.map(day => (
                    <div key={day} className="text-center text-xs font-bold text-gray-500 py-2">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {/* 빈 칸 (첫 주) */}
                {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square" />
                ))}
                
                {/* 날짜 칸 */}
                {days.map(day => {
                    const dayEvents = getEventsForDate(day)
                    const isTodayDate = isToday(day)
                    
                    return (
                        <div
                            key={day}
                            className={`aspect-square border border-gray-100 rounded-lg p-1 overflow-hidden ${
                                isTodayDate ? 'bg-primary-50 border-primary-300' : 'bg-white hover:bg-gray-50'
                            }`}
                        >
                            <div className={`text-xs font-bold mb-1 ${isTodayDate ? 'text-primary-600' : 'text-gray-700'}`}>
                                {day}
                            </div>
                            <div className="space-y-0.5">
                                {dayEvents.slice(0, 2).map(event => (
                                    <div
                                        key={event.id}
                                        className="text-[10px] px-1 py-0.5 rounded truncate"
                                        style={{
                                            backgroundColor: event.color ? `${event.color}20` : '#3B82F620',
                                            color: event.color || '#3B82F6',
                                        }}
                                        title={event.title}
                                    >
                                        {event.title}
                                    </div>
                                ))}
                                {dayEvents.length > 2 && (
                                    <div className="text-[10px] text-gray-500 px-1">
                                        +{dayEvents.length - 2}
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* 이번 달 이벤트 목록 */}
            {events.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="text-sm font-bold text-gray-700 mb-3">이번 달 일정</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {events.slice(0, 5).map(event => {
                            const eventDate = new Date(event.startDate)
                            return (
                                <div
                                    key={event.id}
                                    className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex-shrink-0 w-12 text-center">
                                        <div className="text-xs font-bold text-gray-500">
                                            {eventDate.getMonth() + 1}/{eventDate.getDate()}
                                        </div>
                                        <div className="text-[10px] text-gray-400">
                                            {weekDays[eventDate.getDay()]}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-bold text-gray-900 truncate">
                                            {event.title}
                                        </div>
                                        {event.location && (
                                            <div className="text-xs text-gray-500 truncate">
                                                📍 {event.location}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {loading && (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                </div>
            )}
        </div>
    )
}

