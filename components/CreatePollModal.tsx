'use client'

import { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon, CalendarIcon, UserGroupIcon } from '@heroicons/react/24/outline'
import { useSession } from 'next-auth/react'

interface CreatePollModalProps {
    isOpen: boolean
    onClose: () => void
    onPollCreated: () => void
}

interface User {
    id: string
    name: string | null
    email: string | null
    image: string | null
    team: string | null
    position: string | null
}

export default function CreatePollModal({ isOpen, onClose, onPollCreated }: CreatePollModalProps) {
    const { data: session } = useSession()
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [selectedWeek, setSelectedWeek] = useState('')
    const [voteDeadline, setVoteDeadline] = useState('')
    const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([])
    const [members, setMembers] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [loadingMembers, setLoadingMembers] = useState(false)

    // 멤버 목록 불러오기
    useEffect(() => {
        if (isOpen) {
            fetchMembers()
        }
    }, [isOpen])

    const fetchMembers = async () => {
        setLoadingMembers(true)
        try {
            const res = await fetch('/api/members')
            if (res.ok) {
                const data = await res.json()
                // 현재 사용자 제외
                const filtered = data.filter((u: User) => u.id !== (session?.user as any)?.id)
                setMembers(filtered)
            }
        } catch (error) {
            console.error('Failed to fetch members:', error)
        } finally {
            setLoadingMembers(false)
        }
    }

    // 주 선택 시 해당 주의 날짜 옵션 생성
    const generateWeekOptions = (weekStartDate: string): string[] => {
        const start = new Date(weekStartDate)
        const options: string[] = []
        
        // 선택한 날짜가 속한 주의 월요일 찾기
        const monday = new Date(start)
        const dayOfWeek = monday.getDay() // 0(일) ~ 6(토)
        const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1 // 일요일이면 6일 전, 아니면 dayOfWeek - 1일 전
        monday.setDate(start.getDate() - daysToMonday)
        monday.setHours(0, 0, 0, 0)
        
        // 해당 주의 월요일부터 금요일까지 (5일)
        for (let i = 0; i < 5; i++) {
            const date = new Date(monday)
            date.setDate(monday.getDate() + i)
            // 각 날짜에 오전 10시, 오후 2시, 오후 4시 옵션 생성
            const times = ['10:00', '14:00', '16:00']
            times.forEach(time => {
                const [hours, minutes] = time.split(':')
                const dateTime = new Date(date)
                dateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0)
                options.push(dateTime.toISOString())
            })
        }
        
        return options
    }

    // 최소 투표 마감일 계산 (선택한 주의 시작일로부터 최소 3주 후)
    const calculateMinDeadline = (weekStartDate: string): string => {
        const start = new Date(weekStartDate)
        const monday = new Date(start)
        const dayOfWeek = monday.getDay()
        const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
        monday.setDate(start.getDate() - daysToMonday)
        monday.setHours(0, 0, 0, 0)
        
        // 최소 3주 후 (21일 후) - 예: 1월 6일 주면 최소 1월 27일 이후
        const minDeadline = new Date(monday)
        minDeadline.setDate(monday.getDate() + 21)
        
        return minDeadline.toISOString().split('T')[0]
    }

    // 주 선택 시 최소 마감일 자동 설정
    useEffect(() => {
        if (selectedWeek) {
            const minDeadline = calculateMinDeadline(selectedWeek)
            if (!voteDeadline || voteDeadline < minDeadline) {
                setVoteDeadline(minDeadline)
            }
        }
    }, [selectedWeek])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            if (!selectedWeek) {
                alert('회의를 진행할 주를 선택해주세요.')
                setIsLoading(false)
                return
            }

            // 주 선택 시 해당 주의 날짜 옵션 자동 생성
            const weekOptions = generateWeekOptions(selectedWeek)
            
            const res = await fetch('/api/meeting-polls', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    description,
                    voteDeadline: voteDeadline ? new Date(voteDeadline).toISOString() : null,
                    options: weekOptions.map(opt => ({
                        startDate: opt,
                        endDate: null
                    })),
                }),
            })

            if (res.ok) {
                setTitle('')
                setDescription('')
                setSelectedWeek('')
                setVoteDeadline('')
                setSelectedMemberIds([])
                onPollCreated()
                onClose()
            } else {
                const errorData = await res.json()
                alert(`투표 생성 실패: ${errorData.error}`)
            }
        } catch (error) {
            console.error('Failed to create poll:', error)
            alert('투표 생성 중 오류가 발생했습니다.')
        } finally {
            setIsLoading(false)
        }
    }

    // 주의 시작일 계산 (다음 주 월요일부터)
    const getNextWeeks = (): { label: string; value: string }[] => {
        const weeks: { label: string; value: string }[] = []
        const today = new Date()
        
        // 다음 주 월요일 찾기
        const nextMonday = new Date(today)
        const daysUntilMonday = (1 - today.getDay() + 7) % 7 || 7
        nextMonday.setDate(today.getDate() + daysUntilMonday)
        
        // 8주치 생성
        for (let i = 0; i < 8; i++) {
            const weekStart = new Date(nextMonday)
            weekStart.setDate(nextMonday.getDate() + (i * 7))
            
            const weekEnd = new Date(weekStart)
            weekEnd.setDate(weekStart.getDate() + 4) // 금요일까지
            
            const label = `${weekStart.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })} ~ ${weekEnd.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}`
            weeks.push({
                label,
                value: weekStart.toISOString().split('T')[0]
            })
        }
        
        return weeks
    }

    const weeks = getNextWeeks()
    const minDeadline = selectedWeek ? calculateMinDeadline(selectedWeek) : ''

    return (
        <Transition.Root show={isOpen} as={Fragment}>
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
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-2xl bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
                                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                                    <button
                                        type="button"
                                        className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                                        onClick={onClose}
                                    >
                                        <span className="sr-only">Close</span>
                                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                    </button>
                                </div>
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <CalendarIcon className="h-6 w-6 text-primary-600" aria-hidden="true" />
                                    </div>
                                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                                        <Dialog.Title as="h3" className="text-xl font-bold leading-6 text-gray-900">
                                            새 회의 투표 만들기
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500 mb-6">
                                                회의 일정을 제안하고 팀원들의 투표를 받아보세요.
                                            </p>
                                        </div>
                                        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                                            {/* 회의 제목 */}
                                            <div>
                                                <label htmlFor="title" className="block text-sm font-bold text-gray-700 mb-2">
                                                    회의 제목 <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    id="title"
                                                    name="title"
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                    placeholder="예: 정기 팀 회의"
                                                    value={title}
                                                    onChange={(e) => setTitle(e.target.value)}
                                                    required
                                                />
                                            </div>

                                            {/* 회의 안건 */}
                                            <div>
                                                <label htmlFor="description" className="block text-sm font-bold text-gray-700 mb-2">
                                                    회의 안건
                                                </label>
                                                <textarea
                                                    id="description"
                                                    name="description"
                                                    rows={3}
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                                                    placeholder="회의에서 다룰 주요 안건을 입력하세요"
                                                    value={description}
                                                    onChange={(e) => setDescription(e.target.value)}
                                                />
                                            </div>

                                            {/* 회의를 진행할 주 선택 */}
                                            <div>
                                                <label htmlFor="week" className="block text-sm font-bold text-gray-700 mb-2">
                                                    회의를 진행할 주 선택 <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    id="week"
                                                    name="week"
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                    value={selectedWeek}
                                                    onChange={(e) => setSelectedWeek(e.target.value)}
                                                    required
                                                >
                                                    <option value="">주를 선택하세요</option>
                                                    {weeks.map((week) => (
                                                        <option key={week.value} value={week.value}>
                                                            {week.label}
                                                        </option>
                                                    ))}
                                                </select>
                                                {selectedWeek && (
                                                    <p className="mt-2 text-xs text-gray-500">
                                                        선택한 주의 월~금요일, 오전 10시/오후 2시/오후 4시 옵션이 자동으로 생성됩니다.
                                                    </p>
                                                )}
                                            </div>

                                            {/* 투표 마감일 */}
                                            <div>
                                                <label htmlFor="voteDeadline" className="block text-sm font-bold text-gray-700 mb-2">
                                                    투표 마감일 <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="date"
                                                    id="voteDeadline"
                                                    name="voteDeadline"
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                    value={voteDeadline}
                                                    onChange={(e) => setVoteDeadline(e.target.value)}
                                                    min={minDeadline}
                                                    required
                                                />
                                                {minDeadline && (
                                                    <p className="mt-2 text-xs text-gray-500">
                                                        최소 마감일: {new Date(minDeadline).toLocaleDateString('ko-KR')} (선택한 주 시작일로부터 최소 3주 후)
                                                    </p>
                                                )}
                                            </div>

                                            {/* 참여인원 선택 */}
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                                    참여인원 (선택사항)
                                                </label>
                                                <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-xl bg-gray-50 p-3">
                                                    {loadingMembers ? (
                                                        <div className="text-center py-4 text-gray-400 text-sm">로딩 중...</div>
                                                    ) : members.length === 0 ? (
                                                        <div className="text-center py-4 text-gray-400 text-sm">선택할 수 있는 멤버가 없습니다.</div>
                                                    ) : (
                                                        <div className="space-y-2">
                                                            {members.map(member => {
                                                                const isSelected = selectedMemberIds.includes(member.id)
                                                                return (
                                                                    <label
                                                                        key={member.id}
                                                                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                                                                            isSelected
                                                                                ? 'bg-primary-50 border-2 border-primary-500'
                                                                                : 'bg-white border-2 border-transparent hover:bg-gray-50'
                                                                        }`}
                                                                    >
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={isSelected}
                                                                            onChange={(e) => {
                                                                                if (e.target.checked) {
                                                                                    setSelectedMemberIds([...selectedMemberIds, member.id])
                                                                                } else {
                                                                                    setSelectedMemberIds(selectedMemberIds.filter(id => id !== member.id))
                                                                                }
                                                                            }}
                                                                            className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                                                                        />
                                                                        <div className="flex-1 min-w-0">
                                                                            <p className="font-bold text-gray-900 text-sm truncate">{member.name || member.email}</p>
                                                                            <p className="text-xs text-gray-500 truncate">{member.team || '소속팀 미정'} {member.position ? `· ${member.position}` : ''}</p>
                                                                        </div>
                                                                    </label>
                                                                )
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="mt-2 text-xs text-gray-500">
                                                    선택하지 않으면 모든 멤버가 투표할 수 있습니다.
                                                </p>
                                            </div>

                                            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                                <button
                                                    type="submit"
                                                    disabled={isLoading}
                                                    className="inline-flex w-full justify-center rounded-xl bg-primary-600 px-3 py-2 text-sm font-bold text-white shadow-sm hover:bg-primary-500 sm:ml-3 sm:w-auto disabled:bg-gray-300"
                                                >
                                                    {isLoading ? '생성 중...' : '투표 만들기'}
                                                </button>
                                                <button
                                                    type="button"
                                                    className="mt-3 inline-flex w-full justify-center rounded-xl bg-white px-3 py-2 text-sm font-bold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                                    onClick={onClose}
                                                >
                                                    취소
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}
