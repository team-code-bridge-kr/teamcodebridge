'use client'

import { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition, Listbox } from '@headlessui/react'
import {
    XMarkIcon,
    ChevronUpDownIcon,
    CheckIcon,
    UserIcon,
} from '@heroicons/react/24/outline'

interface User {
    id: string
    name: string | null
    email: string | null
    image: string | null
}

interface AssigneeModalProps {
    isOpen: boolean
    onClose: () => void
    taskId: string
    taskName: string
    currentOwnerId: string | null
    onAssigned: () => void
}

export default function AssigneeModal({
    isOpen,
    onClose,
    taskId,
    taskName,
    currentOwnerId,
    onAssigned,
}: AssigneeModalProps) {
    const [users, setUsers] = useState<User[]>([])
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isFetching, setIsFetching] = useState(true)

    useEffect(() => {
        if (isOpen) {
            fetchUsers()
        }
    }, [isOpen])

    const fetchUsers = async () => {
        setIsFetching(true)
        try {
            const response = await fetch('/api/users')
            if (response.ok) {
                const data = await response.json()
                setUsers(data)
                // Set current owner as selected
                if (currentOwnerId) {
                    const currentOwner = data.find((u: User) => u.id === currentOwnerId)
                    if (currentOwner) setSelectedUser(currentOwner)
                }
            }
        } catch (error) {
            console.error('Failed to fetch users:', error)
        } finally {
            setIsFetching(false)
        }
    }

    const handleAssign = async () => {
        if (!selectedUser) return
        
        setIsLoading(true)
        try {
            const response = await fetch(`/api/tasks/${taskId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ownerId: selectedUser.id })
            })

            if (response.ok) {
                onAssigned()
                onClose()
            }
        } catch (error) {
            console.error('Failed to assign user:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleUnassign = async () => {
        setIsLoading(true)
        try {
            const response = await fetch(`/api/tasks/${taskId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ownerId: null })
            })

            if (response.ok) {
                setSelectedUser(null)
                onAssigned()
                onClose()
            }
        } catch (error) {
            console.error('Failed to unassign user:', error)
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
                            <Dialog.Panel className="relative transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all w-full max-w-md">
                                {/* Header */}
                                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Dialog.Title className="text-lg font-black text-gray-900">
                                                담당자 지정
                                            </Dialog.Title>
                                            <p className="text-sm text-gray-500 mt-1 truncate max-w-[280px]">
                                                {taskName}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="rounded-lg p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                                        >
                                            <XMarkIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                <div className="px-6 py-6">
                                    {isFetching ? (
                                        <div className="text-center py-8 text-gray-500">
                                            로딩 중...
                                        </div>
                                    ) : (
                                        <Listbox value={selectedUser} onChange={setSelectedUser}>
                                            <div className="relative">
                                                <Listbox.Button className="relative w-full cursor-pointer rounded-xl bg-white py-3 pl-4 pr-10 text-left border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                                                    <span className="flex items-center gap-3">
                                                        {selectedUser ? (
                                                            <>
                                                                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-xs font-black text-primary-600">
                                                                    {selectedUser.name?.[0] || '?'}
                                                                </div>
                                                                <span className="block truncate font-bold">
                                                                    {selectedUser.name || selectedUser.email}
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <UserIcon className="w-5 h-5 text-gray-400" />
                                                                <span className="block truncate text-gray-400">
                                                                    담당자 선택...
                                                                </span>
                                                            </>
                                                        )}
                                                    </span>
                                                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                        <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
                                                    </span>
                                                </Listbox.Button>
                                                <Transition
                                                    as={Fragment}
                                                    leave="transition ease-in duration-100"
                                                    leaveFrom="opacity-100"
                                                    leaveTo="opacity-0"
                                                >
                                                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                        {users.map((user) => (
                                                            <Listbox.Option
                                                                key={user.id}
                                                                value={user}
                                                                className={({ active }) =>
                                                                    `relative cursor-pointer select-none py-3 pl-4 pr-9 ${
                                                                        active ? 'bg-primary-50 text-primary-900' : 'text-gray-900'
                                                                    }`
                                                                }
                                                            >
                                                                {({ selected }) => (
                                                                    <>
                                                                        <span className="flex items-center gap-3">
                                                                            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-xs font-black text-primary-600">
                                                                                {user.name?.[0] || '?'}
                                                                            </div>
                                                                            <div>
                                                                                <span className={`block truncate ${selected ? 'font-bold' : 'font-medium'}`}>
                                                                                    {user.name || '이름 없음'}
                                                                                </span>
                                                                                <span className="text-xs text-gray-500">
                                                                                    {user.email}
                                                                                </span>
                                                                            </div>
                                                                        </span>
                                                                        {selected && (
                                                                            <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-primary-600">
                                                                                <CheckIcon className="h-5 w-5" />
                                                                            </span>
                                                                        )}
                                                                    </>
                                                                )}
                                                            </Listbox.Option>
                                                        ))}
                                                    </Listbox.Options>
                                                </Transition>
                                            </div>
                                        </Listbox>
                                    )}
                                </div>

                                {/* Footer */}
                                <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-between">
                                    {currentOwnerId ? (
                                        <button
                                            type="button"
                                            onClick={handleUnassign}
                                            disabled={isLoading}
                                            className="px-4 py-2 text-sm font-bold text-red-600 hover:text-red-700 transition-colors disabled:opacity-50"
                                        >
                                            담당 해제
                                        </button>
                                    ) : (
                                        <div />
                                    )}
                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors"
                                        >
                                            취소
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleAssign}
                                            disabled={isLoading || !selectedUser}
                                            className="px-6 py-2 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors disabled:opacity-50"
                                        >
                                            {isLoading ? '저장 중...' : '저장'}
                                        </button>
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
