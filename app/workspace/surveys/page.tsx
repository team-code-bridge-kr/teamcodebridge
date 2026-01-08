'use client'

import { motion } from 'framer-motion'
import { ChartBarIcon, PlusIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

export default function SurveysPage() {
    const [surveys, setSurveys] = useState([
        {
            id: '1',
            title: '2026년 1월 수업 만족도 조사',
            description: '웹 개발 기초 과정에 대한 학생 피드백',
            targetClass: '웹 개발 기초반 - A조',
            responses: 12,
            totalStudents: 15,
            status: '진행중',
            startDate: '2026-01-15',
            endDate: '2026-01-22',
            rating: 4.5
        },
        {
            id: '2',
            title: '멘토 만족도 조사',
            description: '멘토링 품질 향상을 위한 설문',
            targetClass: '전체',
            responses: 28,
            totalStudents: 30,
            status: '진행중',
            startDate: '2026-01-10',
            endDate: '2026-01-20',
            rating: 4.8
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
                                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-700 rounded-2xl flex items-center justify-center">
                                    <ChartBarIcon className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-black text-gray-900">만족도조사 관리</h1>
                                    <p className="text-sm text-gray-500 font-medium">학생 피드백을 수집하세요</p>
                                </div>
                            </div>
                        </div>
                        <button className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-2xl font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-500/30">
                            <PlusIcon className="w-5 h-5" />
                            새 설문 만들기
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
                            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                                <ChartBarIcon className="w-6 h-6 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">전체 설문</p>
                                <p className="text-2xl font-black text-gray-900">{surveys.length}</p>
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
                                <CheckCircleIcon className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">총 응답</p>
                                <p className="text-2xl font-black text-gray-900">
                                    {surveys.reduce((sum, s) => sum + s.responses, 0)}
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
                                <p className="text-sm text-gray-500 font-medium">진행중</p>
                                <p className="text-2xl font-black text-gray-900">
                                    {surveys.filter(s => s.status === '진행중').length}
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
                            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                                <span className="text-2xl">⭐</span>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">평균 만족도</p>
                                <p className="text-2xl font-black text-gray-900">
                                    {(surveys.reduce((sum, s) => sum + s.rating, 0) / surveys.length).toFixed(1)}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Surveys List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-4"
                >
                    {surveys.map((survey, index) => (
                        <motion.div
                            key={survey.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 + index * 0.1 }}
                            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-bold text-gray-900">{survey.title}</h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                            survey.status === '진행중'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-700'
                                        }`}>
                                            {survey.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-4">{survey.description}</p>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">대상 수업</p>
                                            <p className="text-sm font-bold text-gray-900">{survey.targetClass}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">응답률</p>
                                            <p className="text-sm font-bold text-gray-900">
                                                {survey.responses}/{survey.totalStudents} ({Math.round((survey.responses / survey.totalStudents) * 100)}%)
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">기간</p>
                                            <p className="text-sm font-bold text-gray-900">
                                                {survey.startDate} ~ {survey.endDate}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">평균 평점</p>
                                            <div className="flex items-center gap-1">
                                                <span className="text-yellow-500">⭐</span>
                                                <p className="text-sm font-bold text-gray-900">{survey.rating}/5.0</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button className="px-4 py-2 text-orange-600 hover:bg-orange-50 rounded-xl font-bold text-sm transition-colors">
                                    결과 보기
                                </button>
                            </div>
                            
                            {/* Response Progress Bar */}
                            <div className="mt-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-gray-500 font-medium">응답 진행률</span>
                                    <span className="text-xs font-bold text-gray-900">
                                        {Math.round((survey.responses / survey.totalStudents) * 100)}%
                                    </span>
                                </div>
                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(survey.responses / survey.totalStudents) * 100}%` }}
                                        transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                                        className="h-full bg-gradient-to-r from-orange-500 to-orange-600"
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

