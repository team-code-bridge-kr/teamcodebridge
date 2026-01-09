'use client'

import { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon, BookmarkIcon, CloudArrowUpIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline'
import { useSession } from 'next-auth/react'
import { uploadToDrive, validateFile, formatFileSize, getFileExtension } from '@/lib/googleDrive'

interface CreateMaterialModalProps {
    isOpen: boolean
    onClose: () => void
    curriculums: { id: string; name: string }[]
    onMaterialCreated: () => void
}

const FILE_TYPES = [
    { value: 'PDF', label: 'PDF 문서', icon: '📄' },
    { value: 'ZIP', label: 'ZIP 압축파일', icon: '📦' },
    { value: 'PPT', label: 'PowerPoint', icon: '📊' },
    { value: 'PPTX', label: 'PowerPoint (신규)', icon: '📊' },
    { value: 'DOCX', label: 'Word 문서', icon: '📝' },
    { value: 'XLSX', label: 'Excel 스프레드시트', icon: '📈' },
    { value: 'MP4', label: '동영상 (MP4)', icon: '🎥' },
    { value: 'MP3', label: '오디오 (MP3)', icon: '🎵' },
    { value: 'PNG', label: '이미지 (PNG)', icon: '🖼️' },
    { value: 'JPG', label: '이미지 (JPG)', icon: '🖼️' },
    { value: 'HTML', label: 'HTML 웹페이지', icon: '🌐' },
    { value: 'TXT', label: '텍스트 파일', icon: '📃' },
    { value: 'ETC', label: '기타', icon: '📎' },
]

const STORAGE_KEY = 'material_draft'

export default function CreateMaterialModal({ isOpen, onClose, curriculums, onMaterialCreated }: CreateMaterialModalProps) {
    const { data: session } = useSession()
    const [isSaving, setIsSaving] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        fileType: 'PDF',
        driveUrl: '',
        fileSize: '',
        curriculumId: ''
    })

    // 중간저장 데이터 로드
    useEffect(() => {
        if (isOpen) {
            const saved = localStorage.getItem(STORAGE_KEY)
            if (saved) {
                try {
                    const parsed = JSON.parse(saved)
                    setFormData(parsed)
                } catch (error) {
                    console.error('Failed to load draft:', error)
                }
            }
        }
    }, [isOpen])

    // 자동 중간저장 (5초마다)
    useEffect(() => {
        if (!isOpen) return
        
        const interval = setInterval(() => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(formData))
        }, 5000)

        return () => clearInterval(interval)
    }, [formData, isOpen])

    const handleSaveDraft = () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(formData))
        alert('임시 저장되었습니다!')
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // 파일 유효성 검증
        const validation = validateFile(file)
        if (!validation.valid) {
            alert(validation.error)
            e.target.value = '' // 입력 초기화
            return
        }

        setSelectedFile(file)
        
        // 파일 정보 자동 입력
        if (!formData.name) {
            setFormData(prev => ({
                ...prev,
                name: file.name
            }))
        }
        
        const extension = getFileExtension(file.name)
        setFormData(prev => ({
            ...prev,
            fileType: extension,
            fileSize: formatFileSize(file.size)
        }))
    }

    const handleUploadFile = async () => {
        if (!selectedFile) {
            alert('파일을 선택해주세요.')
            return
        }

        if (!session?.accessToken) {
            alert('로그인이 필요합니다. 다시 로그인해주세요.')
            return
        }

        setIsUploading(true)
        setUploadProgress(0)

        try {
            // 업로드 진행률 시뮬레이션 (실제 진행률 추적은 복잡함)
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => Math.min(prev + 10, 90))
            }, 200)

            const folderId = process.env.NEXT_PUBLIC_DRIVE_FOLDER_ID || ''
            const uploadedFile = await uploadToDrive(
                selectedFile,
                session.accessToken,
                folderId
            )

            clearInterval(progressInterval)
            setUploadProgress(100)

            // 업로드된 파일 정보를 폼에 자동 입력
            setFormData(prev => ({
                ...prev,
                driveUrl: uploadedFile.webViewLink
            }))

            alert('파일이 성공적으로 업로드되었습니다! 🎉')
            setSelectedFile(null)
        } catch (error) {
            console.error('Upload failed:', error)
            alert(error instanceof Error ? error.message : '파일 업로드에 실패했습니다.')
        } finally {
            setIsUploading(false)
            setUploadProgress(0)
        }
    }

    const handleSubmit = async () => {
        if (!formData.name.trim()) {
            alert('교재 이름을 입력해주세요.')
            return
        }
        if (!formData.description.trim()) {
            alert('교재 설명을 입력해주세요.')
            return
        }
        if (!formData.driveUrl.trim()) {
            alert('구글 드라이브 링크를 입력해주세요.')
            return
        }
        if (!formData.curriculumId) {
            alert('커리큘럼을 선택해주세요.')
            return
        }

        setIsSaving(true)
        try {
            const response = await fetch('/api/materials', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (!response.ok) throw new Error('Failed to create material')

            localStorage.removeItem(STORAGE_KEY)
            alert('교재가 성공적으로 업로드되었습니다! 📚')
            onMaterialCreated()
            handleClose()
        } catch (error) {
            console.error('Failed to create material:', error)
            alert('교재 업로드에 실패했습니다. 다시 시도해주세요.')
        } finally {
            setIsSaving(false)
        }
    }

    const handleClose = () => {
        setFormData({
            name: '',
            description: '',
            fileType: 'PDF',
            driveUrl: '',
            fileSize: '',
            curriculumId: ''
        })
        onClose()
    }

    return (
        <Transition appear show={isOpen} as={Fragment}>
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
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all">
                                {/* Header */}
                                <div className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6">
                                    <div className="flex items-center justify-between">
                                        <Dialog.Title className="text-2xl font-black text-gray-900">
                                            새 교재 업로드
                                        </Dialog.Title>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={handleSaveDraft}
                                                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-600 hover:text-blue-600 hover:bg-white rounded-xl transition-all"
                                            >
                                                <BookmarkIcon className="w-4 h-4" />
                                                임시저장
                                            </button>
                                            <button
                                                onClick={handleClose}
                                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-xl transition-all"
                                            >
                                                <XMarkIcon className="w-6 h-6" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="px-8 py-6 space-y-6 max-h-[60vh] overflow-y-auto">
                                    {/* 커리큘럼 선택 */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            커리큘럼 선택 <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={formData.curriculumId}
                                            onChange={(e) => setFormData({ ...formData, curriculumId: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        >
                                            <option value="">커리큘럼을 선택하세요</option>
                                            {curriculums.map((curriculum) => (
                                                <option key={curriculum.id} value={curriculum.id}>
                                                    {curriculum.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* 교재 이름 */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            교재 이름 <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="예: Python 기초 교재, 웹 개발 실습 자료"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                    </div>

                                    {/* 교재 설명 */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            교재 설명 <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="교재에 대한 간단한 설명을 작성하세요"
                                            rows={4}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                        />
                                    </div>

                                    {/* 파일 형식 */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            파일 형식 <span className="text-red-500">*</span>
                                        </label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {FILE_TYPES.map((type) => (
                                                <button
                                                    key={type.value}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, fileType: type.value })}
                                                    className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                                                        formData.fileType === type.value
                                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    }`}
                                                >
                                                    <span className="text-lg">{type.icon}</span>
                                                    <span>{type.value}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* 파일 용량 */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            파일 용량 (선택)
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.fileSize}
                                            onChange={(e) => setFormData({ ...formData, fileSize: e.target.value })}
                                            placeholder="예: 2.5 MB, 150 KB, 1.2 GB"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                    </div>

                                    {/* 파일 업로드 또는 링크 입력 */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-3">
                                            파일 업로드 또는 링크 입력 <span className="text-red-500">*</span>
                                        </label>
                                        
                                        {/* 파일 업로드 옵션 */}
                                        <div className="bg-blue-50 border-2 border-blue-200 border-dashed rounded-xl p-6 mb-4">
                                            <div className="text-center">
                                                <CloudArrowUpIcon className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                                                <p className="text-sm font-bold text-gray-700 mb-2">
                                                    파일을 직접 업로드하세요
                                                </p>
                                                <p className="text-xs text-gray-500 mb-4">
                                                    최대 100MB | PDF, ZIP, PPT, DOCX, MP4 등
                                                </p>
                                                
                                                <input
                                                    type="file"
                                                    id="file-upload"
                                                    onChange={handleFileSelect}
                                                    className="hidden"
                                                    disabled={isUploading}
                                                />
                                                
                                                {selectedFile ? (
                                                    <div className="bg-white rounded-lg p-4 mb-3">
                                                        <p className="text-sm font-bold text-gray-900 mb-1">
                                                            📎 {selectedFile.name}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {formatFileSize(selectedFile.size)}
                                                        </p>
                                                    </div>
                                                ) : null}
                                                
                                                {!isUploading && !formData.driveUrl ? (
                                                    <label
                                                        htmlFor="file-upload"
                                                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all cursor-pointer"
                                                    >
                                                        <ArrowUpTrayIcon className="w-5 h-5" />
                                                        파일 선택
                                                    </label>
                                                ) : null}
                                                
                                                {selectedFile && !isUploading && !formData.driveUrl ? (
                                                    <button
                                                        type="button"
                                                        onClick={handleUploadFile}
                                                        className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all ml-2"
                                                    >
                                                        <CloudArrowUpIcon className="w-5 h-5" />
                                                        업로드 시작
                                                    </button>
                                                ) : null}
                                                
                                                {isUploading ? (
                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-center gap-2 text-blue-600">
                                                            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                                            <span className="font-bold">업로드 중... {uploadProgress}%</span>
                                                        </div>
                                                        <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-blue-600 transition-all duration-300"
                                                                style={{ width: `${uploadProgress}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                ) : null}
                                                
                                                {formData.driveUrl ? (
                                                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                                        <p className="text-sm font-bold text-green-700">
                                                            ✅ 파일 업로드 완료!
                                                        </p>
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                        
                                        {/* 수동 링크 입력 옵션 */}
                                        <div>
                                            <p className="text-sm font-bold text-gray-600 mb-2">또는 구글 드라이브 링크 직접 입력</p>
                                            <input
                                                type="url"
                                                value={formData.driveUrl}
                                                onChange={(e) => setFormData({ ...formData, driveUrl: e.target.value })}
                                                placeholder="https://drive.google.com/file/d/..."
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                disabled={isUploading}
                                            />
                                            <p className="text-xs text-gray-500 mt-2">
                                                💡 이미 드라이브에 있는 파일의 링크를 붙여넣으세요
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="border-t border-gray-100 bg-gray-50 px-8 py-6">
                                    <div className="flex items-center justify-between">
                                        <button
                                            onClick={handleSaveDraft}
                                            className="px-6 py-3 text-sm text-gray-500 hover:text-blue-600 font-bold transition-colors"
                                        >
                                            임시저장
                                        </button>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={handleClose}
                                                className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all"
                                            >
                                                취소
                                            </button>
                                            <button
                                                onClick={handleSubmit}
                                                disabled={isSaving}
                                                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30"
                                            >
                                                {isSaving ? (
                                                    <>
                                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                        업로드 중...
                                                    </>
                                                ) : (
                                                    <>
                                                        <CloudArrowUpIcon className="w-5 h-5" />
                                                        저장하기
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

