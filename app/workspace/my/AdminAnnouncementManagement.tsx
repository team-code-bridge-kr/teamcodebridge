'use client'

import { useState, useEffect } from 'react'
import { 
    PlusIcon, 
    PencilIcon, 
    TrashIcon,
    XMarkIcon,
    BellIcon
} from '@heroicons/react/24/outline'

interface Announcement {
    id: string
    title: string
    content: string
    category: string
    isImportant: boolean
    createdAt: string
    createdBy?: {
        id: string
        name: string | null
        email: string | null
    } | null
}

interface AnnouncementFormData {
    title: string
    content: string
    category: string
    isImportant: boolean
}

export default function AdminAnnouncementManagement() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null)
    const [formData, setFormData] = useState<AnnouncementFormData>({
        title: '',
        content: '',
        category: '공지',
        isImportant: false
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        fetchAnnouncements()
    }, [])

    const fetchAnnouncements = async () => {
        try {
            const res = await fetch('/api/announcements')
            if (res.ok) {
                const data = await res.json()
                setAnnouncements(data)
            }
        } catch (error) {
            console.error('Error fetching announcements:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleOpenModal = (announcement?: Announcement) => {
        if (announcement) {
            setEditingAnnouncement(announcement)
            setFormData({
                title: announcement.title,
                content: announcement.content,
                category: announcement.category,
                isImportant: announcement.isImportant
            })
        } else {
            setEditingAnnouncement(null)
            setFormData({
                title: '',
                content: '',
                category: '공지',
                isImportant: false
            })
        }
        setShowModal(true)
    }

    const handleCloseModal = () => {
        setShowModal(false)
        setEditingAnnouncement(null)
        setFormData({
            title: '',
            content: '',
            category: '공지',
            isImportant: false
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const url = editingAnnouncement 
                ? `/api/announcements/${editingAnnouncement.id}`
                : '/api/announcements'
            
            const method = editingAnnouncement ? 'PUT' : 'POST'
            
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                await fetchAnnouncements()
                handleCloseModal()
            } else {
                const error = await res.json()
                alert(error.error || '공지사항 저장에 실패했습니다.')
            }
        } catch (error) {
            console.error('Error saving announcement:', error)
            alert('공지사항 저장에 실패했습니다.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('정말 이 공지사항을 삭제하시겠습니까?')) return

        try {
            const res = await fetch(`/api/announcements/${id}`, {
                method: 'DELETE'
            })

            if (res.ok) {
                await fetchAnnouncements()
            } else {
                alert('공지사항 삭제에 실패했습니다.')
            }
        } catch (error) {
            console.error('Error deleting announcement:', error)
            alert('공지사항 삭제에 실패했습니다.')
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).replace(/\./g, '.').replace(/\s/g, '')
    }

    if (loading) {
        return <div className="text-center py-8 text-gray-500">로딩 중...</div>
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-black text-black mb-2">공지사항 관리</h2>
                    <p className="text-sm text-gray-500">팀코드브릿지 공지사항을 등록하고 관리합니다.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl font-bold text-sm hover:bg-primary-700 transition-colors"
                >
                    <PlusIcon className="w-5 h-5" />
                    공지사항 등록
                </button>
            </div>

            {announcements.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                    <BellIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="font-bold">등록된 공지사항이 없습니다</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {announcements.map((announcement) => (
                        <div
                            key={announcement.id}
                            className={`p-5 rounded-2xl border-2 transition-all ${
                                announcement.isImportant 
                                    ? 'border-red-200 bg-red-50/30' 
                                    : 'border-gray-100 bg-white hover:border-primary-200'
                            }`}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        {announcement.isImportant && (
                                            <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-black rounded-full">중요</span>
                                        )}
                                        <span className="px-2 py-0.5 bg-primary-100 text-primary-600 text-[10px] font-bold rounded-full">
                                            {announcement.category}
                                        </span>
                                        <span className="text-xs text-gray-400">{formatDate(announcement.createdAt)}</span>
                                    </div>
                                    <h3 className="font-black text-black text-base mb-2">{announcement.title}</h3>
                                    <p className="text-sm text-gray-600 line-clamp-2">{announcement.content}</p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <button
                                        onClick={() => handleOpenModal(announcement)}
                                        className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                    >
                                        <PencilIcon className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(announcement.id)}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* 모달 */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                            <h3 className="text-xl font-black text-black">
                                {editingAnnouncement ? '공지사항 수정' : '공지사항 등록'}
                            </h3>
                            <button
                                onClick={handleCloseModal}
                                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
                            >
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    제목 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="공지사항 제목을 입력하세요"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    내용 <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="공지사항 내용을 입력하세요"
                                    rows={6}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        카테고리
                                    </label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    >
                                        <option value="공지">공지</option>
                                        <option value="업데이트">업데이트</option>
                                        <option value="이벤트">이벤트</option>
                                        <option value="기타">기타</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        중요 표시
                                    </label>
                                    <div className="flex items-center h-[52px]">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.isImportant}
                                                onChange={(e) => setFormData({ ...formData, isImportant: e.target.checked })}
                                                className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                            />
                                            <span className="text-sm text-gray-700">중요 공지사항으로 표시</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors"
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-6 py-2 bg-primary-600 text-white rounded-xl font-bold text-sm hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isSubmitting ? '저장 중...' : editingAnnouncement ? '수정' : '등록'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

