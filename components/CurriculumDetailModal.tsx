'use client'

import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon, UserGroupIcon, UsersIcon, AcademicCapIcon, CalendarIcon, MapPinIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import { showAlert } from './CustomAlert'

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

interface CurriculumDetailModalProps {
    isOpen: boolean
    onClose: () => void
    curriculum: Curriculum | null
    onStatusUpdate?: () => void
}

export default function CurriculumDetailModal({ isOpen, onClose, curriculum, onStatusUpdate }: CurriculumDetailModalProps) {
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
    
    if (!curriculum) return null

    const statusOptions = ['준비중', '검토중', '수업중', '종료됨']
    
    const handleStatusChange = async (newStatus: string) => {
        if (newStatus === curriculum.status) return
        
        setIsUpdatingStatus(true)
        try {
            const response = await fetch(`/api/curriculums/${curriculum.id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            })

            if (!response.ok) throw new Error('상태 변경 실패')

            showAlert.success('상태 변경 완료', `커리큘럼 상태가 "${newStatus}"(으)로 변경되었습니다.`)
            onStatusUpdate?.()
        } catch (error) {
            console.error('상태 변경 오류:', error)
            showAlert.error('상태 변경 실패', '다시 시도해주세요.')
        } finally {
            setIsUpdatingStatus(false)
        }
    }

    const handlePDFExport = () => {
        // TODO: PDF 저장 기능 구현 예정
        showAlert.info('PDF 저장 기능 준비 중', 'PDF 저장 기능은 곧 추가될 예정입니다!')
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case '준비중':
                return 'bg-blue-100 text-blue-700'
            case '검토중':
                return 'bg-yellow-100 text-yellow-700'
            case '수업중':
                return 'bg-green-100 text-green-700'
            case '종료됨':
                return 'bg-gray-100 text-gray-700'
            default:
                return 'bg-blue-100 text-blue-700'
        }
    }

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all">
                                {/* Header */}
                                <div className="sticky top-0 z-10 border-b border-gray-100 bg-blue-50 px-8 py-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <Dialog.Title className="text-3xl font-black text-gray-900">
                                                    {curriculum.name}
                                                </Dialog.Title>
                                                
                                                {/* Status Dropdown */}
                                                <div className="relative">
                                                    <select
                                                        value={curriculum.status}
                                                        onChange={(e) => handleStatusChange(e.target.value)}
                                                        disabled={isUpdatingStatus}
                                                        className={`px-4 py-1.5 rounded-full text-sm font-bold cursor-pointer transition-all ${getStatusColor(curriculum.status)} border-2 border-transparent hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed`}
                                                    >
                                                        {statusOptions.map((status) => (
                                                            <option key={status} value={status}>
                                                                {status}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            {curriculum.createdBy && (
                                                <p className="text-sm text-gray-600 font-medium">
                                                    기획자: {curriculum.createdBy.name || '알 수 없음'}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={handlePDFExport}
                                                className="flex items-center gap-2 px-4 py-2 bg-white text-purple-600 border border-purple-200 rounded-xl font-bold hover:bg-purple-50 transition-all"
                                            >
                                                <DocumentArrowDownIcon className="w-5 h-5" />
                                                PDF 저장
                                            </button>
                                            <button
                                                onClick={onClose}
                                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-xl transition-all"
                                            >
                                                <XMarkIcon className="w-6 h-6" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="px-8 py-6 max-h-[70vh] overflow-y-auto">
                                    {/* 1. 기본 정보 */}
                                    <motion.section
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                        className="mb-8"
                                    >
                                        <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                                            <span className="w-8 h-8 bg-purple-600 text-white rounded-lg flex items-center justify-center text-sm">1</span>
                                            기본 정보
                                        </h3>
                                        <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                                            <div>
                                                <p className="text-sm font-bold text-gray-600 mb-2">프로그램 소개</p>
                                                <p className="text-base text-gray-900 leading-relaxed">{curriculum.description}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-600 mb-2">활동 기획 계기</p>
                                                <p className="text-base text-gray-900 leading-relaxed">{curriculum.motivation}</p>
                                            </div>
                                        </div>
                                    </motion.section>

                                    {/* 2. 목표 & 인원 */}
                                    <motion.section
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="mb-8"
                                    >
                                        <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                                            <span className="w-8 h-8 bg-purple-600 text-white rounded-lg flex items-center justify-center text-sm">2</span>
                                            목표 & 인원 구성
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="bg-blue-50 rounded-2xl p-6">
                                                <p className="text-sm font-bold text-blue-900 mb-2">활동을 통해 얻게 되는 점</p>
                                                <p className="text-base text-blue-800 leading-relaxed whitespace-pre-wrap">{curriculum.benefits}</p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <UsersIcon className="w-6 h-6 text-purple-600" />
                                                        <p className="text-sm font-bold text-gray-600">최소 현장 멘토 수</p>
                                                    </div>
                                                    <p className="text-3xl font-black text-gray-900">{curriculum.minMentors}명</p>
                                                </div>
                                                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <UserGroupIcon className="w-6 h-6 text-green-600" />
                                                        <p className="text-sm font-bold text-gray-600">추천 수혜 학생 수</p>
                                                    </div>
                                                    <p className="text-3xl font-black text-gray-900">{curriculum.recommendedStudents}명</p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.section>

                                    {/* 3. 프로그램 구성 (4회차) */}
                                    <motion.section
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="mb-8"
                                    >
                                        <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                                            <span className="w-8 h-8 bg-purple-600 text-white rounded-lg flex items-center justify-center text-sm">3</span>
                                            프로그램 일정표 ({curriculum.sessions.length}회차)
                                        </h3>
                                        <div className="space-y-6">
                                            {curriculum.sessions.map((session, index) => (
                                                <motion.div
                                                    key={session.id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.4 + index * 0.1 }}
                                                    className="bg-white border-2 border-purple-100 rounded-2xl p-6 hover:border-purple-200 transition-all"
                                                >
                                                    <div className="flex items-start gap-4 mb-4">
                                                        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-xl flex items-center justify-center font-black text-lg shadow-lg shadow-purple-500/30">
                                                            {session.sessionNumber}
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="text-xl font-bold text-gray-900 mb-2">{session.sessionName}</h4>
                                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                                {session.scheduledDate && (
                                                                    <div className="flex items-center gap-1">
                                                                        <CalendarIcon className="w-4 h-4" />
                                                                        <span>{session.scheduledDate}</span>
                                                                    </div>
                                                                )}
                                                                {session.location && (
                                                                    <div className="flex items-center gap-1">
                                                                        <MapPinIcon className="w-4 h-4" />
                                                                        <span>{session.location}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-3 pl-16">
                                                        <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                                                            <p className="text-xs font-bold text-green-900 uppercase mb-1">활동 목표</p>
                                                            <p className="text-sm text-green-800 leading-relaxed whitespace-pre-wrap">{session.goal}</p>
                                                        </div>
                                                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                                                            <p className="text-xs font-bold text-blue-900 uppercase mb-1">활동 내용</p>
                                                            <p className="text-sm text-blue-800 leading-relaxed whitespace-pre-wrap">{session.content}</p>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.section>

                                    {/* 4. 기대효과 */}
                                    <motion.section
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.7 }}
                                        className="mb-4"
                                    >
                                        <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                                            <span className="w-8 h-8 bg-purple-600 text-white rounded-lg flex items-center justify-center text-sm">4</span>
                                            기대효과
                                        </h3>
                                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
                                            <p className="text-base text-green-900 leading-relaxed whitespace-pre-wrap">{curriculum.expectedEffect}</p>
                                        </div>
                                    </motion.section>
                                </div>

                                {/* Footer */}
                                <div className="border-t border-gray-100 bg-gray-50 px-8 py-6">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-gray-500">
                                            작성일: {new Date(curriculum.createdAt).toLocaleDateString('ko-KR', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={handlePDFExport}
                                                className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-500/30"
                                            >
                                                <DocumentArrowDownIcon className="w-5 h-5" />
                                                PDF로 저장
                                            </button>
                                            <button
                                                onClick={onClose}
                                                className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all"
                                            >
                                                닫기
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

