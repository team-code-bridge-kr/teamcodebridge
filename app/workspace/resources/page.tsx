'use client'

import { motion } from 'framer-motion'
import { FolderIcon, PlusIcon, DocumentIcon, PhotoIcon, VideoCameraIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

export default function ResourcesPage() {
    const [resources, setResources] = useState([
        {
            id: '1',
            name: '프로젝트 템플릿 모음',
            type: 'folder',
            size: '125 MB',
            items: 12,
            uploadDate: '2026-01-10',
            uploader: '김멘토'
        },
        {
            id: '2',
            name: '2026년 교육계획서.pdf',
            type: 'document',
            size: '2.5 MB',
            downloads: 45,
            uploadDate: '2026-01-08',
            uploader: '이멘토'
        },
        {
            id: '3',
            name: '강의영상_React기초.mp4',
            type: 'video',
            size: '850 MB',
            downloads: 32,
            uploadDate: '2026-01-05',
            uploader: '박멘토'
        },
        {
            id: '4',
            name: '수업자료_이미지.zip',
            type: 'image',
            size: '15.3 MB',
            downloads: 28,
            uploadDate: '2026-01-03',
            uploader: '최멘토'
        },
    ])

    const getIcon = (type: string) => {
        switch (type) {
            case 'folder':
                return <FolderIcon className="w-8 h-8 text-blue-600" />
            case 'document':
                return <DocumentIcon className="w-8 h-8 text-red-600" />
            case 'video':
                return <VideoCameraIcon className="w-8 h-8 text-purple-600" />
            case 'image':
                return <PhotoIcon className="w-8 h-8 text-green-600" />
            default:
                return <DocumentIcon className="w-8 h-8 text-gray-600" />
        }
    }

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'folder':
                return 'bg-blue-100'
            case 'document':
                return 'bg-red-100'
            case 'video':
                return 'bg-purple-100'
            case 'image':
                return 'bg-green-100'
            default:
                return 'bg-gray-100'
        }
    }

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
                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl flex items-center justify-center">
                                    <FolderIcon className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-black text-gray-900">자료실</h1>
                                    <p className="text-sm text-gray-500 font-medium">팀의 모든 자료를 한곳에서</p>
                                </div>
                            </div>
                        </div>
                        <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/30">
                            <PlusIcon className="w-5 h-5" />
                            파일 업로드
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
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                <FolderIcon className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">전체 파일</p>
                                <p className="text-2xl font-black text-gray-900">{resources.length}</p>
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
                                    {resources.reduce((sum, r) => sum + (r.downloads || 0), 0)}
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
                                <VideoCameraIcon className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">영상 자료</p>
                                <p className="text-2xl font-black text-gray-900">
                                    {resources.filter(r => r.type === 'video').length}
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
                                <DocumentIcon className="w-6 h-6 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">문서 자료</p>
                                <p className="text-2xl font-black text-gray-900">
                                    {resources.filter(r => r.type === 'document').length}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Resources Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                >
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-xl font-black text-gray-900">전체 파일</h2>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {resources.map((resource, index) => (
                            <motion.div
                                key={resource.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 + index * 0.1 }}
                                className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className={`w-12 h-12 ${getTypeColor(resource.type)} rounded-xl flex items-center justify-center`}>
                                            {getIcon(resource.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-base font-bold text-gray-900 truncate">{resource.name}</h3>
                                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                                <span>{resource.size}</span>
                                                <span>•</span>
                                                <span>{resource.uploader}</span>
                                                <span>•</span>
                                                <span>{resource.uploadDate}</span>
                                                {resource.downloads && (
                                                    <>
                                                        <span>•</span>
                                                        <span>{resource.downloads}회 다운로드</span>
                                                    </>
                                                )}
                                                {resource.items && (
                                                    <>
                                                        <span>•</span>
                                                        <span>{resource.items}개 항목</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {resource.type !== 'folder' && (
                                        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors">
                                            <ArrowDownTrayIcon className="w-4 h-4" />
                                            다운로드
                                        </button>
                                    )}
                                    {resource.type === 'folder' && (
                                        <button className="px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-xl font-bold text-sm transition-colors">
                                            열기
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

