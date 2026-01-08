'use client'

import { motion } from 'framer-motion'
import { AcademicCapIcon, PlusIcon, CalendarIcon, UsersIcon, ClockIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

export default function ClassesPage() {
    const [classes, setClasses] = useState([
        {
            id: '1',
            title: '웹 개발 기초반 - A조',
            instructor: '김멘토',
            students: 15,
            schedule: '매주 화, 목 19:00-21:00',
            room: 'Zoom',
            status: '진행중',
            startDate: '2026-01-10',
            endDate: '2026-03-10',
            progress: 35
        },
        {
            id: '2',
            title: 'React 심화반 - B조',
            instructor: '이멘토',
            students: 12,
            schedule: '매주 수 19:00-22:00',
            room: 'Google Meet',
            status: '진행중',
            startDate: '2026-01-08',
            endDate: '2026-02-28',
            progress: 50
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
                                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl flex items-center justify-center">
                                    <AcademicCapIcon className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-black text-gray-900">수업관리</h1>
                                    <p className="text-sm text-gray-500 font-medium">진행중인 수업을 관리하세요</p>
                                </div>
                            </div>
                        </div>
                        <button className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-2xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-500/30">
                            <PlusIcon className="w-5 h-5" />
                            새 수업 추가
                        </button>
                    </div>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                <AcademicCapIcon className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">전체 수업</p>
                                <p className="text-2xl font-black text-gray-900">{classes.length}</p>
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
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                <UsersIcon className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">수강 학생</p>
                                <p className="text-2xl font-black text-gray-900">
                                    {classes.reduce((sum, c) => sum + c.students, 0)}
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
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                <ClockIcon className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">진행중</p>
                                <p className="text-2xl font-black text-gray-900">
                                    {classes.filter(c => c.status === '진행중').length}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                                <CalendarIcon className="w-6 h-6 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">이번 주 수업</p>
                                <p className="text-2xl font-black text-gray-900">4</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Classes List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-4"
                >
                    {classes.map((classItem, index) => (
                        <motion.div
                            key={classItem.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 + index * 0.1 }}
                            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-bold text-gray-900">{classItem.title}</h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                            classItem.status === '진행중'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-700'
                                        }`}>
                                            {classItem.status}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">담당 멘토</p>
                                            <p className="text-sm font-bold text-gray-900">{classItem.instructor}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">수강 인원</p>
                                            <p className="text-sm font-bold text-gray-900">{classItem.students}명</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">수업 일정</p>
                                            <p className="text-sm font-bold text-gray-900">{classItem.schedule}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">장소</p>
                                            <p className="text-sm font-bold text-gray-900">{classItem.room}</p>
                                        </div>
                                    </div>
                                </div>
                                <button className="px-4 py-2 text-green-600 hover:bg-green-50 rounded-xl font-bold text-sm transition-colors">
                                    관리하기
                                </button>
                            </div>
                            
                            {/* Progress Bar */}
                            <div className="mt-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-gray-500 font-medium">진행률</span>
                                    <span className="text-xs font-bold text-gray-900">{classItem.progress}%</span>
                                </div>
                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${classItem.progress}%` }}
                                        transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                                        className="h-full bg-gradient-to-r from-green-500 to-green-600"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    )
}

