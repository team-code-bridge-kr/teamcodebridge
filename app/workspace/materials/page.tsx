'use client'

import { motion } from 'framer-motion'
import { DocumentTextIcon, PlusIcon, FolderIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

export default function MaterialsPage() {
    const [materials, setMaterials] = useState([
        {
            id: '1',
            title: 'HTML/CSS 기초 교재',
            description: '웹 개발의 첫걸음, HTML과 CSS 기초',
            category: '웹 개발',
            fileType: 'PDF',
            fileSize: '2.5 MB',
            downloads: 45,
            uploadDate: '2026-01-01',
            author: '김멘토'
        },
        {
            id: '2',
            title: 'JavaScript 실습 자료',
            description: 'JavaScript 기초부터 고급까지',
            category: '웹 개발',
            fileType: 'ZIP',
            fileSize: '15.3 MB',
            downloads: 32,
            uploadDate: '2026-01-03',
            author: '이멘토'
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
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center">
                                    <DocumentTextIcon className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-black text-gray-900">교재관리</h1>
                                    <p className="text-sm text-gray-500 font-medium">교육 자료를 관리하세요</p>
                                </div>
                            </div>
                        </div>
                        <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30">
                            <PlusIcon className="w-5 h-5" />
                            새 교재 업로드
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
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                <DocumentTextIcon className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">전체 교재</p>
                                <p className="text-2xl font-black text-gray-900">{materials.length}</p>
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
                                <ArrowDownTrayIcon className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">총 다운로드</p>
                                <p className="text-2xl font-black text-gray-900">
                                    {materials.reduce((sum, m) => sum + m.downloads, 0)}
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
                                <FolderIcon className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">카테고리</p>
                                <p className="text-2xl font-black text-gray-900">3</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Materials Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {materials.map((material, index) => (
                        <motion.div
                            key={material.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <DocumentTextIcon className="w-6 h-6 text-blue-600" />
                                </div>
                                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold">
                                    {material.fileType}
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{material.title}</h3>
                            <p className="text-sm text-gray-600 mb-4">{material.description}</p>
                            <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                                <span>{material.category}</span>
                                <span>{material.fileSize}</span>
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <ArrowDownTrayIcon className="w-4 h-4" />
                                    <span>{material.downloads}회</span>
                                </div>
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors">
                                    다운로드
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    )
}

