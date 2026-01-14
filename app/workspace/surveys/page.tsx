'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import CreateSurveyModal from '@/components/CreateSurveyModal'
import { showAlert } from '@/components/CustomAlert'
import { deleteGoogleForm } from '@/lib/googleForms'

export default function SurveysPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [surveys, setSurveys] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSurvey, setEditingSurvey] = useState<any>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all') // all, 준비중, 진행중, 종료

  // 인증 확인
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/workspace/login')
    }
  }, [status, router])

  // 설문조사 목록 가져오기
  const fetchSurveys = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filterStatus !== 'all') {
        params.append('status', filterStatus)
      }

      const response = await fetch(`/api/surveys?${params}`)
      if (!response.ok) throw new Error('설문조사 목록 가져오기 실패')

      const data = await response.json()
      setSurveys(data)
    } catch (error) {
      console.error('설문조사 목록 가져오기 오류:', error)
      showAlert.error('오류', '설문조사 목록을 가져오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === 'authenticated') {
      fetchSurveys()
    }
  }, [status, filterStatus])

  // 설문 삭제
  const handleDelete = async (survey: any) => {
    showAlert.confirm(
      '설문조사 삭제',
      `"${survey.title}" 설문조사를 삭제하시겠습니까?\n\n⚠️ Google Forms도 함께 삭제됩니다.`,
      async () => {
        try {
          // 1. DB에서 삭제
          const response = await fetch(`/api/surveys/${survey.id}`, {
            method: 'DELETE'
          })

          if (!response.ok) throw new Error('DB 삭제 실패')

          // 2. Google Forms 삭제 (있는 경우)
          if (survey.googleFormId && session?.accessToken) {
            try {
              await deleteGoogleForm(session.accessToken as string, survey.googleFormId)
            } catch (error) {
              console.warn('Google Forms 삭제 실패:', error)
              // DB는 삭제되었으므로 경고만 표시
            }
          }

          showAlert.success('삭제 완료', '설문조사가 삭제되었습니다.')
          fetchSurveys()
        } catch (error) {
          console.error('설문조사 삭제 오류:', error)
          showAlert.error('삭제 실패', '다시 시도해주세요.')
        }
      }
    )
  }

  // 수정 모달 열기
  const handleEdit = (survey: any) => {
    setEditingSurvey(survey)
    setIsModalOpen(true)
  }

  // 모달 닫기
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingSurvey(null)
  }

  // 통계 계산
  const stats = {
    total: surveys.length,
    preparing: surveys.filter(s => s.status === '준비중').length,
    ongoing: surveys.filter(s => s.status === '진행중').length,
    completed: surveys.filter(s => s.status === '종료').length,
    totalResponses: surveys.reduce((sum, s) => sum + (s.responseCount || 0), 0)
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-black text-gray-900">만족도조사 관리</h1>
              <p className="text-gray-600 mt-2">Google Forms 기반 설문조사를 생성하고 관리하세요</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 rounded-xl font-medium text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              새 설문 만들기
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-md border-2 border-gray-100">
              <p className="text-sm text-gray-500 font-medium mb-2">총 설문조사</p>
              <p className="text-3xl font-black text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-2xl shadow-md border-2 border-blue-200">
              <p className="text-sm text-blue-500 font-medium mb-2">준비 중</p>
              <p className="text-3xl font-black text-blue-500">{stats.preparing}</p>
            </div>
            <div className="bg-blue-100 p-6 rounded-2xl shadow-md border-2 border-blue-300">
              <p className="text-sm text-blue-600 font-medium mb-2">진행 중</p>
              <p className="text-3xl font-black text-blue-600">{stats.ongoing}</p>
            </div>
            <div className="bg-blue-200 p-6 rounded-2xl shadow-md border-2 border-blue-400">
              <p className="text-sm text-blue-700 font-medium mb-2">종료</p>
              <p className="text-3xl font-black text-blue-700">{stats.completed}</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-2xl shadow-md border-2 border-blue-200">
              <p className="text-sm text-blue-700 font-medium mb-2">총 응답</p>
              <p className="text-3xl font-black text-blue-600">{stats.totalResponses}</p>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex gap-3">
          {['all', '준비중', '진행중', '종료'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                filterStatus === status
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {status === 'all' ? '전체' : status}
            </button>
          ))}
        </div>

        {/* Survey List */}
        <div className="space-y-4">
          {surveys.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md p-12 text-center">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">설문조사가 없습니다</h3>
              <p className="text-gray-600 mb-6">새 설문조사를 만들어보세요!</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 rounded-xl font-medium text-white bg-blue-600 hover:bg-blue-700 transition-all"
              >
                + 새 설문 만들기
              </button>
            </div>
          ) : (
            surveys.map((survey) => (
              <SurveyCard
                key={survey.id}
                survey={survey}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      <CreateSurveyModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={fetchSurveys}
        editingSurvey={editingSurvey}
      />
    </div>
  )
}

// Survey Card Component
function SurveyCard({ survey, onEdit, onDelete }: any) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case '준비중':
        return 'bg-blue-50 text-blue-500 border-blue-200'
      case '진행중':
        return 'bg-blue-100 text-blue-600 border-blue-300'
      case '종료':
        return 'bg-blue-200 text-blue-700 border-blue-400'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-md border-2 border-gray-100 p-6 hover:border-blue-300 transition-all">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-xl font-bold text-gray-900">{survey.title}</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(survey.status)}`}>
              {survey.status}
            </span>
            {survey.isDraft && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 border border-orange-300">
                임시저장
              </span>
            )}
          </div>

          {survey.description && (
            <p className="text-gray-600 mb-4 line-clamp-2">{survey.description}</p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {survey.targetClass && (
              <div>
                <span className="text-gray-500">대상 수업:</span>
                <span className="ml-2 font-medium text-gray-900">{survey.targetClass}</span>
              </div>
            )}
            <div>
              <span className="text-gray-500">질문 수:</span>
              <span className="ml-2 font-medium text-gray-900">{survey.questions?.length || 0}개</span>
            </div>
            <div>
              <span className="text-gray-500">응답 수:</span>
              <span className="ml-2 font-medium text-gray-900">{survey.responseCount || 0}명</span>
            </div>
            <div>
              <span className="text-gray-500">생성일:</span>
              <span className="ml-2 font-medium text-gray-900">
                {new Date(survey.createdAt).toLocaleDateString('ko-KR')}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 ml-4">
          {survey.googleFormUrl && (
            <a
              href={survey.googleFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
              title="Google Forms 열기"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
          <button
            onClick={() => onEdit(survey)}
            className="p-3 rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
            title="수정"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(survey)}
            className="p-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
            title="삭제"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
