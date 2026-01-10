'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { showAlert } from './CustomAlert'
import { RECOMMENDED_SURVEY_TEMPLATE, QUESTION_TYPE_LABELS, QUESTION_TYPE_ICONS, SurveyQuestionTemplate } from '@/lib/surveyTemplates'
import { createGoogleForm } from '@/lib/googleForms'

interface CreateSurveyModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  editingSurvey?: any // 수정할 설문조사 (있으면 수정 모드)
}

export default function CreateSurveyModal({ isOpen, onClose, onSuccess, editingSurvey }: CreateSurveyModalProps) {
  const { data: session } = useSession()
  const [step, setStep] = useState(1) // 1: 기본정보, 2: 질문설정

  // 기본 정보
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [targetClass, setTargetClass] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // 질문 목록
  const [questions, setQuestions] = useState<SurveyQuestionTemplate[]>([])
  const [useTemplate, setUseTemplate] = useState(false)

  // 저장 중 상태
  const [isSaving, setIsSaving] = useState(false)

  // 수정 모드인 경우 초기값 설정
  useEffect(() => {
    if (editingSurvey && isOpen) {
      setTitle(editingSurvey.title || '')
      setDescription(editingSurvey.description || '')
      setTargetClass(editingSurvey.targetClass || '')
      setStartDate(editingSurvey.startDate ? new Date(editingSurvey.startDate).toISOString().split('T')[0] : '')
      setEndDate(editingSurvey.endDate ? new Date(editingSurvey.endDate).toISOString().split('T')[0] : '')
      setQuestions(editingSurvey.questions || [])
    }
  }, [editingSurvey, isOpen])

  // 모달 닫기 시 초기화
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep(1)
        setTitle('')
        setDescription('')
        setTargetClass('')
        setStartDate('')
        setEndDate('')
        setQuestions([])
        setUseTemplate(false)
      }, 300)
    }
  }, [isOpen])

  // 추천 템플릿 사용
  const handleUseTemplate = () => {
    setQuestions(RECOMMENDED_SURVEY_TEMPLATE)
    setUseTemplate(true)
    showAlert.success('추천 설문폼 적용 완료', '11개의 질문이 추가되었습니다.')
  }

  // 질문 추가
  const handleAddQuestion = () => {
    const newQuestion: SurveyQuestionTemplate = {
      order: questions.length + 1,
      questionText: '',
      questionType: 'TEXT',
      required: true
    }
    setQuestions([...questions, newQuestion])
  }

  // 질문 삭제
  const handleDeleteQuestion = (index: number) => {
    showAlert.confirm(
      '질문 삭제',
      '이 질문을 삭제하시겠습니까?',
      () => {
        const updated = questions.filter((_, i) => i !== index)
        // order 재정렬
        updated.forEach((q, i) => {
          q.order = i + 1
        })
        setQuestions(updated)
      }
    )
  }

  // 질문 수정
  const handleUpdateQuestion = (index: number, field: string, value: any) => {
    const updated = [...questions]
    updated[index] = { ...updated[index], [field]: value }
    setQuestions(updated)
  }

  // 다음 단계로
  const handleNext = () => {
    if (!title.trim()) {
      showAlert.warning('설문조사명을 입력해주세요')
      return
    }
    setStep(2)
  }

  // 이전 단계로
  const handlePrev = () => {
    setStep(1)
  }

  // 임시저장
  const handleDraft = async () => {
    if (!title.trim()) {
      showAlert.warning('설문조사명을 입력해주세요')
      return
    }

    setIsSaving(true)

    try {
      const url = editingSurvey
        ? `/api/surveys/${editingSurvey.id}`
        : '/api/surveys'

      const method = editingSurvey ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          targetClass,
          startDate: startDate || null,
          endDate: endDate || null,
          questions,
          isDraft: true
        })
      })

      if (!response.ok) {
        throw new Error('임시저장 실패')
      }

      showAlert.success('임시저장 완료', '설문조사가 임시저장되었습니다.')
      onSuccess()
      onClose()
    } catch (error) {
      console.error('임시저장 오류:', error)
      showAlert.error('임시저장 실패', '다시 시도해주세요.')
    } finally {
      setIsSaving(false)
    }
  }

  // 설문 생성 (Google Forms 생성)
  const handleCreate = async () => {
    if (!title.trim()) {
      showAlert.warning('설문조사명을 입력해주세요')
      return
    }

    if (questions.length === 0) {
      showAlert.warning('질문을 추가해주세요')
      return
    }

    setIsSaving(true)

    try {
      // 1. DB에 설문조사 저장
      const url = editingSurvey
        ? `/api/surveys/${editingSurvey.id}`
        : '/api/surveys'

      const method = editingSurvey ? 'PUT' : 'POST'

      const dbResponse = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          targetClass,
          startDate: startDate || null,
          endDate: endDate || null,
          questions,
          isDraft: false,
          status: '진행중'
        })
      })

      if (!dbResponse.ok) {
        throw new Error('DB 저장 실패')
      }

      const savedSurvey = await dbResponse.json()

      // 2. Google Forms 생성 (accessToken 필요)
      if (!session?.accessToken) {
        showAlert.warning('Google 로그인이 필요합니다', '로그아웃 후 재로그인해주세요.')
        return
      }

      const googleForm = await createGoogleForm(
        session.accessToken as string,
        title,
        description,
        questions
      )

      // 3. Google Forms 정보 업데이트
      await fetch(`/api/surveys/${savedSurvey.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          googleFormId: googleForm.formId,
          googleFormUrl: googleForm.formUrl,
          status: '진행중'
        })
      })

      showAlert.success(
        '설문조사 생성 완료!',
        'Google Forms가 성공적으로 생성되었습니다.',
        () => {
          window.open(googleForm.formUrl, '_blank')
        }
      )

      onSuccess()
      onClose()
    } catch (error: any) {
      console.error('설문조사 생성 오류:', error)
      showAlert.error(
        '설문조사 생성 실패',
        error.message || '다시 시도해주세요.'
      )
    } finally {
      setIsSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-200 bg-blue-600">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {editingSurvey ? '설문조사 수정' : '새 설문조사 만들기'}
                    </h2>
                    <p className="text-blue-100 mt-1">
                      {step === 1 ? 'Step 1: 기본 정보' : 'Step 2: 질문 설정'}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-white hover:text-gray-200 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 flex gap-2">
                  <div className={`flex-1 h-2 rounded-full ${step >= 1 ? 'bg-white' : 'bg-white/30'}`} />
                  <div className={`flex-1 h-2 rounded-full ${step >= 2 ? 'bg-white' : 'bg-white/30'}`} />
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                {step === 1 ? (
                  <Step1
                    title={title}
                    setTitle={setTitle}
                    description={description}
                    setDescription={setDescription}
                    targetClass={targetClass}
                    setTargetClass={setTargetClass}
                    startDate={startDate}
                    setStartDate={setStartDate}
                    endDate={endDate}
                    setEndDate={setEndDate}
                  />
                ) : (
                  <Step2
                    questions={questions}
                    setQuestions={setQuestions}
                    useTemplate={useTemplate}
                    onUseTemplate={handleUseTemplate}
                    onAddQuestion={handleAddQuestion}
                    onDeleteQuestion={handleDeleteQuestion}
                    onUpdateQuestion={handleUpdateQuestion}
                  />
                )}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-between">
                <div className="flex gap-3">
                  {step === 2 && (
                    <button
                      onClick={handlePrev}
                      className="px-6 py-3 rounded-xl font-medium text-gray-700 bg-white hover:bg-gray-100 transition-colors border border-gray-300"
                    >
                      ← 이전
                    </button>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleDraft}
                    disabled={isSaving}
                    className="px-6 py-3 rounded-xl font-medium text-gray-700 bg-white hover:bg-gray-100 transition-colors border border-gray-300 disabled:opacity-50"
                  >
                    {isSaving ? '저장 중...' : '임시저장'}
                  </button>

                  {step === 1 ? (
                    <button
                      onClick={handleNext}
                      className="px-6 py-3 rounded-xl font-medium text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
                    >
                      다음 →
                    </button>
                  ) : (
                    <button
                      onClick={handleCreate}
                      disabled={isSaving}
                      className="px-6 py-3 rounded-xl font-medium text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
                    >
                      {isSaving ? '생성 중...' : '설문 생성'}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

// Step 1: 기본 정보
function Step1({ title, setTitle, description, setDescription, targetClass, setTargetClass, startDate, setStartDate, endDate, setEndDate }: any) {
  return (
    <div className="space-y-6">
      {/* 설문조사명 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          설문조사명 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="예: 2024년 2학기 PyDrone 만족도 조사"
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>

      {/* 설문조사 설명 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          설문조사 설명
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="설문조사에 대한 간단한 설명을 입력하세요"
          rows={4}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
        />
      </div>

      {/* 대상 수업 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          대상 수업
        </label>
        <input
          type="text"
          value={targetClass}
          onChange={(e) => setTargetClass(e.target.value)}
          placeholder="예: PyDrone 2기, SaaS 3기"
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>

      {/* 설문 기간 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            시작일
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            종료일
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </div>
    </div>
  )
}

// Step 2: 질문 설정 (다음 메시지에 계속...)
function Step2({ questions, setQuestions, useTemplate, onUseTemplate, onAddQuestion, onDeleteQuestion, onUpdateQuestion }: any) {
  return (
    <div className="space-y-6">
      {/* 추천 템플릿 버튼 */}
      {!useTemplate && questions.length === 0 && (
        <div className="bg-blue-50 border-2 border-dashed border-blue-300 rounded-2xl p-6 text-center">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            ✨ 추천 설문폼 사용하기
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            TeamCodeBridge에서 자주 사용하는 11개의 질문이 자동으로 추가됩니다
          </p>
          <button
            onClick={onUseTemplate}
            className="px-6 py-3 rounded-xl font-medium text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
          >
            추천 설문폼 사용하기
          </button>
        </div>
      )}

      {/* 질문 목록 */}
      <div className="space-y-4">
        {questions.map((q: SurveyQuestionTemplate, index: number) => (
          <QuestionCard
            key={index}
            question={q}
            index={index}
            onUpdate={onUpdateQuestion}
            onDelete={onDeleteQuestion}
          />
        ))}
      </div>

      {/* 질문 추가 버튼 */}
      <button
        onClick={onAddQuestion}
        className="w-full py-4 rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 text-gray-600 hover:text-blue-600 font-medium"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        질문 추가
      </button>
    </div>
  )
}

// 질문 카드 컴포넌트 (다음 메시지에 계속...)
function QuestionCard({ question, index, onUpdate, onDelete }: any) {
  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold text-sm">
            {index + 1}
          </span>
          <select
            value={question.questionType}
            onChange={(e) => onUpdate(index, 'questionType', e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500"
          >
            {Object.entries(QUESTION_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {QUESTION_TYPE_ICONS[value]} {label}
                </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => onDelete(index)}
          className="text-red-500 hover:text-red-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* 질문 내용 */}
      <textarea
        value={question.questionText}
        onChange={(e) => onUpdate(index, 'questionText', e.target.value)}
        placeholder="질문 내용을 입력하세요"
        rows={3}
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 mb-4 resize-none"
      />

      {/* 질문 타입별 추가 옵션 */}
      {(question.questionType === 'MULTIPLE_CHOICE' || question.questionType === 'CHECKBOX') && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            선택지 (쉼표로 구분)
          </label>
          <input
            type="text"
            value={question.options?.join(', ') || ''}
            onChange={(e) => onUpdate(index, 'options', e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean))}
            placeholder="예: 매우 그렇다, 그렇다, 보통, 아니다, 매우 아니다"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {question.questionType === 'LINEAR_SCALE' && (
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              최소값 레이블
            </label>
            <input
              type="text"
              value={question.scaleMinLabel || ''}
              onChange={(e) => onUpdate(index, 'scaleMinLabel', e.target.value)}
              placeholder="예: 매우 불만족"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              최대값 레이블
            </label>
            <input
              type="text"
              value={question.scaleMaxLabel || ''}
              onChange={(e) => onUpdate(index, 'scaleMaxLabel', e.target.value)}
              placeholder="예: 매우 만족"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {/* 필수 여부 */}
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={question.required}
          onChange={(e) => onUpdate(index, 'required', e.target.checked)}
          className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span className="text-sm text-gray-700">필수 질문</span>
      </label>
    </div>
  )
}

