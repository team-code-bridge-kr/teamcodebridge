'use client'

import { motion } from 'framer-motion'
import {
    PlusIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    ArrowsUpDownIcon,
    DocumentPlusIcon,
    LinkIcon,
} from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'
import { useContextSidebar } from '@/components/ContextSidebar/ContextSidebarProvider'
import CreateTaskModal from '@/components/CreateTaskModal'
import CreateProjectModal from '@/components/CreateProjectModal'
import { useSession } from 'next-auth/react'

interface Task {
    id: string
    name: string
    status: string
    priority: string
    timeline: string | null
    driveUrl: string | null
    owner: {
        name: string
    } | null
    context?: {
        mission: string | null
        risks: string | null
        lastStableState: string | null
        openLoops: string | null
        nextAction: string | null
        id: string
        taskId: string
    }
}

interface Project {
    id: string
    title: string
    tasks: Task[]
}

const statusStyles: { [key: string]: string } = {
    "완료": "bg-[#00c875] text-white",
    "진행 중": "bg-[#0086f0] text-white",
    "대기": "bg-[#c4c4c4] text-white",
    "지연": "bg-[#e2445c] text-white",
}

const priorityStyles: { [key: string]: string } = {
    "높음": "text-[#e2445c] bg-[#ffebee] border border-[#ffcdd2]",
    "중간": "text-[#fdab3d] bg-[#fff3e0] border border-[#ffe0b2]",
    "낮음": "text-[#0086f0] bg-[#e3f2fd] border border-[#bbdefb]",
}

