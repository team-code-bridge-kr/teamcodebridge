'use client'

import { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon, CalendarIcon, ChevronLeftIcon, ChevronRightIcon, ClockIcon } from '@heroicons/react/24/outline'
import { useSession } from 'next-auth/react'
import { showAlert } from './CustomAlert'

interface CreatePollModalProps {
    isOpen: boolean
    onClose: () => void
    onPollCreated: () => void
}

export default function CreatePollModal({ isOpen, onClose, onPollCreated }: CreatePollModalProps) {
    const { data: session } = useSession()
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [voteDeadline, setVoteDeadline] = useState('')
    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set()) // YYYY-MM-DD 형식
    const [selectedTimes, setSelectedTimes] = useState<Map<string, Set<string>>>(new Map()) // 날짜별 시간대
    const [isLoading, setIsLoading] = useState(false)
    const [mode, setMode] = useState<'available' | 'unavailable'>('available') // 되는 날 / 안되는 날

    // 시간대 옵션
    const timeSlots = [
        '09:00', '10:00', '11:00', '12:00',
        '13:00', '14:00', '15:00', '16:00',
        '17:00', '18:00', '19:00', '20:00'
    ]

    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
    }

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
    }

    const navigateMonth = (direction: 'prev' | 'next') => {
        setCurrentDate(prev => {
            const newDate = new Date(prev)
            if (direction === 'prev') {
                newDate.setMonth(prev.getMonth() - 1)
            } else {
                newDate.setMonth(prev.getMonth() + 1)
            }
            return newDate
        })
    }

    const formatDateKey = (year: number, month: number, day: number) => {
        return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    }

    const toggleDate = (day: number) => {
        const dateKey = formatDateKey(year, month, day)
        setSelectedDates(prev => {
            const newSet = new Set(prev)
            if (newSet.has(dateKey)) {
                newSet.delete(dateKey)
                // 날짜 제거 시 해당 날짜의 시간대도 제거
                setSelectedTimes(prevTimes => {
                    const newMap = new Map(prevTimes)
                    newMap.delete(dateKey)
                    return newMap
                })
            } else {
                newSet.add(dateKey)
            }
            return newSet
        })
    }

    const toggleTime = (dateKey: string, time: string) => {
        setSelectedTimes(prev => {
            const newMap = new Map(prev)
            const times = newMap.get(dateKey) || new Set<string>()
            const newTimes = new Set(times)
            if (newTimes.has(time)) {
                newTimes.delete(time)
            } else {
                newTimes.add(time)
            }
            if (newTimes.size === 0) {
                newMap.delete(dateKey)
            } else {
                newMap.set(dateKey, newTimes)
            }
            return newMap
        })
    }

    const isDateSelected = (day: number) => {
        const dateKey = formatDateKey(year, month, day)
        return selectedDates.has(dateKey)
    }

    const isDatePast = (day: number) => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const checkDate = new Date(year, month, day)
        return checkDate < today
    }

    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
    const weekDays = ['일', '월', '화', '수', '목', '금', '토']
    const today = new Date()

    const isToday = (day: number) => {
        return day === today.getDate() && 
               month === today.getMonth() && 
               year === today.getFullYear()
    }

    // 선택된 날짜들을 옵션으로 변환
    const generateOptions = () => {
        const options: { startDate: string; endDate: string | null }[] = []
        
        selectedDates.forEach(dateKey => {
            const times = selectedTimes.get(dateKey) || new Set<string>()
            if (times.size === 0) {
                // 시간대가 선택되지 않았으면 하루 종일로 처리
                const [y, m, d] = dateKey.split('-').map(Number)
                const startDate = new Date(y, m - 1, d, 9, 0, 0)
                const endDate = new Date(y, m - 1, d, 18, 0, 0)
                options.push({
                    startDate: startDate.toISOString(),
                    endDate: endDate.toISOString()
                })
            } else {
                // 선택된 시간대별로 옵션 생성
                times.forEach(time => {
                    const [hours, minutes] = time.split(':').map(Number)
                    const [y, m, d] = dateKey.split('-').map(Number)
                    const startDate = new Date(y, m - 1, d, hours, minutes, 0)
                    const endDate = new Date(y, m - 1, d, hours + 1, minutes, 0) // 1시간 단위
                    options.push({
                        startDate: startDate.toISOString(),
                        endDate: endDate.toISOString()
                    })
                })
            }
        })
        
        return options
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            if (selectedDates.size === 0) {
                showAlert.warning('날짜 선택 필요', '최소 하나의 날짜를 선택해주세요.')
                setIsLoading(false)
                return
            }

            const options = generateOptions()
            
            const res = await fetch('/api/meeting-polls', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    description,
                    voteDeadline: voteDeadline ? new Date(voteDeadline).toISOString() : null,
                    options,
                }),
            })

            if (res.ok) {
                setTitle('')
                setDescription('')
                setVoteDeadline('')
                setSelectedDates(new Set())
                setSelectedTimes(new Map())
                setCurrentDate(new Date())
                onPollCreated()
                onClose()
            } else {
                const errorData = await res.json()
                showAlert.error('투표 생성 실패', `투표 생성 실패: ${errorData.error}`)
            }
        } catch (error) {
            console.error('Failed to create poll:', error)
            showAlert.error('오류 발생', '투표 생성 중 오류가 발생했습니다.')
        } finally {
            setIsLoading(false)
        }
    }

    // 다음 달의 첫날을 최소 마감일로 설정
    const getMinDeadline = () => {
        const nextMonth = new Date(year, month + 1, 1)
        return nextMonth.toISOString().split('T')[0]
    }

    const minDeadline = getMinDeadline()

    // 선택된 날짜 목록 (시간대 포함)
    const selectedDatesArray = Array.from(selectedDates).sort()

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
                            <Dialog.Panel className="relative transform overflow-hidden rounded-2xl bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:p-6">
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

                                            {/* 달력 섹션 */}
                                            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                                                <div className="mb-4">
                                                    <p className="text-sm font-bold text-gray-700 mb-3">
                                                        회의 가능한 날짜 선택 <span className="text-red-500">*</span>
                                                    </p>
                                                    <p className="text-xs text-gray-500 mb-3">
                                                        달력에서 날짜를 클릭하여 선택하세요. 선택한 날짜에서 시간대를 구체적으로 지정할 수 있습니다.
                                                    </p>
                                                </div>

                                                {/* 월 네비게이션 */}
                                                <div className="flex items-center justify-between mb-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => navigateMonth('prev')}
                                                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                                                    >
                                                        <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
                                                    </button>
                                                    <h3 className="text-lg font-black text-gray-900">
                                                        {year}년 {month + 1}월
                                                    </h3>
                                                    <button
                                                        type="button"
                                                        onClick={() => navigateMonth('next')}
                                                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                                                    >
                                                        <ChevronRightIcon className="w-5 h-5 text-gray-600" />
                                                    </button>
                                                </div>

                                                {/* 캘린더 그리드 */}
                                                <div className="grid grid-cols-7 gap-1 mb-4">
                                                    {weekDays.map(day => (
                                                        <div key={day} className="text-center text-xs font-bold text-gray-500 py-2">
                                                            {day}
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="grid grid-cols-7 gap-1">
                                                    {/* 빈 칸 (첫 주) */}
                                                    {Array.from({ length: firstDay }).map((_, i) => (
                                                        <div key={`empty-${i}`} className="aspect-square" />
                                                    ))}
                                                    
                                                    {/* 날짜 칸 */}
                                                    {days.map(day => {
                                                        const isSelected = isDateSelected(day)
                                                        const isPast = isDatePast(day)
                                                        const isTodayDate = isToday(day)
                                                        const dateKey = formatDateKey(year, month, day)
                                                        
                                                        return (
                                                            <button
                                                                key={day}
                                                                type="button"
                                                                onClick={() => !isPast && toggleDate(day)}
                                                                disabled={isPast}
                                                                className={`aspect-square border-2 rounded-lg transition-all ${
                                                                    isPast
                                                                        ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                                                                        : isSelected
                                                                        ? 'bg-primary-500 border-primary-600 text-white font-bold'
                                                                        : isTodayDate
                                                                        ? 'bg-primary-50 border-primary-300 text-primary-700 hover:bg-primary-100'
                                                                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-primary-300'
                                                                }`}
                                                            >
                                                                {day}
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                            </div>

                                            {/* 선택된 날짜의 시간대 선택 */}
                                            {selectedDatesArray.length > 0 && (
                                                <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                                                    <p className="text-sm font-bold text-gray-700 mb-3">
                                                        시간대 선택 (선택사항)
                                                    </p>
                                                    <p className="text-xs text-gray-500 mb-4">
                                                        각 날짜별로 구체적인 시간대를 선택할 수 있습니다. 선택하지 않으면 하루 종일로 처리됩니다.
                                                    </p>
                                                    <div className="space-y-4 max-h-64 overflow-y-auto">
                                                        {selectedDatesArray.map(dateKey => {
                                                            const [y, m, d] = dateKey.split('-').map(Number)
                                                            const date = new Date(y, m - 1, d)
                                                            const times = selectedTimes.get(dateKey) || new Set<string>()
                                                            
                                                            return (
                                                                <div key={dateKey} className="border border-gray-200 rounded-lg p-3 bg-white">
                                                                    <div className="flex items-center justify-between mb-2">
                                                                        <p className="text-sm font-bold text-gray-900">
                                                                            {date.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })}
                                                                        </p>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                setSelectedDates(prev => {
                                                                                    const newSet = new Set(prev)
                                                                                    newSet.delete(dateKey)
                                                                                    return newSet
                                                                                })
                                                                                setSelectedTimes(prev => {
                                                                                    const newMap = new Map(prev)
                                                                                    newMap.delete(dateKey)
                                                                                    return newMap
                                                                                })
                                                                            }}
                                                                            className="text-xs text-red-500 hover:text-red-700"
                                                                        >
                                                                            제거
                                                                        </button>
                                                                    </div>
                                                                    <div className="grid grid-cols-6 gap-2">
                                                                        {timeSlots.map(time => {
                                                                            const isSelected = times.has(time)
                                                                            return (
                                                                                <button
                                                                                    key={time}
                                                                                    type="button"
                                                                                    onClick={() => toggleTime(dateKey, time)}
                                                                                    className={`px-2 py-1.5 text-xs font-bold rounded-lg border-2 transition-all ${
                                                                                        isSelected
                                                                                            ? 'bg-primary-500 border-primary-600 text-white'
                                                                                            : 'bg-white border-gray-200 text-gray-700 hover:border-primary-300'
                                                                                    }`}
                                                                                >
                                                                                    {time}
                                                                                </button>
                                                                            )
                                                                        })}
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            )}

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
                                                <p className="mt-2 text-xs text-gray-500">
                                                    최소 마감일: {new Date(minDeadline).toLocaleDateString('ko-KR')} (다음 달 1일 이후)
                                                </p>
                                            </div>

                                            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                                <button
                                                    type="submit"
                                                    disabled={isLoading || !title.trim() || selectedDates.size === 0 || !voteDeadline}
                                                    className="inline-flex w-full justify-center rounded-xl bg-primary-600 px-3 py-2 text-sm font-bold text-white shadow-sm hover:bg-primary-500 sm:ml-3 sm:w-auto disabled:bg-gray-300 disabled:cursor-not-allowed"
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
