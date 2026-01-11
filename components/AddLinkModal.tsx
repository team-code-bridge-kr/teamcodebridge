'use client'

import { Fragment, useState } from 'react'
import { Dialog, Transition, Listbox } from '@headlessui/react'
import {
    XMarkIcon,
    ChevronUpDownIcon,
    CheckIcon,
    DocumentTextIcon,
    PaintBrushIcon,
    CodeBracketIcon,
    ChartBarIcon,
    ArrowUpIcon,
    NoSymbolIcon,
    LinkIcon,
} from '@heroicons/react/24/outline'

const linkTypes = [
    { value: 'SPEC', label: '기획서/명세서', icon: DocumentTextIcon },
    { value: 'DESIGN', label: '디자인 문서', icon: PaintBrushIcon },
    { value: 'CODE', label: '코드 참조', icon: CodeBracketIcon },
    { value: 'DATA', label: '데이터/대시보드', icon: ChartBarIcon },
    { value: 'PARENT', label: '상위 업무', icon: ArrowUpIcon },
    { value: 'BLOCKER', label: '차단 의존성', icon: NoSymbolIcon },
    { value: 'RELATED', label: '연관 참조', icon: LinkIcon },
]

interface AddLinkModalProps {
    isOpen: boolean
    onClose: () => void
    taskId: string
    onLinkAdded: () => void
}

export default function AddLinkModal({
    isOpen,
    onClose,
    taskId,
    onLinkAdded,
}: AddLinkModalProps) {
    const [selectedType, setSelectedType] = useState(linkTypes[0])
    const [url, setUrl] = useState('')
    const [label, setLabel] = useState('')
    const [isRequired, setIsRequired] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!url.trim()) {
            setError('URL을 입력해주세요.')
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch(`/api/tasks/${taskId}/links`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    linkType: selectedType.value,
                    url: url.trim(),
                    label: label.trim() || undefined,
                    isRequired,
                }),
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || '링크 추가에 실패했습니다.')
            }

            // Reset form
            setUrl('')
            setLabel('')
            setIsRequired(false)
            setSelectedType(linkTypes[0])
            
            onLinkAdded()
            onClose()
        } catch (err) {
            setError(err instanceof Error ? err.message : '오류가 발생했습니다.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleClose = () => {
        setError(null)
        onClose()
    }

    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={handleClose}>
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
                                <form onSubmit={handleSubmit}>
                                    {/* Header */}
                                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                                        <div className="flex items-center justify-between">
                                            <Dialog.Title className="text-lg font-black text-gray-900">
                                                문서 링크 추가
                                            </Dialog.Title>
                                            <button
                                                type="button"
                                                onClick={handleClose}
                                                className="rounded-lg p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                                            >
                                                <XMarkIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="px-6 py-6 space-y-5">
                                        {/* Link Type Selector */}
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                링크 유형 *
                                            </label>
                                            <Listbox value={selectedType} onChange={setSelectedType}>
                                                <div className="relative">
                                                    <Listbox.Button className="relative w-full cursor-pointer rounded-xl bg-white py-3 pl-4 pr-10 text-left border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                                                        <span className="flex items-center gap-3">
                                                            <selectedType.icon className="w-5 h-5 text-gray-400" />
                                                            <span className="block truncate font-bold">{selectedType.label}</span>
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
                                                            {linkTypes.map((type) => (
                                                                <Listbox.Option
                                                                    key={type.value}
                                                                    value={type}
                                                                    className={({ active }) =>
                                                                        `relative cursor-pointer select-none py-3 pl-4 pr-9 ${
                                                                            active ? 'bg-primary-50 text-primary-900' : 'text-gray-900'
                                                                        }`
                                                                    }
                                                                >
                                                                    {({ selected }) => (
                                                                        <>
                                                                            <span className="flex items-center gap-3">
                                                                                <type.icon className="w-5 h-5 text-gray-400" />
                                                                                <span className={`block truncate ${selected ? 'font-bold' : 'font-medium'}`}>
                                                                                    {type.label}
                                                                                </span>
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
                                        </div>

                                        {/* URL Input */}
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                URL *
                                            </label>
                                            <input
                                                type="url"
                                                value={url}
                                                onChange={(e) => setUrl(e.target.value)}
                                                placeholder="https://notion.so/... 또는 https://github.com/..."
                                                className="w-full rounded-xl border-gray-200 py-3 px-4 focus:border-primary-500 focus:ring-primary-500 text-sm"
                                                required
                                            />
                                        </div>

                                        {/* Label Input */}
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                라벨 (선택)
                                            </label>
                                            <input
                                                type="text"
                                                value={label}
                                                onChange={(e) => setLabel(e.target.value)}
                                                placeholder="예: API 스펙 v2, 메인 페이지 디자인"
                                                className="w-full rounded-xl border-gray-200 py-3 px-4 focus:border-primary-500 focus:ring-primary-500 text-sm"
                                            />
                                        </div>

                                        {/* Required Toggle */}
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                id="isRequired"
                                                checked={isRequired}
                                                onChange={(e) => setIsRequired(e.target.checked)}
                                                className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                                            />
                                            <label htmlFor="isRequired" className="text-sm font-bold text-gray-700 cursor-pointer">
                                                필수 문서로 지정 (작업자가 반드시 확인해야 함)
                                            </label>
                                        </div>

                                        {/* Error Message */}
                                        {error && (
                                            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                                                {error}
                                            </div>
                                        )}
                                    </div>

                                    {/* Footer */}
                                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={handleClose}
                                            className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors"
                                        >
                                            취소
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="px-6 py-2 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors disabled:opacity-50"
                                        >
                                            {isLoading ? '추가 중...' : '링크 추가'}
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}
