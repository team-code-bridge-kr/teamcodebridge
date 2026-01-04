'use client'

import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon, CalendarIcon } from '@heroicons/react/24/outline'

interface CreateEventModalProps {
    isOpen: boolean
    onClose: () => void
    onEventCreated: () => void
}

const colorOptions = [
    { value: '#3B82F6', label: '기본', class: 'bg-blue-500' },
    { value: '#EF4444', label: '중요', class: 'bg-red-500' },
    { value: '#F59E0B', label: '주의', class: 'bg-yellow-500' },
    { value: '#10B981', label: '일반', class: 'bg-green-500' },
    { value: '#8B5CF6', label: '기타', class: 'bg-purple-500' },
]

export default function CreateEventModal({ isOpen, onClose, onEventCreated }: CreateEventModalProps) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [startDate, setStartDate] = useState('')
    const [startTime, setStartTime] = useState('')
    const [endDate, setEndDate] = useState('')
    const [endTime, setEndTime] = useState('')
    const [location, setLocation] = useState('')
    const [type, setType] = useState('회의')
    const [color, setColor] = useState('#3B82F6')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const startDateTime = startDate && startTime ? `${startDate}T${startTime}:00` : startDate || new Date().toISOString()
            const endDateTime = endDate && endTime ? `${endDate}T${endTime}:00` : endDate || null

            const res = await fetch('/api/calendar/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    description,
                    startDate: startDateTime,
                    endDate: endDateTime,
                    location,
                    type,
                    color,
                }),
            })

            if (res.ok) {
                setTitle('')
                setDescription('')
                setStartDate('')
                setStartTime('')
                setEndDate('')
                setEndTime('')
                setLocation('')
                setType('회의')
                setColor('#3B82F6')
                onEventCreated()
                onClose()
            } else {
                const errorData = await res.json()
                alert(`이벤트 생성 실패: ${errorData.error}`)
            }
        } catch (error) {
            console.error('Failed to create event:', error)
            alert('이벤트 생성 중 오류가 발생했습니다.')
        } finally {
            setIsLoading(false)
        }
    }

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
                            <Dialog.Panel className="relative transform overflow-hidden rounded-2xl bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
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
                                            일정 추가
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500 mb-6">
                                                새로운 일정을 추가합니다.
                                            </p>
                                        </div>
                                        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                                            <div>
                                                <label htmlFor="title" className="block text-sm font-bold text-gray-700 mb-2">
                                                    제목
                                                </label>
                                                <input
                                                    type="text"
                                                    id="title"
                                                    name="title"
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                    placeholder="예: 정기 회의"
                                                    value={title}
                                                    onChange={(e) => setTitle(e.target.value)}
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="type" className="block text-sm font-bold text-gray-700 mb-2">
                                                    유형
                                                </label>
                                                <select
                                                    id="type"
                                                    name="type"
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                    value={type}
                                                    onChange={(e) => setType(e.target.value)}
                                                >
                                                    <option value="회의">회의</option>
                                                    <option value="일정">일정</option>
                                                    <option value="이벤트">이벤트</option>
                                                    <option value="기타">기타</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label htmlFor="startDateTime" className="block text-sm font-bold text-gray-700 mb-2">
                                                    시작 일시
                                                </label>
                                                <input
                                                    type="datetime-local"
                                                    id="startDateTime"
                                                    name="startDateTime"
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                    value={startDate && startTime ? `${startDate}T${startTime}` : startDate || ''}
                                                    onChange={(e) => {
                                                        const value = e.target.value
                                                        if (value) {
                                                            const [date, time] = value.split('T')
                                                            setStartDate(date)
                                                            setStartTime(time || '')
                                                        } else {
                                                            setStartDate('')
                                                            setStartTime('')
                                                        }
                                                    }}
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="endDateTime" className="block text-sm font-bold text-gray-700 mb-2">
                                                    종료 일시 (선택)
                                                </label>
                                                <input
                                                    type="datetime-local"
                                                    id="endDateTime"
                                                    name="endDateTime"
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                    value={endDate && endTime ? `${endDate}T${endTime}` : endDate || ''}
                                                    onChange={(e) => {
                                                        const value = e.target.value
                                                        if (value) {
                                                            const [date, time] = value.split('T')
                                                            setEndDate(date)
                                                            setEndTime(time || '')
                                                        } else {
                                                            setEndDate('')
                                                            setEndTime('')
                                                        }
                                                    }}
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="location" className="block text-sm font-bold text-gray-700 mb-2">
                                                    장소 (선택)
                                                </label>
                                                <input
                                                    type="text"
                                                    id="location"
                                                    name="location"
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                    placeholder="예: 온라인, 회의실 A"
                                                    value={location}
                                                    onChange={(e) => setLocation(e.target.value)}
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="description" className="block text-sm font-bold text-gray-700 mb-2">
                                                    설명 (선택)
                                                </label>
                                                <textarea
                                                    id="description"
                                                    name="description"
                                                    rows={3}
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                                                    placeholder="일정에 대한 상세 설명"
                                                    value={description}
                                                    onChange={(e) => setDescription(e.target.value)}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                                    색상 (중요도)
                                                </label>
                                                <div className="grid grid-cols-5 gap-2">
                                                    {colorOptions.map((option) => (
                                                        <button
                                                            key={option.value}
                                                            type="button"
                                                            onClick={() => setColor(option.value)}
                                                            className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                                                                color === option.value
                                                                    ? 'border-primary-600 bg-primary-50'
                                                                    : 'border-gray-200 hover:border-gray-300'
                                                            }`}
                                                        >
                                                            <div className={`w-8 h-8 rounded-full ${option.class}`} />
                                                            <span className="text-xs font-bold text-gray-700">{option.label}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                                <button
                                                    type="submit"
                                                    disabled={isLoading}
                                                    className="inline-flex w-full justify-center rounded-xl bg-primary-600 px-3 py-2 text-sm font-bold text-white shadow-sm hover:bg-primary-500 sm:ml-3 sm:w-auto disabled:bg-gray-300"
                                                >
                                                    {isLoading ? '추가 중...' : '일정 추가'}
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

