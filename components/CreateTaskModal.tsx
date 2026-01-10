'use client'

import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon, DocumentPlusIcon } from '@heroicons/react/24/outline'

interface CreateTaskModalProps {
    isOpen: boolean
    onClose: () => void
    projects: { id: string; title: string }[]
    currentUserId?: string
    onTaskCreated: () => void
}

export default function CreateTaskModal({ isOpen, onClose, projects, currentUserId, onTaskCreated }: CreateTaskModalProps) {
    const [name, setName] = useState('')
    const [mission, setMission] = useState('')
    const [projectId, setProjectId] = useState(projects[0]?.id || '')
    const [parentId, setParentId] = useState<string>('')  // 상위 업무
    const [dependsOnId, setDependsOnId] = useState<string>('')  // 선행 업무
    const [existingTasks, setExistingTasks] = useState<{ id: string, name: string, depth: number }[]>([])
    const [isLoading, setIsLoading] = useState(false)

    // Ensure projectId is set when projects load
    if (!projectId && projects.length > 0) {
        setProjectId(projects[0].id)
    }

    // 기존 업무 목록 로드 (상위/선행 업무 선택용)
    const loadExistingTasks = async () => {
        try {
            const res = await fetch('/api/kraken')
            if (res.ok) {
                const data = await res.json()
                setExistingTasks(data.map((t: any) => ({ id: t.id, name: t.name, depth: t.depth })))
            }
        } catch (error) {
            console.error('Failed to load tasks:', error)
        }
    }

    // 모달 열릴 때 기존 업무 로드
    if (isOpen && existingTasks.length === 0) {
        loadExistingTasks()
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // 상위 업무의 depth를 기반으로 새 업무 depth 계산
        const parentTask = existingTasks.find(t => t.id === parentId)
        const newDepth = parentTask ? parentTask.depth + 1 : 0

        try {
            await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    mission,
                    projectId,
                    ownerId: currentUserId,
                    status: '대기',
                    priority: '중간',
                    parentId: parentId || null,
                    dependsOnId: dependsOnId || null,
                    depth: newDepth
                })
            })
            setName('')
            setMission('')
            setParentId('')
            setDependsOnId('')
            onTaskCreated()
            onClose()
        } catch (error) {
            console.error('Failed to create task:', error)
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
                                        <span className="sr-only">닫기</span>
                                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                    </button>
                                </div>
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <DocumentPlusIcon className="h-6 w-6 text-primary-600" aria-hidden="true" />
                                    </div>
                                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                                        <Dialog.Title as="h3" className="text-xl font-bold leading-6 text-gray-900">
                                            새 업무 추가
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500 whitespace-pre-line">
                                                업무의 목표(Mission)를 명확히 정의하여{'\n'}작업자가 맥락을 이해하고 시작할 수 있도록 도와주세요.
                                            </p>
                                        </div>
                                        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                                            <div>
                                                <label htmlFor="project" className="block text-sm font-bold text-gray-700">
                                                    프로젝트
                                                </label>
                                                <div className="mt-1">
                                                    <select
                                                        id="project"
                                                        name="project"
                                                        className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-3"
                                                        value={projectId}
                                                        onChange={(e) => setProjectId(e.target.value)}
                                                        required
                                                    >
                                                        {projects.map((p) => (
                                                            <option key={p.id} value={p.id}>
                                                                {p.title}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div>
                                                <label htmlFor="name" className="block text-sm font-bold text-gray-700">
                                                    업무 이름
                                                </label>
                                                <div className="mt-1">
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        id="name"
                                                        required
                                                        className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                                        placeholder="예: 로그인 API 리팩토링"
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label htmlFor="mission" className="block text-sm font-bold text-gray-700">
                                                    🎯 Mission (초기 목표)
                                                </label>
                                                <div className="mt-1">
                                                    <textarea
                                                        id="mission"
                                                        name="mission"
                                                        rows={3}
                                                        required
                                                        className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                                        placeholder="이 업무를 통해 달성하고자 하는 핵심 목표는 무엇인가요?"
                                                        value={mission}
                                                        onChange={(e) => setMission(e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            {/* 크라켄 설정 섹션 */}
                                            <div className="pt-4 border-t border-gray-100">
                                                <p className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                                                    🐙 크라켄 설정 <span className="text-xs font-normal text-gray-400">(선택사항)</span>
                                                </p>

                                                <div className="space-y-3">
                                                    <div>
                                                        <label htmlFor="parentId" className="block text-xs font-bold text-gray-600">
                                                            상위 업무
                                                        </label>
                                                        <select
                                                            id="parentId"
                                                            name="parentId"
                                                            className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm py-2"
                                                            value={parentId}
                                                            onChange={(e) => setParentId(e.target.value)}
                                                        >
                                                            <option value="">없음 (최상위 업무)</option>
                                                            {existingTasks.map((t) => (
                                                                <option key={t.id} value={t.id}>
                                                                    {'　'.repeat(t.depth)}{t.depth > 0 ? '└ ' : ''}{t.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <label htmlFor="dependsOnId" className="block text-xs font-bold text-gray-600">
                                                            선행 업무 <span className="text-xs font-normal text-gray-400">(이 업무가 완료되어야 시작 가능)</span>
                                                        </label>
                                                        <select
                                                            id="dependsOnId"
                                                            name="dependsOnId"
                                                            className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm py-2"
                                                            value={dependsOnId}
                                                            onChange={(e) => setDependsOnId(e.target.value)}
                                                        >
                                                            <option value="">없음</option>
                                                            {existingTasks.map((t) => (
                                                                <option key={t.id} value={t.id}>
                                                                    {t.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                                <button
                                                    type="submit"
                                                    disabled={isLoading}
                                                    className="inline-flex w-full justify-center rounded-xl bg-primary-600 px-3 py-2 text-sm font-bold text-white shadow-sm hover:bg-primary-500 sm:ml-3 sm:w-auto disabled:bg-gray-300"
                                                >
                                                    {isLoading ? '추가 중...' : '업무 추가'}
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
