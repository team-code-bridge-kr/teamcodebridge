'use client'

import { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import {
    XMarkIcon,
    DocumentTextIcon,
    PaintBrushIcon,
    CodeBracketIcon,
    ChartBarIcon,
    ArrowUpIcon,
    NoSymbolIcon,
    LinkIcon,
    PlusIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'

// Link type configuration
const linkTypeConfig: Record<string, { icon: React.ComponentType<{ className?: string }>, label: string, color: string }> = {
    SPEC: { icon: DocumentTextIcon, label: '기획서', color: 'text-blue-600 bg-blue-50' },
    DESIGN: { icon: PaintBrushIcon, label: '디자인', color: 'text-purple-600 bg-purple-50' },
    CODE: { icon: CodeBracketIcon, label: '코드', color: 'text-green-600 bg-green-50' },
    DATA: { icon: ChartBarIcon, label: '데이터', color: 'text-orange-600 bg-orange-50' },
    PARENT: { icon: ArrowUpIcon, label: '상위 업무', color: 'text-gray-600 bg-gray-50' },
    BLOCKER: { icon: NoSymbolIcon, label: '차단', color: 'text-red-600 bg-red-50' },
    RELATED: { icon: LinkIcon, label: '연관', color: 'text-gray-500 bg-gray-50' },
}

interface TaskLink {
    id: string
    linkType: string
    url?: string
    repoPath?: string
    artifactId?: string
    label?: string
    isRequired: boolean
}

interface ContextCapsule {
    id: string
    taskId: string
    mission: string | null
    risks: string | null
    lastStableState: string | null
    openLoops: string | null
    nextAction: string | null
}

interface ParentTask {
    id: string
    name: string
    context?: ContextCapsule | null
}

interface TaskPageProps {
    isOpen: boolean
    onClose: () => void
    task: {
        id: string
        name: string
        status: string
        priority: string
        links: TaskLink[]
        context?: ContextCapsule | null
        parent?: ParentTask | null
    } | null
    onIgnite: () => void
    onClear: () => void
    onAddLink: () => void
}

export default function UnifiedTaskPage({
    isOpen,
    onClose,
    task,
    onIgnite,
    onClear,
    onAddLink,
}: TaskPageProps) {
    if (!task) return null

    const requiredLinks = task.links.filter(l => l.isRequired)
    const relatedLinks = task.links.filter(l => !l.isRequired)
    const isInProgress = task.status === 'IN_PROGRESS' || task.status === '진행 중'
    const hasCSBState = task.context?.lastStableState || task.context?.nextAction

    const getLinkUrl = (link: TaskLink) => {
        if (link.url) return link.url
        if (link.repoPath) return `https://github.com/${link.repoPath}`
        return '#'
    }

    const renderLink = (link: TaskLink) => {
        const config = linkTypeConfig[link.linkType] || linkTypeConfig.RELATED
        const Icon = config.icon

        return (
            <a
                key={link.id}
                href={getLinkUrl(link)}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all group ${config.color}`}
            >
                <div className={`p-2 rounded-lg ${config.color}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 truncate">
                        {link.label || link.url || link.repoPath || '링크'}
                    </p>
                    <p className="text-xs text-gray-500">{config.label}</p>
                </div>
                {link.isRequired && (
                    <span className="px-2 py-1 text-xs font-bold text-red-600 bg-red-50 rounded-full">
                        필수
                    </span>
                )}
            </a>
        )
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
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all w-full max-w-2xl">
                                {/* Header */}
                                <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-5">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <Dialog.Title className="text-xl font-black text-white">
                                                {task.name}
                                            </Dialog.Title>
                                            <p className="mt-1 text-sm text-primary-100">
                                                업무 상세 정보 및 컨텍스트
                                            </p>
                                        </div>
                                        <button
                                            onClick={onClose}
                                            className="rounded-lg p-2 text-primary-100 hover:text-white hover:bg-primary-500 transition-colors"
                                        >
                                            <XMarkIcon className="w-6 h-6" />
                                        </button>
                                    </div>
                                </div>

                                <div className="px-6 py-6 space-y-6 max-h-[70vh] overflow-y-auto">
                                    {/* Parent Context (if subtask) */}
                                    {task.parent && (
                                        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                                            <div className="flex items-center gap-2 mb-2">
                                                <ArrowUpIcon className="w-4 h-4 text-gray-500" />
                                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                    상위 업무
                                                </span>
                                            </div>
                                            <p className="font-bold text-gray-900">{task.parent.name}</p>
                                            {task.parent.context?.mission && (
                                                <p className="mt-2 text-sm text-gray-600">
                                                    {task.parent.context.mission}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* Mission Statement */}
                                    {task.context?.mission && (
                                        <div className="bg-primary-50 rounded-2xl p-4 border border-primary-100">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-lg">🎯</span>
                                                <span className="text-xs font-bold text-primary-700 uppercase tracking-wider">
                                                    이번 세션 목표 (Mission)
                                                </span>
                                            </div>
                                            <p className="font-bold text-gray-900 whitespace-pre-wrap">
                                                {task.context.mission}
                                            </p>
                                        </div>
                                    )}

                                    {/* Required Links Section */}
                                    {requiredLinks.length > 0 && (
                                        <div>
                                            <div className="flex items-center gap-2 mb-3">
                                                <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
                                                <h3 className="font-black text-gray-900">필수 문서</h3>
                                                <span className="text-xs text-gray-500">
                                                    (작업 전 반드시 확인)
                                                </span>
                                            </div>
                                            <div className="space-y-2">
                                                {requiredLinks.map(renderLink)}
                                            </div>
                                        </div>
                                    )}

                                    {/* Related Links Section */}
                                    {relatedLinks.length > 0 && (
                                        <div>
                                            <div className="flex items-center gap-2 mb-3">
                                                <LinkIcon className="w-5 h-5 text-gray-400" />
                                                <h3 className="font-black text-gray-900">관련 문서</h3>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                {relatedLinks.map(renderLink)}
                                            </div>
                                        </div>
                                    )}

                                    {/* Add Link Button */}
                                    <button
                                        onClick={onAddLink}
                                        className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-primary-300 hover:text-primary-600 transition-colors"
                                    >
                                        <PlusIcon className="w-5 h-5" />
                                        <span className="font-bold">문서 링크 추가</span>
                                    </button>

                                    {/* CSB State (if resuming) */}
                                    {hasCSBState && (
                                        <div className="bg-yellow-50 rounded-2xl p-4 border border-yellow-100">
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="text-lg">💡</span>
                                                <span className="text-xs font-bold text-yellow-700 uppercase tracking-wider">
                                                    이전 작업 상태 (Resume Context)
                                                </span>
                                            </div>
                                            
                                            {task.context?.lastStableState && (
                                                <div className="mb-3">
                                                    <p className="text-xs font-bold text-gray-500 mb-1">마지막 안정 상태</p>
                                                    <p className="text-sm text-gray-700">{task.context.lastStableState}</p>
                                                </div>
                                            )}
                                            
                                            {task.context?.openLoops && (
                                                <div className="mb-3">
                                                    <p className="text-xs font-bold text-gray-500 mb-1">미해결 이슈</p>
                                                    <p className="text-sm text-gray-700">{task.context.openLoops}</p>
                                                </div>
                                            )}
                                            
                                            {task.context?.nextAction && (
                                                <div className="bg-yellow-100 rounded-xl p-3">
                                                    <p className="text-xs font-bold text-yellow-800 mb-1">👉 다음 행동</p>
                                                    <p className="font-bold text-yellow-900">{task.context.nextAction}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Footer Actions */}
                                <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t border-gray-100">
                                    <button
                                        onClick={onClose}
                                        className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors"
                                    >
                                        닫기
                                    </button>
                                    
                                    <div className="flex gap-3">
                                        {isInProgress ? (
                                            <>
                                                <button
                                                    onClick={onClear}
                                                    className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-xl font-bold hover:bg-gray-900 transition-colors shadow-lg"
                                                >
                                                    🧊 작업 정리 (Clear)
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={onIgnite}
                                                className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/20"
                                            >
                                                🔥 작업 시작 (Ignite)
                                            </button>
                                        )}
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
