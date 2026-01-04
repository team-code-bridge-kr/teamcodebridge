'use client'

import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
    CalendarIcon,
    CheckCircleIcon,
    ClockIcon,
    BellIcon,
    ExclamationTriangleIcon,
    ArrowRightIcon,
    FireIcon,
    ChevronDownIcon,
    ChevronUpIcon
} from '@heroicons/react/24/outline'
import NotificationBar from '@/components/NotificationBar'

interface Project {
    id: string
    title: string
    description: string | null
    tasks: Task[]
}

interface Task {
    id: string
    name: string
    status: string
    priority: string
    timeline: string | null
    ownerId: string | null
    owner: {
        id: string
        name: string | null
    } | null
}

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

export default function WorkspaceHome() {
    const { data: session } = useSession()
    const router = useRouter()
    const userName = session?.user?.name || '멘토'
    const userId = session?.user?.id
    const [projects, setProjects] = useState<Project[]>([])
    const [myTasks, setMyTasks] = useState<Task[]>([])
    const [announcements, setAnnouncements] = useState<Announcement[]>([])
    const [loading, setLoading] = useState(true)
    const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0)
    const [isAnnouncementExpanded, setIsAnnouncementExpanded] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 프로젝트 및 업무 가져오기
                // 프로젝트 및 업무 가져오기
                const projectsRes = await fetch('/api/projects')
                if (!projectsRes.ok) {
                    throw new Error(`HTTP error! status: ${projectsRes.status}`)
                }
                const projectsData = await projectsRes.json()
                
                if (Array.isArray(projectsData)) {
                    setProjects(projectsData)
                    
                    // 본인에게 할당된 업무 필터링
                    if (userId) {
                        const allTasks = projectsData.flatMap((p: Project) => p.tasks || [])
                        const assignedTasks = allTasks.filter((task: Task) => task.ownerId === userId)
                        setMyTasks(assignedTasks)
                    }
                } else {
                    console.error("Projects data is not an array:", projectsData)
                    setProjects([])
                    setMyTasks([])
                }

                // 공지사항 가져오기
                const announcementsRes = await fetch('/api/announcements')
                if (announcementsRes.ok) {
                    const announcementsData = await announcementsRes.json()
                    setAnnouncements(announcementsData)
                }
            } catch (error) {
                console.error('Failed to fetch data:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [userId])

    // 공지사항 자동 전환 (3초마다)
    useEffect(() => {
        if (announcements.length === 0 || isAnnouncementExpanded) return

        const interval = setInterval(() => {
            setCurrentAnnouncementIndex((prev) => (prev + 1) % announcements.length)
        }, 3000)

        return () => clearInterval(interval)
    }, [announcements.length, isAnnouncementExpanded])

    const getDaysUntilDeadline = (timeline: string | null) => {
        if (!timeline) return null
        try {
            const deadline = new Date(timeline)
            const now = new Date()
            const diff = deadline.getTime() - now.getTime()
            const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
            return days
        } catch {
            return null
        }
    }

    const urgentTasks = myTasks.filter(task => {
        const days = getDaysUntilDeadline(task.timeline)
        return days !== null && days <= 3 && task.status !== '완료'
    })

    const stats = [
        { name: '내 업무', value: myTasks.length.toString(), icon: ClockIcon, color: 'text-blue-600', bg: 'bg-blue-50' },
        { name: '마감 임박', value: urgentTasks.length.toString(), icon: ExclamationTriangleIcon, color: 'text-red-600', bg: 'bg-red-50' },
        { name: '완료된 업무', value: myTasks.filter(t => t.status === '완료').length.toString(), icon: CheckCircleIcon, color: 'text-green-600', bg: 'bg-green-50' },
        { name: '진행 중', value: myTasks.filter(t => t.status === '진행 중').length.toString(), icon: CalendarIcon, color: 'text-purple-600', bg: 'bg-purple-50' },
    ]

    return (
        <div className="p-8 max-w-7xl mx-auto relative">
            <NotificationBar />

            <header className="mb-10">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-3xl font-black text-black mb-2">안녕하세요, {userName}님! 👋</h1>
                    <p className="text-gray-500">오늘도 TeamCodeBridge와 함께 미래를 만들어가요.</p>
                </motion.div>
            </header>

            {/* 공지사항 - 맨 위 (네이버 스타일) */}
            {announcements.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden"
                >
                    <div className="bg-primary-600 px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <BellIcon className="w-5 h-5 text-white" />
                            <h2 className="text-white font-black text-sm">팀코드브릿지 공지사항</h2>
                        </div>
                    </div>
                    
                    {/* 한 줄 공지사항 */}
                    {!isAnnouncementExpanded && announcements.length > 0 && (
                        <div className="bg-gray-50 border-b border-gray-200">
                            <div className="flex items-center gap-3 px-4 py-3">
                                <span className="text-sm text-gray-600 font-medium shrink-0">{announcements[currentAnnouncementIndex]?.category || '일반'}</span>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 text-sm text-gray-900">
                                        <span className="truncate">{announcements[currentAnnouncementIndex]?.title}</span>
                                        <span className="text-gray-500 text-xs shrink-0">
                                            {new Date(announcements[currentAnnouncementIndex]?.createdAt).toLocaleDateString('ko-KR', {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit',
                                            }).replace(/\./g, '.').replace(/\s/g, '')}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setIsAnnouncementExpanded(true)
                                    }}
                                    className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 shrink-0 px-2 py-1"
                                >
                                    <span>펼치기</span>
                                    <ChevronDownIcon className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* 펼쳐진 공지사항 리스트 */}
                    {isAnnouncementExpanded && (
                        <div className="divide-y divide-gray-100">
                            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
                                <span className="text-sm font-bold text-gray-700">전체 공지사항</span>
                                <button
                                    onClick={() => setIsAnnouncementExpanded(false)}
                                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 shrink-0 px-2 py-1"
                                >
                                    <span>접기</span>
                                    <ChevronUpIcon className="w-4 h-4" />
                                </button>
                            </div>
                            {announcements.map((announcement) => {
                                const date = new Date(announcement.createdAt).toLocaleDateString('ko-KR', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                }).replace(/\./g, '.').replace(/\s/g, '')
                                
                                return (
                                    <div
                                        key={announcement.id}
                                        className={`px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer ${
                                            announcement.isImportant ? 'bg-red-50/30' : ''
                                        }`}
                                        onClick={() => router.push(`/workspace/announcements/${announcement.id}`)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm text-gray-600 font-medium shrink-0">{announcement.category}</span>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    {announcement.isImportant && (
                                                        <span className="px-1.5 py-0.5 bg-red-500 text-white text-[10px] font-black rounded shrink-0">중요</span>
                                                    )}
                                                    <span className="text-sm text-gray-900 truncate">{announcement.title}</span>
                                                </div>
                                            </div>
                                            <span className="text-xs text-gray-500 shrink-0">{date}</span>
                                            <ArrowRightIcon className="w-4 h-4 text-gray-400 shrink-0" />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </motion.div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <span className="text-sm font-bold text-gray-400">{stat.name}</span>
                        </div>
                        <div className="text-3xl font-black text-black">{stat.value}</div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 내 업무 - 가장 중요 */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-black text-black">내가 할당된 업무</h2>
                            <span className="text-sm font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                                {myTasks.length}개
                            </span>
                        </div>
                        {loading ? (
                            <div className="flex justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                            </div>
                        ) : myTasks.length === 0 ? (
                            <div className="text-center py-12 text-gray-400">
                                <ClockIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p className="font-bold">할당된 업무가 없습니다</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {myTasks.map((task) => {
                                    const days = getDaysUntilDeadline(task.timeline)
                                    const isUrgent = days !== null && days <= 3 && task.status !== '완료'
                                    return (
                                        <div
                                            key={task.id}
                                            className={`p-5 rounded-2xl border-2 transition-all hover:shadow-md ${
                                                isUrgent
                                                    ? 'border-red-200 bg-red-50/30'
                                                    : task.status === '완료'
                                                    ? 'border-green-200 bg-green-50/20'
                                                    : 'border-gray-100 hover:border-primary-200'
                                            }`}
                                        >
                                            <div className="flex items-start justify-between gap-4 mb-3">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        {isUrgent && (
                                                            <span className="flex items-center gap-1 px-2 py-0.5 bg-red-500 text-white text-[10px] font-black rounded-full">
                                                                <FireIcon className="w-3 h-3" />
                                                                마감 임박
                                                            </span>
                                                        )}
                                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                                                            task.status === '완료' ? 'bg-green-100 text-green-700' :
                                                            task.status === '진행 중' ? 'bg-blue-100 text-blue-700' :
                                                            task.status === '지연' ? 'bg-red-100 text-red-700' :
                                                            'bg-gray-100 text-gray-700'
                                                        }`}>
                                                            {task.status}
                                                        </span>
                                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                                                            task.priority === '높음' ? 'bg-red-100 text-red-700' :
                                                            task.priority === '중간' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-blue-100 text-blue-700'
                                                        }`}>
                                                            {task.priority}
                                                        </span>
                                                    </div>
                                                    <h4 className="font-black text-black text-base mb-1">{task.name}</h4>
                                                    {task.timeline && (
                                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                                            <CalendarIcon className="w-4 h-4" />
                                                            <span className="font-bold">
                                                                {task.timeline}
                                                                {days !== null && (
                                                                    <span className={`ml-2 ${isUrgent ? 'text-red-600 font-black' : 'text-gray-500'}`}>
                                                                        ({days > 0 ? `${days}일 남음` : days === 0 ? '오늘 마감' : '마감 지남'})
                                                                    </span>
                                                                )}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>

                    {/* 전체 프로젝트 현황 */}
                    <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                        <h2 className="text-xl font-black text-black mb-6">전체 프로젝트 현황</h2>
                        {loading ? (
                            <div className="flex justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                            </div>
                        ) : projects.length === 0 ? (
                            <div className="text-center py-12 text-gray-400">
                                <p className="font-bold">프로젝트가 없습니다</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {projects.map((project) => {
                                    const totalTasks = project.tasks?.length || 0
                                    const completedTasks = project.tasks?.filter(t => t.status === '완료').length || 0
                                    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
                                    return (
                                        <div key={project.id} className="p-5 rounded-2xl border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all">
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className="font-black text-black">{project.title}</h3>
                                                <span className="text-sm font-bold text-gray-400">
                                                    {completedTasks}/{totalTasks} 완료
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                                                <div
                                                    className="bg-primary-600 h-2 rounded-full transition-all"
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                            <p className="text-xs text-gray-500">{project.description || '설명 없음'}</p>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* 사이드바 - 빠른 링크 */}
                <div className="space-y-6">
                    <div className="bg-primary-600 p-8 rounded-[32px] text-white shadow-xl shadow-primary-600/20">
                        <h2 className="text-xl font-black mb-4">빠른 액션</h2>
                        <div className="space-y-3">
                            <button className="w-full py-3 bg-white text-primary-600 rounded-xl font-bold text-sm hover:bg-primary-50 transition-colors">
                                새 업무 추가
                            </button>
                            <button className="w-full py-3 bg-white/10 text-white rounded-xl font-bold text-sm hover:bg-white/20 transition-colors border border-white/20">
                                프로젝트 생성
                            </button>
                        </div>
                    </div>

                    {/* 마감 임박 업무 요약 */}
                    {urgentTasks.length > 0 && (
                        <div className="bg-red-50 p-6 rounded-[32px] border-2 border-red-200">
                            <div className="flex items-center gap-2 mb-4">
                                <FireIcon className="w-5 h-5 text-red-600" />
                                <h3 className="font-black text-red-900">마감 임박</h3>
                            </div>
                            <div className="space-y-2">
                                {urgentTasks.slice(0, 3).map((task) => {
                                    const days = getDaysUntilDeadline(task.timeline)
                                    return (
                                        <div key={task.id} className="p-3 bg-white rounded-xl border border-red-200">
                                            <p className="font-bold text-sm text-red-900 mb-1">{task.name}</p>
                                            <p className="text-xs text-red-600 font-medium">
                                                {days !== null && (days > 0 ? `${days}일 남음` : '오늘 마감')}
                                            </p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
