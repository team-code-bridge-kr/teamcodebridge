'use client'

import { useState, useEffect } from 'react'
import { ClockIcon, PlusIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'

interface PollOption {
    id: string
    startDate: string
    endDate: string | null
    votes: PollVote[]
}

interface PollVote {
    id: string
    user: {
        id: string
        name: string | null
        email: string | null
        image: string | null
    }
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

    useEffect(() => {
        fetchPolls()
    }, [])

    const fetchPolls = async () => {
        try {
            const res = await fetch('/api/meeting-polls')
            if (res.ok) {
                const data = await res.json()
                setPolls(data.filter((poll: MeetingPoll) => poll.status === '진행중').slice(0, 3))
            }
        } catch (error) {
            console.error('Error fetching polls:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleVote = async (pollId: string, optionId: string) => {
        try {
            const res = await fetch(`/api/meeting-polls/${pollId}/vote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ optionId }),
            })

            if (res.ok) {
                await fetchPolls()
            }
        } catch (error) {
            console.error('Error voting:', error)
        }
    }

    const hasUserVoted = (poll: MeetingPoll) => {
        if (!userId) return false
        return poll.options.some(option => 
            option.votes.some(vote => vote.user.id === userId)
        )
    }

    const getUserVote = (poll: MeetingPoll) => {
        if (!userId) return null
        for (const option of poll.options) {
            const vote = option.votes.find(v => v.user.id === userId)
            if (vote) return option.id
        }
        return null
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
                        const userVoted = hasUserVoted(poll)
                        const userVoteOptionId = getUserVote(poll)
                        const totalVoters = new Set(poll.options.flatMap(opt => opt.votes.map(v => v.user.id))).size

                        return (
                            <div key={poll.id} className="p-4 border border-gray-200 rounded-xl hover:border-primary-200 hover:shadow-md transition-all">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <h3 className="font-black text-black text-base mb-1">{poll.title}</h3>
                                        {poll.description && (
                                            <p className="text-sm text-gray-600">{poll.description}</p>
                                        )}
                                    </div>
                                    {userVoted && (
                                        <CheckCircleIcon className="w-5 h-5 text-green-500 shrink-0" />
                                    )}
                                </div>

                                <div className="space-y-2 mb-3">
                                    {poll.options.map(option => {
                                        const { date, time } = formatDateTime(option.startDate)
                                        const voteCount = option.votes.length
                                        const isUserVote = userVoteOptionId === option.id
                                        const isSelected = poll.selectedOptionId === option.id

                                        return (
                                            <button
                                                key={option.id}
                                                onClick={() => !userVoted && handleVote(poll.id, option.id)}
                                                disabled={userVoted}
                                                className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                                                    isSelected
                                                        ? 'border-green-500 bg-green-50'
                                                        : isUserVote
                                                        ? 'border-primary-500 bg-primary-50'
                                                        : userVoted
                                                        ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                                                        : 'border-gray-200 bg-white hover:border-primary-300 hover:bg-primary-50'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <div className="text-sm font-bold text-gray-900">{date}</div>
                                                        <div className="text-xs text-gray-600">{time}</div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {isSelected && (
                                                            <span className="px-2 py-0.5 bg-green-500 text-white text-[10px] font-black rounded">
                                                                확정
                                                            </span>
                                                        )}
                                                        <span className="text-sm font-bold text-gray-600">
                                                            {voteCount}표
                                                        </span>
                                                        {isUserVote && (
                                                            <CheckCircleIcon className="w-4 h-4 text-primary-600" />
                                                        )}
                                                    </div>
                                                </div>
                                            </button>
                                        )
                                    })}
                                </div>

                                <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                                    <span>투표자: {totalVoters}명</span>
                                    <span>작성자: {poll.createdBy.name || poll.createdBy.email}</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* 투표 생성 모달은 나중에 구현 */}
        </div>
    )
}

