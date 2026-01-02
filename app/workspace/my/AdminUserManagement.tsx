'use client'

import { useState, useEffect, useMemo } from 'react'
import { 
    PlusIcon, 
    PencilIcon, 
    TrashIcon,
    UserCircleIcon,
    ShieldCheckIcon,
    XMarkIcon,
    FunnelIcon
} from '@heroicons/react/24/outline'

interface User {
    id: string
    name: string | null
    email: string | null
    teamcodebridgeEmail: string | null
    role: string
    isApproved: boolean
    team: string | null
    position: string | null
    phone: string | null
    university: string | null
    joinDate: string | null
    status: string | null
    image: string | null
}

interface UserFormData {
    email: string
    teamcodebridgeEmail: string
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

// 전화번호 자동 포맷팅 함수
const formatPhoneNumber = (value: string): string => {
    // 숫자만 추출
    const numbers = value.replace(/\D/g, '')
    
    // 11자리 제한
    const limited = numbers.slice(0, 11)
    
    // 포맷팅
    if (limited.length <= 3) {
        return limited
    } else if (limited.length <= 7) {
        return `${limited.slice(0, 3)}-${limited.slice(3)}`
    } else {
        return `${limited.slice(0, 3)}-${limited.slice(3, 7)}-${limited.slice(7)}`
    }
}

export default function AdminUserManagement() {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingUser, setEditingUser] = useState<User | null>(null)
    const [formData, setFormData] = useState<UserFormData>({
        email: '',
        teamcodebridgeEmail: '',
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

    // 필터 상태
    const [positionFilter, setPositionFilter] = useState('전체')
    const [roleFilter, setRoleFilter] = useState('전체')
    const [approvalFilter, setApprovalFilter] = useState('전체')

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

    // 필터링된 사용자 목록
    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            if (positionFilter !== '전체' && user.position !== positionFilter) return false
            if (roleFilter !== '전체' && user.role !== roleFilter) return false
            if (approvalFilter !== '전체') {
                if (approvalFilter === '승인됨' && !user.isApproved) return false
                if (approvalFilter === '대기중' && user.isApproved) return false
            }
            return true
        })
    }, [users, positionFilter, roleFilter, approvalFilter])

    // 고유한 직책 목록
    const positions = useMemo(() => {
        const allPositions = users.map(u => u.position).filter(Boolean) as string[]
        return ['전체', ...Array.from(new Set(allPositions)).sort()]
    }, [users])

    const handleAdd = () => {
        setEditingUser(null)
        setFormData({
            email: '',
            teamcodebridgeEmail: '',
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
            teamcodebridgeEmail: user.teamcodebridgeEmail || '',
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

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPhoneNumber(e.target.value)
        setFormData({ ...formData, phone: formatted })
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
                    teamcodebridgeEmail: formData.teamcodebridgeEmail || null,
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

            {/* 필터 영역 */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-wrap gap-3">
                <div className="relative">
                    <select
                        value={positionFilter}
                        onChange={(e) => setPositionFilter(e.target.value)}
                        className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm font-medium"
                    >
                        {positions.map(pos => (
                            <option key={pos} value={pos}>{pos}</option>
                        ))}
                    </select>
                    <FunnelIcon className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                <div className="relative">
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm font-medium"
                    >
                        <option value="전체">전체</option>
                        <option value="ADMIN">관리자</option>
                        <option value="MENTOR">멘토</option>
                    </select>
                    <FunnelIcon className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                <div className="relative">
                    <select
                        value={approvalFilter}
                        onChange={(e) => setApprovalFilter(e.target.value)}
                        className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm font-medium"
                    >
                        <option value="전체">전체</option>
                        <option value="승인됨">승인됨</option>
                        <option value="대기중">대기중</option>
                    </select>
                    <FunnelIcon className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
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
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            {user.image ? (
                                                <img 
                                                    src={user.image} 
                                                    alt={user.name || ''} 
                                                    className="w-8 h-8 rounded-full object-cover"
                                                />
                                            ) : (
                                                <img 
                                                    src="/img/TeamCodeBridge_Logo_Black_Web.png" 
                                                    alt="TCB" 
                                                    className="w-8 h-8 rounded-full object-contain p-1 bg-gray-100"
                                                />
                                            )}
                                            <span className="font-bold text-gray-900">{user.name || '-'}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">
                                        <div>
                                            <div>{user.email || '-'}</div>
                                            {user.teamcodebridgeEmail && (
                                                <div className="text-xs text-gray-400">{user.teamcodebridgeEmail}</div>
                                            )}
                                        </div>
                                    </td>
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
                    {filteredUsers.length === 0 && (
                        <div className="p-12 text-center text-gray-400">
                            필터 조건에 맞는 사용자가 없습니다.
                        </div>
                    )}
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
                                        TeamCodeBridge 메일
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.teamcodebridgeEmail}
                                        onChange={(e) => setFormData({ ...formData, teamcodebridgeEmail: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="예: name@teamcodebridge.dev"
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
                                        onChange={handlePhoneChange}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="010-1234-5678"
                                        maxLength={13}
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
