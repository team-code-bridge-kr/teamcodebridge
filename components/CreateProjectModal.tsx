'use client'

import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon, FolderPlusIcon } from '@heroicons/react/24/outline'

interface CreateProjectModalProps {
    isOpen: boolean
    onClose: () => void
    onProjectCreated: () => void
}

export default function CreateProjectModal({ isOpen, onClose, onProjectCreated }: CreateProjectModalProps) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title.trim()) return

        setIsLoading(true)
        try {
            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    description,
                }),
            })

            if (response.ok) {
                setTitle('')
                setDescription('')
                onProjectCreated()
                onClose()
            } else {
                console.error('Failed to create project')
            }
        } catch (error) {
            console.error('Error creating project:', error)
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
                                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <FolderPlusIcon className="h-6 w-6 text-blue-600" aria-hidden="true" />
                                    </div>
                                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                                        <Dialog.Title as="h3" className="text-xl font-bold leading-6 text-gray-900">
                                            새 프로젝트 생성
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                새로운 프로젝트를 생성합니다. 프로젝트 이름과 설명을 입력해주세요.
                                            </p>
                                        </div>
                                        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                                            <div>
                                                <label htmlFor="title" className="block text-sm font-bold text-gray-700">
                                                    프로젝트 이름
                                                </label>
                                                <div className="mt-1">
                                                    <input
                                                        type="text"
                                                        name="title"
                                                        id="title"
                                                        required
                                                        className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                        placeholder="예: 2026 웹사이트 리뉴얼"
                                                        value={title}
                                                        onChange={(e) => setTitle(e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label htmlFor="description" className="block text-sm font-bold text-gray-700">
                                                    설명 (선택)
                                                </label>
                                                <div className="mt-1">
                                                    <textarea
                                                        id="description"
                                                        name="description"
                                                        rows={3}
                                                        className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                        placeholder="프로젝트에 대한 간단한 설명을 입력하세요."
                                                        value={description}
                                                        onChange={(e) => setDescription(e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                                <button
                                                    type="submit"
                                                    disabled={isLoading || !title.trim()}
                                                    className="inline-flex w-full justify-center rounded-xl bg-blue-600 px-3 py-2 text-sm font-bold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto disabled:bg-gray-300"
                                                >
                                                    {isLoading ? '생성 중...' : '프로젝트 생성'}
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
