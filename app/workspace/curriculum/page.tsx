'use client'

import { motion } from 'framer-motion'
import { BookOpenIcon, PlusIcon, AcademicCapIcon, ClockIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

export default function CurriculumPage() {
    const [curriculums, setCurriculums] = useState([
        {
            id: '1',
            title: '웹 개발 기초 과정',
            description: 'HTML, CSS, JavaScript 기초부터 실전까지',
            duration: '8주',
            level: '초급',
            students: 15,
            status: '진행중',
            createdAt: '2026-01-01'
        },
        {
            id: '2',
            title: 'React 심화 과정',
            description: 'React Hook, State Management, 성능 최적화',
            duration: '6주',
            level: '중급',
            students: 12,
            status: '예정',
            createdAt: '2026-01-05'
        },
    ])

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center">
                                    <BookOpenIcon className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-black text-gray-900">커리큘럼</h1>
                                    <p className="text-sm text-gray-500 font-medium">교육 과정을 관리하세요</p>
                                </div>
                            </div>
                        </div>
                        <button className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-2xl font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-500/30">
                            <PlusIcon className="w-5 h-5" />
                            새 커리큘럼 추가
                        </button>
                    </div>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                <BookOpenIcon className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">전체 커리큘럼</p>
                                <p className="text-2xl font-black text-gray-900">{curriculums.length}</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                <AcademicCapIcon className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">수강 학생</p>
                                <p className="text-2xl font-black text-gray-900">
                                    {curriculums.reduce((sum, c) => sum + c.students, 0)}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                <ClockIcon className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">진행중인 과정</p>
                                <p className="text-2xl font-black text-gray-900">
                                    {curriculums.filter(c => c.status === '진행중').length}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Curriculum List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100"
                >
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-xl font-black text-gray-900">커리큘럼 목록</h2>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {curriculums.map((curriculum, index) => (
                            <motion.div
                                key={curriculum.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + index * 0.1 }}
                                className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-bold text-gray-900">{curriculum.title}</h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                curriculum.status === '진행중'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-blue-100 text-blue-700'
                                            }`}>
                                                {curriculum.status}
                                            </span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                curriculum.level === '초급'
                                                    ? 'bg-gray-100 text-gray-700'
                                                    : 'bg-purple-100 text-purple-700'
                                            }`}>
                                                {curriculum.level}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-3">{curriculum.description}</p>
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <ClockIcon className="w-4 h-4" />
                                                <span>{curriculum.duration}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <AcademicCapIcon className="w-4 h-4" />
                                                <span>{curriculum.students}명 수강</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-xl font-bold text-sm transition-colors">
                                        자세히 보기
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

