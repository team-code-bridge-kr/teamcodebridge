'use client'

import React, { useState, useMemo } from 'react'
import {
    UserCircleIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    BarsArrowDownIcon,
    BarsArrowUpIcon
} from '@heroicons/react/24/outline'

interface Member {
    id: string
    name: string | null
    email: string | null
    image: string | null
    role: string
    team: string | null
    position: string | null
    phone: string | null
    university: string | null
    joinDate: string | null
    status: string | null
}

export default function HRClient({ initialMembers }: { initialMembers: Member[] }) {
    const [searchTerm, setSearchTerm] = useState('')
    const [teamFilter, setTeamFilter] = useState('전체')
    const [statusFilter, setStatusFilter] = useState('전체')
    const [positionFilter, setPositionFilter] = useState('전체')
    const [sortConfig, setSortConfig] = useState<{ key: keyof Member; direction: 'asc' | 'desc' } | null>(null)

    // 고유한 팀 목록 추출
    const teams = useMemo(() => {
        const allTeams = initialMembers.map(m => m.team).filter(Boolean) as string[]
        // 쉼표로 구분된 팀 처리 (예: "개발팀, 기획팀")
        const splitTeams = allTeams.flatMap(t => t.split(',').map(s => s.trim()))
        return ['전체', ...Array.from(new Set(splitTeams)).sort()]
    }, [initialMembers])

    // 고유한 상태 목록 추출
    const statuses = useMemo(() => {
        const allStatuses = initialMembers.map(m => m.status).filter(Boolean) as string[]
        return ['전체', ...Array.from(new Set(allStatuses)).sort()]
    }, [initialMembers])

    // 고유한 직책 목록 추출
    const positions = useMemo(() => {
        const allPositions = initialMembers.map(m => m.position).filter(Boolean) as string[]
        return ['전체', ...Array.from(new Set(allPositions)).sort()]
    }, [initialMembers])

    const filteredMembers = useMemo(() => {
        let result = [...initialMembers]

        // 검색 필터
        if (searchTerm) {
            result = result.filter(member =>
                member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                member.phone?.includes(searchTerm)
            )
        }

        // 팀 필터
        if (teamFilter !== '전체') {
            result = result.filter(member => member.team?.includes(teamFilter))
        }

        // 상태 필터
        if (statusFilter !== '전체') {
            result = result.filter(member => member.status === statusFilter)
        }

        // 직책 필터
        if (positionFilter !== '전체') {
            result = result.filter(member => member.position === positionFilter)
        }

        // 정렬
        if (sortConfig) {
            result.sort((a, b) => {
                const aValue = a[sortConfig.key] || ''
                const bValue = b[sortConfig.key] || ''

                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
                return 0
            })
        }

        return result
    }, [initialMembers, searchTerm, teamFilter, statusFilter, positionFilter, sortConfig])

    const handleSort = (key: keyof Member) => {
        let direction: 'asc' | 'desc' = 'asc'
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc'
        }
        setSortConfig({ key, direction })
    }

    const SortIcon = ({ columnKey }: { columnKey: keyof Member }) => {
        if (sortConfig?.key !== columnKey) return <div className="w-4 h-4" />
        return sortConfig.direction === 'asc' ?
            <BarsArrowUpIcon className="w-4 h-4 text-primary-600" /> :
            <BarsArrowDownIcon className="w-4 h-4 text-primary-600" />
    }

    return (
        <div className="space-y-6">
            {/* 필터 및 검색 영역 */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-3 w-full md:w-auto">
                    {/* 팀 필터 */}
                    <div className="relative">
                        <select
                            value={teamFilter}
                            onChange={(e) => setTeamFilter(e.target.value)}
                            className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm font-medium"
                        >
                            {teams.map(team => (
                                <option key={team} value={team}>{team}</option>
                            ))}
                        </select>
                        <FunnelIcon className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    {/* 직책 필터 */}
                    <div className="relative">
                        <select
                            value={positionFilter}
                            onChange={(e) => setPositionFilter(e.target.value)}
                            className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm font-medium"
                        >
                            {positions.map(position => (
                                <option key={position} value={position}>{position}</option>
                            ))}
                        </select>
                        <FunnelIcon className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    {/* 상태 필터 */}
                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm font-medium"
                        >
                            {statuses.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                        <FunnelIcon className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                </div>

                {/* 검색 */}
                <div className="relative w-full md:w-64">
                    <input
                        type="text"
                        placeholder="이름, 전화번호 검색"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                    />
                    <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
            </div>

            {/* 테이블 영역 */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('name')}>
                                    <div className="flex items-center gap-1">이름 <SortIcon columnKey="name" /></div>
                                </th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('position')}>
                                    <div className="flex items-center gap-1">직책 <SortIcon columnKey="position" /></div>
                                </th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('team')}>
                                    <div className="flex items-center gap-1">소속팀 <SortIcon columnKey="team" /></div>
                                </th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('status')}>
                                    <div className="flex items-center gap-1">상태 <SortIcon columnKey="status" /></div>
                                </th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('phone')}>
                                    <div className="flex items-center gap-1">전화번호 <SortIcon columnKey="phone" /></div>
                                </th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('university')}>
                                    <div className="flex items-center gap-1">학교 <SortIcon columnKey="university" /></div>
                                </th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('joinDate')}>
                                    <div className="flex items-center gap-1">입사일 <SortIcon columnKey="joinDate" /></div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredMembers.map((member) => (
                                <tr key={member.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden shrink-0 border border-gray-200">
                                                {member.image ? (
                                                    <img src={member.image} alt={member.name || ''} className="w-full h-full object-cover" />
                                                ) : (
                                                    <UserCircleIcon className="w-5 h-5 text-gray-400" />
                                                )}
                                            </div>
                                            <span className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors">{member.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                                            {member.position || '-'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600 font-medium">{member.team || '-'}</td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${member.status === '재직중' ? 'bg-green-50 text-green-700 border-green-200' :
                                                member.status === '군대' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                                    'bg-gray-50 text-gray-600 border-gray-200'
                                            }`}>
                                            {member.status || '-'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-gray-500 font-mono">{member.phone || '-'}</td>
                                    <td className="p-4 text-sm text-gray-600">{member.university || '-'}</td>
                                    <td className="p-4 text-sm text-gray-500 font-mono">{member.joinDate || '-'}</td>
                                </tr>
                            ))}
                            {filteredMembers.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="p-12 text-center text-gray-400">
                                        검색 결과가 없습니다.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="text-right text-xs text-gray-400 px-2">
                총 {filteredMembers.length}명의 멤버
            </div>
        </div>
    )
}
