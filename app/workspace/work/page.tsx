'use client'

import { motion } from 'framer-motion'
import {
    PlusIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    ArrowsUpDownIcon,
    DocumentPlusIcon,
    LinkIcon,
    ChevronDownIcon,
} from '@heroicons/react/24/outline'
import { useState, useEffect, Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { useContextSidebar } from '@/components/ContextSidebar/ContextSidebarProvider'
import CreateTaskModal from '@/components/CreateTaskModal'
import CreateProjectModal from '@/components/CreateProjectModal'
import UnifiedTaskPage from '@/components/UnifiedTaskPage'
import AddLinkModal from '@/components/AddLinkModal'
import { useSession } from 'next-auth/react'

interface TaskLink {
    id: string
    linkType: string
    url?: string
    repoPath?: string
    artifactId?: string
    label?: string
    isRequired: boolean
}

interface ContextCapsule {
    mission: string | null
    risks: string | null
    lastStableState: string | null
    openLoops: string | null
    nextAction: string | null
    id: string
    taskId: string
}

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
    context?: ContextCapsule
    links: TaskLink[]
    parent?: {
        id: string
        name: string
        context?: ContextCapsule | null
    } | null
}

interface Project {
    id: string
    title: string
    tasks: Task[]
}

const statusStyles: { [key: string]: string } = {
    // Korean labels
    "완료": "bg-[#00c875] text-white",
    "진행 중": "bg-[#0086f0] text-white",
    "대기": "bg-[#c4c4c4] text-white",
    "지연": "bg-[#e2445c] text-white",
    "차단됨": "bg-[#9c27b0] text-white",
    // Enum values (from Prisma)
    "COMPLETED": "bg-[#00c875] text-white",
    "IN_PROGRESS": "bg-[#0086f0] text-white",
    "PENDING": "bg-[#c4c4c4] text-white",
    "DEFERRED": "bg-[#e2445c] text-white",
    "BLOCKED": "bg-[#9c27b0] text-white",
}

// Status display labels (enum -> Korean)
const statusLabels: { [key: string]: string } = {
    "PENDING": "대기",
    "IN_PROGRESS": "진행 중",
    "COMPLETED": "완료",
    "BLOCKED": "차단됨",
    "DEFERRED": "지연",
}

const priorityStyles: { [key: string]: string } = {
    // Korean labels
    "높음": "text-[#e2445c] bg-[#ffebee] border border-[#ffcdd2]",
    "중간": "text-[#fdab3d] bg-[#fff3e0] border border-[#ffe0b2]",
    "낮음": "text-[#0086f0] bg-[#e3f2fd] border border-[#bbdefb]",
    // Enum values
    "CRITICAL": "text-[#d32f2f] bg-[#ffcdd2] border border-[#ef9a9a]",
    "HIGH": "text-[#e2445c] bg-[#ffebee] border border-[#ffcdd2]",
    "MEDIUM": "text-[#fdab3d] bg-[#fff3e0] border border-[#ffe0b2]",
    "LOW": "text-[#0086f0] bg-[#e3f2fd] border border-[#bbdefb]",
}

// Priority display labels (enum -> Korean)
const priorityLabels: { [key: string]: string } = {
    "LOW": "낮음",
    "MEDIUM": "중간",
    "HIGH": "높음",
    "CRITICAL": "긴급",
}

export default function WorkspaceWork() {
    const { data: session } = useSession()
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState<string | null>(null)
    const [projects, setProjects] = useState<Project[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false)
    const [selectedTask, setSelectedTask] = useState<Task | null>(null)
    const [isTaskPageOpen, setIsTaskPageOpen] = useState(false)
    const [isAddLinkModalOpen, setIsAddLinkModalOpen] = useState(false)
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
        // Open Unified Task Page instead of directly opening sidebar
        setSelectedTask(task)
        setIsTaskPageOpen(true)
    }

    const handleIgniteFromTaskPage = () => {
        if (!selectedTask) return
        setIsTaskPageOpen(false)
        openIgnition(selectedTask.id, selectedTask.name, selectedTask.context)
    }

    const handleClearFromTaskPage = () => {
        if (!selectedTask) return
        setIsTaskPageOpen(false)
        openClear(selectedTask.id, selectedTask.name, selectedTask.context)
    }

    const handleAddLink = () => {
        setIsAddLinkModalOpen(true)
    }

    const handleLinkAdded = () => {
        fetchProjects() // Refresh to get updated links
    }

    const filteredProjects = projects.map(project => ({
        ...project,
        tasks: project.tasks.filter(task => {
            const matchesSearch = task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                task.owner?.name.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesStatus = filterStatus ? task.status === filterStatus : true
            return matchesSearch && matchesStatus
        })
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
                    <div className="h-8 w-[1px] bg-gray-100 hidden md:block" />

                    <Menu as="div" className="relative inline-block text-left">
                        <Menu.Button className={`flex items-center gap-2 px-4 py-2 text-sm font-bold transition-all ${filterStatus ? 'text-primary-600 bg-primary-50 rounded-xl' : 'text-gray-600 hover:text-black'}`}>
                            <FunnelIcon className="w-5 h-5" />
                            {filterStatus || '필터'}
                            <ChevronDownIcon className="w-4 h-4 ml-1" />
                        </Menu.Button>
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="py-1">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                onClick={() => setFilterStatus(null)}
                                                className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                                    } block w-full px-4 py-2 text-left text-sm font-bold`}
                                            >
                                                전체 보기
                                            </button>
                                        )}
                                    </Menu.Item>
                                    {Object.keys(statusStyles).map((status) => (
                                        <Menu.Item key={status}>
                                            {({ active }) => (
                                                <button
                                                    onClick={() => setFilterStatus(status)}
                                                    className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                                        } block w-full px-4 py-2 text-left text-sm font-bold`}
                                                >
                                                    {status}
                                                </button>
                                            )}
                                        </Menu.Item>
                                    ))}
                                </div>
                            </Menu.Items>
                        </Transition>
                    </Menu>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-600 hover:text-black transition-all">
                        <ArrowsUpDownIcon className="w-5 h-5" />
                        정렬
                    </button>
                    <div className="h-6 w-[1px] bg-gray-200" />
                    <a
                        href="/workspace/kraken"
                        className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-xl transition-all"
                    >
                        🐙 크라켄 뷰
                    </a>
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
            <UnifiedTaskPage
                isOpen={isTaskPageOpen}
                onClose={() => setIsTaskPageOpen(false)}
                task={selectedTask}
                onIgnite={handleIgniteFromTaskPage}
                onClear={handleClearFromTaskPage}
                onAddLink={handleAddLink}
            />
            {selectedTask && (
                <AddLinkModal
                    isOpen={isAddLinkModalOpen}
                    onClose={() => setIsAddLinkModalOpen(false)}
                    taskId={selectedTask.id}
                    onLinkAdded={handleLinkAdded}
                />
            )}
        </div>
    )
}
