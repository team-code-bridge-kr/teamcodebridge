'use client'

import { useState, useEffect } from 'react'
import { 
    PlusIcon, 
    PencilIcon, 
    TrashIcon,
    UserCircleIcon,
    ShieldCheckIcon,
    XMarkIcon
} from '@heroicons/react/24/outline'

interface User {
    id: string
    name: string | null
    email: string | null
    role: string
    isApproved: boolean
    team: string | null
    position: string | null
    phone: string | null
    university: string | null
    joinDate: string | null
    status: string | null
}

interface UserFormData {
    email: string
    name: string
    role: 'ADMIN' | 'MENTOR'
    isApproved: boolean
    team: string
    position: string
    phone: string
    university: string
    joinDate: string
    status: string
}

export default function AdminUserManagement() {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingUser, setEditingUser] = useState<User | null>(null)
    const [formData, setFormData] = useState<UserFormData>({
        email: '',
        name: '',
        role: 'MENTOR',
        isApproved: false,
        team: '',
        position: '',
        phone: '',
        university: '',
        joinDate: '',
        status: ''
    })

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/admin/users')
            if (res.ok) {
                const data = await res.json()
                setUsers(data)
            }
        } catch (error) {
            console.error('Error fetching users:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleAdd = () => {
        setEditingUser(null)
        setFormData({
            email: '',
            name: '',
            role: 'MENTOR',
            isApproved: false,
            team: '',
            position: '',
            phone: '',
            university: '',
            joinDate: '',
            status: ''
        })
        setShowModal(true)
    }

    const handleEdit = (user: User) => {
        setEditingUser(user)
        setFormData({
            email: user.email || '',
            name: user.name || '',
            role: (user.role as 'ADMIN' | 'MENTOR') || 'MENTOR',
            isApproved: user.isApproved,
            team: user.team || '',
            position: user.position || '',
            phone: user.phone || '',
            university: user.university || '',
            joinDate: user.joinDate || '',
            status: user.status || ''
        })
        setShowModal(true)
    }

    const handleDelete = async (id: string) => {
        if (!confirm('정말 삭제하시겠습니까?')) return

        try {
            const res = await fetch(`/api/admin/users/${id}`, {
                method: 'DELETE'
            })
            if (res.ok) {
                fetchUsers()
            } else {
                alert('삭제 실패')
            }
        } catch (error) {
            console.error('Error deleting user:', error)
            alert('삭제 중 오류가 발생했습니다.')
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const url = editingUser 
                ? `/api/admin/users/${editingUser.id}`
                : '/api/admin/users'
            
            const method = editingUser ? 'PUT' : 'POST'

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...formData,
                    email: formData.email || null,
                    name: formData.name || null,
                    team: formData.team || null,
                    position: formData.position || null,
                    phone: formData.phone || null,
                    university: formData.university || null,
                    joinDate: formData.joinDate || null,
                    status: formData.status || null,
                })
            })

            if (res.ok) {
                setShowModal(false)
                fetchUsers()
            } else {
                const error = await res.json()
                alert(error.error || '저장 실패')
            }
        } catch (error) {
            console.error('Error saving user:', error)
            alert('저장 중 오류가 발생했습니다.')
        }
    }

    if (loading) {
        return <div className="text-center py-8 text-gray-500">로딩 중...</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-black mb-1">사용자 관리</h2>
                    <p className="text-gray-500 text-sm">Google 계정 및 권한 설정</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium text-sm"
                >
                    <PlusIcon className="w-5 h-5" />
                    사용자 추가
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase">이름</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase">이메일</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase">권한</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase">직책</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase">승인</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase">작업</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <UserCircleIcon className="w-8 h-8 text-gray-400" />
                                            <span className="font-bold text-gray-900">{user.name || '-'}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">{user.email || '-'}</td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            user.role === 'ADMIN' 
                                                ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                                                : 'bg-gray-100 text-gray-700 border border-gray-200'
                                        }`}>
                                            {user.role === 'ADMIN' ? '관리자' : '멘토'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">{user.position || '-'}</td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            user.isApproved 
                                                ? 'bg-green-100 text-green-700 border border-green-200' 
                                                : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                                        }`}>
                                            {user.isApproved ? '승인됨' : '대기중'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleEdit(user)}
                                                className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                                title="수정"
                                            >
                                                <PencilIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="삭제"
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 모달 */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between">
                            <h3 className="text-xl font-black text-black">
                                {editingUser ? '사용자 수정' : '사용자 추가'}
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <XMarkIcon className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        Google 계정 이메일 *
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        이름 *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        권한 *
                                    </label>
                                    <select
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value as 'ADMIN' | 'MENTOR' })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    >
                                        <option value="MENTOR">멘토</option>
                                        <option value="ADMIN">관리자</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        직책
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.position}
                                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="예: 팀장, 대표이사"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        소속팀
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.team}
                                        onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        전화번호
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        학교
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.university}
                                        onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        입사일
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.joinDate}
                                        onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        재직상태
                                    </label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    >
                                        <option value="">선택 안함</option>
                                        <option value="재직중">재직중</option>
                                        <option value="휴직중">휴직중</option>
                                        <option value="군대">군대</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <input
                                    type="checkbox"
                                    id="isApproved"
                                    checked={formData.isApproved}
                                    onChange={(e) => setFormData({ ...formData, isApproved: e.target.checked })}
                                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                />
                                <label htmlFor="isApproved" className="text-sm font-medium text-gray-700">
                                    승인됨 (로그인 가능)
                                </label>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium"
                                >
                                    {editingUser ? '수정' : '추가'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                                >
                                    취소
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

