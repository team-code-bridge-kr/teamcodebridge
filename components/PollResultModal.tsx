'use client'

import { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon, CheckCircleIcon, UserGroupIcon, ChartBarIcon } from '@heroicons/react/24/outline'
import { useSession } from 'next-auth/react'

interface PollVote {
    id: string
    user: {
        id: string
        name: string | null
        email: string | null
        image: string | null
    }
}

interface PollOption {
    id: string
    startDate: string
    endDate: string | null
    votes: PollVote[]
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

interface PollResultModalProps {
    isOpen: boolean
    onClose: () => void
    pollId: string | null
    onPollUpdated?: () => void
}

export default function PollResultModal({ isOpen, onClose, pollId, onPollUpdated }: PollResultModalProps) {
    const { data: session } = useSession()
    const userId = (session?.user as any)?.id
    const userRole = (session?.user as any)?.role
    const [poll, setPoll] = useState<MeetingPoll | null>(null)
    const [loading, setLoading] = useState(false)
    const [finalizing, setFinalizing] = useState(false)

    useEffect(() => {
        if (isOpen && pollId) {
            fetchPollDetails()
        }
    }, [isOpen, pollId])

    const fetchPollDetails = async () => {
        if (!pollId) return
        setLoading(true)
        try {
            const res = await fetch(`/api/meeting-polls/${pollId}`)
            if (res.ok) {
                const data = await res.json()
                setPoll(data)
            }
        } catch (error) {
            console.error('Error fetching poll details:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleFinalize = async (optionId: string) => {
        if (!pollId) return
        setFinalizing(true)
        try {
            const res = await fetch(`/api/meeting-polls/${pollId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    selectedOptionId: optionId,
                    status: '완료'
                }),
            })

            if (res.ok) {
                await fetchPollDetails()
                onPollUpdated?.()
            } else {
                alert('일정 확정에 실패했습니다.')
            }
        } catch (error) {
            console.error('Error finalizing poll:', error)
            alert('일정 확정 중 오류가 발생했습니다.')
        } finally {
            setFinalizing(false)
        }
    }

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString)
        return {
            date: date.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' }),
            time: date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false }),
        }
    }

    if (!poll) {
        return null
    }

    const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes.length, 0)
    const maxVotes = Math.max(...poll.options.map(opt => opt.votes.length), 0)
    const isCreator = poll.createdBy.id === userId
    const canFinalize = (isCreator || userRole === 'ADMIN') && poll.status === '진행중'

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
                            <Dialog.Panel className="relative transform overflow-hidden rounded-2xl bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:p-6">
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

                                {loading ? (
                                    <div className="flex justify-center py-12">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                                    </div>
                                ) : (
                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                                            <Dialog.Title as="h3" className="text-xl font-bold leading-6 text-gray-900 mb-2">
                                                {poll.title}
                                            </Dialog.Title>
                                            {poll.description && (
                                                <p className="text-sm text-gray-500 mb-6">{poll.description}</p>
                                            )}

                                            {/* 투표 결과 요약 */}
                                            <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <ChartBarIcon className="w-5 h-5 text-primary-600" />
                                                        <span className="text-sm font-bold text-gray-700">투표 결과</span>
                                                    </div>
                                                    <span className="text-xs text-gray-500">
                                                        총 {totalVotes}표
                                                    </span>
                                                </div>
                                                {poll.status === '완료' && poll.selectedOptionId && (
                                                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                                                        <div className="flex items-center gap-2">
                                                            <CheckCircleIcon className="w-5 h-5 text-green-600" />
                                                            <span className="text-sm font-bold text-green-800">
                                                                최종 확정된 일정이 있습니다
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* 옵션별 투표 결과 */}
                                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                                {poll.options
                                                    .sort((a, b) => b.votes.length - a.votes.length)
                                                    .map(option => {
                                                        const { date, time } = formatDateTime(option.startDate)
                                                        const voteCount = option.votes.length
                                                        const votePercentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0
                                                        const isSelected = poll.selectedOptionId === option.id
                                                        const barWidth = maxVotes > 0 ? (voteCount / maxVotes) * 100 : 0

                                                        return (
                                                            <div
                                                                key={option.id}
                                                                className={`p-4 border-2 rounded-xl ${
                                                                    isSelected
                                                                        ? 'border-green-500 bg-green-50'
                                                                        : 'border-gray-200 bg-white'
                                                                }`}
                                                            >
                                                                <div className="flex items-start justify-between mb-3">
                                                                    <div className="flex-1">
                                                                        <div className="flex items-center gap-2 mb-1">
                                                                            <div className="text-sm font-bold text-gray-900">
                                                                                {date} {time}
                                                                            </div>
                                                                            {isSelected && (
                                                                                <span className="px-2 py-0.5 bg-green-500 text-white text-[10px] font-black rounded">
                                                                                    확정
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <div className="flex items-center gap-3 mt-2">
                                                                            <div className="flex items-center gap-1">
                                                                                <UserGroupIcon className="w-4 h-4 text-gray-500" />
                                                                                <span className="text-sm font-bold text-gray-700">
                                                                                    {voteCount}표
                                                                                </span>
                                                                            </div>
                                                                            <span className="text-xs text-gray-500">
                                                                                {votePercentage.toFixed(1)}%
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    {canFinalize && !isSelected && (
                                                                        <button
                                                                            onClick={() => handleFinalize(option.id)}
                                                                            disabled={finalizing}
                                                                            className="px-3 py-1.5 text-xs font-bold text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors disabled:bg-gray-300"
                                                                        >
                                                                            {finalizing ? '확정 중...' : '이 일정 확정'}
                                                                        </button>
                                                                    )}
                                                                </div>

                                                                {/* 투표율 바 */}
                                                                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                                                                    <div
                                                                        className={`h-2 rounded-full transition-all ${
                                                                            isSelected ? 'bg-green-500' : 'bg-primary-500'
                                                                        }`}
                                                                        style={{ width: `${barWidth}%` }}
                                                                    />
                                                                </div>

                                                                {/* 투표자 목록 */}
                                                                {option.votes.length > 0 && (
                                                                    <div className="mt-3 pt-3 border-t border-gray-200">
                                                                        <p className="text-xs font-bold text-gray-500 mb-2">투표자 ({voteCount}명)</p>
                                                                        <div className="flex flex-wrap gap-2">
                                                                            {option.votes.map(vote => (
                                                                                <div
                                                                                    key={vote.id}
                                                                                    className="flex items-center gap-2 px-2 py-1 bg-gray-50 rounded-lg"
                                                                                >
                                                                                    {vote.user.image ? (
                                                                                        <img
                                                                                            src={vote.user.image}
                                                                                            alt={vote.user.name || ''}
                                                                                            className="w-6 h-6 rounded-full"
                                                                                        />
                                                                                    ) : (
                                                                                        <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center">
                                                                                            <span className="text-xs font-bold text-primary-600">
                                                                                                {vote.user.name?.[0] || vote.user.email?.[0] || '?'}
                                                                                            </span>
                                                                                        </div>
                                                                                    )}
                                                                                    <span className="text-xs font-bold text-gray-700">
                                                                                        {vote.user.name || vote.user.email}
                                                                                    </span>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )
                                                    })}
                                            </div>

                                            <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
                                                <span>작성자: {poll.createdBy.name || poll.createdBy.email}</span>
                                                <span>
                                                    {new Date(poll.createdAt).toLocaleDateString('ko-KR', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}

