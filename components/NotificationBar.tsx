'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BellIcon, XMarkIcon, ExclamationTriangleIcon, InformationCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

interface Notification {
    id: string
    type: 'info' | 'warning' | 'success' | 'error'
    title: string
    message: string
    timestamp: Date
    read: boolean
}

export default function NotificationBar() {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [unreadCount, setUnreadCount] = useState(0)

    useEffect(() => {
        // 실제로는 API에서 알림을 가져와야 함
        const mockNotifications: Notification[] = [
            {
                id: '1',
                type: 'warning',
                title: '마감 임박',
                message: '고려대학교 프로젝트 피드백 제출 마감이 2일 남았습니다.',
                timestamp: new Date(),
                read: false
            },
            {
                id: '2',
                type: 'info',
                title: '새로운 업무 할당',
                message: '신규 멘토 온보딩 세션 준비 업무가 할당되었습니다.',
                timestamp: new Date(Date.now() - 3600000),
                read: false
            },
            {
                id: '3',
                type: 'success',
                title: '업무 완료',
                message: '26 시즌 멘토 가이드라인 업데이트가 완료되었습니다.',
                timestamp: new Date(Date.now() - 7200000),
                read: true
            }
        ]
        setNotifications(mockNotifications)
        setUnreadCount(mockNotifications.filter(n => !n.read).length)
    }, [])

    const getIcon = (type: string) => {
        switch (type) {
            case 'warning':
                return <ExclamationTriangleIcon className="w-5 h-5" />
            case 'error':
                return <ExclamationTriangleIcon className="w-5 h-5" />
            case 'success':
                return <CheckCircleIcon className="w-5 h-5" />
            default:
                return <InformationCircleIcon className="w-5 h-5" />
        }
    }

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'warning':
                return 'bg-yellow-50 text-yellow-600 border-yellow-200'
            case 'error':
                return 'bg-red-50 text-red-600 border-red-200'
            case 'success':
                return 'bg-green-50 text-green-600 border-green-200'
            default:
                return 'bg-blue-50 text-blue-600 border-blue-200'
        }
    }

    const formatTime = (date: Date) => {
        const now = new Date()
        const diff = now.getTime() - date.getTime()
        const minutes = Math.floor(diff / 60000)
        const hours = Math.floor(minutes / 60)
        const days = Math.floor(hours / 24)

        if (days > 0) return `${days}일 전`
        if (hours > 0) return `${hours}시간 전`
        if (minutes > 0) return `${minutes}분 전`
        return '방금 전'
    }

    const markAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
        setUnreadCount(prev => Math.max(0, prev - 1))
    }

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })))
        setUnreadCount(0)
    }

    return (
        <div className="fixed top-4 right-4 z-50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-3 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all"
            >
                <BellIcon className="w-6 h-6 text-gray-700" />
                {unreadCount > 0 && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
                    >
                        <span className="text-[10px] font-black text-white">{unreadCount > 9 ? '9+' : unreadCount}</span>
                    </motion.div>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                        />
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            className="absolute top-16 right-0 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                        >
                            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                                <h3 className="font-black text-black text-sm">알림</h3>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        className="text-xs font-bold text-primary-600 hover:text-primary-700"
                                    >
                                        모두 읽음
                                    </button>
                                )}
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="p-8 text-center text-gray-400">
                                        <BellIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                        <p className="text-sm font-medium">알림이 없습니다</p>
                                    </div>
                                ) : (
                                    notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            onClick={() => markAsRead(notification.id)}
                                            className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${!notification.read ? 'bg-blue-50/30' : ''}`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={`p-2 rounded-xl ${getTypeColor(notification.type)} shrink-0`}>
                                                    {getIcon(notification.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2 mb-1">
                                                        <h4 className="font-bold text-black text-sm">{notification.title}</h4>
                                                        {!notification.read && (
                                                            <div className="w-2 h-2 bg-primary-600 rounded-full shrink-0 mt-1" />
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">{notification.message}</p>
                                                    <span className="text-[10px] text-gray-400 font-medium">{formatTime(notification.timestamp)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}