export default function WorkspaceWork() {
    const { data: session } = useSession()
    const [searchTerm, setSearchTerm] = useState('')
    const [projects, setProjects] = useState<Project[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false)
    const { openIgnition, openClear } = useContextSidebar()

    const fetchProjects = async () => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/projects')
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const data = await response.json()
            if (Array.isArray(data)) {
                setProjects(data)
            } else {
                console.error("Projects data is not an array:", data)
                setProjects([])
            }
        } catch (error) {
            console.error("Failed to fetch projects:", error)
            setProjects([])
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchProjects()
    }, [])

    const handleTaskClick = (task: Task) => {
        if (task.status === '진행 중') {
            openClear(task.id, task.name, task.context)
        } else {
            openIgnition(task.id, task.name, task.context)
        }
    }

    const filteredProjects = projects.map(project => ({
        ...project,
        tasks: project.tasks.filter(task =>
            task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.owner?.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })).filter(project => project.tasks.length > 0)

    const allProjects = projects.map(p => ({ id: p.id, title: p.title }))

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black text-black mb-3 tracking-tight">업무 보드 (CSB Enabled)</h1>
                    <p className="text-gray-600 text-lg font-medium">부서별 프로젝트 및 업무 진행 상황을 한눈에 관리하세요.</p>
                </div>
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-100 text-gray-700 rounded-2xl font-bold hover:border-primary-600 hover:text-primary-600 transition-all shadow-sm">
                        <DocumentPlusIcon className="w-5 h-5" />
                        Google Drive 연동
                    </button>
                    <button
                        onClick={() => setIsCreateProjectModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-primary-100 text-primary-600 rounded-2xl font-bold hover:bg-primary-50 transition-all shadow-sm"
                    >
                        <DocumentPlusIcon className="w-5 h-5" />
                        새 프로젝트
                    </button>
                    <button 
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 px-8 py-3 bg-primary-600 text-white rounded-2xl font-bold hover:bg-primary-700 transition-all shadow-xl shadow-primary-600/20"
                    >
                        <PlusIcon className="w-5 h-5" />
                        새 업무 추가
                    </button>
                </div>
            </header>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-white p-5 rounded-[28px] border border-gray-100 shadow-sm">
                <div className="flex items-center gap-6 flex-1 min-w-[300px]">
                    <div className="relative flex-1 max-w-md">
                        <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="업무 이름, 담당자 검색..."
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-base focus:ring-2 focus:ring-primary-600/20 transition-all placeholder:text-gray-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="h-8 w-[1px] bg-gray-100 hidden md:block" />
                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-600 hover:text-black transition-all">
                        <FunnelIcon className="w-5 h-5" />
                        필터
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-600 hover:text-black transition-all">
                        <ArrowsUpDownIcon className="w-5 h-5" />
                        정렬
                    </button>
                </div>
            </div>

            {/* Project Groups */}
            <div className="space-y-16">
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                ) : filteredProjects.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-200">
                        <p className="text-gray-400 font-bold">검색 결과가 없거나 등록된 업무가 없습니다.</p>
                    </div>
                ) : filteredProjects.map((project) => (
                    <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center gap-4 px-2">
                            <div className="w-2 h-8 bg-primary-600 rounded-full" />
                            <h2 className="text-2xl font-black text-black tracking-tight">{project.title}</h2>
                            <span className="text-sm font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                                {project.tasks.length}개 업무
                            </span>
                        </div>

                        <div className="bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-md">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[800px]">
                                    <thead>
                                        <tr className="bg-gray-50/80 border-b border-gray-100">
                                            <th className="px-8 py-5 text-xs font-black text-gray-500 uppercase tracking-widest w-1/3">업무 이름</th>
                                            <th className="px-8 py-5 text-xs font-black text-gray-500 uppercase tracking-widest">담당자</th>
                                            <th className="px-8 py-5 text-xs font-black text-gray-500 uppercase tracking-widest text-center">상태</th>
                                            <th className="px-8 py-5 text-xs font-black text-gray-500 uppercase tracking-widest text-center">우선순위</th>
                                            <th className="px-8 py-5 text-xs font-black text-gray-500 uppercase tracking-widest">타임라인</th>
                                            <th className="px-8 py-5 text-xs font-black text-gray-500 uppercase tracking-widest text-center">Drive</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {project.tasks.map((task) => (
                                            <tr key={task.id} className="group hover:bg-gray-50/30 transition-colors border-b border-gray-50 last:border-0">
                                                <td className="px-8 py-6">
                                                    <span 
                                                        onClick={() => handleTaskClick(task)}
                                                        className="font-bold text-gray-900 text-[15px] group-hover:text-primary-600 transition-colors cursor-pointer hover:underline decoration-2 underline-offset-4"
                                                    >
                                                        {task.name}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-xs font-black text-primary-600 border-2 border-white shadow-sm">
                                                            {task.owner?.name?.[0] || '?'}
                                                        </div>
                                                        <span className="text-[15px] font-bold text-gray-700">{task.owner?.name || '미지정'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className={`mx-auto w-28 py-2 rounded-xl text-xs font-black text-center shadow-sm ${statusStyles[task.status] || statusStyles['대기']}`}>
                                                        {task.status}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className={`mx-auto w-20 py-1.5 rounded-full text-[11px] font-black text-center ${priorityStyles[task.priority] || priorityStyles['중간']}`}>
                                                        {task.priority}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className="text-sm font-bold text-gray-500">{task.timeline || '-'}</span>
                                                </td>
                                                <td className="px-8 py-6 text-center">
                                                    {task.driveUrl ? (
                                                        <a href={task.driveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                                                            <LinkIcon className="w-5 h-5" />
                                                        </a>
                                                    ) : (
                                                        <button className="inline-flex p-2.5 text-gray-300 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all">
                                                            <PlusIcon className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Add Task Row Placeholder */}
                            <div 
                                onClick={() => setIsCreateModalOpen(true)}
                                className="px-8 py-5 bg-gray-50/20 flex items-center gap-3 text-gray-400 hover:text-primary-600 hover:bg-primary-50/30 cursor-pointer transition-all group"
                            >
                                <PlusIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                <span className="text-[15px] font-black">+ 새로운 업무 추가 (Mission 설정 포함)</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <CreateTaskModal 
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                projects={allProjects}
                currentUserId={session?.user?.id}
                onTaskCreated={fetchProjects}
            />
            <CreateProjectModal
                isOpen={isCreateProjectModalOpen}
                onClose={() => setIsCreateProjectModalOpen(false)}
                onProjectCreated={fetchProjects}
            />
        </div>
    )
}
