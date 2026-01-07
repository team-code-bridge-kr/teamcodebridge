'use client'

import { useState, useEffect } from 'react'
import { ClockIcon, PlusIcon, CheckCircleIcon, XCircleIcon, EyeIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import CreatePollModal from './CreatePollModal'
import PollResultModal from './PollResultModal'

interface PollOption {
    id: string
    startDate: string
    endDate: string | null
    voteCount: number  // API에서 voteCount만 반환
}

interface MeetingPoll {
    id: string
    title: string
    description: string | null
    status: string
    selectedOptionId: string | null
    createdBy: {
        id: string
        name: string | null
        email: string | null
    }
    options: PollOption[]
    createdAt: string
}

export default function MeetingPollWidget() {
    const { data: session } = useSession()
    // session.user.id는 Prisma User.id와 일치 (jwt callback에서 설정됨)
    const userId = (session?.user as any)?.id
    const [polls, setPolls] = useState<MeetingPoll[]>([])
    const [loading, setLoading] = useState(true)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showResultModal, setShowResultModal] = useState(false)
    const [selectedPollId, setSelectedPollId] = useState<string | null>(null)

    useEffect(() => {
        fetchPolls()
    }, [])

    const fetchPolls = async () => {
        try {
            const res = await fetch('/api/meeting-polls')
            if (res.ok) {
                const data = await res.json()
                const filteredPolls = data.filter((poll: MeetingPoll) => poll.status === '진행중').slice(0, 3)
                setPolls(filteredPolls)
                
                // 사용자 투표 상태 업데이트
                if (userId && filteredPolls.length > 0) {
                    const votesMap = new Map<string, Set<string>>()
                    await Promise.all(
                        filteredPolls.map(async (poll: MeetingPoll) => {
                            const optionIds = await fetchUserVotesForPoll(poll.id, poll.options)
                            if (optionIds.size > 0) {
                                votesMap.set(poll.id, optionIds)
                            }
                        })
                    )
                    setUserVotes(votesMap)
                }
            }
        } catch (error) {
            console.error('Error fetching polls:', error)
        } finally {
            setLoading(false)
        }
    }

    // 사용자가 특정 옵션에 투표했는지 확인 (로컬 상태로 관리)
    const [userVotes, setUserVotes] = useState<Map<string, Set<string>>>(new Map()) // pollId -> optionIds

    // 투표 후 전체 데이터를 다시 가져와서 사용자 투표 상태 확인
    const fetchUserVotesForPoll = async (pollId: string, pollOptions: PollOption[]) => {
        if (!userId) return new Set<string>()
        
        try {
            const optionIds = new Set<string>()
            await Promise.all(
                pollOptions.map(async (option) => {
                    try {
                        const res = await fetch(`/api/meeting-polls/${pollId}/vote/check?optionId=${option.id}`)
                        if (res.ok) {
                            const data = await res.json()
                            if (data.voted) {
                                optionIds.add(option.id)
                            }
                        }
                    } catch (error) {
                        console.error('Error checking vote:', error)
                    }
                })
            )
            return optionIds
        } catch (error) {
            console.error('Error fetching user votes:', error)
            return new Set<string>()
        }
    }

    const handleVote = async (pollId: string, optionId: string, isVoted: boolean) => {
        try {
            const res = await fetch(`/api/meeting-polls/${pollId}/vote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    optionId,
                    action: isVoted ? 'remove' : 'add'
                }),
            })

            if (res.ok) {
                // 전체 데이터 다시 가져오기 (fetchPolls에서 자동으로 사용자 투표 상태 업데이트)
                await fetchPolls()
            }
        } catch (error) {
            console.error('Error voting:', error)
        }
    }

    const hasUserVotedForOption = (pollId: string, optionId: string) => {
        const optionIds = userVotes.get(pollId)
        return optionIds ? optionIds.has(optionId) : false
    }


    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString)
        return {
            date: date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', weekday: 'short' }),
            time: date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false }),
        }
    }

    if (loading) {
        return (
            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <ClockIcon className="w-6 h-6 text-primary-600" />
                    <h2 className="text-xl font-black text-black">회의 일정 투표</h2>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-primary-600 text-white text-sm font-bold rounded-lg hover:bg-primary-700 transition-colors"
                >
                    <PlusIcon className="w-4 h-4" />
                    새 투표
                </button>
            </div>

            {polls.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                    <ClockIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="font-bold">진행 중인 투표가 없습니다</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {polls.map(poll => {
                        const userVotedOptions = userVotes.get(poll.id) || new Set<string>()
                        const hasAnyVote = userVotedOptions.size > 0

                        return (
                            <div key={poll.id} className="p-4 border border-gray-200 rounded-xl hover:border-primary-200 hover:shadow-md transition-all">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <h3 className="font-black text-black text-base mb-1">{poll.title}</h3>
                                        {poll.description && (
                                            <p className="text-sm text-gray-600">{poll.description}</p>
                                        )}
                                    </div>
                                    {hasAnyVote && (
                                        <CheckCircleIcon className="w-5 h-5 text-green-500 shrink-0" />
                                    )}
                                </div>

                                {/* 날짜별로 그룹화 */}
                                {(() => {
                                    // 날짜별로 옵션 그룹화
                                    const groupedByDate = new Map<string, typeof poll.options>()
                                    poll.options.forEach(option => {
                                        const date = new Date(option.startDate)
                                        const dateKey = date.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })
                                        if (!groupedByDate.has(dateKey)) {
                                            groupedByDate.set(dateKey, [])
                                        }
                                        groupedByDate.get(dateKey)!.push(option)
                                    })

                                    return (
                                        <div className="space-y-4 mb-3">
                                            {Array.from(groupedByDate.entries()).map(([dateKey, options]) => (
                                                <div key={dateKey} className="border border-gray-200 rounded-xl p-3 bg-gray-50">
                                                    <div className="text-xs font-bold text-gray-500 mb-2 px-1">{dateKey}</div>
                                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                                        {options.map(option => {
                                                            const { time } = formatDateTime(option.startDate)
                                                            const voteCount = option.voteCount || 0
                                                            const isUserVote = hasUserVotedForOption(poll.id, option.id)
                                                            const isSelected = poll.selectedOptionId === option.id

                                                            return (
                                                                <button
                                                                    key={option.id}
                                                                    onClick={() => handleVote(poll.id, option.id, isUserVote)}
                                                                    className={`p-2 rounded-lg border-2 transition-all text-center ${
                                                                        isSelected
                                                                            ? 'border-green-500 bg-green-50'
                                                                            : isUserVote
                                                                            ? 'border-primary-500 bg-primary-50'
                                                                            : 'border-gray-200 bg-white hover:border-primary-300 hover:bg-primary-50'
                                                                    }`}
                                                                >
                                                                    <div className="text-xs font-bold text-gray-900 mb-1">{time}</div>
                                                                    <div className="flex items-center justify-center gap-1">
                                                                        {isSelected && (
                                                                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                                                        )}
                                                                        <span className="text-[10px] font-bold text-gray-600">
                                                                            {voteCount}표
                                                                        </span>
                                                                        {isUserVote && !isSelected && (
                                                                            <CheckCircleIcon className="w-3 h-3 text-primary-600" />
                                                                        )}
                                                                    </div>
                                                                </button>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )
                                })()}

                                <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                                    <span>총 {poll.options.reduce((sum, opt) => sum + (opt.voteCount || 0), 0)}표</span>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => {
                                                setSelectedPollId(poll.id)
                                                setShowResultModal(true)
                                            }}
                                            className="flex items-center gap-1 px-2 py-1 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded transition-colors"
                                        >
                                            <EyeIcon className="w-4 h-4" />
                                            <span className="font-bold">결과 보기</span>
                                        </button>
                                        <span>작성자: {poll.createdBy.name || poll.createdBy.email}</span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* 투표 생성 모달 */}
            <CreatePollModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onPollCreated={fetchPolls}
            />

            {/* 투표 결과 모달 */}
            <PollResultModal
                isOpen={showResultModal}
                onClose={() => {
                    setShowResultModal(false)
                    setSelectedPollId(null)
                }}
                pollId={selectedPollId}
                onPollUpdated={fetchPolls}
            />
        </div>
    )
}

