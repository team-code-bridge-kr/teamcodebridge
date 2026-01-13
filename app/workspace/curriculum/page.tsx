'use client'

import { motion } from 'framer-motion'
import { BookOpenIcon, PlusIcon, AcademicCapIcon, ClockIcon, UserGroupIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'
import CreateCurriculumModal from '@/components/CreateCurriculumModal'
import CurriculumDetailModal from '@/components/CurriculumDetailModal'
import { showAlert } from '@/components/CustomAlert'

interface CurriculumSession {
    id: string
    sessionNumber: number
    sessionName: string
    scheduledDate: string | null
    location: string | null
    goal: string
    content: string
}

interface Curriculum {
    id: string
    name: string
    description: string
    motivation: string
    benefits: string
    minMentors: number
    recommendedStudents: number
    expectedEffect: string
    status: string
    createdAt: string
    createdBy: {
        id: string
        name: string | null
        email: string | null
        image: string | null
    } | null
    sessions: CurriculumSession[]
}

export default function CurriculumPage() {
    const [curriculums, setCurriculums] = useState<Curriculum[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [selectedCurriculum, setSelectedCurriculum] = useState<Curriculum | null>(null)
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
    const [editingCurriculum, setEditingCurriculum] = useState<Curriculum | null>(null)

    const fetchCurriculums = async () => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/curriculums')
            if (!response.ok) throw new Error('Failed to fetch curriculums')
            const data = await response.json()
            setCurriculums(data)
        } catch (error) {
            console.error('Failed to fetch curriculums:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchCurriculums()
    }, [])

    // 수정 핸들러
    const handleEdit = (curriculum: Curriculum) => {
        setEditingCurriculum(curriculum)
        setIsCreateModalOpen(true)
    }

    // 삭제 핸들러
    const handleDelete = async (curriculum: Curriculum) => {
        showAlert.confirm(
            '커리큘럼 삭제',
            `"${curriculum.name}" 커리큘럼을 삭제하시겠습니까?\n\n⚠️ 이 작업은 되돌릴 수 없습니다.`,
            async () => {
                try {
                    const response = await fetch(`/api/curriculums/${curriculum.id}`, {
                        method: 'DELETE'
                    })

                    if (!response.ok) throw new Error('삭제 실패')

                    showAlert.success('삭제 완료', '커리큘럼이 삭제되었습니다.')
                    fetchCurriculums()
                } catch (error) {
                    console.error('삭제 오류:', error)
                    showAlert.error('삭제 실패', '다시 시도해주세요.')
                }
            }
        )
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
                                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
                                    <BookOpenIcon className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-black text-gray-900">커리큘럼</h1>
                                    <p className="text-sm text-gray-500 font-medium">교육 과정을 관리하세요</p>
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsCreateModalOpen(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30"
                        >
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
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                <BookOpenIcon className="w-6 h-6 text-blue-600" />
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
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                <AcademicCapIcon className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">총 회차 수</p>
                                <p className="text-2xl font-black text-gray-900">
                                    {curriculums.reduce((sum, c) => sum + c.sessions.length, 0)}
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
                    {isLoading ? (
                        <div className="p-12 flex justify-center">
                            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                        </div>
                    ) : curriculums.length === 0 ? (
                        <div className="p-12 text-center">
                            <BookOpenIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 font-bold mb-2">등록된 커리큘럼이 없습니다</p>
                            <p className="text-sm text-gray-400 mb-4">새로운 멘토링 프로그램을 만들어보세요!</p>
                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
                            >
                                <PlusIcon className="w-5 h-5" />
                                첫 커리큘럼 만들기
                            </button>
                        </div>
                    ) : (
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
                                                <h3 className="text-lg font-bold text-gray-900">{curriculum.name}</h3>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                    curriculum.status === '진행중'
                                                        ? 'bg-green-100 text-green-700'
                                                        : curriculum.status === '완료'
                                                        ? 'bg-gray-100 text-gray-700'
                                                        : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                    {curriculum.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{curriculum.description}</p>
                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <ClockIcon className="w-4 h-4" />
                                                    <span>{curriculum.sessions.length}회차</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <AcademicCapIcon className="w-4 h-4" />
                                                    <span>멘토 {curriculum.minMentors}명</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <UserGroupIcon className="w-4 h-4" />
                                                    <span>학생 {curriculum.recommendedStudents}명 권장</span>
                                                </div>
                                                {curriculum.createdBy && (
                                                    <>
                                                        <span>•</span>
                                                        <span className="text-xs">
                                                            기획자: {curriculum.createdBy.name || '알 수 없음'}
                                                        </span>
                                                    </>
                                                )}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => {
                                                setSelectedCurriculum(curriculum)
                                                setIsDetailModalOpen(true)
                                            }}
                                            className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-xl font-bold text-sm transition-colors"
                                        >
                                            자세히 보기
                                        </button>
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleEdit(curriculum)
                                            }}
                                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                                            title="수정"
                                        >
                                            <PencilIcon className="w-5 h-5" />
                                        </button>
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleDelete(curriculum)
                                            }}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                            title="삭제"
                                        >
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>

            {/* Create/Edit Curriculum Modal */}
            <CreateCurriculumModal
                isOpen={isCreateModalOpen}
                onClose={() => {
                    setIsCreateModalOpen(false)
                    setEditingCurriculum(null)
                }}
                onCurriculumCreated={fetchCurriculums}
                editingCurriculum={editingCurriculum}
            />

            {/* Curriculum Detail Modal */}
            <CurriculumDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => {
                    setIsDetailModalOpen(false)
                    setSelectedCurriculum(null)
                }}
                curriculum={selectedCurriculum}
                onStatusUpdate={fetchCurriculums}
            />
            </div>
        </div>
    )
}

