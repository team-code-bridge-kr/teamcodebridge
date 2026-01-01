'use client'

import { motion } from 'framer-motion'
import {
    PlusIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    ArrowsUpDownIcon,
    DocumentPlusIcon,
    LinkIcon,
    UserCircleIcon
} from '@heroicons/react/24/outline'
import { useState } from 'react'

const projects = [
    {
        id: 1,
        title: "26 Season 멘토 모집",
        tasks: [
            { id: 101, name: "모집 공고 상세 페이지 기획", owner: "장성민", status: "완료", priority: "높음", timeline: "12월 20일 - 12월 25일", drive: "https://docs.google.com/document/d/1..." },
            { id: 102, name: "SNS 홍보 콘텐츠 제작 (인스타/카톡)", owner: "이서연", status: "진행 중", priority: "중간", timeline: "12월 26일 - 1월 5일", drive: "https://docs.google.com/presentation/d/2..." },
            { id: 103, name: "지원서 양식 구글 폼 제작", owner: "김민준", status: "대기", priority: "높음", timeline: "1월 2일 - 1월 4일", drive: null },
        ]
    },
    {
        id: 2,
        title: "커리큘럼 고도화 프로젝트",
        tasks: [
            { id: 201, name: "Python 기초 강의안 업데이트", owner: "박지성", status: "진행 중", priority: "중간", timeline: "1월 1일 - 1월 15일", drive: "https://docs.google.com/presentation/d/3..." },
            { id: 202, name: "신규 프로젝트 실습 예제 개발", owner: "최유진", status: "대기", priority: "낮음", timeline: "1월 10일 - 1월 20일", drive: null },
        ]
    }
]

const statusStyles: { [key: string]: string } = {
    "완료": "bg-green-500 text-white",
    "진행 중": "bg-blue-500 text-white",
    "대기": "bg-gray-400 text-white",
    "지연": "bg-red-500 text-white",
}

const priorityStyles: { [key: string]: string } = {
    "높음": "text-red-600 bg-red-50",
    "중간": "text-orange-600 bg-orange-50",
    "낮음": "text-gray-600 bg-gray-50",
}

export default function WorkspaceWork() {
    const [searchTerm, setSearchTerm] = useState('')

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-black text-black mb-2 tracking-tighter">업무 보드</h1>
                    <p className="text-gray-500 font-medium">먼데이닷컴 스타일의 직관적인 업무 관리 시스템</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-sm">
                        <DocumentPlusIcon className="w-5 h-5 text-primary-600" />
                        Google Drive 연동
                    </button>
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-500 transition-all shadow-lg shadow-primary-600/20">
                        <PlusIcon className="w-5 h-5" />
                        새 업무 추가
                    </button>
                </div>
            </header>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-[#fafafa] p-4 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-4 flex-1 min-w-[300px]">
                    <div className="relative flex-1">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="업무 이름, 담당자 검색..."
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-600/20 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-600 hover:bg-white hover:shadow-sm rounded-lg transition-all">
                        <FunnelIcon className="w-4 h-4" />
                        필터
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-600 hover:bg-white hover:shadow-sm rounded-lg transition-all">
                        <ArrowsUpDownIcon className="w-4 h-4" />
                        정렬
                    </button>
                </div>
            </div>

            {/* Project Groups */}
            <div className="space-y-12">
                {projects.map((project) => (
                    <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center gap-3 px-2">
                            <div className="w-1.5 h-6 bg-primary-600 rounded-full" />
                            <h2 className="text-xl font-black text-black tracking-tight">{project.title}</h2>
                            <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                                {project.tasks.length}개 업무
                            </span>
                        </div>

                        <div className="bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-sm">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50 border-b border-gray-100">
                                        <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest w-1/3">업무 이름</th>
                                        <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">담당자</th>
                                        <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest text-center">상태</th>
                                        <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest text-center">우선순위</th>
                                        <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">타임라인</th>
                                        <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest text-center">Drive</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {project.tasks.map((task) => (
                                        <tr key={task.id} className="group hover:bg-gray-50/50 transition-colors border-b border-gray-50 last:border-0">
                                            <td className="px-6 py-5">
                                                <span className="font-bold text-gray-800 text-sm group-hover:text-primary-600 transition-colors cursor-pointer">
                                                    {task.name}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 bg-primary-100 rounded-full flex items-center justify-center text-[10px] font-black text-primary-600">
                                                        {task.owner[0]}
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-600">{task.owner}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className={`mx-auto w-24 py-1.5 rounded-lg text-[11px] font-black text-center shadow-sm ${statusStyles[task.status]}`}>
                                                    {task.status}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className={`mx-auto w-16 py-1 rounded-full text-[10px] font-black text-center ${priorityStyles[task.priority]}`}>
                                                    {task.priority}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="text-xs font-medium text-gray-400">{task.timeline}</span>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                {task.drive ? (
                                                    <a href={task.drive} target="_blank" rel="noopener noreferrer" className="inline-flex p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                                                        <LinkIcon className="w-4 h-4" />
                                                    </a>
                                                ) : (
                                                    <button className="inline-flex p-2 text-gray-300 hover:text-primary-600 transition-colors">
                                                        <PlusIcon className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Add Task Row Placeholder */}
                            <div className="px-6 py-4 bg-gray-50/30 flex items-center gap-2 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors group">
                                <PlusIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                <span className="text-sm font-bold">+ 새로운 업무 추가</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
