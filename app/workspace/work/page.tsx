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
    const [searchTerm, setSearchTerm] = useState('')

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black text-black mb-3 tracking-tight">업무 보드</h1>
                    <p className="text-gray-600 text-lg font-medium">부서별 프로젝트 및 업무 진행 상황을 한눈에 관리하세요.</p>
                </div>
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-100 text-gray-700 rounded-2xl font-bold hover:border-primary-600 hover:text-primary-600 transition-all shadow-sm">
                        <DocumentPlusIcon className="w-5 h-5" />
                        Google Drive 연동
                    </button>
                    <button className="flex items-center gap-2 px-8 py-3 bg-primary-600 text-white rounded-2xl font-bold hover:bg-primary-700 transition-all shadow-xl shadow-primary-600/20">
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
                {projects.map((project) => (
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
                            <table className="w-full text-left border-collapse">
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
                                                <span className="font-bold text-gray-900 text-[15px] group-hover:text-primary-600 transition-colors cursor-pointer">
                                                    {task.name}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-xs font-black text-primary-600 border-2 border-white shadow-sm">
                                                        {task.owner[0]}
                                                    </div>
                                                    <span className="text-[15px] font-bold text-gray-700">{task.owner}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className={`mx-auto w-28 py-2 rounded-xl text-xs font-black text-center shadow-sm ${statusStyles[task.status]}`}>
                                                    {task.status}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className={`mx-auto w-20 py-1.5 rounded-full text-[11px] font-black text-center ${priorityStyles[task.priority]}`}>
                                                    {task.priority}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="text-sm font-bold text-gray-500">{task.timeline}</span>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                {task.drive ? (
                                                    <a href={task.drive} target="_blank" rel="noopener noreferrer" className="inline-flex p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">
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

                            {/* Add Task Row Placeholder */}
                            <div className="px-8 py-5 bg-gray-50/20 flex items-center gap-3 text-gray-400 hover:text-primary-600 hover:bg-primary-50/30 cursor-pointer transition-all group">
                                <PlusIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                <span className="text-[15px] font-black">+ 새로운 업무 추가</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
