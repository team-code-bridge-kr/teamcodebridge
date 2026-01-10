'use client'

import { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon, ArrowLeftIcon, ArrowRightIcon, CheckCircleIcon, BookmarkIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import { showAlert } from './CustomAlert'

interface Session {
    sessionNumber: number
    sessionName: string
    scheduledDate: string
    location: string
    goal: string
    content: string
}

interface CurriculumData {
    name: string
    description: string
    motivation: string
    benefits: string
    minMentors: number
    recommendedStudents: number
    expectedEffect: string
    sessions: Session[]
}

interface CreateCurriculumModalProps {
    isOpen: boolean
    onClose: () => void
    onCurriculumCreated: () => void
}

const STORAGE_KEY = 'curriculum_draft'

export default function CreateCurriculumModal({ isOpen, onClose, onCurriculumCreated }: CreateCurriculumModalProps) {
    const [currentStep, setCurrentStep] = useState(1)
    const [isSaving, setIsSaving] = useState(false)
    const [formData, setFormData] = useState<CurriculumData>({
        name: '',
        description: '',
        motivation: '',
        benefits: '',
        minMentors: 2,
        recommendedStudents: 10,
        expectedEffect: '',
        sessions: [
            { sessionNumber: 1, sessionName: '', scheduledDate: '', location: '', goal: '', content: '' },
            { sessionNumber: 2, sessionName: '', scheduledDate: '', location: '', goal: '', content: '' },
            { sessionNumber: 3, sessionName: '', scheduledDate: '', location: '', goal: '', content: '' },
            { sessionNumber: 4, sessionName: '', scheduledDate: '', location: '', goal: '', content: '' },
        ]
    })

    // 중간저장 데이터 로드
    useEffect(() => {
        if (isOpen) {
            const saved = localStorage.getItem(STORAGE_KEY)
            if (saved) {
                try {
                    const parsed = JSON.parse(saved)
                    setFormData(parsed)
                } catch (error) {
                    console.error('Failed to load draft:', error)
                }
            }
        }
    }, [isOpen])

    // 자동 중간저장 (5초마다)
    useEffect(() => {
        if (!isOpen) return
        
        const interval = setInterval(() => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(formData))
        }, 5000)

        return () => clearInterval(interval)
    }, [formData, isOpen])

    const handleSaveDraft = () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(formData))
        showAlert.success('임시 저장 완료', '나중에 이어서 작성할 수 있습니다.')
    }

    const handleClearDraft = () => {
        if (confirm('저장된 초안을 삭제하시겠습니까?')) {
            localStorage.removeItem(STORAGE_KEY)
            setFormData({
                name: '',
                description: '',
                motivation: '',
                benefits: '',
                minMentors: 2,
                recommendedStudents: 10,
                expectedEffect: '',
                sessions: [
                    { sessionNumber: 1, sessionName: '', scheduledDate: '', location: '', goal: '', content: '' },
                    { sessionNumber: 2, sessionName: '', scheduledDate: '', location: '', goal: '', content: '' },
                    { sessionNumber: 3, sessionName: '', scheduledDate: '', location: '', goal: '', content: '' },
                    { sessionNumber: 4, sessionName: '', scheduledDate: '', location: '', goal: '', content: '' },
                ]
            })
            setCurrentStep(1)
        }
    }

    const updateSession = (index: number, field: keyof Session, value: string) => {
        const newSessions = [...formData.sessions]
        newSessions[index] = { ...newSessions[index], [field]: value }
        setFormData({ ...formData, sessions: newSessions })
    }

    const canProceedToNextStep = () => {
        switch (currentStep) {
            case 1:
                return formData.name.trim() !== '' && 
                       formData.description.trim() !== '' && 
                       formData.motivation.trim() !== ''
            case 2:
                return formData.benefits.trim() !== '' && 
                       formData.minMentors > 0 && 
                       formData.recommendedStudents > 0
            case 3:
                return formData.sessions.every(s => 
                    s.sessionName.trim() !== '' && 
                    s.goal.trim() !== '' && 
                    s.content.trim() !== ''
                )
            case 4:
                return formData.expectedEffect.trim() !== ''
            default:
                return false
        }
    }

    const handleSubmit = async () => {
        if (!canProceedToNextStep()) {
            showAlert.warning('필수 항목 누락', '모든 필수 항목을 입력해주세요.')
            return
        }

        setIsSaving(true)
        try {
            const response = await fetch('/api/curriculums', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (!response.ok) throw new Error('Failed to create curriculum')

            localStorage.removeItem(STORAGE_KEY)
            showAlert.success('커리큘럼 등록 완료!', '커리큘럼이 성공적으로 등록되었습니다.')
            onCurriculumCreated()
            handleClose()
        } catch (error) {
            console.error('Failed to create curriculum:', error)
            showAlert.error('등록 실패', '커리큘럼 등록에 실패했습니다. 다시 시도해주세요.')
        } finally {
            setIsSaving(false)
        }
    }

    const handleClose = () => {
        setCurrentStep(1)
        onClose()
    }

    const steps = [
        { number: 1, title: '기본 정보', description: '프로그램 기본 정보를 입력하세요' },
        { number: 2, title: '목표 & 인원', description: '프로그램 목표와 인원을 설정하세요' },
        { number: 3, title: '프로그램 구성', description: '4회차 프로그램을 구성하세요' },
        { number: 4, title: '기대효과 & 검토', description: '기대효과를 작성하고 검토하세요' },
    ]

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={handleClose}>
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
                            <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all">
                                {/* Header */}
                                <div className="border-b border-gray-100 bg-gradient-to-r from-purple-50 to-blue-50 px-8 py-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <Dialog.Title className="text-2xl font-black text-gray-900">
                                            새 커리큘럼 만들기
                                        </Dialog.Title>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={handleSaveDraft}
                                                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-600 hover:text-purple-600 hover:bg-white rounded-xl transition-all"
                                            >
                                                <BookmarkIcon className="w-4 h-4" />
                                                임시저장
                                            </button>
                                            <button
                                                onClick={handleClose}
                                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-xl transition-all"
                                            >
                                                <XMarkIcon className="w-6 h-6" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Progress Steps */}
                                    <div className="flex items-center justify-between">
                                        {steps.map((step, index) => (
                                            <div key={step.number} className="flex items-center flex-1">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                                                        currentStep === step.number
                                                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                                                            : currentStep > step.number
                                                            ? 'bg-green-500 text-white'
                                                            : 'bg-white text-gray-400 border-2 border-gray-200'
                                                    }`}>
                                                        {currentStep > step.number ? (
                                                            <CheckCircleIcon className="w-6 h-6" />
                                                        ) : (
                                                            step.number
                                                        )}
                                                    </div>
                                                    <div className="hidden md:block">
                                                        <p className={`text-sm font-bold ${
                                                            currentStep >= step.number ? 'text-gray-900' : 'text-gray-400'
                                                        }`}>
                                                            {step.title}
                                                        </p>
                                                    </div>
                                                </div>
                                                {index < steps.length - 1 && (
                                                    <div className={`flex-1 h-1 mx-4 rounded-full transition-all ${
                                                        currentStep > step.number ? 'bg-green-500' : 'bg-gray-200'
                                                    }`} />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="px-8 py-6 max-h-[60vh] overflow-y-auto">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={currentStep}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            {/* Step 1: 기본 정보 */}
                                            {currentStep === 1 && (
                                                <div className="space-y-6">
                                                    <div>
                                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                                            프로그램명 <span className="text-red-500">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={formData.name}
                                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                            placeholder="예: 멘토링톤, PyDrone, 웹 개발 입문 등"
                                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                                            프로그램 소개 (200자 이내) <span className="text-red-500">*</span>
                                                        </label>
                                                        <textarea
                                                            value={formData.description}
                                                            onChange={(e) => setFormData({ ...formData, description: e.target.value.slice(0, 200) })}
                                                            placeholder="이 프로그램은 어떤 내용인가요? 간단히 소개해주세요."
                                                            rows={4}
                                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                                                        />
                                                        <p className="text-xs text-gray-500 mt-1 text-right">
                                                            {formData.description.length}/200자
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                                            활동 기획 계기 (200자 이내) <span className="text-red-500">*</span>
                                                        </label>
                                                        <textarea
                                                            value={formData.motivation}
                                                            onChange={(e) => setFormData({ ...formData, motivation: e.target.value.slice(0, 200) })}
                                                            placeholder="이 프로그램을 기획하게 된 계기는 무엇인가요?"
                                                            rows={4}
                                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                                                        />
                                                        <p className="text-xs text-gray-500 mt-1 text-right">
                                                            {formData.motivation.length}/200자
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Step 2: 목표 & 인원 */}
                                            {currentStep === 2 && (
                                                <div className="space-y-6">
                                                    <div>
                                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                                            활동을 통해 얻게 되는 점 <span className="text-red-500">*</span>
                                                        </label>
                                                        <textarea
                                                            value={formData.benefits}
                                                            onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                                                            placeholder="학생들이 이 프로그램을 통해 무엇을 얻을 수 있나요?"
                                                            rows={5}
                                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-6">
                                                        <div>
                                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                                최소 현장 멘토 수 <span className="text-red-500">*</span>
                                                            </label>
                                                            <input
                                                                type="number"
                                                                min="1"
                                                                value={formData.minMentors}
                                                                onChange={(e) => setFormData({ ...formData, minMentors: parseInt(e.target.value) || 1 })}
                                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                                추천 수혜 학생 수 <span className="text-red-500">*</span>
                                                            </label>
                                                            <input
                                                                type="number"
                                                                min="1"
                                                                value={formData.recommendedStudents}
                                                                onChange={(e) => setFormData({ ...formData, recommendedStudents: parseInt(e.target.value) || 1 })}
                                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                                                        <p className="text-sm text-blue-800 font-medium">
                                                            💡 <strong>Tip:</strong> 멘토 대 학생 비율은 1:5~8 정도가 적절합니다. 프로그램 난이도와 특성에 따라 조정하세요!
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Step 3: 프로그램 구성 (4회차) */}
                                            {currentStep === 3 && (
                                                <div className="space-y-6">
                                                    <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 mb-6">
                                                        <p className="text-sm text-purple-800 font-medium">
                                                            📚 4회차 프로그램을 구성해주세요. 각 회차의 목표와 활동 내용을 구체적으로 작성하면 더 좋습니다!
                                                        </p>
                                                    </div>

                                                    {formData.sessions.map((session, index) => (
                                                        <div key={index} className="border border-gray-200 rounded-2xl p-6 space-y-4">
                                                            <div className="flex items-center gap-3 mb-4">
                                                                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                                                    {session.sessionNumber}
                                                                </div>
                                                                <h3 className="text-lg font-bold text-gray-900">{session.sessionNumber}회차</h3>
                                                            </div>

                                                            <div>
                                                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                                                    세부 프로그램명 <span className="text-red-500">*</span>
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={session.sessionName}
                                                                    onChange={(e) => updateSession(index, 'sessionName', e.target.value)}
                                                                    placeholder="예: Python 기초 문법, 드론 제어 실습 등"
                                                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                                                />
                                                            </div>

                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div>
                                                                    <label className="block text-sm font-bold text-gray-700 mb-2">일시</label>
                                                                    <input
                                                                        type="text"
                                                                        value={session.scheduledDate}
                                                                        onChange={(e) => updateSession(index, 'scheduledDate', e.target.value)}
                                                                        placeholder="예: 2026-02-15 14:00"
                                                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-sm font-bold text-gray-700 mb-2">장소</label>
                                                                    <input
                                                                        type="text"
                                                                        value={session.location}
                                                                        onChange={(e) => updateSession(index, 'location', e.target.value)}
                                                                        placeholder="예: Zoom, 강의실 203호"
                                                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div>
                                                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                                                    활동 목표 <span className="text-red-500">*</span>
                                                                </label>
                                                                <textarea
                                                                    value={session.goal}
                                                                    onChange={(e) => updateSession(index, 'goal', e.target.value)}
                                                                    placeholder="이 회차의 학습 목표를 작성하세요"
                                                                    rows={3}
                                                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                                                                />
                                                            </div>

                                                            <div>
                                                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                                                    활동 내용 <span className="text-red-500">*</span>
                                                                </label>
                                                                <textarea
                                                                    value={session.content}
                                                                    onChange={(e) => updateSession(index, 'content', e.target.value)}
                                                                    placeholder="이 회차에서 진행할 구체적인 활동 내용을 작성하세요"
                                                                    rows={4}
                                                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Step 4: 기대효과 & 검토 */}
                                            {currentStep === 4 && (
                                                <div className="space-y-6">
                                                    <div>
                                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                                            기대효과 <span className="text-red-500">*</span>
                                                        </label>
                                                        <textarea
                                                            value={formData.expectedEffect}
                                                            onChange={(e) => setFormData({ ...formData, expectedEffect: e.target.value })}
                                                            placeholder="이 프로그램이 학생들과 지역사회에 어떤 긍정적인 영향을 줄 것으로 기대하나요?"
                                                            rows={6}
                                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                                                        />
                                                    </div>

                                                    {/* 검토 요약 */}
                                                    <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-100 rounded-2xl p-6">
                                                        <h3 className="text-lg font-black text-gray-900 mb-4">📋 입력 내용 검토</h3>
                                                        <div className="space-y-3 text-sm">
                                                            <div className="flex items-start gap-3">
                                                                <span className="font-bold text-gray-600 min-w-[100px]">프로그램명:</span>
                                                                <span className="text-gray-900 font-medium">{formData.name || '-'}</span>
                                                            </div>
                                                            <div className="flex items-start gap-3">
                                                                <span className="font-bold text-gray-600 min-w-[100px]">멘토 수:</span>
                                                                <span className="text-gray-900 font-medium">{formData.minMentors}명</span>
                                                            </div>
                                                            <div className="flex items-start gap-3">
                                                                <span className="font-bold text-gray-600 min-w-[100px]">추천 학생 수:</span>
                                                                <span className="text-gray-900 font-medium">{formData.recommendedStudents}명</span>
                                                            </div>
                                                            <div className="flex items-start gap-3">
                                                                <span className="font-bold text-gray-600 min-w-[100px]">프로그램 구성:</span>
                                                                <span className="text-gray-900 font-medium">
                                                                    {formData.sessions.filter(s => s.sessionName).length}/4 회차 작성 완료
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                                                        <p className="text-sm text-green-800 font-medium">
                                                            ✅ 모든 내용을 확인했다면 <strong>등록하기</strong> 버튼을 눌러주세요!
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </motion.div>
                                    </AnimatePresence>
                                </div>

                                {/* Footer */}
                                <div className="border-t border-gray-100 bg-gray-50 px-8 py-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            {currentStep > 1 ? (
                                                <button
                                                    onClick={() => setCurrentStep(currentStep - 1)}
                                                    className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all"
                                                >
                                                    <ArrowLeftIcon className="w-5 h-5" />
                                                    이전
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={handleClearDraft}
                                                    className="px-6 py-3 text-sm text-gray-500 hover:text-red-600 font-bold transition-colors"
                                                >
                                                    초안 삭제
                                                </button>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-3">
                                            {currentStep < 4 ? (
                                                <button
                                                    onClick={() => {
                                                        if (canProceedToNextStep()) {
                                                            setCurrentStep(currentStep + 1)
                                                        } else {
                                                            showAlert.warning('필수 항목 누락', '필수 항목을 모두 입력해주세요.')
                                                        }
                                                    }}
                                                    disabled={!canProceedToNextStep()}
                                                    className="flex items-center gap-2 px-8 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/30"
                                                >
                                                    다음
                                                    <ArrowRightIcon className="w-5 h-5" />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={handleSubmit}
                                                    disabled={isSaving || !canProceedToNextStep()}
                                                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/30"
                                                >
                                                    {isSaving ? (
                                                        <>
                                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                            등록 중...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <CheckCircleIcon className="w-5 h-5" />
                                                            등록하기
                                                        </>
                                                    )}
                                                </button>
                                            )}
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

