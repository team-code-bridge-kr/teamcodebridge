'use client'

import { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon, CheckCircleIcon, PlayIcon, PauseIcon } from '@heroicons/react/24/outline'

type SidebarMode = 'IDLE' | 'IGNITION' | 'CLEAR'

interface ContextCapsule {
    id: string
    taskId: string
    mission: string | null
    risks: string | null
    lastStableState: string | null
    openLoops: string | null
    nextAction: string | null
}

interface ContextSidebarProps {
    isOpen: boolean
    onClose: () => void
    mode: SidebarMode
    taskId: string | null
    taskTitle: string
    initialCapsule: ContextCapsule | null
    onIgnite: (data: { risks: string }) => Promise<void>
    onClear: (data: { lastStableState: string, openLoops: string, nextAction: string }) => Promise<void>
    onComplete: (data: { lastStableState: string, openLoops: string, nextAction: string }) => Promise<void>
}

export default function ContextSidebar({
    isOpen,
    onClose,
    mode,
    taskId,
    taskTitle,
    initialCapsule,
    onIgnite,
    onClear,
    onComplete
}: ContextSidebarProps) {
    const [mission, setMission] = useState('')
    const [risks, setRisks] = useState('')
    const [lastStableState, setLastStableState] = useState('')
    const [openLoops, setOpenLoops] = useState('')
    const [nextAction, setNextAction] = useState('')
    const [isUnderstandChecked, setIsUnderstandChecked] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (initialCapsule) {
            setMission(initialCapsule.mission || '')
            setRisks(initialCapsule.risks || '')
            setLastStableState(initialCapsule.lastStableState || '')
            setOpenLoops(initialCapsule.openLoops || '')
            setNextAction(initialCapsule.nextAction || '')
        } else {
            // Reset fields if no capsule (fresh start)
            setMission('')
            setRisks('')
            setLastStableState('')
            setOpenLoops('')
            setNextAction('')
        }
        setIsUnderstandChecked(false)
    }, [initialCapsule, taskId])

    const handleIgnite = async () => {
        if (!isUnderstandChecked) return
        setIsLoading(true)
        try {
            await onIgnite({ risks })
            onClose()
        } finally {
            setIsLoading(false)
        }
    }

    const handleClear = async () => {
        setIsLoading(true)
        try {
            await onClear({ lastStableState, openLoops, nextAction })
            onClose()
        } finally {
            setIsLoading(false)
        }
    }

    const handleComplete = async () => {
        if (!confirm('정말 이 업무를 완료 처리하시겠습니까?')) return
        setIsLoading(true)
        try {
            await onComplete({ lastStableState, openLoops, nextAction })
            onClose()
        } finally {
            setIsLoading(false)
        }
    }

    const isIgnitionParamsValid = isUnderstandChecked
    const isClearParamsValid = lastStableState.length > 5 && nextAction.length > 5

    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <div className="fixed inset-0" />

                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                            <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-in-out duration-500 sm:duration-700"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-500 sm:duration-700"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                                    <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                                        <div className={`px-4 py-6 sm:px-6 ${mode === 'IGNITION' ? 'bg-primary-600' : 'bg-gray-800'}`}>
                                            <div className="flex items-start justify-between">
                                                <Dialog.Title className="text-lg font-black text-white">
                                                    {mode === 'IGNITION' ? '🔥 Context Ignition' : '🧊 Context Clear'}
                                                </Dialog.Title>
                                                <div className="ml-3 flex h-7 items-center">
                                                    <button
                                                        type="button"
                                                        className="rounded-md text-white hover:text-gray-200 focus:outline-none"
                                                        onClick={onClose}
                                                    >
                                                        <span className="sr-only">Close panel</span>
                                                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="mt-1">
                                                <p className="text-sm text-opacity-80 text-white">
                                                    {mode === 'IGNITION' 
                                                        ? '업무를 시작하기 전, 목표를 명확히 하고 집중력을 예열하세요.' 
                                                        : '업무를 중단하거나 전환할 때, 현재 상태를 저장하여 쉽게 복귀하세요.'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="relative mt-6 flex-1 px-4 sm:px-6 space-y-8">
                                            {/* Mission Display (Ignition) */}
                                            {mode === 'IGNITION' && (
                                                <div className="space-y-4">
                                                    <div className="bg-primary-50 p-4 rounded-xl border border-primary-100">
                                                        <label className="block text-xs font-black text-primary-900 uppercase tracking-wider mb-2">
                                                            🎯 이번 세션 목표 (Mission)
                                                        </label>
                                                        <p className="text-gray-900 font-bold whitespace-pre-wrap">
                                                            {mission || '(목표가 설정되지 않았습니다)'}
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center gap-3 py-2">
                                                        <input
                                                            type="checkbox"
                                                            id="understand"
                                                            checked={isUnderstandChecked}
                                                            onChange={(e) => setIsUnderstandChecked(e.target.checked)}
                                                            className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                                                        />
                                                        <label htmlFor="understand" className="text-sm font-bold text-gray-700 cursor-pointer select-none">
                                                            위 목표를 확인했고, 이해했습니다.
                                                        </label>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-bold text-gray-700 mb-1">
                                                            ⚠️ 예상되는 리스크 / 주의사항
                                                        </label>
                                                        <textarea
                                                            rows={3}
                                                            className="w-full rounded-xl border-gray-200 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                                            placeholder="이 작업을 진행하면서 막힐 수 있는 부분이나 주의할 점을 적어보세요."
                                                            value={risks}
                                                            onChange={(e) => setRisks(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Clear Form (Clear) */}
                                            {mode === 'CLEAR' && (
                                                <div className="space-y-6">
                                                    <div>
                                                        <label className="block text-sm font-bold text-gray-700 mb-1">
                                                            🛑 마지막 안정 상태 (Last Stable State)
                                                        </label>
                                                        <textarea
                                                            rows={3}
                                                            className="w-full rounded-xl border-gray-200 focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                                                            placeholder="어디까지 완료했나요? 코드는 정상 작동하나요?"
                                                            value={lastStableState}
                                                            onChange={(e) => setLastStableState(e.target.value)}
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-bold text-gray-700 mb-1">
                                                            ⛓️ 미해결 이슈 (Open Loops)
                                                        </label>
                                                        <textarea
                                                            rows={2}
                                                            className="w-full rounded-xl border-gray-200 focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                                                            placeholder="해결하지 못한 버그나 고민 중인 로직이 있나요?"
                                                            value={openLoops}
                                                            onChange={(e) => setOpenLoops(e.target.value)}
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-bold text-gray-700 mb-1">
                                                            👉 다음 행동 (Next Action)
                                                        </label>
                                                        <textarea
                                                            rows={2}
                                                            className="w-full rounded-xl border-gray-200 focus:border-gray-500 focus:ring-gray-500 sm:text-sm bg-yellow-50"
                                                            placeholder="다시 돌아왔을 때 가장 먼저 해야 할 일은 무엇인가요?"
                                                            value={nextAction}
                                                            onChange={(e) => setNextAction(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-shrink-0 border-t border-gray-200 px-4 py-6 sm:px-6">
                                            <div className="flex justify-between w-full">
                                                {mode === 'CLEAR' && (
                                                    <button
                                                        type="button"
                                                        disabled={isLoading}
                                                        className="inline-flex justify-center rounded-xl px-4 py-2 text-sm font-bold text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                                        onClick={handleComplete}
                                                    >
                                                        <CheckCircleIcon className="w-5 h-5 mr-1" />
                                                        업무 완료
                                                    </button>
                                                )}
                                                <div className="flex gap-3 ml-auto">
                                                    <button
                                                        type="button"
                                                        className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                                                        onClick={onClose}
                                                    >
                                                        취소
                                                    </button>
                                                    <button
                                                        type="button"
                                                        disabled={isLoading || (mode === 'IGNITION' ? !isIgnitionParamsValid : !isClearParamsValid)}
                                                        className={`inline-flex justify-center rounded-xl px-4 py-2 text-sm font-bold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 w-full sm:w-auto ${
                                                            mode === 'IGNITION' 
                                                                ? 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 disabled:bg-primary-300' 
                                                                : 'bg-gray-800 hover:bg-gray-900 focus:ring-gray-500 disabled:bg-gray-400'
                                                        }`}
                                                        onClick={mode === 'IGNITION' ? handleIgnite : handleClear}
                                                    >
                                                        {isLoading ? '처리 중...' : mode === 'IGNITION' ? '🔥 작업 시작 (Ignite)' : '💾 상태 저장 (Save & Switch)'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}
